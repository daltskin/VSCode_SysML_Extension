// Generated from SysMLv2.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { SysMLv2Visitor } from "./SysMLv2Visitor";


export class SysMLv2 extends Parser {
	public static readonly ABOUT = 1;
	public static readonly ABSTRACT = 2;
	public static readonly ACCEPT = 3;
	public static readonly ACTION = 4;
	public static readonly ACTOR = 5;
	public static readonly ALIAS = 6;
	public static readonly ALL = 7;
	public static readonly ALLOCATE = 8;
	public static readonly ALLOCATION = 9;
	public static readonly ALT = 10;
	public static readonly ANALYSIS = 11;
	public static readonly AND = 12;
	public static readonly ASSOC = 13;
	public static readonly AT = 14;
	public static readonly ATTRIBUTE = 15;
	public static readonly BIND = 16;
	public static readonly BINDS = 17;
	public static readonly BY = 18;
	public static readonly CALC = 19;
	public static readonly CASE = 20;
	public static readonly CHAIN = 21;
	public static readonly CHAINS = 22;
	public static readonly COMMENT = 23;
	public static readonly CONCERN = 24;
	public static readonly CONNECT = 25;
	public static readonly CONNECTION = 26;
	public static readonly CONSTRAINT = 27;
	public static readonly DATATYPE = 28;
	public static readonly DEF = 29;
	public static readonly DEFAULT = 30;
	public static readonly DEFINITION = 31;
	public static readonly DEPENDENCY = 32;
	public static readonly DERIVED = 33;
	public static readonly DIRECTION = 34;
	public static readonly DO = 35;
	public static readonly DOC = 36;
	public static readonly ELSE = 37;
	public static readonly END = 38;
	public static readonly ENTRY = 39;
	public static readonly ENUM = 40;
	public static readonly EVENT = 41;
	public static readonly EXHIBIT = 42;
	public static readonly EXIT = 43;
	public static readonly EXPOSE = 44;
	public static readonly EXPR = 45;
	public static readonly FALSE = 46;
	public static readonly FEATURE = 47;
	public static readonly FILTER = 48;
	public static readonly FIRST = 49;
	public static readonly FLOW = 50;
	public static readonly FOR = 51;
	public static readonly FORK = 52;
	public static readonly FROM = 53;
	public static readonly FUNCTION = 54;
	public static readonly HASTYPE = 55;
	public static readonly IF = 56;
	public static readonly IMPORT = 57;
	public static readonly IN = 58;
	public static readonly INDIVIDUAL = 59;
	public static readonly INOUT = 60;
	public static readonly INTERACTION = 61;
	public static readonly INTERFACE = 62;
	public static readonly ITEM = 63;
	public static readonly JOIN = 64;
	public static readonly LIBRARY = 65;
	public static readonly MESSAGE = 66;
	public static readonly META = 67;
	public static readonly METADATA = 68;
	public static readonly NONUNIQUE = 69;
	public static readonly NOT = 70;
	public static readonly NEW = 71;
	public static readonly NULL = 72;
	public static readonly OBJECTIVE = 73;
	public static readonly OCCURRENCE = 74;
	public static readonly OF = 75;
	public static readonly OR = 76;
	public static readonly ORDERED = 77;
	public static readonly OUT = 78;
	public static readonly PACKAGE = 79;
	public static readonly PARALLEL = 80;
	public static readonly PART = 81;
	public static readonly PARTICIPANT = 82;
	public static readonly PERFORM = 83;
	public static readonly PAYLOAD = 84;
	public static readonly PORT = 85;
	public static readonly PRIVATE = 86;
	public static readonly PROPERTY = 87;
	public static readonly PROTECTED = 88;
	public static readonly PUBLIC = 89;
	public static readonly READONLY = 90;
	public static readonly REDEFINES = 91;
	public static readonly REF = 92;
	public static readonly REFERENCES = 93;
	public static readonly REQUIRE = 94;
	public static readonly REQUIREMENT = 95;
	public static readonly RETURN = 96;
	public static readonly SATISFY = 97;
	public static readonly SEND = 98;
	public static readonly SENDMESSAGE = 99;
	public static readonly SPECIALIZES = 100;
	public static readonly STAKEHOLDER = 101;
	public static readonly STANDARD = 102;
	public static readonly STATE = 103;
	public static readonly SUBJECT = 104;
	public static readonly SUBSETS = 105;
	public static readonly SNAPSHOT = 106;
	public static readonly THEN = 107;
	public static readonly TIMESLICE = 108;
	public static readonly TO = 109;
	public static readonly TRANSITION = 110;
	public static readonly TRUE = 111;
	public static readonly USE = 112;
	public static readonly VARIATION = 113;
	public static readonly VERIFICATION = 114;
	public static readonly VERIFY = 115;
	public static readonly VIA = 116;
	public static readonly VIEW = 117;
	public static readonly VIEWPOINT = 118;
	public static readonly WHEN = 119;
	public static readonly XOR = 120;
	public static readonly COLONCOLON = 121;
	public static readonly COLONCOLONGT = 122;
	public static readonly COLONGT = 123;
	public static readonly COLONGTGT = 124;
	public static readonly COLONASSIGN = 125;
	public static readonly QUESTIONQUESTION = 126;
	public static readonly LE = 127;
	public static readonly GE = 128;
	public static readonly EQ = 129;
	public static readonly NE = 130;
	public static readonly EEQ = 131;
	public static readonly NEE = 132;
	public static readonly POWER = 133;
	public static readonly DOTDOT = 134;
	public static readonly ARROW = 135;
	public static readonly COLON = 136;
	public static readonly SEMICOLON = 137;
	public static readonly COMMA = 138;
	public static readonly DOT = 139;
	public static readonly QUESTION = 140;
	public static readonly LPAREN = 141;
	public static readonly RPAREN = 142;
	public static readonly LBRACE = 143;
	public static readonly RBRACE = 144;
	public static readonly LBRACKET = 145;
	public static readonly RBRACKET = 146;
	public static readonly LT = 147;
	public static readonly GT = 148;
	public static readonly PLUS = 149;
	public static readonly MINUS = 150;
	public static readonly MULTIPLY = 151;
	public static readonly DIVIDE = 152;
	public static readonly MODULO = 153;
	public static readonly ASSIGN = 154;
	public static readonly AT_SIGN = 155;
	public static readonly HASH = 156;
	public static readonly EXCLAMATION = 157;
	public static readonly TILDE = 158;
	public static readonly IDENTIFIER = 159;
	public static readonly INTEGER = 160;
	public static readonly REAL = 161;
	public static readonly STRING = 162;
	public static readonly UNIT_LITERAL = 163;
	public static readonly LINE_COMMENT = 164;
	public static readonly BLOCK_COMMENT = 165;
	public static readonly WS = 166;
	public static readonly ERROR_CHAR = 167;
	public static readonly RULE_model = 0;
	public static readonly RULE_element = 1;
	public static readonly RULE_aliasStatement = 2;
	public static readonly RULE_satisfyStatement = 3;
	public static readonly RULE_dependencyStatement = 4;
	public static readonly RULE_filterStatement = 5;
	public static readonly RULE_filterExpression = 6;
	public static readonly RULE_filterTerm = 7;
	public static readonly RULE_firstStatement = 8;
	public static readonly RULE_thenStatement = 9;
	public static readonly RULE_returnStatement = 10;
	public static readonly RULE_requireStatement = 11;
	public static readonly RULE_forkUsage = 12;
	public static readonly RULE_joinUsage = 13;
	public static readonly RULE_endFeature = 14;
	public static readonly RULE_metadataPrefix = 15;
	public static readonly RULE_bindUsage = 16;
	public static readonly RULE_connectStatement = 17;
	public static readonly RULE_redefinitionUsage = 18;
	public static readonly RULE_metaTyping = 19;
	public static readonly RULE_flowProperty = 20;
	public static readonly RULE_packageElement = 21;
	public static readonly RULE_importStatement = 22;
	public static readonly RULE_partDefinition = 23;
	public static readonly RULE_partUsage = 24;
	public static readonly RULE_actionDefinition = 25;
	public static readonly RULE_actionUsage = 26;
	public static readonly RULE_performAction = 27;
	public static readonly RULE_exhibitState = 28;
	public static readonly RULE_entryAction = 29;
	public static readonly RULE_exitAction = 30;
	public static readonly RULE_doAction = 31;
	public static readonly RULE_acceptEvent = 32;
	public static readonly RULE_sendAction = 33;
	public static readonly RULE_stateDefinition = 34;
	public static readonly RULE_stateUsage = 35;
	public static readonly RULE_eventDefinition = 36;
	public static readonly RULE_eventUsage = 37;
	public static readonly RULE_requirementDefinition = 38;
	public static readonly RULE_requirementUsage = 39;
	public static readonly RULE_useCaseDefinition = 40;
	public static readonly RULE_useCaseUsage = 41;
	public static readonly RULE_constraintDefinition = 42;
	public static readonly RULE_constraintUsage = 43;
	public static readonly RULE_attributeDefinition = 44;
	public static readonly RULE_attributeUsage = 45;
	public static readonly RULE_valueBinding = 46;
	public static readonly RULE_portDefinition = 47;
	public static readonly RULE_portUsage = 48;
	public static readonly RULE_connectionDefinition = 49;
	public static readonly RULE_connectionUsage = 50;
	public static readonly RULE_interfaceDefinition = 51;
	public static readonly RULE_interfaceUsage = 52;
	public static readonly RULE_allocationDefinition = 53;
	public static readonly RULE_allocationUsage = 54;
	public static readonly RULE_allocationBody = 55;
	public static readonly RULE_itemDefinition = 56;
	public static readonly RULE_itemUsage = 57;
	public static readonly RULE_definition = 58;
	public static readonly RULE_individualDefinition = 59;
	public static readonly RULE_individualUsage = 60;
	public static readonly RULE_timesliceUsage = 61;
	public static readonly RULE_snapshotUsage = 62;
	public static readonly RULE_actorDefinition = 63;
	public static readonly RULE_actorUsage = 64;
	public static readonly RULE_concernDefinition = 65;
	public static readonly RULE_concernUsage = 66;
	public static readonly RULE_analysisDefinition = 67;
	public static readonly RULE_analysisUsage = 68;
	public static readonly RULE_subjectUsage = 69;
	public static readonly RULE_objectiveUsage = 70;
	public static readonly RULE_stakeholderUsage = 71;
	public static readonly RULE_allocateStatement = 72;
	public static readonly RULE_allocateBody = 73;
	public static readonly RULE_verificationDefinition = 74;
	public static readonly RULE_verificationUsage = 75;
	public static readonly RULE_verificationBody = 76;
	public static readonly RULE_verificationBodyElement = 77;
	public static readonly RULE_verifyStatement = 78;
	public static readonly RULE_viewDefinition = 79;
	public static readonly RULE_viewUsage = 80;
	public static readonly RULE_viewBody = 81;
	public static readonly RULE_viewBodyElement = 82;
	public static readonly RULE_exposeStatement = 83;
	public static readonly RULE_exposeTarget = 84;
	public static readonly RULE_viewpointDefinition = 85;
	public static readonly RULE_viewpointUsage = 86;
	public static readonly RULE_enumerationDefinition = 87;
	public static readonly RULE_enumerationUsage = 88;
	public static readonly RULE_datatypeDefinition = 89;
	public static readonly RULE_datatypeUsage = 90;
	public static readonly RULE_associationDefinition = 91;
	public static readonly RULE_associationUsage = 92;
	public static readonly RULE_metadataDefinition = 93;
	public static readonly RULE_metadataUsage = 94;
	public static readonly RULE_metadataAnnotation = 95;
	public static readonly RULE_comment = 96;
	public static readonly RULE_documentation = 97;
	public static readonly RULE_calculation = 98;
	public static readonly RULE_calcUsage = 99;
	public static readonly RULE_interactionDefinition = 100;
	public static readonly RULE_interactionUsage = 101;
	public static readonly RULE_participantUsage = 102;
	public static readonly RULE_messageUsage = 103;
	public static readonly RULE_messagePattern = 104;
	public static readonly RULE_payloadUsage = 105;
	public static readonly RULE_occurrenceUsage = 106;
	public static readonly RULE_alternativeUsage = 107;
	public static readonly RULE_elseUsage = 108;
	public static readonly RULE_featureDefinition = 109;
	public static readonly RULE_featureUsage = 110;
	public static readonly RULE_functionDefinition = 111;
	public static readonly RULE_functionSignature = 112;
	public static readonly RULE_parameterList = 113;
	public static readonly RULE_parameter = 114;
	public static readonly RULE_direction = 115;
	public static readonly RULE_returnType = 116;
	public static readonly RULE_visibility = 117;
	public static readonly RULE_modifier = 118;
	public static readonly RULE_typing = 119;
	public static readonly RULE_typeParameters = 120;
	public static readonly RULE_typeParameterList = 121;
	public static readonly RULE_specialization = 122;
	public static readonly RULE_multiplicity = 123;
	public static readonly RULE_multiplicityModifier = 124;
	public static readonly RULE_multiplicityRange = 125;
	public static readonly RULE_multiplicityBound = 126;
	public static readonly RULE_body = 127;
	public static readonly RULE_bodyElement = 128;
	public static readonly RULE_enumValueBinding = 129;
	public static readonly RULE_flowStatement = 130;
	public static readonly RULE_expression = 131;
	public static readonly RULE_conditionalExpression = 132;
	public static readonly RULE_nullCoalescingExpression = 133;
	public static readonly RULE_logicalOrExpression = 134;
	public static readonly RULE_logicalXorExpression = 135;
	public static readonly RULE_logicalAndExpression = 136;
	public static readonly RULE_equalityExpression = 137;
	public static readonly RULE_relationalExpression = 138;
	public static readonly RULE_additiveExpression = 139;
	public static readonly RULE_multiplicativeExpression = 140;
	public static readonly RULE_exponentialExpression = 141;
	public static readonly RULE_unaryExpression = 142;
	public static readonly RULE_postfixExpression = 143;
	public static readonly RULE_postfixOperator = 144;
	public static readonly RULE_primaryExpression = 145;
	public static readonly RULE_expressionList = 146;
	public static readonly RULE_unitSuffix = 147;
	public static readonly RULE_argumentList = 148;
	public static readonly RULE_argument = 149;
	public static readonly RULE_literal = 150;
	public static readonly RULE_stringValue = 151;
	public static readonly RULE_booleanValue = 152;
	public static readonly RULE_nullValue = 153;
	public static readonly RULE_qualifiedName = 154;
	public static readonly RULE_identifier = 155;
	public static readonly RULE_shortName = 156;
	public static readonly RULE_keyword = 157;
	public static readonly RULE_stateTransition = 158;
	public static readonly RULE_fromState = 159;
	public static readonly RULE_toState = 160;
	public static readonly RULE_transitionTrigger = 161;
	public static readonly RULE_transitionGuard = 162;
	public static readonly RULE_transitionEffect = 163;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"model", "element", "aliasStatement", "satisfyStatement", "dependencyStatement", 
		"filterStatement", "filterExpression", "filterTerm", "firstStatement", 
		"thenStatement", "returnStatement", "requireStatement", "forkUsage", "joinUsage", 
		"endFeature", "metadataPrefix", "bindUsage", "connectStatement", "redefinitionUsage", 
		"metaTyping", "flowProperty", "packageElement", "importStatement", "partDefinition", 
		"partUsage", "actionDefinition", "actionUsage", "performAction", "exhibitState", 
		"entryAction", "exitAction", "doAction", "acceptEvent", "sendAction", 
		"stateDefinition", "stateUsage", "eventDefinition", "eventUsage", "requirementDefinition", 
		"requirementUsage", "useCaseDefinition", "useCaseUsage", "constraintDefinition", 
		"constraintUsage", "attributeDefinition", "attributeUsage", "valueBinding", 
		"portDefinition", "portUsage", "connectionDefinition", "connectionUsage", 
		"interfaceDefinition", "interfaceUsage", "allocationDefinition", "allocationUsage", 
		"allocationBody", "itemDefinition", "itemUsage", "definition", "individualDefinition", 
		"individualUsage", "timesliceUsage", "snapshotUsage", "actorDefinition", 
		"actorUsage", "concernDefinition", "concernUsage", "analysisDefinition", 
		"analysisUsage", "subjectUsage", "objectiveUsage", "stakeholderUsage", 
		"allocateStatement", "allocateBody", "verificationDefinition", "verificationUsage", 
		"verificationBody", "verificationBodyElement", "verifyStatement", "viewDefinition", 
		"viewUsage", "viewBody", "viewBodyElement", "exposeStatement", "exposeTarget", 
		"viewpointDefinition", "viewpointUsage", "enumerationDefinition", "enumerationUsage", 
		"datatypeDefinition", "datatypeUsage", "associationDefinition", "associationUsage", 
		"metadataDefinition", "metadataUsage", "metadataAnnotation", "comment", 
		"documentation", "calculation", "calcUsage", "interactionDefinition", 
		"interactionUsage", "participantUsage", "messageUsage", "messagePattern", 
		"payloadUsage", "occurrenceUsage", "alternativeUsage", "elseUsage", "featureDefinition", 
		"featureUsage", "functionDefinition", "functionSignature", "parameterList", 
		"parameter", "direction", "returnType", "visibility", "modifier", "typing", 
		"typeParameters", "typeParameterList", "specialization", "multiplicity", 
		"multiplicityModifier", "multiplicityRange", "multiplicityBound", "body", 
		"bodyElement", "enumValueBinding", "flowStatement", "expression", "conditionalExpression", 
		"nullCoalescingExpression", "logicalOrExpression", "logicalXorExpression", 
		"logicalAndExpression", "equalityExpression", "relationalExpression", 
		"additiveExpression", "multiplicativeExpression", "exponentialExpression", 
		"unaryExpression", "postfixExpression", "postfixOperator", "primaryExpression", 
		"expressionList", "unitSuffix", "argumentList", "argument", "literal", 
		"stringValue", "booleanValue", "nullValue", "qualifiedName", "identifier", 
		"shortName", "keyword", "stateTransition", "fromState", "toState", "transitionTrigger", 
		"transitionGuard", "transitionEffect",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'about'", "'abstract'", "'accept'", "'action'", "'actor'", 
		"'alias'", "'all'", "'allocate'", "'allocation'", "'alt'", "'analysis'", 
		"'and'", "'assoc'", "'at'", "'attribute'", "'bind'", "'binds'", "'by'", 
		"'calc'", "'case'", "'chain'", "'chains'", "'comment'", "'concern'", "'connect'", 
		"'connection'", "'constraint'", "'datatype'", "'def'", "'default'", "'definition'", 
		"'dependency'", "'derived'", "'direction'", "'do'", "'doc'", "'else'", 
		"'end'", "'entry'", "'enum'", "'event'", "'exhibit'", "'exit'", "'expose'", 
		"'expr'", "'false'", "'feature'", "'filter'", "'first'", "'flow'", "'for'", 
		"'fork'", "'from'", "'function'", "'hastype'", "'if'", "'import'", "'in'", 
		"'individual'", "'inout'", "'interaction'", "'interface'", "'item'", "'join'", 
		"'library'", "'message'", "'meta'", "'metadata'", "'nonunique'", "'not'", 
		"'new'", "'null'", "'objective'", "'occurrence'", "'of'", "'or'", "'ordered'", 
		"'out'", "'package'", "'parallel'", "'part'", "'participant'", "'perform'", 
		"'payload'", "'port'", "'private'", "'property'", "'protected'", "'public'", 
		"'readonly'", "'redefines'", "'ref'", "'references'", "'require'", "'requirement'", 
		"'return'", "'satisfy'", "'send'", "'SendMessage'", "'specializes'", "'stakeholder'", 
		"'standard'", "'state'", "'subject'", "'subsets'", "'snapshot'", "'then'", 
		"'timeslice'", "'to'", "'transition'", "'true'", "'use'", "'variation'", 
		"'verification'", "'verify'", "'via'", "'view'", "'viewpoint'", "'when'", 
		"'xor'", "'::'", "'::>'", "':>'", "':>>'", "':='", "'??'", "'<='", "'>='", 
		"'=='", "'!='", "'==='", "'!=='", "'**'", "'..'", "'->'", "':'", "';'", 
		"','", "'.'", "'?'", "'('", "')'", "'{'", "'}'", "'['", "']'", "'<'", 
		"'>'", "'+'", "'-'", "'*'", "'/'", "'%'", "'='", "'@'", "'#'", "'!'", 
		"'~'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ABOUT", "ABSTRACT", "ACCEPT", "ACTION", "ACTOR", "ALIAS", 
		"ALL", "ALLOCATE", "ALLOCATION", "ALT", "ANALYSIS", "AND", "ASSOC", "AT", 
		"ATTRIBUTE", "BIND", "BINDS", "BY", "CALC", "CASE", "CHAIN", "CHAINS", 
		"COMMENT", "CONCERN", "CONNECT", "CONNECTION", "CONSTRAINT", "DATATYPE", 
		"DEF", "DEFAULT", "DEFINITION", "DEPENDENCY", "DERIVED", "DIRECTION", 
		"DO", "DOC", "ELSE", "END", "ENTRY", "ENUM", "EVENT", "EXHIBIT", "EXIT", 
		"EXPOSE", "EXPR", "FALSE", "FEATURE", "FILTER", "FIRST", "FLOW", "FOR", 
		"FORK", "FROM", "FUNCTION", "HASTYPE", "IF", "IMPORT", "IN", "INDIVIDUAL", 
		"INOUT", "INTERACTION", "INTERFACE", "ITEM", "JOIN", "LIBRARY", "MESSAGE", 
		"META", "METADATA", "NONUNIQUE", "NOT", "NEW", "NULL", "OBJECTIVE", "OCCURRENCE", 
		"OF", "OR", "ORDERED", "OUT", "PACKAGE", "PARALLEL", "PART", "PARTICIPANT", 
		"PERFORM", "PAYLOAD", "PORT", "PRIVATE", "PROPERTY", "PROTECTED", "PUBLIC", 
		"READONLY", "REDEFINES", "REF", "REFERENCES", "REQUIRE", "REQUIREMENT", 
		"RETURN", "SATISFY", "SEND", "SENDMESSAGE", "SPECIALIZES", "STAKEHOLDER", 
		"STANDARD", "STATE", "SUBJECT", "SUBSETS", "SNAPSHOT", "THEN", "TIMESLICE", 
		"TO", "TRANSITION", "TRUE", "USE", "VARIATION", "VERIFICATION", "VERIFY", 
		"VIA", "VIEW", "VIEWPOINT", "WHEN", "XOR", "COLONCOLON", "COLONCOLONGT", 
		"COLONGT", "COLONGTGT", "COLONASSIGN", "QUESTIONQUESTION", "LE", "GE", 
		"EQ", "NE", "EEQ", "NEE", "POWER", "DOTDOT", "ARROW", "COLON", "SEMICOLON", 
		"COMMA", "DOT", "QUESTION", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", 
		"RBRACKET", "LT", "GT", "PLUS", "MINUS", "MULTIPLY", "DIVIDE", "MODULO", 
		"ASSIGN", "AT_SIGN", "HASH", "EXCLAMATION", "TILDE", "IDENTIFIER", "INTEGER", 
		"REAL", "STRING", "UNIT_LITERAL", "LINE_COMMENT", "BLOCK_COMMENT", "WS", 
		"ERROR_CHAR",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(SysMLv2._LITERAL_NAMES, SysMLv2._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return SysMLv2.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "SysMLv2.g4"; }

	// @Override
	public get ruleNames(): string[] { return SysMLv2.ruleNames; }

	// @Override
	public get serializedATN(): string { return SysMLv2._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(SysMLv2._ATN, this);
	}
	// @RuleVersion(0)
	public model(): ModelContext {
		let _localctx: ModelContext = new ModelContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, SysMLv2.RULE_model);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 331;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ABSTRACT) | (1 << SysMLv2.ACCEPT) | (1 << SysMLv2.ACTION) | (1 << SysMLv2.ACTOR) | (1 << SysMLv2.ALIAS) | (1 << SysMLv2.ALLOCATE) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ALT) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ASSOC) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.BIND) | (1 << SysMLv2.CALC) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECT) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT) | (1 << SysMLv2.DATATYPE) | (1 << SysMLv2.DEF))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (SysMLv2.DEPENDENCY - 32)) | (1 << (SysMLv2.DERIVED - 32)) | (1 << (SysMLv2.DIRECTION - 32)) | (1 << (SysMLv2.DO - 32)) | (1 << (SysMLv2.DOC - 32)) | (1 << (SysMLv2.ELSE - 32)) | (1 << (SysMLv2.END - 32)) | (1 << (SysMLv2.ENTRY - 32)) | (1 << (SysMLv2.ENUM - 32)) | (1 << (SysMLv2.EVENT - 32)) | (1 << (SysMLv2.EXHIBIT - 32)) | (1 << (SysMLv2.EXIT - 32)) | (1 << (SysMLv2.FEATURE - 32)) | (1 << (SysMLv2.FILTER - 32)) | (1 << (SysMLv2.FIRST - 32)) | (1 << (SysMLv2.FLOW - 32)) | (1 << (SysMLv2.FORK - 32)) | (1 << (SysMLv2.FUNCTION - 32)) | (1 << (SysMLv2.IF - 32)) | (1 << (SysMLv2.IMPORT - 32)) | (1 << (SysMLv2.IN - 32)) | (1 << (SysMLv2.INDIVIDUAL - 32)) | (1 << (SysMLv2.INOUT - 32)) | (1 << (SysMLv2.INTERACTION - 32)) | (1 << (SysMLv2.INTERFACE - 32)) | (1 << (SysMLv2.ITEM - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (SysMLv2.JOIN - 64)) | (1 << (SysMLv2.LIBRARY - 64)) | (1 << (SysMLv2.MESSAGE - 64)) | (1 << (SysMLv2.METADATA - 64)) | (1 << (SysMLv2.NONUNIQUE - 64)) | (1 << (SysMLv2.OBJECTIVE - 64)) | (1 << (SysMLv2.OCCURRENCE - 64)) | (1 << (SysMLv2.ORDERED - 64)) | (1 << (SysMLv2.OUT - 64)) | (1 << (SysMLv2.PACKAGE - 64)) | (1 << (SysMLv2.PART - 64)) | (1 << (SysMLv2.PARTICIPANT - 64)) | (1 << (SysMLv2.PERFORM - 64)) | (1 << (SysMLv2.PAYLOAD - 64)) | (1 << (SysMLv2.PORT - 64)) | (1 << (SysMLv2.PRIVATE - 64)) | (1 << (SysMLv2.PROPERTY - 64)) | (1 << (SysMLv2.PROTECTED - 64)) | (1 << (SysMLv2.PUBLIC - 64)) | (1 << (SysMLv2.READONLY - 64)) | (1 << (SysMLv2.REDEFINES - 64)) | (1 << (SysMLv2.REF - 64)) | (1 << (SysMLv2.REQUIRE - 64)) | (1 << (SysMLv2.REQUIREMENT - 64)))) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & ((1 << (SysMLv2.RETURN - 96)) | (1 << (SysMLv2.SATISFY - 96)) | (1 << (SysMLv2.SEND - 96)) | (1 << (SysMLv2.STAKEHOLDER - 96)) | (1 << (SysMLv2.STANDARD - 96)) | (1 << (SysMLv2.STATE - 96)) | (1 << (SysMLv2.SUBJECT - 96)) | (1 << (SysMLv2.SNAPSHOT - 96)) | (1 << (SysMLv2.THEN - 96)) | (1 << (SysMLv2.TIMESLICE - 96)) | (1 << (SysMLv2.TRANSITION - 96)) | (1 << (SysMLv2.USE - 96)) | (1 << (SysMLv2.VARIATION - 96)) | (1 << (SysMLv2.VERIFICATION - 96)) | (1 << (SysMLv2.VERIFY - 96)) | (1 << (SysMLv2.VIEW - 96)) | (1 << (SysMLv2.VIEWPOINT - 96)) | (1 << (SysMLv2.COLONGTGT - 96)))) !== 0) || ((((_la - 155)) & ~0x1F) === 0 && ((1 << (_la - 155)) & ((1 << (SysMLv2.AT_SIGN - 155)) | (1 << (SysMLv2.HASH - 155)) | (1 << (SysMLv2.IDENTIFIER - 155)) | (1 << (SysMLv2.STRING - 155)))) !== 0)) {
				{
				{
				this.state = 328;
				this.element();
				}
				}
				this.state = 333;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 334;
			this.match(SysMLv2.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public element(): ElementContext {
		let _localctx: ElementContext = new ElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, SysMLv2.RULE_element);
		try {
			this.state = 434;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 336;
				this.importStatement();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 337;
				this.individualDefinition();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 338;
				this.individualUsage();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 339;
				this.packageElement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 340;
				this.definition();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 341;
				this.partDefinition();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 342;
				this.partUsage();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 343;
				this.actionDefinition();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 344;
				this.actionUsage();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 345;
				this.stateDefinition();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 346;
				this.stateUsage();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 347;
				this.requirementDefinition();
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 348;
				this.requirementUsage();
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 349;
				this.useCaseDefinition();
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 350;
				this.useCaseUsage();
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 351;
				this.constraintDefinition();
				}
				break;

			case 17:
				this.enterOuterAlt(_localctx, 17);
				{
				this.state = 352;
				this.constraintUsage();
				}
				break;

			case 18:
				this.enterOuterAlt(_localctx, 18);
				{
				this.state = 353;
				this.attributeDefinition();
				}
				break;

			case 19:
				this.enterOuterAlt(_localctx, 19);
				{
				this.state = 354;
				this.attributeUsage();
				}
				break;

			case 20:
				this.enterOuterAlt(_localctx, 20);
				{
				this.state = 355;
				this.portDefinition();
				}
				break;

			case 21:
				this.enterOuterAlt(_localctx, 21);
				{
				this.state = 356;
				this.portUsage();
				}
				break;

			case 22:
				this.enterOuterAlt(_localctx, 22);
				{
				this.state = 357;
				this.connectionDefinition();
				}
				break;

			case 23:
				this.enterOuterAlt(_localctx, 23);
				{
				this.state = 358;
				this.connectionUsage();
				}
				break;

			case 24:
				this.enterOuterAlt(_localctx, 24);
				{
				this.state = 359;
				this.interfaceDefinition();
				}
				break;

			case 25:
				this.enterOuterAlt(_localctx, 25);
				{
				this.state = 360;
				this.interfaceUsage();
				}
				break;

			case 26:
				this.enterOuterAlt(_localctx, 26);
				{
				this.state = 361;
				this.allocationDefinition();
				}
				break;

			case 27:
				this.enterOuterAlt(_localctx, 27);
				{
				this.state = 362;
				this.allocationUsage();
				}
				break;

			case 28:
				this.enterOuterAlt(_localctx, 28);
				{
				this.state = 363;
				this.itemDefinition();
				}
				break;

			case 29:
				this.enterOuterAlt(_localctx, 29);
				{
				this.state = 364;
				this.itemUsage();
				}
				break;

			case 30:
				this.enterOuterAlt(_localctx, 30);
				{
				this.state = 365;
				this.actorDefinition();
				}
				break;

			case 31:
				this.enterOuterAlt(_localctx, 31);
				{
				this.state = 366;
				this.actorUsage();
				}
				break;

			case 32:
				this.enterOuterAlt(_localctx, 32);
				{
				this.state = 367;
				this.concernDefinition();
				}
				break;

			case 33:
				this.enterOuterAlt(_localctx, 33);
				{
				this.state = 368;
				this.concernUsage();
				}
				break;

			case 34:
				this.enterOuterAlt(_localctx, 34);
				{
				this.state = 369;
				this.analysisDefinition();
				}
				break;

			case 35:
				this.enterOuterAlt(_localctx, 35);
				{
				this.state = 370;
				this.analysisUsage();
				}
				break;

			case 36:
				this.enterOuterAlt(_localctx, 36);
				{
				this.state = 371;
				this.verificationDefinition();
				}
				break;

			case 37:
				this.enterOuterAlt(_localctx, 37);
				{
				this.state = 372;
				this.verificationUsage();
				}
				break;

			case 38:
				this.enterOuterAlt(_localctx, 38);
				{
				this.state = 373;
				this.viewDefinition();
				}
				break;

			case 39:
				this.enterOuterAlt(_localctx, 39);
				{
				this.state = 374;
				this.viewUsage();
				}
				break;

			case 40:
				this.enterOuterAlt(_localctx, 40);
				{
				this.state = 375;
				this.viewpointDefinition();
				}
				break;

			case 41:
				this.enterOuterAlt(_localctx, 41);
				{
				this.state = 376;
				this.viewpointUsage();
				}
				break;

			case 42:
				this.enterOuterAlt(_localctx, 42);
				{
				this.state = 377;
				this.enumerationDefinition();
				}
				break;

			case 43:
				this.enterOuterAlt(_localctx, 43);
				{
				this.state = 378;
				this.enumerationUsage();
				}
				break;

			case 44:
				this.enterOuterAlt(_localctx, 44);
				{
				this.state = 379;
				this.datatypeDefinition();
				}
				break;

			case 45:
				this.enterOuterAlt(_localctx, 45);
				{
				this.state = 380;
				this.datatypeUsage();
				}
				break;

			case 46:
				this.enterOuterAlt(_localctx, 46);
				{
				this.state = 381;
				this.associationDefinition();
				}
				break;

			case 47:
				this.enterOuterAlt(_localctx, 47);
				{
				this.state = 382;
				this.associationUsage();
				}
				break;

			case 48:
				this.enterOuterAlt(_localctx, 48);
				{
				this.state = 383;
				this.metadataDefinition();
				}
				break;

			case 49:
				this.enterOuterAlt(_localctx, 49);
				{
				this.state = 384;
				this.metadataUsage();
				}
				break;

			case 50:
				this.enterOuterAlt(_localctx, 50);
				{
				this.state = 385;
				this.metadataAnnotation();
				}
				break;

			case 51:
				this.enterOuterAlt(_localctx, 51);
				{
				this.state = 386;
				this.comment();
				}
				break;

			case 52:
				this.enterOuterAlt(_localctx, 52);
				{
				this.state = 387;
				this.documentation();
				}
				break;

			case 53:
				this.enterOuterAlt(_localctx, 53);
				{
				this.state = 388;
				this.calculation();
				}
				break;

			case 54:
				this.enterOuterAlt(_localctx, 54);
				{
				this.state = 389;
				this.calcUsage();
				}
				break;

			case 55:
				this.enterOuterAlt(_localctx, 55);
				{
				this.state = 390;
				this.interactionDefinition();
				}
				break;

			case 56:
				this.enterOuterAlt(_localctx, 56);
				{
				this.state = 391;
				this.interactionUsage();
				}
				break;

			case 57:
				this.enterOuterAlt(_localctx, 57);
				{
				this.state = 392;
				this.participantUsage();
				}
				break;

			case 58:
				this.enterOuterAlt(_localctx, 58);
				{
				this.state = 393;
				this.messageUsage();
				}
				break;

			case 59:
				this.enterOuterAlt(_localctx, 59);
				{
				this.state = 394;
				this.payloadUsage();
				}
				break;

			case 60:
				this.enterOuterAlt(_localctx, 60);
				{
				this.state = 395;
				this.occurrenceUsage();
				}
				break;

			case 61:
				this.enterOuterAlt(_localctx, 61);
				{
				this.state = 396;
				this.alternativeUsage();
				}
				break;

			case 62:
				this.enterOuterAlt(_localctx, 62);
				{
				this.state = 397;
				this.elseUsage();
				}
				break;

			case 63:
				this.enterOuterAlt(_localctx, 63);
				{
				this.state = 398;
				this.featureDefinition();
				}
				break;

			case 64:
				this.enterOuterAlt(_localctx, 64);
				{
				this.state = 399;
				this.featureUsage();
				}
				break;

			case 65:
				this.enterOuterAlt(_localctx, 65);
				{
				this.state = 400;
				this.definition();
				}
				break;

			case 66:
				this.enterOuterAlt(_localctx, 66);
				{
				this.state = 401;
				this.functionDefinition();
				}
				break;

			case 67:
				this.enterOuterAlt(_localctx, 67);
				{
				this.state = 402;
				this.eventDefinition();
				}
				break;

			case 68:
				this.enterOuterAlt(_localctx, 68);
				{
				this.state = 403;
				this.eventUsage();
				}
				break;

			case 69:
				this.enterOuterAlt(_localctx, 69);
				{
				this.state = 404;
				this.performAction();
				}
				break;

			case 70:
				this.enterOuterAlt(_localctx, 70);
				{
				this.state = 405;
				this.exhibitState();
				}
				break;

			case 71:
				this.enterOuterAlt(_localctx, 71);
				{
				this.state = 406;
				this.entryAction();
				}
				break;

			case 72:
				this.enterOuterAlt(_localctx, 72);
				{
				this.state = 407;
				this.exitAction();
				}
				break;

			case 73:
				this.enterOuterAlt(_localctx, 73);
				{
				this.state = 408;
				this.doAction();
				}
				break;

			case 74:
				this.enterOuterAlt(_localctx, 74);
				{
				this.state = 409;
				this.acceptEvent();
				}
				break;

			case 75:
				this.enterOuterAlt(_localctx, 75);
				{
				this.state = 410;
				this.sendAction();
				}
				break;

			case 76:
				this.enterOuterAlt(_localctx, 76);
				{
				this.state = 411;
				this.stateTransition();
				}
				break;

			case 77:
				this.enterOuterAlt(_localctx, 77);
				{
				this.state = 412;
				this.subjectUsage();
				}
				break;

			case 78:
				this.enterOuterAlt(_localctx, 78);
				{
				this.state = 413;
				this.objectiveUsage();
				}
				break;

			case 79:
				this.enterOuterAlt(_localctx, 79);
				{
				this.state = 414;
				this.stakeholderUsage();
				}
				break;

			case 80:
				this.enterOuterAlt(_localctx, 80);
				{
				this.state = 415;
				this.allocateStatement();
				}
				break;

			case 81:
				this.enterOuterAlt(_localctx, 81);
				{
				this.state = 416;
				this.endFeature();
				}
				break;

			case 82:
				this.enterOuterAlt(_localctx, 82);
				{
				this.state = 417;
				this.redefinitionUsage();
				}
				break;

			case 83:
				this.enterOuterAlt(_localctx, 83);
				{
				this.state = 418;
				this.flowProperty();
				}
				break;

			case 84:
				this.enterOuterAlt(_localctx, 84);
				{
				this.state = 419;
				this.bindUsage();
				}
				break;

			case 85:
				this.enterOuterAlt(_localctx, 85);
				{
				this.state = 420;
				this.connectStatement();
				}
				break;

			case 86:
				this.enterOuterAlt(_localctx, 86);
				{
				this.state = 421;
				this.aliasStatement();
				}
				break;

			case 87:
				this.enterOuterAlt(_localctx, 87);
				{
				this.state = 422;
				this.satisfyStatement();
				}
				break;

			case 88:
				this.enterOuterAlt(_localctx, 88);
				{
				this.state = 423;
				this.dependencyStatement();
				}
				break;

			case 89:
				this.enterOuterAlt(_localctx, 89);
				{
				this.state = 424;
				this.firstStatement();
				}
				break;

			case 90:
				this.enterOuterAlt(_localctx, 90);
				{
				this.state = 425;
				this.thenStatement();
				}
				break;

			case 91:
				this.enterOuterAlt(_localctx, 91);
				{
				this.state = 426;
				this.returnStatement();
				}
				break;

			case 92:
				this.enterOuterAlt(_localctx, 92);
				{
				this.state = 427;
				this.requireStatement();
				}
				break;

			case 93:
				this.enterOuterAlt(_localctx, 93);
				{
				this.state = 428;
				this.verifyStatement();
				}
				break;

			case 94:
				this.enterOuterAlt(_localctx, 94);
				{
				this.state = 429;
				this.timesliceUsage();
				}
				break;

			case 95:
				this.enterOuterAlt(_localctx, 95);
				{
				this.state = 430;
				this.snapshotUsage();
				}
				break;

			case 96:
				this.enterOuterAlt(_localctx, 96);
				{
				this.state = 431;
				this.filterStatement();
				}
				break;

			case 97:
				this.enterOuterAlt(_localctx, 97);
				{
				this.state = 432;
				this.forkUsage();
				}
				break;

			case 98:
				this.enterOuterAlt(_localctx, 98);
				{
				this.state = 433;
				this.joinUsage();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public aliasStatement(): AliasStatementContext {
		let _localctx: AliasStatementContext = new AliasStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, SysMLv2.RULE_aliasStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 436;
			this.match(SysMLv2.ALIAS);
			this.state = 437;
			this.identifier();
			this.state = 438;
			this.match(SysMLv2.FOR);
			this.state = 439;
			this.qualifiedName();
			this.state = 441;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 440;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public satisfyStatement(): SatisfyStatementContext {
		let _localctx: SatisfyStatementContext = new SatisfyStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, SysMLv2.RULE_satisfyStatement);
		let _la: number;
		try {
			this.state = 459;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 443;
				this.match(SysMLv2.SATISFY);
				this.state = 444;
				this.qualifiedName();
				this.state = 445;
				this.match(SysMLv2.BY);
				this.state = 446;
				this.qualifiedName();
				this.state = 449;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 447;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 448;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 451;
				this.match(SysMLv2.SATISFY);
				this.state = 452;
				this.match(SysMLv2.REQUIREMENT);
				this.state = 453;
				this.identifier();
				this.state = 455;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 454;
					this.typing();
					}
				}

				this.state = 457;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public dependencyStatement(): DependencyStatementContext {
		let _localctx: DependencyStatementContext = new DependencyStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, SysMLv2.RULE_dependencyStatement);
		let _la: number;
		try {
			this.state = 477;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.DEPENDENCY:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 461;
				this.match(SysMLv2.DEPENDENCY);
				this.state = 462;
				this.match(SysMLv2.FROM);
				this.state = 463;
				this.qualifiedName();
				this.state = 464;
				this.match(SysMLv2.TO);
				this.state = 465;
				this.qualifiedName();
				this.state = 467;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 466;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			case SysMLv2.HASH:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 469;
				this.metadataPrefix();
				this.state = 470;
				this.match(SysMLv2.DEPENDENCY);
				this.state = 471;
				this.identifier();
				this.state = 472;
				this.match(SysMLv2.TO);
				this.state = 473;
				this.qualifiedName();
				this.state = 475;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 474;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filterStatement(): FilterStatementContext {
		let _localctx: FilterStatementContext = new FilterStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, SysMLv2.RULE_filterStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 479;
			this.match(SysMLv2.FILTER);
			this.state = 480;
			this.filterExpression();
			this.state = 482;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 481;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filterExpression(): FilterExpressionContext {
		let _localctx: FilterExpressionContext = new FilterExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, SysMLv2.RULE_filterExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 484;
			this.filterTerm();
			this.state = 489;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.AND || _la === SysMLv2.OR) {
				{
				{
				this.state = 485;
				_la = this._input.LA(1);
				if (!(_la === SysMLv2.AND || _la === SysMLv2.OR)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 486;
				this.filterTerm();
				}
				}
				this.state = 491;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filterTerm(): FilterTermContext {
		let _localctx: FilterTermContext = new FilterTermContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, SysMLv2.RULE_filterTerm);
		try {
			this.state = 495;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.AT_SIGN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 492;
				this.match(SysMLv2.AT_SIGN);
				this.state = 493;
				this.qualifiedName();
				}
				break;
			case SysMLv2.ACTION:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DIRECTION:
			case SysMLv2.DOC:
			case SysMLv2.EVENT:
			case SysMLv2.FEATURE:
			case SysMLv2.FLOW:
			case SysMLv2.FUNCTION:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PROPERTY:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 494;
				this.qualifiedName();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public firstStatement(): FirstStatementContext {
		let _localctx: FirstStatementContext = new FirstStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, SysMLv2.RULE_firstStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 497;
			this.match(SysMLv2.FIRST);
			this.state = 498;
			this.qualifiedName();
			this.state = 501;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				this.state = 499;
				this.match(SysMLv2.THEN);
				this.state = 500;
				this.qualifiedName();
				}
				break;
			}
			this.state = 504;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 503;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public thenStatement(): ThenStatementContext {
		let _localctx: ThenStatementContext = new ThenStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, SysMLv2.RULE_thenStatement);
		let _la: number;
		try {
			this.state = 545;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 506;
				this.match(SysMLv2.THEN);
				this.state = 507;
				this.match(SysMLv2.EVENT);
				this.state = 508;
				this.qualifiedName();
				this.state = 509;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 511;
				this.match(SysMLv2.THEN);
				this.state = 512;
				this.match(SysMLv2.ACTION);
				this.state = 513;
				this.identifier();
				this.state = 514;
				this.match(SysMLv2.ACCEPT);
				this.state = 515;
				this.identifier();
				this.state = 517;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 516;
					this.typing();
					}
				}

				this.state = 519;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 521;
				this.match(SysMLv2.THEN);
				this.state = 522;
				this.match(SysMLv2.ACTION);
				this.state = 523;
				this.identifier();
				this.state = 525;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 524;
					this.multiplicity();
					}
				}

				this.state = 529;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 527;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 528;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 531;
				this.match(SysMLv2.THEN);
				this.state = 532;
				this.match(SysMLv2.FORK);
				this.state = 533;
				this.identifier();
				this.state = 534;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 536;
				this.match(SysMLv2.THEN);
				this.state = 537;
				this.match(SysMLv2.JOIN);
				this.state = 538;
				this.identifier();
				this.state = 539;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 541;
				this.match(SysMLv2.THEN);
				this.state = 542;
				this.qualifiedName();
				this.state = 543;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnStatement(): ReturnStatementContext {
		let _localctx: ReturnStatementContext = new ReturnStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, SysMLv2.RULE_returnStatement);
		let _la: number;
		try {
			this.state = 573;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 24, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 547;
				this.match(SysMLv2.RETURN);
				this.state = 549;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 18, this._ctx) ) {
				case 1:
					{
					this.state = 548;
					_la = this._input.LA(1);
					if (!(_la === SysMLv2.ATTRIBUTE || _la === SysMLv2.PART)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					break;
				}
				this.state = 552;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0) || _la === SysMLv2.IDENTIFIER || _la === SysMLv2.STRING) {
					{
					this.state = 551;
					this.identifier();
					}
				}

				this.state = 555;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 554;
					this.typing();
					}
				}

				this.state = 559;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLONGT) {
					{
					this.state = 557;
					this.match(SysMLv2.COLONGT);
					this.state = 558;
					this.qualifiedName();
					}
				}

				this.state = 562;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
					{
					this.state = 561;
					this.valueBinding();
					}
				}

				this.state = 564;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 565;
				this.match(SysMLv2.RETURN);
				this.state = 566;
				this.match(SysMLv2.COLONGTGT);
				this.state = 567;
				this.identifier();
				this.state = 569;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
					{
					this.state = 568;
					this.valueBinding();
					}
				}

				this.state = 571;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public requireStatement(): RequireStatementContext {
		let _localctx: RequireStatementContext = new RequireStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, SysMLv2.RULE_requireStatement);
		try {
			this.state = 582;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 575;
				this.match(SysMLv2.REQUIRE);
				this.state = 576;
				this.qualifiedName();
				this.state = 577;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 579;
				this.match(SysMLv2.REQUIRE);
				this.state = 580;
				this.match(SysMLv2.CONSTRAINT);
				this.state = 581;
				this.body();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forkUsage(): ForkUsageContext {
		let _localctx: ForkUsageContext = new ForkUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, SysMLv2.RULE_forkUsage);
		try {
			this.state = 594;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 584;
				this.match(SysMLv2.FORK);
				this.state = 585;
				this.identifier();
				this.state = 586;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 588;
				this.match(SysMLv2.FORK);
				this.state = 589;
				this.identifier();
				this.state = 592;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 590;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 591;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public joinUsage(): JoinUsageContext {
		let _localctx: JoinUsageContext = new JoinUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, SysMLv2.RULE_joinUsage);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 596;
			this.match(SysMLv2.JOIN);
			this.state = 597;
			this.identifier();
			this.state = 598;
			this.match(SysMLv2.SEMICOLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public endFeature(): EndFeatureContext {
		let _localctx: EndFeatureContext = new EndFeatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, SysMLv2.RULE_endFeature);
		let _la: number;
		try {
			this.state = 622;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 34, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 600;
				this.match(SysMLv2.END);
				this.state = 602;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 28, this._ctx) ) {
				case 1:
					{
					this.state = 601;
					this.metadataPrefix();
					}
					break;
				}
				this.state = 605;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 29, this._ctx) ) {
				case 1:
					{
					this.state = 604;
					this.identifier();
					}
					break;
				}
				this.state = 608;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 607;
					this.typing();
					}
				}

				this.state = 611;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 610;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 613;
				this.match(SysMLv2.END);
				this.state = 615;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.HASH) {
					{
					this.state = 614;
					this.metadataPrefix();
					}
				}

				this.state = 617;
				_la = this._input.LA(1);
				if (!(_la === SysMLv2.COLONCOLONGT || _la === SysMLv2.COLONGTGT)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 618;
				this.qualifiedName();
				this.state = 620;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 619;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public metadataPrefix(): MetadataPrefixContext {
		let _localctx: MetadataPrefixContext = new MetadataPrefixContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, SysMLv2.RULE_metadataPrefix);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 624;
			this.match(SysMLv2.HASH);
			this.state = 625;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bindUsage(): BindUsageContext {
		let _localctx: BindUsageContext = new BindUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, SysMLv2.RULE_bindUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 627;
			this.match(SysMLv2.BIND);
			this.state = 628;
			this.qualifiedName();
			this.state = 629;
			this.match(SysMLv2.ASSIGN);
			this.state = 630;
			this.qualifiedName();
			this.state = 632;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 631;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public connectStatement(): ConnectStatementContext {
		let _localctx: ConnectStatementContext = new ConnectStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, SysMLv2.RULE_connectStatement);
		let _la: number;
		try {
			this.state = 669;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 44, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 634;
				this.match(SysMLv2.CONNECT);
				this.state = 636;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 635;
					this.multiplicity();
					}
				}

				this.state = 638;
				this.identifier();
				this.state = 641;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLONCOLONGT) {
					{
					this.state = 639;
					this.match(SysMLv2.COLONCOLONGT);
					this.state = 640;
					this.qualifiedName();
					}
				}

				this.state = 643;
				this.match(SysMLv2.TO);
				this.state = 645;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 644;
					this.multiplicity();
					}
				}

				this.state = 647;
				this.identifier();
				this.state = 650;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLONCOLONGT) {
					{
					this.state = 648;
					this.match(SysMLv2.COLONCOLONGT);
					this.state = 649;
					this.qualifiedName();
					}
				}

				this.state = 654;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 652;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 653;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 656;
				this.match(SysMLv2.CONNECT);
				this.state = 658;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 657;
					this.multiplicity();
					}
				}

				this.state = 660;
				this.qualifiedName();
				this.state = 661;
				this.match(SysMLv2.TO);
				this.state = 663;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 662;
					this.multiplicity();
					}
				}

				this.state = 665;
				this.qualifiedName();
				this.state = 667;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 666;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public redefinitionUsage(): RedefinitionUsageContext {
		let _localctx: RedefinitionUsageContext = new RedefinitionUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, SysMLv2.RULE_redefinitionUsage);
		let _la: number;
		try {
			this.state = 694;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.COLONGTGT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 671;
				this.match(SysMLv2.COLONGTGT);
				this.state = 672;
				this.qualifiedName();
				this.state = 674;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 673;
					this.multiplicity();
					}
				}

				this.state = 685;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 676;
					this.body();
					}
					break;
				case SysMLv2.ASSIGN:
					{
					this.state = 677;
					this.match(SysMLv2.ASSIGN);
					this.state = 678;
					this.expression();
					this.state = 680;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === SysMLv2.META) {
						{
						this.state = 679;
						this.metaTyping();
						}
					}

					this.state = 682;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 684;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				break;
			case SysMLv2.REDEFINES:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 687;
				this.match(SysMLv2.REDEFINES);
				this.state = 688;
				this.qualifiedName();
				this.state = 690;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
					{
					this.state = 689;
					this.valueBinding();
					}
				}

				this.state = 692;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public metaTyping(): MetaTypingContext {
		let _localctx: MetaTypingContext = new MetaTypingContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, SysMLv2.RULE_metaTyping);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 696;
			this.match(SysMLv2.META);
			this.state = 697;
			this.qualifiedName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public flowProperty(): FlowPropertyContext {
		let _localctx: FlowPropertyContext = new FlowPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, SysMLv2.RULE_flowProperty);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 699;
			this.match(SysMLv2.FLOW);
			this.state = 700;
			this.match(SysMLv2.PROPERTY);
			this.state = 701;
			this.identifier();
			this.state = 703;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 702;
				this.typing();
				}
			}

			this.state = 707;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 51, this._ctx) ) {
			case 1:
				{
				this.state = 705;
				this.match(SysMLv2.DIRECTION);
				this.state = 706;
				this.direction();
				}
				break;
			}
			this.state = 710;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 709;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public packageElement(): PackageElementContext {
		let _localctx: PackageElementContext = new PackageElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, SysMLv2.RULE_packageElement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 713;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 712;
				this.visibility();
				}
			}

			this.state = 716;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.STANDARD) {
				{
				this.state = 715;
				this.match(SysMLv2.STANDARD);
				}
			}

			this.state = 719;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LIBRARY) {
				{
				this.state = 718;
				this.match(SysMLv2.LIBRARY);
				}
			}

			this.state = 721;
			this.match(SysMLv2.PACKAGE);
			this.state = 722;
			this.identifier();
			this.state = 724;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 723;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public importStatement(): ImportStatementContext {
		let _localctx: ImportStatementContext = new ImportStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, SysMLv2.RULE_importStatement);
		let _la: number;
		try {
			this.state = 773;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 67, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 727;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 726;
					this.visibility();
					}
				}

				this.state = 729;
				this.match(SysMLv2.IMPORT);
				this.state = 730;
				this.qualifiedName();
				this.state = 733;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLONCOLON) {
					{
					this.state = 731;
					this.match(SysMLv2.COLONCOLON);
					this.state = 732;
					_la = this._input.LA(1);
					if (!(_la === SysMLv2.POWER || _la === SysMLv2.MULTIPLY)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
				}

				this.state = 743;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 735;
					this.match(SysMLv2.COMMA);
					this.state = 736;
					this.qualifiedName();
					this.state = 739;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === SysMLv2.COLONCOLON) {
						{
						this.state = 737;
						this.match(SysMLv2.COLONCOLON);
						this.state = 738;
						_la = this._input.LA(1);
						if (!(_la === SysMLv2.POWER || _la === SysMLv2.MULTIPLY)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						}
					}

					}
					}
					this.state = 745;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 747;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 746;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 750;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 62, this._ctx) ) {
				case 1:
					{
					this.state = 749;
					this.visibility();
					}
					break;
				}
				this.state = 752;
				this.match(SysMLv2.PRIVATE);
				this.state = 753;
				this.match(SysMLv2.IMPORT);
				this.state = 754;
				this.qualifiedName();
				this.state = 757;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLONCOLON) {
					{
					this.state = 755;
					this.match(SysMLv2.COLONCOLON);
					this.state = 756;
					_la = this._input.LA(1);
					if (!(_la === SysMLv2.POWER || _la === SysMLv2.MULTIPLY)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
				}

				this.state = 767;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 759;
					this.match(SysMLv2.COMMA);
					this.state = 760;
					this.qualifiedName();
					this.state = 763;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === SysMLv2.COLONCOLON) {
						{
						this.state = 761;
						this.match(SysMLv2.COLONCOLON);
						this.state = 762;
						_la = this._input.LA(1);
						if (!(_la === SysMLv2.POWER || _la === SysMLv2.MULTIPLY)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						}
					}

					}
					}
					this.state = 769;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 771;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 770;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public partDefinition(): PartDefinitionContext {
		let _localctx: PartDefinitionContext = new PartDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, SysMLv2.RULE_partDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 776;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 775;
				this.visibility();
				}
			}

			this.state = 781;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 778;
				this.modifier();
				}
				}
				this.state = 783;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 784;
			this.match(SysMLv2.PART);
			this.state = 785;
			this.match(SysMLv2.DEF);
			this.state = 786;
			this.identifier();
			this.state = 788;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 70, this._ctx) ) {
			case 1:
				{
				this.state = 787;
				this.specialization();
				}
				break;
			}
			this.state = 792;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 790;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 791;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public partUsage(): PartUsageContext {
		let _localctx: PartUsageContext = new PartUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, SysMLv2.RULE_partUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 795;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 794;
				this.visibility();
				}
			}

			this.state = 798;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.HASH) {
				{
				this.state = 797;
				this.metadataPrefix();
				}
			}

			this.state = 803;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 800;
				this.modifier();
				}
				}
				this.state = 805;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 806;
			this.match(SysMLv2.PART);
			this.state = 808;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 75, this._ctx) ) {
			case 1:
				{
				this.state = 807;
				this.identifier();
				}
				break;
			}
			this.state = 811;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 810;
				this.typing();
				}
			}

			this.state = 814;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 77, this._ctx) ) {
			case 1:
				{
				this.state = 813;
				this.specialization();
				}
				break;
			}
			this.state = 817;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 816;
				this.multiplicity();
				}
			}

			this.state = 821;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 819;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 820;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actionDefinition(): ActionDefinitionContext {
		let _localctx: ActionDefinitionContext = new ActionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, SysMLv2.RULE_actionDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 824;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 823;
				this.visibility();
				}
			}

			this.state = 829;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 826;
				this.modifier();
				}
				}
				this.state = 831;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 832;
			this.match(SysMLv2.ACTION);
			this.state = 833;
			this.match(SysMLv2.DEF);
			this.state = 834;
			this.identifier();
			this.state = 836;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 82, this._ctx) ) {
			case 1:
				{
				this.state = 835;
				this.specialization();
				}
				break;
			}
			this.state = 840;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 838;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 839;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actionUsage(): ActionUsageContext {
		let _localctx: ActionUsageContext = new ActionUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, SysMLv2.RULE_actionUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 843;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 842;
				this.visibility();
				}
			}

			this.state = 848;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 845;
				this.modifier();
				}
				}
				this.state = 850;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 851;
			this.match(SysMLv2.ACTION);
			this.state = 852;
			this.identifier();
			this.state = 854;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 853;
				this.typing();
				}
			}

			this.state = 857;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 87, this._ctx) ) {
			case 1:
				{
				this.state = 856;
				this.specialization();
				}
				break;
			}
			this.state = 860;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 859;
				this.multiplicity();
				}
			}

			this.state = 864;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 862;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 863;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public performAction(): PerformActionContext {
		let _localctx: PerformActionContext = new PerformActionContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, SysMLv2.RULE_performAction);
		let _la: number;
		try {
			this.state = 887;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 95, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 866;
				this.match(SysMLv2.PERFORM);
				this.state = 868;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 90, this._ctx) ) {
				case 1:
					{
					this.state = 867;
					this.match(SysMLv2.ACTION);
					}
					break;
				}
				this.state = 870;
				this.qualifiedName();
				this.state = 872;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 871;
					this.multiplicity();
					}
				}

				this.state = 875;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 92, this._ctx) ) {
				case 1:
					{
					this.state = 874;
					this.specialization();
					}
					break;
				}
				this.state = 878;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 877;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 880;
				this.match(SysMLv2.PERFORM);
				this.state = 881;
				this.qualifiedName();
				this.state = 882;
				this.match(SysMLv2.REDEFINES);
				this.state = 883;
				this.qualifiedName();
				this.state = 885;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 884;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exhibitState(): ExhibitStateContext {
		let _localctx: ExhibitStateContext = new ExhibitStateContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, SysMLv2.RULE_exhibitState);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 889;
			this.match(SysMLv2.EXHIBIT);
			this.state = 890;
			this.match(SysMLv2.STATE);
			this.state = 891;
			this.qualifiedName();
			this.state = 893;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 892;
				this.typing();
				}
			}

			this.state = 896;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 97, this._ctx) ) {
			case 1:
				{
				this.state = 895;
				this.specialization();
				}
				break;
			}
			this.state = 899;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.PARALLEL) {
				{
				this.state = 898;
				this.match(SysMLv2.PARALLEL);
				}
			}

			this.state = 903;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 901;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 902;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public entryAction(): EntryActionContext {
		let _localctx: EntryActionContext = new EntryActionContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, SysMLv2.RULE_entryAction);
		let _la: number;
		try {
			this.state = 932;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 107, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 905;
				this.match(SysMLv2.ENTRY);
				this.state = 907;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 906;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				this.state = 914;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 102, this._ctx) ) {
				case 1:
					{
					this.state = 909;
					this.match(SysMLv2.THEN);
					this.state = 910;
					this.identifier();
					this.state = 912;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === SysMLv2.SEMICOLON) {
						{
						this.state = 911;
						this.match(SysMLv2.SEMICOLON);
						}
					}

					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 916;
				this.match(SysMLv2.ENTRY);
				this.state = 917;
				this.match(SysMLv2.DIVIDE);
				this.state = 918;
				this.expression();
				this.state = 920;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 919;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 922;
				this.match(SysMLv2.ENTRY);
				this.state = 924;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 104, this._ctx) ) {
				case 1:
					{
					this.state = 923;
					this.match(SysMLv2.ACTION);
					}
					break;
				}
				this.state = 927;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 105, this._ctx) ) {
				case 1:
					{
					this.state = 926;
					this.qualifiedName();
					}
					break;
				}
				this.state = 930;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 929;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exitAction(): ExitActionContext {
		let _localctx: ExitActionContext = new ExitActionContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, SysMLv2.RULE_exitAction);
		let _la: number;
		try {
			this.state = 949;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 111, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 934;
				this.match(SysMLv2.EXIT);
				this.state = 936;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 935;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 938;
				this.match(SysMLv2.EXIT);
				this.state = 939;
				this.match(SysMLv2.DIVIDE);
				this.state = 940;
				this.expression();
				this.state = 942;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 941;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 944;
				this.match(SysMLv2.EXIT);
				this.state = 945;
				this.qualifiedName();
				this.state = 947;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 946;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public doAction(): DoActionContext {
		let _localctx: DoActionContext = new DoActionContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, SysMLv2.RULE_doAction);
		let _la: number;
		try {
			this.state = 965;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 114, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 951;
				this.match(SysMLv2.DO);
				this.state = 952;
				this.match(SysMLv2.DIVIDE);
				this.state = 953;
				this.expression();
				this.state = 955;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 954;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 957;
				this.match(SysMLv2.DO);
				this.state = 958;
				this.qualifiedName();
				this.state = 961;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 959;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 960;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TO:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 963;
				this.match(SysMLv2.DO);
				this.state = 964;
				this.body();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public acceptEvent(): AcceptEventContext {
		let _localctx: AcceptEventContext = new AcceptEventContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, SysMLv2.RULE_acceptEvent);
		let _la: number;
		try {
			this.state = 990;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 120, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 967;
				this.match(SysMLv2.ACCEPT);
				this.state = 968;
				this.qualifiedName();
				this.state = 971;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 969;
					this.match(SysMLv2.COLON);
					this.state = 970;
					this.qualifiedName();
					}
				}

				this.state = 975;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.VIA) {
					{
					this.state = 973;
					this.match(SysMLv2.VIA);
					this.state = 974;
					this.qualifiedName();
					}
				}

				this.state = 979;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 117, this._ctx) ) {
				case 1:
					{
					this.state = 977;
					this.match(SysMLv2.IF);
					this.state = 978;
					this.expression();
					}
					break;
				}
				this.state = 982;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 118, this._ctx) ) {
				case 1:
					{
					this.state = 981;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 984;
				this.match(SysMLv2.ACCEPT);
				this.state = 985;
				_la = this._input.LA(1);
				if (!(_la === SysMLv2.AT || _la === SysMLv2.WHEN)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 986;
				this.expression();
				this.state = 988;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 119, this._ctx) ) {
				case 1:
					{
					this.state = 987;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sendAction(): SendActionContext {
		let _localctx: SendActionContext = new SendActionContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, SysMLv2.RULE_sendAction);
		let _la: number;
		try {
			this.state = 1015;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 124, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 992;
				this.match(SysMLv2.SEND);
				this.state = 993;
				this.expression();
				this.state = 994;
				this.match(SysMLv2.TO);
				this.state = 995;
				this.qualifiedName();
				this.state = 997;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 996;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 999;
				this.match(SysMLv2.SEND);
				this.state = 1000;
				this.expression();
				this.state = 1001;
				this.match(SysMLv2.VIA);
				this.state = 1002;
				this.qualifiedName();
				this.state = 1005;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 1003;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 1004;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TO:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1007;
				this.match(SysMLv2.SEND);
				this.state = 1008;
				this.qualifiedName();
				this.state = 1009;
				this.match(SysMLv2.VIA);
				this.state = 1010;
				this.qualifiedName();
				this.state = 1013;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 1011;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 1012;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TO:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stateDefinition(): StateDefinitionContext {
		let _localctx: StateDefinitionContext = new StateDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, SysMLv2.RULE_stateDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1018;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1017;
				this.visibility();
				}
			}

			this.state = 1023;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1020;
				this.modifier();
				}
				}
				this.state = 1025;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1026;
			this.match(SysMLv2.STATE);
			this.state = 1027;
			this.match(SysMLv2.DEF);
			this.state = 1028;
			this.identifier();
			this.state = 1030;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 127, this._ctx) ) {
			case 1:
				{
				this.state = 1029;
				this.specialization();
				}
				break;
			}
			this.state = 1034;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1032;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1033;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stateUsage(): StateUsageContext {
		let _localctx: StateUsageContext = new StateUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, SysMLv2.RULE_stateUsage);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1037;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1036;
				this.visibility();
				}
			}

			this.state = 1042;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1039;
				this.modifier();
				}
				}
				this.state = 1044;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1045;
			this.match(SysMLv2.STATE);
			this.state = 1046;
			this.identifier();
			this.state = 1048;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1047;
				this.typing();
				}
			}

			this.state = 1051;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 132, this._ctx) ) {
			case 1:
				{
				this.state = 1050;
				this.specialization();
				}
				break;
			}
			this.state = 1054;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1053;
				this.multiplicity();
				}
			}

			this.state = 1059;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 134, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1056;
					this.modifier();
					}
					}
				}
				this.state = 1061;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 134, this._ctx);
			}
			this.state = 1064;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1062;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1063;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public eventDefinition(): EventDefinitionContext {
		let _localctx: EventDefinitionContext = new EventDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, SysMLv2.RULE_eventDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1067;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1066;
				this.visibility();
				}
			}

			this.state = 1072;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1069;
				this.modifier();
				}
				}
				this.state = 1074;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1075;
			this.match(SysMLv2.EVENT);
			this.state = 1076;
			this.match(SysMLv2.DEF);
			this.state = 1077;
			this.identifier();
			this.state = 1079;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 138, this._ctx) ) {
			case 1:
				{
				this.state = 1078;
				this.specialization();
				}
				break;
			}
			this.state = 1083;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1081;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1082;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public eventUsage(): EventUsageContext {
		let _localctx: EventUsageContext = new EventUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, SysMLv2.RULE_eventUsage);
		let _la: number;
		try {
			this.state = 1115;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 145, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1086;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 1085;
					this.visibility();
					}
				}

				this.state = 1091;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 1088;
					this.modifier();
					}
					}
					this.state = 1093;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1094;
				this.match(SysMLv2.EVENT);
				this.state = 1095;
				this.match(SysMLv2.OCCURRENCE);
				this.state = 1096;
				this.identifier();
				this.state = 1098;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
					{
					this.state = 1097;
					this.valueBinding();
					}
				}

				this.state = 1100;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1103;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 1102;
					this.visibility();
					}
				}

				this.state = 1108;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 1105;
					this.modifier();
					}
					}
					this.state = 1110;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1111;
				this.match(SysMLv2.EVENT);
				this.state = 1112;
				this.qualifiedName();
				this.state = 1113;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public requirementDefinition(): RequirementDefinitionContext {
		let _localctx: RequirementDefinitionContext = new RequirementDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, SysMLv2.RULE_requirementDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1118;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1117;
				this.visibility();
				}
			}

			this.state = 1123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1120;
				this.modifier();
				}
				}
				this.state = 1125;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1126;
			this.match(SysMLv2.REQUIREMENT);
			this.state = 1127;
			this.match(SysMLv2.DEF);
			this.state = 1128;
			this.identifier();
			this.state = 1130;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 148, this._ctx) ) {
			case 1:
				{
				this.state = 1129;
				this.specialization();
				}
				break;
			}
			this.state = 1134;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1132;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1133;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public requirementUsage(): RequirementUsageContext {
		let _localctx: RequirementUsageContext = new RequirementUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, SysMLv2.RULE_requirementUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1137;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1136;
				this.visibility();
				}
			}

			this.state = 1142;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1139;
				this.modifier();
				}
				}
				this.state = 1144;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1145;
			this.match(SysMLv2.REQUIREMENT);
			this.state = 1147;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LT) {
				{
				this.state = 1146;
				this.shortName();
				}
			}

			this.state = 1149;
			this.identifier();
			this.state = 1151;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1150;
				this.typing();
				}
			}

			this.state = 1154;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 154, this._ctx) ) {
			case 1:
				{
				this.state = 1153;
				this.specialization();
				}
				break;
			}
			this.state = 1157;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1156;
				this.multiplicity();
				}
			}

			this.state = 1161;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1159;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1160;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public useCaseDefinition(): UseCaseDefinitionContext {
		let _localctx: UseCaseDefinitionContext = new UseCaseDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, SysMLv2.RULE_useCaseDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1164;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1163;
				this.visibility();
				}
			}

			this.state = 1169;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1166;
				this.modifier();
				}
				}
				this.state = 1171;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1172;
			this.match(SysMLv2.USE);
			this.state = 1173;
			this.match(SysMLv2.CASE);
			this.state = 1174;
			this.match(SysMLv2.DEF);
			this.state = 1175;
			this.identifier();
			this.state = 1177;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 159, this._ctx) ) {
			case 1:
				{
				this.state = 1176;
				this.specialization();
				}
				break;
			}
			this.state = 1181;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1179;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1180;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public useCaseUsage(): UseCaseUsageContext {
		let _localctx: UseCaseUsageContext = new UseCaseUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, SysMLv2.RULE_useCaseUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1184;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1183;
				this.visibility();
				}
			}

			this.state = 1189;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1186;
				this.modifier();
				}
				}
				this.state = 1191;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1192;
			this.match(SysMLv2.USE);
			this.state = 1193;
			this.match(SysMLv2.CASE);
			this.state = 1194;
			this.identifier();
			this.state = 1196;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1195;
				this.typing();
				}
			}

			this.state = 1199;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 164, this._ctx) ) {
			case 1:
				{
				this.state = 1198;
				this.specialization();
				}
				break;
			}
			this.state = 1202;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1201;
				this.multiplicity();
				}
			}

			this.state = 1206;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1204;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1205;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constraintDefinition(): ConstraintDefinitionContext {
		let _localctx: ConstraintDefinitionContext = new ConstraintDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, SysMLv2.RULE_constraintDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1209;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1208;
				this.visibility();
				}
			}

			this.state = 1214;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1211;
				this.modifier();
				}
				}
				this.state = 1216;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1217;
			this.match(SysMLv2.CONSTRAINT);
			this.state = 1218;
			this.match(SysMLv2.DEF);
			this.state = 1219;
			this.identifier();
			this.state = 1221;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 169, this._ctx) ) {
			case 1:
				{
				this.state = 1220;
				this.specialization();
				}
				break;
			}
			this.state = 1225;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1223;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1224;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constraintUsage(): ConstraintUsageContext {
		let _localctx: ConstraintUsageContext = new ConstraintUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, SysMLv2.RULE_constraintUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1228;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1227;
				this.visibility();
				}
			}

			this.state = 1233;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1230;
				this.modifier();
				}
				}
				this.state = 1235;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1236;
			this.match(SysMLv2.CONSTRAINT);
			this.state = 1238;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 173, this._ctx) ) {
			case 1:
				{
				this.state = 1237;
				this.identifier();
				}
				break;
			}
			this.state = 1241;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1240;
				this.typing();
				}
			}

			this.state = 1244;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 175, this._ctx) ) {
			case 1:
				{
				this.state = 1243;
				this.specialization();
				}
				break;
			}
			this.state = 1247;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1246;
				this.multiplicity();
				}
			}

			this.state = 1251;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1249;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1250;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public attributeDefinition(): AttributeDefinitionContext {
		let _localctx: AttributeDefinitionContext = new AttributeDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, SysMLv2.RULE_attributeDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1254;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1253;
				this.visibility();
				}
			}

			this.state = 1259;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1256;
				this.modifier();
				}
				}
				this.state = 1261;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1262;
			this.match(SysMLv2.ATTRIBUTE);
			this.state = 1263;
			this.match(SysMLv2.DEF);
			this.state = 1264;
			this.identifier();
			this.state = 1266;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1265;
				this.typing();
				}
			}

			this.state = 1269;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 181, this._ctx) ) {
			case 1:
				{
				this.state = 1268;
				this.specialization();
				}
				break;
			}
			this.state = 1273;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1271;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1272;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public attributeUsage(): AttributeUsageContext {
		let _localctx: AttributeUsageContext = new AttributeUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, SysMLv2.RULE_attributeUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1276;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1275;
				this.visibility();
				}
			}

			this.state = 1279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.HASH) {
				{
				this.state = 1278;
				this.metadataPrefix();
				}
			}

			this.state = 1284;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1281;
				this.modifier();
				}
				}
				this.state = 1286;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1287;
			this.match(SysMLv2.ATTRIBUTE);
			this.state = 1288;
			this.identifier();
			this.state = 1290;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1289;
				this.typing();
				}
			}

			this.state = 1293;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 187, this._ctx) ) {
			case 1:
				{
				this.state = 1292;
				this.specialization();
				}
				break;
			}
			this.state = 1296;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1295;
				this.multiplicity();
				}
			}

			this.state = 1299;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
				{
				this.state = 1298;
				this.valueBinding();
				}
			}

			this.state = 1303;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1301;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1302;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public valueBinding(): ValueBindingContext {
		let _localctx: ValueBindingContext = new ValueBindingContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, SysMLv2.RULE_valueBinding);
		try {
			this.state = 1311;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.ASSIGN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1305;
				this.match(SysMLv2.ASSIGN);
				this.state = 1306;
				this.expression();
				}
				break;
			case SysMLv2.DEFAULT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1307;
				this.match(SysMLv2.DEFAULT);
				this.state = 1308;
				this.expression();
				}
				break;
			case SysMLv2.COLONASSIGN:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1309;
				this.match(SysMLv2.COLONASSIGN);
				this.state = 1310;
				this.expression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public portDefinition(): PortDefinitionContext {
		let _localctx: PortDefinitionContext = new PortDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, SysMLv2.RULE_portDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1314;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1313;
				this.visibility();
				}
			}

			this.state = 1319;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1316;
				this.modifier();
				}
				}
				this.state = 1321;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1322;
			this.match(SysMLv2.PORT);
			this.state = 1323;
			this.match(SysMLv2.DEF);
			this.state = 1324;
			this.identifier();
			this.state = 1326;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 194, this._ctx) ) {
			case 1:
				{
				this.state = 1325;
				this.specialization();
				}
				break;
			}
			this.state = 1330;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1328;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1329;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public portUsage(): PortUsageContext {
		let _localctx: PortUsageContext = new PortUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, SysMLv2.RULE_portUsage);
		let _la: number;
		try {
			this.state = 1383;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 208, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1333;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 1332;
					this.visibility();
					}
				}

				this.state = 1338;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 1335;
					this.modifier();
					}
					}
					this.state = 1340;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1341;
				this.match(SysMLv2.PORT);
				this.state = 1342;
				this.identifier();
				this.state = 1346;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 198, this._ctx) ) {
				case 1:
					{
					this.state = 1343;
					this.typing();
					}
					break;

				case 2:
					{
					this.state = 1344;
					this.match(SysMLv2.COLONGTGT);
					this.state = 1345;
					this.qualifiedName();
					}
					break;
				}
				this.state = 1349;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 199, this._ctx) ) {
				case 1:
					{
					this.state = 1348;
					this.specialization();
					}
					break;
				}
				this.state = 1352;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 1351;
					this.multiplicity();
					}
				}

				this.state = 1356;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 1354;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 1355;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1359;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 1358;
					this.visibility();
					}
				}

				this.state = 1364;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 1361;
					this.modifier();
					}
					}
					this.state = 1366;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1367;
				this.match(SysMLv2.PORT);
				this.state = 1368;
				this.match(SysMLv2.COLONGTGT);
				this.state = 1369;
				this.identifier();
				this.state = 1371;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 1370;
					this.typing();
					}
				}

				this.state = 1374;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 205, this._ctx) ) {
				case 1:
					{
					this.state = 1373;
					this.specialization();
					}
					break;
				}
				this.state = 1377;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 1376;
					this.multiplicity();
					}
				}

				this.state = 1381;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 1379;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 1380;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public connectionDefinition(): ConnectionDefinitionContext {
		let _localctx: ConnectionDefinitionContext = new ConnectionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, SysMLv2.RULE_connectionDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1386;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1385;
				this.visibility();
				}
			}

			this.state = 1391;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1388;
				this.modifier();
				}
				}
				this.state = 1393;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1394;
			this.match(SysMLv2.CONNECTION);
			this.state = 1395;
			this.match(SysMLv2.DEF);
			this.state = 1396;
			this.identifier();
			this.state = 1398;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 211, this._ctx) ) {
			case 1:
				{
				this.state = 1397;
				this.specialization();
				}
				break;
			}
			this.state = 1402;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1400;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1401;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public connectionUsage(): ConnectionUsageContext {
		let _localctx: ConnectionUsageContext = new ConnectionUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, SysMLv2.RULE_connectionUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1405;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1404;
				this.visibility();
				}
			}

			this.state = 1410;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1407;
				this.modifier();
				}
				}
				this.state = 1412;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1414;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.HASH) {
				{
				this.state = 1413;
				this.metadataPrefix();
				}
			}

			this.state = 1416;
			this.match(SysMLv2.CONNECTION);
			this.state = 1418;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 216, this._ctx) ) {
			case 1:
				{
				this.state = 1417;
				this.identifier();
				}
				break;
			}
			this.state = 1421;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1420;
				this.typing();
				}
			}

			this.state = 1424;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 218, this._ctx) ) {
			case 1:
				{
				this.state = 1423;
				this.specialization();
				}
				break;
			}
			this.state = 1427;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1426;
				this.multiplicity();
				}
			}

			this.state = 1431;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1429;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1430;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceDefinition(): InterfaceDefinitionContext {
		let _localctx: InterfaceDefinitionContext = new InterfaceDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, SysMLv2.RULE_interfaceDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1434;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1433;
				this.visibility();
				}
			}

			this.state = 1439;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1436;
				this.modifier();
				}
				}
				this.state = 1441;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1442;
			this.match(SysMLv2.INTERFACE);
			this.state = 1443;
			this.match(SysMLv2.DEF);
			this.state = 1444;
			this.identifier();
			this.state = 1446;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 223, this._ctx) ) {
			case 1:
				{
				this.state = 1445;
				this.specialization();
				}
				break;
			}
			this.state = 1450;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1448;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1449;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interfaceUsage(): InterfaceUsageContext {
		let _localctx: InterfaceUsageContext = new InterfaceUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, SysMLv2.RULE_interfaceUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1453;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1452;
				this.visibility();
				}
			}

			this.state = 1458;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1455;
				this.modifier();
				}
				}
				this.state = 1460;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1461;
			this.match(SysMLv2.INTERFACE);
			this.state = 1462;
			this.identifier();
			this.state = 1464;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1463;
				this.typing();
				}
			}

			this.state = 1467;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 228, this._ctx) ) {
			case 1:
				{
				this.state = 1466;
				this.specialization();
				}
				break;
			}
			this.state = 1470;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1469;
				this.multiplicity();
				}
			}

			this.state = 1475;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 230, this._ctx) ) {
			case 1:
				{
				this.state = 1472;
				this.body();
				}
				break;

			case 2:
				{
				this.state = 1473;
				this.connectStatement();
				}
				break;

			case 3:
				{
				this.state = 1474;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allocationDefinition(): AllocationDefinitionContext {
		let _localctx: AllocationDefinitionContext = new AllocationDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, SysMLv2.RULE_allocationDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1478;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1477;
				this.visibility();
				}
			}

			this.state = 1483;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1480;
				this.modifier();
				}
				}
				this.state = 1485;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1486;
			this.match(SysMLv2.ALLOCATION);
			this.state = 1487;
			this.match(SysMLv2.DEF);
			this.state = 1488;
			this.identifier();
			this.state = 1490;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 233, this._ctx) ) {
			case 1:
				{
				this.state = 1489;
				this.specialization();
				}
				break;
			}
			this.state = 1494;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1492;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1493;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allocationUsage(): AllocationUsageContext {
		let _localctx: AllocationUsageContext = new AllocationUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, SysMLv2.RULE_allocationUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1497;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1496;
				this.visibility();
				}
			}

			this.state = 1502;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1499;
				this.modifier();
				}
				}
				this.state = 1504;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1505;
			this.match(SysMLv2.ALLOCATION);
			this.state = 1506;
			this.identifier();
			this.state = 1508;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1507;
				this.typing();
				}
			}

			this.state = 1511;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 238, this._ctx) ) {
			case 1:
				{
				this.state = 1510;
				this.specialization();
				}
				break;
			}
			this.state = 1514;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1513;
				this.multiplicity();
				}
			}

			this.state = 1519;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 240, this._ctx) ) {
			case 1:
				{
				this.state = 1516;
				this.allocationBody();
				}
				break;

			case 2:
				{
				this.state = 1517;
				this.body();
				}
				break;

			case 3:
				{
				this.state = 1518;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allocationBody(): AllocationBodyContext {
		let _localctx: AllocationBodyContext = new AllocationBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, SysMLv2.RULE_allocationBody);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1522;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1521;
					this.allocateStatement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1524;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 241, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public itemDefinition(): ItemDefinitionContext {
		let _localctx: ItemDefinitionContext = new ItemDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, SysMLv2.RULE_itemDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1527;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1526;
				this.visibility();
				}
			}

			this.state = 1532;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1529;
				this.modifier();
				}
				}
				this.state = 1534;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1535;
			this.match(SysMLv2.ITEM);
			this.state = 1536;
			this.match(SysMLv2.DEF);
			this.state = 1537;
			this.identifier();
			this.state = 1539;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 244, this._ctx) ) {
			case 1:
				{
				this.state = 1538;
				this.specialization();
				}
				break;
			}
			this.state = 1543;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1541;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1542;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public itemUsage(): ItemUsageContext {
		let _localctx: ItemUsageContext = new ItemUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 114, SysMLv2.RULE_itemUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1546;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1545;
				this.visibility();
				}
			}

			this.state = 1551;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1548;
				this.modifier();
				}
				}
				this.state = 1553;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1555;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & ((1 << (SysMLv2.IN - 58)) | (1 << (SysMLv2.INOUT - 58)) | (1 << (SysMLv2.OUT - 58)))) !== 0)) {
				{
				this.state = 1554;
				this.direction();
				}
			}

			this.state = 1558;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.REF) {
				{
				this.state = 1557;
				this.match(SysMLv2.REF);
				}
			}

			this.state = 1560;
			this.match(SysMLv2.ITEM);
			this.state = 1562;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 250, this._ctx) ) {
			case 1:
				{
				this.state = 1561;
				this.identifier();
				}
				break;
			}
			this.state = 1567;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 251, this._ctx) ) {
			case 1:
				{
				this.state = 1564;
				this.typing();
				}
				break;

			case 2:
				{
				this.state = 1565;
				this.match(SysMLv2.COLONGTGT);
				this.state = 1566;
				this.qualifiedName();
				}
				break;
			}
			this.state = 1570;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 252, this._ctx) ) {
			case 1:
				{
				this.state = 1569;
				this.specialization();
				}
				break;
			}
			this.state = 1573;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1572;
				this.multiplicity();
				}
			}

			this.state = 1576;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1575;
				this.typing();
				}
			}

			this.state = 1579;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
				{
				this.state = 1578;
				this.valueBinding();
				}
			}

			this.state = 1583;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1581;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1582;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public definition(): DefinitionContext {
		let _localctx: DefinitionContext = new DefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, SysMLv2.RULE_definition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1586;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1585;
				this.visibility();
				}
			}

			this.state = 1591;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1588;
				this.modifier();
				}
				}
				this.state = 1593;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1594;
			this.match(SysMLv2.DEF);
			this.state = 1595;
			this.identifier();
			this.state = 1597;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 259, this._ctx) ) {
			case 1:
				{
				this.state = 1596;
				this.specialization();
				}
				break;
			}
			this.state = 1601;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1599;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1600;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public individualDefinition(): IndividualDefinitionContext {
		let _localctx: IndividualDefinitionContext = new IndividualDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, SysMLv2.RULE_individualDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1604;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1603;
				this.visibility();
				}
			}

			this.state = 1606;
			this.match(SysMLv2.INDIVIDUAL);
			this.state = 1607;
			this.match(SysMLv2.DEF);
			this.state = 1608;
			this.identifier();
			this.state = 1610;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 262, this._ctx) ) {
			case 1:
				{
				this.state = 1609;
				this.specialization();
				}
				break;
			}
			this.state = 1614;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1612;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1613;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public individualUsage(): IndividualUsageContext {
		let _localctx: IndividualUsageContext = new IndividualUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, SysMLv2.RULE_individualUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1617;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1616;
				this.visibility();
				}
			}

			this.state = 1619;
			this.match(SysMLv2.INDIVIDUAL);
			this.state = 1620;
			this.identifier();
			this.state = 1622;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1621;
				this.typing();
				}
			}

			this.state = 1626;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1624;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1625;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public timesliceUsage(): TimesliceUsageContext {
		let _localctx: TimesliceUsageContext = new TimesliceUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 122, SysMLv2.RULE_timesliceUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1629;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1628;
				this.visibility();
				}
			}

			this.state = 1631;
			this.match(SysMLv2.TIMESLICE);
			this.state = 1632;
			this.identifier();
			this.state = 1634;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1633;
				this.typing();
				}
			}

			this.state = 1638;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1636;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1637;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public snapshotUsage(): SnapshotUsageContext {
		let _localctx: SnapshotUsageContext = new SnapshotUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, SysMLv2.RULE_snapshotUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1641;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1640;
				this.visibility();
				}
			}

			this.state = 1643;
			this.match(SysMLv2.SNAPSHOT);
			this.state = 1644;
			this.identifier();
			this.state = 1646;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1645;
				this.typing();
				}
			}

			this.state = 1649;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
				{
				this.state = 1648;
				this.valueBinding();
				}
			}

			this.state = 1653;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1651;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1652;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actorDefinition(): ActorDefinitionContext {
		let _localctx: ActorDefinitionContext = new ActorDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 126, SysMLv2.RULE_actorDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1656;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1655;
				this.visibility();
				}
			}

			this.state = 1661;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1658;
				this.modifier();
				}
				}
				this.state = 1663;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1664;
			this.match(SysMLv2.ACTOR);
			this.state = 1665;
			this.match(SysMLv2.DEF);
			this.state = 1666;
			this.identifier();
			this.state = 1668;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 276, this._ctx) ) {
			case 1:
				{
				this.state = 1667;
				this.specialization();
				}
				break;
			}
			this.state = 1672;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1670;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1671;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actorUsage(): ActorUsageContext {
		let _localctx: ActorUsageContext = new ActorUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 128, SysMLv2.RULE_actorUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1675;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1674;
				this.visibility();
				}
			}

			this.state = 1680;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1677;
				this.modifier();
				}
				}
				this.state = 1682;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1683;
			this.match(SysMLv2.ACTOR);
			this.state = 1684;
			this.identifier();
			this.state = 1686;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1685;
				this.typing();
				}
			}

			this.state = 1689;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 281, this._ctx) ) {
			case 1:
				{
				this.state = 1688;
				this.specialization();
				}
				break;
			}
			this.state = 1692;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1691;
				this.multiplicity();
				}
			}

			this.state = 1695;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
				{
				this.state = 1694;
				this.valueBinding();
				}
			}

			this.state = 1699;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1697;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1698;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public concernDefinition(): ConcernDefinitionContext {
		let _localctx: ConcernDefinitionContext = new ConcernDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 130, SysMLv2.RULE_concernDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1702;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1701;
				this.visibility();
				}
			}

			this.state = 1707;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1704;
				this.modifier();
				}
				}
				this.state = 1709;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1710;
			this.match(SysMLv2.CONCERN);
			this.state = 1711;
			this.match(SysMLv2.DEF);
			this.state = 1712;
			this.identifier();
			this.state = 1714;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 287, this._ctx) ) {
			case 1:
				{
				this.state = 1713;
				this.specialization();
				}
				break;
			}
			this.state = 1718;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1716;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1717;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public concernUsage(): ConcernUsageContext {
		let _localctx: ConcernUsageContext = new ConcernUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 132, SysMLv2.RULE_concernUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1721;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1720;
				this.visibility();
				}
			}

			this.state = 1726;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1723;
				this.modifier();
				}
				}
				this.state = 1728;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1729;
			this.match(SysMLv2.CONCERN);
			this.state = 1730;
			this.identifier();
			this.state = 1732;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1731;
				this.typing();
				}
			}

			this.state = 1735;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 292, this._ctx) ) {
			case 1:
				{
				this.state = 1734;
				this.specialization();
				}
				break;
			}
			this.state = 1738;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1737;
				this.multiplicity();
				}
			}

			this.state = 1742;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1740;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1741;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public analysisDefinition(): AnalysisDefinitionContext {
		let _localctx: AnalysisDefinitionContext = new AnalysisDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 134, SysMLv2.RULE_analysisDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1745;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1744;
				this.visibility();
				}
			}

			this.state = 1750;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1747;
				this.modifier();
				}
				}
				this.state = 1752;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1753;
			this.match(SysMLv2.ANALYSIS);
			this.state = 1754;
			this.match(SysMLv2.DEF);
			this.state = 1755;
			this.identifier();
			this.state = 1757;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 297, this._ctx) ) {
			case 1:
				{
				this.state = 1756;
				this.specialization();
				}
				break;
			}
			this.state = 1761;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1759;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1760;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public analysisUsage(): AnalysisUsageContext {
		let _localctx: AnalysisUsageContext = new AnalysisUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 136, SysMLv2.RULE_analysisUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1764;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1763;
				this.visibility();
				}
			}

			this.state = 1769;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1766;
				this.modifier();
				}
				}
				this.state = 1771;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1772;
			this.match(SysMLv2.ANALYSIS);
			this.state = 1773;
			this.identifier();
			this.state = 1775;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1774;
				this.typing();
				}
			}

			this.state = 1778;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 302, this._ctx) ) {
			case 1:
				{
				this.state = 1777;
				this.specialization();
				}
				break;
			}
			this.state = 1781;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1780;
				this.multiplicity();
				}
			}

			this.state = 1785;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1783;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1784;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public subjectUsage(): SubjectUsageContext {
		let _localctx: SubjectUsageContext = new SubjectUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 138, SysMLv2.RULE_subjectUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1788;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1787;
				this.visibility();
				}
			}

			this.state = 1790;
			this.match(SysMLv2.SUBJECT);
			this.state = 1791;
			this.identifier();
			this.state = 1793;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1792;
				this.typing();
				}
			}

			this.state = 1796;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 307, this._ctx) ) {
			case 1:
				{
				this.state = 1795;
				this.specialization();
				}
				break;
			}
			this.state = 1799;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1798;
				this.multiplicity();
				}
			}

			this.state = 1803;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1801;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1802;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public objectiveUsage(): ObjectiveUsageContext {
		let _localctx: ObjectiveUsageContext = new ObjectiveUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 140, SysMLv2.RULE_objectiveUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1806;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1805;
				this.visibility();
				}
			}

			this.state = 1808;
			this.match(SysMLv2.OBJECTIVE);
			this.state = 1810;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 311, this._ctx) ) {
			case 1:
				{
				this.state = 1809;
				this.identifier();
				}
				break;
			}
			this.state = 1813;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1812;
				this.typing();
				}
			}

			this.state = 1816;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 313, this._ctx) ) {
			case 1:
				{
				this.state = 1815;
				this.specialization();
				}
				break;
			}
			this.state = 1819;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1818;
				this.multiplicity();
				}
			}

			this.state = 1823;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1821;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1822;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stakeholderUsage(): StakeholderUsageContext {
		let _localctx: StakeholderUsageContext = new StakeholderUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 142, SysMLv2.RULE_stakeholderUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1826;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1825;
				this.visibility();
				}
			}

			this.state = 1828;
			this.match(SysMLv2.STAKEHOLDER);
			this.state = 1829;
			this.identifier();
			this.state = 1831;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1830;
				this.typing();
				}
			}

			this.state = 1834;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 318, this._ctx) ) {
			case 1:
				{
				this.state = 1833;
				this.specialization();
				}
				break;
			}
			this.state = 1837;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1836;
				this.multiplicity();
				}
			}

			this.state = 1841;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1839;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1840;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allocateStatement(): AllocateStatementContext {
		let _localctx: AllocateStatementContext = new AllocateStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 144, SysMLv2.RULE_allocateStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1843;
			this.match(SysMLv2.ALLOCATE);
			this.state = 1844;
			this.qualifiedName();
			this.state = 1845;
			this.match(SysMLv2.TO);
			this.state = 1846;
			this.qualifiedName();
			this.state = 1851;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1847;
				this.allocateBody();
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.SEMICOLON:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				{
				this.state = 1849;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 1848;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allocateBody(): AllocateBodyContext {
		let _localctx: AllocateBodyContext = new AllocateBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 146, SysMLv2.RULE_allocateBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1853;
			this.match(SysMLv2.LBRACE);
			this.state = 1857;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ALLOCATE) {
				{
				{
				this.state = 1854;
				this.allocateStatement();
				}
				}
				this.state = 1859;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1860;
			this.match(SysMLv2.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verificationDefinition(): VerificationDefinitionContext {
		let _localctx: VerificationDefinitionContext = new VerificationDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 148, SysMLv2.RULE_verificationDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1863;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1862;
				this.visibility();
				}
			}

			this.state = 1868;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1865;
				this.modifier();
				}
				}
				this.state = 1870;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1871;
			this.match(SysMLv2.VERIFICATION);
			this.state = 1872;
			this.match(SysMLv2.DEF);
			this.state = 1873;
			this.identifier();
			this.state = 1875;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 326, this._ctx) ) {
			case 1:
				{
				this.state = 1874;
				this.specialization();
				}
				break;
			}
			this.state = 1878;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 1877;
				this.verificationBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verificationUsage(): VerificationUsageContext {
		let _localctx: VerificationUsageContext = new VerificationUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 150, SysMLv2.RULE_verificationUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1881;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1880;
				this.visibility();
				}
			}

			this.state = 1886;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1883;
				this.modifier();
				}
				}
				this.state = 1888;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1889;
			this.match(SysMLv2.VERIFICATION);
			this.state = 1890;
			this.identifier();
			this.state = 1892;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1891;
				this.typing();
				}
			}

			this.state = 1895;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 331, this._ctx) ) {
			case 1:
				{
				this.state = 1894;
				this.specialization();
				}
				break;
			}
			this.state = 1898;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1897;
				this.multiplicity();
				}
			}

			this.state = 1901;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 1900;
				this.verificationBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verificationBody(): VerificationBodyContext {
		let _localctx: VerificationBodyContext = new VerificationBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 152, SysMLv2.RULE_verificationBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1903;
			this.match(SysMLv2.LBRACE);
			this.state = 1907;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ABSTRACT) | (1 << SysMLv2.ACCEPT) | (1 << SysMLv2.ACTION) | (1 << SysMLv2.ACTOR) | (1 << SysMLv2.ALIAS) | (1 << SysMLv2.ALLOCATE) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ALT) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ASSOC) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.BIND) | (1 << SysMLv2.CALC) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECT) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT) | (1 << SysMLv2.DATATYPE) | (1 << SysMLv2.DEF))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (SysMLv2.DEPENDENCY - 32)) | (1 << (SysMLv2.DERIVED - 32)) | (1 << (SysMLv2.DIRECTION - 32)) | (1 << (SysMLv2.DO - 32)) | (1 << (SysMLv2.DOC - 32)) | (1 << (SysMLv2.ELSE - 32)) | (1 << (SysMLv2.END - 32)) | (1 << (SysMLv2.ENTRY - 32)) | (1 << (SysMLv2.ENUM - 32)) | (1 << (SysMLv2.EVENT - 32)) | (1 << (SysMLv2.EXHIBIT - 32)) | (1 << (SysMLv2.EXIT - 32)) | (1 << (SysMLv2.FEATURE - 32)) | (1 << (SysMLv2.FILTER - 32)) | (1 << (SysMLv2.FIRST - 32)) | (1 << (SysMLv2.FLOW - 32)) | (1 << (SysMLv2.FORK - 32)) | (1 << (SysMLv2.FUNCTION - 32)) | (1 << (SysMLv2.IF - 32)) | (1 << (SysMLv2.IMPORT - 32)) | (1 << (SysMLv2.IN - 32)) | (1 << (SysMLv2.INDIVIDUAL - 32)) | (1 << (SysMLv2.INOUT - 32)) | (1 << (SysMLv2.INTERACTION - 32)) | (1 << (SysMLv2.INTERFACE - 32)) | (1 << (SysMLv2.ITEM - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (SysMLv2.JOIN - 64)) | (1 << (SysMLv2.LIBRARY - 64)) | (1 << (SysMLv2.MESSAGE - 64)) | (1 << (SysMLv2.METADATA - 64)) | (1 << (SysMLv2.NONUNIQUE - 64)) | (1 << (SysMLv2.OBJECTIVE - 64)) | (1 << (SysMLv2.OCCURRENCE - 64)) | (1 << (SysMLv2.ORDERED - 64)) | (1 << (SysMLv2.OUT - 64)) | (1 << (SysMLv2.PACKAGE - 64)) | (1 << (SysMLv2.PART - 64)) | (1 << (SysMLv2.PARTICIPANT - 64)) | (1 << (SysMLv2.PERFORM - 64)) | (1 << (SysMLv2.PAYLOAD - 64)) | (1 << (SysMLv2.PORT - 64)) | (1 << (SysMLv2.PRIVATE - 64)) | (1 << (SysMLv2.PROPERTY - 64)) | (1 << (SysMLv2.PROTECTED - 64)) | (1 << (SysMLv2.PUBLIC - 64)) | (1 << (SysMLv2.READONLY - 64)) | (1 << (SysMLv2.REDEFINES - 64)) | (1 << (SysMLv2.REF - 64)) | (1 << (SysMLv2.REQUIRE - 64)) | (1 << (SysMLv2.REQUIREMENT - 64)))) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & ((1 << (SysMLv2.RETURN - 96)) | (1 << (SysMLv2.SATISFY - 96)) | (1 << (SysMLv2.SEND - 96)) | (1 << (SysMLv2.STAKEHOLDER - 96)) | (1 << (SysMLv2.STANDARD - 96)) | (1 << (SysMLv2.STATE - 96)) | (1 << (SysMLv2.SUBJECT - 96)) | (1 << (SysMLv2.SNAPSHOT - 96)) | (1 << (SysMLv2.THEN - 96)) | (1 << (SysMLv2.TIMESLICE - 96)) | (1 << (SysMLv2.TRANSITION - 96)) | (1 << (SysMLv2.USE - 96)) | (1 << (SysMLv2.VARIATION - 96)) | (1 << (SysMLv2.VERIFICATION - 96)) | (1 << (SysMLv2.VERIFY - 96)) | (1 << (SysMLv2.VIEW - 96)) | (1 << (SysMLv2.VIEWPOINT - 96)) | (1 << (SysMLv2.COLONGTGT - 96)))) !== 0) || ((((_la - 155)) & ~0x1F) === 0 && ((1 << (_la - 155)) & ((1 << (SysMLv2.AT_SIGN - 155)) | (1 << (SysMLv2.HASH - 155)) | (1 << (SysMLv2.IDENTIFIER - 155)) | (1 << (SysMLv2.STRING - 155)))) !== 0)) {
				{
				{
				this.state = 1904;
				this.verificationBodyElement();
				}
				}
				this.state = 1909;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1910;
			this.match(SysMLv2.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verificationBodyElement(): VerificationBodyElementContext {
		let _localctx: VerificationBodyElementContext = new VerificationBodyElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 154, SysMLv2.RULE_verificationBodyElement);
		try {
			this.state = 1914;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 335, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1912;
				this.element();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1913;
				this.verifyStatement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verifyStatement(): VerifyStatementContext {
		let _localctx: VerifyStatementContext = new VerifyStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 156, SysMLv2.RULE_verifyStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1916;
			this.match(SysMLv2.VERIFY);
			this.state = 1917;
			this.qualifiedName();
			this.state = 1920;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 1918;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 1919;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewDefinition(): ViewDefinitionContext {
		let _localctx: ViewDefinitionContext = new ViewDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 158, SysMLv2.RULE_viewDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1923;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1922;
				this.visibility();
				}
			}

			this.state = 1928;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1925;
				this.modifier();
				}
				}
				this.state = 1930;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1931;
			this.match(SysMLv2.VIEW);
			this.state = 1932;
			this.match(SysMLv2.DEF);
			this.state = 1933;
			this.identifier();
			this.state = 1935;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 339, this._ctx) ) {
			case 1:
				{
				this.state = 1934;
				this.specialization();
				}
				break;
			}
			this.state = 1938;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 1937;
				this.viewBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewUsage(): ViewUsageContext {
		let _localctx: ViewUsageContext = new ViewUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 160, SysMLv2.RULE_viewUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1941;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 1940;
				this.visibility();
				}
			}

			this.state = 1946;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 1943;
				this.modifier();
				}
				}
				this.state = 1948;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1949;
			this.match(SysMLv2.VIEW);
			this.state = 1950;
			this.identifier();
			this.state = 1952;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 1951;
				this.typing();
				}
			}

			this.state = 1955;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 344, this._ctx) ) {
			case 1:
				{
				this.state = 1954;
				this.specialization();
				}
				break;
			}
			this.state = 1958;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 1957;
				this.multiplicity();
				}
			}

			this.state = 1961;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 1960;
				this.viewBody();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewBody(): ViewBodyContext {
		let _localctx: ViewBodyContext = new ViewBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 162, SysMLv2.RULE_viewBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1963;
			this.match(SysMLv2.LBRACE);
			this.state = 1967;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ABSTRACT) | (1 << SysMLv2.ACCEPT) | (1 << SysMLv2.ACTION) | (1 << SysMLv2.ACTOR) | (1 << SysMLv2.ALIAS) | (1 << SysMLv2.ALLOCATE) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ALT) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ASSOC) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.BIND) | (1 << SysMLv2.CALC) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECT) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT) | (1 << SysMLv2.DATATYPE) | (1 << SysMLv2.DEF))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (SysMLv2.DEPENDENCY - 32)) | (1 << (SysMLv2.DERIVED - 32)) | (1 << (SysMLv2.DIRECTION - 32)) | (1 << (SysMLv2.DO - 32)) | (1 << (SysMLv2.DOC - 32)) | (1 << (SysMLv2.ELSE - 32)) | (1 << (SysMLv2.END - 32)) | (1 << (SysMLv2.ENTRY - 32)) | (1 << (SysMLv2.ENUM - 32)) | (1 << (SysMLv2.EVENT - 32)) | (1 << (SysMLv2.EXHIBIT - 32)) | (1 << (SysMLv2.EXIT - 32)) | (1 << (SysMLv2.EXPOSE - 32)) | (1 << (SysMLv2.FEATURE - 32)) | (1 << (SysMLv2.FILTER - 32)) | (1 << (SysMLv2.FIRST - 32)) | (1 << (SysMLv2.FLOW - 32)) | (1 << (SysMLv2.FORK - 32)) | (1 << (SysMLv2.FUNCTION - 32)) | (1 << (SysMLv2.IF - 32)) | (1 << (SysMLv2.IMPORT - 32)) | (1 << (SysMLv2.IN - 32)) | (1 << (SysMLv2.INDIVIDUAL - 32)) | (1 << (SysMLv2.INOUT - 32)) | (1 << (SysMLv2.INTERACTION - 32)) | (1 << (SysMLv2.INTERFACE - 32)) | (1 << (SysMLv2.ITEM - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (SysMLv2.JOIN - 64)) | (1 << (SysMLv2.LIBRARY - 64)) | (1 << (SysMLv2.MESSAGE - 64)) | (1 << (SysMLv2.METADATA - 64)) | (1 << (SysMLv2.NONUNIQUE - 64)) | (1 << (SysMLv2.OBJECTIVE - 64)) | (1 << (SysMLv2.OCCURRENCE - 64)) | (1 << (SysMLv2.ORDERED - 64)) | (1 << (SysMLv2.OUT - 64)) | (1 << (SysMLv2.PACKAGE - 64)) | (1 << (SysMLv2.PART - 64)) | (1 << (SysMLv2.PARTICIPANT - 64)) | (1 << (SysMLv2.PERFORM - 64)) | (1 << (SysMLv2.PAYLOAD - 64)) | (1 << (SysMLv2.PORT - 64)) | (1 << (SysMLv2.PRIVATE - 64)) | (1 << (SysMLv2.PROPERTY - 64)) | (1 << (SysMLv2.PROTECTED - 64)) | (1 << (SysMLv2.PUBLIC - 64)) | (1 << (SysMLv2.READONLY - 64)) | (1 << (SysMLv2.REDEFINES - 64)) | (1 << (SysMLv2.REF - 64)) | (1 << (SysMLv2.REQUIRE - 64)) | (1 << (SysMLv2.REQUIREMENT - 64)))) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & ((1 << (SysMLv2.RETURN - 96)) | (1 << (SysMLv2.SATISFY - 96)) | (1 << (SysMLv2.SEND - 96)) | (1 << (SysMLv2.STAKEHOLDER - 96)) | (1 << (SysMLv2.STANDARD - 96)) | (1 << (SysMLv2.STATE - 96)) | (1 << (SysMLv2.SUBJECT - 96)) | (1 << (SysMLv2.SNAPSHOT - 96)) | (1 << (SysMLv2.THEN - 96)) | (1 << (SysMLv2.TIMESLICE - 96)) | (1 << (SysMLv2.TRANSITION - 96)) | (1 << (SysMLv2.USE - 96)) | (1 << (SysMLv2.VARIATION - 96)) | (1 << (SysMLv2.VERIFICATION - 96)) | (1 << (SysMLv2.VERIFY - 96)) | (1 << (SysMLv2.VIEW - 96)) | (1 << (SysMLv2.VIEWPOINT - 96)) | (1 << (SysMLv2.COLONGTGT - 96)))) !== 0) || ((((_la - 155)) & ~0x1F) === 0 && ((1 << (_la - 155)) & ((1 << (SysMLv2.AT_SIGN - 155)) | (1 << (SysMLv2.HASH - 155)) | (1 << (SysMLv2.IDENTIFIER - 155)) | (1 << (SysMLv2.STRING - 155)))) !== 0)) {
				{
				{
				this.state = 1964;
				this.viewBodyElement();
				}
				}
				this.state = 1969;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1970;
			this.match(SysMLv2.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewBodyElement(): ViewBodyElementContext {
		let _localctx: ViewBodyElementContext = new ViewBodyElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 164, SysMLv2.RULE_viewBodyElement);
		try {
			this.state = 1976;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 348, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1972;
				this.element();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1973;
				this.exposeStatement();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1974;
				this.filterStatement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1975;
				this.satisfyStatement();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exposeStatement(): ExposeStatementContext {
		let _localctx: ExposeStatementContext = new ExposeStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 166, SysMLv2.RULE_exposeStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1978;
			this.match(SysMLv2.EXPOSE);
			this.state = 1979;
			this.exposeTarget();
			this.state = 1984;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.COMMA) {
				{
				{
				this.state = 1980;
				this.match(SysMLv2.COMMA);
				this.state = 1981;
				this.exposeTarget();
				}
				}
				this.state = 1986;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1988;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 1987;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exposeTarget(): ExposeTargetContext {
		let _localctx: ExposeTargetContext = new ExposeTargetContext(this._ctx, this.state);
		this.enterRule(_localctx, 168, SysMLv2.RULE_exposeTarget);
		let _la: number;
		try {
			let _alt: number;
			this.state = 2013;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 353, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1990;
				this.identifier();
				this.state = 1995;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 351, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1991;
						_la = this._input.LA(1);
						if (!(_la === SysMLv2.COLONCOLON || _la === SysMLv2.DOT)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 1992;
						this.identifier();
						}
						}
					}
					this.state = 1997;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 351, this._ctx);
				}
				this.state = 1998;
				this.match(SysMLv2.COLONCOLON);
				this.state = 1999;
				this.match(SysMLv2.POWER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2001;
				this.identifier();
				this.state = 2006;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 352, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 2002;
						_la = this._input.LA(1);
						if (!(_la === SysMLv2.COLONCOLON || _la === SysMLv2.DOT)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 2003;
						this.identifier();
						}
						}
					}
					this.state = 2008;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 352, this._ctx);
				}
				this.state = 2009;
				this.match(SysMLv2.COLONCOLON);
				this.state = 2010;
				this.match(SysMLv2.MULTIPLY);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2012;
				this.qualifiedName();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewpointDefinition(): ViewpointDefinitionContext {
		let _localctx: ViewpointDefinitionContext = new ViewpointDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 170, SysMLv2.RULE_viewpointDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2016;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2015;
				this.visibility();
				}
			}

			this.state = 2021;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2018;
				this.modifier();
				}
				}
				this.state = 2023;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2024;
			this.match(SysMLv2.VIEWPOINT);
			this.state = 2025;
			this.match(SysMLv2.DEF);
			this.state = 2026;
			this.identifier();
			this.state = 2028;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 356, this._ctx) ) {
			case 1:
				{
				this.state = 2027;
				this.specialization();
				}
				break;
			}
			this.state = 2031;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2030;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public viewpointUsage(): ViewpointUsageContext {
		let _localctx: ViewpointUsageContext = new ViewpointUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 172, SysMLv2.RULE_viewpointUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2034;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2033;
				this.visibility();
				}
			}

			this.state = 2039;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2036;
				this.modifier();
				}
				}
				this.state = 2041;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2042;
			this.match(SysMLv2.VIEWPOINT);
			this.state = 2043;
			this.identifier();
			this.state = 2045;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2044;
				this.typing();
				}
			}

			this.state = 2048;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 361, this._ctx) ) {
			case 1:
				{
				this.state = 2047;
				this.specialization();
				}
				break;
			}
			this.state = 2051;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2050;
				this.multiplicity();
				}
			}

			this.state = 2054;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2053;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumerationDefinition(): EnumerationDefinitionContext {
		let _localctx: EnumerationDefinitionContext = new EnumerationDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 174, SysMLv2.RULE_enumerationDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2057;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2056;
				this.visibility();
				}
			}

			this.state = 2062;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2059;
				this.modifier();
				}
				}
				this.state = 2064;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2065;
			this.match(SysMLv2.ENUM);
			this.state = 2066;
			this.match(SysMLv2.DEF);
			this.state = 2067;
			this.identifier();
			this.state = 2069;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 366, this._ctx) ) {
			case 1:
				{
				this.state = 2068;
				this.specialization();
				}
				break;
			}
			this.state = 2072;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2071;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumerationUsage(): EnumerationUsageContext {
		let _localctx: EnumerationUsageContext = new EnumerationUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 176, SysMLv2.RULE_enumerationUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2075;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2074;
				this.visibility();
				}
			}

			this.state = 2080;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2077;
				this.modifier();
				}
				}
				this.state = 2082;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2083;
			this.match(SysMLv2.ENUM);
			this.state = 2084;
			this.identifier();
			this.state = 2086;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2085;
				this.typing();
				}
			}

			this.state = 2089;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 371, this._ctx) ) {
			case 1:
				{
				this.state = 2088;
				this.specialization();
				}
				break;
			}
			this.state = 2092;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2091;
				this.multiplicity();
				}
			}

			this.state = 2095;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2094;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public datatypeDefinition(): DatatypeDefinitionContext {
		let _localctx: DatatypeDefinitionContext = new DatatypeDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 178, SysMLv2.RULE_datatypeDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2098;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2097;
				this.visibility();
				}
			}

			this.state = 2103;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2100;
				this.modifier();
				}
				}
				this.state = 2105;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2106;
			this.match(SysMLv2.DATATYPE);
			this.state = 2107;
			this.match(SysMLv2.DEF);
			this.state = 2108;
			this.identifier();
			this.state = 2110;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 376, this._ctx) ) {
			case 1:
				{
				this.state = 2109;
				this.specialization();
				}
				break;
			}
			this.state = 2113;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2112;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public datatypeUsage(): DatatypeUsageContext {
		let _localctx: DatatypeUsageContext = new DatatypeUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 180, SysMLv2.RULE_datatypeUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2116;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2115;
				this.visibility();
				}
			}

			this.state = 2121;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2118;
				this.modifier();
				}
				}
				this.state = 2123;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2124;
			this.match(SysMLv2.DATATYPE);
			this.state = 2125;
			this.identifier();
			this.state = 2127;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2126;
				this.typing();
				}
			}

			this.state = 2130;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 381, this._ctx) ) {
			case 1:
				{
				this.state = 2129;
				this.specialization();
				}
				break;
			}
			this.state = 2133;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2132;
				this.multiplicity();
				}
			}

			this.state = 2136;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2135;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public associationDefinition(): AssociationDefinitionContext {
		let _localctx: AssociationDefinitionContext = new AssociationDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 182, SysMLv2.RULE_associationDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2139;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2138;
				this.visibility();
				}
			}

			this.state = 2144;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2141;
				this.modifier();
				}
				}
				this.state = 2146;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2147;
			this.match(SysMLv2.ASSOC);
			this.state = 2148;
			this.match(SysMLv2.DEF);
			this.state = 2149;
			this.identifier();
			this.state = 2151;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 386, this._ctx) ) {
			case 1:
				{
				this.state = 2150;
				this.specialization();
				}
				break;
			}
			this.state = 2154;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2153;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public associationUsage(): AssociationUsageContext {
		let _localctx: AssociationUsageContext = new AssociationUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 184, SysMLv2.RULE_associationUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2157;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2156;
				this.visibility();
				}
			}

			this.state = 2162;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2159;
				this.modifier();
				}
				}
				this.state = 2164;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2165;
			this.match(SysMLv2.ASSOC);
			this.state = 2166;
			this.identifier();
			this.state = 2168;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2167;
				this.typing();
				}
			}

			this.state = 2171;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 391, this._ctx) ) {
			case 1:
				{
				this.state = 2170;
				this.specialization();
				}
				break;
			}
			this.state = 2174;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2173;
				this.multiplicity();
				}
			}

			this.state = 2177;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2176;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public metadataDefinition(): MetadataDefinitionContext {
		let _localctx: MetadataDefinitionContext = new MetadataDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 186, SysMLv2.RULE_metadataDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2180;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2179;
				this.visibility();
				}
			}

			this.state = 2185;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2182;
				this.modifier();
				}
				}
				this.state = 2187;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2188;
			this.match(SysMLv2.METADATA);
			this.state = 2189;
			this.match(SysMLv2.DEF);
			this.state = 2194;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LT) {
				{
				this.state = 2190;
				this.match(SysMLv2.LT);
				this.state = 2191;
				this.identifier();
				this.state = 2192;
				this.match(SysMLv2.GT);
				}
			}

			this.state = 2196;
			this.identifier();
			this.state = 2198;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 397, this._ctx) ) {
			case 1:
				{
				this.state = 2197;
				this.specialization();
				}
				break;
			}
			this.state = 2201;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2200;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public metadataUsage(): MetadataUsageContext {
		let _localctx: MetadataUsageContext = new MetadataUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 188, SysMLv2.RULE_metadataUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2204;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2203;
				this.visibility();
				}
			}

			this.state = 2209;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2206;
				this.modifier();
				}
				}
				this.state = 2211;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2212;
			this.match(SysMLv2.METADATA);
			this.state = 2213;
			this.identifier();
			this.state = 2215;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2214;
				this.typing();
				}
			}

			this.state = 2218;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 402, this._ctx) ) {
			case 1:
				{
				this.state = 2217;
				this.specialization();
				}
				break;
			}
			this.state = 2221;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2220;
				this.multiplicity();
				}
			}

			this.state = 2224;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2223;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public metadataAnnotation(): MetadataAnnotationContext {
		let _localctx: MetadataAnnotationContext = new MetadataAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 190, SysMLv2.RULE_metadataAnnotation);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2226;
			this.match(SysMLv2.AT_SIGN);
			this.state = 2227;
			this.qualifiedName();
			this.state = 2230;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.ABOUT) {
				{
				this.state = 2228;
				this.match(SysMLv2.ABOUT);
				this.state = 2229;
				this.qualifiedName();
				}
			}

			this.state = 2234;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 2232;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 2233;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public comment(): CommentContext {
		let _localctx: CommentContext = new CommentContext(this._ctx, this.state);
		this.enterRule(_localctx, 192, SysMLv2.RULE_comment);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2237;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2236;
				this.visibility();
				}
			}

			this.state = 2239;
			this.match(SysMLv2.COMMENT);
			this.state = 2242;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.ABOUT) {
				{
				this.state = 2240;
				this.match(SysMLv2.ABOUT);
				this.state = 2241;
				this.qualifiedName();
				}
			}

			this.state = 2245;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 409, this._ctx) ) {
			case 1:
				{
				this.state = 2244;
				this.identifier();
				}
				break;
			}
			this.state = 2248;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 410, this._ctx) ) {
			case 1:
				{
				this.state = 2247;
				this.stringValue();
				}
				break;
			}
			this.state = 2251;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2250;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public documentation(): DocumentationContext {
		let _localctx: DocumentationContext = new DocumentationContext(this._ctx, this.state);
		this.enterRule(_localctx, 194, SysMLv2.RULE_documentation);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2254;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2253;
				this.visibility();
				}
			}

			this.state = 2256;
			this.match(SysMLv2.DOC);
			this.state = 2258;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 413, this._ctx) ) {
			case 1:
				{
				this.state = 2257;
				this.identifier();
				}
				break;
			}
			this.state = 2260;
			this.stringValue();
			this.state = 2262;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2261;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public calculation(): CalculationContext {
		let _localctx: CalculationContext = new CalculationContext(this._ctx, this.state);
		this.enterRule(_localctx, 196, SysMLv2.RULE_calculation);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2265;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2264;
				this.visibility();
				}
			}

			this.state = 2267;
			this.match(SysMLv2.CALC);
			this.state = 2268;
			this.match(SysMLv2.DEF);
			this.state = 2269;
			this.identifier();
			this.state = 2271;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 416, this._ctx) ) {
			case 1:
				{
				this.state = 2270;
				this.expression();
				}
				break;
			}
			this.state = 2274;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2273;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public calcUsage(): CalcUsageContext {
		let _localctx: CalcUsageContext = new CalcUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 198, SysMLv2.RULE_calcUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2277;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2276;
				this.visibility();
				}
			}

			this.state = 2279;
			this.match(SysMLv2.CALC);
			this.state = 2282;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLONGT) {
				{
				this.state = 2280;
				this.match(SysMLv2.COLONGT);
				this.state = 2281;
				this.qualifiedName();
				}
			}

			this.state = 2285;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2284;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interactionDefinition(): InteractionDefinitionContext {
		let _localctx: InteractionDefinitionContext = new InteractionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 200, SysMLv2.RULE_interactionDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2288;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2287;
				this.visibility();
				}
			}

			this.state = 2293;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2290;
				this.modifier();
				}
				}
				this.state = 2295;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2296;
			this.match(SysMLv2.INTERACTION);
			this.state = 2297;
			this.match(SysMLv2.DEF);
			this.state = 2298;
			this.identifier();
			this.state = 2300;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 423, this._ctx) ) {
			case 1:
				{
				this.state = 2299;
				this.specialization();
				}
				break;
			}
			this.state = 2303;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2302;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public interactionUsage(): InteractionUsageContext {
		let _localctx: InteractionUsageContext = new InteractionUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 202, SysMLv2.RULE_interactionUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2306;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2305;
				this.visibility();
				}
			}

			this.state = 2311;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2308;
				this.modifier();
				}
				}
				this.state = 2313;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2314;
			this.match(SysMLv2.INTERACTION);
			this.state = 2315;
			this.identifier();
			this.state = 2317;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2316;
				this.typing();
				}
			}

			this.state = 2320;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 428, this._ctx) ) {
			case 1:
				{
				this.state = 2319;
				this.specialization();
				}
				break;
			}
			this.state = 2323;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2322;
				this.multiplicity();
				}
			}

			this.state = 2326;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2325;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public participantUsage(): ParticipantUsageContext {
		let _localctx: ParticipantUsageContext = new ParticipantUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 204, SysMLv2.RULE_participantUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2329;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2328;
				this.visibility();
				}
			}

			this.state = 2334;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2331;
				this.modifier();
				}
				}
				this.state = 2336;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2337;
			this.match(SysMLv2.PARTICIPANT);
			this.state = 2338;
			this.identifier();
			this.state = 2340;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2339;
				this.typing();
				}
			}

			this.state = 2343;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 434, this._ctx) ) {
			case 1:
				{
				this.state = 2342;
				this.specialization();
				}
				break;
			}
			this.state = 2346;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2345;
				this.multiplicity();
				}
			}

			this.state = 2349;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2348;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public messageUsage(): MessageUsageContext {
		let _localctx: MessageUsageContext = new MessageUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 206, SysMLv2.RULE_messageUsage);
		let _la: number;
		try {
			this.state = 2406;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 447, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2352;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 2351;
					this.visibility();
					}
				}

				this.state = 2357;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 2354;
					this.modifier();
					}
					}
					this.state = 2359;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2360;
				this.match(SysMLv2.MESSAGE);
				this.state = 2361;
				this.identifier();
				this.state = 2362;
				this.match(SysMLv2.OF);
				this.state = 2363;
				this.qualifiedName();
				this.state = 2364;
				this.match(SysMLv2.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2367;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 2366;
					this.visibility();
					}
				}

				this.state = 2372;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 2369;
					this.modifier();
					}
					}
					this.state = 2374;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2375;
				this.match(SysMLv2.MESSAGE);
				this.state = 2376;
				this.identifier();
				this.state = 2377;
				this.messagePattern();
				this.state = 2379;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACE) {
					{
					this.state = 2378;
					this.body();
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2382;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 2381;
					this.visibility();
					}
				}

				this.state = 2387;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 2384;
					this.modifier();
					}
					}
					this.state = 2389;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2390;
				this.match(SysMLv2.MESSAGE);
				this.state = 2392;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0) || _la === SysMLv2.IDENTIFIER || _la === SysMLv2.STRING) {
					{
					this.state = 2391;
					this.identifier();
					}
				}

				this.state = 2394;
				this.match(SysMLv2.OF);
				this.state = 2395;
				this.qualifiedName();
				this.state = 2397;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 2396;
					this.typing();
					}
				}

				this.state = 2399;
				this.match(SysMLv2.FROM);
				this.state = 2400;
				this.qualifiedName();
				this.state = 2401;
				this.match(SysMLv2.TO);
				this.state = 2402;
				this.qualifiedName();
				this.state = 2404;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 2403;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public messagePattern(): MessagePatternContext {
		let _localctx: MessagePatternContext = new MessagePatternContext(this._ctx, this.state);
		this.enterRule(_localctx, 208, SysMLv2.RULE_messagePattern);
		try {
			this.state = 2417;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 448, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2408;
				this.match(SysMLv2.COLON);
				this.state = 2409;
				this.match(SysMLv2.SENDMESSAGE);
				this.state = 2410;
				this.match(SysMLv2.FROM);
				this.state = 2411;
				this.identifier();
				this.state = 2412;
				this.match(SysMLv2.TO);
				this.state = 2413;
				this.identifier();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2415;
				this.match(SysMLv2.COLON);
				this.state = 2416;
				this.identifier();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public payloadUsage(): PayloadUsageContext {
		let _localctx: PayloadUsageContext = new PayloadUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 210, SysMLv2.RULE_payloadUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2420;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2419;
				this.visibility();
				}
			}

			this.state = 2425;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2422;
				this.modifier();
				}
				}
				this.state = 2427;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2428;
			this.match(SysMLv2.PAYLOAD);
			this.state = 2429;
			this.identifier();
			this.state = 2431;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2430;
				this.typing();
				}
			}

			this.state = 2434;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 452, this._ctx) ) {
			case 1:
				{
				this.state = 2433;
				this.specialization();
				}
				break;
			}
			this.state = 2437;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2436;
				this.multiplicity();
				}
			}

			this.state = 2440;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2439;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public occurrenceUsage(): OccurrenceUsageContext {
		let _localctx: OccurrenceUsageContext = new OccurrenceUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 212, SysMLv2.RULE_occurrenceUsage);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2443;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2442;
				this.visibility();
				}
			}

			this.state = 2448;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2445;
				this.modifier();
				}
				}
				this.state = 2450;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2451;
			this.match(SysMLv2.OCCURRENCE);
			this.state = 2452;
			this.identifier();
			this.state = 2454;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2453;
				this.typing();
				}
			}

			this.state = 2457;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 458, this._ctx) ) {
			case 1:
				{
				this.state = 2456;
				this.specialization();
				}
				break;
			}
			this.state = 2460;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2459;
				this.multiplicity();
				}
			}

			this.state = 2465;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 460, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2462;
					this.modifier();
					}
					}
				}
				this.state = 2467;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 460, this._ctx);
			}
			this.state = 2469;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2468;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public alternativeUsage(): AlternativeUsageContext {
		let _localctx: AlternativeUsageContext = new AlternativeUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 214, SysMLv2.RULE_alternativeUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2472;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2471;
				this.visibility();
				}
			}

			this.state = 2477;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2474;
				this.modifier();
				}
				}
				this.state = 2479;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2480;
			this.match(SysMLv2.ALT);
			this.state = 2481;
			this.identifier();
			this.state = 2483;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2482;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elseUsage(): ElseUsageContext {
		let _localctx: ElseUsageContext = new ElseUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 216, SysMLv2.RULE_elseUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2486;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2485;
				this.visibility();
				}
			}

			this.state = 2491;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2488;
				this.modifier();
				}
				}
				this.state = 2493;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2494;
			this.match(SysMLv2.ELSE);
			this.state = 2496;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 467, this._ctx) ) {
			case 1:
				{
				this.state = 2495;
				this.identifier();
				}
				break;
			}
			this.state = 2499;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2498;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public featureDefinition(): FeatureDefinitionContext {
		let _localctx: FeatureDefinitionContext = new FeatureDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 218, SysMLv2.RULE_featureDefinition);
		let _la: number;
		try {
			this.state = 2552;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 482, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2502;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 2501;
					this.visibility();
					}
				}

				this.state = 2507;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 2504;
					this.modifier();
					}
					}
					this.state = 2509;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2510;
				this.match(SysMLv2.FEATURE);
				this.state = 2511;
				this.identifier();
				this.state = 2513;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 2512;
					this.typing();
					}
				}

				this.state = 2516;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 472, this._ctx) ) {
				case 1:
					{
					this.state = 2515;
					this.specialization();
					}
					break;
				}
				this.state = 2519;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 2518;
					this.multiplicity();
					}
				}

				this.state = 2523;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 2521;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 2522;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2526;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
					{
					this.state = 2525;
					this.visibility();
					}
				}

				this.state = 2531;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
					{
					{
					this.state = 2528;
					this.modifier();
					}
					}
					this.state = 2533;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2534;
				this.match(SysMLv2.REF);
				this.state = 2536;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 477, this._ctx) ) {
				case 1:
					{
					this.state = 2535;
					this.match(SysMLv2.FEATURE);
					}
					break;
				}
				this.state = 2538;
				this.identifier();
				this.state = 2540;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.COLON) {
					{
					this.state = 2539;
					this.typing();
					}
				}

				this.state = 2543;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 479, this._ctx) ) {
				case 1:
					{
					this.state = 2542;
					this.specialization();
					}
					break;
				}
				this.state = 2546;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 2545;
					this.multiplicity();
					}
				}

				this.state = 2550;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case SysMLv2.LBRACE:
					{
					this.state = 2548;
					this.body();
					}
					break;
				case SysMLv2.SEMICOLON:
					{
					this.state = 2549;
					this.match(SysMLv2.SEMICOLON);
					}
					break;
				case SysMLv2.EOF:
				case SysMLv2.ABSTRACT:
				case SysMLv2.ACCEPT:
				case SysMLv2.ACTION:
				case SysMLv2.ACTOR:
				case SysMLv2.ALIAS:
				case SysMLv2.ALLOCATE:
				case SysMLv2.ALLOCATION:
				case SysMLv2.ALT:
				case SysMLv2.ANALYSIS:
				case SysMLv2.ASSOC:
				case SysMLv2.ATTRIBUTE:
				case SysMLv2.BIND:
				case SysMLv2.CALC:
				case SysMLv2.COMMENT:
				case SysMLv2.CONCERN:
				case SysMLv2.CONNECT:
				case SysMLv2.CONNECTION:
				case SysMLv2.CONSTRAINT:
				case SysMLv2.DATATYPE:
				case SysMLv2.DEF:
				case SysMLv2.DEPENDENCY:
				case SysMLv2.DERIVED:
				case SysMLv2.DIRECTION:
				case SysMLv2.DO:
				case SysMLv2.DOC:
				case SysMLv2.ELSE:
				case SysMLv2.END:
				case SysMLv2.ENTRY:
				case SysMLv2.ENUM:
				case SysMLv2.EVENT:
				case SysMLv2.EXHIBIT:
				case SysMLv2.EXIT:
				case SysMLv2.EXPOSE:
				case SysMLv2.FEATURE:
				case SysMLv2.FILTER:
				case SysMLv2.FIRST:
				case SysMLv2.FLOW:
				case SysMLv2.FORK:
				case SysMLv2.FUNCTION:
				case SysMLv2.IF:
				case SysMLv2.IMPORT:
				case SysMLv2.IN:
				case SysMLv2.INDIVIDUAL:
				case SysMLv2.INOUT:
				case SysMLv2.INTERACTION:
				case SysMLv2.INTERFACE:
				case SysMLv2.ITEM:
				case SysMLv2.JOIN:
				case SysMLv2.LIBRARY:
				case SysMLv2.MESSAGE:
				case SysMLv2.METADATA:
				case SysMLv2.NONUNIQUE:
				case SysMLv2.OBJECTIVE:
				case SysMLv2.OCCURRENCE:
				case SysMLv2.ORDERED:
				case SysMLv2.OUT:
				case SysMLv2.PACKAGE:
				case SysMLv2.PART:
				case SysMLv2.PARTICIPANT:
				case SysMLv2.PERFORM:
				case SysMLv2.PAYLOAD:
				case SysMLv2.PORT:
				case SysMLv2.PRIVATE:
				case SysMLv2.PROPERTY:
				case SysMLv2.PROTECTED:
				case SysMLv2.PUBLIC:
				case SysMLv2.READONLY:
				case SysMLv2.REDEFINES:
				case SysMLv2.REF:
				case SysMLv2.REQUIRE:
				case SysMLv2.REQUIREMENT:
				case SysMLv2.RETURN:
				case SysMLv2.SATISFY:
				case SysMLv2.SEND:
				case SysMLv2.STAKEHOLDER:
				case SysMLv2.STANDARD:
				case SysMLv2.STATE:
				case SysMLv2.SUBJECT:
				case SysMLv2.SNAPSHOT:
				case SysMLv2.THEN:
				case SysMLv2.TIMESLICE:
				case SysMLv2.TRANSITION:
				case SysMLv2.USE:
				case SysMLv2.VARIATION:
				case SysMLv2.VERIFICATION:
				case SysMLv2.VERIFY:
				case SysMLv2.VIEW:
				case SysMLv2.VIEWPOINT:
				case SysMLv2.COLONGTGT:
				case SysMLv2.RBRACE:
				case SysMLv2.AT_SIGN:
				case SysMLv2.HASH:
				case SysMLv2.IDENTIFIER:
				case SysMLv2.STRING:
					break;
				default:
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public featureUsage(): FeatureUsageContext {
		let _localctx: FeatureUsageContext = new FeatureUsageContext(this._ctx, this.state);
		this.enterRule(_localctx, 220, SysMLv2.RULE_featureUsage);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2555;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & ((1 << (SysMLv2.IN - 58)) | (1 << (SysMLv2.INOUT - 58)) | (1 << (SysMLv2.OUT - 58)))) !== 0)) {
				{
				this.state = 2554;
				this.direction();
				}
			}

			this.state = 2557;
			this.identifier();
			this.state = 2559;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2558;
				this.typing();
				}
			}

			this.state = 2562;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 485, this._ctx) ) {
			case 1:
				{
				this.state = 2561;
				this.specialization();
				}
				break;
			}
			this.state = 2565;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2564;
				this.multiplicity();
				}
			}

			this.state = 2568;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DEFAULT || _la === SysMLv2.COLONASSIGN || _la === SysMLv2.ASSIGN) {
				{
				this.state = 2567;
				this.valueBinding();
				}
			}

			this.state = 2572;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 2570;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 2571;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.EOF:
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.EXPOSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionDefinition(): FunctionDefinitionContext {
		let _localctx: FunctionDefinitionContext = new FunctionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 222, SysMLv2.RULE_functionDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2575;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2574;
				this.visibility();
				}
			}

			this.state = 2580;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0)) {
				{
				{
				this.state = 2577;
				this.modifier();
				}
				}
				this.state = 2582;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 2583;
			this.match(SysMLv2.FUNCTION);
			this.state = 2586;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 491, this._ctx) ) {
			case 1:
				{
				this.state = 2584;
				this.identifier();
				}
				break;

			case 2:
				{
				this.state = 2585;
				this.stringValue();
				}
				break;
			}
			this.state = 2589;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LPAREN) {
				{
				this.state = 2588;
				this.functionSignature();
				}
			}

			this.state = 2592;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACE) {
				{
				this.state = 2591;
				this.body();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionSignature(): FunctionSignatureContext {
		let _localctx: FunctionSignatureContext = new FunctionSignatureContext(this._ctx, this.state);
		this.enterRule(_localctx, 224, SysMLv2.RULE_functionSignature);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2594;
			this.match(SysMLv2.LPAREN);
			this.state = 2596;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.IN - 34)) | (1 << (SysMLv2.INOUT - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.OUT - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PRIVATE - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.PROTECTED - 66)) | (1 << (SysMLv2.PUBLIC - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0) || _la === SysMLv2.IDENTIFIER || _la === SysMLv2.STRING) {
				{
				this.state = 2595;
				this.parameterList();
				}
			}

			this.state = 2598;
			this.match(SysMLv2.RPAREN);
			this.state = 2600;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 495, this._ctx) ) {
			case 1:
				{
				this.state = 2599;
				this.returnType();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 226, SysMLv2.RULE_parameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2602;
			this.parameter();
			this.state = 2607;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.COMMA) {
				{
				{
				this.state = 2603;
				this.match(SysMLv2.COMMA);
				this.state = 2604;
				this.parameter();
				}
				}
				this.state = 2609;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 228, SysMLv2.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2611;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0)) {
				{
				this.state = 2610;
				this.visibility();
				}
			}

			this.state = 2614;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & ((1 << (SysMLv2.IN - 58)) | (1 << (SysMLv2.INOUT - 58)) | (1 << (SysMLv2.OUT - 58)))) !== 0)) {
				{
				this.state = 2613;
				this.direction();
				}
			}

			this.state = 2616;
			this.identifier();
			this.state = 2618;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.COLON) {
				{
				this.state = 2617;
				this.typing();
				}
			}

			this.state = 2621;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LBRACKET) {
				{
				this.state = 2620;
				this.multiplicity();
				}
			}

			this.state = 2625;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.LBRACE:
				{
				this.state = 2623;
				this.body();
				}
				break;
			case SysMLv2.SEMICOLON:
				{
				this.state = 2624;
				this.match(SysMLv2.SEMICOLON);
				}
				break;
			case SysMLv2.ABSTRACT:
			case SysMLv2.ACCEPT:
			case SysMLv2.ACTION:
			case SysMLv2.ACTOR:
			case SysMLv2.ALIAS:
			case SysMLv2.ALLOCATE:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ALT:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ASSOC:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.BIND:
			case SysMLv2.CALC:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECT:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DATATYPE:
			case SysMLv2.DEF:
			case SysMLv2.DEPENDENCY:
			case SysMLv2.DERIVED:
			case SysMLv2.DIRECTION:
			case SysMLv2.DO:
			case SysMLv2.DOC:
			case SysMLv2.ELSE:
			case SysMLv2.END:
			case SysMLv2.ENTRY:
			case SysMLv2.ENUM:
			case SysMLv2.EVENT:
			case SysMLv2.EXHIBIT:
			case SysMLv2.EXIT:
			case SysMLv2.FEATURE:
			case SysMLv2.FILTER:
			case SysMLv2.FIRST:
			case SysMLv2.FLOW:
			case SysMLv2.FORK:
			case SysMLv2.FUNCTION:
			case SysMLv2.IF:
			case SysMLv2.IMPORT:
			case SysMLv2.IN:
			case SysMLv2.INDIVIDUAL:
			case SysMLv2.INOUT:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.JOIN:
			case SysMLv2.LIBRARY:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NONUNIQUE:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.ORDERED:
			case SysMLv2.OUT:
			case SysMLv2.PACKAGE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PERFORM:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PRIVATE:
			case SysMLv2.PROPERTY:
			case SysMLv2.PROTECTED:
			case SysMLv2.PUBLIC:
			case SysMLv2.READONLY:
			case SysMLv2.REDEFINES:
			case SysMLv2.REF:
			case SysMLv2.REQUIRE:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.RETURN:
			case SysMLv2.SATISFY:
			case SysMLv2.SEND:
			case SysMLv2.STAKEHOLDER:
			case SysMLv2.STANDARD:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.SNAPSHOT:
			case SysMLv2.THEN:
			case SysMLv2.TIMESLICE:
			case SysMLv2.TRANSITION:
			case SysMLv2.USE:
			case SysMLv2.VARIATION:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VERIFY:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.COLONGTGT:
			case SysMLv2.COMMA:
			case SysMLv2.RPAREN:
			case SysMLv2.RBRACE:
			case SysMLv2.AT_SIGN:
			case SysMLv2.HASH:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				break;
			default:
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public direction(): DirectionContext {
		let _localctx: DirectionContext = new DirectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 230, SysMLv2.RULE_direction);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2627;
			_la = this._input.LA(1);
			if (!(((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & ((1 << (SysMLv2.IN - 58)) | (1 << (SysMLv2.INOUT - 58)) | (1 << (SysMLv2.OUT - 58)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnType(): ReturnTypeContext {
		let _localctx: ReturnTypeContext = new ReturnTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 232, SysMLv2.RULE_returnType);
		let _la: number;
		try {
			this.state = 2644;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.RETURN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2629;
				this.match(SysMLv2.RETURN);
				this.state = 2630;
				this.match(SysMLv2.COLON);
				this.state = 2631;
				this.qualifiedName();
				}
				break;
			case SysMLv2.LBRACE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2632;
				this.match(SysMLv2.LBRACE);
				this.state = 2633;
				this.match(SysMLv2.RETURN);
				this.state = 2634;
				this.match(SysMLv2.COLON);
				this.state = 2635;
				this.qualifiedName();
				this.state = 2637;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.LBRACKET) {
					{
					this.state = 2636;
					this.multiplicity();
					}
				}

				this.state = 2640;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 2639;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				this.state = 2642;
				this.match(SysMLv2.RBRACE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public visibility(): VisibilityContext {
		let _localctx: VisibilityContext = new VisibilityContext(this._ctx, this.state);
		this.enterRule(_localctx, 234, SysMLv2.RULE_visibility);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2646;
			_la = this._input.LA(1);
			if (!(((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & ((1 << (SysMLv2.PRIVATE - 86)) | (1 << (SysMLv2.PROTECTED - 86)) | (1 << (SysMLv2.PUBLIC - 86)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public modifier(): ModifierContext {
		let _localctx: ModifierContext = new ModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 236, SysMLv2.RULE_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2648;
			_la = this._input.LA(1);
			if (!(_la === SysMLv2.ABSTRACT || _la === SysMLv2.DERIVED || ((((_la - 59)) & ~0x1F) === 0 && ((1 << (_la - 59)) & ((1 << (SysMLv2.INDIVIDUAL - 59)) | (1 << (SysMLv2.NONUNIQUE - 59)) | (1 << (SysMLv2.ORDERED - 59)) | (1 << (SysMLv2.READONLY - 59)))) !== 0) || ((((_la - 106)) & ~0x1F) === 0 && ((1 << (_la - 106)) & ((1 << (SysMLv2.SNAPSHOT - 106)) | (1 << (SysMLv2.TIMESLICE - 106)) | (1 << (SysMLv2.VARIATION - 106)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typing(): TypingContext {
		let _localctx: TypingContext = new TypingContext(this._ctx, this.state);
		this.enterRule(_localctx, 238, SysMLv2.RULE_typing);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2650;
			this.match(SysMLv2.COLON);
			this.state = 2652;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.TILDE) {
				{
				this.state = 2651;
				this.match(SysMLv2.TILDE);
				}
			}

			this.state = 2654;
			this.qualifiedName();
			this.state = 2656;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.LT) {
				{
				this.state = 2655;
				this.typeParameters();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeParameters(): TypeParametersContext {
		let _localctx: TypeParametersContext = new TypeParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 240, SysMLv2.RULE_typeParameters);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2658;
			this.match(SysMLv2.LT);
			this.state = 2659;
			this.typeParameterList();
			this.state = 2660;
			this.match(SysMLv2.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeParameterList(): TypeParameterListContext {
		let _localctx: TypeParameterListContext = new TypeParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 242, SysMLv2.RULE_typeParameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2662;
			this.qualifiedName();
			this.state = 2667;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.COMMA) {
				{
				{
				this.state = 2663;
				this.match(SysMLv2.COMMA);
				this.state = 2664;
				this.qualifiedName();
				}
				}
				this.state = 2669;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public specialization(): SpecializationContext {
		let _localctx: SpecializationContext = new SpecializationContext(this._ctx, this.state);
		this.enterRule(_localctx, 244, SysMLv2.RULE_specialization);
		let _la: number;
		try {
			this.state = 2724;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.COLONGT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2670;
				this.match(SysMLv2.COLONGT);
				this.state = 2671;
				this.qualifiedName();
				this.state = 2676;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2672;
					this.match(SysMLv2.COMMA);
					this.state = 2673;
					this.qualifiedName();
					}
					}
					this.state = 2678;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case SysMLv2.SPECIALIZES:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2679;
				this.match(SysMLv2.SPECIALIZES);
				this.state = 2680;
				this.qualifiedName();
				this.state = 2685;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2681;
					this.match(SysMLv2.COMMA);
					this.state = 2682;
					this.qualifiedName();
					}
					}
					this.state = 2687;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case SysMLv2.SUBSETS:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2688;
				this.match(SysMLv2.SUBSETS);
				this.state = 2689;
				this.qualifiedName();
				this.state = 2694;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2690;
					this.match(SysMLv2.COMMA);
					this.state = 2691;
					this.qualifiedName();
					}
					}
					this.state = 2696;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case SysMLv2.REDEFINES:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 2697;
				this.match(SysMLv2.REDEFINES);
				this.state = 2698;
				this.qualifiedName();
				this.state = 2703;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2699;
					this.match(SysMLv2.COMMA);
					this.state = 2700;
					this.qualifiedName();
					}
					}
					this.state = 2705;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case SysMLv2.REFERENCES:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 2706;
				this.match(SysMLv2.REFERENCES);
				this.state = 2707;
				this.qualifiedName();
				this.state = 2712;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2708;
					this.match(SysMLv2.COMMA);
					this.state = 2709;
					this.qualifiedName();
					}
					}
					this.state = 2714;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case SysMLv2.BINDS:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 2715;
				this.match(SysMLv2.BINDS);
				this.state = 2716;
				this.qualifiedName();
				this.state = 2721;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === SysMLv2.COMMA) {
					{
					{
					this.state = 2717;
					this.match(SysMLv2.COMMA);
					this.state = 2718;
					this.qualifiedName();
					}
					}
					this.state = 2723;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicity(): MultiplicityContext {
		let _localctx: MultiplicityContext = new MultiplicityContext(this._ctx, this.state);
		this.enterRule(_localctx, 246, SysMLv2.RULE_multiplicity);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2726;
			this.match(SysMLv2.LBRACKET);
			this.state = 2727;
			this.multiplicityRange();
			this.state = 2728;
			this.match(SysMLv2.RBRACKET);
			this.state = 2732;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 515, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2729;
					this.multiplicityModifier();
					}
					}
				}
				this.state = 2734;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 515, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicityModifier(): MultiplicityModifierContext {
		let _localctx: MultiplicityModifierContext = new MultiplicityModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 248, SysMLv2.RULE_multiplicityModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2735;
			_la = this._input.LA(1);
			if (!(_la === SysMLv2.NONUNIQUE || _la === SysMLv2.ORDERED)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicityRange(): MultiplicityRangeContext {
		let _localctx: MultiplicityRangeContext = new MultiplicityRangeContext(this._ctx, this.state);
		this.enterRule(_localctx, 250, SysMLv2.RULE_multiplicityRange);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2737;
			this.multiplicityBound();
			this.state = 2740;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.DOTDOT) {
				{
				this.state = 2738;
				this.match(SysMLv2.DOTDOT);
				this.state = 2739;
				this.multiplicityBound();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicityBound(): MultiplicityBoundContext {
		let _localctx: MultiplicityBoundContext = new MultiplicityBoundContext(this._ctx, this.state);
		this.enterRule(_localctx, 252, SysMLv2.RULE_multiplicityBound);
		try {
			this.state = 2745;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 517, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2742;
				this.match(SysMLv2.INTEGER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2743;
				this.match(SysMLv2.MULTIPLY);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2744;
				this.expression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public body(): BodyContext {
		let _localctx: BodyContext = new BodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 254, SysMLv2.RULE_body);
		let _la: number;
		try {
			this.state = 2759;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 519, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2747;
				this.match(SysMLv2.LBRACE);
				this.state = 2751;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ABSTRACT) | (1 << SysMLv2.ACCEPT) | (1 << SysMLv2.ACTION) | (1 << SysMLv2.ACTOR) | (1 << SysMLv2.ALIAS) | (1 << SysMLv2.ALLOCATE) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ALT) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ASSOC) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.BIND) | (1 << SysMLv2.CALC) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECT) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT) | (1 << SysMLv2.DATATYPE) | (1 << SysMLv2.DEF))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (SysMLv2.DEPENDENCY - 32)) | (1 << (SysMLv2.DERIVED - 32)) | (1 << (SysMLv2.DIRECTION - 32)) | (1 << (SysMLv2.DO - 32)) | (1 << (SysMLv2.DOC - 32)) | (1 << (SysMLv2.ELSE - 32)) | (1 << (SysMLv2.END - 32)) | (1 << (SysMLv2.ENTRY - 32)) | (1 << (SysMLv2.ENUM - 32)) | (1 << (SysMLv2.EVENT - 32)) | (1 << (SysMLv2.EXHIBIT - 32)) | (1 << (SysMLv2.EXIT - 32)) | (1 << (SysMLv2.FEATURE - 32)) | (1 << (SysMLv2.FILTER - 32)) | (1 << (SysMLv2.FIRST - 32)) | (1 << (SysMLv2.FLOW - 32)) | (1 << (SysMLv2.FORK - 32)) | (1 << (SysMLv2.FUNCTION - 32)) | (1 << (SysMLv2.IF - 32)) | (1 << (SysMLv2.IMPORT - 32)) | (1 << (SysMLv2.IN - 32)) | (1 << (SysMLv2.INDIVIDUAL - 32)) | (1 << (SysMLv2.INOUT - 32)) | (1 << (SysMLv2.INTERACTION - 32)) | (1 << (SysMLv2.INTERFACE - 32)) | (1 << (SysMLv2.ITEM - 32)))) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & ((1 << (SysMLv2.JOIN - 64)) | (1 << (SysMLv2.LIBRARY - 64)) | (1 << (SysMLv2.MESSAGE - 64)) | (1 << (SysMLv2.METADATA - 64)) | (1 << (SysMLv2.NONUNIQUE - 64)) | (1 << (SysMLv2.OBJECTIVE - 64)) | (1 << (SysMLv2.OCCURRENCE - 64)) | (1 << (SysMLv2.ORDERED - 64)) | (1 << (SysMLv2.OUT - 64)) | (1 << (SysMLv2.PACKAGE - 64)) | (1 << (SysMLv2.PART - 64)) | (1 << (SysMLv2.PARTICIPANT - 64)) | (1 << (SysMLv2.PERFORM - 64)) | (1 << (SysMLv2.PAYLOAD - 64)) | (1 << (SysMLv2.PORT - 64)) | (1 << (SysMLv2.PRIVATE - 64)) | (1 << (SysMLv2.PROPERTY - 64)) | (1 << (SysMLv2.PROTECTED - 64)) | (1 << (SysMLv2.PUBLIC - 64)) | (1 << (SysMLv2.READONLY - 64)) | (1 << (SysMLv2.REDEFINES - 64)) | (1 << (SysMLv2.REF - 64)) | (1 << (SysMLv2.REQUIRE - 64)) | (1 << (SysMLv2.REQUIREMENT - 64)))) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & ((1 << (SysMLv2.RETURN - 96)) | (1 << (SysMLv2.SATISFY - 96)) | (1 << (SysMLv2.SEND - 96)) | (1 << (SysMLv2.STAKEHOLDER - 96)) | (1 << (SysMLv2.STANDARD - 96)) | (1 << (SysMLv2.STATE - 96)) | (1 << (SysMLv2.SUBJECT - 96)) | (1 << (SysMLv2.SNAPSHOT - 96)) | (1 << (SysMLv2.THEN - 96)) | (1 << (SysMLv2.TIMESLICE - 96)) | (1 << (SysMLv2.TRANSITION - 96)) | (1 << (SysMLv2.USE - 96)) | (1 << (SysMLv2.VARIATION - 96)) | (1 << (SysMLv2.VERIFICATION - 96)) | (1 << (SysMLv2.VERIFY - 96)) | (1 << (SysMLv2.VIEW - 96)) | (1 << (SysMLv2.VIEWPOINT - 96)) | (1 << (SysMLv2.COLONGTGT - 96)))) !== 0) || ((((_la - 155)) & ~0x1F) === 0 && ((1 << (_la - 155)) & ((1 << (SysMLv2.AT_SIGN - 155)) | (1 << (SysMLv2.HASH - 155)) | (1 << (SysMLv2.IDENTIFIER - 155)) | (1 << (SysMLv2.STRING - 155)))) !== 0)) {
					{
					{
					this.state = 2748;
					this.bodyElement();
					}
					}
					this.state = 2753;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 2754;
				this.match(SysMLv2.RBRACE);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2755;
				this.match(SysMLv2.LBRACE);
				this.state = 2756;
				this.expression();
				this.state = 2757;
				this.match(SysMLv2.RBRACE);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bodyElement(): BodyElementContext {
		let _localctx: BodyElementContext = new BodyElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 256, SysMLv2.RULE_bodyElement);
		try {
			this.state = 2765;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 520, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2761;
				this.element();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2762;
				this.parameter();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2763;
				this.flowStatement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 2764;
				this.enumValueBinding();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public enumValueBinding(): EnumValueBindingContext {
		let _localctx: EnumValueBindingContext = new EnumValueBindingContext(this._ctx, this.state);
		this.enterRule(_localctx, 258, SysMLv2.RULE_enumValueBinding);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2767;
			this.match(SysMLv2.ENUM);
			this.state = 2770;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.ASSIGN) {
				{
				this.state = 2768;
				this.match(SysMLv2.ASSIGN);
				this.state = 2769;
				this.expression();
				}
			}

			this.state = 2773;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.SEMICOLON) {
				{
				this.state = 2772;
				this.match(SysMLv2.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public flowStatement(): FlowStatementContext {
		let _localctx: FlowStatementContext = new FlowStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 260, SysMLv2.RULE_flowStatement);
		let _la: number;
		try {
			this.state = 2802;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 527, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2775;
				this.match(SysMLv2.FLOW);
				this.state = 2777;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.OF) {
					{
					this.state = 2776;
					this.match(SysMLv2.OF);
					}
				}

				this.state = 2779;
				this.qualifiedName();
				this.state = 2780;
				this.match(SysMLv2.FROM);
				this.state = 2781;
				this.qualifiedName();
				this.state = 2782;
				this.match(SysMLv2.TO);
				this.state = 2783;
				this.qualifiedName();
				this.state = 2785;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 2784;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2787;
				this.match(SysMLv2.FLOW);
				this.state = 2788;
				this.match(SysMLv2.FROM);
				this.state = 2789;
				this.qualifiedName();
				this.state = 2790;
				this.match(SysMLv2.TO);
				this.state = 2791;
				this.qualifiedName();
				this.state = 2793;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 2792;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2795;
				this.match(SysMLv2.FLOW);
				this.state = 2796;
				this.qualifiedName();
				this.state = 2797;
				this.match(SysMLv2.TO);
				this.state = 2798;
				this.qualifiedName();
				this.state = 2800;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 2799;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 262, SysMLv2.RULE_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2804;
			this.conditionalExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public conditionalExpression(): ConditionalExpressionContext {
		let _localctx: ConditionalExpressionContext = new ConditionalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 264, SysMLv2.RULE_conditionalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2806;
			this.nullCoalescingExpression();
			this.state = 2812;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === SysMLv2.QUESTION) {
				{
				this.state = 2807;
				this.match(SysMLv2.QUESTION);
				this.state = 2808;
				this.expression();
				this.state = 2809;
				this.match(SysMLv2.COLON);
				this.state = 2810;
				this.conditionalExpression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nullCoalescingExpression(): NullCoalescingExpressionContext {
		let _localctx: NullCoalescingExpressionContext = new NullCoalescingExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 266, SysMLv2.RULE_nullCoalescingExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2814;
			this.logicalOrExpression();
			this.state = 2819;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.QUESTIONQUESTION) {
				{
				{
				this.state = 2815;
				this.match(SysMLv2.QUESTIONQUESTION);
				this.state = 2816;
				this.logicalOrExpression();
				}
				}
				this.state = 2821;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalOrExpression(): LogicalOrExpressionContext {
		let _localctx: LogicalOrExpressionContext = new LogicalOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 268, SysMLv2.RULE_logicalOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2822;
			this.logicalXorExpression();
			this.state = 2827;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.OR) {
				{
				{
				this.state = 2823;
				this.match(SysMLv2.OR);
				this.state = 2824;
				this.logicalXorExpression();
				}
				}
				this.state = 2829;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalXorExpression(): LogicalXorExpressionContext {
		let _localctx: LogicalXorExpressionContext = new LogicalXorExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 270, SysMLv2.RULE_logicalXorExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2830;
			this.logicalAndExpression();
			this.state = 2835;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.XOR) {
				{
				{
				this.state = 2831;
				this.match(SysMLv2.XOR);
				this.state = 2832;
				this.logicalAndExpression();
				}
				}
				this.state = 2837;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalAndExpression(): LogicalAndExpressionContext {
		let _localctx: LogicalAndExpressionContext = new LogicalAndExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 272, SysMLv2.RULE_logicalAndExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2838;
			this.equalityExpression();
			this.state = 2843;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.AND) {
				{
				{
				this.state = 2839;
				this.match(SysMLv2.AND);
				this.state = 2840;
				this.equalityExpression();
				}
				}
				this.state = 2845;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public equalityExpression(): EqualityExpressionContext {
		let _localctx: EqualityExpressionContext = new EqualityExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 274, SysMLv2.RULE_equalityExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2846;
			this.relationalExpression();
			this.state = 2851;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 129)) & ~0x1F) === 0 && ((1 << (_la - 129)) & ((1 << (SysMLv2.EQ - 129)) | (1 << (SysMLv2.NE - 129)) | (1 << (SysMLv2.EEQ - 129)) | (1 << (SysMLv2.NEE - 129)))) !== 0)) {
				{
				{
				this.state = 2847;
				_la = this._input.LA(1);
				if (!(((((_la - 129)) & ~0x1F) === 0 && ((1 << (_la - 129)) & ((1 << (SysMLv2.EQ - 129)) | (1 << (SysMLv2.NE - 129)) | (1 << (SysMLv2.EEQ - 129)) | (1 << (SysMLv2.NEE - 129)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 2848;
				this.relationalExpression();
				}
				}
				this.state = 2853;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public relationalExpression(): RelationalExpressionContext {
		let _localctx: RelationalExpressionContext = new RelationalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 276, SysMLv2.RULE_relationalExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2854;
			this.additiveExpression();
			this.state = 2859;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 534, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2855;
					_la = this._input.LA(1);
					if (!(_la === SysMLv2.HASTYPE || _la === SysMLv2.IN || ((((_la - 127)) & ~0x1F) === 0 && ((1 << (_la - 127)) & ((1 << (SysMLv2.LE - 127)) | (1 << (SysMLv2.GE - 127)) | (1 << (SysMLv2.LT - 127)) | (1 << (SysMLv2.GT - 127)))) !== 0))) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 2856;
					this.additiveExpression();
					}
					}
				}
				this.state = 2861;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 534, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public additiveExpression(): AdditiveExpressionContext {
		let _localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 278, SysMLv2.RULE_additiveExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2862;
			this.multiplicativeExpression();
			this.state = 2867;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.PLUS || _la === SysMLv2.MINUS) {
				{
				{
				this.state = 2863;
				_la = this._input.LA(1);
				if (!(_la === SysMLv2.PLUS || _la === SysMLv2.MINUS)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 2864;
				this.multiplicativeExpression();
				}
				}
				this.state = 2869;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let _localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 280, SysMLv2.RULE_multiplicativeExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2870;
			this.exponentialExpression();
			this.state = 2875;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 151)) & ~0x1F) === 0 && ((1 << (_la - 151)) & ((1 << (SysMLv2.MULTIPLY - 151)) | (1 << (SysMLv2.DIVIDE - 151)) | (1 << (SysMLv2.MODULO - 151)))) !== 0)) {
				{
				{
				this.state = 2871;
				_la = this._input.LA(1);
				if (!(((((_la - 151)) & ~0x1F) === 0 && ((1 << (_la - 151)) & ((1 << (SysMLv2.MULTIPLY - 151)) | (1 << (SysMLv2.DIVIDE - 151)) | (1 << (SysMLv2.MODULO - 151)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 2872;
				this.exponentialExpression();
				}
				}
				this.state = 2877;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exponentialExpression(): ExponentialExpressionContext {
		let _localctx: ExponentialExpressionContext = new ExponentialExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 282, SysMLv2.RULE_exponentialExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2878;
			this.unaryExpression();
			this.state = 2883;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.POWER) {
				{
				{
				this.state = 2879;
				this.match(SysMLv2.POWER);
				this.state = 2880;
				this.unaryExpression();
				}
				}
				this.state = 2885;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unaryExpression(): UnaryExpressionContext {
		let _localctx: UnaryExpressionContext = new UnaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 284, SysMLv2.RULE_unaryExpression);
		let _la: number;
		try {
			this.state = 2889;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.NOT:
			case SysMLv2.PLUS:
			case SysMLv2.MINUS:
			case SysMLv2.EXCLAMATION:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2886;
				_la = this._input.LA(1);
				if (!(_la === SysMLv2.NOT || ((((_la - 149)) & ~0x1F) === 0 && ((1 << (_la - 149)) & ((1 << (SysMLv2.PLUS - 149)) | (1 << (SysMLv2.MINUS - 149)) | (1 << (SysMLv2.EXCLAMATION - 149)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 2887;
				this.unaryExpression();
				}
				break;
			case SysMLv2.ACTION:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DIRECTION:
			case SysMLv2.DOC:
			case SysMLv2.EVENT:
			case SysMLv2.FALSE:
			case SysMLv2.FEATURE:
			case SysMLv2.FLOW:
			case SysMLv2.FUNCTION:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.NEW:
			case SysMLv2.NULL:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PROPERTY:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.TRUE:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.LPAREN:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.INTEGER:
			case SysMLv2.REAL:
			case SysMLv2.STRING:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2888;
				this.postfixExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public postfixExpression(): PostfixExpressionContext {
		let _localctx: PostfixExpressionContext = new PostfixExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 286, SysMLv2.RULE_postfixExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2891;
			this.primaryExpression();
			this.state = 2895;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 139)) & ~0x1F) === 0 && ((1 << (_la - 139)) & ((1 << (SysMLv2.DOT - 139)) | (1 << (SysMLv2.LPAREN - 139)) | (1 << (SysMLv2.LBRACKET - 139)))) !== 0)) {
				{
				{
				this.state = 2892;
				this.postfixOperator();
				}
				}
				this.state = 2897;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public postfixOperator(): PostfixOperatorContext {
		let _localctx: PostfixOperatorContext = new PostfixOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 288, SysMLv2.RULE_postfixOperator);
		let _la: number;
		try {
			this.state = 2909;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.DOT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2898;
				this.match(SysMLv2.DOT);
				this.state = 2899;
				this.identifier();
				}
				break;
			case SysMLv2.LBRACKET:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2900;
				this.match(SysMLv2.LBRACKET);
				this.state = 2901;
				this.expression();
				this.state = 2902;
				this.match(SysMLv2.RBRACKET);
				}
				break;
			case SysMLv2.LPAREN:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2904;
				this.match(SysMLv2.LPAREN);
				this.state = 2906;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FALSE - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.NOT - 66)) | (1 << (SysMLv2.NEW - 66)) | (1 << (SysMLv2.NULL - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.TRUE - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0) || ((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & ((1 << (SysMLv2.LPAREN - 141)) | (1 << (SysMLv2.PLUS - 141)) | (1 << (SysMLv2.MINUS - 141)) | (1 << (SysMLv2.EXCLAMATION - 141)) | (1 << (SysMLv2.IDENTIFIER - 141)) | (1 << (SysMLv2.INTEGER - 141)) | (1 << (SysMLv2.REAL - 141)) | (1 << (SysMLv2.STRING - 141)))) !== 0)) {
					{
					this.state = 2905;
					this.argumentList();
					}
				}

				this.state = 2908;
				this.match(SysMLv2.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primaryExpression(): PrimaryExpressionContext {
		let _localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 290, SysMLv2.RULE_primaryExpression);
		let _la: number;
		try {
			this.state = 2933;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 546, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2911;
				this.match(SysMLv2.NEW);
				this.state = 2912;
				this.qualifiedName();
				this.state = 2913;
				this.match(SysMLv2.LPAREN);
				this.state = 2915;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FALSE - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.NOT - 66)) | (1 << (SysMLv2.NEW - 66)) | (1 << (SysMLv2.NULL - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.TRUE - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0) || ((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & ((1 << (SysMLv2.LPAREN - 141)) | (1 << (SysMLv2.PLUS - 141)) | (1 << (SysMLv2.MINUS - 141)) | (1 << (SysMLv2.EXCLAMATION - 141)) | (1 << (SysMLv2.IDENTIFIER - 141)) | (1 << (SysMLv2.INTEGER - 141)) | (1 << (SysMLv2.REAL - 141)) | (1 << (SysMLv2.STRING - 141)))) !== 0)) {
					{
					this.state = 2914;
					this.argumentList();
					}
				}

				this.state = 2917;
				this.match(SysMLv2.RPAREN);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2919;
				this.qualifiedName();
				this.state = 2921;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 543, this._ctx) ) {
				case 1:
					{
					this.state = 2920;
					this.unitSuffix();
					}
					break;
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2923;
				this.literal();
				this.state = 2925;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 544, this._ctx) ) {
				case 1:
					{
					this.state = 2924;
					this.unitSuffix();
					}
					break;
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 2927;
				this.match(SysMLv2.LPAREN);
				this.state = 2928;
				this.expressionList();
				this.state = 2929;
				this.match(SysMLv2.RPAREN);
				this.state = 2931;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 545, this._ctx) ) {
				case 1:
					{
					this.state = 2930;
					this.unitSuffix();
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expressionList(): ExpressionListContext {
		let _localctx: ExpressionListContext = new ExpressionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 292, SysMLv2.RULE_expressionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2935;
			this.expression();
			this.state = 2940;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.COMMA) {
				{
				{
				this.state = 2936;
				this.match(SysMLv2.COMMA);
				this.state = 2937;
				this.expression();
				}
				}
				this.state = 2942;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unitSuffix(): UnitSuffixContext {
		let _localctx: UnitSuffixContext = new UnitSuffixContext(this._ctx, this.state);
		this.enterRule(_localctx, 294, SysMLv2.RULE_unitSuffix);
		try {
			this.state = 2948;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.UNIT_LITERAL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2943;
				this.match(SysMLv2.UNIT_LITERAL);
				}
				break;
			case SysMLv2.LBRACKET:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2944;
				this.match(SysMLv2.LBRACKET);
				this.state = 2945;
				this.qualifiedName();
				this.state = 2946;
				this.match(SysMLv2.RBRACKET);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 296, SysMLv2.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2950;
			this.argument();
			this.state = 2955;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === SysMLv2.COMMA) {
				{
				{
				this.state = 2951;
				this.match(SysMLv2.COMMA);
				this.state = 2952;
				this.argument();
				}
				}
				this.state = 2957;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argument(): ArgumentContext {
		let _localctx: ArgumentContext = new ArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 298, SysMLv2.RULE_argument);
		try {
			this.state = 2963;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 550, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2958;
				this.identifier();
				this.state = 2959;
				this.match(SysMLv2.ASSIGN);
				this.state = 2960;
				this.expression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2962;
				this.expression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 300, SysMLv2.RULE_literal);
		try {
			this.state = 2970;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.INTEGER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2965;
				this.match(SysMLv2.INTEGER);
				}
				break;
			case SysMLv2.REAL:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2966;
				this.match(SysMLv2.REAL);
				}
				break;
			case SysMLv2.STRING:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2967;
				this.stringValue();
				}
				break;
			case SysMLv2.FALSE:
			case SysMLv2.TRUE:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 2968;
				this.booleanValue();
				}
				break;
			case SysMLv2.NULL:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 2969;
				this.nullValue();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stringValue(): StringValueContext {
		let _localctx: StringValueContext = new StringValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 302, SysMLv2.RULE_stringValue);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2972;
			this.match(SysMLv2.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public booleanValue(): BooleanValueContext {
		let _localctx: BooleanValueContext = new BooleanValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 304, SysMLv2.RULE_booleanValue);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2974;
			_la = this._input.LA(1);
			if (!(_la === SysMLv2.FALSE || _la === SysMLv2.TRUE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nullValue(): NullValueContext {
		let _localctx: NullValueContext = new NullValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 306, SysMLv2.RULE_nullValue);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2976;
			this.match(SysMLv2.NULL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public qualifiedName(): QualifiedNameContext {
		let _localctx: QualifiedNameContext = new QualifiedNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 308, SysMLv2.RULE_qualifiedName);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2978;
			this.identifier();
			this.state = 2983;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 552, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 2979;
					_la = this._input.LA(1);
					if (!(_la === SysMLv2.COLONCOLON || _la === SysMLv2.DOT)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 2980;
					this.identifier();
					}
					}
				}
				this.state = 2985;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 552, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identifier(): IdentifierContext {
		let _localctx: IdentifierContext = new IdentifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 310, SysMLv2.RULE_identifier);
		try {
			this.state = 2989;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2986;
				this.match(SysMLv2.IDENTIFIER);
				}
				break;
			case SysMLv2.STRING:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 2987;
				this.match(SysMLv2.STRING);
				}
				break;
			case SysMLv2.ACTION:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DIRECTION:
			case SysMLv2.DOC:
			case SysMLv2.EVENT:
			case SysMLv2.FEATURE:
			case SysMLv2.FLOW:
			case SysMLv2.FUNCTION:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PROPERTY:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 2988;
				this.keyword();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public shortName(): ShortNameContext {
		let _localctx: ShortNameContext = new ShortNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 312, SysMLv2.RULE_shortName);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2991;
			this.match(SysMLv2.LT);
			this.state = 2992;
			_la = this._input.LA(1);
			if (!(_la === SysMLv2.IDENTIFIER || _la === SysMLv2.STRING)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 2993;
			this.match(SysMLv2.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public keyword(): KeywordContext {
		let _localctx: KeywordContext = new KeywordContext(this._ctx, this.state);
		this.enterRule(_localctx, 314, SysMLv2.RULE_keyword);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2995;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SysMLv2.ACTION) | (1 << SysMLv2.ALLOCATION) | (1 << SysMLv2.ANALYSIS) | (1 << SysMLv2.ATTRIBUTE) | (1 << SysMLv2.COMMENT) | (1 << SysMLv2.CONCERN) | (1 << SysMLv2.CONNECTION) | (1 << SysMLv2.CONSTRAINT))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (SysMLv2.DIRECTION - 34)) | (1 << (SysMLv2.DOC - 34)) | (1 << (SysMLv2.EVENT - 34)) | (1 << (SysMLv2.FEATURE - 34)) | (1 << (SysMLv2.FLOW - 34)) | (1 << (SysMLv2.FUNCTION - 34)) | (1 << (SysMLv2.INTERACTION - 34)) | (1 << (SysMLv2.INTERFACE - 34)) | (1 << (SysMLv2.ITEM - 34)))) !== 0) || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (SysMLv2.MESSAGE - 66)) | (1 << (SysMLv2.METADATA - 66)) | (1 << (SysMLv2.OBJECTIVE - 66)) | (1 << (SysMLv2.OCCURRENCE - 66)) | (1 << (SysMLv2.PART - 66)) | (1 << (SysMLv2.PARTICIPANT - 66)) | (1 << (SysMLv2.PAYLOAD - 66)) | (1 << (SysMLv2.PORT - 66)) | (1 << (SysMLv2.PROPERTY - 66)) | (1 << (SysMLv2.REQUIREMENT - 66)))) !== 0) || ((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & ((1 << (SysMLv2.STATE - 103)) | (1 << (SysMLv2.SUBJECT - 103)) | (1 << (SysMLv2.VERIFICATION - 103)) | (1 << (SysMLv2.VIEW - 103)) | (1 << (SysMLv2.VIEWPOINT - 103)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stateTransition(): StateTransitionContext {
		let _localctx: StateTransitionContext = new StateTransitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 316, SysMLv2.RULE_stateTransition);
		let _la: number;
		try {
			this.state = 3071;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 572, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 2997;
				this.match(SysMLv2.TRANSITION);
				this.state = 2999;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 554, this._ctx) ) {
				case 1:
					{
					this.state = 2998;
					this.identifier();
					}
					break;
				}
				this.state = 3001;
				this.fromState();
				this.state = 3003;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.IF) {
					{
					this.state = 3002;
					this.transitionGuard();
					}
				}

				this.state = 3006;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DO) {
					{
					this.state = 3005;
					this.transitionEffect();
					}
				}

				this.state = 3008;
				this.toState();
				this.state = 3010;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3009;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 3012;
				this.match(SysMLv2.TRANSITION);
				this.state = 3014;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 558, this._ctx) ) {
				case 1:
					{
					this.state = 3013;
					this.identifier();
					}
					break;
				}
				this.state = 3016;
				this.fromState();
				this.state = 3017;
				this.acceptEvent();
				this.state = 3019;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.IF) {
					{
					this.state = 3018;
					this.transitionGuard();
					}
				}

				this.state = 3022;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DO) {
					{
					this.state = 3021;
					this.transitionEffect();
					}
				}

				this.state = 3024;
				this.toState();
				this.state = 3026;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3025;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 3028;
				this.match(SysMLv2.TRANSITION);
				this.state = 3030;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 562, this._ctx) ) {
				case 1:
					{
					this.state = 3029;
					this.identifier();
					}
					break;
				}
				this.state = 3032;
				this.fromState();
				this.state = 3033;
				this.doAction();
				this.state = 3034;
				this.toState();
				this.state = 3036;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3035;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 3038;
				this.match(SysMLv2.TRANSITION);
				this.state = 3040;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 564, this._ctx) ) {
				case 1:
					{
					this.state = 3039;
					this.identifier();
					}
					break;
				}
				this.state = 3042;
				this.fromState();
				this.state = 3043;
				this.toState();
				this.state = 3045;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 565, this._ctx) ) {
				case 1:
					{
					this.state = 3044;
					this.transitionTrigger();
					}
					break;
				}
				this.state = 3048;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3047;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 3050;
				this.acceptEvent();
				this.state = 3052;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.IF) {
					{
					this.state = 3051;
					this.transitionGuard();
					}
				}

				this.state = 3055;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DO) {
					{
					this.state = 3054;
					this.transitionEffect();
					}
				}

				this.state = 3057;
				this.match(SysMLv2.THEN);
				this.state = 3058;
				this.identifier();
				this.state = 3060;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3059;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 3062;
				this.transitionGuard();
				this.state = 3064;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.DO) {
					{
					this.state = 3063;
					this.transitionEffect();
					}
				}

				this.state = 3066;
				this.match(SysMLv2.THEN);
				this.state = 3067;
				this.identifier();
				this.state = 3069;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === SysMLv2.SEMICOLON) {
					{
					this.state = 3068;
					this.match(SysMLv2.SEMICOLON);
					}
				}

				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public fromState(): FromStateContext {
		let _localctx: FromStateContext = new FromStateContext(this._ctx, this.state);
		this.enterRule(_localctx, 318, SysMLv2.RULE_fromState);
		try {
			this.state = 3078;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.FIRST:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 3073;
				this.match(SysMLv2.FIRST);
				this.state = 3074;
				this.identifier();
				}
				break;
			case SysMLv2.FROM:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 3075;
				this.match(SysMLv2.FROM);
				this.state = 3076;
				this.identifier();
				}
				break;
			case SysMLv2.ACTION:
			case SysMLv2.ALLOCATION:
			case SysMLv2.ANALYSIS:
			case SysMLv2.ATTRIBUTE:
			case SysMLv2.COMMENT:
			case SysMLv2.CONCERN:
			case SysMLv2.CONNECTION:
			case SysMLv2.CONSTRAINT:
			case SysMLv2.DIRECTION:
			case SysMLv2.DOC:
			case SysMLv2.EVENT:
			case SysMLv2.FEATURE:
			case SysMLv2.FLOW:
			case SysMLv2.FUNCTION:
			case SysMLv2.INTERACTION:
			case SysMLv2.INTERFACE:
			case SysMLv2.ITEM:
			case SysMLv2.MESSAGE:
			case SysMLv2.METADATA:
			case SysMLv2.OBJECTIVE:
			case SysMLv2.OCCURRENCE:
			case SysMLv2.PART:
			case SysMLv2.PARTICIPANT:
			case SysMLv2.PAYLOAD:
			case SysMLv2.PORT:
			case SysMLv2.PROPERTY:
			case SysMLv2.REQUIREMENT:
			case SysMLv2.STATE:
			case SysMLv2.SUBJECT:
			case SysMLv2.VERIFICATION:
			case SysMLv2.VIEW:
			case SysMLv2.VIEWPOINT:
			case SysMLv2.IDENTIFIER:
			case SysMLv2.STRING:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 3077;
				this.identifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public toState(): ToStateContext {
		let _localctx: ToStateContext = new ToStateContext(this._ctx, this.state);
		this.enterRule(_localctx, 320, SysMLv2.RULE_toState);
		try {
			this.state = 3084;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.THEN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 3080;
				this.match(SysMLv2.THEN);
				this.state = 3081;
				this.identifier();
				}
				break;
			case SysMLv2.TO:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 3082;
				this.match(SysMLv2.TO);
				this.state = 3083;
				this.identifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public transitionTrigger(): TransitionTriggerContext {
		let _localctx: TransitionTriggerContext = new TransitionTriggerContext(this._ctx, this.state);
		this.enterRule(_localctx, 322, SysMLv2.RULE_transitionTrigger);
		try {
			this.state = 3091;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case SysMLv2.ACCEPT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 3086;
				this.acceptEvent();
				}
				break;
			case SysMLv2.AT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 3087;
				this.match(SysMLv2.AT);
				this.state = 3088;
				this.expression();
				}
				break;
			case SysMLv2.WHEN:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 3089;
				this.match(SysMLv2.WHEN);
				this.state = 3090;
				this.expression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public transitionGuard(): TransitionGuardContext {
		let _localctx: TransitionGuardContext = new TransitionGuardContext(this._ctx, this.state);
		this.enterRule(_localctx, 324, SysMLv2.RULE_transitionGuard);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 3093;
			this.match(SysMLv2.IF);
			this.state = 3094;
			this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public transitionEffect(): TransitionEffectContext {
		let _localctx: TransitionEffectContext = new TransitionEffectContext(this._ctx, this.state);
		this.enterRule(_localctx, 326, SysMLv2.RULE_transitionEffect);
		try {
			this.state = 3100;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 576, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 3096;
				this.match(SysMLv2.DO);
				this.state = 3097;
				this.sendAction();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 3098;
				this.match(SysMLv2.DO);
				this.state = 3099;
				this.qualifiedName();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	private static readonly _serializedATNSegments: number = 7;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\xA9\u0C21\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17" +
		"\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C" +
		"\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04" +
		"#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t" +
		"+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
		"F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
		"O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
		"X\tX\x04Y\tY\x04Z\tZ\x04[\t[\x04\\\t\\\x04]\t]\x04^\t^\x04_\t_\x04`\t" +
		"`\x04a\ta\x04b\tb\x04c\tc\x04d\td\x04e\te\x04f\tf\x04g\tg\x04h\th\x04" +
		"i\ti\x04j\tj\x04k\tk\x04l\tl\x04m\tm\x04n\tn\x04o\to\x04p\tp\x04q\tq\x04" +
		"r\tr\x04s\ts\x04t\tt\x04u\tu\x04v\tv\x04w\tw\x04x\tx\x04y\ty\x04z\tz\x04" +
		"{\t{\x04|\t|\x04}\t}\x04~\t~\x04\x7F\t\x7F\x04\x80\t\x80\x04\x81\t\x81" +
		"\x04\x82\t\x82\x04\x83\t\x83\x04\x84\t\x84\x04\x85\t\x85\x04\x86\t\x86" +
		"\x04\x87\t\x87\x04\x88\t\x88\x04\x89\t\x89\x04\x8A\t\x8A\x04\x8B\t\x8B" +
		"\x04\x8C\t\x8C\x04\x8D\t\x8D\x04\x8E\t\x8E\x04\x8F\t\x8F\x04\x90\t\x90" +
		"\x04\x91\t\x91\x04\x92\t\x92\x04\x93\t\x93\x04\x94\t\x94\x04\x95\t\x95" +
		"\x04\x96\t\x96\x04\x97\t\x97\x04\x98\t\x98\x04\x99\t\x99\x04\x9A\t\x9A" +
		"\x04\x9B\t\x9B\x04\x9C\t\x9C\x04\x9D\t\x9D\x04\x9E\t\x9E\x04\x9F\t\x9F" +
		"\x04\xA0\t\xA0\x04\xA1\t\xA1\x04\xA2\t\xA2\x04\xA3\t\xA3\x04\xA4\t\xA4" +
		"\x04\xA5\t\xA5\x03\x02\x07\x02\u014C\n\x02\f\x02\x0E\x02\u014F\v\x02\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x05\x03\u01B5\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04" +
		"\u01BC\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\u01C4" +
		"\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\u01CA\n\x05\x03\x05\x03" +
		"\x05\x05\x05\u01CE\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x05\x06\u01D6\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05" +
		"\x06\u01DE\n\x06\x05\x06\u01E0\n\x06\x03\x07\x03\x07\x03\x07\x05\x07\u01E5" +
		"\n\x07\x03\b\x03\b\x03\b\x07\b\u01EA\n\b\f\b\x0E\b\u01ED\v\b\x03\t\x03" +
		"\t\x03\t\x05\t\u01F2\n\t\x03\n\x03\n\x03\n\x03\n\x05\n\u01F8\n\n\x03\n" +
		"\x05\n\u01FB\n\n\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v" +
		"\x03\v\x03\v\x05\v\u0208\n\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v" +
		"\u0210\n\v\x03\v\x03\v\x05\v\u0214\n\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03" +
		"\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v\u0224\n\v\x03" +
		"\f\x03\f\x05\f\u0228\n\f\x03\f\x05\f\u022B\n\f\x03\f\x05\f\u022E\n\f\x03" +
		"\f\x03\f\x05\f\u0232\n\f\x03\f\x05\f\u0235\n\f\x03\f\x03\f\x03\f\x03\f" +
		"\x03\f\x05\f\u023C\n\f\x03\f\x03\f\x05\f\u0240\n\f\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x05\r\u0249\n\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03" +
		"\x0E\x03\x0E\x03\x0E\x03\x0E\x05\x0E\u0253\n\x0E\x05\x0E\u0255\n\x0E\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x10\x03\x10\x05\x10\u025D\n\x10\x03\x10" +
		"\x05\x10\u0260\n\x10\x03\x10\x05\x10\u0263\n\x10\x03\x10\x05\x10\u0266" +
		"\n\x10\x03\x10\x03\x10\x05\x10\u026A\n\x10\x03\x10\x03\x10\x03\x10\x05" +
		"\x10\u026F\n\x10\x05\x10\u0271\n\x10\x03\x11\x03\x11\x03\x11\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x05\x12\u027B\n\x12\x03\x13\x03\x13\x05\x13" +
		"\u027F\n\x13\x03\x13\x03\x13\x03\x13\x05\x13\u0284\n\x13\x03\x13\x03\x13" +
		"\x05\x13\u0288\n\x13\x03\x13\x03\x13\x03\x13\x05\x13\u028D\n\x13\x03\x13" +
		"\x03\x13\x05\x13\u0291\n\x13\x03\x13\x03\x13\x05\x13\u0295\n\x13\x03\x13" +
		"\x03\x13\x03\x13\x05\x13\u029A\n\x13\x03\x13\x03\x13\x05\x13\u029E\n\x13" +
		"\x05\x13\u02A0\n\x13\x03\x14\x03\x14\x03\x14\x05\x14\u02A5\n\x14\x03\x14" +
		"\x03\x14\x03\x14\x03\x14\x05\x14\u02AB\n\x14\x03\x14\x03\x14\x03\x14\x05" +
		"\x14\u02B0\n\x14\x03\x14\x03\x14\x03\x14\x05\x14\u02B5\n\x14\x03\x14\x03" +
		"\x14\x05\x14\u02B9\n\x14\x03\x15\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16" +
		"\x03\x16\x05\x16\u02C2\n\x16\x03\x16\x03\x16\x05\x16\u02C6\n\x16\x03\x16" +
		"\x05\x16\u02C9\n\x16\x03\x17\x05\x17\u02CC\n\x17\x03\x17\x05\x17\u02CF" +
		"\n\x17\x03\x17\x05\x17\u02D2\n\x17\x03\x17\x03\x17\x03\x17\x05\x17\u02D7" +
		"\n\x17\x03\x18\x05\x18\u02DA\n\x18\x03\x18\x03\x18\x03\x18\x03\x18\x05" +
		"\x18\u02E0\n\x18\x03\x18\x03\x18\x03\x18\x03\x18\x05\x18\u02E6\n\x18\x07" +
		"\x18\u02E8\n\x18\f\x18\x0E\x18\u02EB\v\x18\x03\x18\x05\x18\u02EE\n\x18" +
		"\x03\x18\x05\x18\u02F1\n\x18\x03\x18\x03\x18\x03\x18\x03\x18\x03\x18\x05" +
		"\x18\u02F8\n\x18\x03\x18\x03\x18\x03\x18\x03\x18\x05\x18\u02FE\n\x18\x07" +
		"\x18\u0300\n\x18\f\x18\x0E\x18\u0303\v\x18\x03\x18\x05\x18\u0306\n\x18" +
		"\x05\x18\u0308\n\x18\x03\x19\x05\x19\u030B\n\x19\x03\x19\x07\x19\u030E" +
		"\n\x19\f\x19\x0E\x19\u0311\v\x19\x03\x19\x03\x19\x03\x19\x03\x19\x05\x19" +
		"\u0317\n\x19\x03\x19\x03\x19\x05\x19\u031B\n\x19\x03\x1A\x05\x1A\u031E" +
		"\n\x1A\x03\x1A\x05\x1A\u0321\n\x1A\x03\x1A\x07\x1A\u0324\n\x1A\f\x1A\x0E" +
		"\x1A\u0327\v\x1A\x03\x1A\x03\x1A\x05\x1A\u032B\n\x1A\x03\x1A\x05\x1A\u032E" +
		"\n\x1A\x03\x1A\x05\x1A\u0331\n\x1A\x03\x1A\x05\x1A\u0334\n\x1A\x03\x1A" +
		"\x03\x1A\x05\x1A\u0338\n\x1A\x03\x1B\x05\x1B\u033B\n\x1B\x03\x1B\x07\x1B" +
		"\u033E\n\x1B\f\x1B\x0E\x1B\u0341\v\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B" +
		"\x05\x1B\u0347\n\x1B\x03\x1B\x03\x1B\x05\x1B\u034B\n\x1B\x03\x1C\x05\x1C" +
		"\u034E\n\x1C\x03\x1C\x07\x1C\u0351\n\x1C\f\x1C\x0E\x1C\u0354\v\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x05\x1C\u0359\n\x1C\x03\x1C\x05\x1C\u035C\n\x1C\x03" +
		"\x1C\x05\x1C\u035F\n\x1C\x03\x1C\x03\x1C\x05\x1C\u0363\n\x1C\x03\x1D\x03" +
		"\x1D\x05\x1D\u0367\n\x1D\x03\x1D\x03\x1D\x05\x1D\u036B\n\x1D\x03\x1D\x05" +
		"\x1D\u036E\n\x1D\x03\x1D\x05\x1D\u0371\n\x1D\x03\x1D\x03\x1D\x03\x1D\x03" +
		"\x1D\x03\x1D\x05\x1D\u0378\n\x1D\x05\x1D\u037A\n\x1D\x03\x1E\x03\x1E\x03" +
		"\x1E\x03\x1E\x05\x1E\u0380\n\x1E\x03\x1E\x05\x1E\u0383\n\x1E\x03\x1E\x05" +
		"\x1E\u0386\n\x1E\x03\x1E\x03\x1E\x05\x1E\u038A\n\x1E\x03\x1F\x03\x1F\x05" +
		"\x1F\u038E\n\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0393\n\x1F\x05\x1F\u0395" +
		"\n\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u039B\n\x1F\x03\x1F\x03" +
		"\x1F\x05\x1F\u039F\n\x1F\x03\x1F\x05\x1F\u03A2\n\x1F\x03\x1F\x05\x1F\u03A5" +
		"\n\x1F\x05\x1F\u03A7\n\x1F\x03 \x03 \x05 \u03AB\n \x03 \x03 \x03 \x03" +
		" \x05 \u03B1\n \x03 \x03 \x03 \x05 \u03B6\n \x05 \u03B8\n \x03!\x03!\x03" +
		"!\x03!\x05!\u03BE\n!\x03!\x03!\x03!\x03!\x05!\u03C4\n!\x03!\x03!\x05!" +
		"\u03C8\n!\x03\"\x03\"\x03\"\x03\"\x05\"\u03CE\n\"\x03\"\x03\"\x05\"\u03D2" +
		"\n\"\x03\"\x03\"\x05\"\u03D6\n\"\x03\"\x05\"\u03D9\n\"\x03\"\x03\"\x03" +
		"\"\x03\"\x05\"\u03DF\n\"\x05\"\u03E1\n\"\x03#\x03#\x03#\x03#\x03#\x05" +
		"#\u03E8\n#\x03#\x03#\x03#\x03#\x03#\x03#\x05#\u03F0\n#\x03#\x03#\x03#" +
		"\x03#\x03#\x03#\x05#\u03F8\n#\x05#\u03FA\n#\x03$\x05$\u03FD\n$\x03$\x07" +
		"$\u0400\n$\f$\x0E$\u0403\v$\x03$\x03$\x03$\x03$\x05$\u0409\n$\x03$\x03" +
		"$\x05$\u040D\n$\x03%\x05%\u0410\n%\x03%\x07%\u0413\n%\f%\x0E%\u0416\v" +
		"%\x03%\x03%\x03%\x05%\u041B\n%\x03%\x05%\u041E\n%\x03%\x05%\u0421\n%\x03" +
		"%\x07%\u0424\n%\f%\x0E%\u0427\v%\x03%\x03%\x05%\u042B\n%\x03&\x05&\u042E" +
		"\n&\x03&\x07&\u0431\n&\f&\x0E&\u0434\v&\x03&\x03&\x03&\x03&\x05&\u043A" +
		"\n&\x03&\x03&\x05&\u043E\n&\x03\'\x05\'\u0441\n\'\x03\'\x07\'\u0444\n" +
		"\'\f\'\x0E\'\u0447\v\'\x03\'\x03\'\x03\'\x03\'\x05\'\u044D\n\'\x03\'\x03" +
		"\'\x03\'\x05\'\u0452\n\'\x03\'\x07\'\u0455\n\'\f\'\x0E\'\u0458\v\'\x03" +
		"\'\x03\'\x03\'\x03\'\x05\'\u045E\n\'\x03(\x05(\u0461\n(\x03(\x07(\u0464" +
		"\n(\f(\x0E(\u0467\v(\x03(\x03(\x03(\x03(\x05(\u046D\n(\x03(\x03(\x05(" +
		"\u0471\n(\x03)\x05)\u0474\n)\x03)\x07)\u0477\n)\f)\x0E)\u047A\v)\x03)" +
		"\x03)\x05)\u047E\n)\x03)\x03)\x05)\u0482\n)\x03)\x05)\u0485\n)\x03)\x05" +
		")\u0488\n)\x03)\x03)\x05)\u048C\n)\x03*\x05*\u048F\n*\x03*\x07*\u0492" +
		"\n*\f*\x0E*\u0495\v*\x03*\x03*\x03*\x03*\x03*\x05*\u049C\n*\x03*\x03*" +
		"\x05*\u04A0\n*\x03+\x05+\u04A3\n+\x03+\x07+\u04A6\n+\f+\x0E+\u04A9\v+" +
		"\x03+\x03+\x03+\x03+\x05+\u04AF\n+\x03+\x05+\u04B2\n+\x03+\x05+\u04B5" +
		"\n+\x03+\x03+\x05+\u04B9\n+\x03,\x05,\u04BC\n,\x03,\x07,\u04BF\n,\f,\x0E" +
		",\u04C2\v,\x03,\x03,\x03,\x03,\x05,\u04C8\n,\x03,\x03,\x05,\u04CC\n,\x03" +
		"-\x05-\u04CF\n-\x03-\x07-\u04D2\n-\f-\x0E-\u04D5\v-\x03-\x03-\x05-\u04D9" +
		"\n-\x03-\x05-\u04DC\n-\x03-\x05-\u04DF\n-\x03-\x05-\u04E2\n-\x03-\x03" +
		"-\x05-\u04E6\n-\x03.\x05.\u04E9\n.\x03.\x07.\u04EC\n.\f.\x0E.\u04EF\v" +
		".\x03.\x03.\x03.\x03.\x05.\u04F5\n.\x03.\x05.\u04F8\n.\x03.\x03.\x05." +
		"\u04FC\n.\x03/\x05/\u04FF\n/\x03/\x05/\u0502\n/\x03/\x07/\u0505\n/\f/" +
		"\x0E/\u0508\v/\x03/\x03/\x03/\x05/\u050D\n/\x03/\x05/\u0510\n/\x03/\x05" +
		"/\u0513\n/\x03/\x05/\u0516\n/\x03/\x03/\x05/\u051A\n/\x030\x030\x030\x03" +
		"0\x030\x030\x050\u0522\n0\x031\x051\u0525\n1\x031\x071\u0528\n1\f1\x0E" +
		"1\u052B\v1\x031\x031\x031\x031\x051\u0531\n1\x031\x031\x051\u0535\n1\x03" +
		"2\x052\u0538\n2\x032\x072\u053B\n2\f2\x0E2\u053E\v2\x032\x032\x032\x03" +
		"2\x032\x052\u0545\n2\x032\x052\u0548\n2\x032\x052\u054B\n2\x032\x032\x05" +
		"2\u054F\n2\x032\x052\u0552\n2\x032\x072\u0555\n2\f2\x0E2\u0558\v2\x03" +
		"2\x032\x032\x032\x052\u055E\n2\x032\x052\u0561\n2\x032\x052\u0564\n2\x03" +
		"2\x032\x052\u0568\n2\x052\u056A\n2\x033\x053\u056D\n3\x033\x073\u0570" +
		"\n3\f3\x0E3\u0573\v3\x033\x033\x033\x033\x053\u0579\n3\x033\x033\x053" +
		"\u057D\n3\x034\x054\u0580\n4\x034\x074\u0583\n4\f4\x0E4\u0586\v4\x034" +
		"\x054\u0589\n4\x034\x034\x054\u058D\n4\x034\x054\u0590\n4\x034\x054\u0593" +
		"\n4\x034\x054\u0596\n4\x034\x034\x054\u059A\n4\x035\x055\u059D\n5\x03" +
		"5\x075\u05A0\n5\f5\x0E5\u05A3\v5\x035\x035\x035\x035\x055\u05A9\n5\x03" +
		"5\x035\x055\u05AD\n5\x036\x056\u05B0\n6\x036\x076\u05B3\n6\f6\x0E6\u05B6" +
		"\v6\x036\x036\x036\x056\u05BB\n6\x036\x056\u05BE\n6\x036\x056\u05C1\n" +
		"6\x036\x036\x036\x056\u05C6\n6\x037\x057\u05C9\n7\x037\x077\u05CC\n7\f" +
		"7\x0E7\u05CF\v7\x037\x037\x037\x037\x057\u05D5\n7\x037\x037\x057\u05D9" +
		"\n7\x038\x058\u05DC\n8\x038\x078\u05DF\n8\f8\x0E8\u05E2\v8\x038\x038\x03" +
		"8\x058\u05E7\n8\x038\x058\u05EA\n8\x038\x058\u05ED\n8\x038\x038\x038\x05" +
		"8\u05F2\n8\x039\x069\u05F5\n9\r9\x0E9\u05F6\x03:\x05:\u05FA\n:\x03:\x07" +
		":\u05FD\n:\f:\x0E:\u0600\v:\x03:\x03:\x03:\x03:\x05:\u0606\n:\x03:\x03" +
		":\x05:\u060A\n:\x03;\x05;\u060D\n;\x03;\x07;\u0610\n;\f;\x0E;\u0613\v" +
		";\x03;\x05;\u0616\n;\x03;\x05;\u0619\n;\x03;\x03;\x05;\u061D\n;\x03;\x03" +
		";\x03;\x05;\u0622\n;\x03;\x05;\u0625\n;\x03;\x05;\u0628\n;\x03;\x05;\u062B" +
		"\n;\x03;\x05;\u062E\n;\x03;\x03;\x05;\u0632\n;\x03<\x05<\u0635\n<\x03" +
		"<\x07<\u0638\n<\f<\x0E<\u063B\v<\x03<\x03<\x03<\x05<\u0640\n<\x03<\x03" +
		"<\x05<\u0644\n<\x03=\x05=\u0647\n=\x03=\x03=\x03=\x03=\x05=\u064D\n=\x03" +
		"=\x03=\x05=\u0651\n=\x03>\x05>\u0654\n>\x03>\x03>\x03>\x05>\u0659\n>\x03" +
		">\x03>\x05>\u065D\n>\x03?\x05?\u0660\n?\x03?\x03?\x03?\x05?\u0665\n?\x03" +
		"?\x03?\x05?\u0669\n?\x03@\x05@\u066C\n@\x03@\x03@\x03@\x05@\u0671\n@\x03" +
		"@\x05@\u0674\n@\x03@\x03@\x05@\u0678\n@\x03A\x05A\u067B\nA\x03A\x07A\u067E" +
		"\nA\fA\x0EA\u0681\vA\x03A\x03A\x03A\x03A\x05A\u0687\nA\x03A\x03A\x05A" +
		"\u068B\nA\x03B\x05B\u068E\nB\x03B\x07B\u0691\nB\fB\x0EB\u0694\vB\x03B" +
		"\x03B\x03B\x05B\u0699\nB\x03B\x05B\u069C\nB\x03B\x05B\u069F\nB\x03B\x05" +
		"B\u06A2\nB\x03B\x03B\x05B\u06A6\nB\x03C\x05C\u06A9\nC\x03C\x07C\u06AC" +
		"\nC\fC\x0EC\u06AF\vC\x03C\x03C\x03C\x03C\x05C\u06B5\nC\x03C\x03C\x05C" +
		"\u06B9\nC\x03D\x05D\u06BC\nD\x03D\x07D\u06BF\nD\fD\x0ED\u06C2\vD\x03D" +
		"\x03D\x03D\x05D\u06C7\nD\x03D\x05D\u06CA\nD\x03D\x05D\u06CD\nD\x03D\x03" +
		"D\x05D\u06D1\nD\x03E\x05E\u06D4\nE\x03E\x07E\u06D7\nE\fE\x0EE\u06DA\v" +
		"E\x03E\x03E\x03E\x03E\x05E\u06E0\nE\x03E\x03E\x05E\u06E4\nE\x03F\x05F" +
		"\u06E7\nF\x03F\x07F\u06EA\nF\fF\x0EF\u06ED\vF\x03F\x03F\x03F\x05F\u06F2" +
		"\nF\x03F\x05F\u06F5\nF\x03F\x05F\u06F8\nF\x03F\x03F\x05F\u06FC\nF\x03" +
		"G\x05G\u06FF\nG\x03G\x03G\x03G\x05G\u0704\nG\x03G\x05G\u0707\nG\x03G\x05" +
		"G\u070A\nG\x03G\x03G\x05G\u070E\nG\x03H\x05H\u0711\nH\x03H\x03H\x05H\u0715" +
		"\nH\x03H\x05H\u0718\nH\x03H\x05H\u071B\nH\x03H\x05H\u071E\nH\x03H\x03" +
		"H\x05H\u0722\nH\x03I\x05I\u0725\nI\x03I\x03I\x03I\x05I\u072A\nI\x03I\x05" +
		"I\u072D\nI\x03I\x05I\u0730\nI\x03I\x03I\x05I\u0734\nI\x03J\x03J\x03J\x03" +
		"J\x03J\x03J\x05J\u073C\nJ\x05J\u073E\nJ\x03K\x03K\x07K\u0742\nK\fK\x0E" +
		"K\u0745\vK\x03K\x03K\x03L\x05L\u074A\nL\x03L\x07L\u074D\nL\fL\x0EL\u0750" +
		"\vL\x03L\x03L\x03L\x03L\x05L\u0756\nL\x03L\x05L\u0759\nL\x03M\x05M\u075C" +
		"\nM\x03M\x07M\u075F\nM\fM\x0EM\u0762\vM\x03M\x03M\x03M\x05M\u0767\nM\x03" +
		"M\x05M\u076A\nM\x03M\x05M\u076D\nM\x03M\x05M\u0770\nM\x03N\x03N\x07N\u0774" +
		"\nN\fN\x0EN\u0777\vN\x03N\x03N\x03O\x03O\x05O\u077D\nO\x03P\x03P\x03P" +
		"\x03P\x05P\u0783\nP\x03Q\x05Q\u0786\nQ\x03Q\x07Q\u0789\nQ\fQ\x0EQ\u078C" +
		"\vQ\x03Q\x03Q\x03Q\x03Q\x05Q\u0792\nQ\x03Q\x05Q\u0795\nQ\x03R\x05R\u0798" +
		"\nR\x03R\x07R\u079B\nR\fR\x0ER\u079E\vR\x03R\x03R\x03R\x05R\u07A3\nR\x03" +
		"R\x05R\u07A6\nR\x03R\x05R\u07A9\nR\x03R\x05R\u07AC\nR\x03S\x03S\x07S\u07B0" +
		"\nS\fS\x0ES\u07B3\vS\x03S\x03S\x03T\x03T\x03T\x03T\x05T\u07BB\nT\x03U" +
		"\x03U\x03U\x03U\x07U\u07C1\nU\fU\x0EU\u07C4\vU\x03U\x05U\u07C7\nU\x03" +
		"V\x03V\x03V\x07V\u07CC\nV\fV\x0EV\u07CF\vV\x03V\x03V\x03V\x03V\x03V\x03" +
		"V\x07V\u07D7\nV\fV\x0EV\u07DA\vV\x03V\x03V\x03V\x03V\x05V\u07E0\nV\x03" +
		"W\x05W\u07E3\nW\x03W\x07W\u07E6\nW\fW\x0EW\u07E9\vW\x03W\x03W\x03W\x03" +
		"W\x05W\u07EF\nW\x03W\x05W\u07F2\nW\x03X\x05X\u07F5\nX\x03X\x07X\u07F8" +
		"\nX\fX\x0EX\u07FB\vX\x03X\x03X\x03X\x05X\u0800\nX\x03X\x05X\u0803\nX\x03" +
		"X\x05X\u0806\nX\x03X\x05X\u0809\nX\x03Y\x05Y\u080C\nY\x03Y\x07Y\u080F" +
		"\nY\fY\x0EY\u0812\vY\x03Y\x03Y\x03Y\x03Y\x05Y\u0818\nY\x03Y\x05Y\u081B" +
		"\nY\x03Z\x05Z\u081E\nZ\x03Z\x07Z\u0821\nZ\fZ\x0EZ\u0824\vZ\x03Z\x03Z\x03" +
		"Z\x05Z\u0829\nZ\x03Z\x05Z\u082C\nZ\x03Z\x05Z\u082F\nZ\x03Z\x05Z\u0832" +
		"\nZ\x03[\x05[\u0835\n[\x03[\x07[\u0838\n[\f[\x0E[\u083B\v[\x03[\x03[\x03" +
		"[\x03[\x05[\u0841\n[\x03[\x05[\u0844\n[\x03\\\x05\\\u0847\n\\\x03\\\x07" +
		"\\\u084A\n\\\f\\\x0E\\\u084D\v\\\x03\\\x03\\\x03\\\x05\\\u0852\n\\\x03" +
		"\\\x05\\\u0855\n\\\x03\\\x05\\\u0858\n\\\x03\\\x05\\\u085B\n\\\x03]\x05" +
		"]\u085E\n]\x03]\x07]\u0861\n]\f]\x0E]\u0864\v]\x03]\x03]\x03]\x03]\x05" +
		"]\u086A\n]\x03]\x05]\u086D\n]\x03^\x05^\u0870\n^\x03^\x07^\u0873\n^\f" +
		"^\x0E^\u0876\v^\x03^\x03^\x03^\x05^\u087B\n^\x03^\x05^\u087E\n^\x03^\x05" +
		"^\u0881\n^\x03^\x05^\u0884\n^\x03_\x05_\u0887\n_\x03_\x07_\u088A\n_\f" +
		"_\x0E_\u088D\v_\x03_\x03_\x03_\x03_\x03_\x03_\x05_\u0895\n_\x03_\x03_" +
		"\x05_\u0899\n_\x03_\x05_\u089C\n_\x03`\x05`\u089F\n`\x03`\x07`\u08A2\n" +
		"`\f`\x0E`\u08A5\v`\x03`\x03`\x03`\x05`\u08AA\n`\x03`\x05`\u08AD\n`\x03" +
		"`\x05`\u08B0\n`\x03`\x05`\u08B3\n`\x03a\x03a\x03a\x03a\x05a\u08B9\na\x03" +
		"a\x03a\x05a\u08BD\na\x03b\x05b\u08C0\nb\x03b\x03b\x03b\x05b\u08C5\nb\x03" +
		"b\x05b\u08C8\nb\x03b\x05b\u08CB\nb\x03b\x05b\u08CE\nb\x03c\x05c\u08D1" +
		"\nc\x03c";
	private static readonly _serializedATNSegment1: string =
		"\x03c\x05c\u08D5\nc\x03c\x03c\x05c\u08D9\nc\x03d\x05d\u08DC\nd\x03d\x03" +
		"d\x03d\x03d\x05d\u08E2\nd\x03d\x05d\u08E5\nd\x03e\x05e\u08E8\ne\x03e\x03" +
		"e\x03e\x05e\u08ED\ne\x03e\x05e\u08F0\ne\x03f\x05f\u08F3\nf\x03f\x07f\u08F6" +
		"\nf\ff\x0Ef\u08F9\vf\x03f\x03f\x03f\x03f\x05f\u08FF\nf\x03f\x05f\u0902" +
		"\nf\x03g\x05g\u0905\ng\x03g\x07g\u0908\ng\fg\x0Eg\u090B\vg\x03g\x03g\x03" +
		"g\x05g\u0910\ng\x03g\x05g\u0913\ng\x03g\x05g\u0916\ng\x03g\x05g\u0919" +
		"\ng\x03h\x05h\u091C\nh\x03h\x07h\u091F\nh\fh\x0Eh\u0922\vh\x03h\x03h\x03" +
		"h\x05h\u0927\nh\x03h\x05h\u092A\nh\x03h\x05h\u092D\nh\x03h\x05h\u0930" +
		"\nh\x03i\x05i\u0933\ni\x03i\x07i\u0936\ni\fi\x0Ei\u0939\vi\x03i\x03i\x03" +
		"i\x03i\x03i\x03i\x03i\x05i\u0942\ni\x03i\x07i\u0945\ni\fi\x0Ei\u0948\v" +
		"i\x03i\x03i\x03i\x03i\x05i\u094E\ni\x03i\x05i\u0951\ni\x03i\x07i\u0954" +
		"\ni\fi\x0Ei\u0957\vi\x03i\x03i\x05i\u095B\ni\x03i\x03i\x03i\x05i\u0960" +
		"\ni\x03i\x03i\x03i\x03i\x03i\x05i\u0967\ni\x05i\u0969\ni\x03j\x03j\x03" +
		"j\x03j\x03j\x03j\x03j\x03j\x03j\x05j\u0974\nj\x03k\x05k\u0977\nk\x03k" +
		"\x07k\u097A\nk\fk\x0Ek\u097D\vk\x03k\x03k\x03k\x05k\u0982\nk\x03k\x05" +
		"k\u0985\nk\x03k\x05k\u0988\nk\x03k\x05k\u098B\nk\x03l\x05l\u098E\nl\x03" +
		"l\x07l\u0991\nl\fl\x0El\u0994\vl\x03l\x03l\x03l\x05l\u0999\nl\x03l\x05" +
		"l\u099C\nl\x03l\x05l\u099F\nl\x03l\x07l\u09A2\nl\fl\x0El\u09A5\vl\x03" +
		"l\x05l\u09A8\nl\x03m\x05m\u09AB\nm\x03m\x07m\u09AE\nm\fm\x0Em\u09B1\v" +
		"m\x03m\x03m\x03m\x05m\u09B6\nm\x03n\x05n\u09B9\nn\x03n\x07n\u09BC\nn\f" +
		"n\x0En\u09BF\vn\x03n\x03n\x05n\u09C3\nn\x03n\x05n\u09C6\nn\x03o\x05o\u09C9" +
		"\no\x03o\x07o\u09CC\no\fo\x0Eo\u09CF\vo\x03o\x03o\x03o\x05o\u09D4\no\x03" +
		"o\x05o\u09D7\no\x03o\x05o\u09DA\no\x03o\x03o\x05o\u09DE\no\x03o\x05o\u09E1" +
		"\no\x03o\x07o\u09E4\no\fo\x0Eo\u09E7\vo\x03o\x03o\x05o\u09EB\no\x03o\x03" +
		"o\x05o\u09EF\no\x03o\x05o\u09F2\no\x03o\x05o\u09F5\no\x03o\x03o\x05o\u09F9" +
		"\no\x05o\u09FB\no\x03p\x05p\u09FE\np\x03p\x03p\x05p\u0A02\np\x03p\x05" +
		"p\u0A05\np\x03p\x05p\u0A08\np\x03p\x05p\u0A0B\np\x03p\x03p\x05p\u0A0F" +
		"\np\x03q\x05q\u0A12\nq\x03q\x07q\u0A15\nq\fq\x0Eq\u0A18\vq\x03q\x03q\x03" +
		"q\x05q\u0A1D\nq\x03q\x05q\u0A20\nq\x03q\x05q\u0A23\nq\x03r\x03r\x05r\u0A27" +
		"\nr\x03r\x03r\x05r\u0A2B\nr\x03s\x03s\x03s\x07s\u0A30\ns\fs\x0Es\u0A33" +
		"\vs\x03t\x05t\u0A36\nt\x03t\x05t\u0A39\nt\x03t\x03t\x05t\u0A3D\nt\x03" +
		"t\x05t\u0A40\nt\x03t\x03t\x05t\u0A44\nt\x03u\x03u\x03v\x03v\x03v\x03v" +
		"\x03v\x03v\x03v\x03v\x05v\u0A50\nv\x03v\x05v\u0A53\nv\x03v\x03v\x05v\u0A57" +
		"\nv\x03w\x03w\x03x\x03x\x03y\x03y\x05y\u0A5F\ny\x03y\x03y\x05y\u0A63\n" +
		"y\x03z\x03z\x03z\x03z\x03{\x03{\x03{\x07{\u0A6C\n{\f{\x0E{\u0A6F\v{\x03" +
		"|\x03|\x03|\x03|\x07|\u0A75\n|\f|\x0E|\u0A78\v|\x03|\x03|\x03|\x03|\x07" +
		"|\u0A7E\n|\f|\x0E|\u0A81\v|\x03|\x03|\x03|\x03|\x07|\u0A87\n|\f|\x0E|" +
		"\u0A8A\v|\x03|\x03|\x03|\x03|\x07|\u0A90\n|\f|\x0E|\u0A93\v|\x03|\x03" +
		"|\x03|\x03|\x07|\u0A99\n|\f|\x0E|\u0A9C\v|\x03|\x03|\x03|\x03|\x07|\u0AA2" +
		"\n|\f|\x0E|\u0AA5\v|\x05|\u0AA7\n|\x03}\x03}\x03}\x03}\x07}\u0AAD\n}\f" +
		"}\x0E}\u0AB0\v}\x03~\x03~\x03\x7F\x03\x7F\x03\x7F\x05\x7F\u0AB7\n\x7F" +
		"\x03\x80\x03\x80\x03\x80\x05\x80\u0ABC\n\x80\x03\x81\x03\x81\x07\x81\u0AC0" +
		"\n\x81\f\x81\x0E\x81\u0AC3\v\x81\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81" +
		"\x05\x81\u0ACA\n\x81\x03\x82\x03\x82\x03\x82\x03\x82\x05\x82\u0AD0\n\x82" +
		"\x03\x83\x03\x83\x03\x83\x05\x83\u0AD5\n\x83\x03\x83\x05\x83\u0AD8\n\x83" +
		"\x03\x84\x03\x84\x05\x84\u0ADC\n\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03" +
		"\x84\x03\x84\x05\x84\u0AE4\n\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84" +
		"\x03\x84\x05\x84\u0AEC\n\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x05" +
		"\x84\u0AF3\n\x84\x05\x84\u0AF5\n\x84\x03\x85\x03\x85\x03\x86\x03\x86\x03" +
		"\x86\x03\x86\x03\x86\x03\x86\x05\x86\u0AFF\n\x86\x03\x87\x03\x87\x03\x87" +
		"\x07\x87\u0B04\n\x87\f\x87\x0E\x87\u0B07\v\x87\x03\x88\x03\x88\x03\x88" +
		"\x07\x88\u0B0C\n\x88\f\x88\x0E\x88\u0B0F\v\x88\x03\x89\x03\x89\x03\x89" +
		"\x07\x89\u0B14\n\x89\f\x89\x0E\x89\u0B17\v\x89\x03\x8A\x03\x8A\x03\x8A" +
		"\x07\x8A\u0B1C\n\x8A\f\x8A\x0E\x8A\u0B1F\v\x8A\x03\x8B\x03\x8B\x03\x8B" +
		"\x07\x8B\u0B24\n\x8B\f\x8B\x0E\x8B\u0B27\v\x8B\x03\x8C\x03\x8C\x03\x8C" +
		"\x07\x8C\u0B2C\n\x8C\f\x8C\x0E\x8C\u0B2F\v\x8C\x03\x8D\x03\x8D\x03\x8D" +
		"\x07\x8D\u0B34\n\x8D\f\x8D\x0E\x8D\u0B37\v\x8D\x03\x8E\x03\x8E\x03\x8E" +
		"\x07\x8E\u0B3C\n\x8E\f\x8E\x0E\x8E\u0B3F\v\x8E\x03\x8F\x03\x8F\x03\x8F" +
		"\x07\x8F\u0B44\n\x8F\f\x8F\x0E\x8F\u0B47\v\x8F\x03\x90\x03\x90\x03\x90" +
		"\x05\x90\u0B4C\n\x90\x03\x91\x03\x91\x07\x91\u0B50\n\x91\f\x91\x0E\x91" +
		"\u0B53\v\x91\x03\x92\x03\x92\x03\x92\x03\x92\x03\x92\x03\x92\x03\x92\x03" +
		"\x92\x05\x92\u0B5D\n\x92\x03\x92\x05\x92\u0B60\n\x92\x03\x93\x03\x93\x03" +
		"\x93\x03\x93\x05\x93\u0B66\n\x93\x03\x93\x03\x93\x03\x93\x03\x93\x05\x93" +
		"\u0B6C\n\x93\x03\x93\x03\x93\x05\x93\u0B70\n\x93\x03\x93\x03\x93\x03\x93" +
		"\x03\x93\x05\x93\u0B76\n\x93\x05\x93\u0B78\n\x93\x03\x94\x03\x94\x03\x94" +
		"\x07\x94\u0B7D\n\x94\f\x94\x0E\x94\u0B80\v\x94\x03\x95\x03\x95\x03\x95" +
		"\x03\x95\x03\x95\x05\x95\u0B87\n\x95\x03\x96\x03\x96\x03\x96\x07\x96\u0B8C" +
		"\n\x96\f\x96\x0E\x96\u0B8F\v\x96\x03\x97\x03\x97\x03\x97\x03\x97\x03\x97" +
		"\x05\x97\u0B96\n\x97\x03\x98\x03\x98\x03\x98\x03\x98\x03\x98\x05\x98\u0B9D" +
		"\n\x98\x03\x99\x03\x99\x03\x9A\x03\x9A\x03\x9B\x03\x9B\x03\x9C\x03\x9C" +
		"\x03\x9C\x07\x9C\u0BA8\n\x9C\f\x9C\x0E\x9C\u0BAB\v\x9C\x03\x9D\x03\x9D" +
		"\x03\x9D\x05\x9D\u0BB0\n\x9D\x03\x9E\x03\x9E\x03\x9E\x03\x9E\x03\x9F\x03" +
		"\x9F\x03\xA0\x03\xA0\x05\xA0\u0BBA\n\xA0\x03\xA0\x03\xA0\x05\xA0\u0BBE" +
		"\n\xA0\x03\xA0\x05\xA0\u0BC1\n\xA0\x03\xA0\x03\xA0\x05\xA0\u0BC5\n\xA0" +
		"\x03\xA0\x03\xA0\x05\xA0\u0BC9\n\xA0\x03\xA0\x03\xA0\x03\xA0\x05\xA0\u0BCE" +
		"\n\xA0\x03\xA0\x05\xA0\u0BD1\n\xA0\x03\xA0\x03\xA0\x05\xA0\u0BD5\n\xA0" +
		"\x03\xA0\x03\xA0\x05\xA0\u0BD9\n\xA0\x03\xA0\x03\xA0\x03\xA0\x03\xA0\x05" +
		"\xA0\u0BDF\n\xA0\x03\xA0\x03\xA0\x05\xA0\u0BE3\n\xA0\x03\xA0\x03\xA0\x03" +
		"\xA0\x05\xA0\u0BE8\n\xA0\x03\xA0\x05\xA0\u0BEB\n\xA0\x03\xA0\x03\xA0\x05" +
		"\xA0\u0BEF\n\xA0\x03\xA0\x05\xA0\u0BF2\n\xA0\x03\xA0\x03\xA0\x03\xA0\x05" +
		"\xA0\u0BF7\n\xA0\x03\xA0\x03\xA0\x05\xA0\u0BFB\n\xA0\x03\xA0\x03\xA0\x03" +
		"\xA0\x05\xA0\u0C00\n\xA0\x05\xA0\u0C02\n\xA0\x03\xA1\x03\xA1\x03\xA1\x03" +
		"\xA1\x03\xA1\x05\xA1\u0C09\n\xA1\x03\xA2\x03\xA2\x03\xA2\x03\xA2\x05\xA2" +
		"\u0C0F\n\xA2\x03\xA3\x03\xA3\x03\xA3\x03\xA3\x03\xA3\x05\xA3\u0C16\n\xA3" +
		"\x03\xA4\x03\xA4\x03\xA4\x03\xA5\x03\xA5\x03\xA5\x03\xA5\x05\xA5\u0C1F" +
		"\n\xA5\x03\xA5\x02\x02\x02\xA6\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02" +
		"\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02" +
		" \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02" +
		"<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02" +
		"X\x02Z\x02\\\x02^\x02`\x02b\x02d\x02f\x02h\x02j\x02l\x02n\x02p\x02r\x02" +
		"t\x02v\x02x\x02z\x02|\x02~\x02\x80\x02\x82\x02\x84\x02\x86\x02\x88\x02" +
		"\x8A\x02\x8C\x02\x8E\x02\x90\x02\x92\x02\x94\x02\x96\x02\x98\x02\x9A\x02" +
		"\x9C\x02\x9E\x02\xA0\x02\xA2\x02\xA4\x02\xA6\x02\xA8\x02\xAA\x02\xAC\x02" +
		"\xAE\x02\xB0\x02\xB2\x02\xB4\x02\xB6\x02\xB8\x02\xBA\x02\xBC\x02\xBE\x02" +
		"\xC0\x02\xC2\x02\xC4\x02\xC6\x02\xC8\x02\xCA\x02\xCC\x02\xCE\x02\xD0\x02" +
		"\xD2\x02\xD4\x02\xD6\x02\xD8\x02\xDA\x02\xDC\x02\xDE\x02\xE0\x02\xE2\x02" +
		"\xE4\x02\xE6\x02\xE8\x02\xEA\x02\xEC\x02\xEE\x02\xF0\x02\xF2\x02\xF4\x02" +
		"\xF6\x02\xF8\x02\xFA\x02\xFC\x02\xFE\x02\u0100\x02\u0102\x02\u0104\x02" +
		"\u0106\x02\u0108\x02\u010A\x02\u010C\x02\u010E\x02\u0110\x02\u0112\x02" +
		"\u0114\x02\u0116\x02\u0118\x02\u011A\x02\u011C\x02\u011E\x02\u0120\x02" +
		"\u0122\x02\u0124\x02\u0126\x02\u0128\x02\u012A\x02\u012C\x02\u012E\x02" +
		"\u0130\x02\u0132\x02\u0134\x02\u0136\x02\u0138\x02\u013A\x02\u013C\x02" +
		"\u013E\x02\u0140\x02\u0142\x02\u0144\x02\u0146\x02\u0148\x02\x02\x14\x04" +
		"\x02\x0E\x0ENN\x04\x02\x11\x11SS\x04\x02||~~\x04\x02\x87\x87\x99\x99\x04" +
		"\x02\x10\x10yy\x04\x02{{\x8D\x8D\x05\x02<<>>PP\x04\x02XXZ[\v\x02\x04\x04" +
		"##==GGOO\\\\llnnss\x04\x02GGOO\x03\x02\x83\x86\x06\x0299<<\x81\x82\x95" +
		"\x96\x03\x02\x97\x98\x03\x02\x99\x9B\x05\x02HH\x97\x98\x9F\x9F\x04\x02" +
		"00qq\x04\x02\xA1\xA1\xA4\xA4\x19\x02\x06\x06\v\v\r\r\x11\x11\x19\x1A\x1C" +
		"\x1D$$&&++114488?ADDFFKLSTVWYYaaijttwx\x02\u0E78\x02\u014D\x03\x02\x02" +
		"\x02\x04\u01B4\x03\x02\x02\x02\x06\u01B6\x03\x02\x02\x02\b\u01CD\x03\x02" +
		"\x02\x02\n\u01DF\x03\x02\x02\x02\f\u01E1\x03\x02\x02\x02\x0E\u01E6\x03" +
		"\x02\x02\x02\x10\u01F1\x03\x02\x02\x02\x12\u01F3\x03\x02\x02\x02\x14\u0223" +
		"\x03\x02\x02\x02\x16\u023F\x03\x02\x02\x02\x18\u0248\x03\x02\x02\x02\x1A" +
		"\u0254\x03\x02\x02\x02\x1C\u0256\x03\x02\x02\x02\x1E\u0270\x03\x02\x02" +
		"\x02 \u0272\x03\x02\x02\x02\"\u0275\x03\x02\x02\x02$\u029F\x03\x02\x02" +
		"\x02&\u02B8\x03\x02\x02\x02(\u02BA\x03\x02\x02\x02*\u02BD\x03\x02\x02" +
		"\x02,\u02CB\x03\x02\x02\x02.\u0307\x03\x02\x02\x020\u030A\x03\x02\x02" +
		"\x022\u031D\x03\x02\x02\x024\u033A\x03\x02\x02\x026\u034D\x03\x02\x02" +
		"\x028\u0379\x03\x02\x02\x02:\u037B\x03\x02\x02\x02<\u03A6\x03\x02\x02" +
		"\x02>\u03B7\x03\x02\x02\x02@\u03C7\x03\x02\x02\x02B\u03E0\x03\x02\x02" +
		"\x02D\u03F9\x03\x02\x02\x02F\u03FC\x03\x02\x02\x02H\u040F\x03\x02\x02" +
		"\x02J\u042D\x03\x02\x02\x02L\u045D\x03\x02\x02\x02N\u0460\x03\x02\x02" +
		"\x02P\u0473\x03\x02\x02\x02R\u048E\x03\x02\x02\x02T\u04A2\x03\x02\x02" +
		"\x02V\u04BB\x03\x02\x02\x02X\u04CE\x03\x02\x02\x02Z\u04E8\x03\x02\x02" +
		"\x02\\\u04FE\x03\x02\x02\x02^\u0521\x03\x02\x02\x02`\u0524\x03\x02\x02" +
		"\x02b\u0569\x03\x02\x02\x02d\u056C\x03\x02\x02\x02f\u057F\x03\x02\x02" +
		"\x02h\u059C\x03\x02\x02\x02j\u05AF\x03\x02\x02\x02l\u05C8\x03\x02\x02" +
		"\x02n\u05DB\x03\x02\x02\x02p\u05F4\x03\x02\x02\x02r\u05F9\x03\x02\x02" +
		"\x02t\u060C\x03\x02\x02\x02v\u0634\x03\x02\x02\x02x\u0646\x03\x02\x02" +
		"\x02z\u0653\x03\x02\x02\x02|\u065F\x03\x02\x02\x02~\u066B\x03\x02\x02" +
		"\x02\x80\u067A\x03\x02\x02\x02\x82\u068D\x03\x02\x02\x02\x84\u06A8\x03" +
		"\x02\x02\x02\x86\u06BB\x03\x02\x02\x02\x88\u06D3\x03\x02\x02\x02\x8A\u06E6" +
		"\x03\x02\x02\x02\x8C\u06FE\x03\x02\x02\x02\x8E\u0710\x03\x02\x02\x02\x90" +
		"\u0724\x03\x02\x02\x02\x92\u0735\x03\x02\x02\x02\x94\u073F\x03\x02\x02" +
		"\x02\x96\u0749\x03\x02\x02\x02\x98\u075B\x03\x02\x02\x02\x9A\u0771\x03" +
		"\x02\x02\x02\x9C\u077C\x03\x02\x02\x02\x9E\u077E\x03\x02\x02\x02\xA0\u0785" +
		"\x03\x02\x02\x02\xA2\u0797\x03\x02\x02\x02\xA4\u07AD\x03\x02\x02\x02\xA6" +
		"\u07BA\x03\x02\x02\x02\xA8\u07BC\x03\x02\x02\x02\xAA\u07DF\x03\x02\x02" +
		"\x02\xAC\u07E2\x03\x02\x02\x02\xAE\u07F4\x03\x02\x02\x02\xB0\u080B\x03" +
		"\x02\x02\x02\xB2\u081D\x03\x02\x02\x02\xB4\u0834\x03\x02\x02\x02\xB6\u0846" +
		"\x03\x02\x02\x02\xB8\u085D\x03\x02\x02\x02\xBA\u086F\x03\x02\x02\x02\xBC" +
		"\u0886\x03\x02\x02\x02\xBE\u089E\x03\x02\x02\x02\xC0\u08B4\x03\x02\x02" +
		"\x02\xC2\u08BF\x03\x02\x02\x02\xC4\u08D0\x03\x02\x02\x02\xC6\u08DB\x03" +
		"\x02\x02\x02\xC8\u08E7\x03\x02\x02\x02\xCA\u08F2\x03\x02\x02\x02\xCC\u0904" +
		"\x03\x02\x02\x02\xCE\u091B\x03\x02\x02\x02\xD0\u0968\x03\x02\x02\x02\xD2" +
		"\u0973\x03\x02\x02\x02\xD4\u0976\x03\x02\x02\x02\xD6\u098D\x03\x02\x02" +
		"\x02\xD8\u09AA\x03\x02\x02\x02\xDA\u09B8\x03\x02\x02\x02\xDC\u09FA\x03" +
		"\x02\x02\x02\xDE\u09FD\x03\x02\x02\x02\xE0\u0A11\x03\x02\x02\x02\xE2\u0A24" +
		"\x03\x02\x02\x02\xE4\u0A2C\x03\x02\x02\x02\xE6\u0A35\x03\x02\x02\x02\xE8" +
		"\u0A45\x03\x02\x02\x02\xEA\u0A56\x03\x02\x02\x02\xEC\u0A58\x03\x02\x02" +
		"\x02\xEE\u0A5A\x03\x02\x02\x02\xF0\u0A5C\x03\x02\x02\x02\xF2\u0A64\x03" +
		"\x02\x02\x02\xF4\u0A68\x03\x02\x02\x02\xF6\u0AA6\x03\x02\x02\x02\xF8\u0AA8" +
		"\x03\x02\x02\x02\xFA\u0AB1\x03\x02\x02\x02\xFC\u0AB3\x03\x02\x02\x02\xFE" +
		"\u0ABB\x03\x02\x02\x02\u0100\u0AC9\x03\x02\x02\x02\u0102\u0ACF\x03\x02" +
		"\x02\x02\u0104\u0AD1\x03\x02\x02\x02\u0106\u0AF4\x03\x02\x02\x02\u0108" +
		"\u0AF6\x03\x02\x02\x02\u010A\u0AF8\x03\x02\x02\x02\u010C\u0B00\x03\x02" +
		"\x02\x02\u010E\u0B08\x03\x02\x02\x02\u0110\u0B10\x03\x02\x02\x02\u0112" +
		"\u0B18\x03\x02\x02\x02\u0114\u0B20\x03\x02\x02\x02\u0116\u0B28\x03\x02" +
		"\x02\x02\u0118\u0B30\x03\x02\x02\x02\u011A\u0B38\x03\x02\x02\x02\u011C" +
		"\u0B40\x03\x02\x02\x02\u011E\u0B4B\x03\x02\x02\x02\u0120\u0B4D\x03\x02" +
		"\x02\x02\u0122\u0B5F\x03\x02\x02\x02\u0124\u0B77\x03\x02\x02\x02\u0126" +
		"\u0B79\x03\x02\x02\x02\u0128\u0B86\x03\x02\x02\x02\u012A\u0B88\x03\x02" +
		"\x02\x02\u012C\u0B95\x03\x02\x02\x02\u012E\u0B9C\x03\x02\x02\x02\u0130" +
		"\u0B9E\x03\x02\x02\x02\u0132\u0BA0\x03\x02\x02\x02\u0134\u0BA2\x03\x02" +
		"\x02\x02\u0136\u0BA4\x03\x02\x02\x02\u0138\u0BAF\x03\x02\x02\x02\u013A" +
		"\u0BB1\x03\x02\x02\x02\u013C\u0BB5\x03\x02\x02\x02\u013E\u0C01\x03\x02" +
		"\x02\x02\u0140\u0C08\x03\x02\x02\x02\u0142\u0C0E\x03\x02\x02\x02\u0144" +
		"\u0C15\x03\x02\x02\x02\u0146\u0C17\x03\x02\x02\x02\u0148\u0C1E\x03\x02" +
		"\x02\x02\u014A\u014C\x05\x04\x03\x02\u014B\u014A\x03\x02\x02\x02\u014C" +
		"\u014F\x03\x02\x02\x02\u014D\u014B\x03\x02\x02\x02\u014D\u014E\x03\x02" +
		"\x02\x02\u014E\u0150\x03\x02\x02\x02\u014F\u014D\x03\x02\x02\x02\u0150" +
		"\u0151\x07\x02\x02\x03\u0151\x03\x03\x02\x02\x02\u0152\u01B5\x05.\x18" +
		"\x02\u0153\u01B5\x05x=\x02\u0154\u01B5\x05z>\x02\u0155\u01B5\x05,\x17" +
		"\x02\u0156\u01B5\x05v<\x02\u0157\u01B5\x050\x19\x02\u0158\u01B5\x052\x1A" +
		"\x02\u0159\u01B5\x054\x1B\x02\u015A\u01B5\x056\x1C\x02\u015B\u01B5\x05" +
		"F$\x02\u015C\u01B5\x05H%\x02\u015D\u01B5\x05N(\x02\u015E\u01B5\x05P)\x02" +
		"\u015F\u01B5\x05R*\x02\u0160\u01B5\x05T+\x02\u0161\u01B5\x05V,\x02\u0162" +
		"\u01B5\x05X-\x02\u0163\u01B5\x05Z.\x02\u0164\u01B5\x05\\/\x02\u0165\u01B5" +
		"\x05`1\x02\u0166\u01B5\x05b2\x02\u0167\u01B5\x05d3\x02\u0168\u01B5\x05" +
		"f4\x02\u0169\u01B5\x05h5\x02\u016A\u01B5\x05j6\x02\u016B\u01B5\x05l7\x02" +
		"\u016C\u01B5\x05n8\x02\u016D\u01B5\x05r:\x02\u016E\u01B5\x05t;\x02\u016F" +
		"\u01B5\x05\x80A\x02\u0170\u01B5\x05\x82B\x02\u0171\u01B5\x05\x84C\x02" +
		"\u0172\u01B5\x05\x86D\x02\u0173\u01B5\x05\x88E\x02\u0174\u01B5\x05\x8A" +
		"F\x02\u0175\u01B5\x05\x96L\x02\u0176\u01B5\x05\x98M\x02\u0177\u01B5\x05" +
		"\xA0Q\x02\u0178\u01B5\x05\xA2R\x02\u0179\u01B5\x05\xACW\x02\u017A\u01B5" +
		"\x05\xAEX\x02\u017B\u01B5\x05\xB0Y\x02\u017C\u01B5\x05\xB2Z\x02\u017D" +
		"\u01B5\x05\xB4[\x02\u017E\u01B5\x05\xB6\\\x02\u017F\u01B5\x05\xB8]\x02" +
		"\u0180\u01B5\x05\xBA^\x02\u0181\u01B5\x05\xBC_\x02\u0182\u01B5\x05\xBE" +
		"`\x02\u0183\u01B5\x05\xC0a\x02\u0184\u01B5\x05\xC2b\x02\u0185\u01B5\x05" +
		"\xC4c\x02\u0186\u01B5\x05\xC6d\x02\u0187\u01B5\x05\xC8e\x02\u0188\u01B5" +
		"\x05\xCAf\x02\u0189\u01B5\x05\xCCg\x02\u018A\u01B5\x05\xCEh\x02\u018B" +
		"\u01B5\x05\xD0i\x02\u018C\u01B5\x05\xD4k\x02\u018D\u01B5\x05\xD6l\x02" +
		"\u018E\u01B5\x05\xD8m\x02\u018F\u01B5\x05\xDAn\x02\u0190\u01B5\x05\xDC" +
		"o\x02\u0191\u01B5\x05\xDEp\x02\u0192\u01B5\x05v<\x02\u0193\u01B5\x05\xE0" +
		"q\x02\u0194\u01B5\x05J&\x02\u0195\u01B5\x05L\'\x02\u0196\u01B5\x058\x1D" +
		"\x02\u0197\u01B5\x05:\x1E\x02\u0198\u01B5\x05<\x1F\x02\u0199\u01B5\x05" +
		"> \x02\u019A\u01B5\x05@!\x02\u019B\u01B5\x05B\"\x02\u019C\u01B5\x05D#" +
		"\x02\u019D\u01B5\x05\u013E\xA0\x02\u019E\u01B5\x05\x8CG\x02\u019F\u01B5" +
		"\x05\x8EH\x02\u01A0\u01B5\x05\x90I\x02\u01A1\u01B5\x05\x92J\x02\u01A2" +
		"\u01B5\x05\x1E\x10\x02\u01A3\u01B5\x05&\x14\x02\u01A4\u01B5\x05*\x16\x02" +
		"\u01A5\u01B5\x05\"\x12\x02\u01A6\u01B5\x05$\x13\x02\u01A7\u01B5\x05\x06" +
		"\x04\x02\u01A8\u01B5\x05\b\x05\x02\u01A9\u01B5\x05\n\x06\x02\u01AA\u01B5" +
		"\x05\x12\n\x02\u01AB\u01B5\x05\x14\v\x02\u01AC\u01B5\x05\x16\f\x02\u01AD" +
		"\u01B5\x05\x18\r\x02\u01AE\u01B5\x05\x9EP\x02\u01AF\u01B5\x05|?\x02\u01B0" +
		"\u01B5\x05~@\x02\u01B1\u01B5\x05\f\x07\x02\u01B2\u01B5\x05\x1A\x0E\x02" +
		"\u01B3\u01B5\x05\x1C\x0F\x02\u01B4\u0152\x03\x02\x02\x02\u01B4\u0153\x03" +
		"\x02\x02\x02\u01B4\u0154\x03\x02\x02\x02\u01B4\u0155\x03\x02\x02\x02\u01B4" +
		"\u0156\x03\x02\x02\x02\u01B4\u0157\x03\x02\x02\x02\u01B4\u0158\x03\x02" +
		"\x02\x02\u01B4\u0159\x03\x02\x02\x02\u01B4\u015A\x03\x02\x02\x02\u01B4" +
		"\u015B\x03\x02\x02\x02\u01B4\u015C\x03\x02\x02\x02\u01B4\u015D\x03\x02" +
		"\x02\x02\u01B4\u015E\x03\x02\x02\x02\u01B4\u015F\x03\x02\x02\x02\u01B4" +
		"\u0160\x03\x02\x02\x02\u01B4\u0161\x03\x02\x02\x02\u01B4\u0162\x03\x02" +
		"\x02\x02\u01B4\u0163\x03\x02\x02\x02\u01B4\u0164\x03\x02\x02\x02\u01B4" +
		"\u0165\x03\x02\x02\x02\u01B4\u0166\x03\x02\x02\x02\u01B4\u0167\x03\x02" +
		"\x02\x02\u01B4\u0168\x03\x02\x02\x02\u01B4\u0169\x03\x02\x02\x02\u01B4" +
		"\u016A\x03\x02\x02\x02\u01B4\u016B\x03\x02\x02\x02\u01B4\u016C\x03\x02" +
		"\x02\x02\u01B4\u016D\x03\x02\x02\x02\u01B4\u016E\x03\x02\x02\x02\u01B4" +
		"\u016F\x03\x02\x02\x02\u01B4\u0170\x03\x02\x02\x02\u01B4\u0171\x03\x02" +
		"\x02\x02\u01B4\u0172\x03\x02\x02\x02\u01B4\u0173\x03\x02\x02\x02\u01B4" +
		"\u0174\x03\x02\x02\x02\u01B4\u0175\x03\x02\x02\x02\u01B4\u0176\x03\x02" +
		"\x02\x02\u01B4\u0177\x03\x02\x02\x02\u01B4\u0178\x03\x02\x02\x02\u01B4" +
		"\u0179\x03\x02\x02\x02\u01B4\u017A\x03\x02\x02\x02\u01B4\u017B\x03\x02" +
		"\x02\x02\u01B4\u017C\x03\x02\x02\x02\u01B4\u017D\x03\x02\x02\x02\u01B4" +
		"\u017E\x03\x02\x02\x02\u01B4\u017F\x03\x02\x02\x02\u01B4\u0180\x03\x02" +
		"\x02\x02\u01B4\u0181\x03\x02\x02\x02\u01B4\u0182\x03\x02\x02\x02\u01B4" +
		"\u0183\x03\x02\x02\x02\u01B4\u0184\x03\x02\x02\x02\u01B4\u0185\x03\x02" +
		"\x02\x02\u01B4\u0186\x03\x02\x02\x02\u01B4\u0187\x03\x02\x02\x02\u01B4" +
		"\u0188\x03\x02\x02\x02\u01B4\u0189\x03\x02\x02\x02\u01B4\u018A\x03\x02" +
		"\x02\x02\u01B4\u018B\x03\x02\x02\x02\u01B4\u018C\x03\x02\x02\x02\u01B4" +
		"\u018D\x03\x02\x02\x02\u01B4\u018E\x03\x02\x02\x02\u01B4\u018F\x03\x02" +
		"\x02\x02\u01B4\u0190\x03\x02\x02\x02\u01B4\u0191\x03\x02\x02\x02\u01B4" +
		"\u0192\x03\x02\x02\x02\u01B4\u0193\x03\x02\x02\x02\u01B4\u0194\x03\x02" +
		"\x02\x02\u01B4\u0195\x03\x02\x02\x02\u01B4\u0196\x03\x02\x02\x02\u01B4" +
		"\u0197\x03\x02\x02\x02\u01B4\u0198\x03\x02\x02\x02\u01B4\u0199\x03\x02" +
		"\x02\x02\u01B4\u019A\x03\x02\x02\x02\u01B4\u019B\x03\x02\x02\x02\u01B4" +
		"\u019C\x03\x02\x02\x02\u01B4\u019D\x03\x02\x02\x02\u01B4\u019E\x03\x02" +
		"\x02\x02\u01B4\u019F\x03\x02\x02\x02\u01B4\u01A0\x03\x02\x02\x02\u01B4" +
		"\u01A1\x03\x02\x02\x02\u01B4\u01A2\x03\x02\x02\x02\u01B4\u01A3\x03\x02" +
		"\x02\x02\u01B4\u01A4\x03\x02\x02\x02\u01B4\u01A5\x03\x02\x02\x02\u01B4" +
		"\u01A6\x03\x02\x02\x02\u01B4\u01A7\x03\x02\x02\x02\u01B4\u01A8\x03\x02" +
		"\x02\x02\u01B4\u01A9\x03\x02\x02\x02\u01B4\u01AA\x03\x02\x02\x02\u01B4" +
		"\u01AB\x03\x02\x02\x02\u01B4\u01AC\x03\x02\x02\x02\u01B4\u01AD\x03\x02" +
		"\x02\x02\u01B4\u01AE\x03\x02\x02\x02\u01B4\u01AF\x03\x02\x02\x02\u01B4" +
		"\u01B0\x03\x02\x02\x02\u01B4\u01B1\x03\x02\x02\x02\u01B4\u01B2\x03\x02" +
		"\x02\x02\u01B4\u01B3\x03\x02\x02\x02\u01B5\x05\x03\x02\x02\x02\u01B6\u01B7" +
		"\x07\b\x02\x02\u01B7\u01B8\x05\u0138\x9D\x02\u01B8\u01B9\x075\x02\x02" +
		"\u01B9\u01BB\x05\u0136\x9C\x02\u01BA\u01BC\x07\x8B\x02\x02\u01BB\u01BA" +
		"\x03\x02\x02\x02\u01BB\u01BC\x03\x02\x02\x02\u01BC\x07\x03\x02\x02\x02" +
		"\u01BD\u01BE\x07c\x02\x02\u01BE\u01BF\x05\u0136\x9C\x02\u01BF\u01C0\x07" +
		"\x14\x02\x02\u01C0\u01C3\x05\u0136\x9C\x02\u01C1\u01C4\x05\u0100\x81\x02" +
		"\u01C2\u01C4\x07\x8B\x02\x02\u01C3\u01C1\x03\x02\x02\x02\u01C3\u01C2\x03" +
		"\x02\x02\x02\u01C3\u01C4\x03\x02\x02\x02\u01C4\u01CE\x03\x02\x02\x02\u01C5" +
		"\u01C6\x07c\x02\x02\u01C6\u01C7\x07a\x02\x02\u01C7\u01C9\x05\u0138\x9D" +
		"\x02\u01C8\u01CA\x05\xF0y\x02\u01C9\u01C8\x03\x02\x02\x02\u01C9\u01CA" +
		"\x03\x02\x02\x02\u01CA\u01CB\x03\x02\x02\x02\u01CB\u01CC\x07\x8B\x02\x02" +
		"\u01CC\u01CE\x03\x02\x02\x02\u01CD\u01BD\x03\x02\x02\x02\u01CD\u01C5\x03" +
		"\x02\x02\x02\u01CE\t\x03\x02\x02\x02\u01CF\u01D0\x07\"\x02\x02\u01D0\u01D1" +
		"\x077\x02\x02\u01D1\u01D2\x05\u0136\x9C\x02\u01D2\u01D3\x07o\x02\x02\u01D3" +
		"\u01D5\x05\u0136\x9C\x02\u01D4\u01D6\x07\x8B\x02\x02\u01D5\u01D4\x03\x02" +
		"\x02\x02\u01D5\u01D6\x03\x02\x02\x02\u01D6\u01E0\x03\x02\x02\x02\u01D7" +
		"\u01D8\x05 \x11\x02\u01D8\u01D9\x07\"\x02\x02\u01D9\u01DA\x05\u0138\x9D" +
		"\x02\u01DA\u01DB\x07o\x02\x02\u01DB\u01DD\x05\u0136\x9C\x02\u01DC\u01DE" +
		"\x07\x8B\x02\x02\u01DD\u01DC\x03\x02\x02\x02\u01DD\u01DE\x03\x02\x02\x02" +
		"\u01DE\u01E0\x03\x02\x02\x02\u01DF\u01CF\x03\x02\x02\x02\u01DF\u01D7\x03" +
		"\x02\x02\x02\u01E0\v\x03\x02\x02\x02\u01E1\u01E2\x072\x02\x02\u01E2\u01E4" +
		"\x05\x0E\b\x02\u01E3\u01E5\x07\x8B\x02\x02\u01E4\u01E3\x03\x02\x02\x02" +
		"\u01E4\u01E5\x03\x02\x02\x02\u01E5\r\x03\x02\x02\x02\u01E6\u01EB\x05\x10" +
		"\t\x02\u01E7\u01E8\t\x02\x02\x02\u01E8\u01EA\x05\x10\t\x02\u01E9\u01E7" +
		"\x03\x02\x02\x02\u01EA\u01ED\x03\x02\x02\x02\u01EB\u01E9\x03\x02\x02\x02" +
		"\u01EB\u01EC\x03\x02\x02\x02\u01EC";
	private static readonly _serializedATNSegment2: string =
		"\x0F\x03\x02\x02\x02\u01ED\u01EB\x03\x02\x02\x02\u01EE\u01EF\x07\x9D\x02" +
		"\x02\u01EF\u01F2\x05\u0136\x9C\x02\u01F0\u01F2\x05\u0136\x9C\x02\u01F1" +
		"\u01EE\x03\x02\x02\x02\u01F1\u01F0\x03\x02\x02\x02\u01F2\x11\x03\x02\x02" +
		"\x02\u01F3\u01F4\x073\x02\x02\u01F4\u01F7\x05\u0136\x9C\x02\u01F5\u01F6" +
		"\x07m\x02\x02\u01F6\u01F8\x05\u0136\x9C\x02\u01F7\u01F5\x03\x02\x02\x02" +
		"\u01F7\u01F8\x03\x02\x02\x02\u01F8\u01FA\x03\x02\x02\x02\u01F9\u01FB\x07" +
		"\x8B\x02\x02\u01FA\u01F9\x03\x02\x02\x02\u01FA\u01FB\x03\x02\x02\x02\u01FB" +
		"\x13\x03\x02\x02\x02\u01FC\u01FD\x07m\x02\x02\u01FD\u01FE\x07+\x02\x02" +
		"\u01FE\u01FF\x05\u0136\x9C\x02\u01FF\u0200\x07\x8B\x02\x02\u0200\u0224" +
		"\x03\x02\x02\x02\u0201\u0202\x07m\x02\x02\u0202\u0203\x07\x06\x02\x02" +
		"\u0203\u0204\x05\u0138\x9D\x02\u0204\u0205\x07\x05\x02\x02\u0205\u0207" +
		"\x05\u0138\x9D\x02\u0206\u0208\x05\xF0y\x02\u0207\u0206\x03\x02\x02\x02" +
		"\u0207\u0208\x03\x02\x02\x02\u0208\u0209\x03\x02\x02\x02\u0209\u020A\x07" +
		"\x8B\x02\x02\u020A\u0224\x03\x02\x02\x02\u020B\u020C\x07m\x02\x02\u020C" +
		"\u020D\x07\x06\x02\x02\u020D\u020F\x05\u0138\x9D\x02\u020E\u0210\x05\xF8" +
		"}\x02\u020F\u020E\x03\x02\x02\x02\u020F\u0210\x03\x02\x02\x02\u0210\u0213" +
		"\x03\x02\x02\x02\u0211\u0214\x05\u0100\x81\x02\u0212\u0214\x07\x8B\x02" +
		"\x02\u0213\u0211\x03\x02\x02\x02\u0213\u0212\x03\x02\x02\x02\u0214\u0224" +
		"\x03\x02\x02\x02\u0215\u0216\x07m\x02\x02\u0216\u0217\x076\x02\x02\u0217" +
		"\u0218\x05\u0138\x9D\x02\u0218\u0219\x07\x8B\x02\x02\u0219\u0224\x03\x02" +
		"\x02\x02\u021A\u021B\x07m\x02\x02\u021B\u021C\x07B\x02\x02\u021C\u021D" +
		"\x05\u0138\x9D\x02\u021D\u021E\x07\x8B\x02\x02\u021E\u0224\x03\x02\x02" +
		"\x02\u021F\u0220\x07m\x02\x02\u0220\u0221\x05\u0136\x9C\x02\u0221\u0222" +
		"\x07\x8B\x02\x02\u0222\u0224\x03\x02\x02\x02\u0223\u01FC\x03\x02\x02\x02" +
		"\u0223\u0201\x03\x02\x02\x02\u0223\u020B\x03\x02\x02\x02\u0223\u0215\x03" +
		"\x02\x02\x02\u0223\u021A\x03\x02\x02\x02\u0223\u021F\x03\x02\x02\x02\u0224" +
		"\x15\x03\x02\x02\x02\u0225\u0227\x07b\x02\x02\u0226\u0228\t\x03\x02\x02" +
		"\u0227\u0226\x03\x02\x02\x02\u0227\u0228\x03\x02\x02\x02\u0228\u022A\x03" +
		"\x02\x02\x02\u0229\u022B\x05\u0138\x9D\x02\u022A\u0229\x03\x02\x02\x02" +
		"\u022A\u022B\x03\x02\x02\x02\u022B\u022D\x03\x02\x02\x02\u022C\u022E\x05" +
		"\xF0y\x02\u022D\u022C\x03\x02\x02\x02\u022D\u022E\x03\x02\x02\x02\u022E" +
		"\u0231\x03\x02\x02\x02\u022F\u0230\x07}\x02\x02\u0230\u0232\x05\u0136" +
		"\x9C\x02\u0231\u022F\x03\x02\x02\x02\u0231\u0232\x03\x02\x02\x02\u0232" +
		"\u0234\x03\x02\x02\x02\u0233\u0235\x05^0\x02\u0234\u0233\x03\x02\x02\x02" +
		"\u0234\u0235\x03\x02\x02\x02\u0235\u0236\x03\x02\x02\x02\u0236\u0240\x07" +
		"\x8B\x02\x02\u0237\u0238\x07b\x02\x02\u0238\u0239\x07~\x02\x02\u0239\u023B" +
		"\x05\u0138\x9D\x02\u023A\u023C\x05^0\x02\u023B\u023A\x03\x02\x02\x02\u023B" +
		"\u023C\x03\x02\x02\x02\u023C\u023D\x03\x02\x02\x02\u023D\u023E\x07\x8B" +
		"\x02\x02\u023E\u0240\x03\x02\x02\x02\u023F\u0225\x03\x02\x02\x02\u023F" +
		"\u0237\x03\x02\x02\x02\u0240\x17\x03\x02\x02\x02\u0241\u0242\x07`\x02" +
		"\x02\u0242\u0243\x05\u0136\x9C\x02\u0243\u0244\x07\x8B\x02\x02\u0244\u0249" +
		"\x03\x02\x02\x02\u0245\u0246\x07`\x02\x02\u0246\u0247\x07\x1D\x02\x02" +
		"\u0247\u0249\x05\u0100\x81\x02\u0248\u0241\x03\x02\x02\x02\u0248\u0245" +
		"\x03\x02\x02\x02\u0249\x19\x03\x02\x02\x02\u024A\u024B\x076\x02\x02\u024B" +
		"\u024C\x05\u0138\x9D\x02\u024C\u024D\x07\x8B\x02\x02\u024D\u0255\x03\x02" +
		"\x02\x02\u024E\u024F\x076\x02\x02\u024F\u0252\x05\u0138\x9D\x02\u0250" +
		"\u0253\x05\u0100\x81\x02\u0251\u0253\x07\x8B\x02\x02\u0252\u0250\x03\x02" +
		"\x02\x02\u0252\u0251\x03\x02\x02\x02\u0253\u0255\x03\x02\x02\x02\u0254" +
		"\u024A\x03\x02\x02\x02\u0254\u024E\x03\x02\x02\x02\u0255\x1B\x03\x02\x02" +
		"\x02\u0256\u0257\x07B\x02\x02\u0257\u0258\x05\u0138\x9D\x02\u0258\u0259" +
		"\x07\x8B\x02\x02\u0259\x1D\x03\x02\x02\x02\u025A\u025C\x07(\x02\x02\u025B" +
		"\u025D\x05 \x11\x02\u025C\u025B\x03\x02\x02\x02\u025C\u025D\x03\x02\x02" +
		"\x02\u025D\u025F\x03\x02\x02\x02\u025E\u0260\x05\u0138\x9D\x02\u025F\u025E" +
		"\x03\x02\x02\x02\u025F\u0260\x03\x02\x02\x02\u0260\u0262\x03\x02\x02\x02" +
		"\u0261\u0263\x05\xF0y\x02\u0262\u0261\x03\x02\x02\x02\u0262\u0263\x03" +
		"\x02\x02\x02\u0263\u0265\x03\x02\x02\x02\u0264\u0266\x07\x8B\x02\x02\u0265" +
		"\u0264\x03\x02\x02\x02\u0265\u0266\x03\x02\x02\x02\u0266\u0271\x03\x02" +
		"\x02\x02\u0267\u0269\x07(\x02\x02\u0268\u026A\x05 \x11\x02\u0269\u0268" +
		"\x03\x02\x02\x02\u0269\u026A\x03\x02\x02\x02\u026A\u026B\x03\x02\x02\x02" +
		"\u026B\u026C\t\x04\x02\x02\u026C\u026E\x05\u0136\x9C\x02\u026D\u026F\x07" +
		"\x8B\x02\x02\u026E\u026D\x03\x02\x02\x02\u026E\u026F\x03\x02\x02\x02\u026F" +
		"\u0271\x03\x02\x02\x02\u0270\u025A\x03\x02\x02\x02\u0270\u0267\x03\x02" +
		"\x02\x02\u0271\x1F\x03\x02\x02\x02\u0272\u0273\x07\x9E\x02\x02\u0273\u0274" +
		"\x05\u0138\x9D\x02\u0274!\x03\x02\x02\x02\u0275\u0276\x07\x12\x02\x02" +
		"\u0276\u0277\x05\u0136\x9C\x02\u0277\u0278\x07\x9C\x02\x02\u0278\u027A" +
		"\x05\u0136\x9C\x02\u0279\u027B\x07\x8B\x02\x02\u027A\u0279\x03\x02\x02" +
		"\x02\u027A\u027B\x03\x02\x02\x02\u027B#\x03\x02\x02\x02\u027C\u027E\x07" +
		"\x1B\x02\x02\u027D\u027F\x05\xF8}\x02\u027E\u027D\x03\x02\x02\x02\u027E" +
		"\u027F\x03\x02\x02\x02\u027F\u0280\x03\x02\x02\x02\u0280\u0283\x05\u0138" +
		"\x9D\x02\u0281\u0282\x07|\x02\x02\u0282\u0284\x05\u0136\x9C\x02\u0283" +
		"\u0281\x03\x02\x02\x02\u0283\u0284\x03\x02\x02\x02\u0284\u0285\x03\x02" +
		"\x02\x02\u0285\u0287\x07o\x02\x02\u0286\u0288\x05\xF8}\x02\u0287\u0286" +
		"\x03\x02\x02\x02\u0287\u0288\x03\x02\x02\x02\u0288\u0289\x03\x02\x02\x02" +
		"\u0289\u028C\x05\u0138\x9D\x02\u028A\u028B\x07|\x02\x02\u028B\u028D\x05" +
		"\u0136\x9C\x02\u028C\u028A\x03\x02\x02\x02\u028C\u028D\x03\x02\x02\x02" +
		"\u028D\u0290\x03\x02\x02\x02\u028E\u0291\x05\u0100\x81\x02\u028F\u0291" +
		"\x07\x8B\x02\x02\u0290\u028E\x03\x02\x02\x02\u0290\u028F\x03\x02\x02\x02" +
		"\u0290\u0291\x03\x02\x02\x02\u0291\u02A0\x03\x02\x02\x02\u0292\u0294\x07" +
		"\x1B\x02\x02\u0293\u0295\x05\xF8}\x02\u0294\u0293\x03\x02\x02\x02\u0294" +
		"\u0295\x03\x02\x02\x02\u0295\u0296\x03\x02\x02\x02\u0296\u0297\x05\u0136" +
		"\x9C\x02\u0297\u0299\x07o\x02\x02\u0298\u029A\x05\xF8}\x02\u0299\u0298" +
		"\x03\x02\x02\x02\u0299\u029A\x03\x02\x02\x02\u029A\u029B\x03\x02\x02\x02" +
		"\u029B\u029D\x05\u0136\x9C\x02\u029C\u029E\x07\x8B\x02\x02\u029D\u029C" +
		"\x03\x02\x02\x02\u029D\u029E\x03\x02\x02\x02\u029E\u02A0\x03\x02\x02\x02" +
		"\u029F\u027C\x03\x02\x02\x02\u029F\u0292\x03\x02\x02\x02\u02A0%\x03\x02" +
		"\x02\x02\u02A1\u02A2\x07~\x02\x02\u02A2\u02A4\x05\u0136\x9C\x02\u02A3" +
		"\u02A5\x05\xF8}\x02\u02A4\u02A3\x03\x02\x02\x02\u02A4\u02A5\x03\x02\x02" +
		"\x02\u02A5\u02AF\x03\x02\x02\x02\u02A6\u02B0\x05\u0100\x81\x02\u02A7\u02A8" +
		"\x07\x9C\x02\x02\u02A8\u02AA\x05\u0108\x85\x02\u02A9\u02AB\x05(\x15\x02" +
		"\u02AA\u02A9\x03\x02\x02\x02\u02AA\u02AB\x03\x02\x02\x02\u02AB\u02AC\x03" +
		"\x02\x02\x02\u02AC\u02AD\x07\x8B\x02\x02\u02AD\u02B0\x03\x02\x02\x02\u02AE" +
		"\u02B0\x07\x8B\x02\x02\u02AF\u02A6\x03\x02\x02\x02\u02AF\u02A7\x03\x02" +
		"\x02\x02\u02AF\u02AE\x03\x02\x02\x02\u02B0\u02B9\x03\x02\x02\x02\u02B1" +
		"\u02B2\x07]\x02\x02\u02B2\u02B4\x05\u0136\x9C\x02\u02B3\u02B5\x05^0\x02" +
		"\u02B4\u02B3\x03\x02\x02\x02\u02B4\u02B5\x03\x02\x02\x02\u02B5\u02B6\x03" +
		"\x02\x02\x02\u02B6\u02B7\x07\x8B\x02\x02\u02B7\u02B9\x03\x02\x02\x02\u02B8" +
		"\u02A1\x03\x02\x02\x02\u02B8\u02B1\x03\x02\x02\x02\u02B9\'\x03\x02\x02" +
		"\x02\u02BA\u02BB\x07E\x02\x02\u02BB\u02BC\x05\u0136\x9C\x02\u02BC)\x03" +
		"\x02\x02\x02\u02BD\u02BE\x074\x02\x02\u02BE\u02BF\x07Y\x02\x02\u02BF\u02C1" +
		"\x05\u0138\x9D\x02\u02C0\u02C2\x05\xF0y\x02\u02C1\u02C0\x03\x02\x02\x02" +
		"\u02C1\u02C2\x03\x02\x02\x02\u02C2\u02C5\x03\x02\x02\x02\u02C3\u02C4\x07" +
		"$\x02\x02\u02C4\u02C6\x05\xE8u\x02\u02C5\u02C3\x03\x02\x02\x02\u02C5\u02C6" +
		"\x03\x02\x02\x02\u02C6\u02C8\x03\x02\x02\x02\u02C7\u02C9\x07\x8B\x02\x02" +
		"\u02C8\u02C7\x03\x02\x02\x02\u02C8\u02C9\x03\x02\x02\x02\u02C9+\x03\x02" +
		"\x02\x02\u02CA\u02CC\x05\xECw\x02\u02CB\u02CA\x03\x02\x02\x02\u02CB\u02CC" +
		"\x03\x02\x02\x02\u02CC\u02CE\x03\x02\x02\x02\u02CD\u02CF\x07h\x02\x02" +
		"\u02CE\u02CD\x03\x02\x02\x02\u02CE\u02CF\x03\x02\x02\x02\u02CF\u02D1\x03" +
		"\x02\x02\x02\u02D0\u02D2\x07C\x02\x02\u02D1\u02D0\x03\x02\x02\x02\u02D1" +
		"\u02D2\x03\x02\x02\x02\u02D2\u02D3\x03\x02\x02\x02\u02D3\u02D4\x07Q\x02" +
		"\x02\u02D4\u02D6\x05\u0138\x9D\x02\u02D5\u02D7\x05\u0100\x81\x02\u02D6" +
		"\u02D5\x03\x02\x02\x02\u02D6\u02D7\x03\x02\x02\x02\u02D7-\x03\x02\x02" +
		"\x02\u02D8\u02DA\x05\xECw\x02\u02D9\u02D8\x03\x02\x02\x02\u02D9\u02DA" +
		"\x03\x02\x02\x02\u02DA\u02DB\x03\x02\x02\x02\u02DB\u02DC\x07;\x02\x02" +
		"\u02DC\u02DF\x05\u0136\x9C\x02\u02DD\u02DE\x07{\x02\x02\u02DE\u02E0\t" +
		"\x05\x02\x02\u02DF\u02DD\x03\x02\x02\x02\u02DF\u02E0\x03\x02\x02\x02\u02E0" +
		"\u02E9\x03\x02\x02\x02\u02E1\u02E2\x07\x8C\x02\x02\u02E2\u02E5\x05\u0136" +
		"\x9C\x02\u02E3\u02E4\x07{\x02\x02\u02E4\u02E6\t\x05\x02\x02\u02E5\u02E3" +
		"\x03\x02\x02\x02\u02E5\u02E6\x03\x02\x02\x02\u02E6\u02E8\x03\x02\x02\x02" +
		"\u02E7\u02E1\x03\x02\x02\x02\u02E8\u02EB\x03\x02\x02\x02\u02E9\u02E7\x03" +
		"\x02\x02\x02\u02E9\u02EA\x03\x02\x02\x02\u02EA\u02ED\x03\x02\x02\x02\u02EB" +
		"\u02E9\x03\x02\x02\x02\u02EC\u02EE\x07\x8B\x02\x02\u02ED\u02EC\x03\x02" +
		"\x02\x02\u02ED\u02EE\x03\x02\x02\x02\u02EE\u0308\x03\x02\x02\x02\u02EF" +
		"\u02F1\x05\xECw\x02\u02F0\u02EF\x03\x02\x02\x02\u02F0\u02F1\x03\x02\x02" +
		"\x02\u02F1\u02F2\x03\x02\x02\x02\u02F2\u02F3\x07X\x02\x02\u02F3\u02F4" +
		"\x07;\x02\x02\u02F4\u02F7\x05\u0136\x9C\x02\u02F5\u02F6\x07{\x02\x02\u02F6" +
		"\u02F8\t\x05\x02\x02\u02F7\u02F5\x03\x02\x02\x02\u02F7\u02F8\x03\x02\x02" +
		"\x02\u02F8\u0301\x03\x02\x02\x02\u02F9\u02FA\x07\x8C\x02\x02\u02FA\u02FD" +
		"\x05\u0136\x9C\x02\u02FB\u02FC\x07{\x02\x02\u02FC\u02FE\t\x05\x02\x02" +
		"\u02FD\u02FB\x03\x02\x02\x02\u02FD\u02FE\x03\x02\x02\x02\u02FE\u0300\x03" +
		"\x02\x02\x02\u02FF\u02F9\x03\x02\x02\x02\u0300\u0303\x03\x02\x02\x02\u0301" +
		"\u02FF\x03\x02\x02\x02\u0301\u0302\x03\x02\x02\x02\u0302\u0305\x03\x02" +
		"\x02\x02\u0303\u0301\x03\x02\x02\x02\u0304\u0306\x07\x8B\x02\x02\u0305" +
		"\u0304\x03\x02\x02\x02\u0305\u0306\x03\x02\x02\x02\u0306\u0308\x03\x02" +
		"\x02\x02\u0307\u02D9\x03\x02\x02\x02\u0307\u02F0\x03\x02\x02\x02\u0308" +
		"/\x03\x02\x02\x02\u0309\u030B\x05\xECw\x02\u030A\u0309\x03\x02\x02\x02" +
		"\u030A\u030B\x03\x02\x02\x02\u030B\u030F\x03\x02\x02\x02\u030C\u030E\x05" +
		"\xEEx\x02\u030D\u030C\x03\x02\x02\x02\u030E\u0311\x03\x02\x02\x02\u030F" +
		"\u030D\x03\x02\x02\x02\u030F\u0310\x03\x02\x02\x02\u0310\u0312\x03\x02" +
		"\x02\x02\u0311\u030F\x03\x02\x02\x02\u0312\u0313\x07S\x02\x02\u0313\u0314" +
		"\x07\x1F\x02\x02\u0314\u0316\x05\u0138\x9D\x02\u0315\u0317\x05\xF6|\x02" +
		"\u0316\u0315\x03\x02\x02\x02\u0316\u0317\x03\x02\x02\x02\u0317\u031A\x03" +
		"\x02\x02\x02\u0318\u031B\x05\u0100\x81\x02\u0319\u031B\x07\x8B\x02\x02" +
		"\u031A\u0318\x03\x02\x02\x02\u031A\u0319\x03\x02\x02\x02\u031A\u031B\x03" +
		"\x02\x02\x02\u031B1\x03\x02\x02\x02\u031C\u031E\x05\xECw\x02\u031D\u031C" +
		"\x03\x02\x02\x02\u031D\u031E\x03\x02\x02\x02\u031E\u0320\x03\x02\x02\x02" +
		"\u031F\u0321\x05 \x11\x02\u0320\u031F\x03\x02\x02\x02\u0320\u0321\x03" +
		"\x02\x02\x02\u0321\u0325\x03\x02\x02\x02\u0322\u0324\x05\xEEx\x02\u0323" +
		"\u0322\x03\x02\x02\x02\u0324\u0327\x03\x02\x02\x02\u0325\u0323\x03\x02" +
		"\x02\x02\u0325\u0326\x03\x02\x02\x02\u0326\u0328\x03\x02\x02\x02\u0327" +
		"\u0325\x03\x02\x02\x02\u0328\u032A\x07S\x02\x02\u0329\u032B\x05\u0138" +
		"\x9D\x02\u032A\u0329\x03\x02\x02\x02\u032A\u032B\x03\x02\x02\x02\u032B" +
		"\u032D\x03\x02\x02\x02\u032C\u032E\x05\xF0y\x02\u032D\u032C\x03\x02\x02" +
		"\x02\u032D\u032E\x03\x02\x02\x02\u032E\u0330\x03\x02\x02\x02\u032F\u0331" +
		"\x05\xF6|\x02\u0330\u032F\x03\x02\x02\x02\u0330\u0331\x03\x02\x02\x02" +
		"\u0331\u0333\x03\x02\x02\x02\u0332\u0334\x05\xF8}\x02\u0333\u0332\x03" +
		"\x02\x02\x02\u0333\u0334\x03\x02\x02\x02\u0334\u0337\x03\x02\x02\x02\u0335" +
		"\u0338\x05\u0100\x81\x02\u0336\u0338\x07\x8B\x02\x02\u0337\u0335\x03\x02" +
		"\x02\x02\u0337\u0336\x03\x02\x02\x02\u0337\u0338\x03\x02\x02\x02\u0338" +
		"3\x03\x02\x02\x02\u0339\u033B\x05\xECw\x02\u033A\u0339\x03\x02\x02\x02" +
		"\u033A\u033B\x03\x02\x02\x02\u033B\u033F\x03\x02\x02\x02\u033C\u033E\x05" +
		"\xEEx\x02\u033D\u033C\x03\x02\x02\x02\u033E\u0341\x03\x02\x02\x02\u033F" +
		"\u033D\x03\x02\x02\x02\u033F\u0340\x03\x02\x02\x02\u0340\u0342\x03\x02" +
		"\x02\x02\u0341\u033F\x03\x02\x02\x02\u0342\u0343\x07\x06\x02\x02\u0343" +
		"\u0344\x07\x1F\x02\x02\u0344\u0346\x05\u0138\x9D\x02\u0345\u0347\x05\xF6" +
		"|\x02\u0346\u0345\x03\x02\x02\x02\u0346\u0347\x03\x02\x02\x02\u0347\u034A" +
		"\x03\x02\x02\x02\u0348\u034B\x05\u0100\x81\x02\u0349\u034B\x07\x8B\x02" +
		"\x02\u034A\u0348\x03\x02\x02\x02\u034A\u0349\x03\x02\x02\x02\u034A\u034B" +
		"\x03\x02\x02\x02\u034B5\x03\x02\x02\x02\u034C\u034E\x05\xECw\x02\u034D" +
		"\u034C\x03\x02\x02\x02\u034D\u034E\x03\x02\x02\x02\u034E\u0352\x03\x02" +
		"\x02\x02\u034F\u0351\x05\xEEx\x02\u0350\u034F\x03\x02\x02\x02\u0351\u0354" +
		"\x03\x02\x02\x02\u0352\u0350\x03\x02\x02\x02\u0352\u0353\x03\x02\x02\x02" +
		"\u0353\u0355\x03\x02\x02\x02\u0354\u0352\x03\x02\x02\x02\u0355\u0356\x07" +
		"\x06\x02\x02\u0356\u0358\x05\u0138\x9D\x02\u0357\u0359\x05\xF0y\x02\u0358" +
		"\u0357\x03\x02\x02\x02\u0358\u0359\x03\x02\x02\x02\u0359\u035B\x03\x02" +
		"\x02\x02\u035A\u035C\x05\xF6|\x02\u035B\u035A\x03\x02\x02\x02\u035B\u035C" +
		"\x03\x02\x02\x02\u035C\u035E\x03\x02\x02\x02\u035D\u035F\x05\xF8}\x02" +
		"\u035E\u035D\x03\x02\x02\x02\u035E\u035F\x03\x02\x02\x02\u035F\u0362\x03" +
		"\x02\x02\x02\u0360\u0363\x05\u0100\x81\x02\u0361\u0363\x07\x8B\x02\x02" +
		"\u0362\u0360\x03\x02\x02\x02\u0362\u0361\x03\x02\x02\x02\u0362\u0363\x03" +
		"\x02\x02\x02\u03637\x03\x02\x02\x02\u0364\u0366\x07U\x02\x02\u0365\u0367" +
		"\x07\x06\x02\x02\u0366\u0365\x03\x02\x02\x02\u0366\u0367\x03\x02\x02\x02" +
		"\u0367\u0368\x03\x02\x02\x02\u0368\u036A\x05\u0136\x9C\x02\u0369\u036B" +
		"\x05\xF8}\x02\u036A\u0369\x03\x02\x02\x02\u036A\u036B\x03\x02\x02\x02" +
		"\u036B\u036D\x03\x02\x02\x02\u036C\u036E\x05\xF6|\x02\u036D\u036C\x03" +
		"\x02\x02\x02\u036D\u036E\x03\x02\x02\x02\u036E\u0370\x03\x02\x02\x02\u036F" +
		"\u0371\x07\x8B\x02\x02\u0370\u036F\x03\x02\x02\x02\u0370\u0371\x03\x02" +
		"\x02\x02\u0371\u037A\x03\x02\x02\x02\u0372\u0373\x07U\x02\x02\u0373\u0374" +
		"\x05\u0136\x9C\x02\u0374\u0375\x07]\x02\x02\u0375\u0377\x05\u0136\x9C" +
		"\x02\u0376\u0378\x07\x8B\x02\x02\u0377\u0376\x03\x02\x02\x02\u0377\u0378" +
		"\x03\x02\x02\x02\u0378\u037A\x03\x02\x02\x02\u0379\u0364\x03\x02\x02\x02" +
		"\u0379\u0372\x03\x02\x02\x02\u037A9\x03\x02\x02\x02\u037B\u037C\x07,\x02" +
		"\x02\u037C\u037D\x07i\x02\x02\u037D\u037F\x05\u0136\x9C\x02\u037E\u0380" +
		"\x05\xF0y\x02\u037F\u037E\x03\x02\x02\x02\u037F\u0380\x03\x02\x02\x02" +
		"\u0380\u0382\x03\x02\x02\x02\u0381\u0383\x05\xF6|\x02\u0382\u0381\x03" +
		"\x02\x02\x02\u0382\u0383\x03\x02\x02\x02\u0383\u0385\x03\x02\x02\x02\u0384" +
		"\u0386\x07R\x02\x02\u0385\u0384\x03\x02\x02\x02\u0385\u0386\x03\x02\x02" +
		"\x02\u0386\u0389\x03\x02\x02\x02\u0387\u038A\x05\u0100\x81\x02\u0388\u038A" +
		"\x07\x8B\x02\x02\u0389\u0387\x03\x02\x02\x02\u0389\u0388\x03\x02\x02\x02" +
		"\u0389\u038A\x03\x02\x02\x02\u038A;\x03\x02\x02\x02\u038B\u038D\x07)\x02" +
		"\x02\u038C\u038E\x07\x8B\x02\x02\u038D\u038C\x03\x02\x02\x02\u038D\u038E" +
		"\x03\x02\x02\x02\u038E\u0394\x03\x02\x02\x02\u038F\u0390\x07m\x02\x02" +
		"\u0390\u0392\x05\u0138\x9D\x02\u0391\u0393\x07\x8B\x02\x02\u0392\u0391" +
		"\x03\x02\x02\x02\u0392\u0393\x03\x02\x02\x02\u0393\u0395\x03\x02\x02\x02" +
		"\u0394\u038F\x03\x02\x02\x02\u0394\u0395\x03\x02\x02\x02\u0395\u03A7\x03" +
		"\x02\x02\x02\u0396\u0397\x07)\x02\x02\u0397\u0398\x07\x9A\x02\x02\u0398" +
		"\u039A\x05\u0108\x85\x02\u0399\u039B\x07\x8B\x02\x02\u039A\u0399\x03\x02" +
		"\x02\x02\u039A\u039B\x03\x02\x02\x02\u039B\u03A7\x03\x02\x02\x02\u039C" +
		"\u039E\x07)\x02\x02\u039D\u039F\x07\x06\x02\x02\u039E\u039D\x03\x02\x02" +
		"\x02\u039E\u039F\x03\x02\x02\x02\u039F\u03A1\x03\x02\x02\x02\u03A0\u03A2" +
		"\x05\u0136\x9C\x02\u03A1\u03A0\x03\x02\x02\x02\u03A1\u03A2\x03\x02\x02" +
		"\x02\u03A2\u03A4\x03\x02\x02\x02\u03A3\u03A5\x07\x8B\x02\x02\u03A4\u03A3" +
		"\x03\x02\x02\x02\u03A4\u03A5\x03\x02\x02\x02\u03A5\u03A7\x03\x02\x02\x02" +
		"\u03A6\u038B\x03\x02\x02\x02\u03A6\u0396\x03\x02\x02\x02\u03A6\u039C\x03" +
		"\x02\x02\x02\u03A7=\x03\x02\x02\x02\u03A8\u03AA\x07-\x02\x02\u03A9\u03AB" +
		"\x07\x8B\x02\x02\u03AA\u03A9\x03\x02\x02\x02\u03AA\u03AB\x03\x02\x02\x02" +
		"\u03AB\u03B8\x03\x02\x02\x02\u03AC\u03AD\x07-\x02\x02\u03AD\u03AE\x07" +
		"\x9A\x02\x02\u03AE\u03B0\x05\u0108\x85\x02\u03AF\u03B1\x07\x8B\x02\x02" +
		"\u03B0\u03AF\x03\x02\x02\x02\u03B0\u03B1\x03\x02\x02\x02\u03B1\u03B8\x03" +
		"\x02\x02\x02\u03B2\u03B3\x07-\x02\x02\u03B3\u03B5\x05\u0136\x9C\x02\u03B4" +
		"\u03B6\x07\x8B\x02\x02\u03B5\u03B4\x03\x02\x02\x02\u03B5\u03B6\x03\x02" +
		"\x02\x02\u03B6\u03B8\x03\x02\x02\x02\u03B7\u03A8\x03\x02\x02\x02\u03B7" +
		"\u03AC\x03\x02\x02\x02\u03B7\u03B2\x03\x02\x02\x02\u03B8?\x03\x02\x02" +
		"\x02\u03B9\u03BA\x07%\x02\x02\u03BA\u03BB\x07\x9A\x02\x02\u03BB\u03BD" +
		"\x05\u0108\x85\x02\u03BC\u03BE\x07\x8B\x02\x02\u03BD\u03BC\x03\x02\x02" +
		"\x02\u03BD\u03BE\x03\x02\x02\x02\u03BE\u03C8\x03\x02\x02\x02\u03BF\u03C0" +
		"\x07%\x02\x02\u03C0\u03C3\x05\u0136\x9C\x02\u03C1\u03C4\x05\u0100\x81" +
		"\x02\u03C2\u03C4\x07\x8B\x02\x02\u03C3\u03C1\x03\x02\x02\x02\u03C3\u03C2" +
		"\x03\x02\x02\x02\u03C3\u03C4\x03\x02\x02\x02\u03C4\u03C8\x03\x02\x02\x02" +
		"\u03C5\u03C6\x07%\x02\x02\u03C6\u03C8\x05\u0100\x81\x02\u03C7\u03B9\x03" +
		"\x02\x02\x02\u03C7\u03BF\x03\x02\x02\x02\u03C7\u03C5\x03\x02\x02\x02\u03C8" +
		"A\x03\x02\x02\x02\u03C9\u03CA\x07\x05\x02\x02\u03CA\u03CD\x05\u0136\x9C" +
		"\x02\u03CB\u03CC\x07\x8A\x02\x02\u03CC\u03CE\x05\u0136\x9C\x02\u03CD\u03CB" +
		"\x03\x02\x02\x02\u03CD\u03CE\x03\x02\x02\x02\u03CE\u03D1\x03\x02\x02\x02" +
		"\u03CF\u03D0\x07v\x02\x02\u03D0\u03D2\x05\u0136\x9C\x02\u03D1\u03CF\x03" +
		"\x02\x02\x02\u03D1\u03D2\x03\x02\x02\x02\u03D2\u03D5\x03\x02\x02\x02\u03D3" +
		"\u03D4\x07:\x02\x02\u03D4\u03D6\x05\u0108\x85\x02\u03D5\u03D3\x03\x02" +
		"\x02\x02\u03D5\u03D6\x03\x02\x02\x02\u03D6\u03D8\x03\x02\x02\x02\u03D7" +
		"\u03D9\x07\x8B\x02\x02\u03D8\u03D7\x03\x02\x02\x02\u03D8\u03D9\x03\x02" +
		"\x02\x02\u03D9\u03E1\x03\x02\x02\x02\u03DA\u03DB\x07\x05\x02\x02\u03DB" +
		"\u03DC\t\x06\x02\x02\u03DC\u03DE\x05\u0108\x85\x02\u03DD\u03DF\x07\x8B" +
		"\x02\x02\u03DE\u03DD\x03\x02\x02\x02\u03DE\u03DF\x03\x02\x02\x02\u03DF" +
		"\u03E1\x03\x02\x02\x02\u03E0\u03C9\x03\x02\x02\x02\u03E0\u03DA\x03\x02" +
		"\x02\x02\u03E1C\x03\x02\x02\x02\u03E2\u03E3\x07d\x02\x02\u03E3\u03E4\x05" +
		"\u0108\x85\x02\u03E4\u03E5\x07o\x02\x02\u03E5\u03E7\x05\u0136\x9C\x02" +
		"\u03E6\u03E8\x07\x8B\x02\x02\u03E7\u03E6\x03\x02\x02\x02\u03E7\u03E8\x03" +
		"\x02\x02\x02\u03E8\u03FA\x03\x02\x02\x02\u03E9\u03EA\x07d\x02\x02\u03EA" +
		"\u03EB\x05\u0108\x85\x02\u03EB\u03EC\x07v\x02\x02\u03EC\u03EF\x05\u0136" +
		"\x9C\x02\u03ED\u03F0\x05\u0100\x81\x02\u03EE\u03F0\x07\x8B\x02\x02\u03EF" +
		"\u03ED\x03\x02\x02\x02\u03EF\u03EE\x03\x02\x02\x02\u03EF\u03F0\x03\x02" +
		"\x02\x02\u03F0\u03FA\x03\x02\x02\x02\u03F1\u03F2\x07d\x02\x02\u03F2\u03F3" +
		"\x05\u0136\x9C\x02\u03F3\u03F4\x07v\x02\x02\u03F4\u03F7\x05\u0136\x9C" +
		"\x02\u03F5\u03F8\x05\u0100\x81\x02\u03F6\u03F8\x07\x8B\x02\x02\u03F7\u03F5" +
		"\x03\x02\x02\x02\u03F7\u03F6\x03\x02\x02\x02\u03F7\u03F8\x03\x02\x02\x02" +
		"\u03F8\u03FA\x03\x02\x02\x02\u03F9\u03E2\x03\x02\x02\x02\u03F9\u03E9\x03" +
		"\x02\x02\x02\u03F9\u03F1\x03\x02\x02\x02\u03FAE\x03\x02\x02\x02\u03FB" +
		"\u03FD\x05\xECw\x02\u03FC\u03FB\x03\x02\x02\x02\u03FC\u03FD\x03\x02\x02" +
		"\x02\u03FD\u0401\x03\x02\x02\x02\u03FE\u0400\x05\xEEx\x02\u03FF\u03FE" +
		"\x03\x02\x02\x02\u0400\u0403\x03\x02\x02\x02\u0401\u03FF\x03\x02\x02\x02" +
		"\u0401\u0402\x03\x02\x02\x02\u0402\u0404\x03\x02\x02\x02\u0403\u0401\x03" +
		"\x02\x02\x02\u0404\u0405\x07i\x02\x02\u0405\u0406\x07\x1F\x02\x02\u0406" +
		"\u0408\x05\u0138\x9D\x02\u0407\u0409\x05\xF6|\x02\u0408\u0407\x03\x02" +
		"\x02\x02\u0408\u0409\x03\x02\x02\x02\u0409\u040C\x03\x02\x02\x02\u040A" +
		"\u040D\x05\u0100\x81\x02\u040B\u040D\x07\x8B\x02\x02\u040C\u040A\x03\x02" +
		"\x02\x02\u040C\u040B\x03\x02\x02\x02\u040C\u040D\x03\x02\x02\x02\u040D" +
		"G\x03\x02\x02\x02\u040E\u0410\x05\xECw\x02\u040F\u040E\x03\x02\x02\x02" +
		"\u040F\u0410\x03\x02\x02\x02\u0410\u0414\x03\x02\x02\x02\u0411\u0413\x05" +
		"\xEEx\x02\u0412\u0411\x03\x02\x02\x02\u0413\u0416\x03\x02\x02\x02\u0414" +
		"\u0412\x03\x02\x02\x02\u0414\u0415\x03\x02\x02\x02\u0415\u0417\x03\x02" +
		"\x02\x02\u0416\u0414\x03\x02\x02\x02\u0417\u0418\x07i\x02\x02\u0418\u041A" +
		"\x05\u0138\x9D\x02\u0419\u041B\x05\xF0y\x02\u041A\u0419\x03\x02\x02\x02" +
		"\u041A\u041B\x03\x02\x02\x02\u041B\u041D\x03\x02\x02\x02\u041C\u041E\x05" +
		"\xF6|\x02\u041D\u041C\x03\x02\x02\x02\u041D\u041E\x03\x02\x02\x02\u041E" +
		"\u0420\x03\x02\x02\x02\u041F\u0421\x05\xF8}\x02\u0420\u041F\x03\x02\x02" +
		"\x02\u0420\u0421\x03\x02\x02\x02\u0421\u0425\x03\x02\x02\x02\u0422\u0424" +
		"\x05\xEEx\x02\u0423\u0422\x03\x02\x02\x02\u0424\u0427\x03\x02\x02\x02" +
		"\u0425\u0423\x03\x02\x02\x02\u0425\u0426\x03\x02\x02\x02\u0426\u042A\x03" +
		"\x02\x02\x02\u0427\u0425\x03\x02\x02\x02\u0428\u042B\x05\u0100\x81\x02" +
		"\u0429\u042B\x07\x8B\x02\x02\u042A\u0428\x03\x02\x02\x02\u042A\u0429\x03" +
		"\x02\x02\x02\u042A\u042B\x03\x02\x02\x02\u042BI\x03\x02\x02\x02\u042C" +
		"\u042E\x05\xECw\x02\u042D\u042C\x03\x02\x02\x02\u042D\u042E\x03\x02\x02" +
		"\x02\u042E\u0432\x03\x02\x02\x02\u042F\u0431\x05\xEEx\x02\u0430\u042F" +
		"\x03\x02\x02\x02\u0431\u0434\x03\x02\x02\x02\u0432\u0430\x03\x02\x02\x02" +
		"\u0432\u0433\x03\x02\x02\x02\u0433\u0435\x03\x02\x02\x02\u0434\u0432\x03" +
		"\x02\x02\x02\u0435\u0436\x07+\x02\x02\u0436\u0437\x07\x1F\x02\x02\u0437" +
		"\u0439\x05\u0138\x9D\x02\u0438\u043A\x05\xF6|\x02\u0439\u0438\x03\x02" +
		"\x02\x02\u0439\u043A\x03\x02\x02\x02\u043A\u043D\x03\x02\x02\x02\u043B" +
		"\u043E\x05\u0100\x81\x02\u043C\u043E\x07\x8B\x02\x02\u043D\u043B\x03\x02" +
		"\x02\x02\u043D\u043C\x03\x02\x02\x02\u043D\u043E\x03\x02\x02\x02\u043E" +
		"K\x03\x02\x02\x02\u043F\u0441\x05\xECw\x02\u0440\u043F\x03\x02\x02\x02" +
		"\u0440\u0441\x03\x02\x02\x02\u0441\u0445\x03\x02\x02\x02\u0442\u0444\x05" +
		"\xEEx\x02\u0443\u0442\x03\x02\x02\x02\u0444\u0447\x03\x02\x02\x02\u0445" +
		"\u0443\x03\x02\x02\x02\u0445\u0446\x03\x02\x02\x02\u0446\u0448\x03\x02" +
		"\x02\x02\u0447\u0445\x03\x02\x02\x02\u0448\u0449\x07+\x02\x02\u0449\u044A" +
		"\x07L\x02\x02\u044A\u044C\x05\u0138\x9D\x02\u044B\u044D\x05^0\x02\u044C" +
		"\u044B\x03\x02\x02\x02\u044C\u044D\x03\x02\x02\x02\u044D\u044E\x03\x02" +
		"\x02\x02\u044E\u044F\x07\x8B\x02\x02\u044F\u045E\x03\x02\x02\x02\u0450" +
		"\u0452\x05\xECw\x02\u0451\u0450\x03\x02\x02\x02\u0451\u0452\x03\x02\x02" +
		"\x02\u0452\u0456\x03\x02\x02\x02\u0453\u0455\x05\xEEx\x02\u0454\u0453" +
		"\x03\x02\x02\x02\u0455\u0458\x03\x02\x02\x02\u0456\u0454\x03\x02\x02\x02" +
		"\u0456\u0457\x03\x02\x02\x02\u0457\u0459\x03\x02\x02\x02\u0458\u0456\x03" +
		"\x02\x02\x02\u0459\u045A\x07+\x02\x02\u045A\u045B\x05\u0136\x9C\x02\u045B" +
		"\u045C\x07\x8B\x02\x02\u045C\u045E\x03\x02\x02\x02\u045D\u0440\x03\x02" +
		"\x02\x02\u045D\u0451\x03\x02\x02\x02\u045EM\x03\x02\x02\x02\u045F\u0461" +
		"\x05\xECw\x02\u0460\u045F\x03\x02\x02\x02\u0460\u0461\x03\x02\x02\x02" +
		"\u0461\u0465\x03\x02\x02\x02\u0462\u0464\x05\xEEx\x02\u0463\u0462\x03" +
		"\x02\x02\x02\u0464\u0467\x03\x02\x02\x02\u0465\u0463\x03\x02\x02\x02\u0465" +
		"\u0466\x03\x02\x02\x02\u0466\u0468\x03\x02\x02\x02\u0467\u0465\x03\x02" +
		"\x02\x02\u0468\u0469\x07a\x02\x02\u0469\u046A\x07\x1F\x02\x02\u046A\u046C" +
		"\x05\u0138\x9D\x02\u046B\u046D\x05\xF6|\x02\u046C\u046B\x03\x02\x02\x02" +
		"\u046C\u046D\x03\x02\x02\x02\u046D\u0470\x03\x02\x02\x02\u046E\u0471\x05" +
		"\u0100\x81\x02\u046F\u0471\x07\x8B\x02\x02\u0470\u046E\x03\x02\x02\x02" +
		"\u0470\u046F\x03\x02\x02\x02\u0470\u0471\x03\x02\x02\x02\u0471O\x03\x02" +
		"\x02\x02\u0472\u0474\x05\xECw\x02\u0473\u0472\x03\x02\x02\x02\u0473\u0474" +
		"\x03\x02\x02\x02\u0474\u0478\x03\x02\x02\x02\u0475\u0477\x05\xEEx\x02" +
		"\u0476\u0475\x03\x02\x02\x02\u0477\u047A\x03\x02\x02\x02\u0478\u0476\x03" +
		"\x02\x02\x02\u0478\u0479\x03\x02\x02\x02\u0479\u047B\x03\x02\x02\x02\u047A" +
		"\u0478\x03\x02\x02\x02\u047B\u047D\x07a\x02\x02\u047C\u047E\x05\u013A" +
		"\x9E\x02\u047D\u047C\x03\x02\x02\x02\u047D\u047E\x03\x02\x02\x02\u047E" +
		"\u047F\x03\x02\x02\x02\u047F\u0481\x05\u0138\x9D\x02\u0480\u0482\x05\xF0" +
		"y\x02\u0481\u0480\x03\x02\x02\x02\u0481\u0482\x03\x02\x02\x02\u0482\u0484" +
		"\x03\x02\x02\x02\u0483\u0485\x05\xF6|\x02\u0484\u0483\x03\x02\x02\x02" +
		"\u0484\u0485\x03\x02\x02\x02\u0485\u0487\x03\x02\x02\x02\u0486\u0488\x05" +
		"\xF8}\x02\u0487\u0486\x03";
	private static readonly _serializedATNSegment3: string =
		"\x02\x02\x02\u0487\u0488\x03\x02\x02\x02\u0488\u048B\x03\x02\x02\x02\u0489" +
		"\u048C\x05\u0100\x81\x02\u048A\u048C\x07\x8B\x02\x02\u048B\u0489\x03\x02" +
		"\x02\x02\u048B\u048A\x03\x02\x02\x02\u048B\u048C\x03\x02\x02\x02\u048C" +
		"Q\x03\x02\x02\x02\u048D\u048F\x05\xECw\x02\u048E\u048D\x03\x02\x02\x02" +
		"\u048E\u048F\x03\x02\x02\x02\u048F\u0493\x03\x02\x02\x02\u0490\u0492\x05" +
		"\xEEx\x02\u0491\u0490\x03\x02\x02\x02\u0492\u0495\x03\x02\x02\x02\u0493" +
		"\u0491\x03\x02\x02\x02\u0493\u0494\x03\x02\x02\x02\u0494\u0496\x03\x02" +
		"\x02\x02\u0495\u0493\x03\x02\x02\x02\u0496\u0497\x07r\x02\x02\u0497\u0498" +
		"\x07\x16\x02\x02\u0498\u0499\x07\x1F\x02\x02\u0499\u049B\x05\u0138\x9D" +
		"\x02\u049A\u049C\x05\xF6|\x02\u049B\u049A\x03\x02\x02\x02\u049B\u049C" +
		"\x03\x02\x02\x02\u049C\u049F\x03\x02\x02\x02\u049D\u04A0\x05\u0100\x81" +
		"\x02\u049E\u04A0\x07\x8B\x02\x02\u049F\u049D\x03\x02\x02\x02\u049F\u049E" +
		"\x03\x02\x02\x02\u049F\u04A0\x03\x02\x02\x02\u04A0S\x03\x02\x02\x02\u04A1" +
		"\u04A3\x05\xECw\x02\u04A2\u04A1\x03\x02\x02\x02\u04A2\u04A3\x03\x02\x02" +
		"\x02\u04A3\u04A7\x03\x02\x02\x02\u04A4\u04A6\x05\xEEx\x02\u04A5\u04A4" +
		"\x03\x02\x02\x02\u04A6\u04A9\x03\x02\x02\x02\u04A7\u04A5\x03\x02\x02\x02" +
		"\u04A7\u04A8\x03\x02\x02\x02\u04A8\u04AA\x03\x02\x02\x02\u04A9\u04A7\x03" +
		"\x02\x02\x02\u04AA\u04AB\x07r\x02\x02\u04AB\u04AC\x07\x16\x02\x02\u04AC" +
		"\u04AE\x05\u0138\x9D\x02\u04AD\u04AF\x05\xF0y\x02\u04AE\u04AD\x03\x02" +
		"\x02\x02\u04AE\u04AF\x03\x02\x02\x02\u04AF\u04B1\x03\x02\x02\x02\u04B0" +
		"\u04B2\x05\xF6|\x02\u04B1\u04B0\x03\x02\x02\x02\u04B1\u04B2\x03\x02\x02" +
		"\x02\u04B2\u04B4\x03\x02\x02\x02\u04B3\u04B5\x05\xF8}\x02\u04B4\u04B3" +
		"\x03\x02\x02\x02\u04B4\u04B5\x03\x02\x02\x02\u04B5\u04B8\x03\x02\x02\x02" +
		"\u04B6\u04B9\x05\u0100\x81\x02\u04B7\u04B9\x07\x8B\x02\x02\u04B8\u04B6" +
		"\x03\x02\x02\x02\u04B8\u04B7\x03\x02\x02\x02\u04B8\u04B9\x03\x02\x02\x02" +
		"\u04B9U\x03\x02\x02\x02\u04BA\u04BC\x05\xECw\x02\u04BB\u04BA\x03\x02\x02" +
		"\x02\u04BB\u04BC\x03\x02\x02\x02\u04BC\u04C0\x03\x02\x02\x02\u04BD\u04BF" +
		"\x05\xEEx\x02\u04BE\u04BD\x03\x02\x02\x02\u04BF\u04C2\x03\x02\x02\x02" +
		"\u04C0\u04BE\x03\x02\x02\x02\u04C0\u04C1\x03\x02\x02\x02\u04C1\u04C3\x03" +
		"\x02\x02\x02\u04C2\u04C0\x03\x02\x02\x02\u04C3\u04C4\x07\x1D\x02\x02\u04C4" +
		"\u04C5\x07\x1F\x02\x02\u04C5\u04C7\x05\u0138\x9D\x02\u04C6\u04C8\x05\xF6" +
		"|\x02\u04C7\u04C6\x03\x02\x02\x02\u04C7\u04C8\x03\x02\x02\x02\u04C8\u04CB" +
		"\x03\x02\x02\x02\u04C9\u04CC\x05\u0100\x81\x02\u04CA\u04CC\x07\x8B\x02" +
		"\x02\u04CB\u04C9\x03\x02\x02\x02\u04CB\u04CA\x03\x02\x02\x02\u04CB\u04CC" +
		"\x03\x02\x02\x02\u04CCW\x03\x02\x02\x02\u04CD\u04CF\x05\xECw\x02\u04CE" +
		"\u04CD\x03\x02\x02\x02\u04CE\u04CF\x03\x02\x02\x02\u04CF\u04D3\x03\x02" +
		"\x02\x02\u04D0\u04D2\x05\xEEx\x02\u04D1\u04D0\x03\x02\x02\x02\u04D2\u04D5" +
		"\x03\x02\x02\x02\u04D3\u04D1\x03\x02\x02\x02\u04D3\u04D4\x03\x02\x02\x02" +
		"\u04D4\u04D6\x03\x02\x02\x02\u04D5\u04D3\x03\x02\x02\x02\u04D6\u04D8\x07" +
		"\x1D\x02\x02\u04D7\u04D9\x05\u0138\x9D\x02\u04D8\u04D7\x03\x02\x02\x02" +
		"\u04D8\u04D9\x03\x02\x02\x02\u04D9\u04DB\x03\x02\x02\x02\u04DA\u04DC\x05" +
		"\xF0y\x02\u04DB\u04DA\x03\x02\x02\x02\u04DB\u04DC\x03\x02\x02\x02\u04DC" +
		"\u04DE\x03\x02\x02\x02\u04DD\u04DF\x05\xF6|\x02\u04DE\u04DD\x03\x02\x02" +
		"\x02\u04DE\u04DF\x03\x02\x02\x02\u04DF\u04E1\x03\x02\x02\x02\u04E0\u04E2" +
		"\x05\xF8}\x02\u04E1\u04E0\x03\x02\x02\x02\u04E1\u04E2\x03\x02\x02\x02" +
		"\u04E2\u04E5\x03\x02\x02\x02\u04E3\u04E6\x05\u0100\x81\x02\u04E4\u04E6" +
		"\x07\x8B\x02\x02\u04E5\u04E3\x03\x02\x02\x02\u04E5\u04E4\x03\x02\x02\x02" +
		"\u04E5\u04E6\x03\x02\x02\x02\u04E6Y\x03\x02\x02\x02\u04E7\u04E9\x05\xEC" +
		"w\x02\u04E8\u04E7\x03\x02\x02\x02\u04E8\u04E9\x03\x02\x02\x02\u04E9\u04ED" +
		"\x03\x02\x02\x02\u04EA\u04EC\x05\xEEx\x02\u04EB\u04EA\x03\x02\x02\x02" +
		"\u04EC\u04EF\x03\x02\x02\x02\u04ED\u04EB\x03\x02\x02\x02\u04ED\u04EE\x03" +
		"\x02\x02\x02\u04EE\u04F0\x03\x02\x02\x02\u04EF\u04ED\x03\x02\x02\x02\u04F0" +
		"\u04F1\x07\x11\x02\x02\u04F1\u04F2\x07\x1F\x02\x02\u04F2\u04F4\x05\u0138" +
		"\x9D\x02\u04F3\u04F5\x05\xF0y\x02\u04F4\u04F3\x03\x02\x02\x02\u04F4\u04F5" +
		"\x03\x02\x02\x02\u04F5\u04F7\x03\x02\x02\x02\u04F6\u04F8\x05\xF6|\x02" +
		"\u04F7\u04F6\x03\x02\x02\x02\u04F7\u04F8\x03\x02\x02\x02\u04F8\u04FB\x03" +
		"\x02\x02\x02\u04F9\u04FC\x05\u0100\x81\x02\u04FA\u04FC\x07\x8B\x02\x02" +
		"\u04FB\u04F9\x03\x02\x02\x02\u04FB\u04FA\x03\x02\x02\x02\u04FB\u04FC\x03" +
		"\x02\x02\x02\u04FC[\x03\x02\x02\x02\u04FD\u04FF\x05\xECw\x02\u04FE\u04FD" +
		"\x03\x02\x02\x02\u04FE\u04FF\x03\x02\x02\x02\u04FF\u0501\x03\x02\x02\x02" +
		"\u0500\u0502\x05 \x11\x02\u0501\u0500\x03\x02\x02\x02\u0501\u0502\x03" +
		"\x02\x02\x02\u0502\u0506\x03\x02\x02\x02\u0503\u0505\x05\xEEx\x02\u0504" +
		"\u0503\x03\x02\x02\x02\u0505\u0508\x03\x02\x02\x02\u0506\u0504\x03\x02" +
		"\x02\x02\u0506\u0507\x03\x02\x02\x02\u0507\u0509\x03\x02\x02\x02\u0508" +
		"\u0506\x03\x02\x02\x02\u0509\u050A\x07\x11\x02\x02\u050A\u050C\x05\u0138" +
		"\x9D\x02\u050B\u050D\x05\xF0y\x02\u050C\u050B\x03\x02\x02\x02\u050C\u050D" +
		"\x03\x02\x02\x02\u050D\u050F\x03\x02\x02\x02\u050E\u0510\x05\xF6|\x02" +
		"\u050F\u050E\x03\x02\x02\x02\u050F\u0510\x03\x02\x02\x02\u0510\u0512\x03" +
		"\x02\x02\x02\u0511\u0513\x05\xF8}\x02\u0512\u0511\x03\x02\x02\x02\u0512" +
		"\u0513\x03\x02\x02\x02\u0513\u0515\x03\x02\x02\x02\u0514\u0516\x05^0\x02" +
		"\u0515\u0514\x03\x02\x02\x02\u0515\u0516\x03\x02\x02\x02\u0516\u0519\x03" +
		"\x02\x02\x02\u0517\u051A\x05\u0100\x81\x02\u0518\u051A\x07\x8B\x02\x02" +
		"\u0519\u0517\x03\x02\x02\x02\u0519\u0518\x03\x02\x02\x02\u0519\u051A\x03" +
		"\x02\x02\x02\u051A]\x03\x02\x02\x02\u051B\u051C\x07\x9C\x02\x02\u051C" +
		"\u0522\x05\u0108\x85\x02\u051D\u051E\x07 \x02\x02\u051E\u0522\x05\u0108" +
		"\x85\x02\u051F\u0520\x07\x7F\x02\x02\u0520\u0522\x05\u0108\x85\x02\u0521" +
		"\u051B\x03\x02\x02\x02\u0521\u051D\x03\x02\x02\x02\u0521\u051F\x03\x02" +
		"\x02\x02\u0522_\x03\x02\x02\x02\u0523\u0525\x05\xECw\x02\u0524\u0523\x03" +
		"\x02\x02\x02\u0524\u0525\x03\x02\x02\x02\u0525\u0529\x03\x02\x02\x02\u0526" +
		"\u0528\x05\xEEx\x02\u0527\u0526\x03\x02\x02\x02\u0528\u052B\x03\x02\x02" +
		"\x02\u0529\u0527\x03\x02\x02\x02\u0529\u052A\x03\x02\x02\x02\u052A\u052C" +
		"\x03\x02\x02\x02\u052B\u0529\x03\x02\x02\x02\u052C\u052D\x07W\x02\x02" +
		"\u052D\u052E\x07\x1F\x02\x02\u052E\u0530\x05\u0138\x9D\x02\u052F\u0531" +
		"\x05\xF6|\x02\u0530\u052F\x03\x02\x02\x02\u0530\u0531\x03\x02\x02\x02" +
		"\u0531\u0534\x03\x02\x02\x02\u0532\u0535\x05\u0100\x81\x02\u0533\u0535" +
		"\x07\x8B\x02\x02\u0534\u0532\x03\x02\x02\x02\u0534\u0533\x03\x02\x02\x02" +
		"\u0534\u0535\x03\x02\x02\x02\u0535a\x03\x02\x02\x02\u0536\u0538\x05\xEC" +
		"w\x02\u0537\u0536\x03\x02\x02\x02\u0537\u0538\x03\x02\x02\x02\u0538\u053C" +
		"\x03\x02\x02\x02\u0539\u053B\x05\xEEx\x02\u053A\u0539\x03\x02\x02\x02" +
		"\u053B\u053E\x03\x02\x02\x02\u053C\u053A\x03\x02\x02\x02\u053C\u053D\x03" +
		"\x02\x02\x02\u053D\u053F\x03\x02\x02\x02\u053E\u053C\x03\x02\x02\x02\u053F" +
		"\u0540\x07W\x02\x02\u0540\u0544\x05\u0138\x9D\x02\u0541\u0545\x05\xF0" +
		"y\x02\u0542\u0543\x07~\x02\x02\u0543\u0545\x05\u0136\x9C\x02\u0544\u0541" +
		"\x03\x02\x02\x02\u0544\u0542\x03\x02\x02\x02\u0544\u0545\x03\x02\x02\x02" +
		"\u0545\u0547\x03\x02\x02\x02\u0546\u0548\x05\xF6|\x02\u0547\u0546\x03" +
		"\x02\x02\x02\u0547\u0548\x03\x02\x02\x02\u0548\u054A\x03\x02\x02\x02\u0549" +
		"\u054B\x05\xF8}\x02\u054A\u0549\x03\x02\x02\x02\u054A\u054B\x03\x02\x02" +
		"\x02\u054B\u054E\x03\x02\x02\x02\u054C\u054F\x05\u0100\x81\x02\u054D\u054F" +
		"\x07\x8B\x02\x02\u054E\u054C\x03\x02\x02\x02\u054E\u054D\x03\x02\x02\x02" +
		"\u054E\u054F\x03\x02\x02\x02\u054F\u056A\x03\x02\x02\x02\u0550\u0552\x05" +
		"\xECw\x02\u0551\u0550\x03\x02\x02\x02\u0551\u0552\x03\x02\x02\x02\u0552" +
		"\u0556\x03\x02\x02\x02\u0553\u0555\x05\xEEx\x02\u0554\u0553\x03\x02\x02" +
		"\x02\u0555\u0558\x03\x02\x02\x02\u0556\u0554\x03\x02\x02\x02\u0556\u0557" +
		"\x03\x02\x02\x02\u0557\u0559\x03\x02\x02\x02\u0558\u0556\x03\x02\x02\x02" +
		"\u0559\u055A\x07W\x02\x02\u055A\u055B\x07~\x02\x02\u055B\u055D\x05\u0138" +
		"\x9D\x02\u055C\u055E\x05\xF0y\x02\u055D\u055C\x03\x02\x02\x02\u055D\u055E" +
		"\x03\x02\x02\x02\u055E\u0560\x03\x02\x02\x02\u055F\u0561\x05\xF6|\x02" +
		"\u0560\u055F\x03\x02\x02\x02\u0560\u0561\x03\x02\x02\x02\u0561\u0563\x03" +
		"\x02\x02\x02\u0562\u0564\x05\xF8}\x02\u0563\u0562\x03\x02\x02\x02\u0563" +
		"\u0564\x03\x02\x02\x02\u0564\u0567\x03\x02\x02\x02\u0565\u0568\x05\u0100" +
		"\x81\x02\u0566\u0568\x07\x8B\x02\x02\u0567\u0565\x03\x02\x02\x02\u0567" +
		"\u0566\x03\x02\x02\x02\u0567\u0568\x03\x02\x02\x02\u0568\u056A\x03\x02" +
		"\x02\x02\u0569\u0537\x03\x02\x02\x02\u0569\u0551\x03\x02\x02\x02\u056A" +
		"c\x03\x02\x02\x02\u056B\u056D\x05\xECw\x02\u056C\u056B\x03\x02\x02\x02" +
		"\u056C\u056D\x03\x02\x02\x02\u056D\u0571\x03\x02\x02\x02\u056E\u0570\x05" +
		"\xEEx\x02\u056F\u056E\x03\x02\x02\x02\u0570\u0573\x03\x02\x02\x02\u0571" +
		"\u056F\x03\x02\x02\x02\u0571\u0572\x03\x02\x02\x02\u0572\u0574\x03\x02" +
		"\x02\x02\u0573\u0571\x03\x02\x02\x02\u0574\u0575\x07\x1C\x02\x02\u0575" +
		"\u0576\x07\x1F\x02\x02\u0576\u0578\x05\u0138\x9D\x02\u0577\u0579\x05\xF6" +
		"|\x02\u0578\u0577\x03\x02\x02\x02\u0578\u0579\x03\x02\x02\x02\u0579\u057C" +
		"\x03\x02\x02\x02\u057A\u057D\x05\u0100\x81\x02\u057B\u057D\x07\x8B\x02" +
		"\x02\u057C\u057A\x03\x02\x02\x02\u057C\u057B\x03\x02\x02\x02\u057C\u057D" +
		"\x03\x02\x02\x02\u057De\x03\x02\x02\x02\u057E\u0580\x05\xECw\x02\u057F" +
		"\u057E\x03\x02\x02\x02\u057F\u0580\x03\x02\x02\x02\u0580\u0584\x03\x02" +
		"\x02\x02\u0581\u0583\x05\xEEx\x02\u0582\u0581\x03\x02\x02\x02\u0583\u0586" +
		"\x03\x02\x02\x02\u0584\u0582\x03\x02\x02\x02\u0584\u0585\x03\x02\x02\x02" +
		"\u0585\u0588\x03\x02\x02\x02\u0586\u0584\x03\x02\x02\x02\u0587\u0589\x05" +
		" \x11\x02\u0588\u0587\x03\x02\x02\x02\u0588\u0589\x03\x02\x02\x02\u0589" +
		"\u058A\x03\x02\x02\x02\u058A\u058C\x07\x1C\x02\x02\u058B\u058D\x05\u0138" +
		"\x9D\x02\u058C\u058B\x03\x02\x02\x02\u058C\u058D\x03\x02\x02\x02\u058D" +
		"\u058F\x03\x02\x02\x02\u058E\u0590\x05\xF0y\x02\u058F\u058E\x03\x02\x02" +
		"\x02\u058F\u0590\x03\x02\x02\x02\u0590\u0592\x03\x02\x02\x02\u0591\u0593" +
		"\x05\xF6|\x02\u0592\u0591\x03\x02\x02\x02\u0592\u0593\x03\x02\x02\x02" +
		"\u0593\u0595\x03\x02\x02\x02\u0594\u0596\x05\xF8}\x02\u0595\u0594\x03" +
		"\x02\x02\x02\u0595\u0596\x03\x02\x02\x02\u0596\u0599\x03\x02\x02\x02\u0597" +
		"\u059A\x05\u0100\x81\x02\u0598\u059A\x07\x8B\x02\x02\u0599\u0597\x03\x02" +
		"\x02\x02\u0599\u0598\x03\x02\x02\x02\u0599\u059A\x03\x02\x02\x02\u059A" +
		"g\x03\x02\x02\x02\u059B\u059D\x05\xECw\x02\u059C\u059B\x03\x02\x02\x02" +
		"\u059C\u059D\x03\x02\x02\x02\u059D\u05A1\x03\x02\x02\x02\u059E\u05A0\x05" +
		"\xEEx\x02\u059F\u059E\x03\x02\x02\x02\u05A0\u05A3\x03\x02\x02\x02\u05A1" +
		"\u059F\x03\x02\x02\x02\u05A1\u05A2\x03\x02\x02\x02\u05A2\u05A4\x03\x02" +
		"\x02\x02\u05A3\u05A1\x03\x02\x02\x02\u05A4\u05A5\x07@\x02\x02\u05A5\u05A6" +
		"\x07\x1F\x02\x02\u05A6\u05A8\x05\u0138\x9D\x02\u05A7\u05A9\x05\xF6|\x02" +
		"\u05A8\u05A7\x03\x02\x02\x02\u05A8\u05A9\x03\x02\x02\x02\u05A9\u05AC\x03" +
		"\x02\x02\x02\u05AA\u05AD\x05\u0100\x81\x02\u05AB\u05AD\x07\x8B\x02\x02" +
		"\u05AC\u05AA\x03\x02\x02\x02\u05AC\u05AB\x03\x02\x02\x02\u05AC\u05AD\x03" +
		"\x02\x02\x02\u05ADi\x03\x02\x02\x02\u05AE\u05B0\x05\xECw\x02\u05AF\u05AE" +
		"\x03\x02\x02\x02\u05AF\u05B0\x03\x02\x02\x02\u05B0\u05B4\x03\x02\x02\x02" +
		"\u05B1\u05B3\x05\xEEx\x02\u05B2\u05B1\x03\x02\x02\x02\u05B3\u05B6\x03" +
		"\x02\x02\x02\u05B4\u05B2\x03\x02\x02\x02\u05B4\u05B5\x03\x02\x02\x02\u05B5" +
		"\u05B7\x03\x02\x02\x02\u05B6\u05B4\x03\x02\x02\x02\u05B7\u05B8\x07@\x02" +
		"\x02\u05B8\u05BA\x05\u0138\x9D\x02\u05B9\u05BB\x05\xF0y\x02\u05BA\u05B9" +
		"\x03\x02\x02\x02\u05BA\u05BB\x03\x02\x02\x02\u05BB\u05BD\x03\x02\x02\x02" +
		"\u05BC\u05BE\x05\xF6|\x02\u05BD\u05BC\x03\x02\x02\x02\u05BD\u05BE\x03" +
		"\x02\x02\x02\u05BE\u05C0\x03\x02\x02\x02\u05BF\u05C1\x05\xF8}\x02\u05C0" +
		"\u05BF\x03\x02\x02\x02\u05C0\u05C1\x03\x02\x02\x02\u05C1\u05C5\x03\x02" +
		"\x02\x02\u05C2\u05C6\x05\u0100\x81\x02\u05C3\u05C6\x05$\x13\x02\u05C4" +
		"\u05C6\x07\x8B\x02\x02\u05C5\u05C2\x03\x02\x02\x02\u05C5\u05C3\x03\x02" +
		"\x02\x02\u05C5\u05C4\x03\x02\x02\x02\u05C5\u05C6\x03\x02\x02\x02\u05C6" +
		"k\x03\x02\x02\x02\u05C7\u05C9\x05\xECw\x02\u05C8\u05C7\x03\x02\x02\x02" +
		"\u05C8\u05C9\x03\x02\x02\x02\u05C9\u05CD\x03\x02\x02\x02\u05CA\u05CC\x05" +
		"\xEEx\x02\u05CB\u05CA\x03\x02\x02\x02\u05CC\u05CF\x03\x02\x02\x02\u05CD" +
		"\u05CB\x03\x02\x02\x02\u05CD\u05CE\x03\x02\x02\x02\u05CE\u05D0\x03\x02" +
		"\x02\x02\u05CF\u05CD\x03\x02\x02\x02\u05D0\u05D1\x07\v\x02\x02\u05D1\u05D2" +
		"\x07\x1F\x02\x02\u05D2\u05D4\x05\u0138\x9D\x02\u05D3\u05D5\x05\xF6|\x02" +
		"\u05D4\u05D3\x03\x02\x02\x02\u05D4\u05D5\x03\x02\x02\x02\u05D5\u05D8\x03" +
		"\x02\x02\x02\u05D6\u05D9\x05\u0100\x81\x02\u05D7\u05D9\x07\x8B\x02\x02" +
		"\u05D8\u05D6\x03\x02\x02\x02\u05D8\u05D7\x03\x02\x02\x02\u05D8\u05D9\x03" +
		"\x02\x02\x02\u05D9m\x03\x02\x02\x02\u05DA\u05DC\x05\xECw\x02\u05DB\u05DA" +
		"\x03\x02\x02\x02\u05DB\u05DC\x03\x02\x02\x02\u05DC\u05E0\x03\x02\x02\x02" +
		"\u05DD\u05DF\x05\xEEx\x02\u05DE\u05DD\x03\x02\x02\x02\u05DF\u05E2\x03" +
		"\x02\x02\x02\u05E0\u05DE\x03\x02\x02\x02\u05E0\u05E1\x03\x02\x02\x02\u05E1" +
		"\u05E3\x03\x02\x02\x02\u05E2\u05E0\x03\x02\x02\x02\u05E3\u05E4\x07\v\x02" +
		"\x02\u05E4\u05E6\x05\u0138\x9D\x02\u05E5\u05E7\x05\xF0y\x02\u05E6\u05E5" +
		"\x03\x02\x02\x02\u05E6\u05E7\x03\x02\x02\x02\u05E7\u05E9\x03\x02\x02\x02" +
		"\u05E8\u05EA\x05\xF6|\x02\u05E9\u05E8\x03\x02\x02\x02\u05E9\u05EA\x03" +
		"\x02\x02\x02\u05EA\u05EC\x03\x02\x02\x02\u05EB\u05ED\x05\xF8}\x02\u05EC" +
		"\u05EB\x03\x02\x02\x02\u05EC\u05ED\x03\x02\x02\x02\u05ED\u05F1\x03\x02" +
		"\x02\x02\u05EE\u05F2\x05p9\x02\u05EF\u05F2\x05\u0100\x81\x02\u05F0\u05F2" +
		"\x07\x8B\x02\x02\u05F1\u05EE\x03\x02\x02\x02\u05F1\u05EF\x03\x02\x02\x02" +
		"\u05F1\u05F0\x03\x02\x02\x02\u05F1\u05F2\x03\x02\x02\x02\u05F2o\x03\x02" +
		"\x02\x02\u05F3\u05F5\x05\x92J\x02\u05F4\u05F3\x03\x02\x02\x02\u05F5\u05F6" +
		"\x03\x02\x02\x02\u05F6\u05F4\x03\x02\x02\x02\u05F6\u05F7\x03\x02\x02\x02" +
		"\u05F7q\x03\x02\x02\x02\u05F8\u05FA\x05\xECw\x02\u05F9\u05F8\x03\x02\x02" +
		"\x02\u05F9\u05FA\x03\x02\x02\x02\u05FA\u05FE\x03\x02\x02\x02\u05FB\u05FD" +
		"\x05\xEEx\x02\u05FC\u05FB\x03\x02\x02\x02\u05FD\u0600\x03\x02\x02\x02" +
		"\u05FE\u05FC\x03\x02\x02\x02\u05FE\u05FF\x03\x02\x02\x02\u05FF\u0601\x03" +
		"\x02\x02\x02\u0600\u05FE\x03\x02\x02\x02\u0601\u0602\x07A\x02\x02\u0602" +
		"\u0603\x07\x1F\x02\x02\u0603\u0605\x05\u0138\x9D\x02\u0604\u0606\x05\xF6" +
		"|\x02\u0605\u0604\x03\x02\x02\x02\u0605\u0606\x03\x02\x02\x02\u0606\u0609" +
		"\x03\x02\x02\x02\u0607\u060A\x05\u0100\x81\x02\u0608\u060A\x07\x8B\x02" +
		"\x02\u0609\u0607\x03\x02\x02\x02\u0609\u0608\x03\x02\x02\x02\u0609\u060A" +
		"\x03\x02\x02\x02\u060As\x03\x02\x02\x02\u060B\u060D\x05\xECw\x02\u060C" +
		"\u060B\x03\x02\x02\x02\u060C\u060D\x03\x02\x02\x02\u060D\u0611\x03\x02" +
		"\x02\x02\u060E\u0610\x05\xEEx\x02\u060F\u060E\x03\x02\x02\x02\u0610\u0613" +
		"\x03\x02\x02\x02\u0611\u060F\x03\x02\x02\x02\u0611\u0612\x03\x02\x02\x02" +
		"\u0612\u0615\x03\x02\x02\x02\u0613\u0611\x03\x02\x02\x02\u0614\u0616\x05" +
		"\xE8u\x02\u0615\u0614\x03\x02\x02\x02\u0615\u0616\x03\x02\x02\x02\u0616" +
		"\u0618\x03\x02\x02\x02\u0617\u0619\x07^\x02\x02\u0618\u0617\x03\x02\x02" +
		"\x02\u0618\u0619\x03\x02\x02\x02\u0619\u061A\x03\x02\x02\x02\u061A\u061C" +
		"\x07A\x02\x02\u061B\u061D\x05\u0138\x9D\x02\u061C\u061B\x03\x02\x02\x02" +
		"\u061C\u061D\x03\x02\x02\x02\u061D\u0621\x03\x02\x02\x02\u061E\u0622\x05" +
		"\xF0y\x02\u061F\u0620\x07~\x02\x02\u0620\u0622\x05\u0136\x9C\x02\u0621" +
		"\u061E\x03\x02\x02\x02\u0621\u061F\x03\x02\x02\x02\u0621\u0622\x03\x02" +
		"\x02\x02\u0622\u0624\x03\x02\x02\x02\u0623\u0625\x05\xF6|\x02\u0624\u0623" +
		"\x03\x02\x02\x02\u0624\u0625\x03\x02\x02\x02\u0625\u0627\x03\x02\x02\x02" +
		"\u0626\u0628\x05\xF8}\x02\u0627\u0626\x03\x02\x02\x02\u0627\u0628\x03" +
		"\x02\x02\x02\u0628\u062A\x03\x02\x02\x02\u0629\u062B\x05\xF0y\x02\u062A" +
		"\u0629\x03\x02\x02\x02\u062A\u062B\x03\x02\x02\x02\u062B\u062D\x03\x02" +
		"\x02\x02\u062C\u062E\x05^0\x02\u062D\u062C\x03\x02\x02\x02\u062D\u062E" +
		"\x03\x02\x02\x02\u062E\u0631\x03\x02\x02\x02\u062F\u0632\x05\u0100\x81" +
		"\x02\u0630\u0632\x07\x8B\x02\x02\u0631\u062F\x03\x02\x02\x02\u0631\u0630" +
		"\x03\x02\x02\x02\u0631\u0632\x03\x02\x02\x02\u0632u\x03\x02\x02\x02\u0633" +
		"\u0635\x05\xECw\x02\u0634\u0633\x03\x02\x02\x02\u0634\u0635\x03\x02\x02" +
		"\x02\u0635\u0639\x03\x02\x02\x02\u0636\u0638\x05\xEEx\x02\u0637\u0636" +
		"\x03\x02\x02\x02\u0638\u063B\x03\x02\x02\x02\u0639\u0637\x03\x02\x02\x02" +
		"\u0639\u063A\x03\x02\x02\x02\u063A\u063C\x03\x02\x02\x02\u063B\u0639\x03" +
		"\x02\x02\x02\u063C\u063D\x07\x1F\x02\x02\u063D\u063F\x05\u0138\x9D\x02" +
		"\u063E\u0640\x05\xF6|\x02\u063F\u063E\x03\x02\x02\x02\u063F\u0640\x03" +
		"\x02\x02\x02\u0640\u0643\x03\x02\x02\x02\u0641\u0644\x05\u0100\x81\x02" +
		"\u0642\u0644\x07\x8B\x02\x02\u0643\u0641\x03\x02\x02\x02\u0643\u0642\x03" +
		"\x02\x02\x02\u0643\u0644\x03\x02\x02\x02\u0644w\x03\x02\x02\x02\u0645" +
		"\u0647\x05\xECw\x02\u0646\u0645\x03\x02\x02\x02\u0646\u0647\x03\x02\x02" +
		"\x02\u0647\u0648\x03\x02\x02\x02\u0648\u0649\x07=\x02\x02\u0649\u064A" +
		"\x07\x1F\x02\x02\u064A\u064C\x05\u0138\x9D\x02\u064B\u064D\x05\xF6|\x02" +
		"\u064C\u064B\x03\x02\x02\x02\u064C\u064D\x03\x02\x02\x02\u064D\u0650\x03" +
		"\x02\x02\x02\u064E\u0651\x05\u0100\x81\x02\u064F\u0651\x07\x8B\x02\x02" +
		"\u0650\u064E\x03\x02\x02\x02\u0650\u064F\x03\x02\x02\x02\u0650\u0651\x03" +
		"\x02\x02\x02\u0651y\x03\x02\x02\x02\u0652\u0654\x05\xECw\x02\u0653\u0652" +
		"\x03\x02\x02\x02\u0653\u0654\x03\x02\x02\x02\u0654\u0655\x03\x02\x02\x02" +
		"\u0655\u0656\x07=\x02\x02\u0656\u0658\x05\u0138\x9D\x02\u0657\u0659\x05" +
		"\xF0y\x02\u0658\u0657\x03\x02\x02\x02\u0658\u0659\x03\x02\x02\x02\u0659" +
		"\u065C\x03\x02\x02\x02\u065A\u065D\x05\u0100\x81\x02\u065B\u065D\x07\x8B" +
		"\x02\x02\u065C\u065A\x03\x02\x02\x02\u065C\u065B\x03\x02\x02\x02\u065C" +
		"\u065D\x03\x02\x02\x02\u065D{\x03\x02\x02\x02\u065E\u0660\x05\xECw\x02" +
		"\u065F\u065E\x03\x02\x02\x02\u065F\u0660\x03\x02\x02\x02\u0660\u0661\x03" +
		"\x02\x02\x02\u0661\u0662\x07n\x02\x02\u0662\u0664\x05\u0138\x9D\x02\u0663" +
		"\u0665\x05\xF0y\x02\u0664\u0663\x03\x02\x02\x02\u0664\u0665\x03\x02\x02" +
		"\x02\u0665\u0668\x03\x02\x02\x02\u0666\u0669\x05\u0100\x81\x02\u0667\u0669" +
		"\x07\x8B\x02\x02\u0668\u0666\x03\x02\x02\x02\u0668\u0667\x03\x02\x02\x02" +
		"\u0668\u0669\x03\x02\x02\x02\u0669}\x03\x02\x02\x02\u066A\u066C\x05\xEC" +
		"w\x02\u066B\u066A\x03\x02\x02\x02\u066B\u066C\x03\x02\x02\x02\u066C\u066D" +
		"\x03\x02\x02\x02\u066D\u066E\x07l\x02\x02\u066E\u0670\x05\u0138\x9D\x02" +
		"\u066F\u0671\x05\xF0y\x02\u0670\u066F\x03\x02\x02\x02\u0670\u0671\x03" +
		"\x02\x02\x02\u0671\u0673\x03\x02\x02\x02\u0672\u0674\x05^0\x02\u0673\u0672" +
		"\x03\x02\x02\x02\u0673\u0674\x03\x02\x02\x02\u0674\u0677\x03\x02\x02\x02" +
		"\u0675\u0678\x05\u0100\x81\x02\u0676\u0678\x07\x8B\x02\x02\u0677\u0675" +
		"\x03\x02\x02\x02\u0677\u0676\x03\x02\x02\x02\u0677\u0678\x03\x02\x02\x02" +
		"\u0678\x7F\x03\x02\x02\x02\u0679\u067B\x05\xECw\x02\u067A\u0679\x03\x02" +
		"\x02\x02\u067A\u067B\x03\x02\x02\x02\u067B\u067F\x03\x02\x02\x02\u067C" +
		"\u067E\x05\xEEx\x02\u067D\u067C\x03\x02\x02\x02\u067E\u0681\x03\x02\x02" +
		"\x02\u067F\u067D\x03\x02\x02\x02\u067F\u0680\x03\x02\x02\x02\u0680\u0682" +
		"\x03\x02\x02\x02\u0681\u067F\x03\x02\x02\x02\u0682\u0683\x07\x07\x02\x02" +
		"\u0683\u0684\x07\x1F\x02\x02\u0684\u0686\x05\u0138\x9D\x02\u0685\u0687" +
		"\x05\xF6|\x02\u0686\u0685\x03\x02\x02\x02\u0686\u0687\x03\x02\x02\x02" +
		"\u0687\u068A\x03\x02\x02\x02\u0688\u068B\x05\u0100\x81\x02\u0689\u068B" +
		"\x07\x8B\x02\x02\u068A\u0688\x03\x02\x02\x02\u068A\u0689\x03\x02\x02\x02" +
		"\u068A\u068B\x03\x02\x02\x02\u068B\x81\x03\x02\x02\x02\u068C\u068E\x05" +
		"\xECw\x02\u068D\u068C\x03\x02\x02\x02\u068D\u068E\x03\x02\x02\x02\u068E" +
		"\u0692\x03\x02\x02\x02\u068F\u0691\x05\xEEx\x02\u0690\u068F\x03\x02\x02" +
		"\x02\u0691\u0694\x03\x02\x02\x02\u0692\u0690\x03\x02\x02\x02\u0692\u0693" +
		"\x03\x02\x02\x02\u0693\u0695\x03\x02\x02\x02\u0694\u0692\x03\x02\x02\x02" +
		"\u0695\u0696\x07\x07\x02\x02\u0696\u0698\x05\u0138\x9D\x02\u0697\u0699" +
		"\x05\xF0y\x02\u0698\u0697\x03\x02\x02\x02\u0698\u0699\x03\x02\x02\x02" +
		"\u0699\u069B\x03\x02\x02\x02\u069A\u069C\x05\xF6|\x02\u069B\u069A\x03" +
		"\x02\x02\x02\u069B\u069C\x03\x02\x02\x02\u069C\u069E\x03\x02\x02\x02\u069D" +
		"\u069F\x05\xF8}\x02\u069E\u069D\x03\x02\x02\x02\u069E\u069F\x03\x02\x02" +
		"\x02\u069F\u06A1\x03\x02\x02\x02\u06A0\u06A2\x05^0\x02\u06A1\u06A0\x03" +
		"\x02\x02\x02\u06A1\u06A2\x03\x02\x02\x02\u06A2\u06A5\x03\x02\x02\x02\u06A3" +
		"\u06A6\x05\u0100\x81\x02\u06A4\u06A6\x07\x8B\x02\x02\u06A5\u06A3\x03\x02" +
		"\x02\x02\u06A5\u06A4\x03\x02\x02\x02\u06A5\u06A6\x03\x02\x02\x02\u06A6" +
		"\x83\x03\x02\x02\x02\u06A7\u06A9\x05\xECw\x02\u06A8\u06A7\x03\x02\x02" +
		"\x02\u06A8\u06A9\x03\x02\x02\x02\u06A9\u06AD\x03\x02\x02\x02\u06AA\u06AC" +
		"\x05\xEEx\x02\u06AB\u06AA\x03\x02\x02\x02\u06AC\u06AF\x03\x02\x02\x02" +
		"\u06AD\u06AB\x03\x02\x02\x02\u06AD\u06AE\x03\x02\x02\x02\u06AE\u06B0\x03" +
		"\x02\x02\x02\u06AF\u06AD\x03\x02\x02\x02\u06B0\u06B1\x07\x1A\x02\x02\u06B1" +
		"\u06B2\x07\x1F\x02\x02\u06B2\u06B4\x05\u0138\x9D\x02\u06B3\u06B5\x05\xF6" +
		"|\x02\u06B4\u06B3\x03\x02\x02\x02\u06B4\u06B5\x03\x02\x02\x02\u06B5\u06B8" +
		"\x03\x02\x02\x02\u06B6\u06B9\x05\u0100\x81\x02\u06B7\u06B9\x07\x8B\x02" +
		"\x02\u06B8\u06B6\x03\x02\x02\x02\u06B8\u06B7\x03\x02\x02\x02\u06B8\u06B9" +
		"\x03\x02\x02\x02\u06B9\x85\x03\x02\x02\x02\u06BA\u06BC\x05\xECw\x02\u06BB" +
		"\u06BA\x03\x02\x02\x02\u06BB\u06BC\x03\x02\x02\x02\u06BC\u06C0\x03\x02" +
		"\x02\x02\u06BD\u06BF\x05\xEEx\x02\u06BE\u06BD\x03\x02\x02\x02\u06BF\u06C2" +
		"\x03\x02\x02\x02\u06C0\u06BE\x03\x02\x02\x02\u06C0\u06C1\x03\x02\x02\x02" +
		"\u06C1\u06C3\x03\x02\x02\x02\u06C2\u06C0\x03\x02\x02\x02\u06C3\u06C4\x07" +
		"\x1A\x02\x02\u06C4\u06C6\x05\u0138\x9D\x02\u06C5\u06C7\x05\xF0y\x02\u06C6" +
		"\u06C5\x03\x02\x02\x02\u06C6\u06C7\x03\x02\x02\x02\u06C7\u06C9\x03\x02" +
		"\x02\x02\u06C8\u06CA\x05\xF6|\x02\u06C9\u06C8\x03\x02\x02\x02\u06C9\u06CA" +
		"\x03\x02\x02\x02\u06CA\u06CC\x03\x02\x02\x02\u06CB\u06CD\x05\xF8}\x02" +
		"\u06CC\u06CB\x03\x02\x02\x02\u06CC\u06CD\x03\x02\x02\x02\u06CD\u06D0\x03" +
		"\x02\x02\x02\u06CE\u06D1\x05\u0100\x81\x02\u06CF\u06D1\x07\x8B\x02\x02" +
		"\u06D0\u06CE\x03\x02\x02\x02\u06D0\u06CF\x03\x02\x02\x02\u06D0\u06D1\x03" +
		"\x02\x02\x02\u06D1\x87\x03\x02\x02\x02\u06D2\u06D4\x05\xECw\x02\u06D3" +
		"\u06D2\x03\x02\x02\x02\u06D3\u06D4\x03\x02\x02\x02\u06D4\u06D8\x03\x02" +
		"\x02\x02\u06D5\u06D7\x05\xEEx\x02\u06D6\u06D5\x03\x02\x02\x02\u06D7\u06DA" +
		"\x03\x02\x02\x02\u06D8\u06D6\x03\x02\x02\x02\u06D8\u06D9\x03\x02\x02\x02" +
		"\u06D9\u06DB\x03\x02\x02\x02\u06DA\u06D8\x03\x02\x02\x02\u06DB\u06DC\x07" +
		"\r\x02\x02\u06DC\u06DD\x07\x1F\x02\x02\u06DD\u06DF\x05\u0138\x9D\x02\u06DE" +
		"\u06E0\x05\xF6|\x02\u06DF\u06DE\x03\x02\x02\x02\u06DF\u06E0\x03\x02\x02" +
		"\x02\u06E0\u06E3\x03\x02\x02\x02\u06E1\u06E4\x05\u0100\x81\x02\u06E2\u06E4" +
		"\x07\x8B\x02\x02\u06E3\u06E1\x03\x02\x02\x02\u06E3\u06E2\x03\x02\x02\x02" +
		"\u06E3\u06E4\x03\x02\x02\x02\u06E4\x89\x03\x02\x02\x02\u06E5\u06E7\x05" +
		"\xECw\x02\u06E6\u06E5\x03\x02\x02\x02\u06E6\u06E7\x03\x02\x02\x02\u06E7" +
		"\u06EB\x03\x02\x02\x02\u06E8\u06EA\x05\xEEx\x02\u06E9\u06E8\x03\x02\x02" +
		"\x02\u06EA\u06ED\x03\x02\x02\x02\u06EB\u06E9\x03\x02\x02\x02\u06EB\u06EC" +
		"\x03\x02\x02\x02\u06EC\u06EE\x03\x02\x02\x02\u06ED\u06EB\x03\x02\x02\x02" +
		"\u06EE\u06EF\x07\r\x02\x02\u06EF\u06F1\x05\u0138\x9D\x02\u06F0\u06F2\x05" +
		"\xF0y\x02\u06F1\u06F0\x03\x02\x02\x02\u06F1\u06F2\x03\x02\x02\x02\u06F2" +
		"\u06F4\x03\x02\x02\x02\u06F3\u06F5\x05\xF6|\x02\u06F4\u06F3\x03\x02\x02" +
		"\x02\u06F4\u06F5\x03\x02\x02\x02\u06F5\u06F7\x03\x02\x02\x02\u06F6\u06F8" +
		"\x05\xF8}\x02\u06F7\u06F6\x03\x02\x02\x02\u06F7\u06F8\x03\x02\x02\x02" +
		"\u06F8\u06FB\x03\x02\x02\x02\u06F9\u06FC\x05\u0100\x81\x02\u06FA\u06FC" +
		"\x07\x8B\x02\x02\u06FB\u06F9\x03\x02\x02\x02\u06FB\u06FA\x03\x02\x02\x02" +
		"\u06FB\u06FC\x03\x02\x02\x02\u06FC\x8B\x03\x02\x02\x02\u06FD\u06FF\x05" +
		"\xECw\x02\u06FE\u06FD\x03\x02\x02\x02\u06FE\u06FF\x03\x02\x02\x02\u06FF" +
		"\u0700\x03\x02\x02\x02\u0700\u0701\x07j\x02\x02\u0701\u0703\x05\u0138" +
		"\x9D\x02\u0702\u0704\x05\xF0y\x02\u0703\u0702\x03\x02\x02\x02\u0703\u0704" +
		"\x03\x02\x02\x02\u0704\u0706\x03\x02\x02\x02\u0705\u0707\x05\xF6|\x02" +
		"\u0706\u0705\x03\x02\x02\x02\u0706\u0707\x03\x02\x02\x02\u0707\u0709\x03" +
		"\x02\x02\x02\u0708\u070A\x05\xF8}\x02\u0709\u0708\x03\x02\x02\x02\u0709" +
		"\u070A\x03\x02\x02\x02\u070A\u070D\x03\x02\x02\x02\u070B\u070E\x05\u0100" +
		"\x81\x02\u070C\u070E\x07\x8B\x02";
	private static readonly _serializedATNSegment4: string =
		"\x02\u070D\u070B\x03\x02\x02\x02\u070D\u070C\x03\x02\x02\x02\u070D\u070E" +
		"\x03\x02\x02\x02\u070E\x8D\x03\x02\x02\x02\u070F\u0711\x05\xECw\x02\u0710" +
		"\u070F\x03\x02\x02\x02\u0710\u0711\x03\x02\x02\x02\u0711\u0712\x03\x02" +
		"\x02\x02\u0712\u0714\x07K\x02\x02\u0713\u0715\x05\u0138\x9D\x02\u0714" +
		"\u0713\x03\x02\x02\x02\u0714\u0715\x03\x02\x02\x02\u0715\u0717\x03\x02" +
		"\x02\x02\u0716\u0718\x05\xF0y\x02\u0717\u0716\x03\x02\x02\x02\u0717\u0718" +
		"\x03\x02\x02\x02\u0718\u071A\x03\x02\x02\x02\u0719\u071B\x05\xF6|\x02" +
		"\u071A\u0719\x03\x02\x02\x02\u071A\u071B\x03\x02\x02\x02\u071B\u071D\x03" +
		"\x02\x02\x02\u071C\u071E\x05\xF8}\x02\u071D\u071C\x03\x02\x02\x02\u071D" +
		"\u071E\x03\x02\x02\x02\u071E\u0721\x03\x02\x02\x02\u071F\u0722\x05\u0100" +
		"\x81\x02\u0720\u0722\x07\x8B\x02\x02\u0721\u071F\x03\x02\x02\x02\u0721" +
		"\u0720\x03\x02\x02\x02\u0721\u0722\x03\x02\x02\x02\u0722\x8F\x03\x02\x02" +
		"\x02\u0723\u0725\x05\xECw\x02\u0724\u0723\x03\x02\x02\x02\u0724\u0725" +
		"\x03\x02\x02\x02\u0725\u0726\x03\x02\x02\x02\u0726\u0727\x07g\x02\x02" +
		"\u0727\u0729\x05\u0138\x9D\x02\u0728\u072A\x05\xF0y\x02\u0729\u0728\x03" +
		"\x02\x02\x02\u0729\u072A\x03\x02\x02\x02\u072A\u072C\x03\x02\x02\x02\u072B" +
		"\u072D\x05\xF6|\x02\u072C\u072B\x03\x02\x02\x02\u072C\u072D\x03\x02\x02" +
		"\x02\u072D\u072F\x03\x02\x02\x02\u072E\u0730\x05\xF8}\x02\u072F\u072E" +
		"\x03\x02\x02\x02\u072F\u0730\x03\x02\x02\x02\u0730\u0733\x03\x02\x02\x02" +
		"\u0731\u0734\x05\u0100\x81\x02\u0732\u0734\x07\x8B\x02\x02\u0733\u0731" +
		"\x03\x02\x02\x02\u0733\u0732\x03\x02\x02\x02\u0733\u0734\x03\x02\x02\x02" +
		"\u0734\x91\x03\x02\x02\x02\u0735\u0736\x07\n\x02\x02\u0736\u0737\x05\u0136" +
		"\x9C\x02\u0737\u0738\x07o\x02\x02\u0738\u073D\x05\u0136\x9C\x02\u0739" +
		"\u073E\x05\x94K\x02\u073A\u073C\x07\x8B\x02\x02\u073B\u073A\x03\x02\x02" +
		"\x02\u073B\u073C\x03\x02\x02\x02\u073C\u073E\x03\x02\x02\x02\u073D\u0739" +
		"\x03\x02\x02\x02\u073D\u073B\x03\x02\x02\x02\u073E\x93\x03\x02\x02\x02" +
		"\u073F\u0743\x07\x91\x02\x02\u0740\u0742\x05\x92J\x02\u0741\u0740\x03" +
		"\x02\x02\x02\u0742\u0745\x03\x02\x02\x02\u0743\u0741\x03\x02\x02\x02\u0743" +
		"\u0744\x03\x02\x02\x02\u0744\u0746\x03\x02\x02\x02\u0745\u0743\x03\x02" +
		"\x02\x02\u0746\u0747\x07\x92\x02\x02\u0747\x95\x03\x02\x02\x02\u0748\u074A" +
		"\x05\xECw\x02\u0749\u0748\x03\x02\x02\x02\u0749\u074A\x03\x02\x02\x02" +
		"\u074A\u074E\x03\x02\x02\x02\u074B\u074D\x05\xEEx\x02\u074C\u074B\x03" +
		"\x02\x02\x02\u074D\u0750\x03\x02\x02\x02\u074E\u074C\x03\x02\x02\x02\u074E" +
		"\u074F\x03\x02\x02\x02\u074F\u0751\x03\x02\x02\x02\u0750\u074E\x03\x02" +
		"\x02\x02\u0751\u0752\x07t\x02\x02\u0752\u0753\x07\x1F\x02\x02\u0753\u0755" +
		"\x05\u0138\x9D\x02\u0754\u0756\x05\xF6|\x02\u0755\u0754\x03\x02\x02\x02" +
		"\u0755\u0756\x03\x02\x02\x02\u0756\u0758\x03\x02\x02\x02\u0757\u0759\x05" +
		"\x9AN\x02\u0758\u0757\x03\x02\x02\x02\u0758\u0759\x03\x02\x02\x02\u0759" +
		"\x97\x03\x02\x02\x02\u075A\u075C\x05\xECw\x02\u075B\u075A\x03\x02\x02" +
		"\x02\u075B\u075C\x03\x02\x02\x02\u075C\u0760\x03\x02\x02\x02\u075D\u075F" +
		"\x05\xEEx\x02\u075E\u075D\x03\x02\x02\x02\u075F\u0762\x03\x02\x02\x02" +
		"\u0760\u075E\x03\x02\x02\x02\u0760\u0761\x03\x02\x02\x02\u0761\u0763\x03" +
		"\x02\x02\x02\u0762\u0760\x03\x02\x02\x02\u0763\u0764\x07t\x02\x02\u0764" +
		"\u0766\x05\u0138\x9D\x02\u0765\u0767\x05\xF0y\x02\u0766\u0765\x03\x02" +
		"\x02\x02\u0766\u0767\x03\x02\x02\x02\u0767\u0769\x03\x02\x02\x02\u0768" +
		"\u076A\x05\xF6|\x02\u0769\u0768\x03\x02\x02\x02\u0769\u076A\x03\x02\x02" +
		"\x02\u076A\u076C\x03\x02\x02\x02\u076B\u076D\x05\xF8}\x02\u076C\u076B" +
		"\x03\x02\x02\x02\u076C\u076D\x03\x02\x02\x02\u076D\u076F\x03\x02\x02\x02" +
		"\u076E\u0770\x05\x9AN\x02\u076F\u076E\x03\x02\x02\x02\u076F\u0770\x03" +
		"\x02\x02\x02\u0770\x99\x03\x02\x02\x02\u0771\u0775\x07\x91\x02\x02\u0772" +
		"\u0774\x05\x9CO\x02\u0773\u0772\x03\x02\x02\x02\u0774\u0777\x03\x02\x02" +
		"\x02\u0775\u0773\x03\x02\x02\x02\u0775\u0776\x03\x02\x02\x02\u0776\u0778" +
		"\x03\x02\x02\x02\u0777\u0775\x03\x02\x02\x02\u0778\u0779\x07\x92\x02\x02" +
		"\u0779\x9B\x03\x02\x02\x02\u077A\u077D\x05\x04\x03\x02\u077B\u077D\x05" +
		"\x9EP\x02\u077C\u077A\x03\x02\x02\x02\u077C\u077B\x03\x02\x02\x02\u077D" +
		"\x9D\x03\x02\x02\x02\u077E\u077F\x07u\x02\x02\u077F\u0782\x05\u0136\x9C" +
		"\x02\u0780\u0783\x05\u0100\x81\x02\u0781\u0783\x07\x8B\x02\x02\u0782\u0780" +
		"\x03\x02\x02\x02\u0782\u0781\x03\x02\x02\x02\u0782\u0783\x03\x02\x02\x02" +
		"\u0783\x9F\x03\x02\x02\x02\u0784\u0786\x05\xECw\x02\u0785\u0784\x03\x02" +
		"\x02\x02\u0785\u0786\x03\x02\x02\x02\u0786\u078A\x03\x02\x02\x02\u0787" +
		"\u0789\x05\xEEx\x02\u0788\u0787\x03\x02\x02\x02\u0789\u078C\x03\x02\x02" +
		"\x02\u078A\u0788\x03\x02\x02\x02\u078A\u078B\x03\x02\x02\x02\u078B\u078D" +
		"\x03\x02\x02\x02\u078C\u078A\x03\x02\x02\x02\u078D\u078E\x07w\x02\x02" +
		"\u078E\u078F\x07\x1F\x02\x02\u078F\u0791\x05\u0138\x9D\x02\u0790\u0792" +
		"\x05\xF6|\x02\u0791\u0790\x03\x02\x02\x02\u0791\u0792\x03\x02\x02\x02" +
		"\u0792\u0794\x03\x02\x02\x02\u0793\u0795\x05\xA4S\x02\u0794\u0793\x03" +
		"\x02\x02\x02\u0794\u0795\x03\x02\x02\x02\u0795\xA1\x03\x02\x02\x02\u0796" +
		"\u0798\x05\xECw\x02\u0797\u0796\x03\x02\x02\x02\u0797\u0798\x03\x02\x02" +
		"\x02\u0798\u079C\x03\x02\x02\x02\u0799\u079B\x05\xEEx\x02\u079A\u0799" +
		"\x03\x02\x02\x02\u079B\u079E\x03\x02\x02\x02\u079C\u079A\x03\x02\x02\x02" +
		"\u079C\u079D\x03\x02\x02\x02\u079D\u079F\x03\x02\x02\x02\u079E\u079C\x03" +
		"\x02\x02\x02\u079F\u07A0\x07w\x02\x02\u07A0\u07A2\x05\u0138\x9D\x02\u07A1" +
		"\u07A3\x05\xF0y\x02\u07A2\u07A1\x03\x02\x02\x02\u07A2\u07A3\x03\x02\x02" +
		"\x02\u07A3\u07A5\x03\x02\x02\x02\u07A4\u07A6\x05\xF6|\x02\u07A5\u07A4" +
		"\x03\x02\x02\x02\u07A5\u07A6\x03\x02\x02\x02\u07A6\u07A8\x03\x02\x02\x02" +
		"\u07A7\u07A9\x05\xF8}\x02\u07A8\u07A7\x03\x02\x02\x02\u07A8\u07A9\x03" +
		"\x02\x02\x02\u07A9\u07AB\x03\x02\x02\x02\u07AA\u07AC\x05\xA4S\x02\u07AB" +
		"\u07AA\x03\x02\x02\x02\u07AB\u07AC\x03\x02\x02\x02\u07AC\xA3\x03\x02\x02" +
		"\x02\u07AD\u07B1\x07\x91\x02\x02\u07AE\u07B0\x05\xA6T\x02\u07AF\u07AE" +
		"\x03\x02\x02\x02\u07B0\u07B3\x03\x02\x02\x02\u07B1\u07AF\x03\x02\x02\x02" +
		"\u07B1\u07B2\x03\x02\x02\x02\u07B2\u07B4\x03\x02\x02\x02\u07B3\u07B1\x03" +
		"\x02\x02\x02\u07B4\u07B5\x07\x92\x02\x02\u07B5\xA5\x03\x02\x02\x02\u07B6" +
		"\u07BB\x05\x04\x03\x02\u07B7\u07BB\x05\xA8U\x02\u07B8\u07BB\x05\f\x07" +
		"\x02\u07B9\u07BB\x05\b\x05\x02\u07BA\u07B6\x03\x02\x02\x02\u07BA\u07B7" +
		"\x03\x02\x02\x02\u07BA\u07B8\x03\x02\x02\x02\u07BA\u07B9\x03\x02\x02\x02" +
		"\u07BB\xA7\x03\x02\x02\x02\u07BC\u07BD\x07.\x02\x02\u07BD\u07C2\x05\xAA" +
		"V\x02\u07BE\u07BF\x07\x8C\x02\x02\u07BF\u07C1\x05\xAAV\x02\u07C0\u07BE" +
		"\x03\x02\x02\x02\u07C1\u07C4\x03\x02\x02\x02\u07C2\u07C0\x03\x02\x02\x02" +
		"\u07C2\u07C3\x03\x02\x02\x02\u07C3\u07C6\x03\x02\x02\x02\u07C4\u07C2\x03" +
		"\x02\x02\x02\u07C5\u07C7\x07\x8B\x02\x02\u07C6\u07C5\x03\x02\x02\x02\u07C6" +
		"\u07C7\x03\x02\x02\x02\u07C7\xA9\x03\x02\x02\x02\u07C8\u07CD\x05\u0138" +
		"\x9D\x02\u07C9\u07CA\t\x07\x02\x02\u07CA\u07CC\x05\u0138\x9D\x02\u07CB" +
		"\u07C9\x03\x02\x02\x02\u07CC\u07CF\x03\x02\x02\x02\u07CD\u07CB\x03\x02" +
		"\x02\x02\u07CD\u07CE\x03\x02\x02\x02\u07CE\u07D0\x03\x02\x02\x02\u07CF" +
		"\u07CD\x03\x02\x02\x02\u07D0\u07D1\x07{\x02\x02\u07D1\u07D2\x07\x87\x02" +
		"\x02\u07D2\u07E0\x03\x02\x02\x02\u07D3\u07D8\x05\u0138\x9D\x02\u07D4\u07D5" +
		"\t\x07\x02\x02\u07D5\u07D7\x05\u0138\x9D\x02\u07D6\u07D4\x03\x02\x02\x02" +
		"\u07D7\u07DA\x03\x02\x02\x02\u07D8\u07D6\x03\x02\x02\x02\u07D8\u07D9\x03" +
		"\x02\x02\x02\u07D9\u07DB\x03\x02\x02\x02\u07DA\u07D8\x03\x02\x02\x02\u07DB" +
		"\u07DC\x07{\x02\x02\u07DC\u07DD\x07\x99\x02\x02\u07DD\u07E0\x03\x02\x02" +
		"\x02\u07DE\u07E0\x05\u0136\x9C\x02\u07DF\u07C8\x03\x02\x02\x02\u07DF\u07D3" +
		"\x03\x02\x02\x02\u07DF\u07DE\x03\x02\x02\x02\u07E0\xAB\x03\x02\x02\x02" +
		"\u07E1\u07E3\x05\xECw\x02\u07E2\u07E1\x03\x02\x02\x02\u07E2\u07E3\x03" +
		"\x02\x02\x02\u07E3\u07E7\x03\x02\x02\x02\u07E4\u07E6\x05\xEEx\x02\u07E5" +
		"\u07E4\x03\x02\x02\x02\u07E6\u07E9\x03\x02\x02\x02\u07E7\u07E5\x03\x02" +
		"\x02\x02\u07E7\u07E8\x03\x02\x02\x02\u07E8\u07EA\x03\x02\x02\x02\u07E9" +
		"\u07E7\x03\x02\x02\x02\u07EA\u07EB\x07x\x02\x02\u07EB\u07EC\x07\x1F\x02" +
		"\x02\u07EC\u07EE\x05\u0138\x9D\x02\u07ED\u07EF\x05\xF6|\x02\u07EE\u07ED" +
		"\x03\x02\x02\x02\u07EE\u07EF\x03\x02\x02\x02\u07EF\u07F1\x03\x02\x02\x02" +
		"\u07F0\u07F2\x05\u0100\x81\x02\u07F1\u07F0\x03\x02\x02\x02\u07F1\u07F2" +
		"\x03\x02\x02\x02\u07F2\xAD\x03\x02\x02\x02\u07F3\u07F5\x05\xECw\x02\u07F4" +
		"\u07F3\x03\x02\x02\x02\u07F4\u07F5\x03\x02\x02\x02\u07F5\u07F9\x03\x02" +
		"\x02\x02\u07F6\u07F8\x05\xEEx\x02\u07F7\u07F6\x03\x02\x02\x02\u07F8\u07FB" +
		"\x03\x02\x02\x02\u07F9\u07F7\x03\x02\x02\x02\u07F9\u07FA\x03\x02\x02\x02" +
		"\u07FA\u07FC\x03\x02\x02\x02\u07FB\u07F9\x03\x02\x02\x02\u07FC\u07FD\x07" +
		"x\x02\x02\u07FD\u07FF\x05\u0138\x9D\x02\u07FE\u0800\x05\xF0y\x02\u07FF" +
		"\u07FE\x03\x02\x02\x02\u07FF\u0800\x03\x02\x02\x02\u0800\u0802\x03\x02" +
		"\x02\x02\u0801\u0803\x05\xF6|\x02\u0802\u0801\x03\x02\x02\x02\u0802\u0803" +
		"\x03\x02\x02\x02\u0803\u0805\x03\x02\x02\x02\u0804\u0806\x05\xF8}\x02" +
		"\u0805\u0804\x03\x02\x02\x02\u0805\u0806\x03\x02\x02\x02\u0806\u0808\x03" +
		"\x02\x02\x02\u0807\u0809\x05\u0100\x81\x02\u0808\u0807\x03\x02\x02\x02" +
		"\u0808\u0809\x03\x02\x02\x02\u0809\xAF\x03\x02\x02\x02\u080A\u080C\x05" +
		"\xECw\x02\u080B\u080A\x03\x02\x02\x02\u080B\u080C\x03\x02\x02\x02\u080C" +
		"\u0810\x03\x02\x02\x02\u080D\u080F\x05\xEEx\x02\u080E\u080D\x03\x02\x02" +
		"\x02\u080F\u0812\x03\x02\x02\x02\u0810\u080E\x03\x02\x02\x02\u0810\u0811" +
		"\x03\x02\x02\x02\u0811\u0813\x03\x02\x02\x02\u0812\u0810\x03\x02\x02\x02" +
		"\u0813\u0814\x07*\x02\x02\u0814\u0815\x07\x1F\x02\x02\u0815\u0817\x05" +
		"\u0138\x9D\x02\u0816\u0818\x05\xF6|\x02\u0817\u0816\x03\x02\x02\x02\u0817" +
		"\u0818\x03\x02\x02\x02\u0818\u081A\x03\x02\x02\x02\u0819\u081B\x05\u0100" +
		"\x81\x02\u081A\u0819\x03\x02\x02\x02\u081A\u081B\x03\x02\x02\x02\u081B" +
		"\xB1\x03\x02\x02\x02\u081C\u081E\x05\xECw\x02\u081D\u081C\x03\x02\x02" +
		"\x02\u081D\u081E\x03\x02\x02\x02\u081E\u0822\x03\x02\x02\x02\u081F\u0821" +
		"\x05\xEEx\x02\u0820\u081F\x03\x02\x02\x02\u0821\u0824\x03\x02\x02\x02" +
		"\u0822\u0820\x03\x02\x02\x02\u0822\u0823\x03\x02\x02\x02\u0823\u0825\x03" +
		"\x02\x02\x02\u0824\u0822\x03\x02\x02\x02\u0825\u0826\x07*\x02\x02\u0826" +
		"\u0828\x05\u0138\x9D\x02\u0827\u0829\x05\xF0y\x02\u0828\u0827\x03\x02" +
		"\x02\x02\u0828\u0829\x03\x02\x02\x02\u0829\u082B\x03\x02\x02\x02\u082A" +
		"\u082C\x05\xF6|\x02\u082B\u082A\x03\x02\x02\x02\u082B\u082C\x03\x02\x02" +
		"\x02\u082C\u082E\x03\x02\x02\x02\u082D\u082F\x05\xF8}\x02\u082E\u082D" +
		"\x03\x02\x02\x02\u082E\u082F\x03\x02\x02\x02\u082F\u0831\x03\x02\x02\x02" +
		"\u0830\u0832\x05\u0100\x81\x02\u0831\u0830\x03\x02\x02\x02\u0831\u0832" +
		"\x03\x02\x02\x02\u0832\xB3\x03\x02\x02\x02\u0833\u0835\x05\xECw\x02\u0834" +
		"\u0833\x03\x02\x02\x02\u0834\u0835\x03\x02\x02\x02\u0835\u0839\x03\x02" +
		"\x02\x02\u0836\u0838\x05\xEEx\x02\u0837\u0836\x03\x02\x02\x02\u0838\u083B" +
		"\x03\x02\x02\x02\u0839\u0837\x03\x02\x02\x02\u0839\u083A\x03\x02\x02\x02" +
		"\u083A\u083C\x03\x02\x02\x02\u083B\u0839\x03\x02\x02\x02\u083C\u083D\x07" +
		"\x1E\x02\x02\u083D\u083E\x07\x1F\x02\x02\u083E\u0840\x05\u0138\x9D\x02" +
		"\u083F\u0841\x05\xF6|\x02\u0840\u083F\x03\x02\x02\x02\u0840\u0841\x03" +
		"\x02\x02\x02\u0841\u0843\x03\x02\x02\x02\u0842\u0844\x05\u0100\x81\x02" +
		"\u0843\u0842\x03\x02\x02\x02\u0843\u0844\x03\x02\x02\x02\u0844\xB5\x03" +
		"\x02\x02\x02\u0845\u0847\x05\xECw\x02\u0846\u0845\x03\x02\x02\x02\u0846" +
		"\u0847\x03\x02\x02\x02\u0847\u084B\x03\x02\x02\x02\u0848\u084A\x05\xEE" +
		"x\x02\u0849\u0848\x03\x02\x02\x02\u084A\u084D\x03\x02\x02\x02\u084B\u0849" +
		"\x03\x02\x02\x02\u084B\u084C\x03\x02\x02\x02\u084C\u084E\x03\x02\x02\x02" +
		"\u084D\u084B\x03\x02\x02\x02\u084E\u084F\x07\x1E\x02\x02\u084F\u0851\x05" +
		"\u0138\x9D\x02\u0850\u0852\x05\xF0y\x02\u0851\u0850\x03\x02\x02\x02\u0851" +
		"\u0852\x03\x02\x02\x02\u0852\u0854\x03\x02\x02\x02\u0853\u0855\x05\xF6" +
		"|\x02\u0854\u0853\x03\x02\x02\x02\u0854\u0855\x03\x02\x02\x02\u0855\u0857" +
		"\x03\x02\x02\x02\u0856\u0858\x05\xF8}\x02\u0857\u0856\x03\x02\x02\x02" +
		"\u0857\u0858\x03\x02\x02\x02\u0858\u085A\x03\x02\x02\x02\u0859\u085B\x05" +
		"\u0100\x81\x02\u085A\u0859\x03\x02\x02\x02\u085A\u085B\x03\x02\x02\x02" +
		"\u085B\xB7\x03\x02\x02\x02\u085C\u085E\x05\xECw\x02\u085D\u085C\x03\x02" +
		"\x02\x02\u085D\u085E\x03\x02\x02\x02\u085E\u0862\x03\x02\x02\x02\u085F" +
		"\u0861\x05\xEEx\x02\u0860\u085F\x03\x02\x02\x02\u0861\u0864\x03\x02\x02" +
		"\x02\u0862\u0860\x03\x02\x02\x02\u0862\u0863\x03\x02\x02\x02\u0863\u0865" +
		"\x03\x02\x02\x02\u0864\u0862\x03\x02\x02\x02\u0865\u0866\x07\x0F\x02\x02" +
		"\u0866\u0867\x07\x1F\x02\x02\u0867\u0869\x05\u0138\x9D\x02\u0868\u086A" +
		"\x05\xF6|\x02\u0869\u0868\x03\x02\x02\x02\u0869\u086A\x03\x02\x02\x02" +
		"\u086A\u086C\x03\x02\x02\x02\u086B\u086D\x05\u0100\x81\x02\u086C\u086B" +
		"\x03\x02\x02\x02\u086C\u086D\x03\x02\x02\x02\u086D\xB9\x03\x02\x02\x02" +
		"\u086E\u0870\x05\xECw\x02\u086F\u086E\x03\x02\x02\x02\u086F\u0870\x03" +
		"\x02\x02\x02\u0870\u0874\x03\x02\x02\x02\u0871\u0873\x05\xEEx\x02\u0872" +
		"\u0871\x03\x02\x02\x02\u0873\u0876\x03\x02\x02\x02\u0874\u0872\x03\x02" +
		"\x02\x02\u0874\u0875\x03\x02\x02\x02\u0875\u0877\x03\x02\x02\x02\u0876" +
		"\u0874\x03\x02\x02\x02\u0877\u0878\x07\x0F\x02\x02\u0878\u087A\x05\u0138" +
		"\x9D\x02\u0879\u087B\x05\xF0y\x02\u087A\u0879\x03\x02\x02\x02\u087A\u087B" +
		"\x03\x02\x02\x02\u087B\u087D\x03\x02\x02\x02\u087C\u087E\x05\xF6|\x02" +
		"\u087D\u087C\x03\x02\x02\x02\u087D\u087E\x03\x02\x02\x02\u087E\u0880\x03" +
		"\x02\x02\x02\u087F\u0881\x05\xF8}\x02\u0880\u087F\x03\x02\x02\x02\u0880" +
		"\u0881\x03\x02\x02\x02\u0881\u0883\x03\x02\x02\x02\u0882\u0884\x05\u0100" +
		"\x81\x02\u0883\u0882\x03\x02\x02\x02\u0883\u0884\x03\x02\x02\x02\u0884" +
		"\xBB\x03\x02\x02\x02\u0885\u0887\x05\xECw\x02\u0886\u0885\x03\x02\x02" +
		"\x02\u0886\u0887\x03\x02\x02\x02\u0887\u088B\x03\x02\x02\x02\u0888\u088A" +
		"\x05\xEEx\x02\u0889\u0888\x03\x02\x02\x02\u088A\u088D\x03\x02\x02\x02" +
		"\u088B\u0889\x03\x02\x02\x02\u088B\u088C\x03\x02\x02\x02\u088C\u088E\x03" +
		"\x02\x02\x02\u088D\u088B\x03\x02\x02\x02\u088E\u088F\x07F\x02\x02\u088F" +
		"\u0894\x07\x1F\x02\x02\u0890\u0891\x07\x95\x02\x02\u0891\u0892\x05\u0138" +
		"\x9D\x02\u0892\u0893\x07\x96\x02\x02\u0893\u0895\x03\x02\x02\x02\u0894" +
		"\u0890\x03\x02\x02\x02\u0894\u0895\x03\x02\x02\x02\u0895\u0896\x03\x02" +
		"\x02\x02\u0896\u0898\x05\u0138\x9D\x02\u0897\u0899\x05\xF6|\x02\u0898" +
		"\u0897\x03\x02\x02\x02\u0898\u0899\x03\x02\x02\x02\u0899\u089B\x03\x02" +
		"\x02\x02\u089A\u089C\x05\u0100\x81\x02\u089B\u089A\x03\x02\x02\x02\u089B" +
		"\u089C\x03\x02\x02\x02\u089C\xBD\x03\x02\x02\x02\u089D\u089F\x05\xECw" +
		"\x02\u089E\u089D\x03\x02\x02\x02\u089E\u089F\x03\x02\x02\x02\u089F\u08A3" +
		"\x03\x02\x02\x02\u08A0\u08A2\x05\xEEx\x02\u08A1\u08A0\x03\x02\x02\x02" +
		"\u08A2\u08A5\x03\x02\x02\x02\u08A3\u08A1\x03\x02\x02\x02\u08A3\u08A4\x03" +
		"\x02\x02\x02\u08A4\u08A6\x03\x02\x02\x02\u08A5\u08A3\x03\x02\x02\x02\u08A6" +
		"\u08A7\x07F\x02\x02\u08A7\u08A9\x05\u0138\x9D\x02\u08A8\u08AA\x05\xF0" +
		"y\x02\u08A9\u08A8\x03\x02\x02\x02\u08A9\u08AA\x03\x02\x02\x02\u08AA\u08AC" +
		"\x03\x02\x02\x02\u08AB\u08AD\x05\xF6|\x02\u08AC\u08AB\x03\x02\x02\x02" +
		"\u08AC\u08AD\x03\x02\x02\x02\u08AD\u08AF\x03\x02\x02\x02\u08AE\u08B0\x05" +
		"\xF8}\x02\u08AF\u08AE\x03\x02\x02\x02\u08AF\u08B0\x03\x02\x02\x02\u08B0" +
		"\u08B2\x03\x02\x02\x02\u08B1\u08B3\x05\u0100\x81\x02\u08B2\u08B1\x03\x02" +
		"\x02\x02\u08B2\u08B3\x03\x02\x02\x02\u08B3\xBF\x03\x02\x02\x02\u08B4\u08B5" +
		"\x07\x9D\x02\x02\u08B5\u08B8\x05\u0136\x9C\x02\u08B6\u08B7\x07\x03\x02" +
		"\x02\u08B7\u08B9\x05\u0136\x9C\x02\u08B8\u08B6\x03\x02\x02\x02\u08B8\u08B9" +
		"\x03\x02\x02\x02\u08B9\u08BC\x03\x02\x02\x02\u08BA\u08BD\x05\u0100\x81" +
		"\x02\u08BB\u08BD\x07\x8B\x02\x02\u08BC\u08BA\x03\x02\x02\x02\u08BC\u08BB" +
		"\x03\x02\x02\x02\u08BC\u08BD\x03\x02\x02\x02\u08BD\xC1\x03\x02\x02\x02" +
		"\u08BE\u08C0\x05\xECw\x02\u08BF\u08BE\x03\x02\x02\x02\u08BF\u08C0\x03" +
		"\x02\x02\x02\u08C0\u08C1\x03\x02\x02\x02\u08C1\u08C4\x07\x19\x02\x02\u08C2" +
		"\u08C3\x07\x03\x02\x02\u08C3\u08C5\x05\u0136\x9C\x02\u08C4\u08C2\x03\x02" +
		"\x02\x02\u08C4\u08C5\x03\x02\x02\x02\u08C5\u08C7\x03\x02\x02\x02\u08C6" +
		"\u08C8\x05\u0138\x9D\x02\u08C7\u08C6\x03\x02\x02\x02\u08C7\u08C8\x03\x02" +
		"\x02\x02\u08C8\u08CA\x03\x02\x02\x02\u08C9\u08CB\x05\u0130\x99\x02\u08CA" +
		"\u08C9\x03\x02\x02\x02\u08CA\u08CB\x03\x02\x02\x02\u08CB\u08CD\x03\x02" +
		"\x02\x02\u08CC\u08CE\x05\u0100\x81\x02\u08CD\u08CC\x03\x02\x02\x02\u08CD" +
		"\u08CE\x03\x02\x02\x02\u08CE\xC3\x03\x02\x02\x02\u08CF\u08D1\x05\xECw" +
		"\x02\u08D0\u08CF\x03\x02\x02\x02\u08D0\u08D1\x03\x02\x02\x02\u08D1\u08D2" +
		"\x03\x02\x02\x02\u08D2\u08D4\x07&\x02\x02\u08D3\u08D5\x05\u0138\x9D\x02" +
		"\u08D4\u08D3\x03\x02\x02\x02\u08D4\u08D5\x03\x02\x02\x02\u08D5\u08D6\x03" +
		"\x02\x02\x02\u08D6\u08D8\x05\u0130\x99\x02\u08D7\u08D9\x05\u0100\x81\x02" +
		"\u08D8\u08D7\x03\x02\x02\x02\u08D8\u08D9\x03\x02\x02\x02\u08D9\xC5\x03" +
		"\x02\x02\x02\u08DA\u08DC\x05\xECw\x02\u08DB\u08DA\x03\x02\x02\x02\u08DB" +
		"\u08DC\x03\x02\x02\x02\u08DC\u08DD\x03\x02\x02\x02\u08DD\u08DE\x07\x15" +
		"\x02\x02\u08DE\u08DF\x07\x1F\x02\x02\u08DF\u08E1\x05\u0138\x9D\x02\u08E0" +
		"\u08E2\x05\u0108\x85\x02\u08E1\u08E0\x03\x02\x02\x02\u08E1\u08E2\x03\x02" +
		"\x02\x02\u08E2\u08E4\x03\x02\x02\x02\u08E3\u08E5\x05\u0100\x81\x02\u08E4" +
		"\u08E3\x03\x02\x02\x02\u08E4\u08E5\x03\x02\x02\x02\u08E5\xC7\x03\x02\x02" +
		"\x02\u08E6\u08E8\x05\xECw\x02\u08E7\u08E6\x03\x02\x02\x02\u08E7\u08E8" +
		"\x03\x02\x02\x02\u08E8\u08E9\x03\x02\x02\x02\u08E9\u08EC\x07\x15\x02\x02" +
		"\u08EA\u08EB\x07}\x02\x02\u08EB\u08ED\x05\u0136\x9C\x02\u08EC\u08EA\x03" +
		"\x02\x02\x02\u08EC\u08ED\x03\x02\x02\x02\u08ED\u08EF\x03\x02\x02\x02\u08EE" +
		"\u08F0\x05\u0100\x81\x02\u08EF\u08EE\x03\x02\x02\x02\u08EF\u08F0\x03\x02" +
		"\x02\x02\u08F0\xC9\x03\x02\x02\x02\u08F1\u08F3\x05\xECw\x02\u08F2\u08F1" +
		"\x03\x02\x02\x02\u08F2\u08F3\x03\x02\x02\x02\u08F3\u08F7\x03\x02\x02\x02" +
		"\u08F4\u08F6\x05\xEEx\x02\u08F5\u08F4\x03\x02\x02\x02\u08F6\u08F9\x03" +
		"\x02\x02\x02\u08F7\u08F5\x03\x02\x02\x02\u08F7\u08F8\x03\x02\x02\x02\u08F8" +
		"\u08FA\x03\x02\x02\x02\u08F9\u08F7\x03\x02\x02\x02\u08FA\u08FB\x07?\x02" +
		"\x02\u08FB\u08FC\x07\x1F\x02\x02\u08FC\u08FE\x05\u0138\x9D\x02\u08FD\u08FF" +
		"\x05\xF6|\x02\u08FE\u08FD\x03\x02\x02\x02\u08FE\u08FF\x03\x02\x02\x02" +
		"\u08FF\u0901\x03\x02\x02\x02\u0900\u0902\x05\u0100\x81\x02\u0901\u0900" +
		"\x03\x02\x02\x02\u0901\u0902\x03\x02\x02\x02\u0902\xCB\x03\x02\x02\x02" +
		"\u0903\u0905\x05\xECw\x02\u0904\u0903\x03\x02\x02\x02\u0904\u0905\x03" +
		"\x02\x02\x02\u0905\u0909\x03\x02\x02\x02\u0906\u0908\x05\xEEx\x02\u0907" +
		"\u0906\x03\x02\x02\x02\u0908\u090B\x03\x02\x02\x02\u0909\u0907\x03\x02" +
		"\x02\x02\u0909\u090A\x03\x02\x02\x02\u090A\u090C\x03\x02\x02\x02\u090B" +
		"\u0909\x03\x02\x02\x02\u090C\u090D\x07?\x02\x02\u090D\u090F\x05\u0138" +
		"\x9D\x02\u090E\u0910\x05\xF0y\x02\u090F\u090E\x03\x02\x02\x02\u090F\u0910" +
		"\x03\x02\x02\x02\u0910\u0912\x03\x02\x02\x02\u0911\u0913\x05\xF6|\x02" +
		"\u0912\u0911\x03\x02\x02\x02\u0912\u0913\x03\x02\x02\x02\u0913\u0915\x03" +
		"\x02\x02\x02\u0914\u0916\x05\xF8}\x02\u0915\u0914\x03\x02\x02\x02\u0915" +
		"\u0916\x03\x02\x02\x02\u0916\u0918\x03\x02\x02\x02\u0917\u0919\x05\u0100" +
		"\x81\x02\u0918\u0917\x03\x02\x02\x02\u0918\u0919\x03\x02\x02\x02\u0919" +
		"\xCD\x03\x02\x02\x02\u091A\u091C\x05\xECw\x02\u091B\u091A\x03\x02\x02" +
		"\x02\u091B\u091C\x03\x02\x02\x02\u091C\u0920\x03\x02\x02\x02\u091D\u091F" +
		"\x05\xEEx\x02\u091E\u091D\x03\x02\x02\x02\u091F\u0922\x03\x02\x02\x02" +
		"\u0920\u091E\x03\x02\x02\x02\u0920\u0921\x03\x02\x02\x02\u0921\u0923\x03" +
		"\x02\x02\x02\u0922\u0920\x03\x02\x02\x02\u0923\u0924\x07T\x02\x02\u0924" +
		"\u0926\x05\u0138\x9D\x02\u0925\u0927\x05\xF0y\x02\u0926\u0925\x03\x02" +
		"\x02\x02\u0926\u0927\x03\x02\x02\x02\u0927\u0929\x03\x02\x02\x02\u0928" +
		"\u092A\x05\xF6|\x02\u0929\u0928\x03\x02\x02\x02\u0929\u092A\x03\x02\x02" +
		"\x02\u092A\u092C\x03\x02\x02\x02\u092B\u092D\x05\xF8}\x02\u092C\u092B" +
		"\x03\x02\x02\x02\u092C\u092D\x03\x02\x02\x02\u092D\u092F\x03\x02\x02\x02" +
		"\u092E\u0930\x05\u0100\x81\x02\u092F\u092E\x03\x02\x02\x02\u092F\u0930" +
		"\x03\x02\x02\x02\u0930\xCF\x03\x02\x02\x02\u0931\u0933\x05\xECw\x02\u0932" +
		"\u0931\x03\x02\x02\x02\u0932\u0933\x03\x02\x02\x02\u0933\u0937\x03\x02" +
		"\x02\x02\u0934\u0936\x05\xEEx\x02\u0935\u0934\x03\x02\x02\x02\u0936\u0939" +
		"\x03\x02\x02\x02\u0937\u0935\x03\x02\x02\x02\u0937\u0938\x03\x02\x02\x02" +
		"\u0938\u093A\x03\x02\x02\x02\u0939\u0937\x03\x02\x02\x02\u093A\u093B\x07" +
		"D\x02\x02\u093B\u093C\x05\u0138\x9D\x02\u093C\u093D\x07M\x02\x02\u093D" +
		"\u093E\x05\u0136\x9C\x02\u093E\u093F\x07\x8B\x02\x02\u093F\u0969\x03\x02" +
		"\x02\x02\u0940\u0942\x05\xECw\x02\u0941\u0940\x03\x02\x02\x02\u0941\u0942" +
		"\x03\x02\x02\x02\u0942\u0946\x03\x02\x02\x02\u0943\u0945\x05\xEEx\x02" +
		"\u0944\u0943\x03\x02\x02\x02\u0945\u0948\x03\x02\x02\x02\u0946\u0944\x03" +
		"\x02\x02\x02\u0946\u0947\x03\x02\x02\x02\u0947\u0949\x03\x02\x02\x02\u0948" +
		"\u0946\x03\x02\x02\x02\u0949\u094A\x07D\x02\x02\u094A\u094B\x05\u0138" +
		"\x9D\x02\u094B\u094D\x05\xD2j\x02\u094C\u094E\x05\u0100\x81\x02\u094D" +
		"\u094C\x03\x02\x02\x02\u094D\u094E\x03\x02\x02\x02\u094E\u0969\x03\x02" +
		"\x02\x02\u094F\u0951\x05\xECw\x02\u0950\u094F\x03\x02\x02\x02\u0950\u0951" +
		"\x03\x02\x02\x02\u0951\u0955\x03\x02\x02\x02\u0952\u0954\x05\xEEx\x02" +
		"\u0953\u0952\x03\x02\x02\x02\u0954\u0957\x03\x02\x02\x02\u0955\u0953\x03" +
		"\x02\x02\x02\u0955\u0956\x03\x02\x02\x02\u0956\u0958\x03\x02\x02\x02\u0957" +
		"\u0955\x03\x02\x02\x02\u0958\u095A\x07D\x02\x02\u0959\u095B\x05\u0138" +
		"\x9D\x02\u095A\u0959\x03\x02\x02\x02\u095A\u095B\x03\x02\x02\x02\u095B" +
		"\u095C\x03\x02\x02\x02\u095C\u095D\x07M\x02\x02\u095D\u095F\x05\u0136" +
		"\x9C\x02\u095E\u0960\x05\xF0y\x02\u095F\u095E\x03\x02\x02\x02\u095F\u0960" +
		"\x03\x02\x02\x02\u0960\u0961\x03\x02\x02\x02\u0961\u0962\x077\x02\x02" +
		"\u0962\u0963\x05\u0136\x9C\x02\u0963\u0964\x07o\x02\x02\u0964\u0966\x05" +
		"\u0136\x9C\x02\u0965\u0967\x07\x8B\x02\x02\u0966\u0965\x03\x02\x02\x02" +
		"\u0966\u0967\x03\x02\x02\x02\u0967\u0969\x03\x02\x02\x02\u0968\u0932\x03" +
		"\x02\x02\x02\u0968\u0941\x03\x02\x02\x02\u0968\u0950\x03\x02\x02\x02\u0969" +
		"\xD1\x03\x02\x02\x02\u096A\u096B\x07\x8A\x02\x02\u096B\u096C\x07e\x02" +
		"\x02\u096C\u096D\x077\x02\x02\u096D\u096E\x05\u0138\x9D\x02\u096E\u096F" +
		"\x07o\x02\x02\u096F\u0970\x05\u0138\x9D\x02\u0970\u0974\x03\x02\x02\x02" +
		"\u0971\u0972\x07\x8A\x02\x02\u0972\u0974\x05\u0138\x9D\x02\u0973\u096A" +
		"\x03\x02\x02\x02\u0973\u0971\x03\x02\x02\x02\u0974\xD3\x03\x02\x02\x02" +
		"\u0975\u0977\x05\xECw\x02\u0976\u0975\x03\x02\x02\x02\u0976\u0977\x03" +
		"\x02\x02\x02\u0977\u097B\x03\x02\x02\x02\u0978\u097A\x05\xEEx\x02\u0979" +
		"\u0978\x03\x02\x02\x02\u097A\u097D\x03\x02\x02\x02\u097B\u0979\x03\x02" +
		"\x02\x02\u097B\u097C\x03\x02\x02\x02\u097C\u097E\x03\x02\x02\x02\u097D" +
		"\u097B\x03\x02\x02\x02\u097E\u097F\x07V\x02\x02\u097F\u0981\x05\u0138" +
		"\x9D\x02\u0980\u0982\x05\xF0y\x02\u0981\u0980\x03\x02\x02\x02\u0981\u0982" +
		"\x03\x02\x02\x02\u0982\u0984\x03\x02\x02\x02\u0983\u0985\x05\xF6|\x02" +
		"\u0984\u0983\x03\x02\x02\x02\u0984\u0985\x03\x02\x02\x02\u0985\u0987\x03" +
		"\x02\x02\x02\u0986\u0988\x05\xF8}\x02\u0987\u0986\x03\x02\x02\x02\u0987" +
		"\u0988\x03\x02\x02\x02\u0988\u098A\x03\x02\x02\x02\u0989\u098B\x05\u0100" +
		"\x81\x02\u098A\u0989\x03\x02\x02\x02\u098A\u098B\x03\x02\x02\x02\u098B" +
		"\xD5\x03\x02\x02\x02\u098C\u098E\x05\xECw\x02\u098D\u098C\x03\x02\x02" +
		"\x02\u098D\u098E\x03\x02\x02\x02\u098E\u0992\x03\x02\x02\x02\u098F\u0991" +
		"\x05\xEEx\x02\u0990\u098F\x03\x02\x02\x02\u0991\u0994\x03\x02\x02\x02" +
		"\u0992\u0990\x03\x02\x02\x02\u0992\u0993\x03\x02\x02\x02\u0993\u0995\x03" +
		"\x02\x02\x02\u0994\u0992\x03\x02\x02\x02\u0995\u0996\x07L\x02\x02\u0996" +
		"\u0998\x05\u0138\x9D\x02\u0997\u0999\x05\xF0y\x02\u0998\u0997\x03\x02" +
		"\x02\x02\u0998\u0999\x03\x02\x02\x02\u0999\u099B\x03\x02\x02\x02\u099A" +
		"\u099C\x05\xF6|\x02\u099B\u099A\x03\x02\x02\x02\u099B\u099C\x03\x02\x02" +
		"\x02\u099C\u099E\x03\x02\x02\x02\u099D\u099F\x05\xF8}\x02\u099E\u099D" +
		"\x03\x02\x02\x02\u099E\u099F\x03\x02\x02\x02\u099F\u09A3\x03\x02\x02\x02" +
		"\u09A0\u09A2\x05\xEEx\x02\u09A1\u09A0\x03\x02\x02\x02\u09A2\u09A5\x03" +
		"\x02\x02\x02\u09A3\u09A1\x03\x02\x02\x02\u09A3\u09A4\x03\x02\x02\x02\u09A4" +
		"\u09A7\x03\x02\x02\x02\u09A5\u09A3\x03\x02\x02\x02\u09A6\u09A8\x05\u0100" +
		"\x81\x02\u09A7\u09A6\x03\x02\x02\x02\u09A7\u09A8\x03\x02\x02\x02\u09A8" +
		"\xD7\x03\x02\x02\x02\u09A9\u09AB\x05\xECw\x02\u09AA\u09A9\x03\x02\x02" +
		"\x02\u09AA\u09AB\x03\x02\x02\x02\u09AB";
	private static readonly _serializedATNSegment5: string =
		"\u09AF\x03\x02\x02\x02\u09AC\u09AE\x05\xEEx\x02\u09AD\u09AC\x03\x02\x02" +
		"\x02\u09AE\u09B1\x03\x02\x02\x02\u09AF\u09AD\x03\x02\x02\x02\u09AF\u09B0" +
		"\x03\x02\x02\x02\u09B0\u09B2\x03\x02\x02\x02\u09B1\u09AF\x03\x02\x02\x02" +
		"\u09B2\u09B3\x07\f\x02\x02\u09B3\u09B5\x05\u0138\x9D\x02\u09B4\u09B6\x05" +
		"\u0100\x81\x02\u09B5\u09B4\x03\x02\x02\x02\u09B5\u09B6\x03\x02\x02\x02" +
		"\u09B6\xD9\x03\x02\x02\x02\u09B7\u09B9\x05\xECw\x02\u09B8\u09B7\x03\x02" +
		"\x02\x02\u09B8\u09B9\x03\x02\x02\x02\u09B9\u09BD\x03\x02\x02\x02\u09BA" +
		"\u09BC\x05\xEEx\x02\u09BB\u09BA\x03\x02\x02\x02\u09BC\u09BF\x03\x02\x02" +
		"\x02\u09BD\u09BB\x03\x02\x02\x02\u09BD\u09BE\x03\x02\x02\x02\u09BE\u09C0" +
		"\x03\x02\x02\x02\u09BF\u09BD\x03\x02\x02\x02\u09C0\u09C2\x07\'\x02\x02" +
		"\u09C1\u09C3\x05\u0138\x9D\x02\u09C2\u09C1\x03\x02\x02\x02\u09C2\u09C3" +
		"\x03\x02\x02\x02\u09C3\u09C5\x03\x02\x02\x02\u09C4\u09C6\x05\u0100\x81" +
		"\x02\u09C5\u09C4\x03\x02\x02\x02\u09C5\u09C6\x03\x02\x02\x02\u09C6\xDB" +
		"\x03\x02\x02\x02\u09C7\u09C9\x05\xECw\x02\u09C8\u09C7\x03\x02\x02\x02" +
		"\u09C8\u09C9\x03\x02\x02\x02\u09C9\u09CD\x03\x02\x02\x02\u09CA\u09CC\x05" +
		"\xEEx\x02\u09CB\u09CA\x03\x02\x02\x02\u09CC\u09CF\x03\x02\x02\x02\u09CD" +
		"\u09CB\x03\x02\x02\x02\u09CD\u09CE\x03\x02\x02\x02\u09CE\u09D0\x03\x02" +
		"\x02\x02\u09CF\u09CD\x03\x02\x02\x02\u09D0\u09D1\x071\x02\x02\u09D1\u09D3" +
		"\x05\u0138\x9D\x02\u09D2\u09D4\x05\xF0y\x02\u09D3\u09D2\x03\x02\x02\x02" +
		"\u09D3\u09D4\x03\x02\x02\x02\u09D4\u09D6\x03\x02\x02\x02\u09D5\u09D7\x05" +
		"\xF6|\x02\u09D6\u09D5\x03\x02\x02\x02\u09D6\u09D7\x03\x02\x02\x02\u09D7" +
		"\u09D9\x03\x02\x02\x02\u09D8\u09DA\x05\xF8}\x02\u09D9\u09D8\x03\x02\x02" +
		"\x02\u09D9\u09DA\x03\x02\x02\x02\u09DA\u09DD\x03\x02\x02\x02\u09DB\u09DE" +
		"\x05\u0100\x81\x02\u09DC\u09DE\x07\x8B\x02\x02\u09DD\u09DB\x03\x02\x02" +
		"\x02\u09DD\u09DC\x03\x02\x02\x02\u09DD\u09DE\x03\x02\x02\x02\u09DE\u09FB" +
		"\x03\x02\x02\x02\u09DF\u09E1\x05\xECw\x02\u09E0\u09DF\x03\x02\x02\x02" +
		"\u09E0\u09E1\x03\x02\x02\x02\u09E1\u09E5\x03\x02\x02\x02\u09E2\u09E4\x05" +
		"\xEEx\x02\u09E3\u09E2\x03\x02\x02\x02\u09E4\u09E7\x03\x02\x02\x02\u09E5" +
		"\u09E3\x03\x02\x02\x02\u09E5\u09E6\x03\x02\x02\x02\u09E6\u09E8\x03\x02" +
		"\x02\x02\u09E7\u09E5\x03\x02\x02\x02\u09E8\u09EA\x07^\x02\x02\u09E9\u09EB" +
		"\x071\x02\x02\u09EA\u09E9\x03\x02\x02\x02\u09EA\u09EB\x03\x02\x02\x02" +
		"\u09EB\u09EC\x03\x02\x02\x02\u09EC\u09EE\x05\u0138\x9D\x02\u09ED\u09EF" +
		"\x05\xF0y\x02\u09EE\u09ED\x03\x02\x02\x02\u09EE\u09EF\x03\x02\x02\x02" +
		"\u09EF\u09F1\x03\x02\x02\x02\u09F0\u09F2\x05\xF6|\x02\u09F1\u09F0\x03" +
		"\x02\x02\x02\u09F1\u09F2\x03\x02\x02\x02\u09F2\u09F4\x03\x02\x02\x02\u09F3" +
		"\u09F5\x05\xF8}\x02\u09F4\u09F3\x03\x02\x02\x02\u09F4\u09F5\x03\x02\x02" +
		"\x02\u09F5\u09F8\x03\x02\x02\x02\u09F6\u09F9\x05\u0100\x81\x02\u09F7\u09F9" +
		"\x07\x8B\x02\x02\u09F8\u09F6\x03\x02\x02\x02\u09F8\u09F7\x03\x02\x02\x02" +
		"\u09F8\u09F9\x03\x02\x02\x02\u09F9\u09FB\x03\x02\x02\x02\u09FA\u09C8\x03" +
		"\x02\x02\x02\u09FA\u09E0\x03\x02\x02\x02\u09FB\xDD\x03\x02\x02\x02\u09FC" +
		"\u09FE\x05\xE8u\x02\u09FD\u09FC\x03\x02\x02\x02\u09FD\u09FE\x03\x02\x02" +
		"\x02\u09FE\u09FF\x03\x02\x02\x02\u09FF\u0A01\x05\u0138\x9D\x02\u0A00\u0A02" +
		"\x05\xF0y\x02\u0A01\u0A00\x03\x02\x02\x02\u0A01\u0A02\x03\x02\x02\x02" +
		"\u0A02\u0A04\x03\x02\x02\x02\u0A03\u0A05\x05\xF6|\x02\u0A04\u0A03\x03" +
		"\x02\x02\x02\u0A04\u0A05\x03\x02\x02\x02\u0A05\u0A07\x03\x02\x02\x02\u0A06" +
		"\u0A08\x05\xF8}\x02\u0A07\u0A06\x03\x02\x02\x02\u0A07\u0A08\x03\x02\x02" +
		"\x02\u0A08\u0A0A\x03\x02\x02\x02\u0A09\u0A0B\x05^0\x02\u0A0A\u0A09\x03" +
		"\x02\x02\x02\u0A0A\u0A0B\x03\x02\x02\x02\u0A0B\u0A0E\x03\x02\x02\x02\u0A0C" +
		"\u0A0F\x05\u0100\x81\x02\u0A0D\u0A0F\x07\x8B\x02\x02\u0A0E\u0A0C\x03\x02" +
		"\x02\x02\u0A0E\u0A0D\x03\x02\x02\x02\u0A0E\u0A0F\x03\x02\x02\x02\u0A0F" +
		"\xDF\x03\x02\x02\x02\u0A10\u0A12\x05\xECw\x02\u0A11\u0A10\x03\x02\x02" +
		"\x02\u0A11\u0A12\x03\x02\x02\x02\u0A12\u0A16\x03\x02\x02\x02\u0A13\u0A15" +
		"\x05\xEEx\x02\u0A14\u0A13\x03\x02\x02\x02\u0A15\u0A18\x03\x02\x02\x02" +
		"\u0A16\u0A14\x03\x02\x02\x02\u0A16\u0A17\x03\x02\x02\x02\u0A17\u0A19\x03" +
		"\x02\x02\x02\u0A18\u0A16\x03\x02\x02\x02\u0A19\u0A1C\x078\x02\x02\u0A1A" +
		"\u0A1D\x05\u0138\x9D\x02\u0A1B\u0A1D\x05\u0130\x99\x02\u0A1C\u0A1A\x03" +
		"\x02\x02\x02\u0A1C\u0A1B\x03\x02\x02\x02\u0A1D\u0A1F\x03\x02\x02\x02\u0A1E" +
		"\u0A20\x05\xE2r\x02\u0A1F\u0A1E\x03\x02\x02\x02\u0A1F\u0A20\x03\x02\x02" +
		"\x02\u0A20\u0A22\x03\x02\x02\x02\u0A21\u0A23\x05\u0100\x81\x02\u0A22\u0A21" +
		"\x03\x02\x02\x02\u0A22\u0A23\x03\x02\x02\x02\u0A23\xE1\x03\x02\x02\x02" +
		"\u0A24\u0A26\x07\x8F\x02\x02\u0A25\u0A27\x05\xE4s\x02\u0A26\u0A25\x03" +
		"\x02\x02\x02\u0A26\u0A27\x03\x02\x02\x02\u0A27\u0A28\x03\x02\x02\x02\u0A28" +
		"\u0A2A\x07\x90\x02\x02\u0A29\u0A2B\x05\xEAv\x02\u0A2A\u0A29\x03\x02\x02" +
		"\x02\u0A2A\u0A2B\x03\x02\x02\x02\u0A2B\xE3\x03\x02\x02\x02\u0A2C\u0A31" +
		"\x05\xE6t\x02\u0A2D\u0A2E\x07\x8C\x02\x02\u0A2E\u0A30\x05\xE6t\x02\u0A2F" +
		"\u0A2D\x03\x02\x02\x02\u0A30\u0A33\x03\x02\x02\x02\u0A31\u0A2F\x03\x02" +
		"\x02\x02\u0A31\u0A32\x03\x02\x02\x02\u0A32\xE5\x03\x02\x02\x02\u0A33\u0A31" +
		"\x03\x02\x02\x02\u0A34\u0A36\x05\xECw\x02\u0A35\u0A34\x03\x02\x02\x02" +
		"\u0A35\u0A36\x03\x02\x02\x02\u0A36\u0A38\x03\x02\x02\x02\u0A37\u0A39\x05" +
		"\xE8u\x02\u0A38\u0A37\x03\x02\x02\x02\u0A38\u0A39\x03\x02\x02\x02\u0A39" +
		"\u0A3A\x03\x02\x02\x02\u0A3A\u0A3C\x05\u0138\x9D\x02\u0A3B\u0A3D\x05\xF0" +
		"y\x02\u0A3C\u0A3B\x03\x02\x02\x02\u0A3C\u0A3D\x03\x02\x02\x02\u0A3D\u0A3F" +
		"\x03\x02\x02\x02\u0A3E\u0A40\x05\xF8}\x02\u0A3F\u0A3E\x03\x02\x02\x02" +
		"\u0A3F\u0A40\x03\x02\x02\x02\u0A40\u0A43\x03\x02\x02\x02\u0A41\u0A44\x05" +
		"\u0100\x81\x02\u0A42\u0A44\x07\x8B\x02\x02\u0A43\u0A41\x03\x02\x02\x02" +
		"\u0A43\u0A42\x03\x02\x02\x02\u0A43\u0A44\x03\x02\x02\x02\u0A44\xE7\x03" +
		"\x02\x02\x02\u0A45\u0A46\t\b\x02\x02\u0A46\xE9\x03\x02\x02\x02\u0A47\u0A48" +
		"\x07b\x02\x02\u0A48\u0A49\x07\x8A\x02\x02\u0A49\u0A57\x05\u0136\x9C\x02" +
		"\u0A4A\u0A4B\x07\x91\x02\x02\u0A4B\u0A4C\x07b\x02\x02\u0A4C\u0A4D\x07" +
		"\x8A\x02\x02\u0A4D\u0A4F\x05\u0136\x9C\x02\u0A4E\u0A50\x05\xF8}\x02\u0A4F" +
		"\u0A4E\x03\x02\x02\x02\u0A4F\u0A50\x03\x02\x02\x02\u0A50\u0A52\x03\x02" +
		"\x02\x02\u0A51\u0A53\x07\x8B\x02\x02\u0A52\u0A51\x03\x02\x02\x02\u0A52" +
		"\u0A53\x03\x02\x02\x02\u0A53\u0A54\x03\x02\x02\x02\u0A54\u0A55\x07\x92" +
		"\x02\x02\u0A55\u0A57\x03\x02\x02\x02\u0A56\u0A47\x03\x02\x02\x02\u0A56" +
		"\u0A4A\x03\x02\x02\x02\u0A57\xEB\x03\x02\x02\x02\u0A58\u0A59\t\t\x02\x02" +
		"\u0A59\xED\x03\x02\x02\x02\u0A5A\u0A5B\t\n\x02\x02\u0A5B\xEF\x03\x02\x02" +
		"\x02\u0A5C\u0A5E\x07\x8A\x02\x02\u0A5D\u0A5F\x07\xA0\x02\x02\u0A5E\u0A5D" +
		"\x03\x02\x02\x02\u0A5E\u0A5F\x03\x02\x02\x02\u0A5F\u0A60\x03\x02\x02\x02" +
		"\u0A60\u0A62\x05\u0136\x9C\x02\u0A61\u0A63\x05\xF2z\x02\u0A62\u0A61\x03" +
		"\x02\x02\x02\u0A62\u0A63\x03\x02\x02\x02\u0A63\xF1\x03\x02\x02\x02\u0A64" +
		"\u0A65\x07\x95\x02\x02\u0A65\u0A66\x05\xF4{\x02\u0A66\u0A67\x07\x96\x02" +
		"\x02\u0A67\xF3\x03\x02\x02\x02\u0A68\u0A6D\x05\u0136\x9C\x02\u0A69\u0A6A" +
		"\x07\x8C\x02\x02\u0A6A\u0A6C\x05\u0136\x9C\x02\u0A6B\u0A69\x03\x02\x02" +
		"\x02\u0A6C\u0A6F\x03\x02\x02\x02\u0A6D\u0A6B\x03\x02\x02\x02\u0A6D\u0A6E" +
		"\x03\x02\x02\x02\u0A6E\xF5\x03\x02\x02\x02\u0A6F\u0A6D\x03\x02\x02\x02" +
		"\u0A70\u0A71\x07}\x02\x02\u0A71\u0A76\x05\u0136\x9C\x02\u0A72\u0A73\x07" +
		"\x8C\x02\x02\u0A73\u0A75\x05\u0136\x9C\x02\u0A74\u0A72\x03\x02\x02\x02" +
		"\u0A75\u0A78\x03\x02\x02\x02\u0A76\u0A74\x03\x02\x02\x02\u0A76\u0A77\x03" +
		"\x02\x02\x02\u0A77\u0AA7\x03\x02\x02\x02\u0A78\u0A76\x03\x02\x02\x02\u0A79" +
		"\u0A7A\x07f\x02\x02\u0A7A\u0A7F\x05\u0136\x9C\x02\u0A7B\u0A7C\x07\x8C" +
		"\x02\x02\u0A7C\u0A7E\x05\u0136\x9C\x02\u0A7D\u0A7B\x03\x02\x02\x02\u0A7E" +
		"\u0A81\x03\x02\x02\x02\u0A7F\u0A7D\x03\x02\x02\x02\u0A7F\u0A80\x03\x02" +
		"\x02\x02\u0A80\u0AA7\x03\x02\x02\x02\u0A81\u0A7F\x03\x02\x02\x02\u0A82" +
		"\u0A83\x07k\x02\x02\u0A83\u0A88\x05\u0136\x9C\x02\u0A84\u0A85\x07\x8C" +
		"\x02\x02\u0A85\u0A87\x05\u0136\x9C\x02\u0A86\u0A84\x03\x02\x02\x02\u0A87" +
		"\u0A8A\x03\x02\x02\x02\u0A88\u0A86\x03\x02\x02\x02\u0A88\u0A89\x03\x02" +
		"\x02\x02\u0A89\u0AA7\x03\x02\x02\x02\u0A8A\u0A88\x03\x02\x02\x02\u0A8B" +
		"\u0A8C\x07]\x02\x02\u0A8C\u0A91\x05\u0136\x9C\x02\u0A8D\u0A8E\x07\x8C" +
		"\x02\x02\u0A8E\u0A90\x05\u0136\x9C\x02\u0A8F\u0A8D\x03\x02\x02\x02\u0A90" +
		"\u0A93\x03\x02\x02\x02\u0A91\u0A8F\x03\x02\x02\x02\u0A91\u0A92\x03\x02" +
		"\x02\x02\u0A92\u0AA7\x03\x02\x02\x02\u0A93\u0A91\x03\x02\x02\x02\u0A94" +
		"\u0A95\x07_\x02\x02\u0A95\u0A9A\x05\u0136\x9C\x02\u0A96\u0A97\x07\x8C" +
		"\x02\x02\u0A97\u0A99\x05\u0136\x9C\x02\u0A98\u0A96\x03\x02\x02\x02\u0A99" +
		"\u0A9C\x03\x02\x02\x02\u0A9A\u0A98\x03\x02\x02\x02\u0A9A\u0A9B\x03\x02" +
		"\x02\x02\u0A9B\u0AA7\x03\x02\x02\x02\u0A9C\u0A9A\x03\x02\x02\x02\u0A9D" +
		"\u0A9E\x07\x13\x02\x02\u0A9E\u0AA3\x05\u0136\x9C\x02\u0A9F\u0AA0\x07\x8C" +
		"\x02\x02\u0AA0\u0AA2\x05\u0136\x9C\x02\u0AA1\u0A9F\x03\x02\x02\x02\u0AA2" +
		"\u0AA5\x03\x02\x02\x02\u0AA3\u0AA1\x03\x02\x02\x02\u0AA3\u0AA4\x03\x02" +
		"\x02\x02\u0AA4\u0AA7\x03\x02\x02\x02\u0AA5\u0AA3\x03\x02\x02\x02\u0AA6" +
		"\u0A70\x03\x02\x02\x02\u0AA6\u0A79\x03\x02\x02\x02\u0AA6\u0A82\x03\x02" +
		"\x02\x02\u0AA6\u0A8B\x03\x02\x02\x02\u0AA6\u0A94\x03\x02\x02\x02\u0AA6" +
		"\u0A9D\x03\x02\x02\x02\u0AA7\xF7\x03\x02\x02\x02\u0AA8\u0AA9\x07\x93\x02" +
		"\x02\u0AA9\u0AAA\x05\xFC\x7F\x02\u0AAA\u0AAE\x07\x94\x02\x02\u0AAB\u0AAD" +
		"\x05\xFA~\x02\u0AAC\u0AAB\x03\x02\x02\x02\u0AAD\u0AB0\x03\x02\x02\x02" +
		"\u0AAE\u0AAC\x03\x02\x02\x02\u0AAE\u0AAF\x03\x02\x02\x02\u0AAF\xF9\x03" +
		"\x02\x02\x02\u0AB0\u0AAE\x03\x02\x02\x02\u0AB1\u0AB2\t\v\x02\x02\u0AB2" +
		"\xFB\x03\x02\x02\x02\u0AB3\u0AB6\x05\xFE\x80\x02\u0AB4\u0AB5\x07\x88\x02" +
		"\x02\u0AB5\u0AB7\x05\xFE\x80\x02\u0AB6\u0AB4\x03\x02\x02\x02\u0AB6\u0AB7" +
		"\x03\x02\x02\x02\u0AB7\xFD\x03\x02\x02\x02\u0AB8\u0ABC\x07\xA2\x02\x02" +
		"\u0AB9\u0ABC\x07\x99\x02\x02\u0ABA\u0ABC\x05\u0108\x85\x02\u0ABB\u0AB8" +
		"\x03\x02\x02\x02\u0ABB\u0AB9\x03\x02\x02\x02\u0ABB\u0ABA\x03\x02\x02\x02" +
		"\u0ABC\xFF\x03\x02\x02\x02\u0ABD\u0AC1\x07\x91\x02\x02\u0ABE\u0AC0\x05" +
		"\u0102\x82\x02\u0ABF\u0ABE\x03\x02\x02\x02\u0AC0\u0AC3\x03\x02\x02\x02" +
		"\u0AC1\u0ABF\x03\x02\x02\x02\u0AC1\u0AC2\x03\x02\x02\x02\u0AC2\u0AC4\x03" +
		"\x02\x02\x02\u0AC3\u0AC1\x03\x02\x02\x02\u0AC4\u0ACA\x07\x92\x02\x02\u0AC5" +
		"\u0AC6\x07\x91\x02\x02\u0AC6\u0AC7\x05\u0108\x85\x02\u0AC7\u0AC8\x07\x92" +
		"\x02\x02\u0AC8\u0ACA\x03\x02\x02\x02\u0AC9\u0ABD\x03\x02\x02\x02\u0AC9" +
		"\u0AC5\x03\x02\x02\x02\u0ACA\u0101\x03\x02\x02\x02\u0ACB\u0AD0\x05\x04" +
		"\x03\x02\u0ACC\u0AD0\x05\xE6t\x02\u0ACD\u0AD0\x05\u0106\x84\x02\u0ACE" +
		"\u0AD0\x05\u0104\x83\x02\u0ACF\u0ACB\x03\x02\x02\x02\u0ACF\u0ACC\x03\x02" +
		"\x02\x02\u0ACF\u0ACD\x03\x02\x02\x02\u0ACF\u0ACE\x03\x02\x02\x02\u0AD0" +
		"\u0103\x03\x02\x02\x02\u0AD1\u0AD4\x07*\x02\x02\u0AD2\u0AD3\x07\x9C\x02" +
		"\x02\u0AD3\u0AD5\x05\u0108\x85\x02\u0AD4\u0AD2\x03\x02\x02\x02\u0AD4\u0AD5" +
		"\x03\x02\x02\x02\u0AD5\u0AD7\x03\x02\x02\x02\u0AD6\u0AD8\x07\x8B\x02\x02" +
		"\u0AD7\u0AD6\x03\x02\x02\x02\u0AD7\u0AD8\x03\x02\x02\x02\u0AD8\u0105\x03" +
		"\x02\x02\x02\u0AD9\u0ADB\x074\x02\x02\u0ADA\u0ADC\x07M\x02\x02\u0ADB\u0ADA" +
		"\x03\x02\x02\x02\u0ADB\u0ADC\x03\x02\x02\x02\u0ADC\u0ADD\x03\x02\x02\x02" +
		"\u0ADD\u0ADE\x05\u0136\x9C\x02\u0ADE\u0ADF\x077\x02\x02\u0ADF\u0AE0\x05" +
		"\u0136\x9C\x02\u0AE0\u0AE1\x07o\x02\x02\u0AE1\u0AE3\x05\u0136\x9C\x02" +
		"\u0AE2\u0AE4\x07\x8B\x02\x02\u0AE3\u0AE2\x03\x02\x02\x02\u0AE3\u0AE4\x03" +
		"\x02\x02\x02\u0AE4\u0AF5\x03\x02\x02\x02\u0AE5\u0AE6\x074\x02\x02\u0AE6" +
		"\u0AE7\x077\x02\x02\u0AE7\u0AE8\x05\u0136\x9C\x02\u0AE8\u0AE9\x07o\x02" +
		"\x02\u0AE9\u0AEB\x05\u0136\x9C\x02\u0AEA\u0AEC\x07\x8B\x02\x02\u0AEB\u0AEA" +
		"\x03\x02\x02\x02\u0AEB\u0AEC\x03\x02\x02\x02\u0AEC\u0AF5\x03\x02\x02\x02" +
		"\u0AED\u0AEE\x074\x02\x02\u0AEE\u0AEF\x05\u0136\x9C\x02\u0AEF\u0AF0\x07" +
		"o\x02\x02\u0AF0\u0AF2\x05\u0136\x9C\x02\u0AF1\u0AF3\x07\x8B\x02\x02\u0AF2" +
		"\u0AF1\x03\x02\x02\x02\u0AF2\u0AF3\x03\x02\x02\x02\u0AF3\u0AF5\x03\x02" +
		"\x02\x02\u0AF4\u0AD9\x03\x02\x02\x02\u0AF4\u0AE5\x03\x02\x02\x02\u0AF4" +
		"\u0AED\x03\x02\x02\x02\u0AF5\u0107\x03\x02\x02\x02\u0AF6\u0AF7\x05\u010A" +
		"\x86\x02\u0AF7\u0109\x03\x02\x02\x02\u0AF8\u0AFE\x05\u010C\x87\x02\u0AF9" +
		"\u0AFA\x07\x8E\x02\x02\u0AFA\u0AFB\x05\u0108\x85\x02\u0AFB\u0AFC\x07\x8A" +
		"\x02\x02\u0AFC\u0AFD\x05\u010A\x86\x02\u0AFD\u0AFF\x03\x02\x02\x02\u0AFE" +
		"\u0AF9\x03\x02\x02\x02\u0AFE\u0AFF\x03\x02\x02\x02\u0AFF\u010B\x03\x02" +
		"\x02\x02\u0B00\u0B05\x05\u010E\x88\x02\u0B01\u0B02\x07\x80\x02\x02\u0B02" +
		"\u0B04\x05\u010E\x88\x02\u0B03\u0B01\x03\x02\x02\x02\u0B04\u0B07\x03\x02" +
		"\x02\x02\u0B05\u0B03\x03\x02\x02\x02\u0B05\u0B06\x03\x02\x02\x02\u0B06" +
		"\u010D\x03\x02\x02\x02\u0B07\u0B05\x03\x02\x02\x02\u0B08\u0B0D\x05\u0110" +
		"\x89\x02\u0B09\u0B0A\x07N\x02\x02\u0B0A\u0B0C\x05\u0110\x89\x02\u0B0B" +
		"\u0B09\x03\x02\x02\x02\u0B0C\u0B0F\x03\x02\x02\x02\u0B0D\u0B0B\x03\x02" +
		"\x02\x02\u0B0D\u0B0E\x03\x02\x02\x02\u0B0E\u010F\x03\x02\x02\x02\u0B0F" +
		"\u0B0D\x03\x02\x02\x02\u0B10\u0B15\x05\u0112\x8A\x02\u0B11\u0B12\x07z" +
		"\x02\x02\u0B12\u0B14\x05\u0112\x8A\x02\u0B13\u0B11\x03\x02\x02\x02\u0B14" +
		"\u0B17\x03\x02\x02\x02\u0B15\u0B13\x03\x02\x02\x02\u0B15\u0B16\x03\x02" +
		"\x02\x02\u0B16\u0111\x03\x02\x02\x02\u0B17\u0B15\x03\x02\x02\x02\u0B18" +
		"\u0B1D\x05\u0114\x8B\x02\u0B19\u0B1A\x07\x0E\x02\x02\u0B1A\u0B1C\x05\u0114" +
		"\x8B\x02\u0B1B\u0B19\x03\x02\x02\x02\u0B1C\u0B1F\x03\x02\x02\x02\u0B1D" +
		"\u0B1B\x03\x02\x02\x02\u0B1D\u0B1E\x03\x02\x02\x02\u0B1E\u0113\x03\x02" +
		"\x02\x02\u0B1F\u0B1D\x03\x02\x02\x02\u0B20\u0B25\x05\u0116\x8C\x02\u0B21" +
		"\u0B22\t\f\x02\x02\u0B22\u0B24\x05\u0116\x8C\x02\u0B23\u0B21\x03\x02\x02" +
		"\x02\u0B24\u0B27\x03\x02\x02\x02\u0B25\u0B23\x03\x02\x02\x02\u0B25\u0B26" +
		"\x03\x02\x02\x02\u0B26\u0115\x03\x02\x02\x02\u0B27\u0B25\x03\x02\x02\x02" +
		"\u0B28\u0B2D\x05\u0118\x8D\x02\u0B29\u0B2A\t\r\x02\x02\u0B2A\u0B2C\x05" +
		"\u0118\x8D\x02\u0B2B\u0B29\x03\x02\x02\x02\u0B2C\u0B2F\x03\x02\x02\x02" +
		"\u0B2D\u0B2B\x03\x02\x02\x02\u0B2D\u0B2E\x03\x02\x02\x02\u0B2E\u0117\x03" +
		"\x02\x02\x02\u0B2F\u0B2D\x03\x02\x02\x02\u0B30\u0B35\x05\u011A\x8E\x02" +
		"\u0B31\u0B32\t\x0E\x02\x02\u0B32\u0B34\x05\u011A\x8E\x02\u0B33\u0B31\x03" +
		"\x02\x02\x02\u0B34\u0B37\x03\x02\x02\x02\u0B35\u0B33\x03\x02\x02\x02\u0B35" +
		"\u0B36\x03\x02\x02\x02\u0B36\u0119\x03\x02\x02\x02\u0B37\u0B35\x03\x02" +
		"\x02\x02\u0B38\u0B3D\x05\u011C\x8F\x02\u0B39\u0B3A\t\x0F\x02\x02\u0B3A" +
		"\u0B3C\x05\u011C\x8F\x02\u0B3B\u0B39\x03\x02\x02\x02\u0B3C\u0B3F\x03\x02" +
		"\x02\x02\u0B3D\u0B3B\x03\x02\x02\x02\u0B3D\u0B3E\x03\x02\x02\x02\u0B3E" +
		"\u011B\x03\x02\x02\x02\u0B3F\u0B3D\x03\x02\x02\x02\u0B40\u0B45\x05\u011E" +
		"\x90\x02\u0B41\u0B42\x07\x87\x02\x02\u0B42\u0B44\x05\u011E\x90\x02\u0B43" +
		"\u0B41\x03\x02\x02\x02\u0B44\u0B47\x03\x02\x02\x02\u0B45\u0B43\x03\x02" +
		"\x02\x02\u0B45\u0B46\x03\x02\x02\x02\u0B46\u011D\x03\x02\x02\x02\u0B47" +
		"\u0B45\x03\x02\x02\x02\u0B48\u0B49\t\x10\x02\x02\u0B49\u0B4C\x05\u011E" +
		"\x90\x02\u0B4A\u0B4C\x05\u0120\x91\x02\u0B4B\u0B48\x03\x02\x02\x02\u0B4B" +
		"\u0B4A\x03\x02\x02\x02\u0B4C\u011F\x03\x02\x02\x02\u0B4D\u0B51\x05\u0124" +
		"\x93\x02\u0B4E\u0B50\x05\u0122\x92\x02\u0B4F\u0B4E\x03\x02\x02\x02\u0B50" +
		"\u0B53\x03\x02\x02\x02\u0B51\u0B4F\x03\x02\x02\x02\u0B51\u0B52\x03\x02" +
		"\x02\x02\u0B52\u0121\x03\x02\x02\x02\u0B53\u0B51\x03\x02\x02\x02\u0B54" +
		"\u0B55\x07\x8D\x02\x02\u0B55\u0B60\x05\u0138\x9D\x02\u0B56\u0B57\x07\x93" +
		"\x02\x02\u0B57\u0B58\x05\u0108\x85\x02\u0B58\u0B59\x07\x94\x02\x02\u0B59" +
		"\u0B60\x03\x02\x02\x02\u0B5A\u0B5C\x07\x8F\x02\x02\u0B5B\u0B5D\x05\u012A" +
		"\x96\x02\u0B5C\u0B5B\x03\x02\x02\x02\u0B5C\u0B5D\x03\x02\x02\x02\u0B5D" +
		"\u0B5E\x03\x02\x02\x02\u0B5E\u0B60\x07\x90\x02\x02\u0B5F\u0B54\x03\x02" +
		"\x02\x02\u0B5F\u0B56\x03\x02\x02\x02\u0B5F\u0B5A\x03\x02\x02\x02\u0B60" +
		"\u0123\x03\x02\x02\x02\u0B61\u0B62\x07I\x02\x02\u0B62\u0B63\x05\u0136" +
		"\x9C\x02\u0B63\u0B65\x07\x8F\x02\x02\u0B64\u0B66\x05\u012A\x96\x02\u0B65" +
		"\u0B64\x03\x02\x02\x02\u0B65\u0B66\x03\x02\x02\x02\u0B66\u0B67\x03\x02" +
		"\x02\x02\u0B67\u0B68\x07\x90\x02\x02\u0B68\u0B78\x03\x02\x02\x02\u0B69" +
		"\u0B6B\x05\u0136\x9C\x02\u0B6A\u0B6C\x05\u0128\x95\x02\u0B6B\u0B6A\x03" +
		"\x02\x02\x02\u0B6B\u0B6C\x03\x02\x02\x02\u0B6C\u0B78\x03\x02\x02\x02\u0B6D" +
		"\u0B6F\x05\u012E\x98\x02\u0B6E\u0B70\x05\u0128\x95\x02\u0B6F\u0B6E\x03" +
		"\x02\x02\x02\u0B6F\u0B70\x03\x02\x02\x02\u0B70\u0B78\x03\x02\x02\x02\u0B71" +
		"\u0B72\x07\x8F\x02\x02\u0B72\u0B73\x05\u0126\x94\x02\u0B73\u0B75\x07\x90" +
		"\x02\x02\u0B74\u0B76\x05\u0128\x95\x02\u0B75\u0B74\x03\x02\x02\x02\u0B75" +
		"\u0B76\x03\x02\x02\x02\u0B76\u0B78\x03\x02\x02\x02\u0B77\u0B61\x03\x02" +
		"\x02\x02\u0B77\u0B69\x03\x02\x02\x02\u0B77\u0B6D\x03\x02\x02\x02\u0B77" +
		"\u0B71\x03\x02\x02\x02\u0B78\u0125\x03\x02\x02\x02\u0B79\u0B7E\x05\u0108" +
		"\x85\x02\u0B7A\u0B7B\x07\x8C\x02\x02\u0B7B\u0B7D\x05\u0108\x85\x02\u0B7C" +
		"\u0B7A\x03\x02\x02\x02\u0B7D\u0B80\x03\x02\x02\x02\u0B7E\u0B7C\x03\x02" +
		"\x02\x02\u0B7E\u0B7F\x03\x02\x02\x02\u0B7F\u0127\x03\x02\x02\x02\u0B80" +
		"\u0B7E\x03\x02\x02\x02\u0B81\u0B87\x07\xA5\x02\x02\u0B82\u0B83\x07\x93" +
		"\x02\x02\u0B83\u0B84\x05\u0136\x9C\x02\u0B84\u0B85\x07\x94\x02\x02\u0B85" +
		"\u0B87\x03\x02\x02\x02\u0B86\u0B81\x03\x02\x02\x02\u0B86\u0B82\x03\x02" +
		"\x02\x02\u0B87\u0129\x03\x02\x02\x02\u0B88\u0B8D\x05\u012C\x97\x02\u0B89" +
		"\u0B8A\x07\x8C\x02\x02\u0B8A\u0B8C\x05\u012C\x97\x02\u0B8B\u0B89\x03\x02" +
		"\x02\x02\u0B8C\u0B8F\x03\x02\x02\x02\u0B8D\u0B8B\x03\x02\x02\x02\u0B8D" +
		"\u0B8E\x03\x02\x02\x02\u0B8E\u012B\x03\x02\x02\x02\u0B8F\u0B8D\x03\x02" +
		"\x02\x02\u0B90\u0B91\x05\u0138\x9D\x02\u0B91\u0B92\x07\x9C\x02\x02\u0B92" +
		"\u0B93\x05\u0108\x85\x02\u0B93\u0B96\x03\x02\x02\x02\u0B94\u0B96\x05\u0108" +
		"\x85\x02\u0B95\u0B90\x03\x02\x02\x02\u0B95\u0B94\x03\x02\x02\x02\u0B96" +
		"\u012D\x03\x02\x02\x02\u0B97\u0B9D\x07\xA2\x02\x02\u0B98\u0B9D\x07\xA3" +
		"\x02\x02\u0B99\u0B9D\x05\u0130\x99\x02\u0B9A\u0B9D\x05\u0132\x9A\x02\u0B9B" +
		"\u0B9D\x05\u0134\x9B\x02\u0B9C\u0B97\x03\x02\x02\x02\u0B9C\u0B98\x03\x02" +
		"\x02\x02\u0B9C\u0B99\x03\x02\x02\x02\u0B9C\u0B9A\x03\x02\x02\x02\u0B9C" +
		"\u0B9B\x03\x02\x02\x02\u0B9D\u012F\x03\x02\x02\x02\u0B9E\u0B9F\x07\xA4" +
		"\x02\x02\u0B9F\u0131\x03\x02\x02\x02\u0BA0\u0BA1\t\x11\x02\x02\u0BA1\u0133" +
		"\x03\x02\x02\x02\u0BA2\u0BA3\x07J\x02\x02\u0BA3\u0135\x03\x02\x02\x02" +
		"\u0BA4\u0BA9\x05\u0138\x9D\x02\u0BA5\u0BA6\t\x07\x02\x02\u0BA6\u0BA8\x05" +
		"\u0138\x9D\x02\u0BA7\u0BA5\x03\x02\x02\x02\u0BA8\u0BAB\x03\x02\x02\x02" +
		"\u0BA9\u0BA7\x03\x02\x02\x02\u0BA9\u0BAA\x03\x02\x02\x02\u0BAA\u0137\x03" +
		"\x02\x02\x02\u0BAB\u0BA9\x03\x02\x02\x02\u0BAC\u0BB0\x07\xA1\x02\x02\u0BAD" +
		"\u0BB0\x07\xA4\x02\x02\u0BAE\u0BB0\x05\u013C\x9F\x02\u0BAF\u0BAC\x03\x02" +
		"\x02\x02\u0BAF\u0BAD\x03\x02\x02\x02\u0BAF\u0BAE\x03\x02\x02\x02\u0BB0" +
		"\u0139\x03\x02\x02\x02\u0BB1\u0BB2\x07\x95\x02\x02\u0BB2\u0BB3\t\x12\x02" +
		"\x02\u0BB3\u0BB4\x07\x96\x02\x02\u0BB4\u013B\x03\x02\x02\x02\u0BB5\u0BB6" +
		"\t\x13\x02\x02\u0BB6\u013D\x03\x02\x02\x02\u0BB7\u0BB9\x07p\x02\x02\u0BB8" +
		"\u0BBA\x05\u0138\x9D\x02\u0BB9\u0BB8\x03\x02\x02\x02\u0BB9\u0BBA\x03\x02" +
		"\x02\x02\u0BBA\u0BBB\x03\x02\x02\x02\u0BBB\u0BBD\x05\u0140\xA1\x02\u0BBC" +
		"\u0BBE\x05\u0146\xA4\x02\u0BBD\u0BBC\x03\x02\x02\x02\u0BBD\u0BBE\x03\x02" +
		"\x02\x02\u0BBE\u0BC0\x03\x02\x02\x02\u0BBF\u0BC1\x05\u0148\xA5\x02\u0BC0" +
		"\u0BBF\x03\x02\x02\x02\u0BC0\u0BC1\x03\x02\x02\x02\u0BC1\u0BC2\x03\x02" +
		"\x02\x02\u0BC2\u0BC4\x05\u0142\xA2\x02\u0BC3\u0BC5\x07\x8B\x02\x02\u0BC4" +
		"\u0BC3\x03\x02\x02\x02\u0BC4\u0BC5\x03\x02\x02\x02\u0BC5\u0C02\x03\x02" +
		"\x02\x02\u0BC6\u0BC8\x07p\x02\x02\u0BC7\u0BC9\x05\u0138\x9D\x02\u0BC8" +
		"\u0BC7\x03\x02\x02\x02\u0BC8\u0BC9\x03\x02\x02\x02\u0BC9\u0BCA\x03\x02" +
		"\x02\x02\u0BCA\u0BCB\x05\u0140\xA1\x02\u0BCB\u0BCD\x05B\"\x02\u0BCC\u0BCE" +
		"\x05\u0146\xA4\x02\u0BCD\u0BCC\x03\x02\x02\x02\u0BCD\u0BCE\x03\x02\x02" +
		"\x02\u0BCE\u0BD0\x03\x02\x02\x02\u0BCF\u0BD1\x05\u0148\xA5\x02\u0BD0\u0BCF" +
		"\x03\x02\x02\x02\u0BD0\u0BD1\x03\x02\x02\x02\u0BD1\u0BD2\x03\x02\x02\x02" +
		"\u0BD2\u0BD4\x05\u0142\xA2\x02\u0BD3\u0BD5\x07\x8B\x02\x02\u0BD4\u0BD3" +
		"\x03\x02\x02\x02\u0BD4\u0BD5\x03\x02\x02\x02\u0BD5\u0C02\x03\x02\x02\x02" +
		"\u0BD6\u0BD8\x07p\x02\x02\u0BD7\u0BD9\x05\u0138\x9D\x02\u0BD8\u0BD7\x03" +
		"\x02\x02\x02\u0BD8\u0BD9\x03\x02\x02\x02\u0BD9\u0BDA\x03\x02\x02\x02\u0BDA" +
		"\u0BDB\x05\u0140\xA1\x02\u0BDB\u0BDC\x05@!\x02\u0BDC\u0BDE\x05\u0142\xA2" +
		"\x02\u0BDD\u0BDF\x07\x8B\x02\x02\u0BDE\u0BDD\x03\x02\x02\x02\u0BDE\u0BDF" +
		"\x03\x02\x02\x02\u0BDF\u0C02\x03\x02\x02\x02\u0BE0\u0BE2\x07p\x02\x02" +
		"\u0BE1\u0BE3\x05\u0138\x9D\x02\u0BE2\u0BE1\x03\x02\x02\x02\u0BE2\u0BE3" +
		"\x03\x02\x02\x02\u0BE3\u0BE4\x03\x02\x02\x02\u0BE4\u0BE5\x05\u0140\xA1" +
		"\x02\u0BE5\u0BE7\x05\u0142\xA2\x02\u0BE6\u0BE8\x05\u0144\xA3\x02\u0BE7" +
		"\u0BE6\x03\x02\x02\x02\u0BE7\u0BE8\x03\x02\x02\x02\u0BE8\u0BEA\x03\x02" +
		"\x02\x02\u0BE9\u0BEB\x07\x8B\x02\x02\u0BEA\u0BE9\x03\x02\x02\x02\u0BEA" +
		"\u0BEB\x03\x02\x02\x02\u0BEB\u0C02\x03\x02\x02\x02\u0BEC\u0BEE\x05B\"" +
		"\x02\u0BED\u0BEF\x05\u0146\xA4\x02\u0BEE\u0BED\x03\x02\x02\x02\u0BEE\u0BEF" +
		"\x03\x02\x02\x02\u0BEF\u0BF1\x03\x02\x02\x02\u0BF0\u0BF2\x05\u0148\xA5" +
		"\x02\u0BF1\u0BF0\x03\x02\x02\x02\u0BF1\u0BF2\x03\x02\x02\x02\u0BF2\u0BF3" +
		"\x03\x02\x02\x02\u0BF3\u0BF4\x07m\x02\x02\u0BF4\u0BF6\x05\u0138\x9D\x02" +
		"\u0BF5\u0BF7\x07\x8B\x02\x02\u0BF6\u0BF5\x03\x02\x02\x02\u0BF6\u0BF7\x03" +
		"\x02\x02\x02\u0BF7\u0C02\x03\x02\x02\x02\u0BF8\u0BFA\x05\u0146\xA4\x02" +
		"\u0BF9\u0BFB\x05\u0148\xA5\x02\u0BFA\u0BF9\x03\x02\x02\x02\u0BFA\u0BFB" +
		"\x03\x02\x02\x02\u0BFB\u0BFC\x03\x02\x02\x02\u0BFC\u0BFD\x07m\x02\x02" +
		"\u0BFD\u0BFF\x05\u0138\x9D\x02\u0BFE\u0C00\x07\x8B\x02\x02\u0BFF\u0BFE" +
		"\x03\x02\x02\x02\u0BFF\u0C00\x03\x02\x02\x02\u0C00\u0C02\x03\x02\x02\x02" +
		"\u0C01\u0BB7\x03\x02\x02\x02\u0C01\u0BC6\x03\x02\x02\x02\u0C01\u0BD6\x03" +
		"\x02\x02\x02\u0C01\u0BE0\x03\x02\x02\x02\u0C01\u0BEC\x03\x02\x02\x02\u0C01" +
		"\u0BF8\x03\x02\x02\x02\u0C02\u013F\x03\x02\x02\x02\u0C03\u0C04\x073\x02" +
		"\x02\u0C04\u0C09\x05\u0138\x9D\x02\u0C05\u0C06\x077\x02\x02\u0C06\u0C09" +
		"\x05\u0138\x9D\x02\u0C07\u0C09\x05\u0138\x9D\x02\u0C08\u0C03\x03\x02\x02" +
		"\x02\u0C08\u0C05\x03\x02\x02\x02\u0C08\u0C07\x03\x02\x02\x02\u0C09\u0141" +
		"\x03\x02\x02\x02\u0C0A\u0C0B\x07m\x02\x02\u0C0B\u0C0F\x05\u0138\x9D\x02" +
		"\u0C0C\u0C0D\x07o\x02\x02\u0C0D\u0C0F\x05\u0138\x9D\x02\u0C0E\u0C0A\x03" +
		"\x02\x02\x02\u0C0E\u0C0C\x03\x02\x02\x02\u0C0F\u0143\x03\x02\x02\x02\u0C10" +
		"\u0C16\x05B\"\x02\u0C11\u0C12\x07\x10\x02\x02\u0C12\u0C16\x05\u0108\x85" +
		"\x02\u0C13\u0C14\x07y\x02\x02\u0C14\u0C16\x05\u0108\x85\x02\u0C15\u0C10" +
		"\x03\x02\x02\x02\u0C15\u0C11\x03\x02\x02\x02\u0C15\u0C13\x03\x02\x02\x02" +
		"\u0C16\u0145\x03\x02\x02\x02\u0C17\u0C18\x07:\x02\x02\u0C18\u0C19\x05" +
		"\u0108\x85\x02\u0C19\u0147\x03\x02\x02\x02\u0C1A\u0C1B\x07%\x02\x02\u0C1B" +
		"\u0C1F\x05D#\x02\u0C1C\u0C1D\x07%\x02\x02\u0C1D\u0C1F\x05\u0136\x9C\x02" +
		"\u0C1E\u0C1A\x03\x02\x02\x02\u0C1E\u0C1C\x03\x02\x02\x02\u0C1F\u0149\x03" +
		"\x02\x02\x02\u0243\u014D\u01B4\u01BB\u01C3\u01C9\u01CD\u01D5\u01DD\u01DF" +
		"\u01E4\u01EB\u01F1\u01F7\u01FA\u0207\u020F\u0213\u0223\u0227\u022A\u022D" +
		"\u0231\u0234\u023B\u023F\u0248\u0252\u0254\u025C\u025F\u0262\u0265\u0269" +
		"\u026E\u0270\u027A\u027E\u0283\u0287\u028C\u0290\u0294\u0299\u029D\u029F" +
		"\u02A4\u02AA\u02AF\u02B4\u02B8\u02C1\u02C5\u02C8\u02CB\u02CE\u02D1\u02D6" +
		"\u02D9\u02DF\u02E5\u02E9\u02ED\u02F0\u02F7\u02FD\u0301\u0305\u0307\u030A" +
		"\u030F\u0316\u031A\u031D\u0320\u0325\u032A\u032D\u0330\u0333\u0337\u033A" +
		"\u033F\u0346\u034A\u034D\u0352\u0358\u035B\u035E\u0362\u0366\u036A\u036D" +
		"\u0370\u0377\u0379\u037F\u0382\u0385\u0389\u038D\u0392\u0394\u039A\u039E" +
		"\u03A1\u03A4\u03A6\u03AA\u03B0\u03B5\u03B7\u03BD\u03C3\u03C7\u03CD\u03D1" +
		"\u03D5\u03D8\u03DE\u03E0\u03E7\u03EF\u03F7\u03F9\u03FC\u0401\u0408\u040C" +
		"\u040F\u0414\u041A\u041D\u0420\u0425\u042A\u042D\u0432\u0439\u043D\u0440" +
		"\u0445\u044C\u0451\u0456\u045D\u0460\u0465\u046C\u0470\u0473\u0478\u047D" +
		"\u0481\u0484\u0487\u048B\u048E\u0493\u049B\u049F\u04A2\u04A7\u04AE\u04B1" +
		"\u04B4\u04B8\u04BB\u04C0\u04C7\u04CB\u04CE\u04D3\u04D8\u04DB\u04DE\u04E1" +
		"\u04E5\u04E8\u04ED\u04F4\u04F7\u04FB\u04FE\u0501\u0506\u050C\u050F\u0512" +
		"\u0515\u0519\u0521\u0524\u0529\u0530\u0534\u0537\u053C\u0544\u0547\u054A" +
		"\u054E\u0551\u0556\u055D\u0560\u0563\u0567\u0569\u056C\u0571\u0578\u057C" +
		"\u057F\u0584\u0588\u058C\u058F\u0592\u0595\u0599\u059C\u05A1\u05A8\u05AC" +
		"\u05AF\u05B4\u05BA\u05BD\u05C0\u05C5\u05C8\u05CD\u05D4\u05D8\u05DB\u05E0" +
		"\u05E6\u05E9\u05EC\u05F1\u05F6\u05F9\u05FE\u0605\u0609\u060C\u0611\u0615" +
		"\u0618\u061C\u0621\u0624\u0627\u062A\u062D\u0631\u0634\u0639\u063F\u0643" +
		"\u0646\u064C\u0650\u0653\u0658\u065C\u065F\u0664\u0668\u066B\u0670\u0673" +
		"\u0677\u067A\u067F\u0686\u068A\u068D\u0692\u0698\u069B\u069E\u06A1\u06A5" +
		"\u06A8\u06AD\u06B4\u06B8\u06BB\u06C0\u06C6\u06C9\u06CC\u06D0\u06D3\u06D8" +
		"\u06DF\u06E3\u06E6\u06EB\u06F1\u06F4\u06F7\u06FB\u06FE\u0703\u0706\u0709" +
		"\u070D\u0710\u0714\u0717\u071A\u071D\u0721\u0724\u0729\u072C\u072F\u0733" +
		"\u073B\u073D\u0743\u0749\u074E\u0755\u0758\u075B\u0760\u0766\u0769\u076C" +
		"\u076F\u0775\u077C\u0782\u0785\u078A\u0791\u0794\u0797\u079C\u07A2\u07A5" +
		"\u07A8\u07AB\u07B1\u07BA\u07C2\u07C6\u07CD\u07D8\u07DF\u07E2\u07E7\u07EE" +
		"\u07F1\u07F4\u07F9\u07FF\u0802\u0805\u0808\u080B\u0810\u0817\u081A\u081D" +
		"\u0822\u0828\u082B\u082E\u0831\u0834\u0839\u0840\u0843\u0846\u084B\u0851" +
		"\u0854\u0857\u085A\u085D\u0862\u0869\u086C\u086F\u0874\u087A\u087D";
	private static readonly _serializedATNSegment6: string =
		"\u0880\u0883\u0886\u088B\u0894\u0898\u089B\u089E\u08A3\u08A9\u08AC\u08AF" +
		"\u08B2\u08B8\u08BC\u08BF\u08C4\u08C7\u08CA\u08CD\u08D0\u08D4\u08D8\u08DB" +
		"\u08E1\u08E4\u08E7\u08EC\u08EF\u08F2\u08F7\u08FE\u0901\u0904\u0909\u090F" +
		"\u0912\u0915\u0918\u091B\u0920\u0926\u0929\u092C\u092F\u0932\u0937\u0941" +
		"\u0946\u094D\u0950\u0955\u095A\u095F\u0966\u0968\u0973\u0976\u097B\u0981" +
		"\u0984\u0987\u098A\u098D\u0992\u0998\u099B\u099E\u09A3\u09A7\u09AA\u09AF" +
		"\u09B5\u09B8\u09BD\u09C2\u09C5\u09C8\u09CD\u09D3\u09D6\u09D9\u09DD\u09E0" +
		"\u09E5\u09EA\u09EE\u09F1\u09F4\u09F8\u09FA\u09FD\u0A01\u0A04\u0A07\u0A0A" +
		"\u0A0E\u0A11\u0A16\u0A1C\u0A1F\u0A22\u0A26\u0A2A\u0A31\u0A35\u0A38\u0A3C" +
		"\u0A3F\u0A43\u0A4F\u0A52\u0A56\u0A5E\u0A62\u0A6D\u0A76\u0A7F\u0A88\u0A91" +
		"\u0A9A\u0AA3\u0AA6\u0AAE\u0AB6\u0ABB\u0AC1\u0AC9\u0ACF\u0AD4\u0AD7\u0ADB" +
		"\u0AE3\u0AEB\u0AF2\u0AF4\u0AFE\u0B05\u0B0D\u0B15\u0B1D\u0B25\u0B2D\u0B35" +
		"\u0B3D\u0B45\u0B4B\u0B51\u0B5C\u0B5F\u0B65\u0B6B\u0B6F\u0B75\u0B77\u0B7E" +
		"\u0B86\u0B8D\u0B95\u0B9C\u0BA9\u0BAF\u0BB9\u0BBD\u0BC0\u0BC4\u0BC8\u0BCD" +
		"\u0BD0\u0BD4\u0BD8\u0BDE\u0BE2\u0BE7\u0BEA\u0BEE\u0BF1\u0BF6\u0BFA\u0BFF" +
		"\u0C01\u0C08\u0C0E\u0C15\u0C1E";
	public static readonly _serializedATN: string = Utils.join(
		[
			SysMLv2._serializedATNSegment0,
			SysMLv2._serializedATNSegment1,
			SysMLv2._serializedATNSegment2,
			SysMLv2._serializedATNSegment3,
			SysMLv2._serializedATNSegment4,
			SysMLv2._serializedATNSegment5,
			SysMLv2._serializedATNSegment6,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!SysMLv2.__ATN) {
			SysMLv2.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(SysMLv2._serializedATN));
		}

		return SysMLv2.__ATN;
	}

}

export class ModelContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(SysMLv2.EOF, 0); }
	public element(): ElementContext[];
	public element(i: number): ElementContext;
	public element(i?: number): ElementContext | ElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ElementContext);
		} else {
			return this.getRuleContext(i, ElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_model; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitModel) {
			return visitor.visitModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementContext extends ParserRuleContext {
	public importStatement(): ImportStatementContext | undefined {
		return this.tryGetRuleContext(0, ImportStatementContext);
	}
	public individualDefinition(): IndividualDefinitionContext | undefined {
		return this.tryGetRuleContext(0, IndividualDefinitionContext);
	}
	public individualUsage(): IndividualUsageContext | undefined {
		return this.tryGetRuleContext(0, IndividualUsageContext);
	}
	public packageElement(): PackageElementContext | undefined {
		return this.tryGetRuleContext(0, PackageElementContext);
	}
	public definition(): DefinitionContext | undefined {
		return this.tryGetRuleContext(0, DefinitionContext);
	}
	public partDefinition(): PartDefinitionContext | undefined {
		return this.tryGetRuleContext(0, PartDefinitionContext);
	}
	public partUsage(): PartUsageContext | undefined {
		return this.tryGetRuleContext(0, PartUsageContext);
	}
	public actionDefinition(): ActionDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ActionDefinitionContext);
	}
	public actionUsage(): ActionUsageContext | undefined {
		return this.tryGetRuleContext(0, ActionUsageContext);
	}
	public stateDefinition(): StateDefinitionContext | undefined {
		return this.tryGetRuleContext(0, StateDefinitionContext);
	}
	public stateUsage(): StateUsageContext | undefined {
		return this.tryGetRuleContext(0, StateUsageContext);
	}
	public requirementDefinition(): RequirementDefinitionContext | undefined {
		return this.tryGetRuleContext(0, RequirementDefinitionContext);
	}
	public requirementUsage(): RequirementUsageContext | undefined {
		return this.tryGetRuleContext(0, RequirementUsageContext);
	}
	public useCaseDefinition(): UseCaseDefinitionContext | undefined {
		return this.tryGetRuleContext(0, UseCaseDefinitionContext);
	}
	public useCaseUsage(): UseCaseUsageContext | undefined {
		return this.tryGetRuleContext(0, UseCaseUsageContext);
	}
	public constraintDefinition(): ConstraintDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ConstraintDefinitionContext);
	}
	public constraintUsage(): ConstraintUsageContext | undefined {
		return this.tryGetRuleContext(0, ConstraintUsageContext);
	}
	public attributeDefinition(): AttributeDefinitionContext | undefined {
		return this.tryGetRuleContext(0, AttributeDefinitionContext);
	}
	public attributeUsage(): AttributeUsageContext | undefined {
		return this.tryGetRuleContext(0, AttributeUsageContext);
	}
	public portDefinition(): PortDefinitionContext | undefined {
		return this.tryGetRuleContext(0, PortDefinitionContext);
	}
	public portUsage(): PortUsageContext | undefined {
		return this.tryGetRuleContext(0, PortUsageContext);
	}
	public connectionDefinition(): ConnectionDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ConnectionDefinitionContext);
	}
	public connectionUsage(): ConnectionUsageContext | undefined {
		return this.tryGetRuleContext(0, ConnectionUsageContext);
	}
	public interfaceDefinition(): InterfaceDefinitionContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDefinitionContext);
	}
	public interfaceUsage(): InterfaceUsageContext | undefined {
		return this.tryGetRuleContext(0, InterfaceUsageContext);
	}
	public allocationDefinition(): AllocationDefinitionContext | undefined {
		return this.tryGetRuleContext(0, AllocationDefinitionContext);
	}
	public allocationUsage(): AllocationUsageContext | undefined {
		return this.tryGetRuleContext(0, AllocationUsageContext);
	}
	public itemDefinition(): ItemDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ItemDefinitionContext);
	}
	public itemUsage(): ItemUsageContext | undefined {
		return this.tryGetRuleContext(0, ItemUsageContext);
	}
	public actorDefinition(): ActorDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ActorDefinitionContext);
	}
	public actorUsage(): ActorUsageContext | undefined {
		return this.tryGetRuleContext(0, ActorUsageContext);
	}
	public concernDefinition(): ConcernDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ConcernDefinitionContext);
	}
	public concernUsage(): ConcernUsageContext | undefined {
		return this.tryGetRuleContext(0, ConcernUsageContext);
	}
	public analysisDefinition(): AnalysisDefinitionContext | undefined {
		return this.tryGetRuleContext(0, AnalysisDefinitionContext);
	}
	public analysisUsage(): AnalysisUsageContext | undefined {
		return this.tryGetRuleContext(0, AnalysisUsageContext);
	}
	public verificationDefinition(): VerificationDefinitionContext | undefined {
		return this.tryGetRuleContext(0, VerificationDefinitionContext);
	}
	public verificationUsage(): VerificationUsageContext | undefined {
		return this.tryGetRuleContext(0, VerificationUsageContext);
	}
	public viewDefinition(): ViewDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ViewDefinitionContext);
	}
	public viewUsage(): ViewUsageContext | undefined {
		return this.tryGetRuleContext(0, ViewUsageContext);
	}
	public viewpointDefinition(): ViewpointDefinitionContext | undefined {
		return this.tryGetRuleContext(0, ViewpointDefinitionContext);
	}
	public viewpointUsage(): ViewpointUsageContext | undefined {
		return this.tryGetRuleContext(0, ViewpointUsageContext);
	}
	public enumerationDefinition(): EnumerationDefinitionContext | undefined {
		return this.tryGetRuleContext(0, EnumerationDefinitionContext);
	}
	public enumerationUsage(): EnumerationUsageContext | undefined {
		return this.tryGetRuleContext(0, EnumerationUsageContext);
	}
	public datatypeDefinition(): DatatypeDefinitionContext | undefined {
		return this.tryGetRuleContext(0, DatatypeDefinitionContext);
	}
	public datatypeUsage(): DatatypeUsageContext | undefined {
		return this.tryGetRuleContext(0, DatatypeUsageContext);
	}
	public associationDefinition(): AssociationDefinitionContext | undefined {
		return this.tryGetRuleContext(0, AssociationDefinitionContext);
	}
	public associationUsage(): AssociationUsageContext | undefined {
		return this.tryGetRuleContext(0, AssociationUsageContext);
	}
	public metadataDefinition(): MetadataDefinitionContext | undefined {
		return this.tryGetRuleContext(0, MetadataDefinitionContext);
	}
	public metadataUsage(): MetadataUsageContext | undefined {
		return this.tryGetRuleContext(0, MetadataUsageContext);
	}
	public metadataAnnotation(): MetadataAnnotationContext | undefined {
		return this.tryGetRuleContext(0, MetadataAnnotationContext);
	}
	public comment(): CommentContext | undefined {
		return this.tryGetRuleContext(0, CommentContext);
	}
	public documentation(): DocumentationContext | undefined {
		return this.tryGetRuleContext(0, DocumentationContext);
	}
	public calculation(): CalculationContext | undefined {
		return this.tryGetRuleContext(0, CalculationContext);
	}
	public calcUsage(): CalcUsageContext | undefined {
		return this.tryGetRuleContext(0, CalcUsageContext);
	}
	public interactionDefinition(): InteractionDefinitionContext | undefined {
		return this.tryGetRuleContext(0, InteractionDefinitionContext);
	}
	public interactionUsage(): InteractionUsageContext | undefined {
		return this.tryGetRuleContext(0, InteractionUsageContext);
	}
	public participantUsage(): ParticipantUsageContext | undefined {
		return this.tryGetRuleContext(0, ParticipantUsageContext);
	}
	public messageUsage(): MessageUsageContext | undefined {
		return this.tryGetRuleContext(0, MessageUsageContext);
	}
	public payloadUsage(): PayloadUsageContext | undefined {
		return this.tryGetRuleContext(0, PayloadUsageContext);
	}
	public occurrenceUsage(): OccurrenceUsageContext | undefined {
		return this.tryGetRuleContext(0, OccurrenceUsageContext);
	}
	public alternativeUsage(): AlternativeUsageContext | undefined {
		return this.tryGetRuleContext(0, AlternativeUsageContext);
	}
	public elseUsage(): ElseUsageContext | undefined {
		return this.tryGetRuleContext(0, ElseUsageContext);
	}
	public featureDefinition(): FeatureDefinitionContext | undefined {
		return this.tryGetRuleContext(0, FeatureDefinitionContext);
	}
	public featureUsage(): FeatureUsageContext | undefined {
		return this.tryGetRuleContext(0, FeatureUsageContext);
	}
	public functionDefinition(): FunctionDefinitionContext | undefined {
		return this.tryGetRuleContext(0, FunctionDefinitionContext);
	}
	public eventDefinition(): EventDefinitionContext | undefined {
		return this.tryGetRuleContext(0, EventDefinitionContext);
	}
	public eventUsage(): EventUsageContext | undefined {
		return this.tryGetRuleContext(0, EventUsageContext);
	}
	public performAction(): PerformActionContext | undefined {
		return this.tryGetRuleContext(0, PerformActionContext);
	}
	public exhibitState(): ExhibitStateContext | undefined {
		return this.tryGetRuleContext(0, ExhibitStateContext);
	}
	public entryAction(): EntryActionContext | undefined {
		return this.tryGetRuleContext(0, EntryActionContext);
	}
	public exitAction(): ExitActionContext | undefined {
		return this.tryGetRuleContext(0, ExitActionContext);
	}
	public doAction(): DoActionContext | undefined {
		return this.tryGetRuleContext(0, DoActionContext);
	}
	public acceptEvent(): AcceptEventContext | undefined {
		return this.tryGetRuleContext(0, AcceptEventContext);
	}
	public sendAction(): SendActionContext | undefined {
		return this.tryGetRuleContext(0, SendActionContext);
	}
	public stateTransition(): StateTransitionContext | undefined {
		return this.tryGetRuleContext(0, StateTransitionContext);
	}
	public subjectUsage(): SubjectUsageContext | undefined {
		return this.tryGetRuleContext(0, SubjectUsageContext);
	}
	public objectiveUsage(): ObjectiveUsageContext | undefined {
		return this.tryGetRuleContext(0, ObjectiveUsageContext);
	}
	public stakeholderUsage(): StakeholderUsageContext | undefined {
		return this.tryGetRuleContext(0, StakeholderUsageContext);
	}
	public allocateStatement(): AllocateStatementContext | undefined {
		return this.tryGetRuleContext(0, AllocateStatementContext);
	}
	public endFeature(): EndFeatureContext | undefined {
		return this.tryGetRuleContext(0, EndFeatureContext);
	}
	public redefinitionUsage(): RedefinitionUsageContext | undefined {
		return this.tryGetRuleContext(0, RedefinitionUsageContext);
	}
	public flowProperty(): FlowPropertyContext | undefined {
		return this.tryGetRuleContext(0, FlowPropertyContext);
	}
	public bindUsage(): BindUsageContext | undefined {
		return this.tryGetRuleContext(0, BindUsageContext);
	}
	public connectStatement(): ConnectStatementContext | undefined {
		return this.tryGetRuleContext(0, ConnectStatementContext);
	}
	public aliasStatement(): AliasStatementContext | undefined {
		return this.tryGetRuleContext(0, AliasStatementContext);
	}
	public satisfyStatement(): SatisfyStatementContext | undefined {
		return this.tryGetRuleContext(0, SatisfyStatementContext);
	}
	public dependencyStatement(): DependencyStatementContext | undefined {
		return this.tryGetRuleContext(0, DependencyStatementContext);
	}
	public firstStatement(): FirstStatementContext | undefined {
		return this.tryGetRuleContext(0, FirstStatementContext);
	}
	public thenStatement(): ThenStatementContext | undefined {
		return this.tryGetRuleContext(0, ThenStatementContext);
	}
	public returnStatement(): ReturnStatementContext | undefined {
		return this.tryGetRuleContext(0, ReturnStatementContext);
	}
	public requireStatement(): RequireStatementContext | undefined {
		return this.tryGetRuleContext(0, RequireStatementContext);
	}
	public verifyStatement(): VerifyStatementContext | undefined {
		return this.tryGetRuleContext(0, VerifyStatementContext);
	}
	public timesliceUsage(): TimesliceUsageContext | undefined {
		return this.tryGetRuleContext(0, TimesliceUsageContext);
	}
	public snapshotUsage(): SnapshotUsageContext | undefined {
		return this.tryGetRuleContext(0, SnapshotUsageContext);
	}
	public filterStatement(): FilterStatementContext | undefined {
		return this.tryGetRuleContext(0, FilterStatementContext);
	}
	public forkUsage(): ForkUsageContext | undefined {
		return this.tryGetRuleContext(0, ForkUsageContext);
	}
	public joinUsage(): JoinUsageContext | undefined {
		return this.tryGetRuleContext(0, JoinUsageContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_element; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitElement) {
			return visitor.visitElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AliasStatementContext extends ParserRuleContext {
	public ALIAS(): TerminalNode { return this.getToken(SysMLv2.ALIAS, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public FOR(): TerminalNode { return this.getToken(SysMLv2.FOR, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_aliasStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAliasStatement) {
			return visitor.visitAliasStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SatisfyStatementContext extends ParserRuleContext {
	public SATISFY(): TerminalNode { return this.getToken(SysMLv2.SATISFY, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public BY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.BY, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public REQUIREMENT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REQUIREMENT, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_satisfyStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitSatisfyStatement) {
			return visitor.visitSatisfyStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DependencyStatementContext extends ParserRuleContext {
	public DEPENDENCY(): TerminalNode { return this.getToken(SysMLv2.DEPENDENCY, 0); }
	public FROM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FROM, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public TO(): TerminalNode { return this.getToken(SysMLv2.TO, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public metadataPrefix(): MetadataPrefixContext | undefined {
		return this.tryGetRuleContext(0, MetadataPrefixContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_dependencyStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDependencyStatement) {
			return visitor.visitDependencyStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FilterStatementContext extends ParserRuleContext {
	public FILTER(): TerminalNode { return this.getToken(SysMLv2.FILTER, 0); }
	public filterExpression(): FilterExpressionContext {
		return this.getRuleContext(0, FilterExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_filterStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFilterStatement) {
			return visitor.visitFilterStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FilterExpressionContext extends ParserRuleContext {
	public filterTerm(): FilterTermContext[];
	public filterTerm(i: number): FilterTermContext;
	public filterTerm(i?: number): FilterTermContext | FilterTermContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FilterTermContext);
		} else {
			return this.getRuleContext(i, FilterTermContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.AND);
		} else {
			return this.getToken(SysMLv2.AND, i);
		}
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.OR);
		} else {
			return this.getToken(SysMLv2.OR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_filterExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFilterExpression) {
			return visitor.visitFilterExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FilterTermContext extends ParserRuleContext {
	public AT_SIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.AT_SIGN, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_filterTerm; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFilterTerm) {
			return visitor.visitFilterTerm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FirstStatementContext extends ParserRuleContext {
	public FIRST(): TerminalNode { return this.getToken(SysMLv2.FIRST, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public THEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.THEN, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_firstStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFirstStatement) {
			return visitor.visitFirstStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ThenStatementContext extends ParserRuleContext {
	public THEN(): TerminalNode { return this.getToken(SysMLv2.THEN, 0); }
	public EVENT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.EVENT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public ACTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ACTION, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public ACCEPT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ACCEPT, 0); }
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public FORK(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FORK, 0); }
	public JOIN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.JOIN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_thenStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitThenStatement) {
			return visitor.visitThenStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnStatementContext extends ParserRuleContext {
	public RETURN(): TerminalNode { return this.getToken(SysMLv2.RETURN, 0); }
	public SEMICOLON(): TerminalNode { return this.getToken(SysMLv2.SEMICOLON, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public COLONGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ATTRIBUTE, 0); }
	public PART(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PART, 0); }
	public COLONGTGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGTGT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_returnStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitReturnStatement) {
			return visitor.visitReturnStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequireStatementContext extends ParserRuleContext {
	public REQUIRE(): TerminalNode { return this.getToken(SysMLv2.REQUIRE, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public CONSTRAINT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.CONSTRAINT, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_requireStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitRequireStatement) {
			return visitor.visitRequireStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForkUsageContext extends ParserRuleContext {
	public FORK(): TerminalNode { return this.getToken(SysMLv2.FORK, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_forkUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitForkUsage) {
			return visitor.visitForkUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JoinUsageContext extends ParserRuleContext {
	public JOIN(): TerminalNode { return this.getToken(SysMLv2.JOIN, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_joinUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitJoinUsage) {
			return visitor.visitJoinUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EndFeatureContext extends ParserRuleContext {
	public END(): TerminalNode { return this.getToken(SysMLv2.END, 0); }
	public metadataPrefix(): MetadataPrefixContext | undefined {
		return this.tryGetRuleContext(0, MetadataPrefixContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public COLONCOLONGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONCOLONGT, 0); }
	public COLONGTGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGTGT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_endFeature; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEndFeature) {
			return visitor.visitEndFeature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MetadataPrefixContext extends ParserRuleContext {
	public HASH(): TerminalNode { return this.getToken(SysMLv2.HASH, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_metadataPrefix; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMetadataPrefix) {
			return visitor.visitMetadataPrefix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BindUsageContext extends ParserRuleContext {
	public BIND(): TerminalNode { return this.getToken(SysMLv2.BIND, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public ASSIGN(): TerminalNode { return this.getToken(SysMLv2.ASSIGN, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_bindUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitBindUsage) {
			return visitor.visitBindUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConnectStatementContext extends ParserRuleContext {
	public CONNECT(): TerminalNode { return this.getToken(SysMLv2.CONNECT, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public TO(): TerminalNode { return this.getToken(SysMLv2.TO, 0); }
	public multiplicity(): MultiplicityContext[];
	public multiplicity(i: number): MultiplicityContext;
	public multiplicity(i?: number): MultiplicityContext | MultiplicityContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicityContext);
		} else {
			return this.getRuleContext(i, MultiplicityContext);
		}
	}
	public COLONCOLONGT(): TerminalNode[];
	public COLONCOLONGT(i: number): TerminalNode;
	public COLONCOLONGT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COLONCOLONGT);
		} else {
			return this.getToken(SysMLv2.COLONCOLONGT, i);
		}
	}
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_connectStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConnectStatement) {
			return visitor.visitConnectStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RedefinitionUsageContext extends ParserRuleContext {
	public COLONGTGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGTGT, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ASSIGN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public metaTyping(): MetaTypingContext | undefined {
		return this.tryGetRuleContext(0, MetaTypingContext);
	}
	public REDEFINES(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REDEFINES, 0); }
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_redefinitionUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitRedefinitionUsage) {
			return visitor.visitRedefinitionUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MetaTypingContext extends ParserRuleContext {
	public META(): TerminalNode { return this.getToken(SysMLv2.META, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_metaTyping; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMetaTyping) {
			return visitor.visitMetaTyping(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FlowPropertyContext extends ParserRuleContext {
	public FLOW(): TerminalNode { return this.getToken(SysMLv2.FLOW, 0); }
	public PROPERTY(): TerminalNode { return this.getToken(SysMLv2.PROPERTY, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public DIRECTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DIRECTION, 0); }
	public direction(): DirectionContext | undefined {
		return this.tryGetRuleContext(0, DirectionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_flowProperty; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFlowProperty) {
			return visitor.visitFlowProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageElementContext extends ParserRuleContext {
	public PACKAGE(): TerminalNode { return this.getToken(SysMLv2.PACKAGE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public STANDARD(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.STANDARD, 0); }
	public LIBRARY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LIBRARY, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_packageElement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPackageElement) {
			return visitor.visitPackageElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportStatementContext extends ParserRuleContext {
	public IMPORT(): TerminalNode { return this.getToken(SysMLv2.IMPORT, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public COLONCOLON(): TerminalNode[];
	public COLONCOLON(i: number): TerminalNode;
	public COLONCOLON(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COLONCOLON);
		} else {
			return this.getToken(SysMLv2.COLONCOLON, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public MULTIPLY(): TerminalNode[];
	public MULTIPLY(i: number): TerminalNode;
	public MULTIPLY(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.MULTIPLY);
		} else {
			return this.getToken(SysMLv2.MULTIPLY, i);
		}
	}
	public POWER(): TerminalNode[];
	public POWER(i: number): TerminalNode;
	public POWER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.POWER);
		} else {
			return this.getToken(SysMLv2.POWER, i);
		}
	}
	public PRIVATE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PRIVATE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_importStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitImportStatement) {
			return visitor.visitImportStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PartDefinitionContext extends ParserRuleContext {
	public PART(): TerminalNode { return this.getToken(SysMLv2.PART, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_partDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPartDefinition) {
			return visitor.visitPartDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PartUsageContext extends ParserRuleContext {
	public PART(): TerminalNode { return this.getToken(SysMLv2.PART, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public metadataPrefix(): MetadataPrefixContext | undefined {
		return this.tryGetRuleContext(0, MetadataPrefixContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_partUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPartUsage) {
			return visitor.visitPartUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActionDefinitionContext extends ParserRuleContext {
	public ACTION(): TerminalNode { return this.getToken(SysMLv2.ACTION, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_actionDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitActionDefinition) {
			return visitor.visitActionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActionUsageContext extends ParserRuleContext {
	public ACTION(): TerminalNode { return this.getToken(SysMLv2.ACTION, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_actionUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitActionUsage) {
			return visitor.visitActionUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PerformActionContext extends ParserRuleContext {
	public PERFORM(): TerminalNode { return this.getToken(SysMLv2.PERFORM, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public ACTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ACTION, 0); }
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public REDEFINES(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REDEFINES, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_performAction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPerformAction) {
			return visitor.visitPerformAction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExhibitStateContext extends ParserRuleContext {
	public EXHIBIT(): TerminalNode { return this.getToken(SysMLv2.EXHIBIT, 0); }
	public STATE(): TerminalNode { return this.getToken(SysMLv2.STATE, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public PARALLEL(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PARALLEL, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_exhibitState; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExhibitState) {
			return visitor.visitExhibitState(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntryActionContext extends ParserRuleContext {
	public ENTRY(): TerminalNode { return this.getToken(SysMLv2.ENTRY, 0); }
	public SEMICOLON(): TerminalNode[];
	public SEMICOLON(i: number): TerminalNode;
	public SEMICOLON(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.SEMICOLON);
		} else {
			return this.getToken(SysMLv2.SEMICOLON, i);
		}
	}
	public THEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.THEN, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DIVIDE, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public ACTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ACTION, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_entryAction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEntryAction) {
			return visitor.visitEntryAction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExitActionContext extends ParserRuleContext {
	public EXIT(): TerminalNode { return this.getToken(SysMLv2.EXIT, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DIVIDE, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_exitAction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExitAction) {
			return visitor.visitExitAction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DoActionContext extends ParserRuleContext {
	public DO(): TerminalNode { return this.getToken(SysMLv2.DO, 0); }
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DIVIDE, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_doAction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDoAction) {
			return visitor.visitDoAction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AcceptEventContext extends ParserRuleContext {
	public ACCEPT(): TerminalNode { return this.getToken(SysMLv2.ACCEPT, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLON, 0); }
	public VIA(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VIA, 0); }
	public IF(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.IF, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public AT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.AT, 0); }
	public WHEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.WHEN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_acceptEvent; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAcceptEvent) {
			return visitor.visitAcceptEvent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SendActionContext extends ParserRuleContext {
	public SEND(): TerminalNode { return this.getToken(SysMLv2.SEND, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public TO(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TO, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public VIA(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VIA, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_sendAction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitSendAction) {
			return visitor.visitSendAction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StateDefinitionContext extends ParserRuleContext {
	public STATE(): TerminalNode { return this.getToken(SysMLv2.STATE, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_stateDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitStateDefinition) {
			return visitor.visitStateDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StateUsageContext extends ParserRuleContext {
	public STATE(): TerminalNode { return this.getToken(SysMLv2.STATE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_stateUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitStateUsage) {
			return visitor.visitStateUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EventDefinitionContext extends ParserRuleContext {
	public EVENT(): TerminalNode { return this.getToken(SysMLv2.EVENT, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_eventDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEventDefinition) {
			return visitor.visitEventDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EventUsageContext extends ParserRuleContext {
	public EVENT(): TerminalNode { return this.getToken(SysMLv2.EVENT, 0); }
	public OCCURRENCE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OCCURRENCE, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(SysMLv2.SEMICOLON, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_eventUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEventUsage) {
			return visitor.visitEventUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequirementDefinitionContext extends ParserRuleContext {
	public REQUIREMENT(): TerminalNode { return this.getToken(SysMLv2.REQUIREMENT, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_requirementDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitRequirementDefinition) {
			return visitor.visitRequirementDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequirementUsageContext extends ParserRuleContext {
	public REQUIREMENT(): TerminalNode { return this.getToken(SysMLv2.REQUIREMENT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public shortName(): ShortNameContext | undefined {
		return this.tryGetRuleContext(0, ShortNameContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_requirementUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitRequirementUsage) {
			return visitor.visitRequirementUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseCaseDefinitionContext extends ParserRuleContext {
	public USE(): TerminalNode { return this.getToken(SysMLv2.USE, 0); }
	public CASE(): TerminalNode { return this.getToken(SysMLv2.CASE, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_useCaseDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitUseCaseDefinition) {
			return visitor.visitUseCaseDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseCaseUsageContext extends ParserRuleContext {
	public USE(): TerminalNode { return this.getToken(SysMLv2.USE, 0); }
	public CASE(): TerminalNode { return this.getToken(SysMLv2.CASE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_useCaseUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitUseCaseUsage) {
			return visitor.visitUseCaseUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstraintDefinitionContext extends ParserRuleContext {
	public CONSTRAINT(): TerminalNode { return this.getToken(SysMLv2.CONSTRAINT, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_constraintDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConstraintDefinition) {
			return visitor.visitConstraintDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstraintUsageContext extends ParserRuleContext {
	public CONSTRAINT(): TerminalNode { return this.getToken(SysMLv2.CONSTRAINT, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_constraintUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConstraintUsage) {
			return visitor.visitConstraintUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttributeDefinitionContext extends ParserRuleContext {
	public ATTRIBUTE(): TerminalNode { return this.getToken(SysMLv2.ATTRIBUTE, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_attributeDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAttributeDefinition) {
			return visitor.visitAttributeDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttributeUsageContext extends ParserRuleContext {
	public ATTRIBUTE(): TerminalNode { return this.getToken(SysMLv2.ATTRIBUTE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public metadataPrefix(): MetadataPrefixContext | undefined {
		return this.tryGetRuleContext(0, MetadataPrefixContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_attributeUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAttributeUsage) {
			return visitor.visitAttributeUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueBindingContext extends ParserRuleContext {
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ASSIGN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public DEFAULT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DEFAULT, 0); }
	public COLONASSIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONASSIGN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_valueBinding; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitValueBinding) {
			return visitor.visitValueBinding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PortDefinitionContext extends ParserRuleContext {
	public PORT(): TerminalNode { return this.getToken(SysMLv2.PORT, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_portDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPortDefinition) {
			return visitor.visitPortDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PortUsageContext extends ParserRuleContext {
	public PORT(): TerminalNode { return this.getToken(SysMLv2.PORT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public COLONGTGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGTGT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_portUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPortUsage) {
			return visitor.visitPortUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConnectionDefinitionContext extends ParserRuleContext {
	public CONNECTION(): TerminalNode { return this.getToken(SysMLv2.CONNECTION, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_connectionDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConnectionDefinition) {
			return visitor.visitConnectionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConnectionUsageContext extends ParserRuleContext {
	public CONNECTION(): TerminalNode { return this.getToken(SysMLv2.CONNECTION, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public metadataPrefix(): MetadataPrefixContext | undefined {
		return this.tryGetRuleContext(0, MetadataPrefixContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_connectionUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConnectionUsage) {
			return visitor.visitConnectionUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceDefinitionContext extends ParserRuleContext {
	public INTERFACE(): TerminalNode { return this.getToken(SysMLv2.INTERFACE, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_interfaceDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitInterfaceDefinition) {
			return visitor.visitInterfaceDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceUsageContext extends ParserRuleContext {
	public INTERFACE(): TerminalNode { return this.getToken(SysMLv2.INTERFACE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public connectStatement(): ConnectStatementContext | undefined {
		return this.tryGetRuleContext(0, ConnectStatementContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_interfaceUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitInterfaceUsage) {
			return visitor.visitInterfaceUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllocationDefinitionContext extends ParserRuleContext {
	public ALLOCATION(): TerminalNode { return this.getToken(SysMLv2.ALLOCATION, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_allocationDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAllocationDefinition) {
			return visitor.visitAllocationDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllocationUsageContext extends ParserRuleContext {
	public ALLOCATION(): TerminalNode { return this.getToken(SysMLv2.ALLOCATION, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public allocationBody(): AllocationBodyContext | undefined {
		return this.tryGetRuleContext(0, AllocationBodyContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_allocationUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAllocationUsage) {
			return visitor.visitAllocationUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllocationBodyContext extends ParserRuleContext {
	public allocateStatement(): AllocateStatementContext[];
	public allocateStatement(i: number): AllocateStatementContext;
	public allocateStatement(i?: number): AllocateStatementContext | AllocateStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AllocateStatementContext);
		} else {
			return this.getRuleContext(i, AllocateStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_allocationBody; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAllocationBody) {
			return visitor.visitAllocationBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ItemDefinitionContext extends ParserRuleContext {
	public ITEM(): TerminalNode { return this.getToken(SysMLv2.ITEM, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_itemDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitItemDefinition) {
			return visitor.visitItemDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ItemUsageContext extends ParserRuleContext {
	public ITEM(): TerminalNode { return this.getToken(SysMLv2.ITEM, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public direction(): DirectionContext | undefined {
		return this.tryGetRuleContext(0, DirectionContext);
	}
	public REF(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REF, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext[];
	public typing(i: number): TypingContext;
	public typing(i?: number): TypingContext | TypingContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypingContext);
		} else {
			return this.getRuleContext(i, TypingContext);
		}
	}
	public COLONGTGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGTGT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_itemUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitItemUsage) {
			return visitor.visitItemUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefinitionContext extends ParserRuleContext {
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_definition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDefinition) {
			return visitor.visitDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IndividualDefinitionContext extends ParserRuleContext {
	public INDIVIDUAL(): TerminalNode { return this.getToken(SysMLv2.INDIVIDUAL, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_individualDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitIndividualDefinition) {
			return visitor.visitIndividualDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IndividualUsageContext extends ParserRuleContext {
	public INDIVIDUAL(): TerminalNode { return this.getToken(SysMLv2.INDIVIDUAL, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_individualUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitIndividualUsage) {
			return visitor.visitIndividualUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TimesliceUsageContext extends ParserRuleContext {
	public TIMESLICE(): TerminalNode { return this.getToken(SysMLv2.TIMESLICE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_timesliceUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTimesliceUsage) {
			return visitor.visitTimesliceUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SnapshotUsageContext extends ParserRuleContext {
	public SNAPSHOT(): TerminalNode { return this.getToken(SysMLv2.SNAPSHOT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_snapshotUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitSnapshotUsage) {
			return visitor.visitSnapshotUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActorDefinitionContext extends ParserRuleContext {
	public ACTOR(): TerminalNode { return this.getToken(SysMLv2.ACTOR, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_actorDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitActorDefinition) {
			return visitor.visitActorDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActorUsageContext extends ParserRuleContext {
	public ACTOR(): TerminalNode { return this.getToken(SysMLv2.ACTOR, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_actorUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitActorUsage) {
			return visitor.visitActorUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConcernDefinitionContext extends ParserRuleContext {
	public CONCERN(): TerminalNode { return this.getToken(SysMLv2.CONCERN, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_concernDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConcernDefinition) {
			return visitor.visitConcernDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConcernUsageContext extends ParserRuleContext {
	public CONCERN(): TerminalNode { return this.getToken(SysMLv2.CONCERN, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_concernUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConcernUsage) {
			return visitor.visitConcernUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnalysisDefinitionContext extends ParserRuleContext {
	public ANALYSIS(): TerminalNode { return this.getToken(SysMLv2.ANALYSIS, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_analysisDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAnalysisDefinition) {
			return visitor.visitAnalysisDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnalysisUsageContext extends ParserRuleContext {
	public ANALYSIS(): TerminalNode { return this.getToken(SysMLv2.ANALYSIS, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_analysisUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAnalysisUsage) {
			return visitor.visitAnalysisUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SubjectUsageContext extends ParserRuleContext {
	public SUBJECT(): TerminalNode { return this.getToken(SysMLv2.SUBJECT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_subjectUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitSubjectUsage) {
			return visitor.visitSubjectUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectiveUsageContext extends ParserRuleContext {
	public OBJECTIVE(): TerminalNode { return this.getToken(SysMLv2.OBJECTIVE, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_objectiveUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitObjectiveUsage) {
			return visitor.visitObjectiveUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StakeholderUsageContext extends ParserRuleContext {
	public STAKEHOLDER(): TerminalNode { return this.getToken(SysMLv2.STAKEHOLDER, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_stakeholderUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitStakeholderUsage) {
			return visitor.visitStakeholderUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllocateStatementContext extends ParserRuleContext {
	public ALLOCATE(): TerminalNode { return this.getToken(SysMLv2.ALLOCATE, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public TO(): TerminalNode { return this.getToken(SysMLv2.TO, 0); }
	public allocateBody(): AllocateBodyContext | undefined {
		return this.tryGetRuleContext(0, AllocateBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_allocateStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAllocateStatement) {
			return visitor.visitAllocateStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllocateBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(SysMLv2.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(SysMLv2.RBRACE, 0); }
	public allocateStatement(): AllocateStatementContext[];
	public allocateStatement(i: number): AllocateStatementContext;
	public allocateStatement(i?: number): AllocateStatementContext | AllocateStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AllocateStatementContext);
		} else {
			return this.getRuleContext(i, AllocateStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_allocateBody; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAllocateBody) {
			return visitor.visitAllocateBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerificationDefinitionContext extends ParserRuleContext {
	public VERIFICATION(): TerminalNode { return this.getToken(SysMLv2.VERIFICATION, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public verificationBody(): VerificationBodyContext | undefined {
		return this.tryGetRuleContext(0, VerificationBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_verificationDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVerificationDefinition) {
			return visitor.visitVerificationDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerificationUsageContext extends ParserRuleContext {
	public VERIFICATION(): TerminalNode { return this.getToken(SysMLv2.VERIFICATION, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public verificationBody(): VerificationBodyContext | undefined {
		return this.tryGetRuleContext(0, VerificationBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_verificationUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVerificationUsage) {
			return visitor.visitVerificationUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerificationBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(SysMLv2.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(SysMLv2.RBRACE, 0); }
	public verificationBodyElement(): VerificationBodyElementContext[];
	public verificationBodyElement(i: number): VerificationBodyElementContext;
	public verificationBodyElement(i?: number): VerificationBodyElementContext | VerificationBodyElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VerificationBodyElementContext);
		} else {
			return this.getRuleContext(i, VerificationBodyElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_verificationBody; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVerificationBody) {
			return visitor.visitVerificationBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerificationBodyElementContext extends ParserRuleContext {
	public element(): ElementContext | undefined {
		return this.tryGetRuleContext(0, ElementContext);
	}
	public verifyStatement(): VerifyStatementContext | undefined {
		return this.tryGetRuleContext(0, VerifyStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_verificationBodyElement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVerificationBodyElement) {
			return visitor.visitVerificationBodyElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerifyStatementContext extends ParserRuleContext {
	public VERIFY(): TerminalNode { return this.getToken(SysMLv2.VERIFY, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_verifyStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVerifyStatement) {
			return visitor.visitVerifyStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewDefinitionContext extends ParserRuleContext {
	public VIEW(): TerminalNode { return this.getToken(SysMLv2.VIEW, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public viewBody(): ViewBodyContext | undefined {
		return this.tryGetRuleContext(0, ViewBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewDefinition) {
			return visitor.visitViewDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewUsageContext extends ParserRuleContext {
	public VIEW(): TerminalNode { return this.getToken(SysMLv2.VIEW, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public viewBody(): ViewBodyContext | undefined {
		return this.tryGetRuleContext(0, ViewBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewUsage) {
			return visitor.visitViewUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(SysMLv2.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(SysMLv2.RBRACE, 0); }
	public viewBodyElement(): ViewBodyElementContext[];
	public viewBodyElement(i: number): ViewBodyElementContext;
	public viewBodyElement(i?: number): ViewBodyElementContext | ViewBodyElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ViewBodyElementContext);
		} else {
			return this.getRuleContext(i, ViewBodyElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewBody; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewBody) {
			return visitor.visitViewBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewBodyElementContext extends ParserRuleContext {
	public element(): ElementContext | undefined {
		return this.tryGetRuleContext(0, ElementContext);
	}
	public exposeStatement(): ExposeStatementContext | undefined {
		return this.tryGetRuleContext(0, ExposeStatementContext);
	}
	public filterStatement(): FilterStatementContext | undefined {
		return this.tryGetRuleContext(0, FilterStatementContext);
	}
	public satisfyStatement(): SatisfyStatementContext | undefined {
		return this.tryGetRuleContext(0, SatisfyStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewBodyElement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewBodyElement) {
			return visitor.visitViewBodyElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExposeStatementContext extends ParserRuleContext {
	public EXPOSE(): TerminalNode { return this.getToken(SysMLv2.EXPOSE, 0); }
	public exposeTarget(): ExposeTargetContext[];
	public exposeTarget(i: number): ExposeTargetContext;
	public exposeTarget(i?: number): ExposeTargetContext | ExposeTargetContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExposeTargetContext);
		} else {
			return this.getRuleContext(i, ExposeTargetContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_exposeStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExposeStatement) {
			return visitor.visitExposeStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExposeTargetContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public COLONCOLON(): TerminalNode[];
	public COLONCOLON(i: number): TerminalNode;
	public COLONCOLON(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COLONCOLON);
		} else {
			return this.getToken(SysMLv2.COLONCOLON, i);
		}
	}
	public POWER(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.POWER, 0); }
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.DOT);
		} else {
			return this.getToken(SysMLv2.DOT, i);
		}
	}
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.MULTIPLY, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_exposeTarget; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExposeTarget) {
			return visitor.visitExposeTarget(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewpointDefinitionContext extends ParserRuleContext {
	public VIEWPOINT(): TerminalNode { return this.getToken(SysMLv2.VIEWPOINT, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewpointDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewpointDefinition) {
			return visitor.visitViewpointDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ViewpointUsageContext extends ParserRuleContext {
	public VIEWPOINT(): TerminalNode { return this.getToken(SysMLv2.VIEWPOINT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_viewpointUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitViewpointUsage) {
			return visitor.visitViewpointUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumerationDefinitionContext extends ParserRuleContext {
	public ENUM(): TerminalNode { return this.getToken(SysMLv2.ENUM, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_enumerationDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEnumerationDefinition) {
			return visitor.visitEnumerationDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumerationUsageContext extends ParserRuleContext {
	public ENUM(): TerminalNode { return this.getToken(SysMLv2.ENUM, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_enumerationUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEnumerationUsage) {
			return visitor.visitEnumerationUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatatypeDefinitionContext extends ParserRuleContext {
	public DATATYPE(): TerminalNode { return this.getToken(SysMLv2.DATATYPE, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_datatypeDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDatatypeDefinition) {
			return visitor.visitDatatypeDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatatypeUsageContext extends ParserRuleContext {
	public DATATYPE(): TerminalNode { return this.getToken(SysMLv2.DATATYPE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_datatypeUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDatatypeUsage) {
			return visitor.visitDatatypeUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssociationDefinitionContext extends ParserRuleContext {
	public ASSOC(): TerminalNode { return this.getToken(SysMLv2.ASSOC, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_associationDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAssociationDefinition) {
			return visitor.visitAssociationDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssociationUsageContext extends ParserRuleContext {
	public ASSOC(): TerminalNode { return this.getToken(SysMLv2.ASSOC, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_associationUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAssociationUsage) {
			return visitor.visitAssociationUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MetadataDefinitionContext extends ParserRuleContext {
	public METADATA(): TerminalNode { return this.getToken(SysMLv2.METADATA, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public LT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LT, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.GT, 0); }
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_metadataDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMetadataDefinition) {
			return visitor.visitMetadataDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MetadataUsageContext extends ParserRuleContext {
	public METADATA(): TerminalNode { return this.getToken(SysMLv2.METADATA, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_metadataUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMetadataUsage) {
			return visitor.visitMetadataUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MetadataAnnotationContext extends ParserRuleContext {
	public AT_SIGN(): TerminalNode { return this.getToken(SysMLv2.AT_SIGN, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public ABOUT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ABOUT, 0); }
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_metadataAnnotation; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMetadataAnnotation) {
			return visitor.visitMetadataAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CommentContext extends ParserRuleContext {
	public COMMENT(): TerminalNode { return this.getToken(SysMLv2.COMMENT, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public ABOUT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ABOUT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public stringValue(): StringValueContext | undefined {
		return this.tryGetRuleContext(0, StringValueContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_comment; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitComment) {
			return visitor.visitComment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DocumentationContext extends ParserRuleContext {
	public DOC(): TerminalNode { return this.getToken(SysMLv2.DOC, 0); }
	public stringValue(): StringValueContext {
		return this.getRuleContext(0, StringValueContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_documentation; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDocumentation) {
			return visitor.visitDocumentation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CalculationContext extends ParserRuleContext {
	public CALC(): TerminalNode { return this.getToken(SysMLv2.CALC, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_calculation; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitCalculation) {
			return visitor.visitCalculation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CalcUsageContext extends ParserRuleContext {
	public CALC(): TerminalNode { return this.getToken(SysMLv2.CALC, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public COLONGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGT, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_calcUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitCalcUsage) {
			return visitor.visitCalcUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InteractionDefinitionContext extends ParserRuleContext {
	public INTERACTION(): TerminalNode { return this.getToken(SysMLv2.INTERACTION, 0); }
	public DEF(): TerminalNode { return this.getToken(SysMLv2.DEF, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_interactionDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitInteractionDefinition) {
			return visitor.visitInteractionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InteractionUsageContext extends ParserRuleContext {
	public INTERACTION(): TerminalNode { return this.getToken(SysMLv2.INTERACTION, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_interactionUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitInteractionUsage) {
			return visitor.visitInteractionUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParticipantUsageContext extends ParserRuleContext {
	public PARTICIPANT(): TerminalNode { return this.getToken(SysMLv2.PARTICIPANT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_participantUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitParticipantUsage) {
			return visitor.visitParticipantUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MessageUsageContext extends ParserRuleContext {
	public MESSAGE(): TerminalNode { return this.getToken(SysMLv2.MESSAGE, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public OF(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OF, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public messagePattern(): MessagePatternContext | undefined {
		return this.tryGetRuleContext(0, MessagePatternContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public FROM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FROM, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TO, 0); }
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_messageUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMessageUsage) {
			return visitor.visitMessageUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MessagePatternContext extends ParserRuleContext {
	public COLON(): TerminalNode { return this.getToken(SysMLv2.COLON, 0); }
	public SENDMESSAGE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SENDMESSAGE, 0); }
	public FROM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FROM, 0); }
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public TO(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TO, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_messagePattern; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMessagePattern) {
			return visitor.visitMessagePattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PayloadUsageContext extends ParserRuleContext {
	public PAYLOAD(): TerminalNode { return this.getToken(SysMLv2.PAYLOAD, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_payloadUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPayloadUsage) {
			return visitor.visitPayloadUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OccurrenceUsageContext extends ParserRuleContext {
	public OCCURRENCE(): TerminalNode { return this.getToken(SysMLv2.OCCURRENCE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_occurrenceUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitOccurrenceUsage) {
			return visitor.visitOccurrenceUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AlternativeUsageContext extends ParserRuleContext {
	public ALT(): TerminalNode { return this.getToken(SysMLv2.ALT, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_alternativeUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAlternativeUsage) {
			return visitor.visitAlternativeUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElseUsageContext extends ParserRuleContext {
	public ELSE(): TerminalNode { return this.getToken(SysMLv2.ELSE, 0); }
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_elseUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitElseUsage) {
			return visitor.visitElseUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeatureDefinitionContext extends ParserRuleContext {
	public FEATURE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FEATURE, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public REF(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_featureDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFeatureDefinition) {
			return visitor.visitFeatureDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeatureUsageContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public direction(): DirectionContext | undefined {
		return this.tryGetRuleContext(0, DirectionContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public specialization(): SpecializationContext | undefined {
		return this.tryGetRuleContext(0, SpecializationContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public valueBinding(): ValueBindingContext | undefined {
		return this.tryGetRuleContext(0, ValueBindingContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_featureUsage; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFeatureUsage) {
			return visitor.visitFeatureUsage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDefinitionContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(SysMLv2.FUNCTION, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public stringValue(): StringValueContext | undefined {
		return this.tryGetRuleContext(0, StringValueContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public modifier(): ModifierContext[];
	public modifier(i: number): ModifierContext;
	public modifier(i?: number): ModifierContext | ModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModifierContext);
		} else {
			return this.getRuleContext(i, ModifierContext);
		}
	}
	public functionSignature(): FunctionSignatureContext | undefined {
		return this.tryGetRuleContext(0, FunctionSignatureContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_functionDefinition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFunctionDefinition) {
			return visitor.visitFunctionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionSignatureContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(SysMLv2.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(SysMLv2.RPAREN, 0); }
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	public returnType(): ReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, ReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_functionSignature; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFunctionSignature) {
			return visitor.visitFunctionSignature(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_parameterList; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public visibility(): VisibilityContext | undefined {
		return this.tryGetRuleContext(0, VisibilityContext);
	}
	public direction(): DirectionContext | undefined {
		return this.tryGetRuleContext(0, DirectionContext);
	}
	public typing(): TypingContext | undefined {
		return this.tryGetRuleContext(0, TypingContext);
	}
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public body(): BodyContext | undefined {
		return this.tryGetRuleContext(0, BodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_parameter; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DirectionContext extends ParserRuleContext {
	public IN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.IN, 0); }
	public OUT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OUT, 0); }
	public INOUT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INOUT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_direction; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitDirection) {
			return visitor.visitDirection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnTypeContext extends ParserRuleContext {
	public RETURN(): TerminalNode { return this.getToken(SysMLv2.RETURN, 0); }
	public COLON(): TerminalNode { return this.getToken(SysMLv2.COLON, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public LBRACE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LBRACE, 0); }
	public RBRACE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.RBRACE, 0); }
	public multiplicity(): MultiplicityContext | undefined {
		return this.tryGetRuleContext(0, MultiplicityContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_returnType; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitReturnType) {
			return visitor.visitReturnType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VisibilityContext extends ParserRuleContext {
	public PUBLIC(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PUBLIC, 0); }
	public PRIVATE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PRIVATE, 0); }
	public PROTECTED(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PROTECTED, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_visibility; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitVisibility) {
			return visitor.visitVisibility(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	public ABSTRACT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ABSTRACT, 0); }
	public DERIVED(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DERIVED, 0); }
	public READONLY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.READONLY, 0); }
	public VARIATION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VARIATION, 0); }
	public ORDERED(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ORDERED, 0); }
	public NONUNIQUE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.NONUNIQUE, 0); }
	public INDIVIDUAL(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INDIVIDUAL, 0); }
	public SNAPSHOT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SNAPSHOT, 0); }
	public TIMESLICE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TIMESLICE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_modifier; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitModifier) {
			return visitor.visitModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypingContext extends ParserRuleContext {
	public COLON(): TerminalNode { return this.getToken(SysMLv2.COLON, 0); }
	public qualifiedName(): QualifiedNameContext {
		return this.getRuleContext(0, QualifiedNameContext);
	}
	public TILDE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TILDE, 0); }
	public typeParameters(): TypeParametersContext | undefined {
		return this.tryGetRuleContext(0, TypeParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_typing; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTyping) {
			return visitor.visitTyping(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParametersContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(SysMLv2.LT, 0); }
	public typeParameterList(): TypeParameterListContext {
		return this.getRuleContext(0, TypeParameterListContext);
	}
	public GT(): TerminalNode { return this.getToken(SysMLv2.GT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_typeParameters; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTypeParameters) {
			return visitor.visitTypeParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeParameterListContext extends ParserRuleContext {
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_typeParameterList; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTypeParameterList) {
			return visitor.visitTypeParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SpecializationContext extends ParserRuleContext {
	public COLONGT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLONGT, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	public SPECIALIZES(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SPECIALIZES, 0); }
	public SUBSETS(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SUBSETS, 0); }
	public REDEFINES(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REDEFINES, 0); }
	public REFERENCES(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REFERENCES, 0); }
	public BINDS(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.BINDS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_specialization; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitSpecialization) {
			return visitor.visitSpecialization(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicityContext extends ParserRuleContext {
	public LBRACKET(): TerminalNode { return this.getToken(SysMLv2.LBRACKET, 0); }
	public multiplicityRange(): MultiplicityRangeContext {
		return this.getRuleContext(0, MultiplicityRangeContext);
	}
	public RBRACKET(): TerminalNode { return this.getToken(SysMLv2.RBRACKET, 0); }
	public multiplicityModifier(): MultiplicityModifierContext[];
	public multiplicityModifier(i: number): MultiplicityModifierContext;
	public multiplicityModifier(i?: number): MultiplicityModifierContext | MultiplicityModifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicityModifierContext);
		} else {
			return this.getRuleContext(i, MultiplicityModifierContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_multiplicity; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMultiplicity) {
			return visitor.visitMultiplicity(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicityModifierContext extends ParserRuleContext {
	public ORDERED(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ORDERED, 0); }
	public NONUNIQUE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.NONUNIQUE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_multiplicityModifier; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMultiplicityModifier) {
			return visitor.visitMultiplicityModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicityRangeContext extends ParserRuleContext {
	public multiplicityBound(): MultiplicityBoundContext[];
	public multiplicityBound(i: number): MultiplicityBoundContext;
	public multiplicityBound(i?: number): MultiplicityBoundContext | MultiplicityBoundContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicityBoundContext);
		} else {
			return this.getRuleContext(i, MultiplicityBoundContext);
		}
	}
	public DOTDOT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DOTDOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_multiplicityRange; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMultiplicityRange) {
			return visitor.visitMultiplicityRange(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicityBoundContext extends ParserRuleContext {
	public INTEGER(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INTEGER, 0); }
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.MULTIPLY, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_multiplicityBound; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMultiplicityBound) {
			return visitor.visitMultiplicityBound(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(SysMLv2.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(SysMLv2.RBRACE, 0); }
	public bodyElement(): BodyElementContext[];
	public bodyElement(i: number): BodyElementContext;
	public bodyElement(i?: number): BodyElementContext | BodyElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BodyElementContext);
		} else {
			return this.getRuleContext(i, BodyElementContext);
		}
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_body; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitBody) {
			return visitor.visitBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BodyElementContext extends ParserRuleContext {
	public element(): ElementContext | undefined {
		return this.tryGetRuleContext(0, ElementContext);
	}
	public parameter(): ParameterContext | undefined {
		return this.tryGetRuleContext(0, ParameterContext);
	}
	public flowStatement(): FlowStatementContext | undefined {
		return this.tryGetRuleContext(0, FlowStatementContext);
	}
	public enumValueBinding(): EnumValueBindingContext | undefined {
		return this.tryGetRuleContext(0, EnumValueBindingContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_bodyElement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitBodyElement) {
			return visitor.visitBodyElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumValueBindingContext extends ParserRuleContext {
	public ENUM(): TerminalNode { return this.getToken(SysMLv2.ENUM, 0); }
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ASSIGN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_enumValueBinding; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEnumValueBinding) {
			return visitor.visitEnumValueBinding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FlowStatementContext extends ParserRuleContext {
	public FLOW(): TerminalNode { return this.getToken(SysMLv2.FLOW, 0); }
	public qualifiedName(): QualifiedNameContext[];
	public qualifiedName(i: number): QualifiedNameContext;
	public qualifiedName(i?: number): QualifiedNameContext | QualifiedNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(QualifiedNameContext);
		} else {
			return this.getRuleContext(i, QualifiedNameContext);
		}
	}
	public FROM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FROM, 0); }
	public TO(): TerminalNode { return this.getToken(SysMLv2.TO, 0); }
	public OF(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OF, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_flowStatement; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFlowStatement) {
			return visitor.visitFlowStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public conditionalExpression(): ConditionalExpressionContext {
		return this.getRuleContext(0, ConditionalExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_expression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalExpressionContext extends ParserRuleContext {
	public nullCoalescingExpression(): NullCoalescingExpressionContext {
		return this.getRuleContext(0, NullCoalescingExpressionContext);
	}
	public QUESTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.QUESTION, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COLON, 0); }
	public conditionalExpression(): ConditionalExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConditionalExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_conditionalExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitConditionalExpression) {
			return visitor.visitConditionalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NullCoalescingExpressionContext extends ParserRuleContext {
	public logicalOrExpression(): LogicalOrExpressionContext[];
	public logicalOrExpression(i: number): LogicalOrExpressionContext;
	public logicalOrExpression(i?: number): LogicalOrExpressionContext | LogicalOrExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalOrExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalOrExpressionContext);
		}
	}
	public QUESTIONQUESTION(): TerminalNode[];
	public QUESTIONQUESTION(i: number): TerminalNode;
	public QUESTIONQUESTION(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.QUESTIONQUESTION);
		} else {
			return this.getToken(SysMLv2.QUESTIONQUESTION, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_nullCoalescingExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitNullCoalescingExpression) {
			return visitor.visitNullCoalescingExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalOrExpressionContext extends ParserRuleContext {
	public logicalXorExpression(): LogicalXorExpressionContext[];
	public logicalXorExpression(i: number): LogicalXorExpressionContext;
	public logicalXorExpression(i?: number): LogicalXorExpressionContext | LogicalXorExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalXorExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalXorExpressionContext);
		}
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.OR);
		} else {
			return this.getToken(SysMLv2.OR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_logicalOrExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitLogicalOrExpression) {
			return visitor.visitLogicalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalXorExpressionContext extends ParserRuleContext {
	public logicalAndExpression(): LogicalAndExpressionContext[];
	public logicalAndExpression(i: number): LogicalAndExpressionContext;
	public logicalAndExpression(i?: number): LogicalAndExpressionContext | LogicalAndExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LogicalAndExpressionContext);
		} else {
			return this.getRuleContext(i, LogicalAndExpressionContext);
		}
	}
	public XOR(): TerminalNode[];
	public XOR(i: number): TerminalNode;
	public XOR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.XOR);
		} else {
			return this.getToken(SysMLv2.XOR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_logicalXorExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitLogicalXorExpression) {
			return visitor.visitLogicalXorExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalAndExpressionContext extends ParserRuleContext {
	public equalityExpression(): EqualityExpressionContext[];
	public equalityExpression(i: number): EqualityExpressionContext;
	public equalityExpression(i?: number): EqualityExpressionContext | EqualityExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EqualityExpressionContext);
		} else {
			return this.getRuleContext(i, EqualityExpressionContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.AND);
		} else {
			return this.getToken(SysMLv2.AND, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_logicalAndExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitLogicalAndExpression) {
			return visitor.visitLogicalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EqualityExpressionContext extends ParserRuleContext {
	public relationalExpression(): RelationalExpressionContext[];
	public relationalExpression(i: number): RelationalExpressionContext;
	public relationalExpression(i?: number): RelationalExpressionContext | RelationalExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RelationalExpressionContext);
		} else {
			return this.getRuleContext(i, RelationalExpressionContext);
		}
	}
	public EQ(): TerminalNode[];
	public EQ(i: number): TerminalNode;
	public EQ(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.EQ);
		} else {
			return this.getToken(SysMLv2.EQ, i);
		}
	}
	public NE(): TerminalNode[];
	public NE(i: number): TerminalNode;
	public NE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.NE);
		} else {
			return this.getToken(SysMLv2.NE, i);
		}
	}
	public EEQ(): TerminalNode[];
	public EEQ(i: number): TerminalNode;
	public EEQ(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.EEQ);
		} else {
			return this.getToken(SysMLv2.EEQ, i);
		}
	}
	public NEE(): TerminalNode[];
	public NEE(i: number): TerminalNode;
	public NEE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.NEE);
		} else {
			return this.getToken(SysMLv2.NEE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_equalityExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelationalExpressionContext extends ParserRuleContext {
	public additiveExpression(): AdditiveExpressionContext[];
	public additiveExpression(i: number): AdditiveExpressionContext;
	public additiveExpression(i?: number): AdditiveExpressionContext | AdditiveExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AdditiveExpressionContext);
		} else {
			return this.getRuleContext(i, AdditiveExpressionContext);
		}
	}
	public LT(): TerminalNode[];
	public LT(i: number): TerminalNode;
	public LT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.LT);
		} else {
			return this.getToken(SysMLv2.LT, i);
		}
	}
	public GT(): TerminalNode[];
	public GT(i: number): TerminalNode;
	public GT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.GT);
		} else {
			return this.getToken(SysMLv2.GT, i);
		}
	}
	public LE(): TerminalNode[];
	public LE(i: number): TerminalNode;
	public LE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.LE);
		} else {
			return this.getToken(SysMLv2.LE, i);
		}
	}
	public GE(): TerminalNode[];
	public GE(i: number): TerminalNode;
	public GE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.GE);
		} else {
			return this.getToken(SysMLv2.GE, i);
		}
	}
	public IN(): TerminalNode[];
	public IN(i: number): TerminalNode;
	public IN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.IN);
		} else {
			return this.getToken(SysMLv2.IN, i);
		}
	}
	public HASTYPE(): TerminalNode[];
	public HASTYPE(i: number): TerminalNode;
	public HASTYPE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.HASTYPE);
		} else {
			return this.getToken(SysMLv2.HASTYPE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_relationalExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	public multiplicativeExpression(): MultiplicativeExpressionContext[];
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext;
	public multiplicativeExpression(i?: number): MultiplicativeExpressionContext | MultiplicativeExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicativeExpressionContext);
		} else {
			return this.getRuleContext(i, MultiplicativeExpressionContext);
		}
	}
	public PLUS(): TerminalNode[];
	public PLUS(i: number): TerminalNode;
	public PLUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.PLUS);
		} else {
			return this.getToken(SysMLv2.PLUS, i);
		}
	}
	public MINUS(): TerminalNode[];
	public MINUS(i: number): TerminalNode;
	public MINUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.MINUS);
		} else {
			return this.getToken(SysMLv2.MINUS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_additiveExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	public exponentialExpression(): ExponentialExpressionContext[];
	public exponentialExpression(i: number): ExponentialExpressionContext;
	public exponentialExpression(i?: number): ExponentialExpressionContext | ExponentialExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExponentialExpressionContext);
		} else {
			return this.getRuleContext(i, ExponentialExpressionContext);
		}
	}
	public MULTIPLY(): TerminalNode[];
	public MULTIPLY(i: number): TerminalNode;
	public MULTIPLY(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.MULTIPLY);
		} else {
			return this.getToken(SysMLv2.MULTIPLY, i);
		}
	}
	public DIVIDE(): TerminalNode[];
	public DIVIDE(i: number): TerminalNode;
	public DIVIDE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.DIVIDE);
		} else {
			return this.getToken(SysMLv2.DIVIDE, i);
		}
	}
	public MODULO(): TerminalNode[];
	public MODULO(i: number): TerminalNode;
	public MODULO(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.MODULO);
		} else {
			return this.getToken(SysMLv2.MODULO, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_multiplicativeExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExponentialExpressionContext extends ParserRuleContext {
	public unaryExpression(): UnaryExpressionContext[];
	public unaryExpression(i: number): UnaryExpressionContext;
	public unaryExpression(i?: number): UnaryExpressionContext | UnaryExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnaryExpressionContext);
		} else {
			return this.getRuleContext(i, UnaryExpressionContext);
		}
	}
	public POWER(): TerminalNode[];
	public POWER(i: number): TerminalNode;
	public POWER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.POWER);
		} else {
			return this.getToken(SysMLv2.POWER, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_exponentialExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExponentialExpression) {
			return visitor.visitExponentialExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryExpressionContext extends ParserRuleContext {
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PLUS, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.MINUS, 0); }
	public EXCLAMATION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.EXCLAMATION, 0); }
	public NOT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.NOT, 0); }
	public postfixExpression(): PostfixExpressionContext | undefined {
		return this.tryGetRuleContext(0, PostfixExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_unaryExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitUnaryExpression) {
			return visitor.visitUnaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PostfixExpressionContext extends ParserRuleContext {
	public primaryExpression(): PrimaryExpressionContext {
		return this.getRuleContext(0, PrimaryExpressionContext);
	}
	public postfixOperator(): PostfixOperatorContext[];
	public postfixOperator(i: number): PostfixOperatorContext;
	public postfixOperator(i?: number): PostfixOperatorContext | PostfixOperatorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PostfixOperatorContext);
		} else {
			return this.getRuleContext(i, PostfixOperatorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_postfixExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPostfixExpression) {
			return visitor.visitPostfixExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PostfixOperatorContext extends ParserRuleContext {
	public DOT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DOT, 0); }
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public LBRACKET(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LBRACKET, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public RBRACKET(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.RBRACKET, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.RPAREN, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_postfixOperator; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPostfixOperator) {
			return visitor.visitPostfixOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryExpressionContext extends ParserRuleContext {
	public NEW(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.NEW, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.RPAREN, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	public unitSuffix(): UnitSuffixContext | undefined {
		return this.tryGetRuleContext(0, UnitSuffixContext);
	}
	public literal(): LiteralContext | undefined {
		return this.tryGetRuleContext(0, LiteralContext);
	}
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_primaryExpression; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitPrimaryExpression) {
			return visitor.visitPrimaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_expressionList; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitExpressionList) {
			return visitor.visitExpressionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnitSuffixContext extends ParserRuleContext {
	public UNIT_LITERAL(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.UNIT_LITERAL, 0); }
	public LBRACKET(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.LBRACKET, 0); }
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	public RBRACKET(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.RBRACKET, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_unitSuffix; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitUnitSuffix) {
			return visitor.visitUnitSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentListContext extends ParserRuleContext {
	public argument(): ArgumentContext[];
	public argument(i: number): ArgumentContext;
	public argument(i?: number): ArgumentContext | ArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArgumentContext);
		} else {
			return this.getRuleContext(i, ArgumentContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COMMA);
		} else {
			return this.getToken(SysMLv2.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_argumentList; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitArgumentList) {
			return visitor.visitArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentContext extends ParserRuleContext {
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ASSIGN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_argument; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitArgument) {
			return visitor.visitArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public INTEGER(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INTEGER, 0); }
	public REAL(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REAL, 0); }
	public stringValue(): StringValueContext | undefined {
		return this.tryGetRuleContext(0, StringValueContext);
	}
	public booleanValue(): BooleanValueContext | undefined {
		return this.tryGetRuleContext(0, BooleanValueContext);
	}
	public nullValue(): NullValueContext | undefined {
		return this.tryGetRuleContext(0, NullValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_literal; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringValueContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(SysMLv2.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_stringValue; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitStringValue) {
			return visitor.visitStringValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanValueContext extends ParserRuleContext {
	public TRUE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TRUE, 0); }
	public FALSE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FALSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_booleanValue; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitBooleanValue) {
			return visitor.visitBooleanValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NullValueContext extends ParserRuleContext {
	public NULL(): TerminalNode { return this.getToken(SysMLv2.NULL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_nullValue; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitNullValue) {
			return visitor.visitNullValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedNameContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
		}
	}
	public COLONCOLON(): TerminalNode[];
	public COLONCOLON(i: number): TerminalNode;
	public COLONCOLON(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.COLONCOLON);
		} else {
			return this.getToken(SysMLv2.COLONCOLON, i);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(SysMLv2.DOT);
		} else {
			return this.getToken(SysMLv2.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_qualifiedName; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitQualifiedName) {
			return visitor.visitQualifiedName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.IDENTIFIER, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.STRING, 0); }
	public keyword(): KeywordContext | undefined {
		return this.tryGetRuleContext(0, KeywordContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_identifier; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitIdentifier) {
			return visitor.visitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShortNameContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(SysMLv2.LT, 0); }
	public GT(): TerminalNode { return this.getToken(SysMLv2.GT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.STRING, 0); }
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.IDENTIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_shortName; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitShortName) {
			return visitor.visitShortName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KeywordContext extends ParserRuleContext {
	public PAYLOAD(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PAYLOAD, 0); }
	public FLOW(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FLOW, 0); }
	public DIRECTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DIRECTION, 0); }
	public PROPERTY(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PROPERTY, 0); }
	public STATE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.STATE, 0); }
	public ACTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ACTION, 0); }
	public PORT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PORT, 0); }
	public PART(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PART, 0); }
	public ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ATTRIBUTE, 0); }
	public CONNECTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.CONNECTION, 0); }
	public CONSTRAINT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.CONSTRAINT, 0); }
	public REQUIREMENT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.REQUIREMENT, 0); }
	public ITEM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ITEM, 0); }
	public EVENT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.EVENT, 0); }
	public MESSAGE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.MESSAGE, 0); }
	public INTERFACE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INTERFACE, 0); }
	public VIEW(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VIEW, 0); }
	public VIEWPOINT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VIEWPOINT, 0); }
	public COMMENT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.COMMENT, 0); }
	public DOC(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.DOC, 0); }
	public METADATA(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.METADATA, 0); }
	public ALLOCATION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ALLOCATION, 0); }
	public ANALYSIS(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.ANALYSIS, 0); }
	public VERIFICATION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.VERIFICATION, 0); }
	public CONCERN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.CONCERN, 0); }
	public OCCURRENCE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OCCURRENCE, 0); }
	public INTERACTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.INTERACTION, 0); }
	public PARTICIPANT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.PARTICIPANT, 0); }
	public SUBJECT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SUBJECT, 0); }
	public OBJECTIVE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.OBJECTIVE, 0); }
	public FEATURE(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FEATURE, 0); }
	public FUNCTION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FUNCTION, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_keyword; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitKeyword) {
			return visitor.visitKeyword(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StateTransitionContext extends ParserRuleContext {
	public TRANSITION(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TRANSITION, 0); }
	public fromState(): FromStateContext | undefined {
		return this.tryGetRuleContext(0, FromStateContext);
	}
	public toState(): ToStateContext | undefined {
		return this.tryGetRuleContext(0, ToStateContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public transitionGuard(): TransitionGuardContext | undefined {
		return this.tryGetRuleContext(0, TransitionGuardContext);
	}
	public transitionEffect(): TransitionEffectContext | undefined {
		return this.tryGetRuleContext(0, TransitionEffectContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.SEMICOLON, 0); }
	public acceptEvent(): AcceptEventContext | undefined {
		return this.tryGetRuleContext(0, AcceptEventContext);
	}
	public doAction(): DoActionContext | undefined {
		return this.tryGetRuleContext(0, DoActionContext);
	}
	public transitionTrigger(): TransitionTriggerContext | undefined {
		return this.tryGetRuleContext(0, TransitionTriggerContext);
	}
	public THEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.THEN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_stateTransition; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitStateTransition) {
			return visitor.visitStateTransition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FromStateContext extends ParserRuleContext {
	public FIRST(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FIRST, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public FROM(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.FROM, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_fromState; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitFromState) {
			return visitor.visitFromState(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ToStateContext extends ParserRuleContext {
	public THEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.THEN, 0); }
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public TO(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.TO, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_toState; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitToState) {
			return visitor.visitToState(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TransitionTriggerContext extends ParserRuleContext {
	public acceptEvent(): AcceptEventContext | undefined {
		return this.tryGetRuleContext(0, AcceptEventContext);
	}
	public AT(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.AT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public WHEN(): TerminalNode | undefined { return this.tryGetToken(SysMLv2.WHEN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_transitionTrigger; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTransitionTrigger) {
			return visitor.visitTransitionTrigger(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TransitionGuardContext extends ParserRuleContext {
	public IF(): TerminalNode { return this.getToken(SysMLv2.IF, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_transitionGuard; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTransitionGuard) {
			return visitor.visitTransitionGuard(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TransitionEffectContext extends ParserRuleContext {
	public DO(): TerminalNode { return this.getToken(SysMLv2.DO, 0); }
	public sendAction(): SendActionContext | undefined {
		return this.tryGetRuleContext(0, SendActionContext);
	}
	public qualifiedName(): QualifiedNameContext | undefined {
		return this.tryGetRuleContext(0, QualifiedNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return SysMLv2.RULE_transitionEffect; }
	// @Override
	public accept<Result>(visitor: SysMLv2Visitor<Result>): Result {
		if (visitor.visitTransitionEffect) {
			return visitor.visitTransitionEffect(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


