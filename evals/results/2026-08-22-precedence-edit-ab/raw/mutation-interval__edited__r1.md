I don't have permission to write `answer.md`, so here's the analysis directly.

## Diagnosis

The sequence has two owners doing four operations that must behave as one:

```text
composition root: check outstanding receipt
gateway:          acquire lock
gateway:          perform remote mutation
gateway:          release lock
composition root: record an unknown result when needed
```

`release lock` and `record an unknown result` are separate steps, owned by two different parties, with a boundary crossing between them. The lock is what currently stands in for "an effect might still be unresolved," but it gets dropped *before* the receipt it was standing in for is durably written. That gap is race 1.

Race 2 is the same shape at startup: a dead holder's lock is evidence of a mutation whose outcome is unknown, but nothing stops a new mutation from acquiring that freed lock before the dead holder's uncertainty has been converted into a receipt.

Both races exist because the invariant ("no new mutation while any prior effect is unknown") is enforced by two resources — lock and receipt — updated at different times by different owners. The lock can say "free" for a moment in which the receipt store still says "nothing to see here," and that moment is exploitable.

## The ownership change

Don't add a coordinator (a third party is a third thing that can observe a gap) and don't push checks into every feature (that repeats the invariant instead of owning it). Collapse the four operations into the one owner that already holds the lock and talks to the remote system — the gateway — and fix the order so release is never the second-to-last step:

```text
gateway: check outstanding receipt   (including: convert a dead holder's lock into a receipt)
gateway: acquire lock
gateway: perform remote mutation
gateway: record an unknown result when needed   -- durably, before releasing
gateway: release lock
```

Two changes, both inside the existing shared mutation boundary:

1. **Reorder**: record-if-unknown moves before release-lock, and both move under the same owner. The lock is never dropped while an effect's outcome is unrecorded, because dropping it is now the last step, conditioned on the recording having succeeded.
2. **Fold dead-holder conversion into acquisition**: a lock whose holder is dead is not "free," it's unresolved. Acquiring converts that state into a receipt as part of the same critical section that decides the lock is available. A new mutation can't observe "lock free" without the previous holder's uncertainty already having been forced into a receipt.

The composition root no longer independently checks or records anything; it calls one gateway operation and gets back an outcome (applied / refused-outstanding-receipt / error). This is the same "one shared mutation boundary used by every mutating command" already named as the ordinary path — the fix makes that boundary actually own all four steps instead of leaking two of them to the composition root.

## Failure path: recording uncertainty fails

Release stays conditioned on the record succeeding:

- Process still alive: hard failure, **do not release the lock**, surface the error. Releasing without a receipt reopens race 1's exact window.
- Process dies here: the lock is left held by a now-dead holder — this is just race 2's state. No new mechanism needed; the next acquisition's dead-holder-to-receipt conversion turns this stuck lock into a receipt before anything new can proceed.

So "recording failed and the process died" isn't a new failure mode — it's absorbed by the dead-holder conversion race 2 already requires. One mechanism, two triggers.

## The independent test

Drive real, separate CLI processes against the same lock and receipt store — not in-process calls — and SIGKILL at each boundary transition: after acquire, after mutate, after record-before-release, mid dead-holder conversion. After each kill, start a fresh process and let it run to completion.

Assert from outside the process (remote call count, on-disk receipt contents): the mutation is applied at most once across the whole run, and no fresh process ever mutates while a prior effect's outcome is unrecorded. Because the test observes only the remote side's call count and the receipt store — never internal function calls — it proves the external safety claim rather than just exercising the current implementation.
