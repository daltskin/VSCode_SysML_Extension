/*
 * SysML v2.0 Lexer Grammar
 * Lexer rules for SysML v2.0 language
 */

lexer grammar SysMLv2Lexer;

// Keywords (alphabetically ordered)
ABOUT : 'about';
ABSTRACT : 'abstract';
ACCEPT : 'accept';
ACTION : 'action';
ACTOR : 'actor';
ALIAS : 'alias';
ALL : 'all';
ALLOCATE : 'allocate';
ALLOCATION : 'allocation';
ALT : 'alt';
ANALYSIS : 'analysis';
AND : 'and';
ASSOC : 'assoc';
AT : 'at';
ATTRIBUTE : 'attribute';
BIND : 'bind';
BINDS : 'binds';
BY : 'by';
CALC : 'calc';
CASE : 'case';
CHAIN : 'chain';
CHAINS : 'chains';
COMMENT : 'comment';
CONCERN : 'concern';
CONNECT : 'connect';
CONNECTION : 'connection';
CONSTRAINT : 'constraint';
DATATYPE : 'datatype';
DEF : 'def';
DEFAULT : 'default';
DEFINITION : 'definition';
DEPENDENCY : 'dependency';
DERIVED : 'derived';
DIRECTION : 'direction';
DO : 'do';
DOC : 'doc';
ELSE : 'else';
END : 'end';
ENTRY : 'entry';
ENUM : 'enum';
EVENT : 'event';
EXHIBIT : 'exhibit';
EXIT : 'exit';
EXPOSE : 'expose';
EXPR : 'expr';
FALSE : 'false';
FEATURE : 'feature';
FILTER : 'filter';
FIRST : 'first';
FLOW : 'flow';
FOR : 'for';
FORK : 'fork';
FROM : 'from';
FUNCTION : 'function';
HASTYPE : 'hastype';
IF : 'if';
IMPORT : 'import';
IN : 'in';
INDIVIDUAL : 'individual';
INOUT : 'inout';
INTERACTION : 'interaction';
INTERFACE : 'interface';
ITEM : 'item';
JOIN : 'join';
LIBRARY : 'library';
MESSAGE : 'message';
META : 'meta';
METADATA : 'metadata';
NONUNIQUE : 'nonunique';
NOT : 'not';
NEW : 'new';
NULL : 'null';
OBJECTIVE : 'objective';
OCCURRENCE : 'occurrence';
OF : 'of';
OR : 'or';
ORDERED : 'ordered';
OUT : 'out';
PACKAGE : 'package';
PARALLEL : 'parallel';
PART : 'part';
PARTICIPANT : 'participant';
PERFORM : 'perform';
PAYLOAD : 'payload';
PORT : 'port';
PRIVATE : 'private';
PROPERTY : 'property';
PROTECTED : 'protected';
PUBLIC : 'public';
READONLY : 'readonly';
REDEFINES : 'redefines';
REF : 'ref';
REFERENCES : 'references';
REQUIRE : 'require';
REQUIREMENT : 'requirement';
RETURN : 'return';
SATISFY : 'satisfy';
SEND : 'send';
SENDMESSAGE : 'SendMessage';
SPECIALIZES : 'specializes';
STAKEHOLDER : 'stakeholder';
STANDARD : 'standard';
STATE : 'state';
SUBJECT : 'subject';
SUBSETS : 'subsets';
SNAPSHOT : 'snapshot';
THEN : 'then';
TIMESLICE : 'timeslice';
TO : 'to';
TRANSITION : 'transition';
TRUE : 'true';
USE : 'use';
VARIATION : 'variation';
VERIFICATION : 'verification';
VERIFY : 'verify';
VIA : 'via';
VIEW : 'view';
VIEWPOINT : 'viewpoint';
WHEN : 'when';
XOR : 'xor';

// Multi-character operators
COLONCOLON : '::';
COLONCOLONGT : '::>';  // For ::> binding operator
COLONGT : ':>';
COLONGTGT : ':>>';
COLONASSIGN : ':=';
QUESTIONQUESTION : '??';
LE : '<=';
GE : '>=';
EQ : '==';
NE : '!=';
EEQ : '===';
NEE : '!==';
POWER : '**';
DOTDOT : '..';
ARROW : '->';

// Single-character tokens
COLON : ':';
SEMICOLON : ';';
COMMA : ',';
DOT : '.';
QUESTION : '?';
LPAREN : '(';
RPAREN : ')';
LBRACE : '{';
RBRACE : '}';
LBRACKET : '[';
RBRACKET : ']';
LT : '<';
GT : '>';
PLUS : '+';
MINUS : '-';
MULTIPLY : '*';
DIVIDE : '/';
MODULO : '%';
ASSIGN : '=';
AT_SIGN : '@';      // Metadata annotation
HASH : '#';         // Short-form metadata or member reference
EXCLAMATION : '!';
TILDE : '~';  // Conjugate port type operator

// Identifiers and literals
IDENTIFIER
    : IDENTIFIER_START IDENTIFIER_PART*
    ;

fragment IDENTIFIER_START
    : [a-zA-Z_]
    ;

fragment IDENTIFIER_PART
    : [a-zA-Z0-9_]
    ;

// Numeric literals
INTEGER
    : DECIMAL_INTEGER
    | HEX_INTEGER
    | OCTAL_INTEGER
    | BINARY_INTEGER
    ;

fragment DECIMAL_INTEGER
    : [1-9] [0-9]*
    | '0'
    ;

fragment HEX_INTEGER
    : '0' [xX] [0-9a-fA-F]+
    ;

fragment OCTAL_INTEGER
    : '0' [0-7]+
    ;

fragment BINARY_INTEGER
    : '0' [bB] [01]+
    ;

REAL
    : DECIMAL_REAL
    | SCIENTIFIC_REAL
    ;

fragment DECIMAL_REAL
    : [0-9]+ '.' [0-9]+
    | '.' [0-9]+
    // Note: [0-9]+ '.' is NOT included to avoid conflict with DOTDOT (..)
    // Use explicit patterns instead
    ;

fragment SCIENTIFIC_REAL
    : ([0-9]+ '.' [0-9]+ | '.' [0-9]+ | [0-9]+) [eE] [+-]? [0-9]+
    ;

// String literals
STRING
    : SINGLE_QUOTED_STRING
    | DOUBLE_QUOTED_STRING
    ;

fragment SINGLE_QUOTED_STRING
    : '\'' (~['\r\n\\] | ESCAPE_SEQUENCE)* '\''
    ;

fragment DOUBLE_QUOTED_STRING
    : '"' (~["\r\n\\] | ESCAPE_SEQUENCE)* '"'
    ;

fragment ESCAPE_SEQUENCE
    : '\\' [btnfr"'\\]
    | '\\' [0-3] [0-7] [0-7]
    | '\\' [0-7] [0-7]
    | '\\' [0-7]
    | '\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
    ;

fragment HEX_DIGIT
    : [0-9a-fA-F]
    ;

// Unit literals (for quantities and measurements) - only alphabetic units, not numeric
// This prevents [1] and [*] from being matched as units instead of multiplicity
UNIT_LITERAL
    : '[' [a-zA-Z] (~[[\]\\] | '\\' .)* ']'
    ;

// Comments and whitespace
LINE_COMMENT
    : '//' ~[\r\n]* -> channel(HIDDEN)
    ;

BLOCK_COMMENT
    : '/*' .*? '*/' -> channel(HIDDEN)
    ;

WS
    : [ \t\r\n\u000C]+ -> channel(HIDDEN)
    ;

// Error handling for unrecognized characters
ERROR_CHAR
    : .
    ;
