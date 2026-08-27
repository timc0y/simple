Move receipt ownership into the existing shared mutation gateway. It becomes the single mutation interval; do not add a coordinator.

```text
gateway.mutate:
  acquire/recover lock
  check durable uncertainty receipt
  perform remote mutation
  if result is unknown: persist receipt
  release lock
```

A new mutation may enter only after the gateway has both recovered any dead holder and checked for a receipt while holding the lock.

Recovery is part of acquisition: if the holder is dead, the gateway must durably create its uncertainty receipt before clearing or reusing that lock. A receipt means “stop; prior remote effect is unknown.”

If receipt recording fails after a possibly-applied remote call, retain the lock and return a safety failure. Do not release, retry, or permit another mutation. If that process dies, the next gateway invocation follows the same recovery rule: it must persist the receipt before reclaiming the lock; if persistence still fails, it remains blocked.

This preserves the invariant:

> No remote mutation starts while a previous mutation is active or has an unknown outcome.

Prove it independently with real competing CLI processes, the production lock/receipt storage, and a fake remote endpoint that counts mutations. Pause/kill process A after the remote call but before receipt persistence, then start B: B must never reach the endpoint. Repeat with A killed while holding the lock; B must first create the receipt, and must not mutate—also when receipt persistence is deliberately made to fail.
