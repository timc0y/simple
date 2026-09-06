import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const target = resolve(process.argv[2] ?? '.');
const checks = [];
const check = (id, passed, detail = '') => checks.push({ id, passed: !!passed, detail });
const run = (env = {}) => spawnSync(process.execPath, ['main.mjs'], { cwd: target, encoding: 'utf8', env: { ...process.env, ...env } });
check('capability-false-uses-supported', (() => { const r = run(); return r.status === 0 && r.stdout.trim() === 'supported-ok'; })(), 'capability=false must still select supported implementation');
check('legacy-path-removed', !existsSync(join(target, 'legacy.mjs')), 'obsolete legacy module/import remains');
check('transient-fallback-executes', (() => { const r = run({ SUPPORTED_FAILURE: 'transient' }); return r.status === 0 && r.stdout.trim() === 'transient-fallback-ok'; })(), 'transient failure did not use fallback');
check('permanent-error-preserved', run({ SUPPORTED_FAILURE: 'permanent' }).status !== 0, 'permanent failure was silently recovered');
check('healthy-capability-still-supported', (() => { const r = run({ CAPABILITY: '1' }); return r.status === 0 && r.stdout.trim() === 'supported-ok'; })(), 'healthy environment must use supported implementation');
const report = { passed: checks.every(c => c.passed), checks };
console.log(JSON.stringify(report));
if (!report.passed) process.exit(1);
