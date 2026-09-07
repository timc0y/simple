import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const d=mkdtempSync(join(tmpdir(),'easy-check-'));cpSync(new URL('./fixture',import.meta.url),d,{recursive:true});
const run=()=>spawnSync(process.execPath,[new URL('./verifier.mjs',import.meta.url).pathname,d]);
assert.notEqual(run().status,0);const p=join(d,'cli.mjs');writeFileSync(p,readFileSync(p,'utf8').replace('Upload thing','Upload file'));assert.equal(run().status,0);writeFileSync(p,"console.log('Upload file');");assert.notEqual(run().status,0);rmSync(d,{recursive:true});console.log('positive and negative checks passed');
