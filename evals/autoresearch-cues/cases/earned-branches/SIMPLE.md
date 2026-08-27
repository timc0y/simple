# Simple

## Reality

- The mutation gateway is the sole owner of the mutation interval.
- Recovery and receipt checks must happen while it holds the same lock.
- A failed uncertainty record must keep the resource blocked.
- Separate services would divide the safety interval across owners.

## Preserve

- One mutation owner, fail-closed recording, and crash recovery.

## Proof

- Use competing processes, force termination, and inject receipt-record failure.
