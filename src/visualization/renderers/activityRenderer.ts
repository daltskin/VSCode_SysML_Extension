import type { ActivityDiagramViewModel, VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

interface ActivityRendererViewModel {
    readonly diagrams: ActivityDiagramViewModel[];
    readonly metadata: {
        readonly diagramCount: number;
        readonly actionCount: number;
        readonly flowCount: number;
    };
}

const ACTIVITY_VIEW_ID: VisualizationViewId = 'activity';
const activityDefinition = DEFAULT_VIEW_DEFINITIONS.find(def => def.id === ACTIVITY_VIEW_ID);

if (!activityDefinition) {
    throw new Error('Activity view definition missing from DEFAULT_VIEW_DEFINITIONS.');
}

function buildActivityViewModel(dataset: VisualizationDataset): ActivityRendererViewModel | undefined {
    const diagrams = Array.isArray(dataset.activityDiagrams) ? dataset.activityDiagrams : [];
    if (diagrams.length === 0) {
        return undefined;
    }
    const actionCount = diagrams.reduce((total, diagram) => total + (diagram.stats?.actionCount ?? 0), 0);
    const flowCount = diagrams.reduce((total, diagram) => total + (diagram.stats?.flowCount ?? 0), 0);
    return {
        diagrams,
        metadata: {
            diagramCount: diagrams.length,
            actionCount,
            flowCount
        }
    };
}

registerRenderer({
    definition: activityDefinition,
    canRender: dataset => (dataset.activityDiagrams?.length ?? 0) > 0,
    buildViewModel: buildActivityViewModel
});
