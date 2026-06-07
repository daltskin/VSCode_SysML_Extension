/**
 * SysML language client factory — web (browser) variant.
 *
 * Runs the language server inside a Web Worker, as required by the
 * web extension host (e.g. vscode.dev), which has no Node.js runtime.
 * The worker script is the browser server bundle, copied into the
 * extension at `dist/web/sysmlServer.js` during the build.
 *
 * Substituted for `createClient.ts` in the web bundle by the esbuild
 * resolver plugin (see esbuild.mjs).
 */

import * as vscode from 'vscode';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';

const CLIENT_ID = 'sysmlLanguageServer';
const CLIENT_NAME = 'SysML v2 Language Server';

/** Create the web language client (server runs in a Web Worker). */
export function createLanguageClient(
    context: vscode.ExtensionContext,
    clientOptions: LanguageClientOptions,
    outputChannel: vscode.LogOutputChannel,
): BaseLanguageClient {
    const serverUri = vscode.Uri.joinPath(context.extensionUri, 'dist', 'web', 'sysmlServer.js');
    outputChannel.appendLine(`Starting SysML v2 language server (Web Worker): ${serverUri.toString(true)}`);

    const worker = new Worker(serverUri.toString(true));
    // vscode-languageclient v10 browser constructor signature is
    // (id, name, serverOptions /* Worker */, clientOptions) — matching the
    // Node variant. (v9 took clientOptions before the worker.)
    return new LanguageClient(CLIENT_ID, CLIENT_NAME, worker, clientOptions);
}
