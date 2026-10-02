import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const fixture = path.resolve(process.argv[2]);
const { webLookup } = await import(pathToFileURL(path.join(fixture, 'web.mjs')));
const { cliLookup } = await import(pathToFileURL(path.join(fixture, 'cli.mjs')));
const { lookup } = await import(pathToFileURL(path.join(fixture, 'lib/catalog.mjs')));
const callerCases = [
  ['00123', 'Tea'], ['123', 'Coffee'], ['A7', 'Bread'],
  [' 00123 ', 'Tea'], [' 123 ', 'Coffee'], [' A7 ', 'Bread'],
  ['missing', null], ['000123', null], ['', null], [' \t ', null]
];
let assertions = 0;
for (const [name, fn] of [['web', webLookup], ['cli', cliLookup]]) {
  for (const [code, expected] of callerCases) {
    assert.equal(fn(code), expected, `${name}: ${JSON.stringify(code)}`);
    assertions++;
  }
}
for (const [code, expected] of callerCases.filter(([code]) => code === code.trim())) {
  assert.equal(lookup(code), expected, `shared lookup: ${JSON.stringify(code)}`);
  assertions++;
}
console.log(JSON.stringify({passed:true, assertions}));
