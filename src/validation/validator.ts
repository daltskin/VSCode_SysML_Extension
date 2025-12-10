import * as vscode from 'vscode';
import { SysMLElement, SysMLParser } from '../parser/sysmlParser';
import { DiagnosticFormatter } from '../resolver/diagnostics';

export class SysMLValidator {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private semanticDiagnostics: DiagnosticFormatter;

     
    constructor(private _parser: SysMLParser) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('sysml');
        this.semanticDiagnostics = new DiagnosticFormatter('sysml-semantic');
    }

    async validate(document: vscode.TextDocument): Promise<vscode.Diagnostic[]> {
        const diagnostics: vscode.Diagnostic[] = [];

        try {
            // Phase 3: Use semantic resolution for enhanced validation
            const resolutionResult = await this._parser.parseWithSemanticResolution(document);

            // Publish semantic diagnostics (type errors, validation errors)
            this.semanticDiagnostics.publish(document.uri, resolutionResult.diagnostics);

            // Convert enriched elements back to SysML elements for legacy validation
            const elements = this._parser.convertEnrichedToSysMLElements(resolutionResult.elements);

            // Run basic validation checks
            this.validateElements(elements, diagnostics, document);
            this.validateRelationships(diagnostics);
            this.validateSyntax(document, diagnostics);

            this.diagnosticCollection.set(document.uri, diagnostics);
        } catch (error) {
            // Log error but don't crash the extension
            const message = `Error during SysML validation: ${error instanceof Error ? error.message : 'Unknown error'}`;
            try {
                const { getOutputChannel } = require('../extension');
                getOutputChannel()?.appendLine(message);
            } catch {
                // Silently fail if output channel not available
            }
            vscode.window.showErrorMessage(`SysML validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return diagnostics;
    }

     
    private validateElements(elements: SysMLElement[], diagnostics: vscode.Diagnostic[], _document: vscode.TextDocument): void {
        const nameSet = new Set<string>();

        const checkElement = (element: SysMLElement) => {
            // Handle error elements from ANTLR syntax errors
            if (element.type === 'error') {
                const errorMessage = element.attributes.get('error') as string || element.name;

                // Check if this is an invalid identifier error and convert to the expected message
                if (errorMessage.includes('expecting IDENTIFIER') || errorMessage.includes('extraneous input') && /\d/.test(errorMessage)) {
                    diagnostics.push(new vscode.Diagnostic(
                        element.range,
                        'Invalid element name',
                        vscode.DiagnosticSeverity.Error
                    ));
                } else {
                    diagnostics.push(new vscode.Diagnostic(
                        element.range,
                        errorMessage,
                        vscode.DiagnosticSeverity.Error
                    ));
                }
                return;
            }

            if (nameSet.has(element.name)) {
                diagnostics.push(new vscode.Diagnostic(
                    element.range,
                    `Duplicate element name: ${element.name}`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
            nameSet.add(element.name);

            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(element.name)) {
                diagnostics.push(new vscode.Diagnostic(
                    element.range,
                    `Invalid element name: ${element.name}`,
                    vscode.DiagnosticSeverity.Error
                ));
            }

            element.children.forEach(checkElement);
        };

        elements.forEach(checkElement);
    }

    private validateRelationships(diagnostics: vscode.Diagnostic[]): void {
        const relationships = this._parser.getRelationships();
        const elements = this._parser.getElements();

        for (const rel of relationships) {
            if (!elements.has(rel.target)) {
                const sourceElement = elements.get(rel.source);
                if (sourceElement) {
                    diagnostics.push(new vscode.Diagnostic(
                        sourceElement.range,
                        `Referenced element '${rel.target}' not found`,
                        vscode.DiagnosticSeverity.Error
                    ));
                }
            }
        }
    }

    private validateSyntax(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
        const text = document.getText();
        let braceCount = 0;
        let lineNumber = 0;

        for (const line of text.split('\n')) {
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;

            braceCount += openBraces - closeBraces;

            if (braceCount < 0) {
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineNumber, 0, lineNumber, line.length),
                    'Unmatched closing brace',
                    vscode.DiagnosticSeverity.Error
                ));
            }

            lineNumber++;
        }

        if (braceCount > 0) {
            diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 0),
                'Unclosed braces in document',
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    dispose(): void {
        this.diagnosticCollection.dispose();
        this.semanticDiagnostics.dispose();
    }
}
