I'll analyze this concurrency control problem. Let me first explore the codebase to understand the current implementation.Now I understand the problem. Let me analyze the two races and propose the smallest fix.

## Analysis

**Current ownership split:**
- Composition root: checks/records receipts
- Gateway: acquires/releases lock, performs mutation

**The gap:** The same entity that releases the lock doesn't own receipt conversion/checking/recording. This creates a window between lock release and receipt recording where a new mutation can start.

**Race 1:** Process A releases lock → Process B starts (no receipt yet) → Process B acquires lock → duplicate mutation.

**Race 2:** Process A dies (holds lock, no receipt) → Process B starts (no receipt to block it) → Process B hangs on lock acquisition.

## Smallest ownership change

**Move receipt checking and recording into the gateway**, making the gateway own the entire mutation lifecycle:

```
gateway: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: release lock
gateway: record an unknown result when needed
```

This eliminates the gap because the same owner that releases the lock also checks for and records receipts. The invariant "no new mutation while any prior effect is unknown" holds because:
1. Before acquiring the lock, the gateway checks for outstanding receipts (blocks new mutation if prior effect unknown)
2. After releasing the lock, the gateway records uncertainty before allowing any new mutation

**When recording uncertainty itself fails:** The lock is already released, so the mutation completed but we can't confirm the result. The gateway should:
1. Log the failure
2. Keep the receipt state as "pending" (not cleared)
3. On next startup, the gateway will see the pending receipt and block new mutations until the uncertainty is resolved

**Independent test:** Force a process to die between lock release and receipt recording, then start a new process and verify it blocks until the dead holder's state is resolved. This proves the boundary works even when the receipt recording fails.
