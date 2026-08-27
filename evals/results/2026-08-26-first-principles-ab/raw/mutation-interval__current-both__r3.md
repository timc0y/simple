## Diagnosis

Both races have the same shape: **the lock's "free" state and the receipt's "written" state are set by two different owners, at two different times, with no atomicity between them.**

- Race 1: gateway frees the lock as its own step, independent of whether composition root has recorded the outcome. The window between "lock released" and "receipt recorded" is where a second process can acquire the lock and mutate again, because its own outstanding-receipt check finds nothing yet.
- Race 2: startup frees/reclaims a dead lock as its own step, independent of converting that holder into a receipt. Same window, different trigger.

The actual safety claim is: *the lock must never be acquirable while the outcome of the mutation it last protected is unresolved.* Today that's an emergent property two owners are each partly trusted to uphold — not an invariant either one enforces alone.

## Why the two proposed fixes are wrong-sized

- A fourth coordinator adds an owner instead of fixing which of the two existing owners should hold the invariant.
- Repeating the check in every feature multiplies the number of places that must get an ordering right, instead of fixing the ordering once.

## The smallest ownership change

Give the **lock owner** (gateway) the responsibility it's missing: writing the receipt is part of releasing the lock, not a separate step composition root does afterward.

Normal path becomes one atomic sequence under one owner:
acquire lock → mutate → determine outcome → write receipt (clear, or "unknown" if ambiguous) → release lock.

The receipt is settled *before* the lock becomes acquirable — there is no gap for race 1 to occupy. Composition root's "check outstanding receipt" stays, but shrinks to a read: it can now trust that lock-free implies receipt-current.

Startup recovery gets the same rule, same owner: detect dead holder → write its receipt as "unknown" → only then mark the lock reclaimable. Reclaiming and recording become one sequence instead of two racing ones — this closes race 2 by the identical mechanism.

This is one responsibility moved (receipt-write, from composition root into the lock's release/reclaim path), not a new owner and not duplicated logic per feature.

## Failure path: the receipt write itself fails

Fail closed. If the receipt can't be written (disk full, write error, crash mid-write), **do not release or reclaim the lock.** The still-held lock becomes the fallback uncertainty signal — its mere existence blocks any new mutation. Surface this loudly (nonzero exit, clear log) so an operator intervenes.

Worst case under this rule: the CLI can't start new mutations until someone looks — safe but inconvenient. The alternative (release anyway) risks a silent second mutation with no record the first was ever uncertain — unsafe. Given the choice, unavailability beats silent double-apply.

## Independent test

Test only the two durable, externally observable artifacts — lock state and receipt state — not which internal function called which:

1. Inject a mutation that fails ambiguously (simulated timeout/crash).
2. From an observer outside the gateway/composition-root code path (read the raw lock file and raw receipt store directly), assert there is never a moment where lock = free and the receipt for the most recent attempt is missing or stale.
3. For startup: crash a process mid-mutation while it holds the lock, then race a second process's startup against it. Assert the lock never becomes acquirable before the dead holder's receipt commit — run this under timing fuzzing, not a single ordering.
4. For the failure path: force the receipt store to error on write, then assert the lock is neither released nor reclaimed, and the process exits nonzero.

Because this test inspects only the two artifacts and their relative ordering, it holds regardless of which module ends up owning the atomic step — it would have failed under the original split ownership and passes once release/reclaim and receipt-write are made one sequence under one owner.
