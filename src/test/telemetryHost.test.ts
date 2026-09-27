import * as vscode from 'vscode';
import { TelemetryService } from '../telemetry/telemetryService';

suite('Native telemetry logger contract', () => {
  test('uses real host permissions, prefixes and sanitisation with an in-memory sender', async function () {
    if (typeof vscode.env?.createTelemetryLogger !== 'function') this.skip();
    const extension = vscode.extensions.getExtension('JamieD.sysml-v2-support');
    if (!extension) throw new Error('Extension not installed in test host');
    const received: string[] = [];
    const nativeEvents: string[] = [];
    const baseline = vscode.env.createTelemetryLogger({
      sendEventData: name => { nativeEvents.push(name); },
      sendErrorData: () => undefined,
    }, { ignoreBuiltInCommonProperties: true, ignoreUnhandledErrors: true });
    let usageEnabled = false;
    let errorsEnabled = false;
    const service = new TelemetryService({
      extensionId: extension.id,
      connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
        + 'IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/',
      metadata: { extensionVersion: '0.49.0', lspVersion: '0.30.0', vscodeVersion: vscode.version,
        host: 'web', platform: 'web' },
      enabled: () => true,
      createLogger: (sender, options) => {
        const logger = vscode.env.createTelemetryLogger(sender, options);
        usageEnabled = logger.isUsageEnabled;
        errorsEnabled = logger.isErrorsEnabled;
        return logger;
      },
      fetch: async (_url, options) => {
        received.push(String(options?.body));
        return new globalThis.Response('', { status: 200 });
      },
    });
    try {
      baseline.logUsage('sysml.extension.activated', { durationMs: 10 });
      baseline.logError('sysml.error', { component: 'language', operation: 'start', code: 'start-failed' });
      service.activated(10);
      service.error('language', 'start', 'start-failed');
      await new Promise(resolve => setTimeout(resolve, 0));
      if (nativeEvents.length > Number(usageEnabled) + Number(errorsEnabled)) {
        throw new Error('Native logger bypassed category permissions');
      }
      if (received.length !== nativeEvents.length) {
        throw new Error(`Native logger and transport differ: ${nativeEvents.join(', ')}; received=${received.length}`);
      }
      for (const body of received) {
        if (/common\.|machineId|sessionId|roleInstance/.test(body)) {
          throw new Error('Automatic host metadata reached the sender');
        }
      }
    } finally {
      baseline.dispose();
      service.dispose();
    }
  });
});
