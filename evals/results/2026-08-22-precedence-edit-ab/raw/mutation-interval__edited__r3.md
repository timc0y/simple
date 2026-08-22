## The fix: one owner, four steps in a fixed order

The bug isn't a missing lock or a missing receipt — it's that the four operations that together define "is this mutation's effect known" are split across two owners (composition root does check/record, gateway does lock/mutate), so no single actor can guarantee their order. **Move all four operations into the owner that already holds the lock** (the gateway / mutation boundary), and fix their order:

```text
mutation boundary (single owner):
  1. if lock is held by a dead process → convert it to an uncertainty receipt, durably, before continuing
  2. if an uncertainty receipt exists → refuse the new mutation
  3. acquire lock
  4. perform remote mutation
  5. if result is unknown → durably record the receipt
  6. release lock                         ← only after step 5 has committed
```

Step 5 before step 6 closes race 1: nothing can observe "lock free" while an unknown result is still unrecorded, because release no longer happens until the receipt (if needed) is on disk.

Step 1 before step 3 closes race 2: nothing can acquire the lock behind a dead holder until that holder has been turned into a receipt, because acquisition and conversion are sequenced in the same owner instead of racing across a startup path and a request path.

This is a reordering inside one owner, not a new owner. That's why it beats both proposals on the table:
- **A fourth coordinator** adds a new boundary between itself and the gateway — the exact kind of gap that caused the bug, just relocated.
- **Repeating the checks in every feature** duplicates the invariant instead of closing the interval, and breaks the existing "one shared mutation boundary for every mutating command" path.

SIMPLE.md's own reconsider-clause says splitting lock and receipt into separate owners is only safe if one transactional substrate atomically owns both — that's not true here, which is exactly why the split caused the bug and why the fix is to unsplit it, not add a third party.

## Failure path: recording the receipt fails

If step 5 fails (can't durably write the receipt), **do not release the lock**. The lock is the only thing currently marking "outcome unknown," so releasing it there recreates race 1 by another route. Surface the failure loudly (fail the command, keep the process's hold on the lock) and let the existing dead-holder path be the recovery: on next startup, once this process is gone, step 1 converts the still-held lock into the receipt that step 5 failed to write. The lock and the receipt are two encodings of the same "unknown" state, and the same owner already knows how to transition between them — no separate failure handler needed.

## Independent test

Per SIMPLE.md's proof requirement: exercise real competing OS processes with forced termination at each transition, and observe only external behavior (can a second mutation start?), never internal state.

- **Race 1:** run a real mutation, SIGKILL the process between step 5 and step 6 (inject a delay or fault point there). Immediately spawn a second process attempting a mutation. Assert it is refused — the lock must still be held or a receipt must exist; there must be no window where both are absent.
- **Race 2:** SIGKILL a process while it holds the lock but before any receipt exists (simulating a dead holder with truly unknown outcome). Concurrently start a new process attempting a mutation right at startup. Assert it is refused until the dead-holder→receipt conversion has completed — never observes a "clean" lock.

Both tests treat the CLI as a black box and never mock the lock or receipt store, so they prove the ordering guarantee itself rather than the code path that happens to implement it today.
