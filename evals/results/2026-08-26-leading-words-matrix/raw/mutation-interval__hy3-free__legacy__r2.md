I'll explore the working directory to understand the context before proposing a plan.I'll explore the directory structure with the available tools.This is a design question, not a code change — there's no implementation to edit, only the design answer to produce. Based on the prompt, `SIMPLE.md`, and the `simple` skill, here is the plan.

## Outcome

Collapse the two open doors into one. Make the **gateway the single owner of the mutation boundary** — it owns the lock, the uncertainty receipt (check, record, and dead-holder conversion), and the release, with one rule: **the lock is released only after a durable outcome record exists.** That single change closes both races without a new coordinator and without pushing checks into every feature.

## The change

Today the gateway owns the lock and `perform`; composition root owns the receipt (check at step 1, record at step 5, and the startup dead-holder conversion). The invariant "at most one active mutation, and no new mutation while a prior effect is unknown" is split across three owners and two handoffs. The smallest fix is to move the receipt's **check, record, and conversion** into the gateway (already the lock owner). Composition root becomes a thin caller: `boundary.apply(mutation)`.

The gateway's one critical section then reads:

1. **Acquire lock.** On finding a dead holder, first convert it to an uncertainty receipt, then take ownership. (This subsumes the startup step and removes its window.)
2. **Check outstanding receipt.** If an uncertainty receipt exists, do not perform a fresh mutation; reconcile against the remote using the stored attempt id (idempotency key) until resolved.
3. **Perform remote mutation** with a stable idempotency key.
4. **Record outcome durably:** on known success, close the receipt; on unknown, write the uncertainty receipt.
5. **Release lock — only after step 4's durable write succeeded.**

## Why it closes the races

- **Race 1 (release before record):** The record now happens *inside* the locked section, by the same owner that holds the lock. At the instant the lock becomes free, a durable record (success or uncertainty) always exists, so a late starter's check at acquisition sees it. No free-lock-with-no-receipt window.
- **Race 2 (new mutation before dead-holder conversion):** Conversion happens *during* acquisition, which is the only way a new mutation can begin. A mutation cannot "start before" conversion because acquisition performs the conversion before granting. The dead holder is never observed as "free with no receipt."

This matches `SIMPLE.md`'s own guidance: "Split the interval only if one transactional substrate atomically owns lock and uncertainty state." We achieve that single-owner atomicity by sequencing plus the release-gating rule — no new transaction substrate and no extra coordinator needed.

## Failure path: recording the uncertainty receipt itself fails

After `perform` returns unknown, the durable write of the uncertainty receipt can fail (disk/DB down, crash). The binding rule is: **never release the lock without a durable outcome record.** Therefore:

- On record failure, **do not release the lock.** Retry the durable write persistently while the lock's lease is alive.
- If the process must exit, exit **still holding the lock.** A holder that dies mid-interval becomes a dead holder.
- The next acquisition converts that dead holder into an uncertainty receipt (step 1 above) — which is exactly the unknown state we needed. We must write *uncertainty*, never assume failure, because the outcome is genuinely unknown.
- Invariant preserved: at every moment either a durable receipt exists, or a live/dead lock holder exists that will become a receipt before any new mutation. The free-lock-no-record state is unreachable.

## Independent test that proves the boundary

Watch the **effect**, not the internals: an external oracle counts how many times the remote mutation is actually invoked. Drive real competing processes and force termination at the two boundary transitions, then assert the count never exceeds 1.

- **Boundary A (release vs record):** Process 1 acquires, performs (oracle = 1), then we stall/fail its receipt record while forcing the lock to remain held. Process 2 starts concurrently. Assert Process 2 either blocks on the held lock or, on acquiring, observes the outstanding receipt and issues **no** new remote call. Oracle stays 1.
- **Boundary B (lock-available vs conversion):** Pre-seed durable state with a dead holder and **no** receipt (simulated crash mid-mutation). Start Process 2. Assert a durable uncertainty receipt exists before Process 2's perform, and Process 2 issues no second remote call. Oracle stays 1.
- **Failure path:** Force Process 1's uncertainty record to fail; assert the lock is not released (a second process cannot acquire) and, after Process 1 is killed, the next process converts the dead holder to a receipt without a duplicate call. Oracle stays 1.

The test is independent because it judges correctness by the observable remote-application count across both race windows and crash points, distinguishing the fixed design from the original three-owner version.

## What each owner does after the change

- **Gateway / mutation boundary:** owns lock acquire (incl. dead-holder→receipt conversion), receipt check, perform, receipt record, and gated release.
- **Composition root:** invokes `boundary.apply(mutation)`; no longer checks or records receipts, and no longer performs startup conversion.
- **Startup:** the conversion is gone as a separate step; it is now just the first acquisition.
