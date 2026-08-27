I'll search for any existing code related to mutation locks and uncertainty receipts to understand the current implementation.This is a concurrency design problem. Let me clarify a few things before proposing a solution:

**Understanding the race conditions:**

1. **Race 1** (gap between lock release and uncertainty recording): Process A releases the lock at step 4, then Process B starts and acquires the lock before Process A records the unknown result at step 5. Process B sees no outstanding receipt and proceeds with a mutation that may duplicate Process A's.

2. **Race 2** (dead holder conversion): Process A holds the lock, crashes. Process B starts, sees no outstanding receipt (dead holder not yet converted), acquires the lock, and starts a mutation while Process A's mutation may have partially applied.

**Questions to clarify the solution:**

1. **Current ownership**: Who currently owns the lock (gateway only? both composition root and gateway?) and who writes the uncertainty receipt?

2. **Receipt scope**: Is the uncertainty receipt per-mutation (unique ID) or per-resource?

3. **Failure semantics**: When you say "recording uncertainty itself fails" — is this a crash, a storage error, or a network error?

4. **Scope of change**: Are you looking for a code change in an existing codebase, or a design-level answer (smallest conceptual ownership shift)?

The "smallest ownership change" that comes to mind is: **move uncertainty recording into the lock holder (gateway) and make it happen atomically with lock release** — either both succeed or the lock isn't released. This eliminates the gap entirely. But I want to confirm this aligns with your system's constraints before detailing the full plan.
