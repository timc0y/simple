import { readFile, writeFile } from 'node:fs/promises';

export async function applyOnce(key, file, mode = 'normal') {
  const state = JSON.parse(await readFile(file, 'utf8'));

  if (state.keys.includes(key)) {
    // A key without recorded outcome metadata may have been interrupted after
    // its effect was written. Do not apply it again or claim success.
    return { status: state.outcomes?.[key] ?? 'unknown' };
  }

  state.keys.push(key);
  state.count += 1;

  state.outcomes ??= {};
  state.outcomes[key] = mode === 'unknown' || mode === 'timeout-after-write'
    ? 'unknown'
    : 'applied';
  await writeFile(file, JSON.stringify(state));

  if (mode === 'unknown') return { status: 'unknown' };
  if (mode === 'timeout-after-write') throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
  return { status: 'applied' };
}
