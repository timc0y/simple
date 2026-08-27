Move receipt ownership into the existing mutation gateway. Its single public mutation operation must own the whole safety interval:

```text
no outstanding receipt
→ acquire/recover lock
→ perform remote mutation
→ if outcome is unknown, durably record receipt
→ release lock
```

The composition root should only invoke that operation and present its result. It must not separately check or record receipts.

Recovery follows the same rule: a dead lock is not available work. The gateway first converts the dead holder into a durable uncertainty receipt, then makes the lock available. Thus a new mutation can never pass between “holder died” and “receipt exists.”

If receipt recording fails—or its result is ambiguous—the gateway fails closed: retain the lock (and on a later recovery, retry/verify receipt creation before releasing it). A failed release after a confirmed receipt is safe, though it may require cleanup; a released lock without a confirmed receipt is not.

The invariant becomes:

> A gateway may admit a mutation only when it holds the lock and no durable uncertainty receipt exists. It may release that lock after an unknown remote outcome only once the receipt is confirmed durable.

Prove it independently with a real multi-process test against the durable lock/receipt stores and a controllable remote mutation. Kill process A after the remote call returns an unknown result, at each boundary transition—including during stale-lock recovery and receipt write—then start process B. Assert B never reaches the remote mutation unless recovery has produced a durable receipt and that receipt has been explicitly resolved.
