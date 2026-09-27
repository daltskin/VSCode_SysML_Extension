require('../src/test/register-vscode-mock.cjs');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const rpc = require('vscode-jsonrpc/node');
const vscode = require('vscode');
const { ModelWorkbenchPanel } = require('../out/panels/modelWorkbenchPanel');
const { buildSnapshot, planOperation, previewChanges } = require('../out/modelEditing/workbenchModel');
const { applySourceEdits } = require('../out/modelEditing/modelEdits');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 45188);
const child = fork(require('sysml-v2-lsp').serverPath, ['--node-ipc'], { silent: true });
const connection = rpc.createMessageConnection(new rpc.IPCMessageReader(child), new rpc.IPCMessageWriter(child));
connection.onRequest('workspace/configuration', ({ items }) => items.map(() => ({})));
connection.onRequest('client/registerCapability', () => null);
connection.listen();
let text = `package Mobility {
    requirement def RangeSpecification;
    requirement <'REQ-001'> minimumRange : RangeSpecification {
        doc /* Vehicle shall travel at least 100 km on a full charge. */
    }
    requirement <'REQ-002'> maximumSpeed {
        doc /* Vehicle shall reach 80 km/h on a level road. */
    }
    requirement <'REQ-003'> emergencyStop {
        doc /* Vehicle shall stop within 8 metres. */
    }
    part vehicle;
    part brakingSystem;
    verification rangeTest { objective { verify Mobility::minimumRange; } }
    verification stopTest;
    satisfy Mobility::minimumRange by Mobility::vehicle;
    dependency from Mobility::brakingSystem to Mobility::vehicle;
}`;
let snapshot;
let revision = 0;
let pending;
let lastMessage;
const uri = 'file:///workbench-preview.sysml';

async function refresh() {
    revision++;
    pending = undefined;
    await connection.sendNotification(revision === 1 ? 'textDocument/didOpen' : 'textDocument/didChange',
        revision === 1 ? { textDocument: { uri, languageId: 'sysml', version: revision, text } }
            : { textDocument: { uri, version: revision }, contentChanges: [{ text }] });
    const model = await connection.sendRequest('sysml/model', {
        textDocument: { uri }, scope: ['elements', 'relationships'],
    });
    snapshot = buildSnapshot([{ uri, label: 'vehicle.sysml', version: revision, text, model }]);
    return { command: 'snapshot', revision, rows: snapshot.rows, links: snapshot.links,
        documents: snapshot.documents.map(({ uri, label, version }) => ({ uri, label, version })) };
}

async function handle(message) {
    lastMessage = message;
    if (message.command === 'ready' || message.command === 'refresh') return [await refresh()];
    if (message.command === 'preview') {
        if (message.revision !== revision) throw new Error('Stale snapshot');
        const plans = planOperation(snapshot, message.operation);
        pending = { token: String(revision), plans };
        return [{ command: 'preview', token: pending.token, changes: previewChanges(snapshot, plans) }];
    }
    if (message.command === 'apply') {
        if (!pending || message.token !== pending.token) throw new Error('Expired preview');
        for (const plan of pending.plans) text = applySourceEdits(text, plan.version, revision, plan.edits);
        return [{ command: 'applied' }, await refresh()];
    }
    return [];
}

const shim = `globalThis.acquireVsCodeApi=()=>({getState:()=>null,setState:()=>{},
postMessage:async message=>{const response=await fetch('/message',{method:'POST',
headers:{'Content-Type':'application/json'},body:JSON.stringify(message)});
for(const data of await response.json())window.dispatchEvent(new MessageEvent('message',{data}));}});`;

async function start() {
    await connection.sendRequest('initialize', { processId: process.pid, rootUri: null,
        workspaceFolders: [], capabilities: { workspace: { configuration: true } } });
    await connection.sendNotification('initialized', {});
    const server = http.createServer(async (request, response) => {
        try {
            const pathname = new URL(request.url, `http://127.0.0.1:${port}`).pathname;
            if (pathname === '/message' && request.method === 'POST') {
                let data = '';
                for await (const chunk of request) {
                    data += chunk;
                    if (data.length > 1_100_000) throw new Error('Request too large');
                }
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(await handle(JSON.parse(data))));
            } else if (pathname === '/state') {
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ text, lastMessage, revision }));
            } else if (pathname === '/') {
                let html = ModelWorkbenchPanel.html({ cspSource: `http://127.0.0.1:${port}`,
                    asWebviewUri: resource => `http://127.0.0.1:${port}${resource.path.slice(root.length)}`,
                }, vscode.Uri.file(root));
                const nonce = /nonce="([^"]+)"/.exec(html)[1];
                html = html.replace("default-src 'none';", "default-src 'none'; connect-src 'self';")
                    .replace('<body>', `<body><script nonce="${nonce}">${shim}</script>`);
                response.setHeader('Content-Type', 'text/html');
                response.end(html);
            } else {
                const resource = path.resolve(root, `.${decodeURIComponent(pathname)}`);
                if (!resource.startsWith(path.join(root, 'media') + path.sep)) {
                    response.writeHead(404).end();
                    return;
                }
                const contentTypes = { '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
                response.setHeader('Content-Type', contentTypes[path.extname(resource)] || 'application/octet-stream');
                response.end(fs.readFileSync(resource));
            }
        } catch (error) {
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify([{ command: 'error', message: error.message }]));
        }
    });
    const close = () => { connection.dispose(); child.kill(); server.close(); };
    server.on('error', error => { console.error(error); close(); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => console.log(`Workbench preview (in-memory model): http://127.0.0.1:${port}`));
    process.on('SIGINT', close);
    process.on('SIGTERM', close);
}

start().catch(error => { console.error(error); connection.dispose(); child.kill(); process.exitCode = 1; });
