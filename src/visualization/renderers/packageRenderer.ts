import { DEFAULT_CONTAINER_LAYOUT } from '../types/layoutConfig';
import { buildPackageViewModel } from '../types/structural/packageViewModel';
import type { VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

const PACKAGE_VIEW_ID: VisualizationViewId = 'package';
const packageDefinition = DEFAULT_VIEW_DEFINITIONS.find(definition => definition.id === PACKAGE_VIEW_ID);

export const PACKAGE_CONTAINER_WIDTH = DEFAULT_CONTAINER_LAYOUT.width;
export const PACKAGE_CONTAINER_HEIGHT = DEFAULT_CONTAINER_LAYOUT.height;

if (!packageDefinition) {
    throw new Error('Package view definition is not registered in DEFAULT_VIEW_DEFINITIONS.');
}

registerRenderer({
    definition: packageDefinition,
    canRender: dataset => Boolean(dataset?.elements?.length),
    buildViewModel: (dataset: VisualizationDataset) => buildPackageViewModel(dataset)
});
