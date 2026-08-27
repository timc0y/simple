Make the gateway the single **mutation boundary**. Move receipt ownership into it:

```text
gateway:
  acquire mutation lock
  recover a dead holder into an uncertainty receipt (or block)
  reject if any receipt is outstanding
  perform remote mutation
  if outcome is unknown: durably record receipt
  release lock only after outcome is known or receipt is durable
```

The composition root only calls the gateway; it does not pre-check or post-record anything. Every mutating command uses this one boundary.

This closes both doors because a new mutation cannot observe either:

- an unlocked interval before an unknown outcome is recorded; or
- a dead lock holder before recovery has established whether it represents uncertainty.

If persisting the uncertainty receipt fails, the gateway must **not release the lock**. It should return a failure that says the mutation remains unsafe to retry, leaving the durable lock record as recovery evidence. On the next start, the gateway treats that stale holder as uncertain: it must create the receipt before permitting a mutation, or continue blocking if that conversion also cannot be made durable. Never “clean up” the lock and proceed after a receipt-write failure.

The independent proof is a process-level crash/fault-injection test, not a unit test of command wiring:

1. Start a mutation whose remote side effect can be counted.
2. Kill or fault the process at each boundary transition—especially after the remote call, during receipt persistence, and before dead-holder recovery finishes.
3. Start a second CLI process.
4. Assert it cannot invoke the remote mutation until the prior outcome is known or the durable receipt is explicitly resolved; assert the counted side effect is never greater than one.

That test proves the ownership boundary rather than relying on every feature remembering the protocol.
