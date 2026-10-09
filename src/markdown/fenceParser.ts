import * as vscode from 'vscode';
import { isMap, isScalar, parseDocument } from 'yaml';

export interface DiagramFence {
    readonly model: string;
    readonly view?: string;
    readonly diagram?: string;
}

export const DIAGRAM_TYPES: Readonly<Record<string, string>> = {
    general: 'elk', elk: 'elk', interconnection: 'ibd', ibd: 'ibd',
    sequence: 'sequence', activity: 'activity', state: 'state',
    usecase: 'usecase', case: 'usecase', tree: 'tree', browser: 'tree',
    graph: 'graph', hierarchy: 'hierarchy', package: 'package',
    table: 'table', textual: 'textual',
};

/** Parse a bounded YAML mapping, rejecting aliases and every non-contract key. */
export function parseFence(source: string): DiagramFence {
    if (source.length > 4096) throw new Error('SysML fence exceeds 4 KB.');
    const document = parseDocument(source, { uniqueKeys: true, schema: 'failsafe' });
    if (document.errors.length) throw new Error(document.errors[0].message);
    if (!isMap(document.contents)) throw new Error('Expected model, view, and diagram fields.');
    const fields: Record<string, string> = {};
    for (const item of document.contents.items) {
        if (!isScalar(item.key) || !['model', 'view', 'diagram'].includes(String(item.key.value))) {
            throw new Error('Unknown SysML fence field.');
        }
        if (!isScalar(item.value) || typeof item.value.value !== 'string'
            || !item.value.value.trim() || item.value.tag) {
            throw new Error('SysML fence fields must be non-empty strings without YAML tags.');
        }
        fields[String(item.key.value)] = item.value.value.trim();
    }
    if (!fields.model) throw new Error('A model path is required.');
    if (fields.diagram && !Object.hasOwn(DIAGRAM_TYPES, fields.diagram)) {
        throw new Error(`Unknown diagram type: ${fields.diagram}`);
    }
    return { model: fields.model, view: fields.view, diagram: fields.diagram };
}

/** Resolve relative model paths without allowing URI or workspace boundary escapes. */
export function resolveModelUri(
    model: string,
    markdown: vscode.Uri,
    roots: readonly vscode.Uri[],
): vscode.Uri {
    if (/^[a-z][a-z\d+.-]*:/i.test(model) || /^[\\/]/.test(model)
        || /[\\?#]/.test(model) || [...model].some(character => character.charCodeAt(0) < 32)
        || /%[a-f\d]{2}/i.test(model)) {
        throw new Error('Model must be a relative workspace path.');
    }
    const uri = vscode.Uri.joinPath(markdown, '..', model);
    if (!/\.(sysml|kerml)$/i.test(uri.path)) throw new Error('Model must be a .sysml or .kerml file.');
    if (!roots.some(root => root.scheme === uri.scheme && root.authority === uri.authority
        && (uri.path === root.path || uri.path.startsWith(`${root.path.replace(/\/$/, '')}/`)))) {
        throw new Error('Model path is outside the workspace.');
    }
    return uri;
}

/** Escape data attributes and inline error text. */
export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character] ?? character);
}
