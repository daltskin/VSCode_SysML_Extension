(() => {
    'use strict';
    const vscode = acquireVsCodeApi();
    const byId = id => document.getElementById(id);
    const saved = vscode.getState() || {};
    let graph = { nodes: [], edges: [], documents: [] };
    const searchPageSize = 50;
    const findingPageSize = 25;
    let searchPage = 0;
    let findingPage = 0;
    let currentAnswer;
    let revision = 0;
    let selectedId = saved.selectedId;
    let requestId = 0;
    let currentTrace;
    let animation;
    let stale = true;
    const nodeById = new Map();
    const edgeById = new Map();
    const color = (name, fallback) => window.getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;
    const cy = window.cytoscape({ container: byId('graph'), elements: [], minZoom: 0.1, maxZoom: 3,
        style: [
            { selector: 'node', style: { label: 'data(name)', 'background-color': color('--vscode-charts-green', '#38946e'),
                color: color('--vscode-editor-foreground', '#252525'), 'font-size': 12,
                'text-wrap': 'wrap', 'text-max-width': 156, 'text-valign': 'center',
                shape: 'round-rectangle', width: 180, height: 46,
                'background-opacity': 0.12, 'border-width': 2,
                'border-color': color('--vscode-charts-green', '#38946e') } },
            { selector: 'node[type *= "requirement"]', style: { shape: 'round-rectangle',
                'background-color': color('--vscode-charts-orange', '#c6752a'),
                'border-color': color('--vscode-charts-orange', '#c6752a') } },
            { selector: 'node[type *= "action"]', style: {
                'background-color': color('--vscode-charts-blue', '#3485bd'),
                'border-color': color('--vscode-charts-blue', '#3485bd') } },
            { selector: 'node[type *= "state"]', style: {
                'background-color': color('--vscode-charts-red', '#c14b50'),
                'border-color': color('--vscode-charts-red', '#c14b50') } },
            { selector: 'edge', style: { label: 'data(kind)', width: 1.5, 'curve-style': 'bezier',
                'target-arrow-shape': 'triangle', 'line-color': color('--vscode-descriptionForeground', '#999'),
                'target-arrow-color': color('--vscode-descriptionForeground', '#999'),
                color: color('--vscode-editor-foreground', '#252525'), 'font-size': 10,
                'text-background-color': color('--vscode-editor-background', '#fff'),
                'text-background-opacity': 0.95, 'text-background-padding': 3 } },
            { selector: '.dim', style: { opacity: 0.22 } },
            { selector: '.traced', style: { opacity: 1 } },
            { selector: 'edge.traced', style: { 'line-color': color('--vscode-focusBorder', '#167fa8'),
                'target-arrow-color': color('--vscode-focusBorder', '#167fa8'), width: 3 } },
            { selector: 'node.traced', style: { 'border-width': 4, 'border-color': color('--vscode-focusBorder', '#167fa8') } },
            { selector: 'node.selected', style: { 'border-width': 4, 'border-color': color('--vscode-charts-yellow', '#b99419') } },
        ] });
    const element = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    const send = (command, data = {}) => vscode.postMessage({ command, revision, ...data });
    const status = (text, error = false) => {
        byId('status').textContent = text;
        byId('status').classList.toggle('error', error);
    };
    const persist = () => vscode.setState({ selectedId, question: byId('question').value,
        search: byId('search').value, targetId: byId('target').value });
    function stop() {
        clearTimeout(animation);
        animation = undefined;
        byId('stop').disabled = true;
    }
    function clearAnswer() {
        stop();
        currentTrace = undefined;
        currentAnswer = undefined;
        findingPage = 0;
        byId('answer-title').textContent = '';
        byId('summary').textContent = '';
        byId('findings').replaceChildren();
        byId('finding-pages').replaceChildren();
        byId('finding-pages').hidden = true;
        byId('caveats').replaceChildren();
        byId('replay').disabled = true;
        cy.elements().removeClass('dim traced');
    }
    function renderPager(id, page, count, pageSize, noun, changePage) {
        const container = byId(id);
        const pages = Math.max(1, Math.ceil(count / pageSize));
        container.hidden = pages === 1;
        const previous = element('button');
        previous.id = `${id}-previous`;
        previous.title = 'Previous page';
        previous.setAttribute('aria-label', `Previous ${noun} page`);
        previous.append(element('span', undefined, 'codicon codicon-chevron-left'));
        previous.disabled = page === 0;
        previous.addEventListener('click', () => {
            changePage(page - 1);
            const replacement = byId(`${id}-previous`);
            (replacement.disabled ? byId(`${id}-next`) : replacement).focus();
        });
        const next = element('button');
        next.id = `${id}-next`;
        next.title = 'Next page';
        next.setAttribute('aria-label', `Next ${noun} page`);
        next.append(element('span', undefined, 'codicon codicon-chevron-right'));
        next.disabled = page === pages - 1;
        next.addEventListener('click', () => {
            changePage(page + 1);
            const replacement = byId(`${id}-next`);
            (replacement.disabled ? byId(`${id}-previous`) : replacement).focus();
        });
        container.replaceChildren(previous, element('span', `${page + 1} / ${pages} (${count} ${noun})`), next);
    }
    function renderElements() {
        const query = byId('search').value.toLowerCase();
        const matching = graph.nodes.filter(node => `${node.qualifiedName} ${node.type}`.toLowerCase().includes(query));
        searchPage = Math.min(searchPage, Math.max(0, Math.ceil(matching.length / searchPageSize) - 1));
        const offset = searchPage * searchPageSize;
        byId('elements').replaceChildren(...matching.slice(offset, offset + searchPageSize).map(node => {
            const button = element('button', undefined, 'element-row');
            button.append(element('strong', node.name), element('small', `${node.type} · ${node.qualifiedName}`));
            button.setAttribute('aria-pressed', String(node.id === selectedId));
            button.title = node.qualifiedName;
            button.addEventListener('click', () => select(node.id));
            return button;
        }));
        renderPager('element-pages', searchPage, matching.length, searchPageSize, 'elements', page => {
            searchPage = page;
            renderElements();
            byId('elements').scrollTop = 0;
        });
    }
    function updateControls() {
        byId('ask').disabled = stale || !nodeById.has(selectedId)
            || (byId('question').value === 'trace' && !byId('target').value);
        byId('source').disabled = stale || !nodeById.has(selectedId);
        byId('target-field').hidden = byId('question').value !== 'trace';
    }
    function select(id) {
        if (stale || !nodeById.has(id)) return;
        selectedId = id;
        byId('selected').textContent = nodeById.get(id).qualifiedName;
        renderElements();
        updateControls();
        persist();
        query();
    }
    function query() {
        clearAnswer();
        if (byId('ask').disabled) {
            status(stale ? 'Refreshing model...' : 'Choose an element and implementation to trace.');
            return;
        }
        status('Analyzing modeled relationships...');
        send('query', { selectedId, question: byId('question').value,
            targetId: byId('target').value || undefined, requestId: ++requestId });
    }
    function showGraph(findings) {
        const ids = new Set([selectedId]);
        const edgeIds = new Set();
        for (const finding of findings) {
            for (const id of finding.nodeIds) ids.add(id);
            for (const id of finding.edgeIds) {
                edgeIds.add(id);
                const edge = edgeById.get(id);
                if (edge) { ids.add(edge.source); ids.add(edge.target); ids.add(edge.evidenceId); }
            }
        }
        const nodes = [...ids].filter(id => nodeById.has(id));
        const visible = new Set(nodes);
        const edges = [...edgeIds].map(id => edgeById.get(id)).filter(edge => edge
            && visible.has(edge.source) && visible.has(edge.target));
        cy.elements().remove();
        const projectedEdges = edges.flatMap(edge => {
            if (edge.kind === 'connection' && edge.evidenceId !== edge.source
                && edge.evidenceId !== edge.target && visible.has(edge.evidenceId)) {
                return [{ data: { ...edge, target: edge.evidenceId } },
                    { data: { ...edge, id: `${edge.id}-target`, source: edge.evidenceId } }];
            }
            return [{ data: edge }];
        });
        cy.add([...nodes.map(id => ({ data: nodeById.get(id) })), ...projectedEdges]);
        cy.getElementById(selectedId).addClass('selected');
        cy.layout({ name: 'breadthfirst', directed: false, roots: [selectedId], spacingFactor: 1.15,
            transform: (_node, position) => ({ x: position.x, y: position.y * 0.4 }),
            padding: 24, animate: false, avoidOverlap: true }).run();
        byId('trace-count').textContent = `${nodes.length} elements · ${edges.length} links`;
        fitGraph();
    }
    function fitGraph() {
        cy.resize();
        if (!cy.nodes().length) return;
        cy.fit(undefined, 24);
        if (cy.zoom() > 1.1) { cy.zoom(1.1); cy.center(); }
    }
    function animate(finding) {
        stop();
        currentTrace = finding;
        cy.elements().removeClass('traced').addClass('dim');
        const steps = [finding.nodeIds[0]].filter(Boolean);
        for (let index = 0; index < finding.edgeIds.length; index++) {
            const edgeId = finding.edgeIds[index];
            const edge = edgeById.get(edgeId);
            steps.push(edgeId, `${edgeId}-target`);
            if (edge) steps.push(edge.evidenceId);
            if (finding.nodeIds[index + 1]) steps.push(finding.nodeIds[index + 1]);
        }
        steps.push(...finding.nodeIds);
        byId('replay').disabled = stale || !steps.length;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let index = 0;
        const advance = () => {
            while (index < steps.length) {
                cy.getElementById(steps[index++]).removeClass('dim').addClass('traced');
                if (!reducedMotion) break;
            }
            if (index < steps.length) {
                byId('stop').disabled = false;
                animation = setTimeout(advance, 180);
            } else stop();
        };
        advance();
    }
    function renderFindings() {
        const findings = currentAnswer?.findings || [];
        findingPage = Math.min(findingPage, Math.max(0, Math.ceil(findings.length / findingPageSize) - 1));
        const offset = findingPage * findingPageSize;
        byId('findings').start = offset + 1;
        byId('findings').replaceChildren(...findings.slice(offset, offset + findingPageSize).map(finding => {
            const item = element('li');
            const label = element('button', finding.text, 'finding');
            label.setAttribute('aria-pressed', String(currentTrace?.nodeId === finding.nodeId));
            label.addEventListener('click', () => {
                showGraph([finding]);
                animate(finding);
                renderFindings();
            });
            const source = element('button', undefined, 'evidence-source');
            source.title = 'Open source evidence';
            source.setAttribute('aria-label', `Open source evidence for ${finding.text}`);
            source.append(element('span', undefined, 'codicon codicon-go-to-file'));
            source.addEventListener('click', () => send('navigate', { id: finding.nodeId }));
            const details = element('details', undefined, 'finding-details');
            details.append(element('summary', `${finding.edgeIds.length} modeled links`));
            details.addEventListener('toggle', () => {
                if (!details.open || details.childElementCount > 1) return;
                const path = element('small');
                for (const id of finding.edgeIds) {
                    const edge = edgeById.get(id);
                    if (!edge) continue;
                    const link = element('button', `${nodeById.get(edge.source)?.name} --${edge.kind}--> ${nodeById.get(edge.target)?.name}`, 'path-link');
                    link.title = 'Open relationship declaration';
                    link.disabled = !edge.uri || !edge.range;
                    link.addEventListener('click', () => send('navigateEdge', { id }));
                    path.append(link);
                }
                details.append(path);
            });
            item.append(label, source, details);
            return item;
        }));
        renderPager('finding-pages', findingPage, findings.length, findingPageSize, 'findings', page => {
            findingPage = page;
            renderFindings();
        });
    }
    function displayAnswer(answer) {
        currentAnswer = answer;
        findingPage = 0;
        byId('answer-title').textContent = answer.title;
        byId('summary').textContent = answer.summary;
        byId('caveats').replaceChildren(...answer.caveats.map(text => element('li', text)));
        const finding = answer.findings[0];
        showGraph(finding ? [finding] : []);
        if (finding) animate(finding);
        renderFindings();
        status('Ready');
    }
    cy.on('tap', 'node', event => select(event.target.id()));
    byId('search').value = saved.search || '';
    if (saved.question) byId('question').value = saved.question;
    byId('search').addEventListener('input', () => { searchPage = 0; renderElements(); persist(); });
    byId('question').addEventListener('change', () => { updateControls(); persist(); query(); });
    byId('target').addEventListener('change', () => { updateControls(); persist(); query(); });
    byId('ask').addEventListener('click', query);
    byId('source').addEventListener('click', () => send('navigate', { id: selectedId }));
    byId('refresh').addEventListener('click', () => send('refresh'));
    byId('add-files').addEventListener('click', () => send('addFiles'));
    byId('fit').addEventListener('click', fitGraph);
    byId('stop').addEventListener('click', stop);
    byId('replay').addEventListener('click', () => { if (currentTrace) animate(currentTrace); });
    const observer = new window.ResizeObserver(fitGraph);
    observer.observe(byId('graph'));
    window.addEventListener('message', event => {
        const message = event.data;
        if (!message || typeof message !== 'object') return;
        if (message.command === 'snapshot') {
            clearAnswer();
            graph = message.graph;
            searchPage = 0;
            revision = message.revision;
            stale = false;
            nodeById.clear(); edgeById.clear();
            for (const node of graph.nodes) nodeById.set(node.id, node);
            for (const edge of graph.edges) edgeById.set(edge.id, edge);
            byId('scope').textContent = `${graph.documents.length} files · ${graph.nodes.length} elements`;
            const targetId = byId('target').value || saved.targetId;
            byId('target').replaceChildren(element('option', 'Choose implementation'), ...graph.nodes
                .filter(node => /part|action|interface|state|constraint/.test(node.type))
                .map(node => { const option = element('option', node.qualifiedName); option.value = node.id; return option; }));
            byId('target').firstChild.value = '';
            byId('target').value = targetId || '';
            select(message.selectedId || (nodeById.has(selectedId) ? selectedId : graph.nodes[0]?.id));
            if (!graph.nodes.length) { renderElements(); updateControls(); status('No model elements found.'); }
        } else if (message.command === 'answer' && !stale && message.revision === revision
            && message.requestId === requestId) displayAnswer(message.answer);
        else if (message.command === 'invalidated') {
            stale = true;
            byId('element-pages').hidden = true;
            requestId++;
            clearAnswer();
            cy.elements().remove();
            byId('trace-count').textContent = 'Refreshing model...';
            updateControls();
            status('Refreshing model...');
        } else if (message.command === 'error') {
            clearAnswer();
            status(message.message, true);
        }
    });
    window.addEventListener('pagehide', () => { stop(); observer.disconnect(); cy.destroy(); });
    send('ready');
})();
