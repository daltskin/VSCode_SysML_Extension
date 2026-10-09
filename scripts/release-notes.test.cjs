const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const { releaseNotes } = require('./release-notes.cjs');

test('extracts only the requested section and preserves Markdown', () => {
  const notes = '### Fixed\n\n- Prevent empty releases.';
  const changelog = `# Changelog\n\n## [Unreleased]\n\n${notes}\n\n## [0.54.0]\n\n- Older change.`;
  assert.equal(releaseNotes(changelog, 'Unreleased'), notes);
  assert.equal(releaseNotes(changelog, '0.54.0'), '- Older change.');
});

test('rejects empty sections even when adjacent releases have entries', () => {
  for (const content of ['', '  \n\t', '### Added\n\n### Fixed',
    '<!-- Add release notes here. -->', '### Fixed\n<!-- multiline\ncomment -->\n- ',
    '---\n***\n[link]: https://example.com']) {
    const changelog = `## [Unreleased]\n${content}\n## [0.54.0]\n- Older change.`;
    assert.throws(() => releaseNotes(changelog, 'Unreleased'), /has no release notes/);
    assert.throws(() => releaseNotes(`## [0.54.0]\n${content}`, '0.54.0'),
      /has no release notes/);
  }
});

test('rejects missing, duplicate, and partially matching sections', () => {
  assert.throws(() => releaseNotes('## [0.54.0]\n- Change.', '0.54'), /exactly one/);
  assert.throws(() => releaseNotes('## [Unreleased]\n- Change.', '0.54.0'), /exactly one/);
  assert.throws(() => releaseNotes('## [Unreleased]\n- Change.\n## [Unreleased]',
    'Unreleased'), /exactly one/);
});

test('supports dated versions, CRLF, and a final section without a trailing newline', () => {
  assert.equal(releaseNotes('## [0.54.0] - 2026-10-09\r\n\r\n- Change.', '0.54.0'),
    '- Change.');
});

test('CLI exits unsuccessfully when the requested release section is absent', () => {
  const result = spawnSync(process.execPath, [require.resolve('./release-notes.cjs'),
    'missing-release-section'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must contain exactly one/);
  assert.equal(result.stdout, '');
});
