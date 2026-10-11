import { sourceLinks } from '../modelEditing/modelEdits';
import type { RangeDTO, RelationshipDTO, SysMLElementDTO } from '../providers/sysmlModelTypes';

export interface ArchitectureDocument {
    readonly uri: string;
    readonly label: string;
    readonly version: number;
    readonly elements: readonly SysMLElementDTO[];
    readonly relationships: readonly RelationshipDTO[];
    readonly text?: string;
}

export interface ArchitectureNode {
    readonly id: string;
    readonly symbolId?: string;
    readonly uri: string;
    readonly name: string;
    readonly qualifiedName: string;
    readonly type: string;
    readonly parentId?: string;
    readonly range: RangeDTO;
    readonly documentation: string;
}

export interface ArchitectureEdge {
    readonly id: string;
    readonly source: string;
    readonly target: string;
    readonly kind: string;
    readonly evidenceId: string;
    readonly uri?: string;
    readonly range?: RangeDTO;
}

export interface ArchitectureGraph {
    readonly nodes: readonly ArchitectureNode[];
    readonly edges: readonly ArchitectureEdge[];
    readonly unresolved: number;
    readonly documents: readonly { uri: string; label: string; version: number }[];
}

export type ArchitectureQuestion = 'removal' | 'requirements' | 'connector' | 'trace';

export interface ArchitectureFinding {
    readonly nodeId: string;
    readonly text: string;
    readonly nodeIds: readonly string[];
    readonly edgeIds: readonly string[];
}

export interface ArchitectureAnswer {
    readonly question: ArchitectureQuestion;
    readonly title: string;
    readonly summary: string;
    readonly findings: readonly ArchitectureFinding[];
    readonly caveats: readonly string[];
}

/** Build an evidence graph using LSP identities and unambiguous lexical references. */
export function buildArchitectureGraph(documents: readonly ArchitectureDocument[]): ArchitectureGraph {
    const nodes: ArchitectureNode[] = [];
    const declarations = new Map<string, SysMLElementDTO>();
    const bySymbol = new Map<string, ArchitectureNode[]>();
    const byName = new Map<string, ArchitectureNode[]>();
    for (const document of documents) {
        const visit = (elements: readonly SysMLElementDTO[], parent?: ArchitectureNode): void => {
            for (const element of elements) {
                const node: ArchitectureNode = {
                    id: `${document.uri}#${element.symbolId ?? `${element.range.start.line}:${element.range.start.character}`}`,
                    symbolId: element.symbolId, uri: document.uri,
                    name: element.name || element.displayName || '(anonymous)',
                    qualifiedName: [parent?.qualifiedName, element.name || element.displayName || '(anonymous)']
                        .filter(Boolean).join('::'),
                    type: element.type.toLowerCase(), parentId: parent?.id, range: element.range,
                    documentation: String(element.attributes.documentation ?? ''),
                };
                nodes.push(node);
                declarations.set(node.id, element);
                if (node.symbolId) {
                    bySymbol.set(node.symbolId, [...bySymbol.get(node.symbolId) ?? [], node]);
                }
                byName.set(node.qualifiedName, [...byName.get(node.qualifiedName) ?? [], node]);
                visit(element.children ?? [], node);
            }
        };
        visit(document.elements);
    }
    const unique = (candidates: readonly ArchitectureNode[]): ArchitectureNode | undefined =>
        candidates.length === 1 ? candidates[0] : undefined;
    const resolve = (reference: string, owner?: ArchitectureNode): ArchitectureNode | undefined => {
        if (!reference) return undefined;
        const normalized = (reference.match(/'[^']*'|[^:.]+/g) ?? [])
            .map(segment => segment.replace(/^'|'$/g, '')).join('::');
        const segments = owner?.qualifiedName.split('::') ?? [];
        while (segments.length) {
            const candidates = byName.get(`${segments.join('::')}::${normalized}`);
            if (candidates?.length) return unique(candidates);
            segments.pop();
        }
        return unique(byName.get(normalized) ?? []);
    };
    const edges: ArchitectureEdge[] = nodes.flatMap(node => node.parentId ? [{
        id: `contains-${node.id}`, source: node.parentId, target: node.id,
        kind: 'containment', evidenceId: node.id,
    }] : []);
    const signatures = new Map<string, number>();
    let unresolved = 0;
    const add = (relationship: RelationshipDTO, owner?: ArchitectureNode,
        location?: { uri: string; range: RangeDTO }): void => {
        const evidence = relationship.symbolId
            ? unique(bySymbol.get(relationship.symbolId) ?? []) : owner;
        const source = relationship.sourceId
            ? unique(bySymbol.get(relationship.sourceId) ?? [])
            : resolve(relationship.source ?? '', owner ?? evidence);
        const target = resolve(relationship.target, owner ?? evidence ?? source);
        if (!source || !target) { unresolved++; return; }
        const kind = relationship.type.toLowerCase();
        const signature = `${kind}|${source.id}|${target.id}|${evidence?.id ?? source.id}`;
        const existing = signatures.get(signature);
        if (existing !== undefined) {
            if (location) edges[existing] = { ...edges[existing], ...location };
            return;
        }
        signatures.set(signature, edges.length);
        edges.push({ id: `edge-${edges.length}`, source: source.id, target: target.id,
            kind, evidenceId: evidence?.id ?? source.id,
            uri: location?.uri ?? evidence?.uri ?? source.uri,
            range: location?.range ?? evidence?.range ?? source.range });
    };
    for (const node of nodes) {
        for (const relationship of declarations.get(node.id)?.relationships ?? []) add(relationship, node);
    }
    for (const document of documents) {
        for (const relationship of document.relationships) {
            const candidates = nodes.filter(node => node.uri === document.uri
                && (node.symbolId === relationship.sourceId || node.name === relationship.source
                    || node.qualifiedName === relationship.source));
            add(relationship, unique(candidates));
        }
        if (document.text) {
            const text = document.text;
            const offsets = [0];
            for (let index = 0; index < text.length; index++) if (text[index] === '\n') offsets.push(index + 1);
            const position = (offset: number) => {
                let line = offsets.length - 1;
                while (line > 0 && offsets[line] > offset) line--;
                return { line, character: offset - offsets[line] };
            };
            for (const link of sourceLinks(text)) {
                const start = position(link.start);
                const end = position(link.end);
                const containers = nodes.filter(node => node.uri === document.uri
                    && (offsets[node.range.start.line] + node.range.start.character) <= link.start
                    && (offsets[node.range.end.line] + node.range.end.character) >= link.end)
                    .sort((left, right) => right.range.start.line - left.range.start.line
                        || right.range.start.character - left.range.start.character);
                const owner = containers[0];
                const source = link.kind === 'verify' ? containers.find(node => node.type.includes('verification'))
                    : resolve(link.source, owner);
                add({ type: link.kind, source: source?.qualifiedName ?? link.source,
                    sourceId: source?.symbolId, target: link.target }, source ?? owner,
                { uri: document.uri, range: { start, end } });
            }
        }
    }
    return { nodes, edges, unresolved,
        documents: documents.map(({ uri, label, version }) => ({ uri, label, version })) };
}

const reverseImpact = new Set(['dependency', 'specializes', 'specialization', 'typing', 'redefinition', 'subsetting']);
const forwardImpact = new Set(['satisfy', 'verify', 'flow', 'succession', 'transition']);
const symmetricImpact = new Set(['connection', 'binding', 'interface', 'allocation']);
const traceKinds = new Set([...reverseImpact, ...forwardImpact, ...symmetricImpact]);

/** Answer bounded engineering queries without claiming behavior not established by the model. */
export function answerArchitectureQuestion(
    graph: ArchitectureGraph, question: ArchitectureQuestion, selectedId: string, targetId?: string,
): ArchitectureAnswer {
    const byId = new Map(graph.nodes.map(node => [node.id, node]));
    const selected = byId.get(selectedId);
    if (!selected) throw new Error('Select an element in the current model.');
    const caveats = ['Results cover only loaded files and explicit modeled relationships; absent links do not prove independence.'];
    if (graph.unresolved) caveats.push(`${graph.unresolved} relationship endpoint(s) could not be resolved unambiguously.`);
    const adjacency = new Map<string, { node: string; edge: ArchitectureEdge }[]>();
    const connect = (source: string, target: string, edge: ArchitectureEdge): void => {
        const entries = adjacency.get(source) ?? [];
        entries.push({ node: target, edge });
        adjacency.set(source, entries);
    };
    for (const edge of graph.edges) {
        if (question === 'trace') {
            if (!traceKinds.has(edge.kind)) continue;
            connect(edge.source, edge.target, edge);
            connect(edge.target, edge.source, edge);
        } else {
            if (reverseImpact.has(edge.kind) || symmetricImpact.has(edge.kind)) connect(edge.target, edge.source, edge);
            if (forwardImpact.has(edge.kind) || symmetricImpact.has(edge.kind)) connect(edge.source, edge.target, edge);
        }
    }
    if (question === 'connector') {
        const evidence = graph.edges.filter(edge => edge.kind !== 'containment'
            && (edge.evidenceId === selected.id || edge.source === selected.id || edge.target === selected.id));
        const findings = evidence.map(edge => ({ nodeId: edge.evidenceId,
            text: `${byId.get(edge.source)?.qualifiedName} --${edge.kind}--> ${byId.get(edge.target)?.qualifiedName}`,
            nodeIds: [edge.source, edge.target], edgeIds: [edge.id] }));
        return { question, title: `Why does ${selected.name} exist?`,
            summary: selected.documentation || 'No design rationale is modeled for this element. Its declared links are shown below.',
            findings, caveats: [...caveats, 'A declared connection establishes connectivity, not the author\'s intent.'] };
    }
    const previous = new Map<string, { node: string; edge?: ArchitectureEdge }>();
    previous.set(selected.id, { node: selected.id });
    const queue = [selected.id];
    const removed = new Set([selected.id]);
    if (question === 'removal' || question === 'requirements') {
        for (let index = 0; index < queue.length; index++) {
            for (const node of graph.nodes) {
                if (node.parentId !== queue[index] || previous.has(node.id)) continue;
                previous.set(node.id, { node: queue[index],
                    edge: graph.edges.find(edge => edge.kind === 'containment' && edge.target === node.id) });
                removed.add(node.id);
                queue.push(node.id);
            }
        }
    }
    if (question === 'removal') {
        for (const edge of graph.edges) {
            if (edge.kind === 'containment') continue;
            if (!removed.has(edge.source) && !removed.has(edge.target)
                && !removed.has(edge.evidenceId)) continue;
            for (const endpoint of [edge.source, edge.target, edge.evidenceId]) {
                if (previous.has(endpoint)) continue;
                previous.set(endpoint, { node: selected.id, edge });
                queue.push(endpoint);
            }
        }
    }
    for (let index = 0; index < queue.length; index++) {
        for (const neighbor of adjacency.get(queue[index]) ?? []) {
            if (previous.has(neighbor.node)) continue;
            previous.set(neighbor.node, { node: queue[index], edge: neighbor.edge });
            queue.push(neighbor.node);
        }
    }
    const path = (nodeId: string): ArchitectureFinding => {
        const nodeIds: string[] = [nodeId];
        const edgeIds: string[] = [];
        let current = nodeId;
        while (current !== selected.id) {
            const step = previous.get(current);
            if (!step) break;
            if (step.edge) edgeIds.unshift(step.edge.id);
            nodeIds.unshift(step.node);
            current = step.node;
        }
        const node = byId.get(nodeId);
        if (!node) throw new Error('The trace refers to an unavailable element. Refresh and retry.');
        const status = question === 'removal' ? removed.has(nodeId) ? 'Removed with selection'
            : 'Potentially affected' : node.type;
        return { nodeId, text: `${node.qualifiedName} (${status})`, nodeIds, edgeIds };
    };
    if (question === 'trace') {
        const target = targetId && byId.get(targetId);
        if (!target) throw new Error('Choose the implementation element to trace to.');
        caveats.push('Shortest means fewest modeled links; links may be traversed in either direction, not causal order. Containment is excluded.');
        const found = previous.has(target.id);
        const finding = found ? path(target.id) : undefined;
        return { question, title: `${selected.name} to ${target.name}`,
            summary: finding ? `Shortest modeled trace: ${finding.edgeIds.length} link(s).`
                : 'No modeled trace connects these elements in the loaded files.',
            findings: finding ? [finding] : [], caveats };
    }
    const impacted = queue.slice(1).filter(id => question !== 'requirements'
        || byId.get(id)?.type.includes('requirement'));
    caveats.push('Reachability identifies potential engineering impact, not a prediction of physical failure.');
    return { question,
        title: question === 'requirements' ? `Requirements impacted by ${selected.name}` : `Removing ${selected.name}`,
        summary: question === 'requirements' ? `${impacted.length} requirement(s) reachable through modeled impact links.`
            : `${queue.length - 1} element(s) are removed with it or potentially affected through modeled links.`,
        findings: impacted.map(path), caveats };
}
