I've written up the fix — here's the summary directly since the file write wasn't permitted:

## The ownership change

Move "check outstanding receipt" and "record an unknown result" out of the composition root and into the gateway, so the single existing lock owner also owns the receipt. Don't add a fourth owner (coordinator) and don't push checks into every command — collapse all four operations into the one owner that already sits on the one shared mutation boundary every command goes through:

```text
gateway.runMutation():
  1. acquire lock
       - if the held lock belongs to a dead process, convert it to an
         uncertainty receipt as part of taking the lock, before it's
         considered free
  2. check outstanding receipt; refuse to start if one exists
  3. perform remote mutation
  4. if outcome is unknown, record the receipt
  5. release lock
```

Two ordering rules do the real work:
- **Release only after record succeeds** (or record determines no receipt is needed) — closes race 1, since there's no longer a gap between separate owners' release and record steps.
- **Dead-holder conversion lives inside acquire**, not as a separate startup task — closes race 2, since a new mutation can't get the lock without first resolving what the previous holder left behind.

For this to work, the lock must carry the in-flight mutation's identity at acquire time, so a dead holder can be converted into a correct receipt from the lock's own payload even if the original process never reached step 4.

## Failure path: recording uncertainty fails

Don't release — keep the lock held and retry the write. The lock now stands in for the receipt: while held, no new mutation can start, so the invariant holds even without a written receipt yet. If the process dies mid-retry, the lock becomes a dead holder, and step 1's conversion produces the receipt from the lock's recorded intent on the next acquire. The uncertainty is always covered by either the lock or the receipt, never by neither.

## Why not the two proposed fixes

- A **new coordinator** is a fifth thing that must agree with the lock and receipt about who won — the same race, one level up.
- **Repeating checks per feature** means one missed copy reopens both races. Put the rule once, in the shared boundary.

## Independent test

Run real, separate OS processes against the same durable lock/receipt store. Force-kill process A (SIGKILL) at each boundary transition — after acquire, after remote call sent, after response received but before record, after record but before release — and immediately attempt to start process B after each kill. Assert B never issues the remote mutation while the lock is held or a receipt is outstanding, and that a fake remote endpoint's invocation count for that logical mutation never exceeds 1 across the whole sequence. This proves the externally observable guarantee (one remote effect) rather than the internal call order.

Would you like me to retry writing this into `answer.md`?
