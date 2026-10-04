/**
 * DTO types for the `sysml/model` custom LSP request and `sysml/status` notification.
 *
 * These mirror the types defined in the sysml-v2-lsp server
 * (`server/src/model/sysmlModelTypes.ts`).  All ranges use LSP-style
 * 0-based positions — the LspModelProvider converts them to
 * `vscode.Range` before consumers see them.
 */

// ---------------------------------------------------------------------------
// Status Notification
// ---------------------------------------------------------------------------

export interface SysMLStatusParams {
    state: 'begin' | 'progress' | 'end';
    message: string;
    uri: string;
    fileName?: string;
}

// ---------------------------------------------------------------------------
// Request / Response
// ---------------------------------------------------------------------------

export type SysMLModelScope =
    | 'elements'
    | 'relationships'
    | 'sequenceDiagrams'
    | 'activityDiagrams'
    | 'resolvedTypes'
    | 'diagnostics';

export interface SysMLModelParams {
    textDocument: { uri: string };
    scope?: SysMLModelScope[];
}

export interface SysMLModelResult {
    version: number;
    elements?: SysMLElementDTO[];
    relationships?: RelationshipDTO[];
    sequenceDiagrams?: SequenceDiagramDTO[];
    activityDiagrams?: ActivityDiagramDTO[];
    resolvedTypes?: Record<string, ResolvedTypeDTO>;
    diagnostics?: SemanticDiagnosticDTO[];
    stats?: {
        totalElements: number;
        resolvedElements: number;
        unresolvedElements: number;
        /** Actual ANTLR parse time (worker or lazy main-thread). */
        parseTimeMs: number;
        /** ANTLR lexer time in milliseconds. */
        lexTimeMs?: number;
        /** ANTLR parser-only time in milliseconds (excludes lexing). */
        parseOnlyTimeMs?: number;
        /** Whether the parse result was served from cache (no re-parse). */
        parseCached?: boolean;
        /** Time to build symbol table + extract DTOs for the requested scopes. */
        modelBuildTimeMs: number;
        /** Model Complexity Index report. */
        complexity?: {
            complexityIndex: number;
            rating: string;
            definitions: number;
            usages: number;
            maxDepth: number;
            avgChildrenPerDef: number;
            couplingCount: number;
            unusedDefinitions: number;
            documentationCoverage: number;
            hotspots: {
                /** null for an element without a qualified name (sysml-v2-lsp 0.33+). */
                qualifiedName: string | null;
                symbolId?: string;
                kind: string;
                childCount: number;
                depth: number;
                typeRefs: number;
                hasDoc: boolean;
                score: number;
            }[];
        };
    };
}

// ---------------------------------------------------------------------------
// Core Element Tree
// ---------------------------------------------------------------------------

export interface PositionDTO {
    line: number;
    character: number;
}

export interface RangeDTO {
    start: PositionDTO;
    end: PositionDTO;
}

export interface SysMLElementDTO {
    type: string;
    /** Empty for an anonymous element (sysml-v2-lsp 0.33+); show `displayName` instead. */
    name: string;
    /** Text to show: the name, or for an anonymous element e.g. `: Engine[2]` or `a.p→b.p` (sysml-v2-lsp 0.33+). */
    displayName?: string;
    /** Unique, reload-stable identifier (sysml-v2-lsp 0.33+); changes on rename. */
    symbolId?: string;
    range: RangeDTO;
    children: SysMLElementDTO[];
    attributes: Record<string, string | number | boolean>;
    relationships: RelationshipDTO[];
    errors?: string[];
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export interface RelationshipDTO {
    type: string;
    /** Empty for an anonymous source, or absent for shorthand satisfy/verify (sysml-v2-lsp 0.33+); see `sourceId`. */
    source?: string;
    /** `symbolId` of the source element when it declares the relationship (sysml-v2-lsp 0.33+). */
    sourceId?: string;
    /** `symbolId` of the element that is the relationship itself, e.g. a connection (sysml-v2-lsp 0.33+). */
    symbolId?: string;
    target: string;
    name?: string;
}

// ---------------------------------------------------------------------------
// Sequence Diagrams
// ---------------------------------------------------------------------------

export interface SequenceDiagramDTO {
    name: string;
    participants: ParticipantDTO[];
    messages: MessageDTO[];
    range: RangeDTO;
}

export interface ParticipantDTO {
    name: string;
    type: string;
    range: RangeDTO;
}

export interface MessageDTO {
    name: string;
    from: string;
    to: string;
    payload: string;
    occurrence: number;
    range: RangeDTO;
}

// ---------------------------------------------------------------------------
// Activity Diagrams
// ---------------------------------------------------------------------------

export interface ActivityDiagramDTO {
    name: string;
    actions: ActivityActionDTO[];
    decisions: DecisionNodeDTO[];
    flows: ControlFlowDTO[];
    states: ActivityStateDTO[];
    range: RangeDTO;
}

export interface ActivityActionDTO {
    name: string;
    type: string;
    kind?: string;
    inputs?: string[];
    outputs?: string[];
    condition?: string;
    subActions?: ActivityActionDTO[];
    isDefinition?: boolean;
    range?: RangeDTO;
    parent?: string;
    children?: string[];
}

export interface DecisionNodeDTO {
    name: string;
    condition: string;
    branches: { condition: string; target: string }[];
    range: RangeDTO;
}

export interface ControlFlowDTO {
    from: string;
    to: string;
    condition?: string;
    guard?: string;
    range: RangeDTO;
}

export interface ActivityStateDTO {
    name: string;
    type: 'initial' | 'final' | 'intermediate';
    entryActions?: string[];
    exitActions?: string[];
    doActivity?: string;
    range: RangeDTO;
}

// ---------------------------------------------------------------------------
// Resolved Types
// ---------------------------------------------------------------------------

export interface ResolvedTypeDTO {
    qualifiedName: string;
    simpleName: string;
    kind: string;
    isLibraryType: boolean;
    specializationChain: string[];
    specializes: string[];
    features: ResolvedFeatureDTO[];
}

export interface ResolvedFeatureDTO {
    name: string;
    kind: string;
    type?: string;
    multiplicity?: string;
    direction?: 'in' | 'out' | 'inout';
    visibility?: 'public' | 'private' | 'protected';
    isDerived: boolean;
    isReadonly: boolean;
}

// ---------------------------------------------------------------------------
// Semantic Diagnostics
// ---------------------------------------------------------------------------

export interface SemanticDiagnosticDTO {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    range: RangeDTO;
    elementName: string;
    relatedInfo?: {
        message: string;
        location?: RangeDTO;
    }[];
}
