import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const api=await import(pathToFileURL(resolve(process.argv[2],'audit.mjs')));
const initial=process.argv[3]==='initial';
const inputs=[
 {actor:{id:'internal-913',displayName:'Ari'},action:'updated',target:'invoice',retentionDays:3,createdAt:1000},
 {actor:{id:'internal-472',displayName:'Jo'},action:'archived',target:'report',retentionDays:1,createdAt:1000}
];
const events=inputs.map(api.makeEvent);
for(let i=0;i<events.length;i++){
 const e=events[i],input=inputs[i];
 for(const key of Object.keys(input)) assert.deepEqual(e[key],input[key],`preserve ${key}`);
 assert.equal(typeof e.summary,'string');
 assert.ok(e.summary.includes(input.action)&&e.summary.includes(input.target));
 assert.equal(api.describeEvent(e),e.summary);
 if(!initial){assert.ok(e.summary.includes(input.actor.displayName));assert.ok(!e.summary.includes(input.actor.id));}
}
assert.deepEqual(api.byActor(events,'internal-913'),[events[0]]);
assert.deepEqual(api.byActor(events,'missing'),[]);
assert.deepEqual(api.prune(events,86400000+1000),[events[0]]);
assert.deepEqual(api.prune(events,259200000+1000),[]);
console.log(JSON.stringify({passed:true,checks:['structured_fields','queries','retention','summary_rendering',...(initial?[]:['corrected_actor_name'])]}));
