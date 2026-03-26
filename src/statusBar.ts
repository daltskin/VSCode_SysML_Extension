/**
 * Status bar management for SysML extension.
 *
 * Owns the "Model Metrics" and "Parse Progress" status bar items plus
 * the per-file metrics cache.  Extracted from extension.ts so that
 * unit tests can exercise the UI logic without pulling in the full
 * extension dependency tree (LSP client, visualization panels, etc.).
 */
import * as vscode from 'vscode';

// ─── Types ──────────────────────────────────────────────────────

/** Shape of the stats object returned by the LSP model provider. */
export interface ModelStats {
    totalElements: number;
    resolvedElements: number;
    unresolvedElements: number;
    parseTimeMs: number;
    lexTimeMs?: number;
    parseOnlyTimeMs?: number;
    parseCached?: boolean;
    modelBuildTimeMs: number;
    complexity?: {
        complexityIndex: number;
        rating: string;
        definitions: number;
        usages: number;
        maxDepth: number;
        avgChildrenPerDef: number;
        couplingCount: number;
        unusedDefinitions: number;
        documentationCoverage: number;
        hotspots: { qualifiedName: string; kind: string; childCount: number; depth: number; typeRefs: number; hasDoc: boolean; score: number }[];
    };
}

/** Subset of LspServerStats used for the tooltip. */
export interface ServerHealthStats {
    uptime: number;
    memory: { heapUsed: number; heapTotal: number; rss: number };
    caches: { documents: number; symbolTables: number; semanticTokens: number };
}

// ─── Module state ───────────────────────────────────────────────

let modelMetricsItem: vscode.StatusBarItem | undefined;
let parseProgressItem: vscode.StatusBarItem | undefined;
let lastMetricsKey: string | undefined;
let parseAnimTimer: ReturnType<typeof setInterval> | undefined;
let parseAnimFrame = 0;
let lastServerStats: ServerHealthStats | undefined;
let lastMetricsStats: ModelStats | undefined;
let lastMetricsUri: vscode.Uri | undefined;

const metricsCache = new Map<string, ModelStats>();

// ─── Public API ─────────────────────────────────────────────────

/** Store the latest server health stats for inclusion in the tooltip. */
export function setServerStats(stats: ServerHealthStats): void {
    lastServerStats = stats;
}

/** Return the last args passed to updateModelMetrics (for diagnostic-change refresh). */
export function getLastMetricsArgs(): { stats: ModelStats; uri: vscode.Uri | undefined } | undefined {
    return lastMetricsStats ? { stats: lastMetricsStats, uri: lastMetricsUri } : undefined;
}

/** Return the per-file metrics cache. */
export function getCachedMetrics(uriString: string): ModelStats | undefined {
    return metricsCache.get(uriString);
}

/** Remove a file from the per-file metrics cache. */
export function deleteCachedMetrics(uriString: string): void {
    metricsCache.delete(uriString);
}

/** Clear the dedup key so the next updateModelMetrics call is not skipped. */
export function clearMetricsKey(): void {
    lastMetricsKey = undefined;
}

/**
 * Update the status-bar model-metrics item with element counts and
 * parse time from the latest `sysml/model` response.
 */
export function updateModelMetrics(stats: ModelStats, documentUri?: vscode.Uri): void {
    lastMetricsStats = stats;
    lastMetricsUri = documentUri;

    if (documentUri) {
        metricsCache.set(documentUri.toString(), stats);
    }

    const diagnostics = documentUri
        ? vscode.languages.getDiagnostics(documentUri)
        : [];
    const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
    const warnCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
    const issueCount = errorCount + warnCount;

    const metricsKey = `${documentUri?.toString() ?? ''}|${stats.totalElements}|${stats.resolvedElements}|${stats.unresolvedElements}|${stats.parseTimeMs}|${stats.modelBuildTimeMs}|${stats.complexity?.complexityIndex ?? ''}|${errorCount}|${warnCount}`;
    if (metricsKey === lastMetricsKey) {
        return;
    }
    lastMetricsKey = metricsKey;

    if (!modelMetricsItem) {
        modelMetricsItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 100
        );
        modelMetricsItem.name = 'SysML Model Metrics';
        modelMetricsItem.command = 'workbench.actions.view.problems';
    }

    const icon = errorCount > 0 ? '$(error)' : warnCount > 0 ? '$(warning)' : '$(check)';
    const issuesSuffix = issueCount > 0 ? ` | $(alert) ${issueCount}` : '';

    const cx = stats.complexity;
    const complexitySuffix = cx ? ` | MCI ${cx.complexityIndex}` : '';
    modelMetricsItem.text = `${icon} SysML: ${stats.totalElements} elements${issuesSuffix}${complexitySuffix} | ${stats.parseTimeMs}ms`;

    const totalTimeMs = stats.parseTimeMs + stats.modelBuildTimeMs;

    const tooltipLines: string[] = [];

    if (documentUri) {
        tooltipLines.push(`📄 ${documentUri.path.split('/').pop()}`);
        tooltipLines.push('');
    }

    tooltipLines.push(`── Elements ──`);
    tooltipLines.push(`Total: ${stats.totalElements}`);
    tooltipLines.push(`Typed: ${stats.resolvedElements}  |  Un-typed: ${stats.unresolvedElements}`);

    const cachedLabel = stats.parseCached ? ' (Cached)' : '';
    tooltipLines.push('');
    tooltipLines.push(`── Parse Details${cachedLabel} ──`);
    if (stats.lexTimeMs !== undefined) {
        tooltipLines.push(`Lex:   ${stats.lexTimeMs}ms`);
    }
    if (stats.parseOnlyTimeMs !== undefined) {
        tooltipLines.push(`Parse: ${stats.parseOnlyTimeMs}ms`);
    }
    tooltipLines.push(`Build: ${stats.modelBuildTimeMs}ms`);
    tooltipLines.push(`Total: ${totalTimeMs}ms`);

    if (cx) {
        tooltipLines.push('');
        tooltipLines.push(`── Model Complexity Index ──`);
        tooltipLines.push(`Score: ${cx.complexityIndex} / 100  (${cx.rating})`);
        tooltipLines.push(`Definitions: ${cx.definitions}  |  Usages: ${cx.usages}`);
        tooltipLines.push(`Max depth: ${cx.maxDepth}  |  Coupling: ${cx.couplingCount}`);
        tooltipLines.push(`Unused definitions: ${cx.unusedDefinitions}`);
        tooltipLines.push(`Documentation coverage: ${cx.documentationCoverage}%`);
    }

    if (lastServerStats) {
        const s = lastServerStats;
        const uptimeStr = s.uptime >= 60
            ? `${Math.floor(s.uptime / 60)}m ${s.uptime % 60}s`
            : `${s.uptime}s`;
        tooltipLines.push('');
        tooltipLines.push(`── LSP Health ──`);
        tooltipLines.push(`Uptime: ${uptimeStr}`);
        tooltipLines.push(`Heap: ${s.memory.heapUsed} / ${s.memory.heapTotal} MB  |  RSS: ${s.memory.rss} MB`);
        tooltipLines.push(`Caches: ${s.caches.documents} docs, ${s.caches.symbolTables} STs, ${s.caches.semanticTokens} tokens`);
    }

    if (issueCount > 0) {
        tooltipLines.push('');
        tooltipLines.push(`${errorCount} error(s), ${warnCount} warning(s)`);
        tooltipLines.push('Click to open Problems panel');
    }
    modelMetricsItem.tooltip = tooltipLines.join('\n');

    modelMetricsItem.backgroundColor = errorCount > 0
        ? new vscode.ThemeColor('statusBarItem.errorBackground')
        : warnCount > 0
            ? new vscode.ThemeColor('statusBarItem.warningBackground')
            : undefined;

    modelMetricsItem.show();
}

/** Hide the model-metrics status bar item. */
export function hideModelMetrics(): void {
    modelMetricsItem?.hide();
    lastMetricsKey = undefined;
}

/**
 * Show a lightweight "loading" placeholder in the metrics status bar.
 */
export function showMetricsLoading(documentOrLabel?: vscode.TextDocument | string): void {
    if (!modelMetricsItem) {
        modelMetricsItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 100,
        );
        modelMetricsItem.name = 'SysML Model Metrics';
        modelMetricsItem.command = 'workbench.actions.view.problems';
    }
    const label = typeof documentOrLabel === 'string'
        ? documentOrLabel
        : documentOrLabel
            ? documentOrLabel.fileName.split('/').pop() || 'file'
            : 'workspace';
    modelMetricsItem.text = '$(loading~spin) SysML: Loading…';
    modelMetricsItem.tooltip = `Parsing ${label}…`;
    modelMetricsItem.backgroundColor = undefined;
    modelMetricsItem.show();
}

// ─── Parse progress indicator ───────────────────────────────────

const PARSE_FRAMES = [
    '$(symbol-structure) ░░░░ Assembling model',
    '$(symbol-structure) █░░░ Assembling model',
    '$(symbol-structure) ██░░ Assembling model',
    '$(symbol-structure) ███░ Assembling model',
    '$(symbol-structure) ████ Assembling model',
    '$(symbol-structure) ▪▫▫▫ Building blocks',
    '$(symbol-structure) ▪▪▫▫ Building blocks',
    '$(symbol-structure) ▪▪▪▫ Building blocks',
    '$(symbol-structure) ▪▪▪▪ Building blocks',
    '$(symbol-structure) ◧◧◧◧ Linking elements',
    '$(symbol-structure) ◨◧◧◧ Linking elements',
    '$(symbol-structure) ◨◨◧◧ Linking elements',
    '$(symbol-structure) ◨◨◨◧ Linking elements',
    '$(symbol-structure) ◨◨◨◨ Linking elements',
];

/** The label currently shown alongside the parse animation. */
let parseAnimLabel = '';

export function showParseProgress(label: string): void {
    if (!parseProgressItem) {
        parseProgressItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, 0,
        );
        parseProgressItem.name = 'SysML Parse Progress';
    }

    // Always update the label — the timer reads from the module-level
    // variable so it picks up the latest value on every tick.
    parseAnimLabel = label;

    if (!parseAnimTimer) {
        parseAnimFrame = 0;
        parseAnimTimer = setInterval(() => {
            parseAnimFrame = (parseAnimFrame + 1) % PARSE_FRAMES.length;
            if (parseProgressItem) {
                const suffix = parseAnimLabel ? ` · ${parseAnimLabel}` : '';
                parseProgressItem.text = `${PARSE_FRAMES[parseAnimFrame]}${suffix}`;
            }
        }, 220);
    }

    const suffix = label ? ` · ${label}` : '';
    parseProgressItem.text = `${PARSE_FRAMES[parseAnimFrame]}${suffix}`;
    parseProgressItem.show();
}

export function hideParseProgress(): void {
    if (parseAnimTimer) {
        clearInterval(parseAnimTimer);
        parseAnimTimer = undefined;
    }
    parseProgressItem?.hide();
}

/** Dispose all status bar items (call from extension deactivate). */
export function disposeStatusBar(): void {
    if (parseAnimTimer) {
        clearInterval(parseAnimTimer);
        parseAnimTimer = undefined;
    }
    modelMetricsItem?.dispose();
    parseProgressItem?.dispose();
    modelMetricsItem = undefined;
    parseProgressItem = undefined;
}

/**
 * Reset all module state — for use in tests only.
 * @internal
 */
export function _resetForTesting(): void {
    if (parseAnimTimer) {
        clearInterval(parseAnimTimer);
        parseAnimTimer = undefined;
    }
    modelMetricsItem?.dispose();
    parseProgressItem?.dispose();
    modelMetricsItem = undefined;
    parseProgressItem = undefined;
    lastMetricsKey = undefined;
    parseAnimFrame = 0;
    lastServerStats = undefined;
    lastMetricsStats = undefined;
    lastMetricsUri = undefined;
    metricsCache.clear();
}
