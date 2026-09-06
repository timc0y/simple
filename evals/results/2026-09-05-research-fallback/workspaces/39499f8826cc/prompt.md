Read this case's `SIMPLE.md` and design recovery for a mutation whose response was lost.

The CLI sent `rename-project p-17 -> Atlas` to a remote API, then the process lost its
connection before receiving a response or readback. The API has no idempotency key or
transaction lookup. A new process may start before the operator can inspect the remote
project. Reads are safe; repeating the rename may apply it twice or create a duplicate
audit event.

State what survives process exit, what a new process may do, whether it may retry, who
resolves uncertainty, malformed-state behaviour, and the proof.
