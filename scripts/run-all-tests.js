#!/usr/bin/env node
/**
 * Integrated Test Runner for SysML Visualizer
 * Runs all automated tests and generates a comprehensive report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = (color, ...args) => console.log(color, ...args, colors.reset);
const header = (text) => {
    console.log('\n' + colors.cyan + colors.bold + '╔' + '═'.repeat(60) + '╗' + colors.reset);
    console.log(colors.cyan + colors.bold + '║ ' + text.padEnd(59) + '║' + colors.reset);
    console.log(colors.cyan + colors.bold + '╚' + '═'.repeat(60) + '╝' + colors.reset + '\n');
};

const subHeader = (text) => {
    console.log(colors.yellow + '\n┌─ ' + text + ' ' + '─'.repeat(Math.max(0, 55 - text.length)) + '┐' + colors.reset);
};

// Results collection
const results = {
    viewTests: null,
    parserTests: null,
    dataFlow: null,
    timestamp: new Date().toISOString()
};

// Run a test script and capture output
function runTest(script, name) {
    subHeader(name);
    try {
        const output = execSync(`node ${script}`, { 
            encoding: 'utf-8',
            cwd: path.join(__dirname, '..')
        });
        console.log(output);
        return { success: true, output };
    } catch (error) {
        log(colors.red, `Error running ${name}:`);
        console.log(error.stdout || error.message);
        return { success: false, error: error.message };
    }
}

// Main execution
async function main() {
    console.clear();
    header('SysML Visualizer - Integrated Test Suite');
    
    log(colors.blue, `Running at: ${results.timestamp}`);
    log(colors.blue, `Working directory: ${path.join(__dirname, '..')}`);
    
    // 1. Run view tests
    results.viewTests = runTest('./scripts/test-all-views.js', 'View Tests');
    
    // 2. Run parser tests
    results.parserTests = runTest('./scripts/test-parser-standalone.js', 'Parser Analysis');
    
    // 3. Run data flow debug
    results.dataFlow = runTest('./scripts/debug-view-data.js', 'Data Flow Trace');
    
    // 4. Generate visual test guide
    subHeader('Visual Test Guide');
    try {
        execSync(`node ${path.join(__dirname, 'generate-visual-test-guide.js')}`, { 
            encoding: 'utf-8',
            cwd: path.join(__dirname, '..')
        });
        log(colors.green, '✓ Visual test guide generated');
    } catch (error) {
        log(colors.red, '✗ Failed to generate visual test guide');
    }
    
    // Summary
    header('Test Summary');
    
    const testStatus = [
        { name: 'View Tests', result: results.viewTests },
        { name: 'Parser Analysis', result: results.parserTests },
        { name: 'Data Flow Trace', result: results.dataFlow }
    ];
    
    testStatus.forEach(test => {
        const status = test.result.success ? '✓' : '✗';
        const color = test.result.success ? colors.green : colors.red;
        log(color, `  ${status} ${test.name}`);
    });
    
    // Output location
    console.log('');
    log(colors.cyan, 'Test output files:');
    log(colors.blue, '  • test-output/view-test-report.html');
    log(colors.blue, '  • test-output/visual-test-guide.html');
    
    // Next steps
    console.log('');
    log(colors.yellow, 'Manual Testing Steps:');
    console.log('  1. Press F5 to launch Extension Development Host');
    console.log('  2. Open samples/batmobile.sysml');
    console.log('  3. Click "Visualize" button in editor title bar');
    console.log('  4. Try each view from the dropdown');
    console.log('  5. Open DevTools (F12) to check for console errors');
    console.log('  6. Review test-output/visual-test-guide.html for checklist');
    
    // Return exit code based on test results
    const allPassed = testStatus.every(t => t.result.success);
    process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
    log(colors.red, 'Fatal error:', error.message);
    process.exit(1);
});
