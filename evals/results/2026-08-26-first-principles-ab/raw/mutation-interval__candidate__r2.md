## The ownership change

The four operations — check receipt, acquire lock, mutate, release lock, record-unknown — currently split across composition root and gateway. That split is the defect: two owners can each observe a *partial* state of the boundary from outside, which is exactly where both races live. SIMPLE.md's own "Ordinary paths" line already says the shared mutation boundary should exist; it just isn't the sole owner of these operations yet.

**Move the whole boundary into the lock owner (gateway).** Composition root stops checking the receipt and stops recording unknown results itself — it calls one gateway operation and gets back a result (succeeded / known-failed / recorded-as-uncertain). That single operation internally does, in strict order:

1. Acquire lock — and acquisition is not "check free, take it." It is "if the existing holder is dead, convert it to a receipt *first*; only then may acquisition succeed." No caller can observe an acquired lock unless any prior dead holder has already become a receipt.
2. Perform the remote mutation.
3. Record the outcome (success clears any receipt; anything else — error, timeout, ambiguous response — writes a receipt) durably.
4. Release the lock.

Step 4 only runs after step 3 durably completes. That ordering is the whole fix for race 1: there is no window where the lock is free but the outcome isn't recorded yet, because release is now downstream of record, inside one owner, not two calls made by two different owners with a gap between them. Step 1's built-in dead-holder conversion is the whole fix for race 2: a new mutation cannot acquire the lock at all until any dead holder has already been turned into a receipt — conversion is a precondition of acquisition, not a separate startup task that can be outraced.

This isn't a new coordinator — it's the existing lock owner absorbing two steps that had leaked out to its caller. And it isn't "every feature repeats the checks" — every mutating command already goes through the gateway to mutate; now it also goes through the gateway to get the check/record for free, once.

## Failure path: recording uncertainty fails

The release-after-record ordering means a failed receipt write already can't corrupt the invariant — it just means step 4 never runs. Concretely: if the durable write in step 3 fails, the lock **stays held**; the process must not clear it and should treat this as fatal for that command's session (report the error to composition root, exit without releasing). This is fail-closed by construction, not a special case: a held lock already blocks new mutations by rule #1 in "Preserve." On the next acquisition attempt from any process, step 1's dead-holder detection finds the (now-dead) holder and retries the conversion-to-receipt before letting anything new proceed. If *that* retry also fails, acquisition itself must fail rather than silently granting the lock — refuse the new mutation rather than risk losing the uncertain state. No path exists where a failed uncertainty write leads to an unlocked, unrecorded state.

## Independent test

Per SIMPLE.md's Proof requirement: drive this through real competing OS processes with forced termination at every transition, asserted from outside the gateway's internals.

Spawn two separate CLI processes against the same installation. For each transition point in the boundary — after acquire, after mutate-before-record, mid-record-write, after record-before-release — SIGKILL the first process at that exact point, then immediately start the second process attempting a new mutation. Assert only through the public command surface (not by inspecting gateway internals) that the second process never performs a new remote mutation while the first's effect is unknown: it must either block, error, or first resolve the outstanding receipt, and across all kill points the remote side effect must be observed at most once. That's independent because it exercises the real process boundary — real separate processes, real kill signals, real on-disk lock/receipt state — rather than calling the four operations as functions in-process.
