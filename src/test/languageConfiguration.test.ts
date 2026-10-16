import * as assert from 'assert';
import { readFileSync } from 'fs';
import { resolve } from 'path';

suite('SysML quoted-name word selection', () => {
    const configuration: { wordPattern: string } = JSON.parse(readFileSync(
        resolve(__dirname, '..', '..', 'language-configuration.json'), 'utf8',
    ));

    for (const name of [
        "'\u03a9'", "'\u6e29\u5ea6'", "'e\u0301'", "'\u{1f680}'",
        "'unit name'", "'unit\\'s value'", "'unit\\\\value'", "'unit::value'",
    ]) {
        test(`selects the whole unrestricted name ${name}`, () => {
            const matches = [...`part ${name};`.matchAll(new RegExp(configuration.wordPattern, 'g'))];
            assert.deepStrictEqual(matches.map(match => match[0]), ['part', name]);
        });
    }
});
