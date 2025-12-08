import * as assert from 'assert';
import * as vscode from 'vscode';
import type { Relationship, SysMLElement } from '../parser/sysmlParser';
import { buildPackageViewModel } from '../visualization/types/structural/packageViewModel';
import { buildVisualizationDataset } from '../visualization/types/viewModels';

suite('Package View Model Builder', () => {
    const mockRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

    function createElement(
        name: string,
        type: string,
        children: SysMLElement[] = [],
        relationships: Relationship[] = []
    ): SysMLElement {
        return {
            name,
            type,
            children,
            relationships,
            range: mockRange,
            attributes: new Map()
        } as SysMLElement;
    }

    test('captures nested packages and metadata', () => {
        const sensor = createElement('Sensor', 'block def');
        const electronics = createElement('Electronics', 'package', [sensor]);
        const vehicle = createElement('Vehicle', 'package', [electronics]);

        const dataset = buildVisualizationDataset({ elements: [vehicle] });
        const viewModel = buildPackageViewModel(dataset);

        assert.ok(viewModel, 'package view model should exist');
        assert.strictEqual(viewModel?.nodes.length, 2, 'only package nodes should be captured');
        const vehicleNode = viewModel?.nodes.find(node => node.name === 'Vehicle');
        assert.ok(vehicleNode, 'root package should be present');
        assert.strictEqual(vehicleNode?.childPackageIds.length, 1, 'root should reference nested packages');
        assert.ok((viewModel?.metadata.maxDepth ?? 0) >= 1, 'depth metadata should reflect nesting');
    });

    test('derives dependency edges from import relationships', () => {
        const alpha = createElement('AlphaPkg', 'package');
        const beta = createElement('BetaPkg', 'package');
        const relationships: Relationship[] = [
            { type: 'import', source: 'AlphaPkg', target: 'BetaPkg' }
        ];

        const dataset = buildVisualizationDataset({ elements: [alpha, beta], relationships });
        const viewModel = buildPackageViewModel(dataset);

        assert.ok(viewModel, 'view model should be created with packages present');
        assert.strictEqual(viewModel?.dependencies.length, 1, 'import should produce dependency edge');
        const dependency = viewModel?.dependencies[0];
        assert.strictEqual(dependency?.kind, 'import');
        const alphaNode = viewModel?.nodes.find(node => node.name === 'AlphaPkg');
        assert.strictEqual(alphaNode?.dependencyCount, 1, 'source package should track dependency out-degree');
    });

    test('returns undefined when no packages exist', () => {
        const dataset = buildVisualizationDataset({ elements: [createElement('Engine', 'block def')] });
        const viewModel = buildPackageViewModel(dataset);
        assert.strictEqual(viewModel, undefined, 'non-package datasets should not generate a view');
    });
});
