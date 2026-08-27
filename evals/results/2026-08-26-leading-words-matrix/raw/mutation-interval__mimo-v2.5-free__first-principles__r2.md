I'll start by exploring the codebase to understand the current mutation lock and uncertainty receipt implementation.This is a pure design/architecture problem — no codebase exists here, just the problem statement and SIMPLE.md. Let me reason from first principles.

## Analysis

The core defect: **the lock owner does not own receipt conversion, checking, or recording** (SIMPLE.md:17). This splits the invariant across three owners, creating the two races.

### Race anatomy

| Race | Window | Root cause |
|------|--------|------------|
| 1 | Lock released → uncertainty recorded | Gateway no longer owns the interval; composition root hasn't recorded yet |
| 2 | Dead holder → receipt conversion | Startup check belongs to composition root, not the gateway |

Both exist because the lock owner (gateway) releases the lock *before* the uncertainty state is settled. A second process can enter between release and record.

### Smallest ownership change

**Give the lock owner the obligation to record uncertainty.** No new coordinator, no repeated checks in every feature.

The new sequence:

```text
gateway: acquire lock
gateway: check outstanding receipt (fail-fast)
gateway: perform remote mutation
gateway: record uncertainty if needed    ← moved in
gateway: release lock                    ← moved down
```

On startup, the gateway itself converts a dead holder into an uncertainty receipt before attempting acquisition. One owner, one interval, no window.

### Failure path: recording uncertainty itself fails

If the crash happens after the mutation succeeds but before uncertainty is recorded:

1. Next process starts.
2. Gateway attempts to acquire the lock. The dead holder's lock is still present (or the lock file/state is stale).
3. Gateway detects a dead holder → converts it into an uncertainty receipt.
4. New mutation is blocked until the receipt is resolved (the prior mutation's result is queried or re-applied idempotently).

The safety property holds: if we cannot prove the mutation succeeded, we must not apply it again. The dead-holder-to-receipt conversion is the fallback that closes the window.

### Independent test proving the boundary

```
Setup: Two CLI processes (P1, P2) sharing the same mutation boundary.

1. P1 acquires lock, performs remote mutation, crashes before recording uncertainty.
2. P2 starts.
3. Assert: P2 detects dead holder, converts to uncertainty receipt, blocks new mutation.
4. Assert: P2 resolves receipt (queries server), applies or skips mutation.
5. Assert: At no point is the mutation applied twice.

Repeat with P2 starting in the window between lock release and uncertainty
recording to verify race 1 is closed.
```

The test is independent because it exercises the boundary through observable outcomes (mutation count on the server) rather than implementation internals.

### Why this is the smallest change

- No new coordinator.
- No repeated checks scattered across features.
- The gateway already performs the mutation and holds the lock — recording uncertainty and checking receipts are local obligations that follow naturally.
- Startup dead-holder detection is the same operation, just owned by the gateway.The smallest change is to **move receipt checking, uncertainty recording, and dead-holder conversion into the gateway as part of the lock interval**. One owner, one atomic boundary, no race window. The failure path for recording uncertainty itself relies on the startup dead-holder conversion catching stale state. The independent test exercises forced termination at every boundary transition and observes mutation count on the server.
