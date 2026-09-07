import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const r=spawnSync(process.execPath,['cli.mjs','example.txt'],{encoding:'utf8'});
assert.equal(r.status,0);assert.equal(r.stdout,'Uploaded example.txt\n');
const help=spawnSync(process.execPath,['cli.mjs','--help'],{encoding:'utf8'});
assert.equal(help.status,0);assert.equal(help.stdout,'Upload file\nUsage: upload <filename>\n');
