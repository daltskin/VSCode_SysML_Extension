import MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import { LspModelProvider } from '../providers/lspModelProvider';
import { diagramShell } from '../visualization/core/diagramShell';
import { modelSnapshot } from '../visualization/core/modelSnapshot';
import { selectView } from '../visualization/core/viewScope';
import { parseFence, resolveModelUri } from './fenceParser';
import { assertSafeOutputPath, openPreviewModel } from './modelAccess';

export interface ExportFence {
    readonly content: string;
    readonly startLine: number;
    readonly endLine: number;
}

/** Locate actual fenced blocks, including list and blockquote containers. */
export function findExportFences(source: string): ExportFence[] {
    return new MarkdownIt().parse(source, {}).flatMap(token =>
        token.type === 'fence' && token.info.trim() === 'sysmlv2-view' && token.map
            ? [{ content: token.content, startLine: token.map[0], endLine: token.map[1] }] : [],
    );
}

/** Replace exported fences while preserving every other line of the source document. */
export function replaceExportFences(
    source: string,
    fences: readonly ExportFence[],
    imagePaths: readonly string[],
): string {
    const newline = source.includes('\r\n') ? '\r\n' : '\n';
    const lines = source.split(/\r?\n/);
    for (let index = fences.length - 1; index >= 0; index--) {
        const fence = fences[index];
        const opening = lines[fence.startLine];
        const marker = /`{3,}|~{3,}/.exec(opening);
        const prefix = marker ? opening.slice(0, marker.index) : '';
        lines.splice(fence.startLine, fence.endLine - fence.startLine,
            `${prefix}![SysML diagram ${index + 1}](<${imagePaths[index]}>)`);
    }
    return lines.join(newline);
}

/** Export fences through the same offline renderer used by the Visualizer. */
export function registerMarkdownExport(
    context: vscode.ExtensionContext,
    getProvider: () => LspModelProvider,
    ready: () => Promise<void>,
): void {
    context.subscriptions.push(vscode.commands.registerCommand('sysml.exportMarkdownDiagrams', async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (!document || document.languageId !== 'markdown') {
            void vscode.window.showErrorMessage('Open a Markdown document containing sysmlv2-view fences.');
            return;
        }
        let panel: vscode.WebviewPanel | undefined;
        try {
            const source = document.getText();
            const fences = findExportFences(source);
            if (!fences.length) throw new Error('No sysmlv2-view fences found.');
            const stem = (document.uri.path.split('/').pop() ?? 'model').replace(/\.md$/i, '');
            const target = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.joinPath(document.uri, '..', `${stem}.export.md`),
                filters: { Markdown: ['md'] }, title: 'Export Markdown with SVG diagrams',
            });
            if (!target) return;
            if (target.toString() === document.uri.toString()) throw new Error('Choose a different file to preserve the source Markdown.');
            await assertSafeOutputPath(target);
            const models = new Map<string, Awaited<ReturnType<LspModelProvider['getModel']>>>();
            const payloads: Record<string, unknown>[] = [];
            await ready();
            for (const block of fences) {
                const fence = parseFence(block.content);
                const uri = resolveModelUri(fence.model, document.uri,
                    vscode.workspace.workspaceFolders?.map(folder => folder.uri) ?? []);
                await openPreviewModel(uri);
                let model = models.get(uri.toString());
                if (!model) {
                    model = await getProvider().getModel(uri.toString());
                    models.set(uri.toString(), model);
                }
                payloads.push({
                    ...modelSnapshot(model), ...selectView(model.elements ?? [], fence),
                    readOnly: true, exportOnRender: true,
                    exportRequestId: payloads.length + 1,
                });
            }
            const imageFolderName = `${(target.path.split('/').pop() ?? 'model').replace(/\.md$/i, '')}.diagrams`;
            const folder = vscode.Uri.joinPath(target, '..', imageFolderName);
            await assertSafeOutputPath(folder);
            await vscode.workspace.fs.createDirectory(folder);
            panel = vscode.window.createWebviewPanel('sysmlMarkdownExport', 'SysML Markdown Export',
                vscode.ViewColumn.Beside, {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
                });
            const exportPanel = panel;
            const imagePaths: string[] = [];
            let nextPayload = 0;
            let pending: { requestId: number; resolve(value: string): void; reject(reason: Error): void } | undefined;
            const listener = exportPanel.webview.onDidReceiveMessage(message => {
                if (message.command === 'webviewReady') {
                    void exportPanel.webview.postMessage(payloads[nextPayload]);
                } else if (pending && message.requestId === pending.requestId) {
                    if (message.command === 'diagramSVG' && typeof message.data === 'string') {
                        pending.resolve(message.data);
                    } else if (message.command === 'renderError') {
                        pending.reject(new Error(String(message.message)));
                    }
                }
            });
            const closed = exportPanel.onDidDispose(() => pending?.reject(new Error('Export cancelled.')));
            try {
                await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification,
                    title: 'Exporting SysML diagrams', cancellable: true }, async (progress, token) => {
                    const cancelled = token.onCancellationRequested(() => pending?.reject(new Error('Export cancelled.')));
                    try {
                        for (let index = 0; index < payloads.length; index++) {
                            if (token.isCancellationRequested) throw new Error('Export cancelled.');
                            nextPayload = index;
                            const svg = await new Promise<string>((resolve, reject) => {
                                const timer = setTimeout(() => reject(new Error('Diagram export timed out.')), 30000);
                                pending = {
                                    requestId: index + 1,
                                    resolve: value => { clearTimeout(timer); resolve(value); },
                                    reject: error => { clearTimeout(timer); reject(error); },
                                };
                                if (index === 0) {
                                    exportPanel.webview.html = diagramShell(exportPanel.webview, context.extensionUri)
                                        .replace('</style>', '#controls,#status-bar,#minimap-container{display:none!important}</style>');
                                } else void exportPanel.webview.postMessage(payloads[index]);
                            });
                            pending = undefined;
                            if (token.isCancellationRequested) throw new Error('Export cancelled.');
                            const name = `diagram-${index + 1}.svg`;
                            const imageUri = vscode.Uri.joinPath(folder, name);
                            await assertSafeOutputPath(imageUri);
                            await vscode.workspace.fs.writeFile(imageUri, new globalThis.TextEncoder().encode(svg));
                            imagePaths.push(`${encodeURIComponent(imageFolderName)}/${name}`);
                            progress.report({ increment: 100 / payloads.length });
                        }
                    } finally { cancelled.dispose(); }
                });
            } finally { listener.dispose(); closed.dispose(); }
            await assertSafeOutputPath(target);
            await vscode.workspace.fs.writeFile(target,
                new globalThis.TextEncoder().encode(replaceExportFences(source, fences, imagePaths)));
            await vscode.window.showTextDocument(target);
        } catch (error) {
            void vscode.window.showErrorMessage(`SysML Markdown export: ${error instanceof Error ? error.message : String(error)}`);
        } finally { panel?.dispose(); }
    }));
}
