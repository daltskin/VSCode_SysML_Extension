export interface CacheEntry<T> {
    readonly version: number;
    readonly state: 'loading' | 'ready' | 'error';
    readonly value?: T;
    readonly error?: string;
}

/** Versioned, bounded async bridge for synchronous Markdown rendering. */
export class DiagramCache<T> {
    private readonly entries = new Map<string, CacheEntry<T>>();
    private readonly dependents = new Map<string, Set<string>>();
    private readonly generations = new Map<string, number>();
    private readonly running = new Map<string, AbortController>();
    private readonly queued = new Map<string, number>();
    private readonly reloadTimers = new Map<string, ReturnType<typeof setTimeout>>();
    private readonly baselines = new Map<string, CacheEntry<T> | undefined>();
    private refreshTimer?: ReturnType<typeof setTimeout>;
    private disposed = false;
    private generation = 0;

    constructor(
        private readonly load: (uri: string, signal: AbortSignal) => Promise<T>,
        private readonly refresh: () => void,
        private readonly maxEntries = 64,
        private readonly currentVersion?: (uri: string) => number,
    ) {}

    lookup(uri: string, version: number, markdown: string): CacheEntry<T> {
        if (!this.entries.has(uri) && this.entries.size >= this.maxEntries) {
            return { version, state: 'error', error: `The preview model limit is ${this.maxEntries}. Close other Markdown documents.` };
        }
        if (!this.dependents.has(uri)) this.dependents.set(uri, new Set());
        this.dependents.get(uri)?.add(markdown);
        const previous = this.entries.get(uri);
        if (previous?.version === version) return previous;
        return this.requestLoad(uri, version, !!previous);
    }

    private requestLoad(uri: string, version: number, debounce: boolean): CacheEntry<T> {
        const previous = this.entries.get(uri);
        if (!this.baselines.has(uri)) this.baselines.set(uri, previous);
        const pending: CacheEntry<T> = { version, state: 'loading', value: previous?.value };
        this.entries.set(uri, pending);
        this.queued.set(uri, version);
        this.running.get(uri)?.abort();
        clearTimeout(this.reloadTimers.get(uri));
        this.reloadTimers.delete(uri);
        if (debounce) {
            this.reloadTimers.set(uri, setTimeout(() => {
                this.reloadTimers.delete(uri);
                this.drain(uri);
            }, 100));
        } else this.drain(uri);
        return pending;
    }

    private drain(uri: string): void {
        if (this.disposed || this.running.has(uri) || !this.queued.has(uri)) return;
        const version = this.queued.get(uri) ?? -1;
        this.queued.delete(uri);
        const generation = ++this.generation;
        this.generations.set(uri, generation);
        const controller = new AbortController();
        this.running.set(uri, controller);
        const previous = this.baselines.get(uri);
        void Promise.resolve().then(() => this.load(uri, controller.signal)).then(value => {
            this.complete(uri, generation, { version, state: 'ready', value }, previous);
        }, error => {
            this.complete(uri, generation, {
                version, state: 'error', error: error instanceof Error ? error.message : 'Model load failed.',
            }, previous);
        }).finally(() => {
            this.running.delete(uri);
            if (!this.reloadTimers.has(uri)) this.drain(uri);
        });
    }

    invalidate(uri: string, version?: number): boolean {
        if (!this.dependents.has(uri)) return false;
        const previous = this.entries.get(uri);
        const nextVersion = version ?? this.currentVersion?.(uri) ?? previous?.version ?? -1;
        if (previous?.state === 'loading' && previous.version === nextVersion) return true;
        this.requestLoad(uri, nextVersion, true);
        return true;
    }

    forgetMarkdown(markdown: string): void {
        this.retainMarkdown(markdown, new Set());
    }

    retainMarkdown(markdown: string, models: ReadonlySet<string>): void {
        for (const [uri, users] of this.dependents) {
            if (models.has(uri)) continue;
            users.delete(markdown);
            if (!users.size) {
                this.dependents.delete(uri);
                this.entries.delete(uri);
                this.generations.delete(uri);
                this.running.get(uri)?.abort();
                this.queued.delete(uri);
                this.baselines.delete(uri);
                clearTimeout(this.reloadTimers.get(uri));
                this.reloadTimers.delete(uri);
            }
        }
    }

    dispose(): void {
        this.disposed = true;
        clearTimeout(this.refreshTimer);
        for (const timer of this.reloadTimers.values()) clearTimeout(timer);
        for (const controller of this.running.values()) controller.abort();
        this.reloadTimers.clear();
        this.queued.clear();
        this.baselines.clear();
        this.entries.clear();
        this.dependents.clear();
        this.generations.clear();
    }

    private complete(
        uri: string, generation: number, entry: CacheEntry<T>, previous?: CacheEntry<T>,
    ): void {
        if (this.disposed || this.generations.get(uri) !== generation
            || !this.entries.has(uri) || this.queued.has(uri)) return;
        this.baselines.delete(uri);
        this.entries.set(uri, this.currentVersion
            ? { ...entry, version: this.currentVersion(uri) } : entry);
        if (JSON.stringify(previous?.value) !== JSON.stringify(entry.value)
            || previous?.state !== entry.state || previous?.error !== entry.error) {
            this.scheduleRefresh();
        }
    }

    private scheduleRefresh(): void {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = setTimeout(() => {
            if (!this.disposed) this.refresh();
        }, 100);
    }

}
