import { parse } from 'papaparse';

interface SyntaxPattern { name?: string; match?: string; patterns?: SyntaxPattern[] }
const syntax = require('../../syntaxes/sysml.tmLanguage.json') as {
    repository: Record<string, SyntaxPattern>;
};
const reservedPatterns = Object.values(syntax.repository).flatMap(group => group.patterns || [])
    .filter(pattern => pattern.match && (pattern.name?.startsWith('keyword.')
        || pattern.name?.startsWith('constant.language.')))
    .map(pattern => new RegExp(pattern.match as string));

export interface SourceEdit {
    start: number;
    end: number;
    expected: string;
    text: string;
}

export interface RequirementInput {
    name: string;
    identifier: string;
    documentation: string;
    definition: boolean;
    typeName: string;
}

export interface EditableFields {
    identifier: string;
    documentation: string;
    typeName: string;
    multiplicity: string;
}

export type EditableField = keyof EditableFields;
export type LinkKind = 'satisfy' | 'verify' | 'dependency';

const simpleName = '[A-Za-z_][A-Za-z0-9_]*';
const qualifiedName = `${simpleName}(?:::${simpleName})*`;
const declarationPattern = new RegExp(
    `^(?<prefix>\\s*(?:(?:public|private|protected|abstract|in|out|inout|ref|readonly|derived)\\s+)*`
    + '(?:requirement|part|item|port|attribute|verification|action|package)(?:\\s+def)?)\\s+'
    + `(?:<(?<identifier>'[A-Za-z0-9_.-]+'|[A-Za-z0-9_.-]+)>\\s*)?`
    + `(?<name>${simpleName})(?<before>\\s*\\[[0-9.*]+\\])?`
    + `(?:\\s*:\\s*(?<typeName>${qualifiedName}))?`
    + '(?<after>\\s*\\[[0-9.*]+\\])?\\s*(?<terminator>[;{])',
);

/** Read only simple declarations whose editable header is unambiguous. */
export function editableFields(source: string): EditableFields | undefined {
    const match = declarationPattern.exec(source);
    if (!match?.groups || (match.groups.before && match.groups.after)) return undefined;
    const body = source.slice(match[0].length);
    const doc = /^\s*doc\s*\/\*([\s\S]*?)\*\//.exec(body);
    return {
        identifier: (match.groups.identifier || '').replace(/^'|'$/g, ''),
        documentation: doc ? doc[1].trim() : '',
        typeName: match.groups.typeName || '',
        multiplicity: (match.groups.before || match.groups.after || '').trim().replace(/^\[|\]$/g, ''),
    };
}

/** Edit a conservative declaration subset while retaining the body verbatim. */
export function editDeclaration(source: string, updates: Partial<EditableFields>, eol = '\n'): string {
    const fields = editableFields(source);
    const match = declarationPattern.exec(source);
    if (!fields || !match?.groups) {
        throw new Error('This declaration has advanced syntax. Edit it in the source editor.');
    }
    const values = { ...fields, ...updates };
    if (values.identifier && !/^[A-Za-z0-9_.-]+$/.test(values.identifier)) {
        throw new Error('Identifier may contain letters, digits, underscores, dots and hyphens.');
    }
    if (values.typeName) validateReference(values.typeName);
    if (updates.typeName !== undefined && /\b(?:def|package)\s*$/.test(match.groups.prefix)) {
        throw new Error('Typing can only be edited on usages.');
    }
    if (values.multiplicity && !/^(?:\d+|\*)(?:\.\.(?:\d+|\*))?$/.test(values.multiplicity)) {
        throw new Error('Multiplicity must be a number, *, or a range such as 0..*.');
    }
    const bounds = values.multiplicity.split('..');
    if (bounds.length === 2 && (bounds[0] === '*' || Number(bounds[0]) > Number(bounds[1]))) {
        throw new Error('Multiplicity lower bound must not exceed the upper bound.');
    }
    if (values.documentation.includes('*/')) throw new Error('Text cannot contain */.');
    let header = match[0];
    if (updates.identifier !== undefined || updates.typeName !== undefined
        || updates.multiplicity !== undefined) {
        const identifier = values.identifier ? ` <'${values.identifier}'>` : '';
        const typing = values.typeName ? ` : ${values.typeName}` : '';
        const multiplicity = values.multiplicity ? ` [${values.multiplicity}]` : '';
        header = `${match.groups.prefix}${identifier} ${match.groups.name}${typing}`
            + `${multiplicity}${match.groups.terminator === '{' ? ' {' : ';'}`;
    }
    let body = source.slice(match[0].length);
    if (updates.documentation !== undefined) {
        const documentation = values.documentation.replace(/\r\n|\r|\n/g, eol);
        const doc = /^(\s*)doc\s*\/\*[\s\S]*?\*\//.exec(body);
        if (doc) {
            body = body.replace(doc[0], `${doc[1]}doc /* ${documentation} */`);
        } else {
            if (/\bdoc\b/.test(maskComments(body))) {
                throw new Error('Documentation is not at the start of this body. Edit it in source.');
            }
            if (match.groups.terminator === ';') {
                header = `${header.slice(0, -1)} {`;
                body = `${eol}}${body}`;
            }
            body = `${eol}    doc /* ${documentation} */${body}`;
        }
    }
    return header + body;
}

/** Mask comments and strings without changing source offsets. */
export function maskComments(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
        match => match.replace(/[^\r\n]/g, ' '));
}

export interface SourceLink {
    kind: LinkKind;
    source: string;
    target: string;
    start: number;
    end: number;
}

/** Locate editable, single-target statements; complex relationships remain source-only. */
export function sourceLinks(source: string): SourceLink[] {
    const masked = maskComments(source).replace(/\bdoc\b/g, '   ');
    const pattern = new RegExp(`(?:^|(?<=[;{}]))\\s*`
        + `(?:(satisfy)\\s+(${qualifiedName})\\s+by\\s+(${qualifiedName})`
        + `|(verify)\\s+(${qualifiedName})`
        + `|(dependency)\\s+(?:from\\s+)?(${qualifiedName})\\s+to\\s+(${qualifiedName}))\\s*;`, 'g');
    return Array.from(masked.matchAll(pattern), match => {
        const kind = (match[1] || match[4] || match[6]) as LinkKind;
        const start = match.index + match[0].search(/\S/);
        return {
            kind, source: match[3] || match[7] || '', target: match[2] || match[5] || match[8],
            start, end: match.index + match[0].length,
        };
    }).filter(link => !/\/\*|\/\//.test(source.slice(link.start, link.end)));
}

/** Generate a relationship statement; verification is inserted inside its source element. */
export function relationshipDeclaration(kind: LinkKind, source: string, target: string): string {
    validateReference(source);
    validateReference(target);
    if (source === target) throw new Error('A relationship must have distinct endpoints.');
    switch (kind) {
        case 'satisfy': return `satisfy ${target} by ${source};`;
        case 'verify': return `verify ${target};`;
        case 'dependency': return `dependency from ${source} to ${target};`;
        default: throw new Error('Unsupported relationship kind.');
    }
}

/** Insert inside an LSP-provided container range, preserving existing source. */
export function insertMembers(source: string, members: readonly string[], eol = '\n'): string {
    if (!members.length) throw new Error('No members to insert.');
    const body = members.map(member => member.split(eol).map(line => `    ${line}`).join(eol))
        .join(eol);
    const masked = maskComments(source).trimEnd();
    if (masked.endsWith('}')) {
        const end = masked.length - 1;
        return `${source.slice(0, end)}${eol}${body}${eol}${source.slice(end)}`;
    }
    if (masked.endsWith(';')) {
        const end = masked.length - 1;
        return `${source.slice(0, end)} {${eol}${body}${eol}}${source.slice(end + 1)}`;
    }
    throw new Error('Container has no editable body.');
}

/** Insert verification members into the case's objective requirement. */
export function insertVerification(source: string, members: readonly string[], eol = '\n'): string {
    const masked = maskComments(source);
    let depth = 0;
    let objectiveStart = -1;
    let objectiveEnd = -1;
    for (const token of masked.matchAll(/\bobjective\b|[{};]/g)) {
        const offset = token.index;
        if (token[0] === 'objective' && depth === 1) {
            if (objectiveStart !== -1
                || !/^objective\s*(?:[A-Za-z_][A-Za-z0-9_]*\s*)?[{;]/.test(masked.slice(offset))) {
                throw new Error('This verification objective uses advanced syntax. Edit it in source.');
            }
            objectiveStart = offset;
        }
        if (token[0] === '{') depth++;
        if (token[0] === '}') depth--;
        if (objectiveStart !== -1 && objectiveEnd === -1 && depth === 1
            && (token[0] === ';' || token[0] === '}')) objectiveEnd = offset + 1;
    }
    if (objectiveStart !== -1) {
        if (objectiveEnd === -1) throw new Error('Incomplete verification objective. Edit it in source.');
        return source.slice(0, objectiveStart)
            + insertMembers(source.slice(objectiveStart, objectiveEnd), members, eol)
            + source.slice(objectiveEnd);
    }
    return insertMembers(source, [`objective {${eol}${members.map(member => `    ${member}`).join(eol)}${eol}}`], eol);
}

/** Parse a bounded CSV/TSV clipboard payload with mandatory, unique headers. */
export function parsePaste(text: string, allowed: readonly string[]): Record<string, string>[] {
    if (text.length > 1_000_000) throw new Error('Paste is limited to 1 MB.');
    const result = parse<string[]>(text, { skipEmptyLines: 'greedy', delimitersToGuess: ['\t', ','] });
    if (result.errors.some(error => error.code !== 'UndetectableDelimiter')) {
        throw new Error(`Invalid spreadsheet data: ${result.errors[0].message}`);
    }
    const [rawHeaders, ...records] = result.data;
    const headers = (rawHeaders || []).map(header => header.trim());
    if (!headers.length || headers.some(header => !allowed.includes(header))
        || new Set(headers).size !== headers.length) {
        throw new Error(`Use unique column headers from: ${allowed.join(', ')}.`);
    }
    if (!records.length || records.length > 500) throw new Error('Paste must contain 1 to 500 rows.');
    return records.map((record, index) => {
        if (record.length !== headers.length) throw new Error(`Row ${index + 2} has the wrong column count.`);
        return Object.fromEntries(headers.map((header, column) => [header, record[column]]));
    });
}

/** Validate a qualified reference without accepting arbitrary SysML source. */
export function validateReference(value: string): string {
    const identifier = "(?:[A-Za-z_][A-Za-z0-9_]*|'[^'\\\\\\r\\n]+')";
    if (!new RegExp(`^${identifier}(?:::${identifier})*$`).test(value)) {
        throw new Error('Use a SysML name or a qualified name separated by ::.');
    }
    for (const name of value.match(/'[^']*'|[A-Za-z_][A-Za-z0-9_]*/g) || []) {
        if (!name.startsWith("'") && reservedPatterns.some(pattern => pattern.test(name))) {
            throw new Error(`Reserved keyword must be quoted: ${name}`);
        }
    }
    return value;
}

/** Build a requirement declaration from validated form values. */
export function requirementDeclaration(input: RequirementInput, eol = '\n'): string {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input.name)) {
        throw new Error('Name must start with a letter or underscore and contain only letters, digits or underscores.');
    }
    validateReference(input.name);
    if (input.identifier && !/^[A-Za-z0-9_.-]+$/.test(input.identifier)) {
        throw new Error('Identifier may contain letters, digits, underscores, dots and hyphens.');
    }
    if (input.documentation.includes('*/')) {
        throw new Error('Requirement text cannot contain the comment terminator */.');
    }
    if (input.definition && input.typeName) {
        throw new Error('A definition cannot use usage typing.');
    }
    const shortName = input.identifier ? ` <'${input.identifier}'>` : '';
    const typing = input.typeName ? ` : ${validateReference(input.typeName)}` : '';
    const keyword = input.definition ? 'requirement def' : 'requirement';
    const documentation = input.documentation.replace(/\r\n|\r|\n/g, eol);
    return `${keyword}${shortName} ${input.name}${typing} {${eol}`
        + `    doc /* ${documentation} */${eol}}`;
}

/** Apply a batch only when every source span still matches the displayed snapshot. */
export function applySourceEdits(
    source: string,
    expectedVersion: number,
    actualVersion: number,
    edits: readonly SourceEdit[],
): string {
    if (expectedVersion !== actualVersion) {
        throw new Error('The document changed. Refresh the model and retry.');
    }
    const ordered = [...edits].sort((left, right) => left.start - right.start);
    let previousEnd = -1;
    let previousStart = -1;
    for (const edit of ordered) {
        if (!Number.isInteger(edit.start) || !Number.isInteger(edit.end)
            || edit.start < 0 || edit.end < edit.start || edit.end > source.length
            || edit.start <= previousEnd || edit.start === previousStart
            || source.slice(edit.start, edit.end) !== edit.expected) {
            throw new Error('The edit contains stale or overlapping source ranges. Refresh and retry.');
        }
        previousEnd = edit.end - 1;
        previousStart = edit.start;
    }
    let result = source;
    for (const edit of ordered.reverse()) {
        result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
    }
    return result;
}
