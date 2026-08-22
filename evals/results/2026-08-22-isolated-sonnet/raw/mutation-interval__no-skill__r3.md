## Root cause

Both races are the same bug wearing two costumes: **the lock's release and the receipt's write are owned by different parties and happen at different times.** The lock is a bare mutex; the receipt is bookkeeping bolted on afterward by a different owner (composition root). Nothing enforces that the mutex can only go free once the outcome is durably known. That gap is the "open door" — twice, because both the normal path (gateway releases → root records) and the recovery path (startup dead-holder scan → convert to receipt) have the same shape: *free the lock, then, separately, write the receipt.*

Adding a second coordinator doesn't close this gap, it just gives the gap a witness. Repeating the checks in every feature doesn't close it either — it makes every feature race the same window independently.

## The smallest ownership change

Merge lock-lifecycle and receipt-lifecycle under **one owner**, and redefine the lock as a state-machine guard rather than a bare mutex:

> **Invariant the owner enforces:** the lock is held *iff* the outcome of the mutation it's guarding has not yet been durably recorded.

Concretely, one boundary component (not the gateway, not composition root separately — a single shared "mutation boundary" that every mutating command calls through) does, in order, with no owner handoff in between:

1. **Acquire** — if the current holder is dead, first convert it to an uncertainty receipt durably, and only *then* grant the lock to the new caller. Dead-holder conversion becomes part of acquisition itself, not a separate startup task that a fresh mutation can outrun. This closes race #2: a new mutation literally cannot get the lock until the prior holder's uncertainty has been recorded, because acquiring *is* reconciling.
2. **Perform** the remote mutation.
3. **Record** the outcome — success, failure, or unknown — durably.
4. **Release** — only as a consequence of step 3 succeeding. Release is never an independent step; it's the last thing that happens after the write, in the same owner, with nothing able to run between them.

This closes race #1: there is no longer a window where the lock is free but the outcome is unwritten, because "free" is defined as "write completed."

This also satisfies "one shared mutation boundary used by every mutating command" without a second coordinator: the existing lock+receipt store just needs to be the single place both concerns live, and every command routes through it instead of re-implementing the check.

## Failure path: recording uncertainty fails

Don't invent a new error path. If the durable write of the uncertainty receipt itself fails (disk full, store unreachable), **do not release the lock.** Propagate the error to the caller so the command fails loudly — never report success or silently drop it. The resulting state — lock held, no terminal record — is *identical* to a process crashing mid-mutation, so the one recovery mechanism you already need (dead-holder → receipt conversion on next acquisition) is what resolves it too. Ideally the same process retries the write in a loop before giving up the lock, since it already holds the context; if it gives up (crashes, is killed), the next acquirer's mandatory reconciliation step picks it up. One failure, one recovery path, no bespoke handling.

## The independent test

Property to prove, checked as a black box against the boundary's public interface only (so it survives internal refactors of gateway vs. composition root):

> Never observe: lock free **and** an unresolved mutation with no durable record of its outcome.

Test shape:
- Two *real separate OS processes* (not mocked/in-thread) contending for the same lock/receipt store — this exercises actual cross-process file/DB locking, not a simulation of it.
- Force termination (`kill -9`) at each transition boundary in turn: after acquire, after perform-but-before-record, after record-but-before-release, and during the record write itself (e.g. make the receipt store unwritable to force that failure path).
- After each kill, run startup recovery, then let a second process attempt a fresh mutation.
- Assert the second process is blocked until the first's outcome is reconciled, and that the remote system never shows the mutation applied more than once for that logical operation.

This is the regression test that fails immediately if someone reintroduces a second owner or reopens a gap between release and record — which is exactly the failure mode being ruled out here.

One caveat from the constraints you're working under: only split lock-ownership from receipt-ownership again if you get a substrate that can atomically hold both in one transaction — then the atomicity comes from the substrate, not from this ordering discipline, and splitting back into two calls is safe.
