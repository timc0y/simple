This is a design reasoning problem about closing two concurrency races in a mutation interval. Let me analyze based on the constraints in SIMPLE.md.The smallest ownership change: **give the gateway the entire interval**.

### The problem

The current sequence splits ownership across three actors:

```
composition root: check outstanding receipt
gateway: acquire lock → perform mutation → release lock
composition root: record unknown result
```

The lock owner does not own receipt checking or recording. Two races exploit the gaps between owners.

### The fix

One owner owns the full interval. The gateway checks the receipt, acquires the lock, performs the mutation, records uncertainty, and releases the lock:

```
gateway: check outstanding receipt
gateway: acquire lock
gateway: perform remote mutation
gateway: record unknown result   ← still under lock
gateway: release lock
```

This closes both races because:
- Race 1: receipt is recorded before lock release — no gap exists
- Race 2: dead holder's lock is still held when receipt recording would happen — the next process cannot start

### Failure path when recording uncertainty fails

If recording the receipt fails, the gateway must **not release the lock**. It either retries the recording or aborts the mutation. The lock stays held until the receipt is durable. This preserves the invariant: no new mutation while any prior effect is unknown.

If the gateway crashes during recording, the lock is released by the OS, but the mutation was either rolled back or the receipt was partially written. The next process sees either the receipt (safe) or the dead lock (converts to receipt on startup, as today).

### Independent test

Force a crash at each boundary transition within the gateway's ownership span:
1. Crash after `perform remote mutation` but before `record unknown result` — verify the lock is still held (process is dead, lock times out, next startup converts dead lock to receipt, no duplicate mutation)
2. Crash during `record unknown result` — verify the next process either sees the receipt or the dead lock, and does not proceed with a new mutation
3. Run two competing CLI processes — verify at most one mutation is applied

The test surface is: **no duplicate mutation survives any forced termination point within the interval**.
