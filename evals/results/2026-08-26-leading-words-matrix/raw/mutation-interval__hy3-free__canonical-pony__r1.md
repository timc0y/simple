I'll explore the working directory to understand the context before planning.This is a conceptual design exercise (a SIMPLE skill scenario). Let me read the relevant files.I have enough to plan. This scenario has no implementation code to edit — `prompt.md` is the problem and `SIMPLE.md` (esp. the "Reconsider when" line) is the spec. The deliverable is the design answer. Here is the plan.

## Plan — collapse the three owners into one mutation boundary

**The bug in one line:** the "may I mutate / no second mutation" decision is split across two owners and straddles the lock. The composition root *checks* the receipt before the lock (step 1) and *records* it after the lock (step 5), while the gateway owns the lock in between. Every gap is a slip-through window.
- Race 1 (lock released → receipt not yet recorded): a second process checks "no receipt" and acquires the freed lock → double apply.
- Race 2 (dead holder not yet converted): a new mutation checks "no receipt" and acquires, running while an unresolved dead holder exists.

**Smallest ownership change (rejected proposals avoided):** Don't add a coordinator; don't push checks into every feature. Move receipt **checking**, **recording**, and **dead-holder conversion** from the composition root into the *lock owner* (the gateway / "mutation boundary"). That makes one owner own the whole invariant. New single-owner sequence:
1. acquire lock — *atomically within acquire*: if a dead holder is found, convert it to a receipt first; then check for any outstanding receipt; refuse to mutate if one exists.
2. perform remote mutation.
3. if the result is unknown, durably record the uncertainty receipt **before** releasing the lock.
4. release the lock only after the receipt is durable.

Only steps 1 and 5 relocate into the existing lock owner — no new component, no duplicated per-feature checks. Matches SIMPLE's "one transactional substrate owns lock and uncertainty state."

**Failure path — recording uncertainty itself fails:** if the durable receipt write errors (I/O, disk full) or the process is killed mid-write:
- Do **not** release the lock.
- Exit as a terminal error, leaving the holder marked dead.
- On next startup, the existing dead-holder→receipt reconciliation converts it into the uncertainty receipt.
- Outcome: stuck-but-**safe**. The outcome stays unknown and no second mutation can start until the receipt is resolved. Invariant preserved; cost is a manual-resolution state, never a duplicate.
- Ordering rule that guarantees this: lock release is strictly ordered *after* durable receipt; a failed/interrupted write means the (dead) lock holder is retained as the receipt's proxy.

**Independent test that proves the boundary** (real competing processes + forced termination, per SIMPLE "Proof"):
- P1 acquires the lock, performs the remote mutation, then is `kill -9`'d **after the remote call returns but before the receipt is durable**.
- P2 launches concurrently to start a mutation.
- Assert P2 is refused (sees the live/dead holder or the converted receipt) and the remote mutation was applied **exactly once** (never twice).
- Variants: seed a dead holder with no receipt and kill the converter mid-conversion (race 2); inject a receipt-write failure and assert the next process still refuses (failure path). The single decisive assertion — *a killed-but-applied mutation never lets a racing second process apply it twice* — is the boundary proof.

**On execution:** there are no source files in this scenario to change; I'd record the decision by updating `SIMPLE.md`'s "Current boundary" (or adding a short answer doc) to state the lock owner now owns check/record/conversion.

Want me to record this into `SIMPLE.md` (or a new `ANSWER.md`) when you leave plan mode?
