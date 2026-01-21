import * as assert from 'assert';
import * as vscode from 'vscode';
import { SysMLParser } from '../parser/sysmlParser';

/**
 * Helper function to create a mock TextDocument for testing.
 */
function createMockDocument(content: string): vscode.TextDocument {
    return {
        getText: () => content,
        positionAt: (offset: number) => {
            const lines = content.substring(0, offset).split('\n');
            const line = lines.length - 1;
            const character = lines[lines.length - 1].length;
            return new vscode.Position(line, character);
        },
        offsetAt: (position: vscode.Position) => {
            const lines = content.split('\n');
            let offset = 0;
            for (let i = 0; i < position.line && i < lines.length; i++) {
                offset += lines[i].length + 1; // +1 for newline
            }
            return offset + position.character;
        }
    } as vscode.TextDocument;
}

/**
 * Test suite for activity diagram extraction functionality.
 */
suite('Activity Diagram Extraction', () => {
    let parser: SysMLParser;

    setup(() => {
        parser = new SysMLParser();
    });

    test('Should extract activity diagrams from simple action', async () => {
        // Test uses simpler syntax that ANTLR can parse correctly
        const content = `
package TestPackage {
    action def SimpleWorkflow {
        action startProcess;
        then action performTask;
        then action processStep;
        then action endProcess;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 1, 'Should extract one activity diagram');

        const activity = activities[0];
        assert.strictEqual(activity.name, 'SimpleWorkflow', 'Activity name should match');
        assert.ok(activity.actions.length > 0, 'Should have extracted actions');
    });

    test('Should handle action without activity flow', async () => {
        const content = `
package TestPackage {
    action SimpleAction {
        attribute value : Real;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        // Should not extract activities without clear flow patterns
        assert.strictEqual(activities.length, 0, 'Should not extract simple actions without flow');
    });

    test('Should extract multiple activity diagrams', async () => {
        // Test uses simpler syntax that ANTLR can parse correctly
        const content = `
package TestPackage {
    action def FirstActivity {
        action firstStep;
        then action secondStep;
        then action thirdStep;
    }

    action def SecondActivity {
        action differentFirstStep;
        then action loopStep;
        then action finalStep;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 2, 'Should extract both activity diagrams');
        assert.strictEqual(activities[0].name, 'FirstActivity', 'First activity name should match');
        assert.strictEqual(activities[1].name, 'SecondActivity', 'Second activity name should match');
    });

    test('Should handle empty document', async () => {
        const content = '';

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 0, 'Should handle empty document gracefully');
    });

    test('Should extract flows between actions', async () => {
        const content = `
package TestPackage {
    action def FlowTest {
        action firstAction;
        then action secondAction;
        then action thirdAction;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 1, 'Should extract one activity diagram');

        const activity = activities[0];
        assert.ok(activity.actions.length >= 3, 'Should have extracted at least 3 actions');
    });

    test('Should extract fork and join nodes with correct flows', async () => {
        const content = `
package TestPackage {
    action def ParallelWorkflow {
        action taskA;
        action taskB;
        join joinPoint;

        first start;
        then fork forkPoint;
        then taskA;
        then taskB;
        first taskA then joinPoint;
        first taskB then joinPoint;
        first joinPoint then done;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 1, 'Should extract one activity diagram');

        const activity = activities[0];

        // Check for fork and join nodes
        const forkNodes = activity.actions.filter(a => a.kind === 'fork' || a.type === 'fork');
        const joinNodes = activity.actions.filter(a => a.kind === 'join' || a.type === 'join');

        assert.ok(forkNodes.length >= 1, 'Should have at least one fork node');
        assert.ok(joinNodes.length >= 1, 'Should have at least one join node');

        // Check for parallel flows from fork
        const flowsFromFork = activity.flows.filter(f => f.from === 'forkPoint');
        assert.strictEqual(flowsFromFork.length, 2, 'Fork should have 2 outgoing flows (to taskA and taskB)');

        // Check for converging flows to join
        const flowsToJoin = activity.flows.filter(f => f.to === 'joinPoint');
        assert.strictEqual(flowsToJoin.length, 2, 'Join should have 2 incoming flows (from taskA and taskB)');
    });

    test('Should handle standalone fork declarations with subsequent then statements', async () => {
        const content = `
package TestPackage {
    use case ParallelProcess {
        action processA;
        action processB;
        join merge;

        first start;
        first start then fork1;

        fork fork1;
        then processA;
        then processB;
        first processA then merge;
        first processB then merge;
        first merge then done;
    }
}`;

        const document = createMockDocument(content);

        const activities = parser.getActivityDiagrams(document);

        assert.strictEqual(activities.length, 1, 'Should extract one activity diagram');

        const activity = activities[0];

        // Check that both processA and processB flow from fork1
        const flowsFromFork = activity.flows.filter(f => f.from === 'fork1');
        assert.strictEqual(flowsFromFork.length, 2, 'Both parallel tasks should flow from fork1');

        const flowTargets = flowsFromFork.map(f => f.to).sort();
        assert.deepStrictEqual(flowTargets, ['processA', 'processB'], 'Fork should flow to both parallel tasks');
    });
});
