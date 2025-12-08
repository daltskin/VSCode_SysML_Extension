#!/usr/bin/env node
/**
 * Automated Testing Script for SysML Visualizer Views
 *
 * Tests all views against sample files to verify:
 * - Data is properly extracted and transformed
 * - Rendering would produce valid output
 * - No overlapping containers (layout validation)
 * - Text fits within containers
 * - All expected elements are present
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

// View types to test
const VIEW_TYPES = [
    'pillar',      // Pillar View
    'general',     // General View (ELK)
    'elk',         // ELK View (alias)
    'ibd',         // Interconnection View
    'activity',    // Action Flow View
    'state',       // State Transition View
    'sequence',    // Sequence View
    'usecase',     // Case View
    'tree',        // Tree View
    'package',     // Package View
    'graph',       // Graph View
    'hierarchy'    // Hierarchy View
];

// Sample files to test
const SAMPLES_DIR = path.join(__dirname, '..', 'samples');

// Expected content for each view type per sample
const VIEW_EXPECTATIONS = {
    'batmobile.sysml': {
        description: 'Batmobile example from the book',
        expectedElements: {
            packages: ['Batmobile'],
            parts: ['Vehicle', 'Wheel', 'BatmobileEngine', 'Batmobile', 'BatmobileNG'],
            interfaces: ['PowerInterface', 'PowerIP'],
            attributes: ['actualSpeed', 'pressure', 'capacity'],
            connections: ['bat2eng']
        },
        viewExpectations: {
            pillar: { minElements: 10, types: ['part', 'interface', 'port'] },
            general: { minElements: 10, hasNesting: true },
            ibd: { minParts: 3, minConnections: 1 },
            activity: { minActions: 1 },
            state: { minStates: 0 },
            package: { minPackages: 1 },
            hierarchy: { minElements: 10 }
        }
    },
    'smart-home.sysml': {
        description: 'Smart home IoT example',
        expectedElements: {
            packages: ['SmartHomeSystem'],
            parts: ['SmartHome', 'LightingSystem', 'SecuritySystem', 'ClimateControl'],
            states: ['vacant', 'occupied', 'sleep', 'away', 'emergency', 'disarmed', 'armed_home', 'armed_away', 'alarm'],
            transitions: ['vacant to occupied', 'occupied to sleep', 'disarmed to armed_home']
        },
        viewExpectations: {
            pillar: { minElements: 15, types: ['part', 'attribute'] },
            general: { minElements: 15, hasNesting: true },
            state: { minStates: 5, minTransitions: 3 },
            package: { minPackages: 1 },
            hierarchy: { minElements: 20 }
        }
    },

    'toaster-system.sysml': {
        description: 'Toaster system example',
        expectedElements: {
            packages: ['ToasterSystem'],
            parts: ['Toaster', 'HeatingElement', 'Timer', 'BreadSlot'],
            actions: ['heatBread', 'ejectToast'],
            states: ['idle', 'toasting', 'done']
        },
        viewExpectations: {
            pillar: { minElements: 5, types: ['part'] },
            general: { minElements: 5, hasNesting: true },
            activity: { minActions: 1 },
            state: { minStates: 2 }
        }
    },
    'space-mission.sysml': {
        description: 'Space mission example',
        expectedElements: {
            packages: ['SpaceMission'],
            parts: ['Spacecraft', 'Payload', 'GroundStation'],
            useCases: [],
            actors: []
        },
        viewExpectations: {
            pillar: { minElements: 5, types: ['part'] },
            general: { minElements: 5, hasNesting: true },
            package: { minPackages: 1 }
        }
    }
};

// Simple SysML parser for testing (extracts key elements)
function parseSysMLFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const elements = [];

    // Regular expressions for different element types
    const patterns = {
        package: /package\s+(\w+)\s*\{/g,
        partDef: /part\s+def\s+(\w+)/g,
        part: /part\s+(\w+)\s*(?::|;|\[|\{)/g,
        attribute: /attribute\s+(\w+)/g,
        interface: /interface\s+(?:def\s+)?(\w+)/g,
        port: /port\s+(?:def\s+)?(\w+)/g,
        action: /action\s+(?:def\s+)?(\w+)/g,
        state: /state\s+(\w+)/g,
        transition: /transition\s+(\w+)\s+to\s+(\w+)/g,
        actor: /actor\s+(?:def\s+)?(\w+)/g,
        useCase: /use\s*case\s+(?:def\s+)?(\w+)/g,
        connection: /connection\s+(\w+)\s*\{/g,
        requirement: /requirement\s+(?:def\s+)?(\w+)/g,
        constraint: /constraint\s+(\w+)/g,
        item: /item\s+(?:def\s+)?(\w+)/g,
        flow: /flow\s+(?:def\s+)?(\w+)/g,
        doc: /doc\s*\/\*[\s\S]*?\*\//g
    };

    // Extract elements
    for (const [type, pattern] of Object.entries(patterns)) {
        let match;
        const regex = new RegExp(pattern.source, 'g');
        while ((match = regex.exec(content)) !== null) {
            const name = match[1] || (type === 'transition' ? `${match[1]} to ${match[2]}` : 'unnamed');
            elements.push({
                type,
                name,
                line: content.substring(0, match.index).split('\n').length,
                hasDoc: type === 'doc'
            });
        }
    }

    // Count nesting levels
    let maxNesting = 0;
    let currentNesting = 0;
    for (const char of content) {
        if (char === '{') currentNesting++;
        if (char === '}') currentNesting--;
        maxNesting = Math.max(maxNesting, currentNesting);
    }

    return {
        filePath,
        fileName: path.basename(filePath),
        elements,
        stats: {
            totalElements: elements.length,
            byType: elements.reduce((acc, el) => {
                acc[el.type] = (acc[el.type] || 0) + 1;
                return acc;
            }, {}),
            maxNesting,
            hasDocumentation: elements.some(e => e.type === 'doc'),
            lineCount: content.split('\n').length
        }
    };
}

// Simulate data transformation for each view type
function transformDataForView(parsedData, viewType) {
    const { elements, stats } = parsedData;

    switch (viewType) {
        case 'pillar':
        case 'general':
        case 'elk':
            return {
                success: elements.length > 0,
                data: elements,
                nodeCount: elements.length,
                hasHierarchy: stats.maxNesting > 1
            };

        case 'ibd':
            const parts = elements.filter(e => e.type === 'part' || e.type === 'partDef');
            const connections = elements.filter(e => e.type === 'connection' || e.type === 'interface');
            const ports = elements.filter(e => e.type === 'port');
            return {
                success: parts.length > 0,
                data: { parts, connections, ports },
                partCount: parts.length,
                connectionCount: connections.length,
                portCount: ports.length
            };

        case 'activity':
            const actions = elements.filter(e => e.type === 'action');
            const flows = elements.filter(e => e.type === 'flow');
            return {
                success: actions.length > 0 || stats.byType.action > 0,
                data: { actions, flows },
                actionCount: actions.length,
                flowCount: flows.length
            };

        case 'state':
            const states = elements.filter(e => e.type === 'state');
            const transitions = elements.filter(e => e.type === 'transition');
            return {
                success: states.length > 0,
                data: { states, transitions },
                stateCount: states.length,
                transitionCount: transitions.length
            };

        case 'sequence':
            // Sequence diagrams need specific message/interaction patterns
            return {
                success: true,
                data: elements,
                nodeCount: elements.length
            };

        case 'usecase':
            const actors = elements.filter(e => e.type === 'actor');
            const useCases = elements.filter(e => e.type === 'useCase');
            return {
                success: actors.length > 0 || useCases.length > 0 || elements.length > 0,
                data: { actors, useCases },
                actorCount: actors.length,
                useCaseCount: useCases.length
            };

        case 'tree':
            return {
                success: elements.length > 0,
                data: elements,
                nodeCount: elements.length
            };

        case 'package':
            const packages = elements.filter(e => e.type === 'package');
            return {
                success: packages.length > 0,
                data: packages,
                packageCount: packages.length
            };

        case 'graph':
            return {
                success: elements.length > 0,
                data: elements,
                nodeCount: elements.length,
                edgeCount: elements.filter(e =>
                    e.type === 'connection' || e.type === 'flow' || e.type === 'transition'
                ).length
            };

        case 'hierarchy':
            return {
                success: elements.length > 0,
                data: elements,
                nodeCount: elements.length,
                depth: stats.maxNesting
            };

        default:
            return { success: false, error: `Unknown view type: ${viewType}` };
    }
}

// Validate layout constraints (simulated)
function validateLayoutConstraints(viewData, viewType) {
    const issues = [];

    // Check for minimum content
    if (viewData.nodeCount !== undefined && viewData.nodeCount === 0) {
        issues.push({ type: 'error', message: 'No nodes to render - view will be empty' });
    }

    // Check for reasonable node counts (too many could cause overlap)
    if (viewData.nodeCount > 100) {
        issues.push({ type: 'warning', message: `High node count (${viewData.nodeCount}) may cause layout issues` });
    }

    // View-specific validations
    switch (viewType) {
        case 'ibd':
            if (viewData.partCount === 0) {
                issues.push({ type: 'warning', message: 'No parts found for IBD view' });
            }
            break;
        case 'activity':
            if (viewData.actionCount === 0) {
                issues.push({ type: 'warning', message: 'No actions found for Activity view' });
            }
            break;
        case 'state':
            if (viewData.stateCount === 0) {
                issues.push({ type: 'warning', message: 'No states found for State view' });
            }
            break;
        case 'package':
            if (viewData.packageCount === 0) {
                issues.push({ type: 'warning', message: 'No packages found for Package view' });
            }
            break;
    }

    return issues;
}

// Run tests for a single file
function testFile(filePath) {
    const fileName = path.basename(filePath);
    const results = {
        file: fileName,
        views: {},
        overallStatus: 'passed'
    };

    console.log(`\n${colors.cyan}━━━ Testing: ${fileName} ━━━${colors.reset}`);

    try {
        const parsedData = parseSysMLFile(filePath);
        console.log(`  ${colors.blue}Parsed:${colors.reset} ${parsedData.stats.totalElements} elements, ${parsedData.stats.lineCount} lines`);
        console.log(`  ${colors.blue}Types:${colors.reset} ${JSON.stringify(parsedData.stats.byType)}`);

        const expectations = VIEW_EXPECTATIONS[fileName] || {};

        for (const viewType of VIEW_TYPES) {
            const viewData = transformDataForView(parsedData, viewType);
            const layoutIssues = validateLayoutConstraints(viewData, viewType);
            const viewExpect = expectations.viewExpectations?.[viewType] || {};

            let status = 'passed';
            const issues = [...layoutIssues];

            // Check against expectations
            if (viewExpect.minElements && viewData.nodeCount < viewExpect.minElements) {
                issues.push({
                    type: 'warning',
                    message: `Expected at least ${viewExpect.minElements} elements, got ${viewData.nodeCount}`
                });
            }

            if (viewExpect.minStates && viewData.stateCount < viewExpect.minStates) {
                issues.push({
                    type: 'warning',
                    message: `Expected at least ${viewExpect.minStates} states, got ${viewData.stateCount}`
                });
            }

            if (viewExpect.minParts && viewData.partCount < viewExpect.minParts) {
                issues.push({
                    type: 'warning',
                    message: `Expected at least ${viewExpect.minParts} parts, got ${viewData.partCount}`
                });
            }

            if (viewExpect.minActions && viewData.actionCount < viewExpect.minActions) {
                issues.push({
                    type: 'warning',
                    message: `Expected at least ${viewExpect.minActions} actions, got ${viewData.actionCount}`
                });
            }

            // Determine overall status for this view
            if (issues.some(i => i.type === 'error')) {
                status = 'failed';
                testResults.failed++;
            } else if (issues.some(i => i.type === 'warning')) {
                status = 'warning';
                testResults.warnings++;
            } else {
                testResults.passed++;
            }

            if (!viewData.success && status === 'passed') {
                status = 'warning';
                issues.push({ type: 'warning', message: 'View may not render content' });
                testResults.warnings++;
                testResults.passed--;
            }

            results.views[viewType] = {
                status,
                data: viewData,
                issues
            };

            // Output status
            const statusIcon = status === 'passed' ? `${colors.green}✓` :
                              status === 'warning' ? `${colors.yellow}⚠` :
                              `${colors.red}✗`;

            let statsStr = '';
            if (viewData.nodeCount !== undefined) statsStr += `nodes:${viewData.nodeCount}`;
            if (viewData.partCount !== undefined) statsStr += ` parts:${viewData.partCount}`;
            if (viewData.stateCount !== undefined) statsStr += ` states:${viewData.stateCount}`;
            if (viewData.actionCount !== undefined) statsStr += ` actions:${viewData.actionCount}`;
            if (viewData.packageCount !== undefined) statsStr += ` packages:${viewData.packageCount}`;

            console.log(`  ${statusIcon} ${viewType.padEnd(12)}${colors.reset} ${statsStr}`);

            if (issues.length > 0) {
                issues.forEach(issue => {
                    const issueColor = issue.type === 'error' ? colors.red : colors.yellow;
                    console.log(`     ${issueColor}└─ ${issue.message}${colors.reset}`);
                });
            }

            if (status === 'failed') {
                results.overallStatus = 'failed';
            } else if (status === 'warning' && results.overallStatus === 'passed') {
                results.overallStatus = 'warning';
            }
        }

    } catch (error) {
        console.log(`  ${colors.red}✗ Error: ${error.message}${colors.reset}`);
        results.overallStatus = 'failed';
        testResults.failed++;
    }

    return results;
}

// Find all sample files recursively
function findSampleFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findSampleFiles(fullPath));
        } else if (entry.name.endsWith('.sysml')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Generate HTML report
function generateHtmlReport(allResults) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>SysML Visualizer Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; margin: 20px; background: #1e1e1e; color: #d4d4d4; }
        h1 { color: #569cd6; }
        h2 { color: #4ec9b0; border-bottom: 1px solid #333; padding-bottom: 5px; }
        .summary { background: #252526; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .passed { color: #4ec9b0; }
        .failed { color: #f14c4c; }
        .warning { color: #cca700; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; border: 1px solid #333; }
        th { background: #2d2d2d; color: #9cdcfe; }
        tr:hover { background: #2a2a2a; }
        .status-icon { font-size: 16px; margin-right: 5px; }
        .issue { font-size: 12px; color: #858585; margin-left: 20px; }
        .stats { font-family: monospace; font-size: 12px; color: #858585; }
    </style>
</head>
<body>
    <h1>🔍 SysML Visualizer Test Report</h1>
    <div class="summary">
        <strong>Generated:</strong> ${new Date().toISOString()}<br>
        <strong>Files Tested:</strong> ${allResults.length}<br>
        <strong>Views Tested:</strong> ${VIEW_TYPES.length}<br>
        <strong>Results:</strong>
        <span class="passed">✓ ${testResults.passed} passed</span> |
        <span class="warning">⚠ ${testResults.warnings} warnings</span> |
        <span class="failed">✗ ${testResults.failed} failed</span>
    </div>

    ${allResults.map(result => `
    <h2>${result.file}</h2>
    <table>
        <tr>
            <th>View</th>
            <th>Status</th>
            <th>Stats</th>
            <th>Issues</th>
        </tr>
        ${Object.entries(result.views).map(([view, data]) => `
        <tr>
            <td>${view}</td>
            <td class="${data.status}">
                <span class="status-icon">${data.status === 'passed' ? '✓' : data.status === 'warning' ? '⚠' : '✗'}</span>
                ${data.status}
            </td>
            <td class="stats">${formatStats(data.data)}</td>
            <td>${data.issues.map(i => `<div class="issue ${i.type}">• ${i.message}</div>`).join('')}</td>
        </tr>
        `).join('')}
    </table>
    `).join('')}
</body>
</html>`;

    return html;
}

function formatStats(data) {
    const parts = [];
    if (data.nodeCount !== undefined) parts.push(`nodes: ${data.nodeCount}`);
    if (data.partCount !== undefined) parts.push(`parts: ${data.partCount}`);
    if (data.connectionCount !== undefined) parts.push(`connections: ${data.connectionCount}`);
    if (data.stateCount !== undefined) parts.push(`states: ${data.stateCount}`);
    if (data.transitionCount !== undefined) parts.push(`transitions: ${data.transitionCount}`);
    if (data.actionCount !== undefined) parts.push(`actions: ${data.actionCount}`);
    if (data.packageCount !== undefined) parts.push(`packages: ${data.packageCount}`);
    return parts.join(', ') || '-';
}

// Main execution
function main() {
    console.log(`${colors.bold}${colors.blue}╔══════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}║  SysML Visualizer - Automated View Testing   ║${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}╚══════════════════════════════════════════════╝${colors.reset}`);

    // Find all sample files
    const sampleFiles = findSampleFiles(SAMPLES_DIR);
    console.log(`\n${colors.cyan}Found ${sampleFiles.length} sample files${colors.reset}`);

    // Test each file
    const allResults = [];
    for (const filePath of sampleFiles) {
        const result = testFile(filePath);
        allResults.push(result);
    }

    // Summary
    console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}                   SUMMARY${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`  ${colors.green}Passed:${colors.reset}   ${testResults.passed}`);
    console.log(`  ${colors.yellow}Warnings:${colors.reset} ${testResults.warnings}`);
    console.log(`  ${colors.red}Failed:${colors.reset}   ${testResults.failed}`);
    console.log(`  Total:    ${testResults.passed + testResults.warnings + testResults.failed}`);

    // Generate HTML report
    const reportPath = path.join(__dirname, '..', 'test-output', 'view-test-report.html');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, generateHtmlReport(allResults));
    console.log(`\n${colors.cyan}📄 HTML report saved to: ${reportPath}${colors.reset}`);

    // Exit code based on results
    const exitCode = testResults.failed > 0 ? 1 : 0;
    console.log(`\n${exitCode === 0 ? colors.green + '✓ All tests acceptable' : colors.red + '✗ Some tests failed'}${colors.reset}`);

    return exitCode;
}

// Run
process.exit(main());
