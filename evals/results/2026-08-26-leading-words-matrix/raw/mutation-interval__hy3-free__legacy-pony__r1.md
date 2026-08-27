I'll start by understanding what's in the working directory, since this describes a real CLI system.This is a design problem, not a code change — the working dir only contains the prompt and a `SIMPLE.md` framing. Here's the plan.

# Plan: collapse the boundary into one ownership substrate

## Root cause
The safety claim ("at most one active mutation; no new mutation while a prior effect is unknown") is enforced by **two mechanisms owned by three actors**, with two ungated gaps:
- **Race 1** — `release lock` (gateway) → `record unknown result` (composition root): between them neither guard is active, so a second process passes the receipt check and the lock, and applies again.
- **Race 2** — detecting a dead lock holder → converting it to a receipt is a separate step from acquiring the lock; a new mutation can steal/break the lock before the conversion, so the dead mutation's uncertainty is never recorded and a fresh mutation is applied on top.

Rejected options are explicitly the expensive ones: a new coordinator just adds a third gap/failure point; "every feature repeats the checks" duplicates the fragile split without closing any gap.

## Smallest ownership change
Make **one transactional substrate own the whole interval**: the lock owner (gateway) also owns the uncertainty receipt store. Move `check outstanding receipt` and `record unknown result` out of the composition root and into the gateway, and execute them while the lock is held. Fold dead-holder recovery into lock acquisition so "detect dead holder → write uncertainty receipt" is atomic with acquiring the lock.

New sequence (one owner, one critical section):
```
gateway: acquire lock
         └─ atomically: recover any dead holder → write uncertainty receipt
gateway: check outstanding/unknown guard (no new mutation while prior unknown)
gateway: perform remote mutation
gateway: record result (success → clear receipt; unknown → receipt)   [lock still held]
gateway: release lock
```
The composition root only calls the gateway and consumes a definitive outcome; it no longer touches the lock or receipt. This is strictly smaller than adding a coordinator or scattering checks across features.

## Failure path: recording uncertainty itself fails
If the durable write of the uncertainty receipt fails after the mutation succeeded:
- **Do not release the lock. Do not report success.** Return a hard, fail-closed error ("outcome in doubt, lock held") to the composition root/user.
- The held lock becomes the sole guard: no other process can acquire it and apply a new mutation, so the safety claim still holds (safety traded for liveness — correct).
- If this process then dies holding the lock, startup dead-holder recovery re-runs and **itself writes the uncertainty receipt** (recovery always produces a receipt), restoring the durable guard. Either path guarantees no second mutation proceeds while the prior is unknown.

## Independent test that proves the boundary
A fault-injection harness using **two real, separate OS processes** (not threads) sharing the lock file + receipt store, with a suspend/kill injector at each named transition (per `SIMPLE.md` Proof):
- **Race 1**: kill A right after `perform remote mutation` returns, before the receipt is durable, while A holds the lock; launch B. Assert B cannot pass the unknown guard (blocks on held lock, or after A's death is recovered into a receipt and refuses) and the remote service recorded **exactly one** mutation.
- **Race 2**: begin recovery of a dead holder, suspend before its conversion to a receipt, concurrently launch B's new mutation. Assert B is serialized behind the conversion and never applies while prior is unknown; remote count stays 1.
- Cross-cutting assertion: across all interleavings and kill points, applied remote mutations per intent == 1 (never 2). That single assertion is the boundary proof and the regression test for both races.
