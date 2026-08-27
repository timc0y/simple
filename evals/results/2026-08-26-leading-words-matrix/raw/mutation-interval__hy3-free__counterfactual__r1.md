I'll explore the working directory to see whether there's an actual codebase behind this design question.This is a design problem, not a code change — there's no implementation to modify, just `prompt.md` (the question) and `SIMPLE.md` (the method). Here's the plan/answer.

## The smallest ownership change

**Collapse the three owners into one.** Today the lock lives in the **gateway** but the receipt (check + record + dead-holder conversion) lives in the **composition root** and in **startup**, with the lock released *before* the receipt is written. That split is the bug. Make the gateway the single owner of the entire mutation interval:

```
gateway: acquire lock
   - read outstanding receipt  → if present, reconcile, do not re-apply
   - if a dead lock holder exists → durably convert it to an uncertainty receipt,
     THEN claim the lock (one logical step)
gateway: perform remote mutation   (only if no blocking receipt)
gateway: record result
   - known → write resolved receipt
   - unknown/failed → write uncertainty receipt  (durable)
gateway: release lock   (only after the durable write above succeeds)
```

The composition root stops owning check/record/convert and just invokes the gateway. No new coordinator, no per-feature repetition — matching SIMPLE's "Reconsider when: split the interval only if one transactional substrate atomically owns lock and uncertainty state." Here we *un*-split it.

**Why this closes both races**
- Race 1 (lock released, receipt not yet recorded): release is now ordered *after* the durable receipt write, both owned by the same holder. A second process can only acquire once the receipt exists.
- Race 2 (new mutation before a dead holder becomes a receipt): taking the lock over a dead holder *is* the act of writing its receipt. No mutation can start without first having established the predecessor's receipt.

## Failure path: recording uncertainty itself fails

If the durable write of the uncertainty receipt fails (I/O error, disk full, fsync failure), the gateway **must not release the lock**. Releasing without a persisted receipt reopens Race 1. So:

- On record failure → keep the lock held (or fail/crash while still holding it). The mutation is *not* reported done.
- This turns the failed recorder into exactly the "dead lock holder" case already handled by acquire: the next process to acquire converts that still-held/dead lock into the uncertainty receipt before proceeding.
- Safety is preserved because the lock is never free while an unrecorded attempted mutation exists. The record-failure path reuses the dead-holder→receipt conversion; it needs no separate mechanism.

(Subtlety: a crash mid-record while holding the lock is the same path — recovery on next acquire sees the dead holder, writes the receipt, reconciles. So "record failed" and "crashed" are one handling path.)

## Independent test that proves the boundary

Per SIMPLE's Proof line ("real competing processes and forced termination at every boundary transition"), the proving test is a crash-at-the-seam concurrency test:

`test_no_double_apply_across_record_seam`
1. Process A: acquire lock, perform the remote mutation (remote side counts applies), then **SIGKILL at the seam** between "mutate succeeded" and "receipt durably written," while the lock is still held (crash-safe lease / lock file with dead PID).
2. Process B: launched immediately, attempts the same mutation.
3. Assert:
   - remote apply count == **1** (never a second apply),
   - a durable uncertainty receipt exists for A's mutation,
   - B issues **no** new remote mutation — it either reconciles against the receipt, or, as the recovery acquirer, first converts A's dead hold into a receipt before any mutate.
4. Variant for Race 2: A dies *before* mutate completes (dead holder, no record); assert B converts to a receipt and does not apply its own new mutation until reconciliation.

Run it across all boundary transitions (pre-acquire, post-acquire/pre-mutate, post-mutate/pre-record, post-record/pre-release, post-release) with real competing processes; the invariant holds iff, after any termination, the next process always either sees a receipt or sees a held/dead lock it must convert first — never a free lock with no receipt.

## Proposed deliverable

Since there's no code, I'd capture this as a short decision note. Want me to:
- (a) append a "Decision" section to `SIMPLE.md` (updating *Current boundary* and *Reconsider when*), or
- (b) write a standalone `answer.md`?

I won't edit anything until you confirm.
