## Where the bug actually lives

Both races have the same root cause: the invariant *"a mutation outcome is always covered by exactly one of {lock, receipt}"* is currently maintained by **two separate owners** (composition root and gateway) taking turns, instead of by one owner across an atomic transition. Any handoff between owners is a window where the invariant can be false.

- Race 1: lock released (gateway) → gap → receipt recorded (composition root). A process that starts in the gap sees *no lock* and *no receipt* and re-runs the mutation.
- Race 2: dead holder → receipt is a separate "startup" concern, not part of lock acquisition itself. A concurrent acquire can succeed *before* that conversion lands, again seeing *no lock* and *no receipt*.

Adding a coordinator doesn't fix this — it just adds a third owner and a third handoff. Repeating checks in every feature doesn't fix it either — it multiplies the number of places that can race instead of removing the race.

## The smallest ownership change

**Fold the receipt into the lock's own state machine, and make the gateway the sole owner of both.** The lock isn't just a mutex — it's the *not-yet-durable* form of "outcome unknown," and the receipt is its *durable* form. One owner, one resource, one set of legal transitions:

```
Free ──acquire──▶ Locked(holder)
Locked(holder) ──success/known-failure──▶ Free
Locked(holder) ──unknown outcome──▶ Receipted(holder) ──(ack)──▶ Free
Locked(dead holder) ──acquire attempt──▶ [convert to Receipted first] ──▶ Free ──▶ Locked(new)
```

Concretely:

- **Release-with-uncertainty and receipt-write become one critical section owned by the gateway.** The gateway never releases the lock as a bare step; it releases *only* by transitioning through "write receipt if outcome is unknown" first. "Record an unknown result when needed" moves out of the composition root and into the tail of the gateway's own critical section, before the unlock. This closes race 1: there's no longer a state where the lock is free and the outcome is undetermined with nothing recorded.
- **Dead-holder → receipt conversion becomes part of acquire itself, not a separate startup task.** Acquiring the lock must first check "is the current holder dead?" and if so, convert it to a receipt *as a precondition of the acquire succeeding*, in the same critical section. This closes race 2: a new mutation literally cannot acquire the lock while a dead holder's conversion is outstanding, because acquire *is* the thing doing the conversion.
- **Composition root shrinks to a pure caller-side guard**: check for an outstanding receipt before calling the gateway at all. It no longer participates in maintaining the invariant — it only consults it. That's the ownership change: move invariant maintenance entirely inside the gateway; leave the composition root with read-only awareness.

No new component, no duplicated logic per feature — just narrowing the invariant's ownership to the one component that already brackets both ends of it (it already opens the lock; make it also close it correctly).

## Failure path: recording the receipt itself fails

This is the case that proves the design is right: **the gateway must fail closed — it must not release the lock if writing the receipt fails.** Releasing on a failed receipt write recreates exactly the unsafe state (no lock, no receipt, unknown outcome). So:

1. Remote mutation completes with an unknown/ambiguous outcome.
2. Gateway attempts to write the receipt. Write fails (disk full, store unavailable, etc.).
3. Gateway does **not** release the lock. It either retries the receipt write while still holding the lock, or the process dies while still holding it.
4. Either way, the lock (with holder identity + enough context to reconstruct the receipt) persists durably. On the next relevant acquire attempt (by any process), the dead-holder-conversion step in acquire retries the receipt write as a precondition of granting the lock.

So the retry path for "receipt write failed" and the recovery path for "process died holding the lock" are the *same* mechanism, not two — another sign this is the right ownership boundary rather than a patch.

## The independent test that proves it

The bug is in the seam between owners, so a test of either owner in isolation (gateway unit test, composition-root unit test) can't catch it — both look correct alone. The test has to target the boundary directly:

**Invariant-based fault injection ("crash test"):** define the single invariant
`NOT (lock is free AND outcome is undetermined AND no receipt exists for that mutation)`
and assert it holds after recovery, for a fault injected at *every* observable point in the sequence:

- crash after acquire, before remote call
- crash after remote call, before receipt write
- crash after receipt write, before lock release
- receipt-store write forced to fail (mocked), assert lock is still held afterward and a concurrent acquire attempt for the same key blocks/fails
- two concurrent callers: A holds the lock and is killed mid-mutation; B starts concurrently — assert B cannot acquire until A's holder is converted to a receipt, and assert the remote mutation is invoked at most once across A and B combined

Run this as a property test that enumerates crash points rather than one example, and drive it through the gateway's public acquire/release surface only (not internals) — since what's being verified is the externally-observable ownership boundary, not an implementation detail.
