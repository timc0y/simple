Move the whole interval into the existing mutation gateway. It becomes the single mutation boundary; the composition root no longer checks or records receipts.

The gateway’s contract is:

1. Before granting a mutation, reject if a receipt exists.
2. On finding a dead lock holder, while still owning that lock, durably create the uncertainty receipt. Only then release/reclaim the lock; otherwise fail closed.
3. Hold the lock through the remote call and its outcome handling.
4. If the outcome is unknown, durably record the receipt before releasing the lock.
5. If recording the receipt fails, keep the lock and return an error. A later process treats that dead holder as uncertain and must create the receipt before any mutation can start.

This removes both gaps: no process can observe an unlocked, receipt-free interval after an unknown mutation, and stale-lock recovery is part of admission—not a separate startup chore.

The critical rule is: **a lock may cease to block mutations only after either a known result is established or uncertainty is durable.** Recovery must not delete/release a stale lock and then write the receipt; that recreates the race.

Prove it independently with real competing CLI processes and a controllable remote endpoint:

- Kill the holder at each transition: after lock acquisition, during/after the remote request, before/after receipt persistence, and before release.
- Start a second process after each kill.
- Assert it never sends a second remote mutation once the first request may have taken effect, until the persisted receipt is explicitly resolved.

That test exercises the gateway’s public boundary and process/durable-state semantics, rather than merely asserting internal call order.
