import * as vscode from 'vscode';
import { getSysMLKeywordIndex, suggestSysMLKeywords } from './keywords';

const { keywordSet: KEYWORD_SET } = getSysMLKeywordIndex();

function parseExpectedTokens(message: string): string[] {
    // Typical ANTLR messages include patterns like:
    // - "mismatched input 'packageasdf' expecting 'package'"
    // - "extraneous input 'X' expecting {'package', 'part'}"
    // - "mismatched input 'packageasdf' expecting PACKAGE"
    // - "mismatched input 'packageasdf' expecting {PACKAGE, PART, DEF}"
    const expectingIndex = message.indexOf('expecting');
    if (expectingIndex < 0) {
        return [];
    }

    const expecting = message.slice(expectingIndex);

    // 1) Prefer quoted literals when present: expecting 'package'
    const quoted = Array.from(expecting.matchAll(/'([^']+)'/g)).map(m => m[1]?.trim()).filter(Boolean) as string[];

    // 2) Handle expecting {PACKAGE, PART, DEF} and/or expecting {'package', 'part'}
    const braceMatch = expecting.match(/expecting\s*\{([^}]*)\}/);
    const braceTokens = braceMatch
        ? braceMatch[1]
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
        : [];

    // 3) Handle single token names without quotes: expecting PACKAGE
    const singleMatch = expecting.match(/expecting\s+([A-Z_]+|<[^>]+>)/);
    const singleToken = singleMatch?.[1]?.trim();

    const all = [...quoted, ...braceTokens, ...(singleToken ? [singleToken] : [])];
    return all
        .map(t => t.replace(/^'+|'+$/g, '').trim())
        .filter(t => t.length > 0);
}

function normalizeKeyword(token: string): string {
    // Some grammars tokenize multi-word keywords; we keep literal suggestions.
    const cleaned = token.replace(/^"|"$/g, '').trim();
    // Token names from ANTLR are typically UPPER_CASE identifiers; normalize them.
    if (/^[A-Z_]+$/.test(cleaned)) {
        return cleaned.toLowerCase();
    }
    return cleaned.toLowerCase();
}

export class SysMLCodeActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        const actions: vscode.CodeAction[] = [];

        const addReplacementActions = (replacementRange: vscode.Range, keywordCandidates: string[], diagnostic?: vscode.Diagnostic): void => {
            for (const keyword of keywordCandidates.slice(0, 5)) {
                const title = `Replace with ${keyword}`;
                const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
                if (diagnostic) {
                    fix.diagnostics = [diagnostic];
                }
                fix.isPreferred = keyword === 'package';

                const edit = new vscode.WorkspaceEdit();
                edit.replace(document.uri, replacementRange, keyword);
                fix.edit = edit;

                actions.push(fix);
            }
        };

        for (const diagnostic of context.diagnostics) {
            // Only quick-fix syntax keyword issues. We rely on the parser/validator diagnostic message.
            const expected = parseExpectedTokens(diagnostic.message)
                .map(normalizeKeyword)
                .filter(k => KEYWORD_SET.has(k));

            if (expected.length === 0) {
                continue;
            }

            // Prefer using the diagnostic range (more precise than the invocation range)
            const replacementRange = diagnostic.range ?? range;

            addReplacementActions(replacementRange, expected, diagnostic);
        }

        // Fallback: when there are no diagnostics (or they don't contain "expecting" data),
        // offer simple keyword-typo quick fixes based on the current word.
        if (actions.length === 0) {
            const wordRange = document.getWordRangeAtPosition(range.start, /[A-Za-z_][A-Za-z0-9_]*/);
            const targetRange = wordRange ?? range;
            const rawWord = document.getText(targetRange);
            const word = rawWord.trim().toLowerCase();

            const candidates = word.length >= 3 ? suggestSysMLKeywords(word, 5) : [];
            if (candidates.length > 0) {
                addReplacementActions(targetRange, candidates);
            }
        }

        return actions;
    }
}
