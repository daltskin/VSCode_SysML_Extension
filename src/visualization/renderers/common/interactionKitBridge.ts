/*
 * Shared interaction kit bridge used by all visualization renderers.
 * Provides a resilient wrapper around the legacy global interaction kit script
 * so renderer implementations can rely on a typed, promise-friendly surface.
 */

export interface InteractionKitBridgeOptions {
    readonly containerId?: string;
    readonly statusTextId?: string;
    readonly statusIndicatorId?: string;
    readonly filterInputId?: string;
    readonly clearFilterButtonId?: string;
    readonly defaultStatus?: string;
    readonly enableKeyboardShortcuts?: boolean;
    readonly toolbarBindings?: {
        readonly fitButtonId?: string;
        readonly resetButtonId?: string;
        readonly clearFilterButtonId?: string;
        readonly focusFilterButtonId?: string;
        readonly applySuggestionButtonId?: string;
    };
}

export interface InteractionStatusOptions {
    readonly busy?: boolean;
}

export interface FocusRingOptions {
    readonly duration?: number;
}

export interface InteractionKitBridge {
    readonly isAvailable: boolean;
    setStatus(_message: string, _options?: InteractionStatusOptions): void;
    flashStatus(_message: string, _duration?: number): void;
    registerAction(_name: string, _handler: (_payload?: unknown) => void, _payload?: unknown): void;
    executeAction(_name: string, _payload?: unknown): boolean;
    showFocusRing(_target: unknown, _options?: FocusRingOptions): void;
    clearFocusRing(): void;
    refreshFilterControls(): void;
    dispose(): void;
}

interface InteractionKitHandle {
    readonly registerAction?: (_name: string, _handler: (_payload?: unknown) => void) => void;
    readonly executeAction?: (_name: string, _payload?: unknown) => boolean;
    readonly setStatus?: (_message: string, _options?: InteractionStatusOptions) => void;
    readonly flashStatus?: (_message: string, _duration?: number) => void;
    readonly showFocusRingForElement?: (_target: unknown, _options?: FocusRingOptions) => void;
    readonly clearFocusRing?: () => void;
    readonly refreshFilterControls?: () => void;
    readonly dispose?: () => void;
}

interface InteractionKitFactory {
    readonly createInteractionKit: (options?: Record<string, unknown>) => InteractionKitHandle | undefined;
}

function resolveGlobalInteractionKit(): InteractionKitFactory | undefined {
    if (typeof globalThis === 'undefined') {
        return undefined;
    }
    const candidate = (globalThis as { SysMLInteractionKit?: InteractionKitFactory }).SysMLInteractionKit;
    if (!candidate || typeof candidate.createInteractionKit !== 'function') {
        return undefined;
    }
    return candidate;
}

function createNullBridge(): InteractionKitBridge {
    return {
        isAvailable: false,
        setStatus: () => undefined,
        flashStatus: () => undefined,
        registerAction: () => undefined,
        executeAction: () => false,
        showFocusRing: () => undefined,
        clearFocusRing: () => undefined,
        refreshFilterControls: () => undefined,
        dispose: () => undefined
    };
}

export function createInteractionKitBridge(options: InteractionKitBridgeOptions = {}): InteractionKitBridge {
    const factory = resolveGlobalInteractionKit();
    if (!factory) {
        return createNullBridge();
    }

    const handle: InteractionKitHandle = factory.createInteractionKit({
        containerId: options.containerId,
        statusTextId: options.statusTextId,
        statusIndicatorId: options.statusIndicatorId,
        filterInputId: options.filterInputId,
        clearFilterButtonId: options.clearFilterButtonId,
        defaultStatus: options.defaultStatus,
        enableKeyboardShortcuts: options.enableKeyboardShortcuts !== false,
        toolbar: options.toolbarBindings
    }) ?? {};

    return {
        isAvailable: true,
        setStatus(message: string, statusOptions?: InteractionStatusOptions) {
            handle.setStatus?.(message, statusOptions);
        },
        flashStatus(message: string, duration?: number) {
            handle.flashStatus?.(message, duration);
        },
        registerAction(name: string, handler: (payload?: unknown) => void) {
            if (!name) {
                return;
            }
            handle.registerAction?.(name, handler);
        },
        executeAction(name: string, payload?: unknown) {
            if (!name) {
                return false;
            }
            return Boolean(handle.executeAction?.(name, payload));
        },
        showFocusRing(target: unknown, focusOptions?: FocusRingOptions) {
            handle.showFocusRingForElement?.(target, focusOptions);
        },
        clearFocusRing() {
            handle.clearFocusRing?.();
        },
        refreshFilterControls() {
            handle.refreshFilterControls?.();
        },
        dispose() {
            handle.dispose?.();
        }
    };
}

export const NullInteractionKitBridge: InteractionKitBridge = createNullBridge();
