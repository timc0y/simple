The smallest safe ownership change is to make the gateway own the entire mutation boundary:

```text
gateway:
  acquire lock
  while holding it:
    recover any dead holder into a durable uncertainty receipt
    reject if an outstanding receipt exists
    perform remote mutation
    if the result is unknown:
      record the uncertainty receipt
    release lock only after recording succeeds
```

The composition root should make one call—“execute this mutation”—and must not check or record receipts itself.

This closes both doors:

- A new process cannot observe “lock free, receipt not yet written,” because the lock is not released until receipt recording completes.
- A new process cannot mutate after a dead holder without first converting that holder’s possible in-flight mutation into a receipt, while holding the newly acquired lock.

If recording uncertainty fails after the remote result is ambiguous, the gateway must fail closed: do not release the lock and do not start another mutation. Return an error if possible; if the process dies, stale-lock recovery must retry the conversion. This sacrifices liveness temporarily, but preserves at-most-once safety. A successful receipt write followed by a crash is also safe: recovery sees the receipt and refuses mutation.

The independent proof should be a gateway contract test with two callers and barriers:

1. Caller A acquires the lock and gets an ambiguous remote result.
2. Pause before receipt recording.
3. Caller B attempts the mutation and must remain blocked.
4. Allow A to record the receipt and release the lock.
5. Caller B must observe the receipt and must not invoke the remote mutation.

A second case should simulate a dead holder; acquisition recovery must create the receipt before the new remote call is permitted. The assertion that matters is at the gateway boundary: the remote mutation mock is invoked at most once, regardless of lock release, receipt timing, or holder death.
