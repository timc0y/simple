The smallest ownership change is to make the existing mutation gateway own the entire safety interval.

Its operation becomes:

```text
gateway:
  acquire the mutation lock
  while holding it:
    recover any dead holder as an uncertainty receipt
    reject if an uncertainty receipt exists
    perform the remote mutation
    if the result is unknown, record the receipt
  release the lock only after all required recording succeeds
```

The composition root must stop checking receipts and stop recording uncertainty. It should only call the gateway.

This closes both races:

- A new process cannot acquire the lock between a remote mutation and receipt recording.
- A stale lock cannot be granted to a new mutation until its holder has first been converted to a receipt.

If recording the uncertainty receipt fails, the gateway must fail closed: it must not release a usable lock or permit another mutation. The lock remains held while the process is alive. If that process dies, the next gateway invocation treats the stale lock as an unknown result and retries receipt creation. If receipt storage is still unavailable, acquisition fails again. No new remote mutation is allowed.

The independent proof should exercise only the public mutation boundary with two real processes:

1. Process A acquires the lock and reaches a barrier after the remote effect is possible but before uncertainty recording.
2. Process B starts during that barrier.
3. Assert that B never calls the remote mutation.
4. Allow or force A to die, then let B retry.
5. Assert that B either creates the receipt and refuses the mutation, or refuses because receipt recovery failed.
6. Separately force receipt recording to fail and verify that releasing/restarting the gateway still cannot produce a second remote call.

The test must observe remote calls and durable receipt state, not gateway helper methods. That proves the ownership boundary rather than merely reproducing its implementation.
