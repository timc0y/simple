Move the receipt protocol into the existing shared mutation gateway. Its public mutation operation must own this entire interval:

```text
reconcile dead holder → reject outstanding receipt → acquire/hold lock
→ perform remote mutation → durably record unknown outcome if needed → release lock
```

Remove the composition-root receipt check. Every mutating command continues to use the same gateway.

Rules at the boundary:

- Before granting a mutation, convert any dead holder into a durable uncertainty receipt, then reject if a receipt exists.
- Keep the lock held until the remote result is definitive or its unknown result is durably recorded.
- If recording an unknown result fails, do not release or clear the lock; return a recovery error. A later process must treat the dead holder as unknown and create the receipt before it can mutate.
- If dead-holder conversion cannot record its receipt, fail closed: retain the blocking lock state and permit no mutation.

This closes both gaps because no process can observe either “unlocked but unknown” or “dead holder not yet represented” state.

Independently prove it with competing real CLI processes and forced termination at each transition: before remote call, during it, after an unknown result, during receipt persistence, and during dead-holder conversion. In every run, assert that a second mutation cannot begin until either the prior outcome is known or a durable receipt blocks it.
