import * as vscode from 'vscode';

export class SysMLFormatter implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        // Check for cancellation before processing
        if (token.isCancellationRequested) {
            return [];
        }

        const edits: vscode.TextEdit[] = [];
        const indentSize = vscode.workspace.getConfiguration('sysml').get<number>('format.indentSize', 4);
        const useSpaces = options.insertSpaces;
        const indentString = useSpaces ? ' '.repeat(indentSize) : '\t';

        let indentLevel = 0;
        const formattedLines: string[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text.trim();

            if (!text) {
                formattedLines.push('');
                continue;
            }

            if (text.includes('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const indentedLine = indentString.repeat(indentLevel) + text;
            formattedLines.push(indentedLine);

            if (text.includes('{') && !text.includes('}')) {
                indentLevel++;
            }
        }

        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );

        edits.push(vscode.TextEdit.replace(fullRange, formattedLines.join('\n')));

        return edits;
    }
}
