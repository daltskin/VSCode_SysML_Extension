import * as assert from 'assert';
import * as vscode from 'vscode';
import type { Relationship, SysMLElement } from '../parser/sysmlParser';
import { buildBddViewModel } from '../visualization/types/structural/bddViewModel';
import type { DiagramRelationshipViewModel } from '../visualization/types/viewModels';
import { buildVisualizationDataset } from '../visualization/types/viewModels';

suite('BDD View Model Builder', () => {
    const mockRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

    function createElement(name: string, type: string, children: SysMLElement[] = [], relationships: Relationship[] = []): SysMLElement {
        return {
            name,
            type,
            range: mockRange,
            children,
            relationships,
            attributes: new Map()
        } as SysMLElement;
    }

    test('extracts structural nodes and classifies relationships', () => {
        const engine = createElement('Engine', 'block def');
        const chassis = createElement('Chassis', 'block def');
        const vehicle = createElement('Vehicle', 'package', [engine, chassis]);

        const baseDataset = buildVisualizationDataset({ elements: [vehicle] });
        const root = baseDataset.elements[0];
        const engineNode = root.children[0];
        const chassisNode = root.children[1];

        const dataset = {
            ...baseDataset,
            relationships: [
                {
                    id: 'r1',
                    type: 'composition',
                    source: root.id,
                    target: engineNode.id
                } as DiagramRelationshipViewModel,
                {
                    id: 'r2',
                    type: 'generalization',
                    source: engineNode.id,
                    target: chassisNode.id
                } as DiagramRelationshipViewModel
            ],
            pillarRelationships: [] as DiagramRelationshipViewModel[]
        };
        const viewModel = buildBddViewModel(dataset);

        assert.ok(viewModel, 'View model should be produced');
        assert.strictEqual(viewModel?.nodes.length, 3, 'Should capture all structural nodes');
        const relationshipCount = viewModel?.relationships.length ?? 0;
        assert.ok(relationshipCount >= 2, 'Relationships should be preserved');

        const composition = viewModel?.relationships.find(rel => rel.id === 'r1');
        assert.strictEqual(composition?.kind, 'composition');
        const generalization = viewModel?.relationships.find(rel => rel.id === 'r2');
        assert.strictEqual(generalization?.kind, 'generalization');
    });

    test('returns undefined when no structural nodes exist', () => {
        const dataset = buildVisualizationDataset({ elements: [] });
        const viewModel = buildBddViewModel(dataset);
        assert.strictEqual(viewModel, undefined);
    });

    test('derives compositions and embedded flow relationships', () => {
        const port = createElement('DataPort', 'port');
        const ifaceRelationships: Relationship[] = [
            {
                type: 'flow',
                source: 'TelemetryInterface',
                target: 'DataPort'
            }
        ];
        const iface = createElement('TelemetryInterface', 'interface def', [], ifaceRelationships);
        const block = createElement('Avionics', 'block def', [iface, port]);

        const dataset = buildVisualizationDataset({ elements: [block] });
        const viewModel = buildBddViewModel(dataset);

        assert.ok(viewModel);
        const flowRelationship = viewModel?.relationships.find(rel => rel.kind === 'flow');
        assert.ok(flowRelationship, 'Embedded element relationships should surface as flow edges');
        const compositionRelationships = viewModel?.relationships.filter(rel => rel.kind === 'composition') ?? [];
        assert.ok(compositionRelationships.length >= 2, 'Composition edges should connect parent and child nodes');
        assert.strictEqual(viewModel?.metadata.interfaceCount, 2, 'Interface counts should be derived from nodes');
    });

    test('includes nodes without explicit type metadata', () => {
        const anonymous = createElement('AnonymousBlock', '');
        const parent = createElement('Vehicle', 'package', [anonymous]);

        const dataset = buildVisualizationDataset({ elements: [parent] });
        const viewModel = buildBddViewModel(dataset);

        assert.ok(viewModel);
        const containsAnonymousNode = viewModel?.nodes.some(node => node.name === 'AnonymousBlock');
        assert.ok(containsAnonymousNode, 'Nodes without type information should still appear');
        const compositionExists = viewModel?.relationships.some(rel => rel.kind === 'composition');
        assert.ok(compositionExists, 'Parent-child composition should be synthesized');
    });
});
