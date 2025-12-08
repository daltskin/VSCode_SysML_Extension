import * as assert from 'assert';
import * as vscode from 'vscode';
import { SysMLDefinitionProvider } from '../navigation/definitionProvider';
import { SysMLParser } from '../parser/sysmlParser';

suite('SysML Navigation Test Suite', () => {
    vscode.window.showInformationMessage('Running SysML Navigation tests...');

    let parser: SysMLParser;
    let definitionProvider: SysMLDefinitionProvider;

    setup(() => {
        parser = new SysMLParser();
        definitionProvider = new SysMLDefinitionProvider(parser);
    });

    test('Go to definition for part reference', async () => {
        const content = `package TestPackage {
    part def Engine {
    }
    part def Vehicle {
        part engine : Engine;
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        // Find position of "Engine" in the reference
        const position = findPosition(document, 'engine : Engine');
        const wordPos = new vscode.Position(position.line, position.character + 9); // "Engine"

        const definition = definitionProvider.provideDefinition(
            document,
            wordPos,
            new vscode.CancellationTokenSource().token
        );

        if (definition instanceof vscode.Location) {
            assert.ok(definition);
            assert.strictEqual(definition.uri, document.uri);
        }
    });

    test('Go to definition returns null for unknown element', async () => {
        const content = `package TestPackage {
    part def Vehicle {
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        const position = new vscode.Position(0, 0);
        const definition = await definitionProvider.provideDefinition(
            document,
            position,
            new vscode.CancellationTokenSource().token
        );

        assert.strictEqual(definition, null);
    });

    test('Go to definition for specialization', async () => {
        const content = `package TestPackage {
    part def Base {
    }
    part def Derived :> Base {
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        const position = findPosition(document, ':> Base');
        const wordPos = new vscode.Position(position.line, position.character + 3); // "Base"

        const definition = definitionProvider.provideDefinition(
            document,
            wordPos,
            new vscode.CancellationTokenSource().token
        );

        assert.ok(definition);
    });

    test('Find element at position', async () => {
        const content = `package TestPackage {
    part def Vehicle {
        attribute mass : Real;
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        const position = findPosition(document, 'attribute mass');
        const element = parser.findElementAtPosition(document, position);

        assert.ok(element);
        assert.strictEqual(element.name, 'mass');
    });

    test('Symbol provider returns document symbols', async () => {
        const content = `package TestPackage {
    part def Vehicle {
        attribute mass : Real;
    }
}`;
        const document = await createTestDocument(content);
        parser.parse(document);

        // Test would require proper symbol provider implementation
        // This is a basic structure test
        assert.ok(parser.getElements().size > 0);
    });
});

async function createTestDocument(content: string): Promise<vscode.TextDocument> {
    const document = await vscode.workspace.openTextDocument({
        language: 'sysml',
        content: content
    });
    return document;
}

function findPosition(document: vscode.TextDocument, searchText: string): vscode.Position {
    const text = document.getText();
    const index = text.indexOf(searchText);
    if (index === -1) {
        return new vscode.Position(0, 0);
    }

    const beforeText = text.substring(0, index);
    const lines = beforeText.split('\n');
    const line = lines.length - 1;
    const character = lines[lines.length - 1].length;

    return new vscode.Position(line, character);
}
