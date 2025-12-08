/*
 * SysML v2.0 ANTLR Grammar
 * Based on OMG Systems Modeling Language (SysML) version 2.0 specification
 * Compatible with ANTLR 4.x
 */

parser grammar SysMLv2;

options {
    tokenVocab = SysMLv2Lexer;
}

// Parser Rules

// Root rule
model
    : element* EOF
    ;

element
    : importStatement
    | individualDefinition
    | individualUsage
    | packageElement
    | definition
    | partDefinition
    | partUsage
    | actionDefinition
    | actionUsage
    | stateDefinition
    | stateUsage
    | requirementDefinition
    | requirementUsage
    | useCaseDefinition
    | useCaseUsage
    | constraintDefinition
    | constraintUsage
    | attributeDefinition
    | attributeUsage
    | portDefinition
    | portUsage
    | connectionDefinition
    | connectionUsage
    | interfaceDefinition
    | interfaceUsage
    | allocationDefinition
    | allocationUsage
    | itemDefinition
    | itemUsage
    | actorDefinition
    | actorUsage
    | concernDefinition
    | concernUsage
    | analysisDefinition
    | analysisUsage
    | verificationDefinition
    | verificationUsage
    | viewDefinition
    | viewUsage
    | viewpointDefinition
    | viewpointUsage
    | enumerationDefinition
    | enumerationUsage
    | datatypeDefinition
    | datatypeUsage
    | associationDefinition
    | associationUsage
    | metadataDefinition
    | metadataUsage
    | metadataAnnotation
    | comment
    | documentation
    | calculation
    | calcUsage
    | interactionDefinition
    | interactionUsage
    | participantUsage
    | messageUsage
    | payloadUsage
    | occurrenceUsage
    | alternativeUsage
    | elseUsage
    | featureDefinition
    | featureUsage
    | definition
    | functionDefinition
    | eventDefinition
    | eventUsage
    | performAction
    | exhibitState
    | entryAction
    | exitAction
    | doAction
    | acceptEvent
    | sendAction
    | stateTransition
    | subjectUsage
    | objectiveUsage
    | stakeholderUsage
    | allocateStatement
    | endFeature
    | redefinitionUsage
    | flowProperty
    | bindUsage
    | connectStatement
    | aliasStatement
    | satisfyStatement
    | dependencyStatement
    | firstStatement
    | thenStatement
    | returnStatement
    | requireStatement
    | verifyStatement
    | timesliceUsage
    | snapshotUsage
    | filterStatement
    | forkUsage
    | joinUsage
    ;

// Alias statement: alias name for qualified::name;
aliasStatement
    : ALIAS identifier FOR qualifiedName ';'?
    ;

// Satisfy statement: satisfy requirement by element { ... } or satisfy requirement name : Type;
satisfyStatement
    : SATISFY qualifiedName BY qualifiedName (body | ';')?
    | SATISFY REQUIREMENT identifier typing? ';'
    ;

// Dependency statement: dependency from x to y; or #refinement dependency name to target;
dependencyStatement
    : DEPENDENCY FROM qualifiedName TO qualifiedName ';'?
    | metadataPrefix DEPENDENCY identifier TO qualifiedName ';'?
    ;

// Filter statement: filter @ MetadataType; or filter @ Type and Type::property;
filterStatement
    : FILTER filterExpression ';'?
    ;

filterExpression
    : filterTerm (('and' | 'or') filterTerm)*
    ;

filterTerm
    : '@' qualifiedName
    | qualifiedName
    ;

// First statement: first x then y; or just first x;
firstStatement
    : FIRST qualifiedName (THEN qualifiedName)? ';'?
    ;

// Then statement (succession continuation): then event x.y; or then action name { ... }
thenStatement
    : THEN 'event' qualifiedName ';'
    | THEN ACTION identifier ACCEPT identifier typing? ';'
    | THEN ACTION identifier multiplicity? (body | ';')
    | THEN FORK identifier ';'
    | THEN JOIN identifier ';'
    | THEN qualifiedName ';'
    ;

// Return statement: return name :> Type = expression;
// Also supports: return attribute name :> Type = expression;
// Also supports: return part name :> Type;
// Also supports: return :>> verdict = expression;
returnStatement
    : RETURN (ATTRIBUTE | PART)? identifier? typing? (COLONGT qualifiedName)? valueBinding? ';'
    | RETURN COLONGTGT identifier valueBinding? ';'
    ;

// Require statement: require qualifiedName; or require constraint { ... }
requireStatement
    : REQUIRE qualifiedName ';'
    | REQUIRE CONSTRAINT body
    ;

// Fork and Join usages for control flow
forkUsage
    : FORK identifier ';'
    | FORK identifier (body | ';')
    ;

joinUsage
    : JOIN identifier ';'
    ;

// End feature for connection ends: end name : qualified.reference;
// or end #metadata name; or end #original ::> qualifiedName;
endFeature
    : END metadataPrefix? identifier? typing? ';'?
    | END metadataPrefix? (COLONCOLONGT | COLONGTGT) qualifiedName ';'?
    ;

// Metadata prefix for short-form: #logical, #physical
metadataPrefix
    : HASH identifier
    ;

// Bind usage: bind sourceRef = targetRef;
bindUsage
    : BIND qualifiedName '=' qualifiedName ';'?
    ;

// Connect statement (inline): connect sourceRef to targetRef;
// Also supports ::> binding: connect [1] name ::> path.to.port to [1] name ::> path.to.port
connectStatement
    : CONNECT multiplicity? identifier (COLONCOLONGT qualifiedName)? TO multiplicity? identifier (COLONCOLONGT qualifiedName)? (body | ';')?
    | CONNECT multiplicity? qualifiedName TO multiplicity? qualifiedName ';'?
    ;

// Redefinition usage: :>> name { ... } or :>> name = value; or :>> name = value meta Type;
// Shorthand for 'redefines' - redefines a feature from supertype
// Also supports :>> name [multiplicity] for feature redefinition with multiplicity
// Also supports 'redefines' keyword directly: redefines requiredFuelEconomy = 10 [km / L];
redefinitionUsage
    : COLONGTGT qualifiedName multiplicity? (body | '=' expression metaTyping? ';' | ';')
    | REDEFINES qualifiedName valueBinding? ';'
    ;

// Meta typing for metatype constraints: meta SysML::Usage
metaTyping
    : META qualifiedName
    ;

// Flow property declaration: flow property name : Type direction in/out/inout;
flowProperty
    : FLOW PROPERTY identifier typing? (DIRECTION direction)? ';'?
    ;

// Package Elements
packageElement
    : visibility? STANDARD? LIBRARY? PACKAGE identifier body?
    ;

// Import statement
importStatement
    : visibility? IMPORT qualifiedName ('::' (MULTIPLY | POWER))? (',' qualifiedName ('::' (MULTIPLY | POWER))?)* ';'?
    | visibility? PRIVATE IMPORT qualifiedName ('::' (MULTIPLY | POWER))? (',' qualifiedName ('::' (MULTIPLY | POWER))?)* ';'?
    ;

// Part Definitions and Usages
partDefinition
    : visibility? modifier* 'part' 'def' identifier specialization? (body | ';')?
    ;

partUsage
    : visibility? metadataPrefix? modifier* 'part' identifier? typing? specialization? multiplicity? (body | ';')?
    ;

// Action Definitions and Usages
actionDefinition
    : visibility? modifier* 'action' 'def' identifier specialization? (body | ';')?
    ;

actionUsage
    : visibility? modifier* 'action' identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Behavioral Constructs
// perform action ref; or perform ref redefines parent;
performAction
    : PERFORM ACTION? qualifiedName multiplicity? specialization? ';'?
    | PERFORM qualifiedName REDEFINES qualifiedName ';'?
    ;

exhibitState
    : EXHIBIT STATE qualifiedName typing? specialization? PARALLEL? (body | ';')?
    ;

// Entry action: entry; entry / action(); entry action name;
entryAction
    : ENTRY ';'? (THEN identifier ';'?)?      // entry; then off; (initial state)
    | ENTRY DIVIDE expression ';'?            // entry / initializeSensors();
    | ENTRY ACTION? qualifiedName? ';'?       // entry action name; or entry action;
    ;

// Exit action: exit; exit / action();
exitAction
    : EXIT ';'?                               // exit;
    | EXIT DIVIDE expression ';'?             // exit / closeShutter();
    | EXIT qualifiedName ';'?                 // exit name;
    ;

// Do action: do action; do / action();
doAction
    : DO DIVIDE expression ';'?               // do / continuousFocus();
    | DO qualifiedName (body | ';')?
    | DO body
    ;

acceptEvent
    : ACCEPT qualifiedName (':' qualifiedName)? (VIA qualifiedName)? (IF expression)? ';'?
    | ACCEPT (AT | WHEN) expression ';'?
    ;

sendAction
    : SEND expression TO qualifiedName ';'?
    | SEND expression VIA qualifiedName (body | ';')?
    | SEND qualifiedName VIA qualifiedName (body | ';')?
    ;

// State Definitions and Usages
stateDefinition
    : visibility? modifier* 'state' 'def' identifier specialization? (body | ';')?
    ;

stateUsage
    : visibility? modifier* 'state' identifier typing? specialization? multiplicity? modifier* (body | ';')?
    ;

// Event Definitions
eventDefinition
    : visibility? modifier* 'event' 'def' identifier specialization? (body | ';')?
    ;

// Event Usages - event occurrence declarations and references
// Examples: event sendSensedSpeed.sourceEvent;
//           event occurrence setSpeedReceived = vehicle_b.setSpeedPort.setSpeedReceived;
eventUsage
    : visibility? modifier* 'event' 'occurrence' identifier valueBinding? ';'
    | visibility? modifier* 'event' qualifiedName ';'
    ;

// Requirement Definitions and Usages
requirementDefinition
    : visibility? modifier* 'requirement' 'def' identifier specialization? (body | ';')?
    ;

requirementUsage
    : visibility? modifier* 'requirement' shortName? identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Use Case Definitions and Usages
useCaseDefinition
    : visibility? modifier* 'use' 'case' 'def' identifier specialization? (body | ';')?
    ;

useCaseUsage
    : visibility? modifier* 'use' 'case' identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Constraint Definitions and Usages
constraintDefinition
    : visibility? modifier* 'constraint' 'def' identifier specialization? (body | ';')?
    ;

constraintUsage
    : visibility? modifier* 'constraint' identifier? typing? specialization? multiplicity? (body | ';')?
    ;

// Attribute Definitions and Usages
attributeDefinition
    : visibility? modifier* 'attribute' 'def' identifier typing? specialization? (body | ';')?
    ;

attributeUsage
    : visibility? metadataPrefix? modifier* 'attribute' identifier typing? specialization? multiplicity? valueBinding? (body | ';')?
    ;

// Value binding: = value or default value or := assignment
valueBinding
    : ASSIGN expression
    | DEFAULT expression
    | COLONASSIGN expression
    ;

// Port Definitions and Usages
portDefinition
    : visibility? modifier* 'port' 'def' identifier specialization? (body | ';')?
    ;

// Port usage supports both:
// - port name : Type {...}
// - port name :>> redefinedPort [n] {...}  (redefinition with multiplicity)
// - port :>> name : Type {...}  (inline redefinition with typing)
portUsage
    : visibility? modifier* 'port' identifier (typing | COLONGTGT qualifiedName)? specialization? multiplicity? (body | ';')?
    | visibility? modifier* 'port' COLONGTGT identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Connection Definitions and Usages
connectionDefinition
    : visibility? modifier* 'connection' 'def' identifier specialization? (body | ';')?
    ;

connectionUsage
    : visibility? modifier* metadataPrefix? 'connection' identifier? typing? specialization? multiplicity? (body | ';')?
    ;

// Interface Definitions and Usages
interfaceDefinition
    : visibility? modifier* 'interface' 'def' identifier specialization? (body | ';')?
    ;

interfaceUsage
    : visibility? modifier* 'interface' identifier typing? specialization? multiplicity? (body | connectStatement | ';')?
    ;

// Allocation Definitions and Usages
allocationDefinition
    : visibility? modifier* 'allocation' 'def' identifier specialization? (body | ';')?
    ;

allocationUsage
    : visibility? modifier* 'allocation' identifier typing? specialization? multiplicity? (allocationBody | body | ';')?
    ;

// Allocation body: can contain allocate statements or regular body elements
allocationBody
    : allocateStatement+
    ;

// Item Definitions and Usages
itemDefinition
    : visibility? modifier* 'item' 'def' identifier specialization? (body | ';')?
    ;

// Item usage supports:
// - item name : Type {...}
// - item :> supertype [n] : Type {...}  (anonymous with specialization, multiplicity, then typing)
// - in item name : Type redefines parent; (directional with typing and redefines)
// - ref item redefines name { }
itemUsage
    : visibility? modifier* direction? REF? 'item' identifier? (typing | COLONGTGT qualifiedName)? specialization? multiplicity? typing? valueBinding? (body | ';')?
    ;

// Generic definition for 'individual def' etc without specific element type
definition
    : visibility? modifier* DEF identifier specialization? (body | ';')?
    ;

// Individual definition (individual is a kind of occurrence def)
individualDefinition
    : visibility? INDIVIDUAL DEF identifier specialization? (body | ';')?
    ;

// Individual usage: individual name : Type { ... }
individualUsage
    : visibility? INDIVIDUAL identifier typing? (body | ';')?
    ;

// Timeslice: timeslice name { ... }
timesliceUsage
    : visibility? TIMESLICE identifier typing? (body | ';')?
    ;

// Snapshot: snapshot name : Type { ... }
snapshotUsage
    : visibility? SNAPSHOT identifier typing? valueBinding? (body | ';')?
    ;

// Actor Definitions and Usages
actorDefinition
    : visibility? modifier* 'actor' 'def' identifier specialization? (body | ';')?
    ;

actorUsage
    : visibility? modifier* 'actor' identifier typing? specialization? multiplicity? valueBinding? (body | ';')?
    ;

// Concern Definitions and Usages
concernDefinition
    : visibility? modifier* 'concern' 'def' identifier specialization? (body | ';')?
    ;

concernUsage
    : visibility? modifier* 'concern' identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Analysis Definitions and Usages
analysisDefinition
    : visibility? modifier* 'analysis' 'def' identifier specialization? (body | ';')?
    ;

analysisUsage
    : visibility? modifier* 'analysis' identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Subject and Objective (used in analysis, requirements, etc.)
subjectUsage
    : visibility? SUBJECT identifier typing? specialization? multiplicity? (body | ';')?
    ;

objectiveUsage
    : visibility? OBJECTIVE identifier? typing? specialization? multiplicity? (body | ';')?
    ;

// Stakeholder usage (used in requirements)
stakeholderUsage
    : visibility? STAKEHOLDER identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Allocate statement (used in allocation definitions)
// Can be simple: allocate X to Y;
// Or with nested body: allocate X to Y { ... }
allocateStatement
    : ALLOCATE qualifiedName TO qualifiedName (allocateBody | ';'?)
    ;

// Allocate body for nested allocation statements
allocateBody
    : '{' allocateStatement* '}'
    ;

// Verification Definitions and Usages with verify statements
verificationDefinition
    : visibility? modifier* 'verification' 'def' identifier specialization? verificationBody?
    ;

verificationUsage
    : visibility? modifier* 'verification' identifier typing? specialization? multiplicity? verificationBody?
    ;

// Verification body can contain verify statements
verificationBody
    : '{' verificationBodyElement* '}'
    ;

verificationBodyElement
    : element
    | verifyStatement
    ;

// Verify statement: verify requirement; or verify requirement { ... }
verifyStatement
    : VERIFY qualifiedName (body | ';')?
    ;

// View Definitions and Usages with expose, filter, satisfy
viewDefinition
    : visibility? modifier* 'view' 'def' identifier specialization? viewBody?
    ;

viewUsage
    : visibility? modifier* 'view' identifier typing? specialization? multiplicity? viewBody?
    ;

// View body can contain expose, filter, satisfy statements
viewBody
    : '{' viewBodyElement* '}'
    ;

viewBodyElement
    : element
    | exposeStatement
    | filterStatement
    | satisfyStatement
    ;

// Expose statement: expose element1, element2; or expose Package::**;
exposeStatement
    : EXPOSE exposeTarget (',' exposeTarget)* ';'?
    ;

exposeTarget
    : identifier (('::' | '.') identifier)* '::' '**'   // name::** for recursive
    | identifier (('::' | '.') identifier)* '::' '*'    // name::* for all
    | qualifiedName        // plain name
    ;

// Viewpoint Definitions and Usages
viewpointDefinition
    : visibility? modifier* 'viewpoint' 'def' identifier specialization? body?
    ;

viewpointUsage
    : visibility? modifier* 'viewpoint' identifier typing? specialization? multiplicity? body?
    ;

// Enumeration Definitions and Usages
enumerationDefinition
    : visibility? modifier* 'enum' 'def' identifier specialization? body?
    ;

enumerationUsage
    : visibility? modifier* 'enum' identifier typing? specialization? multiplicity? body?
    ;

// Datatype Definitions and Usages
datatypeDefinition
    : visibility? modifier* 'datatype' 'def' identifier specialization? body?
    ;

datatypeUsage
    : visibility? modifier* 'datatype' identifier typing? specialization? multiplicity? body?
    ;

// Association Definitions and Usages
associationDefinition
    : visibility? modifier* 'assoc' 'def' identifier specialization? body?
    ;

associationUsage
    : visibility? modifier* 'assoc' identifier typing? specialization? multiplicity? body?
    ;

// Metadata Definitions and Usages
metadataDefinition
    : visibility? modifier* 'metadata' 'def' ('<' identifier '>')? identifier specialization? body?
    ;

metadataUsage
    : visibility? modifier* 'metadata' identifier typing? specialization? multiplicity? body?
    ;

// Metadata annotation: @ MetadataType { ... } or @ MetadataType about subject { ... } or @MetadataType;
metadataAnnotation
    : AT_SIGN qualifiedName (ABOUT qualifiedName)? (body | ';')?
    ;

// Documentation Elements
comment
    : visibility? COMMENT (ABOUT qualifiedName)? identifier? stringValue? body?
    ;

documentation
    : visibility? 'doc' identifier? stringValue body?
    ;

// Calculations
calculation
    : visibility? 'calc' 'def' identifier expression? body?
    ;

// Calc usage: calc :> evaluationFunction { ... }
calcUsage
    : visibility? 'calc' (COLONGT qualifiedName)? body?
    ;

// Interaction Elements
interactionDefinition
    : visibility? modifier* 'interaction' 'def' identifier specialization? body?
    ;

interactionUsage
    : visibility? modifier* 'interaction' identifier typing? specialization? multiplicity? body?
    ;

participantUsage
    : visibility? modifier* 'participant' identifier typing? specialization? multiplicity? body?
    ;

messageUsage
    : visibility? modifier* 'message' identifier OF qualifiedName ';'  // message sendSensedSpeed of SensedSpeed;
    | visibility? modifier* 'message' identifier messagePattern body?
    | visibility? modifier* 'message' identifier? OF qualifiedName typing? FROM qualifiedName TO qualifiedName ';'?
    ;

messagePattern
    : ':' 'SendMessage' 'from' identifier 'to' identifier
    | ':' identifier
    ;

payloadUsage
    : visibility? modifier* 'payload' identifier typing? specialization? multiplicity? body?
    ;

occurrenceUsage
    : visibility? modifier* 'occurrence' identifier typing? specialization? multiplicity? modifier* body?
    ;

alternativeUsage
    : visibility? modifier* 'alt' identifier body?
    ;

elseUsage
    : visibility? modifier* 'else' identifier? body?
    ;

// Feature Definitions
featureDefinition
    : visibility? modifier* FEATURE identifier typing? specialization? multiplicity? (body | ';')?
    | visibility? modifier* REF FEATURE? identifier typing? specialization? multiplicity? (body | ';')?
    ;

// Feature Usage - bare feature declarations inside bodies without keywords
// Examples: distancePerVolume :> scalarQuantities = distance / volume;
//           kpl : DerivedUnit = km / L;
//           out wheelToRoadTorque redefines ... [n] = value;
featureUsage
    : direction? identifier typing? specialization? multiplicity? valueBinding? (body | ';')?
    ;

// Function Definitions (for library functions)
functionDefinition
    : visibility? modifier* FUNCTION (identifier | stringValue) functionSignature? body?
    ;

functionSignature
    : '(' parameterList? ')' returnType?
    ;

parameterList
    : parameter (',' parameter)*
    ;

parameter
    : visibility? direction? identifier typing? multiplicity? (body | ';')?
    ;

direction
    : IN
    | OUT
    | INOUT
    ;

returnType
    : RETURN ':' qualifiedName
    | '{' RETURN ':' qualifiedName multiplicity? ';'? '}'
    ;

// Common Elements
visibility
    : 'public'
    | 'private'
    | 'protected'
    ;

modifier
    : 'abstract'
    | 'derived'
    | 'readonly'
    | 'variation'
    | 'ordered'
    | 'nonunique'
    | INDIVIDUAL
    | SNAPSHOT
    | TIMESLICE
    ;

typing
    : ':' TILDE? qualifiedName typeParameters?   // TILDE prefix indicates conjugate port type, optional type parameters
    ;

// Type parameters for generics: Feature<T>, Collection<Int, Real>
typeParameters
    : LT typeParameterList GT
    ;

typeParameterList
    : qualifiedName (',' qualifiedName)*
    ;

specialization
    : ':>' qualifiedName (',' qualifiedName)*
    | 'specializes' qualifiedName (',' qualifiedName)*
    | 'subsets' qualifiedName (',' qualifiedName)*
    | 'redefines' qualifiedName (',' qualifiedName)*
    | 'references' qualifiedName (',' qualifiedName)*
    | 'binds' qualifiedName (',' qualifiedName)*
    ;

multiplicity
    : '[' multiplicityRange ']' multiplicityModifier*
    ;

// Multiplicity modifiers: ordered, nonunique
multiplicityModifier
    : ORDERED
    | NONUNIQUE
    ;

multiplicityRange
    : multiplicityBound (DOTDOT multiplicityBound)?
    ;

multiplicityBound
    : INTEGER
    | '*'
    | expression
    ;

body
    : '{' bodyElement* '}'
    | '{' expression '}' // For constraint bodies: constraint {expr}
    ;

// Body elements include both regular elements and parameters
bodyElement
    : element
    | parameter
    | flowStatement
    | enumValueBinding
    ;

// Enum value binding: enum = value;
enumValueBinding
    : ENUM ('=' expression)? ';'?
    ;

// Flow statement: flow of Type from source.port to target.port; OR flow from source to target; OR flow source to target;
flowStatement
    : FLOW OF? qualifiedName FROM qualifiedName TO qualifiedName ';'?
    | FLOW FROM qualifiedName TO qualifiedName ';'?
    | FLOW qualifiedName TO qualifiedName ';'?
    ;

expression
    : conditionalExpression
    ;

conditionalExpression
    : nullCoalescingExpression ('?' expression ':' conditionalExpression)?
    ;

nullCoalescingExpression
    : logicalOrExpression ('??' logicalOrExpression)*
    ;

logicalOrExpression
    : logicalXorExpression ('or' logicalXorExpression)*
    ;

logicalXorExpression
    : logicalAndExpression (XOR logicalAndExpression)*
    ;

logicalAndExpression
    : equalityExpression ('and' equalityExpression)*
    ;

equalityExpression
    : relationalExpression ((EQ | NE | '===' | '!==') relationalExpression)*
    ;

relationalExpression
    : additiveExpression ((LT | GT | LE | GE | 'in' | 'hastype') additiveExpression)*
    ;

additiveExpression
    : multiplicativeExpression (('+' | '-') multiplicativeExpression)*
    ;

multiplicativeExpression
    : exponentialExpression (('*' | '/' | '%') exponentialExpression)*
    ;

exponentialExpression
    : unaryExpression ('**' unaryExpression)*
    ;

unaryExpression
    : ('+' | '-' | '!' | 'not') unaryExpression
    | postfixExpression
    ;

postfixExpression
    : primaryExpression postfixOperator*
    ;

postfixOperator
    : '.' identifier
    | '[' expression ']'
    | '(' argumentList? ')'
    ;

primaryExpression
    : NEW qualifiedName '(' argumentList? ')'  // Constructor expression
    | qualifiedName unitSuffix?                // qualified names like IgnitionOnOff::on
    | literal unitSuffix?
    | '(' expressionList ')' unitSuffix?       // grouped or tuple expression: (e) or (e, e, ...) with optional unit
    ;

// Expression list: for tuples and grouped expressions
expressionList
    : expression (',' expression)*
    ;

// Unit suffix for expressions: 500[W], 80[mm]
unitSuffix
    : UNIT_LITERAL
    | '[' qualifiedName ']'
    ;

argumentList
    : argument (',' argument)*
    ;

argument
    : identifier '=' expression    // Named argument: name=value
    | expression                   // Positional argument
    ;

literal
    : INTEGER
    | REAL
    | stringValue
    | booleanValue
    | nullValue
    ;

stringValue
    : STRING
    ;

booleanValue
    : 'true'
    | 'false'
    ;

nullValue
    : 'null'
    ;

qualifiedName
    : identifier (('::' | '.') identifier)*
    ;

// Identifier rule allows keywords to be used as names in certain contexts
// This is common in SysML where 'payload', 'flow', etc. might be feature names
identifier
    : IDENTIFIER
    | STRING    // Quoted identifiers like 'Activate rocket booster'
    | keyword   // Allow keywords as identifiers
    ;

// Short name (short ID) in angle brackets: <'1'> or <id>
shortName
    : '<' (STRING | IDENTIFIER) '>'
    ;

// Keywords that can also be used as identifiers
// Note: PACKAGE, IMPORT, STANDARD, LIBRARY are excluded because they start element definitions
keyword
    : PAYLOAD
    | FLOW
    | DIRECTION
    | PROPERTY
    | STATE
    | ACTION
    | PORT
    | PART
    | ATTRIBUTE
    | CONNECTION
    | CONSTRAINT
    | REQUIREMENT
    | ITEM
    | EVENT
    | MESSAGE
    | INTERFACE
    | VIEW
    | VIEWPOINT
    | COMMENT
    | DOC
    | METADATA
    | ALLOCATION
    | ANALYSIS
    | VERIFICATION
    | CONCERN
    | OCCURRENCE
    | INTERACTION
    | PARTICIPANT
    | SUBJECT
    | OBJECTIVE
    | FEATURE
    | FUNCTION
    ;

// State machine elements
// Supports both:
//   transition name first sourceState accept Event then targetState;
//   transition name from sourceState to targetState when condition;
stateTransition
    : TRANSITION identifier? fromState transitionGuard? transitionEffect? toState ';'?
    | TRANSITION identifier? fromState acceptEvent transitionGuard? transitionEffect? toState ';'?
    | TRANSITION identifier? fromState doAction toState ';'?
    | TRANSITION identifier? fromState toState transitionTrigger? ';'?
    | acceptEvent transitionGuard? transitionEffect? THEN identifier ';'?  // accept ... if ... do ... then target
    | transitionGuard transitionEffect? THEN identifier ';'?               // if ... do ... then target
    ;

fromState
    : FIRST identifier              // first off
    | FROM identifier               // from sourceState
    | identifier                    // legacy: just identifier
    ;

toState
    : THEN identifier               // then initializing
    | TO identifier                 // to targetState
    ;

transitionTrigger
    : acceptEvent
    | AT expression
    | WHEN expression
    ;

transitionGuard
    : IF expression
    ;

transitionEffect
    : DO sendAction
    | DO qualifiedName
    ;
