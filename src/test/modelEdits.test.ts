import * as assert from 'assert';
import { ChildProcess, fork } from 'child_process';
import * as vscode from 'vscode';
import { createMessageConnection, IPCMessageReader, IPCMessageWriter, MessageConnection } from 'vscode-jsonrpc/node';
import {
    applySourceEdits,
    editableFields,
    editDeclaration,
    insertMembers, insertVerification, parsePaste,
    relationshipDeclaration,
    requirementDeclaration,
    sourceLinks,
} from '../modelEditing/modelEdits';
import type { ModelSnapshot, PlannedDocument } from '../modelEditing/workbenchModel';
import { buildSnapshot, planOperation, previewChanges, resolveRow } from '../modelEditing/workbenchModel';
import { ModelWorkbenchPanel } from '../panels/modelWorkbenchPanel';
import type { SysMLModelResult } from '../providers/sysmlModelTypes';

function stubWorkspaceFileSystem(overrides: Partial<vscode.FileSystem>): () => void {
    const descriptor = Object.getOwnPropertyDescriptor(vscode.workspace, 'fs');
    assert.ok(descriptor);
    Object.defineProperty(vscode.workspace, 'fs', {
        configurable: true,
        enumerable: descriptor.enumerable,
        writable: true,
        value: { ...vscode.workspace.fs, ...overrides },
    });
    return () => { Object.defineProperty(vscode.workspace, 'fs', descriptor); };
}

suite('Model editing', () => {
    test('opens clicked files and recursively adds folder models without duplicates', async () => {
        const folder = vscode.Uri.file('/models');
        const clicked = vscode.Uri.file('/models/clicked.sysml');
        const nested = vscode.Uri.file('/models/nested/types.kerml');
        const uris = new Map<string, vscode.Uri>();
        let refreshes = 0;
        let searches = 0;
        const originalPanel = ModelWorkbenchPanel.currentPanel;
        const originalFind = vscode.workspace.findFiles;
        const originalError = vscode.window.showErrorMessage;
        const restoreFileSystem = stubWorkspaceFileSystem({
            stat: async target => ({
                type: target.toString() === folder.toString() ? vscode.FileType.Directory : vscode.FileType.File,
                ctime: 0, mtime: 0, size: 0,
            }),
        });
        try {
            ModelWorkbenchPanel.currentPanel = {
                uris, panel: { reveal: () => {} }, refresh: async () => { refreshes++; },
            } as unknown as ModelWorkbenchPanel;
            vscode.workspace.findFiles = async (include, exclude) => {
                searches++;
                const pattern = include as vscode.RelativePattern;
                assert.strictEqual(pattern.baseUri.toString(), folder.toString());
                assert.strictEqual(pattern.pattern, '**/*.{sysml,kerml}');
                assert.strictEqual(exclude, '**/{node_modules,.git}/**');
                return [clicked, nested];
            };
            vscode.window.showErrorMessage = (() => {
                throw new Error('Unexpected Workbench error');
            }) as typeof originalError;
            const provider = {} as Parameters<typeof ModelWorkbenchPanel.createOrShow>[1];
            await ModelWorkbenchPanel.createOrShow(folder, provider, clicked);
            assert.deepStrictEqual([...uris.keys()], [clicked.toString()]);
            assert.strictEqual(searches, 0);
            await ModelWorkbenchPanel.createOrShow(folder, provider, folder);
            assert.deepStrictEqual([...uris.keys()], [clicked.toString(), nested.toString()]);
            assert.strictEqual(searches, 1);
            assert.strictEqual(refreshes, 2);
        } finally {
            ModelWorkbenchPanel.currentPanel = originalPanel;
            restoreFileSystem();
            vscode.workspace.findFiles = originalFind;
            vscode.window.showErrorMessage = originalError;
        }
    });

    test('reports empty folders without opening a workbench', async () => {
        const originalPanel = ModelWorkbenchPanel.currentPanel;
        const originalFind = vscode.workspace.findFiles;
        const originalInfo = vscode.window.showInformationMessage;
        let message: string | undefined;
        const restoreFileSystem = stubWorkspaceFileSystem({
            stat: async () => ({
                type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0,
            }),
        });
        try {
            ModelWorkbenchPanel.currentPanel = undefined;
            vscode.workspace.findFiles = async () => [];
            vscode.window.showInformationMessage = (async (text: string) => {
                message = text;
            }) as typeof originalInfo;
            await ModelWorkbenchPanel.createOrShow(vscode.Uri.file('/extension'),
                {} as Parameters<typeof ModelWorkbenchPanel.createOrShow>[1], vscode.Uri.file('/empty'));
            assert.strictEqual(message, 'No SysML or KerML files found in this folder.');
            assert.strictEqual(ModelWorkbenchPanel.currentPanel, undefined);
        } finally {
            ModelWorkbenchPanel.currentPanel = originalPanel;
            restoreFileSystem();
            vscode.workspace.findFiles = originalFind;
            vscode.window.showInformationMessage = originalInfo;
        }
    });

    test('edits docs and identifiers without touching child declarations or comments', () => {
        const source = 'requirement range {\n doc /* Old */\n attribute limit = 1;\n}';
        const edited = editDeclaration(source, { identifier: 'REQ-2', documentation: 'New' });
        assert.strictEqual(edited,
            "requirement <'REQ-2'> range {\n doc /* New */\n attribute limit = 1;\n}");
        assert.strictEqual(editableFields(edited)?.identifier, 'REQ-2');
        assert.throws(() => editDeclaration('part wheel : A, B;', { typeName: 'C' }));
        assert.throws(() => editDeclaration('part wheel;', { multiplicity: '4..2' }));
    });

    test('converts semicolon bodies and preserves CRLF for new members and docs', () => {
        assert.strictEqual(insertMembers('package Test;', ['part car;'], '\r\n'),
            'package Test {\r\n    part car;\r\n}');
        assert.strictEqual(editDeclaration('requirement range;', { documentation: 'New' }, '\r\n'),
            'requirement range {\r\n    doc /* New */\r\n}');
    });

    test('finds precise explicit links but never links in comments or strings', () => {
        const source = 'package Test { doc /* satisfy ghost by car; */\n'
            + 'satisfy Test::range by Test::car; dependency Test::car to Test::range;\n'
            + 'verification test { objective { verify Test::range; } } }';
        const links = sourceLinks(source);
        assert.deepStrictEqual(links.map(link => link.kind), ['satisfy', 'dependency', 'verify']);
        assert.strictEqual(source.slice(links[0].start, links[0].end),
            'satisfy Test::range by Test::car;');
        assert.strictEqual(relationshipDeclaration('verify', 'Test::test', 'Test::range'),
            'verify Test::range;');
        assert.throws(() => relationshipDeclaration('satisfy', 'Test::car', 'Test::car'));
    });

    test('creates or reuses a verification objective and preserves its existing members', () => {
        const created = insertVerification('verification checkRange;', ['verify Test::range;']);
        assert.ok(created.includes('objective {'));
        assert.ok(created.includes('verify Test::range;'));
        const updated = insertVerification(created, ['verify Test::speed;']);
        assert.strictEqual((updated.match(/objective/g) || []).length, 1);
        assert.ok(updated.includes('verify Test::range;'));
        assert.ok(updated.includes('verify Test::speed;'));
        assert.throws(() => insertVerification('verification test { objective : Target; }', ['verify R;']));
    });

    test('parses spreadsheet quotes and embedded newlines and rejects malformed batches', () => {
        assert.deepStrictEqual(parsePaste('name,documentation\nrange,"Line 1\nLine 2, quoted"',
            ['name', 'documentation']), [{ name: 'range', documentation: 'Line 1\nLine 2, quoted' }]);
        assert.deepStrictEqual(parsePaste('name\tidentifier\nrange\tREQ-1', ['name', 'identifier']),
            [{ name: 'range', identifier: 'REQ-1' }]);
        assert.throws(() => parsePaste('name,name\na,b', ['name']));
        assert.throws(() => parsePaste('name,identifier\na,b,c', ['name', 'identifier']));
    });
    test('creates a typed requirement with identifier and documentation', () => {
        assert.strictEqual(requirementDeclaration({
            name: 'range', identifier: 'REQ-1', documentation: 'At least 100 km.',
            definition: false, typeName: 'Requirements::Range',
        }), "requirement <'REQ-1'> range : Requirements::Range {\n"
            + '    doc /* At least 100 km. */\n}');
    });

    test('rejects source injection in form fields', () => {
        const input = {
            name: 'range', identifier: '', documentation: '', definition: false, typeName: '',
        };
        assert.throws(() => requirementDeclaration({ ...input, documentation: '*/ part injected;' }));
        assert.throws(() => requirementDeclaration({ ...input, typeName: 'Range; part injected' }));
        assert.throws(() => requirementDeclaration({ ...input, identifier: "bad'>" }));
        assert.throws(() => requirementDeclaration({ ...input, name: 'part' }));
    });

    test('rejects stale versions and spans without partially applying a batch', () => {
        const edits = [{ start: 0, end: 4, expected: 'part', text: 'item' }];
        assert.strictEqual(applySourceEdits('part car;', 1, 1, edits), 'item car;');
        assert.throws(() => applySourceEdits('part car;', 1, 2, edits));
        assert.throws(() => applySourceEdits('item car;', 1, 1, edits));
        assert.throws(() => applySourceEdits('part car;', 1, 1, [...edits, ...edits]));
        const insertion = { start: 0, end: 0, expected: '', text: 'part wheel;\n' };
        assert.throws(() => applySourceEdits('part car;', 1, 1, [insertion, insertion]));
    });

    test('host rejects changed reference documents and read-only destinations before applying', async () => {
        const panel = Object.create(ModelWorkbenchPanel.prototype) as {
            snapshot: ModelSnapshot;
            checkVersions(plans: PlannedDocument[]): Promise<vscode.TextDocument[]>;
        };
        panel.snapshot = { rows: [], links: [], documents: ['source', 'target'].map(name => ({
            uri: `file:///${name}.sysml`, label: name, text: `package ${name} {}`, version: 1,
            model: {} as SysMLModelResult,
        })) };
        const live = panel.snapshot.documents.map(source => ({ ...source, uri: vscode.Uri.parse(source.uri),
            getText() { return this.text; } }));
        const originalOpen = vscode.workspace.openTextDocument;
        let writable = true;
        const restoreFileSystem = stubWorkspaceFileSystem({ isWritableFileSystem: () => writable });
        try {
            vscode.workspace.openTextDocument = (async (uri: vscode.Uri) =>
                live.find(document => document.uri.toString() === uri.toString())) as unknown as typeof originalOpen;
            const plans = [{ uri: panel.snapshot.documents[0].uri, version: 1, edits: [] }];
            assert.strictEqual((await panel.checkVersions(plans)).length, 2);
            live[1].version = 2;
            await assert.rejects(panel.checkVersions(plans), /Source changed/);
            live[1].version = 1;
            live[1].text = 'package changed {}';
            await assert.rejects(panel.checkVersions(plans), /Source changed/);
            live[1].text = panel.snapshot.documents[1].text;
            writable = false;
            await assert.rejects(panel.checkVersions(plans), /read-only/);
        } finally {
            vscode.workspace.openTextDocument = originalOpen;
            restoreFileSystem();
        }
    });
});

suite('Workbench with published LSP', function () {
    this.timeout(30000);
    let child: ChildProcess;
    let connection: MessageConnection;
    let sequence = 0;
    interface PublishedDiagnostic { code?: string | number; severity?: number; message: string }
    const publications = new Map<string, (diagnostics: PublishedDiagnostic[]) => void>();

    suiteSetup(async () => {
        child = fork(require('sysml-v2-lsp').serverPath, ['--node-ipc'], { silent: true });
        connection = createMessageConnection(new IPCMessageReader(child), new IPCMessageWriter(child));
        connection.onRequest('client/registerCapability', () => null);
        connection.onRequest('workspace/configuration', (params: { items: unknown[] }) =>
            params.items.map(() => ({})));
        connection.onNotification('textDocument/publishDiagnostics',
            (params: { uri: string; diagnostics: PublishedDiagnostic[] }) => {
                publications.get(params.uri)?.(params.diagnostics);
                publications.delete(params.uri);
            });
        connection.listen();
        await connection.sendRequest('initialize', { processId: process.pid, rootUri: null,
            capabilities: { workspace: { configuration: true } }, workspaceFolders: [] });
        await connection.sendNotification('initialized', {});
    });

    suiteTeardown(() => { connection?.dispose(); child?.kill(); });

    async function snapshotFor(text: string) {
        const uri = `file:///workbench-test-${++sequence}.sysml`;
        const published = new Promise<PublishedDiagnostic[]>(resolve => publications.set(uri, resolve));
        await connection.sendNotification('textDocument/didOpen', {
            textDocument: { uri, languageId: 'sysml', version: 1, text },
        });
        const model = await connection.sendRequest<SysMLModelResult>('sysml/model',
            { textDocument: { uri }, scope: ['elements', 'relationships', 'diagnostics'] });
        assert.strictEqual(model.version, 1);
        assert.ok(model.elements?.length, 'Parser should return model elements');
        const syntax = (await published).filter(diagnostic =>
            (!diagnostic.code && diagnostic.severity === 1)
            || String(diagnostic.code).includes('syntax')
            || /extraneous input|mismatched input|no viable alternative/i.test(diagnostic.message));
        assert.deepStrictEqual(syntax, [], 'Source has syntax errors');
        return buildSnapshot([{ uri, label: 'model.sysml', version: 1, text, model }]);
    }

    test('deletes requirement and container declarations without changing adjacent source', async () => {
        const text = 'package Mobility {\r\n    private requirement def Range;\r\n'
            + '    part car { part wheel; }\r\n    part keep;\r\n}\r\n';
        const snapshot = await snapshotFor(text);
        for (const [name, removed] of [
            ['Range', '    private requirement def Range;\r\n'],
            ['car', '    part car { part wheel; }\r\n'],
        ]) {
            const row = snapshot.rows.find(candidate => candidate.name === name);
            assert.ok(row);
            const plans = planOperation(snapshot, { kind: 'deleteElement', id: row.id });
            const result = applySourceEdits(text, 1, 1, plans[0].edits);
            assert.strictEqual(result, text.replace(removed, ''));
            const updated = await snapshotFor(result);
            assert.ok(!updated.rows.some(candidate => candidate.name === name));
            assert.ok(updated.rows.some(candidate => candidate.name === 'keep'));
        }
        const inline = await snapshotFor('part front; part rear;');
        const plans = planOperation(inline, { kind: 'deleteElement', id: inline.rows[0].id });
        assert.strictEqual(applySourceEdits(inline.documents[0].text, 1, 1, plans[0].edits), ' part rear;');
        assert.throws(() => planOperation(inline, { kind: 'deleteElement', id: 'missing' }), /no longer exists/);
    });

    test('requires external relationships to be removed before deleting their endpoints', async () => {
        const snapshot = await snapshotFor('package Test { requirement target; part source;'
            + ' satisfy Test::target by Test::source; }');
        for (const name of ['target', 'source']) {
            const row = snapshot.rows.find(candidate => candidate.name === name);
            assert.ok(row);
            assert.throws(() => planOperation(snapshot, { kind: 'deleteElement', id: row.id }),
                /Remove relationships/);
        }
        const container = snapshot.rows.find(row => row.name === 'Test');
        assert.ok(container);
        const plans = planOperation(snapshot, { kind: 'deleteElement', id: container.id });
        assert.strictEqual(applySourceEdits(snapshot.documents[0].text, 1, 1, plans[0].edits), '');
        const consumer = await snapshotFor('package Consumer { part vehicle;'
            + ' satisfy Test::target by Consumer::vehicle; }');
        const combined = buildSnapshot([...snapshot.documents, ...consumer.documents]);
        assert.throws(() => planOperation(combined, { kind: 'deleteElement', id: container.id }),
            /Remove relationships/);
    });

    test('refreshes the model version after inserting a requirement into an open document', async () => {
        const snapshot = await snapshotFor('package Mobility {}');
        const source = snapshot.documents[0];
        const text = 'package Mobility { requirement def AddedRequirement; }';
        await connection.sendNotification('textDocument/didChange', {
            textDocument: { uri: source.uri, version: 2 }, contentChanges: [{ text }],
        });
        const model = await connection.sendRequest<SysMLModelResult>('sysml/model', {
            textDocument: { uri: source.uri }, scope: ['elements', 'relationships'],
        });
        assert.strictEqual(model.version, 2);
        const updated = buildSnapshot([{ ...source, version: 2, text, model }]);
        assert.ok(updated.rows.some(row => row.name === 'AddedRequirement'));
        const messages: { command: string; rows?: { name: string }[] }[] = [];
        const panel = Object.assign(Object.create(ModelWorkbenchPanel.prototype), {
            uris: new Map([[source.uri, vscode.Uri.parse(source.uri)]]),
            snapshot, revision: 1, generation: 0, disposed: false,
            pending: { token: 'applied-preview', plans: [] },
            provider: {
                invalidateCache: () => {},
                getModel: (uri: string, scope: string[]) =>
                    connection.sendRequest('sysml/model', { textDocument: { uri }, scope }),
            },
            post: async (message: { command: string }) => { messages.push(message); },
        });
        const originalOpen = vscode.workspace.openTextDocument;
        try {
            vscode.workspace.openTextDocument = (async () => ({ version: 2, getText: () => text })) as
                unknown as typeof originalOpen;
            await panel.refresh();
            assert.deepStrictEqual(messages.map(message => message.command), ['snapshot']);
            assert.ok(messages[0].rows?.some(row => row.name === 'AddedRequirement'));
            assert.strictEqual(panel.pending, undefined);
            assert.strictEqual(panel.snapshot.documents[0].version, 2);
        } finally {
            vscode.workspace.openTextDocument = originalOpen;
        }
    });

    test('creates requirements, edits cells, adds/retargets/deletes links and parses the results', async () => {
        let text = 'package Mobility {\nrequirement def RangeSpec;\n'
            + "requirement <'REQ-1'> range : RangeSpec { doc /* 100 km */ }\n"
            + 'requirement backup;\npart vehicle;\nverification checkRange;\n}';
        let snapshot = await snapshotFor(text);
        const find = (name: string) => {
            const row = resolveRow(snapshot.rows, `Mobility::${name}`);
            assert.ok(row, `Missing row ${name}`);
            return row;
        };
        const apply = async (plans: ReturnType<typeof planOperation>) => {
            assert.strictEqual(plans.length, 1);
            text = applySourceEdits(text, 1, 1, plans[0].edits);
            snapshot = await snapshotFor(text);
        };
        await apply(planOperation(snapshot, { kind: 'cells', cells: [{ id: find('range').id,
            fields: { documentation: '200 km', identifier: 'REQ-2' } }] }));
        assert.strictEqual(find('range').fields?.identifier, 'REQ-2');
        await apply(planOperation(snapshot, { kind: 'relationship', type: 'satisfy',
            sourceId: find('vehicle').id, targetId: find('range').id }));
        await apply(planOperation(snapshot, { kind: 'relationship', type: 'verify',
            sourceId: find('checkRange').id, targetId: find('range').id }));
        assert.ok(snapshot.links.some(link => link.kind === 'verify' && link.sourceId === find('checkRange').id));
        assert.strictEqual(snapshot.links.filter(link => link.kind === 'verify').length, 1);
        const link = snapshot.links.find(candidate => candidate.kind === 'satisfy' && candidate.start !== undefined);
        assert.ok(link);
        await apply(planOperation(snapshot, { kind: 'relationship', type: 'satisfy', linkId: link.id,
            sourceId: find('vehicle').id, targetId: find('backup').id }));
        const updated = snapshot.links.find(candidate => candidate.kind === 'satisfy' && candidate.start !== undefined);
        assert.ok(updated);
        assert.strictEqual(updated.targetId, find('backup').id);
        await apply(planOperation(snapshot, { kind: 'deleteRelationship', linkId: updated.id }));
        assert.ok(!text.includes('satisfy '));
        const parent = resolveRow(snapshot.rows, 'Mobility');
        assert.ok(parent);
        await apply(planOperation(snapshot, { kind: 'paste', mode: 'requirements',
            uri: parent.uri, parentId: parent.id,
            text: 'name\tidentifier\tdocumentation\ttypeName\nnewRange\tREQ-3\t300 km\tMobility::RangeSpec' }));
        assert.strictEqual(find('newRange').fields?.identifier, 'REQ-3');
        await apply(planOperation(snapshot, { kind: 'paste', mode: 'updates', uri: '', parentId: '',
            text: 'qualifiedName,documentation\nMobility::newRange,"400 km, minimum"' }));
        assert.strictEqual(find('newRange').fields?.documentation, '400 km, minimum');
        await apply(planOperation(snapshot, { kind: 'paste', mode: 'relationships', uri: '', parentId: '',
            text: 'kind,source,target\ndependency,Mobility::vehicle,Mobility::newRange' }));
        assert.ok(snapshot.links.some(candidate => candidate.kind === 'dependency'));
        assert.throws(() => planOperation(snapshot, { kind: 'relationship', type: 'verify',
            sourceId: find('vehicle').id, targetId: find('range').id }));
    });

    test('rejects identifier collisions in either row order and invalid batches atomically', async () => {
        const snapshot = await snapshotFor("package Test { requirement <'A'> initialReq; requirement <'B'> nextReq; }");
        const first = resolveRow(snapshot.rows, 'Test::initialReq');
        const second = resolveRow(snapshot.rows, 'Test::nextReq');
        assert.ok(first && second);
        for (const [row, identifier] of [[first, 'B'], [second, 'A']] as const) {
            assert.throws(() => planOperation(snapshot, { kind: 'cells',
                cells: [{ id: row.id, fields: { identifier } }] }), /Duplicate identifier/);
        }
        assert.throws(() => planOperation(snapshot, { kind: 'paste', mode: 'updates',
            uri: '', parentId: '', text: 'qualifiedName,identifier\nTest::initialReq,C\nTest::missing,D' }));
        assert.strictEqual(first.fields?.identifier, 'A');
        const plans = planOperation(snapshot, { kind: 'cells',
            cells: [{ id: first.id, fields: { identifier: 'C' } }] });
        assert.ok(previewChanges(snapshot, plans)[0].before.includes("requirement <'A'> initialReq"));
        assert.ok(previewChanges(snapshot, plans)[0].after.includes("requirement <'C'> initialReq"));
    });

    test('resolves scoped names conservatively and links explicitly loaded files', async () => {
        const library = await snapshotFor('package Library { requirement range; }');
        const consumer = await snapshotFor('package Consumer { part vehicle; }');
        const snapshot = buildSnapshot([...library.documents, ...consumer.documents]);
        const source = resolveRow(snapshot.rows, 'Consumer::vehicle');
        const target = resolveRow(snapshot.rows, 'Library::range');
        assert.ok(source && target);
        const plans = planOperation(snapshot, { kind: 'relationship', type: 'satisfy',
            sourceId: source.id, targetId: target.id });
        assert.strictEqual(plans[0].uri, source.uri);
        assert.ok(plans[0].edits.some(edit => edit.text.includes('satisfy Library::range by Consumer::vehicle;')));
        const ambiguous = buildSnapshot([...library.documents, ...library.documents]);
        assert.strictEqual(resolveRow(ambiguous.rows, 'Library::range'), undefined);
        const packageRow = resolveRow(snapshot.rows, 'Consumer');
        assert.ok(packageRow);
        assert.throws(() => planOperation(snapshot, { kind: 'requirements',
            uri: packageRow.uri, parentId: packageRow.id, items: [{ name: 'newRange', identifier: '',
                documentation: '', definition: false, typeName: 'Library::Missing' }] }));
    });

    test('syntax validation rejects a malformed control declaration', async () => {
        await assert.rejects(snapshotFor('package Broken { requirement range : ; }'), /Source has syntax errors/);
    });
});
