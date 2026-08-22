No problem — I'll just give the answer directly here instead of writing to that file.

## The actual defect

"No new mutation while any prior effect is unknown" is one invariant, but it's enforced by two owners with a gap between them: the composition root holds the receipt check and the receipt record; the gateway holds the lock acquire and the lock release. Neither sequence is atomic with the other, so every handoff between them — release-then-record, and acquire-without-conversion — is an open door. Adding a coordinator adds a third owner and more handoffs, not fewer. Repeating the checks in every feature pushes the invariant out to every caller instead of fixing the owner that already holds the state.

## Ownership change

Give the lock owner all four operations, not two. One boundary — entered once per mutating command — owns:

- **Enter**: convert any dead lock holder into a receipt, then check for an outstanding receipt, then acquire the lock — one atomic sequence, not three independently-timed steps.
- **Body**: perform the remote mutation.
- **Exit**: if the outcome isn't confirmed, durably write the uncertainty receipt, and release the lock only after that write succeeds.

The composition root stops checking or recording anything itself; it calls the boundary and gets back a confirmed or uncertain result. Every mutating command goes through this same boundary — one shared mutation boundary, not one per feature (matches the "Ordinary paths" fact already in SIMPLE.md).

This closes both observed races directly:

1. Release and record become the same atomic exit step — there's no window where the lock is free but the receipt isn't written yet, because release is conditioned on the write succeeding.
2. Dead-holder conversion becomes the first sub-step of acquisition itself, not a separate startup task — a new mutation can't acquire the lock until any dead holder has already been converted.

## Failure path: recording uncertainty fails

If the receipt write fails during exit, the boundary does **not** release the lock. It fails closed — the lock stays held, which is exactly the state a dead holder already leaves behind. No new failure mode is needed: the existing dead-holder-conversion step (already run on startup, now also run at the top of every acquire) is what eventually turns that held lock into a durable receipt, on the next process start or the next acquire attempt. One mechanism handles both "holder died" and "holder failed to record."

## Independent proof

Run real competing processes against the same lock/receipt store, and force termination at each boundary transition (after acquire, after the remote call, after the release attempt, mid-receipt-write). Observe only the public surface — the receipt store's state and the count of mutations actually applied on the remote side — never the internal call order. Assert that across every kill point, a second process never begins a mutation while a first process's outcome is unknown, and the remote mutation is never applied twice.

This matches SIMPLE.md's own "Reconsider when" note: split the interval only if a transactional substrate atomically owns lock and receipt together — until that's true, the fix is fewer owners of one interval, not more coordinators.
