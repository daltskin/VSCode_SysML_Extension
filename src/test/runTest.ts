import { runTests } from '@vscode/test-electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const runId = `${process.pid}-${Date.now()}`;
        const testRoot = path.join(os.tmpdir(), 'sysml-vscode-test', runId);
        const userDataDir = path.join(testRoot, 'user-data');
        const extensionsDir = path.join(testRoot, 'extensions');

        fs.mkdirSync(userDataDir, { recursive: true });
        fs.mkdirSync(extensionsDir, { recursive: true });

        // Markdown preview integration needs a workspace folder containing the sample model.
        const workspaceDir = path.join(testRoot, 'workspace');
        fs.cpSync(path.join(extensionDevelopmentPath, 'samples', 'Camera Example'),
            path.join(workspaceDir, 'Camera Example'), { recursive: true });

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                workspaceDir,
                '--user-data-dir', userDataDir,
                '--extensions-dir', extensionsDir,
            ],
        });
    } catch (err) {

        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();
