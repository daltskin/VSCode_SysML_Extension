import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { ANTLRErrorListener } from 'antlr4ts/ANTLRErrorListener';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import * as vscode from 'vscode';
import { IdentifierContext, SpecializationContext, SysMLv2 } from './generated/grammar/SysMLv2';
import { SysMLv2Lexer } from './generated/grammar/SysMLv2Lexer';
import { SysMLv2Visitor } from './generated/grammar/SysMLv2Visitor';
import { LibraryIndexer } from './libraryIndexer';
import { ActivityAction, ActivityDiagram, ActivityState, ControlFlow, DecisionNode, Message, Participant, Relationship, SequenceDiagram, SysMLElement } from './sysmlParser';

/**
 * ANTLR4-based implementation of SysML v2.0 parser.
 * Provides robust parsing with proper error handling and syntax validation.
 */
export class ANTLRSysMLParser {
    private elements: Map<string, SysMLElement> = new Map();
    private relationships: Relationship[] = [];
    private libraryIndexer: LibraryIndexer;

    constructor() {
        this.libraryIndexer = LibraryIndexer.getInstance();
    }

    /**
     * Post-processing step to extract values from redefinition elements by parsing source text.
     * This works around ANTLR parse errors that prevent visitRedefinitionUsage from being called.
     */
    private extractRedefinitionValues(elements: SysMLElement[], content: string): void {
        const lines = content.split('\n');

        const processElement = (element: SysMLElement) => {
            if (element.type === 'redefinition' && element.range) {
                // Get the source line for this redefinition
                const lineNum = element.range.start.line;
                if (lineNum < lines.length) {
                    const line = lines[lineNum];
                    // Match pattern: :>> name = value; or :>> name = value
                    const match = line.match(/:>>\s+(\w+)\s*=\s*([^;]+)/);
                    if (match) {
                        const value = match[2].trim();
                        element.attributes.set('value', value);
                    }
                }
            }

            // Recursively process children
            element.children.forEach(child => processElement(child));
        };

        elements.forEach(element => processElement(element));
    }

    /**
     * Parses a SysML document using ANTLR4 grammar and extracts all elements.
     * @param document The VS Code text document to parse
     * @param includeErrors Whether to include error elements in the results (default: false)
     * @returns Array of top-level SysML elements with hierarchical children
     */
    public parseDocument(document: vscode.TextDocument, includeErrors: boolean = true): SysMLElement[] {
        try {
            // Reset state
            this.elements.clear();
            this.relationships = [];

            const content = document.getText();
            const inputStream = new ANTLRInputStream(content);
            const lexer = new SysMLv2Lexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new SysMLv2(tokenStream);

            // Add custom error handling
            const errorListener = new SysMLErrorListener(document, this.elements);
            lexer.removeErrorListeners();
            parser.removeErrorListeners();
            lexer.addErrorListener(errorListener);
            parser.addErrorListener(errorListener);

            // Parse the entire document starting from the model rule
            const modelContext = parser.model();

            // Use visitor pattern to extract elements
            const visitor = new SysMLElementVisitor(document, this.elements, this.relationships);
            visitor.visit(modelContext);

            // Log summary of suppressed errors
            errorListener.logSummary();

            // Build hierarchical structure and optionally filter out error elements
            const allElements = this.buildHierarchy();

            // Post-process to extract redefinition values from source text
            this.extractRedefinitionValues(allElements, content);

            // Count non-error elements
            const countNonErrorElements = (elements: SysMLElement[]): number => {
                let count = 0;
                for (const el of elements) {
                    if (el.type !== 'error') {
                        count++;
                        count += countNonErrorElements(el.children);
                    }
                }
                return count;
            };

            const _nonErrorCount = countNonErrorElements(allElements);

            // If no elements found or content contains action but no action elements found, try basic regex fallback
            const _hasActionInContent = content.includes('action def') || content.includes('action ');
            const _hasActionElements = allElements.some(el => el.type === 'action');
            const _actionLines = content.split('\n').filter(line => {
                const trimmed = line.trim();
                return (trimmed.startsWith('action def') ||
                       (trimmed.startsWith('action ') && !trimmed.startsWith('action def')))
                       && !trimmed.startsWith('//');
            });
            const _actionElementsFound = allElements.filter(el => el.type === 'action').length;

            // Enhanced fallback logic for ANTLR parsing gaps
            // Phase 2: REMOVED REGEX FALLBACK
            // No longer falling back to regex parsing - ANTLR should handle all structures
            // If elements are missing, it indicates grammar issues that should be surfaced as diagnostics

            // Filter out error elements and generic 'entry' elements when we have better alternatives
            let filteredElements = includeErrors ? allElements : allElements.filter(element => element.type !== 'error');

            // If we have both 'entry' and specific typed elements, prefer the specific ones
            const entryElements = filteredElements.filter(el => el.type === 'entry' && el.name === 'unnamed');
            const specificElements = filteredElements.filter(el => el.type !== 'entry' || el.name !== 'unnamed');

            if (entryElements.length > 0 && specificElements.length > 0) {
                // We have both generic entries and specific elements, prefer the specific ones
                filteredElements = specificElements;
            }

            return filteredElements;

        } catch (error) {
            // Log error internally for debugging with stack trace
            console.error('[ANTLR Parser] Fatal error during parsing:', error);
            if (error instanceof Error) {
                console.error('[ANTLR Parser] Stack trace:', error.stack);
                console.error('[ANTLR Parser] Error message:', error.message);
                console.error('[ANTLR Parser] Error name:', error.name);
            }
            return [{
                type: 'error',
                name: 'Parse Error',
                range: new vscode.Range(0, 0, 0, 0),
                children: [],
                attributes: new Map([
                    ['error', error?.toString() || 'Unknown parsing error'],
                    ['errorMessage', error instanceof Error ? error.message : 'Unknown'],
                    ['errorStack', error instanceof Error ? (error.stack || 'No stack trace') : 'No stack trace']
                ]),
                relationships: [],
                errors: [error?.toString() || 'Unknown parsing error']
            }];
        }
    }

    /**
     * Extracts sequence diagrams from the parsed elements using ANTLR's superior parsing.
     * Handles both explicit interaction definitions and implicit action sequences.
     */
    public extractSequenceDiagrams(document: vscode.TextDocument): SequenceDiagram[] {
        const elements = this.parseDocument(document);
        const sequenceDiagrams: SequenceDiagram[] = [];

        const extractFromElements = (elems: SysMLElement[]) => {
            for (const element of elems) {
                if (element.type === 'interaction') {
                    const participants: Participant[] = [];
                    const messages: Message[] = [];

                    // Extract participants and messages from interaction children
                    this.extractInteractionElements(element, participants, messages);

                    sequenceDiagrams.push({
                        name: element.name,
                        participants,
                        messages: messages.sort((a, b) => a.occurrence - b.occurrence),
                        range: element.range
                    });
                } else if (element.type === 'action' && this.hasSequentialFlow(element)) {
                    // Also extract action sequences that represent sequential workflows
                    const participants: Participant[] = [];
                    const messages: Message[] = [];

                    this.extractActionSequence(element, participants, messages);

                    if (participants.length > 1 && messages.length > 0) {
                        sequenceDiagrams.push({
                            name: `${element.name  } (Action Sequence)`,
                            participants,
                            messages: messages.sort((a, b) => a.occurrence - b.occurrence),
                            range: element.range
                        });
                    }
                }

                // Recursively check children
                extractFromElements(element.children);
            }
        };

        extractFromElements(elements);
        return sequenceDiagrams;
    }

    /**
     * Extracts activity diagrams from the SysML model using ANTLR parsing.
     * @param document The VS Code text document to extract from
     * @returns Array of activity diagrams found in the model
     */
    public extractActivityDiagrams(document: vscode.TextDocument): ActivityDiagram[] {
        const elements = this.parseDocument(document);
        const activityDiagrams: ActivityDiagram[] = [];

        const extractFromElements = (elems: SysMLElement[]) => {
            for (const element of elems) {
                if (element.type === 'action' && this.hasActivityFlow(element)) {
                    const actions: ActivityAction[] = [];
                    const flows: ControlFlow[] = [];
                    const decisions: DecisionNode[] = [];
                    const states: ActivityState[] = [];

                    // Extract activity elements from action children
                    this.extractActivityElements(element, actions, flows, decisions, states);

                    if (actions.length > 0 || decisions.length > 0 || states.length > 0) {
                        activityDiagrams.push({
                            name: element.name,
                            actions,
                            flows,
                            decisions,
                            states,
                            range: element.range
                        });
                    }
                }

                // Recursively check children
                extractFromElements(element.children);
            }
        };

        extractFromElements(elements);
        return activityDiagrams;
    }

    /**
     * Checks if an action element has activity flow characteristics.
     */
    private hasActivityFlow(element: SysMLElement): boolean {
        // Check for sequential steps, control flow, or decision logic
        const hasSequentialSteps = element.children.some(child => {
            return child.name.match(/^\d+\./) || child.attributes.has('step') || child.attributes.has('sequence');
        });

        const hasControlFlow = element.children.some(child => {
            return child.type === 'if' || child.type === 'while' || child.type === 'for' ||
                child.name.toLowerCase().includes('then') || child.name.toLowerCase().includes('next') ||
                child.name.toLowerCase().includes('first') || child.name.toLowerCase().includes('done');
        });

        const hasNestedActions = element.children.some(child => child.type === 'action');

        // Check for SysML v2 activity keywords in element body
        const hasActivityKeywords = element.children.some(child => {
            return child.name.match(/\b(first|then|done|while|if|else|perform|action)\b/i);
        });

        return hasSequentialSteps || hasControlFlow || hasNestedActions || hasActivityKeywords || element.children.length > 2;
    }

    /**
     * Extracts activity elements from an action element and its children.
     */
    private extractActivityElements(
        action: SysMLElement,
        actions: ActivityAction[],
        flows: ControlFlow[],
        decisions: DecisionNode[],
        states: ActivityState[]
    ): void {
        const processElements = (elems: SysMLElement[], depth: number = 0) => {
            for (let i = 0; i < elems.length; i++) {
                const element = elems[i];

                // Identify private actions within action definitions
                if (element.type === 'action' || element.name.match(/^\d+\./) || element.attributes.has('step')) {
                    // Check if this is a decision action (inherits from DecisionAction)
                    const isDecisionAction = element.attributes.get('specialization')?.toString()?.includes('DecisionAction') ||
                                           element.attributes.get('type')?.toString()?.includes('DecisionAction') ||
                                           element.name.toLowerCase().includes('decision') ||
                                           element.name.toLowerCase().includes('check') ||
                                           element.name.toLowerCase().includes('gate');

                    if (isDecisionAction) {
                        const condition = element.attributes.get('condition')?.toString() ||
                                        element.attributes.get('doc')?.toString() ||
                                        'decision condition';
                        decisions.push({
                            name: element.name || `Decision${decisions.length + 1}`,
                            condition,
                            branches: [], // Will be populated by flow processing
                            range: element.range
                        });
                    } else {
                        // Regular action
                        const isComposite = element.children.some(child => child.type === 'action');

                        actions.push({
                            name: element.name || `Action${actions.length + 1}`,
                            type: 'action',
                            condition: element.attributes.get('description')?.toString() ||
                                      element.attributes.get('doc')?.toString() ||
                                      element.name,
                            range: element.range,
                            isDefinition: element.attributes.get('isDefinition') === 'true',
                            inputs: this.extractParameters(element, 'in'),
                            outputs: this.extractParameters(element, 'out'),
                            subActions: isComposite ? this.extractSubActions(element) : undefined
                        });
                    }
                }

                // Identify explicit control flows (first...then patterns)
                const flowPatterns = this.extractFlowPatterns(element);
                flows.push(...flowPatterns);

                // Legacy decision handling for backward compatibility
                if (element.type === 'if' ||
                    (element.name.toLowerCase().includes('if') && !element.name.toLowerCase().includes('decision'))) {
                    const condition = element.attributes.get('condition')?.toString() ||
                                    element.attributes.get('doc')?.toString() ||
                                    'condition';
                    decisions.push({
                        name: element.name || `Decision${decisions.length + 1}`,
                        condition,
                        branches: [
                            { condition: 'true', target: 'continue' },
                            { condition: 'false', target: 'alternate' }
                        ],
                        range: element.range
                    });
                }

                // Identify states - loops, waits, or state-like elements
                if (element.type === 'while' || element.type === 'for' || element.type === 'state' ||
                    element.name.toLowerCase().includes('loop') ||
                    element.name.toLowerCase().includes('while') ||
                    element.name.toLowerCase().includes('state')) {
                    states.push({
                        name: element.name || `State${states.length + 1}`,
                        type: 'intermediate',
                        doActivity: element.attributes.get('activity')?.toString() ||
                                   element.attributes.get('doc')?.toString() ||
                                   element.name,
                        range: element.range
                    });
                }

                // Identify control flows - then/first/done keywords
                if (element.name.toLowerCase().includes('then') ||
                    element.name.toLowerCase().includes('first') ||
                    element.name.toLowerCase().includes('done') ||
                    element.name.includes('->')) {
                    const fromAction = actions[actions.length - 1];
                    if (fromAction) {
                        flows.push({
                            from: fromAction.name,
                            to: element.attributes.get('target')?.toString() || 'next',
                            condition: element.attributes.get('guard')?.toString(),
                            range: element.range
                        });
                    }
                }

                // Recursively process children
                if (element.children.length > 0) {
                    processElements(element.children, depth + 1);
                }
            }
        };

        processElements(action.children);
    }

    /**
     * Extracts input or output parameters from an action element.
     */
    private extractParameters(element: SysMLElement, direction: 'in' | 'out'): string[] {
        const parameters: string[] = [];

        element.children.forEach(child => {
            // Look for parameter declarations or attribute that match direction
            const paramDirection = child.attributes.get('direction')?.toString();
            const paramName = child.attributes.get('parameterName')?.toString() || child.name;
            const paramType = child.attributes.get('parameterType')?.toString() ||
                             child.attributes.get('type')?.toString();

            if (paramDirection === direction && paramName && paramType) {
                parameters.push(`${paramName}: ${paramType}`);
            } else if (child.type === direction && paramName) {
                // Fallback: look for child elements typed as 'in' or 'out'
                parameters.push(paramType ? `${paramName}: ${paramType}` : paramName);
            }
        });

        return parameters;
    }

    /**
     * Extracts sub-actions from a composite action element.
     */
    private extractSubActions(element: SysMLElement): ActivityAction[] {
        const subActions: ActivityAction[] = [];

        element.children.forEach(child => {
            if (child.type === 'action' && child.name) {
                subActions.push({
                    name: child.name,
                    type: 'action',
                    condition: child.attributes.get('doc')?.toString() || child.name,
                    range: child.range,
                    isDefinition: child.attributes.get('isDefinition') === 'true',
                    inputs: this.extractParameters(child, 'in'),
                    outputs: this.extractParameters(child, 'out')
                });
            }
        });

        return subActions;
    }

    /**
     * Extracts explicit flow patterns (first...then relationships) from an element.
     */
    private extractFlowPatterns(element: SysMLElement): ControlFlow[] {
        const flows: ControlFlow[] = [];

        // Check if element represents a flow relationship
        const flowKeywords = ['first', 'then', 'done'];
        const elementName = element.name.toLowerCase();

        // Look for flow attributes or relationships
        const fromAction = element.attributes.get('fromAction')?.toString();
        const toAction = element.attributes.get('toAction')?.toString();
        const flowCondition = element.attributes.get('condition')?.toString();

        if (fromAction && toAction) {
            flows.push({
                from: fromAction,
                to: toAction,
                condition: flowCondition,
                range: element.range
            });
        }

        // Check for flow keywords in element structure
        if (flowKeywords.some(keyword => elementName.includes(keyword))) {
            // Extract flow information from element relationships or attributes
            const target = element.attributes.get('target')?.toString() ||
                          element.attributes.get('next')?.toString();
            const source = element.attributes.get('source')?.toString() ||
                          element.attributes.get('previous')?.toString();

            if (source && target) {
                flows.push({
                    from: source,
                    to: target,
                    condition: flowCondition,
                    range: element.range
                });
            }
        }

        return flows;
    }

    /**
     * Extracts participants and messages from an interaction element and its children.
     */
    private extractInteractionElements(interaction: SysMLElement, participants: Participant[], messages: Message[]): void {
        // Process direct children
        for (const child of interaction.children) {
            if (child.type === 'participant') {
                participants.push({
                    name: child.name,
                    type: child.attributes.get('participantType')?.toString() || 'participant',
                    range: child.range
                });
            } else if (child.type === 'message') {
                messages.push({
                    name: child.name,
                    from: child.attributes.get('from')?.toString() || '',
                    to: child.attributes.get('to')?.toString() || '',
                    payload: child.attributes.get('payload')?.toString() || child.name,
                    occurrence: Number(child.attributes.get('occurrence') || messages.length + 1),
                    range: child.range
                });
            }

            // Recursively process nested elements
            this.extractInteractionElements(child, participants, messages);
        }
    }

    /**
     * Checks if an action element represents a sequential workflow suitable for sequence diagrams.
     */
    private hasSequentialFlow(element: SysMLElement): boolean {
        // Check if action contains sequential keywords or patterns
        const elementText = element.name.toLowerCase();
        const hasSequentialKeywords = elementText.includes('sequence') ||
                                     elementText.includes('workflow') ||
                                     elementText.includes('process');

        // Check if it has multiple child actions that could represent steps
        const childActions = element.children.filter(child => child.type === 'action');
        const hasMultipleSteps = childActions.length >= 2;

        // Check for part definitions that could be participants
        const potentialParticipants = element.children.filter(child =>
            child.type === 'part' || child.type === 'participant'
        );
        const hasParticipants = potentialParticipants.length >= 1;

        return hasSequentialKeywords || (hasMultipleSteps && hasParticipants);
    }

    /**
     * Extracts sequence diagram data from action elements that represent workflows.
     */
    private extractActionSequence(action: SysMLElement, participants: Participant[], messages: Message[]): void {
        // Find potential participants (parts, actors, subjects)
        this.findParticipantsInAction(action, participants);

        // Extract sequential steps as messages
        const occurrence = 1;
        this.extractSequentialMessages(action, messages, occurrence, participants);
    }

    /**
     * Finds participants (actors, parts, subjects) in an action element.
     */
    private findParticipantsInAction(element: SysMLElement, participants: Participant[]): void {
        for (const child of element.children) {
            if (child.type === 'part' || child.type === 'participant') {
                participants.push({
                    name: child.name,
                    type: child.type,
                    range: child.range
                });
            }

            // Recursively search for participants in nested elements
            this.findParticipantsInAction(child, participants);
        }

        // If no explicit participants found, infer from action structure
        if (participants.length === 0) {
            // Add a default "System" participant
            participants.push({
                name: 'System',
                type: 'system',
                range: element.range
            });
        }
    }

    /**
     * Extracts messages from sequential action steps.
     */
    private extractSequentialMessages(element: SysMLElement, messages: Message[], occurrence: number, participants: Participant[]): number {
        for (const child of element.children) {
            if (child.type === 'action') {
                // Create message for this action step
                const fromParticipant = this.inferFromParticipant(child, participants);
                const toParticipant = this.inferToParticipant(child, participants);

                messages.push({
                    name: child.name,
                    from: fromParticipant,
                    to: toParticipant,
                    payload: this.extractActionDescription(child),
                    occurrence: occurrence++,
                    range: child.range
                });
            }

            // Recurse into nested elements
            occurrence = this.extractSequentialMessages(child, messages, occurrence, participants);
        }
        return occurrence;
    }

    /**
     * Infers the "from" participant for an action message.
     */
    private inferFromParticipant(action: SysMLElement, participants: Participant[]): string {
        // Try to infer from action name or context
        const actionName = action.name.toLowerCase();

        for (const participant of participants) {
            if (actionName.includes(participant.name.toLowerCase())) {
                return participant.name;
            }
        }

        // Default to first participant or "System"
        return participants.length > 0 ? participants[0].name : 'System';
    }

    /**
     * Infers the "to" participant for an action message.
     */
    private inferToParticipant(action: SysMLElement, participants: Participant[]): string {
        // If only one participant, messages are self-directed
        if (participants.length <= 1) {
            return participants.length > 0 ? participants[0].name : 'System';
        }

        // Try to infer target from action name
        const actionName = action.name.toLowerCase();
        const fromParticipant = this.inferFromParticipant(action, participants);

        for (const participant of participants) {
            if (participant.name !== fromParticipant &&
                actionName.includes(participant.name.toLowerCase())) {
                return participant.name;
            }
        }

        // Default to next participant in the list
        const fromIndex = participants.findIndex(p => p.name === fromParticipant);
        const nextIndex = (fromIndex + 1) % participants.length;
        return participants[nextIndex].name;
    }

    /**
     * Extracts a meaningful description from an action element.
     */
    private extractActionDescription(action: SysMLElement): string {
        // Look for documentation or comments first
        for (const [key, value] of action.attributes) {
            if (key === 'doc' && typeof value === 'string') {
                return value;
            }
        }

        // Clean up the action name
        return action.name.replace(/^action\s+/i, '').trim();
    }

    /**
     * Builds hierarchical structure from parsed elements.
     */
    private buildHierarchy(): SysMLElement[] {
        // Elements are already organized hierarchically by the visitor
        // Just return the root-level elements (those without a parent)
        const roots: SysMLElement[] = [];

        for (const [, element] of this.elements) {
            roots.push(element);
        }

        return roots;
    }

    /**
     * Gets all parsed relationships between elements.
     */
    public getRelationships(): Relationship[] {
        return [...this.relationships];
    }
}

/**
 * ANTLR visitor implementation for extracting SysML elements.
 */
class SysMLElementVisitor extends AbstractParseTreeVisitor<void> implements SysMLv2Visitor<void> {
    private currentNamespace: string[] = [];
    private parentStack: SysMLElement[] = [];
    private currentElement: SysMLElement | null = null;
    private libraryIndexer: LibraryIndexer;

    constructor(
        private _document: vscode.TextDocument,
        private elements: Map<string, SysMLElement>,
        private relationships: Relationship[]
    ) {
        super();
        this.libraryIndexer = LibraryIndexer.getInstance();
    }

    public visit(tree: any): void {
        super.visit(tree);
    }

    // visitElement to properly dispatch to specific element handlers
    visitElement(ctx: any): void {
        // Check which specific element type is present and dispatch manually
        // This is needed because keywords like 'package' can be valid identifiers
        // and the grammar may not always dispatch correctly to sub-rules
        try {
            if (ctx.packageElement && typeof ctx.packageElement === 'function') {
                const pkgCtx = ctx.packageElement();
                if (pkgCtx) {
                    this.visitPackageElement(pkgCtx);
                    return;
                }
            }
        } catch {
            // Fall through to visitChildren
        }

        // For other elements, use default behavior
        this.visitChildren(ctx);
    }

    /**
     * Converts ANTLR position to VS Code Range.
     */
    private getRange(ctx: any): vscode.Range {
        if (ctx.start && ctx.stop) {
            const startPos = new vscode.Position(
                ctx.start.line - 1,
                ctx.start.charPositionInLine
            );
            const endPos = new vscode.Position(
                ctx.stop.line - 1,
                ctx.stop.charPositionInLine + ctx.stop.text.length
            );
            return new vscode.Range(startPos, endPos);
        }
        return new vscode.Range(0, 0, 0, 0);
    }

    /**
     * Extracts element name from context.
     */
    private getElementName(ctx: any): string {
        // SysML keywords that should NOT be used as element names
        const KEYWORDS = new Set([
            'action', 'def', 'part', 'package', 'state', 'transition', 'entry', 'exit', 'do',
            'attribute', 'port', 'item', 'connection', 'interface', 'requirement', 'use', 'case',
            'exhibit', 'perform', 'accept', 'send', 'flow', 'bind', 'succession', 'first', 'then',
            'if', 'else', 'while', 'for', 'return', 'abstract', 'variation', 'enum', 'ref', 'in',
            'out', 'inout', 'private', 'protected', 'public', 'readonly', 'derived', 'end',
            'doc', 'comment', 'language', 'import', 'from', 'as', 'namespace', 'member', 'alias',
            'specializes', 'subsets', 'references', 'redefines', 'typing', 'feature', 'step',
            'objective', 'subject', 'actor', 'stakeholder', 'concern', 'frame', 'rendering'
        ]);

        // Helper to strip quotes from quoted strings
        const stripQuotes = (text: string): string => {
            if ((text.startsWith("'") && text.endsWith("'")) ||
                (text.startsWith('"') && text.endsWith('"'))) {
                return text.slice(1, -1);
            }
            return text;
        };

        // Try to find identifier in various ways
        // Note: ctx.identifier() can throw if the node doesn't exist due to parse errors
        if (ctx.identifier && typeof ctx.identifier === 'function') {
            try {
                const identifierCtx = ctx.identifier();
                if (identifierCtx) {
                    // Check for STRING token (quoted identifier) first
                    if (identifierCtx.STRING && typeof identifierCtx.STRING === 'function') {
                        const stringNode = identifierCtx.STRING();
                        if (stringNode && stringNode.text) {
                            return stripQuotes(stringNode.text);
                        }
                    }
                    // IdentifierContext has an IDENTIFIER() method that returns TerminalNode
                    if (identifierCtx.IDENTIFIER && typeof identifierCtx.IDENTIFIER === 'function') {
                        const identifierNode = identifierCtx.IDENTIFIER();
                        if (identifierNode && identifierNode.text && !KEYWORDS.has(identifierNode.text.toLowerCase())) {
                            return identifierNode.text;
                        }
                    }
                }
            } catch {
                // identifier() can throw if node doesn't exist - continue to fallbacks
            }
        }
        if (ctx.IDENTIFIER && typeof ctx.IDENTIFIER === 'function') {
            try {
                const identifierNode = ctx.IDENTIFIER();
                if (identifierNode && identifierNode.text && !KEYWORDS.has(identifierNode.text.toLowerCase())) {
                    return identifierNode.text;
                }
            } catch {
                // IDENTIFIER() can throw if node doesn't exist
            }
        }
        // Check for STRING token (quoted identifier) directly on context
        if (ctx.STRING && typeof ctx.STRING === 'function') {
            try {
                const stringNode = ctx.STRING();
                if (stringNode && stringNode.text) {
                    return stripQuotes(stringNode.text);
                }
            } catch {
                // STRING() can throw if node doesn't exist
            }
        }
        if (ctx.children && ctx.children.length > 0) {
            // Look for STRING tokens (quoted identifiers) in children first
            for (const child of ctx.children) {
                if (child.symbol && child.symbol.type === SysMLv2Lexer.STRING) {
                    const text = child.text;
                    if (text) {
                        return stripQuotes(text);
                    }
                }
            }
            // Look for identifier in children - skip keywords
            for (const child of ctx.children) {
                if (child.symbol && child.symbol.type === SysMLv2Lexer.IDENTIFIER) {
                    const text = child.text;
                    if (text && !KEYWORDS.has(text.toLowerCase()) && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text)) {
                        return text;
                    }
                }
            }
            // Enhanced fallback: look for quoted strings
            for (const child of ctx.children) {
                if (child.text && (child.text.startsWith("'") || child.text.startsWith('"'))) {
                    return stripQuotes(child.text);
                }
            }
            // Enhanced fallback: look for text that looks like identifiers (but not keywords)
            for (const child of ctx.children) {
                if (child.text && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(child.text)) {
                    const text = child.text;
                    if (!KEYWORDS.has(text.toLowerCase())) {
                        return text;
                    }
                }
            }
            // Check grandchildren
            for (const child of ctx.children) {
                if (child.children && child.children.length > 0) {
                    for (const grandchild of child.children) {
                        // Check for quoted strings in grandchildren
                        if (grandchild.text && (grandchild.text.startsWith("'") || grandchild.text.startsWith('"'))) {
                            return stripQuotes(grandchild.text);
                        }
                        if (grandchild.text && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(grandchild.text)) {
                            const text = grandchild.text;
                            if (!KEYWORDS.has(text.toLowerCase())) {
                                return text;
                            }
                        }
                    }
                }
            }
        }
        return 'unnamed';
    }

    /**
     * Creates a SysML element and adds it to the collection or parent's children.
     */
    private createElement(type: string, ctx: any, attributes: Map<string, any> = new Map()): SysMLElement {
        const name = this.getElementName(ctx);
        const range = this.getRange(ctx);
        const fullName = [...this.currentNamespace, name].join('.');

        const element: SysMLElement = {
            type,
            name,
            range,
            children: [],
            attributes,
            relationships: []
        };

        // Extract typing information (e.g., "subject subjectName : SubjectType" -> typing = "SubjectType")
        if (ctx.typing && typeof ctx.typing === 'function') {
            try {
                const typingCtx = ctx.typing();
                if (typingCtx) {
                    const typeName = this.extractQualifiedName(typingCtx);
                    if (typeName) {
                        (element as any).typing = typeName;
                    }
                }
            } catch {
                // typing() can throw if node doesn't exist
            }
        }

        // Extract doc content from source text (handles doc followed by block comments)
        this.extractDocFromSourceText(element, ctx);

        // Check if element or its specializations are in standard library
        this.enrichWithLibraryValidation(element, ctx);

        // If we have a parent element, add this as a child
        if (this.parentStack.length > 0) {
            const parent = this.parentStack[this.parentStack.length - 1];
            parent.children.push(element);
        } else {
            // Only add to root elements if there's no parent
            this.elements.set(fullName, element);
        }

        return element;
    }

    /**
     * Extract doc content from source text.
     * Looks for 'doc' keyword followed by block comments in the element's body.
     */
    private extractDocFromSourceText(element: SysMLElement, ctx: any): void {
        try {
            if (!ctx || !ctx.start || !ctx.stop) {
                return;
            }

            // Get the range of the element
            const startLine = ctx.start.line - 1;
            const endLine = ctx.stop.line - 1;

            // Read the element's source text
            const textRange = new vscode.Range(startLine, 0, endLine + 1, 0);
            const text = this._document.getText(textRange);

            // Look for 'doc' keyword followed by block comment
            // Pattern: doc followed by optional whitespace and newlines, then /* ... */
            const docPattern = /\bdoc\s*\n?\s*(\/\*[\s\S]*?\*\/)/;
            const docMatch = text.match(docPattern);

            if (docMatch && docMatch[1]) {
                let docContent = docMatch[1];
                // Remove /* and */ markers
                docContent = docContent.replace(/^\/\*/, '').replace(/\*\/$/, '');
                // Clean up leading * characters on each line (common doc format)
                docContent = docContent.split('\n')
                    .map(line => line.replace(/^\s*\*\s?/, '').trim())
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (docContent) {
                    element.attributes.set('doc', docContent);
                }
            }
        } catch {
            // Silently ignore doc extraction errors
        }
    }

    /**
     * Enrich element with library validation metadata
     */
    private enrichWithLibraryValidation(element: SysMLElement, ctx: any): void {
        // Check if the element name itself is a standard library type
        if (this.libraryIndexer.isStandardElement(element.name)) {
            element.attributes.set('isStandardType', true);
            const libraryElement = this.libraryIndexer.lookup(element.name);
            if (libraryElement) {
                element.attributes.set('libraryKind', libraryElement.kind);
                element.attributes.set('libraryFile', libraryElement.filePath);
            }
        }

        // Check specializations (typing, :>, etc.)
        if (ctx.typing && typeof ctx.typing === 'function') {
            try {
                const typingCtx = ctx.typing();
                if (typingCtx) {
                    const typeName = this.extractQualifiedName(typingCtx);
                    if (typeName && this.libraryIndexer.isStandardElement(typeName)) {
                        element.attributes.set('isStandardElement', true);
                        const chain = this.libraryIndexer.getSpecializationChain(typeName);
                        if (chain.length > 0) {
                            element.attributes.set('specializationChain', chain.join(' :> '));
                        }
                    }
                }
            } catch {
                // typing() can throw if node doesn't exist
            }
        }

        if (ctx.specialization && typeof ctx.specialization === 'function') {
            try {
                const specializationCtxs = ctx.specialization();
                if (specializationCtxs) {
                    const specArray = Array.isArray(specializationCtxs) ? specializationCtxs : [specializationCtxs];
                    for (const specCtx of specArray) {
                        const specName = this.extractQualifiedName(specCtx);
                        if (specName && this.libraryIndexer.isStandardElement(specName)) {
                            element.attributes.set('isStandardElement', true);
                            const chain = this.libraryIndexer.getSpecializationChain(specName);
                            if (chain.length > 0) {
                                element.attributes.set('specializationChain', chain.join(' :> '));
                            }
                            break; // Only need one match
                        }
                    }
                }
            } catch {
                // specialization() can throw if node doesn't exist
            }
        }
    }

    /**
     * Extract qualified name from context (handles :: separated names)
     */
    private extractQualifiedName(ctx: any): string | null {
        if (!ctx) {
            return null;
        }

        // Try to get qualifiedName child
        if (ctx.qualifiedName && typeof ctx.qualifiedName === 'function') {
            try {
                const qnCtx = ctx.qualifiedName();
                if (qnCtx && qnCtx.text) {
                    return qnCtx.text;
                }
            } catch {
                // qualifiedName() can throw if node doesn't exist
            }
        }

        // Try to get identifier
        if (ctx.identifier && typeof ctx.identifier === 'function') {
            try {
                const idCtx = ctx.identifier();
                if (idCtx && idCtx.text) {
                    return idCtx.text;
                }
            } catch {
                // identifier() can throw if node doesn't exist
            }
        }

        // Fallback to text
        return ctx.text || null;
    }

    // Visit methods for different SysML constructs
    visitPackageElement(ctx: any): void {
        const name = this.getElementName(ctx);
        this.currentNamespace.push(name);

        const packageElement = this.createElement('package', ctx, new Map([
            ['isNamespace', true]
        ]));

        // Push package to parent stack so children are added to it
        this.parentStack.push(packageElement);
        this.visitChildren(ctx);
        this.parentStack.pop();

        this.currentNamespace.pop();
    }

    visitPartDefinition(ctx: any): void {
        const attributes = new Map<string, any>();

        // Check for modifiers
        if (ctx.abstract && typeof ctx.abstract === 'function') {
            try {
                const abstractCtx = ctx.abstract();
                if (abstractCtx) {
                    attributes.set('modifier', 'abstract');
                }
            } catch {
                // abstract() can throw if node doesn't exist
            }
        }

        const element = this.createElement('part def', ctx, attributes);
        this.parentStack.push(element);

        // Set current element so relationships can be associated with it
        const prevCurrentElement = this.currentElement;
        this.currentElement = element;

        this.visitChildren(ctx);

        // Restore previous current element
        this.currentElement = prevCurrentElement;
        this.parentStack.pop();
    }

    visitPartUsage(ctx: any): void {
        const _name = this.getElementName(ctx);
        const element = this.createElement('part', ctx);

        // Extract metadata prefix (e.g., #logical, #physical)
        try {
            const metadataPrefix = ctx.metadataPrefix?.();
            if (metadataPrefix) {
                const prefixId = metadataPrefix.identifier?.();
                if (prefixId) {
                    element.attributes.set('metadataPrefix', prefixId.getText());
                }
            }
        } catch {
            // Ignore errors extracting metadata prefix
        }

        this.parentStack.push(element);

        // Set current element so relationships can be associated with it
        const prevCurrentElement = this.currentElement;
        this.currentElement = element;

        this.visitChildren(ctx);

        // Restore previous current element
        this.currentElement = prevCurrentElement;
        this.parentStack.pop();
    }

    /**
     * Extracts "then action X;" patterns from an action definition body.
     * These are SysML v2 succession statements that may not be parsed as separate action nodes.
     */
    private extractThenActionPatterns(ctx: any, parentElement: SysMLElement): void {
        // Get the original text with whitespace from the input stream
        if (!ctx || !ctx.start || !ctx.stop) {
            return;
        }

        let text: string;
        try {
            // Get text from the input stream which preserves whitespace
            const inputStream = ctx.start.inputStream;
            if (inputStream && typeof inputStream.getText === 'function') {
                text = inputStream.getText(ctx.start, ctx.stop);
            } else {
                // Fallback to getText() which strips whitespace
                text = ctx.getText?.() || '';
            }
        } catch {
            text = ctx.getText?.() || '';
        }

        if (!text) {
            return;
        }

        // Look for "then action X" patterns - handle both with and without whitespace
        // Pattern: thenaction<name> (no spaces due to ANTLR getText) or then action <name>
        const thenActionRegex = /then\s*action\s*(\w+)/gi;
        let match;

        // Track existing children to avoid duplicates
        const existingChildren = new Set(parentElement.children.map(c => c.name));

        while ((match = thenActionRegex.exec(text)) !== null) {
            const actionName = match[1];

            // Skip if already added as a child
            if (existingChildren.has(actionName)) {
                continue;
            }

            // Create a child action element
            const childAction: SysMLElement = {
                type: 'action',
                name: actionName,
                range: parentElement.range, // Use parent range as approximation
                attributes: new Map([
                    ['isDefinition', 'false'],
                    ['isThenAction', 'true']
                ]),
                children: [],
                relationships: []
            };

            parentElement.children.push(childAction);
            existingChildren.add(actionName);
        }
    }

    visitActionDefinition(ctx: any): void {
        const element = this.createElement('action', ctx);

        // Mark as definition for activity diagrams
        element.attributes.set('isDefinition', 'true');

        // Extract visibility (private, public, etc.)
        const visibility = this.extractVisibility(ctx);
        if (visibility) {
            element.attributes.set('visibility', visibility);
        }

        // Check for specialization (e.g., DecisionAction inheritance)
        const specialization = this.extractSpecialization(ctx);
        if (specialization) {
            element.attributes.set('specialization', specialization);
        }

        this.parentStack.push(element);
        this.visitChildren(ctx);

        // Extract nested "then action X;" patterns from raw text
        // These may not be parsed as separate actionUsage nodes
        this.extractThenActionPatterns(ctx, element);

        this.parentStack.pop();
    }

    visitActionUsage(ctx: any): void {
        const element = this.createElement('action', ctx);

        // Mark as usage (not definition)
        element.attributes.set('isDefinition', 'false');

        // Extract visibility
        const visibility = this.extractVisibility(ctx);
        if (visibility) {
            element.attributes.set('visibility', visibility);
        }

        // Check for type reference (e.g., action : ActionType)
        const actionType = this.extractActionType(ctx);
        if (actionType) {
            element.attributes.set('type', actionType);
        }


        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitDefinition(ctx: any): void {
        // Generic definition handler - creates element based on context
        // This handles bare "def Name" declarations without specific type keywords
        const element = this.createElement('definition', ctx);
        element.attributes.set('isDefinition', 'true');

        // Extract visibility
        const visibility = this.extractVisibility(ctx);
        if (visibility) {
            element.attributes.set('visibility', visibility);
        }

        // Extract specialization
        const specialization = this.extractSpecialization(ctx);
        if (specialization) {
            element.attributes.set('specialization', specialization);
        }

        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitIndividualDefinition(ctx: any): void {
        // Individual definition handler - creates element for "individual def Name"
        const element = this.createElement('individual', ctx);
        element.attributes.set('isDefinition', 'true');
        element.attributes.set('isIndividual', 'true');

        // Extract visibility
        const visibility = this.extractVisibility(ctx);
        if (visibility) {
            element.attributes.set('visibility', visibility);
        }

        // Extract specialization
        const specialization = this.extractSpecialization(ctx);
        if (specialization) {
            element.attributes.set('specialization', specialization);
        }

        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitStateDefinition(ctx: any): void {
        const element = this.createElement('state', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitStateUsage(ctx: any): void {
        const element = this.createElement('state', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitStateTransition(ctx: any): void {
        const element = this.createElement('transition', ctx);
        let fromState: string | null = null;
        let toState: string | null = null;

        // Extract from state (if present)
        if (ctx.fromState && typeof ctx.fromState === 'function') {
            try {
                const fromCtx = ctx.fromState();
                if (fromCtx) {
                    // Try multiple ways to get the identifier text
                    if (fromCtx.identifier && typeof fromCtx.identifier === 'function') {
                        const idCtx = fromCtx.identifier();
                        if (idCtx) {
                            // Check if it's an array
                            const idNode = Array.isArray(idCtx) ? idCtx[0] : idCtx;
                            if (idNode && typeof idNode.getText === 'function') {
                                fromState = idNode.getText();
                            } else if (idNode && idNode.text) {
                                fromState = idNode.text;
                            } else if (typeof idNode === 'string') {
                                fromState = idNode;
                            }
                        }
                    } else if (typeof fromCtx.getText === 'function') {
                        // Fallback: get text directly from fromState context (includes 'first' keyword)
                        const text = fromCtx.getText();
                        // Remove 'first' keyword if present
                        fromState = text.replace(/^first\s*/i, '');
                    }
                    if (fromState) {
                        element.attributes.set('fromState', fromState);
                    }
                }
            } catch {
                // Silently continue on extraction errors
            }
        }

        // Extract to state
        if (ctx.toState && typeof ctx.toState === 'function') {
            try {
                const toCtx = ctx.toState();
                if (toCtx) {
                    // Try multiple ways to get the identifier text
                    if (toCtx.identifier && typeof toCtx.identifier === 'function') {
                        const idCtx = toCtx.identifier();
                        if (idCtx) {
                            // Check if it's an array
                            const idNode = Array.isArray(idCtx) ? idCtx[0] : idCtx;
                            if (idNode && typeof idNode.getText === 'function') {
                                toState = idNode.getText();
                            } else if (idNode && idNode.text) {
                                toState = idNode.text;
                            } else if (typeof idNode === 'string') {
                                toState = idNode;
                            }
                        }
                    } else if (typeof toCtx.getText === 'function') {
                        // Fallback: get text directly from toState context (includes 'then'/'to' keyword)
                        const text = toCtx.getText();
                        // Remove 'then' or 'to' keyword if present
                        toState = text.replace(/^(then|to)\s*/i, '');
                    }
                    if (toState) {
                        element.attributes.set('toState', toState);
                    }
                }
            } catch {
                // Silently continue on extraction errors
            }
        }

        // Also add transition to relationships for use by views that query relationships
        if (fromState && toState) {
            this.relationships.push({
                type: 'transition',
                source: fromState,
                target: toState
            });
        }

        // Extract trigger condition (if present)
        if (ctx.transitionTrigger && typeof ctx.transitionTrigger === 'function') {
            try {
                const triggerCtx = ctx.transitionTrigger();
                if (triggerCtx && triggerCtx.expression && typeof triggerCtx.expression === 'function') {
                    const exprCtx = triggerCtx.expression();
                    if (exprCtx && typeof exprCtx.getText === 'function') {
                        element.attributes.set('trigger', exprCtx.getText());
                    }
                }
            } catch {
                // transitionTrigger() can throw if node doesn't exist due to parse errors
            }
        }

        this.visitChildren(ctx);
    }

    visitRequirementDefinition(ctx: any): void {
        const element = this.createElement('requirement def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitRequirementUsage(ctx: any): void {
        const element = this.createElement('requirement', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitUseCaseDefinition(ctx: any): void {
        const element = this.createElement('use case', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitUseCaseUsage(ctx: any): void {
        const element = this.createElement('use case', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitActorDefinition(ctx: any): void {
        const element = this.createElement('actor def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitActorUsage(ctx: any): void {
        const element = this.createElement('actor usage', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitInterfaceDefinition(ctx: any): void {
        const element = this.createElement('interface', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitInterfaceUsage(ctx: any): void {
        const element = this.createElement('interface', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();

        // After visiting children, check if interface has connect children
        // and copy their from/to to the interface element for visualization
        const connectChildren = element.children.filter(c => c.type === 'connect');
        if (connectChildren.length > 0) {
            const connect = connectChildren[0];
            const fromAttr = connect.attributes.get('from');
            const toAttr = connect.attributes.get('to');
            if (fromAttr && toAttr) {
                element.attributes.set('from', fromAttr);
                element.attributes.set('to', toAttr);
            }
        }
    }

    visitConstraintDefinition(ctx: any): void {
        const element = this.createElement('constraint', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitConstraintUsage(ctx: any): void {
        const element = this.createElement('constraint', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAttributeDefinition(ctx: any): void {
        const element = this.createElement('attribute', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAttributeUsage(ctx: any): void {
        const element = this.createElement('attribute', ctx);

        // Extract metadata prefix (e.g., #mop, #moe)
        try {
            const metadataPrefix = ctx.metadataPrefix?.();
            if (metadataPrefix) {
                const prefixId = metadataPrefix.identifier?.();
                if (prefixId) {
                    element.attributes.set('metadataPrefix', prefixId.getText());
                }
            }
        } catch {
            // Ignore errors extracting metadata prefix
        }

        // Set current element so relationships can be associated with it
        const prevCurrentElement = this.currentElement;
        this.currentElement = element;

        this.visitChildren(ctx);

        // Restore previous current element
        this.currentElement = prevCurrentElement;
    }

    visitPortDefinition(ctx: any): void {
        const element = this.createElement('port', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitPortUsage(ctx: any): void {
        const element = this.createElement('port', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitConnectionDefinition(ctx: any): void {
        const element = this.createElement('connection', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitConnectionUsage(ctx: any): void {
        const element = this.createElement('connection', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();

        // Try to extract inline connection syntax: connect X to Y; or connect X.port to Y.port;
        const fullText = ctx.getText?.() || '';

        // Pattern for inline connect: connect source to target (with optional qualifiers and multiplicities)
        // Examples:
        //   connect speedSensor.speedSensorPort to vehicleSoftware.vehicleController.cruiseController.speedSensorPort;
        //   connect [1] wheel1.lugNutCompositePort to [1] hub1.shankCompositePort;
        const inlineConnectMatch = fullText.match(/connect\s*(?:\[[^\]]*\])?\s*([a-zA-Z0-9_.]+)\s+to\s*(?:\[[^\]]*\])?\s*([a-zA-Z0-9_.]+)/i);

        if (inlineConnectMatch) {
            const sourceRef = inlineConnectMatch[1];
            const targetRef = inlineConnectMatch[2];

            // Store in element attributes for visualization
            element.attributes.set('from', sourceRef);
            element.attributes.set('to', targetRef);

            // Also add as a relationship
            this.relationships.push({
                type: 'connection',
                source: sourceRef,
                target: targetRef,
                name: element.name || 'connect'
            });
            return; // Don't process ends if inline syntax found
        }

        // After visiting children (which populates 'end' elements), extract endpoints
        // and create a relationship for the IBD view
        const ends = element.children.filter(c => c.type === 'end');

        if (ends.length >= 2) {
            // Get targetRef from each end's attributes
            const getRef = (end: SysMLElement): string => {
                const attrs = end.attributes;
                if (attrs instanceof Map) {
                    const ref = attrs.get('targetRef') || attrs.get('references');
                    return typeof ref === 'string' ? ref : end.name;
                } else if (typeof attrs === 'object' && attrs !== null) {
                    const record = attrs as Record<string, unknown>;
                    const ref = record['targetRef'] || record['references'];
                    return typeof ref === 'string' ? ref : end.name;
                }
                return end.name;
            };

            const sourceRef = getRef(ends[0]);
            const targetRef = getRef(ends[1]);

            if (sourceRef && targetRef) {
                this.relationships.push({
                    type: 'connection',
                    source: sourceRef,
                    target: targetRef,
                    name: element.name || 'connect'
                });
            }
        }
    }

    visitEndFeature(ctx: any): void {
        // Parse end features for connection endpoints: end name : qualified.reference;
        const attributes = new Map<string, any>();

        // Get the typing (e.g., : drone.telemetry) which contains the target reference
        if (typeof ctx.typing === 'function') {
            try {
                const typingCtx = ctx.typing();
                if (typingCtx) {
                    // The typing is in format ":qualifiedName" - get text and remove leading colon
                    const text = typingCtx.getText?.() || typingCtx.text || '';
                    if (text) {
                        const reference = text.replace(/^:/, '').trim();
                        attributes.set('targetRef', reference);
                        attributes.set('references', reference);
                    }
                }
            } catch {
                // typing() can throw if node doesn't exist
            }
        }

        this.createElement('end', ctx, attributes);
    }

    visitRedefinitionUsage(ctx: any): void {
        // Parse redefinition usage: :>> name { ... } or :>> name = value;
        // This is shorthand for 'redefines' - redefining a feature from supertype
        const attributes = new Map<string, any>();
        attributes.set('isRedefinition', 'true');

        // Get the identifier name
        let _name = 'unknown';
        if (ctx.identifier && typeof ctx.identifier === 'function') {
            try {
                const idCtx = ctx.identifier();
                if (idCtx && typeof idCtx.getText === 'function') {
                    _name = idCtx.getText();
                }
            } catch {
                // identifier() can throw if node doesn't exist
            }
        }

        // If there's a value expression (e.g., :>> voltage = 48.0)
        if (ctx.expression && typeof ctx.expression === 'function') {
            try {
                const exprCtx = ctx.expression();
                if (exprCtx && typeof exprCtx.getText === 'function') {
                    const value = exprCtx.getText();
                    attributes.set('value', value);
                }
            } catch {
                // expression() can throw if node doesn't exist
            }
        }

        const element = this.createElement('redefinition', ctx, attributes);

        // If there's a body, process its children
        if (ctx.body && typeof ctx.body === 'function') {
            const bodyCtx = ctx.body();
            if (bodyCtx) {
                this.parentStack.push(element);
                this.visit(bodyCtx);
                this.parentStack.pop();
            }
        }
    }

    visitFlowProperty(ctx: any): void {
        // Parse flow property: flow property name : Type direction in/out/inout;
        const attributes = new Map<string, any>();
        attributes.set('isFlowProperty', 'true');

        // Get direction if present
        if (ctx.direction && typeof ctx.direction === 'function') {
            try {
                const dirCtx = ctx.direction();
                if (dirCtx && typeof dirCtx.getText === 'function') {
                    attributes.set('direction', dirCtx.getText());
                }
            } catch {
                // direction() can throw if node doesn't exist
            }
        }

        this.createElement('flowProperty', ctx, attributes);
    }

    visitInteractionDefinition(ctx: any): void {
        const element = this.createElement('interaction', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitInteractionUsage(ctx: any): void {
        this.createElement('interaction', ctx);
        this.visitChildren(ctx);
    }

    visitParticipant(ctx: any): void {
        this.createElement('participant', ctx);
        this.visitChildren(ctx);
    }

    visitMessage(ctx: any): void {
        const attributes = new Map<string, any>();

        // Extract message details
        if (ctx.from && typeof ctx.from === 'function') {
            try {
                const fromCtx = ctx.from();
                if (fromCtx && typeof fromCtx.getText === 'function') {
                    attributes.set('from', fromCtx.getText());
                }
            } catch {
                // from() can throw if node doesn't exist
            }
        }
        if (ctx.to && typeof ctx.to === 'function') {
            try {
                const toCtx = ctx.to();
                if (toCtx && typeof toCtx.getText === 'function') {
                    attributes.set('to', toCtx.getText());
                }
            } catch {
                // to() can throw if node doesn't exist
            }
        }

        this.createElement('message', ctx, attributes);
        this.visitChildren(ctx);
    }

    visitCommentElement(ctx: any): void {
        this.createElement('comment', ctx);
        this.visitChildren(ctx);
    }

    visitComment(ctx: any): void {
        this.createElement('comment', ctx);
        this.visitChildren(ctx);
    }

    visitDocElement(ctx: any): void {
        // Instead of creating a separate 'doc' element, propagate doc content to parent
        this.extractDocContentToParent(ctx);
        this.visitChildren(ctx);
    }

    visitDocumentation(ctx: any): void {
        // Instead of creating a separate 'doc' element, propagate doc content to parent
        this.extractDocContentToParent(ctx);
        this.visitChildren(ctx);
    }

    /**
     * Extract documentation content and set it on the parent element.
     * This handles block comments which are on the HIDDEN channel.
     */
    private extractDocContentToParent(ctx: any): void {
        try {
            if (!ctx || !ctx.start || !ctx.stop) {
                return;
            }

            // Get the parent element from the stack
            if (this.parentStack.length === 0) {
                return;
            }
            const parentElement = this.parentStack[this.parentStack.length - 1];

            // Get the range of the doc element
            const startLine = ctx.start.line - 1;
            const endLine = ctx.stop.line - 1;

            // Read the text from the document including a few extra lines
            // to capture multi-line comments that might follow
            const textRange = new vscode.Range(startLine, 0, Math.min(endLine + 10, this._document.lineCount - 1), 1000);
            const text = this._document.getText(textRange);

            // Look for /* ... */ block comment pattern
            const blockCommentMatch = text.match(/\/\*[\s\S]*?\*\//);
            if (blockCommentMatch) {
                let docContent = blockCommentMatch[0];
                // Remove /* and */ markers
                docContent = docContent.replace(/^\/\*/, '').replace(/\*\/$/, '');
                // Clean up leading * characters on each line (common doc format)
                docContent = docContent.split('\n')
                    .map(line => line.replace(/^\s*\*\s?/, '').trim())
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (docContent) {
                    parentElement.attributes.set('doc', docContent);
                }
            }

            // Also check for stringValue in the grammar (quoted string)
            if (ctx.stringValue && typeof ctx.stringValue === 'function') {
                const stringCtx = ctx.stringValue();
                if (stringCtx) {
                    const stringText = stringCtx.getText?.() || '';
                    // Remove quotes
                    const unquoted = stringText.replace(/^["']|["']$/g, '');
                    if (unquoted) {
                        parentElement.attributes.set('doc', unquoted);
                    }
                }
            }
        } catch {
            // Silently ignore doc extraction errors
        }
    }

    visitCalculation(ctx: any): void {
        const element = this.createElement('calc def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitEnumerationDefinition(ctx: any): void {
        const element = this.createElement('enumeration def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitEnumerationUsage(ctx: any): void {
        const element = this.createElement('enumeration', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitItemDefinition(ctx: any): void {
        const element = this.createElement('item def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitItemUsage(ctx: any): void {
        const element = this.createElement('item', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitCalculationDefinition(ctx: any): void {
        const element = this.createElement('calc def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitCalculationUsage(ctx: any): void {
        const element = this.createElement('calc', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAnalysisDefinition(ctx: any): void {
        const element = this.createElement('analysis def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAnalysisUsage(ctx: any): void {
        const element = this.createElement('analysis', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAllocationDefinition(ctx: any): void {
        const element = this.createElement('allocation def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAllocationUsage(ctx: any): void {
        const element = this.createElement('allocation', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitMetadataDefinition(ctx: any): void {
        const element = this.createElement('metadata def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitMetadataUsage(ctx: any): void {
        const element = this.createElement('metadata', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitSubjectUsage(ctx: any): void {
        const element = this.createElement('subject', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitObjectiveUsage(ctx: any): void {
        const element = this.createElement('objective', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitStakeholderUsage(ctx: any): void {
        const element = this.createElement('stakeholder', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAllocateStatement(ctx: any): void {
        const element = this.createElement('allocate', ctx);
        // Extract from and to qualified names if available
        let qualifiedNames;
        try {
            qualifiedNames = ctx.qualifiedName ? ctx.qualifiedName() : [];
        } catch {
            qualifiedNames = [];
        }
        const qnArray = Array.isArray(qualifiedNames) ? qualifiedNames : (qualifiedNames ? [qualifiedNames] : []);
        if (qnArray.length >= 2) {
            if (qnArray[0] && typeof qnArray[0].getText === 'function') {
                element.attributes.set('from', qnArray[0].getText());
            }
            if (qnArray[1] && typeof qnArray[1].getText === 'function') {
                element.attributes.set('to', qnArray[1].getText());
            }
        }
        // Push element to stack so nested allocates become children
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    // Bind usage: bind sourceRef = targetRef;
    visitBindUsage(ctx: any): void {
        const element = this.createElement('bind', ctx);

        // Get qualified names: bind qn1 = qn2;
        let qualifiedNames;
        try {
            qualifiedNames = ctx.qualifiedName ? ctx.qualifiedName() : [];
        } catch {
            qualifiedNames = [];
        }
        const qnArray = Array.isArray(qualifiedNames) ? qualifiedNames : (qualifiedNames ? [qualifiedNames] : []);

        if (qnArray.length >= 2) {
            const source = qnArray[0] && typeof qnArray[0].getText === 'function' ? qnArray[0].getText() : '';
            const target = qnArray[1] && typeof qnArray[1].getText === 'function' ? qnArray[1].getText() : '';

            if (source && target) {
                element.attributes.set('from', source);
                element.attributes.set('to', target);

                // Also add as a relationship for visualization
                this.relationships.push({
                    type: 'bind',
                    source: source,
                    target: target,
                    name: element.name || 'bind'
                });
            }
        }

        this.visitChildren(ctx);
    }

    // Connect statement (inline): connect sourceRef to targetRef;
    visitConnectStatement(ctx: any): void {
        const element = this.createElement('connect', ctx);

        // Get qualified names: connect qn1 to qn2;
        let qualifiedNames;
        try {
            qualifiedNames = ctx.qualifiedName ? ctx.qualifiedName() : [];
        } catch {
            qualifiedNames = [];
        }
        const qnArray = Array.isArray(qualifiedNames) ? qualifiedNames : (qualifiedNames ? [qualifiedNames] : []);

        if (qnArray.length >= 2) {
            // Use .text property (not getText() method) for QualifiedNameContext
            const source = qnArray[0]?.text || '';
            const target = qnArray[1]?.text || '';

            if (source && target) {
                element.attributes.set('from', source);
                element.attributes.set('to', target);

                // Also add as a relationship for visualization
                this.relationships.push({
                    type: 'connection',
                    source: source,
                    target: target,
                    name: element.name || 'connect'
                });
            }
        }
        this.visitChildren(ctx);
    }

    // Behavioral Constructs
    visitPerformAction(ctx: any): void {
        const element = this.createElement('perform', ctx);
        try {
            const qualifiedName = ctx.qualifiedName ? ctx.qualifiedName() : null;
            if (qualifiedName) {
                const qn = Array.isArray(qualifiedName) ? qualifiedName[0] : qualifiedName;
                if (qn && typeof qn.getText === 'function') {
                    element.attributes.set('action', qn.getText());
                }
            }
        } catch {
            // qualifiedName might not exist - that's ok
        }
        this.visitChildren(ctx);
    }

    visitExhibitState(ctx: any): void {
        const element = this.createElement('exhibit state', ctx);
        try {
            const qualifiedName = ctx.qualifiedName ? ctx.qualifiedName() : null;
            if (qualifiedName) {
                const qn = Array.isArray(qualifiedName) ? qualifiedName[0] : qualifiedName;
                if (qn && typeof qn.getText === 'function') {
                    element.attributes.set('state', qn.getText());
                }
            }
            const parallelToken = ctx.PARALLEL ? ctx.PARALLEL() : null;
            if (parallelToken) {
                element.attributes.set('parallel', 'true');
            }
        } catch {
            // qualifiedName or PARALLEL might not exist - that's ok
        }
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitEntryAction(ctx: any): void {
        // Check if this is actually an entry action or if ANTLR is misclassifying
        const contextText = ctx.getText ? ctx.getText() : '';

        // DEBUG: Log first 5 misclassified elements
        if (this.elements.size < 5) {
            // Debug logging disabled - no action needed for small element sets
        }

        let elementType = 'entry';

        // Try to determine the correct element type based on context
        // Check for state elements FIRST (most specific to least specific)
        if (contextText.includes('state def ')) {
            elementType = 'state def';
        } else if (contextText.match(/\bstate\s+\w+\s*:/)) {
            // Pattern: state <name> : <type>
            elementType = 'state';
        } else if (contextText.includes('transition ')) {
            elementType = 'transition';
        } else if (contextText.includes('package ')) {
            elementType = 'package';
        } else if (contextText.includes('part def ')) {
            elementType = 'part def';
        } else if (contextText.includes('part ')) {
            elementType = 'part';
        } else if (contextText.includes('action def ')) {
            elementType = 'action def';
        } else if (contextText.includes('action ')) {
            elementType = 'action';
        } else if (contextText.includes('requirement def ')) {
            elementType = 'requirement def';
        } else if (contextText.includes('requirement ')) {
            elementType = 'requirement';
        }

        const element = this.createElement(elementType, ctx);
        try {
            const qualifiedName = ctx.qualifiedName ? ctx.qualifiedName() : null;
            if (qualifiedName) {
                const qn = Array.isArray(qualifiedName) ? qualifiedName[0] : qualifiedName;
                if (qn && typeof qn.getText === 'function') {
                    element.attributes.set('action', qn.getText());
                }
            }
        } catch {
            // Ignore qualifiedName extraction errors - node may not exist in all contexts
            // Silently handle missing qualifiedName nodes
        }
        this.visitChildren(ctx);
    }

    visitExitAction(ctx: any): void {
        const element = this.createElement('exit', ctx);
        try {
            const qualifiedName = ctx.qualifiedName ? ctx.qualifiedName() : null;
            if (qualifiedName) {
                const qn = Array.isArray(qualifiedName) ? qualifiedName[0] : qualifiedName;
                if (qn && typeof qn.getText === 'function') {
                    element.attributes.set('action', qn.getText());
                }
            }
        } catch {
            // Ignore qualifiedName extraction errors - node may not exist in all contexts
            // Silently handle missing qualifiedName nodes
        }
        this.visitChildren(ctx);
    }

    visitDoAction(ctx: any): void {
        const element = this.createElement('do', ctx);

        // Safely handle qualifiedName - it could be a method or property
        let qualifiedName = null;
        if (ctx.qualifiedName) {
            if (typeof ctx.qualifiedName === 'function') {
                try {
                    qualifiedName = ctx.qualifiedName();
                } catch {
                    // qualifiedName() can throw if node doesn't exist
                }
            } else {
                qualifiedName = ctx.qualifiedName;
            }
        }

        if (qualifiedName) {
            const qn = Array.isArray(qualifiedName) ? qualifiedName[0] : qualifiedName;
            // Safely check if getText exists and is a function
            if (qn && typeof qn.getText === 'function') {
                element.attributes.set('action', qn.getText());
            } else if (qn && typeof qn === 'string') {
                element.attributes.set('action', qn);
            }
        }

        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitAcceptEvent(ctx: any): void {
        const element = this.createElement('accept', ctx);

        // qualifiedName() is a method that returns an array or single context
        if (ctx.qualifiedName && typeof ctx.qualifiedName === 'function') {
            let qualifiedNames;
            try {
                qualifiedNames = ctx.qualifiedName(); // Returns array
            } catch {
                // qualifiedName() can throw if node doesn't exist
                this.visitChildren(ctx);
                return;
            }
            const qnArray = Array.isArray(qualifiedNames) ? qualifiedNames : (qualifiedNames ? [qualifiedNames] : []);

            // Pattern: accept eventName:EventType via portName
            // or: accept eventName
            if (qnArray.length >= 1 && qnArray[0] && typeof qnArray[0].getText === 'function') {
                const firstQName = qnArray[0].getText();
                // Check for type annotation (e.g., "eventName:EventType")
                if (firstQName.includes(':')) {
                    const [name, type] = firstQName.split(':');
                    element.attributes.set('event', name.trim());
                    element.attributes.set('type', type.trim());
                } else {
                    element.attributes.set('event', firstQName);
                }
            }
            // Pattern: accept via portName (second qualifiedName)
            if (qnArray.length >= 2 && qnArray[1] && typeof qnArray[1].getText === 'function') {
                element.attributes.set('via', qnArray[1].getText());
            }
        }

        // Pattern: accept at/when expression
        if (ctx.expression && typeof ctx.expression === 'function') {
            const expression = ctx.expression();
            if (expression && typeof expression.getText === 'function') {
                element.attributes.set('condition', expression.getText());
            }
        }

        this.visitChildren(ctx);
    }

    visitSendAction(ctx: any): void {
        const element = this.createElement('send', ctx);

        // Safely get expression
        if (ctx.expression && typeof ctx.expression === 'function') {
            try {
                const expression = ctx.expression();
                if (expression && typeof expression.getText === 'function') {
                    element.attributes.set('message', expression.getText());
                }
            } catch {
                // expression() can throw if node doesn't exist
            }
        }

        // Safely get qualifiedName - must wrap in try-catch because the generated
        // grammar code throws "The specified node does not exist" when the child isn't present
        if (ctx.qualifiedName && typeof ctx.qualifiedName === 'function') {
            try {
                const qualifiedName = ctx.qualifiedName();
                if (qualifiedName && typeof qualifiedName.getText === 'function') {
                    element.attributes.set('to', qualifiedName.getText());
                }
            } catch {
                // qualifiedName() can throw if node doesn't exist
            }
        }

        this.visitChildren(ctx);
    }

    visitOccurrenceDefinition(ctx: any): void {
        const element = this.createElement('occurrence def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitOccurrenceUsage(ctx: any): void {
        const element = this.createElement('occurrence', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitVerificationCaseDefinition(ctx: any): void {
        const element = this.createElement('verification def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitVerificationCaseUsage(ctx: any): void {
        const element = this.createElement('verification', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitViewDefinition(ctx: any): void {
        const element = this.createElement('view def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitViewUsage(ctx: any): void {
        const element = this.createElement('view', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitViewpointDefinition(ctx: any): void {
        const element = this.createElement('viewpoint def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitViewpointUsage(ctx: any): void {
        const element = this.createElement('viewpoint', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitRenderingDefinition(ctx: any): void {
        const element = this.createElement('rendering def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitRenderingUsage(ctx: any): void {
        const element = this.createElement('rendering', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitConcernDefinition(ctx: any): void {
        const element = this.createElement('concern def', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    visitConcernUsage(ctx: any): void {
        const element = this.createElement('concern', ctx);
        this.parentStack.push(element);
        this.visitChildren(ctx);
        this.parentStack.pop();
    }

    // Relationship handling
    visitSpecialization(ctx: SpecializationContext): void {
        // Only process if we have a current element to add relationships to
        if (!this.currentElement) {
            this.visitChildren(ctx);
            return;
        }

        // Get all qualified names (targets) - safely handle missing method
        if (!ctx.qualifiedName || typeof ctx.qualifiedName !== 'function') {
            this.visitChildren(ctx);
            return;
        }

        let qualifiedNames;
        try {
            qualifiedNames = ctx.qualifiedName();
        } catch {
            this.visitChildren(ctx);
            return;
        }

        const qnArray = Array.isArray(qualifiedNames) ? qualifiedNames : (qualifiedNames ? [qualifiedNames] : []);
        if (qnArray.length === 0) {
            this.visitChildren(ctx);
            return;
        }

        // Determine relationship type based on tokens present
        let relationshipType = 'specializes'; // default
        if (ctx.COLONGT()) {
            relationshipType = 'specializes';
        } else if (ctx.SPECIALIZES()) {
            relationshipType = 'specializes';
        } else if (ctx.SUBSETS()) {
            relationshipType = 'subsets';
        } else if (ctx.REDEFINES()) {
            relationshipType = 'redefines';
        } else if (ctx.REFERENCES()) {
            relationshipType = 'references';
        } else if (ctx.BINDS()) {
            relationshipType = 'binds';
        }

        // Add relationships to current element for each target
        for (const qualifiedName of qnArray) {
            if (!qualifiedName || !qualifiedName.identifier || typeof qualifiedName.identifier !== 'function') {
                continue;
            }
            let identifiers;
            try {
                identifiers = qualifiedName.identifier();
            } catch {
                continue;
            }
            const idArray = Array.isArray(identifiers) ? identifiers : (identifiers ? [identifiers] : []);
            if (idArray.length > 0) {
                const target = idArray.map((identifier: IdentifierContext) => {
                    return identifier.text;
                }).filter((name: string) => name).join('::');

                if (target) {
                    const relationship = {
                        type: relationshipType,
                        source: this.currentElement.name,
                        target: target
                    };
                    // Add to both element and global relationships
                    this.currentElement.relationships.push(relationship);
                    this.relationships.push(relationship);
                }
            }
        }

        this.visitChildren(ctx);
    }

    visitSubsetting(ctx: any): void {
        if (ctx.target && ctx.source) {
            this.relationships.push({
                type: 'subsets',
                target: ctx.target.getText(),
                source: ctx.source.getText()
            });
        }
        this.visitChildren(ctx);
    }

    visitRedefinition(ctx: any): void {
        if (ctx.target && ctx.source) {
            this.relationships.push({
                type: 'redefines',
                target: ctx.target.getText(),
                source: ctx.source.getText()
            });
        }
        this.visitChildren(ctx);
    }

    /**
     * Extracts visibility modifier from action context.
     */
    private extractVisibility(ctx: any): string | null {
        // Look for visibility keywords in the context
        if (ctx.PRIVATE && typeof ctx.PRIVATE === 'function') {
            const privateCtx = ctx.PRIVATE();
            if (privateCtx) {
                return 'private';
            }
        }
        if (ctx.PUBLIC && typeof ctx.PUBLIC === 'function') {
            const publicCtx = ctx.PUBLIC();
            if (publicCtx) {
                return 'public';
            }
        }
        if (ctx.PROTECTED && typeof ctx.PROTECTED === 'function') {
            const protectedCtx = ctx.PROTECTED();
            if (protectedCtx) {
                return 'protected';
            }
        }

        // Check for visibility in text
        if (ctx && typeof ctx.getText === 'function') {
            const text = ctx.getText();
            if (text.includes('private')) {
                return 'private';
            }
            if (text.includes('public')) {
                return 'public';
            }
            if (text.includes('protected')) {
                return 'protected';
            }
        }

        return null;
    }

    /**
     * Extracts specialization information (e.g., inheritance from DecisionAction).
     */
    private extractSpecialization(ctx: any): string | null {
        // Look for specialization in the context - it's a method in ANTLR generated contexts
        if (ctx.specialization && typeof ctx.specialization === 'function') {
            const specializationContext = ctx.specialization();
            if (specializationContext) {
                // Try to get the qualified name from the specialization context
                if (specializationContext.qualifiedName && typeof specializationContext.qualifiedName === 'function') {
                    const qnCtx = specializationContext.qualifiedName();
                    if (qnCtx) {
                        // Handle array case
                        const qnList = Array.isArray(qnCtx) ? qnCtx : [qnCtx];
                        if (qnList.length > 0 && qnList[0]) {
                            const name = this.extractQualifiedName(qnList[0]);
                            if (name) {
                                return name;
                            }
                        }
                    }
                }
                // Fall back to getText on the specialization context
                if (typeof specializationContext.getText === 'function') {
                    const text = specializationContext.getText();
                    if (text) {
                        // Remove the :> prefix
                        return text.replace(/^:>\s*/, '').trim();
                    }
                }
            }
            // Handle array case - some ANTLR rules return arrays
            if (Array.isArray(specializationContext) && specializationContext.length > 0) {
                const first = specializationContext[0];
                if (first && typeof first.getText === 'function') {
                    const text = first.getText();
                    if (text) {
                        return text.replace(/^:>\s*/, '').trim();
                    }
                }
            }
        }

        // Check for :> syntax in the raw text (fallback for incomplete parses)
        if (ctx && typeof ctx.getText === 'function') {
            const text = ctx.getText();
            // Match :> followed by a quoted name or identifier
            const specMatch = text.match(/:>\s*'([^']+)'/) || text.match(/:>\s*([A-Za-z0-9_:]+)/);
            if (specMatch && specMatch[1]) {
                return specMatch[1];
            }
        }

        return null;
    }

    /**
     * Extracts action type from action usage context.
     */
    private extractActionType(ctx: any): string | null {
        // Similar to specialization but for action usages
        if (!ctx || typeof ctx.getText !== 'function') {
            return null;
        }

        const text = ctx.getText();
        const colonMatch = text.match(/:\s*([A-Za-z0-9_:]+)/);
        if (colonMatch && colonMatch[1]) {
            return colonMatch[1];
        }

        return null;
    }

    // Default visit behavior
    protected defaultResult(): void {
        return;
    }
}

/**
 * Custom error listener for ANTLR parsing errors.
 * Batches errors to avoid flooding the console.
 */
class SysMLErrorListener implements ANTLRErrorListener<any> {
    private errorCount = 0;
    private static readonly MAX_LOGGED_ERRORS = 5;
    private suppressedCount = 0;

    constructor(
        private _document: vscode.TextDocument,
        private elements: Map<string, SysMLElement>
    ) {}

    /**
     * Log a summary of parse errors if any were suppressed.
     */
    logSummary(): void {
        // Summary logging disabled for performance
    }

    /**
     * Get the total number of parse errors encountered.
     */
    getErrorCount(): number {
        return this.errorCount;
    }


    syntaxError(recognizer: any, offendingSymbol: any, line: number, charPositionInLine: number, msg: string, _e: any): void {
        this.errorCount++;

        // Track suppressed errors (logging disabled for performance)
        if (this.errorCount > SysMLErrorListener.MAX_LOGGED_ERRORS) {
            this.suppressedCount++;
        }

        // Only create error elements for severe syntax errors, not semicolon warnings
        if (msg.includes('extraneous input') && msg.includes(';')) {
            // Skip semicolon errors as they're expected in our grammar
            return;
        }

        // Create error element for real syntax errors
        const errorRange = new vscode.Range(
            line - 1, // ANTLR uses 1-based line numbers
            charPositionInLine,
            line - 1,
            charPositionInLine + (offendingSymbol?.text?.length || 1)
        );

        const errorElement: SysMLElement = {
            type: 'error',
            name: 'Parse Error',
            range: errorRange,
            children: [],
            attributes: new Map([
                ['error', msg],
                ['line', line.toString()],
                ['column', charPositionInLine.toString()]
            ]),
            relationships: [],
            errors: [msg]
        };

        // Add error element to collection
        this.elements.set(`error_${line}_${charPositionInLine}`, errorElement);
    }
}
