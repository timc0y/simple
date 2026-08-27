This is a design problem, not a code-change task — the repo here is just a harness folder. Here's the plan.

## Root cause
The safety claim *"at most one active mutation, and no new mutation while any prior effect is unknown"* spans four operations split across **two owners** (composition root + gateway). The fatal gap is the window between `gateway: release lock` and `composition root: record unknown result`. During it, an observer sees **no lock and no receipt** → it reapplies. That is race 1, and race 2 is the same split for the dead-holder case: "convert dead holder → receipt" is a third step owned by nobody.

## Smallest ownership change
Collapse the invariant into **one owner: the lock holder.** No new coordinator, no per-feature duplication. Two moves only:

1. **Move "record unknown result" into the gateway and do it *before* release.** The gateway owns the uncertainty receipt write while still holding the lock. The composition root's pre-check becomes a non-authoritative hint; the authoritative check happens under the lock.
2. **Make lock acquisition self-healing.** On acquire, if the prior holder is dead, the acquirer converts that dead holder into the uncertainty receipt *as part of taking the lock* — same owner, same critical section.

Result: one serialization point owns both the lock and the uncertainty state. There is never a moment where a mutation was applied but neither lock nor receipt is visible.

## Failure path — recording uncertainty itself fails
Under the lock, if the durable receipt write fails (store down, disk full):
- **Do not release the lock.** Releasing reopens race 1.
- The gateway **retries in place or exits while still holding the lock**, becoming a dead holder.
- The next acquirer finds that dead holder (an applied-but-unconfirmed mutation), converts it into the receipt, then **reconciles the actual result** instead of re-applying.
- Safety holds; only liveness is lost until the lease expires. Never correctness.

## Independent test that proves the boundary
Fault-injected, deterministic, timing-independent — checks the single observable that matters: **remote mutation invoked at most once.**

- **Window-closed (race 1):** force the gateway to acquire → apply → attempt receipt write but have the store reject it. Assert it does *not* release the lock (or exits leaving a dead lock). Start a second process; assert it either blocks, or after lease expiry reaps the dead holder into a receipt and does **not** call the remote mutation again. Assert remote mock invoked exactly once.
- **Dead-holder reaping (race 2):** process A acquires then dies without recording; process B acquires. Assert B converts A into a receipt and reconciles, never re-applies. Assert remote mock invoked exactly once.

Both tests pin the exact transition points that changed and prove the invariant "lock and receipt are never simultaneously absent for an applied mutation."
