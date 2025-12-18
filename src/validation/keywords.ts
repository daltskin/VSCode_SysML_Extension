import { SysMLv2Lexer } from '../parser/generated/grammar/SysMLv2Lexer';

function unquoteLiteral(literalName: string): string {
    // ANTLR literal names come back like: "'package'"
    const trimmed = literalName.trim();
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

export type SysMLKeywordIndex = Readonly<{
    keywordSet: ReadonlySet<string>;
    singleWordKeywords: readonly string[];
    multiWordKeywords: readonly string[];
}>;

function levenshteinDistance(a: string, b: string): number {
    if (a === b) {
        return 0;
    }
    const aLen = a.length;
    const bLen = b.length;
    if (aLen === 0) {
        return bLen;
    }
    if (bLen === 0) {
        return aLen;
    }

    const prev = new Array<number>(bLen + 1);
    const curr = new Array<number>(bLen + 1);

    for (let j = 0; j <= bLen; j++) {
        prev[j] = j;
    }

    for (let i = 1; i <= aLen; i++) {
        curr[0] = i;
        const aChar = a.charCodeAt(i - 1);
        for (let j = 1; j <= bLen; j++) {
            const cost = aChar === b.charCodeAt(j - 1) ? 0 : 1;
            curr[j] = Math.min(
                prev[j] + 1, // deletion
                curr[j - 1] + 1, // insertion
                prev[j - 1] + cost // substitution
            );
        }
        for (let j = 0; j <= bLen; j++) {
            prev[j] = curr[j];
        }
    }

    return prev[bLen];
}

let cached: SysMLKeywordIndex | undefined;

/**
 * Returns a normalized, lowercase keyword index derived from the generated SysML v2 lexer.
 *
 * Notes:
 * - Includes all single-token keyword literals from the lexer.
 * - Adds common multi-word keyword phrases (like "part def") used by the language.
 */
export function getSysMLKeywordIndex(): SysMLKeywordIndex {
    if (cached) {
        return cached;
    }

    const allSingleKeywords: string[] = [];

    // Token types begin at 1; stop when literal name becomes undefined for a stretch.
    // Using a generous upper bound keeps this resilient to grammar changes.
    for (let tokenType = 1; tokenType <= 2000; tokenType++) {
        const literal = SysMLv2Lexer.VOCABULARY.getLiteralName(tokenType);
        if (!literal) {
            continue;
        }

        const value = unquoteLiteral(literal).trim();
        if (value.length === 0) {
            continue;
        }

        // Filter out punctuation/operators. Keep words and word-ish literals.
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(value)) {
            continue;
        }

        allSingleKeywords.push(value.toLowerCase());
    }

    const singleWordKeywords = Array.from(new Set(allSingleKeywords)).sort();

    // Add common multi-word forms. These are not necessarily single lexer tokens.
    const keywordSet = new Set<string>(singleWordKeywords);

    // Common "X def" constructs.
    const defCombos = new Set([
        'action',
        'attribute',
        'calc',
        'constraint',
        'interface',
        'item',
        'part',
        'port',
        'requirement',
        'state',
        'view',
        'viewpoint',
    ]);

    if (keywordSet.has('def')) {
        for (const base of defCombos) {
            if (keywordSet.has(base)) {
                keywordSet.add(`${base} def`);
            }
        }
    }

    // Common two-word keyword phrases.
    if (keywordSet.has('use') && keywordSet.has('case')) {
        keywordSet.add('use case');
        if (keywordSet.has('def')) {
            keywordSet.add('use case def');
        }
    }

    const multiWordKeywords = Array.from(keywordSet).filter(k => k.includes(' ')).sort();

    cached = {
        keywordSet,
        singleWordKeywords,
        multiWordKeywords,
    };

    return cached;
}

/**
 * Suggest keyword replacements for a likely keyword typo.
 *
 * - Supports prefix typos ("packagedasf" -> "package")
 * - Supports near-miss typos ("party" -> "part")
 * - Supports squashed multi-word keywords ("partdef" -> "part def")
 */
export function suggestSysMLKeywords(rawWord: string, limit = 5): string[] {
    const word = rawWord.trim().toLowerCase();
    if (word.length === 0) {
        return [];
    }

    const { keywordSet, singleWordKeywords, multiWordKeywords } = getSysMLKeywordIndex();
    if (keywordSet.has(word)) {
        return [];
    }

    const prefixMatches = singleWordKeywords
        .filter(k => word !== k && word.startsWith(k))
        .sort((a, b) => b.length - a.length);

    const multiWordCandidates = multiWordKeywords
        .map(k => {
            const squashed = k.replace(/\s+/g, '');
            const distance = levenshteinDistance(word, squashed);
            const exactSquashedMatch = word === squashed;
            const prefixMatch = word.startsWith(squashed);
            return { k, squashed, distance, exactSquashedMatch, prefixMatch };
        })
        .filter(x => x.exactSquashedMatch || x.prefixMatch || x.distance <= 2)
        .sort((a, b) => {
            if (a.exactSquashedMatch !== b.exactSquashedMatch) {
                return a.exactSquashedMatch ? -1 : 1;
            }
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            }
            return b.squashed.length - a.squashed.length;
        })
        .map(x => x.k);

    const fuzzyMatches = singleWordKeywords
        .map(k => ({ k, d: levenshteinDistance(word, k) }))
        .filter(x => x.d > 0 && x.d <= 2)
        .sort((a, b) => a.d - b.d || a.k.localeCompare(b.k))
        .map(x => x.k);

    return Array.from(new Set([...multiWordCandidates, ...prefixMatches, ...fuzzyMatches])).slice(0, limit);
}
