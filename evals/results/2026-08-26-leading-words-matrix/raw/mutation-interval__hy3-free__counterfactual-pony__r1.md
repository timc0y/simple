I'll explore the working directory to understand whether this is a concrete codebase or a pure design exercise.This is a pure design puzzle — the repo has only scaffolding, no CLI code to modify. The answer is an ownership/ordering fix, not a new coordinator. Here is the plan.

## Root cause
The safety claim ("a mutation applied at most once") spans four operations split across two owners, leaving two gaps:
- The receipt **check** (composition root) runs *before* the lock is taken → two callers can both pass it.
- The receipt **record** (composition root) runs *after* the lock is released → a second caller can take the lock and pass the still-absent check.
- Dead-holder→receipt **conversion** is a separate step a new mutation can start before.

## Smallest ownership change
Move the receipt check **and** the receipt recording into the gateway so it owns the whole critical section under one lock. New sequence (single owner):

1. acquire lock — if a dead holder is found, **convert it to an uncertainty receipt inside acquisition**, not as a separate step
2. check outstanding receipt (now under the lock)
3. perform remote mutation
4. durably record result/receipt
5. release lock — **only after step 4 durably succeeded**

The composition root becomes a thin caller with zero receipt logic. Smaller than adding a coordinator or duplicating checks per feature. The release precondition "receipt durably recorded" makes "lock free AND no receipt" impossible by construction; the dead-holder case is already an in-flight marker, so its conversion is subsumed by acquisition (no separate window). This closes both races.

## Failure path — recording uncertainty itself fails
After the remote mutation (which may have succeeded remotely), the durable receipt write fails (fsync/disk/crash). Rule: the gateway must **not** cleanly release the lock and must **not** report success. It retries while holding the lock, or exits as a *dead holder* (lock record left in-flight). It must never reach "lock released, no receipt." The next invocation's acquisition finds the dead holder, adopts it as an uncertainty receipt, **reconciles against the remote** to learn whether the mutation applied, records the known result, and declines to re-apply. Safety holds because the follow-up reconciles rather than assumes, and a clean release without a persisted receipt is made impossible. The remaining obligation is to surface a hard error so an operator knows reconciliation is pending.

## Independent test — prove the boundary
Real competing processes with forced termination at each transition, asserting the remote mutation runs exactly once. Decisive case:
- Process A acquires lock, performs the remote mutation (mock remote counts invocations), then is **forcibly terminated after the mutation but before the receipt is recorded** — the exact dead-holder state shared by race 1's gap and race 2's startup.
- Process B runs the same guarded mutation.
- Assert B does **not** call the remote mutation again; it converts the dead holder and reconciles to a known result.
- Assert remote mutation count == 1.

Companion assertions: (a) termination after acquire-but-before-mutation → zero remote mutations, clean later apply; (b) the recording-failure path leaves the lock held (no clean release) and the follow-up still applies once; (c) a dead holder at startup blocks a new mutation until conversion. Together these prove no "lock free, no receipt" window exists.

---

There's no CLI source here to refactor — this is the design itself. Want me to (1) write this to a `PLAN.md`, or (2) implement it as a concrete refactor if you point me at the actual CLI repo?
