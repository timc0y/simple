The smallest ownership change is: make the gateway own the entire mutation boundary.

```text
gateway:
  acquire mutation lock
  while acquiring:
    convert any dead holder into an uncertainty receipt
    refuse if any receipt exists
  perform remote mutation
  if result is unknown:
    record receipt
    only then release lock
  otherwise:
    release lock
```

This closes both races:

- The lock is not released until uncertainty is durably recorded.
- Recovery of a dead holder happens as part of lock acquisition, before a new mutation can begin.
- Every mutating command is protected because they all use the gateway.

If recording the uncertainty receipt fails, the gateway must not release or hand off the lock. It should return an error while retaining the lock; after process death, the next acquisition retries conversion before granting access. Receipt recording and lock release should be ordered as “record first, release second.”

The boundary test should bypass the composition root and exercise the gateway directly with two real competing processes:

1. Force process A to become unknown, then pause before receipt recording.
2. Start process B; verify it cannot mutate.
3. Make receipt recording fail; verify the lock remains unavailable.
4. Kill A; let B recover the dead holder.
5. Verify B creates/observes the receipt and the remote mutation count remains one.

That test proves the gateway owns the safety invariant rather than merely inheriting checks from callers.
