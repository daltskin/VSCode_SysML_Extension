#!/usr/bin/env node
/**
 * Debug script to check what elements are parsed from SimpleVehicleModel.sysml
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');

// Mock vscode - MUST BE DONE BEFORE ANY OTHER REQUIRES
const mockVscode = {
    Range: class Range {
        constructor(startLine, startChar, endLine, endChar) {
            this.start = { line: startLine, character: startChar };
            this.end = { line: endLine, character: endChar };
        }
    },
    Position: class Position {
        constructor(line, character) {
            this.line = line;
            this.character = character;
        }
    },
    DiagnosticSeverity: {
        Error: 0,
        Warning: 1,
        Information: 2,
        Hint: 3
    }
};

// Override require to intercept 'vscode'
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'vscode') {
        return mockVscode;
    }
    return originalRequire.apply(this, arguments);
};

// Now load the parser
const { ANTLRSysMLParser } = require('../out/parser/antlrSysMLParser');

const sampleFile = path.join(__dirname, '../samples/SysML v2 Spec Annex A SimpleVehicleModel.sysml');
const content = fs.readFileSync(sampleFile, 'utf-8');

// Create a mock TextDocument
const mockDocument = {
    getText: () => content,
    uri: { fsPath: sampleFile },
    fileName: sampleFile
};

console.log('=== Parsing SimpleVehicleModel.sysml with ANTLRSysMLParser ===');
console.log(`File: ${content.length} chars, ${content.split('\n').length} lines`);
console.log();

const parser = new ANTLRSysMLParser();
const elements = parser.parseDocument(mockDocument);

console.log('Total elements:', elements.length);

// Find VehicleConfigurations
const vc = elements.filter(e => e.name && e.name.includes('VehicleConfiguration'));
console.log('\nVehicleConfiguration* elements:', vc.length);
vc.forEach(e => console.log('  ', e.type, e.name, 'parent:', e.parent));

// Find vehicle_a
const va = elements.filter(e => e.name && (e.name === 'vehicle_a' || e.name === 'vehicle_b'));
console.log('\nvehicle_a/b elements:', va.length);
va.forEach(e => console.log('  ', e.type, e.name, 'parent:', e.parent));

// Find all packages
const pkgs = elements.filter(e => e.type === 'package');
console.log('\nPackages found:', pkgs.length);
pkgs.forEach(e => console.log('  ', e.name, 'parent:', e.parent || '(none)'));

// Count element types
const typeCounts = {};
// Recursively count all elements
function countElements(elems) {
    for (const elem of elems) {
        typeCounts[elem.type] = (typeCounts[elem.type] || 0) + 1;
        if (elem.children && elem.children.length > 0) {
            countElements(elem.children);
        }
    }
}
countElements(elements);
console.log('\nElement type counts:');
for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
}
