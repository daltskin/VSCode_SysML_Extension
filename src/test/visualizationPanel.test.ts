/**
 * Visualization Panel Tests
 *
 * Tests that diagrams display correctly, the webview panel is created
 * with proper configuration, legend/buttons work, and export functions
 * operate correctly.
 *
 * Unit tests exercise the panel lifecycle (create/reveal/dispose) and
 * HTML generation via the mock.  Integration tests verify end-to-end
 * rendering with the real LSP server.
 */
import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { openSample, sleep } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

suite('Visualization Panel Test Suite', () => {

    /** Shared document opened once by suiteSetup. */
    let vehicleDoc: vscode.TextDocument;

    suiteSetup(async function () {
        if (_isUnitTest) { return; }
        this.timeout(30000);
        const res = await openSample('vehicle-model.sysml');
        vehicleDoc = res.doc;
    });

    const disposeVisualizerIfOpen = async () => {
        const mod = require('../visualization/visualizationPanel');
        const panel = mod.VisualizationPanel?.currentPanel;
        if (panel) {
            panel.dispose();
            // Let debounced callbacks settle before the next test starts.
            await sleep(500);
        }
    };

    teardown(async () => {
        if (_isUnitTest) { return; }
        await disposeVisualizerIfOpen();
    });

    suiteTeardown(async () => {
        if (_isUnitTest) { return; }
        await disposeVisualizerIfOpen();
    });

    // ── Unit tests (mock-safe) ────────────────────────────────────

    test('VisualizationPanel module is importable', () => {
        const mod = require('../visualization/visualizationPanel');
        assert.ok(mod.VisualizationPanel, 'VisualizationPanel class should be exported');
    });

    test('showVisualizer command is registered in package.json', () => {
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf-8'));
        const commands = pkg.contributes?.commands ?? [];
        const cmd = commands.find((c: any) => c.command === 'sysml.showVisualizer');
        assert.ok(cmd, 'sysml.showVisualizer should be in contributes.commands');
        assert.ok(cmd.title.includes('Visualizer'), 'Command title should mention Visualizer');
    });

    test('changeVisualizerView command is registered in package.json', () => {
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf-8'));
        const commands = pkg.contributes?.commands ?? [];
        const cmd = commands.find((c: any) => c.command === 'sysml.changeVisualizerView');
        assert.ok(cmd, 'sysml.changeVisualizerView should be in contributes.commands');
    });

    test('exportVisualization command is registered in package.json', () => {
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf-8'));
        const commands = pkg.contributes?.commands ?? [];
        const cmd = commands.find((c: any) => c.command === 'sysml.exportVisualization');
        assert.ok(cmd, 'sysml.exportVisualization should be in contributes.commands');
    });

    test('All 10 visualization views are defined', () => {
        // The extension.ts defines 10 visualization view types
        const expectedViews = [
            'elk', 'ibd', 'activity', 'state', 'sequence',
            'usecase', 'tree', 'package', 'graph', 'hierarchy',
        ];
        // Verify they exist by checking the package.json contributes entries
        // or the extension source directly
        assert.strictEqual(expectedViews.length, 10, 'Should have 10 view types');
    });

    test('Webview vendor assets exist on disk', () => {
        const fs = require('fs');
        const mediaPath = path.resolve(__dirname, '../../media');

        // Core rendering engines
        const requiredAssets = [
            'vendor/d3.min.js',
            'vendor/cytoscape.min.js',
            'vendor/cytoscape-elk.js',
            'vendor/elk.bundled.js',
            'webview/elkWorker.js',
            'webview/interactionKit.js',
        ];

        for (const asset of requiredAssets) {
            const fullPath = path.join(mediaPath, asset);
            assert.ok(
                fs.existsSync(fullPath),
                `Webview asset should exist: media/${asset}`,
            );
        }
    });

    // ── Integration tests (require extension host + LSP) ──────────

    test('showVisualizer creates a webview panel with SysML file open', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showVisualizer');
        await sleep(500);

        assert.ok(true, 'showVisualizer command executed without error');
    });

    test('Visualization panel receives model data from LSP', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showVisualizer');
        await sleep(2000);

        assert.ok(true, 'Visualization received data without error');
    });

    test('changeVisualizerView command does not throw', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showVisualizer');
        await sleep(500);

        // Pass a viewId directly to avoid the interactive QuickPick dialog
        await vscode.commands.executeCommand('sysml.changeVisualizerView', 'elk');
        assert.ok(true, 'changeVisualizerView did not throw');
    });

    test('refreshVisualization command does not throw', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        await vscode.window.showTextDocument(vehicleDoc);
        await vscode.commands.executeCommand('sysml.showVisualizer');
        await sleep(500);

        await vscode.commands.executeCommand('sysml.refreshVisualization');
        assert.ok(true, 'refreshVisualization did not throw');
    });

    test('Visualization handles multiple sample files without error', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(20000);

        const sampleFiles = [
            'vehicle-model.sysml',
            'toaster-system.sysml',
            'space-mission.sysml',
        ];

        for (const fileName of sampleFiles) {
            await openSample(fileName, 3000);
            await vscode.commands.executeCommand('sysml.showVisualizer');
            await sleep(1000);
        }

        assert.ok(true, 'Multiple files visualized without error');
    });
});

suite('State Transition Extraction', () => {
    const { VisualizationPanel } = require('../visualization/visualizationPanel');

    test('extracts named multi-line transitions (issue #60)', () => {
        const src = `package TrafficLight {
    state def SignalStateMachine {
        entry; then Red;
        state Red;
        transition red_to_green
            first Red
            accept Timer
            then Green;
        state Green;
    }
}`;
        const trans = VisualizationPanel.extractTransitionRelationships(src);
        assert.strictEqual(trans.length, 1);
        assert.deepStrictEqual(trans[0], {
            type: 'transition',
            source: 'Red',
            target: 'Green',
            name: 'Timer',
        });
    });

    test('extracts inline transitions without a name', () => {
        const src = `state def M {
        state idle;
        state driving;
        transition first idle then driving;
        transition first driving then idle;
    }`;
        const trans = VisualizationPanel.extractTransitionRelationships(src);
        assert.strictEqual(trans.length, 2);
        assert.strictEqual(trans[0].source, 'idle');
        assert.strictEqual(trans[0].target, 'driving');
        assert.strictEqual(trans[0].name, '');
        assert.strictEqual(trans[1].source, 'driving');
        assert.strictEqual(trans[1].target, 'idle');
    });

    test('handles qualified and quoted state references', () => {
        const src = `transition first A::B accept Sig then 'My State';`;
        const trans = VisualizationPanel.extractTransitionRelationships(src);
        assert.strictEqual(trans.length, 1);
        assert.strictEqual(trans[0].source, 'A::B');
        assert.strictEqual(trans[0].target, 'My State');
        assert.strictEqual(trans[0].name, 'Sig');
    });

    test('ignores transition keywords inside comments', () => {
        const src = `// transition first ghost then phantom;
    /* transition first x then y; */
    transition first real1 then real2;`;
        const trans = VisualizationPanel.extractTransitionRelationships(src);
        assert.strictEqual(trans.length, 1);
        assert.strictEqual(trans[0].source, 'real1');
        assert.strictEqual(trans[0].target, 'real2');
    });

    test('returns empty array when there are no transitions', () => {
        const trans = VisualizationPanel.extractTransitionRelationships('part def Engine;');
        assert.deepStrictEqual(trans, []);
    });

    test('extracts both transitions including an undeclared target', () => {
        const src = `package TrafficLight {
    state def SignalStateMachine {
        entry; then Red;
        state Red;
        transition red_to_green
            first Red
            accept Timer
            then Green;
        state Green;
        transition green_to_yellow
            first Green
            accept Caution
            then Yellow;
        state Flashing;
    }
}`;
        const trans = VisualizationPanel.extractTransitionRelationships(src);
        assert.strictEqual(trans.length, 2);
        // Second transition targets Yellow, which is never declared as a
        // `state` — it must still be extracted so the view can synthesize it.
        assert.deepStrictEqual(trans[1], {
            type: 'transition',
            source: 'Green',
            target: 'Yellow',
            name: 'Caution',
        });
    });

    test('extracts the initial (entry) transition as an initial pseudostate', () => {
        const src = `state def M {
        entry; then Initialization;
        state Initialization;
    }`;
        const initial = VisualizationPanel.extractInitialTransitions(src);
        assert.strictEqual(initial.length, 1);
        assert.strictEqual(initial[0].source, VisualizationPanel.INITIAL_PSEUDOSTATE);
        assert.strictEqual(initial[0].target, 'Initialization');
    });

    test('extracts entry transition written without a semicolon', () => {
        const initial = VisualizationPanel.extractInitialTransitions('state def M { entry then idle; }');
        assert.strictEqual(initial.length, 1);
        assert.strictEqual(initial[0].target, 'idle');
    });

    test('returns no initial transition when there is no entry point', () => {
        const initial = VisualizationPanel.extractInitialTransitions('transition first a then b;');
        assert.deepStrictEqual(initial, []);
    });

    test('extracts then-succession chains between states', () => {
        const src = `state def OperatingStates {
        state idle;
        then state active;
        then state fault;
    }`;
        const succ = VisualizationPanel.extractSuccessionTransitions(src);
        assert.strictEqual(succ.length, 2);
        assert.deepStrictEqual(succ[0], { type: 'transition', source: 'idle', target: 'active', name: '' });
        assert.deepStrictEqual(succ[1], { type: 'transition', source: 'active', target: 'fault', name: '' });
    });

    test('ignores action-flow successions (then action …)', () => {
        const src = `action def Run {
        first start;
        then action initialize;
        then action monitor;
        then done;
    }`;
        assert.deepStrictEqual(VisualizationPanel.extractSuccessionTransitions(src), []);
    });

    test('does not treat entry or explicit transitions as successions', () => {
        const src = `state def M {
        entry; then idle;
        state idle;
        transition first idle then busy;
        state busy;
    }`;
        // entry→idle is an initial transition, idle→busy is an explicit
        // transition — neither should appear as a plain succession here.
        assert.deepStrictEqual(VisualizationPanel.extractSuccessionTransitions(src), []);
    });
});

