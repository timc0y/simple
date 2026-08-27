Make the existing gateway the owner of the whole mutation boundary.

Its contract should be:

```text
acquire exclusive mutation lock
  while exclusion is held:
    recover any dead holder into a durable uncertainty receipt
    reject if an uncertainty receipt exists
    perform the remote mutation
    if the result is unknown:
      persist the receipt
      release only after persistence succeeds
    otherwise:
      release the lock
```

The composition root should only call this boundary. It must not check or record receipts separately.

Recovery of a dead holder must happen as part of lock acquisition, while the lock remains unavailable to new mutations. Releasing a stale lock before writing the receipt recreates the race.

If recording uncertainty fails, fail closed: do not release or make the lock admissible. Surface the persistence error. A later startup can retry recovery; until the receipt is durable, no mutation may proceed.

The proof should be an end-to-end contract test through the public mutation entry point, using two real competing processes and a controllable remote stub:

- pause process A after the remote effect but before receipt recording;
- have process B attempt the mutation;
- kill A at that boundary and repeat with B starting afterward;
- inject receipt-store failure.

The assertions are that B never reaches the remote mutation, the effect occurs at most once, and receipt-store failure leaves the mutation boundary blocked. This tests the ownership boundary and timing, rather than merely verifying that individual checks were called.
