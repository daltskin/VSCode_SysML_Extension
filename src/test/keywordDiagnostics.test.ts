import * as assert from 'assert';
import * as vscode from 'vscode';

suite('SysML Keyword Diagnostics', () => {
    test('Adds squiggles for likely keyword typos (packagedasf, party)', async function() {
        this.timeout(10000);

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
        const messages = diags.map(d => d.message);

        assert.ok(messages.some(m => m.includes("Unknown keyword 'packagedasf'")), `Missing packagedasf diagnostic. Diagnostics: ${JSON.stringify(messages)}`);
        assert.ok(messages.some(m => m.includes("Unknown keyword 'party'")), `Missing party diagnostic. Diagnostics: ${JSON.stringify(messages)}`);

        const pkgDiag = diags.find(d => d.message.includes("Unknown keyword 'packagedasf'"));
        assert.ok(pkgDiag);
        assert.strictEqual(pkgDiag!.range.start.line, 0);
        assert.strictEqual(pkgDiag!.range.start.character, 0);
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
