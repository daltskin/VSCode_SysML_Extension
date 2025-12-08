import type { SequenceDiagramViewModel, VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

const SEQUENCE_VIEW_ID: VisualizationViewId = 'sequence';
const sequenceDefinition = DEFAULT_VIEW_DEFINITIONS.find(def => def.id === SEQUENCE_VIEW_ID);

if (!sequenceDefinition) {
    throw new Error('Sequence view definition missing from DEFAULT_VIEW_DEFINITIONS.');
}

function buildSequenceViewModel(dataset: VisualizationDataset): SequenceDiagramViewModel[] {
    return Array.isArray(dataset.sequenceDiagrams)
        ? dataset.sequenceDiagrams
        : [];
}

registerRenderer({
    definition: sequenceDefinition,
    canRender: dataset => (dataset.sequenceDiagrams?.length ?? 0) > 0,
    buildViewModel: buildSequenceViewModel
});
