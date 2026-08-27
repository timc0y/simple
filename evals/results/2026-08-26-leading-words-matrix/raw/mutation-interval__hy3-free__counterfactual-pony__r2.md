I'll first check whether there's an actual codebase this question refers to, then reason about the design.This is a run/metadata directory, not a real codebase. The question is a design puzzle. Let me check the prompt context files.I have enough to answer. There's no implementation codebase here — this is a design reasoning task; the only artifacts are `prompt.md` and `SIMPLE.md`, which already encode the key constraint: *"The lock owner does not own receipt conversion, checking, or recording"* and *"Split the interval only if one transactional substrate atomically owns lock and uncertainty state."* That is the answer.

## Plan

### Diagnosis
The two primitives (lock, receipt) are sound individually; the double-apply comes from **who owns them and when they fire**:

- The receipt is recorded by a *different* owner (composition root) **after** the lock is released → window where the lock is free but no receipt exists (Race 1).
- Dead-holder→receipt conversion is a separate composition-root startup step, so a new mutation can acquire the freed lock before that conversion happens (Race 2).

The invariant "no mutation applied twice" is split across 4 operations and 3 owners, so no single actor can guarantee it.

### Smallest ownership change
**Move receipt check, record, and startup dead-holder conversion from the composition root into the gateway (the lock owner).** The gateway becomes the single owner of the entire `claim → lock → mutate → confirm` interval; the composition root stops touching receipts and just calls the one shared mutation boundary (which already exists per SIMPLE.md "Ordinary paths"). No new coordinator, no per-feature checks — the rejected proposals.

This satisfies SIMPLE.md's "Reconsider when": one substrate (the gateway) now atomically owns lock *and* uncertainty state.

### New sequence, single owner
```
gateway: on acquire — if stale lock from dead process, convert it to an OUTSTANDING receipt (atomic, same owner)
gateway: write durable OUTSTANDING receipt (claim) for this mutation id
gateway: perform remote mutation
gateway: write durable CONFIRMED receipt (known result)
gateway: release lock
```
Invariants enforced by ordering:
- The outstanding receipt is durable **before** the lock can be free → Race 1 closed.
- A new lock is **never granted** until a dead holder has been converted to a receipt → Race 2 closed.

### Failure path when recording uncertainty fails
Ordering rule: **the claim receipt is written before the mutation**, so a failed claim can never trail a performed mutation.
- **Claim write fails (before mutation):** abort; do **not** perform the remote mutation; release/cleanup the lock; report failure to caller. Safe — zero applications so far, retry is allowed, no double-apply.
- **Mutation succeeds but confirmation write fails (after mutation, before release):** the OUTSTANDING receipt persists; on restart it is treated as *unknown* and a conflicting new mutation is **refused**. Safe (no double-apply); degraded to the designed "unknown" tolerance. This is the only case the safety claim permits uncertainty in.

### Independent test that proves the boundary
Per SIMPLE.md "Proof: exercise real competing processes and forced termination at every boundary transition." A deterministic state-machine property test over all interleavings is the independent proof; back it with one real-process kill test:

1. **Race 1 closure:** force-kill after the claim write but before lock release; restart; assert a competing process for the same id is *refused* (outstanding receipt present) — proving no free-lock/no-receipt window exists.
2. **Race 2 closure:** plant a stale lock file; start the CLI; assert the dead holder is converted to a receipt *before* any new mutation is permitted, and a conflicting mutation is refused.
3. **Claim-failure closure:** inject a claim-write failure; assert the remote mutation is never performed and the caller receives a failure.
4. **Oracle:** across all transitions, assert the remote mutation is applied **≤ 1 time** and never concurrently.

### Deliverable
Since there's no CLI code in this workspace, "implementation" means recording the decision. I'd update `SIMPLE.md` (replace "Current boundary" with the consolidated-ownership boundary, and capture the failure/test contracts) — or drop a short `DECISION.md`. Let me know if you want it written there, or just the analysis as-is.
