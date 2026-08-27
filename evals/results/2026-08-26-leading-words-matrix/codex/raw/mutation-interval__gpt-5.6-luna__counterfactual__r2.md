The smallest change is to make the gateway own the entire mutation interval:

```text
gateway:
  acquire or recover the mutation lock
  while holding it:
    check for an outstanding uncertainty receipt
    if a dead holder may have acted:
      record an uncertainty receipt
      stop
    perform the remote mutation
    if its result is unknown:
      record the receipt
      keep the lock until recording succeeds
  release the lock only after the state is safe
```

The composition root should only invoke this gateway operation. Features should not repeat the checks.

This closes both races because receipt admission is checked after lock ownership is established, and the lock is not released before uncertainty is durable. Recovery of a dead holder follows the same rule: take exclusive recovery ownership, conservatively create the receipt, and only then make the lock available.

If receipt recording fails, fail closed:

- retain the lock, retrying if possible;
- return an error or leave a durable recovery-needed lock state;
- never release the lock and never permit another mutation;
- on process death, the next gateway startup must reclaim the lock exclusively and retry receipt creation before admitting work.

The independent proof should be a black-box, process-level test using a remote mutation counter:

1. Start a mutation and terminate the process after the remote call but before uncertainty recording.
2. Start a second process.
3. Assert that it cannot perform the mutation until recovery records the receipt.
4. Assert that the remote call count is at most one.

Repeat with uncertainty storage forced to fail, and assert that the lock remains blocking and no second remote call occurs. The test should exercise competing real gateway processes and forced termination, rather than asserting internal method order.
