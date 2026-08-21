# The smallest ownership change: one boundary owns the whole interval, not four operations split across two owners

## What's actually broken

Both races have the same root cause: the four operations that jointly enforce
"at most one active mutation, and no new mutation while any prior effect is
unknown" are split across two owners (composition root and gateway), and
across two boundaries (a startup step and a per-call step) that can interleave
with each other.

- Race 1 exists because **release** and **record-unknown** are two separate
  steps owned by two different components. The lock says "free" before the
  receipt says "unknown." Anything that only asks the lock has a window to
  start.
- Race 2 exists because **dead-holder conversion** is a separate startup
  action, not a precondition of acquiring the lock. A new mutation's acquire
  and the recovery scan race each other because nothing makes one wait for
  the other.

Adding a coordinator process doesn't fix this — it just adds a fifth owner
that itself needs to be consistent with the lock and the receipt, recreating
the same problem one level up. Repeating the checks in every feature doesn't
fix it either — it copies the same race into every call site instead of
closing it once.

## The change: fold the four operations into one owner with two calls

Give the mutation boundary (the "one shared mutation boundary" already used
by every mutating command) ownership of the lock *and* the receipt as a
single resource, exposed as exactly two operations: `begin()` and
`end(outcome)`. No new component, no new process — the existing shared
boundary absorbs the two checks and the two writes that composition root and
gateway currently do separately.

**`begin()`** — replaces "check receipt" + "acquire lock" + startup dead-holder scan:

1. If the current lock entry belongs to a holder that is no longer alive,
   convert it into an uncertainty receipt *before* acquisition can proceed.
   This is not a separate startup step; it is a mandatory, gated precondition
   inside `begin()` itself, so any process calling `begin()` — at startup or
   mid-session — forces the conversion to complete first. This closes race 2:
   there is no path to holding the lock that skips past an unconverted dead
   holder.
2. After that conversion (if any), check for an outstanding receipt. If one
   exists, `begin()` refuses — "blocked, unresolved effect," not "lock busy."
   This is the same check whether the receipt is old or was just created in
   step 1.
3. Only if no receipt exists does `begin()` return a held lock.

**`end(outcome)`** — replaces "perform mutation" + "release lock" + "record unknown result":

1. If `outcome` is unknown, durably write the uncertainty receipt.
2. Only after that write is confirmed does the lock get released.
3. If `outcome` is known-success or known-failure, no receipt is needed and
   the lock releases directly.

Release is now *conditioned on* resolution, not sequential with it. Nothing
can observe "lock free" while the outcome is unrecorded, because the
implementation never reaches release until the receipt exists. That closes
race 1 directly — not by making the recording faster, but by removing the
state ("lock free, receipt absent, outcome unknown") that the race depended
on.

Every mutating command still calls the same shared `begin()`/`end()`; the
sequencing rule lives once, inside the boundary, not once per feature.

## The failure path: recording uncertainty fails

This is the case the current design has no answer for, and it's the one that
matters most, because it's a failure inside the failure handler.

If the durable receipt write in `end()` cannot be completed (disk full, store
unreachable, process killed mid-write):

- The boundary must **not** release the lock. Releasing here recreates
  exactly race 1 — a free lock with no record of what happened.
- Retry the write with bounded backoff.
- If it still cannot be written, the process holding the lock exits without
  releasing it. The lock now names a holder that is either dead or about to
  become dead, with the outcome still unknown.
- This is not a new failure mode requiring new machinery: it is exactly the
  dead-holder case that `begin()` already handles. The next call to
  `begin()` — from this process restarting, or from any other process — hits
  step 1, finds a dead holder, and converts it into the receipt that couldn't
  be written before. The uncertainty is deferred, never dropped, and it is
  resolved by the same code path that handles ordinary crashes, not a second
  one.

The invariant this preserves: the lock is only ever released when the
outcome is either known or durably recorded as unknown. If that recording
can't happen now, the lock stays held until it can happen — even if "now" is
a later process's `begin()`.

## Why this doesn't need a shared transactional substrate

The two operations inside `begin()` and inside `end()` are ordered, not
atomic across the lock and the receipt store as separate systems — dead-
holder conversion happens *before* the receipt/lock check, and receipt write
happens *before* release. Sequencing inside a single owner is enough to
close both races without requiring the lock and the receipt to live in one
transactional store. That upgrade is worth doing only if a substrate already
provides atomic ownership of both; short of that, splitting the interval
further would just reopen the gap between two writes that this change closes
by making them one component's job, done in a fixed order.

## The independent test that proves it

Unit-testing `begin()`/`end()` in-process won't prove anything, because both
races are races between OS processes over durable, shared state (a lock file
and a receipt store) — a mock can't reproduce a window between "lock file
updated" and "receipt file updated" on disk.

The test has to be black-box and process-level:

1. Spawn real competing OS processes that each call `begin()` against the
   same durable lock and receipt store, with a fake gateway underneath that
   counts how many times the remote mutation is actually applied.
2. For each transition point in the boundary — after dead-holder conversion,
   after the receipt/lock check in `begin()`, after the mutation but before
   the receipt write in `end()`, after the receipt write but before release
   — force-kill the holder process at that exact point and immediately start
   a new competing process.
3. Assert two things across every run: the fake gateway's apply-count never
   exceeds what a single successful mutation would produce, and no competing
   process is ever granted `begin()` while a receipt from the killed process
   is outstanding.

This test is independent of the implementation of `begin()`/`end()` — it
only observes the lock file, the receipt store, and the gateway's apply
count from outside, so it proves the boundary's external contract rather
than its internal sequencing.
