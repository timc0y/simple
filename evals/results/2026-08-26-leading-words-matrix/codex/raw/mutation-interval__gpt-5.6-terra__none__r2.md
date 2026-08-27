Move the entire mutation interval into the lock owner (the gateway):

```text
gateway:
  refuse if receipt exists
  acquire lock, or recover dead lock → receipt
  perform remote mutation
  if outcome is unknown: durably record receipt
  release lock only after the outcome is known or receipt is durable
```

The composition root should only compose the gateway; it must not check or create receipts.

If recording an unknown-result receipt fails, fail closed: retain the lock and return an error. A later process must treat that live/stale lock as blocking; if it is dead, recovery must first durably convert it to a receipt. If conversion fails, leave the lock blocking. Releasing it would recreate the double-apply window.

The independent proof is a process-level crash test, not a unit test of call order:

1. Process A acquires the gateway boundary and force-terminates at each transition, especially after remote mutation / before receipt persistence and during stale-lock recovery.
2. Process B starts against the same durable lock/receipt store and attempts the same mutation.
3. Assert B never reaches the remote mutation unless A’s result was known-safe, or A’s uncertainty receipt has been explicitly resolved.

This makes the lock’s release the sole publication point: before it, the holder or its recoverable stale state blocks; after it, there is either a known result or durable uncertainty.
