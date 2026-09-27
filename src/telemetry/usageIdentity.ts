export interface IdentityStorage {
  read(): unknown;
  write(value: string | undefined): PromiseLike<void>;
}

export interface UsageIdentity {
  readonly installationId: string;
  readonly sessionId: string;
  readonly sequence: number;
}

const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/** Locally persisted pseudonym, never derived from a machine, account or workspace. */
export class UsageIdentityStore {
  private installationId: string | undefined;
  private sessionId: string | undefined;
  private sequence = 0;
  private canReadPersisted = true;
  private writes = Promise.resolve();

  constructor(private readonly storage: IdentityStorage, private readonly randomId: () => string) {}

  /** Called only when the authoritative usage gate permits an event. */
  next(): UsageIdentity | undefined {
    try {
      if (!this.installationId) {
        const saved = this.canReadPersisted ? this.storage.read() : undefined;
        this.installationId = typeof saved === 'string' && uuidPattern.test(saved)
          ? saved : this.randomId();
        if (!uuidPattern.test(this.installationId)) {
          this.installationId = undefined;
          return;
        }
        this.write(this.installationId);
      }
      this.sessionId ??= this.randomId();
      if (!uuidPattern.test(this.sessionId)) return;
      return { installationId: this.installationId, sessionId: this.sessionId,
        sequence: ++this.sequence };
    } catch {
      return;
    }
  }

  /** Clear on opt-out, serialising deletion after any pending persistence. */
  clear(): void {
    this.canReadPersisted = false;
    this.installationId = undefined;
    this.sessionId = undefined;
    this.sequence = 0;
    this.write(undefined);
  }

  private write(value: string | undefined): void {
    this.writes = this.writes.then(() => this.storage.write(value)).then(() => undefined)
      .catch(() => undefined);
  }

  /** Await local persistence in tests; never flushes network data. */
  settled(): Promise<void> {
    return this.writes;
  }
}
