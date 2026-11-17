import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
if(!process.argv[2])throw Error('Usage: node replay.mjs /path/to/matching/communicator/dist');
const {parseMeaningReview}=await import(pathToFileURL(path.resolve(process.argv[2],'writing.js')));
const {createCommunicationRuntime}=await import(pathToFileURL(path.resolve(process.argv[2],'runtime.js')));
const r=path.join(path.dirname(new URL(import.meta.url).pathname),'evidence'),cases=JSON.parse(fs.readFileSync(path.join(r,'cases.json'))),rows=[];
for(const id of JSON.parse(fs.readFileSync(path.join(r,'order.json')))) {
 const c=cases.find(c=>c.id===id),input=JSON.parse(fs.readFileSync(path.join(r,`${id}.input.json`))),raw=fs.readFileSync(path.join(r,`${id}.verdict.json`),'utf8'),req=JSON.parse(fs.readFileSync(path.join(r,`${id}.runtime-request.json`)));let parsed=null,parseError=null,calls=0;
 try{parsed=parseMeaningReview(raw,{sourceText:c.sourceText,rewrittenText:c.rewrittenText});}catch(error){parseError=error.message;}
 const runtime=await createCommunicationRuntime({async generate(inputRequest){calls++;if(calls===1)return {text:c.rewrittenText,model:'fixed-synthetic-summary'};assert.equal(calls,2);assert.equal(inputRequest.system,input.system);assert.equal(inputRequest.user,input.user);return {text:raw,model:'recorded-native-review'};}}).adapt(req);
 assert.equal(calls,2);rows.push({...c,rawVerdict:raw,parsed,parseError,runtime,providerCallsInRecordedReplay:calls,controlMatched:c.expectedPreserved===null?null:parsed?.preserved===c.expectedPreserved});
}
const summary={cases:rows.length,validVerdicts:rows.filter(c=>!c.parseError).length,controls:rows.filter(c=>c.expectedPreserved!==null).length,controlsMatched:rows.filter(c=>c.controlMatched===true).length,diagnosticRepairs:rows.filter(c=>c.expectedPreserved===null).map(c=>({name:c.name,preserved:c.parsed?.preserved??null,runtime:c.runtime.status,parseError:c.parseError})),stop:'Four registered tasks used; no retries or output repair.'};
fs.writeFileSync(path.join(r,'control-results.json'),JSON.stringify(rows,null,2)+'\n');fs.writeFileSync(path.join(r,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
