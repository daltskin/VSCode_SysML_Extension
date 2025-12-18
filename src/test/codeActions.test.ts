import * as assert from 'assert';
import * as vscode from 'vscode';

suite('SysML Code Actions', () => {
    test('Offers Quick Fix to replace invalid keyword with package', async function() {
        this.timeout(10000);

        const content = `packageasdf Test {
}`;

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content
        });

        await vscode.window.showTextDocument(document);

        // No diagnostics are required for keyword-typo quick fixes; the provider can infer from the token.

        const firstLineRange = new vscode.Range(0, 0, 0, 'packageasdf'.length);

        const actions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
            'vscode.executeCodeActionProvider',
            document.uri,
            firstLineRange
        );

        assert.ok(actions);
        const titles = actions!.map(a => a.title);

        // We expect a quick fix suggestion that replaces it with package
        assert.ok(
            titles.some(t => t.toLowerCase().includes('replace with package')),
            `Expected quick fix 'Replace with package'.\nActions: ${JSON.stringify(titles)}`
        );
    });

    test('Offers Quick Fix to replace invalid keyword with attribute', async function() {
        this.timeout(10000);

        const content = `attributex foo: String;`;

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content
        });

        await vscode.window.showTextDocument(document);

        const firstWordRange = new vscode.Range(0, 0, 0, 'attributex'.length);

        const actions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
            'vscode.executeCodeActionProvider',
            document.uri,
            firstWordRange
        );

        assert.ok(actions);
        const titles = actions!.map(a => a.title);

        assert.ok(
            titles.some(t => t.toLowerCase().includes('replace with attribute')),
            `Expected quick fix 'Replace with attribute'.\nActions: ${JSON.stringify(titles)}`
        );
    });

    test('Offers Quick Fix for squashed multi-word keyword (partdef -> part def)', async function() {
        this.timeout(10000);

        const content = `partdef Wheel {\n}`;

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content
        });

        await vscode.window.showTextDocument(document);

        const firstWordRange = new vscode.Range(0, 0, 0, 'partdef'.length);

        const actions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
            'vscode.executeCodeActionProvider',
            document.uri,
            firstWordRange
        );

        assert.ok(actions);
        const titles = actions!.map(a => a.title);

        assert.ok(
            titles.some(t => t.toLowerCase().includes('replace with part def')),
            `Expected quick fix 'Replace with part def'.\nActions: ${JSON.stringify(titles)}`
        );
    });
});
