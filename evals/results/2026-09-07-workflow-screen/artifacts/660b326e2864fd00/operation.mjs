import { readFile, writeFile } from 'node:fs/promises';

const fileLocks = new Map();

async function withFileLock(file, operation) {
  const previous = fileLocks.get(file) ?? Promise.resolve();
  let release;
  const current = new Promise((resolve) => {
    release = resolve;
  });
  fileLocks.set(file, current);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (fileLocks.get(file) === current) fileLocks.delete(file);
  }
}

export async function applyOnce(key, file, mode = 'normal') {
  return withFileLock(file, async () => {
    const state = JSON.parse(await readFile(file, 'utf8'));

    // A retry may arrive after the effect was written but before its result was
    // delivered. The key is the operation's durable idempotency record.
    if (state.keys.includes(key)) return { status: 'applied' };

    state.keys.push(key);
    state.count += 1;
    await writeFile(file, JSON.stringify(state));
    if (mode === 'unknown') return { status: 'unknown' };
    if (mode === 'timeout-after-write') throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
    return { status: 'applied' };
  });
}
