import { strict as assert } from 'assert';
import type { ElkNode } from 'elkjs/lib/elk-api';
import {
    createLayoutEngine,
    type LayoutRequest,
    type LayoutWorkerFactory
} from '../visualization/renderers/common/layoutEngine';

suite('LayoutEngine', () => {
    test('runs inline layout when no worker is configured', async () => {
        const inlineCalls: ElkNode[] = [];
        const engine = createLayoutEngine({
            inlineLayoutFactory: () => ({
                async layout(graph: ElkNode) {
                    inlineCalls.push(graph);
                    return {
                        ...graph,
                        layouted: true
                    } as ElkNode;
                }
            })
        });

        const request: LayoutRequest = {
            id: 'inline-basic',
            graph: makeGraph('inline-basic')
        };

        const response = await engine.layout(request);
        assert.equal(response.source, 'inline');
        assert.equal(response.fromCache, false);
        assert.equal(inlineCalls.length, 1);
        engine.dispose();
    });

    test('returns cached layouts when cacheKey matches', async () => {
        let layoutCalls = 0;
        const engine = createLayoutEngine({
            inlineLayoutFactory: () => ({
                async layout(graph: ElkNode) {
                    layoutCalls += 1;
                    return {
                        ...graph,
                        layouted: layoutCalls
                    } as ElkNode;
                }
            })
        });

        const request: LayoutRequest = {
            id: 'cache-test',
            cacheKey: 'cache-key',
            graph: makeGraph('cache-root')
        };

        const first = await engine.layout(request);
        const second = await engine.layout(request);

        assert.equal(first.fromCache, false);
        assert.equal(second.fromCache, true);
        assert.equal(second.source, 'cache');
        assert.equal(layoutCalls, 1);
        engine.dispose();
    });

    test('prefers worker results when a worker factory is provided', async () => {
        const factory: LayoutWorkerFactory = () => new SuccessfulWorker();
        let inlineCalls = 0;
        const engine = createLayoutEngine({
            workerScriptUri: 'fake://elkWorker.js',
            elkLibraryUri: 'fake://elk.js',
            workerFactory: factory,
            inlineLayoutFactory: () => ({
                async layout(graph: ElkNode) {
                    inlineCalls += 1;
                    return graph;
                }
            })
        });

        const response = await engine.layout({
            id: 'worker-preferred',
            graph: makeGraph('worker-root')
        });

        assert.equal(response.source, 'worker');
        assert.equal(inlineCalls, 0);
        engine.dispose();
    });

    test('falls back to inline layout when the worker reports an error', async () => {
        const factory: LayoutWorkerFactory = () => new FailingWorker();
        let inlineCalls = 0;
        const engine = createLayoutEngine({
            workerScriptUri: 'fake://elkWorker.js',
            elkLibraryUri: 'fake://elk.js',
            workerFactory: factory,
            inlineLayoutFactory: () => ({
                async layout(graph: ElkNode) {
                    inlineCalls += 1;
                    return {
                        ...graph,
                        fallback: true
                    } as ElkNode;
                }
            })
        });

        const response = await engine.layout({
            id: 'worker-fallback',
            graph: makeGraph('worker-fallback-root')
        });

        assert.equal(response.source, 'inline');
        assert.equal(inlineCalls, 1);
        engine.dispose();
    });

    test('aborts when the provided AbortSignal is already cancelled', async () => {
        const controller = new AbortController();
        controller.abort();

        const engine = createLayoutEngine({
            inlineLayoutFactory: () => ({
                async layout(graph: ElkNode) {
                    return graph;
                }
            })
        });

        let caught: unknown;
        try {
            await engine.layout({ graph: makeGraph('abort') }, controller.signal);
        } catch (error) {
            caught = error;
        }

        assert.ok(caught instanceof Error);
        assert.equal((caught as Error).name, 'AbortError');
        engine.dispose();
    });
});

function makeGraph(id: string): ElkNode {
    return {
        id
    } as ElkNode;
}

class SuccessfulWorker {
    public onmessage?: (event: { data: unknown }) => void;
    public onerror?: (event: { message?: string }) => void;

    postMessage(message: any) {
        if (!message || !message.type) {
            return;
        }
        if (message.type === 'init') {
            setTimeout(() => {
                this.onmessage?.({ data: { type: 'init-complete' } });
            }, 0);
            return;
        }
        if (message.type === 'layout') {
            const result = {
                ...message.graph,
                workerApplied: true
            };
            setTimeout(() => {
                this.onmessage?.({
                    data: {
                        type: 'layout-result',
                        id: message.id,
                        result
                    }
                });
            }, 0);
        }
    }

    terminate() {
        // no-op for tests
    }
}

class FailingWorker extends SuccessfulWorker {
    override postMessage(message: any) {
        if (message?.type === 'init') {
            super.postMessage(message);
            return;
        }
        if (message?.type === 'layout') {
            setTimeout(() => {
                this.onmessage?.({
                    data: {
                        type: 'layout-error',
                        id: message.id,
                        error: 'boom'
                    }
                });
            }, 0);
        }
    }
}
