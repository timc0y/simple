Move the receipt lifecycle into the mutation-lock gateway. The composition root should only call one boundary, e.g. `runMutation(...)`; it must not check or create receipts itself.

That boundary owns this whole interval:

```text
reject if a durable uncertainty receipt exists
acquire / recover the durable mutation lock
perform remote mutation
if outcome is unknown: persist receipt while still holding lock
release lock only after outcome is known or receipt is durable
```

Startup recovery belongs there too: when it finds a dead holder, it must create the uncertainty receipt before making that lock available to another mutation. If conversion fails, leave the durable lock record as the blocker and fail closed. Do not treat it as available.

Likewise, if recording an unknown result fails, do not release or delete the lock. Return a safety-blocking error. Its durable holder record remains recoverable; a later boundary invocation retries conversion before permitting any mutation. This requires the lock record to survive process death and to carry enough state to conservatively mean “this holder may have sent a mutation.” A false uncertainty is acceptable; allowing a duplicate is not.

The resulting invariant is simple: the only transition from “a mutation may have happened” to “another mutation may start” is performed by one owner, after a durable known-result decision or durable receipt exists.

Prove it with a process-level crash test, independent of in-process mocks:

- Run a real CLI process against a controllable fake remote that records each mutation.
- Kill it at each boundary transition, especially after remote acceptance and before receipt persistence, and during dead-holder recovery.
- Start a separate CLI process attempting the same mutation.
- Assert it never reaches the remote while the lock/receipt is unresolved; after explicit receipt resolution, it may proceed.
- Inject receipt-write failure, terminate the first process, then repeat the second-process assertion.

That test demonstrates the ownership boundary survives the exact two-open-door races, including the failed-receipt path.
