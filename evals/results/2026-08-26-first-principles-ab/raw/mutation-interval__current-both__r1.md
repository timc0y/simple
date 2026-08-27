## The ownership change

Right now the safety invariant ("at most one active mutation; no new mutation while any effect is unknown") is a property of four operations spread across two owners. Neither owner can enforce it alone, so both races are gaps *between* owners, not bugs in either one.

The fix is not a third coordinator and not repeating the checks in every feature — both of those add owners or copies of the same logic, which multiplies the seams instead of closing them. The fix is to shrink to **one owner**: fold receipt-check, lock-acquire, mutation, unknown-recording, and lock-release into a single mutation-boundary object that the gateway *is*, rather than something the composition root drives from outside. Composition root stops touching the receipt at all — it just calls the boundary and gets back a result (success / known-failure / unknown).

Two structural consequences fall out of that single ownership:

**Race 1 (release before recording).** Recording an unknown result must happen *inside* the boundary, before the lock is released — not after, by a different owner. The lock is only released once the outcome (success, failure, or unknown-receipt) is durably written. This removes the gap entirely rather than narrowing it.

**Race 2 (new mutation before dead-holder conversion).** Dead-holder-to-receipt conversion must be a precondition *inside* `acquire()`, not a separate startup pass that runs concurrently with new acquisitions. Acquiring the lock means: if the current holder is dead, convert it to a receipt first, and only succeed once that conversion is durable. A second process calling `acquire()` simply waits on or triggers the same conversion — there's no window where acquisition can succeed while a dead holder's outcome is still unresolved, because conversion is now part of what "acquired" means, not a separate race to win.

## Failure path: recording uncertainty fails

If the write that records "unknown" fails, the boundary must **not** release the lock. Releasing without a durable receipt reopens exactly the invariant it exists to protect — a later process would see no lock and no receipt and proceed. So on record-failure: keep the lock held, surface a hard error, and stop. The process either retries the write under the same held lock, or exits/crashes still holding it.

That's the reuse worth noting: a process that dies holding the lock *is* the dead-holder case. So failure-to-record doesn't need its own recovery path — it degrades into the same one already required for crash recovery (the `acquire()`-embedded conversion above). One mechanism, two triggers.

## Independent test

Not a unit test of call order — that only proves the code does what it was written to do. The proof has to be a black-box test over real concurrent processes, matching SIMPLE.md's stated proof requirement:

Spawn real OS processes against the same lock/receipt store. For each transition boundary — after lock acquired/before mutate, after mutate/before record, after record/before release — kill (`SIGKILL`) a process at that exact point, then immediately start a fresh process. Assert two things from the outside only: the remote mutation never applies twice, and no new mutation starts while a receipt is outstanding. If that holds at every kill point without the test knowing anything about internal ordering, the boundary — not just the happy path — is what's proven.
