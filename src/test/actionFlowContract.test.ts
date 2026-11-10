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
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vm from 'vm';

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

suite('Action Flow View Contract — declared successions (issue #85)', () => {
    test('does not fabricate declaration-order edges when flows are absent', () => {
        const source = fs.readFileSync(
            path.join(__dirname, '..', '..', 'media', 'diagram-runtime', 'runtime.js'),
            'utf8',
        );

        assert.ok(
            source.includes('Declaration order does not imply execution'),
            'The element fallback must explicitly preserve an empty flow list.',
        );
        assert.ok(
            !source.includes('If no explicit flows, create implicit flows'),
            'The renderer must not connect consecutive action declarations.',
        );
    });
});

suite('Action Flow View Contract - decision identity (issue #134)', () => {
    interface Action {
        id?: string;
        name: string;
        type?: string;
        kind?: string;
        parent?: string;
        condition?: string;
    }
    interface Diagram {
        name: string;
        actions: Action[];
        decisions?: Action[];
        flows: { from: string; to: string; guard?: string }[];
    }
    interface Position {
        x: number;
        y: number;
    }
    let convert: (data: { activityDiagrams: Diagram[] }, view: string) => {
        diagrams: Diagram[];
    };
    let layout: (diagram: Diagram, direction: string) => Map<string, Position>;

    suiteSetup(() => {
        const source = fs.readFileSync(
            path.join(__dirname, '..', '..', 'media', 'diagram-runtime', 'runtime.js'),
            'utf8',
        );
        const parsed = ts.createSourceFile('runtime.js', source, ts.ScriptTarget.Latest,
            true, ts.ScriptKind.JS);
        const functions = new Map<string, ts.FunctionDeclaration>();
        const visit = (node: ts.Node): void => {
            if (ts.isFunctionDeclaration(node) && node.name) {
                functions.set(node.name.text, node);
            }
            ts.forEachChild(node, visit);
        };
        visit(parsed);
        const prepare = functions.get('prepareDataForView');
        assert.ok(prepare, 'The activity conversion function must exist');
        convert = vm.runInNewContext(`(${prepare.getText(parsed)})`, {});

        const render = functions.get('renderActivityView');
        assert.ok(render?.body, 'The activity renderer must exist');
        const drawFlows = render.body.statements.find(statement =>
            ts.isVariableStatement(statement) && statement.declarationList.declarations.some(
                declaration => declaration.name.getText(parsed) === 'flowGroup',
            ));
        assert.ok(drawFlows, 'The renderer must compute positions before drawing flows');
        const positioning = source.slice(render.getStart(parsed), drawFlows.getStart(parsed));
        layout = (diagram, direction) => {
            const compute = vm.runInNewContext(`(${positioning} return actionPositions; })`, {
                selectedDiagramIndex: 0, activityLayoutDirection: direction,
            }) as (width: number, height: number, data: { diagrams: Diagram[] }) =>
                Map<string, Position>;
            return compute(1000, 800, { diagrams: [diagram] });
        };
    });

    test('keeps the authoritative action when a decision has the same ID', () => {
        const result = convert({ activityDiagrams: [{
            name: 'MonitorBattery',
            actions: [{ id: 'checkLevel', name: 'checkLevel', type: 'decision',
                kind: 'decision', parent: 'MonitorBattery', condition: 'batteryLevel < 20.0' }],
            decisions: [{ id: 'checkLevel', name: 'Legacy label' }],
            flows: [],
        }] }, 'activity');
        const decisions = result.diagrams[0].actions.filter(action => action.id === 'checkLevel');
        assert.strictEqual(decisions.length, 1, 'A decision must occupy only one layout position');
        assert.strictEqual(decisions[0].type, 'decision');
        assert.strictEqual(decisions[0].condition, 'batteryLevel < 20.0');
        assert.strictEqual(decisions[0].parent, undefined);
    });

    test('deduplicates name-only decisions without dropping decision-only nodes', () => {
        const result = convert({ activityDiagrams: [{
            name: 'MonitorBattery',
            actions: [{ name: 'checkLevel', type: 'decision' }],
            decisions: [
                { name: 'checkLevel' },
                { name: 'legacyDecision', parent: 'MonitorBattery' },
                { name: 'legacyDecision', parent: 'MonitorBattery' },
                { name: 'nestedDecision', parent: 'container' },
            ],
            flows: [],
        }] }, 'activity');
        const actions = result.diagrams[0].actions;
        assert.strictEqual(actions.map(action => action.id).join(','),
            'checkLevel,legacyDecision,nestedDecision');
        assert.strictEqual(actions[1].type, 'decision');
        assert.strictEqual(actions[1].parent, undefined);
        assert.strictEqual(actions[2].parent, 'container');
    });

    test('preserves distinct IDs even when their labels match', () => {
        const result = convert({ activityDiagrams: [{
            name: 'MonitorBattery',
            actions: [{ id: 'first', name: 'checkLevel', type: 'decision' }],
            decisions: [{ id: 'second', name: 'checkLevel' }],
            flows: [],
        }] }, 'activity');
        assert.strictEqual(result.diagrams[0].actions.map(action => action.id).join(','),
            'first,second');
    });

    for (const direction of ['vertical', 'horizontal']) {
        test(`centers control nodes and spaces symmetric branches in ${direction} layout`, () => {
            const diagram = convert({ activityDiagrams: [{
                name: 'MonitorBattery',
                actions: [
                    { name: 'checkLevel', type: 'decision', parent: 'MonitorBattery' },
                    { name: 'TriggerLowPowerMode', type: 'action', parent: 'MonitorBattery' },
                    { name: 'MaintainNormalOperation', type: 'action', parent: 'MonitorBattery' },
                    { name: 'continueOperation', type: 'merge', parent: 'MonitorBattery' },
                ],
                decisions: [{ name: 'checkLevel' }],
                flows: [
                    { from: 'start', to: 'checkLevel' },
                    { from: 'checkLevel', to: 'TriggerLowPowerMode', guard: 'batteryLevel < 20.0' },
                    { from: 'checkLevel', to: 'MaintainNormalOperation', guard: 'batteryLevel >= 20.0' },
                    { from: 'TriggerLowPowerMode', to: 'continueOperation' },
                    { from: 'MaintainNormalOperation', to: 'continueOperation' },
                    { from: 'continueOperation', to: 'done' },
                ],
            }] }, 'activity').diagrams[0];
            const positions = layout(diagram, direction);
            assert.strictEqual(positions.size, 6);
            const position = (id: string): Position => {
                const value = positions.get(id);
                assert.ok(value, `Missing position for ${id}`);
                return value;
            };
            const crossAxis = direction === 'vertical' ? 'x' : 'y';
            const flowAxis = direction === 'vertical' ? 'y' : 'x';
            const controlNodes = ['start', 'checkLevel', 'continueOperation', 'done'];
            for (const id of controlNodes) {
                assert.strictEqual(position(id)[crossAxis], position('start')[crossAxis]);
            }
            const left = position('TriggerLowPowerMode');
            const right = position('MaintainNormalOperation');
            assert.strictEqual((left[crossAxis] + right[crossAxis]) / 2,
                position('start')[crossAxis]);
            assert.strictEqual(left[flowAxis], right[flowAxis]);
            const nodeSize = direction === 'vertical' ? 220 : 60;
            assert.ok(right[crossAxis] - left[crossAxis] - nodeSize >= 100,
                'Branches need at least 100 pixels of separation');
            assert.ok(position('checkLevel')[flowAxis] - position('start')[flowAxis] >= 140,
                'Successive levels need room for guard labels');
        });
    }
});
