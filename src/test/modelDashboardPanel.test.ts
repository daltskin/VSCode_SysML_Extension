/**
 * Unit tests for ModelDashboardPanel.
 *
 * Covers all invocation paths:
 * 1. From file explorer (file URI provided → activeTextEditor available)
 * 2. From visualizer dropdown (documentUri provided → no activeTextEditor)
 * 3. From command palette (no URI → activeTextEditor available)
 * 4. No SysML file open at all → empty state
 * 5. LSP provider missing → error state
 * 6. Re-reveal existing panel (singleton pattern)
 */

import * as assert from 'assert';
import * as vscode from 'vscode';

// We need to access the panel through the public static API only.
import { ModelDashboardPanel } from '../panels/modelDashboardPanel';

// ── Helpers ──────────────────────────────────────────────────────

/** Minimal mock LspModelProvider for dashboard tests. */
function createMockLspProvider(overrides?: {
    stats?: Record<string, unknown>;
    resolvedTypes?: Record<string, unknown>;
    shouldThrow?: boolean;
}) {
    return {
        getModel: async (_uri: string, _scopes?: string[]) => {
            if (overrides?.shouldThrow) {
                throw new Error('LSP unavailable');
            }
            return {
                version: 1,
                elements: [{ name: 'TestPart', type: 'part', range: { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } }, children: [], attributes: {}, relationships: [] }],
                relationships: [],
                stats: {
                    totalElements: 5,
                    resolvedElements: 4,
                    unresolvedElements: 1,
                    parseTimeMs: 12,
                    modelBuildTimeMs: 8,
                    ...(overrides?.stats ?? {}),
                },
                resolvedTypes: overrides?.resolvedTypes ?? {
                    'Vehicle': {
                        qualifiedName: 'pkg::Vehicle',
                        simpleName: 'Vehicle',
                        kind: 'PartDefinition',
                        isLibraryType: false,
                        specializationChain: [],
                        specializes: [],
                        features: [],
                    },
                },
            };
        },
    } as any;
}

/** Create a fake TextDocument matching SysML. */
function createFakeSysmlDocument(uri: string) {
    return {
        uri: vscode.Uri.parse(uri),
        languageId: 'sysml',
        fileName: uri.split('/').pop() ?? 'test.sysml',
        version: 1,
        isClosed: false,
        getText: () => 'package TestPkg {}',
    };
}

/** Safely override vscode.window.activeTextEditor (getter-only property). */
function setActiveTextEditor(editor: any) {
    Object.defineProperty(vscode.window, 'activeTextEditor', {
        get: () => editor,
        configurable: true,
    });
}

/** Ensure the singleton is cleaned up between tests. */
function disposeDashboard() {
    if (ModelDashboardPanel.currentPanel) {
        ModelDashboardPanel.currentPanel.dispose();
    }
}

// ── Tests ────────────────────────────────────────────────────────

suite('ModelDashboardPanel', () => {
    const originalGetDiagnostics = vscode.languages.getDiagnostics;
    const originalOpenDocument = vscode.workspace.openTextDocument;

    setup(() => {
        vscode.workspace.openTextDocument = (async (uri: vscode.Uri) =>
            createFakeSysmlDocument(uri.toString())) as unknown as typeof vscode.workspace.openTextDocument;
    });

    teardown(() => {
        disposeDashboard();
        // Restore activeTextEditor to undefined
        setActiveTextEditor(undefined);
        (vscode.languages as any).getDiagnostics = originalGetDiagnostics;
        vscode.workspace.openTextDocument = originalOpenDocument;
    });

    // ── Singleton lifecycle ──────────────────────────────────────

    test('opens only the selected document before requesting its complexity data', async () => {
        const originalOpen = vscode.workspace.openTextDocument;
        const originalDocuments = vscode.workspace.textDocuments;
        const selected = createFakeSysmlDocument('file:///selected.sysml');
        const opened: string[] = [];
        try {
            Object.assign(vscode.workspace, { textDocuments: [] });
            vscode.workspace.openTextDocument = (async (uri: vscode.Uri) => {
                opened.push(uri.toString());
                return selected;
            }) as unknown as typeof vscode.workspace.openTextDocument;
            const provider = createMockLspProvider({ stats: { complexity: {
                complexityIndex: 12, rating: 'Low', definitions: 1, usages: 1,
                maxDepth: 1, couplingCount: 0, unusedDefinitions: 0, documentationCoverage: 0,
            } } });
            const getModel = provider.getModel;
            provider.getModel = async (...args: any[]) => {
                assert.deepStrictEqual(opened, [selected.uri.toString()]);
                return getModel(...args);
            };
            const panel = await ModelDashboardPanel.createOrShow(vscode.Uri.parse('file:///ext'), provider, selected.uri);
            assert.deepStrictEqual(opened, [selected.uri.toString()]);
            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Complexity Breakdown'));
            assert.ok(!html.includes('update the LSP server'));
        } finally {
            vscode.workspace.openTextDocument = originalOpen;
            Object.assign(vscode.workspace, { textDocuments: originalDocuments });
        }
    });

    test('unparsed responses are not cached as dashboards with missing complexity', async () => {
        const provider = createMockLspProvider();
        const getModel = provider.getModel;
        provider.getModel = async () => ({ version: -1 });
        const panel = await ModelDashboardPanel.createOrShow(vscode.Uri.parse('file:///ext'),
            provider, vscode.Uri.parse('file:///pending.sysml'));
        const html = (panel as any)._panel.webview.html as string;
        assert.ok(html.includes('Model data is not available yet'));
        assert.ok(!html.includes('update the LSP server'));
        assert.strictEqual((panel as any)._lastDataKey, undefined);
        provider.getModel = getModel;
        await panel.refresh();
        assert.strictEqual((panel as any)._lastData.stats.totalElements, 5);
    });

    for (const failure of ['unavailable', 'error', 'cancelled']) {
        test(`preserves ${failure} state after a previously successful refresh`, async () => {
            const document = createFakeSysmlDocument('file:///previous.sysml');
            setActiveTextEditor({ document });
            const provider = createMockLspProvider();
            const getModel = provider.getModel;
            const panel = await ModelDashboardPanel.createOrShow(vscode.Uri.parse('file:///ext'), provider);
            assert.strictEqual((panel as any)._lastData.stats.totalElements, 5);
            document.version++;
            provider.getModel = async () => {
                if (failure === 'error') throw new Error('LSP unavailable');
                if (failure === 'cancelled') throw new vscode.CancellationError();
                return { version: -1 };
            };
            await panel.refresh();
            assert.strictEqual((panel as any)._lastData, undefined);
            assert.strictEqual((panel as any)._lastDataKey, undefined);
            const html = (panel as any)._panel.webview.html;
            assert.ok(html.includes(failure === 'unavailable' ? 'Model data is not available yet'
                : failure === 'cancelled' ? 'Dashboard loading cancelled' : 'LSP unavailable'));
            provider.getModel = getModel;
            await panel.refresh();
            assert.strictEqual((panel as any)._lastData.stats.totalElements, 5);
        });
    }

    test('package discovery reads unopened files without opening language-server documents', async () => {
        const originalReadFile = vscode.workspace.fs.readFile;
        const originalOpen = vscode.workspace.openTextDocument;
        let reads = 0;
        let opens = 0;
        try {
            vscode.workspace.fs.readFile = async () => {
                reads++;
                return new globalThis.TextEncoder().encode('package Camera {} package Shared {}');
            };
            vscode.workspace.openTextDocument = (async () => {
                opens++;
                throw new Error('Package discovery must not open documents');
            }) as typeof vscode.workspace.openTextDocument;
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), createMockLspProvider());
            const names = await (panel as any)._extractPackageNames(vscode.Uri.parse('file:///unopened.sysml'));
            assert.deepStrictEqual(names, ['Camera', 'Shared']);
            assert.strictEqual(reads, 1);
            assert.strictEqual(opens, 0);
        } finally {
            vscode.workspace.fs.readFile = originalReadFile;
            vscode.workspace.openTextDocument = originalOpen;
        }
    });

    test('package discovery uses unsaved open-document text without disk reads', async () => {
        const originalDocuments = vscode.workspace.textDocuments;
        const originalReadFile = vscode.workspace.fs.readFile;
        const document = createFakeSysmlDocument('file:///unsaved.sysml');
        document.getText = () => 'package Unsaved {}';
        try {
            Object.assign(vscode.workspace, { textDocuments: [document] });
            vscode.workspace.fs.readFile = async () => { throw new Error('Must use unsaved text'); };
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), createMockLspProvider());
            const names = await (panel as any)._extractPackageNames(document.uri);
            assert.deepStrictEqual(names, ['Unsaved']);
        } finally {
            Object.assign(vscode.workspace, { textDocuments: originalDocuments });
            vscode.workspace.fs.readFile = originalReadFile;
        }
    });

    suite('Singleton lifecycle', () => {

        test('createOrShow creates a new panel when none exists', async () => {
            const provider = createMockLspProvider();
            const extensionUri = vscode.Uri.parse('file:///ext');

            const panel = await ModelDashboardPanel.createOrShow(extensionUri, provider);
            assert.ok(panel, 'Should return a panel instance');
            assert.strictEqual(ModelDashboardPanel.currentPanel, panel, 'Should set static currentPanel');
        });

        test('createOrShow re-reveals existing panel (singleton)', async () => {
            const provider = createMockLspProvider();
            const extensionUri = vscode.Uri.parse('file:///ext');

            const first = await ModelDashboardPanel.createOrShow(extensionUri, provider);
            const second = await ModelDashboardPanel.createOrShow(extensionUri, provider);
            assert.strictEqual(first, second, 'Should return same instance on re-reveal');
        });

        test('dispose clears the singleton', async () => {
            const provider = createMockLspProvider();
            const extensionUri = vscode.Uri.parse('file:///ext');

            await ModelDashboardPanel.createOrShow(extensionUri, provider);
            assert.ok(ModelDashboardPanel.currentPanel, 'Panel should exist before dispose');

            ModelDashboardPanel.currentPanel?.dispose();
            assert.strictEqual(ModelDashboardPanel.currentPanel, undefined, 'Panel should be cleared after dispose');
        });
    });

    // ── Invocation paths ────────────────────────────────────────

    suite('Invocation: active text editor with SysML file', () => {

        test('renders dashboard content when activeTextEditor has a SysML file', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/vehicle.sysml');
            setActiveTextEditor({ document: doc });

            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            // The webview HTML should contain dashboard content (not the empty message)
            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Model Dashboard'), 'Should render dashboard heading');
            assert.ok(!html.includes('Open a SysML file to see the dashboard'), 'Should NOT show empty message');
        });
    });

    suite('Invocation: from visualizer (documentUri, no activeTextEditor)', () => {

        test('renders dashboard when documentUri is provided but no active editor', async () => {
            // No activeTextEditor — simulates opening from visualizer dropdown
            setActiveTextEditor(undefined);

            const fileUri = vscode.Uri.parse('file:///workspace/camera.sysml');
            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider, fileUri
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Model Dashboard'), 'Should render dashboard from documentUri');
            assert.ok(!html.includes('Open a SysML file to see the dashboard'), 'Should NOT show empty message');
        });

        test('uses documentUri filename in dashboard', async () => {
            setActiveTextEditor(undefined);

            const fileUri = vscode.Uri.parse('file:///workspace/camera.sysml');
            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider, fileUri
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('camera.sysml'), 'Should show filename from documentUri');
        });
    });

    suite('Invocation: no file at all', () => {

        test('shows empty state when no activeTextEditor and no documentUri', async () => {
            setActiveTextEditor(undefined);

            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Open a SysML file to see the dashboard'), 'Should show empty message');
        });

        test('shows empty state when activeTextEditor has a non-SysML file', async () => {
            setActiveTextEditor({
                document: {
                    uri: vscode.Uri.parse('file:///workspace/readme.md'),
                    languageId: 'markdown',
                    fileName: 'readme.md',
                },
            });

            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Open a SysML file to see the dashboard'), 'Should show empty for non-SysML file');
        });
    });

    suite('Invocation: no LSP provider', () => {

        test('shows error when lspModelProvider is undefined', async () => {
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), undefined
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(
                html.includes('Model Dashboard requires an LSP model provider'),
                'Should show LSP provider missing message'
            );
        });
    });

    suite('Invocation: LSP failure', () => {

        test('shows error when LSP request throws', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/broken.sysml');
            setActiveTextEditor({ document: doc });

            const provider = createMockLspProvider({ shouldThrow: true });
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(
                html.includes('Failed to fetch model data from LSP server'),
                'Should show LSP failure message'
            );
        });
    });

    // ── Re-reveal with updated documentUri ──────────────────────

    suite('Re-reveal updates documentUri', () => {

        test('re-reveal with new documentUri updates the stored URI', async () => {
            setActiveTextEditor(undefined);
            const provider = createMockLspProvider();
            const ext = vscode.Uri.parse('file:///ext');

            // First open with one URI
            const file1 = vscode.Uri.parse('file:///workspace/file1.sysml');
            await ModelDashboardPanel.createOrShow(ext, provider, file1);

            // Re-reveal with different URI
            const file2 = vscode.Uri.parse('file:///workspace/file2.sysml');
            await ModelDashboardPanel.createOrShow(ext, provider, file2);

            const html = (ModelDashboardPanel.currentPanel as any)._panel.webview.html as string;
            assert.ok(html.includes('file2.sysml'), 'Should use updated documentUri');
        });
    });

    // ── setLspModelProvider ─────────────────────────────────────

    suite('setLspModelProvider', () => {

        test('allows updating the LSP provider after creation', async () => {
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), undefined
            );

            // Initially no provider → error state
            let html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('requires an LSP model provider'));

            // Set a provider and refresh
            const doc = createFakeSysmlDocument('file:///workspace/test.sysml');
            setActiveTextEditor({ document: doc });
            panel.setLspModelProvider(createMockLspProvider());
            await panel.refresh();

            html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('Model Dashboard'), 'Should render after provider set');
        });
    });

    suite('Performance safeguards', () => {

        test('reuses cached dashboard data for same document version', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/cached.sysml');
            setActiveTextEditor({ document: doc });

            let calls = 0;
            const provider = {
                getModel: async (_uri: string, _scopes?: string[]) => {
                    calls++;
                    return {
                        version: 1,
                        elements: [],
                        relationships: [],
                        stats: {
                            totalElements: 5,
                            resolvedElements: 4,
                            unresolvedElements: 1,
                            parseTimeMs: 12,
                            modelBuildTimeMs: 8,
                        },
                        resolvedTypes: {
                            Vehicle: {
                                qualifiedName: 'pkg::Vehicle',
                                simpleName: 'Vehicle',
                                kind: 'PartDefinition',
                                isLibraryType: false,
                                specializationChain: [],
                                specializes: [],
                                features: [],
                            },
                        },
                    };
                },
            } as any;

            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );
            await panel.refresh();

            assert.strictEqual(calls, 1, 'Should not call LSP again for unchanged document version');
        });
    });

    // ── Dashboard content validation ────────────────────────────

    suite('Dashboard content', () => {

        test('renders stats cards', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/vehicle.sysml');
            setActiveTextEditor({ document: doc });

            const provider = createMockLspProvider({
                stats: { totalElements: 42, resolvedElements: 38, unresolvedElements: 4, parseTimeMs: 15, modelBuildTimeMs: 10 },
            });
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('42'), 'Should display total elements');
        });

        test('renders resolved type breakdown', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/vehicle.sysml');
            setActiveTextEditor({ document: doc });

            const provider = createMockLspProvider({
                resolvedTypes: {
                    'Engine': {
                        qualifiedName: 'pkg::Engine',
                        simpleName: 'Engine',
                        kind: 'PartDefinition',
                        isLibraryType: false,
                        specializationChain: [],
                        specializes: [],
                        features: [
                            { name: 'power', kind: 'AttributeUsage', isDerived: false, isReadonly: false },
                        ],
                    },
                },
            });
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('PartDefinition'), 'Should display resolved type kind in breakdown');
        });

        test('shows issue navigation link when diagnostics exist', async () => {
            const doc = createFakeSysmlDocument('file:///workspace/warn.sysml');
            setActiveTextEditor({ document: doc });

            (vscode.languages as any).getDiagnostics = () => [
                {
                    severity: vscode.DiagnosticSeverity.Warning,
                    range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 1)),
                    message: 'Test warning',
                    source: 'sysml',
                },
            ];

            const provider = createMockLspProvider();
            const panel = await ModelDashboardPanel.createOrShow(
                vscode.Uri.parse('file:///ext'), provider
            );

            const html = (panel as any)._panel.webview.html as string;
            assert.ok(html.includes('command:sysml.openProblemForUri?'), 'Should render problem navigation command link');
            assert.ok(html.includes('Go to issue'), 'Should render issue navigation label');
        });
    });
});
