const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const { readdirSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const host = process.env.SCREENSHOT_URL || 'http://localhost:3112';
const api = '/static/build/out/vs/workbench/workbench.web.main.internal.js';
const camera = 'Camera Example/';
const diagrams = [
    ['general_view', 'elk', `${camera}camera-bdd.sysml`],
    ['interconnection_view', 'ibd', 'smart-home.sysml'],
    ['action_flow_view', 'activity', 'smart-home.sysml'],
    ['state_view', 'state', `${camera}camera-states.sysml`],
    ['sequence_view', 'sequence', `${camera}camera-sequence.sysml`],
    ['case_view', 'usecase', 'smart-home.sysml'],
    ['package_view', 'package', 'Camera Example'],
    ['graph_view', 'graph', 'smart-home.sysml'],
    ['tree_view', 'tree', 'smart-home.sysml'],
    ['hierarchy_view', 'hierarchy', `${camera}camera-bdd.sysml`],
];
const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7);
const allowModifiedSamples = process.argv.includes('--allow-modified-samples');
const viewMarkers = {
    elk: '.general-node', ibd: '.ibd-part', activity: '.activity-action',
    state: '.state-node', sequence: '.sequence-participant', usecase: '.usecase-node',
    package: '.package-node', graph: '.graph-node-group', tree: '.node-group',
    hierarchy: '.hierarchy-rect',
};

async function main() {
    const samples = new Set([...diagrams.map(entry => entry[2]), 'torch-system.sysml']);
    samples.delete('Camera Example');
    for (const file of readdirSync(path.join(root, 'samples', 'Camera Example'), { recursive: true })) {
        if (/\.(sysml|kerml)$/.test(file)) samples.add(`${camera}${file}`);
    }
    for (const sample of samples) {
        execFileSync('git', ['ls-files', '--error-unmatch', `samples/${sample}`], { cwd: root });
        if (execFileSync('git', ['diff', 'HEAD', '--', `samples/${sample}`], { cwd: root }).length) {
            if (!allowModifiedSamples) {
                throw new Error(`Screenshot sample differs from the committed version: ${sample}`);
            }
            console.warn(`Capturing intentionally modified tracked sample: ${sample}`);
        }
    }
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
        page.setDefaultTimeout(60000);
        const command = (id, ...args) => page.evaluate(async ({ api, id, args }) => {
            const { commands, URI } = await import(api);
            return commands.executeCommand(id, ...args.map(arg => arg?.sample
                ? URI.parse(`vscode-test-web://mount/${arg.sample}`) : arg));
        }, { api, id, args });
        const findFrame = async selector => {
            for (let attempt = 0; attempt < 300; attempt++) {
                for (const frame of page.frames()) {
                    if (await frame.locator(selector).count().catch(() => 0)) return frame;
                }
                await page.waitForTimeout(100);
            }
            throw new Error(`Webview did not load: ${selector}`);
        };
        const capture = async (name, sample, idle = { x: page.viewportSize().width - 10, y: 10 }) => {
            await command('workbench.action.closePanel');
            await command('notifications.clearAll');
            await page.mouse.move(idle.x, idle.y);
            await page.locator('.monaco-workbench.vs-dark').waitFor();
            await page.evaluate(() => { globalThis.captureHighlightClearSince = 0; });
            await page.waitForFunction(() => {
                const highlighted = [...document.querySelectorAll(
                    '.monaco-editor .view-overlays div, .monaco-editor .view-lines span'
                )].some(node => {
                    const style = getComputedStyle(node);
                    return style.backgroundColor === 'rgba(255, 215, 0, 0.4)'
                        || (style.borderTopColor === 'rgb(255, 215, 0)'
                            && style.borderTopStyle !== 'none' && parseFloat(style.borderTopWidth) > 0);
                });
                if (highlighted) {
                    globalThis.captureHighlightClearSince = 0;
                    return false;
                }
                globalThis.captureHighlightClearSince ||= performance.now();
                return performance.now() - globalThis.captureHighlightClearSince >= 500;
            }, null, { polling: 100, timeout: 15000 });
            let clip;
            if (name === 'visualiser') {
                await command('workbench.action.focusFirstEditorGroup');
                const launch = page.getByRole('button', { name: 'Show Model Visualizer', exact: true });
                await launch.hover();
                await page.locator('.monaco-hover').filter({ hasText: 'Show Model Visualizer' }).waitFor();
                const diagram = await findFrame('#view-dropdown-btn');
                await diagram.locator('.view-dropdown-item[data-view="hierarchy"]').waitFor();
                const bounds = await launch.boundingBox();
                const left = Math.max(48, Math.floor(bounds.x) - 260);
                clip = { x: left, y: 30, width: page.viewportSize().width - left, height: 600 };
            }
            await page.screenshot({ path: path.join(root, `assets/${name}.png`), clip });
            console.log(`Captured ${name}.png from samples/${sample}`);
        };
        const open = async sample => {
            await command('workbench.action.closeAllEditors');
            await command('vscode.open', { sample });
            await page.locator('.monaco-editor .view-lines').first().waitFor();
        };
        const settle = async (diagram, view) => {
            await diagram.locator(`#visualization ${viewMarkers[view]}`).first().waitFor();
            await diagram.evaluate(() => { delete globalThis.captureStability; });
            await diagram.waitForFunction(marker => {
                const svg = document.querySelector('#visualization svg');
                if (!svg?.querySelector(marker)) return false;
                const current = JSON.stringify([...svg.querySelectorAll(marker)].map(node => {
                    const bounds = node.getBoundingClientRect();
                    return [bounds.x, bounds.y, bounds.width, bounds.height]
                        .map(value => Math.round(value * 10));
                }));
                const state = globalThis.captureStability || { current: '', count: 0 };
                state.count = state.current === current ? state.count + 1 : 0;
                state.current = current;
                globalThis.captureStability = state;
                return state.count >= 10;
            }, viewMarkers[view], { polling: 200, timeout: 60000 });
        };
        const selectView = async (diagram, view) => {
            await diagram.locator('#visualization .general-node').first().waitFor();
            await diagram.locator('#view-dropdown-btn').click();
            await diagram.locator(`.view-dropdown-item[data-view="${view}"]`).click();
            await settle(diagram, view);
            await diagram.locator('#fit-btn').click();
            await settle(diagram, view);
            console.log(`${view}: ${await diagram.locator(viewMarkers[view]).count()} rendered nodes`);
        };
        const focusTreeBranch = async (diagram, branchName) => {
            const viewport = await diagram.locator('#visualization svg').boundingBox();
            const branchBounds = () => diagram.evaluate(name => {
                const allNodes = [...document.querySelectorAll('#visualization .node-group')];
                const root = allNodes.find(node => node.__data__.data.name === name);
                if (!root) throw new Error(`Tree branch not found: ${name}`);
                const nodes = allNodes.filter(node => node.__data__ === root.__data__.parent
                    || node.__data__.ancestors().includes(root.__data__));
                const bounds = nodes.map(node => node.getBoundingClientRect());
                const svg = document.querySelector('#visualization svg').getBoundingClientRect();
                const left = Math.min(...bounds.map(rect => rect.left)) - svg.left;
                const top = Math.min(...bounds.map(rect => rect.top)) - svg.top;
                return {
                    left, top,
                    width: Math.max(...bounds.map(rect => rect.right)) - svg.left - left,
                    height: Math.max(...bounds.map(rect => rect.bottom)) - svg.top - top,
                    labelHeight: Math.min(...nodes.map(node =>
                        node.querySelector('.node-name-text').getBoundingClientRect().height)),
                    count: nodes.length,
                };
            }, branchName);
            const initial = await branchBounds();
            const scale = Math.min((viewport.width - 160) / initial.width,
                (viewport.height - 160) / initial.height);
            const centerX = viewport.x + viewport.width / 2;
            const centerY = viewport.y + viewport.height / 2;
            await page.mouse.move(centerX, centerY);
            await page.mouse.down();
            await page.mouse.move(centerX + viewport.width / 2 - initial.left - initial.width / 2,
                centerY + viewport.height / 2 - initial.top - initial.height / 2, { steps: 20 });
            await page.mouse.up();
            await settle(diagram, 'tree');
            await page.mouse.move(centerX, centerY);
            const zoomSteps = Math.max(0, Math.floor(Math.log(scale) / Math.log(1.33)));
            for (let step = 0; step < zoomSteps; step++) {
                const previousScale = await diagram.locator('#visualization svg').evaluate(svg => svg.__zoom.k);
                await page.mouse.wheel(0, -120);
                await diagram.waitForFunction(previous => {
                    const svg = document.querySelector('#visualization svg');
                    return svg.__zoom.k > previous && !svg.__transition;
                }, previousScale);
            }
            await settle(diagram, 'tree');
            const zoomed = await branchBounds();
            await page.mouse.move(centerX, centerY);
            await page.mouse.down();
            await page.mouse.move(centerX + viewport.width / 2 - zoomed.left - zoomed.width / 2,
                centerY + viewport.height / 2 - zoomed.top - zoomed.height / 2, { steps: 20 });
            await page.mouse.up();
            await settle(diagram, 'tree');
            const framed = await branchBounds();
            if (framed.labelHeight < 12 || framed.left < 20 || framed.top < 20
                || framed.left + framed.width > viewport.width - 20
                || framed.top + framed.height > viewport.height - 20) {
                throw new Error(`Tree branch is not readable and fully framed: ${JSON.stringify(framed)}`);
            }
            console.log(`Tree close-up: ${branchName}, ${framed.count} nodes, ${framed.labelHeight.toFixed(1)}px labels`);
        };
        await page.goto(host);
        await page.getByRole('tree', { name: 'Files Explorer' }).getByText('Camera Example').waitFor();
        await page.evaluate(async api => {
            const { commands } = await import(api);
            void commands.executeCommand('workbench.action.selectTheme');
        }, api);
        const themePicker = page.locator('.quick-input-widget input');
        await themePicker.fill('Dark Modern');
        await page.getByRole('option', { name: 'Dark Modern', exact: true }).waitFor();
        await themePicker.press('Enter');
        await page.locator('.monaco-workbench.vs-dark').waitFor();
        await command('workbench.action.closeAllEditors');
        await command('workbench.action.closePanel');
        for (const [name, view, sample] of diagrams) {
            if (only && only !== 'diagrams' && only !== name) continue;
            if (view === 'package') {
                await command('workbench.action.closeAllEditors');
                await command('sysml.visualizeFolder', { sample });
            } else {
                await open(sample);
                await command('sysml.showVisualizer');
            }
            await command('workbench.action.toggleMaximizeEditorGroup');
            await command('workbench.action.closeSidebar');
            const diagram = await findFrame('#fit-btn');
            await selectView(diagram, view);
            if (view === 'tree') await focusTreeBranch(diagram, 'AutomaticLighting');
            await capture(name, sample);
        }
        if (only === 'visualiser') {
            await page.setViewportSize({ width: 1280, height: 800 });
            const sample = `${camera}camera-bdd.sysml`;
            await open(sample);
            await command('workbench.action.closeSidebar');
            await command('sysml.showVisualizer');
            const diagram = await findFrame('#fit-btn');
            await selectView(diagram, 'elk');
            await diagram.locator('#view-dropdown-btn').click();
            await diagram.locator('.view-dropdown-item[data-view="sequence"]').waitFor();
            await capture('visualiser', sample);
            return;
        }
        if (only === 'markdown_preview') {
            const markdown = 'markdown-diagrams.md';
            await open(markdown);
            await command('workbench.action.closeSidebar');
            await command('markdown.showPreviewToSide');
            const preview = await findFrame('.sequence-participant');
            await preview.locator('.sequence-participant').first().waitFor();
            await page.waitForTimeout(3000);
            await capture('markdown_preview', markdown, { x: 800, y: 975 });
            return;
        }
        if (only && only !== 'tools') return;
        const sample = 'torch-system.sysml';
        await open(sample);
        await command('sysml.showModelWorkbench');
        await command('workbench.action.closeEditorsInOtherGroups');
        await command('workbench.action.closeSidebar');
        const workbench = await findFrame('#content table');
        await workbench.locator('#notice').filter({ hasText: 'Model current' }).waitFor();
        await capture('model_workbench', sample);
        await workbench.getByRole('tab', { name: 'Elements', exact: true }).click();
        await capture('workbench_elements', sample);
        await workbench.getByRole('tab', { name: 'Traceability', exact: true }).click();
        await capture('traceability_matrix', sample);
        await open(sample);
        await command('sysml.showModelDashboard', { sample });
        await command('workbench.action.closeEditorsInOtherGroups');
        const dashboard = await findFrame('.card-value');
        await dashboard.locator('.card-value').first().filter({ hasText: /[1-9]/ }).waitFor();
        await capture('model_dashboard', sample);
        const structural = `${camera}camera-bdd.sysml`;
        await open(structural);
        await command('sysml.showModelExplorer');
        const filesHeader = page.getByRole('button', { name: /^Explorer Section:/ });
        if (await filesHeader.getAttribute('aria-expanded') === 'true') await filesHeader.click();
        const sidebar = await page.locator('.part.sidebar').boundingBox();
        await page.mouse.move(sidebar.x + sidebar.width, sidebar.y + sidebar.height / 2);
        await page.mouse.down();
        await page.mouse.move(470, sidebar.y + sidebar.height / 2, { steps: 15 });
        await page.mouse.up();
        const tree = page.getByRole('tree', { name: 'SysML Model Explorer', exact: true });
        const packageRow = tree.getByRole('treeitem', { name: /^CameraTestBDD / });
        await packageRow.waitFor();
        if (await packageRow.getAttribute('aria-expanded') !== 'true') {
            await packageRow.locator('.monaco-tl-twistie').click();
        }
        const cameraRow = tree.getByRole('treeitem', { name: /^CameraSystem / });
        await cameraRow.waitFor();
        await cameraRow.click();
        if (await cameraRow.getAttribute('aria-expanded') !== 'true') {
            await cameraRow.locator('.monaco-tl-twistie').click();
        }
        await tree.getByRole('treeitem', { name: /^resolution / }).waitFor();
        await capture('model_explorer', structural);
        await command('sysmlFeatureExplorer.focus');
        const features = page.getByRole('tree', { name: 'SysML Feature Explorer', exact: true });
        await features.getByRole('treeitem').first().waitFor();
        await capture('feature_explorer', structural);
        await command('workbench.action.closeSidebar');
        await command('vscode.open', { sample: structural });
        await command('cursorTop');
        await command('cursorMove', { to: 'down', by: 'line', value: 3 });
        await command('sysml.showFeatureInspector');
        const inspector = await findFrame('#btn-index');
        const indexItem = inspector.locator('[data-qn="CameraTestBDD::CameraSystem"]');
        if (await indexItem.count()) await indexItem.click();
        await inspector.getByText('CameraSystem', { exact: true }).first().waitFor();
        await inspector.locator('table tbody tr').first().waitFor();
        await capture('feature_inspector', structural);
        if (only === 'tools') return;
        await page.setViewportSize({ width: 1280, height: 800 });
        await open(structural);
        await command('workbench.action.closeSidebar');
        await command('sysml.showVisualizer');
        const hero = await findFrame('#fit-btn');
        await selectView(hero, 'elk');
        await hero.locator('#view-dropdown-btn').click();
        await hero.locator('.view-dropdown-item[data-view="sequence"]').waitFor();
        await capture('visualiser', structural);
    } finally {
        await browser.close();
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
