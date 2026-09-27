import * as assert from 'assert';
import { setImmediate } from 'node:timers';
import type { TelemetryLogger, TelemetrySender } from 'vscode';
import { TelemetryService } from '../telemetry/telemetryService';
import { UsageIdentityStore } from '../telemetry/usageIdentity';

const connectionString = 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
  + 'IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/';

function harness(level: 'all' | 'error' | 'crash' | 'off' = 'all', enabled = true) {
  const requests: NonNullable<Parameters<typeof globalThis.fetch>[1]>[] = [];
  let storedId: string | undefined;
  let randomCalls = 0;
  const identity = new UsageIdentityStore({
    read: () => storedId,
    write: async value => { storedId = value; },
  }, () => `00000000-0000-4000-8000-${String(++randomCalls).padStart(12, '0')}`);
  let sender: TelemetrySender;
  let changed = () => {};
  const permissions = { enabled, level };
  const logger = {
    get isUsageEnabled() { return permissions.level === 'all'; },
    get isErrorsEnabled() { return ['all', 'error'].includes(permissions.level); },
    onDidChangeEnableStates: (listener: () => void) => {
      changed = listener;
      return { dispose() {} };
    },
    logUsage: (name: string, data: Record<string, unknown>) =>
      sender.sendEventData(`JamieD.sysml-v2-support/${name}`, data),
    logError: (name: string, data: Record<string, unknown>) =>
      sender.sendEventData(`JamieD.sysml-v2-support/${name}`, data),
    dispose() {},
  } as unknown as TelemetryLogger;
  const service = new TelemetryService({
    extensionId: 'JamieD.sysml-v2-support',
    identity,
    connectionString, enabled: () => permissions.enabled,
    metadata: { extensionVersion: '0.49.0', lspVersion: '0.30.0', vscodeVersion: '1.125.0',
      platform: 'linux', host: 'desktop' },
    createLogger: (supplied, options) => {
      sender = supplied;
      assert.deepStrictEqual(options,
        { ignoreBuiltInCommonProperties: true, ignoreUnhandledErrors: true });
      return logger;
    },
    fetch: async (_url, options) => {
      assert.ok(options);
      requests.push(options);
      return new globalThis.Response('', { status: 200 });
    },
  });
  return { service, requests, permissions, identity, storedId: () => storedId,
    changed: () => changed(), sender: () => sender };
}

const tick = () => new Promise<void>(resolve => setImmediate(resolve));

suite('Telemetry privacy and consent', () => {
  for (const level of ['all', 'error', 'crash', 'off'] as const) {
    for (const enabled of [true, false]) {
      test(`${level}, extension enabled=${enabled}`, async () => {
        const state = harness(level, enabled);
        state.service.activated(10);
        state.service.error('language', 'start', 'start-failed');
        await tick();
        assert.strictEqual(state.requests.length,
          enabled ? level === 'all' ? 2 : level === 'error' ? 1 : 0 : 0);
        await state.identity.settled();
        assert.strictEqual(!!state.storedId(), enabled && level === 'all');
        if (level === 'error' && state.requests.length) {
          assert.deepStrictEqual(JSON.parse(state.requests[0].body as string).tags,
            { 'ai.location.ip': '0.0.0.0' });
        }
        state.service.dispose();
      });
    }
  }

  test('rejects sensitive content, arbitrary names, raw errors and unknown properties', async () => {
    const state = harness();
    const sensitive = '/home/private/model.sysml user@example.com SecretRequirement';
    state.service.operation('visualizer', 'change-view', 'success', 5, sensitive);
    state.sender().sendEventData(sensitive, { action: 'change-view', outcome: 'success' });
    state.sender().sendEventData('JamieD.sysml-v2-support/sysml.visualizer.operation', {
      action: 'change-view', outcome: 'success', model: sensitive,
    });
    state.sender().sendErrorData(new Error(sensitive));
    state.service.activated(Number.NaN);
    await tick();
    assert.strictEqual(state.requests.length, 0);
    state.service.dispose();
  });

  test('sends only the documented envelope and omits automatic identifiers', async () => {
    const state = harness();
    state.service.operation('visualizer', 'change-view', 'success', 12.6, 'elk');
    await tick();
    const request = state.requests[0];
    const envelope = JSON.parse(request.body as string);
    assert.deepStrictEqual(envelope.tags, { 'ai.location.ip': '0.0.0.0',
      'ai.user.id': '00000000-0000-4000-8000-000000000001',
      'ai.session.id': '00000000-0000-4000-8000-000000000002' });
    assert.deepStrictEqual(envelope.data.baseData, {
      ver: 2, name: 'sysml.visualizer.operation',
      properties: { action: 'change-view', outcome: 'success', view: 'elk', schemaVersion: '2',
        extensionVersion: '0.49.0', lspVersion: '0.30.0', vscodeVersion: '1.125.0',
        host: 'desktop', platform: 'linux' }, measurements: { durationMs: 13, sequence: 1 },
    });
    assert.strictEqual(request.credentials, 'omit');
    assert.strictEqual(request.redirect, 'error');
    state.service.dispose();
  });

  test('rechecks permission immediately before dispatch and does not replay after re-enable', async () => {
    const state = harness();
    state.service.activated(10);
    state.permissions.enabled = false;
    state.service.permissionsChanged();
    await state.identity.settled();
    assert.strictEqual(state.storedId(), undefined);
    await tick();
    assert.strictEqual(state.requests.length, 0);
    state.permissions.enabled = true;
    await tick();
    assert.strictEqual(state.requests.length, 0);
    state.service.dispose();
  });

  test('aborts sent requests when global permission changes', async () => {
    const state = harness();
    state.service.activated(10);
    await Promise.resolve();
    await Promise.resolve();
    state.permissions.level = 'off';
    state.changed();
    assert.strictEqual(state.requests[0].signal?.aborted, true);
    state.service.dispose();
  });

  test('disposal never flushes pending events', async () => {
    const state = harness();
    state.service.activated(10);
    state.service.dispose();
    await tick();
    assert.strictEqual(state.requests.length, 0);
  });

  test('bounds outstanding requests and drops excess events', async () => {
    const state = harness();
    for (let index = 0; index < 100; index++) state.service.activated(10);
    await tick();
    assert.strictEqual(state.requests.length, 2);
    state.service.dispose();
  });
});
