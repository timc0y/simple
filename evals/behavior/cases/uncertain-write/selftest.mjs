import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url'; import { spawnSync } from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url)); const base=join(here,'fixture'); const verify=d=>spawnSync(process.execPath,[join(here,'verifier.mjs'),d],{encoding:'utf8'});
const bad=await mkdtemp(join(tmpdir(),'write-bad-')); await cp(base,bad,{recursive:true}); if(verify(bad).status===0) throw Error('verifier accepted original bad fixture'); await rm(bad,{recursive:true,force:true});
const good=await mkdtemp(join(tmpdir(),'write-good-')); await cp(base,good,{recursive:true}); await writeFile(join(good,'owner.mjs'),`import { readFile, writeFile } from 'node:fs/promises';\nexport async function applyOnce(key,file,mode='timeout-after-write'){const s=JSON.parse(await readFile(file,'utf8'));if(mode==='unknown')throw Error('unknown');if(s.keys.includes(key))return {status:'already-applied'};s.keys.push(key);s.count++;await writeFile(file,JSON.stringify(s));if(mode==='timeout-after-write')throw Object.assign(Error('timeout'),{code:'TIMEOUT'});return {status:'applied'};}`); // known-good owner is already idempotent; callers in base retry it
if(verify(good).status!==0) throw Error('verifier rejected known-good fixture'); const valid = await (await import('node:fs/promises')).readFile(join(good,'owner.mjs'),'utf8');
await writeFile(join(good,'owner.mjs'),valid.replace('s.keys.includes(key)','false'));
if(verify(good).status===0) throw Error('verifier accepted duplicate effects');
await writeFile(join(good,'owner.mjs'),valid.replace("throw Error('unknown')","return {status:'applied'}"));
if(verify(good).status===0) throw Error('verifier accepted false success on unknown outcome');
await rm(good,{recursive:true,force:true}); console.log('selftest passed');
