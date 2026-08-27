This is a pure concurrency design problem. Let me analyze the races and find the minimal fix.

## Analysis

**The root cause**: The lock owner (gateway) and the receipt recorder (composition root) are different entities. This creates a window between lock release and receipt recording where a new process can start and see no evidence of the in-flight mutation.

**Race 1**: Lock released → new process starts → finds no receipt → acquires lock → duplicate
**Race 2**: Holder dies → new mutation starts → finds no receipt (dead holder not yet converted) → duplicate

## The smallest ownership change

**Move receipt recording into the lock holder, before lock release.**

New sequence:
```
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt (if needed)  ← moved here
gateway: release lock
```

This closes both races because:
- The receipt is recorded while the lock is still held
- No new process can acquire the lock and check for a receipt until the current holder releases
- If the holder dies mid-mutation, the lock is recovered (not released), so no duplicate starts

**Failure path when recording uncertainty fails**: If the gateway cannot record the receipt, it must NOT release the lock. The lock stays held. On restart, the lock is recovered, the mutation is re-attempted or rolled back, and no duplicate is applied.

**The independent test**: 
1. Acquire lock, perform mutation, fail to record receipt (simulated crash)
2. Verify lock is NOT released
3. Restart, verify lock recovery prevents duplicate application

This is the minimal change: one ownership transfer (receipt recording from composition root to gateway), one ordering constraint (receipt before lock release), and one failure rule (recording failure prevents lock release).
