This is a self-contained design exercise (no codebase to modify — `run/` is just the harness). Here is the plan.

## Root cause

Both observed races are one structural flaw, not two. The receipt's lifecycle is **split across owners** and the durable write happens **after** the lock is released, **outside** the locked scope:

- Race 1: between `gateway: release lock` (4) and `composition root: record receipt` (5), a second process passes its own `check receipt` (1) and reapplies.
- Race 2: the new process's `check receipt` (1) can run before startup's dead-holder→receipt conversion finishes.

The invariant that must hold is: *every performed mutation is covered by a durable receipt, or by a held lock that is guaranteed to become one, and the receipt is read/claimed before any mutation.*

## Smallest ownership change

**Collapse the three owners into one idempotency guard.** Move steps 1 and 5 out of the composition root and into the gateway, and reorder so the receipt is written **inside** the lock, **before** release. The composition root stops touching the lock or receipt entirely.

```
guard.startup():                         # one owner, prerequisite phase
  for each dead lock holder: convert to uncertainty receipt

guard.run(mutation):
  acquire lock
  receipt = read receipt(mutation.id)     # check now inside the lock
  if receipt.resolved: return result      # never reapply
  if receipt.unknown:  resolve via reconciliation, then return
  perform remote mutation
  write receipt durably                   # BEFORE release, same owner
  release lock
```

Change in one line: *the gateway owns the receipt read and write, does the write under the lock before releasing it, and owns startup recovery; the composition root only delegates.*

Why this beats the rejected proposals: a fourth coordinator still leaves the record-after-release gap; "every feature repeats the checks" copies the invariant into N call sites — the gap is structural, not a missing check. This is a two-step relocation plus an ordering swap, no new component.

## Failure path: recording uncertainty itself fails

After the remote mutation returns but the durable receipt write fails:
- **Do not release the lock.** The guard keeps the lock held and aborts (or retries the write until durable).
- The retained lock becomes a dead holder; on next `guard.startup()` it is converted into an uncertainty receipt.
- A later `guard.run` sees the receipt as *unknown*, does **not** reapply, and resolves via reconciliation (e.g. query remote for the actual result).

Net invariant: *a performed mutation is always covered by a durable receipt **or** a held lock that will become one.* Failure of the write degrades to the dead-holder recovery path — never to a double-apply.

## Independent test proving the boundary

A **crash-recovery test** at the dangerous instant:
1. Run `guard.run(mutation)`; let the remote mutation commit but **crash the process before the receipt is durable** (lock still held, no receipt).
2. Restart. Assert `guard.startup()` converts the dead holder into a receipt.
3. Assert the mutation was applied **exactly once** — the guard refuses to reapply and instead reconciles.

This isolates the ordering invariant (durable receipt must precede lock release / cover the mutation) from the happy path. Under the old split-owner, record-after-release design, the same crash leaves the reapply window open and the test fails; under the consolidated guard it passes — that contrast is what proves the boundary.

A second, narrower test pins the failure path: force the receipt write to fail while the lock is held, assert the lock is *not* released, simulate restart, and assert conversion-to-receipt plus no second application.
