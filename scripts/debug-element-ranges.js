/**
 * Debug script to show element ranges from the parser
 */
const { SysMLParser } = require('../out/parser/sysmlParser.js');
const fs = require('fs');

// Mock vscode module
const vscode = {
    Range: class Range {
        constructor(startLine, startChar, endLine, endChar) {
            this.start = { line: startLine, character: startChar };
            this.end = { line: endLine, character: endChar };
        }
    },
    Position: class Position {
        constructor(line, char) {
            this.line = line;
            this.character = char;
        }
    },
    window: { createOutputChannel: () => ({ appendLine: () => {} }) },
    DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2, Hint: 3 }
};

const filePath = process.argv[2] || 'samples/smart-home.sysml';
const content = fs.readFileSync(filePath, 'utf-8');
const parser = new SysMLParser(vscode);
const result = parser.parse(content);

function printElement(el, indent) {
    indent = indent || '';
    const range = el.range;
    console.log(indent + el.type + ' ' + el.name + ' @ line ' + (range.start.line + 1) + ':' + range.start.character + '-' + (range.end.line + 1) + ':' + range.end.character);

    el.children.forEach(function(child) { printElement(child, indent + '  '); });
}

console.log('Parsed elements from:', filePath);
console.log('---');
result.elements.forEach(function(el) { printElement(el); });
