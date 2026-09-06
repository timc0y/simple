Move the uncertainty receipt into the gateway that owns the lock. Its mutation boundary must own this whole interval:

```text
gateway:
  reject if a receipt exists
  acquire or recover the lock
  if recovery finds a dead holder, persist its uncertainty receipt before continuing
  perform the remote mutation
  if its result is unknown, persist the receipt while still holding the lock
  release the lock
```

The composition root calls that one boundary and no longer checks or records receipts itself. Every mutating command already uses the shared boundary, so this removes the race without another coordinator or repeated feature checks.

If persisting an unknown-result receipt fails, the gateway must keep the lock and return a recovery failure. Releasing it would reopen the duplicate-mutation window. A later recovery attempt may persist the receipt and only then release or replace the lock; until then, mutations remain blocked.

The invariant is: a lock may be released only when the preceding mutation is known, or its uncertainty is durably recorded. Recovery of a dead holder follows the same invariant before any new mutation starts.

Prove the boundary independently with real competing CLI processes and forced termination at each transition:

- kill after remote dispatch and before receipt persistence: a second process must remain blocked;
- kill during dead-holder recovery: no process may mutate until the receipt exists;
- force receipt persistence to fail: the lock must remain held and a second process must not reach the remote mutation;
- after receipt persistence succeeds, verify new mutations are rejected until the receipt is resolved.
