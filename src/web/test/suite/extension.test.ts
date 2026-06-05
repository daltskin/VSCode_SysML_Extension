/**
 * Web (browser) integration tests.
 *
 * These run inside the REAL VS Code web extension host (the same worker
 * runtime vscode.dev uses), launched headlessly by `@vscode/test-web`.
 * Unlike the Node smoke test, this proves the extension activates and the
 * browser-hosted language server (a Web Worker) actually answers requests.
 */
import * as vscode from 'vscode';

const EXTENSION_ID = 'JamieD.sysml-v2-support';

/** Minimal browser-safe assertions (Node's `assert` is unavailable here). */
const assert = {
    ok(value: unknown, message?: string): asserts value {
        if (!value) {
            throw new Error(message ?? `Expected truthy value, got ${String(value)}`);
        }
    },
    strictEqual<T>(actual: T, expected: T, message?: string): void {
        if (actual !== expected) {
            throw new Error(message ?? `Expected ${String(expected)}, got ${String(actual)}`);
        }
    },
};

const SAMPLE = `package VehicleModel {
    part def Vehicle {
        part engine : Engine;
        attribute mass : Real;
    }
    part def Engine {
        attribute power : Real;
    }
}
`;

/** Poll until `fn` returns a truthy value or the timeout elapses. */
async function waitFor<T>(fn: () => Thenable<T> | T, timeoutMs = 20000, intervalMs = 250): Promise<T> {
    const deadline = Date.now() + timeoutMs;
    let last: T;
    for (;;) {
        last = await fn();
        if (last) {
            return last;
        }
        if (Date.now() > deadline) {
            return last;
        }
        await new Promise((r) => setTimeout(r, intervalMs));
    }
}

suite('SysML Web Extension', () => {
    test('runs in the browser web extension host (no Node runtime)', () => {
        assert.strictEqual(vscode.env.uiKind, vscode.UIKind.Web, 'expected Web uiKind');
        assert.strictEqual(typeof (globalThis as { process?: unknown }).process, 'undefined',
            'expected no Node process global in the web host');
    });

    test('activates the extension', async () => {
        const ext = vscode.extensions.getExtension(EXTENSION_ID);
        assert.ok(ext, `extension ${EXTENSION_ID} not found`);
        await ext!.activate();
        assert.strictEqual(ext!.isActive, true, 'extension failed to activate');
    });

    test('browser language server answers document symbol requests', async () => {
        const doc = await vscode.workspace.openTextDocument({ language: 'sysml', content: SAMPLE });
        await vscode.window.showTextDocument(doc);

        const symbols = await waitFor(() =>
            vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider', doc.uri));

        assert.ok(Array.isArray(symbols) && symbols.length > 0,
            'expected the browser LSP worker to return document symbols');
        const names = symbols.map((s) => s.name).join(', ');
        assert.ok(/VehicleModel|Vehicle|Engine/.test(names),
            `expected SysML symbols, got: ${names}`);
    });

    test('browser language server answers hover requests', async () => {
        const doc = await vscode.workspace.openTextDocument({ language: 'sysml', content: SAMPLE });
        await vscode.window.showTextDocument(doc);

        // Position over "Vehicle" in "part def Vehicle".
        const offset = SAMPLE.indexOf('part def Vehicle') + 'part def '.length + 2;
        const pos = doc.positionAt(offset);

        const hovers = await waitFor(() =>
            vscode.commands.executeCommand<vscode.Hover[]>(
                'vscode.executeHoverProvider', doc.uri, pos));

        assert.ok(Array.isArray(hovers) && hovers.length > 0,
            'expected the browser LSP worker to return a hover');
    });
});
