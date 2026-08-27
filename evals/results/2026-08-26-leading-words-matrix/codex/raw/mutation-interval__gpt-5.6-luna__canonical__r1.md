The smallest ownership change is to make the mutation gateway own the complete safety interval:

```text
gateway:
  acquire mutation boundary
  recover any stale holder into an uncertainty receipt
  reject if an outstanding receipt exists
  perform remote mutation
  if the result is unknown:
      persist the uncertainty receipt
  release mutation boundary
```

The composition root should stop checking or recording receipts. Every mutating feature should call this one gateway.

The critical ordering is:

```text
remote mutation
→ durable uncertainty receipt, when needed
→ lock release
```

If recording the receipt fails, the gateway must not release the lock or permit another mutation. It returns an error and leaves the boundary quarantined. If the process dies, the next startup treats the stale holder conservatively as unknown and retries receipt conversion. If conversion still fails, startup fails closed: no new mutation is admitted.

Stale-holder recovery must occur while acquiring the same mutation boundary, before ownership is granted to a new mutation. Otherwise the second race remains.

The independent proof is a black-box multi-process test using the real lock and receipt stores and a controlled fake remote service:

- Process A performs the remote mutation, then is killed before recording uncertainty.
- Process B starts after A’s lock would otherwise be released.
- Assert that B cannot mutate and that exactly one remote mutation occurred.
- Repeat with A killed during stale-holder recovery and with receipt persistence forced to fail.
- Assert that failed persistence leaves the system closed to new mutations.

This proves the public boundary and timing invariant, rather than merely testing that individual methods call one another.
