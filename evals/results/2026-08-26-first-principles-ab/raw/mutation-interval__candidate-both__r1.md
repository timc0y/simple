## The fix: one owner for the whole interval, not a new one

The races exist because the four/five operations — check receipt, acquire lock, mutate, record unknown, release lock, plus dead-holder reconciliation — are split between two owners (composition root and gateway) with gaps at the handoffs. Both proposed fixes make this worse: a new coordinator adds a second path beside the one that already exists ("one shared mutation boundary is used by every mutating command"), and repeating checks per feature duplicates the exact logic whose omission caused the bug, in every future feature.

The smallest change: collapse all five operations into the single shared boundary that already exists, and fix the order inside it.

```
mutation_boundary():
    if outstanding_receipt_exists(): return "prior effect unknown"
    acquire_lock()          # see below — reconciliation lives here
    try:
        result = perform_remote_mutation()
        if result is unknown:
            record_receipt(unknown)   # while lock is still held
    finally:
        release_lock()      # only after any receipt is durably recorded
```

The composition root stops doing check-receipt and record-unknown as separate steps; it just calls this one boundary. That satisfies "no new mutation while any prior effect is unknown" as one invariant owned by one thing, matching SIMPLE.md's current-boundary note that the lock owner doesn't yet own receipt conversion, checking, or recording — this makes it own all four.

**Why this closes race 1** (process starts after release, before recording): release is now strictly the last action, and recording happens before it, inside the same held-lock section. No process can ever observe "unlocked" while an unknown result is still unrecorded — that ordering is structural, not timing-dependent.

**Why this closes race 2** (new mutation starts before a dead holder becomes a receipt): dead-holder reconciliation moves inside `acquire_lock()` itself, not a separate startup task. You cannot acquire the lock without first resolving a dead prior holder into a receipt. Reconciliation is on the only path to acquisition, so nothing can race ahead of it.

## Failure path: recording uncertainty fails

If `record_receipt(unknown)` itself fails (disk full, write error), do not release the lock. Releasing without a durable receipt recreates race 1 permanently — no lock, no receipt, effect genuinely unknown, forever. So the release is conditional: release only if the result was known, or the unknown result's receipt was durably recorded. If the write fails, the held lock becomes the uncertainty signal — the same dead-holder reconciliation that fixed race 2 is what eventually converts it to a receipt, either when this process dies or on the next process's acquire attempt. No new machinery is needed; the crash-recovery path and the write-failure path are the same path.

## The independent test

Per the proof requirement — exercise real competing processes and forced termination at every boundary transition, not mocked internals:

1. Point the boundary at a fake remote endpoint that independently counts mutation calls it actually received.
2. Spawn real OS processes issuing the same mutating command concurrently, and SIGKILL the lock holder at each transition point: after acquire, after the mutation call is sent but before a response, after unknown is detected but before the receipt write, after the receipt write but before release.
3. After each kill, start a fresh process and assert it never issues a new mutation while a prior effect is unresolved.
4. Assert the fake remote endpoint only ever counted one mutation call per logical attempt, across every kill point.

This is independent because it verifies the invariant from outside — real processes, real kills, an external call counter — so it fails on any reintroduced gap regardless of how the internals are refactored, rather than asserting on internal call order.
