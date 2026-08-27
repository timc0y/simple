Make the gateway own the entire mutation boundary. The composition root should call one operation; it must not check or record receipts itself.

```text
gateway.mutate(command):
    acquire mutation lock

    if lock belongs to a dead holder:
        convert that holder to an uncertainty receipt
        if conversion fails:
            retain the lock and fail closed

    if an uncertainty receipt exists:
        release/retain according to existing recovery policy
        refuse the new mutation

    perform remote mutation

    if result is unknown:
        record the receipt while still holding the lock
        if recording fails:
            retain the lock and fail closed
            retry or require recovery on the next startup

    release the lock only after:
        - the mutation is known successful, or
        - uncertainty is durably recorded
```

The lock record must carry enough identity/details for startup recovery to create the receipt. Dead-holder conversion happens as part of lock acquisition, while the claimant owns the lock. No claimant may proceed to a new remote mutation until conversion succeeds or an existing receipt is handled.

This removes both open doors:

- The lock cannot be released before an unknown result is durable.
- A new process cannot treat a stale lock as permission to mutate; it must first convert it into a receipt.

The failure policy is deliberately fail-closed: inability to record uncertainty sacrifices availability, not safety. Never release the lock and continue as though the result were known.

The independent proof is a black-box concurrency test using real processes:

1. Block the remote mutation after submission but before its result is known.
2. Kill the holder.
3. Start a competing process while stale-lock recovery is occurring.
4. Force receipt persistence to pause or fail.
5. Assert that the competitor performs no remote mutation until the receipt is durable.
6. Assert that the remote mutation count remains one, including when receipt recording initially fails.

A second run should exercise the normal unknown-result path and verify that no competing process can enter between lock release and receipt creation—because that interval no longer exists.
