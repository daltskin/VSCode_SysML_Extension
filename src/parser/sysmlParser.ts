import * as vscode from 'vscode';
import { LibraryService } from '../library/service';
import { EnrichedElement, ResolutionResult, SemanticResolver } from '../resolver';
import type { ANTLRSysMLParser } from './antlrSysMLParser';

// Debug flag - set to true for verbose logging
const DEBUG_ACTIVITY_PARSING = false;

export interface SysMLElement {
    type: string;
    name: string;
    range: vscode.Range;
    children: SysMLElement[];
    attributes: Map<string, string | number | boolean>;
    relationships: Relationship[];
    errors?: string[];
}

export interface Relationship {
    type: string;
    target: string;
    source: string;
    name?: string;
}

export interface SequenceDiagram {
    name: string;
    participants: Participant[];
    messages: Message[];
    range: vscode.Range;
}

export interface Participant {
    name: string;
    type: string;
    range: vscode.Range;
}

export interface Message {
    name: string;
    from: string;
    to: string;
    payload: string;
    occurrence: number;
    range: vscode.Range;
}

export interface ActivityDiagram {
    name: string;
    actions: ActivityAction[];
    decisions: DecisionNode[];
    flows: ControlFlow[];
    states: ActivityState[];
    range: vscode.Range;
}

export interface StructuralDiagram {
    name: string;
    title?: string;
    packages: StructuralPackage[];
    parts: StructuralPart[];
    connections: StructuralConnection[];
    requirements: StructuralRequirement[];
    attributes: StructuralAttribute[];
    interfaces: StructuralInterface[];
    relationships: StructuralRelationship[];
    actions: StructuralAction[];
    states: StructuralState[];
    constraints: StructuralConstraint[];
    actors: StructuralActor[];
    useCases: StructuralUseCase[];
    occurrences: StructuralOccurrence[];
    enumerations: StructuralEnumeration[];
    range: vscode.Range;
}

export interface StructuralPackage {
    name: string;
    type: 'package';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    children: (StructuralPart | StructuralRequirement | StructuralPackage)[];
    range: vscode.Range;
}

export interface StructuralPart {
    name: string;
    type: 'part' | 'part def' | 'item' | 'item def';
    partType?: string;
    multiplicity?: string;
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    attributes: StructuralAttribute[];
    ports: StructuralPort[];
    children: StructuralPart[];
    redefinitions: StructuralRedefinition[];
    range: vscode.Range;
}

export interface StructuralConnection {
    name: string;
    type: 'connection' | 'binding' | 'succession' | 'allocation';
    from: string;
    to: string;
    visibility: 'public' | 'private' | 'protected';
    range: vscode.Range;
}

export interface StructuralRequirement {
    name: string;
    type: 'requirement' | 'requirement def';
    requirementType?: string;
    text?: string;
    visibility: 'public' | 'private' | 'protected';
    satisfiedBy?: string[];
    range: vscode.Range;
}

export interface StructuralAttribute {
    name: string;
    type: 'attribute';
    dataType: string;
    defaultValue?: string;
    visibility: 'public' | 'private' | 'protected';
    range: vscode.Range;
}

export interface StructuralInterface {
    name: string;
    type: 'interface' | 'interface def';
    ports: StructuralPort[];
    visibility: 'public' | 'private' | 'protected';
    range: vscode.Range;
}

export interface StructuralPort {
    name: string;
    type: 'port';
    direction: 'in' | 'out' | 'inout';
    portType?: string;
    visibility: 'public' | 'private' | 'protected';
    range: vscode.Range;
}

export interface StructuralRelationship {
    type: 'specialization' | 'composition' | 'aggregation' | 'dependency' | 'satisfy' | 'verify';
    from: string;
    to: string;
    label?: string;
    range: vscode.Range;
}

export interface StructuralAction {
    name: string;
    type: 'action' | 'action def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    inputs?: StructuralParameter[];
    outputs?: StructuralParameter[];
    subActions?: StructuralAction[];
    controlFlow?: StructuralControlFlow[];
    range: vscode.Range;
}

export interface StructuralState {
    name: string;
    type: 'state' | 'state def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    substates?: StructuralState[];
    transitions?: StructuralTransition[];
    entryAction?: string;
    exitAction?: string;
    doActivity?: string;
    range: vscode.Range;
}

export interface StructuralConstraint {
    name: string;
    type: 'constraint' | 'constraint def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    expression: string;
    appliesTo?: string[];
    range: vscode.Range;
}

export interface StructuralActor {
    name: string;
    type: 'actor' | 'actor def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    attributes: StructuralAttribute[];
    actions: StructuralAction[];
    range: vscode.Range;
}

export interface StructuralUseCase {
    name: string;
    type: 'use case' | 'use case def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    actors: string[];
    subject: string;
    objective?: string;
    includes?: string[];
    extends?: string[];
    range: vscode.Range;
}

export interface StructuralOccurrence {
    name: string;
    type: 'occurrence' | 'occurrence def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    occurrenceType?: string;
    range: vscode.Range;
}

export interface StructuralEnumeration {
    name: string;
    type: 'enumeration' | 'enumeration def';
    visibility: 'public' | 'private' | 'protected';
    documentation?: string;
    literals: StructuralEnumerationLiteral[];
    range: vscode.Range;
}

export interface StructuralRedefinition {
    name: string;
    redefinedElement: string;
    newValue?: string;
    range: vscode.Range;
}

export interface StructuralParameter {
    name: string;
    direction: 'in' | 'out' | 'inout';
    parameterType: string;
    defaultValue?: string;
    range: vscode.Range;
}

export interface StructuralControlFlow {
    type: 'sequence' | 'parallel' | 'decision' | 'merge' | 'loop';
    from: string;
    to: string;
    condition?: string;
    range: vscode.Range;
}

export interface StructuralTransition {
    name?: string;
    from: string;
    to: string;
    trigger?: string;
    guard?: string;
    effect?: string;
    range: vscode.Range;
}

export interface StructuralEnumerationLiteral {
    name: string;
    value?: string;
    range: vscode.Range;
}

export interface ActivityAction {
    name: string;
    type: 'action' | 'start' | 'end' | 'fork' | 'join' | 'composite' | 'initial' | 'final' | 'merge' | 'decision';
    kind?: string;  // Additional kind descriptor (e.g., 'initial', 'final', 'merge', 'decision')
    inputs?: string[];
    outputs?: string[];
    condition?: string;
    subActions?: ActivityAction[];  // For composite actions
    isDefinition?: boolean;         // action def vs action usage
    range?: vscode.Range;
}

export interface DecisionNode {
    name: string;
    condition: string;
    branches: {
        condition: string;
        target: string;
    }[];
    range: vscode.Range;
}

export interface ControlFlow {
    from: string;
    to: string;
    condition?: string;
    guard?: string;
    range: vscode.Range;
}

export interface ActivityState {
    name: string;
    type: 'initial' | 'final' | 'intermediate';
    entryActions?: string[];
    exitActions?: string[];
    doActivity?: string;
    range: vscode.Range;
}

/**
 * Parser for SysML v2.0 documents that extracts elements and their relationships.
 * Powered by pure ANTLR4 parsing with semantic resolution.
 */
export class SysMLParser {
    private elements: Map<string, SysMLElement> = new Map();
    private relationships: Relationship[] = [];
    private antlrParser: ANTLRSysMLParser | false | null = null; // Lazy loaded to avoid circular imports
    private semanticResolver: SemanticResolver | null = null; // Semantic resolver for type checking

    // Parse cache to avoid reparsing unchanged documents
    private parseCache: Map<string, { hash: number; elements: SysMLElement[]; relationships: Relationship[] }> = new Map();
    private resolutionCache: Map<string, { hash: number; result: ResolutionResult }> = new Map();

    /**
     * Simple string hash function for content comparison
     */
    private hashContent(content: string): number {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Gets the ANTLR parser instance, creating it on first use.
     */
    private getANTLRParser() {
        if (!this.antlrParser) {
            try {
                // console.log('Loading ANTLR SysML parser...');
                const { ANTLRSysMLParser } = require('./antlrSysMLParser');
                this.antlrParser = new ANTLRSysMLParser();
                // console.log('ANTLR SysML parser loaded successfully');
            } catch (error) {
                console.error('ANTLR parser not available:', error);
                this.antlrParser = false; // Mark as unavailable
            }
        }
        return this.antlrParser;
    }

    /**
     * Gets the semantic resolver instance, creating it on first use.
     */
    private getSemanticResolver(): SemanticResolver {
        if (!this.semanticResolver) {
            const libraryService = LibraryService.getInstance();
            this.semanticResolver = new SemanticResolver(libraryService);
        }
        return this.semanticResolver;
    }

    /**
     * Parses a SysML document and extracts all elements in a hierarchical structure.
     * Primary method for language features (navigation, validation, model explorer).
     * Phase 2: Pure ANTLR parsing - no regex fallback. Errors surface as diagnostics.
     * Uses content-based caching to avoid expensive reparsing of unchanged documents.
     * @param document The VS Code text document to parse
     * @returns Array of root-level SysML elements
     */
    parse(document: vscode.TextDocument): SysMLElement[] {
        try {
            const uri = document.uri.toString();
            const content = document.getText();
            const contentHash = this.hashContent(content);

            // Check cache first - avoid expensive ANTLR parsing if content unchanged
            const cached = this.parseCache.get(uri);
            if (cached && cached.hash === contentHash) {
                // Restore cached state
                this.elements.clear();
                this.updateElementCache(cached.elements);
                this.relationships = cached.relationships;
                return cached.elements;
            }

            this.elements.clear();
            this.relationships = [];

            // Phase 2: Pure ANTLR parsing only
            const antlr = this.getANTLRParser();
            if (!antlr) {
                const message = 'ANTLR parser unavailable - cannot parse document';
                try {
                    const { getOutputChannel } = require('../extension');
                    getOutputChannel()?.appendLine(message);
                } catch {
                    // Silently fail if output channel not available
                }
                return []; // Return empty array if ANTLR unavailable
            }

            // Parse with ANTLR - include errors for diagnostics
            const elements = antlr.parseDocument(document, false); // Exclude error elements for cleaner output

            // Update internal state
            this.updateElementCache(elements);
            this.relationships = antlr.getRelationships();

            // Cache the result
            this.parseCache.set(uri, {
                hash: contentHash,
                elements: elements,
                relationships: [...this.relationships]
            });

            // Log parse errors for diagnostics if any
            const errorElements = elements.filter(el => el.type === 'error');
            if (errorElements.length > 0) {
                const message = `ANTLR parsing produced ${errorElements.length} error elements`;
                try {
                    const { getOutputChannel } = require('../extension');
                    getOutputChannel()?.appendLine(message);
                } catch {
                    // Silently fail
                }
            }

            return elements;
        } catch (error) {
            // Use proper logging instead of console.error
            const message = `Error parsing SysML document: ${error instanceof Error ? error.message : 'Unknown error'}`;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(message);
            } catch {
                // Silently fail if output channel not available
            }
            // Return empty array to prevent crashes
            return [];
        }
    }

    /**
     * Parses a SysML document specifically for visualization purposes.
     * Uses ANTLR parsing only.
     * @param document The VS Code text document to parse
     * @returns Array of root-level SysML elements optimized for visualization
     */
    parseForVisualization(document: vscode.TextDocument): SysMLElement[] {
        try {
            this.elements.clear();
            this.relationships = [];

            // Always use ANTLR parser
            const antlr = this.getANTLRParser();
            if (!antlr) {
                return [];
            }

            const elements = antlr.parseDocument(document, false);
            this.relationships = antlr.getRelationships();

            // Enhance all elements with library information
            const enhancedElements = this.enhanceWithLibraryInfo(elements);
            this.updateElementCache(enhancedElements);
            return enhancedElements;
        } catch {
            return [];
        }
    }

    /**
     * Update element cache helper method
     */
    private updateElementCache(elements: SysMLElement[]): void {
        this.addElementsToMap(elements, this.elements);
    }

    /**
     * Parse document including error elements for validation
     * Phase 2: Pure ANTLR only
     */
    parseWithErrors(document: vscode.TextDocument): SysMLElement[] {
        try {
            this.elements.clear();
            this.relationships = [];

            const antlr = this.getANTLRParser();
            if (!antlr) {
                const message = 'ANTLR parser unavailable for error parsing';
                try {
                    const { getOutputChannel } = require('../extension');
                    getOutputChannel()?.appendLine(message);
                } catch {
                    // Silently fail
                }
                return [];
            }

            // For validation, include all elements including errors
            const allElements = antlr.parseDocument(document, true);

            // Update internal state
            this.addElementsToMap(allElements, this.elements);
            this.relationships = antlr.getRelationships();

            return allElements;
        } catch (error) {
            const message = `Error parsing SysML document for validation: ${error instanceof Error ? error.message : 'Unknown error'}`;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(message);
            } catch {
                // Silently fail if output channel not available
            }
            return [];
        }
    }

    /**
     * Phase 3: Parse and resolve document with semantic validation
     * Returns enriched elements with type information from standard library
     * Uses caching to avoid expensive re-resolution of unchanged documents.
     * @param document The VS Code text document to parse
     * @returns Resolution result with enriched elements and diagnostics
     */
    async parseWithSemanticResolution(document: vscode.TextDocument): Promise<ResolutionResult> {
        try {
            const uri = document.uri.toString();
            const content = document.getText();
            const contentHash = this.hashContent(content);

            // Check resolution cache first
            const cached = this.resolutionCache.get(uri);
            if (cached && cached.hash === contentHash) {
                return cached.result;
            }

            // First parse with ANTLR (this also uses caching)
            const elements = this.parse(document);

            // Then resolve types and validate against library
            const resolver = this.getSemanticResolver();
            const result = await resolver.resolve(elements, document.uri);

            // Cache the resolution result
            this.resolutionCache.set(uri, {
                hash: contentHash,
                result: result
            });

            // Log resolution statistics
            const message = `Semantic resolution: ${result.stats.totalElements} elements, ` +
                           `${result.stats.resolvedElements} resolved, ` +
                           `${result.stats.errorCount} errors, ` +
                           `${result.stats.warningCount} warnings`;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(message);
            } catch {
                // Silently fail if output channel not available
            }

            return result;
        } catch (error) {
            const message = `Error during semantic resolution: ${error instanceof Error ? error.message : 'Unknown error'}`;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(message);
            } catch {
                // Silently fail
            }

            // Return empty result on error
            return {
                elements: [],
                diagnostics: [],
                stats: {
                    totalElements: 0,
                    resolvedElements: 0,
                    unresolvedElements: 0,
                    errorCount: 0,
                    warningCount: 0
                }
            };
        }
    }

    /**
     * Convert enriched elements back to SysML elements for compatibility
     * This bridges Phase 3 resolver output to existing visualization consumers
     */
    convertEnrichedToSysMLElements(enriched: EnrichedElement[]): SysMLElement[] {
        return enriched.map(element => {
            // Debug: Check if enriched element has doc
            if (element.attributes && element.attributes.has('doc')) {
                // console.log(`[CONVERT] ${element.name} (${element.type}) has doc in enriched: ${element.attributes.get('doc')?.toString().substring(0, 50)}...`);
            }

            // Convert relationships to include source
            const relationships: Relationship[] = element.relationships.map(rel => ({
                type: rel.type,
                target: rel.target,
                source: element.name
            }));

            // Build attributes map with resolved type info
            const attributes = new Map(element.attributes);
            if (element.resolvedType) {
                attributes.set('resolvedType', element.resolvedType.qualifiedName);
                attributes.set('typeKind', element.resolvedType.kind);
                attributes.set('isLibraryType', element.resolvedType.isLibraryType);
            }

            // Debug: Verify doc was copied to new map
            if (attributes.has('doc')) {
                // console.log(`[CONVERT] ${element.name}: doc preserved in output attributes`);
            }

            return {
                type: element.type,
                name: element.name,
                range: element.range,
                children: this.convertEnrichedToSysMLElements(element.children),
                attributes,
                relationships
            };
        });
    }

    private parseLine(line: string, lineNumber: number, document: vscode.TextDocument): SysMLElement | null {
        // Special handling for participants with type annotations
        const participantMatch = line.match(/^\s*participant\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)/i);
        if (participantMatch) {
            const name = participantMatch[1];
            const type = participantMatch[2];

            const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
            const element: SysMLElement = {
                type: 'participant',
                name: name,
                range: range,
                children: [],
                attributes: new Map([['participantType', type]]),
                relationships: []
            };

            this.elements.set(name, element);
            return element;
        }

        // Special handling for messages with SendMessage pattern
        const messageMatch = line.match(/^\s*message\s+([a-zA-Z0-9_]+)\s*:\s*SendMessage\s+from\s+([a-zA-Z0-9_]+)\s+to\s+([a-zA-Z0-9_]+)/i);
        if (messageMatch) {
            const name = messageMatch[1];
            const from = messageMatch[2];
            const to = messageMatch[3];

            const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
            const element: SysMLElement = {
                type: 'message',
                name: name,
                range: range,
                children: [],
                attributes: new Map([['from', from], ['to', to], ['fullLine', line]]),
                relationships: []
            };

            this.elements.set(name, element);
            return element;
        }

        const elementTypes = [
            'package', 'part', 'port', 'action', 'state', 'requirement',
            'use case', 'constraint', 'attribute', 'reference', 'connection',
            'interface', 'allocation', 'item', 'actor', 'concern', 'analysis',
            'verification', 'view', 'viewpoint', 'enum', 'datatype', 'assoc',
            'metadata', 'comment', 'doc', 'calc', 'interaction', 'participant',
            'message', 'payload', 'occurrence', 'alt', 'else'
        ];

        for (const type of elementTypes) {
            const regex = new RegExp(`^\\s*(abstract\\s+|private\\s+|public\\s+|protected\\s+)?(${type})\\s+(def\\s+)?([a-zA-Z0-9_]+)`, 'i');
            const match = line.match(regex);



            if (match) {
                const name = match[4];
                const errors: string[] = [];

                // Validate element name
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
                    errors.push(`Invalid element name: ${name}`);
                }

                // Validate line number within document bounds
                const maxLine = document.lineCount - 1;
                const validLineNumber = Math.min(lineNumber, maxLine);
                const range = new vscode.Range(
                    validLineNumber, 0,
                    validLineNumber, line.length
                );

                const element: SysMLElement = {
                    type: type,
                    name: name,
                    range: range,
                    children: [],
                    attributes: new Map(),
                    relationships: [],
                    errors: errors
                };

                this.parseRelationships(line, element);

                return element;
            }
        }

        return null;
    }

    private parseRelationships(line: string, element: SysMLElement): void {
        const relationshipPatterns = [
            { type: 'specializes', pattern: /:>\s*([a-zA-Z_][a-zA-Z0-9_]*)/ },
            { type: 'subsets', pattern: /subsets\s+([a-zA-Z_][a-zA-Z0-9_]*)/ },
            { type: 'redefines', pattern: /redefines\s+([a-zA-Z_][a-zA-Z0-9_]*)/ },
            { type: 'references', pattern: /references\s+([a-zA-Z_][a-zA-Z0-9_]*)/ },
            { type: 'binds', pattern: /binds\s+([a-zA-Z_][a-zA-Z0-9_]*)/ }
        ];

        for (const pattern of relationshipPatterns) {
            const match = line.match(pattern.pattern);
            if (match) {
                const relationship: Relationship = {
                    type: pattern.type,
                    source: element.name,
                    target: match[1]
                };
                element.relationships.push(relationship);
                this.relationships.push(relationship);
            }
        }
    }

    /**
     * Gets all parsed elements as a map keyed by element name.
     * @returns Map of element names to SysML elements
     */
    getElements(): Map<string, SysMLElement> {
        return this.elements;
    }

    /**
     * Gets all discovered relationships between elements.
     * @returns Array of relationships found in the parsed document
     */
    getRelationships(): Relationship[] {
        return this.relationships;
    }

    /**
     * Extracts sequence diagram data from parsed elements.
     * Uses ANTLR parser for accurate sequence diagram extraction.
     * Falls back to legacy regex-based extraction if ANTLR is unavailable.
     * @param document The document to extract sequence diagrams from (optional, uses internal elements if not provided)
     * @returns Array of interaction elements with their participants and messages
     */
    getSequenceDiagrams(): SequenceDiagram[] {
        // Use legacy regex-based extraction for sequence diagrams
        return this.extractSequenceDiagramsLegacy();
    }

    /**
     * Legacy sequence diagram extraction using regex-based heuristics.
     * Used as fallback when ANTLR parsing is unavailable.
     */
    private extractSequenceDiagramsLegacy(): SequenceDiagram[] {
        const interactions = Array.from(this.elements.values()).filter(
            element => element.type === 'interaction'
        );

        // Also extract action/behavior sequences as sequence diagrams
        const sequentialSources = Array.from(this.elements.values()).filter(
            element => this.isSequentialBehaviorElement(element)
        );

        const allDiagrams = [...interactions, ...sequentialSources];

        return allDiagrams.map(diagram => {
            const participants: Participant[] = [];
            const messages: Message[] = [];

            if (this.isSequentialBehaviorElement(diagram)) {
                // Extract sequential flow from action/behavior elements
                this.extractActionSequence(diagram, participants, messages);
            } else {
                // Extract participants and messages from interaction children
                this.extractSequenceElements(diagram, participants, messages);
            }

            return {
                name: diagram.name,
                participants: participants,
                messages: messages.sort((a, b) => a.occurrence - b.occurrence), // Sort by timing
                range: diagram.range
            };
        });
    }

    private extractSequenceElements(element: SysMLElement, participants: Participant[], messages: Message[]): void {
        // Process direct children
        for (const child of element.children) {
            if (child.type === 'participant') {
                participants.push({
                    name: child.name,
                    type: this.extractParticipantType(child),
                    range: child.range
                });
            } else if (child.type === 'message') {
                const messageData = this.parseMessageElement(child);
                if (messageData) {
                    messages.push(messageData);
                }
            }

            // Recursively process nested elements
            this.extractSequenceElements(child, participants, messages);
        }
    }

    private extractParticipantType(participant: SysMLElement): string {
        // Look for participantType attribute (set by enhanced parsing)
        for (const [key, value] of participant.attributes) {
            if (key === 'participantType' && typeof value === 'string') {
                return value;
            }
            if (key === 'type' && typeof value === 'string') {
                return value;
            }
        }

        // Look for type in participant name pattern like "participant user : User"
        const participantName = participant.name || '';
        const typeMatch = participantName.match(/:\s*(\w+)/);
        if (typeMatch) {
            return typeMatch[1];
        }

        // Look for type in children
        for (const child of participant.children) {
            if (child.type && child.type !== 'participant') {
                return child.type;
            }
        }

        return 'Actor'; // Default type
    }

    private parseMessageElement(message: SysMLElement): Message | null {
        // Extract message details from the element's attributes and children
        let from = '';
        let to = '';
        let payload = '';
        let occurrence = 0;

        // First, try to get from/to from attributes (set by enhanced parsing)
        for (const [key, value] of message.attributes) {
            if (key === 'from' && typeof value === 'string') {
                from = value;
            }
            if (key === 'to' && typeof value === 'string') {
                to = value;
            }
        }

        // If not in attributes, try to parse from the message name or children
        if (!from || !to) {
            const messageName = message.name || '';
            const sendMessageMatch = messageName.match(/SendMessage\s+from\s+(\w+)\s+to\s+(\w+)/);
            if (sendMessageMatch) {
                from = sendMessageMatch[1];
                to = sendMessageMatch[2];
            }
        }

        // Look for payload and timing in children
        for (const child of message.children) {
            const childText = child.name || '';

            // Parse "SendMessage from X to Y" pattern from children if not found yet
            if (!from || !to) {
                const childSendMessageMatch = childText.match(/SendMessage\s+from\s+(\w+)\s+to\s+(\w+)/);
                if (childSendMessageMatch) {
                    from = childSendMessageMatch[1];
                    to = childSendMessageMatch[2];
                }
            }

            // Look for payload - extract quoted content
            if (child.type === 'payload' || childText.includes('payload')) {
                const payloadMatch = childText.match(/payload\s*["']([^"']+)["']/);
                if (payloadMatch) {
                    payload = payloadMatch[1];
                } else {
                    // Fallback: extract text after payload keyword
                    const cleanText = childText.replace(/.*payload\s*/, '').replace(/[;"'\s]*$/, '').replace(/^[;"'\s]*/, '');
                    if (cleanText) {
                        payload = cleanText;
                    }
                }
            }

            // Look for occurrence timing - handle [s] notation
            if (child.type === 'occurrence' || childText.includes('occurrence')) {
                const timeMatch = childText.match(/(\d+(?:\.\d+)?)\s*\[s\]/);
                if (timeMatch) {
                    occurrence = parseFloat(timeMatch[1]);
                }
            }
        }

        if (from && to) {
            return {
                name: message.name,
                from: from,
                to: to,
                payload: payload || message.name,
                occurrence: occurrence,
                range: message.range
            };
        }

        return null;
    }

    /**
     * Extracts activity diagrams from the SysML model.
     * @param document The VS Code text document to extract from
     * @returns Array of activity diagrams found in the model
     */
    getActivityDiagrams(document: vscode.TextDocument): ActivityDiagram[] {
        // Use parseForVisualization method for consistent and flexible parsing
        const elements = this.parseForVisualization(document);

        // Extract activity diagrams from parsed elements
        const diagrams = this.extractActivityDiagramsFromElements(elements, document);

        if (diagrams.length === 0) {
            // If no diagrams found from elements, try direct regex extraction as fallback
            // console.log('No activity diagrams found in parsed elements, trying direct regex extraction');
            const fallbackDiagrams = this.extractActivityElements(document);
            // console.log(`Direct regex found ${fallbackDiagrams.length} activity diagrams`);
            return fallbackDiagrams;
        }

        return diagrams;
    }

    /**
     * Extract activity diagrams from parsed elements (used by hybrid approach)
     */
    private extractActivityDiagramsFromElements(elements: SysMLElement[], document: vscode.TextDocument): ActivityDiagram[] {
        const diagrams: ActivityDiagram[] = [];
        const content = document.getText();

        // Track swimlane assignments from part elements with perform statements
        // Map of actionName -> partName (lane)
        const swimlaneAssignments = new Map<string, string>();

        // First pass: collect swimlane assignments from parts with perform statements
        const collectSwimlanesFromParts = (element: SysMLElement, _parentPartName?: string) => {
            const isPartType = element.type === 'part' || element.type === 'part def';

            if (isPartType && element.range) {
                const startOffset = document.offsetAt(element.range.start);
                const endOffset = document.offsetAt(element.range.end);
                const elementText = content.substring(startOffset, endOffset);
                const partName = element.name;

                // Look for perform statements in this part
                // Pattern: perform actionPath.actionName or perform action actionName
                const performPattern = /perform\s+(?:action\s+)?([a-zA-Z_][\w.]*)/g;
                let performMatch;
                while ((performMatch = performPattern.exec(elementText)) !== null) {
                    const performedAction = performMatch[1];
                    // Extract just the action name (last part after dot)
                    const actionName = performedAction.includes('.')
                        ? performedAction.split('.').pop()!
                        : performedAction;

                    if (actionName && partName) {
                        swimlaneAssignments.set(actionName, partName);
                        // console.log(`[Swimlane] Action '${actionName}' assigned to lane '${partName}'`);
                    }
                }
            }

            // Recursively check children
            if (element.children) {
                element.children.forEach(child => collectSwimlanesFromParts(child, element.name));
            }
        };

        // Collect swimlane assignments first
        elements.forEach(el => collectSwimlanesFromParts(el));
        // console.log(`[Swimlane] Total swimlane assignments: ${swimlaneAssignments.size}`);

        const extractFromElement = (element: SysMLElement) => {
            // Check for action or action def elements with children
            // Include 'definition' type as ANTLR may categorize some action definitions this way
            const isActionType = element.type === 'action' ||
                                element.type === 'action def' ||
                                element.type === 'action definition' ||
                                element.type === 'definition';

            if (isActionType && element.range) {
                // Get the element body from the document
                const startOffset = document.offsetAt(element.range.start);
                const endOffset = document.offsetAt(element.range.end);
                const elementText = content.substring(startOffset, endOffset);

                // Find the opening brace and extract the body
                const braceIndex = elementText.indexOf('{');
                if (braceIndex !== -1) {
                    const body = elementText.substring(braceIndex + 1, elementText.lastIndexOf('}'));
                    const bodyStartOffset = startOffset + braceIndex + 1;

                    // Parse activity body for flows and nodes
                    const { actions, flows, decisions, states } = this.parseActivityBody(body, document, bodyStartOffset);

                    // console.log(`[extractActivityDiagramsFromElements] Element '${element.name}' parsed: actions=${actions.length}, flows=${flows.length}, decisions=${decisions.length}, states=${states.length}`);

                    // Apply swimlane assignments to actions
                    actions.forEach(action => {
                        const lane = swimlaneAssignments.get(action.name);
                        if (lane) {
                            (action as any).lane = lane;
                            // console.log(`[Swimlane] Applied lane '${lane}' to action '${action.name}'`);
                        }
                    });

                    // Include if has any activity content
                    const hasActivity = actions.length > 0 || flows.length > 0 || decisions.length > 0 || states.length > 0 ||
                                      body.includes('first') || body.includes('then') || body.includes('done');

                    if (hasActivity) {
                        diagrams.push({
                            name: element.name,
                            range: element.range,
                            actions,
                            flows,
                            decisions,
                            states
                        });
                    }
                }
            }

            // Recursively check children
            if (element.children) {
                element.children.forEach(extractFromElement);
            }
        };

        elements.forEach(extractFromElement);
        return diagrams;
    }

    /**
     * Extracts activity elements using proper brace matching for nested structures.
     * @param document The VS Code text document to extract from
     * @returns Array of activity diagrams
     */
    private extractActivityElements(document: vscode.TextDocument): ActivityDiagram[] {
        const activities: ActivityDiagram[] = [];
        const content = document.getText();

        // console.log('Content length:', content.length);
        // console.log('Looking for action patterns...');

        // First, extract swimlane assignments from part elements with perform statements
        const swimlaneAssignments = new Map<string, string>();

        // Pattern: part partName : PartType { ... perform actionPath.actionName ... }
        const partPattern = /part\s+(\w+)\s*(?::\s*\w+)?\s*\{/gi;
        let partMatch;
        while ((partMatch = partPattern.exec(content)) !== null) {
            const partName = partMatch[1];
            const partBodyStart = partMatch.index + partMatch[0].length;
            const partBody = this.extractBalancedBraces(content, partBodyStart - 1);

            if (partBody) {
                // Look for perform statements in this part
                const performPattern = /perform\s+(?:action\s+)?([a-zA-Z_][\w.]*)/g;
                let performMatch;
                while ((performMatch = performPattern.exec(partBody)) !== null) {
                    const performedAction = performMatch[1];
                    // Extract just the action name (last part after dot)
                    const actionName = performedAction.includes('.')
                        ? performedAction.split('.').pop()!
                        : performedAction;

                    if (actionName && partName) {
                        swimlaneAssignments.set(actionName, partName);
                        // console.log(`[Swimlane Fallback] Action '${actionName}' assigned to lane '${partName}'`);
                    }
                }
            }
        }
        // console.log(`[Swimlane Fallback] Total swimlane assignments: ${swimlaneAssignments.size}`);

        // Patterns to match both action definitions (action def) and action usages (action)
        const actionDefPattern = /action\s+def\s+(\w+)(?:\s*:\s*([^{]+))?\s*\{/gi;
        const actionUsagePattern = /action\s+(\w+)(?:\s*:\s*([^{]+))?\s*\{/gi;

        // console.log('Looking for action def patterns (main activities)...');

        let match;

        // First, find action definitions
        while ((match = actionDefPattern.exec(content)) !== null) {
            const [, name] = match;
            const actionStart = match.index;
            const bodyStart = match.index + match[0].length;

            // console.log(`Found action ${matchCount}: '${name}' at position ${actionStart}`);

            // Find matching closing brace using proper brace counting
            const body = this.extractBalancedBraces(content, bodyStart - 1);
            if (!body) {
                // console.log(`Skipping action '${name}' - no balanced braces found`);
                continue;
            }

            // console.log(`Action '${name}' body length: ${body.length}`);
            // console.log(`Action '${name}' body preview: ${body.slice(0, 100)}...`);

            const actionEnd = bodyStart + body.length + 1; // +1 for the closing brace
            const startPos = document.positionAt(actionStart);
            const endPos = document.positionAt(actionEnd);

            // Parse activity body for flows and nodes
            const { actions, flows, decisions, states } = this.parseActivityBody(body, document, bodyStart);

            // Apply swimlane assignments to actions
            actions.forEach(action => {
                const lane = swimlaneAssignments.get(action.name);
                if (lane) {
                    (action as any).lane = lane;
                    // console.log(`[Swimlane Fallback] Applied lane '${lane}' to action '${action.name}'`);
                }
            });

            // console.log(`Action '${name}' elements: actions=${actions.length}, flows=${flows.length}, decisions=${decisions.length}, states=${states.length}`);

            // More lenient criteria for activity diagrams
            const hasActivity = actions.length > 0 || flows.length > 0 || decisions.length > 0 || states.length > 0 ||
                              body.includes('first') || body.includes('then') || body.includes('done') ||
                              body.includes('if ') || body.includes('while ') || body.includes('action ');

            if (hasActivity) {
                activities.push({
                    name: name,
                    actions,
                    flows,
                    decisions,
                    states,
                    range: new vscode.Range(startPos, endPos)
                });
                // console.log(`✓ Added activity diagram: ${name}`);
            } else {
                // console.log(`✗ Skipped action '${name}' - no activity characteristics`);
            }
        }

        // console.log('Looking for action usage patterns...');

        // Reset regex for action usages
        actionUsagePattern.lastIndex = 0;

        // Now find action usages (but avoid duplicating action defs)
        while ((match = actionUsagePattern.exec(content)) !== null) {
            const [fullMatch, name] = match;

            // Skip if this is actually an action def (already processed)
            if (fullMatch.includes('action def')) {
                continue;
            }

            const actionStart = match.index;
            const bodyStart = match.index + match[0].length;

            // console.log(`Found action usage ${matchCount}: '${name}' at position ${actionStart}`);

            // Find matching closing brace using proper brace counting
            const body = this.extractBalancedBraces(content, bodyStart - 1);
            if (!body) {
                // console.log(`Skipping action '${name}' - no balanced braces found`);
                continue;
            }

            // console.log(`Action '${name}' body length: ${body.length}`);
            // console.log(`Action '${name}' body preview: ${body.slice(0, 100)}...`);

            const actionEnd = bodyStart + body.length + 1; // +1 for the closing brace
            const startPos = document.positionAt(actionStart);
            const endPos = document.positionAt(actionEnd);

            // Parse activity body for flows and nodes
            const { actions, flows, decisions, states } = this.parseActivityBody(body, document, bodyStart);

            // Apply swimlane assignments to actions
            actions.forEach(action => {
                const lane = swimlaneAssignments.get(action.name);
                if (lane) {
                    (action as any).lane = lane;
                    // console.log(`[Swimlane Fallback] Applied lane '${lane}' to action '${action.name}'`);
                }
            });

            // console.log(`Action '${name}' elements: actions=${actions.length}, flows=${flows.length}, decisions=${decisions.length}, states=${states.length}`);

            // Stricter criteria for activity diagrams - must have real activity content
            const hasActivity = actions.length > 0 || flows.length > 0 || decisions.length > 0 || states.length > 0 ||
                              /\d+\.\s/.test(body) || // numbered steps like "1. Start process"
                              body.includes('then ') || body.includes('next ') || // explicit flow keywords
                              body.includes('if (') || body.includes('while (') || // control structures
                              body.includes('first ') || body.includes('done');

            if (hasActivity) {
                activities.push({
                    name: name, // No suffix for usage
                    actions,
                    flows,
                    decisions,
                    states,
                    range: new vscode.Range(startPos, endPos)
                });
                // console.log(`✓ Added activity diagram: ${name}`);
            } else {
                // console.log(`✗ Skipped action '${name}' - no activity characteristics`);
            }
        }

        // console.log(`Total actions processed: ${matchCount}`);
        // console.log(`Total activity diagrams found: ${activities.length}`);
        return activities;
    }

    /**
     * Extracts balanced braces content from the given position.
     * @param content The full text content
     * @param startPos The position of the opening brace
     * @returns The content between matching braces, or null if unmatched
     */
    private extractBalancedBraces(content: string, startPos: number): string | null {
        if (content[startPos] !== '{') return null;

        let braceCount = 1;
        let i = startPos + 1;

        while (i < content.length && braceCount > 0) {
            const char = content[i];
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
            }
            // Skip string literals to avoid counting braces within strings
            else if (char === '"' || char === "'") {
                const quote = char;
                i++; // Skip opening quote
                while (i < content.length && content[i] !== quote) {
                    if (content[i] === '\\') i++; // Skip escaped characters
                    i++;
                }
            }
            i++;
        }

        if (braceCount === 0) {
            return content.slice(startPos + 1, i - 1);
        }

        return null;
    }

    /**
     * Parses the body of an action to extract activity elements.
     * @param body The action body text to parse
     * @param document The VS Code text document for position calculation
     * @param baseOffset The offset where the body starts
     */
    private parseActivityBody(body: string, document: vscode.TextDocument, baseOffset: number): {
        actions: ActivityAction[],
        flows: ControlFlow[],
        decisions: DecisionNode[],
        states: ActivityState[]
    } {
        const actions: ActivityAction[] = [];
        const flows: ControlFlow[] = [];
        const decisions: DecisionNode[] = [];
        const states: ActivityState[] = [];
        const mergeNodes: Set<string> = new Set();

        if (DEBUG_ACTIVITY_PARSING) console.log('Parsing activity body (enhanced SysML v2 parsing)...');
        if (DEBUG_ACTIVITY_PARSING) console.log('Body preview:', body.substring(0, 200));

        // Track all declared actions and nodes for flow resolution
        const declaredNodes: Map<string, { type: string, range?: vscode.Range }> = new Map();

        // First pass: Extract all action declarations (including quoted names)
        // Updated pattern to handle multi-line action bodies: action name { or action name;
        const actionDeclPattern = /(?:^|\n)\s*(?:then\s+)?action\s+(?:'([^']+)'|(\w+))(?:\s*:\s*[^{;\n]*)?(?:\s*[{;])?/gm;
        let match;
        while ((match = actionDeclPattern.exec(body)) !== null) {
            const actionName = match[1] || match[2]; // quoted name or regular name
            if (actionName && actionName !== 'def' && !declaredNodes.has(actionName)) {
                const startPos = document.positionAt(baseOffset + match.index);
                const endPos = document.positionAt(baseOffset + match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                declaredNodes.set(actionName, { type: 'action', range });
                actions.push({
                    name: actionName,
                    type: 'action',
                    range,
                    isDefinition: false
                });
                if (DEBUG_ACTIVITY_PARSING) console.log(`  → Found action declaration: "${actionName}"`);
            }
        }

        // Second pass: Find control flow constructs
        const lines = body.split('\n');
        let currentOffset = baseOffset;
        let previousNode: string | null = null;
        let currentDecision: DecisionNode | null = null;
        let _afterDecide = false;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                currentOffset += line.length + 1;
                continue;
            }

            const lineStartPos = document.positionAt(currentOffset);
            const lineEndPos = document.positionAt(currentOffset + line.length);
            const range = new vscode.Range(lineStartPos, lineEndPos);

            if (DEBUG_ACTIVITY_PARSING) console.log(`Processing line: "${trimmed}"`);

            // Match "first start;" - initial node
            const firstStartMatch = trimmed.match(/^first\s+(start|(\w+))\s*;?\s*$/i);
            if (firstStartMatch) {
                const targetName = firstStartMatch[1];
                if (!declaredNodes.has('start')) {
                    declaredNodes.set('start', { type: 'initial', range });
                    actions.push({
                        name: 'start',
                        type: 'initial',
                        kind: 'initial',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Added initial node: start`);
                }
                previousNode = targetName.toLowerCase() === 'start' ? 'start' : targetName;
                currentOffset += line.length + 1;
                continue;
            }

            // Match "then action name { ... }" or "then action name;" or "then action name {"
            // Updated to handle multi-line action bodies (opening brace without closing on same line)
            const thenActionMatch = trimmed.match(/^then\s+action\s+(?:'([^']+)'|(\w+))(?:\s*\{[^}]*\}|\s*\{|\s*;)?\s*$/i);
            if (thenActionMatch) {
                const actionName = thenActionMatch[1] || thenActionMatch[2];
                _afterDecide = false; // Reset after non-decision flow

                if (previousNode && actionName) {
                    flows.push({
                        from: previousNode,
                        to: actionName,
                        condition: '',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Created flow: ${previousNode} → ${actionName}`);
                }
                previousNode = actionName;
                currentOffset += line.length + 1;
                continue;
            }

            // Match "then decide;" - decision node
            const thenDecideMatch = trimmed.match(/^then\s+decide\s*;?\s*$/i);
            if (thenDecideMatch) {
                const decisionName = `decision_${decisions.length + 1}`;
                currentDecision = {
                    name: decisionName,
                    condition: 'decide',
                    branches: [],
                    range
                };
                decisions.push(currentDecision);
                declaredNodes.set(decisionName, { type: 'decision', range });

                if (previousNode) {
                    flows.push({
                        from: previousNode,
                        to: decisionName,
                        condition: '',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Created flow to decision: ${previousNode} → ${decisionName}`);
                }
                previousNode = decisionName;
                _afterDecide = true;
                currentOffset += line.length + 1;
                continue;
            }

            // Match "if condition then target;" - decision branch
            const ifThenMatch = trimmed.match(/^if\s+(.+?)\s+then\s+(?:'([^']+)'|(\w+))\s*;?\s*$/i);
            if (ifThenMatch && currentDecision) {
                const condition = ifThenMatch[1];
                const targetName = ifThenMatch[2] || ifThenMatch[3];

                currentDecision.branches.push({
                    condition: condition,
                    target: targetName
                });

                // Create flow from decision to target
                flows.push({
                    from: currentDecision.name,
                    to: targetName,
                    condition: condition,
                    range
                });
                if (DEBUG_ACTIVITY_PARSING) console.log(`  → Added decision branch: ${currentDecision.name} → ${targetName} [${condition}]`);
                currentOffset += line.length + 1;
                continue;
            }

            // Match "merge name;" - merge node
            const mergeMatch = trimmed.match(/^merge\s+(\w+)\s*;?\s*$/i);
            if (mergeMatch) {
                const mergeName = mergeMatch[1];
                mergeNodes.add(mergeName);
                if (!declaredNodes.has(mergeName)) {
                    declaredNodes.set(mergeName, { type: 'merge', range });
                    // Add merge as a special action node
                    actions.push({
                        name: mergeName,
                        type: 'merge',
                        kind: 'merge',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Added merge node: ${mergeName}`);
                }
                previousNode = mergeName;
                _afterDecide = false;
                currentOffset += line.length + 1;
                continue;
            }

            // Match "then done;" - final node
            const thenDoneMatch = trimmed.match(/^then\s+done\s*;?\s*$/i);
            if (thenDoneMatch) {
                if (!declaredNodes.has('done')) {
                    declaredNodes.set('done', { type: 'final', range });
                    actions.push({
                        name: 'done',
                        type: 'final',
                        kind: 'final',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Added final node: done`);
                }

                if (previousNode) {
                    flows.push({
                        from: previousNode,
                        to: 'done',
                        condition: '',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Created flow to done: ${previousNode} → done`);
                }
                previousNode = 'done';
                currentOffset += line.length + 1;
                continue;
            }

            // Match standalone "action 'Name'; then target;" or "action 'Name';"
            // This handles: action 'Switch to standard mode'; then endOfStatusCheck;
            const actionThenMatch = trimmed.match(/^action\s+(?:'([^']+)'|(\w+))\s*;\s*then\s+(\w+)\s*;?\s*$/i);
            if (actionThenMatch) {
                const actionName = actionThenMatch[1] || actionThenMatch[2];
                const targetName = actionThenMatch[3];

                // Create flow from action to target (which is likely a merge)
                flows.push({
                    from: actionName,
                    to: targetName,
                    condition: '',
                    range
                });
                if (DEBUG_ACTIVITY_PARSING) console.log(`  → Created flow from action: ${actionName} → ${targetName}`);
                currentOffset += line.length + 1;
                continue;
            }

            // Match "then targetName;" - simple flow to existing node
            const thenTargetMatch = trimmed.match(/^then\s+(\w+)\s*;?\s*$/i);
            if (thenTargetMatch) {
                const targetName = thenTargetMatch[1];
                if (targetName !== 'decide' && targetName !== 'done' && previousNode) {
                    flows.push({
                        from: previousNode,
                        to: targetName,
                        condition: '',
                        range
                    });
                    if (DEBUG_ACTIVITY_PARSING) console.log(`  → Created flow: ${previousNode} → ${targetName}`);
                    previousNode = targetName;
                }
                _afterDecide = false;
                currentOffset += line.length + 1;
                continue;
            }

            // Match standalone action declarations: action 'Name' { ... } or action name;
            // This sets previousNode so subsequent 'then target;' lines can create flows
            const standaloneActionMatch = trimmed.match(/^action\s+(?:'([^']+)'|(\w+))(?:\s*\{[^}]*\})?\s*;?\s*$/i);
            if (standaloneActionMatch) {
                const actionName = standaloneActionMatch[1] || standaloneActionMatch[2];
                // Set previousNode so the next 'then target;' creates a flow from this action
                previousNode = actionName;
                if (DEBUG_ACTIVITY_PARSING) console.log(`  → Standalone action, set previousNode: ${actionName}`);
                currentOffset += line.length + 1;
                continue;
            }

            currentOffset += line.length + 1;
        }

        if (DEBUG_ACTIVITY_PARSING) console.log(`Activity body parsed (enhanced): ${actions.length} actions, ${flows.length} flows, ${decisions.length} decisions, ${mergeNodes.size} merges`);
        return { actions, flows, decisions, states };
    }

    private parseActivityBodyLegacy(body: string, document: vscode.TextDocument, baseOffset: number): {
        actions: ActivityAction[],
        flows: ControlFlow[],
        decisions: DecisionNode[],
        states: ActivityState[]
    } {
        const actions: ActivityAction[] = [];
        const flows: ControlFlow[] = [];
        const decisions: DecisionNode[] = [];
        const states: ActivityState[] = [];

        if (DEBUG_ACTIVITY_PARSING) console.log('Parsing activity body (legacy)...');

        // First, do a comprehensive scan for all action declarations in the body
        const actionPattern = /(?:^|\s)((?:private\s+)?action\s+(\w+)(?:\s*:\s*([^{]+))?\s*{)/gm;
        let actionMatch;

        while ((actionMatch = actionPattern.exec(body)) !== null) {
            const fullMatch = actionMatch[1];
            const actionName = actionMatch[2];
            const actionType = actionMatch[3] || 'action';
            const isPrivate = fullMatch.includes('private');

            const actionStartInBody = actionMatch.index;
            const actionStartAbsolute = baseOffset + actionStartInBody;
            const actionEndAbsolute = actionStartAbsolute + fullMatch.length;

            const startPos = document.positionAt(actionStartAbsolute);
            const endPos = document.positionAt(actionEndAbsolute);
            const range = new vscode.Range(startPos, endPos);

            // Check if this is a decision action
            const isDecisionAction = actionType.includes('DecisionAction');

            if (isDecisionAction) {
                decisions.push({
                    name: actionName,
                    condition: actionType,
                    branches: [],
                    range
                });
            } else {
                actions.push({
                    name: actionName,
                    type: 'action',
                    condition: `${isPrivate ? 'private' : 'public'} ${actionType}`,
                    range,
                    isDefinition: false
                });
            }
        }

        // Also scan for flows in the entire body
        const flowPattern = /first\s+(\w+)\s+then\s+(\w+)\s*;?/gi;
        let flowMatch;
        // console.log('Scanning for flows in body...');

        while ((flowMatch = flowPattern.exec(body)) !== null) {
            const fromAction = flowMatch[1];
            const toAction = flowMatch[2];

            // console.log(`Found flow in body scan: ${fromAction} -> ${toAction}`);

            const flowStartInBody = flowMatch.index;
            const flowStartAbsolute = baseOffset + flowStartInBody;
            const flowEndAbsolute = flowStartAbsolute + flowMatch[0].length;

            const startPos = document.positionAt(flowStartAbsolute);
            const endPos = document.positionAt(flowEndAbsolute);
            const range = new vscode.Range(startPos, endPos);

            // Check if the fromAction is a decision action to create branches
            const fromDecision = decisions.find(d => d.name === fromAction);
            if (fromDecision) {
                // This is a decision branch
                fromDecision.branches.push({
                    condition: `branch to ${toAction}`,
                    target: toAction
                });
                // console.log(`  -> Added as decision branch: ${fromAction} -> ${toAction}`);
            } else {
                // Regular flow - check if it already exists to avoid duplicates
                const existingFlow = flows.find(f => f.from === fromAction && f.to === toAction);
                if (!existingFlow) {
                    flows.push({
                        from: fromAction,
                        to: toAction,
                        condition: '',
                        range
                    });
                    // console.log(`  -> Added as regular flow: ${fromAction} -> ${toAction}`);
                }
            }
        }

        const lines = body.split('\n');
        let currentOffset = baseOffset;
        let previousAction: string | null = null;



        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                currentOffset += line.length + 1;
                continue;
            }

            const lineStartPos = document.positionAt(currentOffset);
            const lineEndPos = document.positionAt(currentOffset + line.length);
            const range = new vscode.Range(lineStartPos, lineEndPos);

            // console.log(`Processing line: "${trimmed}"`);

            // Match sequential steps (numbered steps like "1. Initialize")
            const stepMatch = trimmed.match(/^\d+\.\s*(.+)$/);
            if (stepMatch) {
                const actionName = `Step ${stepMatch[1]}`;
                actions.push({
                    name: actionName,
                    type: 'action',
                    condition: stepMatch[1],
                    range
                });
                previousAction = actionName;
                // console.log(`  → Found step: ${actionName}`);
            }

            // PRIORITY: Match flow keywords FIRST (first, then, next, done)
            const flowKeywordMatch = trimmed.match(/^(first|then|next|done)(?:\s+(.+))?$/i);
            if (flowKeywordMatch) {
                const keyword = flowKeywordMatch[1].toLowerCase();
                const target = flowKeywordMatch[2] || keyword;


                if (keyword === 'first') {
                    const actionName = 'Start';
                    actions.push({
                        name: actionName,
                        type: 'action',
                        condition: target || 'Start action',
                        range
                    });
                    previousAction = actionName;
                } else if ((keyword === 'then' || keyword === 'next') && target) {
                    // Create flow to target (don't create new action - flow to existing or named target)
                    // console.log(`  → Flow processing: previousAction="${previousAction}", target="${target}"`);
                    if (previousAction) {
                        flows.push({
                            from: previousAction,
                            to: target,
                            condition: '',
                            range
                        });
                        // console.log(`  → Created flow: ${previousAction} → ${target}`);
                    } else {
                        // console.log(`  → No previousAction to create flow from`);
                    }
                    // Update previousAction to the target so subsequent flows can chain
                    previousAction = target;
                } else if (keyword === 'done') {
                    const actionName = 'End';
                    actions.push({
                        name: actionName,
                        type: 'action',
                        condition: 'End action',
                        range
                    });

                    if (previousAction) {
                        flows.push({
                            from: previousAction,
                            to: actionName,
                            condition: '',
                            range
                        });
                    }
                    previousAction = actionName;
                }
                // console.log(`  → Found flow keyword: ${keyword} → ${target}`);
            }
            // Match nested actions (then action name { ... }) - but only if not already matched as flow keyword
            else if (!flowKeywordMatch) {
                const nestedActionMatch = trimmed.match(/^then\s+action\s+(\w+)\s*\{?(.*)$/i);
                if (nestedActionMatch) {
                    const actionName = nestedActionMatch[1];
                    actions.push({
                        name: actionName,
                        type: 'action',
                        condition: nestedActionMatch[2] || actionName,
                        range
                    });

                    // Create flow from previous action
                    if (previousAction) {
                        flows.push({
                            from: previousAction,
                            to: actionName,
                            condition: '',
                            range
                        });
                    }
                    previousAction = actionName;
                    // console.log(`  → Found nested action: ${actionName}`);
                }

                // Match private action declarations (private action ActionName { ... })
                // Also match regular action declarations within action def
                const privateActionMatch = trimmed.match(/^(?:(private)\s+)?action\s+(\w+)\s*(?::\s*([^{]+))?\s*\{?/i);
                if (privateActionMatch) {
                    const visibility = privateActionMatch[1] || 'public';
                    const actionName = privateActionMatch[2];
                    const actionType = privateActionMatch[3] || 'action';

                    // Check if this is a decision action
                    const isDecisionAction = actionType.includes('DecisionAction');

                    if (isDecisionAction) {
                        // Create decision node for DecisionAction types
                        decisions.push({
                            name: actionName,
                            condition: actionType,
                            branches: [], // Will be populated by flow parsing
                            range
                        });
                    } else {
                        actions.push({
                            name: actionName,
                            type: 'action',
                            condition: `${visibility} ${actionType}`,
                            range,
                            isDefinition: false // This is an action within an action def
                        });
                    }
                }

                // Match explicit flow connections (first ActionA then ActionB;)
                // Make the pattern more flexible to handle various spacing
                const explicitFlowMatch = trimmed.match(/^first\s+(\w+)\s+then\s+(\w+)\s*;?\s*$/i);
                if (explicitFlowMatch) {
                    const fromAction = explicitFlowMatch[1];
                    const toAction = explicitFlowMatch[2];

                    // console.log(`Found flow: ${fromAction} → ${toAction}`);

                    // Check if the fromAction is a decision action to create branches
                    const fromDecision = decisions.find(d => d.name === fromAction);
                    if (fromDecision) {
                        // This is a decision branch
                        fromDecision.branches.push({
                            condition: `branch to ${toAction}`,
                            target: toAction
                        });
                        // console.log(`  → Added decision branch: ${fromAction} → ${toAction}`);
                    } else {
                        // Regular flow
                        flows.push({
                            from: fromAction,
                            to: toAction,
                            condition: '',
                            range
                        });
                        // console.log(`  → Added regular flow: ${fromAction} → ${toAction}`);
                    }
                }

                // Match action definitions with inputs/outputs
                const actionDefMatch = trimmed.match(/^action\s+(\w+)\s*:\s*(\w+)\s*(?:\{(.*))?$/i);
                if (actionDefMatch) {
                    const actionName = actionDefMatch[1];
                    const actionType = actionDefMatch[2];
                    actions.push({
                        name: actionName,
                        type: 'action',
                        condition: `${actionName} : ${actionType}`,
                        range
                    });

                    if (previousAction) {
                        flows.push({
                            from: previousAction,
                            to: actionName,
                            condition: '',
                            range
                        });
                    }
                    previousAction = actionName;
                    // console.log(`  → Found typed action: ${actionName} : ${actionType}`);
                }

                // Match input/output parameters
                const paramMatch = trimmed.match(/^(in|out)\s+(\w+)\s*:\s*(.+)$/i);
                if (paramMatch && actions.length > 0) {
                    const direction = paramMatch[1].toLowerCase();
                    const paramName = paramMatch[2];
                    const paramType = paramMatch[3];

                    const currentAction = actions[actions.length - 1];
                    if (direction === 'in') {
                        currentAction.inputs = currentAction.inputs || [];
                        currentAction.inputs.push(`${paramName}: ${paramType}`);
                    } else {
                        currentAction.outputs = currentAction.outputs || [];
                        currentAction.outputs.push(`${paramName}: ${paramType}`);
                    }
                    // console.log(`  → Found parameter: ${direction} ${paramName}: ${paramType}`);
                }
            }

            // Match conditional logic (if statements)
            const conditionMatch = trimmed.match(/^if\s*\(([^)]+)\)\s*(.*)$/i);
            if (conditionMatch) {
                const decisionName = `Decision${decisions.length + 1}`;
                decisions.push({
                    name: decisionName,
                    condition: conditionMatch[1],
                    branches: [
                        { condition: 'true', target: conditionMatch[2] || 'continue' },
                        { condition: 'false', target: 'skip' }
                    ],
                    range
                });

                if (previousAction) {
                    flows.push({
                        from: previousAction,
                        to: decisionName,
                        condition: '',
                        range
                    });
                }
                previousAction = decisionName;
                // console.log(`  → Found decision: ${decisionName} (${conditionMatch[1]})`);
            }

            // Match loops (while, for statements)
            const loopMatch = trimmed.match(/^(while|for|repeat)\s*\(([^)]+)\)\s*(.*)$/i);
            if (loopMatch) {
                const stateName = `Loop${states.length + 1}`;
                states.push({
                    name: stateName,
                    type: 'intermediate',
                    doActivity: `${loopMatch[1]}(${loopMatch[2]}) ${loopMatch[3] || ''}`.trim(),
                    range
                });

                if (previousAction) {
                    flows.push({
                        from: previousAction,
                        to: stateName,
                        condition: '',
                        range
                    });
                }
                previousAction = stateName;
                // console.log(`  → Found loop: ${stateName}`);
            }

            // Match simple action calls (perform, do)
            const actionCallMatch = trimmed.match(/^(perform|do)\s+(.+)$/i);
            if (actionCallMatch) {
                const actionName = actionCallMatch[2];
                actions.push({
                    name: actionName,
                    type: 'action',
                    condition: `${actionCallMatch[1]} ${actionName}`,
                    range
                });

                if (previousAction) {
                    flows.push({
                        from: previousAction,
                        to: actionName,
                        condition: '',
                        range
                    });
                }
                previousAction = actionName;
                // console.log(`  → Found action call: ${actionName}`);
            }

            // Match composite action declarations (action name : Type;)
            const compositeActionMatch = trimmed.match(/^action\s+(\w+)\s*:\s*(\w+)\s*;?\s*$/i);
            if (compositeActionMatch) {
                const actionName = compositeActionMatch[1];
                const actionType = compositeActionMatch[2];
                actions.push({
                    name: actionName,
                    type: 'composite',
                    condition: `${actionName} : ${actionType}`,
                    range
                });
                // console.log(`  → Found composite action: ${actionName} : ${actionType}`);
            }

            currentOffset += line.length + 1; // +1 for newline
        }

        // console.log(`Activity body parsed: ${actions.length} actions, ${flows.length} flows, ${decisions.length} decisions, ${states.length} states`);
        return { actions, flows, decisions, states };
    }

    /**
     * Finds a specific element by name.
     * @param name The name of the element to find
     * @returns The SysML element if found, undefined otherwise
     */
    findElement(name: string): SysMLElement | undefined {
        return this.elements.get(name);
    }

    /**
     * Finds the most specific SysML element at the given position in the document.
     * @param document The VS Code text document
     * @param position The position to search at
     * @returns The SysML element at the position, or null if none found
     */
    findElementAtPosition(document: vscode.TextDocument, position: vscode.Position): SysMLElement | null {
        for (const element of this.elements.values()) {
            if (element.range.contains(position)) {
                for (const child of this.findChildAtPosition(element.children, position)) {
                    return child;
                }
                return element;
            }
        }
        return null;
    }

    private *findChildAtPosition(children: SysMLElement[], position: vscode.Position): Generator<SysMLElement> {
        for (const child of children) {
            if (child.range.contains(position)) {
                yield* this.findChildAtPosition(child.children, position);
                yield child;
            }
        }
    }

    /**
     * Checks if an action element has sequential flow (first/then/done patterns)
     */
    private hasSequentialFlow(element: SysMLElement): boolean {
        // Check if action contains sequential keywords in its name or attributes
        const actionText = `${element.name ?? ''} ${Array.from(element.attributes.keys()).join(' ')}`;
        const hasSequentialKeywords = actionText.includes('first') || actionText.includes('then');

        // Check if any child elements contain sequential keywords
        const hasSequentialChildren = element.children.some(child => {
            const childName = child.name || '';
            return childName.includes('first') ||
                childName.includes('then') ||
                childName.includes('done') ||
                child.type === 'action'; // Child actions suggest a sequence
        });

        // Look for generic sequential patterns in element name
        const elementName = (element.name || '').toLowerCase();
        const hasSequentialNames = elementName.includes('sequence') ||
                                 elementName.includes('flow') ||
                                 elementName.includes('step');

        return hasSequentialKeywords || hasSequentialChildren || hasSequentialNames;
    }

    /**
     * Determines if an element (action or behavior) should be rendered sequentially.
     */
    private isSequentialBehaviorElement(element: SysMLElement): boolean {
        if (!element.type) {
            return false;
        }
        const normalizedType = element.type.toLowerCase();
        const isAction = normalizedType === 'action' || normalizedType === 'action def';
        const isBehavior = normalizedType === 'behavior' || normalizedType === 'behavior def';
        return (isAction || isBehavior) && this.hasSequentialFlow(element);
    }

    /**
     * Extracts sequential behavior as participants and messages for sequence diagram
     */
    private extractActionSequence(action: SysMLElement, participants: Participant[], messages: Message[]): void {
        // Extract actors/subjects as participants
        this.findActorsInAction(action, participants);

        // Extract sequential steps as messages
        const occurrence = 1;
        this.extractSequentialSteps(action, messages, occurrence, participants);
    }

    private findActorsInAction(element: SysMLElement, participants: Participant[]): void {
        // Recursively collect all potential participants from element structure
        const collectParticipantsFromElement = (el: SysMLElement) => {
            // Add actors
            if (el.type === 'actor') {
                if (!participants.find(p => p.name === el.name)) {
                    participants.push({
                        name: el.name,
                        type: 'actor',
                        range: el.range
                    });
                }
            }

            // Add parts as potential participants (components, systems, etc.)
            if (el.type === 'part' || el.type === 'part def' || el.type === 'item' || el.type === 'item def') {
                if (!participants.find(p => p.name === el.name)) {
                    participants.push({
                        name: el.name,
                        type: 'component',
                        range: el.range
                    });
                }
            }

            // Add ports as potential participants
            if (el.type === 'port') {
                if (!participants.find(p => p.name === el.name)) {
                    participants.push({
                        name: el.name,
                        type: 'port',
                        range: el.range
                    });
                }
            }

            // Recurse into children
            for (const child of el.children) {
                collectParticipantsFromElement(child);
            }
        };

        // Collect from the current element and its children
        collectParticipantsFromElement(element);

        // If no participants found, add generic system participant as fallback
        if (participants.length === 0) {
            participants.push({
                name: 'system',
                type: 'system',
                range: element.range
            });
        }
    }

    private extractSequentialSteps(element: SysMLElement, messages: Message[], occurrence: number, participants: Participant[]): number {
        for (const child of element.children) {
            if (child.type === 'action' || child.name.includes('action')) {
                // Create message for this action step
                const fromParticipant = this.inferFromParticipant(child, participants);
                const toParticipant = this.inferToParticipant(child, participants);

                messages.push({
                    name: child.name.replace('action ', ''),
                    from: fromParticipant,
                    to: toParticipant,
                    payload: this.extractActionDescription(child),
                    occurrence: occurrence++,
                    range: child.range
                });
            }

            // Recurse into nested actions
            occurrence = this.extractSequentialSteps(child, messages, occurrence, participants);
        }
        return occurrence;
    }

    private inferFromParticipant(action: SysMLElement, participants: Participant[]): string {
        const actionName = action.name.toLowerCase();

        // Try to infer from action name by matching against participant names
        for (const participant of participants) {
            const participantName = participant.name.toLowerCase();
            // Check if action name contains participant name or vice versa
            if (actionName.includes(participantName) || participantName.includes(actionName)) {
                return participant.name;
            }
        }

        // Check for actor-type participants (users typically initiate actions)
        const actorParticipant = participants.find(p => p.type === 'actor');
        if (actorParticipant) {
            return actorParticipant.name;
        }

        // Default to first participant or 'system'
        return participants.length > 0 ? participants[0].name : 'system';
    }

    private inferToParticipant(action: SysMLElement, participants: Participant[]): string {
        const actionName = action.name.toLowerCase();

        // Try to infer target from action name by matching against participant names
        for (const participant of participants) {
            const participantName = participant.name.toLowerCase();
            // Skip if this is the same as the source participant
            if (actionName.includes(participantName) || participantName.includes(actionName)) {
                return participant.name;
            }
        }

        // Check for component or system participants (typically targets of actions)
        const componentParticipant = participants.find(p => p.type === 'component' || p.type === 'part' || p.type === 'system');
        if (componentParticipant) {
            return componentParticipant.name;
        }

        // Default to second participant if available, otherwise 'system'
        return participants.length > 1 ? participants[1].name : 'system';
    }

    private extractActionDescription(action: SysMLElement): string {
        // Extract meaningful description from action
        const name = action.name.replace('action ', '');

        // Look for documentation or comments
        for (const [key, value] of action.attributes) {
            if (key === 'doc' && typeof value === 'string') {
                return value;
            }
        }

        return name;
    }

    private addElementsToMap(elements: SysMLElement[], elementMap: Map<string, SysMLElement>) {
        elements.forEach(element => {
            if (element.name) {
                elementMap.set(element.name, element);
            }
            if (element.children) {
                this.addElementsToMap(element.children, elementMap);
            }
        });
    }

    // Phase 2: parseWithRegexFallback REMOVED (~300 lines) - Pure ANTLR parsing only
    // This massive regex fallback method is no longer used - all parsing goes through ANTLR

    /**
     * Parse relationships from text and associate them with elements
     */
    /**
     * Parse relationships from text and associate them with elements
     */
    private parseRelationshipsFromText(text: string, elements: SysMLElement[]): void {
        const lines = text.split('\n');
        let currentElement: SysMLElement | null = null;

        lines.forEach((line) => {
            const trimmed = line.trim();

            // Track which element we're currently inside
            const elementMatch = trimmed.match(/^(?:(abstract|public|private)\s+)?(?:part|action|requirement|use case|state)\s+(?:def\s+)?(?:'([^']+)'|"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*))(?:\s*:\s*>\s*([a-zA-Z_][a-zA-Z0-9_]*))?/);
            if (elementMatch) {
                const elementName = elementMatch[2] || elementMatch[3] || elementMatch[4];
                currentElement = this.findElementByName(elementName, elements);

                // Check for :> specialization in the element definition
                if (elementMatch[5] && currentElement) {
                    const relationship: Relationship = {
                        type: 'specializes',
                        source: currentElement.name,
                        target: elementMatch[5]
                    };
                    currentElement.relationships.push(relationship);
                    this.relationships.push(relationship);
                }
                return;
            }

            // Parse attribute relationships within elements
            if (currentElement) {
                // Check for "subsets" relationships
                const subsetsMatch = trimmed.match(/(?:attribute|part)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+subsets\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
                if (subsetsMatch) {
                    const relationship: Relationship = {
                        type: 'subsets',
                        source: subsetsMatch[1],
                        target: subsetsMatch[2]
                    };
                    currentElement.relationships.push(relationship);
                    this.relationships.push(relationship);
                }

                // Check for "references" relationships
                const referencesMatch = trimmed.match(/(?:attribute|part)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+references\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
                if (referencesMatch) {
                    const relationship: Relationship = {
                        type: 'references',
                        source: referencesMatch[1],
                        target: referencesMatch[2]
                    };
                    currentElement.relationships.push(relationship);
                    this.relationships.push(relationship);
                }
            }
        });
    }



    /**
     * Find an element by name in a nested structure
     */
    private findElementByName(name: string, elements: SysMLElement[]): SysMLElement | null {
        for (const element of elements) {
            if (element.name === name) {
                return element;
            }
            const found = this.findElementByName(name, element.children);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * Extracts complete structural view using ANTLR parser for full SysML v2.0 compliance.
     * This is the primary view for SysML v2.0 files showing packages, parts, connections, requirements, etc.
     * @param document The VS Code text document to parse
     * @returns Comprehensive structural diagram with all SysML elements
     */
    getStructuralDiagram(document: vscode.TextDocument): StructuralDiagram {
        // console.log('=== Getting Structural Diagram with ANTLR ===');
        // console.log('Document:', document.uri?.fsPath || 'test document');

        const antlr = this.getANTLRParser();
        if (!antlr) {
            console.warn('ANTLR parser not available, returning empty structural diagram');
            return this.createEmptyStructuralDiagram(document);
        }

        try {
            // Parse the document using ANTLR for full structural compliance
            const elements = antlr.parseDocument(document, false); // Don't include error elements
            // console.log(`ANTLR parsed ${elements.length} top-level elements`);

            // Extract comprehensive structural data
            return this.buildStructuralDiagram(elements, document);

        } catch (error) {
            console.error('ANTLR structural parsing failed:', error);
            return this.createEmptyStructuralDiagram(document);
        }
    }

    /**
     * Builds a comprehensive structural diagram from ANTLR-parsed elements
     */
    private buildStructuralDiagram(elements: SysMLElement[], document: vscode.TextDocument): StructuralDiagram {
        const packages: StructuralPackage[] = [];
        const parts: StructuralPart[] = [];
        const connections: StructuralConnection[] = [];
        const requirements: StructuralRequirement[] = [];
        const attributes: StructuralAttribute[] = [];
        const interfaces: StructuralInterface[] = [];
        const relationships: StructuralRelationship[] = [];
        const actions: StructuralAction[] = [];
        const states: StructuralState[] = [];
        const constraints: StructuralConstraint[] = [];
        const actors: StructuralActor[] = [];
        const useCases: StructuralUseCase[] = [];
        const occurrences: StructuralOccurrence[] = [];
        const enumerations: StructuralEnumeration[] = [];

        // Extract elements recursively
        this.extractStructuralElements(elements, packages, parts, connections, requirements, attributes, interfaces, relationships, actions, states, constraints, actors, useCases, occurrences, enumerations);

        // Extract and associate transitions with states
        this.extractTransitions(elements, states);

        // Determine diagram title from document name or first package
        let title = 'SysML v2.0 Structural View';
        if (packages.length > 0) {
            title = `${packages[0].name} - Structural View`;
        } else if (document.uri) {
            const fileName = document.uri.path.split('/').pop()?.replace('.sysml', '') || 'Model';
            title = `${fileName} - Structural View`;
        }

        const fullRange = new vscode.Range(0, 0, document.lineCount - 1, 0);

        // Structural diagram stats (logging disabled for performance)
        const _stats = {
            packages: packages.length,
            parts: parts.length,
            connections: connections.length,
            requirements: requirements.length,
            attributes: attributes.length,
            interfaces: interfaces.length,
            actions: actions.length,
            states: states.length,
            constraints: constraints.length,
            actors: actors.length,
            useCases: useCases.length,
            enumerations: enumerations.length,
            relationships: relationships.length
        };

        return {
            name: 'structural',
            title,
            packages,
            parts,
            connections,
            requirements,
            attributes,
            interfaces,
            relationships,
            actions,
            states,
            constraints,
            actors,
            useCases,
            occurrences,
            enumerations,
            range: fullRange
        };
    }

    /**
     * Recursively extracts structural elements from the ANTLR parse tree
     */
    private extractStructuralElements(
        elements: SysMLElement[],
        packages: StructuralPackage[],
        parts: StructuralPart[],
        connections: StructuralConnection[],
        requirements: StructuralRequirement[],
        attributes: StructuralAttribute[],
        interfaces: StructuralInterface[],
        relationships: StructuralRelationship[],
        actions: StructuralAction[],
        states: StructuralState[],
        constraints: StructuralConstraint[],
        actors: StructuralActor[],
        useCases: StructuralUseCase[],
        occurrences: StructuralOccurrence[],
        enumerations: StructuralEnumeration[]
    ): void {
        for (const element of elements) {
            const visibility = this.getVisibility(element);

            switch (element.type) {
                case 'package': {
                    // Create separate arrays for nested elements within this package
                    const nestedPackages: StructuralPackage[] = [];
                    const nestedParts: StructuralPart[] = [];
                    const nestedConnections: StructuralConnection[] = [];
                    const nestedRequirements: StructuralRequirement[] = [];
                    const nestedAttributes: StructuralAttribute[] = [];
                    const nestedInterfaces: StructuralInterface[] = [];
                    const nestedRelationships: StructuralRelationship[] = [];
                    const nestedActions: StructuralAction[] = [];
                    const nestedStates: StructuralState[] = [];
                    const nestedConstraints: StructuralConstraint[] = [];
                    const nestedActors: StructuralActor[] = [];
                    const nestedUseCases: StructuralUseCase[] = [];
                    const nestedOccurrences: StructuralOccurrence[] = [];
                    const nestedEnumerations: StructuralEnumeration[] = [];

                    // Recursively process package contents into nested arrays
                    this.extractStructuralElements(element.children, nestedPackages, nestedParts, nestedConnections, nestedRequirements, nestedAttributes, nestedInterfaces, nestedRelationships, nestedActions, nestedStates, nestedConstraints, nestedActors, nestedUseCases, nestedOccurrences, nestedEnumerations);

                    // Combine all nested elements as children (packages, parts, requirements are the main structural elements)
                    const packageChildren: any[] = [...nestedPackages, ...nestedParts, ...nestedRequirements];

                    // Also add nested packages to the global packages array for backward compatibility
                    packages.push(...nestedPackages);

                    packages.push({
                        name: element.name,
                        type: 'package',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        children: packageChildren,
                        range: element.range
                    });
                    break;
                }
                case 'part':
                case 'part def':
                case 'item':
                case 'item def': {
                    const partAttributes: StructuralAttribute[] = [];
                    const partPorts: StructuralPort[] = [];
                    const partChildren: StructuralPart[] = [];

                    // Extract attributes and nested parts
                    this.extractPartElements(element.children, partAttributes, partPorts, partChildren);

                    parts.push({
                        name: element.name,
                        type: element.type as 'part' | 'part def' | 'item' | 'item def',
                        partType: element.attributes.get('partType') as string,
                        multiplicity: element.attributes.get('multiplicity') as string,
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        attributes: partAttributes,
                        ports: partPorts,
                        children: partChildren,
                        redefinitions: [],
                        range: element.range
                    });
                    break;
                }
                case 'connection':
                case 'binding':
                case 'succession':
                case 'allocation': {
                    connections.push({
                        name: element.name,
                        type: element.type as 'connection' | 'binding' | 'succession' | 'allocation',
                        from: element.attributes.get('from') as string || '',
                        to: element.attributes.get('to') as string || '',
                        visibility,
                        range: element.range
                    });
                    break;
                }
                case 'requirement':
                case 'requirement def':
                    requirements.push({
                        name: element.name,
                        type: element.type as 'requirement' | 'requirement def',
                        requirementType: element.attributes.get('requirementType') as string,
                        text: element.attributes.get('text') as string,
                        visibility,
                        satisfiedBy: this.extractSatisfiedBy(element),
                        range: element.range
                    });
                    break;

                case 'attribute':
                    attributes.push({
                        name: element.name,
                        type: 'attribute',
                        dataType: element.attributes.get('dataType') as string || 'String',
                        defaultValue: element.attributes.get('defaultValue') as string,
                        visibility,
                        range: element.range
                    });
                    break;

                case 'interface':
                case 'interface def': {
                    const interfacePorts: StructuralPort[] = [];
                    this.extractInterfacePorts(element.children, interfacePorts);

                    interfaces.push({
                        name: element.name,
                        type: element.type as 'interface' | 'interface def',
                        ports: interfacePorts,
                        visibility,
                        range: element.range
                    });
                    break;
                }
                case 'action':
                case 'action def':
                    actions.push({
                        name: element.name,
                        type: element.type as 'action' | 'action def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        inputs: [],
                        outputs: [],
                        subActions: [],
                        controlFlow: [],
                        range: element.range
                    });
                    break;

                case 'state':
                case 'state def':
                    states.push({
                        name: element.name,
                        type: element.type as 'state' | 'state def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        substates: [],
                        transitions: [],
                        range: element.range
                    });
                    break;

                case 'constraint':
                case 'constraint def':
                    constraints.push({
                        name: element.name,
                        type: element.type as 'constraint' | 'constraint def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        expression: element.attributes.get('expression') as string || '',
                        range: element.range
                    });
                    break;

                case 'actor':
                case 'actor def':
                    actors.push({
                        name: element.name,
                        type: element.type as 'actor' | 'actor def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        attributes: [],
                        actions: [],
                        range: element.range
                    });
                    break;

                case 'use case':
                case 'use case def':
                    useCases.push({
                        name: element.name,
                        type: element.type as 'use case' | 'use case def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        actors: [],
                        subject: element.attributes.get('subject') as string || '',
                        objective: element.attributes.get('objective') as string,
                        includes: [],
                        extends: [],
                        range: element.range
                    });
                    break;

                case 'enumeration':
                case 'enumeration def':
                    enumerations.push({
                        name: element.name,
                        type: element.type as 'enumeration' | 'enumeration def',
                        visibility,
                        documentation: element.attributes.get('documentation') as string,
                        literals: [],
                        range: element.range
                    });
                    break;
            }

            // Extract relationships
            for (const rel of element.relationships) {
                if (['specialization', 'composition', 'aggregation', 'dependency', 'satisfy', 'verify'].includes(rel.type)) {
                    relationships.push({
                        type: rel.type as 'specialization' | 'composition' | 'aggregation' | 'dependency' | 'satisfy' | 'verify',
                        from: rel.source,
                        to: rel.target,
                        range: element.range
                    });
                }
            }

            // Recursively process children if not already handled
            if (!['package', 'part', 'part def', 'item', 'item def'].includes(element.type)) {
                this.extractStructuralElements(element.children, packages, parts, connections, requirements, attributes, interfaces, relationships, actions, states, constraints, actors, useCases, occurrences, enumerations);
            }
        }
    }

    private extractPartElements(children: SysMLElement[], attributes: StructuralAttribute[], ports: StructuralPort[], parts: StructuralPart[]): void {
        for (const child of children) {
            const visibility = this.getVisibility(child);

            if (child.type === 'attribute') {
                attributes.push({
                    name: child.name,
                    type: 'attribute',
                    dataType: child.attributes.get('dataType') as string || 'String',
                    defaultValue: child.attributes.get('defaultValue') as string,
                    visibility,
                    range: child.range
                });
            } else if (child.type === 'port') {
                ports.push({
                    name: child.name,
                    type: 'port',
                    direction: child.attributes.get('direction') as 'in' | 'out' | 'inout' || 'inout',
                    portType: child.attributes.get('portType') as string,
                    visibility,
                    range: child.range
                });
            } else if (['part', 'part def', 'item', 'item def'].includes(child.type)) {
                const nestedAttributes: StructuralAttribute[] = [];
                const nestedPorts: StructuralPort[] = [];
                const nestedParts: StructuralPart[] = [];
                this.extractPartElements(child.children, nestedAttributes, nestedPorts, nestedParts);

                parts.push({
                    name: child.name,
                    type: child.type as 'part' | 'part def' | 'item' | 'item def',
                    partType: child.attributes.get('partType') as string,
                    multiplicity: child.attributes.get('multiplicity') as string,
                    visibility,
                    documentation: child.attributes.get('documentation') as string,
                    attributes: nestedAttributes,
                    ports: nestedPorts,
                    children: nestedParts,
                    redefinitions: [],
                    range: child.range
                });
            }
        }
    }

    private extractInterfacePorts(children: SysMLElement[], ports: StructuralPort[]): void {
        for (const child of children) {
            if (child.type === 'port') {
                const visibility = this.getVisibility(child);
                ports.push({
                    name: child.name,
                    type: 'port',
                    direction: child.attributes.get('direction') as 'in' | 'out' | 'inout' || 'inout',
                    portType: child.attributes.get('portType') as string,
                    visibility,
                    range: child.range
                });
            }
        }
    }

    private extractSatisfiedBy(element: SysMLElement): string[] {
        const satisfiedBy: string[] = [];
        for (const rel of element.relationships) {
            if (rel.type === 'satisfy') {
                satisfiedBy.push(rel.source);
            }
        }
        return satisfiedBy;
    }

    /**
     * Recursively extracts transition elements and associates them with states
     */
    private extractTransitions(elements: SysMLElement[], states: StructuralState[]): void {
        let transitionCount = 0;

        for (const element of elements) {
            if (element.type === 'transition') {
                transitionCount++;
                const fromState = element.attributes.get('from') as string;
                const toState = element.attributes.get('to') as string;
                const trigger = element.attributes.get('trigger') as string;

                if (fromState && toState) {
                    const transition: StructuralTransition = {
                        name: element.name,
                        from: fromState,
                        to: toState,
                        trigger,
                        range: element.range
                    };

                    // Find the parent state and add this transition
                    // Transitions can be associated with the "from" state
                    const parentState = states.find(s => s.name === fromState);
                    if (parentState) {
                        parentState.transitions = parentState.transitions || [];
                        parentState.transitions.push(transition);
                        // console.log(`[Transition Association] Added transition "${element.name}" to state "${fromState}"`);
                    } else {
                        // console.log(`[Transition Association] WARNING: Could not find parent state "${fromState}" for transition "${element.name}"`);
                    }
                }
            }

            // Recursively process children
            if (element.children.length > 0) {
                this.extractTransitions(element.children, states);
            }
        }

        if (transitionCount > 0) {
            // console.log(`[Transition Extraction] Found ${transitionCount} transitions in total`);
        }
    }

    private getVisibility(element: SysMLElement): 'public' | 'private' | 'protected' {
        const visibility = element.attributes.get('visibility') || element.attributes.get('modifier');
        if (visibility === 'private') return 'private';
        if (visibility === 'protected') return 'protected';
        return 'public';
    }

    private createEmptyStructuralDiagram(document: vscode.TextDocument): StructuralDiagram {
        const fileName = document.uri?.path.split('/').pop()?.replace('.sysml', '') || 'Model';
        return {
            name: 'structural',
            title: `${fileName} - Structural View (Parser Error)`,
            packages: [],
            parts: [],
            connections: [],
            requirements: [],
            attributes: [],
            interfaces: [],
            relationships: [],
            actions: [],
            states: [],
            constraints: [],
            actors: [],
            useCases: [],
            occurrences: [],
            enumerations: [],
            range: new vscode.Range(0, 0, 0, 0)
        };
    }

    /**
     * Enhance parsed elements with library type information
     * This improves parser accuracy by validating against standard library
     * Phase 3: Replaced with semantic resolver - kept for backward compatibility
     */
    public enhanceWithLibraryInfo(elements: SysMLElement[]): SysMLElement[] {
        try {
            const library = LibraryService.getInstance();

            if (!library) {
                return elements; // Library not ready yet
            }

            for (const element of elements) {
                this.enhanceElement(element, library);

                // Recursively enhance children
                if (element.children && element.children.length > 0) {
                    this.enhanceWithLibraryInfo(element.children);
                }
            }

            return elements;
        } catch {
            // Library not available, return elements without enhancement
            return elements;
        }
    }

    /**
     * Enhance a single element with library information
     * Phase 3: Updated to use LibraryService instead of LibraryIndexer
     */
    private enhanceElement(element: SysMLElement, library: LibraryService): void {
        // Check if element type references a standard library element
        const typeAttribute = element.attributes.get('type') as string;

        if (typeAttribute) {
            const libraryElement = library.getSymbol(typeAttribute);

            if (libraryElement) {
                // Mark as library-validated
                element.attributes.set('isStandardType', true);
                element.attributes.set('libraryKind', libraryElement.kind);

                // Get specialization chain for better type understanding
                const chain = library.getSpecializationChain(typeAttribute);
                if (chain.length > 1) {
                    element.attributes.set('specializationChain', chain.join(' :> '));
                }
            }
        }

        // Check if element name itself is a standard library element
        const nameSymbol = library.getSymbol(element.name);
        if (nameSymbol) {
            element.attributes.set('isStandardElement', true);
        }

        // For elements with specialization relationships, validate targets exist
        for (const rel of element.relationships) {
            if (rel.type === 'specializes' || rel.type === 'redefines' || rel.type === 'subsets') {
                const targetSymbol = library.getSymbol(rel.target);
                if (targetSymbol) {
                    element.attributes.set(`${rel.type}_validated`, true);
                }
            }
        }
    }

    /**
     * Initialize library (called from extension activation)
     * Phase 3: Replaced LibraryIndexer with LibraryService
     */
    public static async initializeLibrary(): Promise<void> {
        // Library service initialization is handled by extension.ts
        // This method kept for backward compatibility
        const library = LibraryService.getInstance();

        if (library) {
            // console.log(`SysML Library service available`);
        }
    }

    /**
     * Get library service instance for external use
     * Phase 3: Return LibraryService instead of LibraryIndexer
     */
    public getLibraryService(): LibraryService {
        return LibraryService.getInstance();
    }
}

