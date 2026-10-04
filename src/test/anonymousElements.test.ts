/**
 * Tests for anonymous-element handling with sysml-v2-lsp 0.33+ `sysml/model`
 * output: `displayName`, `symbolId`, and relationships that report `sourceId`.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ModelExplorerProvider, ModelTreeItem, dtosToSysMLElements } from '../explorer/modelExplorerProvider';
import { displayNameOf, elementKey, relationshipSource } from '../providers/modelNames';
import type { SysMLElementDTO } from '../providers/sysmlModelTypes';

const range = { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } };

function dto(overrides: Partial<SysMLElementDTO>): SysMLElementDTO {
    return {
        type: 'part',
        name: '',
        range,
        children: [],
        attributes: {},
        relationships: [],
        ...overrides,
    };
}

/** An anonymous typed part as reported by 0.33: `part : Engine[2];` */
const anonymousPart = (symbolId: string) => dto({
    displayName: ': Engine[2]',
    symbolId,
    attributes: { partType: 'Engine', multiplicity: '2', isAnonymous: true },
    relationships: [{ type: 'typing', source: '', sourceId: symbolId, target: 'Engine' }],
});

suite('Anonymous element names (sysml-v2-lsp 0.33+)', () => {

    test('displayNameOf prefers displayName and falls back to name for older servers', () => {
        assert.strictEqual(displayNameOf(dto({ name: '', displayName: 'x\u2192y' })), 'x\u2192y');
        assert.strictEqual(displayNameOf(dto({ name: 'engine' })), 'engine');
    });

    test('elementKey distinguishes anonymous siblings by symbolId', () => {
        const [a, b] = dtosToSysMLElements([anonymousPart('id-a'), anonymousPart('id-b')]);
        assert.strictEqual(a.name, b.name, 'Both show the same display name');
        assert.notStrictEqual(elementKey(a), elementKey(b));
        assert.strictEqual(elementKey(dto({ name: 'engine' })), 'part::engine');
    });

    test('relationshipSource resolves an anonymous source from sourceId', () => {
        const names = new Map([['id-a', ': Engine[2]']]);
        assert.strictEqual(relationshipSource({ type: 'typing', source: '', sourceId: 'id-a', target: 'Engine' }, names), ': Engine[2]');
        assert.strictEqual(relationshipSource({ type: 'typing', source: 'e', sourceId: 'id-e', target: 'Engine' }, names), 'e');
        assert.strictEqual(relationshipSource({ type: 'satisfy', target: 'R1' }, names), '');
    });

    test('Model Explorer shows an anonymous element by its display name without repeating its type', () => {
        const [part] = dtosToSysMLElements([anonymousPart('id-a')]);
        const item = new ModelTreeItem(part, vscode.Uri.parse('file:///test.sysml'));
        assert.strictEqual(item.label, ': Engine[2]');
        assert.strictEqual(part.relationships[0].source, ': Engine[2]');
    });

    test('Model Explorer keeps named labels as "name : Type [mult]"', () => {
        const [part] = dtosToSysMLElements([dto({
            name: 'e', displayName: 'e', symbolId: 'id-e',
            attributes: { partType: 'Engine', multiplicity: '1' },
        })]);
        const item = new ModelTreeItem(part, vscode.Uri.parse('file:///test.sysml'));
        assert.strictEqual(item.label, 'e : Engine [1]');
    });

    test('merging packages keeps distinct anonymous children', () => {
        const [pkgA, pkgB] = dtosToSysMLElements([
            dto({ type: 'package', name: 'P', displayName: 'P', children: [anonymousPart('id-a')] }),
            dto({ type: 'package', name: 'P', displayName: 'P', children: [anonymousPart('id-b')] }),
        ]);
        const merged = ModelExplorerProvider.mergeElements([pkgA, pkgB]);
        assert.strictEqual(merged.length, 1);
        assert.strictEqual(merged[0].children.length, 2);
    });
});
