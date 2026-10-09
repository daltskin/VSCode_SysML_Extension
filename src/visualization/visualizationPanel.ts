import { diagramShell } from "./core/diagramShell";
import * as vscode from 'vscode';
import { convertModelElements, mergeModelElements } from './core/modelSnapshot';
import { LspModelProvider, toVscodeRange } from '../providers/lspModelProvider';
import { displayNamesById } from '../providers/modelNames';
import type { SysMLElementDTO } from '../providers/sysmlModelTypes';
import { telemetry } from '../telemetry';
import type { SysMLElement } from '../types/sysmlTypes';

export class VisualizationPanel {
    public static currentPanel: VisualizationPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private _isDisposed: boolean = false;
    private _currentView: string = 'elk'; // Store current view state - default to General View
    private _isNavigating: boolean = false; // Flag to prevent view reset during navigation
    private _fileChangeDebounceTimer: ReturnType<typeof setTimeout> | undefined; // Debounce file change notifications
    private _lastContentHash: string = ''; // Cache content hash to skip unchanged updates
    private _pendingUpdate: ReturnType<typeof setTimeout> | undefined; // Coalesce rapid updates
    private _needsUpdateWhenVisible: boolean = false; // Deferred update when panel is hidden
    private _lastViewColumn: vscode.ViewColumn | undefined; // Track view column to detect panel moves
    private _fileUris: vscode.Uri[] = []; // All source file URIs (for folder-level visualization)
    private _extensionVersion: string = '';
    private _pendingPackageName: string | undefined; // Package to select when data arrives

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,

        private _document: vscode.TextDocument,

        private _lspModelProvider: LspModelProvider,
        fileUris?: vscode.Uri[],
    ) {
        this._fileUris = fileUris ?? [];
        this._extensionVersion = vscode.extensions.getExtension('JamieD.sysml-v2-support')?.packageJSON?.version ?? '0.0.0';
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._lastViewColumn = panel.viewColumn;

        // When the panel becomes visible again or is moved (e.g. dragged to
        // a floating window), force a re-render so the visualizer recovers.
        this._panel.onDidChangeViewState(() => {
            const columnChanged = this._panel.viewColumn !== this._lastViewColumn;
            this._lastViewColumn = this._panel.viewColumn;

            if (this.isPanelVisible()) {
                if (this._needsUpdateWhenVisible || columnChanged) {
                    this._needsUpdateWhenVisible = false;
                    // Reset content hash so the update is not skipped
                    this._lastContentHash = '';
                    this.updateVisualization(true);
                }
            }
        }, null, this._disposables);

        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, extensionUri);

        // Request current view state from webview after initialization
        setTimeout(() => {
            this.postMessageSafe({ command: 'requestCurrentView' });
        }, 100);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'webviewLog':
                        // Forward webview console logs to VS Code output channel
                        this.logWebviewMessage(message.level, message.args);
                        break;
                    case 'jumpToElement':
                        this.jumpToElement(message.elementName, message.skipCentering, message.parentContext);
                        break;
                    case 'renameElement':
                        this.renameElement(message.oldName, message.newName);
                        break;
                    case 'export':
                        void this.handleExport(message.format, message.data).catch(() => {
                            telemetry?.operation('visualizer', 'export', 'failure');
                            telemetry?.error('visualizer', 'export', 'export-failed');
                            void vscode.window.showErrorMessage('Unable to export the visualization.');
                        });
                        break;
                    case 'executeCommand':
                        if (message.args && message.args.length > 0) {
                            const cmd = message.args[0];
                            const allowedCommands = [
                                'sysml.showModelDashboard',
                                'sysml.showModelWorkbench',
                                'sysml.showSysRunner',
                            ];
                            if (!allowedCommands.includes(cmd)) {
                                // eslint-disable-next-line no-console
                                console.warn(`[SysML Visualizer] Blocked disallowed command: ${cmd}`);
                                break;
                            }
                            if (cmd === 'sysml.showModelDashboard' || cmd === 'sysml.showModelWorkbench') {
                                // Pass a file URI so the dashboard can load data
                                // even when no text editor is active (webview is focused).
                                const dashboardUri = this._fileUris.length > 0
                                    ? this._fileUris[0]
                                    : this._document.uri;
                                setTimeout(() => {
                                    vscode.commands.executeCommand(cmd, dashboardUri);
                                }, 100);
                            } else {
                                const cmdArgs = message.args.slice(1);
                                setTimeout(() => {
                                    vscode.commands.executeCommand(cmd, ...cmdArgs);
                                }, 100);
                            }
                        }
                        break;
                    case 'viewChanged':
                        // Store the current view state when it changes
                        this._currentView = message.view;
                        telemetry?.operation('visualizer', 'change-view', 'success', undefined, message.view);
                        break;
                    case 'openExternal':
                        if (message.url) {
                            vscode.env.openExternal(vscode.Uri.parse(message.url));
                        }
                        break;
                    case 'currentViewResponse':
                        // Update our stored view state with the current webview state
                        this._currentView = message.view;
                        break;
                    case 'webviewReady':
                        // Webview (re)initialized — push current model data
                        this._lastContentHash = '';
                        this.updateVisualization(true);
                        break;
                }
            },
            null,
            this._disposables
        );

        this.updateVisualization();
    }

    public static createOrShow(extensionUri: vscode.Uri, document: vscode.TextDocument, customTitle?: string, lspModelProvider?: LspModelProvider, fileUris?: vscode.Uri[]): void {
        // Determine the best column layout for side-by-side viewing
        const activeColumn = vscode.window.activeTextEditor?.viewColumn;
        let visualizerColumn: vscode.ViewColumn;

        if (activeColumn === vscode.ViewColumn.One) {
            visualizerColumn = vscode.ViewColumn.Two;
        } else if (activeColumn === vscode.ViewColumn.Two) {
            visualizerColumn = vscode.ViewColumn.Three;
        } else {
            // Default: put visualizer on the right
            visualizerColumn = vscode.ViewColumn.Beside;
        }

        const title = customTitle || 'SysML Model Visualizer';

        if (VisualizationPanel.currentPanel) {
            // If panel exists, update title and reveal it
            VisualizationPanel.currentPanel._panel.title = title;
            VisualizationPanel.currentPanel._panel.reveal(visualizerColumn);
            telemetry?.panelOpened('visualizer');
            if (lspModelProvider) {
                VisualizationPanel.currentPanel._lspModelProvider = lspModelProvider;
            }
            // Track whether file URIs changed (folder→folder or file→folder)
            let fileUrisChanged = false;
            if (fileUris) {
                const oldSet = new Set(VisualizationPanel.currentPanel._fileUris.map(u => u.toString()));
                const newSet = new Set(fileUris.map(u => u.toString()));
                fileUrisChanged = oldSet.size !== newSet.size
                    || [...newSet].some(u => !oldSet.has(u));
                VisualizationPanel.currentPanel._fileUris = fileUris;
            }
            // Update if the document changed OR the set of file URIs changed
            if (VisualizationPanel.currentPanel._document !== document || fileUrisChanged) {
                VisualizationPanel.currentPanel._document = document;
                VisualizationPanel.currentPanel._lastContentHash = ''; // force re-parse
                VisualizationPanel.currentPanel.updateVisualization(true);
            }
            return;
        }

        if (!lspModelProvider) {
            return;  // Cannot create panel without an LSP model provider
        }

        const panel = vscode.window.createWebviewPanel(
            'sysmlVisualizer',
            title,
            visualizerColumn,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media')
                ]
            }
        );

        VisualizationPanel.currentPanel = new VisualizationPanel(panel, extensionUri, document, lspModelProvider, fileUris);
        telemetry?.panelOpened('visualizer');
    }

    public exportVisualization(format: string, scale: number = 2) {
        this.postMessageSafe({ command: 'export', format: format.toLowerCase(), scale });
    }

    private isPanelVisible(): boolean {
        if (this._isDisposed) {
            return false;
        }

        try {
            return this._panel.visible;
        } catch {
            return false;
        }
    }

    private postMessageSafe(message: unknown): void {
        if (this._isDisposed) {
            return;
        }

        try {
            this._panel.webview.postMessage(message);
        } catch {
            // Ignore races where the webview is disposed between scheduling and send.
        }
    }

    // Simple hash function for content comparison
    private hashContent(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    private async updateVisualization(forceUpdate: boolean = false) {
        if (this._isDisposed) {
            return;
        }

        // Skip update if we're currently navigating to prevent view reset
        if (this._isNavigating) {
            return;
        }

        // Defer work when the panel is not visible (e.g. user switched tabs)
        if (!this.isPanelVisible()) {
            this._needsUpdateWhenVisible = true;
            return;
        }

        // Check content hash first - skip expensive parsing if content unchanged
        const content = this._document.getText();
        const contentHash = this.hashContent(content);

        if (!forceUpdate && contentHash === this._lastContentHash) {
            // Content unchanged, skip update entirely
            return;
        }
        this._lastContentHash = contentHash;

        // Tell the webview to show loading indicator immediately
        this.postMessageSafe({ command: 'showLoading', message: 'Parsing SysML model...' });

        // Yield to the event loop so the webview can render the loading state
        // before the synchronous ANTLR parse blocks the extension host
        await new Promise(resolve => setTimeout(resolve, 0));

        await this._doUpdateVisualization();
    }

    private async _doUpdateVisualization() {
        try {
            // Determine which URIs to query: if we have multiple source
            // file URIs (folder-level visualization) query each of them;
            // otherwise fall back to the single document URI.
            const urisToQuery = this._fileUris.length > 0
                ? this._fileUris.map(u => u.toString())
                : [this._document.uri.toString()];

            const scopes: ('elements' | 'relationships' | 'sequenceDiagrams' | 'activityDiagrams')[] =
                ['elements', 'relationships', 'sequenceDiagrams', 'activityDiagrams'];

            // Fetch models for all URIs in parallel
            const results = await Promise.all(
                urisToQuery.map(uri => this._lspModelProvider.getModel(uri, scopes)),
            );

            // Merge results from all files
            const allElements: SysMLElementDTO[] = [];
            const allRelationships: unknown[] = [];
            const allSequenceDiagrams: unknown[] = [];
            const allActivityDiagrams: unknown[] = [];

            for (const result of results) {
                if (result.elements) { allElements.push(...result.elements); }
                if (result.relationships) { allRelationships.push(...(result.relationships as unknown[])); }
                if (result.sequenceDiagrams) { allSequenceDiagrams.push(...(result.sequenceDiagrams as unknown[])); }
                if (result.activityDiagrams) { allActivityDiagrams.push(...(result.activityDiagrams as unknown[])); }
            }

            // Current LSPs emit grammar-derived transition relationships.
            // Retain the source scanner as a compatibility fallback for older
            // servers and transition shorthands not represented as symbols.
            // De-duplicate against authoritative relationships so an edge is
            // never drawn twice.
            const existingTransitionKeys = new Set(
                allRelationships
                    .map(r => r as { type?: string; source?: string; target?: string })
                    .filter(r => String(r.type ?? '').toLowerCase().includes('transition'))
                    .map(r => `${r.source}->${r.target}`),
            );
            const texts = await Promise.all(urisToQuery.map(uri => this._getTextForUri(uri)));
            for (const text of texts) {
                for (const rel of VisualizationPanel.extractTransitionRelationships(text)) {
                    const key = `${rel.source}->${rel.target}`;
                    if (!existingTransitionKeys.has(key)) {
                        existingTransitionKeys.add(key);
                        allRelationships.push(rel);
                    }
                }
                for (const rel of VisualizationPanel.extractInitialTransitions(text)) {
                    const key = `${rel.source}->${rel.target}`;
                    if (!existingTransitionKeys.has(key)) {
                        existingTransitionKeys.add(key);
                        allRelationships.push(rel);
                    }
                }
                for (const rel of VisualizationPanel.extractSuccessionTransitions(text)) {
                    const key = `${rel.source}->${rel.target}`;
                    if (!existingTransitionKeys.has(key)) {
                        existingTransitionKeys.add(key);
                        allRelationships.push(rel);
                    }
                }
            }

            // SysML v2 allows the same package to be declared across multiple
            // files — their members merge into a single namespace.  Coalesce
            // same-named package DTOs so the webview sees one unified tree.
            const mergedElements = VisualizationPanel.mergeElementDTOs(allElements);

            // DTOs are already plain JSON — convert elements to the
            // shape the webview expects (add id / properties / typing).
            const jsonElements = convertModelElements(mergedElements);

            const msg: Record<string, unknown> = {
                command: 'update',
                elements: jsonElements,
                relationships: allRelationships,
                sequenceDiagrams: allSequenceDiagrams,
                activityDiagrams: allActivityDiagrams,
                currentView: this._currentView,
            };
            if (this._pendingPackageName) {
                msg.pendingPackageName = this._pendingPackageName;
                this._pendingPackageName = undefined;
            }
            this.postMessageSafe(msg);
        } catch {
            // LSP model request failed — hide the loading overlay so the
            // webview doesn't stay stuck on "Parsing SysML model...".
            this.postMessageSafe({ command: 'hideLoading' });
        }
    }

    /**
     * Return the text for a queried URI.  Uses the already-open primary
     * document when possible, otherwise opens the document on demand
     * (folder-level visualization queries multiple files).
     */
    private async _getTextForUri(uriStr: string): Promise<string> {
        if (uriStr === this._document.uri.toString()) {
            return this._document.getText();
        }
        try {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(uriStr));
            return doc.getText();
        } catch {
            return '';
        }
    }

    /**
     * Extract state-machine transitions from raw SysML source.
     *
    * Compatibility fallback for servers that do not expose transition
    * relationships. This lightweight scanner recovers edges directly from
    * the text, supporting both the
     * inline form (`transition first S then T;`) and the named/multi-line
     * form (`transition name first S accept Trig then T;`).  The optional
     * `accept` trigger becomes the transition label.
     */
    public static extractTransitionRelationships(
        text: string,
    ): { type: string; source: string; target: string; name: string }[] {
        // Strip comments so keywords inside them are never matched.
        const cleaned = text
            .replace(/\/\/[^\n]*/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ');

        // A reference is either a single-quoted name (may contain spaces) or
        // a plain/qualified/dotted identifier.
        const ref = "('[^']*'|[A-Za-z_][\\w.:]*)";
        const firstRe = new RegExp(`\\bfirst\\s+${ref}`);
        const thenRe = new RegExp(`\\bthen\\s+${ref}`);
        const acceptRe = new RegExp(`\\baccept\\s+${ref}`);

        const stripQuotes = (s: string): string =>
            s.startsWith("'") && s.endsWith("'") ? s.slice(1, -1) : s;

        const out: { type: string; source: string; target: string; name: string }[] = [];
        // Each transition declaration runs from the `transition` keyword to
        // the terminating semicolon.
        const transitionRe = /\btransition\b([\s\S]*?);/g;
        let m: RegExpExecArray | null;
        while ((m = transitionRe.exec(cleaned)) !== null) {
            const body = m[1];
            const first = firstRe.exec(body);
            const then = thenRe.exec(body);
            if (first && then) {
                const accept = acceptRe.exec(body);
                out.push({
                    type: 'transition',
                    source: stripQuotes(first[1]),
                    target: stripQuotes(then[1]),
                    name: accept ? stripQuotes(accept[1]) : '',
                });
            }
        }
        return out;
    }

    /**
     * Sentinel name used as the `source` of an initial transition so the
     * State Transition View can render it as an initial pseudostate
     * (`[*] → firstState`).  Kept unlikely to collide with a real name.
     */
    public static readonly INITIAL_PSEUDOSTATE = '__sysml_initial__';

    /**
     * Extract initial (entry) transitions from raw SysML source.
     *
     * A state machine's entry point is written as `entry; then FirstState;`
     * (or `entry then FirstState`).  The LSP does not surface this as an
     * edge, so we recover it and represent it as a transition from the
     * initial pseudostate to the first state — mirroring `[*] --> First`
     * in a UML/Mermaid state diagram.
     */
    public static extractInitialTransitions(
        text: string,
    ): { type: string; source: string; target: string; name: string }[] {
        const cleaned = text
            .replace(/\/\/[^\n]*/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ');

        const ref = "('[^']*'|[A-Za-z_][\\w.:]*)";
        const stripQuotes = (s: string): string =>
            s.startsWith("'") && s.endsWith("'") ? s.slice(1, -1) : s;

        const out: { type: string; source: string; target: string; name: string }[] = [];
        // `entry` optionally followed by an entry action up to its `;`, then
        // the `then <target>` succession that names the first state.
        const entryRe = new RegExp(`\\bentry\\b(?:[^;]*;)?\\s*then\\s+${ref}`, 'g');
        let m: RegExpExecArray | null;
        while ((m = entryRe.exec(cleaned)) !== null) {
            out.push({
                type: 'transition',
                source: VisualizationPanel.INITIAL_PSEUDOSTATE,
                target: stripQuotes(m[1]),
                name: '',
            });
        }
        return out;
    }

    /**
     * Extract `then`-succession transitions between states.
     *
     * SysML lets successions be written as a chain of state declarations
     * joined by `then` (e.g. `state idle; then state active; then state
     * fault;`), which imply the transitions idle → active → fault.  These
     * carry no `transition` keyword, so they are missed by
     * {@link extractTransitionRelationships}.  Only successions whose
     * endpoints are both declared states are emitted, so action-flow
     * successions (`then action …`) and other `then` uses are ignored.
     * Explicit `transition` statements and `entry` initial transitions are
     * skipped here (handled by the other extractors).
     */
    public static extractSuccessionTransitions(
        text: string,
    ): { type: string; source: string; target: string; name: string }[] {
        const cleaned = text
            .replace(/\/\/[^\n]*/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ');

        const ref = "('[^']*'|[A-Za-z_][\\w.:]*)";
        const stripQuotes = (s: string): string =>
            s.startsWith("'") && s.endsWith("'") ? s.slice(1, -1) : s;
        const simple = (name: string): string => {
            const right = name.split('::').pop() ?? name;
            return right.split('.').pop() ?? right;
        };

        // Pass 1 — collect the names of declared states.
        const declared = new Set<string>();
        const declRe = new RegExp(`\\bstate\\s+(?!def\\b)${ref}|\\bthen\\s+state\\s+${ref}`, 'g');
        let dm: RegExpExecArray | null;
        while ((dm = declRe.exec(cleaned)) !== null) {
            const nm = stripQuotes(dm[1] ?? dm[2] ?? '');
            if (nm) { declared.add(simple(nm)); }
        }
        if (declared.size === 0) { return []; }

        // Pass 2 — walk tokens, tracking the current source state per brace
        // scope, and emit an edge for each `then` between two declared states.
        const out: { type: string; source: string; target: string; name: string }[] = [];
        const tokenRe = new RegExp(
            `(\\{)|(\\})|\\btransition\\b|\\bentry\\b|\\bfirst\\s+${ref}`
            + `|\\bthen\\s+(?:state\\s+)?${ref}|\\bstate\\s+(?!def\\b)${ref}`,
            'g',
        );
        const stack: (string | null)[] = [];
        let current: string | null = null;
        let pendingFirst: string | null = null;
        let entryInitial = false;

        let m: RegExpExecArray | null;
        while ((m = tokenRe.exec(cleaned)) !== null) {
            const tok = m[0];
            if (m[1]) { stack.push(current); current = null; pendingFirst = null; continue; }
            if (m[2]) { current = stack.pop() ?? null; pendingFirst = null; continue; }
            if (/^transition\b/.test(tok)) {
                // Skip the whole transition statement (handled elsewhere).
                const semi = cleaned.indexOf(';', tokenRe.lastIndex);
                tokenRe.lastIndex = semi === -1 ? cleaned.length : semi + 1;
                pendingFirst = null;
                continue;
            }
            if (/^entry\b/.test(tok)) { entryInitial = true; pendingFirst = null; continue; }
            if (m[3] !== undefined) { pendingFirst = simple(stripQuotes(m[3])); continue; }
            if (m[4] !== undefined) {
                const target = simple(stripQuotes(m[4]));
                const source = pendingFirst ?? current;
                if (entryInitial) {
                    // Initial transition — handled by extractInitialTransitions.
                    entryInitial = false;
                } else if (source && declared.has(source) && declared.has(target)) {
                    out.push({ type: 'transition', source, target, name: '' });
                }
                current = target;
                pendingFirst = null;
                continue;
            }
            if (m[5] !== undefined) {
                current = simple(stripQuotes(m[5]));
                pendingFirst = null;
            }
        }
        return out;
    }

    /**
     * Convert LSP DTO elements into the JSON shape the webview expects.
     * DTOs already use Record attributes (no Map → Record conversion needed)
     * and have no circular parentElement references.
     *
     * `typing` is derived from the DTO's `attributes` (partType / portType)
     * or from a `typing` relationship — matching the ANTLR parser's
     * `(element as any).typing` property that the webview views rely on.
     */
    private convertDTOElementsToJSON(
        elements: SysMLElementDTO[],
        parentName?: string,
        displayNames: ReadonlyMap<string, string> = displayNamesById(elements),
    ): unknown[] {
        return convertModelElements(elements, parentName, displayNames);
    }

    /**
     * Merge same-named package DTOs so that packages declared across
     * multiple files appear as a single node with combined children.
     */
    private static mergeElementDTOs(elements: SysMLElementDTO[]): SysMLElementDTO[] {
        return mergeModelElements(elements);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private logWebviewMessage(level: string, args: any[]) {
        try {
            const { getOutputChannel } = require('../extension');
            const outputChannel = getOutputChannel();
            if (!outputChannel) {
                return;
            }

            // Format the message
            const formattedArgs = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');

            const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
            outputChannel.appendLine(`[Webview ${level.toUpperCase()}] ${prefix} ${formattedArgs}`);
        } catch (error) {
            // Silently fail if output channel not available
            // eslint-disable-next-line no-console
            console.error('Failed to log webview message:', error);
        }
    }

    private async jumpToElement(elementName: string, skipCentering: boolean = false, parentContext?: string) {
        this._isNavigating = true; // Set navigation flag

        let element: SysMLElement | undefined;

        const dto = await this._lspModelProvider.findElement(
            this._document.uri.toString(),
            elementName,
            parentContext,
        );
        if (dto) {
            // Wrap DTO in a minimal SysMLElement-compatible shape for
            // the navigation code below (only range is needed).
            element = {
                type: dto.type,
                name: dto.name,
                range: toVscodeRange(dto.range),
                children: [],
                attributes: new Map(),
                relationships: [],
            };
        }

        if (element) {
            // Determine the appropriate column for the text editor
            // If visualizer is in column 2, open text in column 1, and vice versa
            const visualizerColumn = this._panel.viewColumn || vscode.ViewColumn.Two;
            const targetColumn = visualizerColumn === vscode.ViewColumn.One
                ? vscode.ViewColumn.Two
                : vscode.ViewColumn.One;

            // Open the document in the target column without stealing focus
            vscode.window.showTextDocument(this._document, {
                viewColumn: targetColumn,
                preserveFocus: true, // This prevents the text editor from stealing focus
                preview: false // Ensure it opens in a permanent editor tab
            }).then(editor => {
                // Navigate to the element
                editor.selection = new vscode.Selection(element.range.start, element.range.end);
                editor.revealRange(element.range, vscode.TextEditorRevealType.InCenter);

                // Create a more prominent highlight for the selected element
                const decorationType = vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255, 215, 0, 0.4)', // Gold background
                    border: '2px solid #FFD700', // Gold border
                    borderRadius: '3px',
                    isWholeLine: false,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
                });

                editor.setDecorations(decorationType, [element.range]);

                // Clear the highlight after 3 seconds
                setTimeout(() => {
                    decorationType.dispose();
                }, 3000);

                // Send a message back to the webview to highlight the clicked element
                // Only send if click didn't originate from the diagram (skipCentering=false)
                // When skipCentering=true, the diagram already highlighted the element
                if (!skipCentering) {
                    this.postMessageSafe({
                        command: 'highlightElement',
                        elementName: elementName,
                        skipCentering: skipCentering
                    });
                }

                // Clear navigation flag after a delay
                setTimeout(() => {
                    this._isNavigating = false;
                }, 500);
            });
        } else {
            // If element not found, show a message but don't change focus
            vscode.window.showInformationMessage(`Element "${elementName}" not found in the current document.`);
            this._isNavigating = false;
        }
    }

    private findElementRecursive(name: string, elements: SysMLElement[]): SysMLElement | undefined {
        for (const element of elements) {
            if (element.name === name) {
                return element;
            }
            if (element.children && element.children.length > 0) {
                const found = this.findElementRecursive(name, element.children);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }

    private async renameElement(oldName: string, newName: string) {
        // Validate new name
        if (!newName || newName === oldName) {
            return;
        }

        // Check if new name is a valid SysML identifier (alphanumeric, underscore, starting with letter/underscore)
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newName)) {
            vscode.window.showErrorMessage(`Invalid element name: "${newName}". Names must start with a letter or underscore and contain only alphanumeric characters and underscores.`);
            // Refresh the view to restore original name
            this.updateVisualization(true);
            return;
        }

        // Find the element to rename via LSP
        let element: SysMLElement | undefined;
        const dto = await this._lspModelProvider.findElement(
            this._document.uri.toString(),
            oldName,
        );
        if (dto) {
            element = {
                type: dto.type,
                name: dto.name,
                range: toVscodeRange(dto.range),
                children: [],
                attributes: new Map(),
                relationships: [],
            };
        }

        if (!element || !element.range) {
            vscode.window.showErrorMessage(`Could not find element "${oldName}" to rename.`);
            this.updateVisualization(true);
            return;
        }

        // Find the name within the element's definition line
        const text = this._document.getText();
        const elementStartOffset = this._document.offsetAt(element.range.start);
        const elementEndOffset = this._document.offsetAt(element.range.end);
        const elementText = text.substring(elementStartOffset, elementEndOffset);

        // Find the name in the element text - it's usually after the type keyword
        // Pattern: type keyword followed by the name (e.g., "part def Vehicle", "part car", "attribute mass")
        const namePattern = new RegExp(`\\b${this.escapeRegex(oldName)}\\b`);
        const nameMatch = elementText.match(namePattern);

        if (!nameMatch || nameMatch.index === undefined) {
            vscode.window.showErrorMessage(`Could not locate name "${oldName}" in the element definition.`);
            this.updateVisualization(true);
            return;
        }

        // Calculate the absolute position of the name in the document
        const nameStartOffset = elementStartOffset + nameMatch.index;
        const nameEndOffset = nameStartOffset + oldName.length;
        const nameRange = new vscode.Range(
            this._document.positionAt(nameStartOffset),
            this._document.positionAt(nameEndOffset)
        );

        // Apply the edit
        const edit = new vscode.WorkspaceEdit();
        edit.replace(this._document.uri, nameRange, newName);

        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
            // Save the document to trigger re-parse
            await this._document.save();
            vscode.window.showInformationMessage(`Renamed "${oldName}" to "${newName}"`);
        } else {
            vscode.window.showErrorMessage(`Failed to rename "${oldName}"`);
            this.updateVisualization(true);
        }
    }

    private escapeRegex(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private async handleExport(format: string, data: string) {
        const started = Date.now();
        const filters: { [key: string]: string[] } = {
            'PNG Images': ['png'],
            'SVG Images': ['svg'],
            'JSON Files': ['json']
        };

        // Determine default save location:
        //   1. Folder of the source document
        //   2. Folder of the first file URI (multi-file visualization)
        //   3. Folder of the currently active editor
        //   4. First workspace folder
        let defaultFolder: vscode.Uri | undefined;
        if (this._document?.uri?.scheme === 'file' && this._document.uri.fsPath) {
            defaultFolder = vscode.Uri.joinPath(this._document.uri, '..');
        }
        if (!defaultFolder && this._fileUris.length > 0) {
            defaultFolder = vscode.Uri.joinPath(this._fileUris[0], '..');
        }
        if (!defaultFolder) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor?.document.uri.scheme === 'file') {
                defaultFolder = vscode.Uri.joinPath(activeEditor.document.uri, '..');
            }
        }
        if (!defaultFolder && vscode.workspace.workspaceFolders?.length) {
            defaultFolder = vscode.workspace.workspaceFolders[0].uri;
        }

        const defaultUri = defaultFolder
            ? vscode.Uri.joinPath(defaultFolder, `sysml-model.${format}`)
            : vscode.Uri.file(`sysml-model.${format}`);

        const uri = await vscode.window.showSaveDialog({
            filters: filters,
            defaultUri: defaultUri
        });

        if (uri) {
            let buffer: Buffer;

            if (format === 'json') {
                // JSON data is already a data URL, extract the content
                if (data.startsWith('data:')) {
                    buffer = Buffer.from(data.split(',')[1], 'base64');
                } else {
                    // Direct JSON string
                    buffer = Buffer.from(data, 'utf8');
                }
            } else {
                // PNG/SVG/PDF - all come as data URLs now, extract from base64
                if (data.startsWith('data:')) {
                    buffer = Buffer.from(data.split(',')[1], 'base64');
                } else {
                    // Fallback for raw data
                    buffer = Buffer.from(data, 'utf8');
                }
            }

            await vscode.workspace.fs.writeFile(uri, buffer);
            vscode.window.showInformationMessage(`Visualization exported to ${uri.fsPath}`);
        }
        telemetry?.operation('visualizer', 'export', uri ? 'success' : 'cancelled',
            Date.now() - started);
    }

    public getDocument(): vscode.TextDocument {
        return this._document;
    }

    /** Update the LspModelProvider. */
    public setLspModelProvider(provider: LspModelProvider): void {
        this._lspModelProvider = provider;
    }

    public changeView(viewId: string): void {
        this.postMessageSafe({
            command: 'changeView',
            view: viewId
        });
        this._currentView = viewId;
    }

    public selectPackage(packageName: string): void {
        // Store as pending so the next data message carries it to the webview
        this._pendingPackageName = packageName;
        this._currentView = 'elk';
        // Also post directly in case the webview already has data
        this.postMessageSafe({
            command: 'selectPackage',
            packageName: packageName
        });
    }

    public notifyFileChanged(uri: vscode.Uri) {
        // Always force — the LSP server parses asynchronously, so the
        // model data may have changed even when the document text hasn't
        // (e.g. after a sysml/status 'end' notification).
        const uriStr = uri.toString();
        const docUri = this._document.uri.toString();
        const isTracked = docUri === uriStr
            || this._fileUris.some(u => u.toString() === uriStr);

        if (isTracked) {
            // Debounce: coalesce multiple notifications from
            // onDidChangeTextDocument, onDidSaveTextDocument, and the
            // file-system watcher into a single visualizer refresh.
            if (this._fileChangeDebounceTimer) {
                clearTimeout(this._fileChangeDebounceTimer);
            }
            this._fileChangeDebounceTimer = setTimeout(() => {
                this._fileChangeDebounceTimer = undefined;
                if (this._isDisposed) {
                    return;
                }
                this.updateVisualization(true);
            }, 150);
        }
    }

    public dispose() {
        if (this._isDisposed) {
            return;
        }

        this._isDisposed = true;
        VisualizationPanel.currentPanel = undefined;

        if (this._fileChangeDebounceTimer) {
            clearTimeout(this._fileChangeDebounceTimer);
            this._fileChangeDebounceTimer = undefined;
        }

        if (this._pendingUpdate) {
            clearTimeout(this._pendingUpdate);
            this._pendingUpdate = undefined;
        }

        try {
            this._panel.dispose();
        } catch {
            // Already disposed by VS Code.
        }

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }


    private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        return diagramShell(webview, extensionUri, this._extensionVersion);
    }
}
