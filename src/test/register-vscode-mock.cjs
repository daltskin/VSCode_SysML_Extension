/**
 * Mocha --require hook that intercepts `require('vscode')` and returns
 * the lightweight mock in out/test/vscode-mock.js.
 *
 * Plain CJS file — avoids ts-node ESM resolution issues on Node 22+.
 *
 * Usage:  mocha --require src/test/register-vscode-mock.cjs ...
 */

const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
    if (request === 'vscode') {
        return path.resolve(__dirname, '..', '..', 'out', 'test', 'vscode-mock.js');
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
};
