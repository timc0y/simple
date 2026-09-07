import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const verify = d => spawnSync(process.execPath, [join(here, 'verifier.mjs'), d], { encoding: 'utf8' });
const base = join(here, 'fixture');
const bad = await mkdtemp(join(tmpdir(), 'shared-failure-bad-'));
await cp(base, bad, { recursive: true });
if (verify(bad).status === 0) throw Error('verifier accepted original fixture');
await rm(bad, { recursive: true, force: true });

const good = await mkdtemp(join(tmpdir(), 'shared-failure-good-'));
await cp(base, good, { recursive: true });
const owner = `import { readFile, writeFile } from 'node:fs/promises';
export async function applyOnce(key, file, mode = 'normal') {
  const state = JSON.parse(await readFile(file, 'utf8'));
  if (mode === 'unknown') return { status: 'unknown' };
  if (state.keys.includes(key)) return { status: 'already-applied' };
  state.keys.push(key); state.count += 1;
  await writeFile(file, JSON.stringify(state));
  if (mode === 'timeout-after-write') return { status: 'unknown' };
  return { status: 'applied' };
}`;
await writeFile(join(good, 'operation.mjs'), owner);
for (const caller of ['caller-a.mjs', 'caller-b.mjs']) await writeFile(join(good, caller), `import { applyOnce } from './operation.mjs';
try {
  console.log(JSON.stringify(await applyOnce(process.env.OPERATION_KEY ?? 'a', process.env.STATE_FILE, process.env.MODE ?? 'normal')));
} catch (error) {
  if (error.code !== 'TIMEOUT') throw error;
  console.log(JSON.stringify({ status: 'unknown' }));
}`);
if (verify(good).status !== 0) throw Error('verifier rejected known-good fixture');

const withMetadata = owner.replace('state.keys.push(key); state.count += 1;',
  'state.keys.push(key); state.count += 1; state.outcomes = { ...state.outcomes, [key]: mode };');
await writeFile(join(good, 'operation.mjs'), withMetadata);
if (verify(good).status !== 0) throw Error('verifier rejected additional outcome metadata');
await writeFile(join(good, 'operation.mjs'), withMetadata.replace('state.count += 1', 'state.count += 2'));
if (verify(good).status === 0) throw Error('verifier accepted duplicate effects with metadata');

const unknownAfterWrite = owner
  .replace("  if (mode === 'unknown') return { status: 'unknown' };\n", '')
  .replace("  if (mode === 'timeout-after-write')", "  if (mode === 'unknown') return { status: 'unknown' };\n  if (mode === 'timeout-after-write')");
await writeFile(join(good, 'operation.mjs'), unknownAfterWrite);
if (verify(good).status !== 0) throw Error('verifier rejected honest uncertainty after an effect');
await writeFile(join(good, 'operation.mjs'), owner.replace("if (mode === 'unknown') return { status: 'unknown' };", "if (mode === 'unknown') throw new Error('unrelated crash');"));
if (verify(good).status === 0) throw Error('verifier accepted an unrelated crash as honest uncertainty');

const guard = await mkdtemp(join(tmpdir(), 'shared-failure-guard-'));
await cp(base, guard, { recursive: true });
await writeFile(join(guard, 'caller-a.mjs'), `import { applyOnce } from './operation.mjs';
const key = process.env.OPERATION_KEY ?? 'a';
const result = key === 'shared' && process.env.MODE === 'normal' ? { status: 'already-applied' } : await applyOnce(key, process.env.STATE_FILE, process.env.MODE ?? 'normal');
console.log(JSON.stringify(result));`);
if (verify(guard).status === 0) throw Error('verifier accepted caller-a-only guard');
await rm(guard, { recursive: true, force: true });
await rm(good, { recursive: true, force: true });
console.log('selftest passed');
