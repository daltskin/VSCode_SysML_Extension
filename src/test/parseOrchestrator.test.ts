/**
 * ParseOrchestrator tests.
 *
 * These exercise the debounce, cancellation, cooldown, and guard
 * logic that sits between VS Code editor events and the Model
 * Explorer / Visualization panel updates — the "editor side" of
 * the parse lifecycle.
 *
 * Scenarios:
 *   E. requestParse debounce & cancellation
 *      1. Debounce — single call triggers one parse after delay
 *      2. Rapid calls — only last document wins
 *      3. Second requestParse cancels in-flight first
 *      4. Closed document skipped at debounce fire
 *      5. Progress shown/hidden correctly
 *      6. skipProgress option suppresses progress
 *      7. Model explorer error is non-critical — continues to metrics + viz
 *      8. Cancellation after model explorer skips feature inspector + viz
 *
 *   F. notifyServerParseDone guards
 *      1. No visible editors — no-op
 *      2. Matching URI editor found
 *      3. Fallback to active editor when URI has no match
 *      4. Skip when debounce pending
 *      5. Skip when parse in-flight
 *      6. Skip when explorer has elements
 *      7. Cooldown suppresses rapid-fire
 *      8. After cooldown expires, re-parse fires
 *
 *   G. cancelAll
 *      1. Cancels pending debounce
 *      2. Cancels in-flight parse
 *      3. Clears parseDone timer
 *
 *   H. Integration: requestParse → notifyServerParseDone flow
 *      1. Cold start: parse returns 0 → server done → re-parse → real data
 *      2. Hot start: parse returns data → server done → skipped
 *      3. Edit during parse → new parse replaces old
 *      4. File switch during parse → old cancelled, new starts
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { EditorProvider, ParseOrchestrator, ParseOrchestratorCallbacks, SysMLEditorInfo } from '../parseOrchestrator';

// ── Helpers ──────────────────────────────────────────────────────

/** Promise that can be resolved externally. */
function deferred<T = void>() {
    let resolve!: (v: T) => void;
    let reject!: (e: any) => void;
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

/** Fake document that can be closed. */
function fakeDoc(uri: string, opts?: { closed?: boolean }) {
    let _closed = opts?.closed ?? false;
    return {
        uri: vscode.Uri.parse(uri),
        languageId: 'sysml',
        fileName: uri.split('/').pop() ?? 'test.sysml',
        get isClosed() { return _closed; },
        close() { _closed = true; },
        getText: () => 'package Pkg {}',
    } as any as vscode.TextDocument & { close(): void };
}

/** Tracking spy for callbacks. */
function createSpyCallbacks(overrides?: Partial<ParseOrchestratorCallbacks>): ParseOrchestratorCallbacks & {
    readonly logs: string[];
    readonly progressShown: string[];
    readonly progressHidden: number;
    readonly metricsUpdated: number;
    readonly vizNotified: string[];
    readonly explorerLoads: Array<{ uri: string; cancelled: boolean }>;
    readonly resolvedTypesPushed: number;
    /** Gate for loadModelExplorer — if set, blocks until opened */
    useExplorerGate(): { open: () => void };
    /** Make next loadModelExplorer throw */
    failNextExplorer(err: Error): void;
    /** Set stats returned by getLastStats */
    setStats(stats: { totalElements: number } | undefined): void;
} {
    const logs: string[] = [];
    const progressShown: string[] = [];
    let progressHiddenCount = 0;
    let metricsUpdatedCount = 0;
    const vizNotified: string[] = [];
    const explorerLoads: Array<{ uri: string; cancelled: boolean }> = [];
    let resolvedTypesPushedCount = 0;
    let _gate: { promise: Promise<void>; open: () => void } | undefined;
    let _failNext: Error | undefined;
    let _stats: { totalElements: number } | undefined;

    const cb: any = {
        get logs() { return logs; },
        get progressShown() { return progressShown; },
        get progressHidden() { return progressHiddenCount; },
        get metricsUpdated() { return metricsUpdatedCount; },
        get vizNotified() { return vizNotified; },
        get explorerLoads() { return explorerLoads; },
        get resolvedTypesPushed() { return resolvedTypesPushedCount; },

        useExplorerGate() {
            const d = deferred();
            _gate = { promise: d.promise, open: d.resolve };
            return _gate;
        },

        failNextExplorer(err: Error) { _failNext = err; },

        setStats(stats: { totalElements: number } | undefined) { _stats = stats; },

        showProgress(fileName: string) { progressShown.push(fileName); },
        hideProgress() { progressHiddenCount++; },

        async loadModelExplorer(doc: vscode.TextDocument, token: vscode.CancellationToken) {
            if (_failNext) {
                const e = _failNext;
                _failNext = undefined;
                throw e;
            }
            if (_gate) {
                const g = _gate;
                _gate = undefined;
                await g.promise;
            }
            explorerLoads.push({ uri: doc.uri.toString(), cancelled: token.isCancellationRequested });
        },
        async revealInWorkspaceExplorer() { /* no-op */ },
        isWorkspaceMode: overrides?.isWorkspaceMode ?? (() => false),
        getLastStats: () => _stats,

        updateMetrics() { metricsUpdatedCount++; },
        async updateServerStats() { /* no-op */ },
        async pushResolvedTypes() { resolvedTypesPushedCount++; },
        notifyVisualization(uri: vscode.Uri) { vizNotified.push(uri.toString()); },
        log(msg: string) { logs.push(msg); },

        ...overrides,
    };
    return cb;
}

/** Static editor provider for tests. */
function staticEditors(editors: SysMLEditorInfo[], active?: SysMLEditorInfo): EditorProvider {
    return {
        getVisibleSysMLEditors: () => editors,
        getActiveSysMLEditor: () => active,
    };
}

/** No visible editors. */
const noEditors: EditorProvider = staticEditors([]);

/** Wait for setTimeout(0) chains to flush. */
function flush(ms = 0): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}

// ── E. requestParse debounce & cancellation ──────────────────────

suite('ParseOrchestrator — requestParse', () => {

    test('E1: single call triggers one parse after debounce', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 20;

        const doc = fakeDoc('file:///test.sysml');
        orch.requestParse(doc);

        // Immediately: progress shown, but no explorer load yet
        assert.strictEqual(cb.progressShown.length, 1);
        assert.strictEqual(cb.explorerLoads.length, 0);

        await flush(50);

        assert.strictEqual(cb.explorerLoads.length, 1);
        assert.strictEqual(cb.explorerLoads[0].uri, 'file:///test.sysml');
        assert.ok(cb.progressHidden >= 1, 'Progress should be hidden after parse');
    });

    test('E2: rapid calls — only last document parsed', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 20;

        orch.requestParse(fakeDoc('file:///a.sysml'));
        orch.requestParse(fakeDoc('file:///b.sysml'));
        orch.requestParse(fakeDoc('file:///c.sysml'));

        await flush(50);

        // Only the last document should have been loaded
        assert.strictEqual(cb.explorerLoads.length, 1);
        assert.ok(cb.explorerLoads[0].uri.includes('c.sysml'),
            'Only the final document should be parsed');
    });

    test('E3: second requestParse cancels in-flight first', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        const doc1 = fakeDoc('file:///first.sysml');
        orch.requestParse(doc1);

        await flush(15); // Let debounce fire, now blocked on gate

        // Second request while first is in-flight
        const doc2 = fakeDoc('file:///second.sysml');
        orch.requestParse(doc2);

        // Release the gate for the first (already cancelled)
        gate.open();
        await flush(30);

        // Should have loaded the second document
        const lastLoad = cb.explorerLoads[cb.explorerLoads.length - 1];
        assert.ok(lastLoad.uri.includes('second.sysml'));
    });

    test('E4: closed document skipped when debounce fires', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 20;

        const doc = fakeDoc('file:///closing.sysml');
        orch.requestParse(doc);

        // Close before debounce fires
        doc.close();
        await flush(50);

        assert.strictEqual(cb.explorerLoads.length, 0,
            'Closed document should not trigger explorer load');
    });

    test('E5: progress shown on requestParse, hidden after completion', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        orch.requestParse(fakeDoc('file:///test.sysml'));
        assert.deepStrictEqual(cb.progressShown, ['test.sysml']);

        await flush(30);
        assert.ok(cb.progressHidden >= 1);
    });

    test('E6: skipProgress suppresses progress indicator', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        orch.requestParse(fakeDoc('file:///test.sysml'), { skipProgress: true });
        assert.strictEqual(cb.progressShown.length, 0,
            'Progress should not be shown with skipProgress');

        await flush(30);
    });

    test('E7: model explorer error is non-critical — metrics + viz still run', async () => {
        const cb = createSpyCallbacks();
        cb.failNextExplorer(new Error('Explorer crashed'));
        cb.setStats({ totalElements: 5 }); // pretend stats survived
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        orch.requestParse(fakeDoc('file:///test.sysml'));
        await flush(30);

        // Explorer load threw, but metrics should still update
        assert.strictEqual(cb.metricsUpdated, 1,
            'Metrics should update even when explorer throws');
    });

    test('E8: cancellation after model explorer skips feature inspector + viz', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        const doc = fakeDoc('file:///test.sysml');
        orch.requestParse(doc);

        await flush(15); // Debounce fires, now blocked on gate

        // Second request cancels the first
        orch.requestParse(fakeDoc('file:///other.sysml'));
        gate.open();
        await flush(30);

        // The first parse was cancelled mid-flight.
        // Check that viz notification is for the second document.
        const vizForFirst = cb.vizNotified.filter(u => u.includes('test.sysml'));
        assert.strictEqual(vizForFirst.length, 0,
            'Cancelled parse should not notify visualization');
    });

    test('E9: isDebouncing and isParsing reflect state correctly', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 20;

        assert.strictEqual(orch.isDebouncing, false);
        assert.strictEqual(orch.isParsing, false);

        orch.requestParse(fakeDoc('file:///test.sysml'));

        // During debounce wait
        assert.strictEqual(orch.isDebouncing, true);
        assert.strictEqual(orch.isParsing, true); // cancelSource created

        await flush(30); // Debounce fires, now blocked on gate

        // Debounce timer cleared, but parse in-flight
        assert.strictEqual(orch.isDebouncing, false);

        gate.open();
        await flush(10);

        assert.strictEqual(orch.isParsing, false);
    });

    test('E10: workspace mode calls revealInWorkspaceExplorer instead of loadDocument', async () => {
        let revealCalled = false;
        const cb = createSpyCallbacks({
            isWorkspaceMode: () => true,
            revealInWorkspaceExplorer: async () => { revealCalled = true; },
        });
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        orch.requestParse(fakeDoc('file:///ws/test.sysml'));
        await flush(30);

        assert.ok(revealCalled, 'Should call revealInWorkspaceExplorer in workspace mode');
        assert.strictEqual(cb.explorerLoads.length, 0,
            'Should not call loadModelExplorer in workspace mode');
    });
});

// ── F. notifyServerParseDone guards ──────────────────────────────

suite('ParseOrchestrator — notifyServerParseDone', () => {

    test('F1: no visible editors — no-op', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.parseDoneDebounceMs = 5;

        orch.notifyServerParseDone('file:///test.sysml');
        await flush(30);

        assert.strictEqual(cb.explorerLoads.length, 0);
        assert.strictEqual(cb.logs.filter(l => l.includes('re-parsing')).length, 0);
    });

    test('F2: matching URI editor found and re-parsed', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///match.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 5;
        orch.debounceMs = 5;

        orch.notifyServerParseDone(doc.uri.toString());
        await flush(50);

        assert.ok(cb.logs.some(l => l.includes('re-parsing match.sysml')));
        assert.strictEqual(cb.explorerLoads.length, 1);
    });

    test('F3: fallback to active editor when URI has no match', async () => {
        const cb = createSpyCallbacks();
        const active = fakeDoc('file:///active.sysml');
        const editors = staticEditors(
            [{ uri: active.uri.toString(), document: active }],
            { uri: active.uri.toString(), document: active },
        );
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 5;
        orch.debounceMs = 5;

        orch.notifyServerParseDone('file:///nonexistent.sysml');
        await flush(50);

        assert.ok(cb.logs.some(l => l.includes('re-parsing active.sysml')));
    });

    test('F4: skip when debounce pending', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 500; // Long debounce so it's still pending
        orch.parseDoneDebounceMs = 5;

        // Start a parse (debounce will be pending for 500ms)
        orch.requestParse(doc);

        // Now server says it's done
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        assert.ok(cb.logs.some(l => l.includes('skipping — parse already in progress')));
    });

    test('F5: skip when parse in-flight', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 5;
        orch.parseDoneDebounceMs = 5;

        // Start parse, let debounce fire, block on gate (in-flight)
        orch.requestParse(doc);
        await flush(15);

        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        gate.open();
        await flush(30);

        assert.ok(cb.logs.some(l => l.includes('skipping — parse already in progress')));
    });

    test('F6: skip when explorer already has elements', async () => {
        const cb = createSpyCallbacks();
        cb.setStats({ totalElements: 10 });
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 5;

        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        assert.ok(cb.logs.some(l => l.includes('skipping re-parse — explorer already has 10 elements')));
        assert.strictEqual(cb.explorerLoads.length, 0);
    });

    test('F7: cooldown suppresses rapid-fire', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 5;
        orch.debounceMs = 5;
        orch.parseDoneCooldownMs = 200;

        // First notification — should fire
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(50);
        assert.ok(cb.logs.some(l => l.includes('re-parsing')));

        // Wait for the requestParse debounce to complete so isDebouncing/isParsing clear
        await flush(50);

        // Second notification within cooldown — should be suppressed
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);
        assert.ok(cb.logs.some(l => l.includes('cooldown')));
    });

    test('F8: after cooldown expires, re-parse fires again', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 5;
        orch.debounceMs = 5;
        orch.parseDoneCooldownMs = 50;

        orch.notifyServerParseDone(doc.uri.toString());
        await flush(40);

        // Wait for cooldown to expire
        await flush(60);

        const logsBefore = cb.logs.filter(l => l.includes('re-parsing')).length;
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(40);

        const logsAfter = cb.logs.filter(l => l.includes('re-parsing')).length;
        assert.ok(logsAfter > logsBefore, 'Should re-parse after cooldown expires');
    });

    test('F9: parseDone debounce coalesces rapid notifications', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 30;
        orch.debounceMs = 5;

        // Fire 5 notifications in quick succession
        for (let i = 0; i < 5; i++) {
            orch.notifyServerParseDone(doc.uri.toString());
        }
        await flush(80);

        const reparses = cb.logs.filter(l => l.includes('re-parsing'));
        assert.strictEqual(reparses.length, 1,
            'Rapid notifications should coalesce into one re-parse');
    });
});

// ── G. cancelAll ─────────────────────────────────────────────────

suite('ParseOrchestrator — cancelAll', () => {

    test('G1: cancels pending debounce', async () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 500;

        orch.requestParse(fakeDoc('file:///test.sysml'));
        assert.ok(orch.isDebouncing);

        orch.cancelAll();
        assert.ok(!orch.isDebouncing, 'Debounce should be cleared');

        await flush(600);
        assert.strictEqual(cb.explorerLoads.length, 0,
            'No explorer load should have fired');
    });

    test('G2: cancels in-flight parse', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        orch.requestParse(fakeDoc('file:///test.sysml'));
        await flush(15); // Let debounce fire

        assert.ok(orch.isParsing);
        orch.cancelAll();
        assert.ok(!orch.isParsing, 'Active parse should be cancelled');

        gate.open();
        await flush(30);

        // Should not have reached viz notification
        assert.strictEqual(cb.vizNotified.length, 0);
    });

    test('G3: clearsParseDone timer', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 500;

        orch.notifyServerParseDone(doc.uri.toString());
        orch.cancelAll();

        await flush(600);
        assert.strictEqual(cb.explorerLoads.length, 0,
            'ParseDone should not fire after cancelAll');
    });

    test('G4: cancelAll hides progress', () => {
        const cb = createSpyCallbacks();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 500;

        orch.requestParse(fakeDoc('file:///test.sysml'));
        const hiddenBefore = cb.progressHidden;

        orch.cancelAll();
        assert.ok(cb.progressHidden > hiddenBefore,
            'cancelAll should hide progress');
    });
});

// ── H. Integration: full parse → serverDone flow ─────────────────

suite('ParseOrchestrator — Integration flows', () => {

    test('H1: cold start: parse returns 0 → server done → re-parse fires', async () => {
        const cb = createSpyCallbacks();
        // Simulate cold start: no stats initially
        cb.setStats(undefined);

        const doc = fakeDoc('file:///cold.sysml');
        const editors = staticEditors(
            [{ uri: doc.uri.toString(), document: doc }],
            { uri: doc.uri.toString(), document: doc },
        );
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 5;
        orch.parseDoneDebounceMs = 5;
        orch.parseDoneCooldownMs = 100;

        // Initial parse
        orch.requestParse(doc);
        await flush(30);

        const loadsBefore = cb.explorerLoads.length;

        // Server signals done
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(50);

        assert.ok(cb.explorerLoads.length > loadsBefore,
            'Server done should trigger re-parse when stats are empty');
        assert.ok(cb.logs.some(l => l.includes('re-parsing')));
    });

    test('H2: hot start: parse returns data → server done → skipped', async () => {
        const cb = createSpyCallbacks();
        cb.setStats({ totalElements: 5 });

        const doc = fakeDoc('file:///hot.sysml');
        const editors = staticEditors(
            [{ uri: doc.uri.toString(), document: doc }],
            { uri: doc.uri.toString(), document: doc },
        );
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 5;
        orch.parseDoneDebounceMs = 5;

        orch.requestParse(doc);
        await flush(30);

        const loadsBefore = cb.explorerLoads.length;

        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        assert.strictEqual(cb.explorerLoads.length, loadsBefore,
            'Should not re-parse when explorer already has data');
        assert.ok(cb.logs.some(l => l.includes('skipping re-parse')));
    });

    test('H3: edit during parse → new parse replaces old', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        const doc = fakeDoc('file:///editing.sysml');
        // First "keystroke"
        orch.requestParse(doc);
        await flush(15); // Let debounce fire, block on gate

        // Second "keystroke" — cancels first
        const doc2 = fakeDoc('file:///editing.sysml');
        orch.requestParse(doc2);

        gate.open();
        await flush(30);

        // The second parse should have won
        const lastLoad = cb.explorerLoads[cb.explorerLoads.length - 1];
        assert.ok(lastLoad, 'Should have at least one load');
    });

    test('H4: file switch during parse → old cancelled, new starts', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const orch = new ParseOrchestrator(cb, noEditors);
        orch.debounceMs = 5;

        // Open file A
        orch.requestParse(fakeDoc('file:///a.sysml'));
        await flush(15); // In-flight on gate

        // Switch to file B — cancels A
        orch.requestParse(fakeDoc('file:///b.sysml'));
        gate.open();
        await flush(30);

        // File B's parse should have completed
        const lastLoad = cb.explorerLoads[cb.explorerLoads.length - 1];
        assert.ok(lastLoad.uri.includes('b.sysml'),
            'Switched file should be the one that completes');
    });

    test('H5: notifyServerParseDone during active parse is skipped', async () => {
        const cb = createSpyCallbacks();
        const gate = cb.useExplorerGate();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 5;
        orch.parseDoneDebounceMs = 5;

        // Start parse, block on gate
        orch.requestParse(doc);
        await flush(15);

        // Server done while parse in-flight
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        assert.ok(cb.logs.some(l => l.includes('skipping — parse already in progress')),
            'Should skip re-parse when existing parse is in-flight');

        gate.open();
        await flush(30);
    });

    test('H6: multiple serverDone within cooldown — only first triggers re-parse', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.debounceMs = 5;
        orch.parseDoneDebounceMs = 5;
        orch.parseDoneCooldownMs = 500;

        // First serverDone
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(50);

        // Wait for parse to complete
        await flush(30);

        // Second serverDone within cooldown
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        // Third serverDone within cooldown
        orch.notifyServerParseDone(doc.uri.toString());
        await flush(30);

        const reparses = cb.logs.filter(l => l.includes('re-parsing'));
        assert.strictEqual(reparses.length, 1,
            'Only first serverDone should trigger re-parse within cooldown');

        const cooldowns = cb.logs.filter(l => l.includes('cooldown'));
        assert.ok(cooldowns.length >= 1, 'Subsequent should be suppressed by cooldown');
    });

    test('H7: cancelAll during serverDone debounce prevents re-parse', async () => {
        const cb = createSpyCallbacks();
        const doc = fakeDoc('file:///test.sysml');
        const editors = staticEditors([{ uri: doc.uri.toString(), document: doc }]);
        const orch = new ParseOrchestrator(cb, editors);
        orch.parseDoneDebounceMs = 100;

        orch.notifyServerParseDone(doc.uri.toString());
        // Cancel before the 100ms debounce fires
        orch.cancelAll();
        await flush(150);

        assert.strictEqual(cb.explorerLoads.length, 0,
            'cancelAll should prevent the serverDone re-parse');
    });
});
