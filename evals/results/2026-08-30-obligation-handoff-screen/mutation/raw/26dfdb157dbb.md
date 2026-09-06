Move the full safety interval into the shared mutation gateway. It must own:

```text
recover stale lock → check receipt → acquire lock → perform mutation
→ persist uncertainty receipt if outcome is unknown → release lock
```

A stale lock remains a lock until its uncertainty receipt is durable. Recovery must be claimed atomically, so no contender can delete the stale lock and begin a mutation before conversion finishes.

If recording the receipt fails, do not release or clear the lock. Return failure and leave it blocking; later startup retries conversion before allowing any mutation. This favors an explicit operational blockage over a duplicate remote effect.

Remove the composition root’s receipt check and post-release recording. Every mutating command already reaches the shared gateway, so this creates one owner without another coordinator or repeated feature checks.

Prove it with real competing CLI processes and a controllable remote fake:

1. Force an unknown remote result after the fake has applied the mutation; pause immediately before receipt persistence. A second process must remain blocked, and the fake must show one application.
2. Terminate the first process at that point. A second process must recover the stale lock into a receipt and still refuse the new mutation.
3. Make receipt persistence fail. Verify the lock remains, subsequent mutations are blocked, and recovery can proceed only once the receipt is durably recorded.
