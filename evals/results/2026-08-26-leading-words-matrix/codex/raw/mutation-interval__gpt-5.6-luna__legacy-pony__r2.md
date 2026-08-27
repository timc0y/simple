The smallest change is to make the gateway the mutation boundary.

The composition root should call one gateway operation. That operation owns:

```text
acquire mutation lease
recover any dead holder
  → persist an uncertainty receipt before permitting another mutation
reject if a receipt exists
perform remote mutation
if outcome is unknown
  → persist the receipt while still owning the lease
release lease only after the receipt is durable
```

The lock’s durable state must record that the holder entered the remote-effect window. That lets the next gateway invocation convert a dead holder into a receipt before doing any mutation.

If receipt recording fails, fail closed:

- do not release the lease as available;
- do not start another mutation;
- leave a durable “uncertainty pending” lock state, or let the next process recover the stale lease and retry receipt creation;
- return an error until the receipt is durable.

This is required because releasing the lock after a failed receipt write recreates the original race. No second coordinator or feature-level checks are needed.

The independent proof should exercise the gateway’s public mutation API with two real competing processes:

1. Process A performs the remote mutation, then is killed before recording its result.
2. Process B starts immediately and attempts another mutation.
3. Assert that B creates or observes the uncertainty receipt and never invokes the remote mutation.
4. Inject failure into receipt storage and assert that B fails closed and a later process can retry recovery.

The test must synchronize around the remote-effect boundary and count calls at the fake remote service. That proves the ownership boundary, rather than merely proving that helper methods were called in a particular order.
