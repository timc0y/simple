I'll explore the working directory to see whether this is grounded in an existing codebase or a pure design exercise.This is a pure design exercise, not a codebase. Let me read the surrounding context files.This is a pure design problem (no codebase — only the `prompt.md` and `SIMPLE.md` framing). The `SIMPLE.md` already names the root cause: *"The lock owner does not own receipt conversion, checking, or recording. The invariant spans all four operations."* Here is the plan.

---

## 1. The smallest ownership change

**Make the gateway the single owner of the entire safety interval, and invert the order so the uncertainty receipt is written *before* the remote mutation, not after it.**

The current sequence records the receipt *after* the mutation and does it from a *different* owner (composition root). That hand-off is what opens both doors. The fix is to collapse the four operations into one owner and reorder:

```text
gateway.mutate(m):
  with lock:                                  # gateway owns the lock
    if a dead holder exists: convert it -> uncertainty receipt(unknown)   # gateway owns conversion
    if an outstanding receipt exists: refuse  # gateway owns the check
    durably write receipt(m, state=unknown)   # <-- written BEFORE the mutation
    perform remote mutation                   # now safe to call
    durably resolve receipt(m, state=known)   # gateway owns the record
  # lock released only after a durable receipt exists
```

What changes in ownership:
- The composition root stops doing the pre-check and the post-record. It just calls `gateway.mutate()`.
- The gateway owns checking, dead-holder conversion, and recording — all inside the one critical section.
- The startup "dead holder → receipt" recovery is the *same* operation as step one of lock acquisition, so it is no longer a separate, race-prone path.

Why this is the smallest change (and why the two rejected proposals are wrong):
- **"Add another coordinator"** increases the number of owners; the bug is *too many owners*, so this makes it worse.
- **"Make every feature repeat the checks"** pushes the invariant outward to every caller — exactly the "invariant spans all four operations" failure mode `SIMPLE.md` warns about.
- This change *removes* owners and *removes* a hand-off. No new component, no new API surface.

Why the reorder closes both races:
- **Race 1** (start after lock released, before unknown recorded): the unknown receipt is now durable *before* the lock is released and *before* the mutation. There is no state where the lock is free but no receipt exists.
- **Race 2** (new mutation before dead holder converted): conversion is the first thing inside lock acquisition, so a new mutation cannot begin until the dead holder is already a receipt — and then the outstanding-receipt check refuses it.

The deep form of this (per `SIMPLE.md`'s "reconsider when") is to make one transactional substrate atomically own lock + receipt as a single row/record. That's the ideal if you control the store; the ownership move above is the minimal step that gets the safety claim true without it.

## 2. Failure path when recording uncertainty itself fails

The durable write can fail at two points; both must degrade to a *safe* state, never to "mutation applied, no receipt."

- **Entry write of the unknown receipt fails (before the remote call).** The mutation is gated *behind* the durable receipt, so we simply never perform it. We leave a `dead/aborted` holder tombstone (or nothing at all) and report *"uncertainty could not be recorded — mutation not applied."* No remote effect, so no duplicate is possible.
- **Exit resolve-to-known write fails (after the mutation).** The unknown receipt was already durably written at entry, so the durable state is *"unknown receipt"* — which is already the accepted safe state ("no new mutation while any prior effect is unknown"). We leave the unknown receipt in place (never delete it) and report *"mutation applied, result could not be recorded as known; treat as uncertain."* The next mutation sees the outstanding unknown receipt and refuses.

The key safety rule: **a failed receipt write is indistinguishable, for recovery, from a dead lock holder.** Both reduce to "a dead holder that startup/the next acquire converts into an unknown receipt." So the receipt-write-failure path reuses the exact same recovery as Race 2 — no new mechanism. The one state that must be made unreachable is *"lock released, mutation performed, no receipt"* — and the "write unknown receipt first, then mutate" ordering makes it structurally impossible.

## 3. Independent test that proves the boundary

"Independent" = the test drives the CLI as **real, separate processes** sharing only the durable store, never the in-process lock or memory, and injects faults at the exact boundary transition (per `SIMPLE.md` "Exercise real competing processes and forced termination at every boundary transition").

Use a controllable durable store (e.g. an in-test async store the harness can step) so the test is deterministic, not timing-lucky. Three cases:

- **Test A — Race 1 boundary.** Run P1's `mutate`. Fault-inject so P1 writes the unknown receipt, performs the mutation, then **stalls/fails exactly at the lock-release / resolve transition**. Launch real P2 for the same mutation. Assert: remote-mutation counter == 1, and P2 refuses because an outstanding (or dead) receipt exists.
- **Test B — Race 2 boundary.** Pre-seed the store with a **dead lock holder and no receipt** (simulating a crashed prior run). Launch real P2 for a new mutation. Assert: P2 first converts the dead holder into an uncertainty receipt (observable in the store) and then refuses the new mutation; remote-mutation counter == 0.
- **Test C — receipt-write failure.** Force the durable write of the unknown receipt to fail inside P1 *after* the mutation. Assert durable state ends as `dead/aborted holder`, **not** "clean lock, no receipt"; a subsequent P2 refuses; and the CLI reports uncertainty-unrecorded rather than success.

The boundary is *proven* only if you can also show **reverting the ordering** (record receipt *after* the mutation, or keep conversion outside the lock) makes the same tests fail. That negative case is what demonstrates the tests exercise the boundary rather than the happy path.

---

I can translate this into a concrete patch (a `gateway.mutate` rewrite plus the three tests) if you point me at the language/repo where the lock and receipt currently live. Want me to do that, or keep it at the design level?
