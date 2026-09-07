import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const run=args=>spawnSync(process.execPath,['cli.mjs',...args],{cwd:process.argv[2],encoding:'utf8'});
const h=run(['--help']);assert.equal(h.status,0);assert.equal(h.stdout,'Upload file\nUsage: upload <filename>\n');
const u=run(['sample.csv']);assert.equal(u.status,0);assert.equal(u.stdout,'Uploaded sample.csv\n');
const e=run([]);assert.equal(e.status,1);assert.equal(e.stderr,'A filename is required\n');
console.log(JSON.stringify({passed:true,checks:['help_heading','upload','missing_filename']}));
