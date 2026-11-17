import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL,fileURLToPath} from 'node:url';
if(!process.argv[2])throw Error('Usage: node runtime-replay.mjs /path/to/communicator/dist');
const {createCommunicationRuntime}=await import(pathToFileURL(path.resolve(process.argv[2],'runtime.js')));
const dir=path.dirname(fileURLToPath(import.meta.url));
const rows=JSON.parse(fs.readFileSync(path.join(dir,'replay.json')));
const template=JSON.parse(fs.readFileSync(path.join(dir,'../2026-11-17-focused-meaning/evidence/fa71a6b0d76a.runtime-request.json')));
const outcomes=[];
for(const row of rows){
 let calls=0;
 const result=await createCommunicationRuntime({async generate(){calls++;assert.equal(calls,1,'Over-limit candidate must not reach meaning inference');return {text:row.input.rewrittenText,model:'fixed-archived-output'};}}).adapt({...template,sourceText:row.input.sourceText,objective:row.input.objective,requiredStrings:[],prohibitedStrings:[],maxWords:row.input.maxWords,wordCountBasis:row.input.wordCountBasis});
 assert.equal(result.status,'fallback');assert.equal(result.text,row.input.sourceText);assert.equal(result.checks.wordLimit.status,'failed');assert.equal(result.checks.semanticPreservation,'not_run');assert.equal(calls,1);
 outcomes.push({repo:row.repo,condition:row.condition,status:result.status,wordLimit:result.checks.wordLimit,semanticPreservation:result.checks.semanticPreservation,providerCallbacks:calls});
}
assert.equal(outcomes.length,6);
fs.writeFileSync(path.join(dir,'runtime-replay.json'),JSON.stringify({kind:'deterministic archived-output replay; no model inference',outcomes},null,2)+'\n');
console.log('Six archived over-limit drafts rejected before meaning inference; no output truncated.');
