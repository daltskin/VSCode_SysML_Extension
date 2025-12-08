export type VisualizationViewId = 'sysml'
    | 'tree'
    | 'elk'
    | 'bdd'
    | 'package'
    | 'ibd'
    | 'graph'
    | 'hierarchy'
    | 'sequence'
    | 'activity'
    | 'state'
    | 'usecase';

export type VisualizationViewCategory = 'pillar' | 'structural' | 'behavioral' | 'analysis' | 'other';

export interface VisualizationViewDefinition {
    readonly id: VisualizationViewId;
    readonly label: string;
    readonly description: string;
    readonly category: VisualizationViewCategory;
    readonly order: number;
}

export const DEFAULT_VIEW_DEFINITIONS: readonly VisualizationViewDefinition[] = [
    {
        id: 'tree',
        label: '▲ Tree View',
        description: 'Indented tree showing containment hierarchy and nested parts',
        category: 'other',
        order: 10
    },
    {
        id: 'elk',
        label: '◆ General View',
        description: 'Shows all essential elements and structure including parts, attributes, interfaces, documentation',
        category: 'structural',
        order: 1
    },
    {
        id: 'bdd',
        label: '▣ Block Definition',
        description: 'Layered block definition diagram with part/composition context',
        category: 'structural',
        order: 25
    },
    {
        id: 'package',
        label: '▤ Package View',
        description: 'Package containment with dependency overlays and compound groups',
        category: 'other',
        order: 11
    },
    {
        id: 'ibd',
        label: '▦ Interconnection View',
        description: 'Internal Block Diagram (IBD) per SysML v2 spec: shows internal structure with parts, ports, connections, interfaces, and bindings within a selected package',
        category: 'structural',
        order: 2
    },
    {
        id: 'graph',
        label: '● Graph View',
        description: 'Force-directed network for relationship exploration',
        category: 'other',
        order: 12
    },
    {
        id: 'hierarchy',
        label: '■ Hierarchy View',
        description: 'Clustered hierarchy to inspect package decomposition',
        category: 'other',
        order: 13
    },
    {
        id: 'sequence',
        label: '⇄ Sequence View',
        description: 'Temporal interaction view for exchanges between participants',
        category: 'behavioral',
        order: 5
    },
    {
        id: 'activity',
        label: '▶ Action Flow View',
        description: 'Flow-centric activity diagram with swimlanes and decisions',
        category: 'behavioral',
        order: 3
    },
    {
        id: 'state',
        label: '⌘ State Transition View',
        description: 'Composite state machine view with transitions and guards',
        category: 'behavioral',
        order: 4
    },
    {
        id: 'usecase',
        label: '◎ Case View',
        description: 'Actor-centric scenario view with include/extend relationships',
        category: 'behavioral',
        order: 6
    }
];
