import * as vscode from 'vscode';
import { LspModelProvider, toVscodeRange } from '../providers/lspModelProvider';
import type { SysMLElementDTO } from '../providers/sysmlModelTypes';
import type { Relationship, SysMLElement } from '../types/sysmlTypes';

/**
 * Convert an `SysMLElementDTO` (plain objects, Record attributes) into a
 * `SysMLElement` (vscode.Range, Map attributes) so the tree-item code
 * can work identically regardless of source.
 */
function dtoToSysMLElement(dto: SysMLElementDTO): SysMLElement {
    const attrs = new Map<string, string | number | boolean>();
    if (dto.attributes) {
        for (const [k, v] of Object.entries(dto.attributes)) {
            attrs.set(k, v);
        }
    }
    return {
        type: dto.type,
        name: dto.name,
        range: toVscodeRange(dto.range),
        children: (dto.children ?? []).map(dtoToSysMLElement),
        attributes: attrs,
        relationships: (dto.relationships ?? []).map(r => ({
            type: r.type,
            source: r.source,
            target: r.target,
            name: r.name,
        })),
        errors: dto.errors,
    };
}

export class ModelExplorerProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private currentDocument: vscode.TextDocument | undefined;
    private pendingDocument: vscode.TextDocument | undefined;
    private rootElements: SysMLElement[] = [];
    private isLoading: boolean = false;

    /** Workspace mode: true when showing aggregated model from all workspace files. */
    private workspaceMode = false;
    /** Per-file model data for workspace mode. */
    private workspaceFileData = new Map<string, { uri: vscode.Uri; elements: SysMLElement[] }>();
    /** URIs of workspace files last used to build the workspace model. */
    private workspaceFileUris: vscode.Uri[] = [];

    /** TreeView reference for programmatic reveal/expand. */
    private treeView?: vscode.TreeView<vscode.TreeItem>;
    /** Last set of root-level tree items returned by getChildren(undefined). */
    private cachedRootItems: vscode.TreeItem[] = [];
    /** Maps file URI → root tree items that contain elements from that file. */
    private uriToRootItems = new Map<string, vscode.TreeItem[]>();

    /** Workspace view mode: 'byFile' groups by filename, 'bySemantic' shows a unified model. */
    private _workspaceViewMode: 'byFile' | 'bySemantic' = 'bySemantic';

    /** Stats from the most recent LSP `sysml/model` response. */
    private _lastStats: { totalElements: number; resolvedElements: number; unresolvedElements: number; parseTimeMs: number; lexTimeMs?: number; parseOnlyTimeMs?: number; modelBuildTimeMs: number; complexity?: { complexityIndex: number; rating: string; definitions: number; usages: number; maxDepth: number; avgChildrenPerDef: number; couplingCount: number; unusedDefinitions: number; documentationCoverage: number; hotspots: { qualifiedName: string; kind: string; childCount: number; depth: number; typeRefs: number; hasDoc: boolean; score: number }[] } } | undefined;

    constructor(private _lspModelProvider: LspModelProvider) {}

    /** Wire the TreeView so we can call reveal() programmatically. */
    setTreeView(treeView: vscode.TreeView<vscode.TreeItem>): void {
        this.treeView = treeView;
    }

    /** Whether the explorer is currently showing the workspace-wide model. */
    isWorkspaceMode(): boolean {
        return this.workspaceMode;
    }

    /** Return the file URIs currently loaded in workspace mode. */
    getWorkspaceFileUris(): vscode.Uri[] {
        return this.workspaceFileUris;
    }

    /**
     * Minimal getParent — returns undefined for all items.
     * This is sufficient for reveal() on root-level items.
     */
    getParent(): vscode.TreeItem | undefined {
        return undefined;
    }

    /**
     * Reveal and expand root tree items that correspond to the given
     * document URI.  In workspace mode this expands the package / file
     * node for the active file without rebuilding the entire tree.
     */
    async revealActiveDocument(docUri: vscode.Uri): Promise<void> {
        if (!this.treeView) return;

        const items = this.uriToRootItems.get(docUri.toString());
        if (!items || items.length === 0) return;

        const seen = new Set<vscode.TreeItem>();
        for (const item of items) {
            if (seen.has(item)) continue;
            seen.add(item);
            try {
                await this.treeView.reveal(item, { select: true, focus: false, expand: true });
            } catch {
                // Item may not be rendered yet — safe to ignore
            }
        }
    }

    /** Get the current workspace view mode. */
    getWorkspaceViewMode(): 'byFile' | 'bySemantic' {
        return this._workspaceViewMode;
    }

    /** Toggle between 'byFile' and 'bySemantic' workspace view modes. */
    toggleWorkspaceViewMode(): void {
        this._workspaceViewMode = this._workspaceViewMode === 'byFile' ? 'bySemantic' : 'byFile';
        vscode.commands.executeCommand('setContext', 'sysml.workspaceViewMode', this._workspaceViewMode);
        this._onDidChangeTreeData.fire();
    }

    /** Set the workspace view mode explicitly. */
    setWorkspaceViewMode(mode: 'byFile' | 'bySemantic'): void {
        this._workspaceViewMode = mode;
        vscode.commands.executeCommand('setContext', 'sysml.workspaceViewMode', this._workspaceViewMode);
        this._onDidChangeTreeData.fire();
    }

    /** Return stats from the most recent LSP model response, if available. */
    getLastStats(): { totalElements: number; resolvedElements: number; unresolvedElements: number; parseTimeMs: number; lexTimeMs?: number; parseOnlyTimeMs?: number; modelBuildTimeMs: number; complexity?: { complexityIndex: number; rating: string; definitions: number; usages: number; maxDepth: number; avgChildrenPerDef: number; couplingCount: number; unusedDefinitions: number; documentationCoverage: number; hotspots: { qualifiedName: string; kind: string; childCount: number; depth: number; typeRefs: number; hasDoc: boolean; score: number }[] } } | undefined {
        return this._lastStats;
    }

    refresh(): void {
        if (this.workspaceMode && this.workspaceFileUris.length > 0) {
            this.loadWorkspaceModel(this.workspaceFileUris);
        } else if (this.currentDocument) {
            this.loadDocument(this.currentDocument);
        }
        this._onDidChangeTreeData.fire();
    }

    /**
     * Clear the model explorer when no SysML files are open
     */
    clear(): void {
        this.currentDocument = undefined;
        this.pendingDocument = undefined;
        this.rootElements = [];
        this.workspaceMode = false;
        this.workspaceFileData.clear();
        this.workspaceFileUris = [];
        this._onDidChangeTreeData.fire();
    }

    /**
     * Load and display the aggregated model from all workspace SysML files.
     * Each file becomes a top-level node in the explorer.
     */
    async loadWorkspaceModel(fileUris: vscode.Uri[], cancellationToken?: vscode.CancellationToken): Promise<void> {
        this.workspaceMode = true;
        this.workspaceFileUris = fileUris;
        this.currentDocument = undefined;
        this.pendingDocument = undefined;
        this.workspaceFileData.clear();
        this.rootElements = [];
        this.isLoading = true;

        try {
            const { getOutputChannel } = require('../extension');
            getOutputChannel()?.appendLine(`ModelExplorer: loading workspace model (${fileUris.length} files)`);
        } catch { /* ignore */ }

        let totalElements = 0;
        let resolvedElements = 0;
        let totalParseTimeMs = 0;
        let totalLexTimeMs = 0;
        let totalParseOnlyTimeMs = 0;
        let totalBuildTimeMs = 0;

        try {
            for (const uri of fileUris) {
                if (cancellationToken?.isCancellationRequested) break;
                try {
                    const result = await this._lspModelProvider.getModel(
                        uri.toString(),
                        ['elements', 'relationships'],
                        cancellationToken,
                    );
                    if (result.elements?.length) {
                        this.workspaceFileData.set(uri.toString(), {
                            uri,
                            elements: (result.elements ?? []).map(dtoToSysMLElement),
                        });
                    }
                    if (result.stats) {
                        totalElements += result.stats.totalElements;
                        resolvedElements += result.stats.resolvedElements;
                        totalParseTimeMs += result.stats.parseTimeMs;
                        totalLexTimeMs += result.stats.lexTimeMs ?? 0;
                        totalParseOnlyTimeMs += result.stats.parseOnlyTimeMs ?? 0;
                        totalBuildTimeMs += result.stats.modelBuildTimeMs;
                    }
                } catch {
                    // Skip files that fail to load
                }
            }

            // Store aggregated stats
            this._lastStats = {
                totalElements,
                resolvedElements,
                unresolvedElements: totalElements - resolvedElements,
                parseTimeMs: totalParseTimeMs,
                lexTimeMs: totalLexTimeMs,
                parseOnlyTimeMs: totalParseOnlyTimeMs,
                modelBuildTimeMs: totalBuildTimeMs,
            };

            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(`ModelExplorer: workspace model loaded — ${this.workspaceFileData.size} files, ${totalElements} elements`);
            } catch { /* ignore */ }

            this._onDidChangeTreeData.fire();
        } finally {
            this.isLoading = false;
        }
    }

    async loadDocument(document: vscode.TextDocument, cancellationToken?: vscode.CancellationToken): Promise<void> {
        this.workspaceMode = false;
        this.workspaceFileData.clear();
        this.currentDocument = document;

        // If we're already loading, queue the new document so it isn't silently dropped
        if (this.isLoading) {
            this.pendingDocument = document;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine('ModelExplorer: loadDocument queued (already loading)');
            } catch { /* ignore */ }
            return;
        }

        // Check cancellation / closed before doing expensive work
        if (cancellationToken?.isCancellationRequested || document.isClosed) {
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(`ModelExplorer: cancelled/closed before parse for ${document.fileName}`);
            } catch { /* ignore */ }
            return;
        }

        this.isLoading = true;

        try {
            const { getOutputChannel } = require('../extension');
            getOutputChannel()?.appendLine(`ModelExplorer: Starting LSP model request for ${document.fileName}`);
        } catch { /* ignore */ }

        try {
            // ── LSP path ──────────────────────────────────────
            const result = await this._lspModelProvider.getModel(
                document.uri.toString(),
                ['elements', 'relationships'],
                cancellationToken,
            );

            // Always capture stats for the status-bar metrics feature,
            // even if the parse was cancelled.  This ensures the status
            // bar can display the latest data immediately rather than
            // waiting for a follow-up parse from notifyServerParseDone.
            if (result.stats) {
                this._lastStats = result.stats;
            }

            if (cancellationToken?.isCancellationRequested || document.isClosed) {
                return;
            }

            // Convert DTOs → SysMLElement so tree items work unchanged
            this.rootElements = (result.elements ?? []).map(dtoToSysMLElement);

            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(`ModelExplorer: LSP returned ${result.elements?.length ?? 0} elements`);
            } catch { /* ignore */ }

            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(`ModelExplorer: Converted to ${this.rootElements.length} tree root elements, firing change event`);
            } catch { /* ignore */ }

            this._onDidChangeTreeData.fire();
        } finally {
            this.isLoading = false;

            // If a new document was queued while we were loading, process it now
            if (this.pendingDocument) {
                const pending = this.pendingDocument;
                this.pendingDocument = undefined;
                this.loadDocument(pending);
            }
        }
    }

    /**
     * Return all known SysMLElement trees — from workspace data or
     * the current single-document root.  Used by the Feature Explorer
     * for "where used" reverse lookups.
     */
    getAllElements(): SysMLElement[] {
        if (this.workspaceMode) {
            return Array.from(this.workspaceFileData.values()).flatMap(d => d.elements);
        }
        return this.rootElements;
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        if (!element) {
            // Workspace mode: show file-level or semantic nodes
            if (this.workspaceMode && this.workspaceFileData.size > 0) {
                let items: vscode.TreeItem[];
                if (this._workspaceViewMode === 'byFile') {
                    // Group by filename
                    items = Array.from(this.workspaceFileData.entries()).map(
                        ([, data]) => new FileTreeItem(data.uri, data.elements.length)
                    );
                    // Build URI → root-item mapping (trivial in byFile mode)
                    this.uriToRootItems.clear();
                    for (const item of items) {
                        const fi = item as FileTreeItem;
                        this.uriToRootItems.set(fi.fileUri.toString(), [item]);
                    }
                } else {
                    // Semantic view: merge all elements into a unified model.
                    // SysML v2 allows the same package to be declared in
                    // multiple files — their members are merged into a single
                    // namespace.  We replicate this by combining children of
                    // same-named packages into one tree node.
                    const allEntries = Array.from(this.workspaceFileData.entries());
                    items = this.mergeNamespaceElements(allEntries);
                    // Build URI → root-item mapping for semantic mode
                    this.buildSemanticUriMapping(items);
                }
                this.cachedRootItems = items;
                return Promise.resolve(items);
            }

            if (!this.currentDocument) {
                return Promise.resolve([]);
            }
            const docUri = this.currentDocument.uri;
            // Even in single-document mode the LSP may return duplicate
            // package nodes (e.g. combined-content proxy from visualizeFolder).
            const mergedRoots = ModelExplorerProvider.mergeElements(this.rootElements);
            const items = mergedRoots.map(e => new ModelTreeItem(e, docUri));
            this.cachedRootItems = items;
            this.uriToRootItems.clear();
            this.uriToRootItems.set(docUri.toString(), items);
            return Promise.resolve(items);
        }

        // Expand a FileTreeItem → show that file's model elements
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyEl = element as any;
        if (anyEl.itemType === 'file-node' && anyEl.fileUri) {
            const data = this.workspaceFileData.get((anyEl.fileUri as vscode.Uri).toString());
            if (!data) return Promise.resolve([]);
            return Promise.resolve(data.elements.map(e => new ModelTreeItem(e, data.uri)));
        }

        // Expand a ModelTreeItem → show children, attributes, relationships
        const children: vscode.TreeItem[] = [];

        if (anyEl.itemType === 'sysml-element' && anyEl.element) {
            const sysmlElement = anyEl.element as SysMLElement;
            const parentUri = (anyEl.elementUri as vscode.Uri) ?? this.currentDocument?.uri;
            if (!parentUri) return Promise.resolve([]);

            // Check if this is a part/item with a type reference that needs lazy resolution
            const partType = sysmlElement.attributes.get('partType') as string;
            if ((sysmlElement.type === 'part' || sysmlElement.type === 'item') && partType && sysmlElement.children.length === 0) {
                const resolvedChildren = this.resolveTypeReference(sysmlElement, partType, parentUri);
                children.push(...resolvedChildren);
            } else {
                // Add SysML child elements (normal case)
                children.push(...sysmlElement.children.map((e: SysMLElement) => new ModelTreeItem(e, parentUri)));
            }

            // Add attributes as property nodes (but filter out partType to reduce clutter)
            const attributesToShow = Array.from(sysmlElement.attributes.entries()).filter(([key]) => key !== 'partType');
            if (attributesToShow.length > 0) {
                children.push(...attributesToShow.map(([key, value]) =>
                    new PropertyTreeItem(key, value, sysmlElement, parentUri)
                ));
            }

            // Add relationships as relationship nodes
            if (sysmlElement.relationships.length > 0) {
                children.push(...sysmlElement.relationships.map((rel: Relationship) =>
                    new RelationshipTreeItem(rel, sysmlElement, parentUri)
                ));
            }
        }

        return Promise.resolve(children);
    }

    /**
     * Merge same-named namespace elements (packages) across workspace files.
     *
     * SysML v2 allows the same package to appear in multiple files; their
     * members are combined into a single namespace.  This method replicates
     * that behaviour for the tree view by coalescing children of identically
     * named packages into one `ModelTreeItem`.
     */
    private mergeNamespaceElements(
        entries: [string, { uri: vscode.Uri; elements: SysMLElement[] }][]
    ): vscode.TreeItem[] {
        // Collect all root elements with their source URIs
        const pairs: { el: SysMLElement; uri: vscode.Uri }[] = [];
        for (const [, data] of entries) {
            for (const el of data.elements) {
                pairs.push({ el, uri: data.uri });
            }
        }

        // Group namespace-like elements (packages) by name+type, preserving order
        const namespaceTypes = new Set(['package']);
        const mergedMap = new Map<string, { merged: SysMLElement; uri: vscode.Uri }>();
        const result: vscode.TreeItem[] = [];

        for (const { el, uri } of pairs) {
            const key = `${el.type}::${el.name}`;
            if (namespaceTypes.has(el.type) && mergedMap.has(key)) {
                // Merge children, relationships, and attributes into existing element
                const existing = mergedMap.get(key);
                if (existing) { existing.merged = ModelExplorerProvider.mergeTwo(existing.merged, el); }
            } else if (namespaceTypes.has(el.type)) {
                // Clone the element so we don't mutate the original data
                const clone = ModelExplorerProvider.cloneElement(el);
                mergedMap.set(key, { merged: clone, uri });
                result.push(new ModelTreeItem(clone, uri));
            } else {
                result.push(new ModelTreeItem(el, uri));
            }
        }

        // Update tree items that reference merged elements (since we cloned,
        // the ModelTreeItem already points to the mutable clone).
        return result;
    }

    /**
     * Build a mapping from file URI → root tree items whose elements
     * originate (at least partly) from that file.  Used by
     * `revealActiveDocument` to find which packages to expand.
     */
    private buildSemanticUriMapping(rootItems: vscode.TreeItem[]): void {
        this.uriToRootItems.clear();
        for (const [uriStr, data] of this.workspaceFileData) {
            const matching: vscode.TreeItem[] = [];
            for (const el of data.elements) {
                const key = `${el.type}::${el.name}`;
                const match = rootItems.find(item => {
                    const mti = item as ModelTreeItem;
                    if (mti.itemType !== 'sysml-element') return false;
                    return `${mti.element.type}::${mti.element.name}` === key;
                });
                if (match && !matching.includes(match)) {
                    matching.push(match);
                }
            }
            if (matching.length > 0) {
                this.uriToRootItems.set(uriStr, matching);
            }
        }
    }

    /**
     * Merge a flat list of `SysMLElement`s so that same-named packages
     * have their children combined.  Used for single-document mode when
     * the LSP returns duplicate package declarations (e.g. combined-content
     * proxy produced by visualizeFolder).
     */
    static mergeElements(elements: readonly SysMLElement[]): SysMLElement[] {
        const namespaceTypes = new Set(['package']);
        const mergedMap = new Map<string, SysMLElement>();
        const result: SysMLElement[] = [];

        for (const el of elements) {
            const key = `${el.type}::${el.name}`;
            if (namespaceTypes.has(el.type) && mergedMap.has(key)) {
                const existing = mergedMap.get(key) ?? el;
                const merged = ModelExplorerProvider.mergeTwo(existing, el);
                // Replace in-place in result
                const idx = result.indexOf(existing);
                if (idx !== -1) { result[idx] = merged; }
                mergedMap.set(key, merged);
            } else if (namespaceTypes.has(el.type)) {
                const clone = ModelExplorerProvider.cloneElement(el);
                mergedMap.set(key, clone);
                result.push(clone);
            } else {
                result.push(el);
            }
        }

        return result;
    }

    /**
     * Merge two same-named namespace elements.  Children are combined
     * (de-duplicated by name+type), attributes and relationships are unioned.
     */
    private static mergeTwo(a: SysMLElement, b: SysMLElement): SysMLElement {
        // Merge children — avoid duplicates by name+type
        const childKeys = new Set(a.children.map(c => `${c.type}::${c.name}`));
        for (const child of b.children) {
            const ck = `${child.type}::${child.name}`;
            if (!childKeys.has(ck)) {
                a.children.push(child);
                childKeys.add(ck);
            }
        }

        // Merge attributes (b wins on conflict)
        for (const [k, v] of b.attributes) {
            if (!a.attributes.has(k)) {
                a.attributes.set(k, v);
            }
        }

        // Merge relationships — avoid duplicates by type+source+target
        const relKeys = new Set(a.relationships.map(r => `${r.type}::${r.source}::${r.target}`));
        for (const rel of b.relationships) {
            const rk = `${rel.type}::${rel.source}::${rel.target}`;
            if (!relKeys.has(rk)) {
                a.relationships.push(rel);
                relKeys.add(rk);
            }
        }

        return a;
    }

    /** Shallow-clone a SysMLElement so the original data isn't mutated. */
    private static cloneElement(el: SysMLElement): SysMLElement {
        return {
            type: el.type,
            name: el.name,
            range: el.range,
            children: [...el.children],
            attributes: new Map(el.attributes),
            relationships: [...el.relationships],
            errors: el.errors ? [...el.errors] : undefined,
        };
    }

    /**
     * Lazily resolve type reference for a part/item
     */
    private resolveTypeReference(element: SysMLElement, partType: string, uri: vscode.Uri): vscode.TreeItem[] {
        // Find the type definition in the parsed elements
        const allElements = this.workspaceMode
            ? Array.from(this.workspaceFileData.values()).flatMap(d => d.elements)
            : this.rootElements;
        const typeDefinition = this.findTypeDefinition(partType, allElements);

        if (!typeDefinition) {
            return [];
        }

        const children: vscode.TreeItem[] = [];

        // Add child elements from type definition
        children.push(...typeDefinition.children.map((e: SysMLElement) => new ModelTreeItem(e, uri)));

        // Add attributes from type definition as property nodes
        const attributesToShow = Array.from(typeDefinition.attributes.entries()).filter(([key]) => key !== 'partType' && key !== 'modifier');
        children.push(...attributesToShow.map(([key, value]) =>
            new PropertyTreeItem(key, value, typeDefinition, uri)
        ));

        // Add relationships from type definition
        children.push(...typeDefinition.relationships.map((rel: Relationship) =>
            new RelationshipTreeItem(rel, typeDefinition, uri)
        ));

        return children;
    }

    /**
     * Find a type definition by name in the element tree
     */
    private findTypeDefinition(typeName: string, elements: SysMLElement[]): SysMLElement | null {
        for (const element of elements) {
            if ((element.type === 'part def' || element.type === 'item def') && element.name === typeName) {
                return element;
            }

            // Recursively search in children
            const found = this.findTypeDefinition(typeName, element.children);
            if (found) {
                return found;
            }
        }

        return null;
    }
}

export class FileTreeItem extends vscode.TreeItem {
    public readonly itemType = 'file-node';

    constructor(
        public readonly fileUri: vscode.Uri,
        childCount: number
    ) {
        const fileName = fileUri.fsPath.split('/').pop() || fileUri.toString();
        super(fileName, vscode.TreeItemCollapsibleState.Collapsed);

        this.tooltip = `${fileUri.fsPath} (${childCount} elements)`;
        this.description = `${childCount} elements`;
        this.iconPath = new vscode.ThemeIcon('file');
        this.contextValue = 'sysmlFile';
        this.resourceUri = fileUri;

        this.command = {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [fileUri]
        };
    }
}

export class ModelTreeItem extends vscode.TreeItem {
    public readonly itemType = 'sysml-element';
    public readonly elementUri: vscode.Uri;

    constructor(
        public readonly element: SysMLElement,
        uri: vscode.Uri
    ) {
        super(
            element.name,
            // Make expandable if has children/attributes OR if it's a part/item with a type reference
            element.children.length > 0 || element.attributes.size > 0 || element.relationships.length > 0 ||
            ((element.type === 'part' || element.type === 'item') && element.attributes.has('partType'))
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None
        );

        this.elementUri = uri;

        // Debug: trace unnamed elements
        if (element.name === 'unnamed' && element.type === 'connection') {
            // eslint-disable-next-line no-console
            console.log(`[TreeView] Connection at line ${element.range?.start?.line} showing as unnamed`);
        }

        // ── Extract attributes for inline decorations ──
        const partType = element.attributes.get('partType') as string | undefined;
        const portType = element.attributes.get('portType') as string | undefined;
        const typeName = partType || portType;
        const multiplicity = element.attributes.get('multiplicity') as string | undefined;
        const modifier = element.attributes.get('modifier') as string | undefined;
        const direction = element.attributes.get('direction') as string | undefined;
        const visibility = element.attributes.get('visibility') as string | undefined;
        const value = element.attributes.get('value') as string | undefined;
        const errorCount = element.errors?.length ?? 0;

        // ── Build enriched label: "name : Type [mult]" ──
        let labelText = element.name;
        if (typeName) {
            labelText += ` : ${typeName}`;
        }
        if (multiplicity) {
            labelText += ` [${multiplicity}]`;
        }
        this.label = labelText;

        // ── Build description: type + modifiers/direction/value + error count ──
        const typePrefix = this.getTypePrefix(element.type);
        const descParts: string[] = [typePrefix + element.type];
        if (direction) {
            descParts.push(direction);
        }
        if (modifier) {
            descParts.push(modifier);
        }
        if (visibility && visibility !== 'public') {
            descParts.push(visibility);
        }
        if (value !== undefined) {
            descParts.push(`= ${value}`);
        }
        if (errorCount > 0) {
            descParts.push(`⚠ ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`);
        }
        this.description = descParts.join(' · ');

        // ── Rich tooltip with all metadata ──
        const tooltipLines: string[] = [];
        tooltipLines.push(`**${element.type}** \`${element.name}\``);
        if (typeName) { tooltipLines.push(`**Type:** ${typeName}`); }
        if (multiplicity) { tooltipLines.push(`**Multiplicity:** [${multiplicity}]`); }
        if (direction) { tooltipLines.push(`**Direction:** ${direction}`); }
        if (modifier) { tooltipLines.push(`**Modifiers:** ${modifier}`); }
        if (visibility) { tooltipLines.push(`**Visibility:** ${visibility}`); }
        if (value !== undefined) { tooltipLines.push(`**Value:** ${value}`); }
        if (element.children.length > 0) {
            tooltipLines.push(`**Children:** ${element.children.length}`);
        }
        if (element.relationships.length > 0) {
            tooltipLines.push(`**Relationships:** ${element.relationships.length}`);
        }
        if (errorCount > 0) {
            tooltipLines.push(`\n⚠️ **${errorCount} error${errorCount !== 1 ? 's' : ''}:**`);
            for (const err of (element.errors ?? []).slice(0, 5)) {
                tooltipLines.push(`- ${err}`);
            }
            if (errorCount > 5) { tooltipLines.push(`- …and ${errorCount - 5} more`); }
        }
        const md = new vscode.MarkdownString(tooltipLines.join('\n\n'));
        md.isTrusted = true;
        this.tooltip = md;

        // ── Icon: use warning icon for elements with errors ──
        if (errorCount > 0) {
            this.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('list.warningForeground'));
        } else {
            this.iconPath = this.getIconForType(element.type);
        }

        this.command = {
            command: 'sysml.jumpToDefinition',
            title: 'Jump to Definition',
            arguments: [uri, element.range]
        };

        if (element.type === 'package') {
            this.contextValue = 'sysmlPackage';
        } else if (element.relationships.length > 0) {
            this.contextValue = 'elementWithRelationships';
        }
    }

    private getTypePrefix(type: string): string {
        const prefixMap: { [key: string]: string } = {
            'package': '📦 ',
            'part': '🧩 ',
            'port': '🔌 ',
            'action': '⚡ ',
            'state': '🔄 ',
            'requirement': '✅ ',
            'use case': '👤 ',
            'constraint': '🔒 ',
            'attribute': '🏷️ ',
            'reference': '🔗 ',
            'connection': '🔀 ',
            'interface': '🔌 ',
            'flow def': '🔀 ',
            'flowProperty': '🔀 ',
            'item': '📋 ',
            'enum': '📚 ',
            'datatype': '🔢 ',
            'view': '👁️ ',
            'metadata': '🏷️ ',
            'comment': '💬 ',
            'doc': '📖 '
        };
        return prefixMap[type] || '◦ ';
    }

    private getIconForType(type: string): vscode.ThemeIcon {
        const iconMap: { [key: string]: string } = {
            'package': 'package',
            'part': 'symbol-class',
            'port': 'symbol-interface',
            'action': 'symbol-method',
            'state': 'symbol-enum',
            'requirement': 'checklist',
            'use case': 'person',
            'constraint': 'lock',
            'attribute': 'symbol-property',
            'reference': 'references',
            'connection': 'link',
            'interface': 'symbol-interface',
            'flow def': 'link',
            'flowProperty': 'arrow-both',
            'item': 'symbol-struct',
            'enum': 'symbol-enum',
            'datatype': 'symbol-field',
            'view': 'eye',
            'metadata': 'tag',
            'comment': 'comment',
            'doc': 'book'
        };

        return new vscode.ThemeIcon(iconMap[type] || 'symbol-misc');
    }
}

export class PropertyTreeItem extends vscode.TreeItem {
    public readonly itemType = 'property';

    constructor(
        public readonly key: string,
        public readonly value: string | number | boolean,
        public readonly parentElement: SysMLElement,
        private documentUri: vscode.Uri
    ) {
        super(
            `${key}: ${value}`,
            vscode.TreeItemCollapsibleState.None
        );

        this.tooltip = `Property: ${key} = ${value}`;
        this.description = `${typeof value}`;
        this.iconPath = new vscode.ThemeIcon('symbol-property');
        this.contextValue = 'property';

        // Make properties clickable to jump to parent element
        this.command = {
            command: 'sysml.jumpToDefinition',
            title: 'Jump to Parent Definition',
            arguments: [documentUri, parentElement.range]
        };
    }
}

export class RelationshipTreeItem extends vscode.TreeItem {
    public readonly itemType = 'relationship';

    constructor(
        public readonly relationship: Relationship,
        public readonly parentElement: SysMLElement,
        private documentUri: vscode.Uri
    ) {
        super(
            `${relationship.type}: ${relationship.target}`,
            vscode.TreeItemCollapsibleState.None
        );

        this.tooltip = `${relationship.type} relationship from ${relationship.source} to ${relationship.target}`;
        this.description = relationship.type;
        this.iconPath = this.getRelationshipIcon(relationship.type);
        this.contextValue = 'relationship';

        // Make relationships clickable to jump to parent element
        this.command = {
            command: 'sysml.jumpToDefinition',
            title: 'Jump to Parent Definition',
            arguments: [documentUri, parentElement.range]
        };
    }

    private getRelationshipIcon(type: string): vscode.ThemeIcon {
        const iconMap: { [key: string]: string } = {
            'specializes': 'arrow-up',
            'features': 'symbol-property',
            'redefinition': 'replace',
            'subsetting': 'symbol-namespace',
            'typing': 'symbol-class',
            'conjugation': 'symbol-interface',
            'disjoining': 'circle-slash',
            'differencing': 'diff',
            'intersecting': 'symbol-operator',
            'unioning': 'symbol-operator',
            'allocation': 'arrow-both',
            'dependency': 'arrow-right',
            'succession': 'arrow-right',
            'connection': 'link'
        };

        return new vscode.ThemeIcon(iconMap[type] || 'arrow-right');
    }
}
