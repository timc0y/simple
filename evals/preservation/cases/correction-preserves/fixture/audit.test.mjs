import assert from 'node:assert/strict';
import {makeEvent,byActor,prune} from './audit.mjs';
const input={actor:{id:'u1',displayName:'Mira'},action:'updated',target:'draft',retentionDays:2,createdAt:0};
const event=makeEvent(input);
assert.equal(byActor([event],'u1').length,1);
assert.equal(prune([event],86400000).length,1);
assert.equal(prune([event],172800000).length,0);
