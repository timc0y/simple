## The ownership problem

Both races have the same root cause: the interval from "lock held" to "uncertainty durably recorded" is split across two owners (composition root and gateway) instead of held by one. Splitting it lets a gap open at the boundary crossing:

- **Race 1** exists because the gateway releases the lock *before* the composition root records the unknown result. Anything between those two lines is unguarded.
- **Race 2** exists because dead-holder→receipt conversion is a separate startup step, not part of lock acquisition itself. A new mutation can acquire the lock before that conversion has run.

Adding a coordinator doesn't fix this — it adds a third owner to a boundary that already has one too many. Repeating the checks in every feature doesn't fix it either — it multiplies the places the ordering can be gotten wrong instead of removing the seam.

## The smallest change

Collapse the four operations onto the one component that already owns the lock — the gateway — and change the order of two of them:

```text
gateway: acquire lock
  — as part of acquiring, if the current holder is dead, convert it to a receipt first
gateway: check outstanding receipt (now safe — no concurrent mutation can be mid-flight)
gateway: perform remote mutation
gateway: record unknown result if needed
gateway: release lock  — only after the record step above has completed
```

Composition root stops checking the receipt and stops recording the outcome; it just calls the gateway's single mutation boundary. Two things move, not four:

1. **Dead-holder conversion moves inside `acquire`.** It's no longer a separate startup task with its own race window — acquiring the lock *is* the recovery path. Nothing can hold the lock without either being alive or having already been converted to a receipt.
2. **Release moves after record.** The lock is the thing that keeps a second process out, so it must still be held while the outcome is written. Releasing early was the entire bug in race 1.

This is the "one shared mutation boundary" already named as the ordinary path — no new owner, just correcting which existing owner holds which step and fixing the order.

## Failure path: recording uncertainty fails

If writing the receipt itself fails, do **not** release the lock. Let the process exit with the lock still held by a now-dead holder. That is not a new failure mode — it's the same state the dead-holder path already handles. On the next acquisition attempt, `acquire` finds the dead holder and retries the conversion to a receipt before anyone can proceed. No second error-handling path is needed; the existing recovery step is also the retry mechanism for a failed record.

## Independent test

Don't test the internal functions — a unit test of `acquire`/`release` would only prove the code does what it was written to do. Prove the boundary through real, external process behavior:

1. Start process A, let it acquire the lock and perform the mutation.
2. `SIGKILL` process A between "mutation performed" and "lock released" (and separately, a second run: kill it between "record" and "release" to hit the record-failed case).
3. Start process B immediately after.
4. Assert: B cannot begin a new mutation until a receipt exists for A's attempt, and B's own `acquire` is what produces that receipt if A never did — i.e., B observes an outstanding receipt or triggers the conversion itself, but never proceeds straight to a mutation.

Run this with real OS processes and forced termination at each boundary transition (lock acquired / mutation done / record done / lock released), not simulated calls — that's the only way to distinguish "the ordering is actually enforced" from "the ordering is enforced when nothing crashes."
