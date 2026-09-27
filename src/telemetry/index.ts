import * as vscode from 'vscode';
import { telemetryDestinations } from './destinations';
import { TelemetryService, type TelemetryMetadata } from './telemetryService';
import { UsageIdentityStore } from './usageIdentity';

export let telemetry: TelemetryService | undefined;

/** Return coarse runtime metadata, never identifiers or workspace information. */
export function telemetryMetadata(context: vscode.ExtensionContext): TelemetryMetadata {
  const platform = typeof process === 'undefined' ? 'web' : process.platform;
  return {
    extensionVersion: context.extension.packageJSON.version,
    lspVersion: context.extension.packageJSON.dependencies['sysml-v2-lsp'],
    vscodeVersion: vscode.version,
    host: typeof process === 'undefined' ? 'web' : vscode.env.remoteName ? 'remote' : 'desktop',
    platform: platform === 'linux' || platform === 'win32' || platform === 'darwin'
      || platform === 'web' ? platform : 'other',
  };
}

/** Initialise the shared service; tests cannot select either ingestion destination. */
export function initializeTelemetry(context: vscode.ExtensionContext): void {
  telemetry?.dispose();
  telemetry = undefined;
  if (context.extensionMode === vscode.ExtensionMode.Test) return;
  const connectionString = context.extensionMode === vscode.ExtensionMode.Production
    ? telemetryDestinations.production : telemetryDestinations.development;
  if (!connectionString) return;
  try {
    const service = new TelemetryService({
      extensionId: context.extension.id, connectionString,
      metadata: telemetryMetadata(context),
      enabled: () => vscode.workspace.getConfiguration('sysml').get('telemetry.enabled', true),
      createLogger: (sender, options) => vscode.env.createTelemetryLogger(sender, options),
      fetch: (url, options) => globalThis.fetch(url, options),
      identity: new UsageIdentityStore({
        read: () => context.globalState.get('telemetry.installationId'),
        write: value => context.globalState.update('telemetry.installationId', value),
      }, () => globalThis.crypto.randomUUID()),
    });
    telemetry = service;
    context.subscriptions.push(service, vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('sysml.telemetry.enabled')) service.permissionsChanged();
    }), new vscode.Disposable(() => { if (telemetry === service) telemetry = undefined; }));
  } catch {
    telemetry = undefined;
  }
}
