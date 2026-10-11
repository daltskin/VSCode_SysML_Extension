import * as vscode from 'vscode';
import {
    answerArchitectureQuestion, buildArchitectureGraph,
    type ArchitectureGraph, type ArchitectureQuestion
} from '../architecture/architectureGraph';
import { LspModelProvider, toVscodeRange } from '../providers/lspModelProvider';
import { checkCancelled, checkLimit, sourceLoadingBudgetBytes, textBytes, withModelProgress } from '../resourceLimits';
import { telemetry } from '../telemetry';
import { operations } from '../telemetry/telemetryService';

/** Read-only, source-backed engineering queries shared by desktop and browser hosts. */
export class ArchitectureExplorerPanel {
    static currentPanel: ArchitectureExplorerPanel | undefined;
    private readonly disposables: vscode.Disposable[] = [];
    private readonly uris = new Map<string, vscode.Uri>();
    private graph: ArchitectureGraph | undefined;
    private revision = 0;
    private generation = 0;
    private disposed = false;
    private loadCancellation?: vscode.CancellationTokenSource;
    private timer: ReturnType<typeof setTimeout> | undefined;
    private refreshing: Promise<void> | undefined;
    private refreshAgain = false;
    private selection?: { uri: string; position?: vscode.Position };

    private constructor(
        private readonly panel: vscode.WebviewPanel,
        private readonly provider: LspModelProvider,
        extensionUri: vscode.Uri,
    ) {
        panel.webview.onDidReceiveMessage((message: unknown) => void this.receive(message),
            null, this.disposables);
        panel.onDidDispose(() => this.dispose(), null, this.disposables);
        vscode.workspace.onDidChangeTextDocument(event => {
            if (!this.uris.has(event.document.uri.toString())) return;
            this.graph = undefined;
            this.revision++;
            this.generation++;
            this.loadCancellation?.cancel();
            this.provider.invalidateCache(event.document.uri.toString());
            void this.post({ command: 'invalidated' });
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => void this.refresh(), 250);
        }, null, this.disposables);
        panel.webview.html = ArchitectureExplorerPanel.html(panel.webview, extensionUri);
    }

    /** Open models at a code, explorer, or diagram selection. */
    static async createOrShow(
        extensionUri: vscode.Uri, provider: LspModelProvider, uri?: vscode.Uri,
        position?: vscode.Position, files?: readonly vscode.Uri[],
    ): Promise<void> {
        try {
            const editor = vscode.window.activeTextEditor;
            const target = uri ?? editor?.document.uri;
            if (!target) throw new Error('Open a SysML or KerML file or select a folder first.');
            const isFolder = target.scheme !== 'untitled'
                && ((await vscode.workspace.fs.stat(target)).type & vscode.FileType.Directory) !== 0;
            const targets = files ?? (isFolder ? await withModelProgress('Finding SysML model files', async (_progress, token) =>
                vscode.workspace.findFiles(new vscode.RelativePattern(target, '**/*.{sysml,kerml}'),
                    '**/{node_modules,.git}/**', undefined, token)) : [target]);
            if (!targets.length) throw new Error('No SysML or KerML files found.');
            if (targets.some(file => !/\.(sysml|kerml)$/i.test(file.path))) {
                throw new Error('Select SysML or KerML files.');
            }
            if (!this.currentPanel) {
                const panel = vscode.window.createWebviewPanel('sysmlArchitectureExplorer',
                    'SysML Architecture Explorer', vscode.ViewColumn.Beside, {
                        enableScripts: true, retainContextWhenHidden: true,
                        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
                    });
                this.currentPanel = new ArchitectureExplorerPanel(panel, provider, extensionUri);
            }
            const explorer = this.currentPanel;
            for (const file of targets) explorer.uris.set(file.toString(), file);
            explorer.selection = { uri: target.toString(),
                position: position ?? (editor?.document.uri.toString() === target.toString()
                    ? editor.selection.active : undefined) };
            explorer.panel.reveal(vscode.ViewColumn.Beside);
            telemetry?.panelOpened('architecture');
            await explorer.refresh();
        } catch (error) {
            void vscode.window.showErrorMessage(`Architecture Explorer: ${String(error)}`);
        }
    }

    /** Dispose subscriptions, deferred refreshes, and the webview. */
    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.loadCancellation?.cancel();
        this.generation++;
        if (this.timer) clearTimeout(this.timer);
        for (const disposable of this.disposables.splice(0)) disposable.dispose();
        if (ArchitectureExplorerPanel.currentPanel === this) ArchitectureExplorerPanel.currentPanel = undefined;
        this.panel.dispose();
    }

    private async post(message: object): Promise<void> {
        if (!this.disposed) await this.panel.webview.postMessage(message);
    }

    private async refresh(): Promise<void> {
        if (this.refreshing) { this.refreshAgain = true; return this.refreshing; }
        this.refreshing = this.load();
        try { await this.refreshing; } finally {
            this.refreshing = undefined;
            if (this.refreshAgain && !this.disposed) {
                this.refreshAgain = false;
                await this.refresh();
            }
        }
    }

    private async load(): Promise<void> {
        const generation = ++this.generation;
        this.loadCancellation?.cancel();
        const cancellation = new vscode.CancellationTokenSource();
        this.loadCancellation = cancellation;
        this.graph = undefined;
        await this.post({ command: 'invalidated' });
        try {
            await withModelProgress('Loading Architecture Explorer', async (progress, token) => {
            const documents = [];
            const budget = sourceLoadingBudgetBytes();
            let totalBytes = 0;
            for (const uri of this.uris.values()) {
                checkCancelled(token);
                if (generation !== this.generation || this.disposed) return;
                progress.report({ message: vscode.workspace.asRelativePath(uri) });
                const document = await vscode.workspace.openTextDocument(uri);
                if (budget) {
                    totalBytes += textBytes(document.getText());
                    checkLimit(totalBytes, budget, 'maxTotalBytes');
                }
                const version = document.version;
                const model = await this.provider.getModel(uri.toString(), ['elements', 'relationships'], token);
                checkCancelled(token);
                if (document.version !== version || model.version !== version) {
                    throw new Error('The model is catching up with source edits. Refresh to retry.');
                }
                documents.push({ uri: uri.toString(), label: vscode.workspace.asRelativePath(uri),
                    version, text: document.getText(), elements: model.elements ?? [], relationships: model.relationships ?? [] });
                progress.report({ increment: 100 / this.uris.size });
            }
            if (generation !== this.generation || this.disposed) return;
            const graph = buildArchitectureGraph(documents);
            this.graph = graph;
            const selection = this.selection;
            const candidates = graph.nodes.filter(node => node.uri === selection?.uri
                && (!selection.position || toVscodeRange(node.range).contains(selection.position)))
                .sort((left, right) => right.range.start.line - left.range.start.line
                    || right.range.start.character - left.range.start.character);
            this.revision++;
            await this.post({ command: 'snapshot', graph, revision: this.revision,
                selectedId: candidates[0]?.id });
            this.selection = undefined;
            }, cancellation.token, true);
        } catch (error) {
            if (generation === this.generation) await this.post({ command: 'error',
                message: error instanceof vscode.CancellationError ? 'Model loading cancelled.' : String(error) });
        } finally {
            if (this.loadCancellation === cancellation) this.loadCancellation = undefined;
            cancellation.dispose();
        }
    }

    private async receive(value: unknown): Promise<void> {
        const started = Date.now();
        let action: typeof operations.architecture[number] | undefined;
        try {
            if (!value || typeof value !== 'object') return;
            const message = value as Record<string, unknown>;
            if (message.command === 'ready') {
                if (this.refreshing) await this.refreshing;
                else if (!this.graph) await this.refresh();
                if (this.graph) await this.post({ command: 'snapshot', graph: this.graph,
                    revision: this.revision });
                return;
            }
            if (message.command === 'refresh') action = 'refresh';
            else if (message.command === 'addFiles') action = 'add-files';
            else if (message.command === 'navigate') action = 'navigate';
            else if (message.command === 'navigateEdge') action = 'navigate-edge';
            else if (message.command === 'query'
                && ['removal', 'requirements', 'connector', 'trace'].includes(String(message.question))) {
                action = message.question as ArchitectureQuestion;
            }
            if (message.command === 'refresh') {
                await this.refresh();
                if (action) telemetry?.operation('architecture', action,
                    this.graph ? 'success' : 'rejected', Date.now() - started);
                return;
            }
            if (message.command === 'addFiles') {
                const files = await vscode.window.showOpenDialog({ canSelectMany: true,
                    filters: { 'SysML / KerML': ['sysml', 'kerml'] }, openLabel: 'Load models' });
                if (!files?.length) {
                    telemetry?.operation('architecture', 'add-files', 'cancelled', Date.now() - started);
                    return;
                }
                for (const uri of files) {
                    if (!/\.(sysml|kerml)$/i.test(uri.path)) throw new Error('Select SysML or KerML files.');
                }
                for (const uri of files) this.uris.set(uri.toString(), uri);
                await this.refresh();
                telemetry?.operation('architecture', 'add-files',
                    this.graph ? 'success' : 'rejected', Date.now() - started);
                return;
            }
            if (!this.graph || message.revision !== this.revision) throw new Error('The model changed. Refresh and retry.');
            if (message.command === 'query') {
                if (!['removal', 'requirements', 'connector', 'trace'].includes(String(message.question))
                    || typeof message.selectedId !== 'string'
                    || (message.targetId !== undefined && typeof message.targetId !== 'string')
                    || !Number.isSafeInteger(message.requestId)) throw new Error('Invalid engineering query.');
                const graph = this.graph;
                const revision = this.revision;
                await withModelProgress('Tracing SysML architecture', async (_progress, token) => {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    checkCancelled(token);
                    if (graph !== this.graph || revision !== this.revision) {
                        throw new vscode.CancellationError();
                    }
                    const answer = answerArchitectureQuestion(graph, message.question as ArchitectureQuestion,
                        message.selectedId as string, message.targetId as string | undefined);
                    checkCancelled(token);
                    await this.post({ command: 'answer', answer, revision, requestId: message.requestId });
                });
            } else if (message.command === 'navigate') {
                const node = this.graph.nodes.find(candidate => candidate.id === message.id);
                if (!node) throw new Error('Element no longer exists.');
                const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(node.uri));
                if (document.version !== this.graph.documents.find(candidate => candidate.uri === node.uri)?.version) {
                    throw new Error('Refresh before navigating changed source.');
                }
                await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One,
                    selection: toVscodeRange(node.range) });
            } else if (message.command === 'navigateEdge') {
                const edge = this.graph.edges.find(candidate => candidate.id === message.id);
                if (!edge?.uri || !edge.range) throw new Error('No source location is available for this link.');
                const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(edge.uri));
                if (document.version !== this.graph.documents.find(candidate => candidate.uri === edge.uri)?.version) {
                    throw new Error('Refresh before navigating changed source.');
                }
                await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One,
                    selection: toVscodeRange(edge.range) });
            }
            if (action) telemetry?.operation('architecture', action, 'success', Date.now() - started);
        } catch (error) {
            if (action) telemetry?.operation('architecture', action,
                error instanceof vscode.CancellationError ? 'cancelled' : 'rejected', Date.now() - started);
            await this.post({ command: 'error', message: String(error) });
        }
    }

    /** CSP-restricted shell; model text is delivered only through structured messages. */
    static html(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const resource = (path: string) => webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', path));
        const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<link rel="stylesheet" href="${resource('vendor/codicon.css')}">
<link rel="stylesheet" href="${resource('webview/architectureExplorer.css')}">
<title>Architecture Explorer</title></head><body>
<header><h1>Architecture Explorer</h1><span id="scope"></span><div class="tools">
<button id="add-files" title="Load model files" aria-label="Load model files"><span class="codicon codicon-folder-opened"></span></button>
<button id="refresh" title="Refresh model" aria-label="Refresh model"><span class="codicon codicon-refresh"></span></button></div></header>
<div id="status" role="status" aria-live="polite">Loading model...</div>
<main><aside aria-label="Model elements"><input id="search" type="search" placeholder="Search elements" aria-label="Search elements">
<nav id="element-pages" class="pagination" aria-label="Element pages" hidden></nav><div id="elements"></div></aside><section class="workspace" aria-label="Engineering query">
<div class="query"><div class="subject"><strong id="selected">Select an element</strong>
<button id="source" title="Open selected source" aria-label="Open selected source" disabled><span class="codicon codicon-go-to-file"></span></button></div>
<label for="question">Question</label><select id="question">
<option value="removal">What breaks if I remove this?</option>
<option value="requirements">Show every requirement impacted by this element</option>
<option value="connector">Why does this connector exist?</option>
<option value="trace">Show the shortest trace to implementation</option></select>
<div id="target-field" hidden><label for="target">Implementation</label><select id="target"></select></div>
<button id="ask" disabled><span class="codicon codicon-search"></span>Analyze</button></div>
<div class="graph-toolbar"><span id="trace-count">Modeled trace</span><div class="tools">
<button id="replay" title="Replay trace" aria-label="Replay trace" disabled><span class="codicon codicon-debug-restart"></span></button>
<button id="stop" title="Stop animation" aria-label="Stop animation" disabled><span class="codicon codicon-debug-pause"></span></button>
<button id="fit" title="Fit graph" aria-label="Fit graph"><span class="codicon codicon-screen-full"></span></button></div></div>
<div id="graph" role="img" aria-label="Architecture trace graph"></div>
<section id="answer" aria-label="Engineering answer" aria-live="polite"><h2 id="answer-title"></h2>
<p id="summary"></p><nav id="finding-pages" class="pagination" aria-label="Finding pages" hidden></nav><ol id="findings"></ol><ul id="caveats"></ul></section>
</section></main><script nonce="${nonce}" src="${resource('vendor/cytoscape.min.js')}"></script>
<script nonce="${nonce}" src="${resource('webview/architectureExplorer.js')}"></script></body></html>`;
    }
}
