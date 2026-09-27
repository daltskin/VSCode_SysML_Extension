const assert = require('node:assert/strict');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const { telemetryModule } = require('./telemetry-config.cjs');

const connectionString = 'InstrumentationKey=11111111-1111-4111-8111-111111111111;'
  + 'IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;';

test('unconfigured local builds have no destination', () => {
  const context = { exports: {} };
  runInNewContext(telemetryModule({}), context);
  assert.equal(context.exports.telemetryDestinations.production, '');
  assert.equal(context.exports.telemetryDestinations.development, '');
});

test('release packaging rejects absent or invalid destinations', () => {
  assert.throws(() => telemetryModule({ SYSML_TELEMETRY_REQUIRED: '1' }), /required/);
  for (const invalid of ['invalid', connectionString.replace('https:', 'http:'),
    connectionString.replace('westeurope-5', 'eastus'),
    connectionString.replace('.com/', '.com.evil.invalid/'),
    connectionString.replace('https://', 'https://user:password@'),
    connectionString.replace('.com/', '.com/path')]) {
    assert.throws(() => telemetryModule({ SYSML_TELEMETRY_CONNECTION_STRING: invalid }));
  }
});

test('desktop and browser embed the same production-only destination', async () => {
  const environment = { SYSML_TELEMETRY_CONNECTION_STRING: connectionString };
  const context = { exports: {} };
  runInNewContext(telemetryModule(environment), context);
  const browser = await import(`data:text/javascript,${encodeURIComponent(telemetryModule(environment, 'esm'))}`);
  assert.equal(context.exports.telemetryDestinations.production, connectionString);
  assert.equal(browser.telemetryDestinations.production, connectionString);
  assert.equal(context.exports.telemetryDestinations.development, '');
  assert.equal(browser.telemetryDestinations.development, '');
});
