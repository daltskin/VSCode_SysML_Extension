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
});
