import * as assert from 'assert';
import { UsageIdentityStore } from '../telemetry/usageIdentity';

suite('Pseudonymous usage identity', () => {
  test('persists installations, rotates sessions and numbers events in order', async () => {
    let stored: string | undefined;
    let generated = 0;
    const storage = { read: () => stored, write: async (value: string | undefined) => { stored = value; } };
    const random = () => `00000000-0000-4000-8000-${String(++generated).padStart(12, '0')}`;
    const first = new UsageIdentityStore(storage, random);
    const event = first.next();
    assert.ok(event);
    assert.strictEqual(first.next()?.sequence, 2);
    await first.settled();
    const returning = new UsageIdentityStore(storage, random).next();
    assert.strictEqual(returning?.installationId, event.installationId);
    assert.notStrictEqual(returning?.sessionId, event.sessionId);
    assert.strictEqual(returning?.sequence, 1);
  });

  test('deletion wins over a pending write and re-enabling starts a new identity', async () => {
    let stored: string | undefined;
    let generated = 0;
    const identity = new UsageIdentityStore({
      read: () => stored,
      write: async value => { stored = value; },
    }, () => `00000000-0000-4000-8000-${String(++generated).padStart(12, '0')}`);
    const first = identity.next();
    identity.clear();
    await identity.settled();
    assert.strictEqual(stored, undefined);
    assert.notStrictEqual(identity.next()?.installationId, first?.installationId);
  });

  test('rapid opt-out and opt-in cannot reload the identifier awaiting deletion', async () => {
    let stored: string | undefined = '00000000-0000-4000-8000-000000000001';
    let generated = 1;
    const identity = new UsageIdentityStore({
      read: () => stored,
      write: async value => { stored = value; },
    }, () => `00000000-0000-4000-8000-${String(++generated).padStart(12, '0')}`);
    const oldId = identity.next()?.installationId;
    identity.clear();
    const newId = identity.next()?.installationId;
    assert.notStrictEqual(oldId, newId);
    await identity.settled();
    assert.strictEqual(stored, newId);
  });
});
