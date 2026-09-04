import * as vscode from 'vscode';
import type { LspModelProvider } from '../providers/lspModelProvider';
import type { ResolvedFeatureDTO, ResolvedTypeDTO } from '../providers/sysmlModelTypes';
import type { SysMLElement } from '../types/sysmlTypes';

// ─────────────────────────────────────────────────────────────────────────────
// Tree node types
// ─────────────────────────────────────────────────────────────────────────────

type FeatureTreeNode =
    | DefinitionHeaderItem
    | SpecializationChainItem
    | SpecializationItem
    | FeatureGroupItem
    | FeatureItem
    | WhereUsedGroupItem
    | WhereUsedItem
    | InfoItem;

/** Root-level header showing the selected definition name + kind. */
class DefinitionHeaderItem extends vscode.TreeItem {
    public readonly nodeType = 'definition-header';
    constructor(public readonly resolved: ResolvedTypeDTO) {
        super(resolved.simpleName, vscode.TreeItemCollapsibleState.Expanded);
        this.description = resolved.kind + (resolved.isLibraryType ? ' (library)' : '');
        const md = new vscode.MarkdownString();
        md.appendMarkdown(`**${resolved.kind}** \`${resolved.qualifiedName}\``);
        if (resolved.isLibraryType) { md.appendMarkdown(' *(library type)*'); }
        md.isTrusted = true;
        this.tooltip = md;
        this.iconPath = new vscode.ThemeIcon('symbol-class');
        this.contextValue = 'featureExplorer.header';
    }
}

/** Expandable group showing the specialization / inheritance chain. */
class SpecializationChainItem extends vscode.TreeItem {
    public readonly nodeType = 'specialization-chain';
    constructor(public readonly chain: string[]) {
        super('Specialization Chain', vscode.TreeItemCollapsibleState.Collapsed);
        this.description = chain.length > 0 ? `(${chain.length})` : 'none';
        this.iconPath = new vscode.ThemeIcon('type-hierarchy');
        this.contextValue = 'featureExplorer.specChain';
    }
}

/** Single entry in the specialization chain. */
class SpecializationItem extends vscode.TreeItem {
    public readonly nodeType = 'specialization';
    constructor(public readonly qualifiedName: string, depth: number) {
        super(qualifiedName.split('::').pop() || qualifiedName, vscode.TreeItemCollapsibleState.None);
        this.description = depth === 0 ? '(direct)' : `depth ${depth}`;
        this.tooltip = qualifiedName;
        this.iconPath = new vscode.ThemeIcon('arrow-up');
        this.contextValue = 'featureExplorer.spec';
    }
}

/** Expandable group for a category of features (parts, ports, attributes, etc.). */
class FeatureGroupItem extends vscode.TreeItem {
    public readonly nodeType = 'feature-group';
    constructor(
        public readonly groupKind: string,
        public readonly features: ResolvedFeatureDTO[],
        icon: string,
    ) {
        super(groupKind, vscode.TreeItemCollapsibleState.Expanded);
        this.description = `(${features.length})`;
        this.iconPath = new vscode.ThemeIcon(icon);
        this.contextValue = 'featureExplorer.group';
    }
}

/** Single feature entry with type, multiplicity, direction, modifiers. */
class FeatureItem extends vscode.TreeItem {
    public readonly nodeType = 'feature';
    constructor(public readonly feature: ResolvedFeatureDTO) {
        // Label: "name : Type [mult]"
        let labelText = feature.name;
        if (feature.type) { labelText += ` : ${feature.type}`; }
        if (feature.multiplicity) { labelText += ` [${feature.multiplicity}]`; }
        super(labelText, vscode.TreeItemCollapsibleState.None);

        // Description: direction + modifiers
        const descParts: string[] = [];
        if (feature.direction) { descParts.push(feature.direction); }
        if (feature.isDerived) { descParts.push('derived'); }
        if (feature.isReadonly) { descParts.push('readonly'); }
        if (feature.visibility && feature.visibility !== 'public') {
            descParts.push(feature.visibility);
        }
        this.description = descParts.length > 0 ? descParts.join(' · ') : undefined;

        // Rich tooltip
        const md = new vscode.MarkdownString();
        md.appendMarkdown(`**${feature.kind}** \`${feature.name}\``);
        if (feature.type) { md.appendMarkdown(`\n\n**Type:** ${feature.type}`); }
        if (feature.multiplicity) { md.appendMarkdown(`\n\n**Multiplicity:** [${feature.multiplicity}]`); }
        if (feature.direction) { md.appendMarkdown(`\n\n**Direction:** ${feature.direction}`); }
        if (feature.visibility) { md.appendMarkdown(`\n\n**Visibility:** ${feature.visibility}`); }
        if (feature.isDerived) { md.appendMarkdown(`\n\n*derived*`); }
        if (feature.isReadonly) { md.appendMarkdown(`\n\n*readonly*`); }
        md.isTrusted = true;
        this.tooltip = md;

        this.iconPath = FeatureItem.iconForKind(feature.kind);
        this.contextValue = 'featureExplorer.feature';
    }

    private static iconForKind(kind: string): vscode.ThemeIcon {
        const map: Record<string, string> = {
            'PartUsage': 'symbol-class',
            'PartDefinition': 'symbol-class',
            'PortUsage': 'symbol-interface',
            'PortDefinition': 'symbol-interface',
            'AttributeUsage': 'symbol-property',
            'AttributeDefinition': 'symbol-property',
            'ReferenceUsage': 'references',
            'ActionUsage': 'symbol-method',
            'StateUsage': 'symbol-enum',
            'ConstraintUsage': 'lock',
            'RequirementUsage': 'checklist',
            'ItemUsage': 'symbol-struct',
            'ConnectionUsage': 'link',
            'FlowConnectionUsage': 'arrow-both',
            'InterfaceUsage': 'symbol-interface',
        };
        const legacyMap: Record<string, string> = {
            'part': 'symbol-class',
            'port': 'symbol-interface',
            'attribute': 'symbol-property',
            'ref': 'references',
            'action': 'symbol-method',
            'perform action': 'symbol-method',
            'state': 'symbol-enum',
            'exhibit state': 'symbol-enum',
            'constraint': 'lock',
            'requirement': 'checklist',
            'item': 'symbol-struct',
            'connection': 'link',
            'interface': 'symbol-interface',
        };
        return new vscode.ThemeIcon(map[kind] || legacyMap[kind.toLowerCase()] || 'symbol-field');
    }
}

/** Group header for "Where Used" reverse-lookup results. */
class WhereUsedGroupItem extends vscode.TreeItem {
    public readonly nodeType = 'where-used-group';
    constructor(public readonly usages: WhereUsedEntry[]) {
        super('Where Used', vscode.TreeItemCollapsibleState.Collapsed);
        this.description = `(${usages.length})`;
        this.iconPath = new vscode.ThemeIcon('references');
        this.contextValue = 'featureExplorer.whereUsedGroup';
    }
}

interface WhereUsedEntry {
    elementName: string;
    elementType: string;
    uri: vscode.Uri;
}

/** Single "where used" entry. */
class WhereUsedItem extends vscode.TreeItem {
    public readonly nodeType = 'where-used';
    constructor(public readonly entry: WhereUsedEntry) {
        super(entry.elementName, vscode.TreeItemCollapsibleState.None);
        this.description = entry.elementType;
        this.tooltip = `Used in ${entry.elementType} "${entry.elementName}"`;
        this.iconPath = new vscode.ThemeIcon('symbol-reference');
        this.contextValue = 'featureExplorer.whereUsed';
        this.command = {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [entry.uri],
        };
    }
}

/** Simple info/placeholder node (e.g. "No definition selected"). */
class InfoItem extends vscode.TreeItem {
    public readonly nodeType = 'info';
    constructor(text: string, icon?: string) {
        super(text, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon(icon ?? 'info');
        this.contextValue = 'featureExplorer.info';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export class FeatureExplorerProvider implements vscode.TreeDataProvider<FeatureTreeNode> {
    private _onDidChangeTreeData = new vscode.EventEmitter<FeatureTreeNode | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    /** The currently displayed ResolvedTypeDTO (if any). */
    private resolvedType: ResolvedTypeDTO | undefined;
    /** Reverse lookup: elements whose attributes reference this type name. */
    private whereUsedEntries: WhereUsedEntry[] = [];
    /** Cached resolvedTypes maps per URI from the LSP. */
    private resolvedTypesCache = new Map<string, Record<string, ResolvedTypeDTO>>();

    constructor(private lspModelProvider: LspModelProvider) {}

    // ── Public API ──────────────────────────────────────────────────

    /**
     * Called when the user selects a definition element in the Model Explorer.
     * Loads the resolved type from the LSP and refreshes the Feature Explorer.
     */
    async selectElement(element: SysMLElement, uri: vscode.Uri, allElements?: SysMLElement[]): Promise<void> {
        const typeName = element.name;
        const resolved = await this.getResolvedType(typeName, uri);

        if (resolved) {
            this.resolvedType = resolved;
            this.whereUsedEntries = allElements
                ? this.findWhereUsed(typeName, allElements, uri)
                : [];
        } else {
            // No resolved type — still show basic info from the element itself
            this.resolvedType = undefined;
            this.whereUsedEntries = [];
        }

        this._onDidChangeTreeData.fire();
    }

    /** Clear the view (e.g. when no element selected). */
    clear(): void {
        this.resolvedType = undefined;
        this.whereUsedEntries = [];
        this._onDidChangeTreeData.fire();
    }

    /** Push resolved types externally (e.g. after a parse completes). */
    pushResolvedTypes(uri: string, types: Record<string, ResolvedTypeDTO>): void {
        this.resolvedTypesCache.set(uri, types);
    }

    // ── TreeDataProvider implementation ─────────────────────────────

    getTreeItem(element: FeatureTreeNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FeatureTreeNode): FeatureTreeNode[] {
        // Top-level children
        if (!element) {
            if (!this.resolvedType) {
                return [new InfoItem('Select a definition in the Model Explorer', 'arrow-left')];
            }

            const resolved = this.resolvedType;
            const items: FeatureTreeNode[] = [];

            // 1. Definition header
            items.push(new DefinitionHeaderItem(resolved));

            // 2. Specialization chain
            if (resolved.specializationChain.length > 0 || resolved.specializes.length > 0) {
                const chain = resolved.specializationChain.length > 0
                    ? resolved.specializationChain
                    : resolved.specializes;
                items.push(new SpecializationChainItem(chain));
            }

            // 3. Feature groups — categorise by kind
            const grouped = this.groupFeatures(resolved.features);
            for (const [kind, features] of grouped) {
                items.push(new FeatureGroupItem(kind, features, this.iconForGroupKind(kind)));
            }

            // 4. Where Used
            if (this.whereUsedEntries.length > 0) {
                items.push(new WhereUsedGroupItem(this.whereUsedEntries));
            }

            return items;
        }

        // Expand specialization chain
        if (element instanceof SpecializationChainItem) {
            return element.chain.map((name, i) => new SpecializationItem(name, i));
        }

        // Expand feature group
        if (element instanceof FeatureGroupItem) {
            return element.features.map(f => new FeatureItem(f));
        }

        // Expand where-used group
        if (element instanceof WhereUsedGroupItem) {
            return element.usages.map(u => new WhereUsedItem(u));
        }

        return [];
    }

    getParent(): FeatureTreeNode | undefined {
        return undefined;
    }

    // ── Private helpers ─────────────────────────────────────────────

    /**
     * Group features by a human-friendly category derived from their `kind`.
     * Returns an ordered map so groups appear in a consistent order.
     */
    private groupFeatures(features: ResolvedFeatureDTO[]): Map<string, ResolvedFeatureDTO[]> {
        const order = [
            'Parts', 'Ports', 'Attributes', 'References',
            'Actions', 'States', 'Constraints', 'Requirements',
            'Items', 'Connections', 'Other',
        ];
        const categoryMap: Record<string, string> = {
            'PartUsage': 'Parts',
            'PartDefinition': 'Parts',
            'PortUsage': 'Ports',
            'PortDefinition': 'Ports',
            'AttributeUsage': 'Attributes',
            'AttributeDefinition': 'Attributes',
            'ReferenceUsage': 'References',
            'ActionUsage': 'Actions',
            'ActionDefinition': 'Actions',
            'StateUsage': 'States',
            'StateDefinition': 'States',
            'ConstraintUsage': 'Constraints',
            'ConstraintDefinition': 'Constraints',
            'RequirementUsage': 'Requirements',
            'RequirementDefinition': 'Requirements',
            'ItemUsage': 'Items',
            'ItemDefinition': 'Items',
            'ConnectionUsage': 'Connections',
            'FlowConnectionUsage': 'Connections',
            'InterfaceUsage': 'Connections',
            'PerformActionUsage': 'Actions',
            'ExhibitStateUsage': 'States',
            'TransitionUsage': 'States',
            'part': 'Parts',
            'part def': 'Parts',
            'port': 'Ports',
            'port def': 'Ports',
            'attribute': 'Attributes',
            'attribute def': 'Attributes',
            'ref': 'References',
            'action': 'Actions',
            'action def': 'Actions',
            'perform action': 'Actions',
            'state': 'States',
            'state def': 'States',
            'exhibit state': 'States',
            'transition': 'States',
            'constraint': 'Constraints',
            'constraint def': 'Constraints',
            'requirement': 'Requirements',
            'requirement def': 'Requirements',
            'item': 'Items',
            'item def': 'Items',
            'connection': 'Connections',
            'connection def': 'Connections',
            'interface': 'Connections',
            'interface def': 'Connections',
        };

        const groups = new Map<string, ResolvedFeatureDTO[]>();
        for (const f of features) {
            const cat = categoryMap[f.kind] ?? categoryMap[f.kind.toLowerCase()] ?? 'Other';
            let arr = groups.get(cat);
            if (!arr) { arr = []; groups.set(cat, arr); }
            arr.push(f);
        }

        // Sort by canonical order
        const sorted = new Map<string, ResolvedFeatureDTO[]>();
        for (const cat of order) {
            const g = groups.get(cat);
            if (g) { sorted.set(cat, g); }
        }
        return sorted;
    }

    private iconForGroupKind(kind: string): string {
        const map: Record<string, string> = {
            'Parts': 'symbol-class',
            'Ports': 'symbol-interface',
            'Attributes': 'symbol-property',
            'References': 'references',
            'Actions': 'symbol-method',
            'States': 'symbol-enum',
            'Constraints': 'lock',
            'Requirements': 'checklist',
            'Items': 'symbol-struct',
            'Connections': 'link',
            'Other': 'symbol-field',
        };
        return map[kind] ?? 'symbol-field';
    }

    /**
     * Look up the resolved type for a given type name from the LSP cache
     * or by requesting it from the LSP server.
     */
    private async getResolvedType(typeName: string, uri: vscode.Uri): Promise<ResolvedTypeDTO | undefined> {
        // Try cached types first
        for (const types of this.resolvedTypesCache.values()) {
            const match = Object.values(types).find(
                t => t.simpleName === typeName || t.qualifiedName === typeName || t.qualifiedName.endsWith(`::${typeName}`)
            );
            if (match) { return match; }
        }

        // Fetch from LSP
        try {
            const result = await this.lspModelProvider.getModel(
                uri.toString(),
                ['resolvedTypes'],
            );
            if (result.resolvedTypes) {
                this.resolvedTypesCache.set(uri.toString(), result.resolvedTypes);
                const match = Object.values(result.resolvedTypes).find(
                    t => t.simpleName === typeName || t.qualifiedName === typeName || t.qualifiedName.endsWith(`::${typeName}`)
                );
                return match;
            }
        } catch {
            // LSP unavailable — fall through
        }
        return undefined;
    }

    /**
     * Scan all known elements to find usages that reference `typeName`
     * in their `partType` or `portType` attribute.
     */
    private findWhereUsed(typeName: string, elements: SysMLElement[], uri: vscode.Uri): WhereUsedEntry[] {
        const usages: WhereUsedEntry[] = [];
        this.collectWhereUsed(typeName, elements, uri, usages);
        return usages;
    }

    private collectWhereUsed(
        typeName: string,
        elements: SysMLElement[],
        uri: vscode.Uri,
        out: WhereUsedEntry[],
    ): void {
        for (const el of elements) {
            const pt = (el.attributes.get('partType') ?? el.attributes.get('portType')) as string | undefined;
            if (pt === typeName) {
                out.push({ elementName: el.name, elementType: el.type, uri });
            }
            if (el.children.length > 0) {
                this.collectWhereUsed(typeName, el.children, uri, out);
            }
        }
    }
}
