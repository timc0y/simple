I'll analyze this distributed systems problem. Let me first explore the codebase to understand the current implementation of the mutation lock, uncertainty receipt, and related components.This is a pure design-reasoning problem, not a codebase modification. Let me load the `simple` skill for first-principles reasoning.## Analysis

Following the simple design process against the repository facts in `SIMPLE.md`:

### Invariant (without naming implementation)

Every mutation must complete its full lifecycle — from intent to known outcome — before any other mutation can begin. A process death at any point must leave a recoverable state that prevents duplication.

### Root cause

The current split crosses three owners and creates a gap:

```
gateway: release lock              ← lock free, no receipt yet
                                ↑ RACE WINDOW ↑
composition root: record receipt  ← too late
```

The gateway releases the lock *before* the composition root records the uncertainty receipt. Race 1 lives in this gap. Race 2 is the same gap viewed from startup: a dead holder's lock is released but no receipt exists to tell the next process "this mutation's outcome is unknown."

### The smallest ownership change

**The gateway owns the receipt. Record it while holding the lock, then release.**

```
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt   ← under lock, part of critical section
gateway: release lock
```

This closes both races because the receipt exists before any other process can acquire the lock. The composition root no longer records receipts — it only clears them after a known outcome.

The startup path stays simple: acquire the lock (which detects a stale/dead holder), check for an outstanding receipt, record one if the prior mutation is unknown, then proceed. The stale lock *is* the uncertainty signal — converting it to a receipt happens at lock acquisition time, not as a separate step.

### Failure path: recording the receipt itself fails

If the gateway crashes after the remote mutation but before the receipt is written:

1. The lock file remains on disk (stale).
2. Next process starts, detects the stale lock, acquires it.
3. Finds no receipt → records one (retrying the failed step).
4. Proceeds safely.

No special error handling is needed — the startup path *is* the retry path. The only requirement: receipt recording must be idempotent (writing the same receipt twice is harmless).

### Independent test proving the boundary

A fault-injection test with two concurrent processes:

1. **Process A**: acquire lock → perform mutation → **SIGKILL before receipt write**
2. **Process B**: start → acquire stale lock → find no receipt → record receipt → perform mutation
3. **Assert**: exactly one remote mutation occurred.

This proves the invariant holds under forced termination at the exact boundary transition (post-mutation, pre-receipt). It exercises race conditions 1 and 2 simultaneously and requires no mocked timing — just process lifecycle control.
