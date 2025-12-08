import type { DiagramElementViewModel, DiagramRelationshipViewModel, VisualizationDataset } from '../types/viewModels';
import type { VisualizationViewId } from '../types/views';
import { DEFAULT_VIEW_DEFINITIONS } from '../types/views';
import { registerRenderer } from './index';

interface UseCaseRendererViewModel {
    readonly actors: DiagramElementViewModel[];
    readonly useCases: DiagramElementViewModel[];
    readonly relationships: DiagramRelationshipViewModel[];
}

const USE_CASE_VIEW_ID: VisualizationViewId = 'usecase';
const useCaseDefinition = DEFAULT_VIEW_DEFINITIONS.find(def => def.id === USE_CASE_VIEW_ID);

if (!useCaseDefinition) {
    throw new Error('Use Case view definition missing from DEFAULT_VIEW_DEFINITIONS.');
}

function isActorElement(element: DiagramElementViewModel | undefined): element is DiagramElementViewModel {
    return Boolean(element && typeof element.type === 'string' && element.type.toLowerCase().includes('actor'));
}

function isUseCaseElement(element: DiagramElementViewModel | undefined): element is DiagramElementViewModel {
    if (!element || typeof element.type !== 'string') {
        return false;
    }
    const normalized = element.type.toLowerCase();
    return normalized.includes('use case') || normalized.includes('usecase') || normalized.includes('scenario');
}

function collectUseCaseElements(elements: DiagramElementViewModel[]): { actors: DiagramElementViewModel[]; useCases: DiagramElementViewModel[] } {
    const actors: DiagramElementViewModel[] = [];
    const useCases: DiagramElementViewModel[] = [];
    const actorIds = new Set<string>();
    const useCaseIds = new Set<string>();
    const actorNames = new Set<string>(); // Deduplicate by name too
    const useCaseNames = new Set<string>(); // Deduplicate by name too

    // Track actor usages to create synthetic actors later
    const actorUsages: { name: string; typing: string; parentUseCase: string }[] = [];

    const queue: { element: DiagramElementViewModel; parentIsUseCase: boolean; parentUseCaseName?: string }[] =
        elements.map(e => ({ element: e, parentIsUseCase: false }));

    while (queue.length > 0) {
        const item = queue.shift();
        if (!item) continue;

        const { element, parentIsUseCase, parentUseCaseName } = item;
        const elementType = String(element.type).toLowerCase();

        // Only collect top-level actor definitions (type: "actor def"), not actor usage instances
        // Actor usage instances (type: "actor") are children of use cases and represent relationships
        if (isActorElement(element) && !parentIsUseCase) {
            // Only include if it's an actor definition, not an actor usage
            if (elementType.includes('def') || !elementType.includes('actor')) {
                const normalizedName = element.name.toLowerCase().trim();
                // Deduplicate by both ID and name
                if (!actorIds.has(element.id) && !actorNames.has(normalizedName)) {
                    actorIds.add(element.id);
                    actorNames.add(normalizedName);
                    actors.push(element);
                }
            }
        } else if (isUseCaseElement(element)) {
            const normalizedName = element.name.toLowerCase().trim();
            // Deduplicate by both ID and name
            if (!useCaseIds.has(element.id) && !useCaseNames.has(normalizedName)) {
                useCaseIds.add(element.id);
                useCaseNames.add(normalizedName);
                useCases.push(element);
            }
        }

        // Track actor usages inside use cases (these reference external actors by typing)
        if (parentIsUseCase && elementType === 'actor usage') {
            const typing = element.attributes?.typing || element.attributes?.type || '';
            if (typing && parentUseCaseName) {
                actorUsages.push({
                    name: element.name,
                    typing: String(typing).replace(/^['"]|['"]$/g, ''),
                    parentUseCase: parentUseCaseName
                });
            }
        }

        // Recursively search children, marking if parent is a use case
        if (Array.isArray(element.children)) {
            const isUseCase = isUseCaseElement(element);
            const useCaseName = isUseCase ? element.name : parentUseCaseName;
            queue.push(...element.children.map(child => ({
                element: child,
                parentIsUseCase: isUseCase || parentIsUseCase,
                parentUseCaseName: useCaseName
            })));
        }
    }

    // Create synthetic actors from actor usages whose typing doesn't match existing actors
    for (const usage of actorUsages) {
        const typingLower = usage.typing.toLowerCase();
        const normalizedName = typingLower.trim();

        // Check if we already have this actor
        if (!actorNames.has(normalizedName)) {
            // Look for a matching element definition (item def, part def, etc.) that could be used as actor
            const findTypedElement = (elems: DiagramElementViewModel[]): DiagramElementViewModel | undefined => {
                for (const elem of elems) {
                    const elemName = elem.name.toLowerCase().replace(/^['"]|['"]$/g, '');
                    if (elemName === normalizedName) {
                        return elem;
                    }
                    if (elem.children) {
                        const found = findTypedElement(elem.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            const typedElement = findTypedElement(elements);

            // Create synthetic actor from the typing
            const syntheticActor: DiagramElementViewModel = {
                id: `synthetic-actor-${usage.typing}`,
                name: usage.typing,  // Use the typing name from the actor usage
                type: 'actor def',   // Treat as actor def for rendering
                attributes: typedElement?.attributes || {},
                properties: {},
                children: [],
                relationships: [],
                metadata: { depth: 0, path: [] }
            };

            actorIds.add(syntheticActor.id);
            actorNames.add(normalizedName);
            actors.push(syntheticActor);
        }
    }

    return { actors, useCases };
}

function extractUseCaseRelationships(
    useCases: DiagramElementViewModel[],
    actors: DiagramElementViewModel[]
): DiagramRelationshipViewModel[] {
    const relationships: DiagramRelationshipViewModel[] = [];
    const _actorNames = new Set(actors.map(a => a.name.toLowerCase()));


    useCases.forEach(useCase => {

        // Check for actor children - direct relationships
        // Match both 'actor' and 'actor usage' types
        const actorChildren = useCase.children?.filter(child => {
            const childType = child.type.toLowerCase();
            return childType === 'actor' || childType === 'actor usage';
        }) || [];


        actorChildren.forEach(actorChild => {
            // Check typing first (for actor usages), then type attribute, then name
            const actorTyping = String(actorChild.attributes?.typing || actorChild.attributes?.type || actorChild.name).replace(/^['"]|['"]$/g, '');

            // Find matching actor definition in top-level actors
            const matchingActor = actors.find(actor => {
                const actorName = actor.name.toLowerCase().replace(/^['"]|['"]$/g, '');
                return actorName === actorTyping.toLowerCase() ||
                       actorName === actorChild.name.toLowerCase();
            });

            if (matchingActor) {
                const relId = `${matchingActor.name}-${useCase.name}`;
                if (!relationships.some(r => r.id === relId)) {
                    relationships.push({
                        id: relId,
                        type: 'performs',
                        source: matchingActor.name,
                        target: useCase.name
                    });
                }
            }
        });

        // Note: Subjects are NOT actors in use case diagrams
        // The subject represents the system being described (the system boundary)
        // We don't create actor relationships for subjects

        // Also check if any actor name appears in use case attributes
        actors.forEach(actor => {
            const actorNameLower = actor.name.toLowerCase();
            const useCaseAttrs = useCase.attributes || {};

            // Check if actor is mentioned in any attribute
            for (const [, value] of Object.entries(useCaseAttrs)) {
                const valueStr = String(value).toLowerCase();
                if (valueStr.includes(actorNameLower)) {
                    const relId = `${actor.name}-${useCase.name}`;
                    // Avoid duplicates
                    if (!relationships.some(r => r.id === relId)) {
                        relationships.push({
                            id: relId,
                            type: 'performs',
                            source: actor.name,
                            target: useCase.name
                        });
                    }
                    break;
                }
            }
        });
    });

    return relationships;
}

function buildUseCaseViewModel(dataset: VisualizationDataset): UseCaseRendererViewModel | undefined {
    const { actors, useCases } = collectUseCaseElements(dataset.elements ?? []);
    if (actors.length === 0 && useCases.length === 0) {
        return undefined;
    }

    const relationships = extractUseCaseRelationships(useCases, actors);

    return {
        actors,
        useCases,
        relationships
    };
}

registerRenderer({
    definition: useCaseDefinition,
    canRender: dataset => {
        const { actors, useCases } = collectUseCaseElements(dataset?.elements ?? []);
        return actors.length > 0 || useCases.length > 0;
    },
    buildViewModel: buildUseCaseViewModel
});
