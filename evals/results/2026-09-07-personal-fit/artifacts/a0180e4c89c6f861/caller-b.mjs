import { applyOnce } from './operation.mjs';
const key = process.env.OPERATION_KEY ?? 'b';
const file = process.env.STATE_FILE;
const mode = process.env.MODE ?? 'normal';

let result;
try {
  result = await applyOnce(key, file, mode);
} catch (error) {
  if (error.code !== 'TIMEOUT') throw error;
  result = await applyOnce(key, file, 'normal');
}
console.log(JSON.stringify(result));
