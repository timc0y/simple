I have the full context (SIMPLE.md confirms the framing). Here is the plan.

## The smallest ownership change

The defect is in the ownership map, not in missing checks. Today three owners share one invariant:

- composition root: checks + records the receipt
- gateway: owns the lock and the remote mutation

The lock owner "does not own receipt conversion, checking, or recording" (SIMPLE.md:17). So the two doors — lock and receipt — are held by different hands, and the lock's critical section ends *before* the receipt is made durable. That gap is the double-apply.

**Fix: make the lock holder (gateway) the sole owner of the uncertainty-receipt lifecycle.** Move the pre-check, the dead-holder→receipt conversion, and the post-record all inside the gateway's locked critical section. The composition root stops gating and recording; it calls one entry point, `guardedMutate`. No new coordinator, no per-feature duplication.

New single-owner sequence:

```text
gateway: acquire lock
gateway: check outstanding receipt          (now under lock)
gateway: perform remote mutation
gateway: record uncertainty receipt if unknown   (still under lock)
gateway: release lock
```

On startup, the same owner runs the dead-holder conversion under the same lock, before admitting any new mutation.

This closes both races:
- **Race 1** — the receipt is durable *before* the lock is released, so a later process is either blocked by the lock or sees the receipt; it cannot re-mutate.
- **Race 2** — conversion is owned by the lock holder and runs under the lock, so no new mutation can start until the dead holder is a durable receipt.

## Failure path when recording uncertainty itself fails

The invariant the design rests on is: **a lock is released only after a durable receipt (or durable commit) exists.** If the durable write of the uncertainty receipt fails (IO error, crash, store unavailable), the unsafe outcome is exactly "unlock with no receipt" — the original bug. So the failure path must refuse that:

- Hold the lock (do not release, do not report resolved) and retry the durable record until it succeeds. A held lock only *delays* competitors; it never duplicates.
- If the process dies before succeeding, it becomes a dead holder; on restart the same owner converts it into the uncertainty receipt before any new mutation (the Race-2 path).
- If the record truly cannot be written, the mutation stays fenced — locked and in-doubt forever — rather than escaping as "unlocked with no record." Surface as *uncertain / reconcile on recovery*, never as success and never as re-runnable.

The dangerous branch ("release lock + no durable receipt") is removed by construction because the release step is sequenced after a successful durable write.

## Independent test that proves the boundary

Per SIMPLE.md "Proof": real competing processes and forced termination at every boundary transition. The boundary under test is the release-vs-record gap, so attack it directly:

1. **Race 1 (lock-released-before-receipt).** Two real processes, same logical mutation. Process A acquires the lock, performs the remote mutation, then is held at the record step (stall/fault injection) before releasing. Process B attempts the mutation concurrently; assert B performs **zero** remote mutations (blocked by lock or sees in-doubt receipt). Resume A to durable-record + release. Assert exactly **one** remote mutation total.

2. **Race 2 (dead holder before conversion).** Process A acquires lock, performs mutation, then `SIGKILL` before recording. On restart, recovery must convert the dead holder into a durable receipt *under the lock* before any new mutation. A concurrent B attempting the same mutation must observe the converted receipt and **not** re-mutate. Assert exactly one remote mutation.

3. **Receipt-write-failure boundary.** Inject a failure into the durable receipt write at the record step. Assert the lock is **not** released and a concurrent attempt cannot apply the mutation — proving "released ⇒ receipt durable" holds even when the write fails.

The single assertion that the whole design hinges on, and that these three tests independently establish: **no process can apply the mutation unless (durable commit exists) or (it holds the lock with no durable resolution yet)** — which makes exactly-once at the remote boundary true.

---

Want me to draft this as concrete code (e.g., a `guardedMutate` owner + the three tests) once you exit plan mode, or keep it at the design level?
