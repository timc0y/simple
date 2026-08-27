Make the existing gateway the single mutation boundary. It must own the whole interval:

```text
gateway:
  acquire or recover the mutation lock
  while holding it:
    convert any stale holder into an uncertainty receipt
    reject if any receipt exists
    perform the remote mutation
    record an uncertainty receipt if the result is unknown
  release the lock only after the above succeeds
```

The composition root should invoke this boundary and retain no receipt check or recording logic.

The lock must be a recoverable lease/record containing the mutation identity. If the process dies after the remote call, the next gateway invocation acquires the stale lock, records that operation as unknown, and only then considers the lock usable. An ephemeral mutex that disappears on process death cannot support this guarantee.

If recording the uncertainty receipt fails, the gateway must not release the lock or admit another mutation. It returns an error while retaining the lock. If the process then dies, the durable stale-lock record gives the next process the information needed to retry receipt creation. Only after the receipt is durable may the lock be released; subsequent mutations are rejected because the receipt exists.

The independent proof is a black-box two-process test using a real lock, durable receipt store, and fake remote service:

1. Pause or kill process A after the remote mutation but before receipt recording.
2. Start process B.
3. Assert B records A’s operation as unknown, performs no remote mutation, and leaves the receipt durable.
4. Inject receipt-write failure and assert no second process can mutate while the lock remains recoverable.
5. Kill A, retry with B, and assert recovery creates the receipt before B can perform any mutation.

The key assertion is the remote service’s mutation count, not an internal gateway call: across forced termination and recovery, the count never exceeds one.
