The smallest ownership change is: make the gateway own the entire mutation boundary, including receipt checks, stale-lock recovery, and uncertainty recording.

```text
gateway:
  acquire lock
  recover any dead holder into a receipt
  reject if a receipt exists
  perform remote mutation
  if the result is unknown:
      record receipt while still holding the lock
      if recording fails:
          do not release the lock; fail closed
  release lock
```

The composition root only calls the gateway. Every mutating command uses that same boundary.

A stale lock must contain enough operation identity to create the receipt. Recovery must happen before the lock is made available for a new mutation. If receipt recording fails during recovery, the gateway must refuse mutation and retain/retry the lock state; it must never proceed based on an unrecorded unknown.

The proof is an independent process-level test using a real lock, receipt store, and remote-mutation spy:

1. Pause or kill a process after the remote call but before receipt recording.
2. Start a competing process.
3. Assert that it performs no remote mutation.
4. Assert that recovery creates the receipt—or, if receipt storage is forced to fail, that the competing process remains blocked.

This tests the public mutation boundary and both race windows without repeating implementation checks in each feature.
