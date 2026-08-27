Move the entire safety interval into the existing mutation gateway. Do not add a coordinator.

The gateway must own this linear path:

```text
acquire/recover lock
check for an outstanding receipt
if the prior holder is dead, durably create its uncertainty receipt
perform remote mutation
if outcome is unknown, durably record its receipt
release lock
```

The composition root should only invoke the shared mutation boundary; it must stop checking or recording receipts itself. Every mutating command then gets the same rule by construction.

The critical ordering is: record uncertainty before releasing the lock. Likewise, stale-lock recovery must convert the dead holder to a receipt before the gateway admits another mutation. The lock metadata must therefore retain enough operation identity/context for recovery to write that receipt.

If receipt recording fails after an unknown remote outcome, retain the lock and fail the command closed. Do not release it or start another mutation. If that process subsequently dies, startup recovery treats that dead holder as uncertain and must create the receipt before admitting work. If recovery still cannot persist the receipt, it also fails closed.

Prove the boundary independently with real CLI processes and durable storage, not a unit test of gateway internals:

1. Start a mutation and force termination at each transition around remote execution, receipt persistence, lock release, and stale-holder recovery.
2. Start a competing CLI process after each termination/paused transition.
3. Assert it cannot invoke the remote mutation until uncertainty is durably represented or resolved.
4. Assert the remote endpoint observed at most one call for the operation.

That test directly distinguishes a closed gateway boundary from the former split ownership.
