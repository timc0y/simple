I'll explore the working directory to see whether this maps to existing code or is a pure design exercise.This is a SIMPLE-method design exercise (only `prompt.md` and `SIMPLE.md` exist — no codebase to modify). Here's my plan.

## Diagnosis

Both races have one root cause: the safety invariant — *"a mutation is in flight **xor** an uncertainty receipt exists"* — is split across three owners, leaving a non-atomic window at **both** ends of the lock:

- **Race 1** — gap between `release lock` (gateway) and `record unknown` (composition root). Another process acquires the lock, sees no receipt, re-applies.
- **Race 2** — gap before `acquire lock` and the startup `convert dead holder → receipt`. A new mutation starts believing no receipt exists.

Neither proposed fix (a third coordinator, or pushing checks into every feature) addresses the root cause and both add surface area.

## The smallest ownership change

**Make the lock owner the single owner of the entire mutation boundary.** Fold `check outstanding receipt`, `convert dead holder`, and `record unknown result` into the lock manager. The lock and the uncertainty receipt become one durable, single-owner record — exactly the "one transactional substrate" your `SIMPLE.md` already names as the reconsider condition.

New single-owner sequence:

```text
mutation boundary (one owner):
  acquire:  convert any dead holder -> receipt
            check outstanding receipt -> if present, refuse
            take lock
  perform remote mutation            (lock held)
  record uncertainty/result DURABLY  (lock still held)
  release lock  ONLY after durable record confirmed
```

No new coordinator. No per-feature checks. The window collapses to "lock held" alone.

## Failure path: recording uncertainty itself fails

If the durable receipt write fails (IO error, crash) after the remote mutation:

- **Do not release the lock.** Hold it; if the process dies, the lock becomes a *dead holder*.
- On next startup, the dead holder is converted into a receipt (conservative).
- The user is told the outcome is **unknown/uncertain**; completion is never acknowledged without a durable receipt. Liveness is sacrificed, **safety is not** — the mutation is never re-applied.
- Key invariant: *never unlock before the receipt is durable.* If you cannot record, you must not unlock.

## Independent boundary tests (real competing processes, forced termination at the exact transition)

- **Test 1 (Race 1 / release-before-record):** Process A acquires, mutates, then is forced to fail the receipt write *while holding the lock*. Assert Process B cannot acquire the lock (blocked), and on A's death recovery converts the dead holder → receipt and B refuses to apply. Assert the remote mutation ran **exactly once**.
- **Test 2 (Race 2 / dead-holder conversion):** Seed a dead lock-holder record with **no** receipt. Process B starts; assert that during `acquire` it converts the dead holder → receipt, then finds the outstanding receipt and refuses to apply. Assert no second mutation.

Together these prove the two boundary transitions are closed.

## Deliverable

Rewrite `SIMPLE.md` ("Current boundary" → single owner; add explicit "Failure" and tighten "Proof"), and optionally add a reference implementation of the single-owner mutation boundary.

---

One question before I exit plan mode: do you want **only `SIMPLE.md` updated**, or also a **reference implementation** (in what language?) of the single-owner boundary?
