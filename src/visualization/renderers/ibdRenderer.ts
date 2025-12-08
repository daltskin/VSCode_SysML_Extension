import { buildIbdViewModel } from '../types/structural/ibdViewModel';
import type { VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

const IBD_VIEW_ID: VisualizationViewId = 'ibd';
const ibdDefinition = DEFAULT_VIEW_DEFINITIONS.find(definition => definition.id === IBD_VIEW_ID);

if (!ibdDefinition) {
    throw new Error('IBD view definition is not registered in DEFAULT_VIEW_DEFINITIONS.');
}

registerRenderer({
    definition: ibdDefinition,
    canRender: dataset => Boolean(dataset?.elements?.length),
    buildViewModel: (dataset: VisualizationDataset) => buildIbdViewModel(dataset)
});
