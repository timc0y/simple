I'll explore the working directory to understand whether this is tied to an actual codebase or a conceptual design exercise.I've reviewed `prompt.md` and `SIMPLE.md`. There's no CLI source in this directory — this is a design problem, and `SIMPLE.md:17` already states the root cause in one line: *"The lock owner does not own receipt conversion, checking, or recording."* So the deliverable is a design decision, not a code patch. Here is my plan.

---

## Plan: collapse the safety interval into one owner

### Diagnosis (both races are one bug)
The invariant "at most one active mutation" (lock) and "no new mutation while any prior effect is unknown" (receipt) are enforced by **two different components across two non-overlapping critical sections**. The lock's section runs `acquire → perform → release` (gateway), but the receipt's `check`/`record`/`convert-dead-holder` run *outside* it (composition root, plus a startup path). Both observed races are the same gap: **a window where the lock is free but no receipt represents the in-flight or unknown effect.**

- Race 1: lock released before receipt recorded → second process acquires lock, sees "no outstanding receipt," mutates again.
- Race 2: new mutation acquires lock before a dead holder is converted into a receipt → dead holder's unknown effect is never captured, new mutation proceeds.

Rejecting the two proposed fixes: "another coordinator" adds a component (larger surface, new failure modes); "every feature repeats the checks" scatters the invariant and can't close the gap because the gap is *between* owners, not *within* a feature.

### Smallest ownership change
**Make the lock owner (the gateway) own the entire uncertainty-receipt lifecycle.** One component, one critical section. No new coordinator, no per-feature duplication. Concretely, move `check`, `convert-dead-holder`, and `record` into the gateway and enclose them in the lock.

New sequence (single owner, inside the lock):

```text
gateway: acquire lock
         └─ on acquire: convert any dead/stale holder into an OUTSTANDING receipt (startup recovery)
gateway: if an outstanding receipt exists → reconcile/resolve it idempotently first
gateway: create a NEW outstanding receipt (durable)   ← BEFORE the mutation
gateway: perform remote mutation
gateway: resolve the receipt (mark known / delete)   ← still inside the lock
gateway: release lock
```

Why this closes both races: the receipt is durably created *before* the mutation and resolved *before* release, so a process can never observe a free lock with no receipt for an in-flight effect (race 1). Dead-holder→receipt conversion happens *during* acquire, so no new mutation can start before the conversion exists (race 2). `SIMPLE.md:28` ("Split the interval only if one transactional substrate atomically owns lock and uncertainty state") is satisfied by giving one owner both.

### Failure path when recording uncertainty fails
Order is `record (prepare) → mutate → resolve`. Two distinct failure points:

- **Prepare write fails (create outstanding receipt before mutate):** fail *closed* — do **not** perform the remote mutation. Nothing has happened, so no duplicate is possible. Surface the error; the command is simply retried.
- **Resolve write fails (after mutate):** leave the receipt *outstanding*. This is fail-*safe*: the next holder acquiring the lock sees an outstanding receipt and reconciles (discovers the mutation already applied, applies idempotently or not at all) instead of mutating again. Remote application count stays 1.

The dangerous ordering in the current code (mutate → then record) is eliminated; the safety net always exists before any effect.

### Independent test that proves the boundary
Real competing processes with forced termination at the exact transition (per `SIMPLE.md:26`), plus the recording-failure assertions:

1. **Boundary A (race 1):** run a mutating command; force-terminate it in the gap between `release lock` and `record receipt`. Launch a second competing process. Assert the remote effect is applied **exactly once** and the second process reconciles the outstanding receipt rather than re-mutating.
2. **Boundary B (race 2):** let a command acquire the lock and mutate, then force-terminate it *while holding the lock*. Restart the CLI (new process). Assert startup converts the dead holder into an outstanding receipt *before* any new mutation acquires the lock, and the remote effect count is 1.
3. **Recording-failure:** inject a write failure at the prepare step → assert the mutation is never performed (remote count 0). Inject a write failure at the resolve step → assert the receipt stays outstanding and the next run reconciles (remote count stays 1).

### Documentation
Update `SIMPLE.md`:
- `Current boundary` (line 17): change to "The lock owner owns the receipt lifecycle; the interval is one critical section."
- `Reconsider when` (line 28): keep, now satisfied.

---

Want me to (a) write this design into a doc / update `SIMPLE.md`, or (b) just hand it back as the answer? And is there an actual CLI repo elsewhere you'd like me to apply this to — I see only scaffolding here.
