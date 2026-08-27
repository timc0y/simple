Move the receipt responsibility into the lock owner. Make one `MutationGate` own the whole interval:

```text
MutationGate:
  acquire/recover lock
  refuse if a receipt exists
  convert a dead holder to a receipt before admitting work
  perform remote mutation
  if outcome is unknown, persist receipt while still holding lock
  release lock only after the outcome is known or receipt is durable
```

Every mutating command calls that one boundary; the composition root no longer checks or records receipts.

The safety claim becomes: **the gate never admits a remote mutation unless it holds the lock and there is durable evidence that no earlier mutation has an unknown outcome.**

For an indeterminate remote result, receipt persistence is part of releasing the gate:

- Receipt write succeeds: release the lock and return the uncertain-result error.
- Receipt write fails: fail closed—keep the lock / keep the holder state recoverable, return an error, and do not admit another mutation.
- If that holder later dies, recovery must first create the receipt. If recovery cannot persist it either, it must refuse all mutations; it must not discard or bypass the dead-holder state.

This also closes stale-holder startup: recovery happens inside acquisition, before any caller can reach the remote operation.

The independent proof should be a black-box, competing-process test using a controllable fake remote service:

1. Let process A acquire the gate and make the fake service apply the mutation, then force its result to be unknown.
2. Kill A at each boundary point, especially after the remote side effect and before receipt persistence.
3. Start process B and attempt the same mutation.
4. Assert the service receives no second mutation: B either sees the durable receipt or is blocked because recovery/receipt persistence failed.

That test validates the boundary without relying on command-specific checks or implementation internals.
