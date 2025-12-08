import type { VisualizationDataset } from '../types/viewModels';
import {
    DEFAULT_VIEW_DEFINITIONS,
    type VisualizationViewDefinition,
    type VisualizationViewId
} from '../types/views';

export interface RendererAbortSignal {
    readonly aborted: boolean;
}

export interface VisualizationRendererContext {
    readonly dataset: VisualizationDataset;
    readonly signal?: RendererAbortSignal;
}

export interface VisualizationRenderer {
    readonly definition: VisualizationViewDefinition;
    readonly canRender?: (dataset: VisualizationDataset) => boolean;
    readonly buildViewModel?: (dataset: VisualizationDataset) => unknown;
    readonly render?: (context: VisualizationRendererContext) => Promise<void> | void;
    readonly teardown?: () => void;
}

const rendererRegistry = new Map<VisualizationViewId, VisualizationRenderer>();

function ensureDefaultsInitialized() {
    if (rendererRegistry.size > 0) {
        return;
    }

    DEFAULT_VIEW_DEFINITIONS.forEach(definition => {
        rendererRegistry.set(definition.id, { definition });
    });
}

export function registerRenderer(renderer: VisualizationRenderer): void {
    ensureDefaultsInitialized();
    rendererRegistry.set(renderer.definition.id, renderer);
}

export function getRenderer(viewId: VisualizationViewId): VisualizationRenderer | undefined {
    ensureDefaultsInitialized();
    return rendererRegistry.get(viewId);
}

export function getRegisteredRenderers(): VisualizationRenderer[] {
    ensureDefaultsInitialized();
    return Array.from(rendererRegistry.values()).sort((a, b) => a.definition.order - b.definition.order);
}

export function getRendererDefinitions(): VisualizationViewDefinition[] {
    return getRegisteredRenderers().map(entry => entry.definition);
}

import './bddRenderer';
import './elkRenderer';
import './ibdRenderer';
import './packageRenderer';
import './treeRenderer';
import './sequenceRenderer';
import './activityRenderer';
import './stateRenderer';
import './usecaseRenderer';

