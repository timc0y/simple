Here's the analysis and the answer (I also attempted to save it to `answer.md`, but the write needs permission — let me know if you'd like me to try again).

## Ownership change

Give the lock owner (the gateway) ownership of the receipt too: checking it, converting a dead holder into one, and recording it. Composition root stops touching receipts directly and calls one gateway operation that covers the whole boundary. This isn't a new coordinator — it's deleting the seam between two owners who were both already touching the same invariant.

This is what SIMPLE.md already names as the defect: "the lock owner does not own receipt conversion, checking, or recording," while "the invariant spans all four operations." Both races are gaps at that seam, not gaps that need a fifth process watching the other four.

## The new ordinary path

One boundary, one owner, in this order:

```text
gateway: acquire lock
  - if a dead holder is found, convert it to a receipt as part of acquiring
  - if a receipt is outstanding (from this or the conversion above), refuse to acquire
gateway: perform remote mutation
gateway: record the result durably
  - known result: clear the interim state
  - unknown result: write the receipt
gateway: release lock   <- only after the record step is durably complete
```

Every mutating command calls this one operation; no feature repeats the check itself.

**Closes race 1** — the lock is never released until the receipt outcome is durably recorded, so there's no longer a moment where the lock is free but the receipt doesn't yet reflect what happened.

**Closes race 2** — dead-holder conversion happens as a precondition of granting the lock, inside the same acquire call, not as a separate startup step racing a fresh acquire. Resolving a dead holder is now part of what "acquire" means.

## Failure path: recording uncertainty fails

Don't release the lock — releasing on a failed write reopens the exact gap just closed. This is safe rather than a new stuck state because:

- The lock already carries "mutation attempted, outcome undetermined" the moment the remote call returns ambiguously, before the receipt write is attempted. The explicit receipt record is a durable promotion of state the lock already holds.
- If the process dies still holding the lock because the promotion never succeeded, the next acquire attempt hits the same dead-holder conversion built for race 2 — that's the retry path, not a second mechanism.

Bound the retries before giving up and exiting without releasing; don't build a separate recovery path for a failure the dead-holder conversion already handles.

## Independent test

Drive it from outside the boundary with real process boundaries and a real (or faithfully simulated) remote counter, not mocks of the lock or receipt internals: spawn competing OS processes and `kill -9` one at each transition (after acquire, after mutation, after record-but-before-release, mid-write of the record itself), then start a fresh process. Assert over many runs that the remote mutation count never exceeds one per logical request, and the fresh process proceeds only once any outstanding receipt is gone. This matches SIMPLE.md's own proof requirement, and only passes if ownership is actually unified — a test that pokes the lock and receipt as separate mocked units wouldn't catch either race.

## Why not the proposed alternatives

A second coordinator adds a fifth actor to referee four operations that need one owner — it adds a place for a third race to live rather than closing the existing two. Repeating the check in every feature multiplies the seam instead of closing it. Per SIMPLE.md's reconsideration condition, split the interval differently only if lock and receipt state end up in one transactional substrate that makes acquire-mutate-record-release atomic on its own; short of that, single ownership over program order is the smallest change that makes the invariant true.
