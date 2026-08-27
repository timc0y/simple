I need to understand the current codebase structure first. Let me explore the repository.This is a pure reasoning/design task — no codebase to explore. Let me work through the problem following the Simple skill's design method.

---

## The problem, restated

The invariant: **no new mutation starts while any prior mutation's result is unknown.** Two pieces of state enforce this: a lock (mutual exclusion) and an uncertainty receipt ( remembers "we don't know if it landed"). They're owned by two different code paths, creating a gap.

## Current ownership and the gap

```
composition root → gateway → composition root
(check receipt)  (lock + mutation + release)  (record receipt)
```

The lock is released by the gateway *before* the composition root records the receipt. Two races exploit this window:

1. **Race 1:** Process B starts after lock release, before receipt recording. It sees no receipt, acquires the lock, performs the same mutation.
2. **Race 2:** Process A dies with the lock held. Process B starts before the dead lock is converted to a receipt. It sees no receipt and proceeds.

## The smallest ownership change

**Move receipt recording into the gateway, performed before lock release.** One step moves from one owner to the other, and the order within that owner changes:

```
gateway: acquire lock
gateway: perform mutation
gateway: record uncertainty receipt    ← moved here
gateway: release lock
```

The composition root retains only: check receipt on startup, convert dead locks to receipts on startup, clear receipt on confirmed result. No new coordinator. No feature-level repetition. One owner (the gateway) owns the full write-side interval atomically.

**Why this is minimal:**
- One code path moves (receipt recording).
- One ordering change (record before release).
- No new abstraction, coordinator, or dependency.
- The invariant "no receipt gap" is satisfied because the lock is held while the receipt is written.

## Failure path: recording uncertainty itself fails

If the receipt write fails (disk full, permissions, crash):

**Do not release the lock.** The process aborts or crashes. On next startup, the composition root's existing recovery path converts the dead lock holder into an uncertainty receipt. This reuses the existing mechanism — no new failure handling needed.

The safety claim holds because: a failed receipt write means the lock is never released, so no other process can observe a free lock without a receipt. The dead-lock-to-receipt conversion on startup covers the crash case.

## The independent test

Two forced-kill tests at the boundary transition:

1. **Kill after receipt, before lock release:** Start process A, let it acquire the lock and perform the mutation, kill it *after* recording the receipt but *before* releasing the lock. Start process B. **Expected:** B sees the outstanding receipt and refuses to proceed. This proves the receipt exists while the lock is held — the safe state.

2. **Kill after lock release (proves the old race is gone):** Start process A, let it complete the full cycle (record receipt, release lock). Kill it *after* lock release. Start process B. **Expected:** B sees the outstanding receipt (recorded before release) and refuses until the result is confirmed. This proves Race 1 is closed.

These two tests exercise the exact boundary where the old code had the gap. If both pass, the ownership change is sufficient.

---

**Summary:** The smallest fix is one ownership move (receipt recording → gateway, before lock release). The failure path is "don't release the lock; let startup recovery handle it." The independent test is forced-kill at the receipt-to-release transition.
