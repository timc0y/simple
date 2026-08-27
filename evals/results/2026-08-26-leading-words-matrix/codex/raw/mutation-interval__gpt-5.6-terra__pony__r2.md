Move the entire safety interval into the gateway that already owns the lock.

```text
mutation boundary (gateway):
  recover stale lock -> durable uncertainty receipt, or remain blocked
  reject if a receipt exists
  acquire lock
  perform remote mutation
  if result is unknown: durably record receipt
  release lock only after outcome is known or receipt is durable
```

The composition root should only invoke this boundary; it must not pre-check or record uncertainty afterward. This removes both open doors without adding a coordinator or duplicating checks.

If writing the uncertainty receipt fails, do not release the lock. Return a “safety state could not be persisted” error and keep the holder blocking further mutations. If the process dies, stale-lock recovery must first create the receipt; if that write also fails, it must leave the stale lock blocking rather than permit a new mutation.

The independent proof is a process-level fault-injection test:

1. Process A performs a mutation whose result is forced to be unknown.
2. Force receipt persistence to fail.
3. Verify A retains the lock and process B cannot reach the remote mutation.
4. Kill A; start B while receipt persistence still fails.
5. Verify B cannot mutate.
6. Restore persistence; verify recovery creates/observes the receipt and still does not replay the mutation.

Run the same competing-process/forced-termination check at each boundary transition.
