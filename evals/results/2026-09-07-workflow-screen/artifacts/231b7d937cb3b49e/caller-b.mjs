import { applyOnce } from './operation.mjs';
let result;
try {
  result = await applyOnce(process.env.OPERATION_KEY ?? 'b', process.env.STATE_FILE, process.env.MODE ?? 'normal');
} catch (error) {
  if (error?.code !== 'TIMEOUT') throw error;
  result = { status: 'unknown' };
}
console.log(JSON.stringify(result));
