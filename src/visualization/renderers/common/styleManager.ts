/*
 * Theme/style management shared across visualization renderers.
 * Normalizes VS Code theme tokens into CSS custom properties that Cytoscape,
 * D3 overlays, and toolbar widgets can read consistently.
 */

export interface StyleTokens {
    readonly background: string;
    readonly surface: string;
    readonly border: string;
    readonly text: string;
    readonly mutedText: string;
    readonly accent: string;
    readonly accentContrast: string;
    readonly success: string;
    readonly warning: string;
    readonly danger: string;
    readonly focusRing: string;
}

export interface StyleManager {
    readonly tokens: Readonly<StyleTokens>;
    apply(partial: Partial<StyleTokens>): void;
    reset(): void;
    subscribe(listener: StyleChangeListener): () => void;
}

export type StyleChangeListener = (tokens: Readonly<StyleTokens>) => void;

interface DocumentLike {
    readonly documentElement?: HTMLElementLike;
}

interface HTMLElementLike {
    readonly style?: CSSStyleLike;
}

interface CSSStyleLike {
    setProperty(name: string, value: string): void;
    removeProperty?(name: string): void;
}

const DEFAULT_TOKENS: StyleTokens = Object.freeze({
    background: '#0f111a',
    surface: '#1c1f2b',
    border: '#2c3144',
    text: '#f5f7ff',
    mutedText: '#aeb7d0',
    accent: '#3ea5ff',
    accentContrast: '#041423',
    success: '#3fb950',
    warning: '#f4c430',
    danger: '#f85149',
    focusRing: '#6bc1ff'
});

const CSS_VAR_MAP: Record<keyof StyleTokens, string> = {
    background: '--sysml-color-background',
    surface: '--sysml-color-surface',
    border: '--sysml-color-border',
    text: '--sysml-color-text',
    mutedText: '--sysml-color-muted-text',
    accent: '--sysml-color-accent',
    accentContrast: '--sysml-color-accent-contrast',
    success: '--sysml-color-success',
    warning: '--sysml-color-warning',
    danger: '--sysml-color-danger',
    focusRing: '--sysml-color-focus-ring'
};

function resolveDocumentElement(): HTMLElementLike | undefined {
    if (typeof globalThis === 'undefined') {
        return undefined;
    }
    const doc = (globalThis as { document?: DocumentLike }).document;
    return doc?.documentElement;
}

function mergeTokens(base: StyleTokens, partial: Partial<StyleTokens>): StyleTokens {
    return {
        background: partial.background ?? base.background,
        surface: partial.surface ?? base.surface,
        border: partial.border ?? base.border,
        text: partial.text ?? base.text,
        mutedText: partial.mutedText ?? base.mutedText,
        accent: partial.accent ?? base.accent,
        accentContrast: partial.accentContrast ?? base.accentContrast,
        success: partial.success ?? base.success,
        warning: partial.warning ?? base.warning,
        danger: partial.danger ?? base.danger,
        focusRing: partial.focusRing ?? base.focusRing
    };
}

export function createStyleManager(target: HTMLElementLike | undefined = resolveDocumentElement()): StyleManager {
    let currentTokens: StyleTokens = { ...DEFAULT_TOKENS };
    const listeners = new Set<StyleChangeListener>();

    const applyToDom = (tokens: StyleTokens) => {
        if (!target || !target.style) {
            return;
        }
        const style = target.style;
        asEntries(tokens).forEach(([tokenKey, value]) => {
            const cssVar = CSS_VAR_MAP[tokenKey];
            if (cssVar) {
                style.setProperty(cssVar, value);
            }
        });
    };

    const notify = () => listeners.forEach(listener => listener(currentTokens));

    return {
        get tokens() {
            return currentTokens;
        },
        apply(partial: Partial<StyleTokens>) {
            currentTokens = mergeTokens(currentTokens, partial);
            applyToDom(currentTokens);
            notify();
        },
        reset() {
            currentTokens = { ...DEFAULT_TOKENS };
            applyToDom(currentTokens);
            notify();
        },
        subscribe(listener: StyleChangeListener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

type TokenKey = keyof StyleTokens;

function asEntries(value: StyleTokens): Array<[TokenKey, StyleTokens[TokenKey]]> {
    return Object.entries(value) as Array<[TokenKey, StyleTokens[TokenKey]]>;
}

export const DefaultStyleManager = createStyleManager();
