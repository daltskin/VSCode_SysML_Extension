import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vm from 'vm';
import * as vscode from 'vscode';
import type { BaseLanguageClient } from 'vscode-languageclient';
import {
  answerArchitectureQuestion, buildArchitectureGraph, type ArchitectureDocument,
  type ArchitectureGraph
} from '../architecture/architectureGraph';
import { DiagramCache } from '../markdown/diagramCache';
import { parsePaste } from '../modelEditing/modelEdits';
import { ArchitectureExplorerPanel } from '../panels/architectureExplorerPanel';
import { LspModelProvider } from '../providers/lspModelProvider';
import type { SysMLElementDTO } from '../providers/sysmlModelTypes';
import { findWorkspaceModelFiles } from '../providers/workspaceFiles';
import {
  cancelModelOperations, checkCancelled, checkFileBudgets, checkLimit,
  checkModelLimits, internalSafetyLimits, sourceLoadingBudgetBytes, textBytes, withModelProgress
} from '../resourceLimits';

async function withSettings(values: Record<string, unknown>, action: () => Promise<void>): Promise<void> {
    const original = vscode.workspace.getConfiguration;
    try {
        vscode.workspace.getConfiguration = (() => ({
            get: (key: string, fallback: unknown) => Object.hasOwn(values, key) ? values[key] : fallback,
        })) as unknown as typeof original;
        await action();
    } finally { vscode.workspace.getConfiguration = original; }
}

suite('Model loading performance safeguards', () => {
    const result = () => ({ version: 1, elements: [], relationships: [],
        stats: { totalElements: 0, resolvedElements: 0, unresolvedElements: 0,
            parseTimeMs: 0, modelBuildTimeMs: 0 } });
    test('parsed empty models are cached but unavailable documents are retried', async () => {
        let requests = 0;
        const provider = new LspModelProvider({ sendRequest: async () => {
            requests++;
            return requests === 1 ? { version: -1 } : result();
        } } as unknown as BaseLanguageClient);
        await provider.getModel('file:///empty.sysml', ['elements']);
        assert.equal(requests, 2);
        await provider.getModel('file:///empty.sysml', ['elements']);
        assert.equal(requests, 2);
        await provider.getModel('file:///empty.sysml', ['sequenceDiagrams']);
        assert.equal(requests, 3);
    });
    test('identical consumers share requests and one cancellation does not cancel the others', async () => {
        let finish!: (value: object) => void;
        let requests = 0;
        let sharedToken: vscode.CancellationToken | undefined;
        const response = new Promise(resolve => { finish = resolve; });
        const provider = new LspModelProvider({ sendRequest: async (_method: string,
            _params: unknown, token: vscode.CancellationToken) => {
            requests++;
            sharedToken = token;
            return response;
        } } as unknown as BaseLanguageClient);
        const cancellation = new vscode.CancellationTokenSource();
        try {
            const first = provider.getModel('file:///shared.sysml', ['elements'], cancellation.token);
            const cancelled = assert.rejects(first, error => error instanceof vscode.CancellationError);
            const others = Array.from({ length: 3 }, () => provider.getModel('file:///shared.sysml', ['elements']));
            await new Promise(resolve => globalThis.setImmediate(resolve));
            assert.equal(requests, 1);
            cancellation.cancel();
            await cancelled;
            assert.ok(!sharedToken?.isCancellationRequested);
            finish(result());
            await Promise.all(others);
        } finally { cancellation.dispose(); }
    });
    test('invalidation prevents an old request from repopulating the cache', async () => {
        let finish!: (value: object) => void;
        let requests = 0;
        const response = new Promise(resolve => { finish = resolve; });
        const provider = new LspModelProvider({ sendRequest: async () => {
            requests++;
            return requests === 1 ? response : result();
        } } as unknown as BaseLanguageClient);
        const first = provider.getModel('file:///changed.sysml', ['elements']);
        await new Promise(resolve => globalThis.setImmediate(resolve));
        provider.invalidateCache('file:///changed.sysml');
        finish(result());
        await first;
        await provider.getModel('file:///changed.sysml', ['elements']);
        assert.equal(requests, 2);
    });
    test('cancelling every consumer cancels the shared request and does not cache it', async () => {
        let finish!: (value: object) => void;
        let sharedToken: vscode.CancellationToken | undefined;
        let requests = 0;
        const response = new Promise(resolve => { finish = resolve; });
        const provider = new LspModelProvider({ sendRequest: async (_method: string,
            _params: unknown, token: vscode.CancellationToken) => {
            requests++;
            sharedToken = token;
            return requests === 1 ? response : result();
        } } as unknown as BaseLanguageClient);
        const cancellation = new vscode.CancellationTokenSource();
        try {
            const request = provider.getModel('file:///cancelled.sysml', ['elements'], cancellation.token);
            const rejected = assert.rejects(request, error => error instanceof vscode.CancellationError);
            await new Promise(resolve => globalThis.setImmediate(resolve));
            cancellation.cancel();
            await rejected;
            assert.ok(sharedToken?.isCancellationRequested);
            finish(result());
            await new Promise(resolve => globalThis.setImmediate(resolve));
            await provider.getModel('file:///cancelled.sysml', ['elements']);
            assert.equal(requests, 2);
        } finally { cancellation.dispose(); }
    });
    test('document versions prevent stale cache reuse', async () => {
        const original = vscode.workspace.textDocuments;
        const document = { uri: vscode.Uri.parse('file:///versioned.sysml'), version: 1,
            getText: () => '' };
        let requests = 0;
        Object.assign(vscode.workspace, { textDocuments: [document] });
        try {
            const provider = new LspModelProvider({ sendRequest: async () => {
                requests++;
                return { ...result(), version: document.version };
            } } as unknown as BaseLanguageClient);
            await provider.getModel(document.uri.toString(), ['elements']);
            document.version++;
            await provider.getModel(document.uri.toString(), ['elements']);
            assert.equal(requests, 2);
        } finally { Object.assign(vscode.workspace, { textDocuments: original }); }
    });
    test('failed shared requests do not poison later loads', async () => {
        let requests = 0;
        const provider = new LspModelProvider({ sendRequest: async () => {
            if (++requests === 1) throw new Error('unavailable');
            return result();
        } } as unknown as BaseLanguageClient);
        await assert.rejects(provider.getModel('file:///failure.sysml', ['elements']));
        await provider.getModel('file:///failure.sysml', ['elements']);
        assert.equal(requests, 2);
    });
});

suite('Shared resource controls', () => {
    test('workspace discovery skips server-excluded directories and honors overrides', async () => {
        const originalFind = vscode.workspace.findFiles;
        const originalFolders = vscode.workspace.workspaceFolders;
        const uris = ['main.sysml', 'types.kerml', 'temp/ignored.sysml', 'tests/ignored.sysml']
            .map(name => vscode.Uri.parse(`file:///temp/workspace/${name}`));
        try {
            vscode.workspace.findFiles = async () => uris;
            Object.assign(vscode.workspace, { workspaceFolders: [{ uri: vscode.Uri.parse('file:///temp/workspace') }] });
            assert.deepStrictEqual(await findWorkspaceModelFiles(), uris.slice(0, 2));
            await withSettings({ skipDirectories: [] }, async () => {
                assert.deepStrictEqual(await findWorkspaceModelFiles(), uris);
            });
        } finally {
            vscode.workspace.findFiles = originalFind;
            Object.assign(vscode.workspace, { workspaceFolders: originalFolders });
        }
    });

    test('server preload defaults to folders as well as saved workspaces', () => {
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
        const setting = manifest.contributes.configuration.properties['sysml.workspace.preloadOnOpen'];
        assert.strictEqual(setting.default, 'always');
        assert.deepStrictEqual(setting.enum, ['always', 'workspaceOnly', 'never']);
        assert.ok(manifest.activationEvents.includes('workspaceContains:**/*.sysml'));
    });

    test('folder workspaces load on startup without an active editor or saved workspace file', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('    if (vscode.workspace.workspaceFolders?.length) {');
        const end = source.indexOf('\n\n    context.subscriptions.push(', start);
        assert.ok(start >= 0 && end > start);
        for (const folderCount of [0, 1, 2]) {
            for (const loaded of [false, true]) {
                let loads = 0;
                let callback: (() => void) | undefined;
                const scope = {
                    vscode: { workspace: { workspaceFolders: Array.from({ length: folderCount }, () => ({})) },
                        Disposable: class { constructor(public dispose: () => void) {} } },
                    context: { subscriptions: [] },
                    setTimeout: (task: () => void) => { callback = task; return 1; },
                    clearTimeout: () => {},
                    modelExplorerProvider: { hasWorkspaceModel: () => loaded },
                    loadWorkspaceSysMLFiles: () => { loads++; },
                };
                vm.runInNewContext(ts.transpile(source.slice(start, end), {
                    target: ts.ScriptTarget.ES2022,
                }), scope);
                callback?.();
                assert.strictEqual(loads, folderCount > 0 && !loaded ? 1 : 0);
                assert.strictEqual(scope.context.subscriptions.length, folderCount > 0 ? 1 : 0);
            }
        }
    });

    test('duplicate filesystem events share one log and notification; non-edits do not parse', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('    const pendingFileNotifications =');
        const end = source.indexOf('\n    context.subscriptions.push(\n        vscode.workspace.onDidChangeWorkspaceFolders', start);
        assert.ok(start >= 0 && end > start);
        const timers = new Map<number, () => void>();
        const logs: string[] = [];
        let timerId = 0;
        let notifications = 0;
        let parses = 0;
        let invalidations = 0;
        let changeHandler!: (event: object) => void;
        const context = vm.createContext({
            vscode: { ...vscode, Disposable: class {
                constructor(private readonly cleanup: () => void) {}
                dispose(): void { this.cleanup(); }
            }, workspace: { onDidChangeTextDocument: (handler: typeof changeHandler) => {
                changeHandler = handler;
            } } },
            context: { subscriptions: [] },
            setTimeout: (callback: () => void) => { timers.set(++timerId, callback); return timerId; },
            clearTimeout: (id: number) => timers.delete(id),
            outputChannel: { appendLine: (message: string) => logs.push(message) },
            VisualizationPanel: { currentPanel: { notifyFileChanged: () => notifications++ } },
            ModelDashboardPanel: {},
            parseSysMLDocument: () => parses++,
            invalidateWorkspaceModel: () => invalidations++,
        });
        vm.runInContext(ts.transpile(source.slice(start, end), { target: ts.ScriptTarget.ES2022 }), context);
        const uri = vscode.Uri.parse('file:///duplicate.sysml');
        context.uri = uri;
        vm.runInContext("scheduleFileNotification(uri, 'changed'); scheduleFileNotification(uri, 'changed'); scheduleFileNotification(uri);", context);
        assert.strictEqual(timers.size, 1);
        const flush = (): void => {
            const callbacks = [...timers.values()];
            timers.clear();
            callbacks.forEach(callback => callback());
        };
        flush();
        assert.strictEqual(logs.length, 1);
        assert.strictEqual(notifications, 1);
        const handlerStart = source.indexOf('        vscode.workspace.onDidChangeTextDocument(event => {', end);
        const handlerEnd = source.indexOf('\n        })', handlerStart);
        vm.runInContext(ts.transpile(source.slice(handlerStart, handlerEnd + 11), {
            target: ts.ScriptTarget.ES2022,
        }), context);
        const document = { uri, languageId: 'sysml' };
        changeHandler({ document, contentChanges: [] });
        assert.strictEqual(parses, 0);
        assert.strictEqual(invalidations, 0);
        changeHandler({ document, contentChanges: [{ text: 'part changed;' }] });
        assert.strictEqual(parses, 1);
        assert.strictEqual(invalidations, 1);
        flush();
        assert.strictEqual(notifications, 2);
    });

    test('startup, editor change, and document close share one workspace scan and load', async () => {
        const source = fs.readFileSync(path.resolve(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('    let workspaceLoading:');
        const end = source.indexOf('    const activeEditor =', start);
        assert.ok(start >= 0 && end > start);
        let resolveFiles!: (files: vscode.Uri[]) => void;
        let scans = 0;
        let loads = 0;
        let notifications = 0;
        const files = new Promise<vscode.Uri[]>(resolve => { resolveFiles = resolve; });
        let loaded = false;
        let unavailableLoads = 0;
        let unavailable = false;
        const scope = { load: undefined as ((force?: boolean) => Promise<void>) | undefined,
            invalidate: undefined as (() => void) | undefined,
            vscode: { workspace: { getConfiguration: () => ({ get: () => 'always' }) },
                CancellationError: vscode.CancellationError,
                commands: { executeCommand: () => {} }, window: { showErrorMessage: () => {} } },
            setTimeout, clearTimeout,
            findWorkspaceModelFiles: () => { scans++; return files; },
            lspModelProvider: { invalidateCache: () => {} },
            withModelProgress: async (_title: string, task: Function) => {
                notifications++;
                await task({ report: () => {} }, new vscode.CancellationTokenSource().token);
            },
            checkFileBudgets: async () => {}, checkCancelled: () => {},
            outputChannel: { appendLine: () => {} }, showMetricsLoading: () => {},
            modelExplorerProvider: { loadWorkspaceModel: async () => {
                loads++;
                unavailable = unavailableLoads-- > 0;
                loaded = !unavailable;
            },
                hasWorkspaceModel: () => loaded,
                hasUnavailableWorkspaceFiles: () => unavailable,
                getLastStats: () => undefined },
        };
        vm.runInNewContext(ts.transpileModule(`${source.slice(start, end)}\nglobalThis.load = loadWorkspaceSysMLFiles; globalThis.invalidate = invalidateWorkspaceModel;`,
            { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, scope);
        assert.ok(scope.load);
        const startup = scope.load();
        assert.equal(scope.load(), startup);
        assert.equal(scope.load(), startup);
        resolveFiles([vscode.Uri.parse('file:///SystemPackage.sysml')]);
        await startup;
        assert.equal(scans, 1);
        assert.equal(loads, 1);
        assert.equal(notifications, 1);
        await scope.load();
        await scope.load();
        assert.equal(scans, 1);
        assert.equal(loads, 1);
        assert.equal(notifications, 1);
        assert.ok(scope.invalidate);
        scope.invalidate();
        await scope.load();
        assert.equal(loads, 2);
        assert.equal(scans, 2);
        await scope.load(true);
        assert.equal(loads, 3);
        loaded = false;
        await scope.load();
        assert.equal(loads, 4);
        scope.invalidate();
        const changing = scope.load();
        scope.invalidate();
        await changing;
        await scope.load();
        assert.equal(loads, 6);
        await scope.load();
        assert.equal(loads, 6);
        unavailableLoads = 1;
        scope.invalidate();
        await scope.load();
        assert.equal(loads, 8);
        assert.ok(loaded);
    });

    test('disk change, create and delete evict cached unopened models', async () => {
        const source = fs.readFileSync(path.resolve(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('    const fileSystemWatcher =');
        const end = source.indexOf('\n}', start);
        const handlers = new Map<string, (uri: vscode.Uri) => void>();
        let requests = 0;
        const provider = new LspModelProvider({ sendRequest: async () => ({
            version: ++requests, elements: [], stats: { totalElements: 0 },
        }) } as unknown as BaseLanguageClient);
        const watcher = Object.fromEntries(['Change', 'Create', 'Delete'].map(event => [
            `onDid${event}`, (handler: (uri: vscode.Uri) => void) => handlers.set(event, handler),
        ]));
        const scope = {
            vscode: { workspace: { createFileSystemWatcher: () => watcher } },
            context: { subscriptions: [] }, lspModelProvider: provider,
            invalidateWorkspaceModel: () => {}, scheduleFileNotification: () => {},
        };
        vm.runInNewContext(ts.transpile(source.slice(start, end), {
            target: ts.ScriptTarget.ES2022,
        }), scope);
        const uri = vscode.Uri.parse('file:///unopened.sysml');
        await provider.getModel(uri.toString(), ['elements']);
        for (const event of ['Change', 'Create', 'Delete']) {
            const before = requests;
            await provider.getModel(uri.toString(), ['elements']);
            assert.strictEqual(requests, before);
            const handler = handlers.get(event);
            assert.ok(handler);
            handler(uri);
            await provider.getModel(uri.toString(), ['elements']);
            assert.strictEqual(requests, before + 1);
        }
    });

    test('server parse completion evicts results fetched before a disk edit was parsed', () => {
        const source = fs.readFileSync(path.resolve(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('export function notifyServerParseDone(');
        const end = source.indexOf('\n}', start) + 2;
        const invalidations: string[] = [];
        const notifications: (string | undefined)[] = [];
        const scope = { lspModelProvider: { invalidateCache: (uri: string) => invalidations.push(uri) },
            parseOrchestrator: { notifyServerParseDone: (uri?: string) => notifications.push(uri) },
            notify: undefined as ((uri?: string) => void) | undefined };
        vm.runInNewContext(ts.transpile(`${source.slice(start, end).replace('export ', '')}
            globalThis.notify = notifyServerParseDone;`, { target: ts.ScriptTarget.ES2022 }), scope);
        assert.ok(scope.notify);
        scope.notify('file:///changed.sysml');
        scope.notify();
        assert.deepStrictEqual(invalidations, ['file:///changed.sysml']);
        assert.deepStrictEqual(notifications, ['file:///changed.sysml', undefined]);
    });

    test('plain folders retain the workspace model when focus moves away or the last editor closes', () => {
        const source = fs.readFileSync(path.resolve(__dirname, '../../src/extension.ts'), 'utf8');
        const start = source.indexOf('    context.subscriptions.push(\n        vscode.window.onDidChangeActiveTextEditor');
        const end = source.indexOf('    // ── Consolidated file-change notification', start);
        let editorHandler!: (editor: unknown) => void;
        let closeHandler!: (document: object) => void;
        let loads = 0;
        let clears = 0;
        const scope = {
            vscode: { commands: { executeCommand: () => {} },
                workspace: { workspaceFolders: [{}], onDidCloseTextDocument: (handler: typeof closeHandler) => {
                    closeHandler = handler;
                } },
                window: { visibleTextEditors: [], onDidChangeActiveTextEditor: (handler: typeof editorHandler) => {
                    editorHandler = handler;
                } } },
            context: { subscriptions: [] }, outputChannel: { appendLine: () => {} },
            modelExplorerProvider: { clear: () => clears++ }, featureExplorerProvider: undefined,
            hideModelMetrics: () => {}, loadWorkspaceSysMLFiles: () => loads++,
            deleteCachedMetrics: () => {}, parseOrchestrator: { cancelAll: () => {} },
            hideParseProgress: () => {},
        };
        vm.runInNewContext(ts.transpile(source.slice(start, end), {
            target: ts.ScriptTarget.ES2022,
        }), scope);
        editorHandler(undefined);
        closeHandler({ languageId: 'sysml', fileName: 'closed.sysml', uri: vscode.Uri.parse('file:///closed.sysml') });
        assert.strictEqual(loads, 2);
        assert.strictEqual(clears, 0);
        scope.vscode.workspace.workspaceFolders = [];
        closeHandler({ languageId: 'sysml', fileName: 'closed.sysml', uri: vscode.Uri.parse('file:///closed.sysml') });
        assert.strictEqual(clears, 1);
    });
    test('validates settings, honors zero, and measures UTF-8 bytes', async () => {
        await withSettings({ 'modelLoading.budgetMiB': 2, 'limits.maxFiles': 1,
            'limits.maxElements': 2, 'limits.editRows': NaN }, async () => {
            assert.equal(sourceLoadingBudgetBytes(), 2097152);
            assert.equal(internalSafetyLimits.editRows, 500);
            assert.equal(textBytes('\u00e9\ud83d\ude80'), 6);
            assert.doesNotThrow(() => checkLimit(100000, 0, 'maxFiles'));
            assert.throws(() => checkLimit(3, 2, 'maxElements'), /internal safety guard/);
        });
        for (const invalid of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
            await withSettings({ 'modelLoading.budgetMiB': invalid }, async () => {
                assert.equal(sourceLoadingBudgetBytes(), 0);
            });
        }
    });

    test('enforces nesting and the optional preview element cap', () => {
        const model = { version: 1, elements: [element('parent', 'package', [element('child')])],
            relationships: [{ type: 'dependency', source: 'parent', target: 'child' }] };
        const unlimited = { maxDepth: 0 };
        assert.doesNotThrow(() => checkModelLimits(model, unlimited));
        assert.throws(() => checkModelLimits(model, { ...unlimited, maxDepth: 1 }), /maxDepth/);
        assert.throws(() => checkModelLimits(model, { ...unlimited, maxElements: 1 }), /maxElements/);
        assert.doesNotThrow(() => checkModelLimits(model));
        let deep = element('leaf');
        for (let depth = 0; depth < internalSafetyLimits.maxDepth; depth++) {
            deep = element(`level${depth}`, 'package', [deep]);
        }
        assert.throws(() => checkModelLimits({ version: 1, elements: [deep] }), /maxDepth/);
    });

    test('checks aggregate file bytes before requesting models', async () => {
        const descriptor = Object.getOwnPropertyDescriptor(vscode.workspace, 'fs');
        const original = vscode.workspace.fs;
        try {
            Object.defineProperty(vscode.workspace, 'fs', { configurable: true, value: { ...original,
                stat: async () => ({ type: vscode.FileType.File, size: 600000, ctime: 0, mtime: 0 }) } });
            const files = ['file:///budget-a.sysml', 'file:///budget-b.sysml'].map(uri => vscode.Uri.parse(uri));
            await withSettings({ 'modelLoading.budgetMiB': 1 }, async () => {
                await assert.rejects(checkFileBudgets(files), /sysml\.modelLoading\.budgetMiB/);
            });
            await withSettings({ 'modelLoading.budgetMiB': 0, 'limits.maxFiles': 1 }, async () => {
                await checkFileBudgets(files);
            });
        } finally {
            if (descriptor) Object.defineProperty(vscode.workspace, 'fs', descriptor);
        }
    });

    test('links parent cancellation and rejects a completed-but-cancelled task', async () => {
        const parent = new vscode.CancellationTokenSource();
        try {
            await assert.rejects(withModelProgress('Test parent', async (_progress, token) => {
                parent.cancel();
                assert.ok(token.isCancellationRequested);
                return 1;
            }, parent.token), error => error instanceof vscode.CancellationError);
        } finally { parent.dispose(); }
    });

    test('global cancellation ignores the removed progress flag and does not poison later operations', async () => {
        await withSettings({ 'operations.showProgress': false }, async () => {
            await assert.rejects(withModelProgress('Test global', async (_progress, token) => {
                cancelModelOperations();
                checkCancelled(token);
            }), error => error instanceof vscode.CancellationError);
            assert.equal(await withModelProgress('Next operation', async () => 42), 42);
        });
    });

    test('overlapping operations share one notification and cancellation reaches every task', async () => {
        const original = vscode.window.withProgress;
        let cancellation = new vscode.CancellationTokenSource();
        let notifications = 0;
        try {
            vscode.window.withProgress = (async (_options: unknown, task: Function) => {
                notifications++;
                return task({ report: () => {} }, cancellation.token);
            }) as unknown as typeof original;
            const tokens: vscode.CancellationToken[] = [];
            const first = withModelProgress('First load', async (_progress, token) => {
                tokens.push(token);
                return new Promise<void>(() => {});
            });
            const second = withModelProgress('Second load', async (_progress, token) => {
                tokens.push(token);
                return new Promise<void>(() => {});
            });
            assert.equal(notifications, 0);
            await new Promise(resolve => setTimeout(resolve, 550));
            assert.equal(notifications, 1);
            cancellation.cancel();
            await Promise.all([first, second].map(operation =>
                assert.rejects(operation, error => error instanceof vscode.CancellationError)));
            assert.ok(tokens.every(token => token.isCancellationRequested));
            cancellation.dispose();
            cancellation = new vscode.CancellationTokenSource();
            assert.equal(await withModelProgress('Fresh load', async () => 42), 42);
            assert.equal(notifications, 1);
        } finally { vscode.window.withProgress = original; cancellation.dispose(); }
    });

    test('timeout cancels stalled tasks and names the timeout setting', async () => {
        await withSettings({ 'operations.timeoutSeconds': 1 }, async () => {
            let token: vscode.CancellationToken | undefined;
            await assert.rejects(withModelProgress('Stalled load', async (_progress, cancellation) => {
                token = cancellation;
                return new Promise<void>(() => {});
            }), /timed out after 1 seconds.*sysml.operations.timeoutSeconds/);
            assert.ok(token?.isCancellationRequested);
        });
    });

    test('zero disables timeout and nested operations do not open extra notifications', async () => {
        const originalProgress = vscode.window.withProgress;
        const originalTimer = globalThis.setTimeout;
        let notifications = 0;
        let timers = 0;
        try {
            vscode.window.withProgress = (async (_options: unknown, task: Function) => {
                notifications++;
                return task({ report: () => {} });
            }) as unknown as typeof originalProgress;
            globalThis.setTimeout = ((...args: Parameters<typeof originalTimer>) => {
                timers++;
                return originalTimer(...args);
            }) as typeof originalTimer;
            await withSettings({ 'operations.timeoutSeconds': 0, 'operations.showProgress': false }, async () => {
                assert.equal(await withModelProgress('Workspace', async (_progress, token) =>
                    withModelProgress('Child model', async () => 42, token)), 42);
            });
            assert.equal(notifications, 0);
            assert.equal(timers, 1);
        } finally {
            vscode.window.withProgress = originalProgress;
            globalThis.setTimeout = originalTimer;
        }
    });

    test('removed settings do not change safety guards or truncate architecture findings', async () => {
        const paste = 'name\tdocumentation\nfirst\tone\nsecond\ttwo';
        await withSettings({ 'limits.editRows': 1, 'limits.architectureFindings': 1 }, async () => {
            assert.equal(parsePaste(paste, ['name', 'documentation']).length, 2);
            const tooManyRows = `name\tdocumentation\n${Array.from({ length: 501 },
                (_, index) => `row${index}\tdoc`).join('\n')}`;
            assert.throws(() => parsePaste(tooManyRows, ['name', 'documentation']), /internal safety guard/);
            const dependents = Array.from({ length: 102 }, (_, index) => element(`dependent${index}`));
            const graph = buildArchitectureGraph([{ ...fixture(),
                elements: [element('sensor'), ...dependents], relationships: dependents.map(node => ({
                    type: 'dependency', source: node.name, target: 'sensor',
                })) }]);
            const sensor = graph.nodes.find(node => node.name === 'sensor');
            assert.ok(sensor);
            const answer = answerArchitectureQuestion(graph, 'removal', sensor.id);
            assert.equal(answer.findings.length, 102);
            assert.ok(!answer.caveats.some(caveat => caveat.includes('Showing the first')));
        });
    });

    test('Markdown cache limits update live and zero disables the cap', async () => {
        let maximum = 1;
        const cache = new DiagramCache(async () => ({}), () => {}, () => maximum);
        try {
            assert.equal(cache.lookup('first', 1, 'markdown').state, 'loading');
            assert.equal(cache.lookup('second', 1, 'markdown').state, 'error');
            maximum = 0;
            assert.equal(cache.lookup('second', 1, 'markdown').state, 'loading');
        } finally { cache.dispose(); }
    });
});

function element(name: string, type = 'part', children: SysMLElementDTO[] = []): SysMLElementDTO {
    return { name, type, symbolId: name, displayName: name, children, attributes: {}, relationships: [],
        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 0 } } };
}

function fixture(): ArchitectureDocument {
    return { uri: 'file:///model.sysml', label: 'model.sysml', version: 1,
        elements: [element('System', 'package', [element('sensor'), element('controller'),
            element('need', 'requirement'), element('sibling'), element('connector', 'connection')])],
        relationships: [
            { type: 'dependency', source: 'System::controller', target: 'System::sensor' },
            { type: 'satisfy', source: 'System::controller', target: 'System::need' },
            { type: 'connection', source: 'System::sensor', target: 'System::controller', symbolId: 'connector' },
        ] };
}

function findNode(graph: ArchitectureGraph, name: string) {
    const node = graph.nodes.find(candidate => candidate.name === name);
    assert.ok(node, `Missing fixture element: ${name}`);
    return node;
}

suite('Architecture Explorer evidence queries', () => {
    test('impact follows dependents and satisfaction, not package siblings', () => {
        const graph = buildArchitectureGraph([fixture()]);
        const sensor = findNode(graph, 'sensor');
        const answer = answerArchitectureQuestion(graph, 'removal', sensor.id);
        assert.deepStrictEqual(answer.findings.map(finding => graph.nodes.find(node => node.id === finding.nodeId)?.name),
            ['controller', 'connector', 'need']);
        assert.match(answer.caveats.join(' '), /not a prediction/);
    });

    test('requirements return evidence paths from the selected sensor', () => {
        const graph = buildArchitectureGraph([fixture()]);
        const sensor = findNode(graph, 'sensor');
        const answer = answerArchitectureQuestion(graph, 'requirements', sensor.id);
        assert.equal(answer.findings.length, 1);
        assert.equal(answer.findings[0].edgeIds.length, 2);
        assert.equal(answer.findings[0].nodeIds[0], sensor.id);
    });

    test('removing a requirement reaches its satisfier; specialization uses the LSP kind', () => {
        const graph = buildArchitectureGraph([fixture()]);
        const requirement = findNode(graph, 'need');
        assert.ok(answerArchitectureQuestion(graph, 'removal', requirement.id).findings
            .some(finding => graph.nodes.find(node => node.id === finding.nodeId)?.name === 'controller'));
        const document = fixture();
        const inheritance = buildArchitectureGraph([{ ...document,
            relationships: [{ type: 'specializes', source: 'System::controller', target: 'System::sensor' },
                { type: 'satisfy', source: 'System::controller', target: 'System::need' }] }]);
        const sensor = findNode(inheritance, 'sensor');
        assert.equal(answerArchitectureQuestion(inheritance, 'requirements', sensor.id).findings.length, 1);
    });

    test('shortest trace can follow satisfaction backwards but never invents containment links', () => {
        const graph = buildArchitectureGraph([fixture()]);
        const find = (name: string) => findNode(graph, name).id;
        assert.equal(answerArchitectureQuestion(graph, 'trace', find('need'), find('sensor')).findings[0].edgeIds.length, 2);
        assert.equal(answerArchitectureQuestion(graph, 'trace', find('need'), find('sibling')).findings.length, 0);
    });

    test('connector answers show modeled endpoints and distinguish connectivity from rationale', () => {
        const graph = buildArchitectureGraph([fixture()]);
        const connector = findNode(graph, 'connector');
        const answer = answerArchitectureQuestion(graph, 'connector', connector.id);
        assert.equal(answer.findings.filter(finding => finding.text.includes('--connection-->')).length, 1);
        assert.match(answer.summary, /No design rationale/);
        assert.ok(answer.findings.some(finding => /sensor --connection--> System::controller/.test(finding.text)));
    });

    test('relative port endpoints resolve in connector scope and sensor impact includes its features', () => {
        const document = fixture();
        document.elements[0].children[0].children = [element('output', 'port')];
        document.elements[0].children[1].children = [element('input', 'port')];
        const graph = buildArchitectureGraph([{ ...document, relationships: [
            { type: 'connection', source: 'sensor.output', target: 'controller.input', symbolId: 'connector' },
            { type: 'satisfy', source: 'System::controller::input', target: 'System::need' },
        ] }]);
        assert.equal(graph.unresolved, 0);
        const sensor = findNode(graph, 'sensor');
        const answer = answerArchitectureQuestion(graph, 'requirements', sensor.id);
        assert.equal(answer.findings.length, 1);
        assert.equal(answer.findings[0].edgeIds.length, 3);
    });

    test('ambiguous references are not guessed, and anonymous identity is retained', () => {
        const document = fixture();
        const anonymous = element('', 'constraint');
        anonymous.symbolId = 'anonymous-constraint';
        anonymous.displayName = ': Constraint';
        const graph = buildArchitectureGraph([{ ...document,
            elements: [...document.elements, element('Other', 'package', [element('sensor')]), anonymous],
            relationships: [...document.relationships, { type: 'dependency', source: 'sensor', target: 'sibling' }] }]);
        assert.ok(graph.unresolved > 0);
        assert.ok(graph.nodes.some(node => node.symbolId === 'anonymous-constraint'));
    });

    test('standalone source-backed dependencies fill LSP omissions without inventing edges', () => {
        const document = fixture();
        const graph = buildArchitectureGraph([{ ...document, relationships: [],
            text: 'dependency from System::controller to System::sensor;\n'
                + 'satisfy System::need by System::controller;\n'
                + '// dependency from System::sibling to System::sensor;' }]);
        const sensor = findNode(graph, 'sensor');
        const answer = answerArchitectureQuestion(graph, 'requirements', sensor.id);
        assert.equal(answer.findings.length, 1);
        const link = graph.edges.find(edge => edge.kind === 'dependency');
        assert.ok(link);
        assert.equal(link.range?.start.line, 0);
        assert.equal(graph.edges.filter(edge => edge.kind === 'dependency').length, 1);
    });

    test('cross-file queries preserve identity and resolve qualified references', () => {
        const document = fixture();
        const graph = buildArchitectureGraph([{ ...document, relationships: [
            { type: 'dependency', source: 'System::controller', target: 'Other::sensor' },
            { type: 'satisfy', source: 'System::controller', target: 'System::need' },
        ] }, { ...document, uri: 'file:///other.sysml', text: undefined,
            elements: [element('Other', 'package', [element('sensor')])], relationships: [] }]);
        const sensors = graph.nodes.filter(node => node.name === 'sensor');
        assert.notEqual(sensors[0].id, sensors[1].id);
        const selected = sensors.find(node => node.uri === 'file:///other.sysml');
        assert.ok(selected);
        const answer = answerArchitectureQuestion(graph, 'requirements', selected.id);
        assert.equal(answer.findings.length, 1);
        assert.equal(answer.findings[0].edgeIds.length, 2);
        assert.ok(!answer.findings[0].nodeIds.includes(sensors[0].id));
        assert.ok(graph.documents.every(source => !('text' in source)));
    });
});

suite('Architecture Explorer host boundaries', () => {
    test('ready reuses the current graph without loading models again', async () => {
        const { panel, messages } = host();
        let loads = 0;
        Object.assign(panel, { load: async () => { loads++; } });
        await panel.receive({ command: 'ready' });
        assert.equal(loads, 0);
        assert.equal(messages[0].command, 'snapshot');
        assert.equal(messages[0].graph, panel.graph);
    });

    test('Files Explorer offers Architecture Explorer for model files and folders', () => {
        const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
        const command = manifest.contributes.commands.find((entry: { command: string }) =>
            entry.command === 'sysml.showArchitectureExplorer');
        assert.equal(command?.title, 'Analyze Model Relationships');
        const menu = manifest.contributes.menus['explorer/context'].find((entry: { command: string }) =>
            entry.command === 'sysml.showArchitectureExplorer');
        assert.equal(menu?.when,
            'explorerResourceIsFolder || resourceExtname == .sysml || resourceExtname == .kerml');
        assert.equal(menu?.group, 'sysml@5');
    });

    function host() {
        const messages: Record<string, unknown>[] = [];
        const panel = Object.assign(Object.create(ArchitectureExplorerPanel.prototype), {
            graph: buildArchitectureGraph([{ ...fixture(), text:
                'dependency from System::controller to System::sensor;' }]),
            revision: 3, generation: 0, disposed: false,
            post: async (message: Record<string, unknown>) => { messages.push(message); },
        }) as { graph: ArchitectureGraph; revision: number; generation: number;
            receive(message: object): Promise<void>; load(): Promise<void> };
        return { panel, messages };
    }

    test('answers only valid queries for the current revision', async () => {
        const { panel, messages } = host();
        const selectedId = findNode(panel.graph, 'sensor').id;
        const query = { command: 'query', question: 'requirements', selectedId,
            revision: 3, requestId: 7 };
        await panel.receive({ ...query, revision: 2 });
        assert.equal(messages[0].command, 'error');
        await panel.receive({ ...query, question: 'execute arbitrary code' });
        assert.equal(messages[1].command, 'error');
        await panel.receive(query);
        assert.equal(messages[2].command, 'answer');
        assert.equal(messages[2].revision, 3);
        assert.equal(messages[2].requestId, 7);
    });

    test('tracks query outcomes without sending source identity or arbitrary questions', async () => {
        const shared = require('../telemetry') as typeof import('../telemetry');
        const originalTelemetry = shared.telemetry;
        const events: unknown[][] = [];
        Object.assign(shared, { telemetry: { operation: (...args: unknown[]) => events.push(args) } });
        try {
            const { panel } = host();
            const query = { command: 'query', question: 'requirements',
                selectedId: findNode(panel.graph, 'sensor').id, revision: 3, requestId: 7 };
            await panel.receive({ ...query, revision: 2 });
            await panel.receive({ ...query, question: 'SecretRequirement' });
            await panel.receive(query);
            assert.deepEqual(events.map(event => event.slice(0, 3)), [
                ['architecture', 'requirements', 'rejected'],
                ['architecture', 'requirements', 'success'],
            ]);
            assert.ok(events.every(event => event.length === 4 && typeof event[3] === 'number'));
        } finally {
            Object.assign(shared, { telemetry: originalTelemetry });
        }
    });

    test('source links navigate the declaration and reject changed document versions', async () => {
        const { panel, messages } = host();
        const edge = panel.graph.edges.find(link => link.kind === 'dependency');
        assert.ok(edge?.range);
        const originalOpen = vscode.workspace.openTextDocument;
        const originalShow = vscode.window.showTextDocument;
        let version = 2;
        const selections: vscode.Range[] = [];
        try {
            vscode.workspace.openTextDocument = (async () => ({ version })) as unknown as typeof originalOpen;
            vscode.window.showTextDocument = (async (_document: unknown, options: vscode.TextDocumentShowOptions) => {
                assert.ok(options.selection);
                selections.push(options.selection);
            }) as unknown as typeof originalShow;
            await panel.receive({ command: 'navigateEdge', revision: 3, id: edge.id });
            assert.equal(selections.length, 0);
            assert.match(String(messages[0].message), /Refresh before navigating changed source/);
            version = 1;
            await panel.receive({ command: 'navigateEdge', revision: 3, id: edge.id });
            assert.equal(selections.length, 1);
            assert.equal(selections[0].start.line, edge.range.start.line);
            assert.equal(selections[0].end.character, edge.range.end.character);
        } finally {
            vscode.workspace.openTextDocument = originalOpen;
            vscode.window.showTextDocument = originalShow;
        }
    });

    test('superseded asynchronous model loads cannot publish a stale snapshot', async () => {
        const { panel, messages } = host();
        const document = fixture();
        let finish!: (model: object) => void;
        const model = new Promise<object>(resolve => { finish = resolve; });
        Object.assign(panel, {
            uris: new Map([[document.uri, vscode.Uri.parse(document.uri)]]),
            provider: { getModel: () => model },
        });
        const originalOpen = vscode.workspace.openTextDocument;
        try {
            vscode.workspace.openTextDocument = (async () => ({ version: 1,
                getText: () => 'package System {}' })) as unknown as typeof originalOpen;
            const loading = panel.load();
            panel.generation++;
            finish({ version: 1, elements: document.elements, relationships: document.relationships });
            await loading;
            assert.ok(!messages.some(message => message.command === 'snapshot'));
            assert.equal(panel.graph, undefined);
        } finally {
            vscode.workspace.openTextDocument = originalOpen;
        }
    });
});
