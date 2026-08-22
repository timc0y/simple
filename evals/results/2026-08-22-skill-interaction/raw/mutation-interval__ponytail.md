## The fix

The bug isn't the lock and it isn't the receipt — it's that **release** and **record** are two separate writes owned by two different components. Whenever a boundary is "acquire → do work → release" *and separately* "check/record outcome," there will always be a gap where the lock says "free" but the outcome is still unknown. Both observed races are that same gap, just entered from different doors (normal release vs. dead-holder cleanup).

**Ownership change:** give the gateway sole ownership of the whole boundary, and make the dead-holder case just another branch of "acquire" instead of a separate startup routine.

```text
gateway.runMutation():
    acquire lock                      # reclaiming a dead holder happens HERE:
                                       #   found dead holder with no receipt?
                                       #     -> write unknown-receipt for it, THEN proceed
                                       #   outstanding receipt exists?
                                       #     -> refuse to acquire, surface it
    perform remote mutation
    record outcome (success/failure/unknown)   # durable write, lock still held
    release lock                       # only reachable after the write above commits
```

The composition root no longer checks or records anything — it just calls the one boundary method. That's "one shared mutation boundary used by every mutating command," satisfied by construction instead of by convention every feature has to remember.

**Failure path (recording itself fails):** don't release. A held lock with no receipt is not a new failure mode — it's exactly the dead-holder state the acquire-time reclamation logic already handles. So on retry (same process) or on the next acquire attempt (any process, including after a crash), the existing reclamation branch fires: write the unknown-receipt first, then proceed. One failure path, reused, not a second mechanism.

Why this closes both races:
1. *Process starts after release, before recording* — can't happen anymore, because release is now downstream of the durable record write, not a sibling step.
2. *New mutation starts before dead holder is converted* — can't happen, because conversion is now a precondition of acquire, not a separate startup pass that a concurrent acquire could outrun.

**Independent test:** spawn two real OS processes contending for the same lock+receipt store; SIGKILL the holder at each of the three transition points (after acquire/before mutate, after mutate/before record, after record/before release). Assert, across many runs: never two mutation attempts overlap, and after every kill the next process to touch the boundary either finds a receipt or performs reclamation before it's allowed to mutate. That test is the proof — it exercises the boundary as a black box and would fail immediately under the old two-owner sequence.

Rejected alternatives, and why they're not smaller: a third coordinator adds a component whose entire job is re-deriving an invariant the gateway can just hold directly. Per-feature repeated checks means N places can each get the ordering wrong; one boundary method means there's only one place to get it right.
