import type { DiagramElementViewModel, DiagramRelationshipViewModel, VisualizationDataset } from '../viewModels';

export type PackageNodeKind = 'standard' | 'domain' | 'interface' | 'external';
export type PackageDependencyKind = 'import' | 'exposes' | 'dependency';

export interface PackageNodeViewModel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly kind: PackageNodeKind;
    readonly stereotype?: string;
    readonly parentId?: string;
    readonly childPackageIds: readonly string[];
    readonly elementCount: number;
    readonly dependencyCount: number;
    readonly path: readonly string[];
}

export interface PackageDependencyViewModel {
    readonly id: string;
    readonly type: string;
    readonly kind: PackageDependencyKind;
    readonly sourceId: string;
    readonly targetId: string;
}

export interface PackageViewModelMetadata {
    readonly packageCount: number;
    readonly dependencyCount: number;
    readonly maxDepth: number;
    readonly orphanCount: number;
}

export interface PackageViewModel {
    readonly nodes: readonly PackageNodeViewModel[];
    readonly dependencies: readonly PackageDependencyViewModel[];
    readonly metadata: PackageViewModelMetadata;
}

const PACKAGE_TYPE_KEYWORDS = ['package', 'namespace'];
const DOMAIN_PACKAGE_KEYWORDS = ['domain', 'domain library', 'library'];
const INTERFACE_PACKAGE_KEYWORDS = ['interface', 'api'];
const EXTERNAL_PACKAGE_KEYWORDS = ['external', 'imported'];

const DEPENDENCY_REL_KEYWORDS = ['dependency', 'depend', 'relate'];
const IMPORT_REL_KEYWORDS = ['import', 'include', 'using'];
const EXPOSURE_REL_KEYWORDS = ['expose', 'exposed', 'exposes', 'publish'];

interface MutablePackageNode {
    id: string;
    name: string;
    type: string;
    kind: PackageNodeKind;
    stereotype?: string;
    parentId?: string;
    childPackageIds: string[];
    elementCount: number;
    dependencyCount: number;
    path: readonly string[];
}

export function buildPackageViewModel(dataset: VisualizationDataset): PackageViewModel | undefined {
    if (!dataset?.elements || dataset.elements.length === 0) {
        return undefined;
    }

    const nodes: MutablePackageNode[] = [];
    const nodeIndex = new Map<string, MutablePackageNode>();
    const nameIndex = new Map<string, MutablePackageNode[]>();
    let syntheticIdCounter = 0;

    const visitElement = (element: DiagramElementViewModel | undefined, parentPackage?: MutablePackageNode) => {
        if (!element) {
            return;
        }

        const normalizedType = normalizeType(element.type);
        const isPackage = matchesKeyword(normalizedType, PACKAGE_TYPE_KEYWORDS);
        let currentParent = parentPackage;

        if (isPackage) {
            const nodeId = element.id || `package-node-${++syntheticIdCounter}`;
            let node = nodeIndex.get(nodeId);
            if (!node) {
                node = {
                    id: nodeId,
                    name: element.name || element.type || nodeId,
                    type: element.type || 'package',
                    kind: classifyPackageKind(normalizedType),
                    stereotype: element.type,
                    parentId: parentPackage?.id,
                    childPackageIds: [],
                    elementCount: countDescendantElements(element),
                    dependencyCount: 0,
                    path: element.metadata?.path ?? []
                };
                nodes.push(node);
                nodeIndex.set(nodeId, node);
                indexNodeByName(node, nameIndex);
            }

            if (parentPackage && parentPackage.id !== node.id) {
                if (!parentPackage.childPackageIds.includes(node.id)) {
                    parentPackage.childPackageIds.push(node.id);
                }
            }

            currentParent = node;
        }

        if (Array.isArray(element.children)) {
            element.children.forEach(child => visitElement(child, currentParent));
        }
    };

    dataset.elements.forEach(element => visitElement(element));

    if (nodes.length === 0) {
        return undefined;
    }

    const { dependencies, dependencyCounts } = buildPackageDependencies(dataset, nodeIndex, nameIndex);
    const finalNodes: PackageNodeViewModel[] = nodes.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        kind: node.kind,
        stereotype: node.stereotype,
        parentId: node.parentId,
        childPackageIds: [...node.childPackageIds],
        elementCount: node.elementCount,
        dependencyCount: dependencyCounts.get(node.id) ?? 0,
        path: node.path
    }));

    const metadata: PackageViewModelMetadata = {
        packageCount: finalNodes.length,
        dependencyCount: dependencies.length,
        maxDepth: finalNodes.reduce((max, node) => Math.max(max, node.path.length), 0),
        orphanCount: finalNodes.filter(node => !node.parentId).length
    };

    return {
        nodes: finalNodes,
        dependencies,
        metadata
    };
}

function buildPackageDependencies(
    dataset: VisualizationDataset,
    nodeIndex: Map<string, MutablePackageNode>,
    nameIndex: Map<string, MutablePackageNode[]>
): { dependencies: PackageDependencyViewModel[]; dependencyCounts: Map<string, number> } {
    const relationships = collectRelationships(dataset);
    const dependencies: PackageDependencyViewModel[] = [];
    const dependencyCounts = new Map<string, number>();
    const seen = new Set<string>();

    relationships.forEach(rel => {
        if (!rel || !rel.source || !rel.target) {
            return;
        }
        const sourceId = resolvePackageReference(rel.source, nodeIndex, nameIndex);
        const targetId = resolvePackageReference(rel.target, nodeIndex, nameIndex);
        if (!sourceId || !targetId || sourceId === targetId) {
            return;
        }
        const normalizedType = normalizeType(rel.type);
        if (normalizedType && !isPackageDependency(normalizedType)) {
            return;
        }
        const kind = normalizedType ? classifyDependencyKind(normalizedType) : 'dependency';
        const key = `${sourceId}->${targetId}:${kind}`;
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        dependencies.push({
            id: rel.id || `pkg-dep-${dependencies.length}`,
            type: rel.type || 'dependency',
            kind,
            sourceId,
            targetId
        });
        dependencyCounts.set(sourceId, (dependencyCounts.get(sourceId) ?? 0) + 1);
    });

    return { dependencies, dependencyCounts };
}

function resolvePackageReference(
    reference: string | undefined,
    nodeIndex: Map<string, MutablePackageNode>,
    nameIndex: Map<string, MutablePackageNode[]>
): string | undefined {
    if (!reference) {
        return undefined;
    }
    if (nodeIndex.has(reference)) {
        return reference;
    }

    const candidates = extractNameCandidates(reference);
    for (const candidate of candidates) {
        const matches = nameIndex.get(candidate);
        if (matches && matches.length > 0) {
            return matches[0].id;
        }
    }
    return undefined;
}

function extractNameCandidates(value: string): string[] {
    const candidates = new Set<string>();
    const primary = normalizeNameKey(value);
    if (primary) {
        candidates.add(primary);
    }
    value.split(/::|\//).forEach(segment => {
        const key = normalizeNameKey(segment);
        if (key) {
            candidates.add(key);
        }
    });
    return [...candidates];
}

function collectRelationships(dataset: VisualizationDataset): DiagramRelationshipViewModel[] {
    const relationships: DiagramRelationshipViewModel[] = [];
    const push = (items?: DiagramRelationshipViewModel[]) => {
        if (!Array.isArray(items)) {
            return;
        }
        items.forEach(rel => {
            if (rel) {
                relationships.push(rel);
            }
        });
    };

    push(dataset.relationships);

    const collectFromElements = (elements?: DiagramElementViewModel[]) => {
        if (!Array.isArray(elements)) {
            return;
        }
        elements.forEach(element => {
            if (!element) {
                return;
            }
            push(element.relationships);
            if (Array.isArray(element.children) && element.children.length > 0) {
                collectFromElements(element.children);
            }
        });
    };

    collectFromElements(dataset.elements);

    const seen = new Set<string>();
    const deduped: DiagramRelationshipViewModel[] = [];
    relationships.forEach(rel => {
        if (!rel) {
            return;
        }
        const key = rel.id || `${rel.source}::${rel.target}::${rel.type}`;
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        deduped.push(rel);
    });

    return deduped;
}

function countDescendantElements(element: DiagramElementViewModel | undefined): number {
    if (!element || !Array.isArray(element.children) || element.children.length === 0) {
        return 0;
    }
    return element.children.reduce((total, child) => total + 1 + countDescendantElements(child), 0);
}

function classifyPackageKind(normalizedType: string): PackageNodeKind {
    if (matchesKeyword(normalizedType, DOMAIN_PACKAGE_KEYWORDS)) {
        return 'domain';
    }
    if (matchesKeyword(normalizedType, INTERFACE_PACKAGE_KEYWORDS)) {
        return 'interface';
    }
    if (matchesKeyword(normalizedType, EXTERNAL_PACKAGE_KEYWORDS)) {
        return 'external';
    }
    return 'standard';
}

function classifyDependencyKind(normalizedType: string): PackageDependencyKind {
    if (matchesKeyword(normalizedType, IMPORT_REL_KEYWORDS)) {
        return 'import';
    }
    if (matchesKeyword(normalizedType, EXPOSURE_REL_KEYWORDS)) {
        return 'exposes';
    }
    return 'dependency';
}

function isPackageDependency(normalizedType: string): boolean {
    if (!normalizedType) {
        return false;
    }
    return matchesKeyword(normalizedType, DEPENDENCY_REL_KEYWORDS) ||
        matchesKeyword(normalizedType, IMPORT_REL_KEYWORDS) ||
        matchesKeyword(normalizedType, EXPOSURE_REL_KEYWORDS);
}

function indexNodeByName(node: MutablePackageNode, nameIndex: Map<string, MutablePackageNode[]>): void {
    const key = normalizeNameKey(node.name);
    if (!key) {
        return;
    }
    const existing = nameIndex.get(key) ?? [];
    existing.push(node);
    nameIndex.set(key, existing);
}

function matchesKeyword(value: string | undefined, keywords: readonly string[]): boolean {
    if (!value) {
        return false;
    }
    return keywords.some(keyword => value.includes(keyword));
}

function normalizeType(value?: string): string {
    return value ? value.trim().toLowerCase() : '';
}

function normalizeNameKey(value?: string): string | undefined {
    if (!value) {
        return undefined;
    }
    const key = value.trim().toLowerCase();
    return key || undefined;
}
