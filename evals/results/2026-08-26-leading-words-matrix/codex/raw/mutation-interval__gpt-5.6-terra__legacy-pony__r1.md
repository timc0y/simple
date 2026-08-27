Make the existing gateway own the entire mutation interval. Do not add a coordinator.

```text
gateway.runMutation():
  acquire/recover the mutation lock
  refuse if an uncertainty receipt exists
  if a dead holder is found, durably create its uncertainty receipt, then refuse
  perform remote mutation
  if outcome is unknown, durably record uncertainty receipt
  release lock
```

The composition root should only call `runMutation`; it must no longer check or record receipts itself.

The invariant becomes: the gateway never releases or grants the lock unless the prior mutation is known resolved or has a durable uncertainty receipt. Thus both transitions are protected:

- Unknown remote outcome: write and flush the receipt before releasing the lock.
- Dead holder: while recovering the lock, convert it to a receipt before admitting any new mutation.

If receipt recording fails, fail closed: retain the lock and return an error. If that process then dies, recovery again attempts receipt creation before any new mutation can proceed. Never release the lock merely because receipt persistence failed.

The independent proof is a multi-process black-box test against the CLI’s real persistent lock/receipt store and a controllable remote endpoint:

1. Force termination after every gateway transition—especially after remote submission, during unknown-result handling, and during dead-holder recovery.
2. Start a competing CLI process at each point.
3. Assert it never reaches the remote mutation unless the first result is known resolved and no receipt exists.
4. Specifically inject receipt-write failure; assert the lock remains blocking, and after holder death the next process creates/refuses on the receipt rather than mutating.

That test verifies the public ownership boundary, not merely the gateway’s internal call order.
