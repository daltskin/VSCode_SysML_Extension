import type { AttributeValue, DiagramElementViewModel, VisualizationDataset } from '../types/viewModels';
import { DEFAULT_VIEW_DEFINITIONS, type VisualizationViewId } from '../types/views';
import { registerRenderer } from './index';

export interface ElkRendererElementSummary {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly attributes: Record<string, AttributeValue>;
    readonly properties: Record<string, AttributeValue>;
    readonly children?: readonly ElkRendererChildSummary[];
}

export interface ElkRendererChildSummary {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly attributes?: Record<string, AttributeValue>;
}

export interface ElkRendererNodeModel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly width: number;
    readonly height: number;
    readonly depth: number;
    readonly element: ElkRendererElementSummary;
    readonly children: readonly ElkRendererChildSummary[];
}

export interface ElkRendererEdgeModel {
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
}

export interface ElkRendererStats {
    readonly totalNodes: number;
    readonly rootCount: number;
    readonly maxDepth: number;
}

export interface ElkRendererViewModel {
    readonly nodes: readonly ElkRendererNodeModel[];
    readonly edges: readonly ElkRendererEdgeModel[];
    readonly stats: ElkRendererStats;
}

const ELK_VIEW_ID: VisualizationViewId = 'elk';
const elkDefinition = DEFAULT_VIEW_DEFINITIONS.find(definition => definition.id === ELK_VIEW_ID);

if (!elkDefinition) {
    throw new Error('ELK view definition is not registered in DEFAULT_VIEW_DEFINITIONS.');
}

registerRenderer({
    definition: elkDefinition,
    canRender: dataset => Array.isArray(dataset.elements) && dataset.elements.length > 0,
    buildViewModel: buildElkViewModel
});

export function buildElkViewModel(dataset: VisualizationDataset): ElkRendererViewModel | undefined {
    console.log('buildElkViewModel called, dataset.elements:', dataset.elements.length);
    if (!Array.isArray(dataset.elements) || dataset.elements.length === 0) {
        return undefined;
    }

    const fallbackIds = new WeakMap<DiagramElementViewModel, string>();
    let fallbackCounter = 0;

    const ensureElementId = (element: DiagramElementViewModel): string => {
        if (element.id) {
            return element.id;
        }
        let assigned = fallbackIds.get(element);
        if (!assigned) {
            assigned = `elk-node-${fallbackCounter++}`;
            fallbackIds.set(element, assigned);
        }
        return assigned;
    };

    const nodes: ElkRendererNodeModel[] = [];
    const edges: ElkRendererEdgeModel[] = [];
    let maxDepth = 0;

    const queue: Array<{ element: DiagramElementViewModel; depth: number; parentId?: string }> = dataset.elements
        .filter(Boolean)
        .map(element => ({ element, depth: 0, parentId: undefined }));

    console.log('buildElkViewModel processing queue with', queue.length, 'elements');

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current || !current.element) {
            continue;
        }

        const { element, depth, parentId } = current;
        console.log('Processing element:', element.name, 'children:', element.children?.length || 0);
        const nodeId = ensureElementId(element);
        const childSummaries = extractChildSummaries(element, ensureElementId);
        console.log('Extracted child summaries for', element.name, ':', childSummaries.length);
        const node: ElkRendererNodeModel = {
            id: nodeId,
            name: element.name || 'Unnamed Element',
            type: element.type || 'element',
            width: estimateNodeWidth(element),
            height: estimateNodeHeight(element, childSummaries.length),
            depth,
            element: summarizeElement(element, ensureElementId),
            children: childSummaries
        };
        nodes.push(node);

        if (parentId) {
            edges.push({
                id: `${parentId}__${nodeId}`,
                sourceId: parentId,
                targetId: nodeId
            });
        }

        maxDepth = Math.max(maxDepth, depth);

        if (Array.isArray(element.children)) {
            element.children
                .filter(child => Boolean(child))
                .forEach(child => {
                    queue.push({
                        element: child,
                        depth: depth + 1,
                        parentId: nodeId
                    });
                });
        }
    }

    return {
        nodes,
        edges,
        stats: {
            totalNodes: nodes.length,
            rootCount: dataset.elements.length,
            maxDepth
        }
    };
}

function extractChildSummaries(
    element: DiagramElementViewModel,
    ensureElementId: (element: DiagramElementViewModel) => string
): ElkRendererChildSummary[] {
    if (!Array.isArray(element.children) || element.children.length === 0) {
        return [];
    }

    return element.children
        .filter(child => Boolean(child))
        .map(child => ({
            id: ensureElementId(child),
            name: child.name || child.id || 'Unnamed Element',
            type: child.type || 'element',
            attributes: cloneAttributeRecord(child.attributes)
        }));
}

function summarizeElement(
    element: DiagramElementViewModel,
    ensureElementId: (element: DiagramElementViewModel) => string
): ElkRendererElementSummary {
    console.log('summarizeElement called for:', element.name, 'with children:', element.children);
    const summary = {
        id: ensureElementId(element),
        name: element.name || 'Unnamed Element',
        type: element.type || 'element',
        attributes: cloneAttributeRecord(element.attributes),
        properties: cloneAttributeRecord(element.properties),
        children: extractChildSummaries(element, ensureElementId)
    };
    console.log('summarizeElement result:', summary.name, 'children count:', summary.children?.length);
    return summary;
}

function cloneAttributeRecord(source?: Map<string, AttributeValue> | Record<string, AttributeValue>): Record<string, AttributeValue> {
    if (!source) {
        return {};
    }

    if (source instanceof Map) {
        const entries: Record<string, AttributeValue> = {};
        source.forEach((value, key) => {
            entries[key] = value;
        });
        return entries;
    }

    return { ...source };
}

function estimateNodeWidth(element: DiagramElementViewModel): number {
    const nameLength = element.name ? element.name.length : 8;
    const typeLength = element.type ? element.type.length : 5;
    const baseWidth = Math.max(nameLength * 9.5, typeLength * 8, 180);
    return clamp(baseWidth, 160, 360);
}

function estimateNodeHeight(element: DiagramElementViewModel, childCount: number): number {
    const attributeCount = element.attributes ? Object.keys(element.attributes).length : 0;
    const baseHeight = 80 + Math.min(attributeCount, 3) * 10 + (childCount > 0 ? 12 : 0);
    return clamp(baseHeight, 80, 160);
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
