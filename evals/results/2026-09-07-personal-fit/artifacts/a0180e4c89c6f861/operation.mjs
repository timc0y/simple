import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function acquireLock(file) {
  const lock = `${file}.lock`;

  for (;;) {
    try {
      await mkdir(lock);
      return lock;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      await sleep(5);
    }
  }
}

export async function applyOnce(key, file, mode = 'normal') {
  const lock = await acquireLock(file);

  try {
    const state = JSON.parse(await readFile(file, 'utf8'));
    if (state.keys.includes(key)) return { status: 'already-applied' };

    state.keys.push(key);
    state.count += 1;
    await writeFile(file, JSON.stringify(state));

    if (mode === 'unknown') return { status: 'unknown' };
    if (mode === 'timeout-after-write') {
      throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
    }
    return { status: 'applied' };
  } finally {
    await rm(lock, { recursive: true, force: true });
  }
}
