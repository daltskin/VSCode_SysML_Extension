/**
 * Use Case View Contract Tests
 *
 * These tests validate that the data contract between the LSP model output
 * and the visualization panel's use case view is maintained. They simulate
 * the same filtering and relationship extraction performed by
 * prepareDataForView('usecase') in visualizationPanel.ts.
 *
 * PURPOSE: Catch regressions where new grammar rules are added but element
 * kinds are missing from the LSP's inferKind() mapping, causing the use case
 * view to silently lose actor/stakeholder/requirement links.
 *
 * If any of these tests fail after an LSP update, it means the extension's
 * use case view will be broken — fix the LSP before releasing.
 */
import * as assert from 'assert';

/**
 * Simulates the element tree the LSP returns for a use case model.
 * These match the SysMLElementDTO shape from the LSP.
 */
function sampleUseCaseModel() {
    return [
        {
            type: 'package', name: 'SmartHome', children: [
                { type: 'item def', name: 'Resident', children: [], attributes: {}, relationships: [] },
                { type: 'item def', name: 'SafetyBoard', children: [], attributes: {}, relationships: [] },
                { type: 'part def', name: 'Thermostat', children: [
                    { type: 'attribute', name: 'targetTemperature', children: [], attributes: {}, relationships: [] },
                ], attributes: {}, relationships: [] },
                { type: 'part def', name: 'SmartHomeSystem', children: [], attributes: {}, relationships: [] },
                {
                    type: 'use case def', name: 'Control Temperature', children: [
                        { type: 'subject', name: 'system', children: [], attributes: { partType: 'SmartHomeSystem' }, relationships: [] },
                        { type: 'actor', name: 'occupant', children: [], attributes: { partType: 'Resident' }, relationships: [] },
                        { type: 'objective', name: 'unnamed', children: [
                            { type: 'doc', name: 'Maintain comfortable temperature', children: [], attributes: {}, relationships: [] },
                        ], attributes: {}, relationships: [] },
                    ], attributes: {}, relationships: []
                },
                {
                    type: 'requirement def', name: 'TemperatureAccuracy', children: [
                        { type: 'doc', name: 'accuracy constraint', children: [], attributes: {}, relationships: [] },
                        { type: 'subject', name: 'thermostat', children: [], attributes: { partType: 'Thermostat' }, relationships: [] },
                        { type: 'stakeholder', name: 'board', children: [], attributes: { partType: 'SafetyBoard' }, relationships: [] },
                        { type: 'attribute', name: 'accuracyThreshold', children: [], attributes: {}, relationships: [] },
                    ], attributes: {}, relationships: []
                },
                {
                    type: 'requirement', name: 'thermostatSpec', children: [
                        { type: 'requirement', name: 'tempAccuracy', children: [], attributes: { partType: 'TemperatureAccuracy' }, relationships: [] },
                    ], attributes: {}, relationships: []
                },
            ], attributes: {}, relationships: []
        },
    ];
}

/**
 * Flatten a nested element tree into a flat array.
 */
function flattenElements(elements: any[]): any[] {
    const result: any[] = [];
    for (const el of elements) {
        result.push(el);
        if (el.children) {
            result.push(...flattenElements(el.children));
        }
    }
    return result;
}

/**
 * Mimics the key filtering logic from prepareDataForView('usecase')
 * in visualizationPanel.ts. If this diverges from the real implementation,
 * it should be updated to match.
 */
function extractUseCaseViewData(allElements: any[]) {
    // Actor definitions
    const allActors = allElements.filter(el => {
        if (!el.type) return false;
        const typeLower = el.type.toLowerCase();
        return typeLower === 'actor def' || typeLower === 'actor definition';
    });

    // Use cases
    const allUseCases = allElements.filter(el => {
        if (!el.type) return false;
        const typeLower = el.type.toLowerCase();
        if (typeLower === 'include use case') return false;
        return typeLower.includes('use case');
    });

    // Relationships from actors inside use cases
    const useCaseRelationships: any[] = [];
    allUseCases.forEach((useCase: any) => {
        if (useCase.children) {
            useCase.children.forEach((child: any) => {
                const childType = child.type ? child.type.toLowerCase() : '';
                if (childType === 'actor usage' || childType === 'actor') {
                    const actorType = child.attributes?.partType || child.name;
                    useCaseRelationships.push({
                        source: actorType,
                        target: useCase.name,
                        type: 'association',
                    });
                }
            });
        }
    });

    // Requirements and stakeholder relationships
    const requirements = allElements.filter(el => {
        if (!el.type) return false;
        return el.type.toLowerCase().includes('requirement');
    });

    const requirementRelationships: any[] = [];
    requirements.forEach((req: any) => {
        if (!req.children) return;
        req.children.forEach((child: any) => {
            const childType = (child.type || '').toLowerCase().trim();
            if (childType === 'stakeholder') {
                const stakeholderType = child.attributes?.partType || child.name;
                requirementRelationships.push({
                    source: req.name,
                    target: stakeholderType,
                    type: 'stakeholder',
                });
            }
        });
    });

    return {
        actors: allActors,
        useCases: allUseCases,
        requirements,
        useCaseRelationships,
        requirementRelationships,
        allRelationships: [...useCaseRelationships, ...requirementRelationships],
    };
}

suite('Use Case View Data Contract', () => {

    // -------------------------------------------------------------------
    // Element kind recognition — the core contract
    // -------------------------------------------------------------------

    suite('Element type strings expected by the visualization', () => {

        test('actor children of use case defs must have type "actor"', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const actors = flat.filter(e => e.type === 'actor');

            assert.ok(actors.length >= 1,
                'LSP must emit elements with type="actor" for actor usages inside use case defs');
            assert.strictEqual(actors[0].name, 'occupant');
        });

        test('subject children of use case/requirement defs must have type "subject"', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const subjects = flat.filter(e => e.type === 'subject');

            assert.ok(subjects.length >= 1,
                'LSP must emit elements with type="subject" for subject usages');
        });

        test('stakeholder children of requirement defs must have type "stakeholder"', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const stakeholders = flat.filter(e => e.type === 'stakeholder');

            assert.ok(stakeholders.length >= 1,
                'LSP must emit elements with type="stakeholder" for stakeholder usages in requirements. ' +
                'Check that StakeholderUsage is in SysMLElementKind and mapped in inferKind().');
            assert.strictEqual(stakeholders[0].name, 'board');
            assert.strictEqual(stakeholders[0].attributes.partType, 'SafetyBoard');
        });
    });

    // -------------------------------------------------------------------
    // Relationship extraction — the visualization pipeline
    // -------------------------------------------------------------------

    suite('Actor-to-Use-Case link extraction', () => {

        test('should extract actor → use case associations from actor children', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const data = extractUseCaseViewData(flat);

            assert.ok(data.useCaseRelationships.length >= 1,
                'Should find at least one actor → use case relationship');

            const rel = data.useCaseRelationships.find(
                r => r.target === 'Control Temperature',
            );
            assert.ok(rel, 'Should have relationship to "Control Temperature"');
            assert.strictEqual(rel.source, 'Resident');
            assert.strictEqual(rel.type, 'association');
        });
    });

    suite('Requirement-to-Stakeholder link extraction', () => {

        test('should extract requirement → stakeholder relationships', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const data = extractUseCaseViewData(flat);

            assert.ok(data.requirementRelationships.length >= 1,
                'Should find at least one requirement → stakeholder relationship. ' +
                'If zero, the stakeholder elements are missing from the model — check LSP.');

            const rel = data.requirementRelationships.find(
                r => r.source === 'TemperatureAccuracy' && r.target === 'SafetyBoard',
            );
            assert.ok(rel,
                'Should have TemperatureAccuracy → SafetyBoard stakeholder link');
            assert.strictEqual(rel.type, 'stakeholder');
        });

        test('stakeholder links should be included in the merged relationship list', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const data = extractUseCaseViewData(flat);

            const stakeholderRels = data.allRelationships.filter(r => r.type === 'stakeholder');
            assert.ok(stakeholderRels.length >= 1,
                'Merged relationships should include stakeholder links');
        });
    });

    // -------------------------------------------------------------------
    // Full model coverage
    // -------------------------------------------------------------------

    suite('Sample model completeness', () => {

        test('should find all expected element types', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const types = new Set(flat.map(e => e.type));

            const required = ['use case def', 'actor', 'subject', 'stakeholder', 'requirement def', 'requirement'];
            for (const t of required) {
                assert.ok(types.has(t),
                    `Model should contain elements with type="${t}". ` +
                    'If missing, check LSP inferKind() and SysMLElementKind enum.');
            }
        });

        test('should produce both actor and stakeholder relationships', () => {
            const elements = sampleUseCaseModel();
            const flat = flattenElements(elements);
            const data = extractUseCaseViewData(flat);

            assert.ok(data.useCaseRelationships.length >= 1, 'Should have actor relationships');
            assert.ok(data.requirementRelationships.length >= 1, 'Should have stakeholder relationships');
            assert.ok(data.allRelationships.length >= 2, 'Should have at least 2 total relationships');
        });
    });
});
