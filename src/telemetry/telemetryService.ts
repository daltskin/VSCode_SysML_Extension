import type {
    Disposable, TelemetryLogger, TelemetryLoggerOptions, TelemetrySender,
} from 'vscode';
import type { UsageIdentityStore } from './usageIdentity';

export const operations = {
  visualizer: ['change-view', 'export'],
  workbench: ['preview', 'apply', 'export'],
  explorer: ['change-mode'],
  language: ['start', 'restart', 'model'],
} as const;

export type Component = keyof typeof operations;
export type Outcome = 'success' | 'cancelled' | 'rejected' | 'failure';
export type FailureCode = 'start-failed' | 'request-failed' | 'render-failed'
  | 'export-failed' | 'edit-failed';
export type Panel = 'visualizer' | 'workbench' | 'dashboard' | 'inspector' | 'sysrunner';

export interface ModelTiming {
  readonly parseTimeMs: number;
  readonly modelBuildTimeMs: number;
}

const views = ['elk', 'ibd', 'activity', 'state', 'sequence', 'usecase', 'tree',
  'package', 'graph', 'hierarchy'];
const outcomes: readonly string[] = ['success', 'cancelled', 'rejected', 'failure'];
const failureCodes: readonly string[] = [
  'start-failed', 'request-failed', 'render-failed', 'export-failed', 'edit-failed',
];
const panels: readonly string[] = ['visualizer', 'workbench', 'dashboard', 'inspector', 'sysrunner'];
const modelSampleIntervalMs = 60_000;

export interface TelemetryMetadata {
  readonly extensionVersion: string;
  readonly lspVersion: string;
  readonly vscodeVersion: string;
  readonly host: 'desktop' | 'remote' | 'web';
  readonly platform: 'linux' | 'win32' | 'darwin' | 'web' | 'other';
}

export interface TelemetryOptions {
  readonly extensionId: string;
  readonly connectionString: string;
  readonly metadata: TelemetryMetadata;
  readonly enabled: () => boolean;
  readonly createLogger: (sender: TelemetrySender, options: TelemetryLoggerOptions) => TelemetryLogger;
  readonly fetch: typeof globalThis.fetch;
  readonly now?: () => number;
  readonly identity?: UsageIdentityStore;
}

interface Destination {
  readonly key: string;
  readonly endpoint: string;
}

interface ApprovedEvent {
  readonly properties: Record<string, string>;
  readonly measurements: Record<string, number>;
}

function destination(connectionString: string): Destination | undefined {
  const fields = new Map(connectionString.split(';').map(field => {
    const separator = field.indexOf('=');
    return [field.slice(0, separator).toLowerCase(), field.slice(separator + 1)];
  }));
  const key = fields.get('instrumentationkey');
  if (!key || !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(key)) return;
  try {
    const endpoint = new globalThis.URL(fields.get('ingestionendpoint') ?? '');
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password
      || endpoint.port || !endpoint.hostname.endsWith('.in.applicationinsights.azure.com')) return;
    return { key, endpoint: `${endpoint.origin}/v2/track` };
  } catch {
    return;
  }
}

function approve(name: string, data: unknown): ApprovedEvent | undefined {
  if (!data || typeof data !== 'object') return;
  const values = data as Record<string, unknown>;
  const properties: Record<string, string> = {};
  const measurements: Record<string, number> = {};
  const accept = (key: string, allowed: readonly string[]): boolean => {
    const value = values[key];
    if (typeof value !== 'string' || !allowed.includes(value)) return false;
    properties[key] = value;
    return true;
  };
  if (name === 'sysml.extension.activated') {
    if (Object.keys(values).some(key => key !== 'durationMs')) return;
  } else if (name === 'sysml.panel.opened') {
    if (!accept('panel', panels)) return;
  } else if (name === 'sysml.error') {
    if (!accept('component', Object.keys(operations)) || !accept('code', failureCodes)) return;
    if (!accept('operation', operations[properties.component as Component])) return;
  } else {
    const component = Object.keys(operations).find(key => name === `sysml.${key}.operation`);
    if (!component || !accept('action', operations[component as Component])
      || !accept('outcome', outcomes)) return;
    if (values.view !== undefined && !accept('view', views)) return;
  }
  for (const key of ['parseTimeMs', 'modelBuildTimeMs'] as const) {
    if (values[key] === undefined) continue;
    if (name !== 'sysml.language.operation' || properties.action !== 'model'
      || typeof values[key] !== 'number' || !Number.isFinite(values[key])
      || values[key] < 0 || values[key] > 3_600_000) return;
    measurements[key] = Math.round(values[key]);
  }
  if (values.durationMs !== undefined) {
    if (typeof values.durationMs !== 'number' || !Number.isFinite(values.durationMs)
      || values.durationMs < 0 || values.durationMs > 3_600_000) return;
    measurements.durationMs = Math.round(values.durationMs);
  }
  if (Object.keys(values).some(key => !(key in properties) && !(key in measurements))) return;
  return { properties, measurements };
}

/** Consent-controlled, bounded, content-free Application Insights event sender. */
export class TelemetryService implements Disposable {
  private readonly logger: TelemetryLogger;
  private readonly subscription: Disposable;
  private readonly target: Destination | undefined;
  private readonly requests = new Set<AbortController>();
  private readonly now: () => number;
  private windowStart = 0;
  private usageCount = 0;
  private errorCount = 0;
  private lastModelSampleAt = Number.NEGATIVE_INFINITY;
  private disposed = false;

  constructor(private readonly options: TelemetryOptions) {
    this.target = destination(options.connectionString);
    this.now = options.now ?? Date.now;
    this.logger = options.createLogger({
      sendEventData: (name, data) => this.send(name, data),
      sendErrorData: () => undefined,
      flush: () => undefined,
    }, { ignoreBuiltInCommonProperties: true, ignoreUnhandledErrors: true });
    this.subscription = this.logger.onDidChangeEnableStates(() => this.permissionsChanged());
    if (!this.options.enabled() || !this.logger.isUsageEnabled) this.options.identity?.clear();
  }

  /** Drop in-flight work on either global or extension-specific permission changes. */
  permissionsChanged(): void {
    for (const request of this.requests) request.abort();
    this.requests.clear();
    if (!this.options.enabled() || !this.logger.isUsageEnabled) this.options.identity?.clear();
  }

  /** Record a completed activation, not an installation or a unique user. */
  activated(durationMs: number): void {
    this.record('sysml.extension.activated', { durationMs });
  }

  /** Record a built-in operation without accepting arbitrary feature data. */
  operation<ComponentName extends Component>(
    component: ComponentName, action: typeof operations[ComponentName][number],
    outcome: Outcome, durationMs?: number, view?: string,
  ): void {
    this.record(`sysml.${component}.operation`, {
      action, outcome, ...(durationMs === undefined ? {} : { durationMs }),
      ...(view === undefined ? {} : { view }),
    });
  }

  /** Record one rate-limited model request sample with server-reported timing breakdown. */
  modelOperation(outcome: Outcome, durationMs: number, timing?: ModelTiming): void {
    this.record('sysml.language.operation', {
      action: 'model', outcome, durationMs,
      ...(timing ? {
        parseTimeMs: timing.parseTimeMs,
        modelBuildTimeMs: timing.modelBuildTimeMs,
      } : {}),
    });
  }

  /** Record a built-in panel becoming available. */
  panelOpened(panel: Panel): void {
    this.record('sysml.panel.opened', { panel });
  }

  /** Record reviewed failure codes only; Error objects and messages are never accepted. */
  error<ComponentName extends Component>(
    component: ComponentName, operation: typeof operations[ComponentName][number], code: FailureCode,
  ): void {
    this.record('sysml.error', { component, operation, code });
  }

  private permitted(error: boolean): boolean {
    return !this.disposed && !!this.target && this.options.enabled()
      && (error ? this.logger.isErrorsEnabled : this.logger.isUsageEnabled);
  }

  private record(name: string, data: Record<string, unknown>): void {
    try {
      const error = name === 'sysml.error';
      if (!this.permitted(error) || !approve(name, data)) return;
      if (error) this.logger.logError(name, data);
      else this.logger.logUsage(name, data);
    } catch {
      return;
    }
  }

  private send(prefixedName: string, data: unknown): void {
    try {
      const prefix = `${this.options.extensionId}/`;
      if (!prefixedName.startsWith(prefix)) return;
      const name = prefixedName.slice(prefix.length);
      const error = name === 'sysml.error';
      const event = approve(name, data);
      const target = this.target;
      if (!target || !event || !this.permitted(error) || this.requests.size >= 2) return;
      const now = this.now();
      const isModelOperation = name === 'sysml.language.operation'
        && event.properties.action === 'model';
      if (isModelOperation && now - this.lastModelSampleAt < modelSampleIntervalMs) return;
      if (now - this.windowStart >= 60_000) {
        this.windowStart = now;
        this.usageCount = 0;
        this.errorCount = 0;
      }
      if (error ? this.errorCount >= 10 : this.usageCount >= 60) return;
      if (isModelOperation) this.lastModelSampleAt = now;
      if (error) this.errorCount++;
      else this.usageCount++;
      const metadata = this.options.metadata;
      const identity = error ? undefined : this.options.identity?.next();
      const version = (value: string) => value.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}/)?.[0] ?? 'unknown';
      const properties = {
        ...event.properties, schemaVersion: '2',
        extensionVersion: version(metadata.extensionVersion), lspVersion: version(metadata.lspVersion),
        vscodeVersion: version(metadata.vscodeVersion),
        host: ['desktop', 'remote', 'web'].includes(metadata.host) ? metadata.host : 'web',
        platform: ['linux', 'win32', 'darwin', 'web'].includes(metadata.platform)
          ? metadata.platform : 'other',
      };
      const body = JSON.stringify({
        name: 'Microsoft.ApplicationInsights.Event', time: new Date(now).toISOString(),
        iKey: target.key,
        tags: { 'ai.location.ip': '0.0.0.0', ...(identity ? {
          'ai.user.id': identity.installationId, 'ai.session.id': identity.sessionId,
        } : {}) },
        data: { baseType: 'EventData', baseData: {
          ver: 2, name, properties, measurements: {
            ...event.measurements, ...(identity ? { sequence: identity.sequence } : {}),
          },
        } },
      });
      const controller = new AbortController();
      this.requests.add(controller);
      const timeout = setTimeout(() => controller.abort(), 3_000);
      void Promise.resolve().then(() => {
        if (controller.signal.aborted || !this.permitted(error)) return;
        return this.options.fetch(target.endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
          credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
          signal: controller.signal,
        });
      }).catch(() => undefined).finally(() => {
        clearTimeout(timeout);
        this.requests.delete(controller);
      });
    } catch {
      return;
    }
  }

  /** Cancel without flushing or creating shutdown network traffic. */
  dispose(): void {
    this.disposed = true;
    this.permissionsChanged();
    this.subscription.dispose();
    this.logger.dispose();
  }
}
