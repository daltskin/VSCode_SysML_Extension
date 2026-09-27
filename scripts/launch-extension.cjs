const { execFileSync, spawnSync } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

function checkInspectorPort(port = 6008) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', () => reject(new Error(
            `Inspector port ${port} is unavailable. Stop the previous debug session and close its development host.`
        )));
        server.listen(port, '127.0.0.1', () => server.close(resolve));
    });
}

function launchArguments(root, inspect = false) {
    const inspector = inspect ? ['--inspect-brk-extensions=6008'] : [];
    const workspacePath = path.join(root, '.vscode', 'extension-development.code-workspace');
    return [workspacePath, '--new-window',
        `--extensionDevelopmentPath=${root}`,
        ...inspector];
}

function desktopLauncher(distro) {
    if (!distro) return 'code';
    const candidates = execFileSync('cmd.exe', ['/d', '/c', 'where code'], {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim().split(/\r?\n/);
    const command = candidates.find(candidate => /code(?:-insiders)?\.cmd$/i.test(candidate));
    if (!command) throw new Error('Windows VS Code was not found on PATH.');
    const windowsPath = command.replace(/\.cmd$/i, '');
    return execFileSync('wslpath', ['-u', windowsPath], { encoding: 'utf8' }).trim();
}

async function main() {
    try {
        const root = path.resolve(__dirname, '..');
        const distro = process.env.WSL_DISTRO_NAME;
        const inspect = process.argv.includes('--inspect');
        if (inspect) await checkInspectorPort();
        const result = spawnSync(desktopLauncher(distro),
            launchArguments(root, inspect), {
            stdio: 'inherit', shell: process.platform === 'win32',
        });
        if (result.error) throw result.error;
        if (result.status !== 0) throw new Error(`VS Code launcher exited with ${result.status}.`);
        console.log('Development host launch requested with the local extension and samples folder.');
    } catch (error) {
        console.error(`Unable to launch the development extension: ${error.message}`);
        process.exitCode = 1;
    }
}

if (require.main === module) void main();

module.exports = { launchArguments, checkInspectorPort };
