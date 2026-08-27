Move ownership of the entire mutation interval into the gateway.

The composition root should only call something like:

```text
gateway.mutate(request)
```

The gateway owns this sequence:

```text
acquire lock
  while holding it:
    recover any dead holder into an uncertainty receipt
    reject if any receipt exists
    perform the remote mutation
    if the outcome is unknown:
      persist the receipt
      only then release the lock
    otherwise:
      release the lock
```

This closes both races:

- The lock is not released until uncertainty is durable.
- A new holder must convert a stale holder into a receipt before it can mutate.

If receipt recording fails, fail closed:

- Keep the lock held.
- Return an error indicating the result is unresolved.
- Do not permit another mutation.
- If the process dies, the next gateway invocation retries stale-holder conversion.
- Never let lock expiry or cleanup make the mutation available without a receipt.

The receipt must be durable before unlock—e.g. committed and synced according to the store’s durability contract. A conservative receipt is acceptable when recovering a dead holder; blocking is safer than guessing success.

The independent proof should exercise the gateway’s public operation with a real persistent lock/receipt store, separate processes, and a controllable fake remote:

1. Pause or kill process A after the remote effect but before receipt persistence.
2. Start process B.
3. Assert B cannot perform the remote mutation, and that recovery leaves an uncertainty receipt.
4. Inject receipt-store failure and assert A fails closed while B remains blocked.
5. Retry after the store recovers and assert exactly one remote mutation.

No additional coordinator or repeated feature-level checks are needed.
