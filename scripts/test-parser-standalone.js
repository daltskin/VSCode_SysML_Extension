#!/usr/bin/env node
/**
 * Standalone SysML Parser for Testing
 * Parses SysML files without VS Code dependencies
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Simple SysML parser for extracting elements
 */
function parseSysML(content, fileName = '') {
    const elements = [];
    const relationships = [];
    const lines = content.split('\n');

    // Track nesting
    const elementStack = [];
    let currentElement = null;
    let braceDepth = 0;

    // Regex patterns for different element types
    const patterns = {
        package: /^\s*package\s+(\w+)\s*\{?/,
        partDef: /^\s*part\s+def\s+(\w+)(?:\s*:>?\s*(\w+(?:,\s*\w+)*))?\s*\{?/,
        part: /^\s*part\s+(\w+)\s*(?::\s*(\w+(?:\s*\[\s*[\d*]+\s*\])?))?/,
        attributeDef: /^\s*attribute\s+def\s+(\w+)/,
        attribute: /^\s*attribute\s+(\w+)\s*(?::\s*(\w+))?/,
        portDef: /^\s*port\s+def\s+(\w+)/,
        port: /^\s*port\s+(\w+)\s*(?::\s*~?(\w+))?/,
        interfaceDef: /^\s*interface\s+def\s+(\w+)/,
        interface: /^\s*interface\s+(\w+)\s*:/,
        actionDef: /^\s*action\s+def\s+(\w+)/,
        action: /^\s*(?:perform\s+)?action\s+(\w+)/,
        stateDef: /^\s*state\s+def\s+(\w+)/,
        state: /^\s*state\s+(\w+)\s*\{?/,
        transition: /^\s*transition\s+(\w+)\s+to\s+(\w+)(?:\s+when\s+(\w+))?/,
        actor: /^\s*actor\s+(?:def\s+)?(\w+)/,
        useCase: /^\s*use\s*case\s+(?:def\s+)?(\w+)/,
        itemDef: /^\s*item\s+def\s+(\w+)/,
        item: /^\s*(?:in\s+|out\s+)?item\s+(\w+)/,
        requirement: /^\s*requirement\s+(?:def\s+)?(\w+)/,
        constraint: /^\s*constraint\s+(\w+)/,
        connection: /^\s*(?:connect|interface)\s+(\w+)\s*:/,
        flow: /^\s*flow\s+(?:of\s+)?(\w+)/,
        behavior: /^\s*behavior\s+(\w+)/,
        doc: /^\s*doc\s*$/
    };

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const trimmed = line.trim();

        // Skip comments and empty lines
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed === '') {
            continue;
        }

        // Count braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;

        // Check each pattern
        for (const [type, pattern] of Object.entries(patterns)) {
            const match = trimmed.match(pattern);
            if (match) {
                const name = match[1];
                const superType = match[2] || null;

                const element = {
                    name: name,
                    type: type,
                    superType: superType,
                    line: lineNum + 1,
                    children: [],
                    attributes: new Map()
                };

                // Handle transitions specially
                if (type === 'transition') {
                    relationships.push({
                        type: 'transition',
                        source: match[1],
                        target: match[2],
                        guard: match[3] || null
                    });
                    continue;
                }

                // Add to parent or root
                if (currentElement && braceDepth > 0) {
                    currentElement.children.push(element);
                    element.parent = currentElement.name;
                } else {
                    elements.push(element);
                }

                // If this element opens a block, track it
                if (trimmed.includes('{')) {
                    elementStack.push(currentElement);
                    currentElement = element;
                }

                break; // Only match first pattern
            }
        }

        // Update brace depth
        braceDepth += openBraces - closeBraces;

        // Pop element stack on close braces
        let closeCount = closeBraces;
        while (closeCount > 0 && elementStack.length > 0) {
            currentElement = elementStack.pop();
            closeCount--;
        }

        if (braceDepth <= 0) {
            currentElement = null;
            elementStack.length = 0;
        }
    }

    return { elements, relationships, fileName };
}

/**
 * Recursively collect all elements
 */
function collectAllElements(elements, depth = 0, collected = []) {
    elements.forEach(el => {
        collected.push({ ...el, depth });
        if (el.children && el.children.length > 0) {
            collectAllElements(el.children, depth + 1, collected);
        }
    });
    return collected;
}

/**
 * Simulate prepareDataForView transformations
 */
function simulateViewTransformations(parsedData) {
    const { elements, relationships } = parsedData;
    const allElements = collectAllElements(elements);

    const viewData = {
        ibd: {
            parts: allElements.filter(el => el.type && (
                el.type.includes('part') || el.type === 'partDef'
            )),
            ports: allElements.filter(el => el.type && el.type.includes('port')),
            connectors: relationships.filter(r => r.type === 'connection' || r.type === 'flow')
        },
        activity: {
            actions: allElements.filter(el => el.type && el.type.includes('action')),
            flows: relationships.filter(r => r.type === 'succession')
        },
        state: {
            states: allElements.filter(el => el.type && el.type.includes('state')),
            transitions: relationships.filter(r => r.type === 'transition')
        },
        usecase: {
            actors: allElements.filter(el => el.type === 'actor'),
            useCases: allElements.filter(el => el.type === 'useCase')
        },
        package: {
            packages: allElements.filter(el => el.type === 'package')
        }
    };

    return viewData;
}

/**
 * Parse and analyze a file
 */
function analyzeFile(filePath) {
    console.log(`\n${colors.cyan}━━━ Analyzing: ${path.basename(filePath)} ━━━${colors.reset}`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseSysML(content, path.basename(filePath));
    const allElements = collectAllElements(parsed.elements);
    const viewData = simulateViewTransformations(parsed);

    console.log(`${colors.green}✓ Parsed ${parsed.elements.length} top-level elements${colors.reset}`);
    console.log(`${colors.blue}Total elements (including nested): ${allElements.length}${colors.reset}`);
    console.log(`${colors.blue}Relationships found: ${parsed.relationships.length}${colors.reset}`);

    // Group by type
    const byType = {};
    allElements.forEach(el => {
        const type = el.type || 'unknown';
        if (!byType[type]) byType[type] = [];
        byType[type].push(el.name);
    });

    console.log(`\n${colors.yellow}Elements by type:${colors.reset}`);
    Object.entries(byType).sort((a, b) => b[1].length - a[1].length).forEach(([type, names]) => {
        console.log(`  ${colors.cyan}${type}${colors.reset} (${names.length}): ${names.slice(0, 5).join(', ')}${names.length > 5 ? '...' : ''}`);
    });

    // Show view simulation results
    console.log(`\n${colors.yellow}View Data Simulation:${colors.reset}`);

    // IBD View
    const ibdStatus = viewData.ibd.parts.length > 0 ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${ibdStatus} IBD View:${colors.reset} ${viewData.ibd.parts.length} parts, ${viewData.ibd.ports.length} ports, ${viewData.ibd.connectors.length} connectors`);

    // Activity View
    const actStatus = viewData.activity.actions.length > 0 ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${actStatus} Activity View:${colors.reset} ${viewData.activity.actions.length} actions`);

    // State View
    const stateStatus = viewData.state.states.length > 0 ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${stateStatus} State View:${colors.reset} ${viewData.state.states.length} states, ${viewData.state.transitions.length} transitions`);
    if (viewData.state.states.length > 0) {
        console.log(`      States: ${viewData.state.states.map(s => s.name).slice(0, 10).join(', ')}`);
    }
    if (viewData.state.transitions.length > 0) {
        console.log(`      Transitions: ${viewData.state.transitions.slice(0, 5).map(t => `${t.source}→${t.target}`).join(', ')}`);
    }

    // UseCase View
    const ucStatus = (viewData.usecase.actors.length > 0 || viewData.usecase.useCases.length > 0) ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${ucStatus} UseCase View:${colors.reset} ${viewData.usecase.actors.length} actors, ${viewData.usecase.useCases.length} use cases`);

    // Package View
    const pkgStatus = viewData.package.packages.length > 0 ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${pkgStatus} Package View:${colors.reset} ${viewData.package.packages.length} packages`);

    return { parsed, allElements, viewData };
}

/**
 * Main function
 */
function main() {
    console.log(`${colors.bold}${colors.blue}╔══════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}║    Standalone SysML Parser & View Tester     ║${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}╚══════════════════════════════════════════════╝${colors.reset}`);

    const samplesDir = path.join(__dirname, '..', 'samples');

    // Key test files
    const testFiles = [
        'smart-home.sysml',
        'batmobile.sysml',
        'toaster-system.sysml',
        'Camera Example/camera-states.sysml',
        'Camera Example/camera-usecases.sysml',
        'Camera Example/camera-activity.sysml'
    ];

    const results = [];

    for (const file of testFiles) {
        const filePath = path.join(samplesDir, file);
        if (fs.existsSync(filePath)) {
            const result = analyzeFile(filePath);
            results.push({ file, ...result });
        } else {
            console.log(`${colors.yellow}File not found: ${file}${colors.reset}`);
        }
    }

    // Summary
    console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}                    SUMMARY${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);

    const viewIssues = {
        ibd: [],
        activity: [],
        state: [],
        usecase: [],
        package: []
    };

    results.forEach(r => {
        if (r.viewData.ibd.parts.length === 0) viewIssues.ibd.push(r.file);
        if (r.viewData.activity.actions.length === 0) viewIssues.activity.push(r.file);
        if (r.viewData.state.states.length === 0) viewIssues.state.push(r.file);
        if (r.viewData.usecase.actors.length === 0 && r.viewData.usecase.useCases.length === 0) viewIssues.usecase.push(r.file);
        if (r.viewData.package.packages.length === 0) viewIssues.package.push(r.file);
    });

    console.log(`\n${colors.yellow}Files with empty views:${colors.reset}`);
    Object.entries(viewIssues).forEach(([view, files]) => {
        if (files.length > 0) {
            console.log(`  ${colors.red}${view}:${colors.reset} ${files.join(', ')}`);
        }
    });
}

main();
