The smallest safe change is to make the gateway own the entire mutation boundary:

```text
gateway:
  acquire or recover the mutation lock
  while holding it:
    reject if an uncertainty receipt exists
    perform the remote mutation
    if the result is unknown, durably record the receipt
  release the lock only after the above succeeds
```

Move the receipt check and uncertainty recording out of the composition root. Every mutating command already passes through the gateway, so this closes both gaps without another coordinator.

Startup recovery belongs there too. If the gateway finds a dead holder, it must first convert that holder into a durable uncertainty receipt, then refuse the new mutation. Recovery and acquisition must be one serialized operation: no “release stale lock, then record receipt” interval.

If recording uncertainty fails, fail closed:

- do not release the lock;
- do not permit another mutation;
- return an error and leave the lock/blocked state recoverable.

If the process dies after the remote mutation but before recording, the next gateway invocation must treat the dead holder conservatively as an unknown result. It may proceed only after the receipt is durably recorded. If receipt storage is unavailable, mutation remains blocked.

The independent proof is a black-box, multi-process test using a counting fake remote:

1. Process A acquires the gateway boundary.
2. Force termination after the remote call but before receipt recording.
3. Process B starts and attempts a mutation.
4. Verify B records/requires the uncertainty receipt and never calls the remote.
5. Repeat with receipt-storage failure and verify the lock remains blocking.
6. Also test that an unknown result records its receipt before a competing process can acquire the lock.

That test must coordinate at process boundaries, not mock the gateway’s internal check order; otherwise it does not prove ownership of the safety interval.
