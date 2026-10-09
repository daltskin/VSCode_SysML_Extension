const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/visualization/core/diagramShell.ts'), 'utf8');
const styles = source.match(/<style nonce="\$\{nonce\}">([\s\S]*?)<\/style>/)[1];
const body = source.match(/<body>([\s\S]*?)<script nonce="\$\{nonce\}">/)[1];
const evaluate = raw => new Function('version', 'return `' + raw + '`;')('');
const shell = { css: evaluate(styles), body: evaluate(body) };
const target = path.join(root, 'media/diagram-runtime/shell.js');
fs.writeFileSync(target, 'globalThis.SysMLDiagramShell = ' + JSON.stringify(shell) + ';\n');
