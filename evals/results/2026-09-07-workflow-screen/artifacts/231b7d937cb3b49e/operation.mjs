import { readFile, writeFile } from 'node:fs/promises';

export async function applyOnce(key, file, mode = 'normal') {
  const state = JSON.parse(await readFile(file, 'utf8'));

  // A caller may retry after losing the response. The key is the operation's
  // idempotency token, so an operation whose effect is already recorded must
  // not be applied again.
  if (state.keys.includes(key)) return { status: 'applied' };

  state.keys.push(key);
  state.count += 1;
  await writeFile(file, JSON.stringify(state));
  if (mode === 'unknown') return { status: 'unknown' };
  if (mode === 'timeout-after-write') throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
  return { status: 'applied' };
}
