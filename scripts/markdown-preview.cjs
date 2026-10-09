require('../src/test/register-vscode-mock.cjs');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { fork, execFileSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const ts = require('typescript');
const rpc = require('vscode-jsonrpc/node');
const { URI, Utils } = require('vscode-uri');
const vscode = require('vscode');
const MarkdownIt = require('markdown-it');
const { DiagramCache } = require('../out/markdown/diagramCache');
const { installMarkdownPlugin } = require('../out/markdown/markdownItPlugin');
const { diagramShell } = require('../out/visualization/core/diagramShell');
const { modelSnapshot } = require('../out/visualization/core/modelSnapshot');
const { selectView } = require('../out/visualization/core/viewScope');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 45189);
const child = fork(require('sysml-v2-lsp').serverPath, ['--node-ipc'], { silent: true });
const connection = rpc.createMessageConnection(new rpc.IPCMessageReader(child), new rpc.IPCMessageWriter(child));
connection.onRequest('workspace/configuration', ({ items }) => items.map(() => ({})));
connection.onRequest('client/registerCapability', () => null);
connection.listen();
vscode.Uri.joinPath = (base, ...segments) => Utils.joinPath(URI.from(base), ...segments);
vscode.workspace.workspaceFolders = [{ uri: URI.file(root) }];
vscode.workspace.textDocuments = [];
const loaded = new Map();
const cache = new DiagramCache(async uri => {
    if (!loaded.has(uri)) {
        const text = fs.readFileSync(URI.parse(uri).fsPath, 'utf8');
        await connection.sendNotification('textDocument/didOpen', {
            textDocument: { uri, languageId: 'sysml', version: 1, text },
        });
        loaded.set(uri, text);
    }
    return connection.sendRequest('sysml/model', { textDocument: { uri } });
}, () => undefined);
const markdown = installMarkdownPlugin(new MarkdownIt(), cache);
let baseline;

function getBaseline() {
    if (baseline) return baseline;
    const ref = process.env.VISUAL_BASELINE || '7e5cb546ee41859761471e9c0a0d96168d9870dc';
    const source = execFileSync('git', ['show', `${ref}:src/visualization/visualizationPanel.ts`],
        { cwd: root, encoding: 'utf8' });
    const file = ts.createSourceFile('baseline.ts', source, ts.ScriptTarget.Latest, true);
    const declaration = file.statements.find(node => ts.isClassDeclaration(node) && node.name?.text === 'VisualizationPanel');
    const names = ['_getHtmlForWebview', 'convertDTOElementsToJSON', 'mergeElementDTOs'];
    const methods = names.map(name => {
        const method = declaration?.members.find(node => node.name?.getText(file) === name);
        if (!method) throw new Error(`Baseline ${ref} is missing ${name}.`);
        return method.getText(file);
    }).join('\n');
    const nonce = file.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === '_getNonce');
    if (!nonce) throw new Error(`Baseline ${ref} is missing its nonce helper.`);
    const input = `const vscode = require('vscode');
        const { displayNameOf, displayNamesById, elementKey, isAnonymousElement, relationshipSource } = require('../out/providers/modelNames');
        class Baseline { constructor() { this._extensionVersion = ''; } ${methods} }
        ${nonce.getText(file)}\nreturn Baseline;`;
    const compiled = ts.transpileModule(input, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
    const Baseline = new Function('require', compiled)(require);
    baseline = { instance: new Baseline(), Baseline };
    return baseline;
}

function visualizerHtml(mode, entry, sample, url) {
    if (entry.state !== 'ready') throw new Error(entry.error || 'Model is not ready.');
    const origin = url.origin;
    const resourceHost = {
        cspSource: "'self'",
        asWebviewUri: uri => URI.parse(origin + uri.path.slice(root.length)),
    };
    let html;
    let payload = modelSnapshot(entry.value);
    if (mode === 'baseline') {
        const { instance, Baseline } = getBaseline();
        html = instance._getHtmlForWebview(resourceHost, URI.file(root));
        payload = { ...payload, elements: instance.convertDTOElementsToJSON(Baseline.mergeElementDTOs(entry.value.elements ?? [])) };
    } else if (mode === 'current') {
        html = diagramShell(resourceHost, URI.file(root));
    } else throw new Error('Renderer must be baseline or current.');
    payload = { ...payload, ...selectView(entry.value.elements ?? [], {
        model: sample, diagram: url.searchParams.get('diagrams') || 'general',
    }) };
    const nonce = /<script nonce="([^"]+)"/.exec(html)?.[1];
    if (!nonce) throw new Error('Renderer script nonce is missing.');
    const dark = url.searchParams.get('theme') === 'dark';
    const foreground = dark ? '#d4d4d4' : '#333333';
    const background = dark ? '#1e1e1e' : '#ffffff';
    const theme = `<style>body{--vscode-font-family:monospace;--vscode-editor-background:${background};--vscode-editor-foreground:${foreground};--vscode-descriptionForeground:${dark ? '#999' : '#555'};--vscode-panel-border:${dark ? '#555' : '#aaa'};--vscode-editorWidget-background:${dark ? '#252526' : '#f0f1f2'};--vscode-editorWidget-border:#777;--vscode-sideBar-background:${dark ? '#252526' : '#f3f3f3'};--vscode-list-hoverBackground:${dark ? '#333' : '#eee'};--vscode-input-background:${background};--vscode-input-foreground:${foreground};--vscode-focusBorder:#007acc;--vscode-button-background:#007acc;--vscode-button-foreground:#fff}</style>`;
    const json = JSON.stringify(payload).replace(/</g, '\\u003c');
    const bridge = `<script nonce="${nonce}">
        window.parityPayload = ${json};
        window.parityOriginalPayload = JSON.parse(JSON.stringify(window.parityPayload));
        window.acquireVsCodeApi = () => ({getState(){return {};},setState(){},postMessage(){}});
        window.addEventListener('load', () => window.dispatchEvent(new MessageEvent('message', {data:window.parityPayload})));
        </script>`;
    return html.replace('</head>', `${theme}</head>`).replace('<body>', `<body>${bridge}`);
}

async function start() {
    await connection.sendRequest('initialize', {
        processId: process.pid, rootUri: URI.file(root).toString(),
        workspaceFolders: [{ uri: URI.file(root).toString(), name: 'SysML' }],
        capabilities: { workspace: { configuration: true } },
    });
    await connection.sendNotification('initialized', {});
    const server = http.createServer(async (request, response) => {
        try {
            const url = new URL(request.url, `http://127.0.0.1:${port}`);
            if (url.pathname === '/') {
                const sample = url.searchParams.get('sample') || 'Camera Example/Camera.sysml';
                const diagrams = (url.searchParams.get('diagrams') || 'general,sequence,activity,state,interconnection').split(',');
                const view = url.searchParams.get('view');
                const fence = url.searchParams.has('empty') ? 'Ordinary Markdown.' : diagrams.map(diagram => '```sysmlv2-view\nmodel: ' + JSON.stringify('../samples/' + sample)
                    + '\ndiagram: ' + diagram + (view ? '\nview: ' + view : '') + '\n```').join('\n\n');
                const environment = { currentDocument: URI.file(path.join(root, 'docs/demo.md')).toString() };
                const uri = URI.file(path.join(root, 'samples', sample)).toString();
                if (!URI.parse(uri).fsPath.startsWith(path.join(root, 'samples') + path.sep)) throw new Error('Invalid sample');
                markdown.render(fence, environment);
                let entry = cache.lookup(uri, -1, environment.currentDocument);
                for (let attempt = 0; entry.state === 'loading' && attempt < 200; attempt++) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    entry = cache.lookup(uri, -1, environment.currentDocument);
                }
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
                const renderer = url.searchParams.get('renderer');
                if (renderer) {
                    response.end(visualizerHtml(renderer, entry, sample, url));
                    return;
                }
                const nonce = randomBytes(16).toString('hex');
                response.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; worker-src 'self' blob:;`);
                response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '<link rel="stylesheet" href="/media/markdown-preview/preview.css">'
                    + '<style>body{margin:20px;--vscode-editor-background:#fff;--vscode-editor-foreground:#222;--vscode-font-family:monospace;--vscode-panel-border:#aaa;--vscode-descriptionForeground:#555;--vscode-editorWidget-background:#f0f1f2;--vscode-editorWidget-border:#777;--vscode-sideBar-background:#f3f3f3;--vscode-list-hoverBackground:#eee;--vscode-input-background:#fff;--vscode-input-foreground:#222;--vscode-focusBorder:#007acc}</style>'
                    + '</head><body>' + markdown.render(fence, environment)
                    + `<script nonce="${nonce}" src="/media/markdown-preview/bootstrap.js"></script></body></html>`);
            } else {
                const resource = path.resolve(root, '.' + decodeURIComponent(url.pathname));
                if (!resource.startsWith(path.join(root, 'media') + path.sep)) {
                    response.writeHead(404).end();
                    return;
                }
                response.setHeader('Content-Type', path.extname(resource) === '.js' ? 'text/javascript' : 'text/css');
                response.end(fs.readFileSync(resource));
            }
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end(error.message);
        }
    });
    const close = () => { cache.dispose(); connection.dispose(); child.kill(); server.close(); };
    server.on('error', error => { console.error(error); close(); process.exitCode = 1; });
    server.listen(port, '127.0.0.1', () => console.log(`Markdown diagrams: http://127.0.0.1:${port}`));
    process.on('SIGINT', close);
    process.on('SIGTERM', close);
}

start().catch(error => { console.error(error); connection.dispose(); child.kill(); process.exitCode = 1; });
