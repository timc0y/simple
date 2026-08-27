## The smallest ownership change

**Invariant (stated without the current implementation):** a given mutation is applied at most once, and no new mutation begins while a prior effect of the same key is still uncertain.

**Why the two races happen:** the safety interval is split across three owners, and the two ends of the interval (check receipt, record receipt) live in the composition root while the middle (lock + mutate) lives in the gateway. Both races are the same gap — a point where the lock is free but no durable receipt exists:

- Race 1: lock released, then receipt recorded → a second process sees a free lock and an absent receipt.
- Race 2: a dead holder's lock is free-but-unconverted → a second process sees a free lock and an absent receipt.

The lock and the receipt are two separate mechanisms owned by two separate parties. As long as they are separate owners, there is always a window between "lock free" and "receipt present," and a third owner (composition root) cannot close it.

**The change:** make the lock owner the single owner of the whole interval. The gateway stops being "acquire/perform/release" and becomes the one transactional substrate that owns check → acquire → perform → record → release, plus dead-holder recovery. The composition root keeps only intent and wiring: it hands the mutation to this one owner and stops checking or recording receipts itself.

Concretely, in the lock owner:
- `acquire` first converts any dead holder into an uncertainty receipt (keyed by the identity stored in the lock record), then checks for an outstanding receipt, then grants.
- `release` becomes `commit`: durably record the receipt, *then* release the lock. There is no code path that frees the lock before the receipt is durable.

This is smaller than the two proposals:
- "Another coordinator" adds an owner; this reuses the existing lock owner.
- "Every feature repeats the checks" re-spreads the interval and recreates the gap; this removes the spread.

It matches the SIMPLE.md boundary note: do not split the interval unless one substrate atomically owns lock and uncertainty state — here the lock owner becomes that substrate, so no split remains.

**What is removed:** the composition root's two receipt steps, the separate startup recovery step, and any duplicated "check receipt" calls in features. The dead-holder conversion moves out of startup and into `acquire`, so there is no standalone recovery owner.

## Failure path: recording uncertainty itself fails

After the remote mutation has been performed, `commit`'s durable receipt write fails (store down, disk full, crash mid-write). The rule: **never release the lock.** The lock is the backstop that guarantees no second process can acquire and re-apply.

Three sub-cases:
1. **Transient failure, process alive:** retry the receipt write until it succeeds, then release. Safe.
2. **Permanent failure, process alive:** keep the lock held. No other process can acquire, so no duplicate. Operator intervention required; the mutation may be lost, which the uncertainty guarantee already accepts (loss is preferable to duplication).
3. **Process dies while holding the lock with no receipt:** on the next `acquire`, the dead-holder recovery reads the mutation identity carried in the lock record and writes a receipt recording "unknown result," then grants to the new process. No future process can re-apply. The mutation may be lost, never duplicated.

The one required schema addition (not a new owner) is that the lock record carries the mutation identity so recovery can write the correct receipt.

## Independent test that proves the boundary

The oracle is external: a mock remote endpoint with a durable monotonic `applyCount` for the mutation key. The test asserts only on observable contract — `applyCount ≤ 1` across all processes and all interleavings — never on internal lock/receipt ordering.

1. **Race 1 (release-before-record closed):** Process A acquires, performs the remote mutation (`applyCount` becomes 1), then is fault-injected to hang at `commit` with the receipt write delayed/failing. Process B attempts the same key concurrently. Assert B is blocked from applying and `applyCount` stays 1. Then force A to die still holding the lock; a fresh Process C acquires, converts A's dead holder to a receipt, and still does not call apply again. Final `applyCount == 1`.
2. **Race 2 (dead-holder-before-conversion closed):** pre-seed a stale lock held by a simulated dead process with no receipt. Start a fresh process on the same key. Assert it converts the dead holder to a receipt *before* any apply, and `applyCount == 1`.
3. **Contrast / falsification:** run the same two scenarios against the old split-ownership sequence (composition root checks/records, gateway releases early) and assert `applyCount` can reach 2. This proves the test actually distinguishes the boundary rather than passing trivially.

Best form: a deterministic interleaving simulator (or randomized scheduler with fault injection at each boundary transition) that explores many orderings and asserts `applyCount ≤ 1` holds for every one. That is independent enough to distinguish correct behavior from the implementation, satisfying the proof requirement.

---

This is the plan. Want me to write it into `SIMPLE.md`/a design doc, or proceed to implement the ownership change (there is no CLI source in this workspace yet — confirm where the real code lives)?
