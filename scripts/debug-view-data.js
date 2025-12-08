#!/usr/bin/env node
/**
 * Debug script to trace data flow through visualization pipeline
 * Tests the actual parsing -> transformation -> view data flow
 */

const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

const log = (color, ...args) => console.log(color, ...args, colors.reset);
const header = (text) => log(colors.bold + colors.cyan, `\n${'═'.repeat(60)}\n${text}\n${'═'.repeat(60)}`);
const subheader = (text) => log(colors.yellow, `\n── ${text} ──`);

// Simple regex-based parser (mimics ANTLR output structure)
function parseFile(content) {
    const elements = [];

    const patterns = {
        'package': /package\s+(\w+)/gi,
        'part def': /part\s+def\s+(\w+)/gi,
        'part': /part\s+(\w+)/gi,
        'action def': /action\s+def\s+(\w+)/gi,
        'action': /action\s+(\w+)/gi,
        'state def': /state\s+def\s+(\w+)/gi,
        'state': /state\s+(\w+)/gi,
        'actor': /actor\s+(\w+)/gi,
        'use case': /use\s+case\s+(\w+)/gi,
        'attribute': /attribute\s+(\w+)/gi,
        'connection': /connection\s+(\w+)/gi,
        'port': /port\s+(\w+)/gi,
        'item': /item\s+(\w+)/gi
    };

    // Track seen names to avoid duplicates (like "part def X" and "part X")
    const seenNames = new Set();

    for (const [type, pattern] of Object.entries(patterns)) {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(content)) !== null) {
            const name = match[1];
            const key = `${type}:${name}`;
            if (!seenNames.has(key)) {
                seenNames.add(key);
                elements.push({
                    name,
                    type,
                    attributes: {},
                    children: [],
                    relationships: []
                });
            }
        }
    }

    // Remove 'part' entries if there's also a 'part def' for same name
    const partDefs = new Set(elements.filter(e => e.type === 'part def').map(e => e.name));
    return elements.filter(e => !(e.type === 'part' && partDefs.has(e.name)));
}

// Mimic prepareDataForView from visualizationPanel.ts
function prepareDataForView(parsedData) {
    const allElements = parsedData;

    return {
        packages: allElements.filter(el => el.type && el.type.toLowerCase() === 'package'),
        parts: allElements.filter(el => el.type && (
            el.type.includes('part') ||
            el.type.includes('Part') ||
            el.type.toLowerCase() === 'part def' ||
            el.type.toLowerCase() === 'part'
        )),
        actions: allElements.filter(el => el.type && (
            el.type.toLowerCase().includes('action') ||
            el.type.toLowerCase() === 'action def'
        )),
        states: allElements.filter(el => el.type && (
            el.type.toLowerCase().includes('state') ||
            el.type.toLowerCase() === 'state def'
        )),
        actors: allElements.filter(el => el.type && (
            el.type.toLowerCase() === 'actor' ||
            el.type.toLowerCase().includes('actor')
        )),
        useCases: allElements.filter(el => el.type && (
            el.type.toLowerCase().includes('use case') ||
            el.type.toLowerCase() === 'use case def'
        )),
        connections: allElements.filter(el => el.type && (
            el.type.toLowerCase().includes('connection') ||
            el.type.toLowerCase() === 'connector'
        )),
        elements: allElements,
        diagrams: parsedData.diagrams || allElements.filter(el =>
            el.type?.toLowerCase().includes('diagram')
        )
    };
}

// Test a single file
function testFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    subheader(`Testing: ${fileName}`);

    // Parse
    const elements = parseFile(content);
    log(colors.blue, `  Parsed ${elements.length} elements`);

    // Transform
    const viewData = prepareDataForView(elements);

    // Report each view's data
    const viewResults = {
        'General (elk)': { data: viewData.elements, minRequired: 1 },
        'Package': { data: viewData.packages, minRequired: 1 },
        'IBD': { data: viewData.parts, minRequired: 1 },
        'Activity': { data: viewData.actions, minRequired: 1 },
        'State': { data: viewData.states, minRequired: 1 },
        'Use Case': { data: viewData.actors.concat(viewData.useCases), minRequired: 1 }
    };

    let issues = [];

    for (const [viewName, config] of Object.entries(viewResults)) {
        const count = config.data.length;
        const status = count >= config.minRequired ? '✓' : '⚠';
        const color = count >= config.minRequired ? colors.green : colors.yellow;
        log(color, `    ${status} ${viewName}: ${count} elements`);

        if (count === 0 && viewName !== 'State' && viewName !== 'Use Case' && viewName !== 'Activity') {
            issues.push(`${viewName} view will show "no data"`);
        }
    }

    // Show element type breakdown
    log(colors.cyan, `\n  Element types:`);
    const typeCounts = {};
    elements.forEach(el => {
        typeCounts[el.type] = (typeCounts[el.type] || 0) + 1;
    });
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
        log(colors.magenta, `    - ${type}: ${count}`);
    });

    if (issues.length > 0) {
        log(colors.red, `\n  ⚠ Potential issues:`);
        issues.forEach(issue => log(colors.red, `    - ${issue}`));
    }

    return { fileName, elements, viewData, issues };
}

// Main
header('SysML View Data Debug Trace');

const samplesDir = path.join(__dirname, '..', 'samples');
const testFiles = [
    'batmobile.sysml',
    'smart-home.sysml',
    'toaster-system.sysml'
];

const results = [];

testFiles.forEach(file => {
    const filePath = path.join(samplesDir, file);
    if (fs.existsSync(filePath)) {
        results.push(testFile(filePath));
    } else {
        log(colors.red, `File not found: ${file}`);
    }
});

// Summary
header('Summary');

results.forEach(r => {
    const status = r.issues.length === 0 ? '✓' : '⚠';
    const color = r.issues.length === 0 ? colors.green : colors.yellow;
    log(color, `${status} ${r.fileName}: ${r.elements.length} elements, ${r.issues.length} potential issues`);
});

console.log('\n' + colors.cyan + 'Next steps:' + colors.reset);
console.log('  1. Run the extension (F5)');
console.log('  2. Open batmobile.sysml');
console.log('  3. Click "Visualize" button');
console.log('  4. Open browser DevTools (F12) and check Console for logs');
console.log('  5. Look for "Processing X elements for ELK layout" message');
console.log('  6. If elements = 0, check parser output');
console.log('  7. If elements > 0 but "no data", check view renderer logic');
console.log('');
