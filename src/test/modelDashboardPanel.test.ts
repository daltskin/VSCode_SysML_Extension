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

    teardown(() => {
        disposeDashboard();
        // Restore activeTextEditor to undefined
        setActiveTextEditor(undefined);
        (vscode.languages as any).getDiagnostics = originalGetDiagnostics;
    });

    // ── Singleton lifecycle ──────────────────────────────────────

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
