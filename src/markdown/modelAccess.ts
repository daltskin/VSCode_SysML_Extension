import * as vscode from 'vscode';
import { MAX_MODEL_BYTES } from './markdownItPlugin';

/** Reject existing symbolic links anywhere in an export destination. */
export async function assertSafeOutputPath(uri: vscode.Uri): Promise<void> {
    let current = uri.with({ path: '/', query: '', fragment: '' });
    for (const segment of uri.path.split('/').filter(Boolean)) {
        current = vscode.Uri.joinPath(current, segment);
        let stat: vscode.FileStat;
        try {
            stat = await vscode.workspace.fs.stat(current);
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error
                && error.code === 'FileNotFound') return;
            throw error;
        }
        if (stat.type & vscode.FileType.SymbolicLink) {
            throw new Error('Symbolic links are not allowed in Markdown export paths.');
        }
    }
}

/** Bound preview file access, including symbolic-link boundaries. */
export async function openPreviewModel(
    uri: vscode.Uri, enforceSizeLimit = true,
): Promise<vscode.TextDocument> {
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    if (!folder) throw new Error('Model path is outside the workspace.');
    const relative = uri.path.slice(folder.uri.path.replace(/\/$/, '').length);
    let current = folder.uri;
    for (const segment of relative.split('/').filter(Boolean)) {
        current = vscode.Uri.joinPath(current, segment);
        const stat = await vscode.workspace.fs.stat(current);
        if (stat.type & vscode.FileType.SymbolicLink) {
            throw new Error('Symbolic links are not allowed in Markdown model paths.');
        }
        if (enforceSizeLimit && current.toString() === uri.toString() && stat.size > MAX_MODEL_BYTES) {
            throw new Error('Model exceeds the 2 MB preview limit.');
        }
    }
    const document = await vscode.workspace.openTextDocument(uri);
    if (enforceSizeLimit && document.getText().length > MAX_MODEL_BYTES) {
        throw new Error('Model exceeds the 2 MB preview limit.');
    }
    return document;
}
