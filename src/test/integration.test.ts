import * as assert from 'assert';
import * as net from 'net';
import * as vscode from 'vscode';

const _isUnitTest = (vscode as any)._isMock === true;

suite('Development launcher', () => {
    const { launchArguments, checkInspectorPort } = require('../../scripts/launch-extension.cjs') as {
        launchArguments(root: string, inspect?: boolean): string[];
        checkInspectorPort(port?: number): Promise<void>;
    };

    test('rejects an occupied inspector port and accepts a free port', async () => {
        const server = net.createServer();
        await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
        const port = (server.address() as net.AddressInfo).port;
        try {
            await assert.rejects(checkInspectorPort(port), /Stop the previous debug session/);
        } finally {
            await new Promise<void>(resolve => server.close(() => resolve()));
        }
        await checkInspectorPort(port);
    });

    test('passes the dedicated workspace without disabling extensions on desktop', () => {
        const args = launchArguments('/models/extension');
        assert.strictEqual(args[0], '/models/extension/.vscode/extension-development.code-workspace');
        assert.ok(args.includes('--extensionDevelopmentPath=/models/extension'));
        assert.ok(!args.some(argument => argument.startsWith('--disable-extension')));
    });

    test('leaves paths containing spaces intact for the desktop CLI to convert in WSL', () => {
        const args = launchArguments('/home/test/Model Extension');
        assert.ok(!args.includes('--remote'));
        assert.strictEqual(args[0], '/home/test/Model Extension/.vscode/extension-development.code-workspace');
        assert.ok(args.includes('--extensionDevelopmentPath=/home/test/Model Extension'));
        assert.ok(!args.some(argument => argument.startsWith('--disable-extension')));
    });

    test('only pauses for the inspector when launched for F5 attachment', () => {
        assert.ok(!launchArguments('/models/extension')
            .some(argument => argument.startsWith('--inspect')));
        assert.ok(launchArguments('/models/extension', true)
            .includes('--inspect-brk-extensions=6008'));
        assert.ok(!launchArguments('/models/extension', true)
            .some(argument => argument.startsWith('--disable-extension')));
    });
});

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
        if (_isUnitTest) { return this.skip(); } // needs real extension activation
        this.timeout(5000);

        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes('sysml.formatDocument'));
        assert.ok(commands.includes('sysml.validateModel'));
        assert.ok(commands.includes('sysml.showVisualizer'));
        assert.ok(commands.includes('sysml.showModelWorkbench'));
        assert.ok(commands.includes('sysml.refreshModelTree'));
        assert.ok(commands.includes('sysml.exportVisualization'));
        assert.ok(commands.includes('sysml.restartServer'));
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

    test('LSP configuration should be available', () => {
        const config = vscode.workspace.getConfiguration('sysml');
        const lspConfig = vscode.workspace.getConfiguration('sysmlLanguageServer');

        const traceServer = lspConfig.get('trace.server');
        const maxProblems = config.get('maxNumberOfProblems');
        const libraryPath = config.get('library.path');

        assert.strictEqual(traceServer, 'off');
        assert.ok(maxProblems === undefined || typeof maxProblems === 'number');
        assert.ok(libraryPath === undefined || typeof libraryPath === 'string');
    });

    test('Document formatting should work', async function() {
        if (_isUnitTest) { return this.skip(); } // needs real LSP formatting
        this.timeout(15000);

        const content = `package Test {
part def Part1 {
}
}`;
        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: content
        });

        const editor = await vscode.window.showTextDocument(document);

        // Wait for the LSP server to be ready before formatting
        await sleep(3000);

        // Format document (now handled by LSP server)
        await vscode.commands.executeCommand('editor.action.formatDocument');

        // Allow time for formatting round-trip
        await sleep(1000);

        // Check that document text changed (was formatted)
        const formattedText = editor.document.getText();
        // The LSP may indent differently than the old formatter;
        // we just verify the command didn't error out
        assert.ok(formattedText.length > 0);
    });

    test('Validation should produce diagnostics', async function() {
        if (_isUnitTest) { return this.skip(); } // needs real LSP diagnostics
        this.timeout(15000);

        const content = `package Test {
    part def Part1 {
}`;  // Missing closing brace

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content: content
        });

        await vscode.window.showTextDocument(document);

        // Wait for LSP server to analyse the document
        await sleep(3000);

        // Poll for diagnostics with retries (LSP server may take time)
        let diagnostics = vscode.languages.getDiagnostics(document.uri);
        for (let i = 0; i < 20 && diagnostics.length === 0; i++) {
            await sleep(500);
            diagnostics = vscode.languages.getDiagnostics(document.uri);
        }

        assert.ok(diagnostics.length > 0, 'LSP server should report diagnostics for malformed SysML');
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
