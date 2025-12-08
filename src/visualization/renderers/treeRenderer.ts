import { DEFAULT_CONTAINER_LAYOUT } from '../types/layoutConfig';
import type { AttributeValue, DiagramElementViewModel, VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

export interface TreeHierarchyNode {
    readonly name: string;
    readonly type: string;
    readonly properties: Record<string, AttributeValue>;
    readonly attributes: Record<string, AttributeValue>;
    readonly children: TreeHierarchyNode[];
}

export interface TreeViewModel {
    readonly hierarchy: TreeHierarchyNode;
}

const TREE_VIEW_ID: VisualizationViewId = 'tree';
const treeDefinition = DEFAULT_VIEW_DEFINITIONS.find(definition => definition.id === TREE_VIEW_ID);

export const TREE_CONTAINER_WIDTH = DEFAULT_CONTAINER_LAYOUT.width;
export const TREE_CONTAINER_HEIGHT = DEFAULT_CONTAINER_LAYOUT.height;

if (!treeDefinition) {
    throw new Error('Tree view definition is not registered in DEFAULT_VIEW_DEFINITIONS.');
}

registerRenderer({
    definition: treeDefinition,
    canRender: dataset => Array.isArray(dataset.elements) && dataset.elements.length > 0,
    buildViewModel: buildTreeViewModel
});

function buildTreeViewModel(dataset: VisualizationDataset): TreeViewModel | undefined {
    const hierarchy = buildHierarchy(dataset.elements);
    if (!hierarchy) {
        return undefined;
    }
    return { hierarchy };
}

function buildHierarchy(elements: DiagramElementViewModel[]): TreeHierarchyNode | undefined {
    const validNodes = elements
        .map(convertElement)
        .filter((node): node is TreeHierarchyNode => Boolean(node));

    if (validNodes.length === 0) {
        return undefined;
    }

    if (validNodes.length === 1) {
        return validNodes[0];
    }

    return {
        name: 'Model Root',
        type: 'root',
        properties: {},
        attributes: {},
        children: validNodes
    };
}

function convertElement(element: DiagramElementViewModel): TreeHierarchyNode | undefined {
    if (!element.name || !element.type) {
        return undefined;
    }

    const properties = { ...element.properties };
    const documentation = extractDocumentation(element);
    if (documentation) {
        properties.documentation = documentation;
    }

    const children = Array.isArray(element.children)
        ? element.children
            .map(convertElement)
            .filter((child): child is TreeHierarchyNode => Boolean(child))
        : [];

    return {
        name: element.name,
        type: element.type,
        properties,
        attributes: { ...element.attributes },
        children
    };
}

const METADATA_TYPES = new Set(['doc', 'comment', 'metadata', 'metadata def']);

function extractDocumentation(element: DiagramElementViewModel): string | undefined {
    const pieces: string[] = [];

    if (Array.isArray(element.children)) {
        for (const child of element.children) {
            if (isMetadataElement(child)) {
                // Check attributes first (where parser stores text)
                const text = getAttributeValue(child, 'text') || getAttributeValue(child, 'value');
                if (text) {
                    pieces.push(cleanCommentText(String(text)));
                } else if (child.name) {
                    pieces.push(cleanCommentText(child.name));
                }
            }
        }
    }

    if (isMetadataElement(element)) {
        const text = getAttributeValue(element, 'text') || getAttributeValue(element, 'value');
        if (text) {
            pieces.push(cleanCommentText(String(text)));
        } else if (element.name) {
            pieces.push(cleanCommentText(element.name));
        }
    }

    if (pieces.length === 0) {
        return undefined;
    }

    return pieces.join(' ');
}

function getAttributeValue(element: DiagramElementViewModel, key: string): AttributeValue | undefined {
    if (!element.attributes) {
        return undefined;
    }

    if (element.attributes instanceof Map) {
        return element.attributes.get(key);
    }

    if (typeof element.attributes === 'object' && key in element.attributes) {
        return element.attributes[key];
    }

    return undefined;
}

function cleanCommentText(text: string): string {
    return text
        .replace(/^\/\*\*?\s*/, '')  // Remove /** or /*
        .replace(/\s*\*\/$/, '')      // Remove */
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())  // Remove leading * from each line
        .filter(line => line.length > 0)
        .join(' ');
}

function isMetadataElement(element: DiagramElementViewModel): boolean {
    const normalizedType = element.type?.trim().toLowerCase();
    if (!normalizedType) {
        return false;
    }
    return METADATA_TYPES.has(normalizedType);
}
