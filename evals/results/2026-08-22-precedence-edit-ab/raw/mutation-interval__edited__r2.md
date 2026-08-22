## The actual defect

Both races have the same shape: the lock and the uncertainty receipt are two different resources, moved by two different owners, with a gap between them. "Lock is free" and "no unresolved uncertainty" can drift apart:

- Race 1: gateway frees the lock, then composition root writes the receipt. In the gap, the lock looks free but the outcome isn't recorded yet.
- Race 2: on startup, converting a dead holder into a receipt is a separate step from acquiring the lock. A new acquire can win the gap before the conversion happens.

Adding a second coordinator wouldn't fix this — it would just add a third owner to race against the other two. Repeating the check in every feature wouldn't fix it either — the gap is inside the gateway/composition-root boundary, not in how callers use it.

## The ownership change

Fold the receipt write into the same owner and the same critical section as the lock, at both ends:

- **Release path**: the gateway, not the composition root, writes the uncertainty receipt for any non-confirmed outcome — and does so *before* releasing the lock, as the last step while still holding it. The composition root's "check outstanding receipt" stays as-is; it's now sufficient, because the invariant *lock free ⇒ no unresolved receipt* actually holds.
- **Acquire path**: converting a dead holder into a receipt becomes part of acquiring the lock, not a separate startup task. Acquisition must detect a dead holder, write its receipt, and only then succeed. The lock is never observably "free" for someone else until that conversion is durable.

Same owner, same operation, correct order. No new coordinator, no duplicated checks in callers.

## Failure path: the receipt write itself fails

If writing the receipt fails (store down, disk error) at either end:

- On release: do **not** release the lock. Propagate the error as fatal/retryable. The held lock is the safe fallback state — it's what was preventing double mutation all along, so failing loud and keeping it held is correct, not a degraded case.
- On acquire (dead-holder conversion): do **not** treat the lock as acquired or free. Fail the acquire attempt. The next startup retries the same conversion against the same still-held lock.

In both cases the failure mode is "stay locked," never "proceed unlocked." That's what makes the invariant hold even when the receipt store is unreliable.

## The independent test

Test the gateway's acquire/mutate/release surface directly, with the receipt store faked to fail on demand, and with no composition-root code involved:

1. Start a mutation, force an unknown outcome, force the receipt write to fail. Assert the lock is still held afterward, and a second acquire attempt from elsewhere is refused.
2. Simulate a dead holder (lock record present, no live owner). Attempt a fresh acquire immediately. Assert it does not succeed until a receipt for the dead holder exists, and that no two acquires ever succeed without a receipt resolution between them.

Both assertions are about observable state (`lock held?`, `acquire succeeded?`) on the gateway's own boundary — they prove "lock free ⇒ no unresolved uncertainty" structurally, independent of whatever composition root happens to do with it.
