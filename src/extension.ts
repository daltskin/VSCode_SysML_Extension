import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { FeatureExplorerProvider } from './explorer/featureExplorerProvider';
import { ModelExplorerProvider, ModelTreeItem } from './explorer/modelExplorerProvider';
import { SysRunnerPanel } from './game/sysRunnerPanel';
import { startLanguageClient, stopLanguageClient } from './lsp/client';
import { FeatureInspectorPanel } from './panels/featureInspectorPanel';
import { ModelDashboardPanel } from './panels/modelDashboardPanel';
import { LspModelProvider, type LspServerStats } from './providers/lspModelProvider';
import { VisualizationPanel } from './visualization/visualizationPanel';

let modelExplorerProvider: ModelExplorerProvider;
let featureExplorerProvider: FeatureExplorerProvider;
let outputChannel: vscode.OutputChannel;
let lspModelProvider: LspModelProvider;

let parseDebounceTimer: ReturnType<typeof setTimeout> | undefined;
let activeParseCancel: vscode.CancellationTokenSource | undefined;
let modelMetricsItem: vscode.StatusBarItem | undefined;
let parseProgressItem: vscode.StatusBarItem | undefined;
/** Fingerprint of the last metrics update to avoid redundant refreshes. */
let lastMetricsKey: string | undefined;
/** Timer driving the animated building-blocks status bar indicator. */
let parseAnimTimer: ReturnType<typeof setInterval> | undefined;
/** Cached LSP server stats for tooltip display. */
let lastServerStats: LspServerStats | undefined;
let parseAnimFrame = 0;
/** Cached args from last updateModelMetrics call for reactive diagnostic refresh. */
let lastMetricsStats: Parameters<typeof updateModelMetrics>[0] | undefined;
let lastMetricsUri: vscode.Uri | undefined;

/**
 * Per-file metrics cache so switching back to a previously-parsed
 * SysML file shows status-bar data instantly instead of waiting for
 * the debounce + LSP roundtrip.
 */
const metricsCache = new Map<string, Parameters<typeof updateModelMetrics>[0]>();

/** Available visualization views — matches the webview's dropdown options */
const visualizationViews = [
    { id: 'elk',       label: '◆ General',          description: 'General view with auto-layout' },
    { id: 'ibd',       label: '▦ Interconnection',  description: 'Interconnection view (parts, ports, connections)' },
    { id: 'activity',  label: '▶ Activity',         description: 'Activity view (actions and flow)' },
    { id: 'state',     label: '⌘ State',            description: 'State view (states and transitions)' },
    { id: 'sequence',  label: '⇄ Sequence',         description: 'Sequence view (interactions)' },
    { id: 'usecase',   label: '◎ Case',             description: 'Use case view (actors and cases)' },
    { id: 'tree',      label: '▲ Tree',             description: 'Tree layout' },
    { id: 'package',   label: '▤ Package',          description: 'Package diagram' },
    { id: 'graph',     label: '● Graph',            description: 'Force-directed graph' },
    { id: 'hierarchy', label: '■ Hierarchy',        description: 'Hierarchical block diagram' },
];

/**
 * Parse a SysML document for the **Model Explorer** and **Visualization**
 * panels only.  Language features (diagnostics, completions, hover,
 * go-to-def, formatting, etc.) are handled by the LSP server.
 *
 * All parsing is performed by the LSP server via `sysml/model` requests.
 */
function parseSysMLDocument(document: vscode.TextDocument, options?: { skipProgress?: boolean }): void {
    // Cancel any in-flight parse for a previous file
    if (parseDebounceTimer) {
        globalThis.clearTimeout(parseDebounceTimer);
    }
    if (activeParseCancel) {
        activeParseCancel.cancel();
        activeParseCancel.dispose();
        activeParseCancel = undefined;
    }

    // Show the animated progress indicator immediately — before the
    // debounce timer fires — so the user sees feedback the instant
    // a SysML file opens, not after the LSP roundtrip.
    // Skip when re-triggered from notifyServerParseDone (server already done).
    const fileName = document.fileName.split('/').pop() || 'file';
    if (!options?.skipProgress) {
        showParseProgress(fileName);
    }

    const cancelSource = new vscode.CancellationTokenSource();
    activeParseCancel = cancelSource;

    // Debounce (300 ms) — wait for the user to pause typing before
    // kicking off the model request.
    parseDebounceTimer = setTimeout(async () => {
        if (cancelSource.token.isCancellationRequested || document.isClosed) {
            return;
        }

        try {
            if (cancelSource.token.isCancellationRequested || document.isClosed) {
                return;
            }

            // --- Model explorer update ---
            const fileName = document.fileName.split('/').pop() || 'file';
            outputChannel?.appendLine(`parseSysMLDocument: loading ${fileName} (LSP)`);
            try {
                if (modelExplorerProvider.isWorkspaceMode()) {
                    // Workspace mode: keep the full workspace model and
                    // just reveal/expand the node for the active file.
                    await modelExplorerProvider.revealActiveDocument(document.uri);
                } else {
                    await modelExplorerProvider.loadDocument(document, cancelSource.token);
                }
            } catch {
                // Model explorer failure is non-critical — continue to
                // update the visualizer so it always gets a chance to
                // fetch fresh data from the LSP server.
            }

            // Parsing is done — hide the animated progress bar now,
            // before the secondary UI updates (metrics, feature inspector,
            // visualization) which can add noticeable latency.
            hideParseProgress();

            // --- Status-bar model metrics ---
            // Update metrics BEFORE the cancellation check so the status
            // bar always reflects the latest available data.  When a new
            // parse was queued (e.g. from notifyServerParseDone) the
            // cancelSource is cancelled, but the model explorer may
            // already hold valid stats that should be displayed.  The
            // next parse will override with fresh data if needed.
            const stats = modelExplorerProvider.getLastStats();
            if (stats) {
                // Fetch LSP server health info (non-blocking, best-effort)
                try {
                    lastServerStats = await lspModelProvider.getServerStats();
                } catch { /* non-critical */ }
                updateModelMetrics(stats, document.uri);
            }

            // Bail out if cancelled or closed — skip the remaining
            // secondary UI updates (Feature Inspector, Visualization)
            // which are more expensive and will be retried by the
            // follow-up parse.
            if (cancelSource.token.isCancellationRequested || document.isClosed) {
                outputChannel?.appendLine(`parseSysMLDocument: cancelled after model explorer update`);
                return;
            }

            // Push resolved types to Feature Inspector and Feature Explorer
            if ((FeatureInspectorPanel.currentPanel || featureExplorerProvider) && lspModelProvider) {
                try {
                    const typeResult = await lspModelProvider.getModel(
                        document.uri.toString(), ['resolvedTypes'], cancelSource.token,
                    );
                    if (typeResult.resolvedTypes) {
                        if (FeatureInspectorPanel.currentPanel) {
                            FeatureInspectorPanel.currentPanel.updateResolvedTypes(
                                typeResult.resolvedTypes, document.uri.toString(),
                            );
                        }
                        if (featureExplorerProvider) {
                            featureExplorerProvider.pushResolvedTypes(
                                document.uri.toString(), typeResult.resolvedTypes,
                            );
                        }
                    }
                } catch {
                    // Non-critical — inspector/explorer will fetch on next interaction
                }
            }

            // Bail out if cancelled or closed
            if (cancelSource.token.isCancellationRequested || document.isClosed) {
                return;
            }

            // --- Visualization panel update ---
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(document.uri);
            }
        } finally {
            if (activeParseCancel === cancelSource) {
                activeParseCancel = undefined;
            }
            cancelSource.dispose();
            // Safety net: ensure the indicator is hidden even if an
            // early return or exception skipped the inline call above.
            hideParseProgress();
        }
    }, 300);
}

/**
 * Update the status-bar model-metrics item with element counts and
 * parse time from the latest `sysml/model` response.
 *
 * "Resolved" here means elements that have an explicit type annotation
 * (e.g. `part engine : Engine`).  Elements without a type — like
 * packages, top-level definitions, and un-typed usages — are simply
 * "un-typed", **not** errors.  We show the actual diagnostic count
 * from the Problems panel instead.
 */
export function updateModelMetrics(stats: {
    totalElements: number;
    resolvedElements: number;
    unresolvedElements: number;
    parseTimeMs: number;
    lexTimeMs?: number;
    parseOnlyTimeMs?: number;
    parseCached?: boolean;
    modelBuildTimeMs: number;
    complexity?: {
        complexityIndex: number;
        rating: string;
        definitions: number;
        usages: number;
        maxDepth: number;
        avgChildrenPerDef: number;
        couplingCount: number;
        unusedDefinitions: number;
        documentationCoverage: number;
        hotspots: { qualifiedName: string; kind: string; childCount: number; depth: number; typeRefs: number; hasDoc: boolean; score: number }[];
    };
}, documentUri?: vscode.Uri): void {
    // Cache latest args so the diagnostic-change listener can re-call us.
    lastMetricsStats = stats;
    lastMetricsUri = documentUri;

    // Persist in per-file cache for instant restore on tab switch
    if (documentUri) {
        metricsCache.set(documentUri.toString(), stats);
    }

    // Count real diagnostics (errors/warnings) for the current file
    const diagnostics = documentUri
        ? vscode.languages.getDiagnostics(documentUri)
        : [];
    const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
    const warnCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
    const issueCount = errorCount + warnCount;

    // Deduplicate: skip if stats + document + diagnostics haven't changed
    const metricsKey = `${documentUri?.toString() ?? ''}|${stats.totalElements}|${stats.resolvedElements}|${stats.unresolvedElements}|${stats.parseTimeMs}|${stats.modelBuildTimeMs}|${stats.complexity?.complexityIndex ?? ''}|${errorCount}|${warnCount}`;
    if (metricsKey === lastMetricsKey) {
        return;
    }
    lastMetricsKey = metricsKey;

    if (!modelMetricsItem) {
        modelMetricsItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 100
        );
        modelMetricsItem.name = 'SysML Model Metrics';
        // Click opens the Problems panel so users can see actionable issues
        modelMetricsItem.command = 'workbench.actions.view.problems';
    }

    // Icon reflects actual problems, not type-resolution status
    const icon = errorCount > 0 ? '$(error)' : warnCount > 0 ? '$(warning)' : '$(check)';
    const issuesSuffix = issueCount > 0 ? ` | $(alert) ${issueCount}` : '';

    // Complexity badge
    const cx = stats.complexity;
    const complexitySuffix = cx ? ` | MCI ${cx.complexityIndex}` : '';
    modelMetricsItem.text = `${icon} SysML: ${stats.totalElements} elements${issuesSuffix}${complexitySuffix} | ${stats.parseTimeMs}ms`;

    const totalTimeMs = stats.parseTimeMs + stats.modelBuildTimeMs;

    const tooltipLines: string[] = [];

    // File name
    if (documentUri) {
        tooltipLines.push(`📄 ${documentUri.path.split('/').pop()}`);
        tooltipLines.push('');
    }

    // Element summary
    tooltipLines.push(`── Elements ──`);
    tooltipLines.push(`Total: ${stats.totalElements}`);
    tooltipLines.push(`Typed: ${stats.resolvedElements}  |  Un-typed: ${stats.unresolvedElements}`);

    // Parse timing breakdown
    const cachedLabel = stats.parseCached ? ' (Cached)' : '';
    tooltipLines.push('');
    tooltipLines.push(`── Parse Details${cachedLabel} ──`);
    if (stats.lexTimeMs !== undefined) {
        tooltipLines.push(`Lex:   ${stats.lexTimeMs}ms`);
    }
    if (stats.parseOnlyTimeMs !== undefined) {
        tooltipLines.push(`Parse: ${stats.parseOnlyTimeMs}ms`);
    }
    tooltipLines.push(`Build: ${stats.modelBuildTimeMs}ms`);
    tooltipLines.push(`Total: ${totalTimeMs}ms`);

    // Model Complexity Index
    if (cx) {
        tooltipLines.push('');
        tooltipLines.push(`── Model Complexity Index ──`);
        tooltipLines.push(`Score: ${cx.complexityIndex} / 100  (${cx.rating})`);
        tooltipLines.push(`Definitions: ${cx.definitions}  |  Usages: ${cx.usages}`);
        tooltipLines.push(`Max depth: ${cx.maxDepth}  |  Coupling: ${cx.couplingCount}`);
        tooltipLines.push(`Unused definitions: ${cx.unusedDefinitions}`);
        tooltipLines.push(`Documentation coverage: ${cx.documentationCoverage}%`);
    }

    // LSP server health
    if (lastServerStats) {
        const s = lastServerStats;
        const uptimeStr = s.uptime >= 60
            ? `${Math.floor(s.uptime / 60)}m ${s.uptime % 60}s`
            : `${s.uptime}s`;
        tooltipLines.push('');
        tooltipLines.push(`── LSP Health ──`);
        tooltipLines.push(`Uptime: ${uptimeStr}`);
        tooltipLines.push(`Heap: ${s.memory.heapUsed} / ${s.memory.heapTotal} MB  |  RSS: ${s.memory.rss} MB`);
        tooltipLines.push(`Caches: ${s.caches.documents} docs, ${s.caches.symbolTables} STs, ${s.caches.semanticTokens} tokens`);
    }

    // Diagnostics
    if (issueCount > 0) {
        tooltipLines.push('');
        tooltipLines.push(`${errorCount} error(s), ${warnCount} warning(s)`);
        tooltipLines.push('Click to open Problems panel');
    }
    modelMetricsItem.tooltip = tooltipLines.join('\n');

    modelMetricsItem.backgroundColor = errorCount > 0
        ? new vscode.ThemeColor('statusBarItem.errorBackground')
        : warnCount > 0
            ? new vscode.ThemeColor('statusBarItem.warningBackground')
            : undefined;

    modelMetricsItem.show();
}

/** Hide the model-metrics status bar item (e.g. when no SysML file is open). */
export function hideModelMetrics(): void {
    modelMetricsItem?.hide();
    lastMetricsKey = undefined;
}

/**
 * Show a lightweight "loading" placeholder in the metrics status bar
 * while the LSP server processes a freshly-opened SysML file that
 * has no cached metrics yet.
 */
function showMetricsLoading(document: vscode.TextDocument): void {
    if (!modelMetricsItem) {
        modelMetricsItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 100,
        );
        modelMetricsItem.name = 'SysML Model Metrics';
        modelMetricsItem.command = 'workbench.actions.view.problems';
    }
    const fileName = document.fileName.split('/').pop() || 'file';
    modelMetricsItem.text = '$(loading~spin) SysML: Loading…';
    modelMetricsItem.tooltip = `Parsing ${fileName}…`;
    modelMetricsItem.backgroundColor = undefined;
    modelMetricsItem.show();
}

/**
 * Animated building-blocks frames for the status bar indicator.
 * Each frame shows blocks assembling into a model, giving a visual
 * sense of progress while the LSP server parses.
 */
const PARSE_FRAMES = [
    '$(symbol-structure) ░░░░ Assembling model',
    '$(symbol-structure) █░░░ Assembling model',
    '$(symbol-structure) ██░░ Assembling model',
    '$(symbol-structure) ███░ Assembling model',
    '$(symbol-structure) ████ Assembling model',
    '$(symbol-structure) ▪▫▫▫ Building blocks',
    '$(symbol-structure) ▪▪▫▫ Building blocks',
    '$(symbol-structure) ▪▪▪▫ Building blocks',
    '$(symbol-structure) ▪▪▪▪ Building blocks',
    '$(symbol-structure) ◧◧◧◧ Linking elements',
    '$(symbol-structure) ◨◧◧◧ Linking elements',
    '$(symbol-structure) ◨◨◧◧ Linking elements',
    '$(symbol-structure) ◨◨◨◧ Linking elements',
    '$(symbol-structure) ◨◨◨◨ Linking elements',
];

/**
 * Show an animated "building blocks" indicator in the status bar
 * while the LSP server is processing a file.
 *
 * Called eagerly from `parseSysMLDocument()` the instant a SysML file
 * is opened (before the debounce), and again from `client.ts` when
 * the server sends `sysml/status` `begin` / `progress` notifications.
 */
export function showParseProgress(label: string): void {
    if (!parseProgressItem) {
        parseProgressItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, 0,
        );
        parseProgressItem.name = 'SysML Parse Progress';
    }

    // Start the frame animation if not already running
    if (!parseAnimTimer) {
        parseAnimFrame = 0;
        parseAnimTimer = setInterval(() => {
            parseAnimFrame = (parseAnimFrame + 1) % PARSE_FRAMES.length;
            if (parseProgressItem) {
                const suffix = label ? ` · ${label}` : '';
                parseProgressItem.text = `${PARSE_FRAMES[parseAnimFrame]}${suffix}`;
            }
        }, 220);
    }

    const suffix = label ? ` · ${label}` : '';
    parseProgressItem.text = `${PARSE_FRAMES[parseAnimFrame]}${suffix}`;
    parseProgressItem.show();
}

/**
 * Hide the parse-progress status bar item.  Called from `client.ts`
 * when the server sends `sysml/status` `end`.
 */
export function hideParseProgress(): void {
    if (parseAnimTimer) {
        clearInterval(parseAnimTimer);
        parseAnimTimer = undefined;
    }
    parseProgressItem?.hide();
}

/**
 * Called when the LSP server signals that it has finished parsing a
 * file (`sysml/status` → `end`).  Re-triggers `parseSysMLDocument`
 * so the Model Explorer and Visualization panels pick up the newly
 * available model data — prevents the "0 elements" problem on cold
 * start when the DFA warm-up delays initial parsing.
 */
export function notifyServerParseDone(uri?: string): void {
    // Find a matching open editor to re-parse
    const editors = vscode.window.visibleTextEditors.filter(
        e => e.document.languageId === 'sysml' && !e.document.isClosed,
    );
    let target: vscode.TextDocument | undefined;
    if (uri) {
        target = editors.find(e => e.document.uri.toString() === uri)?.document;
    }
    // Fallback: re-parse whichever SysML editor is active
    if (!target && editors.length > 0) {
        target = vscode.window.activeTextEditor?.document.languageId === 'sysml'
            ? vscode.window.activeTextEditor.document
            : editors[0].document;
    }
    if (target) {
        outputChannel?.appendLine(`notifyServerParseDone: re-parsing ${target.fileName.split('/').pop()}`);
        parseSysMLDocument(target, { skipProgress: true });

        // Also notify the visualizer directly — the server has finished
        // parsing so sysml/model will return fresh data.  This avoids
        // waiting for the 300 ms debounce inside parseSysMLDocument.
        if (VisualizationPanel.currentPanel) {
            VisualizationPanel.currentPanel.notifyFileChanged(target.uri);
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Create dedicated output channel for logging
    outputChannel = vscode.window.createOutputChannel('SysML');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('SysML v2.0 extension is now active');
    outputChannel.show(true);  // Auto-show so the user can see LSP status

    // ─── MCP Server (register FIRST — independent of LSP) ─────────
    // The MCP server is a standalone stdio process that doesn't need
    // the LSP client.  Register it early so Copilot / agent mode can
    // discover SysML tools even before a .sysml file is opened.
    const mcpServerPath = path.join(
        context.extensionPath, 'node_modules', 'sysml-v2-lsp',
        'dist', 'server', 'mcpServer.js'
    );
    if (fs.existsSync(mcpServerPath)) {
        const emitter = new vscode.EventEmitter<void>();
        context.subscriptions.push(emitter);
        context.subscriptions.push(
            vscode.lm.registerMcpServerDefinitionProvider('sysml-v2-mcp', {
                onDidChangeMcpServerDefinitions: emitter.event,
                provideMcpServerDefinitions: async () => [
                    new vscode.McpStdioServerDefinition(
                        'SysML v2 Model Context',
                        'node',
                        [mcpServerPath]
                    )
                ],
            })
        );
        outputChannel.appendLine(`MCP server registered: ${mcpServerPath}`);
    } else {
        outputChannel.appendLine(`Warning: MCP server not found at ${mcpServerPath}`);
    }

    // ─── LSP Client ────────────────────────────────────────────────
    // The language server (sysml-v2-lsp) provides all core language
    // features: diagnostics, completions, hover, go-to-definition,
    // references, rename, formatting, code actions, semantic tokens,
    // CodeLens, inlay hints, document symbols, folding ranges, etc.
    const client = startLanguageClient(context, outputChannel);

    // ─── LSP Model Provider ───────────────────────────────────────
    // The model explorer and visualization panels query the LSP
    // server's `sysml/model` custom request.  All parsing is handled
    // by the language server — no extension-side parser.
    lspModelProvider = new LspModelProvider(client);
    outputChannel.appendLine('LSP model provider initialised');

    // ─── Model Explorer ────────────────────────────────────────────
    modelExplorerProvider = new ModelExplorerProvider(lspModelProvider);
    const modelExplorerTreeView = vscode.window.createTreeView('sysmlModelExplorer', {
        treeDataProvider: modelExplorerProvider,
    });
    modelExplorerProvider.setTreeView(modelExplorerTreeView);
    context.subscriptions.push(modelExplorerTreeView);
    // Set the initial workspace view mode context for menu icons
    vscode.commands.executeCommand('setContext', 'sysml.workspaceViewMode', modelExplorerProvider.getWorkspaceViewMode());

    // ─── Feature Explorer (linked detail view) ─────────────────────
    featureExplorerProvider = new FeatureExplorerProvider(lspModelProvider);
    const featureExplorerTreeView = vscode.window.createTreeView('sysmlFeatureExplorer', {
        treeDataProvider: featureExplorerProvider,
    });
    context.subscriptions.push(featureExplorerTreeView);

    // Master-detail: when user selects a definition in Model Explorer,
    // populate the Feature Explorer with its resolved type info.
    context.subscriptions.push(
        modelExplorerTreeView.onDidChangeSelection(async (e) => {
            const selected = e.selection[0];
            if (selected && (selected as ModelTreeItem).itemType === 'sysml-element') {
                const treeItem = selected as ModelTreeItem;
                const el = treeItem.element;
                // Only show details for definition-like elements
                const defTypes = new Set([
                    'part def', 'item def', 'port def', 'action def',
                    'state def', 'constraint def', 'requirement def',
                    'use case def', 'enum def', 'datatype', 'package',
                    'part', 'port', 'action', 'state', 'attribute',
                    'item', 'reference', 'connection', 'interface',
                ]);
                if (defTypes.has(el.type)) {
                    // Collect all known elements for where-used lookup
                    const allElements = modelExplorerProvider.getAllElements();
                    await featureExplorerProvider.selectElement(
                        el, treeItem.elementUri, allElements,
                    );
                }
            }
        })
    );

    // ─── Commands ──────────────────────────────────────────────────

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.formatDocument', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                await vscode.commands.executeCommand('editor.action.formatDocument');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.validateModel', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                // Diagnostics are provided by the LSP server.
                const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
                vscode.window.showInformationMessage(
                    `Validation: ${diagnostics.length} issue(s) found`
                );
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showVisualizer', async () => {
            // Prefer the active editor, but fall back to any visible
            // SysML editor (e.g. when focus is in the Output panel).
            let editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'sysml') {
                editor = vscode.window.visibleTextEditors.find(
                    e => e.document.languageId === 'sysml' && !e.document.isClosed,
                );
            }
            if (editor) {
                VisualizationPanel.createOrShow(context.extensionUri, editor.document, undefined, lspModelProvider);
            }
        })
    );


    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.refreshModelTree', () => {
            modelExplorerProvider.refresh();
        })
    );

    // Visualize a specific package from the Model Explorer context menu
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.visualizePackage', async (treeItem: ModelTreeItem) => {
            if (!treeItem || !treeItem.element || treeItem.element.type !== 'package') {
                return;
            }

            const packageName = treeItem.element.name;
            const fileUri = treeItem.elementUri;

            // In workspace mode, pass all workspace file URIs so the
            // visualizer loads every package — not just the one file.
            const isWorkspace = modelExplorerProvider.isWorkspaceMode();
            const workspaceUris = isWorkspace ? modelExplorerProvider.getWorkspaceFileUris() : undefined;

            // Open the file to get a TextDocument for the visualizer
            const document = await vscode.workspace.openTextDocument(fileUri);

            // Build a combined document proxy when in workspace mode so
            // the visualizer sees all files (mirrors sysml.visualizeFolder logic).
            if (isWorkspace && workspaceUris && workspaceUris.length > 1) {
                const openDocs: vscode.TextDocument[] = [];
                let combinedContent = '';
                const fileNames: string[] = [];

                for (const uri of workspaceUris) {
                    try {
                        const doc = await vscode.workspace.openTextDocument(uri);
                        openDocs.push(doc);
                        const fileName = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1);
                        fileNames.push(fileName);
                        combinedContent += `// === ${fileName} ===\n`;
                        combinedContent += doc.getText();
                        combinedContent += '\n\n';
                    } catch { /* skip unreadable files */ }
                }

                if (openDocs.length > 0) {
                    const firstDoc = openDocs[0];
                    const combinedDocumentProxy = {
                        getText: () => combinedContent,
                        uri: firstDoc.uri,
                        languageId: 'sysml',
                        version: firstDoc.version,
                        lineCount: combinedContent.split('\n').length,
                        lineAt: (line: number) => firstDoc.lineAt(Math.min(line, firstDoc.lineCount - 1)),
                        offsetAt: (position: vscode.Position) => firstDoc.offsetAt(position),
                        positionAt: (offset: number) => firstDoc.positionAt(offset),
                        getWordRangeAtPosition: (position: vscode.Position) => firstDoc.getWordRangeAtPosition(position),
                        validateRange: (range: vscode.Range) => firstDoc.validateRange(range),
                        validatePosition: (position: vscode.Position) => firstDoc.validatePosition(position),
                        fileName: firstDoc.fileName,
                        isUntitled: false,
                        isDirty: false,
                        isClosed: false,
                        eol: firstDoc.eol,
                        encoding: 'utf8',
                        save: () => Promise.resolve(false)
                    } as unknown as vscode.TextDocument;

                    const title = `SysML Visualization - ${fileNames.length} file(s)`;
                    VisualizationPanel.createOrShow(context.extensionUri, combinedDocumentProxy, title, lspModelProvider, workspaceUris);

                    // Select the specific package once data loads
                    setTimeout(() => {
                        if (VisualizationPanel.currentPanel) {
                            VisualizationPanel.currentPanel.selectPackage(packageName);
                        }
                    }, 500);
                    return;
                }
            }

            // Single-file fallback
            VisualizationPanel.createOrShow(context.extensionUri, document, undefined, lspModelProvider);

            // Wait briefly for the panel to initialise and data to load, then select the package
            setTimeout(() => {
                if (VisualizationPanel.currentPanel) {
                    VisualizationPanel.currentPanel.selectPackage(packageName);
                }
            }, 500);
        })
    );

    // Set initial context so the toggle button is only shown when a
    // multi-root or .code-workspace workspace is open.
    vscode.commands.executeCommand(
        'setContext',
        'sysml.hasWorkspace',
        vscode.workspace.workspaceFile !== undefined,
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.toggleModelExplorerViewMode', () => {
            if (!vscode.workspace.workspaceFile) {
                // Not a workspace — toggle is disabled but guard anyway
                return;
            }
            modelExplorerProvider.toggleWorkspaceViewMode();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.switchToFileView', () => {
            modelExplorerProvider.setWorkspaceViewMode('byFile');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.switchToSemanticView', () => {
            modelExplorerProvider.setWorkspaceViewMode('bySemantic');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.clearCache', async () => {
            const result = await lspModelProvider.clearServerCaches();
            if (result) {
                const total = result.documents + result.symbolTables + result.semanticTokens;
                vscode.window.showInformationMessage(
                    `SysML: Flushed ${total} cache entries (${result.documents} docs, ${result.symbolTables} STs, ${result.semanticTokens} tokens)`,
                );
                outputChannel.appendLine(
                    `[Cache] Cleared — ${result.documents} docs, ${result.symbolTables} symbol tables, ${result.semanticTokens} token sets`,
                );
            } else {
                vscode.window.showWarningMessage('SysML: LSP server did not respond — cache not cleared');
                outputChannel.appendLine('[Cache] Clear failed — LSP not reachable');
                return;
            }

            // Re-parse the active SysML file so the UI refreshes immediately
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                parseSysMLDocument(editor.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showModelExplorer', async () => {
            // Set context to make the view visible
            await vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);
            // Focus the Model Explorer view in the sidebar
            await vscode.commands.executeCommand('sysmlModelExplorer.focus');

            // If there's an active SysML document, load it into the explorer
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                modelExplorerProvider.loadDocument(editor.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.refreshVisualization', () => {
            if (VisualizationPanel.currentPanel) {
                // Get the document from the current panel
                const currentDocument = VisualizationPanel.currentPanel.getDocument();

                if (currentDocument && currentDocument.languageId === 'sysml') {
                    VisualizationPanel.currentPanel.dispose();
                    VisualizationPanel.createOrShow(context.extensionUri, currentDocument, undefined, lspModelProvider);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.visualizeFolder', async (uri: vscode.Uri, selectedUris?: vscode.Uri[]) => {
            try {
                // Handle multi-selection: when multiple items are selected in explorer,
                // VS Code passes the right-clicked item as first arg and all selected items as second arg
                let targetUris: vscode.Uri[] = [];

                if (selectedUris && selectedUris.length > 0) {
                    // Multi-selection case
                    targetUris = selectedUris;
                } else if (uri) {
                    // Single selection case
                    targetUris = [uri];
                } else {
                    // No URI provided, try to get from active editor
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        targetUris = [editor.document.uri];
                    }
                }

                if (targetUris.length === 0) {
                    vscode.window.showErrorMessage('No folder or file selected for SysML visualization');
                    return;
                }

                // Collect all .sysml files from all selected folders/files
                const allSysmlFiles: vscode.Uri[] = [];
                const folderNames: string[] = [];

                for (const targetUri of targetUris) {
                    const stat = await vscode.workspace.fs.stat(targetUri);

                    if (stat.type === vscode.FileType.Directory) {
                        // Handle folder - find all .sysml files recursively
                        const folderName = targetUri.fsPath.substring(targetUri.fsPath.lastIndexOf('/') + 1);
                        folderNames.push(folderName);

                        const sysmlFiles = await vscode.workspace.findFiles(
                            new vscode.RelativePattern(targetUri, '**/*.sysml'),
                            '**/node_modules/**'
                        );
                        allSysmlFiles.push(...sysmlFiles);
                    } else if (targetUri.fsPath.endsWith('.sysml')) {
                        // Handle single .sysml file
                        allSysmlFiles.push(targetUri);
                    }
                }

                // Remove duplicates (in case same file is in multiple selected folders)
                const uniqueFiles = [...new Map(allSysmlFiles.map(f => [f.fsPath, f])).values()];

                if (uniqueFiles.length === 0) {
                    vscode.window.showInformationMessage('No SysML files found in the selected folders/files');
                    return;
                }

                // Open ALL files via openTextDocument so the LSP server
                // receives textDocument/didOpen for each and can parse them.
                const openDocs: vscode.TextDocument[] = [];
                let combinedContent = '';
                const fileNames: string[] = [];

                for (const fileUri of uniqueFiles) {
                    try {
                        const doc = await vscode.workspace.openTextDocument(fileUri);
                        openDocs.push(doc);
                        const fileName = fileUri.fsPath.substring(fileUri.fsPath.lastIndexOf('/') + 1);
                        fileNames.push(fileName);

                        combinedContent += `// === ${fileName} ===\n`;
                        combinedContent += doc.getText();
                        combinedContent += '\n\n';
                    } catch (error) {
                        outputChannel?.appendLine(`[warn] Failed to open SysML file ${fileUri.fsPath}: ${error}`);
                    }
                }

                if (openDocs.length === 0) {
                    vscode.window.showErrorMessage('Failed to read any SysML files');
                    return;
                }

                // Use the first opened document as the base document
                const firstFileDocument = openDocs[0];

                // Create a wrapper that provides combined content but uses the real file URI
                // This avoids creating an untitled document
                const combinedDocumentProxy = {
                    getText: () => combinedContent,
                    uri: firstFileDocument.uri,
                    languageId: 'sysml',
                    version: firstFileDocument.version,
                    lineCount: combinedContent.split('\n').length,
                    lineAt: (line: number) => firstFileDocument.lineAt(Math.min(line, firstFileDocument.lineCount - 1)),
                    offsetAt: (position: vscode.Position) => firstFileDocument.offsetAt(position),
                    positionAt: (offset: number) => firstFileDocument.positionAt(offset),
                    getWordRangeAtPosition: (position: vscode.Position) => firstFileDocument.getWordRangeAtPosition(position),
                    validateRange: (range: vscode.Range) => firstFileDocument.validateRange(range),
                    validatePosition: (position: vscode.Position) => firstFileDocument.validatePosition(position),
                    fileName: firstFileDocument.fileName,
                    isUntitled: false,
                    isDirty: false,
                    isClosed: false,
                    eol: firstFileDocument.eol,
                    encoding: 'utf8',
                    save: () => Promise.resolve(false)
                } as unknown as vscode.TextDocument;

                // Build title based on selection
                let title: string;
                if (folderNames.length > 0) {
                    title = `SysML Visualization - ${fileNames.length} files from ${folderNames.length} folder(s)`;
                } else {
                    title = `SysML Visualization - ${fileNames.length} file(s)`;
                }

                // Show ONLY the visualization panel, not the text document
                VisualizationPanel.createOrShow(context.extensionUri, combinedDocumentProxy, title, lspModelProvider, uniqueFiles);

                // Update the Model Explorer with the combined document
                await modelExplorerProvider.loadDocument(combinedDocumentProxy);

                vscode.window.showInformationMessage(
                    `Visualizing ${fileNames.length} SysML files: ${fileNames.join(', ')}`
                );

            } catch (error) {
                vscode.window.showErrorMessage(`Failed to visualize SysML: ${error}`);
                outputChannel?.appendLine(`[error] Error in sysml.visualizeFolder: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.visualizeFolderWithView', async (uri: vscode.Uri, selectedUris?: vscode.Uri[]) => {
            const items = visualizationViews.map(v => ({
                label: v.label,
                description: v.description,
                viewId: v.id
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select visualization view'
            });

            if (selected) {
                // Execute visualizeFolder with the selected view, passing multi-selection
                await vscode.commands.executeCommand('sysml.visualizeFolder', uri, selectedUris);
                // Then switch to the selected view
                if (VisualizationPanel.currentPanel) {
                    await vscode.commands.executeCommand('sysml.changeVisualizerView', selected.viewId);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.changeVisualizerView', async (viewId?: string) => {
            if (!VisualizationPanel.currentPanel) {
                vscode.window.showWarningMessage('No visualization panel is currently open');
                return;
            }

            let selectedViewId = viewId;

            // If no view ID provided, show picker
            if (!selectedViewId) {
                const items = visualizationViews.map(v => ({
                    label: v.label,
                    description: v.description,
                    viewId: v.id
                }));

                const selected = await vscode.window.showQuickPick(items, {
                    placeHolder: 'Select visualization view'
                });

                if (!selected) {
                    return;
                }

                selectedViewId = selected.viewId;
            }

            // Change the view
            VisualizationPanel.currentPanel.changeView(selectedViewId);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.exportVisualization', async () => {
            const format = await vscode.window.showQuickPick(['PNG', 'SVG'], {
                placeHolder: 'Select export format'
            });
            if (!format) {
                return;
            }

            let scale = 2; // default
            if (format === 'PNG') {
                const config = vscode.workspace.getConfiguration('sysml');
                const defaultScale = config.get<number>('export.defaultScale', 2);

                interface ScaleOption extends vscode.QuickPickItem {
                    scale: number;
                }

                const scaleOptions: ScaleOption[] = [
                    { label: '1x - Original size', scale: 1, description: 'Smallest file size' },
                    { label: '2x - Double size', scale: 2, description: 'Good quality (default)' },
                    { label: '3x - Triple size', scale: 3, description: 'High quality' },
                    { label: '4x - Quadruple size', scale: 4, description: 'Very high quality, larger file' }
                ];

                // Mark the default option
                const optionsWithDefault: ScaleOption[] = scaleOptions.map(opt => ({
                    ...opt,
                    label: opt.scale === defaultScale ? `${opt.label} ✓` : opt.label
                }));

                const selectedScale = await vscode.window.showQuickPick<ScaleOption>(optionsWithDefault, {
                    placeHolder: `Select export resolution (default: ${defaultScale}x)`
                });

                if (!selectedScale) {
                    return;
                }
                scale = selectedScale.scale;
            }

            VisualizationPanel.currentPanel?.exportVisualization(format, scale);
        })
    );

    // ─── Type Hierarchy / Call Hierarchy ───────────────────────
    // The LSP server implements typeHierarchy & callHierarchy. These
    // commands surface VS Code's built-in hierarchy views from the
    // command palette for SysML files.
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showTypeHierarchy', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                vscode.commands.executeCommand('editor.showTypeHierarchy');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showCallHierarchy', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                vscode.commands.executeCommand('editor.showCallHierarchy');
            }
        })
    );

    // ─── Feature Inspector ──────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showFeatureInspector', () => {
            FeatureInspectorPanel.createOrShow(context.extensionUri, lspModelProvider);
        })
    );

    // ─── Model Dashboard ────────────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showModelDashboard', async (target?: vscode.Uri | ModelTreeItem) => {
            let fileUri: vscode.Uri | undefined;
            let packageName: string | undefined;

            if (target instanceof vscode.Uri) {
                fileUri = target;
            } else if (target && typeof target === 'object' && 'elementUri' in target) {
                // Tree item from Model Explorer package nodes.
                const treeItem = target as ModelTreeItem;
                fileUri = treeItem.elementUri;
                if (treeItem.element?.type === 'package') {
                    packageName = treeItem.element.name;
                }
            }

            ModelDashboardPanel.createOrShow(context.extensionUri, lspModelProvider, fileUri, packageName);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.openProblemForUri', async (uriLike?: string | vscode.Uri) => {
            let targetUri: vscode.Uri | undefined;
            if (typeof uriLike === 'string') {
                try { targetUri = vscode.Uri.parse(uriLike); } catch { /* ignore */ }
            } else if (uriLike && typeof (uriLike as vscode.Uri).toString === 'function') {
                targetUri = uriLike as vscode.Uri;
            }

            if (!targetUri) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.languageId === 'sysml') {
                    targetUri = editor.document.uri;
                }
            }

            if (!targetUri) {
                await vscode.commands.executeCommand('workbench.actions.view.problems');
                return;
            }

            const diagnostics = vscode.languages.getDiagnostics(targetUri)
                .filter(d => d.severity === vscode.DiagnosticSeverity.Error || d.severity === vscode.DiagnosticSeverity.Warning)
                .sort((a, b) => {
                    if (a.severity !== b.severity) {
                        return a.severity - b.severity; // Error first
                    }
                    if (a.range.start.line !== b.range.start.line) {
                        return a.range.start.line - b.range.start.line;
                    }
                    return a.range.start.character - b.range.start.character;
                });

            if (diagnostics.length > 0) {
                const doc = await vscode.workspace.openTextDocument(targetUri);
                const editor = await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false });
                const pos = diagnostics[0].range.start;
                const sel = new vscode.Selection(pos, pos);
                editor.selection = sel;
                editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
            }

            await vscode.commands.executeCommand('workbench.actions.view.problems');
        })
    );

    // ─── SysML World Game ──────────────────────────────────────────
    // Completely isolated retro game that teaches SysML v2 concepts.
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showSysRunner', () => {
            SysRunnerPanel.createOrShow(context.extensionUri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.jumpToDefinition', (uri: vscode.Uri, range: vscode.Range) => {
            if (!uri || !range) {
                vscode.window.showWarningMessage('Cannot navigate: missing location information');
                return;
            }

            vscode.window.showTextDocument(uri, {
                preserveFocus: false,
                preview: false
            }).then(editor => {
                // Set selection and reveal the range
                editor.selection = new vscode.Selection(range.start, range.end);
                editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

                // Create a prominent highlight for the selected element
                const decorationType = vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255, 215, 0, 0.4)', // Gold background
                    border: '2px solid #FFD700', // Gold border
                    borderRadius: '3px',
                    isWholeLine: false,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
                });

                editor.setDecorations(decorationType, [range]);

                // Clear the highlight after 3 seconds
                setTimeout(() => {
                    decorationType.dispose();
                }, 3000);
            });
        })
    );

    // Try to parse any already-open SysML file.  When VS Code restores a
    // session, activeTextEditor may still be undefined at the time activate()
    // runs, and onDidChangeActiveTextEditor won't fire because there's no
    // *change*.  We therefore retry with increasing delays.
    function tryParseActiveEditor(): boolean {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'sysml') {
            outputChannel.appendLine(`Parsing active SysML editor: ${editor.document.fileName}`);
            vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);
            parseSysMLDocument(editor.document);
            return true;
        }
        return false;
    }

    /**
     * Scan the workspace for all .sysml files and:
     * 1. Open them so the LSP server receives textDocument/didOpen for each
     * 2. Load the workspace-wide model into the Model Explorer.
     * 3. If a SysML file is currently active, reveal its elements.
     */
    async function loadWorkspaceSysMLFiles(): Promise<void> {
        const files = await vscode.workspace.findFiles('**/*.sysml', '**/node_modules/**');
        if (files.length === 0) return;

        outputChannel.appendLine(`[workspace] Found ${files.length} SysML files — auto-parsing`);
        vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);

        // Open each file so the LSP server receives didOpen and parses it
        for (const file of files) {
            try {
                await vscode.workspace.openTextDocument(file);
            } catch {
                // skip unreadable files
            }
        }

        // Always load the workspace-wide model so every file is visible
        outputChannel.appendLine('[workspace] Loading workspace model');
        await modelExplorerProvider.loadWorkspaceModel(files);

        // If a SysML editor is active, reveal its package in the tree
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'sysml') {
            await modelExplorerProvider.revealActiveDocument(editor.document.uri);
        }
    }

    const activeEditor = vscode.window.activeTextEditor;
    outputChannel.appendLine(`Active editor on activation: ${activeEditor ? activeEditor.document.fileName : 'none'}`);
    outputChannel.appendLine(`Language ID: ${activeEditor?.document.languageId ?? 'N/A'}`);
    if (!tryParseActiveEditor()) {
        // Editor not ready yet — retry a few times with increasing delays
        const retryDelays = [100, 500, 1500];
        let retryIndex = 0;
        const retryTimer = globalThis.setInterval(() => {
            if (tryParseActiveEditor() || retryIndex >= retryDelays.length) {
                globalThis.clearInterval(retryTimer);
                if (retryIndex >= retryDelays.length) {
                    outputChannel.appendLine('No active SysML editor found after retries');
                }
                return;
            }
            retryIndex++;
        }, retryDelays[Math.min(retryIndex, retryDelays.length - 1)]);
    }

    // Auto-scan all workspace .sysml files once the LSP server is ready,
    // but only when a .code-workspace is open.  Plain folders may contain
    // thousands of files and scanning them eagerly would be too slow.
    if (vscode.workspace.workspaceFile) {
        setTimeout(() => loadWorkspaceSysMLFiles(), 3000);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            outputChannel.appendLine(`onDidChangeActiveTextEditor: ${editor ? editor.document.fileName : 'none'} (lang: ${editor?.document.languageId ?? 'N/A'})`);
            if (editor && editor.document.languageId === 'sysml') {
                vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);

                // Show status bar immediately — use cached metrics if
                // available, otherwise show a "loading" placeholder.
                const cachedStats = metricsCache.get(editor.document.uri.toString());
                if (cachedStats) {
                    updateModelMetrics(cachedStats, editor.document.uri);
                } else {
                    showMetricsLoading(editor.document);
                }

                parseSysMLDocument(editor.document);
            } else {
                // Switched away from SysML — hide metrics immediately
                hideModelMetrics();

                if (vscode.workspace.workspaceFile && !modelExplorerProvider.isWorkspaceMode()) {
                    // No SysML file active and workspace model not yet loaded —
                    // show the workspace-wide model (only when a .code-workspace is open)
                    loadWorkspaceSysMLFiles();
                }
            }
        })
    );

    // Cancel active parse when a document is closed mid-flight
    // Also clear Model Explorer if no SysML files remain open
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            if (document.languageId === 'sysml') {
                // Evict from per-file metrics cache
                metricsCache.delete(document.uri.toString());

                // Clear debounce timer so a pending parse doesn't start
                // after the document is already gone
                if (parseDebounceTimer) {
                    globalThis.clearTimeout(parseDebounceTimer);
                    parseDebounceTimer = undefined;
                }

                if (activeParseCancel) {
                    outputChannel.appendLine(`onDidCloseTextDocument: cancelling parse for ${document.fileName.split('/').pop()}`);
                    activeParseCancel.cancel();
                    activeParseCancel.dispose();
                    activeParseCancel = undefined;
                }

                // Clear the "Parsing …" status bar immediately — the
                // server may never send sysml/status end for a closed file.
                hideParseProgress();

                // Check if any SysML files remain open
                const remainingSysmlEditors = vscode.window.visibleTextEditors.filter(
                    e => e.document.languageId === 'sysml' && !e.document.isClosed && e.document !== document
                );
                if (remainingSysmlEditors.length === 0) {
                    // Hide the metrics status bar — no SysML file is active
                    hideModelMetrics();

                    // Show the workspace-wide model if a .code-workspace is
                    // open, otherwise clear both explorers.
                    if (vscode.workspace.workspaceFile) {
                        outputChannel.appendLine('onDidCloseTextDocument: no SysML files open, showing workspace model');
                        loadWorkspaceSysMLFiles();
                    } else {
                        outputChannel.appendLine('onDidCloseTextDocument: no SysML files open, clearing explorers');
                        modelExplorerProvider.clear();
                        vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', false);
                    }
                    // Always clear the Feature Explorer when no SysML editors remain
                    if (featureExplorerProvider) {
                        featureExplorerProvider.clear();
                    }
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'sysml') {
                // Re-parse for model explorer / visualization only.
                // Language features are handled by the LSP server.
                parseSysMLDocument(event.document);

                // Keep the model dashboard in sync while it's open.
                ModelDashboardPanel.currentPanel?.notifyFileChanged(event.document.uri);
            }
        })
    );

    // React to diagnostic changes (e.g. LSP validation results) so
    // the status bar icon/colour updates without needing a re-parse.
    context.subscriptions.push(
        vscode.languages.onDidChangeDiagnostics(event => {
            if (!lastMetricsStats || !lastMetricsUri) return;
            const uri = lastMetricsUri;
            const affected = event.uris.some(u => u.toString() === uri.toString());
            if (affected) {
                // Clear the dedup key so updateModelMetrics re-evaluates
                lastMetricsKey = undefined;
                updateModelMetrics(lastMetricsStats, lastMetricsUri);
            }
        })
    );

    // Trigger a visualization refresh on save — the LSP server may
    // need a moment to re-parse, so we add a short delay.  This
    // complements the onDidChangeTextDocument handler above which
    // covers typing, and the file system watcher below which covers
    // external changes.
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            if (document.languageId === 'sysml') {
                // Short delay gives the LSP server time to process the save.
                setTimeout(() => {
                    VisualizationPanel.currentPanel?.notifyFileChanged(document.uri);
                    ModelDashboardPanel.currentPanel?.notifyFileChanged(document.uri);
                }, 500);
            }
        })
    );

    // Watch for file system changes to SysML files
    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.sysml');

    context.subscriptions.push(fileSystemWatcher);

    context.subscriptions.push(
        fileSystemWatcher.onDidChange(uri => {
            outputChannel.appendLine(`SysML file changed: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
            ModelDashboardPanel.currentPanel?.notifyFileChanged(uri);
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidCreate(uri => {
            outputChannel.appendLine(`SysML file created: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
            ModelDashboardPanel.currentPanel?.notifyFileChanged(uri);
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidDelete(uri => {
            outputChannel.appendLine(`SysML file deleted: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
            ModelDashboardPanel.currentPanel?.notifyFileChanged(uri);
        })
    );
}

export function getOutputChannel(): vscode.OutputChannel {
    return outputChannel;
}

export function deactivate(): PromiseLike<void> | undefined {
    outputChannel?.appendLine('SysML v2.0 extension is now deactivated');

    // Clean up resources
    modelMetricsItem?.dispose();
    modelMetricsItem = undefined;
    parseProgressItem?.dispose();
    parseProgressItem = undefined;
    if (VisualizationPanel.currentPanel) {
        VisualizationPanel.currentPanel.dispose();
    }
    if (FeatureInspectorPanel.currentPanel) {
        FeatureInspectorPanel.currentPanel.dispose();
    }
    if (ModelDashboardPanel.currentPanel) {
        ModelDashboardPanel.currentPanel.dispose();
    }
    if (SysRunnerPanel.currentPanel) {
        SysRunnerPanel.currentPanel.dispose();
    }

    // Stop the language server
    return stopLanguageClient();
}
