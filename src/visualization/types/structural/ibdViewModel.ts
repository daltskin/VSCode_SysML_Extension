import type { AttributeValue, DiagramElementViewModel, DiagramRelationshipViewModel, VisualizationDataset } from '../viewModels';

export type IbdPortDirection = 'in' | 'out' | 'inout' | 'unspecified';

export interface IbdPartViewModel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly stereotype?: string;
    readonly attributes: Record<string, AttributeValue>;
    readonly properties: Record<string, AttributeValue>;
    readonly path: readonly string[];
    readonly portIds: readonly string[];
}

export interface IbdPortViewModel {
    readonly id: string;
    readonly parentId: string;
    readonly name: string;
    readonly type: string;
    readonly stereotype?: string;
    readonly direction: IbdPortDirection;
    readonly attributes: Record<string, AttributeValue>;
    readonly properties: Record<string, AttributeValue>;
}

export interface IbdConnectorViewModel {
    readonly id: string;
    readonly type: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly stereotype?: string;
}

export interface IbdViewModelMetadata {
    readonly partCount: number;
    readonly portCount: number;
    readonly connectorCount: number;
}

export interface IbdViewModel {
    readonly container?: {
        readonly id: string;
        readonly name: string;
        readonly type: string;
    };
    readonly parts: readonly IbdPartViewModel[];
    readonly ports: readonly IbdPortViewModel[];
    readonly connectors: readonly IbdConnectorViewModel[];
    readonly metadata: IbdViewModelMetadata;
}

const PART_KEYWORDS = ['part', 'block', 'component', 'assembly'];
const PORT_KEYWORDS = ['port', 'interface', 'flow', 'connector', 'socket', 'plug'];
// Extended keywords to match SysML v2 connection usages and various relationship types
const CONNECTOR_KEYWORDS = ['connector', 'connection', 'binding', 'flow', 'interface', 'link', 'signal', 'connect', 'allocate', 'bind', 'succession', 'dependency', 'feature', 'end'];
const DIRECTION_IN_KEYWORDS = ['in', 'input', 'receive'];
const DIRECTION_OUT_KEYWORDS = ['out', 'output', 'send'];

export function buildIbdViewModel(dataset: VisualizationDataset): IbdViewModel | undefined {

    const logElementTree = (elements: any[], indent: string = '') => {
        elements?.forEach((el, _i) => {
            if (el) {
                if (el.children?.length > 0) {
                    logElementTree(el.children, `${indent  }  `);
                }
            }
        });
    };
    logElementTree(dataset?.elements || []);

    if (!dataset || !Array.isArray(dataset.elements) || dataset.elements.length === 0) {
        return undefined;
    }

    interface MutablePartRecord {
        id: string;
        name: string;
        type: string;
        stereotype?: string;
        attributes: Record<string, AttributeValue>;
        properties: Record<string, AttributeValue>;
        path: readonly string[];
        portIds: string[];
    }

    const parts: MutablePartRecord[] = [];
    const ports: IbdPortViewModel[] = [];
    const partIndex = new Map<string, MutablePartRecord>();
    const partNameIndex = new Map<string, MutablePartRecord[]>();
    const portIndex = new Map<string, IbdPortViewModel>();
    const portNameIndex = new Map<string, IbdPortViewModel[]>();

    let syntheticPartCounter = 0;
    let syntheticPortCounter = 0;

    const registerPart = (element: DiagramElementViewModel): MutablePartRecord => {
        const partId = element.id || `ibd-part-${++syntheticPartCounter}`;
        const existing = partIndex.get(partId);
        if (existing) {
            return existing;
        }

        const part: MutablePartRecord = {
            id: partId,
            name: element.name || element.type || partId,
            type: element.type || 'part',
            stereotype: element.type,
            attributes: cloneAttributeRecord(element.attributes),
            properties: cloneAttributeRecord(element.properties),
            path: element.metadata?.path ?? [],
            portIds: []
        };

        parts.push(part);
        partIndex.set(partId, part);
        const nameKey = normalizeKey(part.name);
        if (nameKey) {
            const bucket = partNameIndex.get(nameKey) ?? [];
            bucket.push(part);
            partNameIndex.set(nameKey, bucket);
        }
        return part;
    };

    const registerPort = (element: DiagramElementViewModel, parentId: string): IbdPortViewModel => {
        const portId = element.id || `ibd-port-${++syntheticPortCounter}`;
        const existing = portIndex.get(portId);
        if (existing) {
            return existing;
        }

        const direction = detectPortDirection(element);
        const port: IbdPortViewModel = {
            id: portId,
            parentId,
            name: element.name || element.type || portId,
            type: element.type || 'port',
            stereotype: element.type,
            direction,
            attributes: cloneAttributeRecord(element.attributes),
            properties: cloneAttributeRecord(element.properties)
        };

        ports.push(port);
        portIndex.set(portId, port);
        const nameKey = normalizeKey(port.name);
        if (nameKey) {
            const bucket = portNameIndex.get(nameKey) ?? [];
            bucket.push(port);
            portNameIndex.set(nameKey, bucket);
        }

        const parentPart = partIndex.get(parentId);
        if (parentPart) {
            parentPart.portIds.push(portId);
        }

        return port;
    };

    const visitElement = (element: DiagramElementViewModel | undefined, parentPartId?: string) => {
        if (!element) {
            return;
        }
        const normalizedType = normalizeType(element.type);
        const isPort = isPortElement(normalizedType);
        const isPart = isPartElement(normalizedType);

        if (isPort && parentPartId) {
            registerPort(element, parentPartId);
            return;
        }

        let currentParentId = parentPartId;
        if (isPart) {
            const part = registerPart(element);
            currentParentId = part.id;
        }

        if (Array.isArray(element.children)) {
            element.children.forEach(child => visitElement(child, currentParentId));
        }
    };

    // For IBD, we want to show the container and its internal parts
    // The root element represents the container part
    // Its children are the internal parts that go inside the container
    // We also need to find the deepest part hierarchy to show as the IBD

    // First, find all parts recursively to determine the best container
    const findBestContainer = (elements: DiagramElementViewModel[], depth: number = 0): { element: DiagramElementViewModel | undefined; depth: number } => {
        let bestContainer: DiagramElementViewModel | undefined;
        let bestDepth = -1;

        for (const element of elements) {
            if (!element || !element.type) continue;
            const normalizedType = normalizeType(element.type);
            if (isPartElement(normalizedType)) {
                // Check if this part has internal parts (children that are also parts)
                const hasInternalParts = element.children?.some(child => {
                    const childType = normalizeType(child?.type);
                    return isPartElement(childType);
                });

                if (hasInternalParts && depth >= bestDepth) {
                    bestContainer = element;
                    bestDepth = depth;
                }

                // Recurse into children to find deeper containers
                if (element.children) {
                    const deeper = findBestContainer(element.children, depth + 1);
                    if (deeper.depth > bestDepth) {
                        bestContainer = deeper.element;
                        bestDepth = deeper.depth;
                    }
                }
            } else if (element.children) {
                // Not a part, but check children
                const deeper = findBestContainer(element.children, depth);
                if (deeper.depth > bestDepth) {
                    bestContainer = deeper.element;
                    bestDepth = deeper.depth;
                }
            }
        }

        return { element: bestContainer, depth: bestDepth };
    };

    const containerResult = findBestContainer(dataset.elements);
    const containerElement = containerResult.element;

    // First, process ALL elements to index all parts and ports for reference resolution
    // This ensures we can resolve references like 'battery.powerPort' even if they're in a different container
    const indexAllElements = (elements: DiagramElementViewModel[], currentPartId?: string) => {
        elements.forEach(element => {
            if (!element) return;
            const normalizedType = normalizeType(element.type);
            const isPart = isPartElement(normalizedType);
            const isPort = isPortElement(normalizedType);

            let nextPartId = currentPartId;

            if (isPart) {
                const part = registerPart(element);
                nextPartId = part.id;
            }

            if (isPort && currentPartId) {
                registerPort(element, currentPartId);
            }

            if (element.children) {
                indexAllElements(element.children, nextPartId);
            }
        });
    };

    indexAllElements(dataset.elements);

    // Now process for the view model output based on selected container
    if (containerElement) {
        if (Array.isArray(containerElement.children)) {
            containerElement.children.forEach(child => visitElement(child));
        }
    } else {
        // No clear container found, process all elements normally
        dataset.elements.forEach(element => {
            if (element && element.type) {
                visitElement(element);
            }
        });
    }

    if (parts.length === 0 && !containerElement) {
        return undefined;
    }

    const resolveReference = (reference?: string): string | undefined => {
        if (!reference) {
            return undefined;
        }

        // Direct ID lookup - only allow IDs we know about
        if (portIndex.has(reference) || partIndex.has(reference)) {
            return reference;
        }

        // Handle qualified names: part.port, part.subpart.port, etc.
        if (reference.includes('.')) {
            const segments = reference.split('.');

            // Get the last segment as the target (usually the port name)
            const targetName = segments[segments.length - 1];
            const targetKey = normalizeKey(targetName);

            if (targetKey) {
                // First, try to find a port with this name attached to any known part
                const portCandidates = portNameIndex.get(targetKey);
                if (portCandidates && portCandidates.length > 0) {
                    // If there's only one match, return it
                    if (portCandidates.length === 1 && partIndex.has(portCandidates[0].parentId)) {
                        return portCandidates[0].id;
                    }

                    // Otherwise, try to match based on the parent part name(s)
                    for (const port of portCandidates) {
                        const parentPart = partIndex.get(port.parentId);
                        if (parentPart) {
                            // Check if parent part name matches any segment in the reference
                            const parentKey = normalizeKey(parentPart.name);
                            if (parentKey && segments.some(seg => normalizeKey(seg) === parentKey)) {
                                return port.id;
                            }
                        }
                    }

                    // If no specific match, return the first port attached to a known part
                    for (const port of portCandidates) {
                        if (partIndex.has(port.parentId)) {
                            return port.id;
                        }
                    }
                }

                // Also try to find a part with this name
                const partCandidates = partNameIndex.get(targetKey);
                if (partCandidates && partCandidates.length > 0) {
                    return partCandidates[0].id;
                }
            }

            // Fallback: try two-segment resolution (parent.target)
            if (segments.length >= 2) {
                const parentName = segments[segments.length - 2];
                const partKey = normalizeKey(parentName);

                if (partKey && targetKey) {
                    const partCandidates = partNameIndex.get(partKey);
                    if (partCandidates && partCandidates.length > 0) {
                        const partId = partCandidates[0].id;
                        const part = partIndex.get(partId);

                        if (part && Array.isArray(part.portIds)) {
                            // Find port within this part
                            for (const portId of part.portIds) {
                                const port = portIndex.get(portId);
                                if (port) {
                                    const portNameNorm = normalizeKey(port.name || port.id);
                                    if (portNameNorm === targetKey) {
                                        return portId;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return undefined;
        }

        // Simple name lookup restricted to ports that belong to a known part
        const key = normalizeKey(reference);
        if (!key) {
            return undefined;
        }

        const portCandidates = portNameIndex.get(key);
        if (portCandidates && portCandidates.length > 0) {
            // Only return ports that are attached to a part we know about
            for (const port of portCandidates) {
                if (partIndex.has(port.parentId)) {
                    return port.id;
                }
            }
        }

        const partCandidates = partNameIndex.get(key);
        if (partCandidates && partCandidates.length > 0) {
            return partCandidates[0].id;
        }

        return undefined;
    };

    const candidateRelationships = collectRelationships(dataset);
    const seenConnectors = new Set<string>();
    const connectors: IbdConnectorViewModel[] = [];


    candidateRelationships.forEach(rel => {
        if (!rel || !rel.source || !rel.target) {
            return;
        }
        const normalizedType = normalizeType(rel.type);
        const isConnector = isConnectorRelationship(normalizedType);

        if (!isConnector) {
            return;
        }
        const sourceId = resolveReference(rel.source);
        const targetId = resolveReference(rel.target);
        if (!sourceId || !targetId || sourceId === targetId) {
            return;
        }
        const key = `${sourceId  }->${  targetId  }:${  normalizedType || 'connector'}`;
        if (seenConnectors.has(key)) {
            return;
        }
        seenConnectors.add(key);
        connectors.push({
            id: rel.id || `ibd-conn-${connectors.length + 1}`,
            type: rel.type || 'connector',
            sourceId,
            targetId,
            stereotype: rel.type
        });
    });


    const finalizedParts: IbdPartViewModel[] = parts.map(part => ({
        ...part,
        portIds: part.portIds.slice()
    }));

    const metadata: IbdViewModelMetadata = {
        partCount: finalizedParts.length,
        portCount: ports.length,
        connectorCount: connectors.length
    };

    return {
        container: containerElement ? {
            id: containerElement.id || 'ibd-container',
            name: containerElement.name || containerElement.type || 'container',
            type: containerElement.type || 'part'
        } : undefined,
        parts: finalizedParts,
        ports: ports.slice(),
        connectors,
        metadata
    };
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

            // SysML v2 interface elements with from/to attributes should be converted to relationships
            if (element.type === 'interface') {
                const getAttr = (el: any, ...keys: string[]): string => {
                    if (!el.attributes) return '';
                    if (typeof el.attributes.get === 'function') {
                        for (const key of keys) {
                            const val = el.attributes.get(key);
                            if (val) return String(val);
                        }
                        return '';
                    }
                    for (const key of keys) {
                        const val = el.attributes[key];
                        if (val) return String(val);
                    }
                    return '';
                };

                const fromRef = getAttr(element, 'from');
                const toRef = getAttr(element, 'to');

                if (fromRef && toRef) {
                    const relationship = {
                        id: element.id || `interface-${element.name}`,
                        type: 'connection',
                        source: fromRef,
                        target: toRef
                    };
                    relationships.push(relationship);
                }
            }

            // SysML v2 connection elements with 'end' children should be converted to relationships
            if (element.type === 'connection' && Array.isArray(element.children)) {
                const ends = element.children.filter(child => child && child.type === 'end');

                if (ends.length >= 2) {
                    // Create relationship from first two ends
                    const sourceEnd = ends[0];
                    const targetEnd = ends[1];

                    // Handle attributes as Map (from parser) or plain object
                    const getAttr = (element: any, ...keys: string[]): string => {
                        if (!element.attributes) return '';

                        // Try Map.get() first
                        if (typeof element.attributes.get === 'function') {
                            for (const key of keys) {
                                const val = element.attributes.get(key);
                                if (val) return String(val);
                            }
                            return '';
                        }

                        // Fall back to plain object access
                        for (const key of keys) {
                            const val = element.attributes[key];
                            if (val) return String(val);
                        }
                        return '';
                    };

                    // Extract source/target references from end elements
                    const sourceRef = getAttr(sourceEnd, 'sourceRef', 'targetRef', 'references', 'target')
                                   || sourceEnd.name || sourceEnd.id || '';
                    const targetRef = getAttr(targetEnd, 'sourceRef', 'targetRef', 'references', 'target')
                                   || targetEnd.name || targetEnd.id || '';

                    const relationship = {
                        id: element.id || `conn-${element.name}`,
                        type: 'connection',
                        source: sourceRef,
                        target: targetRef
                    };
                    relationships.push(relationship);
                }
            }

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

function detectPortDirection(element: DiagramElementViewModel): IbdPortDirection {
    const directionFromAttributes = readDirectionFromRecord(element.attributes);
    if (directionFromAttributes) {
        return directionFromAttributes;
    }
    const directionFromProperties = readDirectionFromRecord(element.properties);
    if (directionFromProperties) {
        return directionFromProperties;
    }
    const normalizedType = normalizeType(element.type);
    if (!normalizedType) {
        return 'unspecified';
    }
    if (matchesKeyword(normalizedType, DIRECTION_IN_KEYWORDS) && matchesKeyword(normalizedType, DIRECTION_OUT_KEYWORDS)) {
        return 'inout';
    }
    if (matchesKeyword(normalizedType, DIRECTION_IN_KEYWORDS)) {
        return 'in';
    }
    if (matchesKeyword(normalizedType, DIRECTION_OUT_KEYWORDS)) {
        return 'out';
    }
    return 'unspecified';
}

function readDirectionFromRecord(record?: Map<string, AttributeValue> | Record<string, AttributeValue>): IbdPortDirection | undefined {
    if (!record) {
        return undefined;
    }
    const getValue = (key: string): AttributeValue | undefined => {
        if (record instanceof Map) {
            return record.get(key);
        }
        return record[key];
    };
    const directionValue = getValue('direction') || getValue('Direction');
    if (!directionValue) {
        return undefined;
    }
    const normalized = normalizeKey(String(directionValue));
    if (!normalized) {
        return undefined;
    }
    if (normalized.includes('inout')) {
        return 'inout';
    }
    if (normalized.includes('in')) {
        return 'in';
    }
    if (normalized.includes('out')) {
        return 'out';
    }
    return 'unspecified';
}

function isPartElement(normalizedType: string | undefined): boolean {
    if (!normalizedType) {
        return false;
    }
    return matchesKeyword(normalizedType, PART_KEYWORDS);
}

function isPortElement(normalizedType: string | undefined): boolean {
    if (!normalizedType) {
        return false;
    }
    return matchesKeyword(normalizedType, PORT_KEYWORDS);
}

function isConnectorRelationship(normalizedType: string | undefined): boolean {
    if (!normalizedType) {
        return false;
    }
    return matchesKeyword(normalizedType, CONNECTOR_KEYWORDS);
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

function normalizeKey(value?: string): string | undefined {
    if (!value) {
        return undefined;
    }
    const key = value.trim().toLowerCase();
    return key || undefined;
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
