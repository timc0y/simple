# The lock with two open doors

## The actual defect

The invariant ("at most one active mutation" + "no new mutation while any prior
effect is unknown") spans four operations, but no single owner executes all four.
The composition root owns receipt-check and receipt-record; the gateway owns
lock-acquire, mutation, and lock-release. Because ownership is split, the lock can
be released before the receipt is written, and a second process can walk in through
the gap. Both observed races are the same defect, not two defects: an owner boundary
that stops short of the interval it's supposed to protect.

Adding a second coordinator would create a second thing that must agree with the
lock about who's allowed to proceed — a new race, not a fix. Repeating the checks in
every feature duplicates the invariant across call sites instead of enforcing it
once, and the profile already commits to one shared mutation boundary. Neither
proposal removes the gap; both add machinery around it.

## The ownership change

Give the existing lock owner (the gateway, or a thin boundary it exposes) the
receipt check and the receipt record too, so the whole interval — check/convert,
acquire, mutate, record, release — runs as one owner's uninterrupted sequence, and
reorder release to come last:

```text
mutation boundary (single owner):
  1. inspect the lock: if the holder is dead, convert it into an uncertainty
     receipt as part of this same step, before anyone can acquire
  2. if a receipt exists (just converted or already outstanding), refuse the
     new mutation and surface the receipt
  3. acquire the lock
  4. perform the remote mutation
  5. determine the outcome; if unknown, record the receipt
  6. release the lock only after step 5 has completed
```

No new component is introduced. The gateway already touches the lock and the
mutation; it's the only owner that can see both ends of the interval, so it's the
one that should be accountable for the whole thing. The composition root stops
performing steps that belong to the boundary it's calling.

## Why this closes both races

- **Race 1 (start after release, before recording):** release moves to the end of
  the sequence and is now conditioned on step 5 having finished. There is no longer
  a state where the lock is free but the outcome is still unrecorded — those two
  facts change together, under the same owner, so no other process can observe the
  lock as free while an effect is unknown.
- **Race 2 (new mutation before a dead holder becomes a receipt):** the dead-holder
  conversion is folded into the acquire step itself rather than left as a separate
  startup task. Any attempt to acquire — at startup or mid-run — must pass through
  the same check-and-convert code path first. A racing acquirer cannot get ahead of
  the conversion because the conversion is what acquiring means now, not a thing
  that happens before acquiring gets a chance to run.

## Failure path: recording uncertainty fails

If step 5 (record the receipt) itself fails, the boundary must not proceed to
release — releasing without a durable receipt reopens exactly the gap this change
closes. So on a record failure: keep the lock held, retry or surface the failure to
the caller, and do not release. If the process dies here instead of retrying
successfully, the lock is now held by a dead process — which is precisely the state
step 1 already knows how to recover: the next acquirer detects the dead holder and
converts it into a receipt before proceeding. The crash-during-record path and the
startup dead-holder path are the same mechanism; no separate failure machinery is
needed.

## Independent test

Exercise real competing processes with forced termination at each transition named
above, against a fake remote endpoint that counts applications and an idempotency
key so a duplicate is observable:

1. Start a mutation; kill the process after step 3 (acquire) but before step 4
   (mutate). Start a second process: it must see the dead holder, convert it to a
   receipt, and refuse to mutate.
2. Start a mutation; let it mutate, then kill the process after step 4 but before
   step 5 (record). Start a second process: it must detect the dead holder,
   convert it to a receipt, and refuse to mutate — not attempt a second call to the
   remote endpoint.
3. Start a mutation; kill the process after step 5 (record) but before step 6
   (release). Start a second process: it must see the outstanding receipt directly
   and refuse.
4. Force the record call itself to fail without killing the process; assert the
   lock is still held and a second process cannot acquire it.

Across all four, assert on the fake endpoint's call count (at most one application
per attempted mutation) and on the receipt store's final state — not on which
internal function ran. That proves the boundary from outside: the safety claim
holds under real concurrency and real termination, independent of how the interval
is implemented inside the gateway.
