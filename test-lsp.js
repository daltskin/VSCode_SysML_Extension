const cp = require('child_process');
const path = require('path');

// Find server path
const { serverPath } = require('sysml-v2-lsp');
console.log('Server:', serverPath);

// Start server with stdio
const server = cp.fork(serverPath, ['--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    cwd: process.cwd(),
});

let buffer = '';
let contentLength = -1;

server.stdout.on('data', (data) => {
    buffer += data.toString();
    while (true) {
        if (contentLength < 0) {
            const idx = buffer.indexOf('\r\n\r\n');
            if (idx < 0) return;
            const header = buffer.substring(0, idx);
            const match = header.match(/Content-Length:\s*(\d+)/);
            if (match) contentLength = parseInt(match[1]);
            buffer = buffer.substring(idx + 4);
        }
        if (buffer.length >= contentLength) {
            const msg = JSON.parse(buffer.substring(0, contentLength));
            buffer = buffer.substring(contentLength);
            contentLength = -1;
            handleMessage(msg);
        } else {
            return;
        }
    }
});

server.stderr.on('data', (data) => {
    // silent
});

let msgId = 1;
function send(msg) {
    const body = JSON.stringify(msg);
    const header = `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n`;
    server.stdin.write(header + body);
}

function sendRequest(method, params) {
    const id = msgId++;
    send({ jsonrpc: '2.0', id, method, params });
    return id;
}

function sendNotification(method, params) {
    send({ jsonrpc: '2.0', method, params });
}

const diagnosticsByUri = {};

function handleMessage(msg) {
    if (msg.method === 'textDocument/publishDiagnostics') {
        const uri = msg.params.uri;
        const diags = msg.params.diagnostics;
        diagnosticsByUri[uri] = diags;
        console.log(`\n=== DIAGNOSTICS for ${uri} ===`);
        if (diags.length === 0) {
            console.log('  (no diagnostics - clean!)');
        }
        for (const d of diags) {
            console.log(`  [${d.severity === 1 ? 'ERROR' : d.severity === 2 ? 'WARN' : 'INFO'}] L${d.range.start.line}:${d.range.start.character}-L${d.range.end.line}:${d.range.end.character}: ${d.message}`);
            if (d.source) console.log(`    source: ${d.source}`);
        }
    } else if (msg.id && msg.result) {
        if (msg.result.capabilities) {
            console.log('Server initialized. Sending initialized notification...');
            sendNotification('initialized', {});

            // Now open the test document
            const testContent = 'interface def MyIntf1 {\n  end port port1;\n  end port2;\n}\n';
            const testUri = 'file:///tmp/test-end-port.sysml';
            console.log('\nOpening test document with content:');
            console.log(testContent);
            sendNotification('textDocument/didOpen', {
                textDocument: {
                    uri: testUri,
                    languageId: 'sysml',
                    version: 1,
                    text: testContent,
                }
            });

            // Wait for diagnostics
            setTimeout(() => {
                console.log('\n=== FINAL SUMMARY ===');
                const keys = Object.keys(diagnosticsByUri);
                const testKey = keys.find(k => k.includes('test-end-port')) || keys[0];
                const diags = testKey ? diagnosticsByUri[testKey] : undefined;
                if (!diags) {
                    console.log('No diagnostics received at all');
                } else if (diags.length === 0) {
                    console.log('SUCCESS: No errors for end port syntax!');
                } else {
                    console.log('FAIL: ' + diags.length + ' diagnostic(s) reported');
                }
                
                // Shutdown
                sendRequest('shutdown', null);
                setTimeout(() => {
                    sendNotification('exit', null);
                    process.exit(0);
                }, 500);
            }, 5000);
        }
    } else if (msg.method === 'sysml/status') {
        console.log('sysml/status: ' + msg.params.state + ' - ' + (msg.params.message || msg.params.fileName || ''));
    } else if (msg.method === 'window/logMessage') {
        // silent
    } else if (msg.method === 'client/registerCapability') {
        send({ jsonrpc: '2.0', id: msg.id, result: null });
    } else if (msg.method === 'workspace/configuration') {
        send({ jsonrpc: '2.0', id: msg.id, result: msg.params.items.map(() => ({})) });
    } else if (msg.method !== 'window/workDoneProgress/create') {
        console.log('Other msg:', msg.method || ('response:' + msg.id), JSON.stringify(msg).substring(0, 200));
    }
}

// Initialize
sendRequest('initialize', {
    processId: process.pid,
    capabilities: {
        textDocument: {
            publishDiagnostics: { relatedInformation: true },
            synchronization: { didOpen: true, didChange: true },
        },
        workspace: { configuration: true },
    },
    rootUri: 'file://' + process.cwd(),
    workspaceFolders: [{ uri: 'file://' + process.cwd(), name: 'test' }],
});

// Safety timeout
setTimeout(() => {
    console.log('\nTimeout reached - killing server');
    server.kill();
    process.exit(1);
}, 15000);
