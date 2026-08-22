I don't have write permission for that file, so here's the design directly.

## Diagnosis

The invariant — "at most one active mutation" and "no new mutation while a prior effect is unknown" — is a property of five touch points: check receipt, dead-holder reconciliation, acquire lock, release lock, record receipt. They're currently split across two owners: the gateway owns the lock; the composition root owns the receipt. That split is the bug — nothing atomically ties "the lock is free" to "the receipt reflects the truth." A third coordinator would add a third owner to keep in sync, making this worse. Repeating the checks in every feature would just copy the same race into every call site.

## The ownership change

Give the lock owner (the gateway) the receipt too. It already owns acquire/release; extend it to own check, reconciliation, and record, and collapse all five steps into the gateway's only entry point for mutating — call it `withMutation`:

```text
gateway.withMutation:
  reconcile: if the current holder is dead, convert it to a receipt first
  refuse to start if a receipt is outstanding (including one just reconciled)
  acquire the lock
  perform the remote mutation
  resolve: write success (clear) or unknown (receipt) — before release
  release the lock
```

Composition root and every feature call this one method and stop touching the lock or receipt directly. This is a move, not an addition — no new component appears — and it matches the repo's own ordinary path: one shared mutation boundary for every mutating command.

## Why this closes both races

**Race 1** (starts after release, before the unknown result is recorded): resolve now happens-before release, unconditionally. There's no state where the lock is free and the outcome is unrecorded, because release is the last step, not one the composition root can race independently.

**Race 2** (starts before a dead holder is converted): reconciliation is now a mandatory precondition of acquire, done by the same owner that grants the lock — not a best-effort startup task on its own schedule. A new mutation can't acquire the lock without first resolving whatever the previous holder left behind, because reconciliation and acquisition are one atomic step.

## Failure path: recording uncertainty fails

If the receipt write itself fails, do not release the lock. Hold it, retry the write, surface the error. The held lock is the same fallback that already covers a crashed process — "recording failed" and "the process died before recording" look identical from outside and are handled by the same mechanism: the next acquisition's mandatory reconciliation. If reconciliation also can't durably write a receipt, acquisition must fail rather than proceed. The property degrades to "can't start a new mutation," never to "silently double-applied."

## Independent test

Run the CLI as two real, separate OS processes against a stub remote endpoint that counts invocations — not an in-process mock of the lock or receipt. Drive process A to each boundary transition in turn (after acquire; after the remote call but before resolve; after resolve but before release; mid-reconciliation) and SIGKILL it there, then start process B. Across every kill point, assert:

- the stub's invocation count never exceeds one commit per logical mutation
- process B never begins while A's effect is unresolved
- a run left unknown blocks all later attempts until reconciled

Killing a real process and counting a real external call proves the boundary itself, not just the code that implements it.
