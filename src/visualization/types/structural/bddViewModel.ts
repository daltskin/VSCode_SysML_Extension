import type { AttributeValue, DiagramElementViewModel, DiagramRelationshipViewModel, VisualizationDataset } from '../viewModels';

export type BddNodeKind = 'block' | 'part' | 'interface' | 'package' | 'item' | 'other';
export type BddRelationshipKind = 'composition' | 'generalization' | 'association' | 'dependency' | 'flow';

export interface BddNodeViewModel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly kind: BddNodeKind;
    readonly stereotype?: string;
    readonly attributes: Record<string, AttributeValue>;
    readonly properties: Record<string, AttributeValue>;
    readonly childIds: readonly string[];
    readonly path: readonly string[];
    /** Compartment metadata: grouped children by kind for rendering compartment headers */
    readonly compartments?: Record<BddNodeKind, readonly string[]>;
    /** True if node is eligible for compound/compartment rendering */
    readonly isCompound?: boolean;
}

export interface BddRelationshipViewModel {
    readonly id: string;
    readonly type: string;
    readonly kind: BddRelationshipKind;
    readonly sourceId: string;
    readonly targetId: string;
}

export interface BddViewModelMetadata {
    readonly nodeCount: number;
    readonly relationshipCount: number;
    readonly compositionCount: number;
    readonly generalizationCount: number;
    readonly interfaceCount: number;
}

export interface BddViewModel {
    readonly nodes: readonly BddNodeViewModel[];
    readonly relationships: readonly BddRelationshipViewModel[];
    readonly metadata: BddViewModelMetadata;
}

const BLOCK_KEYWORDS = ['block', 'component', 'subsystem', 'structure'];
const PART_KEYWORDS = ['part', 'usage', 'assembly'];
const INTERFACE_KEYWORDS = ['interface', 'port', 'connector'];
const PACKAGE_KEYWORDS = ['package', 'namespace'];
const ITEM_KEYWORDS = ['item', 'signal', 'message', 'flow'];

const COMPOSITION_REL_KEYWORDS = ['composition', 'aggregate', 'contain', 'part'];
const GENERALIZATION_REL_KEYWORDS = ['generalization', 'specialization', 'inherit'];
const FLOW_REL_KEYWORDS = ['flow', 'interface', 'port', 'signal'];
const DEPENDENCY_REL_KEYWORDS = ['dependency', 'allocate', 'allocation', 'satisfy', 'verify'];

export function buildBddViewModel(dataset: VisualizationDataset): BddViewModel | undefined {
    if (!dataset || !Array.isArray(dataset.elements) || dataset.elements.length === 0) {
        return undefined;
    }


    const nodes: BddNodeViewModel[] = [];
    const nodeIndex = new Map<string, BddNodeViewModel>();
    const nodeNameIndex = new Map<string, BddNodeViewModel[]>();
    const compositionCandidates: Array<{ parentId: string; childId: string }> = [];
    let syntheticIdCounter = 0;

    // Helper to group children by kind for compartment rendering
    function groupChildrenByKind(children: DiagramElementViewModel[]): Record<BddNodeKind, string[]> {
        const groups: Record<BddNodeKind, string[]> = {
            block: [], part: [], interface: [], package: [], item: [], other: []
        };
        children.forEach(child => {
            const kind = classifyNodeKind(normalizeType(child.type));
            if (groups[kind]) {
                groups[kind].push(child.id);
            } else {
                groups.other.push(child.id);
            }
        });
        return groups;
    }

    const visitElement = (element: DiagramElementViewModel | undefined, structuralParentId?: string) => {
        if (!element) {
            return;
        }

        const normalizedType = normalizeType(element.type);
        const nodeKind = classifyNodeKind(normalizedType);
        const nodeId = element.id || `bdd-node-${++syntheticIdCounter}`;

        if (nodeId) {
            if (!nodeIndex.has(nodeId)) {
                const childIds = Array.isArray(element.children)
                    ? element.children
                        .map(child => child?.id)
                        .filter((id): id is string => Boolean(id))
                    : [];

                // Compartment metadata: group children by kind
                let compartments: Record<BddNodeKind, string[]> | undefined = undefined;
                let isCompound = false;
                if (Array.isArray(element.children) && element.children.length > 0) {
                    compartments = groupChildrenByKind(element.children);
                    // Compound if more than one compartment has children
                    const compartmentCount = Object.values(compartments).filter(arr => arr.length > 0).length;
                    isCompound = compartmentCount > 1;
                }

                const node: BddNodeViewModel = {
                    id: nodeId,
                    name: element.name || element.type || nodeId,
                    type: element.type || 'element',
                    kind: nodeKind,
                    stereotype: element.type,
                    attributes: cloneAttributeRecord(element.attributes),
                    properties: cloneAttributeRecord(element.properties),
                    childIds,
                    path: element.metadata?.path ?? [],
                    compartments,
                    isCompound
                };

                nodes.push(node);
                nodeIndex.set(nodeId, node);
                const nameKey = normalizeNameKey(node.name);
                if (nameKey) {
                    const existing = nodeNameIndex.get(nameKey) ?? [];
                    existing.push(node);
                    nodeNameIndex.set(nameKey, existing);
                }
            }

            if (structuralParentId && structuralParentId !== nodeId) {
                compositionCandidates.push({ parentId: structuralParentId, childId: nodeId });
            }
        }

        const nextParentId = nodeId ?? structuralParentId;

        if (Array.isArray(element.children)) {
            element.children.forEach(child => visitElement(child, nextParentId));
        }
    };

    dataset.elements.forEach(element => visitElement(element));

    if (nodes.length === 0) {
        return undefined;
    }

    const resolveNodeId = (reference?: string): string | undefined => {
        if (!reference) {
            return undefined;
        }
        if (nodeIndex.has(reference)) {
            return reference;
        }
        const nameKey = normalizeNameKey(reference);
        if (!nameKey) {
            return undefined;
        }
        const candidates = nodeNameIndex.get(nameKey);
        return candidates && candidates.length > 0 ? candidates[0].id : undefined;
    };

    const candidateRelationships = collectRelationships(dataset);
    const relationships: BddRelationshipViewModel[] = [];
    const relationshipKeys = new Set<string>();

    const addRelationship = (sourceId: string, targetId: string, type: string, kind: BddRelationshipKind, id?: string) => {
        const key = `${sourceId  }->${  targetId  }:${  kind}`;
        if (relationshipKeys.has(key)) {
            return;
        }
        relationshipKeys.add(key);
        relationships.push({
            id: id || `bdd-rel-${relationships.length}`,
            type,
            kind,
            sourceId,
            targetId
        });
    };

    candidateRelationships.forEach(rel => {
        if (!rel || !rel.source || !rel.target) {
            return;
        }
        const sourceId = resolveNodeId(rel.source);
        const targetId = resolveNodeId(rel.target);
        if (!sourceId || !targetId) {
            return;
        }
        const normalizedType = normalizeType(rel.type);
        const relKind = classifyRelationshipKind(normalizedType);
        addRelationship(sourceId, targetId, rel.type || 'relationship', relKind, rel.id);
    });

    compositionCandidates.forEach(edge => {
        if (!edge.parentId || !edge.childId) {
            return;
        }
        addRelationship(edge.parentId, edge.childId, 'composition', 'composition', `bdd-comp-${edge.parentId}-${edge.childId}`);
    });

    const metadata: BddViewModelMetadata = {
        nodeCount: nodes.length,
        relationshipCount: relationships.length,
        compositionCount: relationships.filter(rel => rel.kind === 'composition').length,
        generalizationCount: relationships.filter(rel => rel.kind === 'generalization').length,
        interfaceCount: nodes.filter(node => node.kind === 'interface').length
    };

    return { nodes, relationships, metadata };
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

function classifyNodeKind(normalizedType: string | undefined): BddNodeKind {
    if (!normalizedType) {
        return 'other';
    }
    if (matchesKeyword(normalizedType, BLOCK_KEYWORDS)) {
        return 'block';
    }
    if (matchesKeyword(normalizedType, PART_KEYWORDS)) {
        return 'part';
    }
    if (matchesKeyword(normalizedType, INTERFACE_KEYWORDS)) {
        return 'interface';
    }
    if (matchesKeyword(normalizedType, PACKAGE_KEYWORDS)) {
        return 'package';
    }
    if (matchesKeyword(normalizedType, ITEM_KEYWORDS)) {
        return 'item';
    }
    return 'other';
}

function classifyRelationshipKind(normalizedType: string | undefined): BddRelationshipKind {
    if (!normalizedType) {
        return 'association';
    }
    if (matchesKeyword(normalizedType, COMPOSITION_REL_KEYWORDS)) {
        return 'composition';
    }
    if (matchesKeyword(normalizedType, GENERALIZATION_REL_KEYWORDS)) {
        return 'generalization';
    }
    if (matchesKeyword(normalizedType, FLOW_REL_KEYWORDS)) {
        return 'flow';
    }
    if (matchesKeyword(normalizedType, DEPENDENCY_REL_KEYWORDS)) {
        return 'dependency';
    }
    return 'association';
}

function matchesKeyword(value: string, keywords: readonly string[]): boolean {
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
    return key ? key : undefined;
}

function cloneAttributeRecord(source?: Map<string, AttributeValue> | Record<string, AttributeValue>): Record<string, AttributeValue> {
    if (!source) {
        return {};
    }
    if (source instanceof Map) {
        const entries: Record<string, AttributeValue> = {};
        source.forEach((val, key) => {
            entries[key] = val;
        });
        return entries;
    }
    return { ...source };
}
