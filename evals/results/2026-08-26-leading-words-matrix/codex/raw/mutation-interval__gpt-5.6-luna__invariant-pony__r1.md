The smallest fix is to make the existing gateway the single mutation boundary.

Its operation becomes:

```text
gateway.mutate():
    acquire lock
    recover any stale holder as an uncertainty receipt
    reject if an uncertainty receipt exists
    perform remote mutation
    if result is unknown:
        persist uncertainty receipt
        if persistence fails:
            keep the lock held and fail closed
    release lock only after the terminal state is durable
```

The composition root should only call `gateway.mutate()`. Features do not repeat the checks, and no coordinator is added.

The lock must retain enough durable ownership state for startup recovery. A dead holder is converted to an uncertainty receipt before lock acquisition is allowed to proceed. If receipt recording fails, the process must not release the lock; after a crash, the stale-holder recovery path retries or conservatively creates the receipt. It must never permit a new remote mutation while the outcome is unresolved.

The independent proof is a black-box process test:

1. Start process A and pause it after the fake remote server applies the mutation but before the receipt is written.
2. Kill A.
3. Start process B.
4. Assert B converts or observes the stale holder as an uncertainty receipt, refuses to mutate, and the fake server records exactly one mutation.

Repeat with the receipt store forced to fail. The expected result remains fail-closed: no lock release that enables a second mutation, and no second remote call.
