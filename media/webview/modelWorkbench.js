(() => {
    'use strict';
    const vscode = acquireVsCodeApi();
    for (const icon of document.querySelectorAll('.codicon')) icon.setAttribute('aria-hidden', 'true');
    const byId = id => document.getElementById(id);
    const saved = vscode.getState() || {};
    let snapshot = { rows: [], links: [], documents: [], revision: 0 };
    let deferredSnapshot;
    let tab = saved.tab || 'requirements';
    let page = 0;
    let columnPage = 0;
    let previewToken;
    let formOperation;
    let busy = false;
    let stale = false;
    const changes = new Map();
    const pageSize = 75;
    const columnSize = 25;
    const element = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    const iconButton = (icon, label, action) => {
        const button = element('button');
        button.type = 'button';
        button.title = label;
        button.setAttribute('aria-label', label);
        const glyph = element('span', undefined, `codicon codicon-${icon}`);
        glyph.setAttribute('aria-hidden', 'true');
        button.append(glyph);
        button.addEventListener('click', action);
        return button;
    };
    const options = (select, items, selected) => {
        select.replaceChildren();
        for (const [value, label] of items) {
            const option = element('option', label);
            option.value = value;
            select.append(option);
        }
        if (items.some(item => item[0] === selected)) select.value = selected;
    };
    const send = (command, fields = {}) => vscode.postMessage({ command, ...fields });
    const notice = (message, error = false) => {
        byId('notice').textContent = message;
        byId('notice').classList.toggle('error', error);
    };
    const rowById = id => snapshot.rows.find(row => row.id === id);
    const fileScope = () => byId('file-scope').value;
    const packageScope = () => rowById(byId('package-scope').value);
    const kind = () => byId('link-kind').value;
    const isRequirement = row => row.type.includes('requirement');
    const requirementUsage = row => isRequirement(row) && !row.type.includes('def');
    const inScope = row => {
        const parent = packageScope();
        return (!fileScope() || row.uri === fileScope())
            && (!parent || row.id === parent.id
                || (row.uri === parent.uri && row.start >= parent.start && row.end <= parent.end));
    };
    const matches = row => `${row.qualifiedName} ${row.type} ${row.fields?.identifier || ''} ${row.documentation}`
        .toLowerCase().includes(byId('search').value.toLowerCase());
    const filteredRows = () => snapshot.rows.filter(row => inScope(row) && matches(row)
        && (tab !== 'requirements' || isRequirement(row)));
    const matchingLinks = () => snapshot.links.filter(link => {
        const source = rowById(link.sourceId);
        const target = rowById(link.targetId);
        return link.kind === kind() && (!fileScope() || link.uri === fileScope()
            || target?.uri === fileScope()) && (!packageScope()
            || (source && inScope(source)) || (target && inScope(target)))
            && `${link.source} ${link.target}`.toLowerCase().includes(byId('search').value.toLowerCase());
    });
    const matrixData = () => {
        const sources = snapshot.rows.filter(row => kind() === 'verify'
            ? row.type.includes('verification') : kind() === 'satisfy'
                ? row.type.includes('part') && !row.type.includes('def')
                : row.type !== 'package');
        let targets = snapshot.rows.filter(row => inScope(row) && matches(row)
            && (kind() === 'dependency' ? row.type !== 'package' : requirementUsage(row)));
        if (byId('uncovered').checked) targets = targets.filter(row =>
            !snapshot.links.some(link => link.kind === kind() && link.targetId === row.id && link.sourceId));
        return { sources, targets };
    };
    const updatePending = () => {
        byId('save').disabled = !changes.size || busy || stale;
        byId('discard').disabled = !changes.size && !stale;
        byId('save').lastChild.textContent = changes.size ? ` Review ${changes.size} row(s)` : 'Review changes';
    };
    const markChanged = (row, field, input) => {
        const update = changes.get(row.id) || {};
        if (input.value === row.fields[field]) delete update[field];
        else update[field] = input.value;
        if (Object.keys(update).length) changes.set(row.id, update);
        else changes.delete(row.id);
        input.classList.toggle('dirty', update[field] !== undefined);
        updatePending();
    };
    const editableCell = (row, field, label) => {
        const cell = element('td');
        const disabled = !row.fields || ((field === 'typeName' || field === 'multiplicity')
            && (row.type.includes('def') || row.type === 'package'));
        if (disabled) {
            cell.textContent = field === 'documentation' ? row.documentation : row.fields?.[field] || '';
            cell.title = 'Edit advanced declarations in source';
            return cell;
        }
        const input = element(field === 'documentation' ? 'textarea' : 'input');
        if (input.tagName === 'TEXTAREA') input.rows = 2;
        input.value = changes.get(row.id)?.[field] ?? row.fields[field];
        input.setAttribute('aria-label', `${row.qualifiedName}: ${label}`);
        input.title = `${row.qualifiedName}: ${label}`;
        input.spellcheck = field === 'documentation';
        input.classList.toggle('dirty', changes.get(row.id)?.[field] !== undefined);
        input.addEventListener('input', () => markChanged(row, field, input));
        input.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                input.value = row.fields[field];
                markChanged(row, field, input);
                input.blur();
            } else if (event.key === 'Enter' && input.tagName !== 'TEXTAREA') input.blur();
        });
        cell.append(input);
        return cell;
    };
    const sourceCell = row => {
        const cell = element('td', undefined, 'name-cell');
        const button = element('button', row.name, 'source-link');
        button.title = `Open ${row.qualifiedName} in source`;
        button.addEventListener('click', () => send('navigate', { id: row.id }));
        cell.append(button, element('small', row.qualifiedName));
        return cell;
    };
    const tableShell = headers => {
        const table = element('table');
        const caption = element('caption', `${tab} model view`, 'sr-only');
        table.append(caption);
        const head = element('thead');
        const heading = element('tr');
        for (const title of headers) {
            const cell = element('th', title);
            cell.scope = 'col';
            heading.append(cell);
        }
        head.append(heading);
        const body = element('tbody');
        table.append(head, body);
        byId('content').append(table);
        return { table, body, heading };
    };
    const paginate = rows => {
        page = Math.min(page, Math.max(0, Math.ceil(rows.length / pageSize) - 1));
        byId('row-count').textContent = `${rows.length} ${tab === 'relationships' ? 'relationships' : 'rows'}`;
        byId('page-number').textContent = `${page + 1} / ${Math.max(1, Math.ceil(rows.length / pageSize))}`;
        byId('previous').disabled = page === 0;
        byId('next').disabled = (page + 1) * pageSize >= rows.length;
        return rows.slice(page * pageSize, (page + 1) * pageSize);
    };
    const emptyState = message => {
        byId('content').append(element('p', message, 'empty-state'));
    };
    function renderElements() {
        const rows = paginate(filteredRows());
        if (!rows.length) { emptyState('No matching elements.'); return; }
        const requirements = tab === 'requirements';
        const { body } = tableShell(requirements
            ? ['Name', 'Identifier', 'Kind', 'Typed by', 'Requirement text', 'Satisfy', 'Verify', 'Actions']
            : ['Name', 'Identifier', 'Kind', 'Typed by', 'Multiplicity', 'Documentation', 'Actions']);
        for (const row of rows) {
            const line = element('tr');
            line.append(sourceCell(row), editableCell(row, 'identifier', 'Identifier'),
                element('td', row.type), editableCell(row, 'typeName', 'Typed by'));
            if (!requirements) line.append(editableCell(row, 'multiplicity', 'Multiplicity'));
            line.append(editableCell(row, 'documentation', requirements ? 'Requirement text' : 'Documentation'));
            if (requirements) {
                for (const linkKind of ['satisfy', 'verify']) {
                    const count = snapshot.links.filter(link => link.kind === linkKind
                        && link.targetId === row.id && link.sourceId).length;
                    line.append(element('td', String(count), count ? 'covered count' : 'gap count'));
                }
            }
            const actions = element('td');
            actions.append(iconButton('trash', `Delete ${row.qualifiedName}`, () =>
                preview({ kind: 'deleteElement', id: row.id })));
            line.append(actions);
            body.append(line);
        }
    }
    function preview(operation) {
        if (busy || stale) { notice('Refresh the changed model before editing.', true); return; }
        if (changes.size && operation.kind !== 'cells') {
            notice('Review or discard pending table edits first.', true);
            return;
        }
        busy = true;
        updatePending();
        byId('dialog-error').textContent = '';
        byId('preview-error').textContent = '';
        const deleting = operation.kind === 'deleteElement' || operation.kind === 'deleteRelationship';
        byId('preview-title').textContent = operation.kind === 'deleteElement'
            ? `Delete ${rowById(operation.id)?.qualifiedName || 'element'}?`
            : deleting ? 'Delete relationship?' : 'Review changes';
        byId('delete-warning').hidden = operation.kind !== 'deleteElement';
        byId('apply').textContent = deleting ? 'Delete' : 'Apply changes';
        send('preview', { revision: snapshot.revision, operation });
    }
    function renderRelationships() {
        const links = paginate(matchingLinks());
        if (!links.length) { emptyState('No matching relationships.'); return; }
        const { body } = tableShell(['Kind', 'Source', 'Target', 'Source form', 'Actions']);
        for (const link of links) {
            const line = element('tr');
            line.append(element('td', link.kind), element('td', link.source || 'Unresolved'), element('td', link.target));
            const editable = link.start !== undefined && link.sourceId && link.targetId;
            line.append(element('td', editable ? 'Explicit' : 'Source-only'));
            const actions = element('td');
            const edit = iconButton('edit', `Edit ${link.kind} relationship`, () => openRelationship(link));
            const remove = iconButton('trash', `Delete ${link.kind} relationship`, () =>
                preview({ kind: 'deleteRelationship', linkId: link.id }));
            edit.disabled = !editable;
            remove.disabled = link.start === undefined;
            actions.append(edit, remove);
            line.append(actions);
            body.append(line);
        }
    }
    function renderMatrix() {
        const { sources, targets } = matrixData();
        columnPage = Math.min(columnPage, Math.max(0, Math.ceil(sources.length / columnSize) - 1));
        const columns = sources.slice(columnPage * columnSize, (columnPage + 1) * columnSize);
        const linked = targets.filter(target => snapshot.links.some(link => link.kind === kind()
            && link.targetId === target.id && link.sourceId)).length;
        const coverage = byId('coverage');
        coverage.replaceChildren(element('strong', `${linked} / ${targets.length} linked`),
            element('span', `${targets.length - linked} uncovered`, 'gap'));
        const previous = iconButton('chevron-left', 'Previous matrix columns', () => { columnPage--; render(); });
        const next = iconButton('chevron-right', 'Next matrix columns', () => { columnPage++; render(); });
        previous.disabled = columnPage === 0;
        next.disabled = (columnPage + 1) * columnSize >= sources.length;
        coverage.append(previous, element('span', `Columns ${sources.length ? columnPage * columnSize + 1 : 0}-${Math.min((columnPage + 1) * columnSize, sources.length)} of ${sources.length}`), next);
        const visible = paginate(targets);
        if (!visible.length || !columns.length) { emptyState('No matching traceability endpoints.'); return; }
        const { table, body } = tableShell(['Target / Source', ...columns.map(row => row.qualifiedName)]);
        table.classList.add('matrix');
        for (const target of visible) {
            const line = element('tr');
            line.append(sourceCell(target));
            for (const source of columns) {
                const links = snapshot.links.filter(link => link.kind === kind()
                    && link.sourceId === source.id && link.targetId === target.id);
                const link = links[0];
                const cell = element('td', undefined, links.length ? 'linked-cell' : 'empty-cell');
                const editable = !link || (link.start !== undefined && links.length === 1);
                const action = iconButton(link ? (editable ? 'check' : 'lock') : 'add',
                    `${link ? 'Remove' : 'Add'} ${kind()}: ${source.qualifiedName} to ${target.qualifiedName}`,
                    () => preview(link ? { kind: 'deleteRelationship', linkId: link.id }
                        : { kind: 'relationship', type: kind(), sourceId: source.id, targetId: target.id }));
                action.disabled = source.id === target.id || !editable;
                action.setAttribute('aria-pressed', String(Boolean(link)));
                cell.append(action);
                line.append(cell);
            }
            body.append(line);
        }
    }
    function render() {
        byId('content').replaceChildren();
        for (const button of document.querySelectorAll('[data-tab]')) {
            button.setAttribute('aria-selected', String(button.dataset.tab === tab));
            button.setAttribute('role', 'tab');
            button.tabIndex = button.dataset.tab === tab ? 0 : -1;
        }
        document.querySelector('nav').setAttribute('role', 'tablist');
        byId('link-kind').hidden = !['relationships', 'matrix'].includes(tab);
        byId('uncovered-label').hidden = tab !== 'matrix';
        byId('coverage').hidden = tab !== 'matrix';
        byId('create').hidden = tab === 'relationships' || tab === 'matrix';
        if (tab === 'relationships') renderRelationships();
        else if (tab === 'matrix') renderMatrix();
        else renderElements();
        updatePending();
        vscode.setState({ tab, search: byId('search').value, file: fileScope(), package: byId('package-scope').value });
    }
    function fillScope() {
        const file = byId('file-scope').value || saved.file;
        const selectedPackage = byId('package-scope').value || saved.package;
        options(byId('file-scope'), [['', 'All loaded files'], ...snapshot.documents.map(doc => [doc.uri, doc.label])], file);
        const packages = snapshot.rows.filter(row => row.type === 'package' && (!fileScope() || row.uri === fileScope()));
        const initial = snapshot.packageName ? packages.find(row => row.name === snapshot.packageName)?.id : undefined;
        options(byId('package-scope'), [['', 'All packages'], ...packages.map(row => [row.id, row.qualifiedName])], initial || selectedPackage);
    }
    function openForm(title, build) {
        if (changes.size || stale) { notice('Review or discard pending changes first.', true); return; }
        byId('dialog-title').textContent = title;
        byId('dialog-fields').replaceChildren();
        byId('dialog-error').textContent = '';
        build();
        byId('editor-dialog').showModal();
    }
    function field(label, id, type = 'text', choices) {
        const wrapper = element('label', label, 'form-field');
        const input = element(choices ? 'select' : type === 'textarea' ? 'textarea' : 'input');
        input.id = id;
        if (choices) options(input, choices);
        else if (type !== 'textarea') input.type = type;
        if (type === 'textarea') input.rows = 5;
        wrapper.append(input);
        byId('dialog-fields').append(wrapper);
        return input;
    }
    function destination() {
        const file = field('Destination file', 'destination-file', '', snapshot.documents.map(doc => [doc.uri, doc.label]));
        file.value = fileScope() || snapshot.documents[0]?.uri || '';
        const parent = field('Package', 'destination-package', '', []);
        const fill = () => options(parent, [['', 'File root'], ...snapshot.rows.filter(row => row.uri === file.value
            && row.type === 'package').map(row => [row.id, row.qualifiedName])], packageScope()?.id);
        file.addEventListener('change', fill);
        fill();
        return () => ({ uri: file.value, parentId: parent.value });
    }
    function openRequirement() {
        openForm('New requirement', () => {
            const target = destination();
            const definition = field('Declaration', 'requirement-kind', '', [['false', 'Usage'], ['true', 'Definition']]);
            const name = field('Name', 'requirement-name');
            name.required = true;
            name.pattern = '[A-Za-z_][A-Za-z0-9_]*';
            const identifier = field('Identifier', 'requirement-identifier');
            const typeName = field('Requirement type', 'requirement-type', '', [['', 'Untyped'],
                ...snapshot.rows.filter(row => isRequirement(row) && row.type.includes('def'))
                    .map(row => [row.qualifiedName, row.qualifiedName])]);
            definition.addEventListener('change', () => {
                typeName.disabled = definition.value === 'true';
                if (typeName.disabled) typeName.value = '';
            });
            const documentation = field('Requirement text', 'requirement-text', 'textarea');
            formOperation = () => ({ kind: 'requirements', ...target(), items: [{
                name: name.value.trim(), identifier: identifier.value.trim(), documentation: documentation.value,
                definition: definition.value === 'true', typeName: typeName.value,
            }] });
        });
    }
    function openRelationship(existing) {
        openForm(existing ? 'Edit relationship' : 'New relationship', () => {
            const relation = field('Kind', 'relationship-kind', '',
                [['satisfy', 'Satisfaction'], ['verify', 'Verification'], ['dependency', 'Dependency']]);
            relation.value = existing?.kind || kind();
            const source = field('Source', 'relationship-source', '', []);
            const target = field('Target', 'relationship-target', '', []);
            const fill = () => {
                const sources = snapshot.rows.filter(row => relation.value === 'verify'
                    ? row.type.includes('verification') : relation.value === 'satisfy'
                        ? row.type.includes('part') && !row.type.includes('def') : row.type !== 'package');
                const targets = snapshot.rows.filter(row => relation.value === 'dependency'
                    ? row.type !== 'package' : requirementUsage(row));
                options(source, sources.map(row => [row.id, row.qualifiedName]), existing?.sourceId);
                options(target, targets.map(row => [row.id, row.qualifiedName]), existing?.targetId);
            };
            fill();
            relation.addEventListener('change', fill);
            formOperation = () => ({ kind: 'relationship', linkId: existing?.id,
                type: relation.value, sourceId: source.value, targetId: target.value });
        });
    }
    function openPaste() {
        openForm('Bulk paste', () => {
            const target = destination();
            const mode = field('Operation', 'paste-mode', '', [['requirements', 'Create requirements'],
                ['relationships', 'Create relationships'], ['updates', 'Update existing elements']]);
            const text = field('CSV / TSV', 'paste-data', 'textarea');
            text.required = true;
            text.rows = 10;
            text.classList.add('code');
            const examples = {
                requirements: 'name\tidentifier\tdocumentation\ttypeName\tdefinition\nrange\tREQ-1\t100 km\t\tfalse',
                relationships: 'kind\tsource\ttarget\nsatisfy\tVehicle::car\tVehicle::range',
                updates: 'qualifiedName\tdocumentation\nVehicle::range\t200 km',
            };
            text.placeholder = examples[mode.value];
            mode.addEventListener('change', () => { text.placeholder = examples[mode.value]; });
            formOperation = () => ({ kind: 'paste', mode: mode.value, text: text.value, ...target() });
        });
    }
    function exportView() {
        let records;
        if (tab === 'relationships') {
            records = [['kind', 'source', 'target'], ...matchingLinks().map(link => [link.kind, link.source, link.target])];
        } else if (tab === 'matrix') {
            const { sources, targets } = matrixData();
            records = [['Target / Source', ...sources.map(row => row.qualifiedName)], ...targets.map(target =>
                [target.qualifiedName, ...sources.map(source => snapshot.links.some(link => link.kind === kind()
                    && link.sourceId === source.id && link.targetId === target.id) ? '1' : '')])];
        } else {
            records = [['qualifiedName', 'identifier', 'documentation', 'typeName', 'multiplicity'],
                ...filteredRows().map(row => [row.qualifiedName, row.fields?.identifier || '', row.documentation,
                    row.fields?.typeName || '', row.fields?.multiplicity || ''])];
        }
        send('export', { records });
    }
    function acceptSnapshot(message) {
        snapshot = message;
        stale = false;
        deferredSnapshot = undefined;
        byId('model-count').textContent = `${snapshot.documents.length} file${snapshot.documents.length === 1 ? '' : 's'}`;
        fillScope();
        const unresolved = snapshot.links.filter(link => !link.sourceId || !link.targetId).length;
        notice(unresolved ? `${unresolved} unresolved or source-only relationships` : 'Model current');
        render();
    }
    window.addEventListener('message', event => {
        const message = event.data;
        if (!message || typeof message !== 'object') return;
        switch (message.command) {
            case 'snapshot':
                busy = false;
                if (changes.size) {
                    deferredSnapshot = message;
                    stale = true;
                    notice('Source changed. Discard pending table edits to load the current model.', true);
                    updatePending();
                } else acceptSnapshot(message);
                break;
            case 'invalidated':
                stale = true;
                previewToken = undefined;
                byId('apply').disabled = true;
                notice('Source changed; updating model...');
                updatePending();
                break;
            case 'preview':
                busy = false;
                previewToken = message.token;
                byId('preview-changes').replaceChildren();
                for (const change of message.changes) {
                    const section = element('section', undefined, 'change');
                    section.append(element('h3', change.file));
                    if (change.before) section.append(element('pre', change.before, 'removed'));
                    if (change.after) section.append(element('pre', change.after, 'added'));
                    byId('preview-changes').append(section);
                }
                byId('apply').disabled = false;
                byId('preview-dialog').showModal();
                updatePending();
                break;
            case 'applied':
                busy = false;
                changes.clear();
                byId('preview-dialog').close();
                byId('editor-dialog').close();
                notice('Changes applied to source.');
                break;
            case 'error':
                busy = false;
                notice(message.message, true);
                byId('dialog-error').textContent = message.message;
                byId('preview-error').textContent = message.message;
                updatePending();
                break;
        }
    });
    byId('search').value = saved.search || '';
    byId('search').addEventListener('input', () => { page = 0; render(); });
    for (const control of ['file-scope', 'package-scope', 'link-kind', 'uncovered']) {
        byId(control).addEventListener('change', () => {
            page = 0; columnPage = 0;
            if (control === 'file-scope') {
                byId('package-scope').value = '';
                fillScope();
            }
            render();
        });
    }
    for (const button of document.querySelectorAll('[data-tab]')) button.addEventListener('click', () => {
        tab = button.dataset.tab; page = 0; columnPage = 0; render();
    });
    document.querySelector('nav').addEventListener('keydown', event => {
        const tabs = [...document.querySelectorAll('[data-tab]')];
        const current = tabs.indexOf(document.activeElement);
        if (current < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
            : (current + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
        tabs[next].click();
        tabs[next].focus();
    });
    byId('previous').addEventListener('click', () => { page--; render(); });
    byId('next').addEventListener('click', () => { page++; render(); });
    byId('refresh').addEventListener('click', () => send('refresh'));
    byId('add-files').addEventListener('click', () => send('addFiles'));
    byId('create').addEventListener('click', openRequirement);
    byId('add-link').addEventListener('click', () => openRelationship());
    byId('paste').addEventListener('click', openPaste);
    byId('export').addEventListener('click', exportView);
    byId('save').addEventListener('click', () => preview({ kind: 'cells',
        cells: [...changes].map(([id, fields]) => ({ id, fields })) }));
    byId('discard').addEventListener('click', () => {
        changes.clear();
        if (deferredSnapshot) acceptSnapshot(deferredSnapshot);
        else { render(); if (stale) send('refresh'); }
    });
    byId('editor-form').addEventListener('submit', event => {
        event.preventDefault(); if (formOperation) preview(formOperation());
    });
    for (const id of ['close-dialog', 'cancel-dialog']) byId(id).addEventListener('click', () => byId('editor-dialog').close());
    byId('back-preview').addEventListener('click', () => byId('preview-dialog').close());
    byId('apply').addEventListener('click', () => {
        if (!previewToken || busy) return;
        busy = true;
        byId('apply').disabled = true;
        send('apply', { token: previewToken });
    });
    send('ready');
})();
