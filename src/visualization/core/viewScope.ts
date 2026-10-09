import { DiagramFence, DIAGRAM_TYPES } from '../../markdown/fenceParser';
import { SysMLElementDTO } from '../../providers/sysmlModelTypes';

export interface ViewScope {
    readonly name: string;
    readonly exposeTargets: readonly string[];
    readonly viewFilters: readonly string[];
    readonly viewRendering?: string;
    readonly viewType?: string;
}

const VIEW_TYPES: Readonly<Record<string, string>> = {
    GeneralView: 'elk', InterconnectionView: 'ibd', ActionFlowView: 'activity',
    StateTransitionView: 'state', SequenceView: 'sequence', BrowserView: 'tree',
    CaseView: 'usecase', PackageView: 'package',
};
const RENDERINGS: Readonly<Record<string, string>> = {
    asTreeDiagram: 'tree', asInterconnectionDiagram: 'ibd',
    asTextualNotation: 'textual', asElementTable: 'table',
};

/** Select a named view and diagram; filtering is applied by the shared renderer. */
export function selectView(
    elements: readonly SysMLElementDTO[],
    fence: DiagramFence,
): { currentView: string; selectedViewScope?: ViewScope } {
    const matches: { element: SysMLElementDTO; qualified: string }[] = [];
    const definitions = new Map<string, SysMLElementDTO>();
    const visit = (members: readonly SysMLElementDTO[], parent = ''): void => {
        for (const element of members) {
            const qualified = parent ? `${parent}::${element.name}` : element.name;
            if (element.type.toLowerCase() === 'view def') {
                definitions.set(qualified, element);
            } else if (element.type.toLowerCase() === 'view'
                && (element.name === fence.view || qualified === fence.view)) {
                matches.push({ element, qualified });
            }
            visit(element.children ?? [], qualified);
        }
    };
    visit(elements);
    if (fence.view && matches.length !== 1) {
        throw new Error(matches.length ? `Ambiguous view: ${fence.view}. Use its qualified name.`
            : `View not found: ${fence.view}`);
    }
    const element = matches[0]?.element;
    const type = String(element?.attributes?.partType ?? '');
    const shortName = (value: string): string => value.split('::').pop() ?? value;
    const resolveDefinition = (
        name: string, owner: string, seen = new Set<string>(),
    ): { attributes: SysMLElementDTO['attributes']; viewType: string } => {
        let namespace = owner.split('::').slice(0, -1);
        let qualified: string | undefined;
        while (!qualified) {
            const candidate = [...namespace, name].join('::');
            if (definitions.has(candidate)) qualified = candidate;
            if (!namespace.length) break;
            namespace = namespace.slice(0, -1);
        }
        if (!qualified) {
            const candidates = [...definitions.keys()].filter(key => shortName(key) === name);
            if (candidates.length > 1) throw new Error(`Ambiguous view definition: ${name}`);
            qualified = candidates[0];
        }
        if (!qualified) return { attributes: {}, viewType: name };
        if (seen.has(qualified)) throw new Error(`Cyclic view inheritance: ${qualified}`);
        seen.add(qualified);
        const definition = definitions.get(qualified);
        if (!definition) return { attributes: {}, viewType: name };
        const parent = String(definition.attributes?.partType ?? '');
        const inherited = parent ? resolveDefinition(parent, qualified, seen)
            : { attributes: {}, viewType: name };
        return {
            attributes: { ...inherited.attributes, ...definition.attributes },
            viewType: inherited.viewType,
        };
    };
    const inherited = resolveDefinition(type, matches[0]?.qualified ?? '');
    const attributes = { ...inherited.attributes, ...element?.attributes };
    const split = (value: unknown): string[] => String(value ?? '')
        .split(',').map(target => target.trim()).filter(Boolean);
    const rendering = String(attributes.viewRendering ?? '');
    return {
        currentView: (fence.diagram ? DIAGRAM_TYPES[fence.diagram] : undefined)
            ?? RENDERINGS[shortName(rendering)] ?? VIEW_TYPES[shortName(inherited.viewType)] ?? 'elk',
        selectedViewScope: element ? {
            name: element.name,
            exposeTargets: split(attributes.exposeTargets),
            viewFilters: split(attributes.viewFilters),
            viewRendering: rendering,
            viewType: inherited.viewType,
        } : undefined,
    };
}
