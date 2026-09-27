const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

function telemetryModule(environment = process.env, format = 'cjs') {
  const connectionString = environment.SYSML_TELEMETRY_CONNECTION_STRING?.trim() || '';
  if (!connectionString && environment.SYSML_TELEMETRY_REQUIRED === '1') {
    throw new Error('SYSML_TELEMETRY_CONNECTION_STRING is required for release packaging');
  }
  if (connectionString) {
    const fields = new Map(connectionString.split(';').filter(Boolean).map(field => {
      const separator = field.indexOf('=');
      return [field.slice(0, separator).toLowerCase(), field.slice(separator + 1)];
    }));
    const endpoint = new URL(fields.get('ingestionendpoint') || '');
    if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(fields.get('instrumentationkey') || '')
      || endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.port
      || !/^westeurope(?:-[\da-z]+)?\.in\.applicationinsights\.azure\.com$/.test(endpoint.hostname)
      || endpoint.pathname !== '/' || endpoint.search || endpoint.hash) {
      throw new Error('Invalid West Europe Application Insights connection string');
    }
  }
  const destinations = JSON.stringify({ development: '', production: connectionString });
  return format === 'esm'
    ? `export const telemetryDestinations = ${destinations};\n`
    : `exports.telemetryDestinations = ${destinations};\n`;
}

module.exports = { telemetryModule };

if (require.main === module) {
  const output = telemetryModule();
  const directory = join(__dirname, '..', 'out', 'telemetry');
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'destinations.js'), output);
}
