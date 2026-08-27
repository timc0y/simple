I'll explore the workspace to see whether this is a real codebase or a pure design exercise.This is a pure design-reasoning exercise (no codebase to edit) built around the `simple` skill. Let me read the skill to align my reasoning and output with its method.## Outcome

Delete the split ownership. Put the **gateway in sole ownership of one durable "claim" record that *is* both the lock and the uncertainty receipt.** The composition root stops checking or recording receipts; it only passes the mutation intent in and the outcome out.

## Why the two races exist today

The invariant is "no new mutation while any prior effect is unknown *or* in flight." It is spread across two owners and two durable objects, with a temporal gap:

```
composition root: check receipt   (read durable)
gateway:          acquire lock    (in-memory)
gateway:          mutate
gateway:          release lock
composition root: record unknown  (write durable)   <- after the lock is free
```

- **Race 1** — between `release lock` and `record unknown`, the lock is free *and* no receipt exists. A second process passes the check and re-applies.
- **Race 2** — a dead holder is only "converted into a receipt" as a *separate* later step. A new mutation starts before that conversion, sees neither live lock nor receipt, and re-applies.

Both races are the same defect: the protective record is written *after* the dangerous action and by a different owner than the lock.

## The change (smallest, one owner, one atomic write)

The claim record replaces both mechanisms:

1. **`claim.open(id)`** — one conditional `insert-if-absent` on the durable store, status `pending`. This single write *replaces* both "check outstanding receipt" and "acquire lock." Its existence is the mutual exclusion (uniqueness) and the uncertainty receipt (durable, not-yet-confirmed). If a claim already exists (`pending` or `unknown`), the new attempt does not proceed.
2. **perform the remote mutation** under the claim.
3. **`claim.resolve(success | unknown)`** — transition the same record.

**Startup reconciliation** is reduced to one scan: any `pending` claim older than the timeout is flipped to `unknown`. There is no separate "convert dead holder into a receipt" operation, because the dead holder *was already a receipt* from step 1.

This satisfies `SIMPLE.md:17` ("the lock owner does not own receipt conversion") and `SIMPLE.md:29` ("split the interval only if one transactional substrate atomically owns lock and uncertainty state") — we keep them unified under one owner.

## Why both races close

- **Race 1:** the receipt (= claim) is durable *before* the mutation, not after. Releasing the "lock" is just a status transition on the same record. There is never a state where the lock is free and no receipt exists.
- **Race 2:** a dead holder is a durable `pending` claim the whole time. A new mutation that "starts before conversion" still sees that claim and is blocked. The conversion race is eliminated because there is no conversion step to race with.

## Failure path: recording uncertainty itself fails

`claim.open` is a **hardened write-before**: it must be durably acknowledged *before* `remoteMutate` is attempted. That is the only ordering that must hold.

After the mutation, `claim.resolve(unknown)` is best-effort. If that final write fails (crash, store error), the record remains `pending` — which reconciliation treats as `unknown`. Because the safety rule is "no new mutation while any claim is `pending` or `unknown`," a later process sees the surviving claim and refuses to re-apply. So a failed uncertainty write can never cause a double-apply; the worst case is a permanently `unknown` outcome awaiting manual reconciliation — the correct, safe degradation.

The one unrecoverable hole would be crashing *before* `claim.open` ever persisted. That is why the precondition is explicit: persist-and-ack the claim strictly before the remote mutation, not after.

## Independent test that proves the boundary

The boundary is the claim being present *at the instant the lock is released*. Prove it with deterministic fault injection against a mock remote-mutation counter (`applyCount`):

- **Old design (shows the open boundary):** force termination between `release lock` and `record unknown`; restart a second process for the same mutation. Assert `applyCount == 2`. This demonstrates the gap is real.
- **New design (shows it closed):** inject termination at each transition and assert:
  - crash after `claim.open` ack, before `remoteMutate` → `applyCount == 0` (reconciliation blocks re-apply, outcome `unknown`).
  - crash after `remoteMutate` returns ambiguous, before `claim.resolve` → `applyCount == 1` (single application preserved; surviving `pending`/`unknown` claim blocks re-application).
  - **The decisive independent assertion:** at the exact commit point where the old code releases the lock, take a concurrent snapshot of the durable store and launch a second attempt. Assert the claim is **present** in the snapshot and the second attempt's `applyCount == 0`.

That snapshot/second-attempt pair is independent of the implementation: it distinguishes "the boundary holds" (`applyCount` stays 1 across all interleavings) from "the boundary is open" (`applyCount` reaches 2), without trusting the gateway's internal accounting.

## What is removed

- The composition root's receipt check and record steps.
- The separate startup "convert dead holder into a receipt" step.
- The post-release recording gap that both races exploited.

No new coordinator, no per-feature checks — the invariant lives in exactly one owner and one atomic write, matching `SIMPLE.md:11-12` ("one shared mutation boundary… at most one active mutation; no new mutation while any prior effect is unknown").
