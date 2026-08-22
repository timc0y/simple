## The actual defect

Both races are the same bug wearing two costumes. Right now "is a mutation still unresolved?" is answered by two independently-mutable facts owned by two different parties:

- **the lock** (owned by the gateway: acquire → mutate → release)
- **the receipt** (owned by the composition root: check on start, write "unknown" after the gateway returns)

Nothing ties these together. The gateway is free to release the lock before the composition root writes the receipt (race 1), and "convert a dead holder into a receipt" is a side job that runs on startup, racing against any new mutation's acquire (race 2). In both cases a second process can observe "lock is free, no receipt" while the true state is "a mutation of unknown outcome just happened." The lock is being used as the safety signal, but it stopped being trustworthy the moment its release was decoupled from the receipt write.

Adding a second coordinator doesn't fix this — it adds a third party to keep in sync. Making every feature repeat the checks doesn't fix it either — it just multiplies the number of places the gap can be exploited.

## The smallest ownership change

Fuse the two edges that currently have a gap into one owner, one transition each:

1. **Release-on-completion moves from the gateway to whoever writes the outcome**, and release is *conditioned on* that write succeeding. The gateway stops calling "release" — it reports an outcome (success / failure / indeterminate) to the composition root, and the composition root's single act of "record outcome, then release" is what frees the lock. There is no window where the lock is free but the outcome isn't durable, because they're now one operation with one owner instead of two operations by two owners.

2. **Dead-holder → receipt conversion moves into the acquire path itself**, not a separate startup step. You cannot acquire the lock without first asking "is the current holder dead?" — and if so, converting it to a receipt is a mandatory, inline precondition of granting the lock, done by the acquirer as part of acquiring. There's no longer a separate recovery job that a new mutation can outrun.

The invariant this buys you: **the lock is free implies there is no unresolved mutation** — because the only two things that can free the lock (normal release, dead-holder recovery) both pass through the receipt first, atomically, under one owner. No new coordinator, no repeated checks in every feature — just moving two existing responsibilities to sit on the correct side of the boundary.

## The failure path: recording uncertainty fails

This is why "fuse them" has to mean *release is gated on record succeeding*, not "record, then release, and hope." If the write itself fails (disk full, store unreachable):

- **Do not release the lock.** Fail closed. The lock stays held.
- If the process then dies while retrying, that's fine — it becomes a dead holder, and the mandatory conversion step in the acquire path (item 2 above) turns it into a receipt before anyone is allowed to mutate again.
- Only a durable receipt write is allowed to free the lock. An attempted-but-failed write is indistinguishable, from the outside, from "still working" — which is exactly the safe state.

This is the reason the fix has to be an ownership change and not just "call record before release": if record can fail, the only safe rule is "no release without a proof of record," and that proof-gating only means something if one owner controls both sides.

## The independent test

Don't unit-test the gateway or the composition root — test the boundary as a black box, because the whole bug lives in the seam between them. The test that proves it:

**Crash-injection invariant test:** drive a mutation through the sequence with a controllable pause/kill point after each step (before acquire, after acquire, after mutate, after outcome known, after record attempted, after record succeeds). At every one of those points, kill the process and start a fresh one. Assert one invariant, checked from outside both components:

> If a mutation was ever attempted, then at all times afterward: `lock_held OR receipt_exists_for_that_attempt` — never both false.

Run this across every crash point, including "record write itself fails" (simulate the store rejecting the write). The test passes only if there is no crash point at which a second, independently-started process can acquire the lock while the first attempt's outcome is unresolved and unrecorded. That's the property the two observed races violated, and it's the one property that doesn't care which internal component does what — which is exactly what makes it prove the boundary rather than the implementation.
