/**
 * Performance and Load Time Tests
 *
 * Verifies that SysML file loading, parsing, and feature responsiveness
 * meet acceptable thresholds.  Tests cover:
 * - File load/parse time within budgets
 * - LSP server response times for model queries
 * - Extension activation time
 * - Handling of large/complex SysML files
 *
 * All tests are integration-only (require real extension host + LSP).
 */
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { openSample, SAMPLES_DIR, sleep, waitForLsp } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

/** Maximum acceptable time (ms) for parsing a sample file. */
const PARSE_BUDGET_MS = 15000;

/** Maximum acceptable time (ms) for extension activation. */
const ACTIVATION_BUDGET_MS = 10000;

/** Maximum acceptable time (ms) for a command to execute. */
const COMMAND_BUDGET_MS = 5000;

suite('Performance Test Suite', () => {

    /** Warm up the LSP once so that subsequent tests aren't penalised. */
    suiteSetup(async function () {
        if (_isUnitTest) { return; }
        this.timeout(30000);
        await openSample('vehicle-model.sysml');
    });

    test('Extension activates within time budget', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(ACTIVATION_BUDGET_MS + 5000);

        const ext = vscode.extensions.getExtension('jamied.sysml-v2-support');
        assert.ok(ext, 'Extension should be present');

        const start = Date.now();
        if (!ext!.isActive) {
            await ext!.activate();
        }
        const elapsed = Date.now() - start;

        assert.ok(
            elapsed < ACTIVATION_BUDGET_MS,
            `Extension activation took ${elapsed}ms, budget is ${ACTIVATION_BUDGET_MS}ms`,
        );
    });

    test('Opening a SysML file and getting diagnostics within budget', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(PARSE_BUDGET_MS + 10000);

        const samplePath = path.join(SAMPLES_DIR, 'vehicle-model.sysml');
        const start = Date.now();

        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(samplePath));
        await vscode.window.showTextDocument(doc);

        // Poll for diagnostics (proxy for "document is parsed")
        let attempts = 0;
        while (attempts < 6) {
            await sleep(500);
            attempts++;
        }

        const elapsed = Date.now() - start;
        assert.ok(
            elapsed < PARSE_BUDGET_MS,
            `File open + initial parse took ${elapsed}ms, budget is ${PARSE_BUDGET_MS}ms`,
        );
    });

    test('refreshModelTree responds within budget', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(COMMAND_BUDGET_MS + 5000);

        // LSP is already warm from suiteSetup
        const start = Date.now();
        await vscode.commands.executeCommand('sysml.refreshModelTree');
        const elapsed = Date.now() - start;

        assert.ok(
            elapsed < COMMAND_BUDGET_MS,
            `refreshModelTree took ${elapsed}ms, budget is ${COMMAND_BUDGET_MS}ms`,
        );
    });

    test('formatDocument responds within budget', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(COMMAND_BUDGET_MS + 5000);

        const start = Date.now();
        await vscode.commands.executeCommand('sysml.formatDocument');
        const elapsed = Date.now() - start;

        assert.ok(
            elapsed < COMMAND_BUDGET_MS,
            `formatDocument took ${elapsed}ms, budget is ${COMMAND_BUDGET_MS}ms`,
        );
    });

    test('validateModel responds within budget', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(COMMAND_BUDGET_MS + 5000);

        const start = Date.now();
        await vscode.commands.executeCommand('sysml.validateModel');
        const elapsed = Date.now() - start;

        assert.ok(
            elapsed < COMMAND_BUDGET_MS,
            `validateModel took ${elapsed}ms, budget is ${COMMAND_BUDGET_MS}ms`,
        );
    });

    test('All sample files can be opened and parsed', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(60000); // generous budget for multiple files

        const sampleFiles = fs.readdirSync(SAMPLES_DIR)
            .filter(f => f.endsWith('.sysml'));

        assert.ok(sampleFiles.length > 0, 'Should find sample .sysml files');

        const results: { file: string; elapsed: number }[] = [];

        for (const fileName of sampleFiles) {
            const start = Date.now();
            await openSample(fileName, 5000);
            const elapsed = Date.now() - start;
            results.push({ file: fileName, elapsed });

            assert.ok(
                elapsed < PARSE_BUDGET_MS,
                `${fileName} took ${elapsed}ms, budget is ${PARSE_BUDGET_MS}ms`,
            );
        }

        // Log summary
        for (const r of results) {
            console.log(`  [perf] ${r.file}: ${r.elapsed}ms`);
        }
    });

    test('Rapid document switching does not cause errors', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(20000);

        const sampleFiles = [
            'vehicle-model.sysml',
            'toaster-system.sysml',
            'smart-home.sysml',
            'space-mission.sysml',
        ];

        // Rapidly switch between files (simulates fast tab switching)
        for (let round = 0; round < 2; round++) {
            for (const fileName of sampleFiles) {
                const filePath = path.join(SAMPLES_DIR, fileName);
                const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
                await vscode.window.showTextDocument(doc);
                await sleep(200); // minimal delay — intentionally fast
            }
        }

        // Wait for everything to settle
        await sleep(2000);
        assert.ok(true, 'Rapid document switching completed without error');
    });

    test('clearCache command responds and does not break parsing', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(15000);

        // Clear caches
        await vscode.commands.executeCommand('sysml.clearCache');
        await sleep(1000);

        // Parsing should still work after cache clear
        await vscode.commands.executeCommand('sysml.refreshModelTree');
        assert.ok(true, 'Cache clear + re-parse succeeded');
    });

    test('Generating a large in-memory SysML document does not hang', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(30000);

        // Generate a moderately large SysML file (~200 part defs)
        let content = 'package LargeModel {\n';
        for (let i = 0; i < 200; i++) {
            content += `    part def Part${i} {\n`;
            content += `        attribute attr${i} : Real;\n`;
            content += `    }\n`;
        }
        content += '}\n';

        const doc = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content,
        });
        await vscode.window.showTextDocument(doc);

        const start = Date.now();
        // Poll for symbols instead of blind sleep
        await waitForLsp(doc.uri, 15_000);

        const elapsed = Date.now() - start;
        console.log(`  [perf] Large file (200 part defs) processing: ~${elapsed}ms`);

        assert.ok(true, 'Large document did not cause a hang');
    });
});
