This is a design/architecture problem, not a code-editing task — the repo only contains `prompt.md` and `SIMPLE.md` (the spec). `SIMPLE.md` already names the root cause and the direction. Here is the plan.

## The smallest ownership change

**Make the lock owner own the uncertainty state.** Today the lock owner (gateway) does not own receipt conversion, checking, or recording (`SIMPLE.md:17`), so the safety invariant spans four operations across three owners. Collapse that to **one owner**: the gateway takes over the receipt check, the receipt recording, and the dead-holder→receipt conversion. The composition root stops touching the receipt and only invokes the gateway's single mutation boundary.

This is smaller than the two rejected proposals: it adds no new coordinator, and it does not push checks into every feature (the gateway already fronts every mutating command, per `SIMPLE.md:22`).

## New single-owner protocol (the gateway)

1. **Acquire lock** — and as the first act of taking ownership, **convert any dead prior holder into an uncertainty receipt** (idempotent).
2. **Check outstanding receipt** — if one exists, the prior effect is unknown; do not perform a fresh mutation, reconcile/probe the remote instead. If none, proceed.
3. **Perform** the remote mutation.
4. **Commit atomically** — durably record the outcome (success *or* unknown) **and** release the lock in one step. The lock is never released unless the terminal state is durably recorded.

## Why the two races close

- **Race 1 (release before record):** the unknown receipt is written *as part of* the lock-release transition. A process can acquire the lock only after the prior holder has durably recorded success-or-unknown — there is no free-lock / no-receipt window.
- **Race 2 (new mutation before dead-holder conversion):** conversion is step 1 of acquiring. You cannot take the lock without first converting a dead holder into a receipt, so no new mutation can start in that window.

`SIMPLE.md:30` ("Split the interval only if one transactional substrate atomically owns lock and uncertainty state") is satisfied: one owner now atomically owns both.

## Failure path: recording uncertainty itself fails

After the remote call, the gateway tries to durably write the unknown receipt + release atomically. If that durable write fails (I/O error, crash mid-write, disk full):

- **Do not release the lock.** Releasing without the durable receipt is exactly the bug in race 1.
- Surface the error and exit **with the lock still held**. The lock now has a detectable dead/orphaned holder and no recorded outcome.
- On next startup, step 1 of acquire finds that dead holder (stale pid/heartbeat/timestamp) and converts it into an uncertainty receipt — safe recovery, never a premature free lock.

This depends on robust dead-holder detection. The same rule applies if recording *success* fails: never release on a failed terminal-state write; let startup reconciliation handle it. Invariant preserved: **lock free ⇒ success-or-unknown is durably recorded.**

## Independent test that proves the boundary

A fault-injection integration test (`SIMPLE.md:26`: real competing processes, forced termination at each boundary transition):

- **Race 1 / commit seam:** drive a mutation through the remote call, then inject failure at the exact seam — drop the process right after lock release but before the receipt is durably committed, or force the receipt write to fail. Launch a second competing process that tries to acquire the lock. Assert it is either blocked while the lock is still held, or on takeover finds a dead holder converted to a receipt and refuses a fresh mutation. Assert the remote stub counted the mutation **at most once**.
- **Race 2 / startup seam:** pre-seed a durable lock owned by a "dead" holder with no receipt; launch a new mutation before conversion. Assert the new process converts the dead holder to a receipt on acquire and does not perform a second remote mutation if the prior already applied — it reconciles first.

The test targets the gateway's single mutation-boundary contract directly (not per-feature callers), so it stays valid no matter how many features use the boundary — that is what makes it *independent* and what proves the boundary.

---

No code changes were made (plan mode). If you want, I can implement this as a concrete module (single `MutationBoundary` owner replacing the split sequence) with the fault-injection test harness.
