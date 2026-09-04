/**
 * Unit tests for FeatureExplorerProvider.
 *
 * Covers:
 * 1. selectElement — master-detail invocation from Model Explorer
 * 2. clear — resets view to placeholder
 * 3. pushResolvedTypes — external cache injection
 * 4. getChildren — root-level nodes, specialization chain, feature groups, where-used
 * 5. Tree node construction (DefinitionHeaderItem, FeatureGroupItem, FeatureItem, etc.)
 * 6. Feature grouping and ordering
 * 7. Where-used reverse lookup
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { FeatureExplorerProvider } from '../explorer/featureExplorerProvider';
import type { ResolvedFeatureDTO, ResolvedTypeDTO } from '../providers/sysmlModelTypes';
import type { SysMLElement } from '../types/sysmlTypes';

// ── Helpers ──────────────────────────────────────────────────────

function makeResolvedType(overrides: Partial<ResolvedTypeDTO> = {}): ResolvedTypeDTO {
    return {
        qualifiedName: overrides.qualifiedName ?? 'Pkg::Vehicle',
        simpleName: overrides.simpleName ?? 'Vehicle',
        kind: overrides.kind ?? 'PartDefinition',
        isLibraryType: overrides.isLibraryType ?? false,
        specializationChain: overrides.specializationChain ?? [],
        specializes: overrides.specializes ?? [],
        features: overrides.features ?? [],
    };
}

function makeFeature(overrides: Partial<ResolvedFeatureDTO> = {}): ResolvedFeatureDTO {
    return {
        name: overrides.name ?? 'engine',
        kind: overrides.kind ?? 'PartUsage',
        type: overrides.type,
        multiplicity: overrides.multiplicity,
        direction: overrides.direction,
        visibility: overrides.visibility,
        isDerived: overrides.isDerived ?? false,
        isReadonly: overrides.isReadonly ?? false,
    };
}

function makeSysMLElement(overrides: Partial<SysMLElement> = {}): SysMLElement {
    return {
        type: overrides.type ?? 'part',
        name: overrides.name ?? 'TestPart',
        range: overrides.range ?? new vscode.Range(0, 0, 0, 10),
        children: overrides.children ?? [],
        attributes: overrides.attributes ?? new Map(),
        relationships: overrides.relationships ?? [],
        errors: overrides.errors,
    };
}

/** Mock LspModelProvider that returns given resolved types. */
function createMockLspProvider(resolvedTypes: Record<string, ResolvedTypeDTO> = {}) {
    return {
        getModel: async (_uri: string, _scopes?: string[], _token?: any) => ({
            version: 1,
            elements: [],
            relationships: [],
            resolvedTypes,
            stats: {
                totalElements: 0,
                resolvedElements: 0,
                unresolvedElements: 0,
                parseTimeMs: 1,
                modelBuildTimeMs: 1,
            },
        }),
    } as any;
}

function createFailingLspProvider() {
    return {
        getModel: async () => { throw new Error('LSP unavailable'); },
    } as any;
}

const testUri = vscode.Uri.parse('file:///workspace/vehicle.sysml');

// ── Tests ────────────────────────────────────────────────────────

suite('FeatureExplorerProvider', () => {

    // ── Initial state ───────────────────────────────────────────

    suite('Initial state', () => {

        test('shows placeholder when no element is selected', () => {
            const provider = new FeatureExplorerProvider(createMockLspProvider());
            const items = provider.getChildren();

            assert.strictEqual(items.length, 1);
            assert.strictEqual(items[0].contextValue, 'featureExplorer.info');
        });
    });

    // ── selectElement (master-detail invocation) ────────────────

    suite('selectElement', () => {

        test('populates tree from cached resolved types', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Vehicle',
                qualifiedName: 'Pkg::Vehicle',
                features: [
                    makeFeature({ name: 'engine', kind: 'PartUsage', type: 'Engine' }),
                    makeFeature({ name: 'speed', kind: 'AttributeUsage', type: 'Real' }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            // Pre-populate cache
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::Vehicle': resolved });

            const element = makeSysMLElement({ type: 'part def', name: 'Vehicle' });
            await provider.selectElement(element, testUri);

            const items = provider.getChildren();
            assert.ok(items.length > 0, 'Should have items after selectElement');

            // First item should be definition header
            assert.strictEqual(items[0].contextValue, 'featureExplorer.header');
        });

        test('fires tree change event', async () => {
            const resolved = makeResolvedType({ simpleName: 'X' });
            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'X': resolved });

            let changeEventFired = false;
            provider.onDidChangeTreeData(() => { changeEventFired = true; });

            await provider.selectElement(makeSysMLElement({ name: 'X' }), testUri);
            assert.ok(changeEventFired, 'Should fire onDidChangeTreeData');
        });

        test('fetches from LSP when not cached', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Motor',
                qualifiedName: 'Pkg::Motor',
                features: [makeFeature({ name: 'rpm', kind: 'AttributeUsage' })],
            });

            const provider = new FeatureExplorerProvider(
                createMockLspProvider({ 'Pkg::Motor': resolved })
            );

            await provider.selectElement(makeSysMLElement({ name: 'Motor' }), testUri);

            const items = provider.getChildren();
            assert.ok(items.length > 0, 'Should fetch and display from LSP');
            assert.strictEqual(items[0].contextValue, 'featureExplorer.header');
        });

        test('handles LSP failure gracefully', async () => {
            const provider = new FeatureExplorerProvider(createFailingLspProvider());

            await provider.selectElement(makeSysMLElement({ name: 'Broken' }), testUri);

            const items = provider.getChildren();
            // Should show placeholder or info item
            assert.ok(items.length >= 1, 'Should still show something');
            assert.strictEqual(items[0].contextValue, 'featureExplorer.info');
        });

        test('includes where-used when allElements provided', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Engine',
                qualifiedName: 'Pkg::Engine',
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::Engine': resolved });

            // Vehicle has partType='Engine' → should appear in whereUsed
            const allElements = [
                makeSysMLElement({
                    type: 'part',
                    name: 'Vehicle',
                    attributes: new Map([['partType', 'Engine']]),
                }),
            ];

            await provider.selectElement(
                makeSysMLElement({ type: 'part def', name: 'Engine' }),
                testUri,
                allElements
            );

            const items = provider.getChildren();
            const whereUsedGroup = items.find(i => i.contextValue === 'featureExplorer.whereUsedGroup');
            assert.ok(whereUsedGroup, 'Should include WhereUsedGroupItem');
        });
    });

    // ── clear ───────────────────────────────────────────────────

    suite('clear', () => {

        test('returns to placeholder after clear', async () => {
            const resolved = makeResolvedType({ simpleName: 'X', features: [makeFeature({ name: 'a', kind: 'PartUsage' })] });
            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'X': resolved });

            await provider.selectElement(makeSysMLElement({ name: 'X' }), testUri);
            assert.ok(provider.getChildren().length > 1, 'Should have content before clear');

            provider.clear();

            const items = provider.getChildren();
            assert.strictEqual(items.length, 1);
            assert.strictEqual(items[0].contextValue, 'featureExplorer.info');
        });

        test('fires change event on clear', () => {
            const provider = new FeatureExplorerProvider(createMockLspProvider());
            let fired = false;
            provider.onDidChangeTreeData(() => { fired = true; });

            provider.clear();
            assert.ok(fired, 'Should fire onDidChangeTreeData on clear');
        });
    });

    // ── pushResolvedTypes ───────────────────────────────────────

    suite('pushResolvedTypes', () => {

        test('cached types are used by selectElement', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Camera',
                qualifiedName: 'Sys::Camera',
                features: [makeFeature({ name: 'lens', kind: 'PartUsage' })],
            });

            const provider = new FeatureExplorerProvider(createFailingLspProvider());
            provider.pushResolvedTypes('file:///other.sysml', { 'Sys::Camera': resolved });

            // Even though LSP will fail, the cache hit should work
            await provider.selectElement(
                makeSysMLElement({ name: 'Camera' }),
                vscode.Uri.parse('file:///other.sysml')
            );

            const items = provider.getChildren();
            assert.strictEqual(items[0].contextValue, 'featureExplorer.header');
        });
    });

    // ── getChildren expansion ───────────────────────────────────

    suite('getChildren (child expansion)', () => {

        let provider: FeatureExplorerProvider;
        let rootItems: any[];

        setup(async () => {
            const resolved = makeResolvedType({
                simpleName: 'Vehicle',
                qualifiedName: 'Pkg::Vehicle',
                specializationChain: ['Pkg::BaseVehicle', 'Pkg::Thing'],
                features: [
                    makeFeature({ name: 'engine', kind: 'PartUsage', type: 'Engine' }),
                    makeFeature({ name: 'speed', kind: 'AttributeUsage', type: 'Real' }),
                    makeFeature({ name: 'fuelPort', kind: 'PortUsage', type: 'FuelPort' }),
                ],
            });

            provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::Vehicle': resolved });

            const allElements = [
                makeSysMLElement({ type: 'part', name: 'myCar', attributes: new Map([['partType', 'Vehicle']]) }),
            ];
            await provider.selectElement(
                makeSysMLElement({ type: 'part def', name: 'Vehicle' }),
                testUri,
                allElements
            );
            rootItems = provider.getChildren();
        });

        test('root has definition header', () => {
            assert.strictEqual(rootItems[0].contextValue, 'featureExplorer.header');
            // The header label should be the simple name
            assert.strictEqual(rootItems[0].label, 'Vehicle');
        });

        test('root has specialization chain', () => {
            const specChain = rootItems.find((i: any) => i.contextValue === 'featureExplorer.specChain');
            assert.ok(specChain, 'Should have specialization chain group');
        });

        test('expanding specialization chain shows individual items', () => {
            const specChain = rootItems.find((i: any) => i.contextValue === 'featureExplorer.specChain');
            const chainChildren = provider.getChildren(specChain);

            assert.strictEqual(chainChildren.length, 2, 'Should have 2 chain items');
            assert.strictEqual(chainChildren[0].contextValue, 'featureExplorer.spec');
        });

        test('root has feature groups', () => {
            const groups = rootItems.filter((i: any) => i.contextValue === 'featureExplorer.group');
            assert.ok(groups.length >= 2, 'Should have at least Parts and Attributes groups');
        });

        test('expanding a feature group shows feature items', () => {
            const partsGroup = rootItems.find((i: any) =>
                i.contextValue === 'featureExplorer.group' && i.label === 'Parts'
            );
            assert.ok(partsGroup, 'Should have Parts group');

            const features = provider.getChildren(partsGroup);
            assert.ok(features.length >= 1, 'Parts group should have features');
            assert.strictEqual(features[0].contextValue, 'featureExplorer.feature');
        });

        test('root has where-used group', () => {
            const whereUsed = rootItems.find((i: any) => i.contextValue === 'featureExplorer.whereUsedGroup');
            assert.ok(whereUsed, 'Should have where-used group');
        });

        test('expanding where-used group shows usage items', () => {
            const whereUsed = rootItems.find((i: any) => i.contextValue === 'featureExplorer.whereUsedGroup');
            const usages = provider.getChildren(whereUsed);

            assert.ok(usages.length >= 1, 'Should have at least one usage');
            assert.strictEqual(usages[0].contextValue, 'featureExplorer.whereUsed');
        });
    });

    // ── Feature grouping ────────────────────────────────────────

    suite('Feature grouping', () => {

        test('groups features by category in canonical order', async () => {
            const resolved = makeResolvedType({
                simpleName: 'System',
                qualifiedName: 'System',
                features: [
                    makeFeature({ name: 'act', kind: 'ActionUsage' }),
                    makeFeature({ name: 'eng', kind: 'PartUsage' }),
                    makeFeature({ name: 'port1', kind: 'PortUsage' }),
                    makeFeature({ name: 'attr1', kind: 'AttributeUsage' }),
                    makeFeature({ name: 'ref1', kind: 'ReferenceUsage' }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'System': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'System' }), testUri);

            const items = provider.getChildren();
            const groupLabels = items
                .filter((i: any) => i.contextValue === 'featureExplorer.group')
                .map((i: any) => i.label);

            // Order should be Parts < Ports < Attributes < References < Actions
            const partsIdx = groupLabels.indexOf('Parts');
            const portsIdx = groupLabels.indexOf('Ports');
            const attrsIdx = groupLabels.indexOf('Attributes');
            const actionsIdx = groupLabels.indexOf('Actions');

            assert.ok(partsIdx < portsIdx, 'Parts should come before Ports');
            assert.ok(portsIdx < attrsIdx, 'Ports should come before Attributes');
            assert.ok(attrsIdx < actionsIdx, 'Attributes should come before Actions');
        });

        test('groups lowercase LSP symbol kinds instead of placing them under Other', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Controller',
                qualifiedName: 'Controller',
                features: [
                    makeFeature({ name: 'powerIn', kind: 'port' }),
                    makeFeature({ name: 'operating', kind: 'exhibit state' }),
                    makeFeature({ name: 'control', kind: 'perform action' }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Controller': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'Controller' }), testUri);

            const groupLabels = provider.getChildren()
                .filter((item: any) => item.contextValue === 'featureExplorer.group')
                .map((item: any) => item.label);
            assert.deepStrictEqual(groupLabels, ['Ports', 'Actions', 'States']);
            assert.ok(!groupLabels.includes('Other'));
        });

        test('unknown feature kinds go to Other category', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Sys',
                qualifiedName: 'Sys',
                features: [
                    makeFeature({ name: 'x', kind: 'SomeFutureKind' }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Sys': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'Sys' }), testUri);

            const items = provider.getChildren();
            const otherGroup = items.find((i: any) =>
                i.contextValue === 'featureExplorer.group' && i.label === 'Other'
            );
            assert.ok(otherGroup, 'Unknown kinds should go to Other');
        });
    });

    // ── Feature item details ────────────────────────────────────

    suite('FeatureItem details', () => {

        test('shows type and multiplicity in label', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Car',
                qualifiedName: 'Car',
                features: [
                    makeFeature({
                        name: 'wheels',
                        kind: 'PartUsage',
                        type: 'Wheel',
                        multiplicity: '4',
                    }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Car': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'Car' }), testUri);

            const items = provider.getChildren();
            const partsGroup = items.find((i: any) => i.contextValue === 'featureExplorer.group');
            const features = provider.getChildren(partsGroup);

            assert.ok(features[0].label?.toString().includes('wheels'), 'Should have name');
            assert.ok(features[0].label?.toString().includes('Wheel'), 'Should have type');
            assert.ok(features[0].label?.toString().includes('[4]'), 'Should have multiplicity');
        });

        test('shows direction and modifiers in description', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Sys',
                qualifiedName: 'Sys',
                features: [
                    makeFeature({
                        name: 'sig',
                        kind: 'PortUsage',
                        direction: 'in',
                        isDerived: true,
                        isReadonly: true,
                        visibility: 'private',
                    }),
                ],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Sys': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'Sys' }), testUri);

            const items = provider.getChildren();
            const portsGroup = items.find((i: any) =>
                i.contextValue === 'featureExplorer.group' && i.label === 'Ports'
            );
            const features = provider.getChildren(portsGroup);
            const desc = features[0].description?.toString() ?? '';

            assert.ok(desc.includes('in'), 'Should show direction');
            assert.ok(desc.includes('derived'), 'Should show derived');
            assert.ok(desc.includes('readonly'), 'Should show readonly');
            assert.ok(desc.includes('private'), 'Should show visibility');
        });
    });

    // ── DefinitionHeaderItem ────────────────────────────────────

    suite('DefinitionHeaderItem', () => {

        test('shows kind and library annotation', async () => {
            const resolved = makeResolvedType({
                simpleName: 'ISQ::Mass',
                qualifiedName: 'ISQ::Mass',
                kind: 'AttributeDefinition',
                isLibraryType: true,
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'ISQ::Mass': resolved });
            await provider.selectElement(
                makeSysMLElement({ name: 'ISQ::Mass' }),
                testUri
            );

            const items = provider.getChildren();
            const header = items[0];
            assert.ok(header.description?.toString().includes('AttributeDefinition'), 'Should show kind');
            assert.ok(header.description?.toString().includes('library'), 'Should show library flag');
        });
    });

    // ── Where-used reverse lookup ───────────────────────────────

    suite('Where-used lookup', () => {

        test('finds usages by partType attribute', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Engine',
                qualifiedName: 'Pkg::Engine',
            });

            const allElements = [
                makeSysMLElement({
                    type: 'part',
                    name: 'car',
                    attributes: new Map([['partType', 'Engine']]),
                }),
                makeSysMLElement({
                    type: 'part',
                    name: 'boat',
                    attributes: new Map([['partType', 'Engine']]),
                }),
                makeSysMLElement({
                    type: 'part',
                    name: 'plane',
                    attributes: new Map([['partType', 'Turbine']]),
                }),
            ];

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::Engine': resolved });
            await provider.selectElement(
                makeSysMLElement({ name: 'Engine' }),
                testUri,
                allElements
            );

            const items = provider.getChildren();
            const whereUsedGroup = items.find((i: any) => i.contextValue === 'featureExplorer.whereUsedGroup');
            assert.ok(whereUsedGroup, 'Should have where-used group');

            const usages = provider.getChildren(whereUsedGroup);
            assert.strictEqual(usages.length, 2, 'Should find 2 usages (car and boat)');
        });

        test('finds usages by portType attribute', async () => {
            const resolved = makeResolvedType({
                simpleName: 'FuelPort',
                qualifiedName: 'Pkg::FuelPort',
            });

            const allElements = [
                makeSysMLElement({
                    type: 'port',
                    name: 'fuelIn',
                    attributes: new Map([['portType', 'FuelPort']]),
                }),
            ];

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::FuelPort': resolved });
            await provider.selectElement(
                makeSysMLElement({ name: 'FuelPort' }),
                testUri,
                allElements
            );

            const items = provider.getChildren();
            const whereUsedGroup = items.find((i: any) => i.contextValue === 'featureExplorer.whereUsedGroup');
            assert.ok(whereUsedGroup, 'Should find port type usage');
        });

        test('finds nested usages', async () => {
            const resolved = makeResolvedType({
                simpleName: 'Sensor',
                qualifiedName: 'Pkg::Sensor',
            });

            const allElements = [
                makeSysMLElement({
                    type: 'package',
                    name: 'Components',
                    children: [
                        makeSysMLElement({
                            type: 'part',
                            name: 'detector',
                            attributes: new Map([['partType', 'Sensor']]),
                        }),
                    ],
                }),
            ];

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::Sensor': resolved });
            await provider.selectElement(
                makeSysMLElement({ name: 'Sensor' }),
                testUri,
                allElements
            );

            const items = provider.getChildren();
            const whereUsedGroup = items.find((i: any) => i.contextValue === 'featureExplorer.whereUsedGroup');
            assert.ok(whereUsedGroup, 'Should find usage nested inside package');
        });
    });

    // ── getParent ───────────────────────────────────────────────

    suite('getParent', () => {

        test('always returns undefined (flat reveal)', () => {
            const provider = new FeatureExplorerProvider(createMockLspProvider());
            assert.strictEqual(provider.getParent(), undefined);
        });
    });

    // ── Specialization: uses specializes when chain is empty ────

    suite('Specialization fallback', () => {

        test('uses specializes array when specializationChain is empty', async () => {
            const resolved = makeResolvedType({
                simpleName: 'SportsCar',
                qualifiedName: 'Pkg::SportsCar',
                specializationChain: [],
                specializes: ['Pkg::Car'],
            });

            const provider = new FeatureExplorerProvider(createMockLspProvider());
            provider.pushResolvedTypes(testUri.toString(), { 'Pkg::SportsCar': resolved });
            await provider.selectElement(makeSysMLElement({ name: 'SportsCar' }), testUri);

            const items = provider.getChildren();
            const specChain = items.find((i: any) => i.contextValue === 'featureExplorer.specChain');
            assert.ok(specChain, 'Should show specialization chain from specializes fallback');

            const chainItems = provider.getChildren(specChain);
            assert.strictEqual(chainItems.length, 1);
            assert.ok(chainItems[0].label?.toString().includes('Car'), 'Should show Car in chain');
        });
    });
});
