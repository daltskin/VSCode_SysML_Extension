import * as assert from 'assert';
import * as vscode from 'vscode';
import type { Relationship, SysMLElement } from '../parser/sysmlParser';
import { buildIbdViewModel } from '../visualization/types/structural/ibdViewModel';
import { buildVisualizationDataset } from '../visualization/types/viewModels';

suite('IBD View Model Builder', () => {
    const mockRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));

    const createElement = (
        name: string,
        type: string,
        children: SysMLElement[] = [],
        relationships: Relationship[] = [],
        attributes?: Map<string, string | number | boolean>
    ): SysMLElement => ({
        name,
        type,
        children,
        relationships,
        range: mockRange,
        attributes: attributes ?? new Map()
    }) as SysMLElement;

    test('collects parts, ports, and connectors', () => {
        const power = createElement('PowerPort', 'proxy port');
        const signal = createElement('SignalPort', 'flow port');
        const controller = createElement('Controller', 'part def', [power, signal]);

        const relationships: Relationship[] = [
            { type: 'connector', source: 'PowerPort', target: 'SignalPort' }
        ];
        const dataset = buildVisualizationDataset({ elements: [controller], relationships });
        const viewModel = buildIbdViewModel(dataset);

        assert.ok(viewModel, 'IBD view model should be returned when parts exist');
        assert.strictEqual(viewModel?.parts.length, 1, 'one part should be registered');
        assert.strictEqual(viewModel?.ports.length, 2, 'all child ports should be captured');
        assert.strictEqual(viewModel?.connectors.length, 1, 'connector relationship should map to an edge');
        assert.strictEqual(viewModel?.parts[0]?.portIds.length, 2, 'part should reference both ports');
        assert.strictEqual(viewModel?.metadata.connectorCount, 1);
    });

    test('derives port direction from attributes and properties', () => {
        const directionAttr = new Map<string, string | number | boolean>();
        directionAttr.set('direction', 'out');
        const port = createElement('Tx', 'port', [], [], directionAttr);
        const parent = createElement('Transmitter', 'part def', [port]);
        const dataset = buildVisualizationDataset({ elements: [parent] });
        const viewModel = buildIbdViewModel(dataset);

        assert.ok(viewModel);
        const txPort = viewModel?.ports.find(candidate => candidate.name === 'Tx');
        assert.strictEqual(txPort?.direction, 'out');
    });

    test('returns undefined when dataset lacks part definitions', () => {
        const dataset = buildVisualizationDataset({ elements: [createElement('UtilityPkg', 'package')] });
        const viewModel = buildIbdViewModel(dataset);
        assert.strictEqual(viewModel, undefined);
    });

    test('collects connectors from connection elements with end children', () => {
        // Create a structure that mimics what the parser produces:
        // part def with ports, and connection element with end children
        const port1 = createElement('DataPort', 'port');
        const port2 = createElement('CommandPort', 'port');
        const part1 = createElement('Controller', 'part def', [port1]);
        const part2 = createElement('Actuator', 'part def', [port2]);

        // Create end elements with targetRef attributes (like the parser creates)
        const end1Attrs = new Map<string, any>();
        end1Attrs.set('targetRef', 'Controller.DataPort');
        const end1 = createElement('source', 'end', [], [], end1Attrs);

        const end2Attrs = new Map<string, any>();
        end2Attrs.set('targetRef', 'Actuator.CommandPort');
        const end2 = createElement('target', 'end', [], [], end2Attrs);

        // Connection with end children
        const connection = createElement('DataLink', 'connection', [end1, end2]);

        const dataset = buildVisualizationDataset({ elements: [part1, part2, connection] });
        const viewModel = buildIbdViewModel(dataset);

        assert.ok(viewModel, 'IBD view model should be returned');
        assert.strictEqual(viewModel?.parts.length, 2, 'two parts should be registered');
        assert.strictEqual(viewModel?.ports.length, 2, 'two ports should be captured');
        // The connector should be extracted from the connection element
        assert.ok(viewModel?.connectors.length >= 1, 'connection with end children should produce a connector');
    });

    test('parses connections from autonomous-delivery-ibd.sysml', async () => {
        // Read the actual sample file
        const fs = await import('fs');
        const path = await import('path');
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            return; // No workspace folder, skip test
        }

        const filePath = path.join(workspaceRoot, 'samples', 'autonomous-delivery-ibd.sysml');
        if (!fs.existsSync(filePath)) {
            return; // Sample file not found, skip test
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'sysml'
        });

        // Parse the document using the actual parser
        const { ANTLRSysMLParser } = await import('../parser/antlrSysMLParser');
        const parser = new ANTLRSysMLParser();
        const elements = parser.parseDocument(document);

        // Helper to find all connections recursively
        function findConnections(elems: SysMLElement[], found: SysMLElement[] = []): SysMLElement[] {
            for (const e of elems) {
                if (e.type === 'connection') {
                    found.push(e);
                }
                if (e.children && e.children.length > 0) {
                    findConnections(e.children, found);
                }
            }
            return found;
        }

        const connections = findConnections(elements);

        // Should find at least the 5 connections in the file
        assert.ok(connections.length >= 5, `Should find at least 5 connections, found ${connections.length}`);

        // Each connection should have 2 end children with targetRef
        for (const conn of connections) {
            assert.strictEqual(conn.children?.length, 2, `Connection '${conn.name}' should have 2 end children`);
            for (const end of conn.children || []) {
                const targetRef = end.attributes?.get?.('targetRef');
                assert.ok(targetRef, `End '${end.name}' should have targetRef attribute`);
            }
        }

        // Build the IBD view model
        const dataset = buildVisualizationDataset({ elements });
        const viewModel = buildIbdViewModel(dataset);

        assert.ok(viewModel, 'IBD view model should be returned');

        console.log('[IBD TEST] View Model connectors:', viewModel?.connectors?.length || 0);
        if (viewModel?.connectors && viewModel.connectors.length > 0) {
            viewModel.connectors.forEach((c: any, i: number) => {
                console.log(`[IBD TEST] Connector[${i}]: id=${c.id}, source=${c.sourceId}, target=${c.targetId}`);
            });
        }

        // Should have connectors in the view model
        assert.ok((viewModel?.connectors?.length || 0) >= 1, 'Should have at least 1 connector');
    });

    test.skip('parses interface connections from inline content', async () => {
        // Test interface connections with inline SysML content
        const content = `package SmartHome {
    port def PowerIP {
        out item power : Power;
    }
    item def Power;
    interface def PowerInterface {
        end supplierPort : PowerIP;
        end consumerPort : ~PowerIP;
    }
    part def SmartHome {
        part battery {
            port powerPort : PowerIP;
        }
        part controller {
            port controllerPort : ~PowerIP;
        }
        interface bat2ctrl : PowerInterface connect battery.powerPort to controller.controllerPort;
    }
}`;

        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'sysml'
        });

        // Parse the document using the actual parser
        const { ANTLRSysMLParser } = await import('../parser/antlrSysMLParser');
        const parser = new ANTLRSysMLParser();
        const elements = parser.parseDocument(document);

        // Helper to find all interfaces recursively
        function findInterfaces(elems: SysMLElement[], found: SysMLElement[] = []): SysMLElement[] {
            for (const e of elems) {
                if (e.type === 'interface') {
                    found.push(e);
                }
                if (e.children && e.children.length > 0) {
                    findInterfaces(e.children, found);
                }
            }
            return found;
        }

        const interfaces = findInterfaces(elements);

        // Verify we found the interface with from/to attributes
        const bat2ctrlInterface = interfaces.find((i: SysMLElement) => i.name === 'bat2ctrl');
        assert.ok(bat2ctrlInterface, 'Should find bat2ctrl interface');
        assert.ok(bat2ctrlInterface?.attributes?.get?.('from'), 'bat2ctrl should have from attribute');
        assert.ok(bat2ctrlInterface?.attributes?.get?.('to'), 'bat2ctrl should have to attribute');

        // Build the IBD view model
        const dataset = buildVisualizationDataset({ elements });
        const viewModel = buildIbdViewModel(dataset);

        assert.ok(viewModel, 'IBD view model should be returned');

        // The interface should show up as a connector
        assert.ok((viewModel?.connectors?.length || 0) >= 1, 'Should have at least 1 connector from interface connections');
    });
});
