This is a design puzzle, not a code-change task — there's no application code in this directory, just the problem statement (`prompt.md`) and a pre-written SIMPLE analysis (`SIMPLE.md`) that already points at the answer. Here is the plan/answer.

## Diagnosis

The invariant ("at most one active mutation; no new mutation while a prior effect is unknown") is split across **two owners** and **two separate durable records** (the lock and the receipt). Both races are the same defect viewed from each end of the interval:

- **Race 1** — gap between `gateway: release lock` (step 4) and `root: record unknown result` (step 5). Lock is free; receipt not yet durable; a second process acquires and mutates.
- **Race 2** — on startup, the dead holder must be *converted* into a receipt in a separate step. A new mutation can start before that conversion lands.

The lock and the receipt are "two open doors": each has its own enter/exit transition, owned by different components, and the gap between a lock transition and its matching receipt transition is exactly where a double-apply slips through. The rejected proposals (a third coordinator; every feature repeating the checks) add surface area without closing the gap.

## Smallest ownership change

**Give the lock owner the receipt.** Reassign receipt *check*, *record*, and dead-holder *conversion* from the composition root to the gateway, and make the lock entry and the outstanding receipt **the same durable record**. The lock is held for exactly the interval during which an effect is unknown:

- **Acquire** = atomically (one durable write) take the lock *and* create the outstanding receipt.
- **Release** = atomically resolve/clear the receipt *and* free the lock, with strict ordering **record-then-free**.
- **Startup** = a "dead holder" is already an outstanding receipt; there is no separate conversion step to race against.

This is the smallest change because it moves ownership only (no new component) and collapses the two records into one under one owner — which is exactly the SIMPLE.md caveat: "Split the interval only if one transactional substrate atomically owns lock and uncertainty state." We do the inverse: stop splitting.

How it kills both races:
- **Race 1** — there is no release-without-record. The lock can only be acquired after the prior receipt is durably settled.
- **Race 2** — the receipt exists the instant the lock is taken; a dead holder is already an outstanding receipt, so any process that acquires the lock sees it and blocks. The conversion window disappears.

## Failure path: recording uncertainty itself fails

The safety-critical rule: **a write that cannot durably record uncertainty must not release the lock.** Ordering is record-then-free, and the crash-recovery state is "still held = still unknown." So if the receipt write fails (I/O error, killed process after `perform` but before durable record):

- The entry stays in the held/unknown state (the lock is *not* freed).
- The next process observes an outstanding receipt and refuses/blocks the new mutation until reconciliation resolves it.
- The only forbidden direction — freeing the lock and then losing the receipt — is structurally impossible because free happens only as part of the same durable transition that records.
- If even the combined atomic write cannot be guaranteed, fail *closed*: leave the lock held. That over-blocks (availability loss) but never double-applies (safety preserved). The invariant is "better blocked than unknown-and-free."

## Independent test that proves the boundary

Two (or three) real, competing CLI processes against **real durable storage** — no mocks, no internal locks observed. The test asserts only the external safety property: the remote mutation is applied **at most once**.

1. **Race 1 boundary:** `P1` acquires, performs the mutation, then is `SIGKILL`ed (or its receipt write is fault-injected) in the release window. `P2` launches and attempts a mutation. Assert: remote application count == 1, and `P2` is rejected/blocked until the receipt is durably present.
2. **Race 2 boundary:** seed storage with a *dead held lock* (no resolved receipt). Launch `P_new`. Assert `P_new` does not begin a new mutation until the dead holder is durably treated as an outstanding receipt.
3. **Record-failure boundary:** fault-inject the receipt write to fail after the release attempt. Assert the lock is not freed (or recovery re-establishes the receipt) and a concurrent process cannot acquire and double-apply.

"Independent" = it validates the boundary from outside via real process death and real I/O faults, observing only the count of remote applications, so it passes or fails regardless of internal implementation. This matches the SIMPLE.md Proof line: "Exercise real competing processes and forced termination at every boundary transition."

---

I'm in plan mode, so I haven't written anything. If you want, I can (a) draft this as a written artifact (e.g. a `DESIGN.md`/`SIMPLE.md` update) once out of plan mode, or (b) refine any part — e.g. whether your storage can actually do the single atomic "record+free" write, which is the one real prerequisite for this being the *smallest* change.
