export function makeEvent(input) {
  return { actor: input.actor, action: input.action, target: input.target,
    retentionDays: input.retentionDays, createdAt: input.createdAt };
}
export function describeEvent(event) { return JSON.stringify(event); }
export function byActor(events, id) { return events.filter(e => e.actor.id === id); }
export function prune(events, now) {
  return events.filter(e => now - e.createdAt < e.retentionDays * 86400000);
}
