I'll explore the working directory to see whether there's actual code implementing this lock/receipt mechanism, so my plan can be concrete.This is a design exercise (no code to modify — `prompt.md`/`SIMPLE.md` are the spec). Here is the plan.

## Root cause

Both races are the *same* bug: the safety invariant ("a mutation is never applied twice") is split across an **owner handoff** with an open interval in which the lock is free but the uncertainty receipt is not yet durable.

- Race 1: `release lock` (gateway) → `record receipt` (composition root). Another process can grab the free lock and re-apply before the receipt exists.
- Race 2: on startup, the dead holder is converted to a receipt by one owner, but a *new* mutation can start (another owner) before that conversion lands.

The rejected options (extra coordinator, per-feature checks) fight the symptom. The smallest fix removes the handoff.

## Smallest ownership change

Collapse the **entire uncertainty lifecycle** (check outstanding receipt, record unknown result, convert dead holder) into the **lock owner** (gateway), so the lock is the single serialization point that also guarantees receipt durability. Composition root stops owning receipt state; it only launches the one shared gateway boundary (already used by every mutating command per SIMPLE.md — no feature-level repetition) and reads receipts afterward to decide reconciliation.

This is exactly what SIMPLE.md's "reconsider" line demands: *one substrate atomically owns lock + uncertainty state*.

## New sequence (one critical section, one owner)

```
gateway: acquire lock
         └─ first convert any dead holder → uncertainty receipt (recovery inside acquire)
         └─ then check for an outstanding (unknown) receipt; if present, refuse/queue, do not perform
gateway: perform remote mutation
gateway: record uncertainty receipt if result unknown   ← still holding the lock
gateway: release lock
```
- Race 1 gone: receipt is durable *before* release, so any later acquirer sees it and refuses.
- Race 2 gone: a dead holder is converted to a receipt as the first act of acquiring the lock, so a new mutation cannot start until recovery has run.

No new coordinator, no duplicated checks.

## Failure path: recording uncertainty itself fails

If the durable receipt write fails after a successful `perform` (I/O error, crash mid-write), the gateway must **fail closed**: do **not** release the lock and do **not** report the mutation committed. It dies holding the lock. That dead holder is then converted to a receipt by the next acquirer — i.e., a receipt-write failure degrades *into the already-handled dead-holder case*. The remote effect stays "unknown" and is covered; no second process can slip through the gap because the lock was never released. (Releasing on write-failure would be the one unsafe outcome — never do it.)

## Independent test that proves the boundary

The boundary is "receipt is durable before the lock is released / granted." The test that proves it:

**Double-apply-under-forced-gap test.** Drive two competing processes against a mock remote that counts applies. Instrument the gateway so the scheduler/mock clock is frozen in the old race window (between `perform` and the durable `record`), and let a second process attempt its mutation. Assert the remote apply count is exactly **1** — the second process either blocks on the still-held lock or, after grant, observes the now-durable receipt and refuses. Mirror variants:
- *Race 2:* kill the first holder mid-flight, immediately start process 2; assert it cannot apply until the dead holder is converted (count stays 1).
- *Write-failure:* force the receipt write to fail; assert the lock is not released and process 2 cannot re-apply; after recovery the receipt exists and reconciliation resolves with no second apply.

The single decisive assertion across all three: **remote mutation count == 1** under every forced boundary transition.

---

I can't write files in plan mode. Want me to (a) document this as a design note / update SIMPLE.md's "Current boundary" and "Proof" sections, or (b) prototype the gateway boundary if there's a target language/repo you have in mind?
