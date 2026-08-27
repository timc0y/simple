This is a distributed coordination problem about atomicity of lock release and uncertainty recording. Let me analyze the races and ownership model.

## Analysis

**Current ownership:**
- Composition root: checks receipt, records uncertainty
- Gateway: acquires lock, performs mutation, releases lock

**Race 1:** Lock released → composition dead → new process starts → no uncertainty recorded yet → duplicate mutation.

**Race 2:** Lock holder dies → no one converts holder to receipt → new mutation proceeds unaware.

## Smallest ownership change

**Move uncertainty recording into the gateway, before lock release:**

```text
gateway: acquire lock
gateway: perform remote mutation
gateway: record uncertainty receipt   ← moved here
gateway: release lock
```

This makes the lock-and-receipt handoff atomic. When the next process acquires the lock, uncertainty is already durable.

**Failure path (recording uncertainty itself fails):**

If recording fails, the gateway must not release the lock. The mutation becomes uncertain but the lock stays held until either:
- Recording succeeds (retry), or
- The process crashes and the lock expires, at which point the receipt is indeterminate (the mutation may or may not have been recorded)

The composition root then treats an indeterminate state as "possibly applied" and performs idempotency checks before retrying.

## Independent test

**Boundary proof:** Two concurrent processes, P1 and P2. P1 holds the lock and performs a mutation. Kill P1 *after* the mutation succeeds but *before* uncertainty is recorded. P2 must not proceed until uncertainty is either recorded or the lock expires and the composition root can verify idempotency.

If P2 duplicates the mutation without detecting P1's unrecorded work, the test fails.

## Alternative ownership change

Keep the current split but add an **ownership transfer** step: gateway transfers ownership of uncertainty to composition root *while still holding the lock*, and composition root confirms the transfer before the gateway releases. This is slightly larger but preserves the composition root's authority over uncertainty.

The first approach (gateway records before release) is smaller. Want me to detail either path further?
