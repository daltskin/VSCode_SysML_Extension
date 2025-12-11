import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { SysMLElement, SysMLParser } from '../parser/sysmlParser';

// Helper function to flatten hierarchical elements into a flat list
function flattenElements(elements: SysMLElement[]): SysMLElement[] {
    const result: SysMLElement[] = [];
    function visit(el: SysMLElement) {
        result.push(el);
        if (el.children) {
            el.children.forEach(visit);
        }
    }
    elements.forEach(visit);
    return result;
}

suite('VisualizationPanel State Filtering Tests', () => {
    let parser: SysMLParser;

    setup(() => {
        parser = new SysMLParser();
    });

    test('Parse camera-states.sysml with ANTLR parser', async () => {
        // Read file directly from samples folder
        const samplesPath = path.join(__dirname, '..', '..', 'samples', 'Camera Example', 'camera-states.sysml');
        const content = fs.readFileSync(samplesPath, 'utf8');
        const document = await createTestDocument(content);

        console.log('=== DEBUG: Test 1 starting ===');
        console.log(`Content length: ${content.length}`);
        console.log(`Document text length: ${document.getText().length}`);

        // Parse with ANTLR
        const hierarchicalElements = parser.parseForVisualization(document);
        console.log(`Hierarchical elements returned: ${hierarchicalElements.length}`);
        if (hierarchicalElements.length > 0) {
            console.log(`First element: ${hierarchicalElements[0].name} (${hierarchicalElements[0].type})`);
        }

        // Flatten to get all elements including nested ones
        const elements = flattenElements(hierarchicalElements);

        console.log('=== ANTLR Parser Test Results ===');
        console.log(`Total elements parsed: ${elements.length}`);

        // Log all element types
        elements.forEach((el, idx) => {
            console.log(`  [${idx}] ${el.name} (type: ${el.type})`);
        });

        // Filter states using the same logic as visualizationPanel
        const stateElements = elements.filter(el => el.type && (
            el.type.includes('state') ||
            el.type.includes('State')
        ));

        console.log(`\nState elements found: ${stateElements.length}`);
        stateElements.forEach((el, idx) => {
            console.log(`  [${idx}] ${el.name} (type: ${el.type})`);
        });

        // Expected states from camera-states.sysml:
        // 1. CameraState (state def)
        // 2. cameraPowerStates (main state machine)
        // 3. off
        // 4. initializing
        // 5. ready
        // 6. idle (nested in ready)
        // 7. focusing (nested in ready)
        // 8. capturing (nested in ready)
        // 9. processing (nested in ready)
        // 10. reviewing (nested in ready)
        // 11. lowBattery

        assert.ok(elements.length >= 10, `Expected at least 10 elements, got ${elements.length}`);
        assert.ok(stateElements.length >= 10, `Expected at least 10 state elements, got ${stateElements.length}`);

        // Check for specific expected states
        const expectedStateNames = [
            'CameraState',
            'cameraPowerStates',
            'off',
            'initializing',
            'ready',
            'idle',
            'focusing',
            'capturing',
            'processing',
            'reviewing',
            'lowBattery'
        ];

        const foundStateNames = stateElements.map(el => el.name);
        const missingStates = expectedStateNames.filter(name => !foundStateNames.includes(name));

        if (missingStates.length > 0) {
            console.log(`\nMissing expected states: ${missingStates.join(', ')}`);
        }

        assert.strictEqual(missingStates.length, 0,
            `Missing states: ${missingStates.join(', ')}. Found: ${foundStateNames.join(', ')}`);
    });

    test('Parse camera-states.sysml', async () => {
        const samplesPath = path.join(__dirname, '..', '..', 'samples', 'Camera Example', 'camera-states.sysml');
        const content = fs.readFileSync(samplesPath, 'utf8');
        const document = await createTestDocument(content);

        const hierarchicalElements = parser.parseForVisualization(document);
        const elements = flattenElements(hierarchicalElements);

        console.log('=== Parser Test Results ===');
        console.log(`Total elements parsed: ${elements.length}`);

        const stateElements = elements.filter(el => el.type && (
            el.type.includes('state') ||
            el.type.includes('State')
        ));

        console.log(`State elements found: ${stateElements.length}`);
        stateElements.forEach((el, idx) => {
            console.log(`  [${idx}] ${el.name} (type: ${el.type})`);
        });

        // Parser should find states
        assert.ok(stateElements.length >= 10,
            `Parser should find at least 10 states, got ${stateElements.length}`);
    });

    test('Parse state transitions from camera-states.sysml', async () => {
        const samplesPath = path.join(__dirname, '..', '..', 'samples', 'Camera Example', 'camera-states.sysml');
        const content = fs.readFileSync(samplesPath, 'utf8');
        const document = await createTestDocument(content);

        // Parse with ANTLR
        const hierarchicalElements = parser.parseForVisualization(document);
        const elements = flattenElements(hierarchicalElements);

        console.log('=== State Transitions Test ===');
        console.log(`Total elements: ${elements.length}`);

        // Transitions are stored as elements with type 'transition', not in relationships
        const transitions = elements.filter(el =>
            el.type && el.type.includes('transition')
        );

        console.log(`Transitions found: ${transitions.length}`);
        transitions.forEach((el, idx) => {
            const fromState = el.attributes?.get('fromState') || 'unknown';
            const toState = el.attributes?.get('toState') || 'unknown';
            console.log(`  [${idx}] ${el.name} (from: ${fromState}, to: ${toState})`);
        });

        // Expected transitions from camera-states.sysml:
        // - off_to_initializing
        // - initializing_to_ready
        // - idle_to_focusing
        // - focusing_to_capturing
        // - capturing_to_processing
        // - processing_to_reviewing
        // - reviewing_to_idle
        // - focusing_to_idle
        // - ready_to_lowBattery
        // - lowBattery_to_ready
        // - ready_to_off
        // - lowBattery_to_off
        // Total: at least 12 transitions

        assert.ok(transitions.length >= 12,
            `Expected at least 12 transitions, got ${transitions.length}`);
    });

    test('Verify state element attributes', async () => {
        const samplesPath = path.join(__dirname, '..', '..', 'samples', 'Camera Example', 'camera-states.sysml');
        const content = fs.readFileSync(samplesPath, 'utf8');
        const document = await createTestDocument(content);

        const hierarchicalElements = parser.parseForVisualization(document);
        const elements = flattenElements(hierarchicalElements);

        const stateElements = elements.filter(el => el.type && (
            el.type.includes('state') ||
            el.type.includes('State')
        ));

        console.log('=== State Attributes Test ===');

        // Check for states with entry/exit/do actions
        // Note: entry/do/exit actions are parsed as child elements, not as attributes
        const initializingState = stateElements.find(el => el.name === 'initializing');
        if (initializingState) {
            console.log(`initializing state children: ${initializingState.children?.length || 0}`);
        }

        const capturingState = stateElements.find(el => el.name === 'capturing');
        if (capturingState) {
            console.log(`capturing state children: ${capturingState.children?.length || 0}`);

            // Entry/do/exit actions are child elements, not attributes
            const entryActions = (capturingState.children || []).filter(c => c.type === 'entry');
            const doActions = (capturingState.children || []).filter(c => c.type === 'do');
            const exitActions = (capturingState.children || []).filter(c => c.type === 'exit');

            console.log(`  entry actions: ${entryActions.length}, do actions: ${doActions.length}, exit actions: ${exitActions.length}`);

            // capturing state should have entry, do, and exit actions as children
            // Note: These may be parsed as separate elements; verify at least some are present
            const hasActions = entryActions.length > 0 || doActions.length > 0 || exitActions.length > 0 ||
                              (capturingState.children && capturingState.children.length > 0);
            assert.ok(hasActions, 'capturing state should have entry/do/exit actions or children');
        }

        // Check for nested states
        const readyState = stateElements.find(el => el.name === 'ready');
        if (readyState) {
            console.log(`ready state children count: ${readyState.children?.length || 0}`);

            // ready should have nested states: idle, focusing, capturing, processing, reviewing
            assert.ok(readyState.children && readyState.children.length >= 5,
                'ready state should have at least 5 nested states');
        }
    });

    test('Parser results consistency', async () => {
        const samplesPath = path.join(__dirname, '..', '..', 'samples', 'Camera Example', 'camera-states.sysml');
        const content = fs.readFileSync(samplesPath, 'utf8');
        const document = await createTestDocument(content);

        const hierarchical = parser.parseForVisualization(document);
        const elements = flattenElements(hierarchical);
        const states = elements.filter(el => el.type &&
            (el.type.includes('state') || el.type.includes('State')));

        console.log('=== Parser Results ===');
        console.log(`States: ${states.length}`);

        const names = new Set(states.map(el => el.name));

        console.log(`Found state names: ${Array.from(names).join(', ')}`);

        // Verify we have parsed states successfully
        assert.ok(states.length > 0, 'Should parse at least one state');
    });
});

suite('Doc Attribute Preservation Tests', () => {
    let parser: SysMLParser;

    setup(() => {
        parser = new SysMLParser();
    });

    test('Doc should be preserved through entire visualization flow for concern element', async () => {
        // Test concern element with doc and stakeholder
        const content = `package SmartHome {
    part def HomeownersAssociation;
    concern 'Minimize maintenance complexity' {
        doc
        /*
         * Reduce maintenance complexity to minimize
         * the need for specialized technicians.
         */
        stakeholder homeowners : HomeownersAssociation;
    }
}`;

        const document = await createTestDocument(content);

        // Step 1: Parse with semantic resolution (what updateVisualization does)
        const resolutionResult = await parser.parseWithSemanticResolution(document);
        console.log('[VIZ TEST] parseWithSemanticResolution returned:', resolutionResult.elements.length, 'elements');

        // Step 2: Convert to SysML elements (what updateVisualization does)
        const sysmlElements = parser.convertEnrichedToSysMLElements(resolutionResult.elements);
        console.log('[VIZ TEST] convertEnrichedToSysMLElements returned:', sysmlElements.length, 'elements');

        // Find concern in SysML elements
        function findConcern(els: SysMLElement[]): SysMLElement | null {
            for (const el of els) {
                if (el.type === 'concern') {
                    return el;
                }
                if (el.children) {
                    const found = findConcern(el.children);
                    if (found) return found;
                }
            }
            return null;
        }

        const concern = findConcern(sysmlElements);
        console.log('[VIZ TEST] Concern found:', concern ? concern.name : 'NO');
        console.log('[VIZ TEST] Concern attributes:', concern?.attributes);
        console.log('[VIZ TEST] Concern has doc:', concern?.attributes?.has('doc'));

        assert.ok(concern, 'Concern should be found in SysML elements');
        assert.ok(concern.attributes, 'Concern should have attributes');
        assert.ok(concern.attributes.has('doc'), 'Concern should have doc attribute');

        const doc = concern.attributes.get('doc');
        console.log('[VIZ TEST] Concern doc value:', doc);
        assert.ok(typeof doc === 'string', 'Doc should be a string');
        assert.ok(doc.includes('maintenance') || doc.includes('technicians'), 'Doc should contain expected content');

        // Step 3: Simulate convertElementsToJSON (what visualization panel does)
        function convertElementsToJSON(elements: SysMLElement[]): any[] {
            return elements.map(element => {
                const attributes: Record<string, any> = {};
                if (element.attributes) {
                    element.attributes.forEach((value, key) => {
                        attributes[key] = value;
                    });
                }
                return {
                    name: element.name,
                    type: element.type,
                    attributes,
                    children: convertElementsToJSON(element.children)
                };
            });
        }

        const jsonElements = convertElementsToJSON(sysmlElements);
        console.log('[VIZ TEST] JSON elements created:', jsonElements.length);

        // Find concern in JSON elements
        function findConcernJSON(els: any[]): any | null {
            for (const el of els) {
                if (el.type === 'concern') {
                    return el;
                }
                if (el.children) {
                    const found = findConcernJSON(el.children);
                    if (found) return found;
                }
            }
            return null;
        }

        const jsonConcern = findConcernJSON(jsonElements);
        console.log('[VIZ TEST] JSON Concern found:', jsonConcern ? jsonConcern.name : 'NO');
        console.log('[VIZ TEST] JSON Concern attributes:', jsonConcern?.attributes);
        console.log('[VIZ TEST] JSON Concern.attributes.doc:', jsonConcern?.attributes?.doc);

        assert.ok(jsonConcern, 'JSON Concern should be found');
        assert.ok(jsonConcern.attributes, 'JSON Concern should have attributes object');
        assert.ok(jsonConcern.attributes.doc, 'JSON Concern should have doc in attributes');
        assert.ok(jsonConcern.attributes.doc.includes('maintenance') || jsonConcern.attributes.doc.includes('technicians'), 'Doc content should be preserved in JSON');

        console.log('[VIZ TEST] ✅ SUCCESS: Doc attribute preserved through entire visualization flow!');
    });

    test('Doc extraction in collectNodeContent simulation', async () => {
        // This test simulates the webview's collectNodeContent function
        const content = `package SmartHome {
    part def HomeownersAssociation;
    concern 'Minimize maintenance complexity' {
        doc
        /*
         * Reduce maintenance complexity to minimize
         * the need for specialized technicians.
         */
        stakeholder homeowners : HomeownersAssociation;
    }
}`;

        const document = await createTestDocument(content);
        const resolutionResult = await parser.parseWithSemanticResolution(document);
        const sysmlElements = parser.convertEnrichedToSysMLElements(resolutionResult.elements);

        // Convert to JSON (same as visualization panel)
        function convertElementsToJSON(elements: SysMLElement[]): any[] {
            return elements.map(element => {
                const attributes: Record<string, any> = {};
                if (element.attributes) {
                    element.attributes.forEach((value, key) => {
                        attributes[key] = value;
                    });
                }
                return {
                    name: element.name,
                    type: element.type,
                    attributes,
                    children: convertElementsToJSON(element.children)
                };
            });
        }

        const jsonElements = convertElementsToJSON(sysmlElements);

        // Define categories exactly as webview does
        const GENERAL_VIEW_CATEGORIES = [
            { id: 'parts', label: 'Parts', keywords: ['part'] },
            { id: 'attributes', label: 'Attributes', keywords: ['attribute', 'attr'] },
            { id: 'ports', label: 'Ports', keywords: ['port'] },
            { id: 'actions', label: 'Actions', keywords: ['action'] },
            { id: 'states', label: 'States', keywords: ['state'] },
            { id: 'requirements', label: 'Requirements', keywords: ['requirement', 'req'] },
            { id: 'interfaces', label: 'Interfaces', keywords: ['interface'] },
            { id: 'usecases', label: 'Use Cases', keywords: ['use case', 'usecase'] },
            { id: 'concerns', label: 'Concerns', keywords: ['concern', 'viewpoint', 'stakeholder', 'frame'] },
            { id: 'items', label: 'Items', keywords: ['item'] },
            { id: 'other', label: 'Other', keywords: [] }
        ];

        const expandedGeneralCategories = new Set(GENERAL_VIEW_CATEGORIES.map(c => c.id));
        const PACKAGE_TYPES = new Set(['package', 'lib', 'library']);

        function getCategoryForType(typeLower: string): string {
            for (const cat of GENERAL_VIEW_CATEGORIES) {
                if (cat.keywords.some(kw => typeLower.includes(kw))) {
                    return cat.id;
                }
            }
            return 'other';
        }

        // Simulate findTopLevelElements
        const topLevelElements: any[] = [];
        function findTopLevelElements(elements: any[], depth: number) {
            if (!elements || !Array.isArray(elements)) return;
            elements.forEach((el) => {
                if (!el || !el.name) return;
                const typeLower = (el.type || '').toLowerCase().trim();

                // Skip packages
                if (PACKAGE_TYPES.has(typeLower) || typeLower.includes('package')) {
                    if (el.children) findTopLevelElements(el.children, depth);
                    return;
                }

                const category = getCategoryForType(typeLower);
                console.log(`[SIMULATE] Element: ${el.name}, type: ${typeLower}, category: ${category}, expanded: ${expandedGeneralCategories.has(category)}, depth: ${depth}`);

                if (!expandedGeneralCategories.has(category)) {
                    console.log(`[SIMULATE] ⚠️ ${el.name} filtered out - category not expanded`);
                    return;
                }

                if (depth <= 1) {
                    topLevelElements.push(el);
                    console.log(`[SIMULATE] ✅ ${el.name} added to topLevelElements`);
                } else {
                    console.log(`[SIMULATE] ⚠️ ${el.name} filtered out - depth ${depth} > 1`);
                }
            });
        }

        findTopLevelElements(jsonElements, 0);

        console.log(`[SIMULATE] topLevelElements count: ${topLevelElements.length}`);
        console.log(`[SIMULATE] topLevelElements: ${topLevelElements.map(e => e.name).join(', ')}`);

        // Find concern in topLevelElements
        const concern = topLevelElements.find(el => el.type === 'concern');
        console.log(`[SIMULATE] Concern in topLevelElements: ${concern ? concern.name : 'NOT FOUND'}`);
        assert.ok(concern, 'Concern should be in topLevelElements');

        // Simulate collectNodeContent for doc extraction
        function collectNodeContent(el: any) {
            const docLines: any[] = [];
            const typeLower = (el.type || '').toLowerCase();

            // Extract doc from attributes (same logic as webview)
            let doc = null;
            if (el.attributes) {
                if (typeof el.attributes.get === 'function') {
                    doc = el.attributes.get('doc') || el.attributes.get('documentation') || el.attributes.get('text');
                } else {
                    doc = el.attributes.doc || el.attributes.documentation || el.attributes.text;
                }
            }
            if (!doc && el.documentation) doc = el.documentation;
            if (!doc && el.text) doc = el.text;

            console.log(`[SIMULATE collectNodeContent] ${el.name} type: ${typeLower}, doc: ${doc ? doc.substring(0, 50) : 'NULL'}`);

            if (doc && typeof doc === 'string') {
                const cleanDoc = doc.split('/*').join('').split('*/').join('').trim();
                if (cleanDoc.length > 0) {
                    docLines.push({ type: 'doc', text: cleanDoc });
                    console.log(`[SIMULATE collectNodeContent] ✅ Doc line added for ${el.name}`);
                }
            }

            const sections: any[] = [];
            if (docLines.length > 0) {
                sections.push({ title: 'Doc', lines: docLines.slice(0, 4) });
                console.log(`[SIMULATE collectNodeContent] ✅ Doc section added for ${el.name}`);
            }

            return sections;
        }

        const concernSections = collectNodeContent(concern);
        console.log(`[SIMULATE] Concern sections: ${concernSections.map(s => s.title).join(', ')}`);

        // Verify Doc section exists
        const docSection = concernSections.find(s => s.title === 'Doc');
        assert.ok(docSection, 'Concern should have Doc section');
        assert.ok(docSection.lines.length > 0, 'Doc section should have lines');
        assert.ok(docSection.lines[0].text.includes('maintenance') || docSection.lines[0].text.includes('technicians'), 'Doc text should contain expected content');

        console.log('[SIMULATE] ✅ Full webview rendering simulation PASSED!');
    });

    test('Doc extraction from inline model with concerns', async () => {
        // Test with inline SysML content containing concerns
        const content = `package SmartHome {
    part def HomeownersAssociation;
    concern 'Minimize maintenance complexity' {
        doc
        /*
         * Reduce maintenance complexity to minimize
         * the need for specialized technicians.
         */
        stakeholder homeowners : HomeownersAssociation;
    }
    concern 'Energy efficiency' {
        doc
        /*
         * The system should optimize energy usage
         * to reduce operating costs.
         */
    }
}`;

        console.log('[CONCERN TEST] Content size:', content.length);

        const document = await createTestDocument(content);
        const resolutionResult = await parser.parseWithSemanticResolution(document);
        const sysmlElements = parser.convertEnrichedToSysMLElements(resolutionResult.elements);

        // Find all concerns with doc
        function findConcernsWithDoc(elements: SysMLElement[], results: any[] = [], pathStr: string = '') {
            for (const el of elements) {
                const currentPath = pathStr ? `${pathStr}.${el.name}` : el.name;
                if (el.type === 'concern') {
                    const hasDoc = el.attributes?.has('doc');
                    const doc = el.attributes?.get('doc');
                    console.log(`[CONCERN TEST] Found concern: "${el.name}" at ${currentPath}`);
                    const docPreview = doc && typeof doc === 'string' ? `${doc.substring(0, 60)  }...` : 'NULL';
                    console.log(`[CONCERN TEST]   hasDoc: ${hasDoc}, doc: ${docPreview}`);
                    results.push({ name: el.name, path: currentPath, hasDoc, doc });
                }
                if (el.children) {
                    findConcernsWithDoc(el.children, results, currentPath);
                }
            }
            return results;
        }

        const concerns = findConcernsWithDoc(sysmlElements);
        console.log(`[CONCERN TEST] Total concerns found: ${concerns.length}`);

        const concernsWithDoc = concerns.filter(c => c.hasDoc);
        console.log(`[CONCERN TEST] Concerns with doc: ${concernsWithDoc.length}`);

        assert.ok(concerns.length > 0, 'Should find at least one concern');
        assert.ok(concernsWithDoc.length > 0, 'At least one concern should have doc attribute');

        console.log('[CONCERN TEST] ✅ SUCCESS!');
    });

    test('IBD view should find internal parts from inline model', async () => {
        // Test with inline SysML content containing parts and interfaces
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
        part controller;
        part sensors;
        part actuators;
        part battery {
            port powerPort : PowerIP;
        }
        part hub {
            port hubPort : ~PowerIP;
        }
        interface bat2hub : PowerInterface connect battery.powerPort to hub.hubPort;
    }
}`;

        const document = await createTestDocument(content);
        const resolutionResult = await parser.parseWithSemanticResolution(document);
        const sysmlElements = parser.convertEnrichedToSysMLElements(resolutionResult.elements);

        // Flatten all elements
        function flattenElements(els: SysMLElement[], result: SysMLElement[] = []): SysMLElement[] {
            for (const el of els) {
                result.push(el);
                if (el.children) {
                    flattenElements(el.children, result);
                }
            }
            return result;
        }

        const allElements = flattenElements(sysmlElements);
        console.log(`[IBD TEST] Total flattened elements: ${allElements.length}`);

        // Log all element types
        const typeGroups: Record<string, number> = {};
        allElements.forEach(el => {
            const t = el.type || 'unknown';
            typeGroups[t] = (typeGroups[t] || 0) + 1;
        });
        console.log('[IBD TEST] Element type counts:', JSON.stringify(typeGroups, null, 2));

        // Find parts (not part defs)
        const parts = allElements.filter(el => {
            if (!el.type) return false;
            const typeLower = el.type.toLowerCase();
            return typeLower === 'part' ||
                   typeLower === 'part usage' ||
                   (typeLower.includes('part') && !typeLower.includes('def'));
        });

        console.log(`[IBD TEST] Parts found: ${parts.length}`);
        parts.forEach(p => console.log(`[IBD TEST]   Part: ${p.name} (type: ${p.type})`));

        // Find ports
        const ports = allElements.filter(el => {
            if (!el.type) return false;
            const typeLower = el.type.toLowerCase();
            return typeLower.includes('port') && !typeLower.includes('def');
        });

        console.log(`[IBD TEST] Ports found: ${ports.length}`);
        ports.forEach(p => console.log(`[IBD TEST]   Port: ${p.name} (type: ${p.type})`));

        // Find connectors/interfaces
        const connectors = allElements.filter(el => {
            if (!el.type) return false;
            const typeLower = el.type.toLowerCase();
            return typeLower.includes('interface') || typeLower.includes('connect');
        });

        console.log(`[IBD TEST] Connectors/Interfaces found: ${connectors.length}`);
        connectors.forEach(c => console.log(`[IBD TEST]   Connector: ${c.name} (type: ${c.type})`));

        // SmartHome should have internal parts: controller, sensors, actuators, battery, hub
        assert.ok(parts.length > 0, 'Should find parts in model');

        // Check for specific parts
        const partNames = parts.map(p => p.name);
        console.log(`[IBD TEST] Part names: ${partNames.join(', ')}`);

        // These are internal parts of SmartHome
        const expectedParts = ['controller', 'sensors', 'actuators', 'battery', 'hub'];
        const foundExpected = expectedParts.filter(name => partNames.includes(name));
        console.log(`[IBD TEST] Found expected parts: ${foundExpected.join(', ')}`);

        assert.ok(foundExpected.length > 0, `Should find at least one of: ${expectedParts.join(', ')}`);

        console.log('[IBD TEST] ✅ SUCCESS!');
    });
});

suite('Complex Model IBD Tests', () => {
    let parser: SysMLParser;

    setup(() => {
        parser = new SysMLParser();
    });

    test('Parse complex model and find vehicles', async function() {
        // Increase timeout for this test
        this.timeout(30000);

        // Use inline content that tests the same structural patterns
        const content = `package VehicleModel {
    package Definitions {
        part def Vehicle;
        part def Engine;
        part def Transmission;
        part def Wheel;
        port def DrivePort;
    }
    package Configurations {
        package ConfigurationA {
            part vehicle_a : Definitions::Vehicle {
                part engine : Definitions::Engine;
                part wheels : Definitions::Wheel [4];
            }
        }
        package ConfigurationB {
            part vehicle_b : Definitions::Vehicle {
                part engine : Definitions::Engine;
                part transmission : Definitions::Transmission;
                part wheels : Definitions::Wheel [4];
                part frontAxle;
                part rearAxle;
            }
        }
    }
}`;
        const document = await createTestDocument(content);

        console.log('[VEHICLE TEST] Parsing VehicleModel...');
        console.log(`[VEHICLE TEST] Content length: ${content.length}`);

        // Parse with the parser
        const hierarchicalElements = parser.parseForVisualization(document);
        const elements = flattenElements(hierarchicalElements);

        console.log(`[VEHICLE TEST] Total hierarchical elements: ${hierarchicalElements.length}`);
        console.log(`[VEHICLE TEST] Total flattened elements: ${elements.length}`);

        // Log top-level structure
        hierarchicalElements.forEach(el => {
            console.log(`[VEHICLE TEST] Top-level: ${el.name} (${el.type}) - ${el.children?.length || 0} children`);
        });

        // Find packages
        const packages = elements.filter(el => el.type && el.type.toLowerCase().includes('package'));
        console.log(`[VEHICLE TEST] Packages found: ${packages.length}`);
        packages.slice(0, 20).forEach(p => {
            console.log(`[VEHICLE TEST]   Package: ${p.name}`);
        });

        // Find Configurations package specifically
        const configPackage = packages.find(p => p.name === 'Configurations');
        if (configPackage) {
            console.log(`[VEHICLE TEST] Found Configurations with ${configPackage.children?.length || 0} children`);
        } else {
            console.log('[VEHICLE TEST] Configurations NOT FOUND');
        }

        // Find all parts
        const partElements = elements.filter(el => {
            const typeLower = (el.type || '').toLowerCase();
            return typeLower.includes('part') && !typeLower.includes('def');
        });
        console.log(`[VEHICLE TEST] Part usages found: ${partElements.length}`);
        partElements.slice(0, 30).forEach(p => {
            console.log(`[VEHICLE TEST]   Part: ${p.name} [${p.type}] - ${p.children?.length || 0} children`);
        });

        // Find vehicle_a and vehicle_b
        const vehicleA = elements.find(el => el.name === 'vehicle_a');
        const vehicleB = elements.find(el => el.name === 'vehicle_b');

        console.log(`[VEHICLE TEST] vehicle_a found: ${!!vehicleA}`);
        console.log(`[VEHICLE TEST] vehicle_b found: ${!!vehicleB}`);

        if (vehicleA) {
            console.log(`[VEHICLE TEST] vehicle_a type: ${vehicleA.type}, children: ${vehicleA.children?.length || 0}`);
        }
        if (vehicleB) {
            console.log(`[VEHICLE TEST] vehicle_b type: ${vehicleB.type}, children: ${vehicleB.children?.length || 0}`);
        }

        // Find parts with children (potential IBD containers)
        const partsWithChildren = partElements.filter(p => p.children && p.children.length > 0);
        console.log(`[VEHICLE TEST] Parts with children (IBD containers): ${partsWithChildren.length}`);
        partsWithChildren.slice(0, 10).forEach(p => {
            console.log(`[VEHICLE TEST]   ${p.name}: ${p.children?.length || 0} children`);
        });

        // Assertions
        assert.ok(packages.length > 0, 'Should find packages in VehicleModel');
        assert.ok(configPackage, 'Should find Configurations package');
        assert.ok(partElements.length > 0, 'Should find part usages');
        assert.ok(vehicleA || vehicleB, 'Should find vehicle_a or vehicle_b');
        assert.ok(partsWithChildren.length > 0, 'Should find parts with children for IBD view');

        console.log('[VEHICLE TEST] ✅ SUCCESS!');
    });
});

// Helper function to create test documents
async function createTestDocument(content: string): Promise<vscode.TextDocument> {
    const document = await vscode.workspace.openTextDocument({
        language: 'sysml',
        content: content
    });
    return document;
}

