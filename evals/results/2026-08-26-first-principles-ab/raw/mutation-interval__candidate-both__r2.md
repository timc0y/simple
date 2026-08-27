## Root cause

The invariant — *at most one active mutation, and no new mutation while a prior effect is unknown* — has to hold across four steps, but those steps are owned by two different components. The composition root owns the receipt (check it, record it); the gateway owns the lock (acquire it, release it). Ownership hands off twice, and each handoff is an open door:

- **Door 1**: gateway releases the lock, then hands back to the composition root to record an unknown result. Between those two lines, the lock looks free and no receipt exists yet — a second process can walk straight through.
- **Door 2**: on startup, a dead lock holder needs converting into a receipt before anyone can trust the lock as free. If that conversion is a separate step from acquiring the lock, a new mutation can start in the gap between "lock looks stale" and "receipt for the stale holder exists."

Both are the same bug: the lock is being treated as free before the outcome it was guarding is durably known. Splitting ownership is what created the gap — nothing else needs to change.

## The ownership change

Fold receipt-checking and receipt-recording into the gateway, so the gateway is the sole owner of the whole boundary: check receipt → acquire lock (which *includes* converting any dead holder to a receipt as part of what "acquire" means) → mutate → record outcome (success, failure, or unknown) → release lock. The composition root stops touching the lock or the receipt at all; it just calls the gateway's mutation boundary. That boundary already exists ("one shared mutation boundary is used by every mutating command" per SIMPLE.md) — this isn't a new component, it's widening what the existing owner is responsible for.

The one rule that closes both doors: **the lock may not be released until the outcome is durably recorded, and dead-holder conversion happens as part of acquiring the lock, not before or after it.** Concretely, release is never called except immediately after a successful receipt write (or a successful "definitely didn't happen" / "definitely succeeded" write) — never on any other path, including exceptions. And "acquire" for a stale lock means: convert holder to a receipt first, and only then treat the lock as available. There is no state where an outside observer can see "lock free" and "outcome unknown" at the same time.

This also answers the two proposals on the table: a second coordinator isn't needed — there'd be nothing for it to own that the gateway doesn't already own once the boundary is widened — and repeating the checks per feature isn't needed either, since every mutating command already goes through this one boundary.

## Failure path: recording uncertainty fails

If the receipt write itself fails (disk full, process killed mid-write), the gateway must *not* release the lock. A held lock with no matching receipt is exactly the signal "outcome unknown" — it doesn't need a receipt to mean that as long as nothing ever treats a held lock as free without checking. Recovery is the same conversion step reused, not a new one: whichever process next attempts to acquire that lock (this one retrying, or a fresh process on next startup) finds a holder, treats it as unknown, and retries the receipt write before it's allowed to proceed. If that retry also fails, the lock simply stays held and mutation stays blocked — safe (unavailable) rather than unsafe (duplicated). No feature-level code needs to know this happened.

## Independent test

Don't test the call sequence — test what an outside process can observe. Run real competing OS processes against the actual remote system (or a faithful fake with an idempotency counter), and for every transition point in the sequence (after acquire, after mutate, after receipt write, after release, and during dead-holder conversion at startup) SIGKILL the active process there, then immediately start a second, independent process. Assert two things from outside, never from internal state: the remote mutation count never exceeds 1 per logical operation, and there is never an observed instant where the lock is free and no receipt/record accounts for the last attempt. Repeat across all transition points and with processes racing at each one — this proves the boundary holds under real concurrency and real termination, not just under the code's own assumptions about its ordering.
