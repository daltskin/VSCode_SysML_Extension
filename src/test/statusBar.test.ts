/**
 * Unit tests for src/statusBar.ts
 *
 * Covers:
 * 1. updateModelMetrics — text, icon, tooltip, background colour
 * 2. showMetricsLoading — with TextDocument, string label, and no args
 * 3. hideModelMetrics — hides the status bar item
 * 4. showParseProgress / hideParseProgress — parse indicator lifecycle
 * 5. Deduplication — same metrics key skips update
 * 6. Workspace metrics without a URI (no SysML file open)
 * 7. Complexity badge in status bar text
 * 8. Diagnostic-driven icon changes (error / warning / check)
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import {
    _resetForTesting,
    clearMetricsKey,
    deleteCachedMetrics,
    getCachedMetrics,
    getLastMetricsArgs,
    hideModelMetrics,
    hideParseProgress,
    setServerStats,
    showMetricsLoading,
    showParseProgress,
    updateModelMetrics,
} from '../statusBar';

// ── Helpers ──────────────────────────────────────────────────────

function makeStats(overrides: Partial<{
    totalElements: number;
    resolvedElements: number;
    unresolvedElements: number;
    parseTimeMs: number;
    modelBuildTimeMs: number;
    complexity: any;
}> = {}) {
    return {
        totalElements: overrides.totalElements ?? 10,
        resolvedElements: overrides.resolvedElements ?? 7,
        unresolvedElements: overrides.unresolvedElements ?? 3,
        parseTimeMs: overrides.parseTimeMs ?? 42,
        modelBuildTimeMs: overrides.modelBuildTimeMs ?? 5,
        ...(overrides.complexity !== undefined ? { complexity: overrides.complexity } : {}),
    };
}

/**
 * Access the mock status bar item created internally by statusBar.ts.
 * After calling updateModelMetrics / showMetricsLoading, the item
 * lives on vscode.window — we call createStatusBarItem and capture
 * the returned mock.  Since statusBar.ts creates the item lazily,
 * calling updateModelMetrics once will trigger the creation.  We
 * then read the item's properties via the public API getters that
 * statusBar.ts exposes (text, tooltip, etc.).
 *
 * For a simpler approach, we spy on window.createStatusBarItem to
 * capture the mock item reference.
 */
let capturedItems: any[] = [];
const originalCreate = (vscode.window as any).createStatusBarItem;

function installSpy() {
    capturedItems = [];
    (vscode.window as any).createStatusBarItem = (...args: any[]) => {
        const item = originalCreate(...args);
        capturedItems.push(item);
        return item;
    };
}

function restoreSpy() {
    (vscode.window as any).createStatusBarItem = originalCreate;
}

/** Return the most recently created mock status bar item. */
function lastItem(): any {
    return capturedItems[capturedItems.length - 1];
}

// ── Test Suite ───────────────────────────────────────────────────

suite('StatusBar', () => {
    setup(() => {
        _resetForTesting();
        installSpy();
    });

    teardown(() => {
        _resetForTesting();
        restoreSpy();
    });

    // ── updateModelMetrics ──────────────────────────────────────

    test('shows element count and parse time', () => {
        updateModelMetrics(makeStats({ totalElements: 25, parseTimeMs: 100 }));
        const item = lastItem();
        assert.ok(item, 'status bar item should be created');
        assert.ok(item.text.includes('25 elements'), `text should contain element count, got: ${item.text}`);
        assert.ok(item.text.includes('100ms'), `text should contain parse time, got: ${item.text}`);
        assert.strictEqual(item._visible, true, 'item should be visible');
    });

    test('shows check icon when no diagnostics', () => {
        updateModelMetrics(makeStats());
        const item = lastItem();
        assert.ok(item.text.startsWith('$(check)'), `should start with check icon, got: ${item.text}`);
    });

    test('shows error icon when file has errors', () => {
        const uri = vscode.Uri.parse('file:///test.sysml');
        // Override getDiagnostics to return errors
        const origGetDiag = (vscode.languages as any).getDiagnostics;
        (vscode.languages as any).getDiagnostics = (_u: any) => [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'err', vscode.DiagnosticSeverity.Error),
        ];
        try {
            updateModelMetrics(makeStats(), uri);
            const item = lastItem();
            assert.ok(item.text.startsWith('$(error)'), `should start with error icon, got: ${item.text}`);
            assert.ok(item.text.includes('$(alert) 1'), `should include alert count, got: ${item.text}`);
        } finally {
            (vscode.languages as any).getDiagnostics = origGetDiag;
        }
    });

    test('shows warning icon when file has only warnings', () => {
        const uri = vscode.Uri.parse('file:///test.sysml');
        const origGetDiag = (vscode.languages as any).getDiagnostics;
        (vscode.languages as any).getDiagnostics = (_u: any) => [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'warn', vscode.DiagnosticSeverity.Warning),
        ];
        try {
            updateModelMetrics(makeStats(), uri);
            const item = lastItem();
            assert.ok(item.text.startsWith('$(warning)'), `should start with warning icon, got: ${item.text}`);
        } finally {
            (vscode.languages as any).getDiagnostics = origGetDiag;
        }
    });

    test('error background when errors present', () => {
        const uri = vscode.Uri.parse('file:///test.sysml');
        const origGetDiag = (vscode.languages as any).getDiagnostics;
        (vscode.languages as any).getDiagnostics = (_u: any) => [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'err', vscode.DiagnosticSeverity.Error),
        ];
        try {
            updateModelMetrics(makeStats(), uri);
            const item = lastItem();
            assert.ok(item.backgroundColor, 'should have background colour');
            assert.strictEqual(item.backgroundColor.id, 'statusBarItem.errorBackground');
        } finally {
            (vscode.languages as any).getDiagnostics = origGetDiag;
        }
    });

    test('warning background when only warnings present', () => {
        const uri = vscode.Uri.parse('file:///test.sysml');
        const origGetDiag = (vscode.languages as any).getDiagnostics;
        (vscode.languages as any).getDiagnostics = (_u: any) => [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'warn', vscode.DiagnosticSeverity.Warning),
        ];
        try {
            updateModelMetrics(makeStats(), uri);
            const item = lastItem();
            assert.ok(item.backgroundColor, 'should have background colour');
            assert.strictEqual(item.backgroundColor.id, 'statusBarItem.warningBackground');
        } finally {
            (vscode.languages as any).getDiagnostics = origGetDiag;
        }
    });

    test('no background when no diagnostics', () => {
        updateModelMetrics(makeStats());
        const item = lastItem();
        assert.strictEqual(item.backgroundColor, undefined, 'should have no background');
    });

    test('includes complexity badge when complexity present', () => {
        const stats = makeStats({
            complexity: {
                complexityIndex: 42,
                rating: 'Medium',
                definitions: 5,
                usages: 8,
                maxDepth: 3,
                avgChildrenPerDef: 2,
                couplingCount: 4,
                unusedDefinitions: 1,
                documentationCoverage: 50,
                hotspots: [],
            },
        });
        updateModelMetrics(stats);
        const item = lastItem();
        assert.ok(item.text.includes('MCI 42'), `should contain complexity index, got: ${item.text}`);
    });

    test('tooltip includes file name when URI provided', () => {
        const uri = vscode.Uri.parse('file:///workspace/vehicle.sysml');
        updateModelMetrics(makeStats(), uri);
        const item = lastItem();
        assert.ok(typeof item.tooltip === 'string');
        assert.ok(item.tooltip.includes('vehicle.sysml'), `tooltip should contain file name, got: ${item.tooltip}`);
    });

    test('tooltip works without URI (workspace-level)', () => {
        updateModelMetrics(makeStats());
        const item = lastItem();
        assert.ok(typeof item.tooltip === 'string');
        assert.ok(item.tooltip.includes('Elements'), 'tooltip should contain element section');
    });

    test('tooltip includes LSP health when server stats set', () => {
        setServerStats({
            uptime: 125,
            memory: { heapUsed: 50, heapTotal: 100, rss: 120 },
            caches: { documents: 3, symbolTables: 3, semanticTokens: 2 },
        });
        updateModelMetrics(makeStats());
        const item = lastItem();
        assert.ok(typeof item.tooltip === 'string');
        assert.ok(item.tooltip.includes('LSP Health'), `tooltip should contain LSP Health, got: ${item.tooltip}`);
        assert.ok(item.tooltip.includes('2m 5s'), `tooltip should contain formatted uptime, got: ${item.tooltip}`);
    });

    test('deduplication: same stats skip update', () => {
        const stats = makeStats();
        updateModelMetrics(stats);
        const item = lastItem();
        item.text = 'MODIFIED'; // Mutate to detect if update runs again
        updateModelMetrics(stats);
        assert.strictEqual(item.text, 'MODIFIED', 'should not have overwritten text (deduplication)');
    });

    test('clearMetricsKey forces re-evaluation', () => {
        const stats = makeStats();
        updateModelMetrics(stats);
        const item = lastItem();
        item.text = 'MODIFIED';
        clearMetricsKey();
        updateModelMetrics(stats);
        assert.notStrictEqual(item.text, 'MODIFIED', 'should have updated after clearing key');
    });

    test('caches metrics per URI', () => {
        const uri = vscode.Uri.parse('file:///workspace/test.sysml');
        const stats = makeStats({ totalElements: 99 });
        updateModelMetrics(stats, uri);
        const cached = getCachedMetrics(uri.toString());
        assert.ok(cached, 'should have cached metrics');
        assert.strictEqual(cached!.totalElements, 99);
    });

    test('deleteCachedMetrics removes entry', () => {
        const uri = vscode.Uri.parse('file:///workspace/test.sysml');
        updateModelMetrics(makeStats(), uri);
        deleteCachedMetrics(uri.toString());
        assert.strictEqual(getCachedMetrics(uri.toString()), undefined);
    });

    test('getLastMetricsArgs returns latest call args', () => {
        const uri = vscode.Uri.parse('file:///workspace/test.sysml');
        const stats = makeStats({ totalElements: 55 });
        updateModelMetrics(stats, uri);
        const args = getLastMetricsArgs();
        assert.ok(args);
        assert.strictEqual(args!.stats.totalElements, 55);
        assert.strictEqual(args!.uri?.toString(), uri.toString());
    });

    // ── hideModelMetrics ────────────────────────────────────────

    test('hides the status bar item', () => {
        updateModelMetrics(makeStats());
        const item = lastItem();
        assert.strictEqual(item._visible, true);
        hideModelMetrics();
        assert.strictEqual(item._visible, false);
    });

    // ── showMetricsLoading ──────────────────────────────────────

    test('shows loading with string label', () => {
        showMetricsLoading('5 workspace files');
        const item = lastItem();
        assert.ok(item.text.includes('Loading'), `text should contain Loading, got: ${item.text}`);
        assert.ok(item.tooltip.includes('5 workspace files'), `tooltip should contain label, got: ${item.tooltip}`);
        assert.strictEqual(item._visible, true);
    });

    test('shows loading with no args (defaults to workspace)', () => {
        showMetricsLoading();
        const item = lastItem();
        assert.ok(item.tooltip.includes('workspace'), `tooltip should default to workspace, got: ${item.tooltip}`);
    });

    test('shows loading with TextDocument-like object', () => {
        const doc = { fileName: '/home/user/project/vehicle.sysml' } as any;
        showMetricsLoading(doc);
        const item = lastItem();
        assert.ok(item.tooltip.includes('vehicle.sysml'), `tooltip should contain file name, got: ${item.tooltip}`);
    });

    test('clears background colour on loading', () => {
        const uri = vscode.Uri.parse('file:///test.sysml');
        const origGetDiag = (vscode.languages as any).getDiagnostics;
        (vscode.languages as any).getDiagnostics = (_u: any) => [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'err', vscode.DiagnosticSeverity.Error),
        ];
        try {
            updateModelMetrics(makeStats(), uri);
            const item = lastItem();
            assert.ok(item.backgroundColor, 'should have error background');
            showMetricsLoading('reloading');
            assert.strictEqual(item.backgroundColor, undefined, 'loading should clear background');
        } finally {
            (vscode.languages as any).getDiagnostics = origGetDiag;
        }
    });

    // ── showParseProgress / hideParseProgress ───────────────────

    test('showParseProgress creates and shows item', () => {
        showParseProgress('test.sysml');
        // Parse progress item is the second item created (after metrics if any)
        const items = capturedItems.filter(i => i.name === 'SysML Parse Progress');
        assert.strictEqual(items.length, 1, 'should create one parse progress item');
        assert.strictEqual(items[0]._visible, true);
        assert.ok(items[0].text.includes('test.sysml'), `text should contain label, got: ${items[0].text}`);
    });

    test('hideParseProgress hides item', () => {
        showParseProgress('test.sysml');
        const items = capturedItems.filter(i => i.name === 'SysML Parse Progress');
        assert.strictEqual(items[0]._visible, true);
        hideParseProgress();
        assert.strictEqual(items[0]._visible, false);
    });

    // ── Integration scenarios ───────────────────────────────────

    test('workspace-only: metrics with no URI', () => {
        // Simulates opening a workspace with no SysML file focused
        updateModelMetrics(makeStats({ totalElements: 50 }));
        const item = lastItem();
        assert.ok(item.text.includes('50 elements'), 'should show workspace element count');
        assert.strictEqual(item._visible, true, 'should be visible even without URI');
    });

    test('status bar item reused across calls', () => {
        updateModelMetrics(makeStats({ totalElements: 1 }));
        const firstItem = lastItem();
        clearMetricsKey();
        updateModelMetrics(makeStats({ totalElements: 2 }));
        // No new item should be created — same one is reused
        assert.strictEqual(capturedItems.filter(i => i.name === 'SysML Model Metrics').length, 1);
        assert.ok(firstItem.text.includes('2 elements'), 'should update in place');
    });

    test('loading then update transitions correctly', () => {
        showMetricsLoading('3 workspace files');
        const item = lastItem();
        assert.ok(item.text.includes('Loading'));
        updateModelMetrics(makeStats({ totalElements: 30, parseTimeMs: 200 }));
        // Same item is reused
        assert.ok(item.text.includes('30 elements'));
        assert.ok(item.text.includes('200ms'));
        assert.strictEqual(item._visible, true);
    });
});
