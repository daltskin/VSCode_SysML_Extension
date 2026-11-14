import * as assert from 'assert';
import * as vscode from 'vscode';
import { pollForResult } from './helpers/integrationHelper';

const _isUnitTest = (vscode as any)._isMock === true;

suite('SysML Keyword Diagnostics', () => {
    test('Scopes calculation parameters to each usage while rejecting duplicates in one body',
        async function() {
            if (_isUnitTest) { return this.skip(); }
            this.timeout(30000);

            const content = `package CalculationScopes {
    part def Engine;
    part x : Engine;
    calc def A { in engine : Engine; }
    calc def B { in engine : Engine; }
    part def Car {
        calc a : A { in engine = x; in engine = x; }
    }
}`;
            const document = await vscode.workspace.openTextDocument({
                language: 'sysml',
                content
            });
            const editor = await vscode.window.showTextDocument(document);
            const ambiguities = () => vscode.languages.getDiagnostics(document.uri)
                .filter(diagnostic => diagnostic.code === 'ambiguous-namespace-name');

            const duplicates = await pollForResult(
                async () => ambiguities(),
                diagnostics => diagnostics?.length === 2
            );
            assert.strictEqual(duplicates?.length, 2,
                'Duplicate calculation parameters in one body should report two diagnostics');

            const edited = await editor.edit(edit => edit.replace(
                new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
                content.replace(
                    'calc a : A { in engine = x; in engine = x; }',
                    'calc a : A { in engine = x; }\n        calc b : B { in engine = x; }'
                )
            ));
            assert.ok(edited, 'Expected the calculation body edit to succeed');

            const separateBodies = await pollForResult(
                async () => ambiguities(),
                diagnostics => diagnostics?.length === 0
            );
            assert.strictEqual(separateBodies?.length, 0,
                'Same-named parameters in separate calculation bodies should not be ambiguous');
        });

    test('Reports diagnostics for syntax errors caused by keyword typos', async function() {
        if (_isUnitTest) { return this.skip(); } // needs real LSP diagnostics
        this.timeout(10000);

        // "packagedasf" and "party" are typos of "package" and "part".
        // The ANTLR parser treats them as identifiers, so errors appear on
        // the tokens that follow (e.g. 'MySystem', 'car') rather than on
        // the typos themselves.
        const content = `packagedasf MySystem {
    party car : Vehicle;
}`;

        const document = await vscode.workspace.openTextDocument({
            language: 'sysml',
            content
        });

        await vscode.window.showTextDocument(document);

        await waitForDiagnostics(document.uri, 3000);

        const diags = vscode.languages.getDiagnostics(document.uri);

        // The LSP should report at least one syntax error for this malformed input
        assert.ok(
            diags.length > 0,
            `Expected at least one diagnostic for malformed SysML, got 0`
        );

        // Verify diagnostics are errors (not warnings/info)
        const errors = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
        assert.ok(
            errors.length > 0,
            `Expected at least one Error-level diagnostic. Got: ${JSON.stringify(diags.map(d => d.message))}`
        );
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDiagnostics(uri: vscode.Uri, timeoutMs: number): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const diags = vscode.languages.getDiagnostics(uri);
        if (diags.length > 0) {
            return;
        }
        await sleep(50);
    }
    throw new Error('Timed out waiting for diagnostics');
}
