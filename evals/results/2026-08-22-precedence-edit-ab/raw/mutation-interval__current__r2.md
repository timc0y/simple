I put together the full analysis but the file write to `answer.md` needs your approval — here's the answer directly:

## Where the doors are

Both races have the same root cause: the lock's release and the receipt's write are two separate steps owned by two different parties, so there's a window where the lock is open but the receipt doesn't exist yet.

- **Door 1**: gateway releases the lock; composition root hasn't yet written the unknown receipt. A process starting in that window sees no lock and no receipt, and begins a second mutation.
- **Door 2**: on startup, converting a dead holder into a receipt is a step separate from acquiring the lock. A new mutation can acquire the lock before that conversion finishes — same underlying cause as door 1: nothing forces "receipt exists" to precede "lock is free."

Adding a fourth coordinator doesn't close either door — it adds one more party that must be consulted in the right order, which is the failure mode already present. Repeating the checks in every feature doesn't close them either — it duplicates the same seam into every caller instead of removing it.

## The ownership change

The lock and the receipt are currently owned by different parties (gateway owns the lock; composition root owns the receipt), so "lock free" and "receipt exists" can only stay consistent by hoping two owners run in the right order. Give one owner both: fold "check receipt," "convert a dead holder," and "record unknown" into the same component that acquires and releases the lock — call it the mutation boundary. Composition root calls it once per mutating command instead of performing the check/record steps itself:

```text
mutation boundary: refuse if a receipt is outstanding
mutation boundary: acquire lock — if the current holder is dead, convert it to a
                    receipt as part of acquiring; acquisition doesn't succeed until
                    that conversion has committed
mutation boundary: perform the remote mutation
mutation boundary: write the outcome — success clears the slot; failure or unknown
                    writes the receipt
mutation boundary: release the lock only after that write has committed
```

The rule that removes both doors: release never happens before the outcome is durable, and acquisition never happens before a dead holder's outcome is durable. Since the same owner performs the write and controls both release and acquire-time conversion, there's no gap between them for another process to slip through — there's no second owner left to race against.

## When recording the receipt itself fails

If the outcome can't be written durably (disk full, crash mid-write), the lock must **not** be released. An unrecorded outcome plus a released lock is exactly the state that causes duplication, so the boundary treats a failed receipt write the same as a crash: leave the lock held and surface the error to the caller. The held lock is the durable fallback signal that something is unresolved — the next acquire attempt, by any process, finds that holder dead and is forced through the same conversion-before-acquisition path as door 2, so the receipt eventually gets written before any new mutation can start.

## Independent proof

Test from outside, with no knowledge of internals: run two processes racing for the same lock/receipt store, and SIGKILL the mutation-boundary process at each transition (after the remote call returns, after the outcome write, mid-release, mid-conversion). After each kill, start a fresh process and assert the invariant, not the implementation: either it performs no mutation because a receipt is outstanding, or it converts the dead holder first — and at no point do two mutations run concurrently or does a new one start while an unconverted holder or unwritten outcome exists.

Want me to retry writing this to `answer.md`, or is this response sufficient?
