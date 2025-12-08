#!/usr/bin/env node

/**
 * Automated ELK Rendering Debugger
 * 
 * This script:
 * 1. Compiles the extension
 * 2. Launches the Extension Development Host
 * 3. Monitors extension host logs for ELK-related errors
 * 4. Captures browser console output
 * 5. Analyzes the failure point
 * 6. Provides actionable diagnostics
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function log(message, color = '') {
    console.log(`${color}${message}${colors.reset}`);
}

function section(title) {
    log('\n' + '='.repeat(70), colors.cyan);
    log(` ${title}`, colors.cyan + colors.bright);
    log('='.repeat(70), colors.cyan);
}

// Log analysis patterns
const patterns = {
    elkStart: /\[ELK\]\s*===\s*Starting renderElkTreeView\s*===/,
    elkTryBlock: /\[ELK\]\s*Inside try block/,
    elkTypeCheck: /\[ELK\]\s*typeof ELK:/,
    elkWindowCheck: /\[ELK\]\s*window\.ELK exists:/,
    elkUndefinedCheck: /\[ELK\]\s*About to check if ELK is undefined/,
    elkCheckPassed: /\[ELK\]\s*ELK check passed/,
    elkWorkerUrl: /elkWorkerUrl value:/,
    elkInstanceCreating: /creating instance with worker:/,
    elkInstanceCreated: /ELK instance created successfully/,
    elkError: /\[ELK\]\s*===\s*CAUGHT ERROR/,
    elkLayoutFailed: /ELK layout failed:/,
    
    // Library loading
    webviewLoaded: /===\s*WEBVIEW LOADED:/,
    libraryCheck: /Library check:/,
    d3Loaded: /d3:\s*loaded/,
    elkLoaded: /ELK:\s*loaded/,
    cytoscapeLoaded: /cytoscape:\s*loaded/,
    
    // Rendering
    renderElkCalled: /renderElkTreeView called/,
    messageReceived: /Message received:\s*update/,
    startingRender: /Starting render for view:\s*elk/,
    
    // Errors
    scriptError: /Failed to load resource/,
    cspError: /Content Security Policy/,
    moduleError: /Cannot find module/,
    typeError: /TypeError:/,
    referenceError: /ReferenceError:/,
};

class DebugSession {
    constructor() {
        this.logs = [];
        this.analysis = {
            webviewLoaded: false,
            librariesLoaded: { d3: false, elk: false, cytoscape: false },
            elkFunctionReached: false,
            elkCheckpoints: {
                started: false,
                enteredTry: false,
                typeChecked: false,
                windowChecked: false,
                undefinedChecked: false,
                checkPassed: false,
                workerUrlLogged: false,
                instanceCreating: false,
                instanceCreated: false,
            },
            errors: [],
            lastLogBeforeFailure: null,
            failurePoint: null,
        };
        this.startTime = Date.now();
        this.timeout = 30000; // 30 seconds
    }

    addLog(line) {
        const timestamp = Date.now() - this.startTime;
        this.logs.push({ timestamp, line });
        this.analyzeLine(line);
    }

    analyzeLine(line) {
        // Track webview load
        if (patterns.webviewLoaded.test(line)) {
            this.analysis.webviewLoaded = true;
            log(`✓ Webview loaded`, colors.green);
        }

        // Track library loading
        if (patterns.d3Loaded.test(line)) {
            this.analysis.librariesLoaded.d3 = true;
            log(`✓ D3.js loaded`, colors.green);
        }
        if (patterns.elkLoaded.test(line)) {
            this.analysis.librariesLoaded.elk = true;
            log(`✓ ELK library loaded`, colors.green);
        }
        if (patterns.cytoscapeLoaded.test(line)) {
            this.analysis.librariesLoaded.cytoscape = true;
            log(`✓ Cytoscape loaded`, colors.green);
        }

        // Track ELK function execution
        if (patterns.elkStart.test(line)) {
            this.analysis.elkCheckpoints.started = true;
            log(`✓ renderElkTreeView started`, colors.green);
        }
        if (patterns.elkTryBlock.test(line)) {
            this.analysis.elkCheckpoints.enteredTry = true;
            log(`✓ Entered try block`, colors.green);
        }
        if (patterns.elkTypeCheck.test(line)) {
            this.analysis.elkCheckpoints.typeChecked = true;
            log(`✓ typeof ELK checked`, colors.green);
        }
        if (patterns.elkWindowCheck.test(line)) {
            this.analysis.elkCheckpoints.windowChecked = true;
            log(`✓ window.ELK checked`, colors.green);
        }
        if (patterns.elkUndefinedCheck.test(line)) {
            this.analysis.elkCheckpoints.undefinedChecked = true;
            log(`✓ About to check if ELK is undefined`, colors.green);
        }
        if (patterns.elkCheckPassed.test(line)) {
            this.analysis.elkCheckpoints.checkPassed = true;
            log(`✓ ELK check passed`, colors.green);
        }
        if (patterns.elkWorkerUrl.test(line)) {
            this.analysis.elkCheckpoints.workerUrlLogged = true;
            const match = line.match(/elkWorkerUrl value:\s*(.+)/);
            if (match) {
                log(`✓ elkWorkerUrl: ${match[1]}`, colors.green);
            }
        }
        if (patterns.elkInstanceCreating.test(line)) {
            this.analysis.elkCheckpoints.instanceCreating = true;
            log(`✓ Creating ELK instance`, colors.green);
        }
        if (patterns.elkInstanceCreated.test(line)) {
            this.analysis.elkCheckpoints.instanceCreated = true;
            log(`✓ ELK instance created successfully!`, colors.green + colors.bright);
        }

        // Track errors
        if (patterns.elkError.test(line)) {
            this.analysis.errors.push({ type: 'ELK Error', line });
            log(`✗ ELK Error caught`, colors.red);
        }
        if (patterns.typeError.test(line)) {
            this.analysis.errors.push({ type: 'TypeError', line });
            log(`✗ TypeError detected`, colors.red);
        }
        if (patterns.referenceError.test(line)) {
            this.analysis.errors.push({ type: 'ReferenceError', line });
            log(`✗ ReferenceError detected`, colors.red);
        }
        if (patterns.scriptError.test(line)) {
            this.analysis.errors.push({ type: 'Script Load Error', line });
            log(`✗ Script failed to load`, colors.red);
        }
        if (patterns.cspError.test(line)) {
            this.analysis.errors.push({ type: 'CSP Error', line });
            log(`✗ Content Security Policy violation`, colors.red);
        }
    }

    determineFailurePoint() {
        const cp = this.analysis.elkCheckpoints;
        
        if (!this.analysis.webviewLoaded) {
            return 'Webview failed to load';
        }
        
        if (!this.analysis.librariesLoaded.elk) {
            return 'ELK library failed to load from vendor directory';
        }
        
        if (!cp.started) {
            return 'renderElkTreeView function was never called';
        }
        
        if (!cp.enteredTry) {
            return 'Function started but never entered try block - syntax error before try?';
        }
        
        if (!cp.typeChecked) {
            return 'Failed before typeof ELK check - error on line before type check';
        }
        
        if (!cp.windowChecked) {
            return 'Failed after typeof check but before window.ELK check';
        }
        
        if (!cp.undefinedChecked) {
            return 'Failed after window.ELK log - possible console.log issue or error immediately after';
        }
        
        if (!cp.checkPassed) {
            return 'ELK undefined check failed or error between undefined check and check passed log';
        }
        
        if (!cp.workerUrlLogged) {
            return 'Failed before logging elkWorkerUrl - variable may be undefined or error accessing it';
        }
        
        if (!cp.instanceCreating) {
            return 'Failed before creating ELK instance - error after workerUrl log';
        }
        
        if (!cp.instanceCreated) {
            return 'ELK constructor threw an error - check workerUrl value and ELK requirements';
        }
        
        return 'Unknown - ELK instance created but further rendering failed';
    }

    generateDiagnostics() {
        section('DIAGNOSTIC REPORT');
        
        const failurePoint = this.determineFailurePoint();
        this.analysis.failurePoint = failurePoint;
        
        log(`\nFailure Point: ${failurePoint}`, colors.red + colors.bright);
        
        log('\n📊 Checkpoint Status:', colors.cyan);
        const cp = this.analysis.elkCheckpoints;
        for (const [key, value] of Object.entries(cp)) {
            const status = value ? '✓' : '✗';
            const color = value ? colors.green : colors.red;
            log(`  ${status} ${key}`, color);
        }
        
        if (this.analysis.errors.length > 0) {
            log('\n🚨 Errors Detected:', colors.red);
            this.analysis.errors.forEach(error => {
                log(`  • ${error.type}`, colors.red);
                log(`    ${error.line.substring(0, 200)}`, colors.reset);
            });
        }
        
        section('RECOMMENDED ACTIONS');
        
        const recommendations = this.getRecommendations();
        recommendations.forEach((rec, idx) => {
            log(`\n${idx + 1}. ${rec.title}`, colors.yellow + colors.bright);
            rec.actions.forEach(action => {
                log(`   • ${action}`, colors.reset);
            });
        });
        
        // Save detailed report
        this.saveReport();
    }

    getRecommendations() {
        const recommendations = [];
        const failurePoint = this.analysis.failurePoint;
        
        if (failurePoint.includes('ELK library failed to load')) {
            recommendations.push({
                title: 'Fix ELK Library Loading',
                actions: [
                    'Verify media/vendor/elk.bundled.js exists',
                    'Check package.json localResourceRoots includes media/vendor',
                    'Inspect browser Network tab for 404 errors',
                    'Check CSP allows loading from vscode-resource: scheme',
                ]
            });
        }
        
        if (failurePoint.includes('never entered try block')) {
            recommendations.push({
                title: 'Check Syntax Before Try Block',
                actions: [
                    'Review lines immediately before "try {" statement',
                    'Look for unclosed template literals or missing semicolons',
                    'Check if function declaration has syntax errors',
                ]
            });
        }
        
        if (failurePoint.includes('elkWorkerUrl')) {
            recommendations.push({
                title: 'Fix elkWorkerUrl Variable',
                actions: [
                    'Verify elkWorkerUri is passed to template literal correctly',
                    'Check indentation - must be 8 spaces inside script tag',
                    'Add console.log before accessing elkWorkerUrl to verify scope',
                    'Verify template literal interpolation: ${elkWorkerUri}',
                ]
            });
        }
        
        if (failurePoint.includes('ELK constructor threw an error')) {
            recommendations.push({
                title: 'Fix ELK Constructor Call',
                actions: [
                    'Verify elkWorkerUrl has actual URI value (not "undefined" string)',
                    'Check if elkWorker.js file exists in media/webview/',
                    'Ensure workerUrl parameter is valid vscode-webview:// URI',
                    'Try passing workerFactory instead of workerUrl',
                ]
            });
        }
        
        if (failurePoint.includes('console.log issue')) {
            recommendations.push({
                title: 'Debug Console Logging Issue',
                actions: [
                    'Large objects in console.log can block execution',
                    'Replace window.ELK log with !!window.ELK boolean check',
                    'Use simpler log messages to avoid serialization issues',
                ]
            });
        }
        
        if (!this.analysis.webviewLoaded) {
            recommendations.push({
                title: 'Fix Webview Loading',
                actions: [
                    'Check VS Code extension host logs for webview errors',
                    'Verify HTML generation in _getHtmlForWebview()',
                    'Check for template literal syntax errors',
                ]
            });
        }
        
        // Always add general debugging steps
        recommendations.push({
            title: 'General Debugging Steps',
            actions: [
                'Open browser DevTools: Help > Toggle Developer Tools',
                'Check Console tab for JavaScript errors',
                'Check Network tab for failed resource loads',
                'Look for any uncaught exceptions',
                'Verify all template literal interpolations work',
            ]
        });
        
        return recommendations;
    }

    saveReport() {
        const reportPath = path.join(__dirname, '..', 'test-output', 'elk-debug-report.json');
        const reportDir = path.dirname(reportPath);
        
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            analysis: this.analysis,
            logs: this.logs.slice(-100), // Last 100 logs
            recommendations: this.getRecommendations(),
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        log(`\n📄 Detailed report saved to: ${reportPath}`, colors.blue);
        
        // Also save human-readable version
        const txtPath = reportPath.replace('.json', '.txt');
        const txtReport = this.generateTextReport();
        fs.writeFileSync(txtPath, txtReport);
        log(`📄 Text report saved to: ${txtPath}`, colors.blue);
    }

    generateTextReport() {
        let report = 'ELK RENDERING DEBUG REPORT\n';
        report += '=' .repeat(70) + '\n\n';
        report += `Generated: ${new Date().toISOString()}\n`;
        report += `Duration: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s\n\n`;
        
        report += 'FAILURE POINT\n';
        report += '-'.repeat(70) + '\n';
        report += `${this.analysis.failurePoint}\n\n`;
        
        report += 'CHECKPOINT STATUS\n';
        report += '-'.repeat(70) + '\n';
        for (const [key, value] of Object.entries(this.analysis.elkCheckpoints)) {
            report += `${value ? '✓' : '✗'} ${key}\n`;
        }
        report += '\n';
        
        if (this.analysis.errors.length > 0) {
            report += 'ERRORS DETECTED\n';
            report += '-'.repeat(70) + '\n';
            this.analysis.errors.forEach(error => {
                report += `• ${error.type}\n`;
                report += `  ${error.line.substring(0, 200)}\n\n`;
            });
        }
        
        report += 'RECOMMENDATIONS\n';
        report += '-'.repeat(70) + '\n';
        const recommendations = this.getRecommendations();
        recommendations.forEach((rec, idx) => {
            report += `\n${idx + 1}. ${rec.title}\n`;
            rec.actions.forEach(action => {
                report += `   • ${action}\n`;
            });
        });
        
        return report;
    }
}

// Main execution
async function main() {
    section('ELK RENDERING AUTOMATED DEBUGGER');
    log('This script will analyze ELK rendering issues automatically\n', colors.cyan);
    
    const session = new DebugSession();
    
    log('Step 1: Compiling extension...', colors.yellow);
    const compileResult = await runCommand('npm', ['run', 'compile']);
    if (!compileResult) {
        log('✗ Compilation failed', colors.red);
        return;
    }
    log('✓ Compilation successful\n', colors.green);
    
    log('Step 2: Launching Extension Development Host...', colors.yellow);
    log('Monitoring logs for 30 seconds...\n', colors.yellow);
    
    const vscodeProcess = spawn('node', ['./out/debug/runDebug.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: ['inherit', 'pipe', 'pipe'],
    });
    
    vscodeProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                session.addLog(line);
            }
        });
    });
    
    vscodeProcess.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                session.addLog(line);
            }
        });
    });
    
    // Wait for analysis period
    await new Promise((resolve) => {
        setTimeout(() => {
            log('\n⏱️  Analysis period complete', colors.yellow);
            resolve();
        }, session.timeout);
    });
    
    // Kill the VS Code process
    vscodeProcess.kill('SIGTERM');
    
    // Generate diagnostics
    session.generateDiagnostics();
    
    log('\n' + '='.repeat(70), colors.cyan);
    log('Debug session complete. Check the reports for detailed analysis.', colors.cyan);
    log('='.repeat(70) + '\n', colors.cyan);
}

function runCommand(command, args) {
    return new Promise((resolve) => {
        const proc = spawn(command, args, {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit',
        });
        
        proc.on('close', (code) => {
            resolve(code === 0);
        });
    });
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        log(`\n✗ Fatal error: ${error.message}`, colors.red);
        console.error(error);
        process.exit(1);
    });
}

module.exports = { DebugSession };
