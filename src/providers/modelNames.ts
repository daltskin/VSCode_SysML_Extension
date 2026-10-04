/**
 * Naming helpers for `sysml/model` elements across sysml-v2-lsp versions.
 *
 * From sysml-v2-lsp 0.33, an anonymous element (`part : Engine;`,
 * `connect a.p to b.p;`) has an empty `name`, a `displayName` to show, and a
 * `symbolId` that tells it apart from other anonymous siblings. Relationships
 * it declares report an empty `source` and its `symbolId` as `sourceId`.
 */

import type { RelationshipDTO, SysMLElementDTO } from './sysmlModelTypes';

/** The text to show for an element; older servers report no `displayName`. */
export function displayNameOf(element: { name: string; displayName?: string }): string {
    return element.displayName || element.name;
}

/** Whether the server reported the element as anonymous (no declared name). */
export function isAnonymousElement(element: { name: string; attributes?: unknown }): boolean {
    const attributes = element.attributes;
    const flag = attributes instanceof Map ? attributes.get('isAnonymous') : (attributes as Record<string, unknown> | undefined)?.isAnonymous;
    return flag === true || element.name === '';
}

/** A key identifying an element among its siblings: anonymous elements by `symbolId`, others by name. */
export function elementKey(element: { type: string; name: string; symbolId?: string; attributes?: unknown }): string {
    return element.symbolId && isAnonymousElement(element)
        ? `${element.type}#${element.symbolId}`
        : `${element.type}::${element.name}`;
}

/** Map each element's `symbolId` to its display name, for resolving relationship sources. */
export function displayNamesById(elements: readonly SysMLElementDTO[], into = new Map<string, string>()): Map<string, string> {
    for (const element of elements) {
        if (element.symbolId) into.set(element.symbolId, displayNameOf(element));
        if (element.children?.length) displayNamesById(element.children, into);
    }
    return into;
}

/** A relationship's source name, falling back to its source element's display name when anonymous. */
export function relationshipSource(relationship: RelationshipDTO, displayNames: ReadonlyMap<string, string>): string {
    if (relationship.source) return relationship.source;
    return (relationship.sourceId && displayNames.get(relationship.sourceId)) || '';
}
