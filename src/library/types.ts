/**
 * Type definitions for the compiled SysML v2 standard library
 */

/**
 * Represents a compiled library symbol with full semantic information
 */
export interface LibrarySymbol {
    /** Fully qualified name (e.g., "Base::Anything") */
    qualifiedName: string;

    /** Simple name */
    name: string;

    /** Package path */
    packagePath: string;

    /** Element kind */
    kind: 'package' | 'part' | 'part def' | 'action' | 'action def' | 'state' | 'state def' |
          'requirement' | 'requirement def' | 'constraint' | 'constraint def' | 'attribute' |
          'port' | 'interface' | 'connection' | 'allocation' | 'item' | 'item def' |
          'occurrence' | 'enumeration' | 'metadata' | 'comment' | 'doc';

    /** Source file path relative to library root */
    sourceFile: string;

    /** Line number in source file */
    line: number;

    /** Documentation string */
    documentation?: string;

    /** Specialization chain (parent types) */
    specializes: string[];

    /** Features (attributes, ports, etc.) */
    features: LibraryFeature[];

    /** Relationships */
    relationships: LibraryRelationship[];

    /** Constraints */
    constraints: string[];

    /** Stereotypes */
    stereotypes: string[];

    /** Multiplicity bounds */
    multiplicity?: {
        lower: number;
        upper: number | 'many';
    };

    /** For ports: direction */
    direction?: 'in' | 'out' | 'inout';

    /** For attributes: type */
    type?: string;

    /** For attributes: default value */
    defaultValue?: string;

    /** Is this abstract? */
    isAbstract: boolean;

    /** Visibility */
    visibility: 'public' | 'private' | 'protected';
}

/**
 * Feature within a library symbol
 */
export interface LibraryFeature {
    name: string;
    kind: 'attribute' | 'port' | 'reference' | 'action' | 'state';
    type?: string;
    multiplicity?: string;
    direction?: 'in' | 'out' | 'inout';
    defaultValue?: string;
    isComposite: boolean;
}

/**
 * Relationship between library symbols
 */
export interface LibraryRelationship {
    type: 'specialization' | 'composition' | 'aggregation' | 'dependency' |
          'satisfy' | 'verify' | 'allocation' | 'binding';
    source: string;
    target: string;
}

/**
 * Compiled library index
 */
export interface CompiledLibrary {
    /** Version identifier (git commit hash or timestamp) */
    version: string;

    /** Compilation timestamp */
    timestamp: number;

    /** All symbols by qualified name */
    symbols: Map<string, LibrarySymbol>;

    /** Quick lookup by simple name (may have collisions) */
    simpleNameIndex: Map<string, string[]>;

    /** Package hierarchy */
    packages: Map<string, string[]>; // package name -> child qualified names

    /** Specialization graph */
    specializationGraph: Map<string, Set<string>>; // type -> all subtypes

    /** Statistics */
    stats: {
        totalSymbols: number;
        byKind: Record<string, number>;
        totalFiles: number;
        totalPackages: number;
    };
}

/**
 * Serializable version of compiled library
 */
export interface SerializedLibrary {
    version: string;
    timestamp: number;
    symbols: [string, LibrarySymbol][];
    simpleNameIndex: [string, string[]][];
    packages: [string, string[]][];
    specializationGraph: [string, string[]][];
    stats: {
        totalSymbols: number;
        byKind: Record<string, number>;
        totalFiles: number;
        totalPackages: number;
    };
}
