I don't have write permission for `answer.md` in this sandbox, so I can't save the file directly. Here's the analysis — let me know if you'd like me to retry the write once permissions allow, or if you'll paste this in yourself.

## Root cause

The safety claim ("at most one active mutation, none while a prior effect is unknown") spans four operations, but ownership is split: the gateway owns acquire/mutate/release, the composition root owns check-receipt/record-receipt. Nobody owns the whole invariant, so nobody can make it atomic. Race 1 (gap between lock-released and receipt-recorded) and race 2 (gap between lock-free and dead-holder-converted) are the same bug: a boundary that exists across two owners' heads but not in one owner's code.

The two proposed fixes don't fix this. A second coordinator is a third owner — the same gap just reopens between the coordinator and the receipt store. Repeating checks in every feature scatters ownership further, and every new mutating command becomes a new place to get the order wrong.

## The smallest change

There's already one shared mutation boundary used by every mutating command. Give *that* boundary ownership of receipt check, conversion, and recording, so it owns all four operations as one critical section:

**Acquire** (atomic): take lock → if holder is dead, convert it to a receipt *before* the lock counts as free → check for any outstanding receipt (including one just created) → refuse if found → only then is the lock held.

**Mutate**: unchanged.

**Release** (atomic): classify outcome → if unknown, durably record the receipt → release the lock only after that succeeds.

The lock is never observably free while an outcome is unknown and unrecorded, because release is no longer an unconditional final step in the gateway — it's the last part of the same operation that records the receipt. Dead-holder conversion becomes a mandatory step inside acquisition, not a separate startup task racing against new mutations.

## Failure path: recording the receipt fails

Don't release the lock. Surface the error; the attempt ends stuck-but-safe. This is the same state as a crash mid-mutation, so it's resolved by the mechanism already built for that — the next acquirer finds a dead holder and runs the conversion before proceeding. One recovery path, not two.

## Independent test

Real competing OS processes against real lock/receipt storage, SIGKILL at each boundary transition (after acquire, after mutate, after record, mid dead-holder conversion). After each kill, a fresh process must: not start a new mutation while an outcome is unresolved, and across the whole sequence the remote system must see the mutation exactly once (checked via a call counter on a fake endpoint or idempotency key — not by asserting internal call order). That makes it independent of implementation: it fails against the current split-ownership code and passes only once acquire/release are genuinely atomic.

## Reconsider

Only split acquire/release back apart if the lock and receipt store become one transactional substrate — then record-and-release is just one DB transaction and this merge is unneeded.
