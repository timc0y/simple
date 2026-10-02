import assert from 'node:assert/strict';
import { webLookup } from './web.mjs';
import { cliLookup } from './cli.mjs';
assert.equal(webLookup('123'), 'Coffee');
assert.equal(cliLookup('123'), 'Coffee');
assert.equal(webLookup('missing'), null);
assert.equal(cliLookup('missing'), null);
console.log('4 smoke assertions passed');
