import { applyOnce } from './operation.mjs';
const result = await applyOnce(process.env.OPERATION_KEY ?? 'a', process.env.STATE_FILE, process.env.MODE ?? 'normal');
console.log(JSON.stringify(result));
