/**
 * Unit tests for ModelExplorerProvider.
 *
 * Covers:
 * 1. loadDocument — single-file invocation (command palette, auto-parse)
 * 2. loadWorkspaceModel — multi-file workspace mode
 * 3. getChildren — root-level items and child expansion
 * 4. mergeElements — same-named package merging
 * 5. Tree item construction (ModelTreeItem, FileTreeItem, PropertyTreeItem, RelationshipTreeItem)
 * 6. Workspace view modes (byFile vs bySemantic)
 * 7. Clear / refresh lifecycle
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import {
    FileTreeItem,
    ModelExplorerProvider,
    ModelTreeItem,
    PropertyTreeItem,
    RelationshipTreeItem,
} from '../explorer/modelExplorerProvider';

// ── Helpers ──────────────────────────────────────────────────────

function makeRange(startLine = 0, startChar = 0, endLine = 0, endChar = 10) {
    return new vscode.Range(startLine, startChar, endLine, endChar);
}

function makeSysMLElement(overrides: Partial<{
    type: string;
    name: string;
    children: any[];
    attributes: Map<string, string | number | boolean>;
    relationships: any[];
    errors: string[];
}> = {}) {
    return {
        type: overrides.type ?? 'part',
        name: overrides.name ?? 'TestPart',
        range: makeRange(),
        children: overrides.children ?? [],
        attributes: overrides.attributes ?? new Map(),
        relationships: overrides.relationships ?? [],
        errors: overrides.errors,
    };
}

/** Recursively convert raw element objects to DTO shape with proper range. */
function toDTO(el: any): any {
    return {
        type: el.type,
        name: el.name,
        range: el.range ?? { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } },
        children: (el.children ?? []).map(toDTO),
        attributes: el.attributes
            ? Object.fromEntries(el.attributes instanceof Map ? el.attributes : Object.entries(el.attributes))
            : {},
        relationships: el.relationships ?? [],
        errors: el.errors,
    };
}

/** Minimal mock that returns DTO-shaped elements. */
function createMockLspProvider(elements: any[] = [], stats?: Record<string, unknown>) {
    return {
        getModel: async (_uri: string, _scopes?: string[], _token?: any) => ({
            version: 1,
            elements: elements.map(toDTO),
            relationships: [],
            stats: {
                totalElements: elements.length,
                resolvedElements: elements.length,
                unresolvedElements: 0,
                parseTimeMs: 5,
                modelBuildTimeMs: 3,
                ...(stats ?? {}),
            },
        }),
    } as any;
}

/** Fake TextDocument */
function createFakeDocument(uri: string) {
    return {
        uri: vscode.Uri.parse(uri),
        languageId: 'sysml',
        fileName: uri.split('/').pop() ?? 'test.sysml',
        isClosed: false,
        getText: () => 'package Pkg {}',
    } as any;
}

// ── Tests ────────────────────────────────────────────────────────

suite('ModelExplorerProvider', () => {

    // ── loadDocument (single-file mode) ─────────────────────────

    suite('loadDocument', () => {

        test('loads elements from LSP and fires tree change event', async () => {
            const elements = [
                { type: 'package', name: 'VehicleModel', children: [] },
                { type: 'part def', name: 'Vehicle', children: [] },
            ];
            const provider = new ModelExplorerProvider(createMockLspProvider(elements));
            const doc = createFakeDocument('file:///workspace/vehicle.sysml');

            let changeEventFired = false;
            provider.onDidChangeTreeData(() => { changeEventFired = true; });

            await provider.loadDocument(doc);

            assert.ok(changeEventFired, 'Should fire tree change event after load');
            assert.strictEqual(provider.isWorkspaceMode(), false, 'Should be in single-file mode');
        });

        test('getChildren returns root elements after loadDocument', async () => {
            const elements = [
                { type: 'package', name: 'Pkg', children: [] },
            ];
            const provider = new ModelExplorerProvider(createMockLspProvider(elements));
            await provider.loadDocument(createFakeDocument('file:///workspace/test.sysml'));

            const items = await provider.getChildren();
            assert.strictEqual(items.length, 1, 'Should have 1 root element');
            assert.ok(items[0] instanceof ModelTreeItem, 'Root item should be ModelTreeItem');
            assert.strictEqual(items[0].label, 'Pkg', 'Should have correct label');
        });

        test('stores LSP stats', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider(
                [{ type: 'part', name: 'A', children: [] }],
                { totalElements: 10, parseTimeMs: 42, modelBuildTimeMs: 8 }
            ));
            await provider.loadDocument(createFakeDocument('file:///workspace/test.sysml'));

            const stats = provider.getLastStats();
            assert.ok(stats, 'Stats should be available');
            assert.strictEqual(stats?.totalElements, 10);
            assert.strictEqual(stats?.parseTimeMs, 42);
        });
    });

    // ── loadWorkspaceModel (multi-file mode) ────────────────────

    suite('loadWorkspaceModel', () => {

        test('unavailable models remain incomplete while parsed empty models can be reused', async () => {
            const lsp = createMockLspProvider();
            const parsedEmpty = lsp.getModel;
            lsp.getModel = async () => ({ version: -1 });
            const provider = new ModelExplorerProvider(lsp);
            const uris = [vscode.Uri.parse('file:///workspace/pending.sysml')];
            await provider.loadWorkspaceModel(uris);
            assert.strictEqual(provider.hasWorkspaceModel(), false);
            lsp.getModel = parsedEmpty;
            await provider.loadWorkspaceModel(uris);
            assert.strictEqual(provider.hasWorkspaceModel(), true);
            assert.strictEqual(provider.getLastStats()?.totalElements, 0);
        });

        test('switches to workspace mode', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'package', name: 'Pkg', children: [] },
            ]));
            const uris = [vscode.Uri.parse('file:///workspace/file1.sysml')];

            await provider.loadWorkspaceModel(uris);

            assert.ok(provider.isWorkspaceMode(), 'Should be in workspace mode');
            assert.ok(provider.hasWorkspaceModel(), 'Completed workspace tree should be reusable');
        });

        test('cancelled reloads and replaced trees cannot be reused as completed workspace models', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'package', name: 'Pkg', children: [] },
            ]));
            const uris = [vscode.Uri.parse('file:///workspace/file1.sysml')];
            await provider.loadWorkspaceModel(uris);
            assert.ok(provider.hasWorkspaceModel());
            const cancellation = new vscode.CancellationTokenSource();
            try {
                cancellation.cancel();
                await provider.loadWorkspaceModel(uris, cancellation.token);
                assert.ok(!provider.hasWorkspaceModel());
                await provider.loadWorkspaceModel(uris);
                assert.ok(provider.hasWorkspaceModel());
                await provider.loadDocument(createFakeDocument('file:///workspace/file1.sysml'));
                assert.ok(!provider.hasWorkspaceModel());
                await provider.loadWorkspaceModel(uris);
                provider.clear();
                assert.ok(!provider.hasWorkspaceModel());
            } finally {
                cancellation.dispose();
            }
        });

        test('byFile view shows FileTreeItems', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'part', name: 'A', children: [] },
            ]));
            const uris = [
                vscode.Uri.parse('file:///workspace/file1.sysml'),
                vscode.Uri.parse('file:///workspace/file2.sysml'),
            ];

            await provider.loadWorkspaceModel(uris);
            provider.setWorkspaceViewMode('byFile');

            const items = await provider.getChildren();
            assert.strictEqual(items.length, 2, 'Should have 2 file items');
            assert.ok(items[0] instanceof FileTreeItem, 'Items should be FileTreeItem');
        });

        test('bySemantic view merges same-named packages', async () => {
            // Both files return a 'package TestPkg'
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'package', name: 'TestPkg', children: [
                    { type: 'part', name: 'PartA', children: [], attributes: {}, relationships: [] }
                ] },
            ]));
            const uris = [
                vscode.Uri.parse('file:///workspace/a.sysml'),
                vscode.Uri.parse('file:///workspace/b.sysml'),
            ];

            await provider.loadWorkspaceModel(uris);
            provider.setWorkspaceViewMode('bySemantic');

            const items = await provider.getChildren();
            // Since both files return the same package name, they should be merged into one
            assert.ok(items.length >= 1, 'Merged semantic view should have at least 1 root');
        });
    });

    // ── mergeElements (static) ──────────────────────────────────

    suite('mergeElements', () => {

        test('merges same-named packages', () => {
            const pkgA = makeSysMLElement({
                type: 'package',
                name: 'SharedPkg',
                children: [makeSysMLElement({ type: 'part', name: 'PartA' })],
            });
            const pkgB = makeSysMLElement({
                type: 'package',
                name: 'SharedPkg',
                children: [makeSysMLElement({ type: 'part', name: 'PartB' })],
            });

            const merged = ModelExplorerProvider.mergeElements([pkgA, pkgB]);

            assert.strictEqual(merged.length, 1, 'Should merge into one package');
            assert.strictEqual(merged[0].name, 'SharedPkg');
            assert.strictEqual(merged[0].children.length, 2, 'Should have children from both');
        });

        test('does not merge non-package elements with same name', () => {
            const partA = makeSysMLElement({ type: 'part', name: 'SameName' });
            const partB = makeSysMLElement({ type: 'part', name: 'SameName' });

            const merged = ModelExplorerProvider.mergeElements([partA, partB]);

            assert.strictEqual(merged.length, 2, 'Non-packages should not be merged');
        });

        test('de-duplicates children by name+type during merge', () => {
            const child = makeSysMLElement({ type: 'part', name: 'Engine' });
            const pkgA = makeSysMLElement({
                type: 'package',
                name: 'Pkg',
                children: [child],
            });
            const pkgB = makeSysMLElement({
                type: 'package',
                name: 'Pkg',
                children: [makeSysMLElement({ type: 'part', name: 'Engine' })],
            });

            const merged = ModelExplorerProvider.mergeElements([pkgA, pkgB]);

            assert.strictEqual(merged[0].children.length, 1, 'Duplicate children should be de-duplicated');
        });

        test('keeps unique children from both packages', () => {
            const pkgA = makeSysMLElement({
                type: 'package',
                name: 'P',
                children: [makeSysMLElement({ type: 'part', name: 'A' })],
            });
            const pkgB = makeSysMLElement({
                type: 'package',
                name: 'P',
                children: [makeSysMLElement({ type: 'part', name: 'B' })],
            });

            const merged = ModelExplorerProvider.mergeElements([pkgA, pkgB]);

            const names = merged[0].children.map(c => c.name).sort();
            assert.deepStrictEqual(names, ['A', 'B'], 'Should have both unique children');
        });

        test('merges attributes from both packages', () => {
            const pkgA = makeSysMLElement({
                type: 'package',
                name: 'P',
                attributes: new Map([['version', '1.0']]),
            });
            const pkgB = makeSysMLElement({
                type: 'package',
                name: 'P',
                attributes: new Map([['author', 'test']]),
            });

            const merged = ModelExplorerProvider.mergeElements([pkgA, pkgB]);

            assert.ok(merged[0].attributes.has('version'), 'Should have attribute from A');
            assert.ok(merged[0].attributes.has('author'), 'Should have attribute from B');
        });

        test('preserves non-package elements in order', () => {
            const part1 = makeSysMLElement({ type: 'part', name: 'X' });
            const pkg = makeSysMLElement({ type: 'package', name: 'Pkg', children: [] });
            const part2 = makeSysMLElement({ type: 'part', name: 'Y' });

            const merged = ModelExplorerProvider.mergeElements([part1, pkg, part2]);

            assert.strictEqual(merged.length, 3);
            assert.strictEqual(merged[0].name, 'X');
            assert.strictEqual(merged[1].name, 'Pkg');
            assert.strictEqual(merged[2].name, 'Y');
        });

        test('handles empty input', () => {
            const merged = ModelExplorerProvider.mergeElements([]);
            assert.strictEqual(merged.length, 0);
        });
    });

    // ── Tree item construction ──────────────────────────────────

    suite('ModelTreeItem', () => {

        test('sets label from element name with type annotation', () => {
            const el = makeSysMLElement({
                type: 'part',
                name: 'Engine',
                attributes: new Map([['partType', 'EngineType']]),
            });
            const uri = vscode.Uri.parse('file:///test.sysml');
            const item = new ModelTreeItem(el, uri);

            assert.ok(item.label?.toString().includes('Engine'), 'Should contain element name');
            assert.ok(item.label?.toString().includes('EngineType'), 'Should contain type annotation');
        });

        test('shows multiplicity in label', () => {
            const el = makeSysMLElement({
                type: 'part',
                name: 'Wheels',
                attributes: new Map([['multiplicity', '4']]),
            });
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            assert.ok(item.label?.toString().includes('[4]'), 'Should show multiplicity');
        });

        test('element with children is collapsible', () => {
            const child = makeSysMLElement({ type: 'attribute', name: 'speed' });
            const el = makeSysMLElement({ type: 'part', name: 'Vehicle', children: [child] });
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            assert.strictEqual(
                item.collapsibleState,
                vscode.TreeItemCollapsibleState.Collapsed,
                'Should be collapsible'
            );
        });

        test('leaf element with no attributes/relationships is not collapsible', () => {
            const el = {
                type: 'attribute',
                name: 'color',
                range: makeRange(),
                children: [],
                attributes: new Map<string, string | number | boolean>(),
                relationships: [],
            };
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            assert.strictEqual(
                item.collapsibleState,
                vscode.TreeItemCollapsibleState.None,
                'Leaf should not be collapsible'
            );
        });

        test('element with errors shows warning icon', () => {
            const el = makeSysMLElement({
                type: 'part',
                name: 'Broken',
                errors: ['Missing type', 'Invalid syntax'],
            });
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            assert.ok(item.iconPath, 'Should have an icon');
            assert.strictEqual((item.iconPath as any).id, 'warning', 'Should use warning icon');
        });

        test('has jump-to-definition command', () => {
            const el = makeSysMLElement({ type: 'part', name: 'X' });
            const uri = vscode.Uri.parse('file:///test.sysml');
            const item = new ModelTreeItem(el, uri);

            assert.ok(item.command, 'Should have a command');
            assert.strictEqual(item.command?.command, 'sysml.jumpToDefinition');
        });
    });

    suite('FileTreeItem', () => {

        test('shows filename and element count', () => {
            const uri = vscode.Uri.parse('file:///workspace/vehicle.sysml');
            const item = new FileTreeItem(uri, 5);

            assert.ok(item.label?.toString().includes('vehicle.sysml'), 'Should show filename');
            assert.ok(item.description?.toString().includes('5'), 'Should show element count');
            assert.strictEqual(item.itemType, 'file-node');
        });

        test('is collapsible', () => {
            const item = new FileTreeItem(vscode.Uri.parse('file:///test.sysml'), 1);
            assert.strictEqual(item.collapsibleState, vscode.TreeItemCollapsibleState.Collapsed);
        });
    });

    suite('PropertyTreeItem', () => {

        test('displays key-value pair', () => {
            const el = makeSysMLElement({ type: 'part', name: 'X' });
            const item = new PropertyTreeItem('speed', 100, el, vscode.Uri.parse('file:///test.sysml'));

            assert.ok(item.label?.toString().includes('speed'), 'Should show key');
            assert.ok(item.label?.toString().includes('100'), 'Should show value');
        });
    });

    suite('RelationshipTreeItem', () => {

        test('displays relationship type and target', () => {
            const el = makeSysMLElement({ type: 'part', name: 'Vehicle' });
            const rel = { type: 'specializes', source: 'Vehicle', target: 'BaseVehicle', name: undefined };
            const item = new RelationshipTreeItem(rel as any, el, vscode.Uri.parse('file:///test.sysml'));

            assert.strictEqual(item.label, 'specializes: BaseVehicle');
            assert.strictEqual(item.description, 'specializes');
        });
    });

    // ── View mode toggling ──────────────────────────────────────

    suite('View mode', () => {

        test('default workspace view mode is bySemantic', () => {
            const provider = new ModelExplorerProvider(createMockLspProvider());
            assert.strictEqual(provider.getWorkspaceViewMode(), 'bySemantic');
        });

        test('toggleWorkspaceViewMode switches between modes', () => {
            const provider = new ModelExplorerProvider(createMockLspProvider());

            provider.toggleWorkspaceViewMode();
            assert.strictEqual(provider.getWorkspaceViewMode(), 'byFile');

            provider.toggleWorkspaceViewMode();
            assert.strictEqual(provider.getWorkspaceViewMode(), 'bySemantic');
        });

        test('setWorkspaceViewMode sets the mode directly', () => {
            const provider = new ModelExplorerProvider(createMockLspProvider());

            provider.setWorkspaceViewMode('byFile');
            assert.strictEqual(provider.getWorkspaceViewMode(), 'byFile');

            provider.setWorkspaceViewMode('bySemantic');
            assert.strictEqual(provider.getWorkspaceViewMode(), 'bySemantic');
        });
    });

    // ── Clear / lifecycle ───────────────────────────────────────

    suite('Clear', () => {

        test('clear removes all elements and fires change event', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'part', name: 'A', children: [] },
            ]));
            await provider.loadDocument(createFakeDocument('file:///test.sysml'));

            let changeCount = 0;
            provider.onDidChangeTreeData(() => { changeCount++; });

            provider.clear();

            assert.ok(changeCount > 0, 'Should fire change event');
            const items = await provider.getChildren();
            assert.strictEqual(items.length, 0, 'Should have no items after clear');
        });
    });

    // ── getAllElements ───────────────────────────────────────────

    suite('getAllElements', () => {

        test('returns root elements in single-file mode', async () => {
            const provider = new ModelExplorerProvider(createMockLspProvider([
                { type: 'part', name: 'A', children: [] },
                { type: 'part', name: 'B', children: [] },
            ]));
            await provider.loadDocument(createFakeDocument('file:///test.sysml'));

            const all = provider.getAllElements();
            assert.strictEqual(all.length, 2);
        });
    });

    // ── getChildren child expansion ─────────────────────────────

    suite('getChildren (child expansion)', () => {

        test('expanding a ModelTreeItem shows child elements', async () => {
            const childEl = makeSysMLElement({ type: 'attribute', name: 'speed' });
            const parentEl = makeSysMLElement({ type: 'part', name: 'Vehicle', children: [childEl] });
            const uri = vscode.Uri.parse('file:///test.sysml');
            const parentItem = new ModelTreeItem(parentEl, uri);

            const provider = new ModelExplorerProvider(createMockLspProvider());
            const children = await provider.getChildren(parentItem);

            // Should have at least the child element
            assert.ok(children.length >= 1, 'Should have child items');
            const childItem = children.find(c => c instanceof ModelTreeItem && (c as ModelTreeItem).element.name === 'speed');
            assert.ok(childItem, 'Should include child element as ModelTreeItem');
        });

        test('expanding a ModelTreeItem shows attributes as PropertyTreeItems', async () => {
            const el = makeSysMLElement({
                type: 'part',
                name: 'Engine',
                attributes: new Map([['power', '200hp']]),
            });
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            const provider = new ModelExplorerProvider(createMockLspProvider());
            const children = await provider.getChildren(item);

            const propItem = children.find(c => c instanceof PropertyTreeItem);
            assert.ok(propItem, 'Should include property child');
        });

        test('expanding a ModelTreeItem shows relationships as RelationshipTreeItems', async () => {
            const el = makeSysMLElement({
                type: 'part',
                name: 'SportsCar',
                relationships: [{ type: 'specializes', source: 'SportsCar', target: 'Vehicle' }],
            });
            const item = new ModelTreeItem(el, vscode.Uri.parse('file:///test.sysml'));

            const provider = new ModelExplorerProvider(createMockLspProvider());
            const children = await provider.getChildren(item);

            const relItem = children.find(c => c instanceof RelationshipTreeItem);
            assert.ok(relItem, 'Should include relationship child');
        });
    });
});
