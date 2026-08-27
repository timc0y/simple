This is a pure systems design problem. Let me analyze the two races and propose the minimal fix.

## Analysis

**The core issue:** The uncertainty receipt is recorded by a different owner than the one that releases the lock, creating a window.

### Race 1: Lock released → recording delay
```
Process A: acquire lock → mutation → release lock
                                                    ← window: no lock, no receipt
Process B: check receipt (empty) → acquire lock → mutation (DUPLICATE)
```

### Race 2: Dead holder → receipt conversion delay  
```
Process A: acquire lock → [dies]
                    lock expires
                                                    ← window: no lock, no receipt yet
Process B: check receipt (empty) → acquire lock → mutation (DUPLICATE)
```

## The Smallest Ownership Change

**Move uncertainty recording into the gateway — the lock holder must be the sole owner of both release and recording.**

Current: `composition root` records uncertainty after gateway releases lock.  
Fixed: `gateway` records uncertainty **before or as part of** releasing the lock.

```
composition root: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt   ← MOVED HERE (before release)
gateway: release lock
```

This eliminates both races because:
- **Race 1**: No window — receipt exists before lock is released
- **Race 2**: If gateway dies before recording, lock never releases (lease expires), and the next holder sees the lock is held but no receipt, so it waits or converts (same as before, but now conversion is the only path)

## Failure Path: Recording Uncertainty Itself Fails

If `record uncertainty receipt` fails (disk/network error):
- **Do not release the lock.** Let the lease expire.
- The lock becomes a durable signal that an in-flight mutation exists.
- On lease expiry, the next holder must convert the dead lock to an uncertainty receipt before proceeding.
- This is safe: the mutation either committed or didn't, and treating it as "unknown" is conservative.

**Rule:** Recording failure → keep lock → force conversion path.

## Independent Test

A test that proves the boundary:

> **Given:** A mutation acquires the lock and performs a remote write.  
> **When:** The process crashes after the remote write but before recording uncertainty.  
> **Then:** A second process must not apply the mutation again until the dead lock is converted to a receipt and the receipt is cleared.

Concretely:
1. Start mutation A, mock the remote call to succeed, mock `record uncertainty` to throw
2. Assert lock is still held (lease not released)
3. Start mutation B, assert it blocks on lock acquisition
4. Expire A's lock lease
5. Assert B converts the dead lock to a receipt
6. Assert B can proceed only after receipt is resolved

This proves the window is closed: no duplicate application is possible without explicit conversion.
