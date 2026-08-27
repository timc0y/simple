I'll explore the codebase to understand the current mutation lock implementation and identify the ownership gap.This is a distributed systems design problem. Based on the prompt and SIMPLE.md, I can analyze the ownership gap and propose the minimal fix.

## Analysis

**Current ownership split creates two gaps:**

| Gap | Race |
|-----|------|
| Lock released → receipt recorded | New process starts before unknown result is recorded |
| Dead holder → receipt conversion | New mutation starts before dead holder becomes a receipt |

**The invariant spans 4 operations across 3 owners**, which is the root cause. The lock owner (gateway) doesn't own the uncertainty receipt lifecycle.

## Proposed smallest ownership change

**Move receipt recording inside the lock boundary.** Make the gateway the single owner of the entire mutation interval:

```
gateway: check outstanding receipt          (was: composition root)
gateway: acquire lock
gateway: perform remote mutation
gateway: record unknown result if needed    (was: composition root)
gateway: release lock
```

This collapses the invariant to one owner. No gap exists between lock release and recording because recording happens before release.

**Failure path when recording uncertainty itself fails:**
- Do NOT release the lock. The mutation is indeterminate.
- Persist the recording failure as part of the lock state.
- On next startup, detect the held lock with failed recording → convert to uncertainty receipt before any new mutation proceeds.

**Independent test to prove the boundary:**
- Run N competing CLI processes with `SIGKILL` forced at each of the 4 boundary transitions (check, acquire, record, release).
- Assert: at most one successful remote mutation per interval, and no new mutation starts while any prior effect is unknown.

## Question

Do you want me to write this as a concrete implementation plan with file-level changes, or is this analysis sufficient for your purposes?
