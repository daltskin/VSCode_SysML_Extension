import { glob } from 'glob';
import Mocha from 'mocha';
import * as path from 'path';

export function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true,
        timeout: 10000
    });

    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((resolve, reject) => {
        glob('**/**.test.js', { cwd: testsRoot }).then((files) => {
            // Optional sharding/filtering: comma-separated list of test file basenames.
            // Example: SYSML_TEST_FILES="integration.test.js,visualizationPanel.test.js"
            const requestedFiles = (process.env.SYSML_TEST_FILES ?? '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            const filteredFiles = requestedFiles.length > 0
                ? files.filter(f => requestedFiles.some(req => f.endsWith(req)))
                : files;

            if (requestedFiles.length > 0 && filteredFiles.length === 0) {
                reject(new Error(`No tests matched SYSML_TEST_FILES=${process.env.SYSML_TEST_FILES}`));
                return;
            }

            filteredFiles.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                mocha.run(failures => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    } else {
                        resolve();
                    }
                });
            } catch (err) {

                console.error(err);
                reject(err);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
