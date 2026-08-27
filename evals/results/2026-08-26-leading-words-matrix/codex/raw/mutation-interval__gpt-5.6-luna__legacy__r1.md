The smallest change is to make the existing gateway the single mutation boundary. It must own the whole safety interval:

```text
gateway:
  acquire or recover the mutation lock
  while holding it:
    if recovery found a dead holder:
      durably record an unknown receipt
      release only after the receipt exists
      refuse the mutation

    if an uncertainty receipt exists:
      release the lock
      refuse the mutation

    perform the remote mutation

    if the result is unknown:
      durably record the receipt

    release the lock
```

The composition root should only invoke this boundary. Features should not repeat receipt or lock checks.

The critical rule is: the lock is never released while the mutation’s outcome is unknown and no durable receipt exists.

If recording the receipt fails, the gateway must retain the lock and return an error. A live holder must not voluntarily release it. If that process dies, the next process may recover the stale lock, but recovery is not a plain unlock: it must first create the uncertainty receipt while holding exclusive ownership. Receipt creation should be idempotent. If recovery cannot create it, the lock remains unavailable.

This requires the lock’s expiry/recovery mechanism to enforce the same rule. An automatic lease expiry that grants the lock without a recovery step cannot satisfy the safety claim.

The boundary test should be a black-box multi-process test using the real lock and receipt store and a counting fake remote:

1. Pause or kill process A after the remote effect but before receipt recording.
2. Start process B.
3. Verify B converts A’s dead lock holder into an uncertainty receipt, never calls the remote, and the remote call count remains one.
4. Also inject a receipt-write failure and verify the lock remains blocking; after A is killed, recovery retries receipt creation before permitting any mutation.

That test crosses the public mutation boundary and proves the ownership rule rather than merely testing duplicated checks.
