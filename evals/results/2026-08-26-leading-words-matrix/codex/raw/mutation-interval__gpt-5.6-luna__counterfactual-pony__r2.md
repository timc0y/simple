The smallest ownership change is to make the gateway own the entire mutation interval:

```text
gateway:
  acquire lock
  reconcile any stale holder into an uncertainty receipt
  reject if any receipt exists
  perform remote mutation
  if result is unknown:
      record receipt while still holding the lock
      if recording fails: keep the lock/quarantine state and fail closed
  release lock
```

The composition root should only invoke the gateway; it must not check or record receipts independently.

For a dead holder, the next gateway invocation may take the stale lock exclusively, write the receipt, and refuse the new mutation. If receipt recording fails, it must not release the lock or permit mutation. The failure must remain retryable: a later process can detect the retained/stale ownership and retry receipt conversion. A process that dies during conversion produces the same recoverable stale-holder case.

The independent proof is a real multi-process boundary test:

1. Process A acquires the lock and is forced to terminate after the remote mutation but before receipt recording.
2. Process B starts after A’s lock is stale.
3. B must create the uncertainty receipt and refuse the mutation.
4. Assert the remote mutation was invoked exactly once and the receipt exists.
5. Repeat with receipt persistence forced to fail; assert no subsequent process can mutate until recording succeeds.

This proves the gateway boundary, rather than duplicated caller checks, owns the safety invariant.
