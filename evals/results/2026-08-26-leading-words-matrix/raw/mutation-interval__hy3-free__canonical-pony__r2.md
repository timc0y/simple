This is a design problem, not a code-change task—there's no CLI source in this directory, just the SIMPLE framing. The deliverable is the design answer. Here is the plan.

## Diagnosis

The safety claim is the SIMPLE invariant: *at most one active mutation, and no new mutation while any prior effect is unknown*. Today that invariant is split across two durable things—the **lock** and the **uncertainty receipt**—owned by different components, with non-atomic handoffs:

- Race 1 window = between `gateway: release lock` and `composition root: record unknown`. A second process sees "lock free, no receipt" and mutates.
- Race 2 window = between "dead holder detected" and "converted to receipt." A new mutation starts into that gap.

Both windows exist because the lock state and the receipt state are separate records with no single atomic transition between them. The two rejected proposals (another coordinator, per-feature checks) don't remove the window—they add copies of it.

## Smallest ownership change

**Give the lock owner the receipt, and make the lock record and the uncertainty receipt the same durable record.** One move: composition root hands receipt *check*, *record*, and *dead-holder conversion* to the gateway (the owner of the mutation boundary). No new coordinator; no per-feature repetition. This matches SIMPLE.md's own rule: *"Split the interval only if one transactional substrate atomically owns lock and uncertainty state."*

Concretely, the durable record is now an **owned mutation record**:

- Acquiring the lock = durably writing a record `{holder, status: unresolved}`. This record *is* the outstanding receipt. The "check outstanding receipt" step becomes "is there an unresolved held record."
- Performing the remote mutation happens while holding it.
- Resolving = a single atomic write flipping the record to `resolved` **as the lock is released**. There is no release-without-resolution.
- A dead holder needs no separate conversion: its abandoned record is already an outstanding receipt. Startup just re-examines held records; it never opens a window.

New sequence (one owner, one record):

```text
gateway: acquire-or-fail (writes held+unresolved record = receipt)
gateway: perform remote mutation
gateway: atomically resolve record + release   // single durable write
```

The three-owner handoff collapses to one. Both race windows disappear: race 1 because release and resolution are one write; race 2 because the dead holder is already a receipt.

## Failure path when recording uncertainty fails

Since the record *is* the receipt, the only durable write needed before the mutation is the acquire write.

- **Acquire write fails** → never perform the mutation. Nothing applied, so nothing duplicated. Safe by abstention.
- **Resolve/release write fails** → fail **closed**: keep the record held and unresolved; do *not* release the lock. The next process sees a held unresolved record and reconciles (re-checks the remote, re-applies or confirms) instead of starting fresh. The mutation is at worst "unknown / possibly not applied," never "applied twice."
- **Crash before any write** → no record, no mutation. Safe.

The guarantee is asymmetric on purpose: the failure mode is *under-application or unknown*, never *over-application*. The lock record is the backstop—as long as it stays held, no second mutation can begin.

## Independent test that proves the boundary

A test that observes *external* effect, not internal flags (so it's independent of implementation):

1. Stand up two real competing processes against one durable store and a remote side that logs a mutation counter / idempotency keys.
2. **Race-1 boundary:** start mutation A, let it acquire + perform the remote mutation, then force-terminate A in the exact gap *after* its lock-release attempt but *before* its resolution write (fault-inject the resolve write to fail, or kill the process there). Immediately start B. Assert B does **not** apply a second effect—it must observe A's held/unresolved record and refuse (or reconcile) until resolved.
3. **Race-2 boundary:** pre-seed an abandoned held record with no separate converted receipt, then start a fresh mutation. Assert it refuses to start while that record exists.
4. Loop both cases thousands of times with randomized timing; assert the remote mutation counter never exceeds 1 per logical mutation.

The decisive assertion is purely external: *across the run, the remote effect is applied at most once.* That is the boundary proof—it fails under the current three-owner design and passes under the single-owner design.

---

If you have the actual CLI source somewhere, point me at it and I'll implement this as a concrete refactor (collapse the receipt into the lock record, move the checks into the gateway, and add the boundary test). Otherwise this stands as the design decision.
