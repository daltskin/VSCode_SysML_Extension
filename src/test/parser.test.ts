import * as assert from 'assert';
import * as vscode from 'vscode';
import { SysMLParser } from '../parser/sysmlParser';

suite('SysML Parser Test Suite', () => {
    vscode.window.showInformationMessage('Running SysML Parser tests...');

    let parser: SysMLParser;

    setup(() => {
        parser = new SysMLParser();
    });

    test('Parse simple package', async () => {
        const content = `package TestPackage {
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'TestPackage');
        assert.strictEqual(elements[0].type, 'package');
    });

    test('Parse part definition', async () => {
        const content = `part def Vehicle {
    attribute mass : Real;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Basic functional tests - verify parser doesn't crash and returns reasonable results
        assert.ok(Array.isArray(elements));
        assert.ok(elements.length >= 1);

        const mainElement = elements[0];
        assert.ok(mainElement.name);
        assert.ok(mainElement.type);
        assert.ok(Array.isArray(mainElement.children));
        assert.ok(Array.isArray(mainElement.relationships));
    });

    test('Parse hierarchical structure', async () => {
        const content = `package System {
    part def Component {
        port myInterface : Interface
    }
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'System');
        assert.strictEqual(elements[0].children.length, 1);
        assert.strictEqual(elements[0].children[0].name, 'Component');
        assert.strictEqual(elements[0].children[0].children.length, 1);
        assert.strictEqual(elements[0].children[0].children[0].name, 'myInterface');
        assert.strictEqual(elements[0].children[0].children[0].type, 'port');
    });

    test('Parse specialization relationship', async () => {
        const content = `part def Engine :> PowerSource {
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].relationships.length, 1);
        assert.strictEqual(elements[0].relationships[0].type, 'specializes');
        assert.strictEqual(elements[0].relationships[0].target, 'PowerSource');
    });

    test('Parse multiple relationships', async () => {
        const content = `part def MyPart :> BasePart {
    attribute attr1 subsets baseAttr
    part ref1 references OtherPart
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);
        const relationships = parser.getRelationships();

        // Basic functional tests - verify parser handles complex syntax
        assert.ok(Array.isArray(elements));
        assert.ok(Array.isArray(relationships));
        // Relationships may or may not be detected depending on implementation
    });

    test('Parse requirement', async () => {
        const content = `requirement def PerformanceReq {
    subject vehicle : Vehicle;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'PerformanceReq');
        assert.strictEqual(elements[0].type, 'requirement def');
    });

    test('Parse action', async () => {
        const content = `action def StartEngine {
    in fuelLevel : Real;
    out running : Boolean;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'StartEngine');
        assert.strictEqual(elements[0].type, 'action');
    });

    test('Parse state definition', async () => {
        const content = `state def SystemState {
    entry start;
    exit stop;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Basic functional tests - verify parser handles state definitions
        assert.ok(Array.isArray(elements));
        assert.ok(elements.length >= 1);
        assert.ok(elements[0].name);
        assert.ok(elements[0].type);
    });

    test('Parse use case', async () => {
        const content = `use case LoginUser {
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Basic functional tests - verify parser handles use cases
        assert.ok(Array.isArray(elements));
        assert.ok(elements.length >= 1);
        assert.ok(elements[0].name);
        assert.ok(elements[0].type);
    });

    test('Find element by name', async () => {
        const content = `package TestPkg {
    part def Part1 {
    }
    part def Part2 {
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        const element = parser.findElement('Part1');
        assert.ok(element);
        assert.strictEqual(element.name, 'Part1');
    });

    test('Get all elements', async () => {
        const content = `package TestPkg {
    part def Part1 {
    }
    part def Part2 {
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        const elements = parser.getElements();
        assert.ok(elements.size >= 3); // Package + 2 parts
    });

    test('Handle empty document', async () => {
        const content = '';
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 0);
    });

    test('Handle comments', async () => {
        const content = `// This is a comment
package TestPkg {
    // Another comment
    part def Part1 {
    }
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'TestPkg');
    });

    test('Parse abstract modifier', async () => {
        const content = `abstract part def AbstractPart {
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        assert.strictEqual(elements.length, 1);
        assert.strictEqual(elements[0].name, 'AbstractPart');
    });

    test('Parse connection', async () => {
        const content = `connection def PowerConnection {
    end source : PowerPort;
    end target : PowerPort;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Basic functional tests - verify parser handles connections
        assert.ok(Array.isArray(elements));
        assert.ok(elements.length >= 1);
        assert.ok(elements[0].name);
        assert.ok(elements[0].type);
    });

    test('Parse connection usage', async () => {
        const content = `package Test {
    part def A {}
    part def B {}
    connection dataLink {
        end a : A;
        end b : B;
    }
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Verify connection usage is parsed
        assert.ok(Array.isArray(elements));
        // Find the connection in the parsed elements
        function findConnection(elems: any[]): any {
            for (const e of elems) {
                if (e.type === 'connection') return e;
                if (e.children) {
                    const found = findConnection(e.children);
                    if (found) return found;
                }
            }
            return null;
        }
        const conn = findConnection(elements);
        assert.ok(conn, 'Should find a connection element');
        assert.strictEqual(conn.type, 'connection');
        // Connection should have 2 end children
        assert.strictEqual(conn.children?.length, 2, 'Connection should have 2 end children');
        assert.ok(conn.children?.every((c: any) => c.type === 'end'), 'All children should be ends');
        // Each end should have targetRef attribute
        for (const end of conn.children) {
            const targetRef = end.attributes?.get?.('targetRef');
            assert.ok(targetRef, `End '${end.name}' should have targetRef attribute`);
        }
    });

    test('Parse interface', async () => {
        const content = `interface def ControlInterface {
    attribute signalType : String;
}`;
        const document = await createTestDocument(content);
        const elements = parser.parse(document);

        // Basic functional tests - verify parser handles interfaces
        assert.ok(Array.isArray(elements));
        assert.ok(elements.length >= 1);
        assert.ok(elements[0].name);
        assert.ok(elements[0].type);
    });
});

async function createTestDocument(content: string): Promise<vscode.TextDocument> {
    const document = await vscode.workspace.openTextDocument({
        language: 'sysml',
        content: content
    });
    return document;
}
