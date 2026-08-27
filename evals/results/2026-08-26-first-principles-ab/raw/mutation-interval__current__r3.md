## The ownership problem

Right now the invariant ("no second mutation while a prior effect is unknown") is enforced by two different owners touching two different pieces of state, with a gap between them:

- **Race 1** exists because the gateway releases the lock and the composition root records the receipt as separate steps by separate owners. Between "lock released" and "receipt recorded," the lock looks free and the receipt store looks clean — a second process sees a green light that shouldn't exist yet.
- **Race 2** exists for the identical reason at startup: converting a dead holder into a receipt is a separate step from making the lock available again, owned by whoever runs startup recovery, not by whoever grants the lock. A new process can acquire the lock before that conversion lands.

Both races are the same bug: **the lock and the receipt are supposed to move together, but no single owner holds both.**

## The smallest change

Collapse the four operations — check receipt, acquire lock (including dead-holder conversion), mutate, record-unknown-and-release — into one owner: a single mutation boundary that owns *both* the lock and the receipt store, not just the lock. Every mutating command goes through it; nothing else touches the lock or the receipt directly. Its guarded sequence:

1. On acquire, first resolve any stale lock: if the holder is dead, convert it to a receipt *as part of acquiring* — not as a separate startup step that a new acquire can race past. Acquisition doesn't succeed until this resolves.
2. Refuse to proceed if an outstanding receipt exists.
3. Acquire, run the mutation.
4. If the outcome is unknown, **record the receipt before releasing the lock** — same critical section, same owner. The lock is the thing that makes the receipt-write and the release atomic with respect to any competitor; releasing early is exactly what created race 1.

This isn't a fourth coordinator — it's fewer owners than today (one instead of two), and it's the "one shared mutation boundary" every command already needs to call anyway. Adding a coordinator would just relocate the gap to between the coordinator's decision and the gateway's action. Repeating the checks in every feature duplicates policy that a future command will inevitably forget.

## Failure path: recording uncertainty fails

If the receipt write itself fails (disk full, I/O error), **do not release the lock.** Releasing it here is worse than the crash you're guarding against — it reopens race 1 deliberately. Let the process fail loudly and exit while still holding the lock. The next startup's dead-holder-to-receipt conversion is the retry mechanism — it's the same code path already required for race 2, reused rather than duplicated. That path must itself refuse to hand out the lock until conversion succeeds, so a repeated failure blocks new mutations rather than silently permitting one.

## Independent proof

Test through the CLI process boundary, not the internal functions — calling `checkReceipt()`/`acquire()`/`record()` directly only proves the functions are correct, not that the boundary is atomic under a real crash. Spawn real OS processes running the actual binary, SIGKILL at each transition point (mid-mutate, after-mutate-before-record, after-record-before-release, mid-startup-conversion), then start a fresh process and observe from outside: count actual calls hitting a fake remote endpoint. The property to hold across every kill point, over many trials: **the remote endpoint never sees a second call while the first call's outcome is unrecorded**, and lock/receipt files always converge to a consistent state afterward.
