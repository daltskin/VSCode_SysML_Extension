const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.VISUAL_PORT || 45190);
const output = path.join(root, 'coverage', 'visual-parity');
const quick = process.argv.includes('--quick');
const onlyCase = process.argv.find(argument => argument.startsWith('--case='))?.slice(7);
const cases = [
    { name: 'general', sample: 'Camera Example/Camera.sysml' },
    { name: 'general', sample: 'Camera Example/Camera.sysml', layout: 'connection' },
    { name: 'interconnection', sample: 'Camera Example/camera-ibd.sysml' },
    { name: 'sequence', sample: 'Camera Example/camera-sequence.sysml' },
    { name: 'activity', sample: 'Camera Example/camera-activity.sysml' },
    { name: 'state', sample: 'Camera Example/camera-states.sysml' },
    { name: 'usecase', sample: 'Camera Example/camera-usecases.sysml' },
    { name: 'tree', sample: 'Camera Example/Camera.sysml' },
    { name: 'graph', sample: 'Camera Example/Camera.sysml' },
    { name: 'hierarchy', sample: 'Camera Example/Camera.sysml' },
    { name: 'package', sample: 'view-showcase.sysml' },
    { name: 'table', sample: 'view-showcase.sysml' },
    { name: 'textual', sample: 'view-showcase.sysml' },
    { name: 'table', sample: 'view-showcase.sysml', view: 'Parts Table' },
];
const configurations = [
    { theme: 'light', width: 1280, height: 900 },
    { theme: 'dark', width: 1280, height: 900 },
    { theme: 'light', width: 390, height: 844 },
    { theme: 'dark', width: 390, height: 844 },
];

async function capture(page, renderer, example, configuration) {
    await page.setViewportSize({ width: configuration.width, height: configuration.height });
    const query = new URLSearchParams({ renderer, sample: example.sample,
        diagrams: example.name, theme: configuration.theme });
    if (example.view) query.set('view', example.view);
    const response = await page.goto(`http://127.0.0.1:${port}/?${query}`);
    if (!response.ok()) throw new Error(await response.text());
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    await page.waitForFunction(() => !!document.querySelector('#loading-overlay.hidden')
        && !!document.querySelector('#visualization svg text'), null, { timeout: 30000 });
    await page.waitForFunction(() => {
        const markup = document.querySelector('#visualization svg').outerHTML;
        window.parityStarted ??= performance.now();
        window.parityStable = markup === window.parityMarkup ? (window.parityStable || 0) + 1 : 0;
        window.parityMarkup = markup;
        return window.parityStable >= 8 && performance.now() - window.parityStarted > 1000;
    }, null, { polling: 50, timeout: 20000 });
    if (example.view || example.layout) {
        if (example.layout) await page.locator('#layout-mode-btn').click();
        if (example.view) {
            await page.locator('[data-spec-view]').evaluateAll((elements, name) => {
                const item = elements.find(element => element.getAttribute('data-spec-view') === name);
                if (!item) throw new Error(`View menu is missing ${name}.`);
                item.click();
            }, example.view);
        }
        await page.locator('#loading-overlay.hidden').waitFor({ state: 'attached' });
        await page.waitForFunction(() => {
            const markup = document.querySelector('#visualization svg').outerHTML;
            window.parityStable = markup === window.parityMarkup ? (window.parityStable || 0) + 1 : 0;
            window.parityMarkup = markup;
            return window.parityStable >= 8;
        }, null, { polling: 50, timeout: 20000 });
    }
    if (example.name === 'graph') {
        await page.evaluate(() => {
            window.parityStable = 0;
            window.parityMarkup = '';
            window.parityFitStarted = performance.now();
        });
        await page.locator('#fit-btn').click();
        await page.locator('#visualization svg').evaluate(element => {
            for (const animation of element.getAnimations({ subtree: true })) animation.finish();
        });
        await page.waitForFunction(() => {
            const markup = document.querySelector('#visualization svg').outerHTML;
            window.parityStable = markup === window.parityMarkup ? (window.parityStable || 0) + 1 : 0;
            window.parityMarkup = markup;
            return window.parityStable >= 8 && performance.now() - window.parityFitStarted > 1000;
        }, null, { polling: 50, timeout: 20000 });
    }
    await page.locator('#status-text').filter({ hasText: 'Ready' }).waitFor({ state: 'visible' });
    return {
        image: await page.screenshot({ animations: 'disabled' }),
        payload: await page.evaluate(() => window.parityOriginalPayload),
        svg: await page.locator('#visualization svg').evaluate(element => element.outerHTML),
        styles: await page.evaluate(() => Array.from(document.styleSheets,
            sheet => Array.from(sheet.cssRules, rule => rule.cssText))),
    };
}

async function pixelDifference(before, after) {
    const { default: pixelmatch } = await import('pixelmatch');
    const images = [PNG.sync.read(before), PNG.sync.read(after)];
    const { width, height } = images[0];
    if (width !== images[1].width || height !== images[1].height) {
        throw new Error('Screenshot dimensions differ.');
    }
    const diff = new PNG({ width, height });
    const pixels = pixelmatch(images[0].data, images[1].data, diff.data, width, height,
        { threshold: 0.1, includeAA: false });
    return { pixels, image: PNG.sync.write(diff) };
}

async function main() {
    fs.mkdirSync(output, { recursive: true });
    const server = spawn(process.execPath, [path.join(root, 'scripts/markdown-preview.cjs')],
        { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
    let browser;
    try {
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Visual fixture server did not start.')), 30000);
            server.once('error', error => { clearTimeout(timer); reject(error); });
            server.once('exit', code => { clearTimeout(timer); reject(new Error(`Fixture server exited: ${code}`)); });
            server.stdout.on('data', data => {
                if (String(data).includes('Markdown diagrams:')) { clearTimeout(timer); resolve(); }
            });
            server.stderr.on('data', data => process.stderr.write(data));
        });
        browser = await chromium.launch({ headless: true,
            args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'] });
        const page = await browser.newPage();
        let failures = 0;
        let comparisons = 0;
        const report = [];
        const selected = cases.filter(example => !onlyCase
            || `${example.name}${example.view ? '-scoped' : ''}${example.layout ? '-' + example.layout : ''}` === onlyCase);
        if (!selected.length) throw new Error(`Unknown diagram case: ${onlyCase}`);
        for (const example of quick ? selected.slice(0, 1) : selected) {
            for (const configuration of quick ? configurations.slice(0, 1) : configurations) {
                const before = await capture(page, 'baseline', example, configuration);
                const after = await capture(page, 'current', example, configuration);
                const difference = await pixelDifference(before.image, after.image);
                const payloadEqual = isDeepStrictEqual(before.payload, after.payload);
                const svgEqual = before.svg === after.svg;
                const stylesEqual = isDeepStrictEqual(before.styles, after.styles);
                const name = `${example.name}${example.view ? '-scoped' : ''}${example.layout ? '-' + example.layout : ''}-${configuration.theme}-${configuration.width}`;
                fs.writeFileSync(path.join(output, name + '-baseline.png'), before.image);
                fs.writeFileSync(path.join(output, name + '-current.png'), after.image);
                comparisons++;
                const passed = !difference.pixels && payloadEqual && svgEqual && stylesEqual;
                report.push({ name, passed, changedPixels: difference.pixels, payloadEqual, svgEqual, stylesEqual });
                fs.writeFileSync(path.join(output, name + '-baseline.svg'), before.svg);
                fs.writeFileSync(path.join(output, name + '-current.svg'), after.svg);
                if (!passed) {
                    failures++;
                    fs.writeFileSync(path.join(output, name + '-diff.png'), difference.image);
                    console.error(`FAIL ${name}: ${difference.pixels} changed pixels; payload equal: ${payloadEqual}; SVG equal: ${svgEqual}; CSS equal: ${stylesEqual}`);
                } else {
                    fs.rmSync(path.join(output, name + '-diff.png'), { force: true });
                    console.log(`PASS ${name}: 0 changed pixels`);
                }
            }
        }
        fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({
            baseline: process.env.VISUAL_BASELINE || '7e5cb546ee41859761471e9c0a0d96168d9870dc',
            comparisons, failures, cases: report,
        }, null, 2) + '\n');
        console.log(`${comparisons - failures}/${comparisons} visual comparisons passed. Images: ${output}`);
        if (failures) process.exitCode = 1;
    } finally {
        await browser?.close();
        const stopped = new Promise(resolve => server.once('exit', resolve));
        if (server.exitCode === null) { server.kill('SIGTERM'); await stopped; }
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
