The smallest safe change is to make the shared mutation boundary—the gateway or mutation service—own the entire safety interval.

It must perform this sequence for every mutating command:

```text
acquire/recover mutation lock
  ├─ while owning it, inspect outstanding receipts
  ├─ if the previous holder is dead, persist its uncertainty receipt
  ├─ refuse if any receipt remains outstanding
  ├─ perform the remote mutation
  ├─ if the result is unknown, persist the receipt
  └─ release the lock only after receipt persistence succeeds
```

The composition root should only invoke this boundary. It must not separately check receipts, and feature implementations must not repeat the protocol.

The critical rule is:

> The lock must not become available while the result can still be unknown and unrecorded.

If recording uncertainty fails, fail closed: return an error and keep the lock held or marked unavailable. Do not release it and do not permit another mutation. If the process then dies, the next owner must treat the stale lock as an uncertainty candidate, retry receipt creation, and continue refusing mutations until that durable receipt exists. Receipt-recording failure is therefore an operational outage, never permission to proceed.

The proof should be an independent black-box boundary test using competing real processes and fault injection:

1. Pause or kill a holder after the remote effect but before uncertainty recording.
2. Start a contender.
3. Assert that recovery creates the durable receipt and the contender performs no remote mutation.
4. Separately force receipt persistence to fail and assert that the lock remains unavailable and a contender is refused.

This test must exercise the shared mutation boundary itself, not the composition root’s checks; otherwise it cannot prove that the lock and receipt have one owner.
