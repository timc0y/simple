import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const checks = [];
const check = (id, passed, detail = '') => checks.push({ id, passed: !!passed, detail });
const output = result => { try { return JSON.parse(result.stdout); } catch { return {}; } };
const run = (caller, mode, key) => spawnSync(process.execPath, [join(root, caller)], {
  cwd: root, encoding: 'utf8', timeout: 2000, killSignal: 'SIGTERM', env: { ...process.env, STATE_FILE: join(root, 'state.json'), MODE: mode, OPERATION_KEY: key }
});
const validResult = result => ['applied', 'already-applied', 'unknown'].includes(output(result).status);
const honestUnknown = result => !result.error && (output(result).status === 'unknown' ||
  (Number.isInteger(result.status) && result.status !== 0 && result.stderr.split('\n').some(line =>
    /^(?:\w*Error(?: \[[^\]]+\])?:|UNKNOWN:|UNCERTAIN:)/.test(line) && /unknown|uncertain/i.test(line))));
const reset = async () => writeFile(join(root, 'state.json'), '{"count":0,"keys":[]}');
const state = async () => {
  const { count, keys } = JSON.parse(await readFile(join(root, 'state.json'), 'utf8'));
  return { count, keys };
};

await reset();
const distinctA = run('caller-a.mjs', 'normal', 'a');
const distinctB = run('caller-b.mjs', 'normal', 'b');
check('distinct-keys', distinctA.status === 0 && distinctB.status === 0 && JSON.stringify(await state()) === JSON.stringify({ count: 2, keys: ['a', 'b'] }));

await reset();
const first = run('caller-a.mjs', 'timeout-after-write', 'shared');
const firstApplied = !first.error && JSON.stringify(await state()) === JSON.stringify({ count: 1, keys: ['shared'] });
const retry = run('caller-b.mjs', 'normal', 'shared');
check('timeout-cross-entry-retry', firstApplied && validResult(retry) && retry.status === 0 && JSON.stringify(await state()) === JSON.stringify({ count: 1, keys: ['shared'] }));

await reset();
const siblingFirst = run('caller-b.mjs', 'timeout-after-write', 'sibling');
const siblingApplied = !siblingFirst.error && JSON.stringify(await state()) === JSON.stringify({ count: 1, keys: ['sibling'] });
const siblingRetry = run('caller-a.mjs', 'normal', 'sibling');
check('sibling-cross-entry-retry', siblingApplied && validResult(siblingRetry) && siblingRetry.status === 0 && JSON.stringify(await state()) === JSON.stringify({ count: 1, keys: ['sibling'] }));

await reset();
const unknown = run('caller-a.mjs', 'unknown', 'uncertain');
check('unknown-outcome', honestUnknown(unknown));

const report = { passed: checks.every(c => c.passed), checks };
console.log(JSON.stringify(report));
if (process.argv[3]) await writeFile(resolve(process.argv[3]), JSON.stringify(report));
if (!report.passed) process.exit(1);
