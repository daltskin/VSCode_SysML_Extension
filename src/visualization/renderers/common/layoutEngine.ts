/*
 * Layout engine facade that hides the underlying ELK integration from
 * individual renderers. Provides a worker-backed implementation with
 * inline fallback so heavy layouts never block the UI thread.
 */

import type { ElkNode, LayoutOptions } from 'elkjs/lib/elk-api';
import ELK from 'elkjs/lib/elk.bundled.js';

export interface LayoutRequest {
    readonly id?: string;
    readonly graph: ElkNode;
    readonly options?: LayoutOptions;
    readonly cacheKey?: string;
}

export interface LayoutResponse {
    readonly id?: string;
    readonly graph: ElkNode;
    readonly duration: number;
    readonly fromCache: boolean;
    readonly source: 'cache' | 'worker' | 'inline';
}

export interface LayoutEngineConfig {
    readonly defaultOptions?: LayoutOptions;
    readonly enableCache?: boolean;
    readonly maxCacheEntries?: number;
    readonly workerScriptUri?: string;
    readonly elkLibraryUri?: string;
    readonly workerName?: string;
    readonly workerFactory?: LayoutWorkerFactory;
    readonly inlineLayoutFactory?: () => InlineLayoutInstance;
}

export interface LayoutEngineAbortSignal {
    readonly aborted: boolean;
    addEventListener?(type: 'abort', listener: () => void, options?: unknown): void;
    removeEventListener?(type: 'abort', listener: () => void, options?: unknown): void;
}

export interface LayoutEngine {
    layout(request: LayoutRequest, signal?: LayoutEngineAbortSignal | AbortSignal): Promise<LayoutResponse>;
    dispose(): void;
}

interface CacheEntry {
    readonly graph: ElkNode;
    readonly timestamp: number;
}

export interface InlineLayoutInstance {
    layout(graph: ElkNode, options?: LayoutOptions): Promise<ElkNode>;
}

interface WorkerRuntimeOptions {
    readonly scriptUri: string;
    readonly elkLibraryUri?: string;
    readonly workerFactory?: LayoutWorkerFactory;
    readonly workerName?: string;
}

interface PendingWorkerRequest {
    readonly resolve: (graph: ElkNode) => void;
    readonly reject: (error: Error) => void;
    readonly cleanup: () => void;
    readonly signal?: AbortLike;
    aborted: boolean;
}

type AbortLike = LayoutEngineAbortSignal | AbortSignal | undefined;

interface LayoutWorkerHandle {
    postMessage(message: unknown): void;
    terminate?: () => void;
    onmessage?: (event: LayoutWorkerMessageEvent) => void;
    onerror?: (event: LayoutWorkerErrorEvent) => void;
    addEventListener?: (type: 'message' | 'error', listener: (event: unknown) => void, options?: unknown) => void;
    removeEventListener?: (type: 'message' | 'error', listener: (event: unknown) => void, options?: unknown) => void;
}

interface LayoutWorkerMessageEvent {
    readonly data: WorkerMessage;
}

interface LayoutWorkerErrorEvent {
    readonly message?: string;
}

interface LayoutWorkerFactoryOptions {
    readonly name?: string;
}

interface LayoutWorkerConstructor {
    new (scriptUrl: string, options?: LayoutWorkerFactoryOptions): LayoutWorkerHandle;
}

export type LayoutWorkerFactory = (scriptUrl: string, options?: LayoutWorkerFactoryOptions) => LayoutWorkerHandle;

type WorkerMessage =
    | { type: 'init-complete' }
    | { type: 'init-error'; error?: string }
    | { type: 'layout-result'; id: string; result: ElkNode }
    | { type: 'layout-error'; id: string; error?: string }
    | { type: 'layout-cancelled'; id: string };

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '120',
    'elk.layered.spacing.nodeNodeBetweenLayers': '140',
    'elk.spacing.edgeNode': '40',
    'elk.spacing.edgeEdge': '20'
};

const DEFAULT_CACHE_LIMIT = 6;

class WorkerUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WorkerUnavailableError';
    }
}

class LayoutWorkerRuntime {
    private worker: LayoutWorkerHandle | null = null;
    private initPromise: Promise<void> | null = null;
    private resolveInit?: () => void;
    private rejectInit?: (error: Error) => void;
    private requestCounter = 0;
    private readonly pendingRequests = new Map<string, PendingWorkerRequest>();

    constructor(private readonly options: WorkerRuntimeOptions) {}

    async layout(graph: ElkNode, layoutOptions: LayoutOptions, signal?: AbortLike): Promise<ElkNode> {
        const worker = this.ensureWorker();
        if (!worker) {
            throw new WorkerUnavailableError('Unable to create ELK layout worker');
        }

        await this.ensureInitialized(worker);

        if (signal?.aborted) {
            throw createAbortError();
        }

        const requestId = `elk-worker-${Date.now()}-${++this.requestCounter}`;

        return new Promise<ElkNode>((resolve, reject) => {
            const cleanup = subscribeToAbort(signal, () => {
                const pending = this.pendingRequests.get(requestId);
                if (!pending) {
                    return;
                }
                pending.aborted = true;
                this.pendingRequests.delete(requestId);
                cleanup();
                reject(createAbortError());
            });

            const pendingEntry: PendingWorkerRequest = {
                resolve: result => {
                    cleanup();
                    resolve(result);
                },
                reject: error => {
                    cleanup();
                    reject(error);
                },
                cleanup,
                signal,
                aborted: false
            };

            this.pendingRequests.set(requestId, pendingEntry);

            try {
                worker.postMessage({ type: 'layout', id: requestId, graph, options: layoutOptions });
            } catch (error) {
                this.pendingRequests.delete(requestId);
                cleanup();
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }

    dispose(error?: Error): void {
        this.pendingRequests.forEach(entry => {
            entry.cleanup();
            entry.reject(error ?? new Error('Layout worker disposed'));
        });
        this.pendingRequests.clear();

        if (this.worker) {
            try {
                this.worker.postMessage({ type: 'dispose' });
                this.worker.terminate?.();
            } catch {
                // Best effort cleanup.
            }
        }

        this.worker = null;
        this.initPromise = null;
        this.resolveInit = undefined;
        this.rejectInit = undefined;
    }

    private ensureWorker(): LayoutWorkerHandle | null {
        if (this.worker) {
            return this.worker;
        }

        const scriptUri = this.options.scriptUri;
        if (!scriptUri) {
            return null;
        }

        const factory = this.options.workerFactory ?? getNativeWorkerFactory();
        if (!factory) {
            return null;
        }

        let workerHandle: LayoutWorkerHandle;
        try {
            workerHandle = factory(scriptUri, this.options.workerName ? { name: this.options.workerName } : undefined);
        } catch (error) {
            console.warn?.('Unable to instantiate ELK worker; inline fallback will be used.', error);
            return null;
        }

        const handleMessage = (event: LayoutWorkerMessageEvent) => {
            const message = event?.data;
            if (!message || typeof message !== 'object') {
                return;
            }

            switch (message.type) {
                case 'init-complete':
                    this.resolveInit?.();
                    this.resolveInit = undefined;
                    this.rejectInit = undefined;
                    break;
                case 'init-error':
                    {
                        const initError = new Error(message.error || 'ELK worker failed to initialize');
                        this.rejectInit?.(initError);
                        this.resolveInit = undefined;
                        this.rejectInit = undefined;
                        this.initPromise = null;
                        this.dispose(initError);
                    }
                    break;
                case 'layout-result':
                    {
                        const pending = this.pendingRequests.get(message.id);
                        if (!pending) {
                            break;
                        }
                        this.pendingRequests.delete(message.id);
                        if (pending.aborted) {
                            break;
                        }
                        pending.resolve(message.result);
                    }
                    break;
                case 'layout-error':
                    {
                        const pending = this.pendingRequests.get(message.id);
                        if (!pending) {
                            break;
                        }
                        this.pendingRequests.delete(message.id);
                        if (pending.aborted) {
                            break;
                        }
                        pending.reject(new Error(message.error || 'ELK worker layout failed'));
                    }
                    break;
                case 'layout-cancelled':
                    {
                        const pending = this.pendingRequests.get(message.id);
                        if (!pending) {
                            break;
                        }
                        this.pendingRequests.delete(message.id);
                        pending.aborted = true;
                        pending.reject(createAbortError());
                    }
                    break;
                default:
                    console.warn?.('Unknown message from ELK worker:', message);
                    break;
            }
        };

        const handleError = (event: LayoutWorkerErrorEvent) => {
            const workerError = new Error(event?.message || 'ELK worker error');
            this.rejectInit?.(workerError);
            this.dispose(workerError);
        };

        if (typeof workerHandle.addEventListener === 'function') {
            workerHandle.addEventListener('message', handleMessage as (event: unknown) => void);
            workerHandle.addEventListener('error', handleError as (event: unknown) => void);
        } else {
            workerHandle.onmessage = handleMessage;
            workerHandle.onerror = handleError;
        }

        this.worker = workerHandle;
        this.initPromise = new Promise<void>((resolve, reject) => {
            this.resolveInit = resolve;
            this.rejectInit = reject;
        });

        try {
            workerHandle.postMessage({ type: 'init', elkUri: this.options.elkLibraryUri });
        } catch (error) {
            this.rejectInit?.(error instanceof Error ? error : new Error(String(error)));
        }

        return this.worker;
    }

    private ensureInitialized(_worker: LayoutWorkerHandle): Promise<void> {
        if (!this.initPromise) {
            return Promise.resolve();
        }
        return this.initPromise.catch(error => {
            console.warn?.('ELK worker init failed; inline layout fallback will be used.', error);
            this.dispose(error instanceof Error ? error : new Error(String(error)));
            throw error;
        });
    }
}

export function createLayoutEngine(config: LayoutEngineConfig = {}): LayoutEngine {
    const cache = new Map<string, CacheEntry>();
    const enableCache = config.enableCache !== false;
    const maxEntries = config.maxCacheEntries ?? DEFAULT_CACHE_LIMIT;
    const inlineFactory = config.inlineLayoutFactory ?? (() => new ELK());
    let inlineElkInstance: InlineLayoutInstance | undefined;

    const workerRuntime = config.workerScriptUri
        ? new LayoutWorkerRuntime({
            scriptUri: config.workerScriptUri,
            elkLibraryUri: config.elkLibraryUri,
            workerFactory: config.workerFactory,
            workerName: config.workerName
        })
        : undefined;

    const runLayout = async (request: LayoutRequest, signal?: AbortLike): Promise<LayoutResponse> => {
        if (!request?.graph) {
            throw new Error('Layout request is missing a graph definition.');
        }

        if (signal?.aborted) {
            throw createAbortError();
        }

        const cacheKey = enableCache ? resolveCacheKey(request) : undefined;
        if (cacheKey && cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            if (cached) {
                return {
                    id: request.id,
                    graph: cloneGraph(cached.graph),
                    duration: 0,
                    fromCache: true,
                    source: 'cache'
                };
            }
        }

        const graphInput = cloneGraph(request.graph);
        const mergedOptions = {
            ...DEFAULT_LAYOUT_OPTIONS,
            ...config.defaultOptions,
            ...graphInput.layoutOptions,
            ...request.options
        };
        graphInput.layoutOptions = mergedOptions;

        const startTime = now();

        if (workerRuntime) {
            try {
                const workerResult = await workerRuntime.layout(graphInput, mergedOptions, signal);
                const duration = now() - startTime;
                if (cacheKey) {
                    cache.set(cacheKey, { graph: cloneGraph(workerResult), timestamp: Date.now() });
                    pruneCache(cache, maxEntries);
                }
                return {
                    id: request.id,
                    graph: cloneGraph(workerResult),
                    duration,
                    fromCache: false,
                    source: 'worker'
                };
            } catch (error) {
                if (isAbortError(error)) {
                    throw error;
                }
                console.warn?.('ELK worker layout failed, falling back to inline execution.', error);
            }
        }

        inlineElkInstance = inlineElkInstance ?? inlineFactory();
        const resultGraph = await inlineElkInstance.layout(graphInput);
        const duration = now() - startTime;

        if (cacheKey) {
            cache.set(cacheKey, { graph: cloneGraph(resultGraph), timestamp: Date.now() });
            pruneCache(cache, maxEntries);
        }

        return {
            id: request.id,
            graph: cloneGraph(resultGraph),
            duration,
            fromCache: false,
            source: 'inline'
        };
    };

    return {
        layout: runLayout,
        dispose() {
            cache.clear();
            workerRuntime?.dispose();
            inlineElkInstance = undefined;
        }
    };
}

function resolveCacheKey(request: LayoutRequest): string | undefined {
    if (request.cacheKey) {
        return request.cacheKey;
    }
    if (request.id) {
        return `layout::id::${request.id}`;
    }
    try {
        return `layout::hash::${  JSON.stringify(request.graph)}`;
    } catch {
        return undefined;
    }
}

function cloneGraph(graph: ElkNode): ElkNode {
    try {
        return JSON.parse(JSON.stringify(graph));
    } catch {
        return graph;
    }
}

function pruneCache(cache: Map<string, CacheEntry>, maxEntries: number) {
    if (cache.size <= maxEntries) {
        return;
    }
    const entries = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
    const removeCount = cache.size - maxEntries;
    for (let i = 0; i < removeCount; i++) {
        const candidate = entries[i];
        if (candidate) {
            cache.delete(candidate[0]);
        }
    }
}

function now(): number {
    if (typeof globalThis !== 'undefined') {
        const perf = (globalThis as { performance?: { now?: () => number } }).performance;
        if (perf && typeof perf.now === 'function') {
            return perf.now();
        }
    }
    return Date.now();
}

function getNativeWorkerFactory(): LayoutWorkerFactory | undefined {
    if (typeof globalThis === 'undefined') {
        return undefined;
    }
    const ctor = (globalThis as { Worker?: LayoutWorkerConstructor }).Worker;
    if (!ctor) {
        return undefined;
    }
    return (scriptUrl: string, options?: LayoutWorkerFactoryOptions) => new ctor(scriptUrl, options);
}

function createAbortError(): Error {
    if (typeof DOMException === 'function') {
        return new DOMException('Layout aborted', 'AbortError');
    }
    const error = new Error('Layout aborted');
    error.name = 'AbortError';
    return error;
}

function isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError';
}

function subscribeToAbort(signal: AbortLike, handler: () => void): () => void {
    if (!signal) {
        return () => undefined;
    }

    const eventTarget = signal as { addEventListener?: (type: 'abort', listener: () => void, options?: unknown) => void; removeEventListener?: (type: 'abort', listener: () => void, options?: unknown) => void };
    if (typeof eventTarget.addEventListener === 'function') {
        const listener = () => handler();
        eventTarget.addEventListener('abort', listener, { once: true });
        return () => eventTarget.removeEventListener?.('abort', listener, undefined);
    }

    return () => undefined;
}

export const DefaultLayoutEngine = createLayoutEngine();
