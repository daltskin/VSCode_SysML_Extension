import * as assert from 'assert';
import { reviewIssueReport } from '../telemetry/reportIssue';
import type { TelemetryMetadata } from '../telemetry/telemetryService';

const metadata: TelemetryMetadata = {
  extensionVersion: '0.49.0', lspVersion: '0.30.0', vscodeVersion: '1.125.0',
  host: 'web', platform: 'web',
};

suite('User-reviewed issue reports', () => {
  test('cancellation at either step never opens an external URL', async () => {
    for (const cancelReview of [true, false]) {
      let opened = false;
      await reviewIssueReport(metadata, {
        review: async () => cancelReview ? undefined : 'Reviewed report',
        confirm: async () => false,
        open: async () => { opened = true; },
      });
      assert.strictEqual(opened, false);
    }
  });

  test('opens exactly the edited draft only after explicit confirmation', async () => {
    const steps: string[] = [];
    await reviewIssueReport(metadata, {
      review: async draft => {
        steps.push('review');
        assert.ok(draft.includes('Host: web'));
        assert.ok(!draft.includes('workspace'));
        return 'My reviewed & edited draft';
      },
      confirm: async () => { steps.push('confirm'); return true; },
      open: async url => {
        steps.push('open');
        assert.strictEqual(new globalThis.URL(url).searchParams.get('body'), 'My reviewed & edited draft');
      },
    });
    assert.deepStrictEqual(steps, ['review', 'confirm', 'open']);
  });
});
