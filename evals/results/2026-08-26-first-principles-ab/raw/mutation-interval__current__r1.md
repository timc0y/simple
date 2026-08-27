## The actual bug

Both races come from the same root cause: **the lock and the receipt are two different owners' state, sequenced by convention instead of enforced by structure.** Nothing stops a second process from walking through the gap between "lock is free" and "receipt exists."

- Race 1: gateway releases the lock (step 4) before composition root records the unknown result (step 5). Any process that starts in that gap sees no receipt and a free lock, and proceeds.
- Race 2: on startup, dead-holder-to-receipt conversion and lock acquisition are two separate steps. A new mutation can acquire the lock before the conversion finishes.

Both are instances of one invariant being violated: **the lock must never be free while a mutation's outcome is unrecorded.** Right now that invariant is enforced by hoping two different owners run in the right order. It isn't enforced anywhere.

## The fix: one owner for the lock-to-receipt handoff

Don't add a coordinator (a fourth owner makes the seam worse, not better) and don't push the check into every feature (that turns one invariant into N call sites that will eventually drift). Instead, collapse lock lifecycle and receipt recording into the single owner that already touches both: the gateway.

New sequence, all inside the gateway's critical section:

```text
gateway: acquire lock
  — if an existing lock is held by a dead process, convert it to a receipt first, then acquire
gateway: perform remote mutation
gateway: record outcome (clear/success, or write receipt if unknown)
gateway: release lock  ← only after the record step above succeeds
```

Composition root's job shrinks to what it's actually good at: checking for an outstanding receipt at startup to decide whether to warn the user or block a retry. It's no longer part of the safety-critical ordering — it can't be, because there's no window left for it to race into. The lock is never observably free without a settled outcome, because the same owner that can free it is the one required to settle the outcome first.

This closes both races:
- Race 1 closes because release is now gated on record, not merely followed by it.
- Race 2 closes because dead-holder reconciliation happens inside acquire(), not before it — nothing else can acquire until that conversion is done.

## Failure path: recording the receipt fails

If the write itself fails (disk full, storage unavailable), the gateway must **not** release the lock. Fail closed: keep holding it and surface the error loudly (crash or propagate — don't swallow it). The process now dies holding the lock, which is exactly the "dead holder" case race 2 already handles. Next startup's acquire() reconciles it into a receipt before anything new can proceed.

This means there is exactly one receipt-writing routine, invoked from exactly two call sites (post-mutation, and startup reconciliation) — no separate failure-handling logic needed. The dead-holder path is the retry mechanism for a failed receipt write, for free.

## The independent proof

Don't test gateway and composition root in isolation — that proves the parts work, not that the seam is closed. Test the boundary itself as a black box with crash injection:

1. Start a mutation, kill the process at each meaningful point (after lock acquired, after remote call returns, after record, before release).
2. Restart.
3. Assert the invariant holds at every observable point across the restart: **it is never true that the lock is free, no receipt exists, and the last mutation's outcome is unknown.** Either the lock is still held (and gets reconciled before any new mutation proceeds), or a receipt already exists, or the outcome was cleared before release.

That test only needs to observe lock state, receipt state, and process liveness from outside — it doesn't need to know gateway's or composition root's internals, which is what makes it a proof of the ownership boundary rather than a proof of either component.
