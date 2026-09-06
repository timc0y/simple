Move the invariant into the existing shared mutation gateway. It should own the whole interval:

```text
acquire/recover lock → check receipt → perform mutation → record uncertainty if needed → release lock
```

Remove the composition-root receipt checks and post-mutation recording.

The gateway must never release a lock after an outcome becomes unknown until the uncertainty receipt is durable. A stale lock is therefore recovery evidence: before allowing another mutation, the gateway converts its recorded attempt into a receipt, then refuses the new mutation. The lock record must contain the receipt-equivalent attempt identity before the remote call, so a dead process can be recovered conservatively.

If recording uncertainty fails, fail closed: retain the lock and return an error. A later process treats that dead/stale lock as an uncertain attempt and converts it to a receipt; it must not proceed with a new mutation. This may require manual resolution for an attempt that never reached the remote service, but it preserves the safety claim.

Prove the boundary with an end-to-end competing-process test against a separate controllable remote service:

1. Start a real CLI mutation and have the remote service apply it but return an unknown result.
2. Make receipt persistence fail, then terminate the first process.
3. Start a second CLI mutation.
4. Verify the remote service’s durable mutation count remains one, the stale attempt becomes a receipt, and the second mutation is refused.

Repeat with termination immediately before and after each owned transition.
