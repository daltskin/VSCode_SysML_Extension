#!/usr/bin/env node
/**
 * Debug script to log all ANTLR parse errors for SimpleVehicleModel.sysml
 * Uses antlr4ts classes
 */
const fs = require('fs');
const path = require('path');
const { ANTLRInputStream, CommonTokenStream } = require('antlr4ts');
const { ParseTreeWalker } = require('antlr4ts/tree');

// Load the generated ANTLR classes
const { SysMLv2Lexer } = require('../out/parser/generated/grammar/SysMLv2Lexer');
const { SysMLv2 } = require('../out/parser/generated/grammar/SysMLv2');

// Read the test file
const sampleFile = path.join(__dirname, '../samples/SysML v2 Spec Annex A SimpleVehicleModel.sysml');
const content = fs.readFileSync(sampleFile, 'utf-8');

console.log('=== Parsing SimpleVehicleModel.sysml ===');
console.log(`File size: ${content.length} chars, ${content.split('\n').length} lines`);
console.log();

// Create a custom error listener that logs all errors
class DebugErrorListener {
    constructor() {
        this.errors = [];
    }

    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
        const error = `Line ${line}:${charPositionInLine} - ${msg}`;
        this.errors.push({ line, charPositionInLine, msg });
        console.log(`[PARSE ERROR] ${error}`);
    }

    reportAmbiguity() {}
    reportAttemptingFullContext() {}
    reportContextSensitivity() {}
}

// Create input stream and lexer
const inputStream = new ANTLRInputStream(content);
const lexer = new SysMLv2Lexer(inputStream);

// Add error listener to lexer
const lexerErrorListener = new DebugErrorListener();
lexer.removeErrorListeners();
lexer.addErrorListener(lexerErrorListener);

// Create parser
const tokenStream = new CommonTokenStream(lexer);
const parser = new SysMLv2(tokenStream);

// Add error listener to parser
const parserErrorListener = new DebugErrorListener();
parser.removeErrorListeners();
parser.addErrorListener(parserErrorListener);

console.log('Starting parse...\n');

// Parse the file
const tree = parser.model();

console.log();
console.log('=== Parse Results ===');
console.log(`Lexer errors: ${lexerErrorListener.errors.length}`);
console.log(`Parser errors: ${parserErrorListener.errors.length}`);
console.log(`Total errors: ${lexerErrorListener.errors.length + parserErrorListener.errors.length}`);

// Group errors by line
const errorsByLine = {};
for (const err of parserErrorListener.errors) {
    if (!errorsByLine[err.line]) {
        errorsByLine[err.line] = [];
    }
    errorsByLine[err.line].push(err);
}

console.log(`\nUnique lines with errors: ${Object.keys(errorsByLine).length}`);

// Show first 10 error lines
console.log('\nFirst 10 error lines:');
const sortedLines = Object.keys(errorsByLine).map(Number).sort((a, b) => a - b);
for (let i = 0; i < Math.min(10, sortedLines.length); i++) {
    const lineNum = sortedLines[i];
    console.log(`  Line ${lineNum}: ${errorsByLine[lineNum].length} error(s)`);
    console.log(`    ${errorsByLine[lineNum][0].msg.substring(0, 100)}...`);
}
