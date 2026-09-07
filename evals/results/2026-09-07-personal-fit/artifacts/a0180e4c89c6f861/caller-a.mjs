import { applyOnce } from './operation.mjs';
const key = process.env.OPERATION_KEY ?? 'a';
const file = process.env.STATE_FILE;
const mode = process.env.MODE ?? 'normal';

let result;
try {
  result = await applyOnce(key, file, mode);
} catch (error) {
  if (error.code !== 'TIMEOUT') throw error;
  // The operation may have committed before the timeout. Reconcile by key.
  result = await applyOnce(key, file, 'normal');
}
console.log(JSON.stringify(result));
