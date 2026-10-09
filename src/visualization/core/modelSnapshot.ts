import { SysMLElementDTO, SysMLModelResult } from '../../providers/sysmlModelTypes';
import {
    displayNameOf, displayNamesById, elementKey, isAnonymousElement, relationshipSource,
} from '../../providers/modelNames';

/** Convert server DTOs to the common browser renderer contract. */
export function convertModelElements(
    elements: SysMLElementDTO[],
    parentName?: string,
    displayNames: ReadonlyMap<string, string> = displayNamesById(elements),
): unknown[] {
    const filtered = parentName
        ? elements.filter(element => !(element.type === 'package' && element.name === parentName))
        : elements;
    return filtered.map(element => {
        const attributes = element.attributes ?? {};
        const relationships = element.relationships ?? [];
        const name = displayNameOf(element);
        const attributeType = (attributes['partType'] ?? attributes['portType']) as string | undefined;
        const typings = attributeType
            ? attributeType.split(',').map(value => value.trim()).filter(Boolean)
            : relationships.filter(value => value.type === 'typing').map(value => value.target);
        return {
            name,
            type: element.type,
            id: element.symbolId && isAnonymousElement(element) ? element.symbolId : name,
            symbolId: element.symbolId,
            attributes,
            properties: {},
            typing: typings[0],
            typings,
            children: convertModelElements(element.children ?? [], element.name, displayNames),
            relationships: relationships.map(value => ({
                type: value.type,
                source: relationshipSource(value, displayNames),
                target: value.target,
            })),
        };
    });
}

/** Build a read-only diagram payload from a language-server snapshot. */
export function modelSnapshot(model: SysMLModelResult): Record<string, unknown> {
    return {
        command: 'update',
        elements: convertModelElements(mergeModelElements(model.elements ?? [])),
        relationships: model.relationships ?? [],
        sequenceDiagrams: model.sequenceDiagrams ?? [],
        activityDiagrams: model.activityDiagrams ?? [],
    };
}
/** Merge package declarations without mutating server snapshots. */
export function mergeModelElements(elements: SysMLElementDTO[]): SysMLElementDTO[] {
        const mergedMap = new Map<string, SysMLElementDTO>();
        const result: SysMLElementDTO[] = [];

        for (const el of elements) {
            const key = `${el.type}::${el.name}`;
            if (el.type === 'package' && mergedMap.has(key)) {
                const existing = mergedMap.get(key) ?? el;
                // Merge children (de-duplicate by name+type; anonymous children by symbolId)
                const childKeys = new Set(
                    (existing.children ?? []).map(elementKey)
                );
                for (const child of el.children ?? []) {
                    const ck = elementKey(child);
                    if (!childKeys.has(ck)) {
                        existing.children = existing.children ?? [];
                        existing.children.push(child);
                        childKeys.add(ck);
                    }
                }
                // Merge relationships
                const relKeys = new Set(
                    (existing.relationships ?? []).map(r => `${r.type}::${r.source}::${r.target}`)
                );
                for (const rel of el.relationships ?? []) {
                    const rk = `${rel.type}::${rel.source}::${rel.target}`;
                    if (!relKeys.has(rk)) {
                        existing.relationships = existing.relationships ?? [];
                        existing.relationships.push(rel);
                        relKeys.add(rk);
                    }
                }
                // Merge attributes (existing wins on conflict)
                if (el.attributes) {
                    existing.attributes = existing.attributes ?? {};
                    for (const [k, v] of Object.entries(el.attributes)) {
                        if (!(k in existing.attributes)) {
                            existing.attributes[k] = v;
                        }
                    }
                }
            } else if (el.type === 'package') {
                // Clone to avoid mutating original data
                const clone: SysMLElementDTO = {
                    ...el,
                    children: [...(el.children ?? [])],
                    relationships: [...(el.relationships ?? [])],
                    attributes: { ...(el.attributes ?? {}) },
                };
                mergedMap.set(key, clone);
                result.push(clone);
            } else {
                result.push(el);
            }
        }

        return result;
    }
