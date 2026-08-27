Make the gateway own the entire mutation interval.

Its public mutation operation should:

1. Acquire the mutation lock.
2. Reconcile any abandoned holder into an uncertainty receipt.
3. Refuse to proceed if any receipt exists.
4. Record that this operation is active.
5. Perform the remote mutation.
6. If the result is unknown, persist its receipt while still holding the lock.
7. Release the lock only after receipt handling succeeds.

The composition root should only invoke this operation. It should not check or record mutation state separately.

The key invariant is:

> The lock is never available to a new mutation while the previous mutation is unresolved.

If uncertainty recording fails, the gateway must not release the lock. It should return an error while retaining or renewing the lock. If the process dies, lock recovery must conservatively convert the abandoned active operation into a durable receipt before granting the lock to another mutation. Receipt writes must be retryable by operation ID; an ambiguous write outcome is treated as unresolved.

No new coordinator is needed. The gateway becomes the single owner of the safety boundary, including startup recovery.

The independent proof should use the gateway’s public API with real competing processes, a durable lock/receipt store, and a controllable fake remote:

- Process A enters mutation and is killed after the remote call but before uncertainty recording.
- Process B starts immediately after lock recovery.
- Assert that B creates or observes the receipt, performs no remote mutation, and reports the unresolved operation.
- Separately force receipt persistence to fail and assert that the lock remains unavailable; after A dies, B must recover the stale holder into a receipt rather than mutate.

This test must coordinate at the externally observable boundaries, not inspect private call order.
