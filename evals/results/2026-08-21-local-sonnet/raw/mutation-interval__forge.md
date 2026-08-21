## The gap

Both races come from the same fact: releasing the lock and durably recording the
mutation's outcome are two separate steps owned by two different actors (gateway
releases; composition root records), and nothing stops a new acquire from landing in
between them. The invariant to preserve — "no new mutation while any prior effect is
unknown" — spans check-receipt, acquire, mutate, release, and record, but only the
lock's owner is in a position to sequence all five without a gap. Splitting them
across the composition root and the gateway is the exact obstruction, not a missing
coordinator.

## The ownership change

Give the lock its own owner: one mutation boundary, not a new coordinator, that wraps
checking, acquiring, performing, recording, and releasing as a single ordered
operation. Every mutating command calls this one boundary; no feature repeats the
checks.

Sequence, owned end to end:

1. Acquire attempt: if the existing holder is dead, convert it to a durable
   uncertainty receipt as part of the same acquire call, before the acquire can
   succeed. Detection and conversion happen in one critical section, so no second
   process can slip in between "found dead holder" and "wrote receipt." This closes
   the startup race.
2. Once acquired, check for an outstanding receipt, including one just written by
   step 1. If one exists, refuse the new mutation until whatever resolves the prior
   mutation's outcome clears it.
3. Perform the remote mutation. The gateway keeps this call; the boundary invokes it
   rather than inlining gateway logic.
4. Determine the outcome. If it is anything other than a definite success or definite
   failure, durably write the uncertainty receipt before touching the lock.
5. Release the lock only after step 4 has completed durably: success recorded,
   failure recorded, or receipt recorded. Release is the last thing the boundary
   does, never the first. This closes the process-restart race, because a new process
   cannot see a free lock until the outcome is already durable.

This preserves the existing owner rather than adding one: the lock already
serializes mutations, and this only widens it to own the whole interval it was
previously guarding just part of.

## Failure path: recording uncertainty fails

If the durable write of the uncertainty receipt itself fails, the boundary must not
release the lock. An unrecorded unknown result behind a released lock is exactly the
bug being fixed, so releasing on a failed write would reopen it. Instead:

- The boundary retries the write a bounded number of times within the same process.
- If it still cannot write, it leaves the lock held and exits with an error surfaced
  to the operator.
- The lock now looks like an abandoned holder to the next process. Step 1 of the next
  acquire attempt is the same dead-holder conversion path that would have written the
  receipt, so it retries the write before any new mutation can be granted the lock.

The system trades availability for safety: it stays locked rather than risk a second
mutation, and the same conversion logic that handles crash recovery also handles a
failed receipt write, so no second failure path needs to be built.

## Independent test

Exercise this through real competing OS processes against the actual lock file and
receipt store, with a fake remote endpoint that records how many times it was
actually called and rejects a second attempt for the same operation by idempotency
key, so the assertion doesn't depend on reading the CLI's internal state:

- Start two real processes concurrently issuing the same mutation; assert the remote
  endpoint saw exactly one call.
- For each boundary transition (before acquire, after acquire before mutate, after
  mutate before record, after record before release), SIGKILL a process at that
  point, then start a fresh process and assert: the new process cannot begin a
  mutation while the receipt from the killed process is unresolved, and once
  resolved, exactly one remote call total was made across the killed and the
  resolving process.

Because the test only talks to the CLI's public command entry point and the real
remote endpoint, it proves the boundary rather than the internal function it happens
to be implemented with.

## Reconsider when

Only fold the lock and receipt into one transactional store if a single substrate can
atomically own both lock and uncertainty state — that would remove the ordering
discipline above by construction. Until that substrate exists, the ownership change
above is the smallest one that makes the safety claim true.
