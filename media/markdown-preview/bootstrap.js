(function () {
    'use strict';
    const base = new URL('../', document.currentScript.src);
    const nonce = document.currentScript.nonce;
    const instances = new Map();
    let assets;

    function showError(element, error) {
        const target = element.shadowRoot || element;
        target.replaceChildren(document.createTextNode(error.message || 'Unable to render SysML diagram.'));
        element.classList.add('sysml-md-error');
        element.setAttribute('role', 'alert');
    }

    function loadScript(relative) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.nonce = nonce;
            script.src = new URL(relative, base).href;
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error('Unable to load the local SysML diagram runtime.'));
            };
            document.head.appendChild(script);
        });
    }

    function loadAssets() {
        if (!assets) {
            assets = (async () => {
                for (const file of [
                    'vendor/d3.min.js', 'vendor/elk.bundled.js', 'vendor/cytoscape.min.js',
                    'vendor/cytoscape-elk.js', 'vendor/cytoscape-svg.js',
                    'diagram-runtime/shell.js', 'diagram-runtime/runtime.js',
                ]) await loadScript(file);
            })().catch(error => {
                assets = undefined;
                throw error;
            });
        }
        return assets;
    }

    function mount(element, payload) {
        const shadow = element.shadowRoot || element.attachShadow({ mode: 'open' });
        shadow.innerHTML = '<style>' + globalThis.SysMLDiagramShell.css.replace(/\bbody\b/g, '.diagram-body')
            + '\n:host{display:block;width:100%;height:100%}'
            + '\n.diagram-body{padding:0;height:100%;overflow:hidden}'
            + '\n.diagram-body>:not(#visualization-wrapper){display:none!important}'
            + '\n#visualization-wrapper{height:100%!important}'
            + '\n#pkg-dropdown{display:none!important}'
            + '\n#controls,#status-bar,#minimap-container,#legend-popup,#about-backdrop{display:none!important}'
            + '\n#visualization{height:100%!important;min-height:0!important;border:0!important}'
            + '</style><div class="diagram-body">' + globalThis.SysMLDiagramShell.body + '</div>';
        const body = shadow.querySelector('.diagram-body');
        const events = new Map();
        const abort = new AbortController();
        const documentProxy = new Proxy(document, {
            get(target, property) {
                if (property === 'body' || property === 'documentElement') return body;
                if (property === 'getElementById') return id => shadow.getElementById(id);
                if (property === 'querySelector') return selector => shadow.querySelector(selector);
                if (property === 'querySelectorAll') return selector => shadow.querySelectorAll(selector);
                if (property === 'addEventListener') return (type, listener) =>
                    shadow.addEventListener(type, listener, { signal: abort.signal });
                const value = Reflect.get(target, property, target);
                return typeof value === 'function' ? value.bind(target) : value;
            },
        });
        const localWindow = Object.create(window);
        localWindow.addEventListener = (type, listener) => {
            if (!events.has(type)) events.set(type, new Set());
            events.get(type).add(listener);
        };
        localWindow.dispatchEvent = event => {
            for (const listener of events.get(event.type) || []) listener(event);
        };
        localWindow.getComputedStyle = window.getComputedStyle.bind(window);
        const scopedD3 = Object.create(globalThis.d3);
        scopedD3.select = selector => globalThis.d3.select(typeof selector === 'string'
            ? selector === 'body' ? body : shadow.querySelector(selector) : selector);
        scopedD3.selectAll = selector => globalThis.d3.selectAll(typeof selector === 'string'
            ? shadow.querySelectorAll(selector) : selector);
        const api = {
            postMessage(message) {
                if (message.command === 'renderError') showError(element, new Error(message.message));
            },
            getState() { return {}; },
            setState() {},
        };
        const runtime = globalThis.SysMLDiagramRuntime.mount(
            localWindow, documentProxy, scopedD3, () => api, undefined,
        );
        shadow.addEventListener('click', event => {
            if (event.target.closest('a')) event.preventDefault();
        }, { capture: true, signal: abort.signal });
        shadow.addEventListener('dblclick', event => event.stopImmediatePropagation(),
            { capture: true, signal: abort.signal });
        const resize = new ResizeObserver(() => localWindow.dispatchEvent({ type: 'resize' }));
        resize.observe(element);
        runtime.update({ ...payload, readOnly: true });
        return {
            payload: element.dataset.payload,
            dispose() {
                runtime.dispose(); abort.abort(); resize.disconnect(); events.clear(); shadow.replaceChildren();
            },
            exportSVG: runtime.serializeSVG,
        };
    }

    async function update() {
        const blocks = [...document.querySelectorAll('.sysml-md[data-payload]')];
        for (const [element, instance] of instances) {
            if (!element.isConnected) {
                const replacement = blocks.find(block => block.isConnected && !instances.has(block)
                    && block.dataset.payload === instance.payload);
                if (replacement) {
                    blocks[blocks.indexOf(replacement)] = element;
                    replacement.replaceWith(element);
                    continue;
                }
            }
            if (!element.isConnected || instance.payload !== element.dataset.payload) {
                instance.dispose();
                instances.delete(element);
            }
        }
        if (!blocks.length) return;
        try {
            await loadAssets();
            for (const element of blocks) {
                if (!element.isConnected || instances.has(element)) continue;
                try {
                    instances.set(element, mount(element, JSON.parse(element.dataset.payload)));
                } catch (error) {
                    showError(element, error);
                }
            }
        } catch (error) {
            for (const element of blocks) {
                showError(element, error);
            }
        }
    }

    const contentObserver = new MutationObserver(() => { void update(); });
    function start() {
        contentObserver.observe(document.body, { childList: true, subtree: true });
        void update();
    }
    window.addEventListener('vscode.markdown.updateContent', update);
    window.addEventListener('pagehide', () => {
        contentObserver.disconnect();
        for (const instance of instances.values()) instance.dispose();
        instances.clear();
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
