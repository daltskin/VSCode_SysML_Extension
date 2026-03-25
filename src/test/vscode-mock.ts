/**
 * Lightweight vscode module mock for running unit tests outside the
 * VS Code extension host (i.e. via mocha + ts-node).
 *
 * Only the APIs actually exercised by the "mockable" test files are
 * implemented here.  Integration tests that call real VS Code APIs
 * (executeCommand, openTextDocument, etc.) still require the full
 * extension host and should not be included in the `test:unit` glob.
 */

// ─── Core value types ────────────────────────────────────────────

export class Position {
    constructor(
        public readonly line: number,
        public readonly character: number
    ) {}

    isEqual(other: Position): boolean {
        return this.line === other.line && this.character === other.character;
    }

    isBefore(other: Position): boolean {
        if (this.line < other.line) return true;
        if (this.line === other.line && this.character < other.character) return true;
        return false;
    }

    isAfter(other: Position): boolean {
        return !this.isEqual(other) && !this.isBefore(other);
    }

    translate(lineDelta = 0, characterDelta = 0): Position {
        return new Position(this.line + lineDelta, this.character + characterDelta);
    }

    with(line?: number, character?: number): Position {
        return new Position(line ?? this.line, character ?? this.character);
    }

    compareTo(other: Position): number {
        if (this.isBefore(other)) return -1;
        if (this.isAfter(other)) return 1;
        return 0;
    }
}

export class Range {
    public readonly start: Position;
    public readonly end: Position;

    constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);
    constructor(start: Position, end: Position);
    constructor(
        a: number | Position,
        b: number | Position,
        c?: number,
        d?: number
    ) {
        if (typeof a === 'number' && typeof b === 'number') {
            this.start = new Position(a, b);
            this.end = new Position(c ?? 0, d ?? 0);
        } else {
            this.start = a as Position;
            this.end = b as Position;
        }
    }

    get isEmpty(): boolean {
        return this.start.isEqual(this.end);
    }

    get isSingleLine(): boolean {
        return this.start.line === this.end.line;
    }

    contains(positionOrRange: Position | Range): boolean {
        if (positionOrRange instanceof Range) {
            return this.contains(positionOrRange.start) && this.contains(positionOrRange.end);
        }
        const pos = positionOrRange;
        if (pos.isBefore(this.start) || pos.isAfter(this.end)) return false;
        return true;
    }

    with(start?: Position, end?: Position): Range {
        return new Range(start ?? this.start, end ?? this.end);
    }

    intersection(other: Range): Range | undefined {
        const start = this.start.isBefore(other.start) ? other.start : this.start;
        const end = this.end.isBefore(other.end) ? this.end : other.end;
        if (start.isAfter(end)) return undefined;
        return new Range(start, end);
    }

    union(other: Range): Range {
        const start = this.start.isBefore(other.start) ? this.start : other.start;
        const end = this.end.isAfter(other.end) ? this.end : other.end;
        return new Range(start, end);
    }

    isEqual(other: Range): boolean {
        return this.start.isEqual(other.start) && this.end.isEqual(other.end);
    }
}

export class Selection extends Range {
    public readonly anchor: Position;
    public readonly active: Position;

    constructor(anchorLine: number, anchorChar: number, activeLine: number, activeChar: number);
    constructor(anchor: Position, active: Position);
    constructor(
        a: number | Position,
        b: number | Position,
        c?: number,
        d?: number
    ) {
        if (typeof a === 'number' && typeof b === 'number') {
            super(a, b, c ?? 0, d ?? 0);
            this.anchor = new Position(a, b);
            this.active = new Position(c ?? 0, d ?? 0);
        } else {
            super(a as Position, b as Position);
            this.anchor = a as Position;
            this.active = b as Position;
        }
    }

    get isReversed(): boolean {
        return this.anchor.isAfter(this.active);
    }
}

// ─── Uri ─────────────────────────────────────────────────────────

export class Uri {
    private constructor(
        public readonly scheme: string,
        public readonly authority: string,
        public readonly path: string,
        public readonly query: string,
        public readonly fragment: string
    ) {}

    get fsPath(): string {
        return this.path;
    }

    toString(): string {
        return `${this.scheme}://${this.path}`;
    }

    with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri {
        return new Uri(
            change.scheme ?? this.scheme,
            change.authority ?? this.authority,
            change.path ?? this.path,
            change.query ?? this.query,
            change.fragment ?? this.fragment
        );
    }

    toJSON(): any {
        return { scheme: this.scheme, authority: this.authority, path: this.path, query: this.query, fragment: this.fragment };
    }

    static file(path: string): Uri {
        return new Uri('file', '', path, '', '');
    }

    static parse(value: string): Uri {
        const match = value.match(/^([^:]+):\/\/(.*)$/);
        if (match) {
            return new Uri(match[1], '', match[2], '', '');
        }
        return new Uri('file', '', value, '', '');
    }

    static from(components: { scheme: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri {
        return new Uri(
            components.scheme,
            components.authority ?? '',
            components.path ?? '',
            components.query ?? '',
            components.fragment ?? ''
        );
    }

    static joinPath(base: Uri, ...pathSegments: string[]): Uri {
        const joined = [base.path, ...pathSegments].join('/').replace(/\/+/g, '/');
        return base.with({ path: joined });
    }
}

// ─── Enums ───────────────────────────────────────────────────────

export enum EndOfLine {
    LF = 1,
    CRLF = 2
}

export enum DiagnosticSeverity {
    Error = 0,
    Warning = 1,
    Information = 2,
    Hint = 3
}

export enum SymbolKind {
    File = 0,
    Module = 1,
    Namespace = 2,
    Package = 3,
    Class = 4,
    Method = 5,
    Property = 6,
    Field = 7,
    Constructor = 8,
    Enum = 9,
    Interface = 10,
    Function = 11,
    Variable = 12,
    Constant = 13,
    String = 14,
    Number = 15,
    Boolean = 16,
    Array = 17,
    Object = 18,
    Key = 19,
    Null = 20,
    EnumMember = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25
}

export enum CompletionItemKind {
    Text = 0,
    Method = 1,
    Function = 2,
    Constructor = 3,
    Field = 4,
    Variable = 5,
    Class = 6,
    Interface = 7,
    Module = 8,
    Property = 9,
    Unit = 10,
    Value = 11,
    Enum = 12,
    Keyword = 13,
    Snippet = 14,
    Color = 15,
    Reference = 17,
    File = 16,
    Folder = 18,
    EnumMember = 19,
    Constant = 20,
    Struct = 21,
    Event = 22,
    Operator = 23,
    TypeParameter = 24
}

export enum CodeActionKind {
    Empty = '',
    QuickFix = 'quickfix',
    Refactor = 'refactor',
    RefactorExtract = 'refactor.extract',
    RefactorInline = 'refactor.inline',
    RefactorRewrite = 'refactor.rewrite',
    Source = 'source',
    SourceOrganizeImports = 'source.organizeImports',
    SourceFixAll = 'source.fixAll'
}

export enum ConfigurationTarget {
    Global = 1,
    Workspace = 2,
    WorkspaceFolder = 3
}

// ─── StatusBarAlignment ─────────────────────────────────────────

export enum StatusBarAlignment {
    Left = 1,
    Right = 2,
}

// ─── Document types ──────────────────────────────────────────────

export class Diagnostic {
    constructor(
        public range: Range,
        public message: string,
        public severity: DiagnosticSeverity = DiagnosticSeverity.Error
    ) {}

    public source?: string;
    public code?: string | number;
}

export class DocumentSymbol {
    public children: DocumentSymbol[] = [];

    constructor(
        public name: string,
        public detail: string,
        public kind: SymbolKind,
        public range: Range,
        public selectionRange: Range
    ) {}
}

export class Location {
    constructor(
        public uri: Uri,
        public range: Range
    ) {}
}

export class CodeAction {
    constructor(
        public title: string,
        public kind?: any
    ) {}
}

export class CompletionList {
    constructor(
        public items: any[] = [],
        public isIncomplete = false
    ) {}
}

export class Hover {
    constructor(
        public contents: any,
        public range?: Range
    ) {}
}

// ─── Shared mock state ───────────────────────────────────────────

/** Flag so tests can detect they are running against the mock. */
export const _isMock = true;

/** Module-level store for workspace.getConfiguration persistence. */
const _configStore: Record<string, Record<string, any>> = {};

/** Known default configuration values for the SysML extension. */
const _configDefaults: Record<string, Record<string, any>> = {
    sysml: {
        'validation.enabled': true,
        'format.indentSize': 4,
        'visualization.defaultView': 'bdd',
        'export.defaultScale': 2,
    },
    sysmlLanguageServer: {
        'trace.server': 'off',
    },
};

/** Registered commands (populated via commands.registerCommand). */
const _registeredCommands = new Map<string, (...args: any[]) => any>();

// ─── Workspace / Window stubs ────────────────────────────────────

export const workspace = {
    openTextDocument: async (uriOrOptions: any): Promise<any> => {
        // Support the { language, content } form used by many tests
        if (uriOrOptions && typeof uriOrOptions === 'object' && 'content' in uriOrOptions) {
            const content: string = uriOrOptions.content ?? '';
            const language: string = uriOrOptions.language ?? 'plaintext';
            const lines = content.split('\n');
            const uri = Uri.parse(`untitled:Untitled-${Date.now()}`);
            return {
                uri,
                languageId: language,
                fileName: uri.fsPath,
                isClosed: false,
                isDirty: false,
                isUntitled: true,
                version: 1,
                eol: EndOfLine.LF,
                lineCount: lines.length,
                getText: (range?: Range) => {
                    if (!range) return content;
                    const startOff = lines.slice(0, range.start.line).reduce((s, l) => s + l.length + 1, 0) + range.start.character;
                    const endOff = lines.slice(0, range.end.line).reduce((s, l) => s + l.length + 1, 0) + range.end.character;
                    return content.substring(startOff, endOff);
                },
                lineAt: (lineOrPos: number | Position) => {
                    const lineNum = typeof lineOrPos === 'number' ? lineOrPos : lineOrPos.line;
                    const text = lines[lineNum] ?? '';
                    return {
                        lineNumber: lineNum,
                        text,
                        range: new Range(lineNum, 0, lineNum, text.length),
                        rangeIncludingLineBreak: new Range(lineNum, 0, lineNum + 1, 0),
                        firstNonWhitespaceCharacterIndex: text.search(/\S/) === -1 ? 0 : text.search(/\S/),
                        isEmptyOrWhitespace: text.trim().length === 0,
                    };
                },
                positionAt: (offset: number) => {
                    let line = 0;
                    let remaining = offset;
                    for (const l of lines) {
                        if (remaining <= l.length) return new Position(line, remaining);
                        remaining -= l.length + 1;
                        line++;
                    }
                    return new Position(Math.max(0, lines.length - 1), (lines[lines.length - 1] ?? '').length);
                },
                offsetAt: (pos: Position) => {
                    let offset = 0;
                    for (let i = 0; i < pos.line && i < lines.length; i++) offset += lines[i].length + 1;
                    return offset + pos.character;
                },
                validateRange: (range: Range) => range,
                validatePosition: (pos: Position) => pos,
                save: async () => true,
                getWordRangeAtPosition: () => undefined,
            };
        }
        throw new Error('workspace.openTextDocument is not available in unit test mode');
    },
    getConfiguration: (section?: string) => {
        const sectionKey = section ?? '';
        const defaults = _configDefaults[sectionKey] ?? {};
        if (!_configStore[sectionKey]) _configStore[sectionKey] = {};
        const store = _configStore[sectionKey];
        return {
            get: <T>(key: string, defaultValue?: T): T | undefined => {
                if (key in store && store[key] !== undefined) return store[key] as T;
                if (key in defaults) return defaults[key] as T;
                return defaultValue;
            },
            has: (key: string) => key in store || key in defaults,
            inspect: (key: string) => {
                if (key in defaults || key in store) {
                    return {
                        key: section ? `${section}.${key}` : key,
                        defaultValue: defaults[key],
                        globalValue: store[key],
                    };
                }
                return undefined;
            },
            update: async (key: string, value: any, _target?: any) => {
                store[key] = value;
            },
        };
    },
    onDidChangeTextDocument: () => ({ dispose: () => {} }),
    onDidOpenTextDocument: () => ({ dispose: () => {} }),
    onDidCloseTextDocument: () => ({ dispose: () => {} }),
    onDidChangeConfiguration: () => ({ dispose: () => {} }),
    workspaceFolders: undefined as any,
    fs: {
        readFile: async () => Buffer.from(''),
        writeFile: async () => {},
        stat: async () => ({ type: 1, ctime: 0, mtime: 0, size: 0 }),
    },
};

export const window = {
    showInformationMessage: async (..._args: any[]) => undefined,
    showWarningMessage: async (..._args: any[]) => undefined,
    showErrorMessage: async (..._args: any[]) => undefined,
    createOutputChannel: (_name: string) => ({
        appendLine: () => {},
        append: () => {},
        show: () => {},
        hide: () => {},
        clear: () => {},
        dispose: () => {},
    }),
    withProgress: async (_options: any, task: any) => task({ report: () => {} }),
    activeTextEditor: undefined as any,
    showTextDocument: async () => undefined,
    createWebviewPanel: (_viewType: string, _title: string, _showOptions: any, _options?: any) => {
        let html = '';
        const disposeFns: (() => void)[] = [];
        let disposed = false;
        return {
            webview: {
                get html() { return html; },
                set html(value: string) { html = value; },
                onDidReceiveMessage: () => ({ dispose: () => {} }),
                asWebviewUri: (u: any) => u,
                postMessage: async () => true,
            },
            onDidDispose: (fn: () => void) => { disposeFns.push(fn); return { dispose: () => {} }; },
            onDidChangeViewState: () => ({ dispose: () => {} }),
            reveal: () => {},
            dispose: () => { if (disposed) return; disposed = true; for (const fn of disposeFns) fn(); },
            visible: true,
            viewColumn: ViewColumn.Active,
        };
    },
    createTreeView: (_viewId: string, _options: any) => ({
        onDidChangeSelection: () => ({ dispose: () => {} }),
        onDidChangeVisibility: () => ({ dispose: () => {} }),
        onDidExpandElement: () => ({ dispose: () => {} }),
        onDidCollapseElement: () => ({ dispose: () => {} }),
        reveal: async () => {},
        dispose: () => {},
        selection: [],
        visible: true,
    }),
    createStatusBarItem: (_alignmentOrId?: any, _priority?: number) => ({
        text: '',
        tooltip: '' as string | undefined,
        backgroundColor: undefined as any,
        color: undefined as any,
        command: undefined as string | undefined,
        name: undefined as string | undefined,
        alignment: typeof _alignmentOrId === 'number' ? _alignmentOrId : StatusBarAlignment.Left,
        priority: _priority,
        show: function () { (this as any)._visible = true; },
        hide: function () { (this as any)._visible = false; },
        dispose: function () { (this as any)._disposed = true; },
        _visible: false,
        _disposed: false,
    }),
};

export const commands = {
    executeCommand: async (command: string, ...args: any[]) => {
        const handler = _registeredCommands.get(command);
        if (handler) return handler(...args);
        return undefined;
    },
    getCommands: async (_filterInternal?: boolean): Promise<string[]> => [..._registeredCommands.keys()],
    registerCommand: (command: string, callback: (...args: any[]) => any) => {
        _registeredCommands.set(command, callback);
        return { dispose: () => { _registeredCommands.delete(command); } };
    },
};

export const languages = {
    getDiagnostics: (_uri?: any) => [] as Diagnostic[],
    getLanguages: async () => ['sysml'] as string[],
    registerCodeActionsProvider: () => ({ dispose: () => {} }),
    createDiagnosticCollection: (_name?: string) => ({
        set: () => {},
        delete: () => {},
        clear: () => {},
        forEach: () => {},
        get: () => undefined,
        has: () => false,
        dispose: () => {},
    }),
};

export const extensions = {
    getExtension: (id: string) => {
        if (id === 'jamied.sysml-v2-support') {
            return {
                id,
                extensionUri: Uri.parse('file:///mock-extension'),
                extensionPath: '/mock-extension',
                isActive: true,
                packageJSON: {},
                exports: undefined,
                activate: async () => {},
                extensionKind: 1,
            };
        }
        return undefined;
    },
};

// ─── Event constructors ─────────────────────────────────────────

export class EventEmitter {
    private _listeners: ((...args: any[]) => any)[] = [];

    get event() {
        return (listener: (...args: any[]) => any) => {
            this._listeners.push(listener);
            return { dispose: () => { this._listeners = this._listeners.filter(l => l !== listener); } };
        };
    }

    fire(data?: any): void {
        for (const listener of this._listeners) {
            listener(data);
        }
    }

    dispose(): void {
        this._listeners = [];
    }
}

export class CancellationTokenSource {
    token = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => {} }) };
    cancel(): void { this.token.isCancellationRequested = true; }
    dispose(): void {}
}

// ─── TreeItem (for explorer tests) ──────────────────────────────

export enum TreeItemCollapsibleState {
    None = 0,
    Collapsed = 1,
    Expanded = 2
}

export class TreeItem {
    public label?: string;
    public collapsibleState?: TreeItemCollapsibleState;
    public iconPath?: any;
    public description?: string;
    public tooltip?: string | MarkdownString;
    public command?: any;
    public contextValue?: string;
    public resourceUri?: any;

    constructor(label: string, collapsibleState?: TreeItemCollapsibleState) {
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}

// ─── ThemeIcon / ThemeColor ─────────────────────────────────────

export class ThemeIcon {
    static readonly File = new ThemeIcon('file');
    static readonly Folder = new ThemeIcon('folder');

    constructor(
        public readonly id: string,
        public readonly color?: ThemeColor,
    ) {}
}

export class ThemeColor {
    constructor(public readonly id: string) {}
}

// ─── ViewColumn ─────────────────────────────────────────────────

export enum ViewColumn {
    Active = -1,
    Beside = -2,
    One = 1,
    Two = 2,
    Three = 3,
}

// ─── MarkdownString ─────────────────────────────────────────────

export class MarkdownString {
    public value: string;
    public isTrusted?: boolean;
    public supportThemeIcons?: boolean;

    constructor(value = '') {
        this.value = value;
    }

    appendText(value: string): MarkdownString {
        this.value += value;
        return this;
    }

    appendMarkdown(value: string): MarkdownString {
        this.value += value;
        return this;
    }

    appendCodeblock(value: string, language?: string): MarkdownString {
        this.value += `\n\`\`\`${language ?? ''}\n${value}\n\`\`\`\n`;
        return this;
    }
}

// ─── TextEdit ───────────────────────────────────────────────────

export class TextEdit {
    constructor(
        public range: Range,
        public newText: string
    ) {}

    static replace(range: Range, newText: string): TextEdit {
        return new TextEdit(range, newText);
    }

    static insert(position: Position, newText: string): TextEdit {
        return new TextEdit(new Range(position, position), newText);
    }

    static delete(range: Range): TextEdit {
        return new TextEdit(range, '');
    }
}

export class WorkspaceEdit {
    private _edits: Map<string, TextEdit[]> = new Map();

    replace(uri: Uri, range: Range, newText: string): void {
        const key = uri.toString();
        if (!this._edits.has(key)) this._edits.set(key, []);
        this._edits.get(key)?.push(TextEdit.replace(range, newText));
    }

    insert(uri: Uri, position: Position, newText: string): void {
        const key = uri.toString();
        if (!this._edits.has(key)) this._edits.set(key, []);
        this._edits.get(key)?.push(TextEdit.insert(position, newText));
    }

    delete(uri: Uri, range: Range): void {
        const key = uri.toString();
        if (!this._edits.has(key)) this._edits.set(key, []);
        this._edits.get(key)?.push(TextEdit.delete(range));
    }

    has(uri: Uri): boolean {
        return this._edits.has(uri.toString());
    }

    get size(): number {
        return this._edits.size;
    }
}
