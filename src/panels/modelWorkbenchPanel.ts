import { unparse } from 'papaparse';
import * as vscode from 'vscode';
import { applySourceEdits } from '../modelEditing/modelEdits';
import {
    buildSnapshot, planOperation, previewChanges, type ModelSnapshot, type PlannedDocument,
    type WorkbenchOperation,
} from '../modelEditing/workbenchModel';
import { LspModelProvider } from '../providers/lspModelProvider';
import { telemetry } from '../telemetry';

/** Source-backed editing workspace shared by desktop and browser extension hosts. */
export class ModelWorkbenchPanel {
    static currentPanel: ModelWorkbenchPanel | undefined;
    private readonly disposables: vscode.Disposable[] = [];
    private readonly uris = new Map<string, vscode.Uri>();
    private snapshot: ModelSnapshot = { documents: [], rows: [], links: [] };
    private revision = 0;
    private generation = 0;
    private timer: ReturnType<typeof setTimeout> | undefined;
    private pending: { token: string; plans: PlannedDocument[] } | undefined;
    private applying = false;
    private disposed = false;

    private constructor(
        private readonly panel: vscode.WebviewPanel,
        private readonly provider: LspModelProvider,
        extensionUri: vscode.Uri,
        private packageName?: string,
    ) {
        panel.webview.html = ModelWorkbenchPanel.html(panel.webview, extensionUri);
        panel.onDidDispose(() => this.dispose(), null, this.disposables);
        panel.webview.onDidReceiveMessage((message: unknown) => {
            void this.receive(message);
        }, null, this.disposables);
        vscode.workspace.onDidChangeTextDocument(event => {
            if (!this.uris.has(event.document.uri.toString())) return;
            this.pending = undefined;
            this.provider.invalidateCache(event.document.uri.toString());
            void this.post({ command: 'invalidated' });
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => void this.refresh(), 250);
        }, null, this.disposables);
    }

    /** Open a file, folder, or selected model package in the workbench. */
    static async createOrShow(
        extensionUri: vscode.Uri, provider: LspModelProvider,
        uri?: vscode.Uri, packageName?: string,
    ): Promise<void> {
        try {
            const target = uri || vscode.window.activeTextEditor?.document.uri;
            if (!target) {
                throw new Error('Open a SysML or KerML file or select a folder first.');
            }
            const isFolder = target.scheme !== 'untitled'
                && ((await vscode.workspace.fs.stat(target)).type & vscode.FileType.Directory) !== 0;
            if (!isFolder && !/\.(sysml|kerml)$/i.test(target.path)) {
                throw new Error('Select a SysML or KerML file or a folder.');
            }
            const load = async () => {
                const targets = isFolder
                    ? await vscode.workspace.findFiles(
                        new vscode.RelativePattern(target, '**/*.{sysml,kerml}'),
                        '**/{node_modules,.git}/**',
                    ) : [target];
                if (!targets.length) {
                    void vscode.window.showInformationMessage('No SysML or KerML files found in this folder.');
                    return;
                }
                if (!this.currentPanel) {
                    const panel = vscode.window.createWebviewPanel('sysmlModelWorkbench',
                        'SysML Model Workbench', vscode.ViewColumn.Beside, {
                            enableScripts: true, retainContextWhenHidden: true,
                            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
                        });
                    this.currentPanel = new ModelWorkbenchPanel(panel, provider, extensionUri, packageName);
                }
                this.currentPanel.packageName = packageName;
                for (const file of targets) this.currentPanel.uris.set(file.toString(), file);
                this.currentPanel.panel.reveal(vscode.ViewColumn.Beside);
                telemetry?.panelOpened('workbench');
                await this.currentPanel.refresh();
            };
            if (isFolder) {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification, title: 'Loading SysML Workbench',
                }, load);
            } else {
                await load();
            }
        } catch (error) {
            void vscode.window.showErrorMessage(`Model Workbench: ${String(error)}`);
        }
    }

    /** Dispose timers, event subscriptions and the webview. */
    dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.generation++;
        if (this.timer) clearTimeout(this.timer);
        for (const disposable of this.disposables.splice(0)) disposable.dispose();
        this.panel.dispose();
        if (ModelWorkbenchPanel.currentPanel === this) ModelWorkbenchPanel.currentPanel = undefined;
    }

    private async post(message: object): Promise<void> {
        if (!this.disposed) await this.panel.webview.postMessage(message);
    }

    private async refresh(): Promise<void> {
        const generation = ++this.generation;
        try {
            const documents = await Promise.all([...this.uris.values()].map(async uri => {
                const document = await vscode.workspace.openTextDocument(uri);
                this.provider.invalidateCache(uri.toString());
                const version = document.version;
                const text = document.getText();
                const model = await this.provider.getModel(uri.toString(), ['elements', 'relationships']);
                if (document.version !== version || model.version !== version) {
                    throw new Error('The model is catching up with source edits. Refresh to retry.');
                }
                return { uri: uri.toString(), label: vscode.workspace.asRelativePath(uri), version, text, model };
            }));
            if (generation !== this.generation || this.disposed) return;
            this.snapshot = buildSnapshot(documents);
            this.revision++;
            this.pending = undefined;
            await this.post({ command: 'snapshot', revision: this.revision,
                documents: documents.map(({ uri, label, version }) => ({ uri, label, version })),
                rows: this.snapshot.rows, links: this.snapshot.links, packageName: this.packageName });
            this.packageName = undefined;
        } catch (error) {
            if (generation === this.generation) await this.post({ command: 'error', message: String(error) });
        }
    }

    private async receive(value: unknown): Promise<void> {
        const started = Date.now();
        let trackedAction: 'preview' | 'apply' | 'export' | undefined;
        let failureOutcome: 'rejected' | 'failure' = 'failure';
        try {
            if (!value || typeof value !== 'object') return;
            const message = value as Record<string, unknown>;
            if (this.applying) throw new Error('An edit is already being applied.');
            switch (message.command) {
                case 'ready': case 'refresh': await this.refresh(); break;
                case 'addFiles': {
                    const files = await vscode.window.showOpenDialog({ canSelectMany: true,
                        filters: { 'SysML / KerML': ['sysml', 'kerml'] }, openLabel: 'Load models' });
                    for (const uri of files || []) this.uris.set(uri.toString(), uri);
                    if (files?.length) await this.refresh();
                    break;
                }
                case 'export': {
                    if (!Array.isArray(message.records) || message.records.length > 100001
                        || JSON.stringify(message.records).length > 10_000_000
                        || message.records.some(row => !Array.isArray(row)
                            || row.some(cell => typeof cell !== 'string'))) {
                        throw new Error('Export is invalid or exceeds 10 MB. Narrow the current scope.');
                    }
                    trackedAction = 'export';
                    const destination = await vscode.window.showSaveDialog({
                        filters: { 'CSV table': ['csv'] }, saveLabel: 'Export CSV',
                    });
                    if (destination) {
                        const csv = unparse(message.records as string[][], { escapeFormulae: true });
                        await vscode.workspace.fs.writeFile(destination, new globalThis.TextEncoder().encode(csv));
                    }
                    telemetry?.operation('workbench', 'export', destination ? 'success' : 'cancelled',
                        Date.now() - started);
                    trackedAction = undefined;
                    break;
                }
                case 'navigate': {
                    const row = this.snapshot.rows.find(candidate => candidate.id === message.id);
                    if (!row) throw new Error('Element is no longer present.');
                    const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(row.uri));
                    const version = this.snapshot.documents.find(candidate => candidate.uri === row.uri)?.version;
                    if (document.version !== version) throw new Error('Refresh before navigating changed source.');
                    await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One,
                        selection: new vscode.Range(document.positionAt(row.start), document.positionAt(row.start)) });
                    break;
                }
                case 'preview': {
                    trackedAction = 'preview';
                    failureOutcome = 'rejected';
                    if (!vscode.workspace.isTrusted) throw new Error('Trust this workspace before editing models.');
                    if (message.revision !== this.revision) throw new Error('The model changed. Refresh and retry.');
                    if (!message.operation || typeof message.operation !== 'object'
                        || JSON.stringify(message.operation).length > 1_100_000) {
                        throw new Error('Invalid or oversized edit request.');
                    }
                    const plans = planOperation(this.snapshot, message.operation as WorkbenchOperation);
                    await this.checkVersions(plans);
                    const token = `${this.revision}-${Date.now()}-${Math.random()}`;
                    this.pending = { token, plans };
                    await this.post({ command: 'preview', token, changes: previewChanges(this.snapshot, plans) });
                    telemetry?.operation('workbench', 'preview', 'success', Date.now() - started);
                    trackedAction = undefined;
                    break;
                }
                case 'apply': {
                    trackedAction = 'apply';
                    failureOutcome = 'rejected';
                    if (!vscode.workspace.isTrusted) throw new Error('Trust this workspace before editing models.');
                    const pending = this.pending;
                    if (!pending || pending.token !== message.token) {
                        throw new Error('This preview expired. Preview the changes again.');
                    }
                    this.applying = true;
                    try {
                        const documents = await this.checkVersions(pending.plans);
                        const edit = new vscode.WorkspaceEdit();
                        for (const plan of pending.plans) {
                            const document = documents.find(candidate => candidate.uri.toString() === plan.uri);
                            if (!document) throw new Error('Document is no longer loaded.');
                            applySourceEdits(document.getText(), plan.version, document.version, plan.edits);
                            for (const change of plan.edits) edit.replace(document.uri,
                                new vscode.Range(document.positionAt(change.start), document.positionAt(change.end)),
                                change.text);
                        }
                        this.pending = undefined;
                            failureOutcome = 'failure';
                        if (!await vscode.workspace.applyEdit(edit)) throw new Error('VS Code rejected the edit.');
                        telemetry?.operation('workbench', 'apply', 'success', Date.now() - started);
                        trackedAction = undefined;
                        await this.post({ command: 'applied' });
                        await this.refresh();
                    } finally { this.applying = false; }
                    break;
                }
            }
        } catch (error) {
            if (trackedAction) {
                telemetry?.operation('workbench', trackedAction, failureOutcome, Date.now() - started);
                if (trackedAction === 'export') telemetry?.error('workbench', 'export', 'export-failed');
                if (trackedAction === 'apply' && failureOutcome === 'failure') {
                    telemetry?.error('workbench', 'apply', 'edit-failed');
                }
            }
            await this.post({ command: 'error', message: String(error) });
        }
    }

    private async checkVersions(plans: PlannedDocument[]): Promise<vscode.TextDocument[]> {
        const sources = this.snapshot.documents;
        const documents = await Promise.all(sources.map(source =>
            vscode.workspace.openTextDocument(vscode.Uri.parse(source.uri))));
        for (const source of sources) {
            const document = documents.find(candidate => candidate.uri.toString() === source.uri);
            if (!document || document.version !== source.version || document.getText() !== source.text) {
                throw new Error('Source changed since this snapshot. Refresh and preview again.');
            }
        }
        for (const plan of plans) {
            const document = documents.find(candidate => candidate.uri.toString() === plan.uri);
            if (!document || document.version !== plan.version) {
                throw new Error('Source changed since this snapshot. Refresh and preview again.');
            }
            if (document.uri.scheme !== 'untitled'
                && vscode.workspace.fs.isWritableFileSystem(document.uri.scheme) === false) {
                throw new Error('The destination is read-only.');
            }
        }
        return documents;
    }

    /** Generate a CSP-restricted shell; model content is sent only through postMessage. */
    static html(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const resource = (path: string) => webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', path));
        const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<link rel="stylesheet" href="${resource('vendor/codicon.css')}">
<link rel="stylesheet" href="${resource('webview/modelWorkbench.css')}">
<title>SysML Model Workbench</title></head><body>
<header><div><span class="codicon codicon-symbol-namespace" aria-hidden="true"></span>
<h1>Model Workbench</h1><span id="model-count" class="muted"></span></div>
<div class="actions"><button id="add-files" title="Load model files" aria-label="Load model files"><span class="codicon codicon-folder-opened"></span></button>
<button id="refresh" title="Refresh model" aria-label="Refresh model"><span class="codicon codicon-refresh"></span></button></div></header>
<nav aria-label="Model views"><button data-tab="requirements" aria-selected="true">Requirements</button>
<button data-tab="elements" aria-selected="false">Elements</button><button data-tab="relationships" aria-selected="false">Relationships</button>
<button data-tab="matrix" aria-selected="false">Traceability</button></nav>
<section class="toolbar" aria-label="Model filters"><input id="search" type="search" aria-label="Search model" placeholder="Search model">
<select id="file-scope" aria-label="File scope"></select><select id="package-scope" aria-label="Package scope"></select>
<select id="link-kind" aria-label="Relationship kind" hidden><option value="satisfy">Satisfaction</option><option value="verify">Verification</option><option value="dependency">Dependency</option></select>
<label id="uncovered-label" hidden><input id="uncovered" type="checkbox">Uncovered only</label>
<div class="actions"><button id="create" class="primary"><span class="codicon codicon-add"></span>Requirement</button>
<button id="add-link"><span class="codicon codicon-link"></span>Relationship</button>
<button id="paste" title="Bulk paste" aria-label="Bulk paste"><span class="codicon codicon-clippy"></span></button>
<button id="export" title="Export current table as CSV" aria-label="Export current table as CSV"><span class="codicon codicon-export"></span></button></div></section>
<section id="coverage" class="coverage" hidden aria-label="Traceability coverage"></section>
<div id="notice" role="status" aria-live="polite">Loading model...</div>
<main id="content" aria-label="Model table" tabindex="-1"></main>
<footer><span id="row-count"></span><div class="actions"><button id="previous" title="Previous page" aria-label="Previous page"><span class="codicon codicon-chevron-left"></span></button>
<span id="page-number"></span><button id="next" title="Next page" aria-label="Next page"><span class="codicon codicon-chevron-right"></span></button>
<button id="discard" disabled>Discard</button><button id="save" class="primary" disabled><span class="codicon codicon-check"></span>Review changes</button></div></footer>
<dialog id="editor-dialog" aria-labelledby="dialog-title"><form id="editor-form"><div class="dialog-heading"><h2 id="dialog-title"></h2>
<button type="button" id="close-dialog" title="Close" aria-label="Close"><span class="codicon codicon-close"></span></button></div>
<div id="dialog-fields"></div><p id="dialog-error" role="alert"></p>
<div class="dialog-actions"><button type="button" id="cancel-dialog">Cancel</button><button class="primary" type="submit">Preview changes</button></div></form></dialog>
<dialog id="preview-dialog" aria-labelledby="preview-title"><h2 id="preview-title">Review changes</h2>
<p id="delete-warning" hidden>The selected declaration and everything inside it will be removed. References other than loaded satisfaction, verification, and dependency links are not checked.</p><div id="preview-changes"></div>
<p id="preview-error" role="alert"></p><div class="dialog-actions"><button id="back-preview">Back</button><button id="apply" class="primary">Apply changes</button></div></dialog>
<script nonce="${nonce}" src="${resource('webview/modelWorkbench.js')}"></script></body></html>`;
    }
}
