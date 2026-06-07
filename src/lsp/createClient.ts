/**
 * SysML language client factory — desktop (Node) variant.
 *
 * Launches the language server as a Node module over IPC transport,
 * using the path exported by the `sysml-v2-lsp` package.
 *
 * The browser build swaps this for `createClient.browser.ts` (see the
 * esbuild resolver plugin), which runs the server in a Web Worker.
 */

import * as vscode from 'vscode';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';

const CLIENT_ID = 'sysmlLanguageServer';
const CLIENT_NAME = 'SysML v2 Language Server';

/**
 * Resolve the absolute path to the sysml-v2-lsp server module
 * (`dist/server/server.js` inside node_modules).
 */
function resolveServerPath(): string {
    const { serverPath } = require('sysml-v2-lsp');
    return serverPath as string;
}

/** Create the desktop language client (Node IPC transport). */
export function createLanguageClient(
    _context: vscode.ExtensionContext,
    clientOptions: LanguageClientOptions,
    outputChannel: vscode.LogOutputChannel,
): BaseLanguageClient {
    const serverModule = resolveServerPath();
    outputChannel.appendLine(`Starting SysML v2 language server: ${serverModule}`);

    const serverOptions: ServerOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc,
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: {
                execArgv: ['--nolazy', '--inspect=6009'],
            },
        },
    };

    return new LanguageClient(CLIENT_ID, CLIENT_NAME, serverOptions, clientOptions);
}
