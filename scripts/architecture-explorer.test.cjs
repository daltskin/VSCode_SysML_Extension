require('../src/test/register-vscode-mock.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const vscode = require('vscode');
const { ArchitectureExplorerPanel } = require('../out/panels/architectureExplorerPanel');
const { buildArchitectureGraph, answerArchitectureQuestion } = require('../out/architecture/architectureGraph');

const root = path.resolve(__dirname, '..');
const origin = 'http://architecture.test';
const elements = Array.from({ length: 322 }, (_, index) => ({
    name: `component${index}`, type: 'part', symbolId: `component${index}`, children: [],
    attributes: {}, relationships: [],
    range: { start: { line: index, character: 0 }, end: { line: index, character: 20 } },
}));
const graph = buildArchitectureGraph([{ uri: 'file:///large.sysml', label: 'large.sysml', version: 1,
    text: Array.from({ length: 260 }, (_, index) =>
        `dependency from component${index + 1} to component${index};`).join('\n'),
    elements, relationships: Array.from({ length: 260 }, (_, index) => ({
        type: 'dependency', source: `component${index + 1}`, target: `component${index}`,
    })),
}]);
const selectedId = graph.nodes[0].id;
const answer = answerArchitectureQuestion(graph, 'removal', selectedId);
const html = ArchitectureExplorerPanel.html({ cspSource: origin,
    asWebviewUri: uri => `${origin}${uri.path.slice(root.length)}`,
}, vscode.Uri.file(root));

async function run() {
    fs.mkdirSync(path.join(root, 'coverage'), { recursive: true });
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route(`${origin}/**`, route => {
            const pathname = new URL(route.request().url()).pathname;
            if (pathname === '/') return route.fulfill({ contentType: 'text/html', body: html });
            const resource = path.resolve(root, `.${decodeURIComponent(pathname)}`);
            if (!resource.startsWith(path.join(root, 'media') + path.sep)) return route.abort();
            const types = { '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
            return route.fulfill({ contentType: types[path.extname(resource)], body: fs.readFileSync(resource) });
        });
        await page.addInitScript(({ graph, selectedId, answer }) => {
            window.acquireVsCodeApi = () => ({ getState: () => null, setState: () => {},
                postMessage: message => {
                    window.lastHostMessage = message;
                    const data = message.command === 'ready'
                        ? { command: 'snapshot', graph, selectedId, revision: 1 }
                        : message.command === 'query'
                            ? { command: 'answer', answer, revision: 1, requestId: message.requestId } : undefined;
                    if (data) queueMicrotask(() => window.dispatchEvent(new MessageEvent('message', { data })));
                },
            });
        }, { graph, selectedId, answer });
        await page.goto(origin);
        await page.locator('#status').filter({ hasText: /^Ready$/ }).waitFor();
        assert.equal(await page.locator('.element-row').count(), 50);
        assert.equal(await page.locator('.finding').count(), 25);
        assert.equal(await page.locator('.path-link').count(), 0);
        await page.locator('.finding-details summary').first().click();
        await page.locator('.path-link').first().waitFor();
        await page.locator('.path-link').first().click();
        assert.equal(await page.evaluate(() => window.lastHostMessage.command), 'navigateEdge');
        assert.match(await page.locator('#trace-count').textContent(), /^2 elements/);
        assert.equal(await page.locator('#element-pages-previous').isDisabled(), true);
        for (let index = 0; index < 6; index++) await page.locator('#element-pages-next').click();
        assert.equal(await page.locator('#element-pages-previous').evaluate(button => button === document.activeElement), true);
        assert.equal(await page.locator('.element-row').count(), 22);
        assert.match(await page.locator('.element-row').last().textContent(), /component321/);
        assert.equal(await page.locator('#element-pages-next').isDisabled(), true);
        await page.locator('#search').fill('component321');
        assert.equal(await page.locator('.element-row').count(), 1);
        assert.equal(await page.locator('#element-pages').isHidden(), true);
        await page.locator('.element-row').click();
        assert.equal(await page.evaluate(() => window.lastHostMessage.selectedId), graph.nodes[321].id);
        await page.locator('#search').fill('');
        for (let index = 0; index < 10; index++) await page.locator('#finding-pages-next').click();
        assert.equal(await page.locator('.finding').count(), 10);
        assert.equal(await page.locator('#findings').getAttribute('start'), '251');
        assert.equal(await page.locator('#finding-pages-next').isDisabled(), true);
        await page.locator('.finding').last().click();
        assert.match(await page.locator('#trace-count').textContent(), /^262 elements/);
        await page.locator('#source').click();
        assert.equal(await page.evaluate(() => window.lastHostMessage.command), 'navigate');
        await page.locator('.element-row').first().click();
        await page.locator('#ask').click();
        await page.locator('#status').filter({ hasText: /^Ready$/ }).waitFor();
        assert.equal(await page.locator('#findings').getAttribute('start'), '1');
        for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
            await page.setViewportSize(viewport);
            await page.locator('#fit').click();
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            assert.equal(await page.locator('#graph canvas').evaluateAll(canvases => canvases.some(canvas => {
                const context = canvas.getContext('2d');
                if (!context || !canvas.width || !canvas.height) return false;
                const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
                return pixels.some((value, index) => index % 4 === 3 && value !== 0);
            })), true);
            await page.screenshot({ path: path.join(root, 'coverage', `architecture-${viewport.width}.png`), fullPage: true });
        }
        await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', {
            data: { command: 'invalidated', revision: 2 },
        })));
        assert.equal(await page.locator('.finding').count(), 0);
        assert.equal(await page.locator('#finding-pages').isHidden(), true);
        assert.equal(await page.locator('#element-pages').isHidden(), true);
        assert.equal(await page.locator('#ask').isDisabled(), true);
        assert.deepEqual(errors, []);
        console.log('Architecture browser checks passed: pagination, complete selected trace, source navigation, invalidation, desktop/mobile canvas.');
    } finally { await browser.close(); }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
