Move receipt ownership into the existing mutation gateway. Do not add a coordinator or require command features to compose safety steps.

The gateway becomes the single mutation boundary:

```text
acquire / recover lock
check durable uncertainty receipt while holding the lock
perform remote mutation
if outcome is unknown: durably record receipt while still holding lock
release lock only after the mutation is known or uncertainty is durable
```

The composition root only invokes the gateway.

For a dead holder, acquisition/recovery must not delete or bypass its lock first. It must convert the dead holder’s “may have sent mutation X” record into a durable uncertainty receipt, then deny the new mutation. If that receipt write fails, retain the old/recovery lock and fail closed. A later process must retry conversion; it must never start a mutation.

Likewise, if an active mutation has an unknown outcome and receipt recording fails, return the persistence error and retain the lock. Releasing it would recreate the first race. The retained lock is intentionally recoverable: a later startup converts it to a receipt before allowing anything else.

The invariant is therefore:

> A lock is released only when the preceding mutation is conclusively resolved or its uncertainty is durably recorded.

An independent proof is a process-level crash test using the real lock and receipt storage, plus a remote-mutation test double with a durable call counter. Force-kill one process at every boundary transition—especially after the remote call, during receipt persistence, and during stale-lock recovery—then start a competing process. Assert that it never reaches the remote mutation whenever the prior effect might be unknown, and that the counter never shows a second mutation.
