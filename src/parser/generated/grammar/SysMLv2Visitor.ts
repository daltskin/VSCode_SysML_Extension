// Generated from SysMLv2.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ModelContext } from "./SysMLv2";
import { ElementContext } from "./SysMLv2";
import { AliasStatementContext } from "./SysMLv2";
import { SatisfyStatementContext } from "./SysMLv2";
import { DependencyStatementContext } from "./SysMLv2";
import { FilterStatementContext } from "./SysMLv2";
import { FilterExpressionContext } from "./SysMLv2";
import { FilterTermContext } from "./SysMLv2";
import { FirstStatementContext } from "./SysMLv2";
import { ThenStatementContext } from "./SysMLv2";
import { ReturnStatementContext } from "./SysMLv2";
import { RequireStatementContext } from "./SysMLv2";
import { ForkUsageContext } from "./SysMLv2";
import { JoinUsageContext } from "./SysMLv2";
import { EndFeatureContext } from "./SysMLv2";
import { MetadataPrefixContext } from "./SysMLv2";
import { BindUsageContext } from "./SysMLv2";
import { ConnectStatementContext } from "./SysMLv2";
import { RedefinitionUsageContext } from "./SysMLv2";
import { MetaTypingContext } from "./SysMLv2";
import { FlowPropertyContext } from "./SysMLv2";
import { PackageElementContext } from "./SysMLv2";
import { ImportStatementContext } from "./SysMLv2";
import { PartDefinitionContext } from "./SysMLv2";
import { PartUsageContext } from "./SysMLv2";
import { ActionDefinitionContext } from "./SysMLv2";
import { ActionUsageContext } from "./SysMLv2";
import { PerformActionContext } from "./SysMLv2";
import { ExhibitStateContext } from "./SysMLv2";
import { EntryActionContext } from "./SysMLv2";
import { ExitActionContext } from "./SysMLv2";
import { DoActionContext } from "./SysMLv2";
import { AcceptEventContext } from "./SysMLv2";
import { SendActionContext } from "./SysMLv2";
import { StateDefinitionContext } from "./SysMLv2";
import { StateUsageContext } from "./SysMLv2";
import { EventDefinitionContext } from "./SysMLv2";
import { EventUsageContext } from "./SysMLv2";
import { RequirementDefinitionContext } from "./SysMLv2";
import { RequirementUsageContext } from "./SysMLv2";
import { UseCaseDefinitionContext } from "./SysMLv2";
import { UseCaseUsageContext } from "./SysMLv2";
import { ConstraintDefinitionContext } from "./SysMLv2";
import { ConstraintUsageContext } from "./SysMLv2";
import { AttributeDefinitionContext } from "./SysMLv2";
import { AttributeUsageContext } from "./SysMLv2";
import { ValueBindingContext } from "./SysMLv2";
import { PortDefinitionContext } from "./SysMLv2";
import { PortUsageContext } from "./SysMLv2";
import { ConnectionDefinitionContext } from "./SysMLv2";
import { ConnectionUsageContext } from "./SysMLv2";
import { InterfaceDefinitionContext } from "./SysMLv2";
import { InterfaceUsageContext } from "./SysMLv2";
import { AllocationDefinitionContext } from "./SysMLv2";
import { AllocationUsageContext } from "./SysMLv2";
import { AllocationBodyContext } from "./SysMLv2";
import { ItemDefinitionContext } from "./SysMLv2";
import { ItemUsageContext } from "./SysMLv2";
import { DefinitionContext } from "./SysMLv2";
import { IndividualDefinitionContext } from "./SysMLv2";
import { IndividualUsageContext } from "./SysMLv2";
import { TimesliceUsageContext } from "./SysMLv2";
import { SnapshotUsageContext } from "./SysMLv2";
import { ActorDefinitionContext } from "./SysMLv2";
import { ActorUsageContext } from "./SysMLv2";
import { ConcernDefinitionContext } from "./SysMLv2";
import { ConcernUsageContext } from "./SysMLv2";
import { AnalysisDefinitionContext } from "./SysMLv2";
import { AnalysisUsageContext } from "./SysMLv2";
import { SubjectUsageContext } from "./SysMLv2";
import { ObjectiveUsageContext } from "./SysMLv2";
import { StakeholderUsageContext } from "./SysMLv2";
import { AllocateStatementContext } from "./SysMLv2";
import { AllocateBodyContext } from "./SysMLv2";
import { VerificationDefinitionContext } from "./SysMLv2";
import { VerificationUsageContext } from "./SysMLv2";
import { VerificationBodyContext } from "./SysMLv2";
import { VerificationBodyElementContext } from "./SysMLv2";
import { VerifyStatementContext } from "./SysMLv2";
import { ViewDefinitionContext } from "./SysMLv2";
import { ViewUsageContext } from "./SysMLv2";
import { ViewBodyContext } from "./SysMLv2";
import { ViewBodyElementContext } from "./SysMLv2";
import { ExposeStatementContext } from "./SysMLv2";
import { ExposeTargetContext } from "./SysMLv2";
import { ViewpointDefinitionContext } from "./SysMLv2";
import { ViewpointUsageContext } from "./SysMLv2";
import { EnumerationDefinitionContext } from "./SysMLv2";
import { EnumerationUsageContext } from "./SysMLv2";
import { DatatypeDefinitionContext } from "./SysMLv2";
import { DatatypeUsageContext } from "./SysMLv2";
import { AssociationDefinitionContext } from "./SysMLv2";
import { AssociationUsageContext } from "./SysMLv2";
import { MetadataDefinitionContext } from "./SysMLv2";
import { MetadataUsageContext } from "./SysMLv2";
import { MetadataAnnotationContext } from "./SysMLv2";
import { CommentContext } from "./SysMLv2";
import { DocumentationContext } from "./SysMLv2";
import { CalculationContext } from "./SysMLv2";
import { CalcUsageContext } from "./SysMLv2";
import { InteractionDefinitionContext } from "./SysMLv2";
import { InteractionUsageContext } from "./SysMLv2";
import { ParticipantUsageContext } from "./SysMLv2";
import { MessageUsageContext } from "./SysMLv2";
import { MessagePatternContext } from "./SysMLv2";
import { PayloadUsageContext } from "./SysMLv2";
import { OccurrenceUsageContext } from "./SysMLv2";
import { AlternativeUsageContext } from "./SysMLv2";
import { ElseUsageContext } from "./SysMLv2";
import { FeatureDefinitionContext } from "./SysMLv2";
import { FeatureUsageContext } from "./SysMLv2";
import { FunctionDefinitionContext } from "./SysMLv2";
import { FunctionSignatureContext } from "./SysMLv2";
import { ParameterListContext } from "./SysMLv2";
import { ParameterContext } from "./SysMLv2";
import { DirectionContext } from "./SysMLv2";
import { ReturnTypeContext } from "./SysMLv2";
import { VisibilityContext } from "./SysMLv2";
import { ModifierContext } from "./SysMLv2";
import { TypingContext } from "./SysMLv2";
import { TypeParametersContext } from "./SysMLv2";
import { TypeParameterListContext } from "./SysMLv2";
import { SpecializationContext } from "./SysMLv2";
import { MultiplicityContext } from "./SysMLv2";
import { MultiplicityModifierContext } from "./SysMLv2";
import { MultiplicityRangeContext } from "./SysMLv2";
import { MultiplicityBoundContext } from "./SysMLv2";
import { BodyContext } from "./SysMLv2";
import { BodyElementContext } from "./SysMLv2";
import { EnumValueBindingContext } from "./SysMLv2";
import { FlowStatementContext } from "./SysMLv2";
import { ExpressionContext } from "./SysMLv2";
import { ConditionalExpressionContext } from "./SysMLv2";
import { NullCoalescingExpressionContext } from "./SysMLv2";
import { LogicalOrExpressionContext } from "./SysMLv2";
import { LogicalXorExpressionContext } from "./SysMLv2";
import { LogicalAndExpressionContext } from "./SysMLv2";
import { EqualityExpressionContext } from "./SysMLv2";
import { RelationalExpressionContext } from "./SysMLv2";
import { AdditiveExpressionContext } from "./SysMLv2";
import { MultiplicativeExpressionContext } from "./SysMLv2";
import { ExponentialExpressionContext } from "./SysMLv2";
import { UnaryExpressionContext } from "./SysMLv2";
import { PostfixExpressionContext } from "./SysMLv2";
import { PostfixOperatorContext } from "./SysMLv2";
import { PrimaryExpressionContext } from "./SysMLv2";
import { ExpressionListContext } from "./SysMLv2";
import { UnitSuffixContext } from "./SysMLv2";
import { ArgumentListContext } from "./SysMLv2";
import { ArgumentContext } from "./SysMLv2";
import { LiteralContext } from "./SysMLv2";
import { StringValueContext } from "./SysMLv2";
import { BooleanValueContext } from "./SysMLv2";
import { NullValueContext } from "./SysMLv2";
import { QualifiedNameContext } from "./SysMLv2";
import { IdentifierContext } from "./SysMLv2";
import { ShortNameContext } from "./SysMLv2";
import { KeywordContext } from "./SysMLv2";
import { StateTransitionContext } from "./SysMLv2";
import { FromStateContext } from "./SysMLv2";
import { ToStateContext } from "./SysMLv2";
import { TransitionTriggerContext } from "./SysMLv2";
import { TransitionGuardContext } from "./SysMLv2";
import { TransitionEffectContext } from "./SysMLv2";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SysMLv2`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface SysMLv2Visitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `SysMLv2.model`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModel?: (ctx: ModelContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.element`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElement?: (ctx: ElementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.aliasStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAliasStatement?: (ctx: AliasStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.satisfyStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSatisfyStatement?: (ctx: SatisfyStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.dependencyStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDependencyStatement?: (ctx: DependencyStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.filterStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilterStatement?: (ctx: FilterStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.filterExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilterExpression?: (ctx: FilterExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.filterTerm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilterTerm?: (ctx: FilterTermContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.firstStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFirstStatement?: (ctx: FirstStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.thenStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitThenStatement?: (ctx: ThenStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.returnStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnStatement?: (ctx: ReturnStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.requireStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequireStatement?: (ctx: RequireStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.forkUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForkUsage?: (ctx: ForkUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.joinUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJoinUsage?: (ctx: JoinUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.endFeature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEndFeature?: (ctx: EndFeatureContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.metadataPrefix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMetadataPrefix?: (ctx: MetadataPrefixContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.bindUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBindUsage?: (ctx: BindUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.connectStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConnectStatement?: (ctx: ConnectStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.redefinitionUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRedefinitionUsage?: (ctx: RedefinitionUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.metaTyping`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMetaTyping?: (ctx: MetaTypingContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.flowProperty`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFlowProperty?: (ctx: FlowPropertyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.packageElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageElement?: (ctx: PackageElementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.importStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportStatement?: (ctx: ImportStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.partDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPartDefinition?: (ctx: PartDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.partUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPartUsage?: (ctx: PartUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.actionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitActionDefinition?: (ctx: ActionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.actionUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitActionUsage?: (ctx: ActionUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.performAction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPerformAction?: (ctx: PerformActionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.exhibitState`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExhibitState?: (ctx: ExhibitStateContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.entryAction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntryAction?: (ctx: EntryActionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.exitAction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExitAction?: (ctx: ExitActionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.doAction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoAction?: (ctx: DoActionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.acceptEvent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAcceptEvent?: (ctx: AcceptEventContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.sendAction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSendAction?: (ctx: SendActionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.stateDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStateDefinition?: (ctx: StateDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.stateUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStateUsage?: (ctx: StateUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.eventDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEventDefinition?: (ctx: EventDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.eventUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEventUsage?: (ctx: EventUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.requirementDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequirementDefinition?: (ctx: RequirementDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.requirementUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequirementUsage?: (ctx: RequirementUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.useCaseDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseCaseDefinition?: (ctx: UseCaseDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.useCaseUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseCaseUsage?: (ctx: UseCaseUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.constraintDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstraintDefinition?: (ctx: ConstraintDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.constraintUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstraintUsage?: (ctx: ConstraintUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.attributeDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttributeDefinition?: (ctx: AttributeDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.attributeUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttributeUsage?: (ctx: AttributeUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.valueBinding`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValueBinding?: (ctx: ValueBindingContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.portDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPortDefinition?: (ctx: PortDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.portUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPortUsage?: (ctx: PortUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.connectionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConnectionDefinition?: (ctx: ConnectionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.connectionUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConnectionUsage?: (ctx: ConnectionUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.interfaceDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceDefinition?: (ctx: InterfaceDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.interfaceUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceUsage?: (ctx: InterfaceUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.allocationDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllocationDefinition?: (ctx: AllocationDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.allocationUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllocationUsage?: (ctx: AllocationUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.allocationBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllocationBody?: (ctx: AllocationBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.itemDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitItemDefinition?: (ctx: ItemDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.itemUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitItemUsage?: (ctx: ItemUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.definition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefinition?: (ctx: DefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.individualDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndividualDefinition?: (ctx: IndividualDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.individualUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndividualUsage?: (ctx: IndividualUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.timesliceUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimesliceUsage?: (ctx: TimesliceUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.snapshotUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSnapshotUsage?: (ctx: SnapshotUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.actorDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitActorDefinition?: (ctx: ActorDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.actorUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitActorUsage?: (ctx: ActorUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.concernDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConcernDefinition?: (ctx: ConcernDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.concernUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConcernUsage?: (ctx: ConcernUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.analysisDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnalysisDefinition?: (ctx: AnalysisDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.analysisUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnalysisUsage?: (ctx: AnalysisUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.subjectUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubjectUsage?: (ctx: SubjectUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.objectiveUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectiveUsage?: (ctx: ObjectiveUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.stakeholderUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStakeholderUsage?: (ctx: StakeholderUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.allocateStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllocateStatement?: (ctx: AllocateStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.allocateBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllocateBody?: (ctx: AllocateBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.verificationDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerificationDefinition?: (ctx: VerificationDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.verificationUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerificationUsage?: (ctx: VerificationUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.verificationBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerificationBody?: (ctx: VerificationBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.verificationBodyElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerificationBodyElement?: (ctx: VerificationBodyElementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.verifyStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerifyStatement?: (ctx: VerifyStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewDefinition?: (ctx: ViewDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewUsage?: (ctx: ViewUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewBody?: (ctx: ViewBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewBodyElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewBodyElement?: (ctx: ViewBodyElementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.exposeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExposeStatement?: (ctx: ExposeStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.exposeTarget`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExposeTarget?: (ctx: ExposeTargetContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewpointDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewpointDefinition?: (ctx: ViewpointDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.viewpointUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitViewpointUsage?: (ctx: ViewpointUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.enumerationDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumerationDefinition?: (ctx: EnumerationDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.enumerationUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumerationUsage?: (ctx: EnumerationUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.datatypeDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatatypeDefinition?: (ctx: DatatypeDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.datatypeUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatatypeUsage?: (ctx: DatatypeUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.associationDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssociationDefinition?: (ctx: AssociationDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.associationUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssociationUsage?: (ctx: AssociationUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.metadataDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMetadataDefinition?: (ctx: MetadataDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.metadataUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMetadataUsage?: (ctx: MetadataUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.metadataAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMetadataAnnotation?: (ctx: MetadataAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.comment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComment?: (ctx: CommentContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.documentation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDocumentation?: (ctx: DocumentationContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.calculation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCalculation?: (ctx: CalculationContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.calcUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCalcUsage?: (ctx: CalcUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.interactionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInteractionDefinition?: (ctx: InteractionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.interactionUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInteractionUsage?: (ctx: InteractionUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.participantUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParticipantUsage?: (ctx: ParticipantUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.messageUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMessageUsage?: (ctx: MessageUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.messagePattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMessagePattern?: (ctx: MessagePatternContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.payloadUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPayloadUsage?: (ctx: PayloadUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.occurrenceUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOccurrenceUsage?: (ctx: OccurrenceUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.alternativeUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlternativeUsage?: (ctx: AlternativeUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.elseUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElseUsage?: (ctx: ElseUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.featureDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeatureDefinition?: (ctx: FeatureDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.featureUsage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeatureUsage?: (ctx: FeatureUsageContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.functionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDefinition?: (ctx: FunctionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.functionSignature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionSignature?: (ctx: FunctionSignatureContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.direction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDirection?: (ctx: DirectionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.returnType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnType?: (ctx: ReturnTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.visibility`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVisibility?: (ctx: VisibilityContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.modifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModifier?: (ctx: ModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.typing`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTyping?: (ctx: TypingContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.typeParameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameters?: (ctx: TypeParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.typeParameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeParameterList?: (ctx: TypeParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.specialization`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpecialization?: (ctx: SpecializationContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.multiplicity`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicity?: (ctx: MultiplicityContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.multiplicityModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicityModifier?: (ctx: MultiplicityModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.multiplicityRange`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicityRange?: (ctx: MultiplicityRangeContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.multiplicityBound`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicityBound?: (ctx: MultiplicityBoundContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.body`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBody?: (ctx: BodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.bodyElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBodyElement?: (ctx: BodyElementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.enumValueBinding`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumValueBinding?: (ctx: EnumValueBindingContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.flowStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFlowStatement?: (ctx: FlowStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.conditionalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalExpression?: (ctx: ConditionalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.nullCoalescingExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNullCoalescingExpression?: (ctx: NullCoalescingExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.logicalOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.logicalXorExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalXorExpression?: (ctx: LogicalXorExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.logicalAndExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.equalityExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqualityExpression?: (ctx: EqualityExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.relationalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalExpression?: (ctx: RelationalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.additiveExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.multiplicativeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.exponentialExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExponentialExpression?: (ctx: ExponentialExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.unaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryExpression?: (ctx: UnaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.postfixExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPostfixExpression?: (ctx: PostfixExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.postfixOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPostfixOperator?: (ctx: PostfixOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryExpression?: (ctx: PrimaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.expressionList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionList?: (ctx: ExpressionListContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.unitSuffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnitSuffix?: (ctx: UnitSuffixContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.argumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentList?: (ctx: ArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.argument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument?: (ctx: ArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.stringValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringValue?: (ctx: StringValueContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.booleanValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanValue?: (ctx: BooleanValueContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.nullValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNullValue?: (ctx: NullValueContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.qualifiedName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQualifiedName?: (ctx: QualifiedNameContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.shortName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShortName?: (ctx: ShortNameContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.keyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKeyword?: (ctx: KeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.stateTransition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStateTransition?: (ctx: StateTransitionContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.fromState`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFromState?: (ctx: FromStateContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.toState`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitToState?: (ctx: ToStateContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.transitionTrigger`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransitionTrigger?: (ctx: TransitionTriggerContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.transitionGuard`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransitionGuard?: (ctx: TransitionGuardContext) => Result;

	/**
	 * Visit a parse tree produced by `SysMLv2.transitionEffect`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransitionEffect?: (ctx: TransitionEffectContext) => Result;
}

