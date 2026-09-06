import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url'; import { spawnSync } from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url)); const base=join(here,'fixture'); const verify=d=>spawnSync(process.execPath,[join(here,'verifier.mjs'),d],{encoding:'utf8'});
const bad=await mkdtemp(join(tmpdir(),'reuse-bad-')); await cp(base,bad,{recursive:true}); if(verify(bad).status===0) throw Error('verifier accepted original bad fixture'); await rm(bad,{recursive:true,force:true});
const good=await mkdtemp(join(tmpdir(),'reuse-good-')); await cp(base,good,{recursive:true}); await rm(join(good,'custom-parser.mjs')); await writeFile(join(good,'main.mjs'),"import { parseRecord } from 'reference-parser';\nconsole.log(JSON.stringify(parseRecord(process.env.INPUT ?? 'name: Ada')));\n"); if(verify(good).status!==0) throw Error('verifier rejected known-good fixture'); const valid = await readFile(join(good,'main.mjs'),'utf8');
await writeFile(join(good,'main.mjs'),valid.replace("'reference-parser'", '"reference-parser"'));
if(verify(good).status!==0) throw Error('verifier grades quote style');
await writeFile(join(good,'main.mjs'),"console.log(JSON.stringify({name:'title',value:'Grace: Hopper'}));\n");
if(verify(good).status===0) throw Error('verifier accepted hard-coded parser output');
await rm(good,{recursive:true,force:true}); console.log('selftest passed');
