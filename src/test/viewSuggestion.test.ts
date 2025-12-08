import * as assert from 'assert';
import * as vscode from 'vscode';
import type { Relationship, SysMLElement } from '../parser/sysmlParser';
import { buildVisualizationDataset, suggestVisualizationView } from '../visualization/types/viewModels';

suite('Visualization View Suggestions', () => {
    const mockRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

    const createElement = (
        name: string,
        type: string,
        children: SysMLElement[] = [],
        relationships: Relationship[] = []
    ): SysMLElement => ({
        name,
        type,
        children,
        relationships,
        range: mockRange,
        attributes: new Map()
    }) as SysMLElement;

    test('prefers IBD view when ports and connectors dominate', () => {
        const ports = [
            createElement('Inlet', 'port'),
            createElement('Outlet', 'port'),
            createElement('Monitor', 'interface port'),
            createElement('Diagnostics', 'interface port')
        ];
        const controller = createElement('Controller', 'part def', ports);
        const relationships: Relationship[] = [
            { type: 'connector', source: 'Inlet', target: 'Outlet' },
            { type: 'connector', source: 'Outlet', target: 'Monitor' },
            { type: 'connector', source: 'Monitor', target: 'Diagnostics' },
            { type: 'connector', source: 'Diagnostics', target: 'Inlet' }
        ];
        const dataset = buildVisualizationDataset({ elements: [controller], relationships });
        const suggestion = suggestVisualizationView(dataset);

        assert.ok(suggestion, 'suggestion should exist');
        assert.strictEqual(suggestion?.viewId, 'ibd');
    });

    test('prefers package view for package-dense hierarchy', () => {
        const thermal = createElement('Thermal', 'package');
        const propulsion = createElement('Propulsion', 'package');
        const avionics = createElement('Avionics', 'package', [createElement('Sensors', 'package')]);
        const root = createElement('Spacecraft', 'package', [thermal, propulsion, avionics]);
        const dataset = buildVisualizationDataset({ elements: [root] });
        const suggestion = suggestVisualizationView(dataset);

        assert.ok(suggestion);
        assert.strictEqual(suggestion?.viewId, 'package');
    });

    test('prefers BDD view when structural nodes and relationships dominate', () => {
        const blocks = [
            createElement('Vehicle', 'block'),
            createElement('Chassis', 'block'),
            createElement('Powertrain', 'block'),
            createElement('Battery', 'block'),
            createElement('Controller', 'block'),
            createElement('Software', 'block')
        ];
        const relationships: Relationship[] = [
            { type: 'composition', source: 'Vehicle', target: 'Chassis' },
            { type: 'composition', source: 'Vehicle', target: 'Powertrain' },
            { type: 'composition', source: 'Vehicle', target: 'Battery' },
            { type: 'dependency', source: 'Controller', target: 'Powertrain' },
            { type: 'dependency', source: 'Controller', target: 'Software' },
            { type: 'flow', source: 'Battery', target: 'Powertrain' }
        ];
        const dataset = buildVisualizationDataset({ elements: blocks, relationships });
        const suggestion = suggestVisualizationView(dataset);

        assert.ok(suggestion);
        assert.strictEqual(suggestion?.viewId, 'bdd');
    });
});
