import * as vscode from 'vscode';
import { SysMLParser } from '../parser/sysmlParser';

export class SysMLDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
     
    constructor(private _parser: SysMLParser) {}

    async provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        if (token.isCancellationRequested) {
            return [];
        }

        // Phase 3: Use semantic resolution for enhanced symbol information
        const resolutionResult = await this._parser.parseWithSemanticResolution(document);
        const elements = this._parser.convertEnrichedToSysMLElements(resolutionResult.elements);

        return this.buildDocumentSymbols(elements);
    }

    private buildDocumentSymbols(elements: import('../parser/sysmlParser').SysMLElement[]): vscode.DocumentSymbol[] {
        return elements.map(element => {
            const symbol = new vscode.DocumentSymbol(
                element.name,
                element.type,
                this.getSymbolKind(element.type),
                element.range,
                element.range
            );

            if (element.children.length > 0) {
                symbol.children = this.buildDocumentSymbols(element.children);
            }

            return symbol;
        });
    }

    private getSymbolKind(type: string): vscode.SymbolKind {
        const kindMap: { [key: string]: vscode.SymbolKind } = {
            'package': vscode.SymbolKind.Package,
            'part': vscode.SymbolKind.Class,
            'port': vscode.SymbolKind.Interface,
            'action': vscode.SymbolKind.Method,
            'state': vscode.SymbolKind.Enum,
            'requirement': vscode.SymbolKind.Object,
            'attribute': vscode.SymbolKind.Property,
            'reference': vscode.SymbolKind.Property,
            'enum': vscode.SymbolKind.Enum,
            'datatype': vscode.SymbolKind.Struct,
            'constraint': vscode.SymbolKind.Constant
        };

        return kindMap[type] || vscode.SymbolKind.Variable;
    }
}
