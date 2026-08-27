The smallest change is to make the gateway own the entire mutation boundary:

```text
gateway:
  acquire or recover the lock
  reconcile any stale holder into an uncertainty receipt
  reject if any receipt exists
  perform the remote mutation
  if the result is unknown:
      persist the receipt while still holding the lock
  release the lock only after reconciliation is complete
```

The composition root should stop checking and recording receipts. Every mutating command should enter this one gateway operation.

The critical rule is:

> The lock is never released while the remote effect is unknown and the receipt is not durable.

If recording the uncertainty receipt fails, the gateway must fail closed:

- retain the lock, if the process can retain it;
- return an error and permit no new mutation;
- if the process dies, the next gateway invocation reclaims the stale lock and retries receipt conversion;
- if conversion still fails, it leaves the mutation blocked.

A stale lock must therefore be treated as an unresolved mutation, not merely as an available lock. Recovery and ordinary mutation admission belong to the same gateway owner.

The independent proof should exercise the public mutation boundary with two real competing processes and an instrumented remote operation:

1. pause after the remote mutation has happened;
2. terminate the holder before receipt recording;
3. start the second process;
4. verify it cannot call the remote mutation;
5. release or recover the stale lock, complete receipt recording, and verify the second process still remains blocked by the receipt.

Repeat with receipt persistence forced to fail and verify that no subsequent process can mutate. This proves the ownership boundary and failure behavior, rather than merely proving that helper methods were called in a particular order.
