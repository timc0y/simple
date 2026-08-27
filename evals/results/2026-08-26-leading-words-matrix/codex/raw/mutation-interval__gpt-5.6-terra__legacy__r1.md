Make the existing mutation gateway own the entire safety interval. Its public operation becomes:

```text
mutate:
  acquire/recover the mutation lock
  check for an uncertainty receipt
  perform remote mutation
  if result is unknown, persist receipt
  release lock
```

The composition root only calls `gateway.mutate`; it no longer checks, records, or converts state itself.

Recovery is part of acquisition, while exclusive ownership is held: if the gateway finds a dead holder, it first writes an uncertainty receipt for that holder, then either refuses the new mutation because the receipt is outstanding or proceeds only after the receipt is resolved. It must never expose the lock as available before that conversion.

For an ambiguous remote result, persist the receipt before releasing the lock. If receipt persistence fails, fail closed: keep the lock durably held (or leave an equivalent recoverable blocked state), return an error, and allow startup recovery to retry receipt creation. Releasing it would recreate the duplicate-mutation window.

The independent proof is a process-level crash/concurrency test against the gateway’s public mutation API:

1. Force termination after an unknown remote outcome, before receipt persistence; verify a second process cannot mutate until recovery creates the receipt.
2. Force receipt persistence to fail; verify the lock remains blocking and a second process cannot mutate.
3. Force termination of a lock holder; verify a contender converts that holder to a receipt before any remote mutation is invoked.

This makes one owner responsible for both mutual exclusion and uncertainty, without another coordinator or repeated feature checks.
