/**
 * Mocha entry point for web integration tests.
 *
 * `@vscode/test-web` loads this module (bundled to
 * `dist/web/test/suite/index.js`) inside the browser extension host and
 * calls `run()`. We use Mocha's browser build, register the test files,
 * and resolve/reject based on the failure count.
 */
import 'mocha/mocha';

// The Mocha browser build attaches a global `mocha` and `Mocha`.
declare const mocha: {
    setup(opts: unknown): void;
    run(cb: (failures: number) => void): void;
};

export function run(): Promise<void> {
    return new Promise((resolve, reject) => {
        mocha.setup({ ui: 'tdd', reporter: undefined, timeout: 30000 });

        // Bundled by esbuild: importing pulls the test suite into the bundle
        // and registers the `suite(...)` / `test(...)` callbacks with Mocha.
        require('./extension.test');

        try {
            mocha.run((failures: number) => {
                if (failures > 0) {
                    reject(new Error(`${failures} web test(s) failed.`));
                } else {
                    resolve();
                }
            });
        } catch (err) {
            reject(err as Error);
        }
    });
}
