import * as vscode from 'vscode';
import { SysMLParser } from '../parser/sysmlParser';

export class SysMLDefinitionProvider implements vscode.DefinitionProvider {
     
    constructor(private _parser: SysMLParser) {}

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Definition | vscode.LocationLink[] | null> {
        if (token.isCancellationRequested) {
            return null;
        }
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);

        // Phase 3: Still use findElement for now (could be enhanced with library lookups)
        const element = this._parser.findElement(word);

        if (element) {
            return new vscode.Location(document.uri, element.range);
        }

        return null;
    }
}
