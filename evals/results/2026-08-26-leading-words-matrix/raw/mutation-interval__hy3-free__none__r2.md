This is a design/ownership puzzle, not a code change — there's no application source in this dir, just `prompt.md` and `SIMPLE.md`. Here's the plan.

## The smallest ownership change

**Make the lock owner the sole owner of the uncertainty receipt.** Transfer the three receipt responsibilities that the composition root currently holds — *check outstanding receipt*, *record unknown result*, and *convert a dead holder into a receipt* — into the same component that already owns the lock. Collapse the four operations plus the startup step into **one owner**, one interval.

Rejected options, and why they're larger:
- *Another coordinator* → adds a 4th owner; the gaps are between owners, so more owners can't close them.
- *Every feature repeats the checks* → pushes the invariant to N call sites and leaves the cross-owner gaps open.

SIMPLE.md already points here: *"The lock owner does not own receipt conversion, checking, or recording"* is the current boundary, and *"Split the interval only if one transactional substrate atomically owns lock and uncertainty state"* is the reconsider clause. The fix is to stop splitting.

## New sequence (single owner = the lock/boundary)

```text
caller (composition root / any command): runWithinBoundary(id, doMutation)
  boundary owner:
    1. acquire lock
         - if held by a DEAD holder H: convert H -> receipt(unknown) atomically, then grant
    2. check outstanding receipt for id
         - if exists: return its outcome, do not perform
    3. perform remote mutation
    4. decide outcome: known(success|failure) or unknown(timeout/indeterminate)
    5. record receipt durably   <-- BEFORE release
    6. release lock
```

Race 1 closes because the receipt is durable (step 5) before the lock can be acquired by anyone else (step 6). Race 2 closes because dead-holder conversion is part of `acquire` (step 1) in the same owner — a new mutation cannot be granted until the dead holder is a receipt.

## Failure path: recording uncertainty itself fails

While holding the lock (step 5), the durable receipt write fails (disk full, crash mid-write, store unavailable):
- **Do not release the lock.** Releasing without a durable receipt reopens race 1.
- Retry the write with bounded backoff. If it persistently fails, *refuse to release* and surface `"mutation executed, uncertainty not durably recorded; outcome unknown"` to the caller.
- If the process dies still holding the lock, the lease/expiry makes it a dead holder; the next `acquire` (step 1) converts it to `receipt(unknown)`. The system then treats the prior mutation as *might have applied* and will **not** re-run it.
- Safety (at most once) holds. The only cost is liveness: a mutation that actually succeeded but couldn't be durably receipted is treated as unknown and not retried — a lost update, not a duplicate. That's the correct side to err on for an "at most once" claim.

## Independent test that proves the boundary

A **deterministic interleaving test against real competing processes** (SIMPLE: *"real competing processes and forced termination at every boundary transition"*), using a test double for the durable store that exposes explicit pause/resume at the boundary transitions:

1. Start process P1 for mutation M. It acquires, performs the remote mutation (remote counter = 1), and is **paused at step 5** (record receipt) by the store double.
2. Start process P2 for the same M. Assert it **blocks** at `acquire`/step 2 and does **not** apply the mutation while P1's receipt is outstanding.
3. Branch:
   - P1 resumes → records receipt → releases. Assert P2 observes the receipt and skips (counter = 1).
   - P1 is **SIGKILLed** while paused → dead-holder conversion (step 1) makes P2 see `unknown` and skip (counter = 1).
4. Post-condition asserted regardless of branch: **remote mutation applied ≤ 1 time.**

The boundary is *proven* by running the identical harness against the old split-owner design, where P2 is allowed to acquire during the release→record gap and the counter reaches 2. The single ownership transfer is the precise change that flips the outcome — that contrast is what proves the boundary, not the implementation details.

## Proposed artifact

Update `SIMPLE.md`:
- *Current boundary* → state the **new** boundary: "One owner (the lock/boundary) atomically owns lock acquisition, dead-holder→receipt conversion, receipt check, and receipt record-before-release."
- *Proof* → add the deterministic interleaving test above as the boundary proof, keeping the "real competing processes + forced termination at every transition" requirement.
- Add a short *Failure* note covering the record-fails path (never release without a durable receipt; dead-holder path recovers as unknown).

Want me to record this directly into `SIMPLE.md` once plan mode is exited, or would you prefer a standalone `DESIGN.md`?
