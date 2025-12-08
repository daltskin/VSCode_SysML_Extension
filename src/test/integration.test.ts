import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Integration Test Suite', () => {
    vscode.window.showInformationMessage('Running Integration tests...');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('jamied.sysml-v2-support'));
    });

    test('Extension should activate', async function() {
        this.timeout(10000);

        const ext = vscode.extensions.getExtension('jamied.sysml-v2-support');
        if (ext) {
            await ext.activate();
            assert.strictEqual(ext.isActive, true);
        }
    });

    test('Commands should be registered', async function() {
        this.timeout(5000);

        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes('sysml.formatDocument'));
        assert.ok(commands.includes('sysml.validateModel'));
        assert.ok(commands.includes('sysml.showVisualizer'));
        assert.ok(commands.includes('sysml.refreshModelTree'));
        assert.ok(commands.includes('sysml.exportVisualization'));
    });

    test('Language should be registered', async () => {
        const languages = await vscode.languages.getLanguages();
        assert.ok(languages.includes('sysml'));
    });

    test('Configuration should be available', () => {
        const config = vscode.workspace.getConfiguration('sysml');
        assert.ok(config !== undefined);

        // Check default values
        const validationEnabled = config.get('validation.enabled');
        const indentSize = config.get('format.indentSize');
        const defaultView = config.get('visualization.defaultView');

        assert.strictEqual(typeof validationEnabled, 'boolean');
        assert.strictEqual(typeof indentSize, 'number');
        assert.strictEqual(typeof defaultView, 'string');
    });

    test('Document formatting should work', async function() {
        this.timeout(5000);

        const content = `package Test {
part def Part1 {
}
}`;
        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: content
        });

        const editor = await vscode.window.showTextDocument(document);

        // Format document
        await vscode.commands.executeCommand('editor.action.formatDocument');

        // Check that document text changed (was formatted)
        const formattedText = editor.document.getText();
        assert.ok(formattedText.includes('    part def Part1'));
    });

    test('Validation should produce diagnostics', async function() {
        this.timeout(5000);

        const content = `package Test {
    part def Part1 {
}`;  // Missing closing brace

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: content
        });

        await vscode.window.showTextDocument(document);

        // Trigger validation
        await vscode.commands.executeCommand('sysml.validateModel');

        // Wait a bit for diagnostics
        await sleep(500);

        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        assert.ok(diagnostics.length > 0);
    });

    test('File extension association', async () => {
        const sysmlDoc = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: 'package Test { }'
        });

        assert.strictEqual(sysmlDoc.languageId, 'sysml');
    });

    test('Syntax highlighting tokens', async function() {
        this.timeout(5000);

        const content = `package TestPackage {
    part def Vehicle {
    }
}`;
        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: content
        });

        await vscode.window.showTextDocument(document);

        // Basic test that the document opened with sysml language
        assert.strictEqual(document.languageId, 'sysml');
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
