/**
 * Action Flow View Contract Tests
 *
 * Validates the data contract between the LSP's activity-diagram output and
 * the visualization panel's Action Flow view for SysML v2 control nodes
 * (fork / join / merge / decide).
 *
 * PURPOSE: Guard against regressions of issue #62, where a `join` control
 * node was rendered as a diamond (decision/merge) instead of a synchronization
 * bar. The root cause was that the LSP did not emit control nodes as
 * first-class typed actions, so the extension fell back to name-based
 * guessing that grouped `join` with `merge`.
 *
 * The sysml-v2-lsp server now emits fork/join/merge/decide as actions with an
 * authoritative `type`/`kind`. These tests mirror the shape-classification and
 * synthesis-fallback logic in visualizationPanel.ts to lock in correct
 * behaviour.
 */
import * as assert from 'assert';

type NodeShape = 'bar' | 'diamond' | 'circle' | 'box';

/**
 * Mirrors the shape classification used by the Action Flow renderer in
 * visualizationPanel.ts:
 *   const actionKind = (action.kind || action.type || 'action').toLowerCase();
 *   isDecision = actionKind.includes('decision') || actionKind.includes('merge');
 *   isFork     = actionKind.includes('fork') || actionKind.includes('join');
 */
function shapeForAction(action: { type?: string; kind?: string; name?: string }): NodeShape {
    const actionKind = (action.kind || action.type || 'action').toLowerCase();
    const name = (action.name || '').toLowerCase();
    const isStart = actionKind.includes('initial') || actionKind.includes('start') || name === 'start';
    const isEnd = actionKind.includes('final') || actionKind.includes('end') || actionKind.includes('done') || name === 'done';
    const isDecision = actionKind.includes('decision') || actionKind.includes('merge');
    const isFork = actionKind.includes('fork') || actionKind.includes('join');

    if (isStart || isEnd) { return 'circle'; }
    if (isDecision) { return 'diamond'; }
    if (isFork) { return 'bar'; }
    return 'box';
}

/**
 * Mirrors the synthesis fallback in visualizationPanel.ts that infers a type
 * for control nodes that appear only as flow endpoints (never declared).
 */
function synthesizeNodeType(
    nodeName: string,
    incoming: number,
    outgoing: number,
    hasGuards = false,
): string {
    const nameLower = nodeName.toLowerCase();
    if (nameLower.includes('fork')) { return 'fork'; }
    if (nameLower.includes('join')) { return 'join'; }
    if (nameLower.includes('merge') || nameLower.endsWith('check')) { return 'merge'; }
    if (nameLower.includes('decision') || nameLower.includes('decide')) { return 'decision'; }
    if (incoming > 1) { return 'merge'; }
    if (outgoing > 1) { return hasGuards ? 'decision' : 'fork'; }
    return 'action';
}

suite('Action Flow View Contract — control nodes (issue #62)', () => {
    test('join node from the LSP renders as a bar, not a diamond', () => {
        // Shape of a JoinNode action as emitted by the updated LSP.
        const join = { name: 'myJoin', type: 'join', kind: 'join' };
        assert.strictEqual(
            shapeForAction(join),
            'bar',
            'A join control node must render as a synchronization bar (issue #62).',
        );
    });

    test('fork/join render as bars; merge/decide render as diamonds', () => {
        assert.strictEqual(shapeForAction({ name: 'myFork', type: 'fork', kind: 'fork' }), 'bar');
        assert.strictEqual(shapeForAction({ name: 'myJoin', type: 'join', kind: 'join' }), 'bar');
        assert.strictEqual(shapeForAction({ name: 'myMerge', type: 'merge', kind: 'merge' }), 'diamond');
        assert.strictEqual(shapeForAction({ name: 'myDecide', type: 'decision', kind: 'decision' }), 'diamond');
    });

    test('plain actions render as boxes', () => {
        assert.strictEqual(shapeForAction({ name: 'startStep', type: 'action', kind: 'action' }), 'box');
    });

    test('synthesis fallback classifies a join-named endpoint as join (bar), not merge', () => {
        // A join node that appears only as a flow endpoint (multiple incoming).
        const type = synthesizeNodeType('taskJoin', /*incoming*/ 2, /*outgoing*/ 1);
        assert.strictEqual(type, 'join', 'A join-named endpoint must not collapse to merge (issue #62).');
        assert.strictEqual(shapeForAction({ name: 'taskJoin', type, kind: type }), 'bar');
    });

    test('synthesis fallback still classifies merge/fork/decision endpoints correctly', () => {
        assert.strictEqual(synthesizeNodeType('altMerge', 2, 1), 'merge');
        assert.strictEqual(synthesizeNodeType('splitFork', 1, 2), 'fork');
        assert.strictEqual(synthesizeNodeType('branchDecide', 1, 2, /*hasGuards*/ true), 'decision');
        // Nameless multi-incoming endpoint → merge (last-resort heuristic).
        assert.strictEqual(synthesizeNodeType('n1', 3, 0), 'merge');
    });
});
