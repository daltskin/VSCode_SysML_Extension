/**
 * Diagnostic formatter for semantic validation errors
 */

import * as vscode from 'vscode';
import { DiagnosticSeverity, SemanticDiagnostic } from './types';

/**
 * Converts semantic diagnostics to VS Code diagnostics
 */
export class DiagnosticFormatter {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(name: string) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection(name);
    }

    /**
     * Publish diagnostics for a document
     */
    public publish(uri: vscode.Uri, diagnostics: SemanticDiagnostic[]): void {
        const vscodeDiagnostics = diagnostics.map(d => this.toVsCodeDiagnostic(d));
        this.diagnosticCollection.set(uri, vscodeDiagnostics);
    }

    /**
     * Clear diagnostics for a document
     */
    public clear(uri: vscode.Uri): void {
        this.diagnosticCollection.delete(uri);
    }

    /**
     * Clear all diagnostics
     */
    public clearAll(): void {
        this.diagnosticCollection.clear();
    }

    /**
     * Dispose diagnostic collection
     */
    public dispose(): void {
        this.diagnosticCollection.dispose();
    }

    /**
     * Convert semantic diagnostic to VS Code diagnostic
     */
    private toVsCodeDiagnostic(diagnostic: SemanticDiagnostic): vscode.Diagnostic {
        const vscodeDiagnostic = new vscode.Diagnostic(
            diagnostic.range,
            diagnostic.message,
            this.toVsCodeSeverity(diagnostic.severity)
        );

        vscodeDiagnostic.code = diagnostic.code;
        vscodeDiagnostic.source = 'SysML';

        if (diagnostic.relatedInfo && diagnostic.relatedInfo.length > 0) {
            vscodeDiagnostic.relatedInformation = diagnostic.relatedInfo.map(info =>
                new vscode.DiagnosticRelatedInformation(
                    new vscode.Location(vscode.Uri.file(''), info.location || diagnostic.range),
                    info.message
                )
            );
        }

        return vscodeDiagnostic;
    }

    /**
     * Convert semantic severity to VS Code severity
     */
    private toVsCodeSeverity(severity: DiagnosticSeverity): vscode.DiagnosticSeverity {
        switch (severity) {
            case DiagnosticSeverity.Error:
                return vscode.DiagnosticSeverity.Error;
            case DiagnosticSeverity.Warning:
                return vscode.DiagnosticSeverity.Warning;
            case DiagnosticSeverity.Info:
                return vscode.DiagnosticSeverity.Information;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }
}

/**
 * Factory for creating common diagnostic messages
 */
export class DiagnosticFactory {
    /**
     * Create unresolved type diagnostic
     */
    public static unresolvedType(
        elementName: string,
        typeName: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'unresolved-type',
            message: `Cannot resolve type '${typeName}' for element '${elementName}'`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName
        };
    }

    /**
     * Create invalid specialization diagnostic
     */
    public static invalidSpecialization(
        elementName: string,
        childType: string,
        parentType: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'invalid-specialization',
            message: `Type '${childType}' cannot specialize '${parentType}'`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName,
            relatedInfo: [{
                message: `'${childType}' is not a subtype of '${parentType}'`
            }]
        };
    }

    /**
     * Create invalid port diagnostic
     */
    public static invalidPort(
        elementName: string,
        portName: string,
        reason: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'invalid-port',
            message: `Invalid port '${portName}': ${reason}`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName
        };
    }

    /**
     * Create cardinality violation diagnostic
     */
    public static cardinalityViolation(
        elementName: string,
        featureName: string,
        expected: string,
        actual: number,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'cardinality-violation',
            message: `Feature '${featureName}' expects ${expected} but found ${actual}`,
            severity: DiagnosticSeverity.Warning,
            range,
            elementName
        };
    }

    /**
     * Create missing required feature diagnostic
     */
    public static missingRequiredFeature(
        elementName: string,
        featureName: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'missing-required-feature',
            message: `Required feature '${featureName}' is missing`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName
        };
    }

    /**
     * Create invalid connection diagnostic
     */
    public static invalidConnection(
        source: string,
        target: string,
        reason: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'invalid-connection',
            message: `Invalid connection from '${source}' to '${target}': ${reason}`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName: source
        };
    }

    /**
     * Create type mismatch diagnostic
     */
    public static typeMismatch(
        elementName: string,
        expected: string,
        actual: string,
        range: vscode.Range
    ): SemanticDiagnostic {
        return {
            code: 'type-mismatch',
            message: `Type mismatch: expected '${expected}', got '${actual}'`,
            severity: DiagnosticSeverity.Error,
            range,
            elementName
        };
    }

    /**
     * Create deprecated element warning
     */
    public static deprecatedElement(
        elementName: string,
        replacement: string | null,
        range: vscode.Range
    ): SemanticDiagnostic {
        const message = replacement
            ? `Element '${elementName}' is deprecated. Use '${replacement}' instead.`
            : `Element '${elementName}' is deprecated.`;

        return {
            code: 'deprecated-element',
            message,
            severity: DiagnosticSeverity.Warning,
            range,
            elementName
        };
    }
}
