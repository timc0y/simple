This is a concurrency analysis problem. Let me first check if there's relevant code in the workspace to understand the current implementation, then provide the analysis.This is a pure design/analysis problem — the workspace is empty. Let me analyze the races and provide the smallest fix.

---

## Analysis

The core issue: **three owners** create a temporal gap between lock release and receipt recording.

```
composition root ─── checks receipt ───────────────── records unknown result
                         │                                    │
gateway ──────────────── acquire lock → mutate → release lock ┘
                         ▲                                    │
                         └──────── WINDOW ───────────────────┘
```

### Race 1
Process B starts in the window → sees no receipt → proceeds → duplicate mutation.

### Race 2
Dead holder exists → new mutation starts before conversion to receipt completes → proceeds without knowing.

---

## Smallest ownership change

**Move receipt recording to the lock owner, before lock release.**

The gateway (or whoever releases the lock) must also record the uncertainty receipt **while still holding the lock**. This collapses three owners into one critical path:

```
gateway: acquire lock
gateway: perform mutation
gateway: record receipt      ← while lock held
gateway: release lock
```

No window exists. No second owner touches the receipt.

For dead-holder conversion: the process that acquires the orphaned lock must also convert it to a receipt before releasing.

---

## Failure path (recording uncertainty fails)

If receipt recording fails after a successful mutation:

1. **Do not release the lock.** The held lock *is* the uncertainty signal — no other process can proceed.
2. Surface the error to the caller. The caller decides retry or manual recovery.
3. On restart, the orphaned lock + known-failed-recording = "mutation may have succeeded, must assume unknown." The recovery path treats this as an uncertainty receipt.

If the process crashes before recording: the lock becomes the dead holder, which the next acquirer converts to a receipt (same single-owner path).

---

## Independent test

```rust
#[test]
fn no_duplicate_when_recording_fails() {
    // Setup: mock gateway that succeeds on mutation, fails on record_receipt
    let gateway = Gateway::with_recording_failure();
    let lock = Lock::new();
    
    // Process A acquires lock, mutates, fails to record receipt, panics
    let result_a = std::panic::catch_unwind(|| {
        gateway.acquire_lock(&lock);
        gateway.perform_mutation();
        gateway.record_receipt(); // FAILS
        // process crashes here, lock not released
    });
    
    // Process B starts
    // Either: B cannot acquire lock (A still holds it) → blocked
    // Or: A crashed, lock is orphaned → B converts dead holder to receipt
    let result_b = gateway.try_apply_mutation(&lock);
    
    // In both cases, B never applies the mutation a second time
    assert!(!result_b.applied || result_b.recovered_from_uncertainty);
    
    // Lock is eventually released (either by B's recovery or restart)
    assert!(lock.is_available());
}
```

This test proves the boundary: even when the receipt path fails, the lock prevents duplicate application, and recovery converges to a single receipt.

---

**Summary:** The smallest change is making the lock owner also the receipt recorder — one entity, atomic critical section, no window. The held lock is the fallback when recording fails. The test injects a recording failure and asserts no duplicate mutation occurs.
