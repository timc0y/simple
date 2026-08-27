Make the existing gateway own the whole mutation interval. Do not add a coordinator.

Its public mutation operation must:

1. Refuse if an uncertainty receipt exists.
2. Recover a dead lock holder by durably creating its uncertainty receipt before admitting anyone new.
3. Acquire the lock and perform the remote mutation.
4. On a definite result, release the lock.
5. On an unknown result, write the receipt while still holding the lock; release only after that write succeeds.

Remove the composition root’s receipt check and post-mutation receipt recording. Mutating commands call this one boundary.

If recording the receipt fails, fail closed: retain the lock and return a recovery/safety error. A later process must treat that holder as uncertain and retry receipt creation before reclaiming or releasing it. It must never start another mutation merely because the original holder is dead. This requires the lock record to retain enough operation identity to create the receipt during recovery.

The invariant is then:

> A remote mutation is either still protected by its lock, has a known outcome, or has a durable uncertainty receipt. No new mutation may proceed otherwise.

Prove it with a black-box multi-process integration test, not a gateway unit test: use a controllable remote server that applies a mutation then drops the response, force-kill the first CLI process at each boundary transition, and start a second real CLI process. Assert that the second process never reaches the remote mutation endpoint until the uncertainty receipt is durably resolved. Repeat with receipt persistence forced to fail; assert it remains blocked and the remote side-effect count stays one.
