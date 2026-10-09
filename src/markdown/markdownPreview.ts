import type MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import { LspModelProvider } from '../providers/lspModelProvider';
import { SysMLModelResult } from '../providers/sysmlModelTypes';
import { DiagramCache } from './diagramCache';
import { installMarkdownPlugin } from './markdownItPlugin';
import { findExportFences, registerMarkdownExport } from './exportDiagrams';
import { openPreviewModel } from './modelAccess';
import { parseFence, resolveModelUri } from './fenceParser';
import { VisualizationPanel } from '../visualization/visualizationPanel';

export interface MarkdownPreviewApi {
    extendMarkdownIt(markdown: InstanceType<typeof MarkdownIt>): InstanceType<typeof MarkdownIt>;
}

/** Register the model-loading bridge shared by desktop, remote, and web hosts. */
export function registerMarkdownPreview(
    context: vscode.ExtensionContext,
    getProvider: () => LspModelProvider,
    ready: () => Promise<void>,
): MarkdownPreviewApi {
    registerMarkdownExport(context, getProvider, ready);
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('sysml-diagram', {
        provideTextDocumentContent: async link => {
            try {
                const uri = vscode.Uri.parse(decodeURIComponent(link.query));
                const name = uri.path.split('/').pop() ?? '';
                const verified = resolveModelUri(name, vscode.Uri.joinPath(uri, '..', 'preview.md'),
                    vscode.workspace.workspaceFolders?.map(folder => folder.uri) ?? []);
                if (verified.toString() !== uri.toString()) throw new Error('Invalid model URI.');
                const document = await openPreviewModel(verified, false);
                await ready();
                VisualizationPanel.createOrShow(context.extensionUri, document, undefined, getProvider());
                return document.getText();
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to open the model.';
                void vscode.window.showErrorMessage(message);
                return message;
            }
        },
    }));
    const versionOf = (uri: string): number => vscode.workspace.textDocuments.find(document =>
        document.uri.toString() === uri)?.version ?? -1;
    const cache = new DiagramCache<SysMLModelResult>(async (value, signal) => {
        const uri = vscode.Uri.parse(value);
        const cancellation = new vscode.CancellationTokenSource();
        const cancel = (): void => cancellation.cancel();
        signal.addEventListener('abort', cancel, { once: true });
        try {
            await openPreviewModel(uri);
            await ready();
            if (signal.aborted) throw new Error('Model load cancelled.');
            return await getProvider().getModel(value, undefined, cancellation.token);
        } finally {
            signal.removeEventListener('abort', cancel);
            cancellation.dispose();
        }
    }, () => {
        void vscode.commands.executeCommand('markdown.preview.refresh').then(undefined, () => undefined);
    }, 64, versionOf);
    const invalidate = (uri: vscode.Uri): void => {
        if (!/\.(sysml|kerml)$/i.test(uri.path)) return;
        if (cache.invalidate(uri.toString(), versionOf(uri.toString()))) {
            getProvider().invalidateCache(uri.toString());
        }
    };
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.{sysml,kerml}');
    context.subscriptions.push(
        cache, watcher,
        watcher.onDidChange(invalidate), watcher.onDidCreate(invalidate), watcher.onDidDelete(invalidate),
        vscode.workspace.onDidChangeTextDocument(event => {
            invalidate(event.document.uri);
            if (event.document.languageId === 'markdown') {
                const models = new Set<string>();
                for (const fence of findExportFences(event.document.getText())) {
                    try {
                        models.add(resolveModelUri(parseFence(fence.content).model, event.document.uri,
                            vscode.workspace.workspaceFolders?.map(folder => folder.uri) ?? []).toString());
                    } catch { /* Invalid fences release their previous dependencies. */ }
                }
                cache.retainMarkdown(event.document.uri.toString(), models);
            }
        }),
        vscode.workspace.onDidCloseTextDocument(document => {
            if (document.languageId === 'markdown') cache.forgetMarkdown(document.uri.toString());
        }),
    );
    return { extendMarkdownIt: markdown => installMarkdownPlugin(markdown, cache) };
}
