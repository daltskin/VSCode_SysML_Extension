/**
 * Types for semantic resolver that matches user elements against standard library
 */

import * as vscode from 'vscode';

/**
 * Diagnostic severity levels for semantic errors
 */
export enum DiagnosticSeverity {
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
}

/**
 * Semantic diagnostic for type checking and validation errors
 */
export interface SemanticDiagnostic {
    /** Unique identifier for diagnostic type */
    code: string;
    /** Human-readable message */
    message: string;
    /** Severity level */
    severity: DiagnosticSeverity;
    /** Location in source document */
    range: vscode.Range;
    /** Element that triggered the diagnostic */
    elementName: string;
    /** Related context information */
    relatedInfo?: {
        message: string;
        location?: vscode.Range;
    }[];
}

/**
 * Resolved type information for an element
 */
export interface ResolvedType {
    /** Qualified name from library (e.g., "Base::Anything") */
    qualifiedName: string;
    /** Simple name */
    simpleName: string;
    /** Element kind (part def, state, action, etc.) */
    kind: string;
    /** Whether this is a standard library type */
    isLibraryType: boolean;
    /** Specialization chain (inheritance hierarchy) */
    specializationChain: string[];
    /** Immediate parent types */
    specializes: string[];
    /** Available features (attributes, ports, etc.) */
    features: ResolvedFeature[];
}

/**
 * Resolved feature (attribute, port, reference, etc.)
 */
export interface ResolvedFeature {
    /** Feature name */
    name: string;
    /** Feature kind (attribute, port, reference, etc.) */
    kind: string;
    /** Type of the feature */
    type?: string;
    /** Multiplicity (0..1, 1..*, etc.) */
    multiplicity?: string;
    /** Direction for ports (in, out, inout) */
    direction?: 'in' | 'out' | 'inout';
    /** Visibility (public, private, protected) */
    visibility?: 'public' | 'private' | 'protected';
    /** Whether this is derived */
    isDerived: boolean;
    /** Whether this is readonly */
    isReadonly: boolean;
}

/**
 * Validated connection information
 */
export interface ValidatedConnection {
    /** Source element name */
    source: string;
    /** Target element name */
    target: string;
    /** Connection type (binding, connection, flow, etc.) */
    type: string;
    /** Whether connection is semantically valid */
    isValid: boolean;
    /** Validation errors if invalid */
    errors: SemanticDiagnostic[];
}

/**
 * Enriched element with resolved semantic information
 */
export interface EnrichedElement {
    /** Original element name */
    name: string;
    /** Element type/kind */
    type: string;
    /** Source location */
    range: vscode.Range;
    /** Resolved type information (null if unresolved) */
    resolvedType: ResolvedType | null;
    /** Child elements */
    children: EnrichedElement[];
    /** Relationships */
    relationships: {
        type: string;
        target: string;
    }[];
    /** Semantic diagnostics for this element */
    diagnostics: SemanticDiagnostic[];
    /** Additional attributes from parser */
    attributes: Map<string, string | number | boolean>;
}

/**
 * Resolution result for entire document
 */
export interface ResolutionResult {
    /** Enriched elements with semantic information */
    elements: EnrichedElement[];
    /** All diagnostics found during resolution */
    diagnostics: SemanticDiagnostic[];
    /** Statistics about resolution */
    stats: {
        totalElements: number;
        resolvedElements: number;
        unresolvedElements: number;
        errorCount: number;
        warningCount: number;
    };
}
