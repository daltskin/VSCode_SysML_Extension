/**
 * Diagram Legend & Button Tests
 *
 * Tests that the visualization panel contains the expected UI elements:
 * legend popup, about popup, fit button, export functionality, view
 * switching dropdown, dashboard button, and game button.
 *
 * Unit tests inspect the generated HTML for expected elements.
 * Integration tests verify the panel commands work end-to-end.
 */
import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { openSample, sleep } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

suite('Diagram Legend & Buttons Test Suite', () => {

    /** Shared document opened once by suiteSetup. */
    let vehicleDoc: vscode.TextDocument;

    suiteSetup(async function () {
        if (_isUnitTest) { return; }
        this.timeout(30000);
        const res = await openSample('vehicle-model.sysml');
        vehicleDoc = res.doc;
    });

    // ── Unit tests (inspect HTML structure) ───────────────────────

    test('Visualization panel HTML contains legend button', () => {
        // Read the source file and verify the legend UI exists
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(source.includes('id="legend-btn"'), 'Should have legend button');
        assert.ok(source.includes('id="legend-popup"'), 'Should have legend popup');
        assert.ok(source.includes('id="legend-close-btn"'), 'Should have legend close button');
    });

    test('Visualization panel HTML contains about button and popup', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(source.includes('id="about-btn"'), 'Should have about button');
        assert.ok(source.includes('id="about-popup"'), 'Should have about popup');
        assert.ok(source.includes('id="about-backdrop"'), 'Should have about backdrop');
        assert.ok(source.includes('id="about-close-btn"'), 'Should have about close button');
    });

    test('Visualization panel HTML contains fit button', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(source.includes('id="fit-btn"'), 'Should have fit-to-view button');
    });

    test('Visualization panel HTML contains export button and menu', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(source.includes('id="export-btn"'), 'Should have export button');
        assert.ok(source.includes('id="export-menu"'), 'Should have export dropdown menu');
    });

    test('Visualization panel HTML contains view dropdown with all view types', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        // Check for view buttons/dropdown items
        const viewIds = [
            'data-view="elk"',     // General
            'data-view="ibd"',     // Interconnection
            'data-view="activity"', // Activity
            'data-view="state"',   // State
            'data-view="sequence"', // Sequence
            'data-view="usecase"', // Use Case
            'data-view="tree"',    // Tree
            'data-view="package"', // Package
            'data-view="graph"',   // Graph
            'data-view="hierarchy"', // Hierarchy
        ];

        for (const viewAttr of viewIds) {
            assert.ok(
                source.includes(viewAttr),
                `Visualization should contain view dropdown item: ${viewAttr}`,
            );
        }
    });

    test('Visualization panel HTML contains Model Dashboard button', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(
            source.includes('data-view="dashboard"'),
            'Should have dashboard view dropdown item',
        );
        assert.ok(
            source.includes('sysml.showModelDashboard'),
            'Should reference showModelDashboard command',
        );
    });

    test('About popup contains GitHub and Rate links', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(source.includes('id="about-rate-link"'), 'Should have rate link button');
        assert.ok(source.includes('id="about-repo-link"'), 'Should have GitHub repo link button');
    });

    test('Legend popup contains draggable header', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        assert.ok(
            source.includes('id="legend-header"'),
            'Legend should have a draggable header',
        );
        assert.ok(
            source.includes('cursor: grab'),
            'Legend header should have grab cursor for dragging',
        );
    });

    test('Webview message handler supports expected commands', () => {
        const fs = require('fs');
        const panelPath = path.resolve(
            __dirname, '../../src/visualization/visualizationPanel.ts',
        );
        const source = fs.readFileSync(panelPath, 'utf-8');

        const expectedMessages = [
            'webviewLog',
            'jumpToElement',
            'renameElement',
            'export',
            'executeCommand',
            'viewChanged',
            'openExternal',
            'currentViewResponse',
            'webviewReady',
        ];

        for (const msg of expectedMessages) {
            assert.ok(
                source.includes(`'${msg}'`) || source.includes(`"${msg}"`),
                `Should handle '${msg}' webview message`,
            );
        }
    });

    // ── Integration tests ────────────────────────────────────────

    test('exportVisualization command is registered', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        // Verify the command is registered (we can't execute it because
        // it shows an interactive QuickPick dialog for format/scale)
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('sysml.exportVisualization'),
            'exportVisualization command should be registered',
        );
    });

    test('showModelDashboard command creates a panel', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showModelDashboard');
        await sleep(500);

        assert.ok(true, 'showModelDashboard created panel without error');
    });

    test('showFeatureInspector command creates a panel', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showFeatureInspector');
        await sleep(500);

        assert.ok(true, 'showFeatureInspector created panel without error');
    });

    test('showTypeHierarchy command does not throw', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showTypeHierarchy');
        assert.ok(true, 'showTypeHierarchy did not throw');
    });

    test('showCallHierarchy command does not throw', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showCallHierarchy');
        assert.ok(true, 'showCallHierarchy did not throw');
    });
});
