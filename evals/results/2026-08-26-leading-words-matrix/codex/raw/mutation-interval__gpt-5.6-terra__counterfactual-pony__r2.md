Make the mutation gateway own the entire uncertainty interval. The composition root should only call it.

```text
gateway:
  acquire/recover mutation lock
  check for an outstanding uncertainty receipt
  perform remote mutation
  if result is unknown: durably record receipt
  release lock
```

Rules:

- A receipt is checked only after the lock is held.
- An unknown result is recorded before releasing that lock.
- Recovery of a dead holder is part of lock acquisition: convert the dead holder to a receipt before granting a new mutation.
- If writing the receipt fails, do not release or grant past the lock. Return a failure and leave recovery to the same gateway; recovery must persist the receipt before allowing another mutation.

This removes both gaps without a new coordinator or duplicated feature checks: the gateway is the sole owner of “may a new remote mutation begin?”

The boundary test should bypass the composition root entirely and test the gateway with controllable hooks/faults:

1. Pause after an unknown remote result, before receipt persistence; a competing gateway call must remain blocked.
2. Resume, persist the receipt, then release; the competing call must refuse to mutate.
3. Simulate a dead lock holder; acquisition must create the receipt before it can grant the competitor.
4. Make receipt persistence fail; verify the lock is not released/granted and no second remote mutation occurs.

That independent test proves the safety property belongs to the gateway boundary, not to call ordering in the CLI.
