import * as assert from 'assert';
import * as vscode from 'vscode';
import { SysMLFormatter } from '../formatting/formatter';

suite('SysML Formatter Test Suite', () => {
    vscode.window.showInformationMessage('Running SysML Formatter tests...');

    let formatter: SysMLFormatter;

    setup(() => {
        formatter = new SysMLFormatter();
    });

    test('Format simple package', async () => {
        const content = `package TestPackage {
part def Vehicle {
}
}`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
        const formatted = edits[0].newText;
        assert.ok(formatted.includes('    part def Vehicle'));
    });

    test('Format nested structure', async () => {
        const content = `package System {
part def Component {
attribute mass : Real;
}
}`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
        const formatted = edits[0].newText;
        const lines = formatted.split('\n');

        // Check indentation levels
        assert.ok(lines.some(l => l.startsWith('    part def Component')));
        assert.ok(lines.some(l => l.startsWith('        attribute mass')));
    });

    test('Format preserves empty lines', async () => {
        const content = `package Test {

part def Part1 {
}

part def Part2 {
}
}`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
        const formatted = edits[0].newText;
        const emptyLines = formatted.split('\n').filter(l => l.trim() === '');
        assert.ok(emptyLines.length >= 2);
    });

    test('Format with custom indent size', async () => {
        const content = `package Test {
part def Part1 {
}
}`;
        const document = await createTestDocument(content);

        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 2 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
    });

    test('Format handles closing braces', async () => {
        const content = `package Test {
part def Part1 {
attribute x : Real;
}
}`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
        const formatted = edits[0].newText;
        const lines = formatted.split('\n');

        // Find closing braces and check their indentation
        const closingBraces = lines.filter(l => l.trim() === '}');
        assert.ok(closingBraces.length >= 2);
    });

    test('Format handles multiple levels', async () => {
        const content = `package A {
package B {
package C {
part def D {
}
}
}
}`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
        const formatted = edits[0].newText;
        const lines = formatted.split('\n');

        // Check progressive indentation
        assert.ok(lines.some(l => l.startsWith('    package B')));
        assert.ok(lines.some(l => l.startsWith('        package C')));
        assert.ok(lines.some(l => l.startsWith('            part def D')));
    });

    test('Format handles single line', async () => {
        const content = `part def SimplePart { }`;
        const document = await createTestDocument(content);
        const edits = formatter.provideDocumentFormattingEdits(
            document,
            { insertSpaces: true, tabSize: 4 },
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits.length > 0);
    });
});

async function createTestDocument(content: string): Promise<vscode.TextDocument> {
    const document = await vscode.workspace.openTextDocument({
        language: 'sysml',
        content: content
    });
    return document;
}
