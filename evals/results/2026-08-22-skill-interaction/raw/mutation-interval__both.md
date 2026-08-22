## The ownership change

The bug isn't missing locking or missing receipts — it's that the four operations that make up the safety claim (`check receipt → acquire lock → mutate → record unknown result`) are split across two owners (composition root, gateway) with **release ordered before record**. That gap is exactly where both races live. Nothing needs a new coordinator; the existing lock owner just needs to own the whole interval.

**Merge the lock and the receipt into one mutation boundary**, owned by the gateway (the only party that already knows whether the remote call's outcome is known or unknown), and fix the internal ordering:

```text
mutation boundary (single owner):
  check outstanding receipt          — refuse if one exists
  acquire lock
    if existing holder is dead: convert it to a receipt first, then acquire
  perform remote mutation
  if outcome is not definitively safe: record receipt   ← before release, same critical section
  release lock                                            ← only after the line above succeeds or wasn't needed
```

This is a reordering + consolidation, not new machinery:

- **Race 1 closes** because release is now *gated on* record, not concurrent with it. There is no instant at which the lock is free and the outcome is unrecorded — that state is no longer reachable, not just less likely.
- **Race 2 closes** because dead-holder→receipt conversion is folded into `acquire`, not left as a separate startup step. A new mutation cannot acquire the lock at all until any dead holder's uncertain effect has been durably converted to a receipt. "Acquire" and "convert" become the same atomic precondition.

Every mutating command calls this one boundary — nobody re-implements the check/acquire/record sequence, so "make every feature repeat the checks" is avoided, and no second coordinator is introduced.

## Failure path: recording uncertainty fails

If the receipt write itself fails, **do not release the lock**. Releasing without a recorded receipt recreates the exact unsafe state this change removes. Correct behavior:

- Keep the lock held, propagate the error to the caller (non-zero exit).
- Do not retry the record indefinitely inline — let the held lock be the durable signal that something is unresolved.
- On the next process start (this one restarting, or a competing one), the dead-holder-to-receipt conversion in `acquire` finds this lock, sees the holder is gone, and retries the conversion to a receipt before anything can proceed.

So a failed record degrades to "stuck lock," never to "silently released lock" — the invariant (`no new mutation while any effect is unknown`) survives even a double failure, at the cost of availability, not safety.

## Independent test

Prove this at the process boundary, not the implementation: spawn real competing OS processes against a shared lock/receipt store and force termination (`SIGKILL`) at each transition point defined above, then assert on observable state only (lock file contents, receipt store, count of remote mutation calls):

1. Kill process A right after `acquire`, before it ever calls mutate. Start B: B must perform the dead-holder→receipt conversion before it can acquire, and the remote mutation call count stays at the pre-kill value until that conversion is durably persisted.
2. Kill A right after mutate, before record. Start B: B must find either a receipt or a still-held (dead) lock — never "lock free and no receipt." B must not issue a second remote mutation.
3. Kill A right after record, before release. Start B: B finds the receipt via the dead-holder path or the normal check, and correctly refuses to mutate.

Each case is checked from outside the boundary (subprocess exit codes, files on disk, mutation-call counter) — the test would fail against the old three-owner sequence and pass against the merged boundary, which is what distinguishes "closed the race" from "made it less likely."
