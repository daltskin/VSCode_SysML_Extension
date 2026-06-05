// @ts-check
/**
 * Web (browser) bundle for the SysML v2 extension.
 *
 * Produces `dist/web/extension.js` — a browser-platform bundle that
 * runs in the web extension host (e.g. vscode.dev), where there is no
 * Node.js runtime. The desktop build is unchanged and still uses `tsc`
 * (`out/extension.js`, the package `main`).
 *
 * The language server's browser bundle is copied alongside as
 * `dist/web/sysmlServer.js`; the extension launches it as a Web Worker.
 */
import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';

const require = createRequire(import.meta.url);
const isProduction = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');
const withTests = process.argv.includes('--tests');

/**
 * Swap `./createClient` (Node, IPC) for `./createClient.browser` (Web
 * Worker) in the browser bundle.
 */
const browserClientPlugin = {
    name: 'browser-client',
    setup(build) {
        build.onResolve({ filter: /\/createClient(\.js)?$/ }, (args) => ({
            path: path.resolve(args.resolveDir, 'createClient.browser.ts'),
        }));
    },
};

/** Copy the LSP browser server bundle into the extension's web output. */
function copyServerWorker() {
    const { browserServerPath } = require('sysml-v2-lsp');
    mkdirSync('dist/web', { recursive: true });
    copyFileSync(browserServerPath, 'dist/web/sysmlServer.js');
    console.log('Copied browser language server → dist/web/sysmlServer.js');
}

/** @type {esbuild.BuildOptions} */
const webConfig = {
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    entryPoints: ['src/extension.ts'],
    outfile: 'dist/web/extension.js',
    external: ['vscode'],
    sourcemap: !isProduction,
    minify: isProduction,
    logLevel: 'info',
    plugins: [browserClientPlugin],
    // The web extension host provides a CommonJS-like environment; map
    // `process` references that may appear in deps to a minimal stub.
    define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
};

copyServerWorker();

if (isWatch) {
    const ctx = await esbuild.context(webConfig);
    await ctx.watch();
    console.log('Watching web bundle…');
} else {
    await esbuild.build(webConfig);
    console.log(isProduction ? '✅ Web production build complete' : '✅ Web build complete');
}

// Optional: bundle the web integration test suite for `@vscode/test-web`.
// Mocha's browser build expects a few Node-ish globals; provide minimal
// shims so it loads in the browser worker host.
if (withTests) {
    /** @type {esbuild.BuildOptions} */
    const testConfig = {
        bundle: true,
        format: 'cjs',
        platform: 'browser',
        target: 'es2022',
        entryPoints: ['src/web/test/suite/index.ts'],
        outfile: 'dist/web/test/suite/index.js',
        external: ['vscode'],
        sourcemap: true,
        logLevel: 'info',
        define: {
            'process.env.NODE_ENV': '"test"',
            'global': 'globalThis',
        },
    };
    await esbuild.build(testConfig);
    console.log('✅ Web test bundle complete');
}
