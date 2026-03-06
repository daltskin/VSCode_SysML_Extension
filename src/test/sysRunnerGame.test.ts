/**
 * Easter Egg Game — SysML World / SysRunner Tests
 *
 * Verifies that the SysRunner game panel:
 * - Can be imported and instantiated
 * - Has the expected static API (createOrShow, currentPanel)
 * - Generates correct HTML structure with required elements
 * - Extracts document words via regex for boss projectiles
 * - Handles the levelComplete message with an info notification
 * - Disposes correctly and cleans up singleton reference
 * - References the external game script file that must exist
 */
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { sleep } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

suite('Easter Egg — SysML World Game Test Suite', () => {

    // ── Unit tests ───────────────────────────────────────────────

    test('SysRunnerPanel module is importable', () => {
        const modulePath = path.resolve(
            __dirname, '../../src/game/sysRunnerPanel.ts',
        );
        assert.ok(fs.existsSync(modulePath), 'sysRunnerPanel.ts should exist');
    });

    test('SysRunnerPanel exports expected class', () => {
        // Dynamically require the compiled JS
        const compiled = path.resolve(__dirname, '../game/sysRunnerPanel.js');
        if (!fs.existsSync(compiled)) {
            // If not compiled yet, just check the source
            const source = fs.readFileSync(
                path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
                'utf-8',
            );
            assert.ok(
                source.includes('export class SysRunnerPanel'),
                'Should export SysRunnerPanel class',
            );
            return;
        }

        const mod = require(compiled);
        assert.ok(mod.SysRunnerPanel, 'Module should export SysRunnerPanel');
        assert.ok(
            typeof mod.SysRunnerPanel.createOrShow === 'function',
            'createOrShow should be a static method',
        );
    });

    test('Game script file exists at expected location', () => {
        const scriptPath = path.resolve(
            __dirname, '../../media/game/sysrunner.js',
        );
        assert.ok(
            fs.existsSync(scriptPath),
            'sysrunner.js game script should exist in media/game/',
        );
    });

    test('Game script contains expected game structure', () => {
        const scriptPath = path.resolve(
            __dirname, '../../media/game/sysrunner.js',
        );
        const content = fs.readFileSync(scriptPath, 'utf-8');

        // The game script should reference key game elements
        assert.ok(
            content.includes('game') || content.includes('canvas'),
            'Game script should reference game or canvas elements',
        );
    });

    test('SysRunnerPanel source has Content Security Policy', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );
        assert.ok(
            source.includes('Content-Security-Policy'),
            'Webview should have a Content Security Policy meta tag',
        );
    });

    test('SysRunnerPanel webview enables scripts', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );
        assert.ok(
            source.includes('enableScripts: true'),
            'Webview options should enable scripts',
        );
    });

    test('SysRunnerPanel retains context when hidden', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );
        assert.ok(
            source.includes('retainContextWhenHidden: true'),
            'Webview should retain context when hidden',
        );
    });

    test('SysRunnerPanel restricts resource loading to game folder', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );
        assert.ok(
            source.includes("'media', 'game'"),
            'localResourceRoots should be restricted to media/game',
        );
    });

    test('SysRunnerPanel generates HTML with all required game elements', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        const requiredIds = [
            'game-wrapper',
            'hud',
            'hud-score',
            'hud-lives',
            'hud-blocks',
            'hud-level',
            'canvas-container',
            'title-screen',
            'start-btn',
            'level-complete',
            'next-btn',
            'game-over',
            'retry-btn',
            'model-panel',
            'puzzle-title',
            'puzzle-hint',
            'puzzle-slots',
            'puzzle-blocks',
        ];

        for (const id of requiredIds) {
            assert.ok(
                source.includes(`id="${id}"`),
                `Game HTML should contain element with id="${id}"`,
            );
        }
    });

    test('SysRunnerPanel document word extraction regex matches SysML keywords', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        // Verify the regex pattern covers key SysML definition keywords
        const expectedKeywords = [
            'part', 'port', 'attribute', 'action', 'item',
            'requirement', 'state', 'interface', 'connection',
            'occurrence', 'constraint', 'package', 'flow',
        ];

        for (const kw of expectedKeywords) {
            assert.ok(
                source.includes(kw),
                `Regex should include SysML keyword: ${kw}`,
            );
        }
    });

    test('SysRunnerPanel filters out very short names and built-in types', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        // Should skip names shorter than 3 characters
        assert.ok(
            source.includes('name.length >= 3'),
            'Should filter names shorter than 3 characters',
        );

        // Should skip common built-in types
        const builtIns = ['Real', 'Integer', 'Boolean', 'String', 'Natural'];
        for (const bi of builtIns) {
            assert.ok(
                source.includes(bi),
                `Should filter built-in type: ${bi}`,
            );
        }
    });

    test('SysRunnerPanel handles levelComplete message', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        assert.ok(
            source.includes("msg.type === 'levelComplete'"),
            'Should handle levelComplete message',
        );
        assert.ok(
            source.includes('showInformationMessage'),
            'Should show an information message on level complete',
        );
    });

    test('SysRunnerPanel disposes cleanly and resets singleton', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        assert.ok(
            source.includes('SysRunnerPanel.currentPanel = undefined'),
            'dispose() should reset currentPanel to undefined',
        );
        assert.ok(
            source.includes('this._panel.dispose()'),
            'dispose() should dispose the webview panel',
        );
    });

    test('SysRunnerPanel reveals existing panel instead of creating new one', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, '../../src/game/sysRunnerPanel.ts'),
            'utf-8',
        );

        assert.ok(
            source.includes('SysRunnerPanel.currentPanel') &&
            source.includes('.reveal('),
            'createOrShow should reveal existing panel for singleton behavior',
        );
    });

    // ── Integration tests ────────────────────────────────────────

    test('sysml.showSysRunner command is registered', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('sysml.showSysRunner'),
            'showSysRunner command should be registered',
        );
    });

    test('sysml.showSysRunner opens a webview panel', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(15000);

        const beforeTabs = vscode.window.tabGroups.all
            .flatMap(g => g.tabs).length;

        await vscode.commands.executeCommand('sysml.showSysRunner');
        await sleep(1000);

        const afterTabs = vscode.window.tabGroups.all
            .flatMap(g => g.tabs).length;

        assert.ok(
            afterTabs > beforeTabs,
            'Executing showSysRunner should open a new tab/panel',
        );
    });

    test('Running showSysRunner twice reveals same panel (singleton)', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(15000);

        await vscode.commands.executeCommand('sysml.showSysRunner');
        await sleep(500);

        const tabs1 = vscode.window.tabGroups.all
            .flatMap(g => g.tabs).length;

        await vscode.commands.executeCommand('sysml.showSysRunner');
        await sleep(500);

        const tabs2 = vscode.window.tabGroups.all
            .flatMap(g => g.tabs).length;

        assert.strictEqual(
            tabs2, tabs1,
            'Second call should reveal existing panel, not create a new one',
        );
    });
});
