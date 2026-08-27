Move the entire safety interval into the existing mutation gateway. It already owns exclusion, so it must also own:

- refusing work when an uncertainty receipt exists;
- converting a dead lock holder to a receipt;
- persisting a receipt after an indeterminate remote mutation;
- releasing or reclaiming the lock only after those transitions are durable.

The composition root should simply invoke the gateway mutation operation. It must no longer pre-check or record receipts.

The gateway’s rule is:

```text
No mutation may begin unless:
  no receipt exists, and
  any prior lock holder is either live or has first been durably converted to a receipt.
```

For an indeterminate remote result, the gateway writes the receipt while it still holds the lock, then releases the lock. That closes the first race. When encountering a dead holder, it writes the receipt before making the lock acquirable, closing the second.

If recording uncertainty fails, fail closed: do not release/reclaim the lock and do not run another mutation. Return a persistence/recovery error. A later process must likewise be unable to take the stale lock until it can durably create the receipt (or an explicit operator recovery resolves it). Availability is lost, but duplicate mutation is not permitted.

The independent proof is a real multi-process black-box test of the gateway boundary, with fault injection at each transition:

1. Force an unknown remote result; pause/fail receipt persistence and concurrently start a second process. Assert it cannot perform a remote mutation.
2. Kill the holder after the remote call and before normal completion; start a second process. Assert recovery creates the receipt before that process can mutate.
3. Repeat with receipt writes failing during dead-holder recovery. Assert the lock remains unavailable and no second remote call occurs.

This preserves one shared mutation boundary, removes duplicated composition-root policy, and needs no new coordinator—unless lock and receipt can instead be made one atomic transaction in the same durable substrate.
