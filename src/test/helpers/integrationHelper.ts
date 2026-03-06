/**
 * Shared helpers for integration tests.
 *
 * Provides active polling for LSP readiness instead of blind `sleep()` calls.
 * Module state (`_lspWarmedUp`) is shared across all test files because Node
 * caches the require'd module — so the first suite to warm up the LSP benefits
 * every subsequent suite.
 */
import * as path from 'path';
import * as vscode from 'vscode';

/* global Thenable */

/** Whether the LSP has successfully returned document symbols at least once. */
let _lspWarmedUp = false;

/** Project root (workspace folder containing package.json). */
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

/** Absolute path to the samples/ directory. */
export const SAMPLES_DIR = path.join(PROJECT_ROOT, 'samples');

/** Promise-based delay. */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Poll for document symbols as a proxy for "the LSP has parsed this file".
 * Returns `true` if symbols appeared before the timeout, `false` otherwise.
 */
export async function waitForLsp(uri: vscode.Uri, timeoutMs = 15_000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider',
                uri,
            );
            if (symbols && symbols.length > 0) {
                _lspWarmedUp = true;
                return true;
            }
        } catch {
            /* LSP not ready yet — keep polling */
        }
        await sleep(500);
    }
    return false;
}

/**
 * Open a sample SysML file from `samples/` and wait for LSP readiness.
 * Uses a shorter timeout when the LSP is already warm.
 */
export async function openSample(
    fileName: string,
    timeoutMs?: number,
): Promise<{ doc: vscode.TextDocument; editor: vscode.TextEditor; ready: boolean }> {
    const filePath = path.join(SAMPLES_DIR, fileName);
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    const editor = await vscode.window.showTextDocument(doc);
    const timeout = timeoutMs ?? (_lspWarmedUp ? 5_000 : 15_000);
    const ready = await waitForLsp(doc.uri, timeout);
    return { doc, editor, ready };
}

/**
 * Poll until `fn()` returns a result that satisfies `check()`, or timeout.
 *
 * Replaces manual retry loops like `for (const delay of [5000, 8000, 12000])`
 * with efficient 500 ms polling — typically resolving in < 1 s once the LSP is warm.
 */
export async function pollForResult<T>(
    fn: () => Thenable<T | undefined> | Promise<T | undefined>,
    check: (r: T | undefined) => boolean,
    timeoutMs = 10_000,
): Promise<T | undefined> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const result = await fn();
            if (check(result)) { return result; }
        } catch {
            /* not ready yet */
        }
        await sleep(500);
    }
    return undefined;
}

/** Whether the LSP server has successfully returned symbols at least once. */
export function isLspWarmedUp(): boolean {
    return _lspWarmedUp;
}
