## Root cause

Both races are the same bug wearing different clothes: the lock and the uncertainty receipt are one state machine, but they're owned by three different actors (composition root, gateway, and whatever does startup recovery) with the lock's release acting as an implicit "all clear" signal that isn't actually gated on the receipt being resolved.

- **Race 1** exists because release happens in the gateway, and receipt-recording happens afterward, back in the composition root. The lock is free during that gap, and nothing durable yet says the mutation's fate is unknown.
- **Race 2** exists because dead-holder→receipt conversion is a separate startup task instead of a precondition the lock enforces on every acquisition. A new mutation can win the race against a converter that hasn't run yet.

Adding a fourth coordinator doesn't fix this — it adds a fourth owner and a fourth seam to keep in sync. Repeating the checks in every feature pushes the same three-way coordination problem onto every caller instead of collapsing it once.

## The ownership change

Give the gateway sole ownership of the lock-plus-receipt unit, and make "release" mean "durably resolved," not "operation returned":

```text
composition root: check outstanding receipt
gateway:
  acquire lock — if the current holder is dead, convert it to a receipt
                 as part of acquisition, not before it
  perform remote mutation
  record/clear the outcome (durably) — including an unknown result
  release lock only after that write succeeds
```

Two changes from the original sequence, both moves of responsibility rather than new components:

1. **Recording moves inside the gateway's critical section**, before release. Release is no longer a gateway-local step that happens regardless of outcome — it's gated on the durable write. This closes race 1: nobody can observe "lock free" without the outcome already being on disk.
2. **Dead-holder conversion moves from a standalone startup job into the acquisition path itself.** Acquiring the lock and resolving a dead holder become the same atomic step, owned by the same code that acquires locks for live mutations. This closes race 2: there's no longer a window where a new mutation can acquire before the old holder's fate is recorded, because acquisition *is* what records it.

## Failure path: the receipt write itself fails

Don't release the lock. Treat write-failure identically to the gateway dying mid-mutation — because from every other observer's point of view, it's indistinguishable: a lock is held, nothing durable was written. This is why race 2's fix matters here too: it's already the recovery path for "holder died before recording anything," so a failed receipt write needs no new machinery — it just falls into that same path on the next acquisition attempt. That's the payoff of merging ownership: one mechanism covers both "crashed" and "recorded a failure while trying to record uncertainty."

## The independent test

Test at the boundary the claim is actually about — the remote system — not the lock or receipt internals:

1. Start mutation A. Inject a fault so it reaches "unknown outcome" and then dies before the receipt write completes (or before lock release).
2. Immediately attempt mutation B against the same target, including a run that starts *after* process restart (exercising the dead-holder path).
3. Assert the remote endpoint received the mutation call **at most once** across A and B, and that B does not proceed until A's receipt is resolved.

That's the whole safety claim in one black-box assertion — it fails under the original ownership split (B slips through the release/record gap or the dead-holder gap) and passes once lock and receipt share an owner, without needing to inspect which internal object held what.
