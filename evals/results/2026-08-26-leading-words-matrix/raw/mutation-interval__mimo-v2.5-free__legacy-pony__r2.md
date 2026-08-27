This is a design question about concurrency safety, not a codebase task. Let me analyze the problem and propose the solution.

## Analysis

The two races share one root cause: **uncertainty recording lives outside the gateway's critical section**.

- **Race 1**: Gateway releases lock → [window] → composition root records receipt. A new mutation starts in that window and sees no receipt.
- **Race 2**: Dead holder exists → [window] → composition root converts. A new mutation starts in that window and doesn't see the conversion.

Both "fixups" happen in the composition root, after the gateway has already released the lock. The lock protects the mutation, not the bookkeeping.

## Smallest ownership change

**Move uncertainty recording and dead-holder detection into the gateway's lock acquisition step.**

The gateway now owns the full lifecycle:

```text
gateway: check for unconverted dead holder → convert to receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: if result uncertain → record receipt (while still holding lock)
gateway: release lock
```

Composition root no longer records anything. The gateway does it while holding the lock, so no window exists between release and record.

**Failure path when recording uncertainty itself fails:**

If the gateway crashes after releasing the lock but before recording the receipt, it is a dead lock holder. The next gateway acquirer detects it at the top of acquisition and converts it. The lock acquisition itself is the detection point — no separate coordinator needed.

**Independent test to prove the boundary:**

1. Start mutation A, let it acquire the lock and perform the remote call.
2. Kill the gateway process *after* lock release but *before* uncertainty recording.
3. Start mutation B.
4. Assert B detects A as a dead holder, converts it to an uncertainty receipt, and proceeds.
5. Assert A's mutation was applied exactly once (the receipt reflects the true outcome).

This test proves that a dead holder is never invisible to the next acquirer, and that the window between lock release and receipt creation no longer exists as a race surface.

**Why this is the smallest change:** No new coordinator, no feature-level checks. One ownership move — the composition root stops recording, the gateway records inside the critical section — eliminates both races and the startup conversion handles the crash-after-release case.

Want me to look at actual code to see how this maps to the current implementation?
