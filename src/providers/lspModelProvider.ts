/**
 * LspModelProvider — fetches parsed model data from the sysml-v2-lsp
 * language server via the custom `sysml/model` request.
 */

import * as vscode from 'vscode';
import { BaseLanguageClient } from 'vscode-languageclient';
import {
    PositionDTO,
    RangeDTO,
    SysMLElementDTO,
    SysMLModelParams,
    SysMLModelResult,
    SysMLModelScope,
} from './sysmlModelTypes';

// Re-export for consumer convenience
export type { SysMLModelResult, SysMLModelScope };

/**
 * Convert a 0-based LSP PositionDTO to a `vscode.Position`.
 */
function toVscodePosition(p: PositionDTO): vscode.Position {
    return new vscode.Position(p.line, p.character);
}

/**
 * Convert a 0-based LSP RangeDTO to a `vscode.Range`.
 */
export function toVscodeRange(r: RangeDTO): vscode.Range {
    return new vscode.Range(toVscodePosition(r.start), toVscodePosition(r.end));
}

/**
 * Recursively stamp `vscode.Range` objects onto every element in the
 * tree so consumers can use `.range` directly without manual conversion.
 * The original `RangeDTO` is preserved for serialisation.
 */
function convertRangesInPlace(elements: SysMLElementDTO[]): void {
    for (const el of elements) {
        // Stamp a vscode.Range as a non-enumerable property so JSON
        // serialisation (for webview postMessage) still works.
        Object.defineProperty(el, 'vscodeRange', {
            value: toVscodeRange(el.range),
            configurable: true,
            writable: true,
        });
        if (el.children?.length) {
            convertRangesInPlace(el.children);
        }
    }
}

export class LspModelProvider {
    /** Versioned model cache — avoids redundant LSP requests from multiple consumers. */
    private _cache = new Map<string, { version: number; result: SysMLModelResult }>();

    constructor(private readonly _client: BaseLanguageClient) {}

    /** Invalidate the cache for a URI (e.g. after a file change). */
    invalidateCache(uri: string): void {
        this._cache.delete(uri);
    }

    /**
     * Request the parsed model from the LSP server.
     *
     * On cold start the server may still be warming up its DFA /
     * parsing the file, so it can return 0 elements.  We retry a
     * few times with exponential back-off before giving up.
     *
     * Results are cached by URI + version so multiple consumers
     * (model explorer, visualization, feature inspector, dashboard)
     * don't trigger redundant LSP requests for the same data.
     *
     * @param uri       Document URI to query
     * @param scopes    Optional subset of data to return — defaults to all
     * @param token     Cancellation token forwarded to `sendRequest`
     */
    async getModel(
        uri: string,
        scopes?: SysMLModelScope[],
        token?: vscode.CancellationToken,
    ): Promise<SysMLModelResult> {
        // Map scope names to the result field that holds their data.
        // Cache is only honoured when every requested scope is already
        // present in the cached result — otherwise an earlier call with
        // a narrower scope (e.g. `['elements']` from the explorer) would
        // mask a later call that needs additional sections like
        // `sequenceDiagrams` or `activityDiagrams`.
        const scopeFieldMap: Record<string, keyof SysMLModelResult> = {
            elements: 'elements',
            relationships: 'relationships',
            sequenceDiagrams: 'sequenceDiagrams',
            activityDiagrams: 'activityDiagrams',
            resolvedTypes: 'resolvedTypes',
            diagnostics: 'diagnostics',
            stats: 'stats',
        };
        const requestedScopes: SysMLModelScope[] = scopes && scopes.length > 0
            ? scopes
            : ['elements', 'relationships', 'sequenceDiagrams', 'activityDiagrams', 'resolvedTypes', 'diagnostics'];

        // Check cache — must have elements AND every requested scope present.
        const cached = this._cache.get(uri);
        if (cached && (cached.result.elements?.length ?? 0) > 0) {
            const cacheCoversAllScopes = requestedScopes.every(s => {
                const field = scopeFieldMap[s];
                return field !== undefined && cached.result[field] !== undefined;
            });
            if (cacheCoversAllScopes) {
                return cached.result;
            }
        }

        const params: SysMLModelParams = {
            textDocument: { uri },
        };
        if (scopes && scopes.length > 0) {
            params.scope = scopes;
        }

        // Retry with short back-off when the server hasn't
        // finished parsing yet (returns 0 elements).
        const retryDelays = [100, 250, 500]; // ms
        let result: SysMLModelResult;

        for (let attempt = 0; ; attempt++) {
            if (token?.isCancellationRequested) {
                return { version: 0, elements: [], relationships: [] };
            }

            result = await this._client.sendRequest<SysMLModelResult>(
                'sysml/model',
                params,
                token,
            );

            const hasData = (result.elements?.length ?? 0) > 0;
            if (hasData || attempt >= retryDelays.length) {
                break;
            }

            // Wait before retrying
            await new Promise<void>((resolve) => {
                const timer = setTimeout(resolve, retryDelays[attempt]);
                // Cancel the delay if the token fires
                token?.onCancellationRequested(() => {
                    globalThis.clearTimeout(timer);
                    resolve();
                });
            });
        }

        // Stamp vscode.Range onto every element for convenient consumer use
        if (result.elements) {
            convertRangesInPlace(result.elements);
        }

        // Cache the result for deduplication across consumers
        this._cache.set(uri, { version: result.version, result });

        return result;
    }

    /**
     * Find an element by name in the model.  Performs a depth-first
     * search over `.elements` returned by the last `getModel` call
     * with `scope: ['elements']`.
     */
    async findElement(
        uri: string,
        elementName: string,
        parentContext?: string,
        token?: vscode.CancellationToken,
    ): Promise<SysMLElementDTO | undefined> {
        const result = await this.getModel(uri, ['elements'], token);
        if (!result.elements) {
            return undefined;
        }

        if (parentContext) {
            const parent = this._findRecursive(parentContext, result.elements);
            if (parent?.children) {
                const found = this._findRecursive(elementName, parent.children);
                if (found) return found;
            }
        }

        return this._findRecursive(elementName, result.elements);
    }

    private _findRecursive(name: string, elements: SysMLElementDTO[]): SysMLElementDTO | undefined {
        for (const el of elements) {
            if (el.name === name) return el;
            if (el.children?.length) {
                const found = this._findRecursive(name, el.children);
                if (found) return found;
            }
        }
        return undefined;
    }

    /**
     * Fetch server health / memory stats from the `sysml/serverStats` endpoint.
     * Returns `undefined` if the request fails (e.g. server not ready).
     */
    async getServerStats(): Promise<LspServerStats | undefined> {
        try {
            return await this._client.sendRequest<LspServerStats>('sysml/serverStats');
        } catch {
            return undefined;
        }
    }

    /**
     * Ask the LSP server to flush all in-memory caches.
     * Returns the number of evicted entries per cache, or `undefined` on failure.
     */
    async clearServerCaches(): Promise<ClearCacheResult | undefined> {
        try {
            return await this._client.sendRequest<ClearCacheResult>('sysml/clearCache');
        } catch {
            return undefined;
        }
    }
}

/** Shape returned by the `sysml/clearCache` custom LSP request. */
export interface ClearCacheResult {
    documents: number;
    symbolTables: number;
    semanticTokens: number;
}

/** Shape returned by the `sysml/serverStats` custom LSP request. */
export interface LspServerStats {
    /** Server uptime in seconds. */
    uptime: number;
    memory: {
        heapUsed: number;   // MB
        heapTotal: number;  // MB
        rss: number;        // MB
        external: number;   // MB
    };
    caches: {
        documents: number;
        symbolTables: number;
        semanticTokens: number;
    };
}
