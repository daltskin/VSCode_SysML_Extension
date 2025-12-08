import type { ActivityDiagram, Relationship, SequenceDiagram, SysMLElement } from '../../parser/sysmlParser';
import type { VisualizationViewId } from './views';

export type AttributeValue = string | number | boolean;

export interface DiagramElementViewModel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly attributes: Record<string, AttributeValue>;
    readonly properties: Record<string, AttributeValue>;
    readonly children: DiagramElementViewModel[];
    readonly relationships: DiagramRelationshipViewModel[];
    readonly metadata: DiagramElementMetadata;
}

export interface DiagramRelationshipViewModel {
    readonly id: string;
    readonly type: string;
    readonly source: string;
    readonly target: string;
    readonly label?: string;
}

export interface DiagramElementMetadata {
    readonly depth: number;
    readonly path: string[];
}

export interface SequenceDiagramViewModel {
    readonly name: string;
    readonly participants: SequenceParticipantViewModel[];
    readonly messages: SequenceMessageViewModel[];
}

export interface SequenceParticipantViewModel {
    readonly name: string;
    readonly type: string;
}

export interface SequenceMessageViewModel {
    readonly name: string;
    readonly from: string;
    readonly to: string;
    readonly payload: string;
    readonly occurrence: number;
}

export interface ActivityDiagramViewModel {
    readonly name: string;
    readonly actions: ActivityActionViewModel[];
    readonly flows: ActivityFlowViewModel[];
    readonly stats: ActivityDiagramStats;
}

export interface ActivityActionViewModel {
    readonly id: string;
    readonly name: string;
    readonly kind: string;
    readonly lane?: string;
    readonly inputs: readonly string[];
    readonly outputs: readonly string[];
    readonly isDefinition?: boolean;
}

export interface ActivityFlowViewModel {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly guard?: string;
}

export interface ActivityDiagramStats {
    readonly actionCount: number;
    readonly flowCount: number;
}

export interface VisualizationDataset {
    readonly elements: DiagramElementViewModel[];
    readonly relationships: DiagramRelationshipViewModel[];
    readonly sequenceDiagrams: SequenceDiagramViewModel[];
    readonly activityDiagrams: ActivityDiagramViewModel[];
}

export interface PreparedViewModelDataset {
    readonly elements: DiagramElementViewModel[];
    readonly relationships: DiagramRelationshipViewModel[];
    readonly sequenceDiagrams: SequenceDiagramViewModel[];
    readonly activityDiagrams: ActivityDiagramViewModel[];
}

export type ViewSuggestionConfidence = 'high' | 'medium' | 'low';

export interface ViewSuggestion {
    readonly viewId: VisualizationViewId;
    readonly reason: string;
    readonly confidence: ViewSuggestionConfidence;
}

export interface BuildVisualizationDatasetInput {
    elements?: SysMLElement[];
    relationships?: Relationship[];
    sequenceDiagrams?: SequenceDiagram[];
    activityDiagrams?: ActivityDiagram[];
}

export interface SanitizationStats {
    readonly removedElements: number;
    readonly removedRelationships: number;
}

export function suggestVisualizationView(dataset: VisualizationDataset): ViewSuggestion | undefined {
    if (!dataset) {
        return undefined;
    }

    const activityCount = dataset.activityDiagrams?.length ?? 0;
    if (activityCount > 0) {
        const actionTotal = dataset.activityDiagrams.reduce((total, diagram) => total + (diagram.stats?.actionCount ?? 0), 0);
        return {
            viewId: 'activity',
            reason: `Detected ${activityCount} activity diagram${activityCount > 1 ? 's' : ''} with ${actionTotal} action${actionTotal === 1 ? '' : 's'}`,
            confidence: activityCount >= 2 || actionTotal >= 5 ? 'high' : 'medium'
        };
    }

    const sequenceCount = dataset.sequenceDiagrams?.length ?? 0;
    if (sequenceCount > 0) {
        const messageTotal = dataset.sequenceDiagrams.reduce((total, diagram) => total + (diagram.messages?.length ?? 0), 0);
        const reason = messageTotal > 0
            ? `Detected ${sequenceCount} sequence diagram${sequenceCount > 1 ? 's' : ''} with ${messageTotal} interaction${messageTotal === 1 ? '' : 's'}`
            : `Detected ${sequenceCount} sequence diagram${sequenceCount > 1 ? 's' : ''}`;
        return {
            viewId: 'sequence',
            reason,
            confidence: sequenceCount > 1 || messageTotal >= 5 ? 'high' : 'medium'
        };
    }

    const stats = calculateDatasetStructureStats(dataset);
    if (stats.totalElements === 0) {
        return undefined;
    }

    const ibdSuggestion = getInternalBlockSuggestion(stats);
    if (ibdSuggestion) {
        return ibdSuggestion;
    }

    const packageSuggestion = getPackageSuggestion(stats);
    if (packageSuggestion) {
        return packageSuggestion;
    }

    const bddSuggestion = getBddSuggestion(stats);
    if (bddSuggestion) {
        return bddSuggestion;
    }

    if (isLargeDiagramCandidate(stats)) {
        const confidence: ViewSuggestionConfidence = stats.totalElements >= 220 || stats.relationshipTotal >= 160
            ? 'high'
            : 'medium';
        return {
            viewId: 'elk',
            reason: `Diagram view recommended for ${stats.totalElements} elements across ${stats.rootElements} top-level packages`,
            confidence
        };
    }

    if (isRelationshipDenseCandidate(stats)) {
        const densityLabel = stats.relationshipDensity.toFixed(1);
        const reasonParts = [`${stats.relationshipTotal} relationships (~${densityLabel} links/node)`];
        if (stats.uniqueRelationshipTypes >= 4) {
            reasonParts.push(`${stats.uniqueRelationshipTypes} relationship types`);
        }
        if (stats.portElementCount >= 12) {
            reasonParts.push(`${stats.portElementCount} ports/interfaces`);
        }
        return {
            viewId: 'graph',
            reason: `Dense network detected — ${reasonParts.join(', ')}`,
            confidence: 'medium'
        };
    }

    if (isDeepHierarchyCandidate(stats)) {
        const packageRatio = stats.packageCount > 0
            ? Math.round((stats.packageCount / stats.totalElements) * 100)
            : 0;
        return {
            viewId: 'hierarchy',
            reason: `Hierarchy spans ${stats.maxDepth} levels with ${stats.packageCount} packages (${packageRatio}% of nodes)`,
            confidence: 'medium'
        };
    }

    if (isTreeCandidate(stats)) {
        return {
            viewId: 'tree',
            reason: `Compact model (${stats.totalElements} elements across ${stats.rootElements} roots)`,
            confidence: stats.totalElements <= 12 ? 'high' : 'medium'
        };
    }

    return {
        viewId: 'elk',
        reason: 'ELK view is suitable for mixed content',
        confidence: 'low'
    };
}

export function buildVisualizationDataset(input: BuildVisualizationDatasetInput): VisualizationDataset {
    const {
        elements = [],
        relationships = [],
        sequenceDiagrams = [],
        activityDiagrams = []
    } = input;

    return {
        elements: normalizeElements(elements, []),
        relationships: normalizeRelationships(relationships),
        sequenceDiagrams: normalizeSequenceDiagrams(sequenceDiagrams),
        activityDiagrams: normalizeActivityDiagrams(activityDiagrams)
    };
}

export function calculateParseErrorStats(input: BuildVisualizationDatasetInput): SanitizationStats {
    const removedElements = countParseErrorsInElementList(input.elements ?? []);

    const removedRelationships = countParseErrorsInRelationships(input.relationships ?? []);

    return {
        removedElements,
        removedRelationships
    };
}

interface DatasetStructureStats {
    readonly totalElements: number;
    readonly rootElements: number;
    readonly leafElements: number;
    readonly maxDepth: number;
    readonly averageBranchFactor: number;
    readonly maxChildrenPerNode: number;
    readonly relationshipTotal: number;
    readonly relationshipDensity: number;
    readonly uniqueRelationshipTypes: number;
    readonly packageCount: number;
    readonly portElementCount: number;
    readonly connectionRelationshipCount: number;
    readonly structuralElementCount: number;
    readonly partElementCount: number;
}

const PACKAGE_TYPE_KEYWORDS = ['package', 'namespace'];
const PORT_TYPE_KEYWORDS = ['port', 'interface', 'connector', 'flow'];
const STRUCTURAL_TYPE_KEYWORDS = ['block', 'component', 'subsystem', 'structure', 'system', 'item'];
const PART_TYPE_KEYWORDS = ['part', 'part usage', 'usage', 'slot'];
const CONNECTION_RELATIONSHIP_TYPES = new Set([
    'connection',
    'connector',
    'flow',
    'binding',
    'allocation',
    'dependency',
    'composition',
    'aggregation',
    'association',
    'satisfy',
    'verify'
]);

function calculateDatasetStructureStats(dataset: VisualizationDataset): DatasetStructureStats {
    const roots = Array.isArray(dataset.elements)
        ? dataset.elements.filter((element): element is DiagramElementViewModel => Boolean(element))
        : [];

    const stack: Array<{ element: DiagramElementViewModel; depth: number }> = roots.map(element => ({
        element,
        depth: 1
    }));

    let totalElements = 0;
    let leafElements = 0;
    let maxDepth = 0;
    let cumulativeBranchFactor = 0;
    let maxChildrenPerNode = 0;
    let packageCount = 0;
    let portElementCount = 0;
    let structuralElementCount = 0;
    let partElementCount = 0;

    while (stack.length > 0) {
        const current = stack.pop();
        if (!current) {
            continue;
        }
        const { element, depth } = current;
        totalElements += 1;
        maxDepth = Math.max(maxDepth, depth);

        const children = Array.isArray(element.children)
            ? element.children.filter((child): child is DiagramElementViewModel => Boolean(child))
            : [];

        const childCount = children.length;
        cumulativeBranchFactor += childCount;
        maxChildrenPerNode = Math.max(maxChildrenPerNode, childCount);
        if (childCount === 0) {
            leafElements += 1;
        }

        const normalizedType = normalizeTypeName(element.type);
        if (matchesKeyword(normalizedType, PACKAGE_TYPE_KEYWORDS)) {
            packageCount += 1;
        }
        if (matchesKeyword(normalizedType, PORT_TYPE_KEYWORDS)) {
            portElementCount += 1;
        }
        if (matchesKeyword(normalizedType, STRUCTURAL_TYPE_KEYWORDS)) {
            structuralElementCount += 1;
        }
        if (matchesKeyword(normalizedType, PART_TYPE_KEYWORDS)) {
            partElementCount += 1;
        }

        children.forEach(child => stack.push({ element: child, depth: depth + 1 }));
    }

    const relationships = Array.isArray(dataset.relationships) ? dataset.relationships : [];
    const combinedRelationships = [...relationships];

    const normalizedRelationshipTypes = combinedRelationships
        .map(rel => normalizeTypeName(rel?.type))
        .filter((value): value is string => Boolean(value));
    const uniqueRelationshipTypes = new Set(normalizedRelationshipTypes).size;
    const connectionRelationshipCount = normalizedRelationshipTypes.filter(type => CONNECTION_RELATIONSHIP_TYPES.has(type)).length;

    const relationshipTotal = combinedRelationships.length;
    const relationshipDensity = totalElements === 0 ? 0 : relationshipTotal / totalElements;
    const averageBranchFactor = totalElements === 0 ? 0 : cumulativeBranchFactor / totalElements;

    return {
        totalElements,
        rootElements: roots.length,
        leafElements,
        maxDepth,
        averageBranchFactor,
        maxChildrenPerNode,
        relationshipTotal,
        relationshipDensity,
        uniqueRelationshipTypes,
        packageCount,
        portElementCount,
        connectionRelationshipCount,
        structuralElementCount,
        partElementCount
    };
}

function getInternalBlockSuggestion(stats: DatasetStructureStats): ViewSuggestion | undefined {
    if (stats.portElementCount < 3) {
        return undefined;
    }
    const connectorSignal = stats.connectionRelationshipCount >= 4 || stats.relationshipDensity >= 1.0;
    if (!connectorSignal) {
        return undefined;
    }
    const confidence: ViewSuggestionConfidence = stats.portElementCount >= 8 || stats.connectionRelationshipCount >= 8
        ? 'high'
        : 'medium';
    const reasonParts = [`Detected ${stats.portElementCount} port${stats.portElementCount === 1 ? '' : 's'}`];
    reasonParts.push(`${stats.connectionRelationshipCount} connector${stats.connectionRelationshipCount === 1 ? '' : 's'}`);
    if (stats.partElementCount > 0) {
        reasonParts.push(`${stats.partElementCount} part usage${stats.partElementCount === 1 ? '' : 's'}`);
    }
    return {
        viewId: 'ibd',
        reason: reasonParts.join(' and '),
        confidence
    };
}

function getPackageSuggestion(stats: DatasetStructureStats): ViewSuggestion | undefined {
    if (stats.packageCount < 3) {
        return undefined;
    }
    const packageRatio = stats.totalElements === 0 ? 0 : stats.packageCount / stats.totalElements;
    const depthSignal = stats.maxDepth >= 3;
    const ratioSignal = packageRatio >= 0.3;
    if (!depthSignal && !ratioSignal) {
        return undefined;
    }
    const confidence: ViewSuggestionConfidence = stats.packageCount >= 6 || stats.maxDepth >= 4 ? 'high' : 'medium';
    const percent = Math.round(packageRatio * 100);
    const reason = `Detected ${stats.packageCount} package${stats.packageCount === 1 ? '' : 's'} across ${stats.maxDepth} level${stats.maxDepth === 1 ? '' : 's'} (${percent}% of nodes)`;
    return {
        viewId: 'package',
        reason,
        confidence
    };
}

function getBddSuggestion(stats: DatasetStructureStats): ViewSuggestion | undefined {
    if (stats.structuralElementCount < 5) {
        return undefined;
    }
    const relationshipSignal = stats.relationshipDensity >= 0.8 || stats.relationshipTotal >= stats.structuralElementCount;
    if (!relationshipSignal) {
        return undefined;
    }
    const reasonParts = [`${stats.structuralElementCount} structural element${stats.structuralElementCount === 1 ? '' : 's'}`];
    if (stats.connectionRelationshipCount > 0) {
        reasonParts.push(`${stats.connectionRelationshipCount} connector${stats.connectionRelationshipCount === 1 ? '' : 's'}`);
    } else {
        reasonParts.push(`${stats.relationshipTotal} relationship${stats.relationshipTotal === 1 ? '' : 's'}`);
    }
    const confidence: ViewSuggestionConfidence = stats.structuralElementCount >= 12 || stats.relationshipDensity >= 1.2
        ? 'high'
        : 'medium';
    return {
        viewId: 'bdd',
        reason: reasonParts.join(' with '),
        confidence
    };
}

function isLargeDiagramCandidate(stats: DatasetStructureStats): boolean {
    if (stats.totalElements >= 180) {
        return true;
    }
    if (stats.relationshipTotal >= 140) {
        return true;
    }
    return stats.totalElements >= 80 && stats.averageBranchFactor >= 2.3;
}

function isRelationshipDenseCandidate(stats: DatasetStructureStats): boolean {
    if (stats.relationshipTotal < 15) {
        return false;
    }
    const denseLinks = stats.relationshipDensity >= 1.3;
    const connectionRatio = stats.relationshipTotal === 0
        ? 0
        : stats.connectionRelationshipCount / stats.relationshipTotal;
    const portSignal = stats.portElementCount >= 12;
    const diverseEdges = stats.uniqueRelationshipTypes >= 4;
    return denseLinks && (connectionRatio >= 0.3 || portSignal || diverseEdges);
}

function isDeepHierarchyCandidate(stats: DatasetStructureStats): boolean {
    if (stats.totalElements < 25) {
        return false;
    }
    const packageRatio = stats.packageCount / Math.max(1, stats.totalElements);
    return stats.maxDepth >= 6 || packageRatio >= 0.35;
}

function isTreeCandidate(stats: DatasetStructureStats): boolean {
    if (stats.totalElements > 50) {
        return false;
    }
    if (stats.relationshipTotal > stats.totalElements * 1.1) {
        return false;
    }
    return stats.rootElements <= 5 && stats.maxDepth <= 6;
}

function normalizeTypeName(value?: string): string {
    return value ? value.trim().toLowerCase() : '';
}

function matchesKeyword(value: string, keywords: readonly string[]): boolean {
    if (!value) {
        return false;
    }
    return keywords.some(keyword => value.includes(keyword));
}

function isParseErrorName(value: string | undefined): boolean {
    if (!value) {
        return false;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === 'parse error' || normalized === 'parse_error';
}

function isRenderableElement(element: SysMLElement | undefined): element is SysMLElement {
    if (!element) {
        return false;
    }
    return !isParseErrorName(element.name) && !isParseErrorName(element.type) && element.type !== 'error';
}

function normalizeElements(elements: SysMLElement[], parentPath: string[]): DiagramElementViewModel[] {
    const validElements = elements.filter(isRenderableElement);
    return validElements.map((element, index) => normalizeElement(element, parentPath, index));
}

function countParseErrorsInElementList(elements: SysMLElement[]): number {
    return elements.reduce((total, element) => total + countParseErrorsInElement(element), 0);
}

function countParseErrorsInElement(element: SysMLElement | undefined): number {
    if (!element) {
        return 0;
    }
    if (!isRenderableElement(element)) {
        return 1;
    }
    if (!Array.isArray(element.children) || element.children.length === 0) {
        return 0;
    }
    return element.children.reduce((total, child) => total + countParseErrorsInElement(child), 0);
}

function normalizeElement(element: SysMLElement, parentPath: string[], index: number): DiagramElementViewModel {
    const currentPath = [...parentPath, element.name || `element-${index}`];
    const id = createElementId(currentPath, element.type || 'element', index);

    const attributes = normalizeAttributes(element.attributes);
    const properties = normalizeProperties(element);

    // Preserve typing information if it exists on the element
    const elementWithTyping = element as SysMLElement & { typing?: string };
    if (elementWithTyping.typing) {
        attributes.typing = elementWithTyping.typing;
    }

    const children = Array.isArray(element.children) ? normalizeElements(element.children, currentPath) : [];
    const relationships = normalizeRelationships(element.relationships ?? []);

    return {
        id,
        name: element.name,
        type: element.type,
        attributes,
        properties,
        children,
        relationships,
        metadata: {
            depth: parentPath.length,
            path: currentPath
        }
    };
}

function normalizeAttributes(attributeMap?: Map<string, AttributeValue> | Record<string, AttributeValue>): Record<string, AttributeValue> {
    if (!attributeMap) {
        return {};
    }

    if (attributeMap instanceof Map) {
        const entries: Record<string, AttributeValue> = {};
        attributeMap.forEach((value, key) => {
            entries[key] = value;
        });
        return entries;
    }

    return { ...attributeMap };
}

function normalizeProperties(element: SysMLElement): Record<string, AttributeValue> {
    const candidate = (element as SysMLElement & { properties?: Record<string, AttributeValue> }).properties;
    if (!candidate) {
        return {};
    }
    return { ...candidate };
}

function normalizeRelationships(relationships: Relationship[]): DiagramRelationshipViewModel[] {
    const validRelationships = relationships.filter(relationship => {
        if (!relationship) {
            return false;
        }
        return !isParseErrorName(relationship.source) && !isParseErrorName(relationship.target);
    });

    return validRelationships.map((relationship, index) => ({
        id: `${relationship.source || 'unknown'}-${relationship.target || 'unknown'}-${relationship.type}-${index}`,
        type: relationship.type,
        source: relationship.source,
        target: relationship.target
    }));
}

function countParseErrorsInRelationships(relationships: Relationship[]): number {
    return relationships.reduce((total, relationship) => {
        if (!relationship) {
            return total + 1;
        }
        return total + (isParseErrorName(relationship.source) || isParseErrorName(relationship.target) ? 1 : 0);
    }, 0);
}

function normalizeSequenceDiagrams(diagrams: SequenceDiagram[]): SequenceDiagramViewModel[] {
    return diagrams.map(diagram => ({
        name: diagram.name,
        participants: diagram.participants.map(participant => ({
            name: participant.name,
            type: participant.type
        })),
        messages: diagram.messages.map(message => ({
            name: message.name,
            from: message.from,
            to: message.to,
            payload: message.payload,
            occurrence: message.occurrence
        }))
    }));
}

function normalizeActivityDiagrams(diagrams: ActivityDiagram[]): ActivityDiagramViewModel[] {
    return diagrams.map((diagram, diagramIndex) => {
        const actions = (diagram.actions ?? []).map((action, actionIndex) => ({
            id: action.name ? `${slugify(action.name)  }-${  actionIndex}` : `action-${diagramIndex}-${actionIndex}`,
            name: action.name,
            kind: action.type,
            lane: action.condition,
            inputs: Array.isArray(action.inputs) ? [...action.inputs] : [],
            outputs: Array.isArray(action.outputs) ? [...action.outputs] : [],
            isDefinition: Boolean(action.isDefinition)
        }));

        const flows = (diagram.flows ?? []).map((flow, flowIndex) => ({
            id: `${flow.from  }->${  flow.to  }-${  flowIndex}`,
            from: flow.from,
            to: flow.to,
            guard: flow.condition || flow.guard
        }));

        return {
            name: diagram.name,
            actions,
            flows,
            stats: {
                actionCount: actions.length,
                flowCount: flows.length
            }
        };
    });
}

function createElementId(path: string[], type: string, index: number): string {
    const slugSegments = path.map(segment => slugify(segment)).filter(Boolean);
    const typeSegment = slugify(type) || 'element';
    const suffix = index.toString(16);
    return [...slugSegments, typeSegment, suffix].join('/');
}

function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
