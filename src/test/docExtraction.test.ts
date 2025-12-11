/**
 * Simple test to verify doc extraction works
 * This adds a unit test case specifically for doc extraction
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ANTLRSysMLParser } from '../parser/antlrSysMLParser';
import { SysMLParser } from '../parser/sysmlParser';

suite('Doc Extraction Tests', () => {
    let parser: ANTLRSysMLParser;

    setup(() => {
        parser = new ANTLRSysMLParser();
    });

    test('Should extract doc from package with block comment', () => {
        const content = `package TestPackage {
    doc
    /*
     * This is the package documentation
     */
    part def Vehicle;
}`;

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        // Find the package element
        const pkg = elements.find(el => el.type === 'package');
        assert.ok(pkg, 'Package should be found');
        assert.ok(pkg.attributes, 'Package should have attributes');

        const doc = pkg.attributes.get('doc');
        console.log('[TEST] Package doc:', doc);
        assert.ok(doc, 'Package should have doc attribute');
        assert.ok(typeof doc === 'string' && doc.includes('package documentation'), 'Doc should contain expected content');
    });

    test('Should extract doc from concern element', () => {
        const content = `package TestPackage {
    part def HeroAssociation;
    concern 'Reduce the number of special parts' {
        doc
        /*
         * Reduce the number of special parts to reduce the dependency
         * to special suppliers and experts.
         */
        stakeholder heroAss : HeroAssociation;
    }
}`;

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        // Find the package and its children
        const pkg = elements.find(el => el.type === 'package');
        assert.ok(pkg, 'Package should be found');

        // Find the concern
        const concern = pkg.children.find(el => el.type === 'concern');
        console.log('[TEST] Concern element:', {
            name: concern?.name,
            type: concern?.type,
            attributeSize: concern?.attributes?.size,
            hasDoc: concern?.attributes?.has('doc')
        });

        assert.ok(concern, 'Concern should be found');
        assert.equal(concern.name, "Reduce the number of special parts");

        const doc = concern.attributes.get('doc');
        console.log('[TEST] Concern doc:', doc);
        assert.ok(doc, 'Concern should have doc attribute');
        assert.ok(typeof doc === 'string' && doc.includes('Reduce the number'), 'Doc should contain expected content');
    });

    test('Should extract doc from requirement def', () => {
        const content = `package TestPackage {
    requirement def VehicleMaxSpeed {
        doc
        /*
         * The actual speed shall always be less or equal to the max speed.
         */
        attribute maxSpeed :> ISQ::speed;
    }
}`;

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        const pkg = elements.find(el => el.type === 'package');
        assert.ok(pkg, 'Package should be found');

        const reqDef = pkg.children.find(el => el.type === 'requirement def');
        console.log('[TEST] Requirement def:', {
            name: reqDef?.name,
            type: reqDef?.type,
            attributeSize: reqDef?.attributes?.size,
            hasDoc: reqDef?.attributes?.has('doc')
        });

        assert.ok(reqDef, 'Requirement def should be found');

        const doc = reqDef.attributes.get('doc');
        console.log('[TEST] Requirement def doc:', doc);
        assert.ok(doc, 'Requirement def should have doc attribute');
        assert.ok(typeof doc === 'string' && doc.includes('actual speed'), 'Doc should contain expected content');
    });

    test('Doc should be preserved when converting to JSON', () => {
        const content = `package TestPackage {
    concern 'TestConcern' {
        doc
        /*
         * Concern documentation for JSON test
         */
    }
}`;

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        // Simulate convertElementsToJSON conversion
        function convertToJSON(elements: any[]): any[] {
            return elements.map(element => {
                const attributes: Record<string, any> = {};
                if (element.attributes && element.attributes instanceof Map) {
                    element.attributes.forEach((value: any, key: string) => {
                        attributes[key] = value;
                    });
                }
                return {
                    name: element.name,
                    type: element.type,
                    attributes,
                    children: convertToJSON(element.children || [])
                };
            });
        }

        const jsonElements = convertToJSON(elements);
        const jsonPkg = jsonElements[0];
        console.log('[TEST] JSON Package:', jsonPkg.name, 'children:', jsonPkg.children?.length);

        const jsonConcern = jsonPkg.children?.find((el: any) => el.type === 'concern');
        console.log('[TEST] JSON Concern:', {
            name: jsonConcern?.name,
            type: jsonConcern?.type,
            attributes: jsonConcern?.attributes
        });

        assert.ok(jsonConcern, 'JSON Concern should exist');
        assert.ok(jsonConcern.attributes, 'JSON Concern should have attributes object');
        assert.ok(jsonConcern.attributes.doc, 'JSON Concern should have doc in attributes');
        console.log('[TEST] JSON Concern doc:', jsonConcern.attributes.doc);
        assert.ok(jsonConcern.attributes.doc.includes('Concern documentation'), 'Doc content should be preserved');
    });

    test('Doc should be usable by collectNodeContent simulation', () => {
        const content = `package TestPackage {
    concern 'TestConcern' {
        doc
        /*
         * This is the concern documentation text
         */
    }
}`;

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        // Convert to JSON (simulating what happens in visualizationPanel)
        function convertToJSON(elements: any[]): any[] {
            return elements.map(element => {
                const attributes: Record<string, any> = {};
                if (element.attributes && element.attributes instanceof Map) {
                    element.attributes.forEach((value: any, key: string) => {
                        attributes[key] = value;
                    });
                }
                return {
                    name: element.name,
                    type: element.type,
                    attributes,
                    children: convertToJSON(element.children || [])
                };
            });
        }

        const jsonElements = convertToJSON(elements);
        const jsonPkg = jsonElements[0];
        const jsonConcern = jsonPkg.children?.find((el: any) => el.type === 'concern');

        // Simulate what collectNodeContent does - exact copy from visualizationPanel.ts
        function simulateCollectNodeContent(el: any): { title: string; lines: { type: string; text: string; rawDoc?: boolean }[] }[] {
            const sections: { title: string; lines: { type: string; text: string; rawDoc?: boolean }[] }[] = [];
            const docLines: { type: string; text: string; rawDoc?: boolean }[] = [];

            const _typeLower = (el.type || '').toLowerCase();

            // Extract doc/documentation from attributes or direct property
            let doc: string | null = null;
            // Note: attributes is serialized as a plain object, not a Map
            if (el.attributes) {
                if (typeof el.attributes.get === 'function') {
                    doc = el.attributes.get('doc') || el.attributes.get('documentation') || el.attributes.get('text');
                } else {
                    doc = el.attributes.doc || el.attributes.documentation || el.attributes.text;
                }
            }
            if (!doc && el.documentation) doc = el.documentation;
            if (!doc && el.text) doc = el.text;

            console.log('[TEST simulateCollectNodeContent] Element:', el.name, 'type:', el.type, 'doc found:', doc ? doc.substring(0, 50) : 'null');

            // Also check for doc children
            if (!doc && el.children && el.children.length > 0) {
                for (let i = 0; i < el.children.length; i++) {
                    const child = el.children[i];
                    if (child && child.type && child.type.toLowerCase() === 'doc') {
                        if (child.attributes) {
                            if (typeof child.attributes.get === 'function') {
                                doc = child.attributes.get('content');
                            } else {
                                doc = child.attributes.content;
                            }
                        }
                        if (!doc) {
                            doc = child.fullText || child.name || '';
                        }
                        if (doc) break;
                    }
                }
            }

            if (doc && typeof doc === 'string') {
                const cleanDoc = doc.split('/*').join('').split('*/').join('').trim();
                console.log('[TEST simulateCollectNodeContent] Processing doc - raw:', doc.length, 'clean:', cleanDoc.length);
                if (cleanDoc.length > 0) {
                    docLines.push({ type: 'doc', text: cleanDoc, rawDoc: true });
                }
            }

            // Build sections
            if (docLines.length > 0) {
                sections.push({ title: 'Doc', lines: docLines.slice(0, 4) });
            }

            console.log('[TEST simulateCollectNodeContent] Final sections:', sections.map(s => s.title).join(', '));
            return sections;
        }

        const sections = simulateCollectNodeContent(jsonConcern);
        console.log('[TEST] Sections result:', JSON.stringify(sections));

        assert.ok(sections.length > 0, 'Sections should not be empty');
        assert.ok(sections.some(s => s.title === 'Doc'), 'Doc section should exist');
        const docSection = sections.find(s => s.title === 'Doc');
        assert.ok(docSection && docSection.lines.length > 0, 'Doc section should have lines');
        assert.ok(docSection && docSection.lines[0].text.includes('concern documentation'), 'Doc content should be found');
    });

    test('Should extract doc from concern with stakeholder', () => {
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

        const document = createMockDocument(content);
        const elements = parser.parseDocument(document);

        console.log('[TEST] Parsed elements:', elements.length);
        const pkg = elements[0];
        console.log('[TEST] Package:', pkg?.name, 'children:', pkg?.children?.length);

        // Find the concern element (should be a child of the package)
        const concern = pkg?.children?.find((el: any) => el.type === 'concern');
        console.log('[TEST] Concern:', concern ? {
            name: concern.name,
            type: concern.type,
            hasDoc: concern.attributes?.has('doc'),
            docValue: String(concern.attributes?.get('doc') || '').substring(0, 80)
        } : 'NOT FOUND');

        assert.ok(concern, 'Concern element should be found');
        assert.ok(concern.attributes.has('doc'), 'Concern should have doc attribute');

        const doc = concern.attributes.get('doc');
        console.log('[TEST] Concern doc content:', doc);
        assert.ok(typeof doc === 'string', 'Doc should be a string');
        assert.ok(doc.includes('maintenance') || doc.includes('technicians'), 'Doc should contain expected content');
    });

    test('Doc should be preserved through full visualization pipeline using SysMLParser', async () => {
        // This test replicates the exact flow used in visualizationPanel.ts
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

        const document = createMockDocument(content);
        const sysmlParser = new SysMLParser();

        // Step 1: Parse with semantic resolution (like visualizationPanel does)
        const resolutionResult = await sysmlParser.parseWithSemanticResolution(document);
        console.log('[TEST PIPELINE] Resolution result elements:', resolutionResult.elements.length);

        // Step 2: Convert enriched to SysML elements (like visualizationPanel does)
        const elements = sysmlParser.convertEnrichedToSysMLElements(resolutionResult.elements);
        console.log('[TEST PIPELINE] Converted elements:', elements.length);

        // Find the concern in the converted elements
        function findConcern(elements: any[]): any {
            for (const el of elements) {
                if (el.type === 'concern') {
                    return el;
                }
                if (el.children && el.children.length > 0) {
                    const found = findConcern(el.children);
                    if (found) return found;
                }
            }
            return null;
        }

        const concern = findConcern(elements);
        console.log('[TEST PIPELINE] Found concern:', concern ? {
            name: concern.name,
            type: concern.type,
            hasDocAttr: concern.attributes?.has?.('doc'),
            docValue: concern.attributes?.get?.('doc')?.substring?.(0, 50) || 'N/A'
        } : 'NOT FOUND');

        assert.ok(concern, 'Concern should be found');
        assert.ok(concern.attributes, 'Concern should have attributes');
        assert.ok(concern.attributes instanceof Map, 'Concern attributes should be a Map');
        assert.ok(concern.attributes.has('doc'), 'Concern should have doc attribute');

        const doc = concern.attributes.get('doc');
        console.log('[TEST PIPELINE] Doc content:', doc);
        assert.ok(typeof doc === 'string', 'Doc should be a string');
        assert.ok(doc.includes('maintenance') || doc.includes('technicians'), 'Doc should contain expected content');

        // Step 3: Convert to JSON (like visualizationPanel.convertElementsToJSON does)
        function convertToJSON(elements: any[]): any[] {
            return elements.map((element: any) => {
                const attributes: Record<string, any> = {};
                if (element.attributes && element.attributes instanceof Map) {
                    element.attributes.forEach((value: any, key: string) => {
                        attributes[key] = value;
                    });
                }
                return {
                    name: element.name,
                    type: element.type,
                    attributes,
                    children: convertToJSON(element.children || [])
                };
            });
        }

        const jsonElements = convertToJSON(elements);
        const jsonConcern = findConcern(jsonElements);
        console.log('[TEST PIPELINE] JSON Concern:', jsonConcern ? {
            name: jsonConcern.name,
            type: jsonConcern.type,
            attributes: jsonConcern.attributes
        } : 'NOT FOUND');

        assert.ok(jsonConcern, 'JSON Concern should be found');
        assert.ok(jsonConcern.attributes.doc, 'JSON Concern should have doc');
        assert.ok(jsonConcern.attributes.doc.includes('special'), 'JSON Concern doc should have content');
    });
});

/**
 * Helper function to create a mock VS Code TextDocument for testing.
 */
function createMockDocument(content: string): vscode.TextDocument {
    const lines = content.split('\n');

    return {
        uri: vscode.Uri.file('test.sysml'),
        fileName: 'test.sysml',
        isUntitled: false,
        languageId: 'sysml',
        version: 1,
        isDirty: false,
        isClosed: false,
        getText: (range?: vscode.Range) => {
            if (range) {
                const selectedLines = lines.slice(range.start.line, range.end.line + 1);
                if (selectedLines.length === 1) {
                    return selectedLines[0].substring(range.start.character, range.end.character);
                }
                selectedLines[0] = selectedLines[0].substring(range.start.character);
                selectedLines[selectedLines.length - 1] = selectedLines[selectedLines.length - 1].substring(0, range.end.character);
                return selectedLines.join('\n');
            }
            return content;
        },
        getWordRangeAtPosition: (position: vscode.Position, regex?: RegExp) => {
            const line = lines[position.line];
            if (!line) return undefined;

            const wordRegex = regex || /\w+/;
            const match = line.substring(position.character).match(wordRegex);
            if (match && match.index === 0) {
                return new vscode.Range(
                    position.line, position.character,
                    position.line, position.character + match[0].length
                );
            }
            return undefined;
        },
        lineAt: (line: number | vscode.Position) => {
            const lineNumber = typeof line === 'number' ? line : line.line;
            const lineText = lines[lineNumber] || '';
            return {
                lineNumber,
                text: lineText,
                range: new vscode.Range(lineNumber, 0, lineNumber, lineText.length),
                rangeIncludingLineBreak: new vscode.Range(lineNumber, 0, lineNumber + 1, 0),
                firstNonWhitespaceCharacterIndex: lineText.search(/\S/),
                isEmptyOrWhitespace: /^\s*$/.test(lineText)
            };
        },
        offsetAt: (position: vscode.Position) => {
            let offset = 0;
            for (let i = 0; i < position.line; i++) {
                offset += lines[i].length + 1;
            }
            offset += position.character;
            return offset;
        },
        positionAt: (offset: number) => {
            let currentOffset = 0;
            for (let line = 0; line < lines.length; line++) {
                if (currentOffset + lines[line].length >= offset) {
                    return new vscode.Position(line, offset - currentOffset);
                }
                currentOffset += lines[line].length + 1;
            }
            return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
        },
        save: () => Promise.resolve(false),
        lineCount: lines.length,
        validatePosition: (position: vscode.Position) => position,
        validateRange: (range: vscode.Range) => range,
        encoding: 'utf8',
        eol: vscode.EndOfLine.LF
    } as vscode.TextDocument;
}
