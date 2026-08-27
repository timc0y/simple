I don't have write permission for `answer.md`, so here's the analysis directly.

## Why both doors exist

The five operations that must behave as one unit — check receipt, acquire lock (with dead-holder conversion), mutate, record outcome, release lock — are split across two owners (composition root and gateway) and aren't sequenced so that "unlocked" always implies "outcome known." The lock is meant to be the only gate a new mutation passes through, but right now it can be open while the truth about the last mutation is still unwritten.

- **Door 1 (race 1).** The gateway releases the lock as its own last step; only afterward does the composition root decide whether to record an unknown outcome. Between those two steps the lock is free but the result isn't yet durable. A second process passes "check outstanding receipt," sees nothing, and mutates again.
- **Door 2 (race 2).** Dead-holder-to-receipt conversion at startup is a step separate from lock acquisition. A new mutation can acquire the lock before conversion finishes, dropping the prior crash's uncertainty and letting a duplicate mutation through.

## What not to do

- A third coordinator doesn't close either door — it adds a second reasoner over the same scattered state, with its own chance to race the other two.
- Repeating the checks in every feature contradicts the one fact already true here: there is a single shared mutation boundary every command already goes through. Duplicating the check N times is N places to forget it, not zero.

## The smallest ownership change

Pull all five operations into the one existing shared mutation boundary, owned by a single component, in this order:

1. **Acquire the lock.** If the holder is dead, convert it to an uncertainty receipt as part of acquisition — the lock isn't considered acquired until that conversion is durable. This closes door 2: no new mutation can pass the gate while a prior crash's outcome is unresolved, because resolving it is now inside the gate.
2. **Check for an outstanding receipt** (now safe: holding the lock guarantees no concurrent writer, and any dead-holder receipt is already resolved by step 1).
3. **Perform the mutation.**
4. **Record the outcome** — success, failure, or unknown — durably.
5. **Only then release the lock.**

Moving "record outcome" ahead of "release lock" closes door 1: the lock can never be open while the last mutation's status is unwritten, because release is conditioned on a successful durable write, not on the mutation call returning.

## Failure path: recording uncertainty fails

If the durable write of the unknown-outcome receipt itself fails, the boundary must not release the lock. A stuck lock is safe (it blocks new mutations); a released lock with no receipt is not. Retry the write a bounded number of times while still holding the lock; if it still can't write, exit while holding it. The next process to start treats it as a dead holder and runs the same conversion-on-acquire step from the door 2 fix — so the receipt eventually gets written by the next holder's acquisition step, not by a second recovery path.

## Independent test

Per the proof requirement, this needs real competing OS processes and forced termination, not mocks: spawn actual CLI processes against a fake remote endpoint that counts calls (or requires an idempotency key), and SIGKILL the boundary-owning process at each transition — after acquire/before mutate, after mutate/before record, after record/before release, and mid-dead-holder-conversion. After each kill, start a fresh process and assert, through the command surface only: the remote endpoint was called at most once for that mutation, and a subsequent command either refuses to mutate (outstanding receipt) or proceeds cleanly once resolved. This matrix (transition point × kill), exercised independently of the internal implementation, is what proves the boundary — an implementation that merely reorders internal calls without gating on durable state cannot pass it.
