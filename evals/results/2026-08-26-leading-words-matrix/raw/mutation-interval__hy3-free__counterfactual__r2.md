Let me look at the working directory to understand whether there's actual code behind this or it's a design exercise.This is a design exercise (no code to modify); `SIMPLE.md` already states the answer's shape. Here's the plan.

## Diagnosis

The invariant ("at most one active mutation; no new mutation while any prior effect is unknown") spans four operations that are split across three owners, with **two gaps**:

- The lock is released *before* the uncertainty receipt is recorded (race 1).
- The lock is force-released on death *before* the dead holder becomes a receipt (race 2).

In both gaps, there is a moment where **neither** guard (lock held, nor receipt present) is true. That is the double-apply window. Adding a third coordinator or duplicating checks everywhere just adds more gaps; it doesn't remove these.

## Smallest ownership change

Make the **lock owner the single owner of all four operations** (check, acquire, mutate, record) *plus* startup recovery. Do not add a component — collapse the split. `SIMPLE.md` already licenses this: *"Split the interval only if one transactional substrate atomically owns lock and uncertainty state."* So the fix is the inverse — **unsplit** so one owner atomically owns lock + uncertainty state.

New sequence, all owned by the gateway/mutation-owner:

```text
mutation owner:
  acquire lock
  check outstanding receipt        (authoritative check, now inside the lock)
  perform remote mutation
  durably record unknown result    (before release, under the lock)
  release lock

startup recovery (same owner, before serving any new mutation):
  convert any dead lock holder into an uncertainty receipt (durably), then proceed
```

The composition root stops checking/recording independently; it just calls the single owner. This eliminates both races:
- Race 1: receipt is recorded *before* release, under the same owner that holds the lock — no post-release gap.
- Race 2: recovery runs in the same owner that owns the lock, completes the dead→receipt conversion before any new mutation can acquire — no pre-conversion gap.

## Failure path: recording uncertainty itself fails

After the remote mutation returns (applied or unknown) but the **durable** receipt write fails (IO/fsync/disk), the rule is: **do not release the lock.** Releasing would reopen race 1. So:

1. Retry the durable write; if it cannot succeed, **crash/exit without releasing the lock**, leaving a "dead holder."
2. On restart, the *same* startup recovery converts the dead holder into a receipt (the race-2 handler), which is exactly the uncertainty record we failed to write.
3. If recovery *also* cannot write the receipt, it must **refuse to start new mutations** (stay blocked) rather than proceed — preserving "no new mutation while any effect is unknown" at the cost of liveness, which is the correct safety trade.

Net: a receipt-write failure degrades into "dead holder," which the existing recovery captures. Safety holds; only availability is lost.

## Independent test that proves the boundary

Black-box, using real competing processes and forced termination at the seam (per `SIMPLE.md` Proof), designed to **flip outcome** when the ordering changes:

- **Race-1 boundary test:** launch a mutation, and at the exact seam — remote mutation returned, lock still held, receipt *not yet durable* — start a second process attempting the same mutation id. Assert the second process performs **zero** remote mutations. Under the bug the lock is already released and the duplicate runs; under the fix it is blocked. This is the discriminating test.
- **Race-2 boundary test:** kill the process while it holds the lock and before any receipt exists; restart and attempt the same id; assert the dead holder was converted to a receipt and the new mutation is blocked until that conversion is durable.

The first test is the one that *proves the boundary*: it fails on the current split ownership and passes once the lock and receipt are owned atomically.
