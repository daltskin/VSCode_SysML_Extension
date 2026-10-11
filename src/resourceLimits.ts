import * as vscode from 'vscode';
import type { SysMLModelResult } from './providers/sysmlModelTypes';

const activeOperations = new Set<vscode.CancellationTokenSource>();
let notification: {
    source: vscode.CancellationTokenSource;
    progress?: vscode.Progress<{ message?: string; increment?: number }>;
    users: number;
    finish: () => void;
    completion: Promise<void>;
    displayTimer?: ReturnType<typeof setTimeout>;
    message?: string;
} | undefined;

export const internalSafetyLimits = {
    maxDepth: 64,
    previewBytes: 2 * 1024 * 1024,
    previewElements: 1000,
    previewModels: 64,
    editBytes: 1_000_000,
    editRows: 500,
    exportBytes: 10_000_000,
    exportRows: 100000,
    exportTimeoutMs: 30000,
} as const;

/** Guards needed before recursive model conversion or bounded preview rendering. */
export interface ModelSafetyLimits {
    maxElements?: number;
    maxDepth?: number;
}

/** Read the optional aggregate UTF-8 source-loading budget; zero means unlimited. */
export function sourceLoadingBudgetBytes(): number {
    const config = vscode.workspace.getConfiguration('sysml');
    const value = config.get<number>('modelLoading.budgetMiB', 0);
    return Number.isSafeInteger(value) && value >= 0
        && value <= Math.floor(Number.MAX_SAFE_INTEGER / 1048576) ? value * 1048576 : 0;
}

/** Enforce a named budget without silently truncating the model. */
export class ResourceLimitError extends Error {}

export function checkLimit(value: number, maximum: number, setting: string): void {
    if (maximum > 0 && value > maximum) {
        const guidance = setting === 'maxTotalBytes'
            ? 'Increase Model Loading: Budget MiB (sysml.modelLoading.budgetMiB), set it to 0 for unlimited loading, or narrow the scope.'
            : 'Use a smaller batch or scope; this is an internal safety guard.';
        throw new ResourceLimitError(`Resource limit exceeded (${value} > ${maximum}, ${setting}). ${guidance}`);
    }
}

/** Measure UTF-8 bytes consistently in desktop and browser hosts. */
export function textBytes(text: string): number {
    return new globalThis.TextEncoder().encode(text).byteLength;
}

/** Validate nesting and an optional preview element cap before conversion or rendering. */
export function checkModelLimits(model: SysMLModelResult, limits: ModelSafetyLimits = {}): void {
    const pending = (model.elements ?? []).map(element => ({ element, depth: 1 }));
    let elements = 0;
    while (pending.length) {
        const current = pending.pop();
        if (!current) break;
        elements++;
        checkLimit(elements, limits.maxElements ?? 0, 'maxElements');
        checkLimit(current.depth, limits.maxDepth ?? internalSafetyLimits.maxDepth, 'maxDepth');
        for (const element of current.element.children ?? []) pending.push({ element, depth: current.depth + 1 });
    }
}

/** Check the aggregate byte budget without opening files merely to inspect them. */
export async function checkFileBudgets(uris: readonly vscode.Uri[], token?: vscode.CancellationToken): Promise<void> {
    const budget = sourceLoadingBudgetBytes();
    if (!budget) return;
    let bytes = 0;
    for (const uri of uris) {
        checkCancelled(token);
        const document = vscode.workspace.textDocuments?.find(source => source.uri.toString() === uri.toString());
        const size = document ? textBytes(document.getText()) : (await vscode.workspace.fs.stat(uri)).size;
        bytes += size;
        checkLimit(bytes, budget, 'maxTotalBytes');
    }
}

/** Cancel active model operations, including loads initiated in the background. */
export function cancelModelOperations(): void {
    for (const source of activeOperations) source.cancel();
}

/** Stop cooperatively before publishing results or performing writes. */
export function checkCancelled(token?: vscode.CancellationToken): void {
    if (token?.isCancellationRequested) throw new vscode.CancellationError();
}

/** Give long-running user operations consistent progress and cancellation controls. */
export async function withModelProgress<T>(title: string,
    task: (progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken) => Promise<T>, parent?: vscode.CancellationToken,
    showNotification = !parent): Promise<T> {
    const source = new vscode.CancellationTokenSource();
    activeOperations.add(source);
    const parentSubscription = parent?.onCancellationRequested(() => source.cancel());
    if (parent?.isCancellationRequested) source.cancel();
    const configuredTimeout = vscode.workspace.getConfiguration('sysml')
        .get<number>('operations.timeoutSeconds', 120);
    const timeoutSeconds = Number.isSafeInteger(configuredTimeout) && configuredTimeout >= 0
        && configuredTimeout <= 2147483 ? configuredTimeout : 120;
    let timedOut = false;
    const timer = timeoutSeconds > 0 ? setTimeout(() => {
        timedOut = true;
        source.cancel();
    }, timeoutSeconds * 1000) : undefined;
    let group: typeof notification;
    let notificationSubscription: vscode.Disposable | undefined;
    try {
        if (showNotification) {
            if (!notification || notification.source.token.isCancellationRequested) {
                const notificationSource = new vscode.CancellationTokenSource();
                let finish!: () => void;
                const done = new Promise<void>(resolve => { finish = resolve; });
                const created = { source: notificationSource, users: 0, finish,
                    completion: Promise.resolve(), progress: undefined as
                        vscode.Progress<{ message?: string; increment?: number }> | undefined,
                    displayTimer: undefined as ReturnType<typeof setTimeout> | undefined,
                    message: title };
                notification = created;
                created.displayTimer = setTimeout(() => {
                    created.completion = Promise.resolve(vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification, title: 'SysML operations', cancellable: true,
                }, async (progress, token) => {
                    created.progress = progress;
                    progress.report({ message: created.message });
                    const subscription = token?.onCancellationRequested(() => notificationSource.cancel());
                    if (token?.isCancellationRequested) notificationSource.cancel();
                    try { await done; } finally { subscription?.dispose(); }
                }));
                }, 500);
            }
            group = notification;
            group.users++;
            notificationSubscription = group.source.token.onCancellationRequested(() => source.cancel());
            if (group.source.token.isCancellationRequested) source.cancel();
            group.progress?.report({ message: title });
        }
        const run = async (progress: vscode.Progress<{ message?: string; increment?: number }>,
            token?: vscode.CancellationToken): Promise<T> => {
            const subscription = token?.onCancellationRequested(() => source.cancel());
            if (token?.isCancellationRequested) source.cancel();
            try {
                checkCancelled(source.token);
                let cancellationSubscription: vscode.Disposable | undefined;
                const cancelled = new Promise<never>((_resolve, reject) => {
                    cancellationSubscription = source.token.onCancellationRequested(() => reject(timedOut
                        ? new ResourceLimitError(`${title} timed out after ${timeoutSeconds} seconds. Increase sysml.operations.timeoutSeconds or set it to 0 to disable the timeout.`)
                        : new vscode.CancellationError()));
                });
                let result: T;
                try { result = await Promise.race([task(progress, source.token), cancelled]); }
                finally { cancellationSubscription?.dispose(); }
                checkCancelled(source.token);
                return result;
            }
            finally { subscription?.dispose(); }
        };
        return await run({ report: update => {
            if (!group) return;
            group.message = update.message ? `${title}: ${update.message}` : title;
            group.progress?.report({ message: group.message });
        } });
    } finally {
        if (timer) clearTimeout(timer);
        notificationSubscription?.dispose();
        parentSubscription?.dispose();
        activeOperations.delete(source);
        source.dispose();
        if (group && --group.users === 0) {
            clearTimeout(group.displayTimer);
            if (notification === group) notification = undefined;
            group.finish();
            await group.completion;
            group.source.dispose();
        }
    }
}
