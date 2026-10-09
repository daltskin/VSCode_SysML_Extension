const { readFileSync } = require('node:fs');

function releaseNotes(changelog, section) {
  const lines = changelog.replace(/\r\n/g, '\n').split('\n');
  const headings = lines.flatMap((line, index) => {
    const match = /^## \[([^\]]+)\](?:\s.*)?$/.exec(line);
    return match ? [{ section: match[1], index }] : [];
  });
  const matches = headings.filter(heading => heading.section === section);
  if (matches.length !== 1) {
    throw new Error(`CHANGELOG.md must contain exactly one [${section}] section.`);
  }
  const start = matches[0].index;
  const end = headings.find(heading => heading.index > start)?.index ?? lines.length;
  const notes = lines.slice(start + 1, end).join('\n').trim();
  const content = notes.replace(/<!--[\s\S]*?-->/g, '');
  const hasEntry = content.split('\n').some(line => {
    const trimmed = line.trim();
    return !/^#|^\[[^\]]+\]:/.test(trimmed) && /[a-z0-9]/i.test(trimmed);
  });
  if (!hasEntry) {
    throw new Error(`CHANGELOG.md [${section}] has no release notes. Add an entry before releasing.`);
  }
  return notes;
}

module.exports = { releaseNotes };

if (require.main === module) {
  try {
    const section = process.argv[2];
    if (!section) {
      throw new Error('Usage: node scripts/release-notes.cjs <section>');
    }
    console.log(releaseNotes(readFileSync('CHANGELOG.md', 'utf8'), section));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
