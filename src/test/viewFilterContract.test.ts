/**
 * View Filter & Subview Contract Tests
 *
 * These tests validate the data contract between the LSP model output
 * and the visualization panel's view filtering, boolean expression
 * evaluation, subview tracking, and textual notation support.
 *
 * The functions tested here replicate the logic embedded in
 * visualizationPanel.ts's webview template. If the webview logic
 * changes, these tests must be updated to match.
 */
import * as assert from 'assert';

// ─── METACLASS_TO_TYPES lookup (subset matching webview) ──────────

const METACLASS_TO_TYPES: Record<string, string[]> = {
    PartUsage: ['part', 'part usage'],
    PartDefinition: ['part def', 'part definition'],
    PortUsage: ['port', 'port usage'],
    PortDefinition: ['port def', 'port definition'],
    AttributeUsage: ['attribute', 'attribute usage'],
    AttributeDefinition: ['attribute def', 'attribute definition'],
    ActionUsage: ['action', 'action usage'],
    ActionDefinition: ['action def', 'action definition'],
    StateUsage: ['state', 'state usage'],
    StateDefinition: ['state def', 'state definition'],
    ConnectionUsage: ['connection', 'connection usage'],
    InterfaceUsage: ['interface', 'interface usage'],
    ItemUsage: ['item', 'item usage'],
    ItemDefinition: ['item def', 'item definition'],
    RequirementUsage: ['requirement', 'requirement usage'],
    RequirementDefinition: ['requirement def', 'requirement definition'],
    UseCaseUsage: ['use case', 'use case usage'],
    UseCaseDefinition: ['use case def', 'use case definition'],
    ViewUsage: ['view', 'view usage'],
    ViewDefinition: ['view def', 'view definition'],
    EnumerationDefinition: ['enum def', 'enumeration def', 'enumeration definition'],
    Package: ['package'],
};

// ─── Pure function replicas from webview template ──────────────────

function resolveMetaclassFilter(filterExpr: string): string[] | null {
    if (!filterExpr) return null;
    const cleaned = filterExpr.replace(/^@\s*/, '').trim();
    if (METACLASS_TO_TYPES[cleaned]) return METACLASS_TO_TYPES[cleaned];
    const lastPart = cleaned.split('::').pop();
    if (lastPart && METACLASS_TO_TYPES[lastPart]) return METACLASS_TO_TYPES[lastPart];
    return null;
}

function elementHasMetadata(el: any, metadataName: string): boolean {
    const attrs = el.attributes || el.properties || {};
    const annotations = String(attrs.metadataAnnotations || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    return annotations.some((a: string) => a.toLowerCase() === metadataName.toLowerCase());
}

function elementMatchesSingleFilter(el: any, token: string): boolean {
    const cleaned = token.replace(/^@/, '').trim();
    const metaclassTypes = resolveMetaclassFilter(token);
    if (metaclassTypes) {
        const typeLower = (el.type || '').toLowerCase();
        return metaclassTypes.includes(typeLower);
    }
    return elementHasMetadata(el, cleaned);
}

function splitOnOperator(str: string, op: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let last = 0;
    for (let i = 0; i <= str.length - op.length; i++) {
        if (str[i] === '(') depth++;
        else if (str[i] === ')') depth--;
        else if (depth === 0 && str.substring(i, i + op.length) === op) {
            parts.push(str.substring(last, i).trim());
            last = i + op.length;
            i += op.length - 1;
        }
    }
    parts.push(str.substring(last).trim());
    return parts.filter(Boolean);
}

function evaluateFilterExpression(el: any, expr: string): boolean {
    if (!expr) return true;
    const trimmed = expr.trim();

    if (trimmed.startsWith('not ')) {
        return !evaluateFilterExpression(el, trimmed.slice(4));
    }

    const orParts = splitOnOperator(trimmed, ' or ');
    if (orParts.length > 1) {
        return orParts.some(part => evaluateFilterExpression(el, part));
    }

    const andParts = splitOnOperator(trimmed, ' and ');
    if (andParts.length > 1) {
        return andParts.every(part => evaluateFilterExpression(el, part));
    }

    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        return evaluateFilterExpression(el, trimmed.slice(1, -1));
    }

    return elementMatchesSingleFilter(el, trimmed);
}

function filterElementsByMetaclass(elements: any[], filterExprs: string[]): any[] {
    if (!filterExprs || filterExprs.length === 0) return elements;

    const combinedExpr = filterExprs.join(' and ');

    const allSimple = filterExprs.length === 1 && /^@[\w:]+$/.test(filterExprs[0].trim());
    if (allSimple) {
        const allowedTypes = new Set<string>();
        const types = resolveMetaclassFilter(filterExprs[0]);
        if (types) types.forEach(t => allowedTypes.add(t));
        if (allowedTypes.size > 0) {
            const matched: any[] = [];
            function collectSimple(list: any[]) {
                (list || []).forEach(el => {
                    const typeLower = (el.type || '').toLowerCase();
                    if (allowedTypes.has(typeLower)) matched.push(el);
                    if (el.children && el.children.length > 0) collectSimple(el.children);
                });
            }
            collectSimple(elements);
            return matched;
        }
    }

    const matched: any[] = [];
    function collect(list: any[]) {
        (list || []).forEach(el => {
            if (evaluateFilterExpression(el, combinedExpr)) {
                matched.push(el);
            }
            if (el.children && el.children.length > 0) {
                collect(el.children);
            }
        });
    }
    collect(elements);
    return matched;
}

function findViewsWithExpose(elements: any[]): any[] {
    const views: any[] = [];
    function search(list: any[], parentViewName: string | null) {
        (list || []).forEach(el => {
            const typeLower = (el.type || '').toLowerCase();
            const attrs = el.attributes || el.properties || {};
            if (typeLower === 'view' || typeLower === 'view def') {
                const isViewDef = typeLower === 'view def';
                const hasExpose = !!attrs.exposeTargets;
                const hasFilter = !!attrs.viewFilters;
                const hasRendering = !!attrs.viewRendering;

                if ((hasExpose || hasFilter) && !isViewDef) {
                    const targets = hasExpose
                        ? String(attrs.exposeTargets).split(',').map((t: string) => t.trim()).filter(Boolean)
                        : [];
                    const filters = hasFilter
                        ? String(attrs.viewFilters).split(',').map((t: string) => t.trim()).filter(Boolean)
                        : [];
                    const rendering = hasRendering ? String(attrs.viewRendering) : null;
                    const viewType = attrs.partType || null;

                    views.push({
                        name: el.name,
                        element: el,
                        exposeTargets: targets,
                        viewFilters: filters,
                        viewRendering: rendering,
                        viewType: viewType,
                        parentView: parentViewName || null
                    });

                    if (el.children && el.children.length > 0) {
                        search(el.children, el.name);
                    }
                    return;
                }
            }
            if (el.children && el.children.length > 0) {
                search(el.children, parentViewName);
            }
        });
    }
    search(elements, null);
    return views;
}

// ─── Test data factories ───────────────────────────────────────────

function makePart(name: string, opts: { type?: string; metadata?: string; children?: any[] } = {}) {
    return {
        type: opts.type || 'part',
        name,
        children: opts.children || [],
        attributes: opts.metadata ? { metadataAnnotations: opts.metadata } : {},
        relationships: [],
    };
}

function makeView(name: string, opts: { expose?: string; filter?: string; rendering?: string; partType?: string; children?: any[] } = {}) {
    const attrs: any = {};
    if (opts.expose) attrs.exposeTargets = opts.expose;
    if (opts.filter) attrs.viewFilters = opts.filter;
    if (opts.rendering) attrs.viewRendering = opts.rendering;
    if (opts.partType) attrs.partType = opts.partType;
    return {
        type: 'view',
        name,
        children: opts.children || [],
        attributes: attrs,
        relationships: [],
    };
}

// ─── Test suites ───────────────────────────────────────────────────

suite('View Filter Contract Test Suite', () => {

    // ── splitOnOperator ────────────────────────────────────────

    suite('splitOnOperator', () => {
        test('splits on simple operator', () => {
            const result = splitOnOperator('@PartUsage or @PortUsage', ' or ');
            assert.deepStrictEqual(result, ['@PartUsage', '@PortUsage']);
        });

        test('respects parentheses', () => {
            const result = splitOnOperator('(@A or @B) and @C', ' or ');
            // The " or " inside parens should NOT be split
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0], '(@A or @B) and @C');
        });

        test('handles multiple operators', () => {
            const result = splitOnOperator('@A or @B or @C', ' or ');
            assert.deepStrictEqual(result, ['@A', '@B', '@C']);
        });

        test('returns single element for no match', () => {
            const result = splitOnOperator('@PartUsage', ' or ');
            assert.deepStrictEqual(result, ['@PartUsage']);
        });
    });

    // ── evaluateFilterExpression ───────────────────────────────

    suite('evaluateFilterExpression', () => {
        const partEl = { type: 'part', name: 'sensor', attributes: {} };
        const portEl = { type: 'port', name: 'dataPort', attributes: {} };
        const safetyEl = { type: 'part', name: 'safePart', attributes: { metadataAnnotations: 'Safety' } };
        const taggedEl = { type: 'action', name: 'taggedAction', attributes: { metadataAnnotations: 'Safety,Security' } };

        test('matches single metaclass filter', () => {
            assert.strictEqual(evaluateFilterExpression(partEl, '@PartUsage'), true);
            assert.strictEqual(evaluateFilterExpression(portEl, '@PartUsage'), false);
            assert.strictEqual(evaluateFilterExpression(portEl, '@PortUsage'), true);
        });

        test('matches namespaced metaclass filter', () => {
            assert.strictEqual(evaluateFilterExpression(partEl, '@SysML::PartUsage'), true);
        });

        test('matches metadata annotation', () => {
            assert.strictEqual(evaluateFilterExpression(safetyEl, '@Safety'), true);
            assert.strictEqual(evaluateFilterExpression(partEl, '@Safety'), false);
        });

        test('evaluates OR expression', () => {
            assert.strictEqual(evaluateFilterExpression(partEl, '@PartUsage or @PortUsage'), true);
            assert.strictEqual(evaluateFilterExpression(portEl, '@PartUsage or @PortUsage'), true);
            const actionEl = { type: 'action', name: 'a', attributes: {} };
            assert.strictEqual(evaluateFilterExpression(actionEl, '@PartUsage or @PortUsage'), false);
        });

        test('evaluates AND expression', () => {
            assert.strictEqual(evaluateFilterExpression(safetyEl, '@PartUsage and @Safety'), true);
            assert.strictEqual(evaluateFilterExpression(partEl, '@PartUsage and @Safety'), false);
        });

        test('evaluates NOT expression', () => {
            assert.strictEqual(evaluateFilterExpression(portEl, 'not @PartUsage'), true);
            assert.strictEqual(evaluateFilterExpression(partEl, 'not @PartUsage'), false);
        });

        test('evaluates parenthesized expression', () => {
            assert.strictEqual(evaluateFilterExpression(partEl, '(@PartUsage)'), true);
            assert.strictEqual(evaluateFilterExpression(partEl, '(@PartUsage or @PortUsage)'), true);
        });

        test('evaluates complex nested expression', () => {
            // not (@PortUsage) and @PartUsage → should match part but not port
            assert.strictEqual(evaluateFilterExpression(partEl, 'not @PortUsage and @PartUsage'), true);
        });

        test('evaluates mixed OR/AND with correct precedence', () => {
            // "@PartUsage or @PortUsage and @Safety"
            // AND binds tighter: @PartUsage or (@PortUsage and @Safety)
            // partEl is @PartUsage → true via OR
            assert.strictEqual(evaluateFilterExpression(partEl, '@PartUsage or @PortUsage and @Safety'), true);
        });

        test('evaluates multiple metadata with AND', () => {
            assert.strictEqual(evaluateFilterExpression(taggedEl, '@Safety and @Security'), true);
            assert.strictEqual(evaluateFilterExpression(safetyEl, '@Safety and @Security'), false);
        });

        test('returns true for empty expression', () => {
            assert.strictEqual(evaluateFilterExpression(partEl, ''), true);
        });
    });

    // ── resolveMetaclassFilter ────────────────────────────────

    suite('resolveMetaclassFilter', () => {
        test('resolves bare metaclass name', () => {
            const result = resolveMetaclassFilter('@PartUsage');
            assert.ok(result);
            assert.ok(result.includes('part'));
        });

        test('resolves namespaced metaclass', () => {
            const result = resolveMetaclassFilter('@SysML::PartUsage');
            assert.ok(result);
            assert.ok(result.includes('part'));
        });

        test('returns null for unknown metaclass', () => {
            const result = resolveMetaclassFilter('@UnknownType');
            assert.strictEqual(result, null);
        });

        test('strips leading @ and whitespace', () => {
            const result = resolveMetaclassFilter('@ PartUsage');
            assert.ok(result);
            assert.ok(result.includes('part'));
        });
    });

    // ── elementHasMetadata ────────────────────────────────────

    suite('elementHasMetadata', () => {
        test('detects metadata annotation', () => {
            const el = { attributes: { metadataAnnotations: 'Safety' } };
            assert.strictEqual(elementHasMetadata(el, 'Safety'), true);
        });

        test('is case-insensitive', () => {
            const el = { attributes: { metadataAnnotations: 'Safety' } };
            assert.strictEqual(elementHasMetadata(el, 'safety'), true);
        });

        test('handles comma-separated annotations', () => {
            const el = { attributes: { metadataAnnotations: 'Safety,Security' } };
            assert.strictEqual(elementHasMetadata(el, 'Security'), true);
        });

        test('returns false for missing annotation', () => {
            const el = { attributes: { metadataAnnotations: 'Safety' } };
            assert.strictEqual(elementHasMetadata(el, 'Performance'), false);
        });

        test('handles missing attributes', () => {
            const el = {};
            assert.strictEqual(elementHasMetadata(el, 'Safety'), false);
        });
    });

    // ── filterElementsByMetaclass ─────────────────────────────

    suite('filterElementsByMetaclass', () => {
        const elements = [
            makePart('sensor', { type: 'part' }),
            makePart('dataPort', { type: 'port' }),
            makePart('readAction', { type: 'action' }),
            {
                type: 'package', name: 'pkg', children: [
                    makePart('innerPart', { type: 'part' }),
                ], attributes: {}, relationships: [],
            },
        ];

        test('returns all elements for empty filter', () => {
            const result = filterElementsByMetaclass(elements, []);
            assert.strictEqual(result.length, elements.length);
        });

        test('filters by single metaclass (fast path)', () => {
            const result = filterElementsByMetaclass(elements, ['@PartUsage']);
            assert.strictEqual(result.length, 2); // sensor + innerPart (nested)
            assert.ok(result.every((el: any) => el.type === 'part'));
        });

        test('filters by boolean OR expression', () => {
            const result = filterElementsByMetaclass(elements, ['@PartUsage or @PortUsage']);
            assert.strictEqual(result.length, 3); // sensor + dataPort + innerPart
        });

        test('filters with metadata annotations', () => {
            const elsWithMeta = [
                makePart('safe', { metadata: 'Safety' }),
                makePart('unsafe'),
            ];
            const result = filterElementsByMetaclass(elsWithMeta, ['@Safety']);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'safe');
        });

        test('multiple filter expressions combine with AND', () => {
            const elsWithMeta = [
                makePart('safePart', { type: 'part', metadata: 'Safety' }),
                makePart('plainPart', { type: 'part' }),
                makePart('safePort', { type: 'port', metadata: 'Safety' }),
            ];
            const result = filterElementsByMetaclass(elsWithMeta, ['@PartUsage', '@Safety']);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'safePart');
        });
    });

    // ── findViewsWithExpose ───────────────────────────────────

    suite('findViewsWithExpose', () => {
        test('finds views with expose targets', () => {
            const elements = [
                makeView('v1', { expose: 'Vehicle' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views.length, 1);
            assert.strictEqual(views[0].name, 'v1');
            assert.deepStrictEqual(views[0].exposeTargets, ['Vehicle']);
        });

        test('finds views with filter directives', () => {
            const elements = [
                makeView('v2', { filter: '@PartUsage' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views.length, 1);
            assert.deepStrictEqual(views[0].viewFilters, ['@PartUsage']);
        });

        test('excludes view definitions', () => {
            const elements = [
                { type: 'view def', name: 'MyViewDef', children: [], attributes: { viewFilters: '@PartUsage' }, relationships: [] },
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views.length, 0);
        });

        test('excludes views with no expose or filter', () => {
            const elements = [
                { type: 'view', name: 'emptyView', children: [], attributes: {}, relationships: [] },
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views.length, 0);
        });

        test('extracts view rendering directive', () => {
            const elements = [
                makeView('v3', { expose: 'Vehicle', rendering: 'asTableForm' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views[0].viewRendering, 'asTableForm');
        });

        test('extracts view type from partType', () => {
            const elements = [
                makeView('v4', { expose: 'Vehicle', partType: 'InterconnectionView' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views[0].viewType, 'InterconnectionView');
        });
    });

    // ── Subview / parentView tracking ─────────────────────────

    suite('Subview parentView tracking', () => {
        test('top-level views have null parentView', () => {
            const elements = [
                makeView('topView', { expose: 'Vehicle' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views[0].parentView, null);
        });

        test('nested views get parentView set to parent view name', () => {
            const subView = makeView('childView', { expose: 'Engine' });
            const parentView = makeView('parentView', {
                expose: 'Vehicle',
                children: [subView],
            });
            // Manually set children since makeView creates with opts.children
            const elements = [parentView];
            const views = findViewsWithExpose(elements);
            assert.strictEqual(views.length, 2);

            const parent = views.find((v: any) => v.name === 'parentView');
            const child = views.find((v: any) => v.name === 'childView');
            assert.ok(parent);
            assert.ok(child);
            assert.strictEqual((parent as any).parentView, null);
            assert.strictEqual((child as any).parentView, 'parentView');
        });

        test('deeply nested views propagate parent correctly', () => {
            const grandchild = makeView('grandchild', { filter: '@PartUsage' });
            const child = makeView('child', { expose: 'Engine', children: [grandchild] });
            const root = makeView('root', { expose: 'Vehicle', children: [child] });

            const views = findViewsWithExpose([root]);
            assert.strictEqual(views.length, 3);

            const gc = views.find((v: any) => v.name === 'grandchild');
            assert.ok(gc);
            assert.strictEqual((gc as any).parentView, 'child');
        });
    });

    // ── VIEW_RENDERING_TO_DIAGRAM mapping ────────────────────

    suite('View rendering mapping', () => {
        const VIEW_RENDERING_TO_DIAGRAM: Record<string, string> = {
            asTreeDiagram: 'tree',
            asTableForm: 'table',
            asInterconnectionDiagram: 'ibd',
            asTextualNotation: 'textual',
            asBrowserView: 'browser',
        };

        test('asTextualNotation maps to textual view', () => {
            assert.strictEqual(VIEW_RENDERING_TO_DIAGRAM['asTextualNotation'], 'textual');
        });

        test('asTreeDiagram maps to tree view', () => {
            assert.strictEqual(VIEW_RENDERING_TO_DIAGRAM['asTreeDiagram'], 'tree');
        });

        test('asTableForm maps to table view', () => {
            assert.strictEqual(VIEW_RENDERING_TO_DIAGRAM['asTableForm'], 'table');
        });

        test('asInterconnectionDiagram maps to ibd view', () => {
            assert.strictEqual(VIEW_RENDERING_TO_DIAGRAM['asInterconnectionDiagram'], 'ibd');
        });

        test('asBrowserView maps to browser view', () => {
            assert.strictEqual(VIEW_RENDERING_TO_DIAGRAM['asBrowserView'], 'browser');
        });
    });

    // ── Multiple comma-separated expose targets ───────────────

    suite('Multiple expose targets', () => {
        test('parses comma-separated expose targets', () => {
            const elements = [
                makeView('multi', { expose: 'Vehicle,Engine,Wheel' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.deepStrictEqual(views[0].exposeTargets, ['Vehicle', 'Engine', 'Wheel']);
        });

        test('parses comma-separated filters', () => {
            const elements = [
                makeView('multi', { filter: '@PartUsage,@PortUsage' }),
            ];
            const views = findViewsWithExpose(elements);
            assert.deepStrictEqual(views[0].viewFilters, ['@PartUsage', '@PortUsage']);
        });
    });
});
