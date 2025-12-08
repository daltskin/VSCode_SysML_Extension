import { DEFAULT_CONTAINER_LAYOUT } from '../types/layoutConfig';
import { buildBddViewModel } from '../types/structural/bddViewModel';
import type { VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

const BDD_VIEW_ID: VisualizationViewId = 'bdd';
const bddDefinition = DEFAULT_VIEW_DEFINITIONS.find(definition => definition.id === BDD_VIEW_ID);

export const BDD_CONTAINER_WIDTH = DEFAULT_CONTAINER_LAYOUT.width;
export const BDD_CONTAINER_HEIGHT = DEFAULT_CONTAINER_LAYOUT.height;

if (!bddDefinition) {
    throw new Error('BDD view definition is not registered in DEFAULT_VIEW_DEFINITIONS.');
}

registerRenderer({
    definition: bddDefinition,
    canRender: dataset => Boolean(dataset?.elements?.length),
    buildViewModel: (dataset: VisualizationDataset) => buildBddViewModel(dataset)
});
