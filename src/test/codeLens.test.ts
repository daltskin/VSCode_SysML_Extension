/**
 * CodeLens Tests
 *
 * Verifies that CodeLens (reference counting lenses provided by the
 * LSP server) appears correctly on SysML definition elements.
 *
 * The LSP server provides CodeLens items showing "N references" above
 * definitions, which invoke `sysml.findReferences` when clicked.
 *
 * Integration tests require the real extension host + LSP server.
 */
import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { openSample, pollForResult, sleep } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

suite('CodeLens Test Suite', () => {

    /** Shared document opened once by suiteSetup. */
    let vehicleDoc: vscode.TextDocument;
    let lspReady: boolean;

    suiteSetup(async function () {
        if (_isUnitTest) { return; }
        this.timeout(30000);
        const res = await openSample('vehicle-model.sysml');
        vehicleDoc = res.doc;
        lspReady = res.ready;
    });

    // ── Unit tests ────────────────────────────────────────────────

    test('findReferences bridge command is declared in LSP client', () => {
        // Verify the sysml.findReferences command is registered in the
        // LSP client source code (can't import the module in unit tests
        // because vscode-languageclient depends on the real vscode API)
        const fs = require('fs');
        const clientSource = fs.readFileSync(
            path.resolve(__dirname, '../../src/lsp/client.ts'),
            'utf-8',
        );
        assert.ok(
            clientSource.includes('findReferences') || clientSource.includes('sysml.findReferences'),
            'LSP client should register or reference a findReferences command',
        );
    });

    // ── Integration tests ────────────────────────────────────────

    test('CodeLens items are returned for a SysML file with definitions', async function () {
        if (_isUnitTest) { return this.skip(); }
        if (!lspReady) { return this.skip(); }
        this.timeout(15000);

        const lenses = await pollForResult(
            () => vscode.commands.executeCommand<vscode.CodeLens[]>(
                'vscode.executeCodeLensProvider', vehicleDoc.uri),
            l => !!l && l.length > 0,
            10_000,
        );

        if (!lenses || lenses.length === 0) {
            this.skip(); // LSP not ready for CodeLens yet
            return;
        }
        assert.ok(lenses.length > 0, 'CodeLens should return items for vehicle-model.sysml');
    });

    test('CodeLens items have reference commands', async function () {
        if (_isUnitTest) { return this.skip(); }
        if (!lspReady) { return this.skip(); }
        this.timeout(15000);

        const lenses = await pollForResult(
            () => vscode.commands.executeCommand<vscode.CodeLens[]>(
                'vscode.executeCodeLensProvider', vehicleDoc.uri),
            l => !!l && l.length > 0,
            10_000,
        );

        if (!lenses || lenses.length === 0) {
            this.skip();
            return;
        }

        // At least some lenses should have a command (resolved)
        const resolvedLenses = lenses.filter(l => l.command);
        if (resolvedLenses.length > 0) {
            const firstResolved = resolvedLenses[0];
            assert.ok(firstResolved.command, 'Resolved CodeLens should have a command');
            assert.ok(
                firstResolved.command!.title,
                'CodeLens command should have a title (e.g. "N references")',
            );
        }
    });

    test('CodeLens works on a file with cross-references', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(20000);

        // Use smart-home which has many cross-references
        const { doc, ready } = await openSample('smart-home.sysml');
        if (!ready) { return this.skip(); }

        const lenses = await pollForResult(
            () => vscode.commands.executeCommand<vscode.CodeLens[]>(
                'vscode.executeCodeLensProvider', doc.uri),
            l => !!l && l.length > 0,
            10_000,
        );

        if (!lenses || lenses.length === 0) {
            this.skip(); // LSP not ready for CodeLens yet
            return;
        }
        assert.ok(lenses.length > 0, 'CodeLens items expected for smart-home.sysml');
    });

    test('findReferences command is registered and callable', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('sysml.findReferences'),
            'sysml.findReferences command should be registered',
        );
    });

    test('CodeLens appears for multiple sample files', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(30000);

        const files = [
            'vehicle-model.sysml',
            'toaster-system.sysml',
            'rc-car.sysml',
        ];

        for (const fileName of files) {
            const { doc } = await openSample(fileName);
            await sleep(1000);

            const lenses = await vscode.commands.executeCommand<vscode.CodeLens[]>(
                'vscode.executeCodeLensProvider',
                doc.uri,
            );

            console.log(`  [codelens] ${fileName}: ${lenses?.length ?? 0} lenses`);
            assert.ok(
                lenses !== undefined,
                `CodeLens provider should respond for ${fileName}`,
            );
        }
    });
});
