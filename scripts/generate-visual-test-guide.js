#!/usr/bin/env node
/**
 * Visual Testing Summary Generator
 * Creates a comprehensive report of what each view should display for each sample file
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

// View test expectations - what to look for in each view
const VIEW_CHECKS = {
    'General View': {
        id: 'elk',
        checks: [
            'ELK algorithm loads successfully',
            'Nested elements shown inside parent containers',
            'Attributes displayed in nodes (up to 4)',
            'Relationship edges drawn between connected elements',
            'Doc tooltip appears on hover'
        ]
    },
    'Interconnection View': {
        id: 'ibd',
        checks: [
            'Parts displayed as rectangles',
            'Ports shown on part boundaries',
            'Connectors drawn between ports',
            'Part names visible and readable'
        ]
    },
    'Activity View': {
        id: 'activity',
        checks: [
            'Action nodes displayed',
            'Decision/merge nodes shown as diamonds',
            'Flow arrows connecting actions',
            'Swim lanes if defined'
        ]
    },
    'State View': {
        id: 'state',
        checks: [
            'State nodes displayed as rounded rectangles',
            'Transitions shown as arrows',
            'Initial state marked (filled circle)',
            'Guard conditions shown on transitions'
        ]
    },
    'Use Case View': {
        id: 'usecase',
        checks: [
            'Actors shown as stick figures or labeled shapes',
            'Use cases shown as ovals',
            'Association lines connecting actors to use cases',
            'Use case names readable'
        ]
    },
    'Package View': {
        id: 'package',
        checks: [
            'Package containers with tab styling',
            'Package name in header',
            'Child count visible',
            'Import/dependency arrows'
        ]
    },
    'Tree View': {
        id: 'tree',
        checks: [
            'Hierarchical tree layout',
            'Expandable/collapsible nodes',
            'Element type icons',
            'Lines connecting parents to children'
        ]
    },
    'Hierarchy View': {
        id: 'hierarchy',
        checks: [
            'Nested container layout',
            'Text wrapping in containers',
            'No overlapping elements',
            'Proper indentation for nesting levels'
        ]
    },
    'Graph View': {
        id: 'graph',
        checks: [
            'Force-directed layout',
            'Nodes for all elements',
            'Edges for relationships',
            'Interactive drag/zoom'
        ]
    }
};

// Sample files and what content they should have for each view
const SAMPLE_EXPECTATIONS = {
    'batmobile.sysml': {
        description: 'Batmobile example - parts, actions, requirements',
        expectedViews: {
            'General View': '✓ Should show Batmobile package with nested parts (Vehicle, Wheel, Engine)',
            'Interconnection View': '✓ Should show battery-engine connection with PowerInterface',
            'Activity View': '✓ Should show rocketBoost action',
            'State View': '⚠ No states defined - will show placeholder',
            'Use Case View': '✓ Should show driver actor',
            'Package View': '✓ Should show Batmobile package',
            'Hierarchy View': '✓ Should show part hierarchy'
        }
    },
    'smart-home.sysml': {
        description: 'Smart home IoT example - states, parts, use cases',
        expectedViews: {
            'General View': '✓ Should show SmartHomeSystem with subsystems',
            'Interconnection View': '✓ Should show 71 parts (lighting, security, climate, etc)',
            'Activity View': '⚠ No actions - shows placeholder',
            'State View': '✓ Should show homeStates and securityStates (21 states, 15 transitions)',
            'Use Case View': '✓ Should show 6 actors and 3 use cases',
            'Package View': '✓ Should show SmartHomeSystem package',
            'Hierarchy View': '✓ Should show nested part definitions'
        }
    },
    'Camera Example/camera-states.sysml': {
        description: 'Camera state machine focused file',
        expectedViews: {
            'General View': '✓ Should show state machine structure',
            'Interconnection View': '⚠ No parts - shows placeholder',
            'Activity View': '✓ Should show 10 action definitions',
            'State View': '✓ Should show cameraPowerStates with 10 states',
            'Use Case View': '⚠ No actors - shows placeholder',
            'Package View': '✓ Should show CameraStateMachine package',
            'Hierarchy View': '✓ Should show state hierarchy'
        }
    },
    'Camera Example/camera-usecases.sysml': {
        description: 'Camera use cases focused file',
        expectedViews: {
            'General View': '✓ Should show use case structure',
            'Interconnection View': '⚠ No parts - shows placeholder',
            'Activity View': '⚠ No actions - shows placeholder',
            'State View': '⚠ No states - shows placeholder',
            'Use Case View': '✓ Should show Photographer, CameraSystem, StorageDevice + 9 use cases',
            'Package View': '✓ Should show CameraUseCases package',
            'Hierarchy View': '✓ Should show actor/use case hierarchy'
        }
    },
    'toaster-system.sysml': {
        description: 'Toaster system - parts, actions, requirements',
        expectedViews: {
            'General View': '✓ Should show Toaster parts',
            'Interconnection View': '✓ Should show 16 parts',
            'Activity View': '✓ Should show 9 actions (ToastBread, CleanToaster)',
            'State View': '⚠ No states - shows placeholder',
            'Use Case View': '⚠ No actors - shows placeholder',
            'Package View': '✓ Should show ToasterSystem package',
            'Hierarchy View': '✓ Should show part hierarchy'
        }
    }
};

function generateTestReport() {
    console.log(`${colors.bold}${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}║          SysML Visualizer - Visual Test Guide              ║${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);

    console.log(`\n${colors.cyan}This guide helps you manually verify each view renders correctly.${colors.reset}`);
    console.log(`${colors.dim}Run the Extension Development Host (F5) and test each sample file.${colors.reset}\n`);

    // Print test matrix
    console.log(`${colors.bold}━━━ TEST MATRIX ━━━${colors.reset}\n`);

    Object.entries(SAMPLE_EXPECTATIONS).forEach(([file, info]) => {
        console.log(`${colors.yellow}📄 ${file}${colors.reset}`);
        console.log(`   ${colors.dim}${info.description}${colors.reset}\n`);

        Object.entries(info.expectedViews).forEach(([view, expectation]) => {
            const icon = expectation.startsWith('✓') ? colors.green : colors.yellow;
            console.log(`   ${icon}${expectation}${colors.reset}`);
        });
        console.log('');
    });

    // Print view-specific check lists
    console.log(`\n${colors.bold}━━━ VIEW CHECK LISTS ━━━${colors.reset}\n`);

    Object.entries(VIEW_CHECKS).forEach(([viewName, info]) => {
        console.log(`${colors.cyan}${viewName}${colors.reset} (${info.id})`);
        info.checks.forEach(check => {
            console.log(`  ☐ ${check}`);
        });
        console.log('');
    });

    // Generate HTML version
    const html = generateHtmlReport();
    const outputPath = path.join(__dirname, '..', 'test-output', 'visual-test-guide.html');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);

    console.log(`${colors.green}✓ HTML test guide saved to: ${outputPath}${colors.reset}`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log(`  1. Press F5 to launch Extension Development Host`);
    console.log(`  2. Open each sample file listed above`);
    console.log(`  3. Switch between views using the dropdown`);
    console.log(`  4. Verify each checkbox item in the check lists`);
    console.log(`  5. Note any issues in issues.md`);
}

function generateHtmlReport() {
    return `<!DOCTYPE html>
<html>
<head>
    <title>SysML Visualizer - Visual Test Guide</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1e1e1e;
            color: #d4d4d4;
            margin: 20px;
            line-height: 1.6;
        }
        h1 { color: #569cd6; border-bottom: 2px solid #569cd6; padding-bottom: 10px; }
        h2 { color: #4ec9b0; margin-top: 30px; }
        h3 { color: #dcdcaa; }
        .file-card {
            background: #252526;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #569cd6;
        }
        .file-name { color: #ce9178; font-weight: bold; font-size: 1.1em; }
        .description { color: #6a9955; font-style: italic; }
        .expectation { margin: 5px 0; padding: 5px 10px; border-radius: 4px; }
        .expectation.pass { background: rgba(78, 201, 176, 0.1); }
        .expectation.warn { background: rgba(204, 167, 0, 0.1); }
        .checklist {
            background: #2d2d2d;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .checklist h3 { margin-top: 0; }
        .check-item {
            margin: 8px 0;
            padding: 5px;
        }
        input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        .instructions {
            background: #264f78;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .instructions h2 { margin-top: 0; color: #9cdcfe; }
        .status-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .status-box {
            background: #2d2d2d;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .status-box.pass { border-top: 3px solid #4ec9b0; }
        .status-box.warn { border-top: 3px solid #cca700; }
        .status-box.fail { border-top: 3px solid #f14c4c; }
    </style>
</head>
<body>
    <h1>🔍 SysML Visualizer - Visual Test Guide</h1>

    <div class="instructions">
        <h2>Testing Instructions</h2>
        <ol>
            <li>Press <strong>F5</strong> in VS Code to launch Extension Development Host</li>
            <li>Open each sample file from <code>samples/</code> directory</li>
            <li>Click the <strong>Visualize</strong> button in the editor title bar</li>
            <li>Use the dropdown to switch between different views</li>
            <li>Check off each item as you verify it works correctly</li>
            <li>Document any issues found in <code>issues.md</code></li>
        </ol>
    </div>

    <h2>📁 Test Files</h2>

    ${Object.entries(SAMPLE_EXPECTATIONS).map(([file, info]) => `
    <div class="file-card">
        <div class="file-name">📄 ${file}</div>
        <div class="description">${info.description}</div>
        ${Object.entries(info.expectedViews).map(([view, exp]) => `
        <div class="expectation ${exp.startsWith('✓') ? 'pass' : 'warn'}">
            <strong>${view}:</strong> ${exp}
        </div>
        `).join('')}
    </div>
    `).join('')}

    <h2>✅ View Checklists</h2>

    ${Object.entries(VIEW_CHECKS).map(([viewName, info]) => `
    <div class="checklist">
        <h3>${viewName} (${info.id})</h3>
        ${info.checks.map((check, i) => `
        <div class="check-item">
            <input type="checkbox" id="${info.id}-${i}">
            <label for="${info.id}-${i}">${check}</label>
        </div>
        `).join('')}
    </div>
    `).join('')}

    <h2>📊 Quick Status</h2>
    <div class="status-summary">
        <div class="status-box pass">
            <h3>✓ Expected to Work</h3>
            <p>General, Package, Tree, Graph, Hierarchy views</p>
        </div>
        <div class="status-box warn">
            <h3>⚠ Needs Testing</h3>
            <p>IBD, Activity, State, UseCase views</p>
        </div>
        <div class="status-box fail">
            <h3>✗ Known Issues</h3>
            <p>Pillar view (attributes), Sequence view (syntax)</p>
        </div>
    </div>

    <script>
        // Save checkbox state to localStorage
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const key = 'sysml-test-' + cb.id;
            cb.checked = localStorage.getItem(key) === 'true';
            cb.addEventListener('change', () => {
                localStorage.setItem(key, cb.checked);
            });
        });
    </script>
</body>
</html>`;
}

generateTestReport();
