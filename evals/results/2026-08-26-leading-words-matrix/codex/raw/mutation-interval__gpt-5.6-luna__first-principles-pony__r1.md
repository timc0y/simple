The smallest fix is to move ownership of the whole safety interval into the gateway—the existing mutation boundary.

The composition root should only call:

```text
gateway.mutate(...)
```

The gateway must:

1. Acquire the durable mutation lock.
2. While holding it, recover any dead holder into an uncertainty receipt.
3. Check for an existing receipt.
4. Perform the remote mutation.
5. If the result is unknown, persist the receipt.
6. Release the lock only after the result is known or the receipt is durable.

If receipt recording fails, the gateway must not release the lock. It should retry or fail while retaining/renewing the lock. If the process dies, the next lock acquirer performs the dead-holder-to-receipt conversion before any mutation is admitted. A lock TTL that can expire without this recovery guarantee is unsafe.

The proof should be a black-box subprocess test using real durable lock/receipt storage and a fake remote service:

- Process A acquires the lock and applies the remote effect.
- Kill A after the effect but before receipt recording.
- Process B starts and must create/find the uncertainty receipt and refuse the mutation.
- Assert the remote effect count remains one.

Also inject receipt-store failure: A must retain the lock, and B must remain blocked; after A is killed, C must recover the stale lock into a receipt before refusing further mutation. This tests the ownership boundary independently of whether callers remembered to perform checks.
