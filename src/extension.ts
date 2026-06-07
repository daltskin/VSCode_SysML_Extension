import * as vscode from 'vscode';
import { FeatureExplorerProvider } from './explorer/featureExplorerProvider';
import { ModelExplorerProvider, ModelTreeItem } from './explorer/modelExplorerProvider';
import { SysRunnerPanel } from './game/sysRunnerPanel';
import { startLanguageClient, stopLanguageClient } from './lsp/client';
import { FeatureInspectorPanel } from './panels/featureInspectorPanel';
import { ModelDashboardPanel } from './panels/modelDashboardPanel';
import { ParseOrchestrator } from './parseOrchestrator';
import { LspModelProvider } from './providers/lspModelProvider';
import {
    clearMetricsKey,
    deleteCachedMetrics,
    disposeStatusBar,
    getCachedMetrics,
    getLastMetricsArgs,
    hideModelMetrics,
    hideParseProgress,
    setServerStats as setStatusBarServerStats,
    showMetricsLoading,
    showParseProgress,
    updateModelMetrics,
} from './statusBar';
import { VisualizationPanel } from './visualization/visualizationPanel';

// Re-export so client.ts (which does `require('../extension')`) still works
export { hideModelMetrics, hideParseProgress, showMetricsLoading, showParseProgress, updateModelMetrics } from './statusBar';

let modelExplorerProvider: ModelExplorerProvider;
let featureExplorerProvider: FeatureExplorerProvider;
let outputChannel: vscode.LogOutputChannel;
let lspModelProvider: LspModelProvider;
let parseOrchestrator: ParseOrchestrator;

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
 * Orchestration (debounce, cancellation, cooldown) is handled by
 * {@link ParseOrchestrator}.
 */
function parseSysMLDocument(document: vscode.TextDocument, options?: { skipProgress?: boolean }): void {
    // Invalidate the model cache so consumers get fresh data after the next parse
    lspModelProvider?.invalidateCache(document.uri.toString());
    parseOrchestrator.requestParse(document, options);
}

/**
 * Called when the LSP server signals that it has finished parsing a
 * file (`sysml/status` → `end`).  Re-triggers `parseSysMLDocument`
 * so the Model Explorer and Visualization panels pick up the newly
 * available model data — prevents the "0 elements" problem on cold
 * start when the DFA warm-up delays initial parsing.
 */
export function notifyServerParseDone(uri?: string): void {
    parseOrchestrator.notifyServerParseDone(uri);
}

/**
 * Register the SysML MCP (Model Context Protocol) stdio server.
 *
 * Desktop-only: spawns the bundled Node `mcpServer.js` so Copilot /
 * agent mode can discover SysML tools. Uses only `vscode` APIs (no
 * Node `fs`/`path`) so the extension bundle stays web-compatible.
 */
async function registerMcpServer(
    context: vscode.ExtensionContext,
    outputChannel: vscode.LogOutputChannel,
): Promise<void> {
    const mcpServerUri = vscode.Uri.joinPath(
        context.extensionUri,
        'node_modules', 'sysml-v2-lsp', 'dist', 'server', 'mcpServer.js',
    );

    try {
        await vscode.workspace.fs.stat(mcpServerUri);
    } catch {
        outputChannel.appendLine(`Warning: MCP server not found at ${mcpServerUri.fsPath}`);
        return;
    }

    const emitter = new vscode.EventEmitter<void>();
    context.subscriptions.push(emitter);
    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('sysml-v2-mcp', {
            onDidChangeMcpServerDefinitions: emitter.event,
            provideMcpServerDefinitions: async () => [
                new vscode.McpStdioServerDefinition(
                    'SysML v2 Model Context',
                    'node',
                    [mcpServerUri.fsPath],
                ),
            ],
        }),
    );
    outputChannel.appendLine(`MCP server registered: ${mcpServerUri.fsPath}`);
}

export function activate(context: vscode.ExtensionContext) {
    // Create dedicated output channel for logging
    outputChannel = vscode.window.createOutputChannel('SysML', { log: true });
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('SysML v2.0 extension is now active');
    outputChannel.show(true);  // Auto-show so the user can see LSP status

    // ─── MCP Server (register FIRST — independent of LSP) ─────────
    // The MCP server is a standalone Node stdio process, so it is only
    // available in the desktop extension host. On the web (vscode.dev)
    // there is no Node runtime to spawn it, so registration is skipped.
    if (vscode.env.uiKind === vscode.UIKind.Desktop) {
        void registerMcpServer(context, outputChannel);
    } else {
        outputChannel.appendLine('MCP server skipped (not supported in web extension host)');
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

    // ─── Parse Orchestrator ────────────────────────────────────────
    parseOrchestrator = new ParseOrchestrator(
        {
            showProgress: (f) => showParseProgress(f),
            hideProgress: () => hideParseProgress(),
            loadModelExplorer: (doc, token) => modelExplorerProvider.loadDocument(doc, token),
            revealInWorkspaceExplorer: (uri) => modelExplorerProvider.revealActiveDocument(uri),
            isWorkspaceMode: () => modelExplorerProvider.isWorkspaceMode(),
            getLastStats: () => modelExplorerProvider.getLastStats(),
            updateMetrics: (stats, uri) => updateModelMetrics(stats, uri),
            updateServerStats: async () => {
                const serverStats = await lspModelProvider.getServerStats();
                if (serverStats) setStatusBarServerStats(serverStats);
            },
            pushResolvedTypes: async (uri, token) => {
                if (!(FeatureInspectorPanel.currentPanel || featureExplorerProvider) || !lspModelProvider) return;
                const result = await lspModelProvider.getModel(uri, ['resolvedTypes'], token);
                if (result.resolvedTypes) {
                    FeatureInspectorPanel.currentPanel?.updateResolvedTypes(result.resolvedTypes, uri);
                    featureExplorerProvider?.pushResolvedTypes(uri, result.resolvedTypes);
                }
            },
            notifyVisualization: (uri) => VisualizationPanel.currentPanel?.notifyFileChanged(uri),
            log: (msg) => outputChannel?.appendLine(msg),
        },
        {
            getVisibleSysMLEditors: () =>
                vscode.window.visibleTextEditors
                    .filter(e => e.document.languageId === 'sysml' && !e.document.isClosed)
                    .map(e => ({ uri: e.document.uri.toString(), document: e.document })),
            getActiveSysMLEditor: () => {
                const e = vscode.window.activeTextEditor;
                if (e && e.document.languageId === 'sysml' && !e.document.isClosed) {
                    return { uri: e.document.uri.toString(), document: e.document };
                }
                return undefined;
            },
        },
    );

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
            showMetricsLoading(editor.document);
            parseSysMLDocument(editor.document);
            return true;
        }
        return false;
    }

    /**
     * Scan the workspace for all .sysml files and:
     * 1. Load the workspace-wide model into the Model Explorer.
     * 2. If a SysML file is currently active, reveal its elements.
     *
     * The LSP server already pre-parses workspace files in onInitialized,
     * so we don't need to open each file here (which would trigger O(n²)
     * didOpen/validateDocument calls on the server).
     */
    async function loadWorkspaceSysMLFiles(): Promise<void> {
        const files = await vscode.workspace.findFiles('**/*.sysml', '**/node_modules/**');
        if (files.length === 0) return;

        outputChannel.appendLine(`[workspace] Found ${files.length} SysML files`);
        vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);

        // Show loading indicator during the workspace model fetch
        showMetricsLoading(`${files.length} workspace files`);

        // Load the workspace-wide model so every file is visible
        outputChannel.appendLine('[workspace] Loading workspace model');
        await modelExplorerProvider.loadWorkspaceModel(files);

        // Update the status bar with workspace-wide metrics.
        // Use the active SysML editor URI when available, otherwise
        // pass undefined so the status bar still shows aggregated stats
        // even when no SysML file is focused.
        const wsStats = modelExplorerProvider.getLastStats();
        const editor = vscode.window.activeTextEditor;
        const metricsUri = editor?.document.languageId === 'sysml'
            ? editor.document.uri
            : undefined;
        if (wsStats) {
            updateModelMetrics(wsStats, metricsUri);
        }
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
                const cachedStats = getCachedMetrics(editor.document.uri.toString());
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
                deleteCachedMetrics(document.uri.toString());

                // Cancel any pending/in-flight parse for this document
                outputChannel.appendLine(`onDidCloseTextDocument: cancelling parse for ${document.fileName.split('/').pop()}`);
                parseOrchestrator.cancelAll();

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

    // ── Consolidated file-change notification ──
    // A single save can trigger onDidChangeTextDocument + onDidSaveTextDocument
    // + fileSystemWatcher.onDidChange — up to 3 redundant panel refreshes.
    // This debounced helper coalesces them into one notification per URI.
    const pendingFileNotifications = new Map<string, ReturnType<typeof setTimeout>>();
    function scheduleFileNotification(uri: vscode.Uri): void {
        const key = uri.toString();
        const existing = pendingFileNotifications.get(key);
        if (existing) clearTimeout(existing);
        pendingFileNotifications.set(key, setTimeout(() => {
            pendingFileNotifications.delete(key);
            VisualizationPanel.currentPanel?.notifyFileChanged(uri);
            ModelDashboardPanel.currentPanel?.notifyFileChanged(uri);
        }, 300));
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'sysml') {
                // Re-parse for model explorer / visualization only.
                // Language features are handled by the LSP server.
                parseSysMLDocument(event.document);

                // Schedule a debounced panel notification
                scheduleFileNotification(event.document.uri);
            }
        })
    );

    // React to diagnostic changes (e.g. LSP validation results) so
    // the status bar icon/colour updates without needing a re-parse.
    context.subscriptions.push(
        vscode.languages.onDidChangeDiagnostics(event => {
            const lastArgs = getLastMetricsArgs();
            if (!lastArgs || !lastArgs.uri) return;
            const uri = lastArgs.uri;
            const affected = event.uris.some(u => u.toString() === uri.toString());
            if (affected) {
                // Clear the dedup key so updateModelMetrics re-evaluates
                clearMetricsKey();
                updateModelMetrics(lastArgs.stats, lastArgs.uri);
            }
        })
    );

    // On save — coalesced via scheduleFileNotification
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            if (document.languageId === 'sysml') {
                scheduleFileNotification(document.uri);
            }
        })
    );

    // Watch for file system changes to SysML files — all events
    // feed into the same debounced notification helper.
    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.sysml');

    context.subscriptions.push(fileSystemWatcher);

    context.subscriptions.push(
        fileSystemWatcher.onDidChange(uri => {
            outputChannel.appendLine(`SysML file changed: ${uri.fsPath}`);
            scheduleFileNotification(uri);
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidCreate(uri => {
            outputChannel.appendLine(`SysML file created: ${uri.fsPath}`);
            scheduleFileNotification(uri);
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidDelete(uri => {
            outputChannel.appendLine(`SysML file deleted: ${uri.fsPath}`);
            scheduleFileNotification(uri);
        })
    );
}

export function getOutputChannel(): vscode.OutputChannel {
    return outputChannel;
}

export function deactivate(): PromiseLike<void> | undefined {
    outputChannel?.appendLine('SysML v2.0 extension is now deactivated');

    // Clean up resources
    disposeStatusBar();
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
