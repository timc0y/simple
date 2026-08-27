The smallest truthful change is to make the existing mutation gateway own the entire safety interval:

```text
gateway:
  acquire or recover the durable mutation boundary
  inspect outstanding uncertainty
  if blocked, refuse the mutation
  perform the remote mutation
  if the result is unknown, record the receipt
  release the boundary only after recording succeeds
```

Remove the composition root’s receipt check and uncertainty recording. It should call one gateway operation.

The critical ordering is:

```text
remote mutation
  → record uncertainty receipt
  → release mutation lock
```

For a known-success or known-failure result, release normally. For an unknown result, the gateway must not release the lock until the receipt is durable.

If recording the receipt fails, return an error while keeping the boundary held. If the process then dies, the next gateway invocation treats the stale holder as an unknown outcome and attempts receipt recovery before granting access. If recovery recording still fails, the boundary remains unavailable; no new remote mutation is permitted. This may reduce availability, but releasing it would violate the safety claim.

Startup recovery must therefore be part of lock admission, not a separate pre-check:

```text
acquire boundary
  → recover stale holder into receipt, if needed
  → reject if any receipt exists
  → otherwise perform mutation
```

The independent proof should exercise the gateway’s public operation using real competing processes, the real durable lock, and the real receipt store. Use a controllable fake remote and force termination:

- kill a process after the remote call but before receipt recording;
- verify the next process creates the receipt and never calls the remote;
- inject receipt-write failure and verify the lock remains blocking;
- verify a process cannot enter during the interval between remote completion and uncertainty recording.

The assertion is not merely that helper methods were called in order. It is that, across process crashes and competing invocations, the remote mutation is never entered again while its prior outcome is unknown.
