import { readFile, writeFile } from 'node:fs/promises';
export async function applyOnce(key, file, mode = 'timeout-after-write') {
  const state = JSON.parse(await readFile(file, 'utf8'));
  if (mode === 'unknown') throw new Error('unknown outcome');
  state.count += 1; await writeFile(file, JSON.stringify(state));
  if (mode === 'timeout-after-write') throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
  return { status: 'applied' };
}
