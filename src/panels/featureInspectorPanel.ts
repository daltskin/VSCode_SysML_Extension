/**
 * Feature Inspector Panel — an interactive sidebar webview that shows
 * the resolved type information for the SysML element nearest to the cursor.
 *
 * Displays:
 * - Specialization breadcrumbs (clickable — drill into parents)
 * - Feature table with direction arrows, multiplicity badges,
 *   derived/readonly markers, and visibility icons
 * - Clickable type names — drill into any referenced type
 * - Navigation history with back button
 * - Type index when no match at cursor — browse all known types
 *
 * Data source: `ResolvedTypeDTO` from `sysml/model` with
 * `scope: ['resolvedTypes']`.
 */

import * as vscode from 'vscode';
import { LspModelProvider } from '../providers/lspModelProvider';
import type { ResolvedFeatureDTO, ResolvedTypeDTO } from '../providers/sysmlModelTypes';

export class FeatureInspectorPanel {
    public static currentPanel: FeatureInspectorPanel | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private readonly _disposables: vscode.Disposable[] = [];
    private _lspModelProvider: LspModelProvider | undefined;
    private _resolvedTypes: Record<string, ResolvedTypeDTO> = {};
    private _lastDocUri: string | undefined;
    /** Debounce timer for cursor movement events. */
    private _cursorDebounceTimer: ReturnType<typeof setTimeout> | undefined;

    /** Navigation history stack for drill-down / back. */
    private _navStack: ResolvedTypeDTO[] = [];
    /** The currently displayed type (if any). */
    private _currentType: ResolvedTypeDTO | undefined;

    private constructor(
        panel: vscode.WebviewPanel,
        lspModelProvider: LspModelProvider | undefined,
    ) {
        this._panel = panel;
        this._lspModelProvider = lspModelProvider;

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview (navigation clicks)
        this._panel.webview.onDidReceiveMessage(
            msg => this._onMessage(msg),
            null,
            this._disposables,
        );

        // Listen for cursor position changes (debounced to avoid
        // rebuilding the webview on every cursor movement)
        this._disposables.push(
            vscode.window.onDidChangeTextEditorSelection(e => {
                if (e.textEditor.document.languageId === 'sysml') {
                    if (this._cursorDebounceTimer) {
                        clearTimeout(this._cursorDebounceTimer);
                    }
                    this._cursorDebounceTimer = setTimeout(() => {
                        this._cursorDebounceTimer = undefined;
                        this._onCursorMove(e.textEditor);
                    }, 150);
                }
            }),
        );

        // Listen for active editor changes
        this._disposables.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor && editor.document.languageId === 'sysml') {
                    this._onCursorMove(editor);
                } else if (!editor || editor.document.languageId !== 'sysml') {
                    this._showTypeIndex();
                }
            }),
        );

        this._showEmpty('Place cursor on a SysML element to inspect it');
    }

    /** Create or reveal the Feature Inspector panel. */
    static createOrShow(
        extensionUri: vscode.Uri,
        lspModelProvider: LspModelProvider | undefined,
    ): FeatureInspectorPanel {
        if (FeatureInspectorPanel.currentPanel) {
            FeatureInspectorPanel.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
            FeatureInspectorPanel.currentPanel._lspModelProvider = lspModelProvider;
            return FeatureInspectorPanel.currentPanel;
        }

        const panel = vscode.window.createWebviewPanel(
            'sysmlFeatureInspector',
            'SysML Feature Inspector',
            { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
            { enableScripts: true, localResourceRoots: [] },
        );

        FeatureInspectorPanel.currentPanel = new FeatureInspectorPanel(panel, lspModelProvider);

        // Kick off initial inspection if editor is already open
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'sysml') {
            FeatureInspectorPanel.currentPanel._onCursorMove(editor);
        }

        return FeatureInspectorPanel.currentPanel;
    }

    /** Update the LSP model provider. */
    setLspModelProvider(provider: LspModelProvider | undefined): void {
        this._lspModelProvider = provider;
        if (!provider) {
            this._showEmpty('Feature Inspector requires an LSP model provider');
        }
    }

    /** Notify that resolved types have been refreshed externally. */
    updateResolvedTypes(types: Record<string, ResolvedTypeDTO>, docUri: string): void {
        this._resolvedTypes = types;
        this._lastDocUri = docUri;
        // Re-render for current cursor position
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'sysml') {
            this._renderForPosition(editor);
        }
    }

    dispose(): void {
        FeatureInspectorPanel.currentPanel = undefined;
        if (this._cursorDebounceTimer) {
            clearTimeout(this._cursorDebounceTimer);
        }
        this._panel.dispose();
        for (const d of this._disposables) {
            d.dispose();
        }
    }

    // ─── Private ───────────────────────────────────────────────────

    /** Handle messages from the webview. */
    private _onMessage(msg: { command: string; qualifiedName?: string }): void {
        switch (msg.command) {
            case 'navigate': {
                if (!msg.qualifiedName) return;
                this._navigateTo(msg.qualifiedName);
                break;
            }
            case 'back': {
                this._navigateBack();
                break;
            }
            case 'showIndex': {
                this._navStack = [];
                this._currentType = undefined;
                this._showTypeIndex();
                break;
            }
        }
    }

    /** Navigate to a type by qualified or simple name. */
    private _navigateTo(name: string): void {
        const target = this._findTypeByName(name);
        if (!target) {
            vscode.window.showInformationMessage(`Type "${name}" not found in resolved types`);
            return;
        }

        // Push current type onto the stack before navigating
        if (this._currentType) {
            this._navStack.push(this._currentType);
        }
        this._currentType = target;
        this._panel.webview.html = this._buildHtml(target);
    }

    /** Go back to the previous type in history. */
    private _navigateBack(): void {
        const prev = this._navStack.pop();
        if (prev) {
            this._currentType = prev;
            this._panel.webview.html = this._buildHtml(prev);
        } else {
            this._currentType = undefined;
            this._showTypeIndex();
        }
    }

    /** Look up a type by qualified name, simple name, or partial match. */
    private _findTypeByName(name: string): ResolvedTypeDTO | undefined {
        // Exact qualified name
        if (this._resolvedTypes[name]) return this._resolvedTypes[name];

        // Search by qualified name or simple name
        return Object.values(this._resolvedTypes).find(
            t => t.qualifiedName === name
                || t.simpleName === name
                || t.qualifiedName.endsWith(`::${name}`),
        );
    }

    private async _onCursorMove(editor: vscode.TextEditor): Promise<void> {
        const uri = editor.document.uri.toString();

        // Fetch resolved types if we don't have them for this document
        if (this._lastDocUri !== uri && this._lspModelProvider) {
            try {
                const result = await this._lspModelProvider.getModel(uri, ['resolvedTypes']);
                this._resolvedTypes = result.resolvedTypes ?? {};
                this._lastDocUri = uri;
            } catch {
                this._showEmpty('Failed to fetch resolved types from LSP server');
                return;
            }
        }

        this._renderForPosition(editor);
    }

    private _renderForPosition(editor: vscode.TextEditor): void {
        const pos = editor.selection.active;
        const match = this._findElementAtCursor(editor.document, pos);

        if (!match) {
            this._showTypeIndex();
            return;
        }

        // Reset navigation stack when cursor moves to a new element
        this._navStack = [];
        this._currentType = match;
        this._panel.webview.html = this._buildHtml(match);
    }

    /**
     * Extract the word (identifier) under the cursor position.
     */
    private _getWordAtPosition(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): string | undefined {
        const range = document.getWordRangeAtPosition(position, /\w+/);
        return range ? document.getText(range) : undefined;
    }

    /**
     * Find the best matching ResolvedTypeDTO for the cursor position.
     *
     * Priority:
     * 1. The exact word under the cursor (click target)
     * 2. Type annotation on the same line (after `:`)
     * 3. Declaration name on the same line
     * 4. Walk upward to find the enclosing element
     */
    private _findElementAtCursor(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): ResolvedTypeDTO | undefined {
        // 1. Try the exact word under the cursor first
        const cursorWord = this._getWordAtPosition(document, position);
        if (cursorWord) {
            const exact = Object.values(this._resolvedTypes).find(
                t => t.simpleName === cursorWord || t.qualifiedName.endsWith(`::${cursorWord}`),
            );
            if (exact) return exact;
        }

        const lineText = document.lineAt(position.line).text;

        // 2. Try type annotation on the line (word after `:`)
        const typeAnnotation = /:\s*(\w+)/.exec(lineText);
        if (typeAnnotation?.[1]) {
            const found = Object.values(this._resolvedTypes).find(
                t => t.simpleName === typeAnnotation[1],
            );
            if (found) return found;
        }

        // 3. Try declaration name on the line
        const declPattern = /\b(?:part\s+def|part|port\s+def|port|action\s+def|action|state\s+def|state|item\s+def|item|package|attribute\s+def|attribute|connection\s+def|connection|interface\s+def|interface|allocation\s+def|allocation|requirement\s+def|requirement|constraint\s+def|constraint|concern\s+def|concern|case\s+def|case|analysis\s+def|analysis|verification\s+def|verification|use\s+case\s+def|use\s+case|view\s+def|view|viewpoint\s+def|viewpoint|rendering\s+def|rendering|calc\s+def|calc|ref\s+part|ref\s+attribute|enum\s+def|occurrence\s+def|occurrence|flow)\s+(?:(?:'[^']*')|(\w+))/;
        const declMatch = declPattern.exec(lineText);
        if (declMatch?.[1]) {
            const found = Object.values(this._resolvedTypes).find(
                t => t.simpleName === declMatch[1],
            );
            if (found) return found;
        }

        // 4. Walk upward to find enclosing element
        for (let l = position.line - 1; l >= Math.max(0, position.line - 50); l--) {
            const prevLine = document.lineAt(l).text;
            const prevMatch = declPattern.exec(prevLine);
            if (prevMatch?.[1]) {
                const found = Object.values(this._resolvedTypes).find(
                    t => t.simpleName === prevMatch[1],
                );
                if (found) return found;
            }
        }

        return undefined;
    }

    /** Show a browseable index of all known resolved types, grouped by kind. */
    private _showTypeIndex(): void {
        const types = Object.values(this._resolvedTypes);

        if (!types.length) {
            this._showEmpty('Place cursor on a SysML element to inspect it');
            return;
        }

        // Group types by kind
        const byKind = new Map<string, ResolvedTypeDTO[]>();
        for (const t of types) {
            const list = byKind.get(t.kind) ?? [];
            list.push(t);
            byKind.set(t.kind, list);
        }

        // Sort kinds alphabetically, then entries within each kind
        const sortedKinds = [...byKind.keys()].sort();

        let sections = '';
        for (const kind of sortedKinds) {
            const entries = byKind.get(kind) ?? [];
            entries.sort((a, b) => a.simpleName.localeCompare(b.simpleName));

            const items = entries.map(t => {
                const featureCount = t.features.length;
                const badge = featureCount > 0
                    ? `<span class="count-badge">${featureCount}</span>` : '';
                const libBadge = t.isLibraryType
                    ? '<span class="library-badge">LIB</span>' : '';
                return `<div class="index-item" data-qn="${this._escapeHtml(t.qualifiedName)}">`
                    + `<span class="index-name">${this._escapeHtml(t.simpleName)}</span>`
                    + `${badge}${libBadge}`
                    + `</div>`;
            }).join('\n');

            sections += `
<div class="index-section">
    <div class="index-kind">${this._escapeHtml(kind)} <span class="kind-count">(${entries.length})</span></div>
    ${items}
</div>`;
        }

        const nonce = _getNonce();
        this._panel.webview.html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
${this._getBaseStyles()}

/* ── Index styles ── */
.index-header { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.index-subtitle { font-size: 11px; color: var(--subtle); margin-bottom: 16px; }
.index-section { margin-bottom: 16px; }
.index-kind { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px;
              color: var(--subtle); margin-bottom: 6px; border-bottom: 1px solid var(--border);
              padding-bottom: 3px; }
.kind-count { font-size: 10px; opacity: 0.7; }
.index-item { padding: 4px 8px; border-radius: 3px; cursor: pointer;
              display: flex; align-items: center; gap: 6px; }
.index-item:hover { background: var(--hover-bg); }
.index-name { color: var(--accent); font-size: 12px; }
.count-badge { font-size: 9px; padding: 1px 5px; border-radius: 8px;
               background: var(--badge-bg); color: var(--badge-fg); font-family: monospace; }
</style>
</head><body>
<div class="index-header">Model Types</div>
<div class="index-subtitle">Click any type to inspect it. ${types.length} types available.</div>
${sections}
<script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll('.index-item').forEach(el => {
        el.addEventListener('click', () => {
            vscode.postMessage({ command: 'navigate', qualifiedName: el.dataset.qn });
        });
    });
</script>
</body></html>`;
    }

    private _showEmpty(message: string): void {
        const nonce = _getNonce();
        this._panel.webview.html = `<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}';">
<style nonce="${nonce}">
body { font-family: var(--vscode-font-family, sans-serif); color: var(--vscode-foreground);
       background: var(--vscode-editor-background); padding: 20px; display: flex;
       align-items: center; justify-content: center; height: 80vh; }
p { opacity: 0.6; font-style: italic; text-align: center; }
</style></head><body><p>${this._escapeHtml(message)}</p></body></html>`;
    }

    private _buildHtml(type: ResolvedTypeDTO): string {
        const breadcrumbs = this._renderBreadcrumbs(type);
        const featuresTable = this._renderFeaturesTable(type.features);
        const meta = this._renderMeta(type);
        const hasHistory = this._navStack.length > 0;
        const nonce = _getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
${this._getBaseStyles()}

/* ── Navigation bar ── */
.nav-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.nav-btn { background: var(--header-bg); border: 1px solid var(--border); color: var(--fg);
           padding: 3px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;
           font-family: inherit; display: flex; align-items: center; gap: 4px; }
.nav-btn:hover { background: var(--hover-bg); }
.nav-btn:disabled { opacity: 0.3; cursor: default; }
.nav-btn:disabled:hover { background: var(--header-bg); }
.nav-trail { font-size: 11px; color: var(--subtle); flex: 1; text-align: right;
             white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
</head>
<body>

<div class="nav-bar">
    <button class="nav-btn" id="btn-back" ${hasHistory ? '' : 'disabled'} title="Go back">← Back</button>
    <button class="nav-btn" id="btn-index" title="Show all types">☰ Index</button>
    <span class="nav-trail">${this._navStack.length > 0 ? `${this._navStack.map(t => this._escapeHtml(t.simpleName)).join(' ▸ ')} ▸` : ''}</span>
</div>

<div class="header">
    <span class="kind-badge" title="SysML metaclass — the type of model element (e.g. PartDefinition, PortDefinition, ActionDefinition)">${this._escapeHtml(type.kind)}</span>
    ${type.isLibraryType ? '<span class="library-badge" title="This type comes from the SysML standard library">LIBRARY</span>' : ''}
    <div class="element-name" title="Simple name — the local identifier of this element">${this._escapeHtml(type.simpleName)}</div>
    <div class="qualified-name" title="Fully qualified name — the complete namespace path to this element">${this._escapeHtml(type.qualifiedName)}</div>
</div>

${breadcrumbs}
${meta}

<div class="section-title" title="Owned features — parts, ports, attributes, references, and other typed features declared within this element">Features (${type.features.length})</div>
${featuresTable}

<script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    // Back / Index buttons
    document.getElementById('btn-back')?.addEventListener('click', () => {
        vscode.postMessage({ command: 'back' });
    });
    document.getElementById('btn-index')?.addEventListener('click', () => {
        vscode.postMessage({ command: 'showIndex' });
    });

    // Clickable type links
    document.querySelectorAll('[data-navigate]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            vscode.postMessage({ command: 'navigate', qualifiedName: el.dataset.navigate });
        });
    });
</script>

</body>
</html>`;
    }

    /** Shared CSS used by both the detail view and the index view. */
    private _getBaseStyles(): string {
        return `:root {
    --bg: var(--vscode-editor-background);
    --fg: var(--vscode-foreground);
    --border: var(--vscode-panel-border, #444);
    --badge-bg: var(--vscode-badge-background, #007acc);
    --badge-fg: var(--vscode-badge-foreground, #fff);
    --subtle: var(--vscode-descriptionForeground, #888);
    --header-bg: var(--vscode-sideBarSectionHeader-background, #252526);
    --hover-bg: var(--vscode-list-hoverBackground, #2a2d2e);
    --accent: var(--vscode-textLink-foreground, #3794ff);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
       font-size: var(--vscode-font-size, 13px); color: var(--fg);
       background: var(--bg); padding: 12px; line-height: 1.5; }

/* ── Header ── */
.header { margin-bottom: 16px; }
.kind-badge { display: inline-block; font-size: 10px; text-transform: uppercase;
              letter-spacing: 0.5px; padding: 2px 8px; border-radius: 10px;
              background: var(--badge-bg); color: var(--badge-fg); margin-bottom: 6px; }
.element-name { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.qualified-name { font-size: 11px; color: var(--subtle); word-break: break-all; }

/* ── Breadcrumbs ── */
.breadcrumbs { display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
               margin: 12px 0; padding: 8px; background: var(--header-bg);
               border-radius: 4px; font-size: 12px; }
.breadcrumbs .crumb { color: var(--accent); }
.breadcrumbs .crumb-link { color: var(--accent); cursor: pointer; text-decoration: none;
                           border-bottom: 1px dotted var(--accent); }
.breadcrumbs .crumb-link:hover { text-decoration: underline; }
.breadcrumbs .sep { color: var(--subtle); margin: 0 2px; }

/* ── Meta ── */
.meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.meta-item { font-size: 11px; color: var(--subtle); }
.meta-item strong { color: var(--fg); }
.meta-link { color: var(--accent); cursor: pointer; border-bottom: 1px dotted var(--accent); }
.meta-link:hover { text-decoration: underline; }

/* ── Features table ── */
.section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;
                 color: var(--subtle); margin-bottom: 8px; border-bottom: 1px solid var(--border);
                 padding-bottom: 4px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
     color: var(--subtle); padding: 4px 8px; border-bottom: 1px solid var(--border);
     cursor: help; }
td { padding: 5px 8px; border-bottom: 1px solid var(--border); font-size: 12px;
     vertical-align: top; }
tr:hover { background: var(--hover-bg); }

/* Clickable type in table */
.type-link { color: var(--accent); cursor: pointer; border-bottom: 1px dotted var(--accent); }
.type-link:hover { text-decoration: underline; }

/* Markers */
.dir { font-weight: 700; font-size: 14px; }
.dir-in { color: #4ec9b0; }
.dir-out { color: #ce9178; }
.dir-inout { color: #dcdcaa; }
.mult { display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 10px;
        background: var(--badge-bg); color: var(--badge-fg); font-family: monospace; }
.marker { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 10px;
          margin-right: 2px; }
.marker-derived { background: #4a3a17; color: #dcdcaa; }
.marker-readonly { background: #1a3a4a; color: #9cdcfe; }
.marker-private { background: #3a1a1a; color: #f48771; }
.marker-protected { background: #3a2a1a; color: #dca06e; }

.no-features { padding: 20px; text-align: center; color: var(--subtle); font-style: italic; }
.library-badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 3px;
                 background: #2d4a2d; color: #89d185; margin-left: 6px; vertical-align: middle; }`;
    }

    private _renderBreadcrumbs(type: ResolvedTypeDTO): string {
        if (!type.specializationChain.length && !type.specializes.length) {
            return '';
        }

        const chain = type.specializationChain.length > 0
            ? type.specializationChain
            : type.specializes;

        const crumbs = chain
            .map(name => {
                const simple = name.includes('::') ? (name.split('::').pop() ?? name) : name;
                const isClickable = !!this._findTypeByName(name);
                if (isClickable) {
                    return `<span class="crumb-link" data-navigate="${this._escapeHtml(name)}" title="${this._escapeHtml(name)}">${this._escapeHtml(simple)}</span>`;
                }
                return `<span class="crumb" title="${this._escapeHtml(name)}">${this._escapeHtml(simple)}</span>`;
            })
            .join('<span class="sep">▸</span>');

        return `<div class="breadcrumbs">${crumbs}<span class="sep">▸</span><span class="crumb" style="font-weight:600">${this._escapeHtml(type.simpleName)}</span></div>`;
    }

    private _renderMeta(type: ResolvedTypeDTO): string {
        const items: string[] = [];
        if (type.specializes.length) {
            const specLinks = type.specializes.map(s => {
                const simple = s.includes('::') ? (s.split('::').pop() ?? s) : s;
                const isClickable = !!this._findTypeByName(s);
                if (isClickable) {
                    return `<span class="meta-link" data-navigate="${this._escapeHtml(s)}">${this._escapeHtml(simple)}</span>`;
                }
                return this._escapeHtml(simple);
            }).join(', ');
            items.push(`<span class="meta-item"><strong>Specialises:</strong> ${specLinks}</span>`);
        }
        if (type.features.length) {
            const dirs = type.features.filter(f => f.direction);
            if (dirs.length) {
                const inCount = dirs.filter(f => f.direction === 'in').length;
                const outCount = dirs.filter(f => f.direction === 'out').length;
                const inoutCount = dirs.filter(f => f.direction === 'inout').length;
                const parts: string[] = [];
                if (inCount) parts.push(`${inCount} in`);
                if (outCount) parts.push(`${outCount} out`);
                if (inoutCount) parts.push(`${inoutCount} inout`);
                items.push(`<span class="meta-item"><strong>Directed:</strong> ${parts.join(', ')}</span>`);
            }
        }
        return items.length ? `<div class="meta">${items.join('')}</div>` : '';
    }

    private _renderFeaturesTable(features: ResolvedFeatureDTO[]): string {
        if (!features.length) {
            return '<div class="no-features">No features declared</div>';
        }

        // Check which optional columns have any data (used for subtle styling)
        const hasDir = features.some(f => f.direction);

        const rows = features.map(f => {
            // Direction arrow
            let dirCell = '';
            if (f.direction === 'in') dirCell = '<span class="dir dir-in" title="in">◀</span>';
            else if (f.direction === 'out') dirCell = '<span class="dir dir-out" title="out">▶</span>';
            else if (f.direction === 'inout') dirCell = '<span class="dir dir-inout" title="inout">◆</span>';

            // Multiplicity badge
            const multCell = f.multiplicity
                ? `<span class="mult" title="multiplicity">${this._escapeHtml(f.multiplicity)}</span>`
                : '';

            // Markers
            const markers: string[] = [];
            if (f.isDerived) markers.push('<span class="marker marker-derived" title="derived">/</span>');
            if (f.isReadonly) markers.push('<span class="marker marker-readonly" title="readonly">R</span>');
            if (f.visibility === 'private') markers.push('<span class="marker marker-private" title="private">−</span>');
            else if (f.visibility === 'protected') markers.push('<span class="marker marker-protected" title="protected">#</span>');

            // Type cell — clickable if the type exists in resolved types
            let typeCell: string;
            if (f.type) {
                const isClickable = !!this._findTypeByName(f.type);
                if (isClickable) {
                    typeCell = `<span class="type-link" data-navigate="${this._escapeHtml(f.type)}">${this._escapeHtml(f.type)}</span>`;
                } else {
                    typeCell = `<span style="color:var(--accent)">${this._escapeHtml(f.type)}</span>`;
                }
            } else {
                typeCell = '<span style="color:var(--subtle)">—</span>';
            }

            return `<tr>
    ${hasDir ? `<td>${dirCell}</td>` : ''}
    <td><strong>${this._escapeHtml(f.name)}</strong></td>
    <td>${typeCell}</td>
    <td>${multCell}</td>
    <td>${markers.join(' ')}</td>
    <td style="color:var(--subtle)">${this._escapeHtml(f.kind)}</td>
</tr>`;
        }).join('\n');

        // Build header row — Dir is hidden when no features have direction data;
        // Mult and Flags are always shown so their tooltips remain accessible.
        const headers = [
            ...(hasDir ? ['<th title="Direction: ◀ in, ▶ out, ◆ inout — indicates data flow direction of the feature">Dir</th>'] : []),
            '<th title="Feature name — the declared identifier of this feature">Name</th>',
            '<th title="Type — the definition or value type this feature is typed by. Click a linked type to drill in.">Type</th>',
            '<th title="Multiplicity — how many instances are allowed, e.g. [1], [0..*], [2..5]. Empty means unspecified (defaults to [0..*]).">Mult</th>',
            '<th title="Flags — special modifiers on the feature: / = derived (computed value), R = readonly, − = private visibility, # = protected visibility">Flags</th>',
            '<th title="Feature kind — the SysML metaclass, e.g. part, port, attribute, reference, connection end">Kind</th>',
        ];

        return `<table>
<thead><tr>${headers.join('')}</tr></thead>
<tbody>
${rows}
</tbody>
</table>`;
    }

    private _escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

/** Generate a random nonce for Content Security Policy. */
function _getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
}
