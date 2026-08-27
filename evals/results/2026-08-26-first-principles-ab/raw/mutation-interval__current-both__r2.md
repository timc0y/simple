I don't have write permission for that file, so here's the answer directly.

## The ownership change

Give one owner the whole mutation boundary — not the composition root, not the gateway, but a single component that today only exists in parts. That component owns all four operations, in a fixed order, and nothing outside it may acquire the lock, write a receipt, or call the remote mutation directly.

**Entry**, before any remote call:

1. Check for an outstanding receipt. If one exists, refuse — a prior effect is still unknown.
2. Check the lock. If held by a live process, refuse. If held by a dead process, convert that dead holder into a receipt now, durably, before doing anything else, then re-check step 1 (which will now correctly refuse).
3. Only once no receipt is outstanding, acquire the lock.

**Exit**, after the remote call returns or fails to return:

4. If the outcome is known (definite success or definite failure), release the lock. Nothing else to record.
5. If the outcome is unknown, write the receipt first. Release the lock only after that write durably succeeds.

This closes both observed races, because the sequence that used to be split across two owners is now one critical section with one guard:

- **Race 1** (a process starts after unlock but before the unknown result is recorded) closes because release now happens strictly after the receipt write, never before it. "Lock free, outcome unrecorded" becomes unreachable by construction, not just unlikely by timing.
- **Race 2** (a new mutation starts before a dead holder becomes a receipt) closes because lock acquisition is gated on dead-holder conversion finishing first, inside the same step, by the same owner. A new mutation cannot get past a dead holder without going through conversion.

## Why not the two proposals on the table

A second coordinator doesn't remove the gap — it adds a fourth party that must also observe lock and receipt state correctly under the same timing, which is more surface for the same bug. Repeating the checks in every feature pushes correctness onto each call site instead of the boundary; one feature author sequencing it wrong breaks the invariant silently, once, somewhere. A single shared mutation boundary is already meant to be the ordinary path for every mutating command — the fix is making that boundary actually own all four operations, not adding a new mechanism beside it.

## When recording uncertainty itself fails

Do not release the lock. A failed write doesn't change what's true — the outcome is still unknown — so the lock must keep signaling that. The process exits with the lock held and the write error surfaced to the caller. On the next invocation of any mutating command, that lock is a dead holder, and entry step 2 — the same dead-holder-to-receipt conversion used for crash recovery — is what retries the write. No separate failure path is needed: a failed write and a crash mid-write are indistinguishable to everything downstream, and should be handled identically.

If the receipt store stays unwritable, mutations stay blocked until it recovers or an operator intervenes. That's correct: the stated consequence of a gap in this interval is a duplicated remote mutation, which is worse than refusing to run.

## The independent test

Unit tests that mock the lock and receipt can't prove this — the bug only exists at the instant a real process dies mid-sequence. The proof has to sit outside the boundary's own code:

Run the CLI as a real subprocess against a remote endpoint the test controls, so the actual call count is observable, and SIGKILL the subprocess at each transition in turn — after acquire, after the remote call is sent but before it returns, after the receipt write, before release. After each kill, start a fresh process and let it run to completion. Assert, purely from the outside:

- the controlled endpoint recorded at most one call across the killed run and the recovered run, at every kill point;
- a second real process starting concurrently while the first is mid-mutation is refused, not interleaved with it.

That proves the boundary from a vantage point that can't be satisfied by correct-looking internal call order — it only cares whether the remote effect happened more than once.

Want me to try writing this to `answer.md` again — should I retry the write, or would you rather grant the permission and have me redo it?
