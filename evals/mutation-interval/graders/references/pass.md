I don't have write permission for `answer.md` yet — I'll present the answer directly instead.

## Root cause

Two owners each hold half of one invariant. The gateway owns the lock's lifecycle (acquire/release); the composition root owns the receipt's lifecycle (check/record). "No new mutation while any prior effect is unknown" only holds if lock state and receipt state change together — nothing enforces that today. Lock release and receipt recording are two separate writes by two separate owners with an unguarded gap between them, and dead-holder reaping is a third write that isn't fenced by the same gate acquire uses. Both races are the same fault surfacing at two points: the lock reads as free before the receipt side has caught up.

## The ownership change

Fold receipt-check, dead-holder reaping, outcome-recording, and lock-release into the one owner that already acquires the lock — the gateway. Don't add a party; make the existing one own the whole interval:

- **Acquire**: if a holder record exists and is dead, reaping it into a durable receipt is part of acquiring. Acquisition doesn't succeed for anyone until that receipt write commits.
- **Release**: no longer follows "perform mutation" directly — it follows outcome resolution (real result committed, or an uncertainty receipt committed). The lock stays held across "perform mutation" through "resolve outcome."
- The composition root stops checking receipts and stops recording unknown results itself. It makes one boundary call, which either returns a result or refuses to run because a receipt is outstanding.

This is the "one shared mutation boundary" SIMPLE.md already names as the ordinary path — it wasn't actually singular, since part of it had leaked into the composition root. The fix is to stop splitting it, not to add a coordinator on top of the split.

## Why this closes both races

- **Race 1** (a process starts after release, before recording): release is now downstream of recording, never upstream — no window where the lock is free but the outcome unrecorded.
- **Race 2** (a mutation starts before a dead holder becomes a receipt): reaping is inside acquire itself, not a separate startup phase a competing acquire can outrun.

## Failure path: recording the receipt itself fails

If the write that records an unknown outcome (or a reaped dead-holder receipt) fails, the boundary must not release the lock. Fail closed: leave the holder record in place, return the error to the caller as a command failure, and let the existing reaping path retry the write on the next acquire. The holder record — which already exists to support reaping — is the fallback witness that the outcome is unknown until the receipt write lands. No new state is needed; it reuses the mechanism crash recovery already requires.

## Why not the two proposed fixes

A new coordinator adds a fourth party that must also agree on lock and receipt state — it relocates the seam instead of closing it, and brings its own crash-recovery problem. Repeating the checks in every feature duplicates the invariant across every mutating command, breaking the one-boundary ordinary path, and doesn't touch the actual gap, which sits in the gateway/composition-root handoff, not in any individual command.

## Independent test

Prove it with real competing OS processes and forced termination, per SIMPLE.md's existing proof method — not by mocking the lock or receipt store. Start one process performing a mutation and kill it (`kill -9`) in turn at each transition: mid-mutation, after the mutation call returns but before outcome resolution, after resolution but before release. After each kill, immediately start a second process attempting a new mutation. The assertion is the same at every kill point: the second process either fails to acquire the lock, or acquires it and finds an outstanding receipt and refuses to mutate. There must be no kill point at which the second process both acquires the lock and finds no receipt while the first mutation's outcome is unknown. Because the test only observes process-visible behavior, it proves the boundary independent of which component does the recording.

If you'd like this saved to `answer.md`, grant write permission (or approve the write) and I'll save it there.
