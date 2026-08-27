Looking at the two race conditions, the core issue is the **ownership split** between the gateway (lock) and composition root (receipt). The smallest fix:

## Proposed ownership change

**Move receipt recording from composition root into the gateway's lock-release path.**

Current: Gateway releases lock → composition root records receipt (gap exists)
Fixed: Gateway records receipt → then releases lock (atomic from mutation's perspective)

This closes both races:
- Race 1: Receipt is recorded before lock is released, so no gap
- Race 2: Dead holder's receipt is recorded atomically with lock release, not as separate startup step

## Failure path (recording uncertainty fails)

If the gateway fails to record the receipt while holding the lock:
1. Gateway holds lock, mutation result uncertain
2. Receipt write fails
3. Gateway **must not release the lock** - keep it held
4. On next startup/recovery, the held lock (without release) signals "uncertain result pending"
5. Recovery reads lock state → sees held → checks mutation status → records receipt or clears

The lock itself becomes the uncertainty signal when receipt recording fails.

## Independent test

Test: **Simulate receipt-write failure mid-release**

1. Start mutation, acquire lock
2. Perform remote mutation (succeeds)
3. Attempt to record receipt → inject failure
4. Verify: lock remains held, mutation is NOT retried
5. Restart process
6. Verify: recovery detects held lock → resolves uncertainty → records receipt
7. Verify: subsequent mutation succeeds (no duplicate)

This proves the boundary: receipt failure doesn't break safety because lock state is the fallback signal.

---

Want me to search the codebase for the current lock/receipt implementation to verify this analysis?
