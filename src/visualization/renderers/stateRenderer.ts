import type { DiagramElementViewModel, DiagramRelationshipViewModel, VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

interface StateRendererViewModel {
    readonly states: DiagramElementViewModel[];
    readonly transitions: DiagramRelationshipViewModel[];
}

const STATE_VIEW_ID: VisualizationViewId = 'state';
const stateDefinition = DEFAULT_VIEW_DEFINITIONS.find(def => def.id === STATE_VIEW_ID);

if (!stateDefinition) {
    throw new Error('State Machine view definition missing from DEFAULT_VIEW_DEFINITIONS.');
}

function isStateElement(element: DiagramElementViewModel | undefined): element is DiagramElementViewModel {
    if (!element || typeof element.type !== 'string') {
        return false;
    }
    const normalized = element.type.toLowerCase();
    return normalized.includes('state') && !normalized.includes('transition');
}

function isTransitionElement(element: DiagramElementViewModel | undefined): element is DiagramElementViewModel {
    if (!element || typeof element.type !== 'string') {
        return false;
    }
    return element.type.toLowerCase() === 'transition';
}

function collectStateAndTransitionElements(elements: DiagramElementViewModel[]): {
    states: DiagramElementViewModel[],
    transitions: DiagramElementViewModel[]
} {
    const states: DiagramElementViewModel[] = [];
    const transitions: DiagramElementViewModel[] = [];
    const queue = [...elements];

    while (queue.length > 0) {
        const element = queue.shift();
        if (!element) continue;

        if (isStateElement(element)) {
            states.push(element);
        } else if (isTransitionElement(element)) {
            transitions.push(element);
        }

        // Recursively search children
        if (Array.isArray(element.children)) {
            queue.push(...element.children);
        }
    }

    return { states, transitions };
}

function buildTransitionRelationships(transitionElements: DiagramElementViewModel[]): DiagramRelationshipViewModel[] {
    const relationships: DiagramRelationshipViewModel[] = [];

    transitionElements.forEach(transition => {
        const fromState = transition.attributes?.fromState;
        const toState = transition.attributes?.toState;

        if (fromState && toState) {
            const labelValue = transition.name || transition.attributes?.trigger;
            const label = labelValue ? String(labelValue) : '';
            relationships.push({
                id: transition.id || `transition-${fromState}-${toState}`,
                type: 'transition',
                source: String(fromState),
                target: String(toState),
                label: label
            });
        }
    });

    return relationships;
}

function buildStateViewModel(dataset: VisualizationDataset): StateRendererViewModel | undefined {
    const { states, transitions } = collectStateAndTransitionElements(dataset.elements ?? []);

    if (states.length === 0) {
        return undefined;
    }

    const transitionRelationships = buildTransitionRelationships(transitions);

    return {
        states,
        transitions: transitionRelationships
    };
}

registerRenderer({
    definition: stateDefinition,
    canRender: dataset => {
        const { states } = collectStateAndTransitionElements(dataset?.elements ?? []);
        return states.length > 0;
    },
    buildViewModel: buildStateViewModel
});
