Move the receipt lifecycle into the mutation gateway—the existing lock owner. Do not add a coordinator or leave checks to command composition.

The gateway owns one closed interval:

```text
check/resolve receipt
→ recover dead holder to receipt, if needed
→ acquire lock
→ perform remote mutation
→ durably record uncertainty if outcome is unknown
→ release lock
```

It must not grant a new lock until either:

- no receipt exists, or
- the existing receipt is explicitly resolved; and
- any abandoned lock has first been durably converted to a receipt.

If a remote result is unknown, the gateway writes the receipt before releasing the lock. If that receipt write fails, it must fail closed: retain the lock (and retry or require repair), never report the mutation boundary as available. If the holder then dies, recovery treats that abandoned lock as potentially applied and must persist the receipt before another mutation can proceed. If conversion/persistence still fails, acquisition fails closed.

Thus every mutating command calls one gateway operation; callers receive a completed, known-failed, or blocked/unknown outcome but cannot create a gap between lock ownership and uncertainty state.

Prove this with an independent multi-process, black-box test using real lock/receipt storage and a controllable fake remote service:

- pause the remote call after it may have applied, force an unknown result, and race a second process;
- kill a lock holder after the remote call, before receipt persistence;
- inject receipt-write failures in both paths.

In every case, assert the second process cannot invoke the remote mutation until a durable receipt is present and resolved. The decisive assertion is that the fake remote observes at most one mutation for the operation, regardless of process timing or termination.
