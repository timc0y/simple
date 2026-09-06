import { applyOnce } from './owner.mjs';
const file = process.env.STATE_FILE ?? './state.json'; const mode = process.env.MODE ?? 'timeout-after-write';
let result;
try { result = await applyOnce(process.env.OPERATION_KEY ?? 'b', file, mode); } catch (e) { if (e.code === 'TIMEOUT') { try { result = await applyOnce(process.env.OPERATION_KEY ?? 'b', file, mode); } catch (retry) { result = { status: retry.code === 'TIMEOUT' ? 'unknown' : 'error' }; } } else result = { status: 'unknown' }; }
console.log(JSON.stringify(result));
