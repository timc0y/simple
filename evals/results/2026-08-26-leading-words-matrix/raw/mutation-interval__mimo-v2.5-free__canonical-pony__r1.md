Here's the plan.

---

## Diagnosis

The invariant is: **no mutation starts while any prior effect is unknown.** The lock and the receipt each cover half of this, but they're owned by different components, creating two windows where the invariant is uncovered.

## The smallest ownership change

**Collapse the receipt recording into the lock owner's scope, before lock release.** One owner (the gateway) owns the entire mutation interval:

```
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt (if needed, while still holding lock)
gateway: release lock
```

This closes Race 1. A new process cannot acquire the lock until the receipt is recorded.

For Race 2 (dead lock holder): **the stale-lock-release path must record the dead holder's uncertainty receipt before acquiring the lock.** It is not a separate step—it is part of the lock-acquire precondition:

```
process: detect stale lock
process: record uncertainty receipt for dead holder
process: acquire lock (now free)
```

The two "open doors" (composition root checking, then gateway releasing, then composition root recording) collapse into one owner with one door.

## Failure path when recording fails

If the uncertainty receipt cannot be written:

- The lock is **not** released. The mutation is safe; the system is blocked.
- The process retries recording with backoff, or aborts and leaves the lock held.
- Liveness is lost, safety is preserved. This is the correct trade-off.
- If the dead holder's lock can't be resolved (DB down, disk full), manual intervention is the boundary. A durable system that can't durably record uncertainty must stop, not guess.

## The independent test

A chaos/concurrency test that proves the boundary:

1. Start mutation M1 in process P1.
2. After P1 performs the remote mutation but before it releases the lock, kill P1.
3. Start mutation M2 in process P2.
4. **Assert:** P2 blocks until an uncertainty receipt for M1 is recorded and resolved. M2 is not applied until the interval is clear.
5. Resolve the receipt. **Assert:** final state is consistent—M1 applied exactly once, M2 applied exactly once.

Run this at every boundary transition (lock acquire, mutation, receipt write, lock release) to cover all crash points.

---

Want me to proceed with implementing this ownership change, or do you have questions about any of the reasoning above?
