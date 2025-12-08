import * as assert from 'assert';
import * as vscode from 'vscode';
import type { SysMLElement } from '../parser/sysmlParser';
import { buildElkViewModel } from '../visualization/renderers/elkRenderer';
import { buildVisualizationDataset } from '../visualization/types/viewModels';

suite('ELK Renderer View Model', () => {
    const mockRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

    function createElement(
        name: string,
        type: string,
        children: SysMLElement[] = [],
        attributes: Record<string, string | number | boolean> = {}
    ): SysMLElement {
        return {
            name,
            type,
            range: mockRange,
            children,
            relationships: [],
            attributes: new Map(Object.entries(attributes))
        } as SysMLElement;
    }

    test('builds nodes, edges, and summaries for nested elements', () => {
        const engine = createElement('Engine', 'part def', [], { isStandardType: true });
        const vehicle = createElement('Vehicle', 'package', [engine]);
        const dataset = buildVisualizationDataset({ elements: [vehicle] });

        const viewModel = buildElkViewModel(dataset);
        assert.ok(viewModel, 'View model should be generated');
        assert.strictEqual(viewModel?.nodes.length, 2);
        assert.strictEqual(viewModel?.edges.length, 1);

        const rootNode = viewModel?.nodes.find(node => node.name === 'Vehicle');
        assert.ok(rootNode, 'Root node should be present');
        assert.strictEqual(rootNode?.children.length, 1, 'Root should reference child summary');

        const childNode = viewModel?.nodes.find(node => node.name === 'Engine');
        assert.ok(childNode, 'Child node should be present');
        assert.strictEqual(childNode?.element.attributes.isStandardType, true);
        assert.strictEqual(rootNode?.children[0].id, childNode?.id, 'Child summary should reference child node id');
    });

    test('returns undefined when dataset is empty', () => {
        const emptyDataset = buildVisualizationDataset({ elements: [] });
        const viewModel = buildElkViewModel(emptyDataset);
        assert.strictEqual(viewModel, undefined);
    });
});
