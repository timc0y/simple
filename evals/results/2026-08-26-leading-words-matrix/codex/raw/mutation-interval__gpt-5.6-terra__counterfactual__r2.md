Move receipt ownership into the existing mutation gateway. Make it the single mutation boundary; remove the composition-root check/record steps.

```text
gateway:
  acquire durable lock
  reconcile any dead holder into an uncertainty receipt
  reject if any receipt exists
  perform remote mutation
  if outcome is unknown: durably write receipt
  release lock only after the outcome is known or receipt is durable
```

A dead lock is therefore never simply reclaimed: while holding/recovering it, the gateway first creates the receipt. If conversion fails, it leaves the lock unreclaimed and fails closed.

Likewise, if recording an unknown outcome fails, the gateway must retain the lock (including its durable attempt identity) and report that it cannot establish safety. Recovery retries conversion; if it still cannot write the receipt, no process may start a mutation. This sacrifices availability, not safety.

The boundary invariant is:

> A lock may be released or reclaimed only when the prior mutation is known safe, or a durable uncertainty receipt prevents another mutation.

No new coordinator is needed, and commands only call the gateway’s one mutation operation.

Prove it with an independent, multi-process test using a remote test server that counts applied mutations:

1. Start process A; force-kill it immediately after the server applies the mutation, before uncertainty is persisted.
2. Start process B and assert its remote call count remains zero: it must first convert A’s dead lock to a receipt, then refuse.
3. Repeat with receipt persistence forced to fail. Assert B still makes no remote call and the stale/held lock remains.
4. Also pause A after an unknown result but before its normal release; assert B cannot enter until the receipt is durable.

That test exercises the ownership seam, rather than merely unit-testing either lock or receipt in isolation.
