import * as vscode from 'vscode';
import type { ModelStats } from './statusBar';

/**
 * Callbacks that the orchestrator invokes during a parse cycle.
 * All are optional — the orchestrator continues even if any throws.
 */
export interface ParseOrchestratorCallbacks {
    /** Show the "Parsing …" progress indicator. */
    showProgress?(fileName: string): void;
    /** Hide the progress indicator. */
    hideProgress?(): void;

    /**
     * Load the document into the Model Explorer.
     * The orchestrator passes its own CancellationToken so the
     * explorer can bail out early.
     */
    loadModelExplorer?(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<void>;
    /** Reveal the active document in workspace mode. */
    revealInWorkspaceExplorer?(uri: vscode.Uri): Promise<void>;
    /** Is the model explorer currently in workspace mode? */
    isWorkspaceMode?(): boolean;

    /** Return the latest parse stats from the model explorer. */
    getLastStats?(): ModelStats | undefined;

    /** Update the status-bar metrics display. */
    updateMetrics?(stats: ModelStats, uri: vscode.Uri): void;

    /** Fetch and display LSP server health info. */
    updateServerStats?(): Promise<void>;

    /** Push resolved types to Feature Inspector / Feature Explorer. */
    pushResolvedTypes?(uri: string, token: vscode.CancellationToken): Promise<void>;

    /** Notify the visualization panel that the file changed. */
    notifyVisualization?(uri: vscode.Uri): void;

    /** Log a message to the output channel. */
    log?(message: string): void;
}

/**
 * Describes an open SysML editor that `notifyServerParseDone` can
 * re-parse.  Abstracted so tests don't need real `vscode.TextEditor`.
 */
export interface SysMLEditorInfo {
    uri: string;
    document: vscode.TextDocument;
}

/**
 * Adapter for querying visible editors and the active editor.
 * Injected to decouple from the real `vscode.window` API.
 */
export interface EditorProvider {
    /** Return all visible SysML editors (open, not closed). */
    getVisibleSysMLEditors(): SysMLEditorInfo[];
    /** Return the active SysML editor, if any. */
    getActiveSysMLEditor(): SysMLEditorInfo | undefined;
}

/**
 * Orchestrates the parse-on-open / parse-on-edit / parse-on-server-done
 * lifecycle for SysML documents.
 *
 * Extracted from `extension.ts` so the debounce, cancellation, and
 * cooldown logic can be unit-tested without a live VS Code instance.
 */
export class ParseOrchestrator {
    private _debounceTimer: ReturnType<typeof setTimeout> | undefined;
    private _activeCancel: vscode.CancellationTokenSource | undefined;
    private _parseDoneTimer: ReturnType<typeof setTimeout> | undefined;
    private _lastParseDoneReparse = 0;

    /** Debounce delay in ms — overridable for tests. */
    debounceMs = 300;
    /** `notifyServerParseDone` debounce in ms. */
    parseDoneDebounceMs = 300;
    /** Cooldown window in ms after a re-parse from parseDone. */
    parseDoneCooldownMs = 1500;

    constructor(
        private readonly cb: ParseOrchestratorCallbacks,
        private readonly editors: EditorProvider,
    ) {}

    // ── Public state (read-only for guards / tests) ──────────

    /** True when a debounce timer is pending. */
    get isDebouncing(): boolean { return this._debounceTimer !== undefined; }
    /** True when an async parse is in-flight. */
    get isParsing(): boolean { return this._activeCancel !== undefined; }

    // ── Core API ─────────────────────────────────────────────

    /**
     * Request a parse for `document`.  Debounced — rapid calls
     * cancel previous pending/in-flight parses.
     */
    requestParse(document: vscode.TextDocument, options?: { skipProgress?: boolean }): void {
        // Cancel anything pending or in-flight
        this._clearDebounce();
        this._cancelActiveParse();

        const fileName = document.fileName.split('/').pop() || 'file';
        if (!options?.skipProgress) {
            this.cb.showProgress?.(fileName);
        }

        const cancelSource = new vscode.CancellationTokenSource();
        this._activeCancel = cancelSource;

        this._debounceTimer = setTimeout(async () => {
            this._debounceTimer = undefined;

            if (cancelSource.token.isCancellationRequested || document.isClosed) {
                return;
            }

            try {
                // --- Model explorer ---
                const fname = document.fileName.split('/').pop() || 'file';
                this.cb.log?.(`parseSysMLDocument: loading ${fname} (LSP)`);
                try {
                    if (this.cb.isWorkspaceMode?.()) {
                        await this.cb.revealInWorkspaceExplorer?.(document.uri);
                    } else {
                        await this.cb.loadModelExplorer?.(document, cancelSource.token);
                    }
                } catch {
                    // Non-critical
                }

                this.cb.hideProgress?.();

                // --- Status-bar metrics ---
                const stats = this.cb.getLastStats?.();
                if (stats) {
                    try { await this.cb.updateServerStats?.(); } catch { /* non-critical */ }
                    this.cb.updateMetrics?.(stats, document.uri);
                }

                if (cancelSource.token.isCancellationRequested || document.isClosed) {
                    this.cb.log?.('parseSysMLDocument: cancelled after model explorer update');
                    return;
                }

                // --- Feature inspector / explorer ---
                try {
                    await this.cb.pushResolvedTypes?.(document.uri.toString(), cancelSource.token);
                } catch { /* non-critical */ }

                if (cancelSource.token.isCancellationRequested || document.isClosed) {
                    return;
                }

                // --- Visualization ---
                this.cb.notifyVisualization?.(document.uri);
            } finally {
                if (this._activeCancel === cancelSource) {
                    this._activeCancel = undefined;
                }
                cancelSource.dispose();
                this.cb.hideProgress?.();
            }
        }, this.debounceMs);
    }

    /**
     * Called when the LSP server finishes parsing a file.
     * Conditionally re-triggers a parse if the explorer has no data yet.
     */
    notifyServerParseDone(uri?: string): void {
        if (this._parseDoneTimer) {
            globalThis.clearTimeout(this._parseDoneTimer);
        }
        this._parseDoneTimer = globalThis.setTimeout(() => {
            this._parseDoneTimer = undefined;

            const allEditors = this.editors.getVisibleSysMLEditors();
            let target: SysMLEditorInfo | undefined;
            if (uri) {
                target = allEditors.find(e => e.uri === uri);
            }
            if (!target && allEditors.length > 0) {
                target = this.editors.getActiveSysMLEditor() ?? allEditors[0];
            }
            if (!target) return;

            // Skip if a parse is already pending/in-flight
            if (this._debounceTimer || this._activeCancel) {
                this.cb.log?.('notifyServerParseDone: skipping — parse already in progress');
                return;
            }

            // Skip if explorer already has valid data
            const stats = this.cb.getLastStats?.();
            if (stats && stats.totalElements > 0) {
                this.cb.log?.(`notifyServerParseDone: skipping re-parse — explorer already has ${stats.totalElements} elements`);
                return;
            }

            // Cooldown
            const now = Date.now();
            if (now - this._lastParseDoneReparse < this.parseDoneCooldownMs) {
                this.cb.log?.(`notifyServerParseDone: skipping — cooldown (${now - this._lastParseDoneReparse}ms since last re-parse)`);
                return;
            }

            this._lastParseDoneReparse = now;
            this.cb.log?.(`notifyServerParseDone: re-parsing ${target.document.fileName.split('/').pop()}`);
            this.requestParse(target.document, { skipProgress: true });
            this.cb.notifyVisualization?.(target.document.uri);
        }, this.parseDoneDebounceMs);
    }

    /**
     * Cancel any in-flight or pending parse.  Called when a SysML
     * document is closed or the extension deactivates.
     */
    cancelAll(): void {
        this._clearDebounce();
        this._cancelActiveParse();
        if (this._parseDoneTimer) {
            globalThis.clearTimeout(this._parseDoneTimer);
            this._parseDoneTimer = undefined;
        }
        this.cb.hideProgress?.();
    }

    /** Reset the `lastParseDoneReparse` cooldown (for tests). */
    resetCooldown(): void {
        this._lastParseDoneReparse = 0;
    }

    // ── Internal ─────────────────────────────────────────────

    private _clearDebounce(): void {
        if (this._debounceTimer) {
            globalThis.clearTimeout(this._debounceTimer);
            this._debounceTimer = undefined;
        }
    }

    private _cancelActiveParse(): void {
        if (this._activeCancel) {
            this._activeCancel.cancel();
            this._activeCancel.dispose();
            this._activeCancel = undefined;
        }
    }
}
