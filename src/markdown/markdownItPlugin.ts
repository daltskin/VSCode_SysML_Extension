import MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import { SysMLModelResult } from '../providers/sysmlModelTypes';
import { checkLimit, checkModelLimits, internalSafetyLimits, textBytes } from '../resourceLimits';
import { modelSnapshot } from '../visualization/core/modelSnapshot';
import { selectView } from '../visualization/core/viewScope';
import { DiagramCache } from './diagramCache';
import { escapeHtml, parseFence, resolveModelUri } from './fenceParser';

type MarkdownRenderer = InstanceType<typeof MarkdownIt>;

export const MAX_MODEL_BYTES = internalSafetyLimits.previewBytes;
export const MAX_DIAGRAM_ELEMENTS = internalSafetyLimits.previewElements;

/** Install the synchronous fence renderer without taking over other Markdown fences. */
export function installMarkdownPlugin(
    markdown: MarkdownRenderer,
    cache: DiagramCache<SysMLModelResult>,
): MarkdownRenderer {
    const original = markdown.renderer.rules.fence;
    markdown.renderer.rules.fence = (tokens, index, options, environment, renderer) => {
        const token = tokens[index];
        if (token.info.trim() !== 'sysmlv2-view') {
            return original ? original(tokens, index, options, environment, renderer)
                : renderer.renderToken(tokens, index, options);
        }
        let modelUri: vscode.Uri | undefined;
        try {
            if (!environment?.currentDocument) throw new Error('Save the Markdown file in a workspace first.');
            const source = typeof environment.currentDocument === 'string'
                ? vscode.Uri.parse(environment.currentDocument) : environment.currentDocument as vscode.Uri;
            const fence = parseFence(token.content);
            const uri = resolveModelUri(fence.model, source,
                vscode.workspace.workspaceFolders?.map(folder => folder.uri) ?? []);
            modelUri = uri;
            const version = vscode.workspace.textDocuments.find(document =>
                document.uri.toString() === uri.toString())?.version ?? -1;
            const entry = cache.lookup(uri.toString(), version, source.toString());
            if (entry.state === 'error') throw new Error(entry.error);
            if (!entry.value) return '<div class="sysml-md sysml-md-loading" role="status">Loading SysML diagram...</div>';
            checkModelLimits(entry.value, { maxElements: MAX_DIAGRAM_ELEMENTS });
            const selected = selectView(entry.value.elements ?? [], fence);
            const payload = JSON.stringify({
                ...modelSnapshot(entry.value), ...selected,
            });
            checkLimit(textBytes(payload), MAX_MODEL_BYTES, 'previewBytes');
            return `<div class="sysml-md" role="figure" aria-label="${escapeHtml(fence.view ?? 'SysML diagram')}" data-payload="${escapeHtml(payload)}"></div>`;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to render SysML diagram.';
            if (modelUri && /(?:preview .*limit|exceeds 2 MB|2 MB preview limit|Resource limit exceeded)/i.test(message)) {
                const link = vscode.Uri.from({ scheme: 'sysml-diagram', path: '/model',
                    query: encodeURIComponent(modelUri.toString()) });
                return `<div class="sysml-md sysml-md-error">${escapeHtml(message)} <a href="${escapeHtml(link.toString())}">Open in Model Visualizer</a></div>`;
            }
            return `<div class="sysml-md sysml-md-error" role="alert">${escapeHtml(message)}</div>`;
        }
    };
    return markdown;
}
