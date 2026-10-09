import * as assert from 'assert';
import * as fs from 'fs';
import MarkdownIt from 'markdown-it';
import * as path from 'path';
import * as ts from 'typescript';
import * as vm from 'vm';
import * as vscode from 'vscode';
import { URI, Utils } from 'vscode-uri';
import { DiagramCache } from '../markdown/diagramCache';
import { findExportFences, replaceExportFences } from '../markdown/exportDiagrams';
import { escapeHtml, parseFence, resolveModelUri } from '../markdown/fenceParser';
import { installMarkdownPlugin } from '../markdown/markdownItPlugin';
import { assertSafeOutputPath, openPreviewModel } from '../markdown/modelAccess';
import { SysMLElementDTO, SysMLModelResult } from '../providers/sysmlModelTypes';
import { modelSnapshot } from '../visualization/core/modelSnapshot';
import { selectView } from '../visualization/core/viewScope';
import { pollForResult } from './helpers/integrationHelper';

const element = (name: string, type = 'part', attributes = {}): SysMLElementDTO => ({
    name, type, attributes, children: [], relationships: [],
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
});

suite('Markdown diagram fences', () => {
    test('bootstrap discovers diagrams inserted after initial native preview hydration', () => {
        const source = fs.readFileSync(path.join(__dirname,
            '../../media/markdown-preview/bootstrap.js'), 'utf8');
        const scripts: { src?: string; nonce?: string }[] = [];
        let hydrated = false;
        let notifyMutation = (): void => undefined;
        let disconnected = false;
        const listeners = new Map<string, () => void>();
        const body = {};
        vm.runInNewContext(source, {
            URL: globalThis.URL,
            document: {
                currentScript: { src: 'https://preview.test/media/markdown-preview/bootstrap.js', nonce: 'native-nonce' },
                readyState: 'complete', body,
                querySelectorAll: () => hydrated ? [{ isConnected: true }] : [],
                createElement: () => ({}),
                head: { appendChild: (script: { src?: string; nonce?: string }) => scripts.push(script) },
            },
            window: { addEventListener: (name: string, listener: () => void) => listeners.set(name, listener) },
            MutationObserver: class {
                constructor(callback: () => void) { notifyMutation = callback; }
                observe(target: unknown): void { assert.strictEqual(target, body); }
                disconnect(): void { disconnected = true; }
            },
        });
        assert.strictEqual(scripts.length, 0);
        hydrated = true;
        notifyMutation();
        assert.strictEqual(scripts.length, 1);
        assert.strictEqual(scripts[0].src, 'https://preview.test/media/vendor/d3.min.js');
        assert.strictEqual(scripts[0].nonce, 'native-nonce');
        notifyMutation();
        assert.strictEqual(scripts.length, 1, 'Repeated DOM changes must share asset loading.');
        listeners.get('pagehide')?.();
        assert.ok(disconnected, 'The hydration observer must be disposed with the page.');
    });
    test('ordinary Markdown activation defers the host until a command or model needs it', async () => {
        const source = ts.createSourceFile('extension.ts',
            fs.readFileSync(path.join(__dirname, '../../src/extension.ts'), 'utf8'),
            ts.ScriptTarget.Latest, true);
        const activation = source.statements.find(statement => ts.isFunctionDeclaration(statement)
            && statement.name?.text === 'activate');
        assert.ok(activation);
        const commands = new Map<string, (...args: unknown[]) => unknown>();
        let initialized = 0;
        let started = 0;
        let mcpRegistrations = 0;
        const registrations = {
            registerCommand: (name: string, handler: (...args: unknown[]) => unknown) => {
                commands.set(name, handler);
                return { dispose: () => commands.delete(name) };
            },
            executeCommand: (name: string, ...args: unknown[]) => commands.get(name)?.(...args),
        };
        const disposable = { dispose: () => undefined };
        const scope = {
            exports: {} as { activate: (context: unknown) => { ready: () => Promise<void> } },
            vscode: { commands: registrations, env: { uiKind: 1 }, UIKind: { Desktop: 1 },
                workspace: { textDocuments: [{ languageId: 'markdown' }], onDidOpenTextDocument: () => disposable },
                window: { registerTreeDataProvider: () => disposable, onDidChangeActiveTextEditor: () => disposable } },
            registerMcpServer: async () => { mcpRegistrations++; },
            registerMarkdownPreview: (_context: unknown, _provider: unknown, ready: () => Promise<void>) => ({ ready }),
            initializeSysML: () => {
                initialized++;
                registrations.registerCommand('sysml.test', (...args) => args);
            },
            getLanguageClient: () => ({ start: async () => { started++; } }),
        };
        vm.runInNewContext(ts.transpileModule(activation.getText(source), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText, scope);
        const api = scope.exports.activate({ subscriptions: [],
            extension: { packageJSON: { contributes: { commands: [{ command: 'sysml.test' }] } } } });
        assert.strictEqual(initialized, 0);
        assert.strictEqual(started, 0);
        assert.strictEqual(mcpRegistrations, 1);
        assert.deepStrictEqual(registrations.executeCommand('sysml.test', 'argument'), ['argument']);
        assert.strictEqual(initialized, 1);
        await api.ready();
        assert.strictEqual(initialized, 1);
        assert.strictEqual(started, 1);
        assert.strictEqual(mcpRegistrations, 1);
    });
    test('scopes authoritative sequence/activity DTOs, members, and empty results', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../media/diagram-runtime/runtime.js'), 'utf8');
        const start = source.indexOf('function applyViewScope(');
        const end = source.indexOf('// Update diagram selector', start);
        const scope = {
            selectedViewScope: { exposeTargets: ['included'] },
            filterElementsByExposeTargets: (elements: { name: string }[], targets: string[]) =>
                elements.filter(member => targets.includes(member.name)),
        };
        const apply = vm.runInNewContext(`(${source.slice(start, end)})`, scope) as
            (data: Record<string, unknown>) => { sequenceDiagrams: { messages: unknown[] }[]; activityDiagrams: unknown[] };
        const data = {
            elements: [{ name: 'included', children: [] }],
            sequenceDiagrams: [{ name: 'other', participants: [{ name: 'included' }, { name: 'excluded' }],
                messages: [{ from: 'included', to: 'excluded' }] }],
            activityDiagrams: [{ name: 'excluded', actions: [{ name: 'hidden' }], flows: [] }],
        };
        const result = apply(data);
        assert.strictEqual(result.sequenceDiagrams.length, 1);
        assert.strictEqual(result.sequenceDiagrams[0].messages.length, 0);
        assert.strictEqual(result.activityDiagrams.length, 0);
        scope.selectedViewScope.exposeTargets = ['missing'];
        assert.strictEqual(apply(data).sequenceDiagrams.length, 0);
        assert.strictEqual(apply(data).activityDiagrams.length, 0);
    });
    test('export rejects symlink files and directory components before writing', async function () {
        if (!(vscode as unknown as { _isMock?: boolean })._isMock) { this.skip(); }
        const originalStat = vscode.workspace.fs.stat;
        const originalJoin = vscode.Uri.joinPath;
        try {
            vscode.Uri.joinPath = (base, ...segments) => Utils.joinPath(URI.from(base), ...segments);
            for (const linked of ['/work/copy.diagrams', '/work/copy.diagrams/diagram-1.svg']) {
                vscode.workspace.fs.stat = async uri => ({
                    type: uri.path === linked ? vscode.FileType.SymbolicLink : vscode.FileType.Directory,
                    size: 0, ctime: 0, mtime: 0,
                });
                await assert.rejects(assertSafeOutputPath(URI.file('/work/copy.diagrams/diagram-1.svg')),
                    /Symbolic links/);
            }
        } finally {
            vscode.workspace.fs.stat = originalStat;
            vscode.Uri.joinPath = originalJoin;
        }
    });
    test('scoped dropdown preserves arrow markup and inserts model names as text', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../media/diagram-runtime/runtime.js'), 'utf8');
        const owner = source.indexOf('function updateActiveViewButton');
        const start = source.indexOf("const dropdownButton = document.getElementById('view-dropdown-btn');", owner);
        const end = source.indexOf("document.querySelectorAll('#view-dropdown-menu", start);
        assert.ok(owner > 0 && start > owner && end > start);
        const button = { innerHTML: '', lastElementChild: { textContent: '' }, classList: { add() {} } };
        vm.runInNewContext(source.slice(start, end), {
            document: { getElementById: () => button }, activeView: 'table', VIEW_OPTIONS: {},
            selectedViewScope: { name: '<unsafe-name>' }, getSpecViewIcon: () => 'icon',
        });
        assert.ok(button.innerHTML.includes('margin-right: 2px;'));
        assert.ok(button.innerHTML.endsWith('<span></span>'));
        assert.ok(!button.innerHTML.includes('unsafe-name'));
        assert.strictEqual(button.lastElementChild.textContent, 'icon <unsafe-name>');
    });
    test('identical export payloads return the existing SVG instead of timing out', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../media/diagram-runtime/runtime.js'), 'utf8');
        const start = source.indexOf('if (newHash === lastDataHash && currentData)');
        const end = source.indexOf('lastDataHash = newHash;', start);
        assert.ok(start > 0 && end > start);
        const messages: unknown[] = [];
        const message = { exportOnRender: true, exportRequestId: 2 };
        vm.runInNewContext(`(() => { ${source.slice(start, end)} })()`, {
            newHash: 'same', lastDataHash: 'same', currentData: {}, message,
            hideLoading: () => undefined,
            notifyDiagramRendered: () => messages.push(message),
        });
        assert.deepStrictEqual(messages, [message]);
    });
    test('exports each request once, after force simulations and viewport transitions settle', async () => {
        const source = fs.readFileSync(path.join(__dirname, '../../media/diagram-runtime/runtime.js'), 'utf8');
        const start = source.indexOf('async function notifyDiagramRendered(');
        const end = source.indexOf('function exportSVG(', start);
        const messages: unknown[] = [];
        let settle: (() => void) | undefined;
        const scope = {
            disposed: false, isRendering: false, activeSimulations: new Set([{}]),
            currentData: { exportOnRender: true, exportRequestId: 1 }, renderGeneration: 1,
            completedExportRequestId: undefined,
            exportFit: new Promise<void>(resolve => { settle = resolve; }),
            serializeSVG: () => '<svg/>', vscode: { postMessage: (message: unknown) => messages.push(message) },
        };
        const notify = vm.runInNewContext(`(${source.slice(start, end)})`, scope) as () => Promise<void>;
        await notify();
        assert.strictEqual(messages.length, 0);
        scope.activeSimulations.clear();
        const pending = notify();
        assert.strictEqual(messages.length, 0);
        settle?.();
        await pending;
        await notify();
        assert.strictEqual(JSON.stringify(messages), '[{"command":"diagramSVG","requestId":1,"data":"<svg/>"}]');
        scope.currentData.exportRequestId = 2;
        await notify();
        assert.strictEqual(messages.length, 2);
    });

    test('bundled ELK initializes, lays out, and disposes in the dedicated-worker protocol', async function () {
        this.timeout(10000);
        const media = path.join(__dirname, '../../media');
        const messages: { type: string; result?: { children: { x: number }[] } }[] = [];
        let closed = false;
        const scope: Record<string, unknown> = {
            console, setTimeout, clearTimeout,
            postMessage: (message: typeof messages[number]) => messages.push(message),
            close: () => { closed = true; },
        };
        scope.self = scope;
        const context = vm.createContext(scope);
        scope.importScripts = () => vm.runInContext(
            fs.readFileSync(path.join(media, 'vendor/elk.bundled.js'), 'utf8'), context,
        );
        vm.runInContext(fs.readFileSync(path.join(media, 'webview/elkWorker.js'), 'utf8'), context);
        const deliver = (event: { data: Record<string, unknown> }): Promise<void> =>
            vm.runInContext(`self.onmessage(${JSON.stringify(event)})`, context) as Promise<void>;
        await deliver({ data: { type: 'init', elkUri: 'local' } });
        assert.strictEqual(messages[0].type, 'init-complete');
        await deliver({ data: { type: 'layout', id: 1, graph: {
            id: 'root', layoutOptions: { 'elk.algorithm': 'layered' },
            children: [{ id: 'first', width: 100, height: 60 }, { id: 'second', width: 100, height: 60 }],
            edges: [{ id: 'edge', sources: ['first'], targets: ['second'] }],
        } } });
        assert.strictEqual(messages[1].type, 'layout-result');
        assert.ok(messages[1].result && messages[1].result.children[0].x < messages[1].result.children[1].x);
        await deliver({ data: { type: 'dispose' } });
        assert.strictEqual(closed, true);
    });

    test('large-model fallback bypasses only size limits, never symbolic-link checks', async function () {
        if (!(vscode as unknown as { _isMock?: boolean })._isMock) { this.skip(); }
        const originalFolder = vscode.workspace.getWorkspaceFolder;
        const originalStat = vscode.workspace.fs.stat;
        const originalOpen = vscode.workspace.openTextDocument;
        const originalJoin = vscode.Uri.joinPath;
        const folder = { uri: URI.parse('vscode-remote://host/workspace'), name: 'workspace', index: 0 };
        let linked = false;
        try {
            vscode.Uri.joinPath = (base, ...segments) => Utils.joinPath(URI.from(base), ...segments);
            vscode.workspace.getWorkspaceFolder = () => folder;
            vscode.workspace.fs.stat = async () => ({ type: linked ? vscode.FileType.SymbolicLink : vscode.FileType.File,
                size: 3 * 1024 * 1024, ctime: 0, mtime: 0 });
            vscode.workspace.openTextDocument = async () => ({ getText: () => 'model' }) as vscode.TextDocument;
            const uri = URI.parse('vscode-remote://host/workspace/models/example.sysml');
            await assert.rejects(openPreviewModel(uri), /2 MB/);
            assert.strictEqual((await openPreviewModel(uri, false)).getText(), 'model');
            linked = true;
            await assert.rejects(openPreviewModel(uri, false), /Symbolic links/);
        } finally {
            vscode.workspace.getWorkspaceFolder = originalFolder;
            vscode.workspace.fs.stat = originalStat;
            vscode.workspace.openTextDocument = originalOpen;
            vscode.Uri.joinPath = originalJoin;
        }
    });
    test('exports only actual SysML fences and preserves ordinary Markdown and CRLF', () => {
        const source = '# Model\r\n\r\n```sysmlv2-view\r\nmodel: a.sysml\r\n```\r\n\r\n```typescript\r\nlet example = 1;\r\n```\r\n';
        const fences = findExportFences(source);
        assert.strictEqual(fences.length, 1);
        const output = replaceExportFences(source, fences, ['demo.diagrams/diagram-1.svg']);
        assert.ok(output.includes('![SysML diagram 1](<demo.diagrams/diagram-1.svg>)\r\n'));
        assert.ok(output.includes('```typescript\r\nlet example = 1;'));
        assert.ok(!output.includes('sysmlv2-view'));
    });
    test('export preserves bullet, numbered, and quoted list containers', () => {
        for (const prefix of ['- ', '1. ', '> - ', '> > 1. ']) {
            const continuation = prefix.replace(/[^> ]/g, ' ');
            const source = `${prefix}\`\`\`sysmlv2-view\n${continuation}model: a.sysml\n${continuation}\`\`\`\n`;
            const fences = findExportFences(source);
            assert.strictEqual(fences.length, 1);
            const result = replaceExportFences(source, fences, ['demo/1.svg']);
            assert.ok(result.startsWith(`${prefix}![SysML diagram 1]`), result);
            assert.ok(new MarkdownIt().parse(result, {}).some(token => token.type.endsWith('list_open')));
        }
    });
    test('resolves namespace-local custom view inheritance and rejects cycles', () => {
        const namespace = element('Pkg', 'package');
        namespace.children = [
            element('Base', 'view def', { partType: 'SequenceView', viewFilters: '@ActionUsage' }),
            element('Custom', 'view def', { partType: 'Base' }),
            element('chosen', 'view', { partType: 'Custom' }),
        ];
        const selected = selectView([namespace], { model: 'a.sysml', view: 'Pkg::chosen' });
        assert.strictEqual(selected.currentView, 'sequence');
        assert.deepStrictEqual(selected.selectedViewScope?.viewFilters, ['@ActionUsage']);
        namespace.children[0].attributes.partType = 'Custom';
        assert.throws(() => selectView([namespace], { model: 'a.sysml', view: 'Pkg::chosen' }), /Cyclic/);
    });
    test('accepts quoted paths, comments, and supported diagram types', () => {
        assert.deepStrictEqual(parseFence('model: "../Camera Example/Camera.sysml"\nview: takePicture\ndiagram: sequence # diagram'), {
            model: '../Camera Example/Camera.sysml', view: 'takePicture', diagram: 'sequence',
        });
    });

    test('rejects missing, unknown, duplicate, non-scalar, alias and tagged fields', () => {
        for (const source of [
            '', 'view: demo', 'model: a.sysml\nextra: true',
            'model: a.sysml\nmodel: b.sysml', 'model: [a.sysml]',
            'model: *alias', 'model: !!str a.sysml', 'model: a.sysml\ndiagram: invalid',
            'model: a.sysml\ndiagram: __proto__',
        ]) assert.throws(() => parseFence(source), source);
    });

    test('escapes HTML and attribute-breaking model text', () => {
        assert.strictEqual(escapeHtml('<script a="x">&\'</script>'),
            '&lt;script a=&quot;x&quot;&gt;&amp;&#39;&lt;/script&gt;');
    });

    test('resolves paths inside workspace roots and rejects escapes across schemes', () => {
        const original = vscode.Uri.joinPath;
        if ((vscode as unknown as { _isMock?: boolean })._isMock) {
            vscode.Uri.joinPath = (base, ...segments) => Utils.joinPath(URI.from(base), ...segments);
        }
        try {
            const source = vscode.Uri.from({ scheme: 'vscode-remote', authority: 'ssh-remote+test', path: '/work/docs/model.md' });
            const root = vscode.Uri.from({ scheme: source.scheme, authority: source.authority, path: '/work' });
            assert.strictEqual(resolveModelUri('../a.sysml', source, [root]).path, '/work/a.sysml');
            for (const path of ['../../a.sysml', '/work/a.sysml', 'https://host/a.sysml',
                '../a.txt', '..\\a.sysml', '../%2e%2e/a.sysml', '../a.sysml?query', '../a.sysml#fragment']) {
                assert.throws(() => resolveModelUri(path, source, [root]), path);
            }
            assert.throws(() => resolveModelUri('../a.sysml', source, [vscode.Uri.file('/work')]));
        } finally { vscode.Uri.joinPath = original; }
    });

    test('diagram precedence is explicit, rendering, definition type, general', () => {
        const view = element('diagram', 'view', {
            partType: 'StandardViewDefinitions::SequenceView', viewRendering: 'Views::asElementTable',
            exposeTargets: 'System, System::*', viewFilters: '@PartUsage',
        });
        assert.strictEqual(selectView([view], { model: 'a.sysml', view: 'diagram', diagram: 'activity' }).currentView, 'activity');
        assert.strictEqual(selectView([view], { model: 'a.sysml', view: 'diagram' }).currentView, 'table');
        delete view.attributes.viewRendering;
        assert.strictEqual(selectView([view], { model: 'a.sysml', view: 'diagram' }).currentView, 'sequence');
        assert.strictEqual(selectView([], { model: 'a.sysml' }).currentView, 'elk');
        assert.deepStrictEqual(selectView([view], { model: 'a.sysml', view: 'diagram' }).selectedViewScope?.exposeTargets, ['System', 'System::*']);
        assert.throws(() => selectView([view], { model: 'a.sysml', view: 'missing' }));
    });

    test('qualified view names disambiguate same-named view usages', () => {
        const first = element('First', 'package');
        const second = element('Second', 'package');
        first.children = [element('view1', 'view')];
        second.children = [element('view1', 'view')];
        assert.throws(() => selectView([first, second], { model: 'a.sysml', view: 'view1' }));
        assert.ok(selectView([first, second], { model: 'a.sysml', view: 'First::view1' }).selectedViewScope);
    });

    test('snapshot conversion preserves anonymous identities and all diagram DTOs', () => {
        const anonymous = { ...element(''), displayName: ': Engine', symbolId: 'anonymous-1' };
        const snapshot = modelSnapshot({ version: 1, elements: [anonymous], sequenceDiagrams: [], activityDiagrams: [] });
        assert.strictEqual((snapshot.elements as { id: string }[])[0].id, 'anonymous-1');
        assert.deepStrictEqual(snapshot.sequenceDiagrams, []);
    });
});

suite('Markdown diagram cache', () => {
    test('coalesces edits into one active load and retains unchanged Markdown dependencies', async () => {
        let loads = 0;
        const pending: ((value: string) => void)[] = [];
        const cache = new DiagramCache(() => {
            loads++;
            return new Promise<string>(resolve => pending.push(resolve));
        }, () => undefined);
        try {
            cache.lookup('model', 1, 'one.md');
            await Promise.resolve();
            for (let version = 2; version <= 101; version++) cache.invalidate('model', version);
            await new Promise(resolve => setTimeout(resolve, 120));
            assert.strictEqual(loads, 1);
            pending[0]('obsolete');
            await new Promise(resolve => setTimeout(resolve, 0));
            assert.strictEqual(loads, 2);
            pending[1]('current');
            await new Promise(resolve => setTimeout(resolve, 0));
            cache.retainMarkdown('one.md', new Set(['model']));
            assert.strictEqual(cache.lookup('model', 101, 'one.md').value, 'current');
            assert.strictEqual(loads, 2);
            cache.retainMarkdown('one.md', new Set());
            assert.strictEqual(cache.lookup('model', 101, 'one.md').state, 'loading');
        } finally { cache.dispose(); }
    });
    test('bounds active models without causing an eviction-refresh loop', async () => {
        let loads = 0;
        const cache = new DiagramCache(async () => { loads++; return 'model'; }, () => undefined, 1);
        try {
            cache.lookup('first', 1, 'one.md');
            await new Promise(resolve => setTimeout(resolve, 0));
            assert.strictEqual(cache.lookup('second', 1, 'two.md').state, 'error');
            assert.strictEqual(cache.lookup('first', 1, 'one.md').state, 'ready');
            assert.strictEqual(loads, 1);
            cache.forgetMarkdown('one.md');
            assert.strictEqual(cache.lookup('second', 1, 'two.md').state, 'loading');
            await new Promise(resolve => setTimeout(resolve, 0));
            assert.strictEqual(loads, 2);
        } finally { cache.dispose(); }
    });
    test('deduplicates models across fences and batches completion refreshes', async () => {
        let loads = 0;
        let refreshes = 0;
        const cache = new DiagramCache(async () => { loads++; return { name: 'same' }; }, () => refreshes++);
        try {
            cache.lookup('model', 1, 'one.md');
            cache.lookup('model', 1, 'two.md');
            cache.lookup('other', 1, 'one.md');
            await new Promise(resolve => setTimeout(resolve, 140));
            assert.strictEqual(loads, 2);
            assert.strictEqual(refreshes, 1);
            assert.strictEqual(cache.lookup('model', 1, 'one.md').state, 'ready');
            assert.strictEqual(cache.invalidate('unrelated'), false);
        } finally { cache.dispose(); }
    });

    test('ignores stale asynchronous results and results after disposal', async () => {
        const pending: ((value: string) => void)[] = [];
        const cache = new DiagramCache(() => new Promise<string>(resolve => pending.push(resolve)), () => undefined);
        cache.lookup('model', 1, 'one.md');
        await Promise.resolve();
        cache.lookup('model', 2, 'one.md');
        pending[0]('stale');
        await new Promise(resolve => setTimeout(resolve, 120));
        assert.strictEqual(cache.lookup('model', 2, 'one.md').state, 'loading');
        pending[1]('current');
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.strictEqual(cache.lookup('model', 2, 'one.md').value, 'current');
        cache.dispose();
    });

    test('a model edit causes one completion refresh and identical results cause none', async () => {
        let value = 'original';
        let refreshes = 0;
        const cache = new DiagramCache(async () => value, () => refreshes++);
        try {
            cache.lookup('model', 1, 'one.md');
            await new Promise(resolve => setTimeout(resolve, 140));
            refreshes = 0;
            value = 'updated';
            cache.invalidate('model', 2);
            await new Promise(resolve => setTimeout(resolve, 240));
            assert.strictEqual(refreshes, 1);
            refreshes = 0;
            cache.invalidate('model', 3);
            await new Promise(resolve => setTimeout(resolve, 240));
            assert.strictEqual(refreshes, 0);
        } finally { cache.dispose(); }
    });

    test('renders loading, payload, and isolated errors through markdown-it', async function () {
        if (!(vscode as unknown as { _isMock?: boolean })._isMock) { this.skip(); }
        const workspace = vscode.workspace as unknown as { workspaceFolders: { uri: vscode.Uri }[]; textDocuments: vscode.TextDocument[] };
        const previousRoots = workspace.workspaceFolders;
        const previousDocuments = workspace.textDocuments;
        const originalJoin = vscode.Uri.joinPath;
        const cache = new DiagramCache<SysMLModelResult>(async () => ({ version: 1, elements: [element('System')] }), () => undefined);
        try {
            if ((vscode as unknown as { _isMock?: boolean })._isMock) {
                workspace.workspaceFolders = [{ uri: vscode.Uri.file('/work') }];
                workspace.textDocuments = [];
                vscode.Uri.joinPath = (base, ...segments) => Utils.joinPath(URI.from(base), ...segments);
            }
            const markdown = installMarkdownPlugin(new MarkdownIt(), cache);
            const text = '```sysmlv2-view\nmodel: model.sysml\n```\n\n```sysmlv2-view\nunknown: bad\n```\n\n```typescript\nconst test = 1;\n```';
            const environment = { currentDocument: vscode.Uri.file('/work/demo.md').toString() };
            assert.ok(markdown.render(text, environment).includes('sysml-md-loading'));
            await new Promise(resolve => setTimeout(resolve, 0));
            const html = markdown.render(text, environment);
            assert.ok(html.includes('data-payload="{&quot;command&quot;'));
            assert.ok(html.includes('sysml-md-error'));
            assert.ok(html.includes('language-typescript'));
            assert.ok(!html.includes('<script'));
        } finally {
            cache.dispose();
            workspace.workspaceFolders = previousRoots;
            workspace.textDocuments = previousDocuments;
            vscode.Uri.joinPath = originalJoin;
        }
    });
});

suite('Native Markdown preview integration', () => {
    test('renders a workspace model and inline errors through markdown.api.render', async function () {
        if ((vscode as unknown as { _isMock?: boolean })._isMock) { this.skip(); }
        this.timeout(45000);
        const folder = vscode.workspace.workspaceFolders?.[0];
        assert.ok(folder, 'Integration test requires the repository workspace.');
        const uri = vscode.Uri.joinPath(folder.uri, '.markdown-preview-integration.md');
        const content = '```sysmlv2-view\nmodel: Camera Example/camera-sequence.sysml\ndiagram: sequence\n```\n'
            + '\n```sysmlv2-view\nmodel: Camera Example/camera-sequence.sysml\nview: missing-view\n```\n';
        try {
            await vscode.workspace.fs.writeFile(uri, new globalThis.TextEncoder().encode(content));
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.extensions.getExtension('JamieD.sysml-v2-support')?.activate();
            await vscode.extensions.getExtension('vscode.markdown-language-features')?.activate();
            const html = await pollForResult(
                () => vscode.commands.executeCommand<string>('markdown.api.render', document),
                result => !!result?.includes('data-payload=') && result.includes('View not found'),
                35000,
            );
            assert.ok(html?.includes('CaptureSequence'), 'Native Markdown renderer must contain the sequence payload.');
            assert.ok(html?.includes('sysml-md-error'), 'An invalid fence must not stop valid fences.');
        } finally { await vscode.workspace.fs.delete(uri); }
    });
});
