import type { SysMLElementDTO, SysMLModelResult } from '../providers/sysmlModelTypes';
import {
    applySourceEdits, editableFields, editDeclaration, insertMembers, insertVerification,
    maskComments,
    parsePaste,
    relationshipDeclaration, requirementDeclaration, sourceLinks,
    type EditableFields, type LinkKind,
    type RequirementInput,
    type SourceEdit,
} from './modelEdits';

export interface ModelDocument {
    uri: string;
    label: string;
    version: number;
    text: string;
    model: SysMLModelResult;
}

export interface ModelRow {
    id: string;
    uri: string;
    name: string;
    qualifiedName: string;
    type: string;
    parentId: string;
    start: number;
    end: number;
    fields?: EditableFields;
    documentation: string;
}

export interface ModelLink {
    id: string;
    uri: string;
    kind: LinkKind;
    source: string;
    target: string;
    sourceId?: string;
    targetId?: string;
    start?: number;
    end?: number;
}

export interface ModelSnapshot {
    documents: ModelDocument[];
    rows: ModelRow[];
    links: ModelLink[];
}

export interface PlannedDocument {
    uri: string;
    version: number;
    edits: SourceEdit[];
}

export type WorkbenchOperation =
    | { kind: 'cells'; cells: { id: string; fields: Partial<EditableFields> }[] }
    | { kind: 'requirements'; uri: string; parentId: string; items: RequirementInput[] }
    | { kind: 'relationship'; linkId?: string; type: LinkKind; sourceId: string; targetId: string }
    | { kind: 'deleteRelationship'; linkId: string }
    | { kind: 'deleteElement'; id: string }
    | { kind: 'paste'; mode: 'requirements' | 'relationships' | 'updates';
        uri: string; parentId: string; text: string };

const fieldNames = ['identifier', 'documentation', 'typeName', 'multiplicity'] as const;

/** Resolve references lexically, never by an ambiguous model-wide simple name. */
export function resolveRow(rows: readonly ModelRow[], reference: string, owner?: ModelRow): ModelRow | undefined {
    const segments = owner?.qualifiedName.split('::') || [];
    while (segments.length) {
        const candidate = `${segments.join('::')}::${reference}`;
        const matches = rows.filter(row => row.qualifiedName === candidate);
        if (matches.length === 1) return matches[0];
        if (matches.length > 1) return undefined;
        segments.pop();
    }
    const matches = rows.filter(row => row.qualifiedName === reference);
    return matches.length === 1 ? matches[0] : undefined;
}

/** Build source-addressed rows and links from the language server's model snapshot. */
export function buildSnapshot(documents: ModelDocument[]): ModelSnapshot {
    const rows: ModelRow[] = [];
    for (const document of documents) {
        const lines = document.text.split('\n');
        const offsets: number[] = [];
        let offset = 0;
        for (const line of lines) { offsets.push(offset); offset += line.length + 1; }
        const visit = (elements: SysMLElementDTO[], parent?: ModelRow) => {
            for (const element of elements) {
                const start = offsets[element.range.start.line] + element.range.start.character;
                const end = offsets[element.range.end.line] + element.range.end.character;
                if (!Number.isInteger(start) || !Number.isInteger(end) || end < start
                    || end > document.text.length) continue;
                const name = element.name;
                if (!name) { visit(element.children || [], parent); continue; }
                const reference = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `'${name}'`;
                const fields = editableFields(document.text.slice(start, end));
                const row: ModelRow = {
                    id: `${document.uri}#${start}:${end}`, uri: document.uri, name,
                    qualifiedName: parent ? `${parent.qualifiedName}::${reference}` : reference,
                    type: element.type, parentId: parent?.id || '', start, end, fields,
                    documentation: String(element.attributes.documentation || fields?.documentation || ''),
                };
                rows.push(row);
                visit(element.children || [], row);
            }
        };
        visit(document.model.elements || []);
    }
    const links: ModelLink[] = [];
    for (const document of documents) {
        for (const link of sourceLinks(document.text)) {
            const containers = rows.filter(row => row.uri === document.uri
                && row.start < link.start && row.end >= link.end)
                .sort((left, right) => right.start - left.start);
            const owner = containers[0];
            const source = link.kind === 'verify'
                ? containers.find(row => row.type.includes('verification'))
                : resolveRow(rows, link.source, owner);
            const target = resolveRow(rows, link.target, owner);
            links.push({
                ...link, id: `${document.uri}@${link.start}`, uri: document.uri,
                source: source?.qualifiedName || link.source,
                target: target?.qualifiedName || link.target,
                sourceId: source?.id, targetId: target?.id,
            });
        }
        for (const relationship of document.model.relationships || []) {
            if (!['satisfy', 'verify', 'dependency'].includes(relationship.type)) continue;
            const resolveSummary = (reference: string) => {
                if (!reference) return undefined;
                const exact = resolveRow(rows, reference);
                if (exact) return exact;
                const local = rows.filter(row => row.uri === document.uri && row.name === reference);
                return local.length === 1 ? local[0] : undefined;
            };
            const source = resolveSummary(relationship.source);
            const target = resolveSummary(relationship.target);
            if (!relationship.source && links.some(link => link.uri === document.uri
                && link.kind === relationship.type && (target ? link.targetId === target.id
                    : link.target === relationship.target))) continue;
            if (links.some(link => link.uri === document.uri && link.kind === relationship.type
                && (link.source === relationship.source || (source && link.sourceId === source.id))
                && (link.target === relationship.target || (target && link.targetId === target.id)))) continue;
            links.push({
                id: `${document.uri}@semantic-${links.length}`, uri: document.uri,
                kind: relationship.type as LinkKind, source: relationship.source || '',
                target: relationship.target, sourceId: source?.id, targetId: target?.id,
            });
        }
    }
    return { documents, rows, links };
}

function changedSpan(before: string, after: string, base = 0): SourceEdit | undefined {
    if (before === after) return undefined;
    let start = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;
    let end = before.length;
    let afterEnd = after.length;
    while (end > start && afterEnd > start && before[end - 1] === after[afterEnd - 1]) {
        end--; afterEnd--;
    }
    return { start: base + start, end: base + end,
        expected: before.slice(start, end), text: after.slice(start, afterEnd) };
}

/** Plan validated mutations without applying or saving any document. */
export function planOperation(snapshot: ModelSnapshot, operation: WorkbenchOperation): PlannedDocument[] {
    const plans = new Map<string, PlannedDocument>();
    const pendingMembers = new Map<string, { document: ModelDocument; parent?: ModelRow; members: string[] }>();
    const documentFor = (uri: string) => {
        const document = snapshot.documents.find(candidate => candidate.uri === uri);
        if (!document) throw new Error('Load the destination file before editing it.');
        return document;
    };
    const rowFor = (id: string) => {
        const row = snapshot.rows.find(candidate => candidate.id === id);
        if (!row) throw new Error('Element no longer exists. Refresh and retry.');
        return row;
    };
    const addEdit = (document: ModelDocument, edit?: SourceEdit) => {
        if (!edit) return;
        let plan = plans.get(document.uri);
        if (!plan) {
            plan = { uri: document.uri, version: document.version, edits: [] };
            plans.set(document.uri, plan);
        }
        plan.edits.push(edit);
    };
    const eolFor = (document: ModelDocument) => document.text.includes('\r\n') ? '\r\n' : '\n';
    const addMember = (document: ModelDocument, parent: ModelRow | undefined, member: string) => {
        const key = parent?.id || document.uri;
        const pending = pendingMembers.get(key) || { document, parent, members: [] };
        pending.members.push(member);
        pendingMembers.set(key, pending);
    };
    const deleteLink = (id: string) => {
        const link = snapshot.links.find(candidate => candidate.id === id);
        if (!link || link.start === undefined || link.end === undefined) {
            throw new Error('This relationship uses advanced syntax. Edit it in source.');
        }
        const document = documentFor(link.uri);
        addEdit(document, { start: link.start, end: link.end,
            expected: document.text.slice(link.start, link.end), text: '' });
    };
    const signatures = new Set(snapshot.links.filter(link =>
        operation.kind !== 'relationship' || link.id !== operation.linkId)
        .map(link => `${link.kind}|${link.sourceId}|${link.targetId}`));
    const addLink = (kind: LinkKind, sourceId: string, targetId: string) => {
        const source = rowFor(sourceId);
        const target = rowFor(targetId);
        if (resolveRow(snapshot.rows, source.qualifiedName)?.id !== source.id
            || resolveRow(snapshot.rows, target.qualifiedName)?.id !== target.id) {
            throw new Error('Relationship endpoints must have unique qualified names.');
        }
        if (kind !== 'dependency' && (!target.type.includes('requirement') || target.type.includes('def'))) {
            throw new Error('Select a requirement usage as the target.');
        }
        if (kind === 'verify' && !source.type.includes('verification')) {
            throw new Error('Verification links must originate from a verification element.');
        }
        if (kind === 'satisfy' && (!source.type.includes('part') || source.type.includes('def'))) {
            throw new Error('Satisfaction links must originate from a part usage.');
        }
        const signature = `${kind}|${source.id}|${target.id}`;
        if (signatures.has(signature)) throw new Error('This relationship already exists.');
        signatures.add(signature);
        const document = documentFor(source.uri);
        let parent: ModelRow | undefined = source;
        if (kind !== 'verify') {
            parent = source.parentId ? rowFor(source.parentId) : undefined;
            while (parent && parent.type !== 'package') parent = parent.parentId ? rowFor(parent.parentId) : undefined;
        }
        addMember(document, parent, relationshipDeclaration(kind, source.qualifiedName, target.qualifiedName));
    };
    const createRequirements = (uri: string, parentId: string, items: RequirementInput[]) => {
        const document = documentFor(uri);
        const parent = parentId ? rowFor(parentId) : undefined;
        if (parent && (parent.uri !== uri || parent.type !== 'package')) {
            throw new Error('Choose a package in the destination file.');
        }
        const names = new Set(snapshot.rows.filter(row => row.uri === uri && row.parentId === parentId)
            .map(row => row.name));
        const identifiers = new Set(snapshot.rows.filter(row => row.uri === uri)
            .map(row => row.fields?.identifier).filter(Boolean));
        if (!items.length || items.length > 500) throw new Error('Create between 1 and 500 requirements.');
        for (const item of items) {
            if (names.has(item.name)) throw new Error(`Name already exists in this scope: ${item.name}`);
            const qualifiedName = parent ? `${parent.qualifiedName}::${item.name}` : item.name;
            if (snapshot.rows.some(row => row.qualifiedName === qualifiedName)) {
                throw new Error(`Name already exists in the loaded model: ${qualifiedName}`);
            }
            if (item.identifier && identifiers.has(item.identifier)) {
                throw new Error(`Identifier already exists in this file: ${item.identifier}`);
            }
            if (item.typeName) {
                const type = resolveRow(snapshot.rows, item.typeName, parent);
                if (!type?.type.includes('requirement') || !type.type.includes('def')) {
                    throw new Error(`Load and select a requirement definition for type: ${item.typeName}`);
                }
            }
            names.add(item.name);
            if (item.identifier) identifiers.add(item.identifier);
            addMember(document, parent, requirementDeclaration(item, eolFor(document)));
        }
    };
    const editCells = (cells: { id: string; fields: Partial<EditableFields> }[]) => {
        const grouped = new Map<string, Partial<EditableFields>>();
        for (const cell of cells) {
            if (Object.keys(cell.fields).some(field => !fieldNames.includes(field as keyof EditableFields))) {
                throw new Error('Unsupported editable column.');
            }
            grouped.set(cell.id, { ...grouped.get(cell.id), ...cell.fields });
        }
        const identifiers = new Map<string, Map<string, string>>();
        for (const row of snapshot.rows) {
            const identifier = grouped.get(row.id)?.identifier ?? row.fields?.identifier;
            if (!identifier) continue;
            const used = identifiers.get(row.uri) || new Map<string, string>();
            const owner = used.get(identifier);
            if (owner && (grouped.has(row.id) || grouped.has(owner))) {
                throw new Error(`Duplicate identifier: ${identifier}`);
            }
            used.set(identifier, row.id);
            identifiers.set(row.uri, used);
        }
        for (const [id, updates] of grouped) {
            const row = rowFor(id);
            const document = documentFor(row.uri);
            const before = document.text.slice(row.start, row.end);
            addEdit(document, changedSpan(before, editDeclaration(before, updates, eolFor(document)), row.start));
        }
    };
    switch (operation.kind) {
        case 'cells': editCells(operation.cells); break;
        case 'requirements': createRequirements(operation.uri, operation.parentId, operation.items); break;
        case 'deleteRelationship': deleteLink(operation.linkId); break;
        case 'deleteElement': {
            const row = rowFor(operation.id);
            const document = documentFor(row.uri);
            const contained = new Set(snapshot.rows.filter(candidate => candidate.uri === row.uri
                && candidate.start >= row.start && candidate.end <= row.end).map(candidate => candidate.id));
            const externalLinks = snapshot.links.filter(link =>
                ((link.sourceId && contained.has(link.sourceId))
                    || (link.targetId && contained.has(link.targetId)))
                && !(link.uri === row.uri && link.start !== undefined && link.end !== undefined
                    && link.start >= row.start && link.end <= row.end));
            if (externalLinks.length) {
                throw new Error('Remove relationships to this element or its contents before deleting it.');
            }
            if (row.end <= row.start) throw new Error('This element has no removable source declaration.');
            const preceding = maskComments(document.text.slice(0, row.start));
            const prefix = /(?:^|[;{}])\s*((?:(?:public|private|protected|abstract|in|out|inout|ref|readonly|derived)\s+)*)$/
                .exec(preceding);
            if (!prefix) throw new Error('This declaration has an advanced prefix. Delete it in source.');
            let start = row.start - prefix[1].length;
            let end = row.end;
            const lineStart = document.text.lastIndexOf('\n', start - 1) + 1;
            const newline = document.text.indexOf('\n', end);
            const lineEnd = newline < 0 ? document.text.length : newline;
            if (/^[\t ]*$/.test(document.text.slice(lineStart, start))
                && /^[\t \r]*$/.test(document.text.slice(end, lineEnd))) {
                start = lineStart;
                end = newline < 0 ? lineEnd : newline + 1;
            }
            addEdit(document, { start, end, expected: document.text.slice(start, end), text: '' });
            break;
        }
        case 'relationship':
            if (operation.linkId) deleteLink(operation.linkId);
            addLink(operation.type, operation.sourceId, operation.targetId);
            break;
        case 'paste': {
            if (operation.mode === 'requirements') {
                const records = parsePaste(operation.text,
                    ['name', 'identifier', 'documentation', 'typeName', 'definition']);
                createRequirements(operation.uri, operation.parentId, records.map(record => {
                    if (record.definition && !['true', 'false'].includes(record.definition)) {
                        throw new Error('definition must be true or false.');
                    }
                    return { name: record.name || '', identifier: record.identifier || '',
                        documentation: record.documentation || '', typeName: record.typeName || '',
                        definition: record.definition === 'true' };
                }));
            } else if (operation.mode === 'relationships') {
                for (const record of parsePaste(operation.text, ['kind', 'source', 'target'])) {
                    if (!['satisfy', 'verify', 'dependency'].includes(record.kind)) {
                        throw new Error('kind must be satisfy, verify, or dependency.');
                    }
                    const source = resolveRow(snapshot.rows, record.source);
                    const target = resolveRow(snapshot.rows, record.target);
                    if (!source || !target) throw new Error('Use unique, loaded qualified names for source and target.');
                    addLink(record.kind as LinkKind, source.id, target.id);
                }
            } else if (operation.mode === 'updates') {
                const records = parsePaste(operation.text, ['qualifiedName', ...fieldNames]);
                editCells(records.map(record => {
                    const row = resolveRow(snapshot.rows, record.qualifiedName);
                    if (!row) throw new Error(`Unknown or ambiguous qualifiedName: ${record.qualifiedName}`);
                    const fields = Object.fromEntries(fieldNames.filter(field => record[field] !== undefined)
                        .map(field => [field, record[field]]));
                    return { id: row.id, fields };
                }));
            } else throw new Error('Unknown paste mode.');
            break;
        }
        default: throw new Error('Unknown edit operation.');
    }
    for (const { document, parent, members } of pendingMembers.values()) {
        const eol = eolFor(document);
        if (parent) {
            const before = document.text.slice(parent.start, parent.end);
            const after = parent.type.includes('verification')
                ? insertVerification(before, members, eol) : insertMembers(before, members, eol);
            addEdit(document, changedSpan(before, after, parent.start));
        } else {
            addEdit(document, { start: document.text.length, end: document.text.length,
                expected: '', text: `${eol}${members.join(eol)}${eol}` });
        }
    }
    for (const plan of plans.values()) {
        const document = documentFor(plan.uri);
        applySourceEdits(document.text, plan.version, document.version, plan.edits);
    }
    if (!plans.size) throw new Error('No changes to apply.');
    return [...plans.values()];
}

/** Show full affected source lines so minimal edits remain understandable in review. */
export function previewChanges(snapshot: ModelSnapshot, plans: PlannedDocument[]): {
    file: string; before: string; after: string;
}[] {
    return plans.flatMap(plan => {
        const document = snapshot.documents.find(candidate => candidate.uri === plan.uri);
        if (!document) throw new Error('Preview document is no longer loaded.');
        return plan.edits.map(edit => {
            const start = document.text.lastIndexOf('\n', Math.max(0, edit.start - 1)) + 1;
            const newline = document.text.indexOf('\n', edit.end);
            const end = newline < 0 ? document.text.length : newline;
            return { file: document.label, before: document.text.slice(start, end),
                after: document.text.slice(start, edit.start) + edit.text + document.text.slice(edit.end, end) };
        });
    });
}
