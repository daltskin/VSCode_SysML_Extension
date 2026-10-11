import * as vscode from 'vscode';

export const defaultScanSkipDirectories = [
    'node_modules', '.git', '.settings', 'temp', 'test', 'tests',
    'out', 'dist', 'build', 'coverage', '.venv', '__pycache__',
] as const;

/** Discover the same workspace sources as the language server's startup scan. */
export async function findWorkspaceModelFiles(token?: vscode.CancellationToken): Promise<vscode.Uri[]> {
    const configured = vscode.workspace.getConfiguration('sysml.scan').get<unknown>('skipDirectories');
    const skipped = new Set(Array.isArray(configured)
        && configured.every(name => typeof name === 'string') ? configured : defaultScanSkipDirectories);
    const folders = [...vscode.workspace.workspaceFolders ?? []]
        .sort((left, right) => right.uri.path.length - left.uri.path.length);
    const files = await vscode.workspace.findFiles('**/*.{sysml,kerml}', undefined, undefined, token);
    return files.filter(uri => {
        const folder = folders.find(candidate => candidate.uri.scheme === uri.scheme
            && candidate.uri.authority === uri.authority
            && uri.path.startsWith(`${candidate.uri.path.replace(/\/$/, '')}/`));
        const relative = folder ? uri.path.slice(folder.uri.path.replace(/\/$/, '').length + 1) : uri.path;
        return !relative.split('/').slice(0, -1).some(directory => skipped.has(directory));
    });
}
