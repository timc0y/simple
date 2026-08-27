I need to explore the codebase to understand the current mutation handling before proposing changes. Let me start by examining the relevant files.This is a pure design/architecture question — no codebase to inspect. Let me analyze the races and propose the fix.

## Analysis

The root cause is **split ownership** of the mutation interval. Four operations span two owners:

| Owner | Operations |
|-------|-----------|
| Composition root | check receipt, record receipt |
| Gateway | acquire lock, release lock |

The gap between `release lock` (gateway) and `record receipt` (composition root) is where both races live:

1. **Race 1:** Lock released → new process starts, sees no receipt, starts mutation → old process records receipt too late.
2. **Race 2:** Process crashes with lock held → new process starts, doesn't see dead lock → acquires lock → duplicates mutation.

## Proposed Plan

### Smallest ownership change: give the gateway all four operations

Move receipt **checking** and **recording** into the gateway, keeping them inside the lock:

```
gateway: check outstanding receipt       (was composition root)
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt      (was composition root)
gateway: release lock
```

On startup (dead lock detection also moves into gateway):
```
gateway: if lock held by dead process → convert to receipt
gateway: check outstanding receipt
gateway: acquire lock
...
```

This eliminates the gap. The lock is held until the receipt is recorded. No window exists for another process to see neither lock nor receipt.

### Failure path: recording uncertainty itself fails

If `record receipt` fails (disk full, permissions, etc.):

- **Lock is still held** — the process cannot release it without recording.
- Process should **crash intentionally** (or propagate the error as fatal).
- On next startup, the dead lock holder is detected and converted to a receipt.
- The receipt records "unknown result" — safe, may cause an unnecessary re-check but never a duplicate.

The invariant holds because the dead-lock-to-receipt conversion is the fallback for every failure between mutation and receipt recording.

### Independent test that proves the boundary

```
Test: "competing process sees dead lock as receipt"

Setup:
  Process A: acquire lock, perform mutation, CRASH before recording receipt
  Process B: start after Process A crashes

Assertions:
  1. Process B detects Process A's dead lock
  2. Process B converts dead lock to uncertainty receipt
  3. Process B checks outstanding receipt before proceeding
  4. Process B does NOT perform mutation until receipt is resolved
  5. No mutation is applied twice
```

This test exercises race 2 directly. Race 1 is eliminated by construction (receipt is recorded before lock release).

### Summary of changes

| What | Before | After |
|------|--------|-------|
| Receipt check | composition root | gateway (inside lock) |
| Lock acquire/release | gateway | gateway (unchanged) |
| Receipt recording | composition root (after lock release) | gateway (before lock release) |
| Dead lock conversion | composition root (startup) | gateway (startup) |
| **Owners** | **3 (root, gateway, root)** | **1 (gateway)** |

The smallest change: consolidate the four operations under one owner (gateway), recording the receipt while the lock is still held. No new coordinator, no per-feature repetition.
