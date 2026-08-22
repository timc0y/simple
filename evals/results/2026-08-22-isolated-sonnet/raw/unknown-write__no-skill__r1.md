## The model

**Unit of durability: one on-disk marker per outstanding mutation.**

Before a mutation request leaves the process, write (and fsync) a marker containing:
- a locally-generated operation id
- the operation type + target
- a natural key or expected post-state, if the operation has one (e.g. "resource X should be at version N" or "record with client-generated id Y should exist") — this is what makes reconciliation possible later without guessing
- state: `sent` — nothing else. No payload, no response, no assumptions.

That marker is the *only* thing that needs to survive process exit. Retry counters, connection state, the in-memory lock — none of that needs to outlive the process.

**Lifecycle**
- Write marker (`sent`) → send request → success + readback confirmed → delete marker. Happy path leaves nothing behind.
- Failure *before* the request leaves the process (connection refused, DNS failure): delete marker, safe to retry, nothing landed.
- Failure *after* the request leaves but before a response/readback arrives: marker stays as `sent`, process exits. This is the only path that produces persistent state — and it's the case in question.

**Which operations stay available**
- Reads: always, unconditionally. They can't make anything worse and don't need the lock.
- Mutations: none, while any `sent` marker exists — regardless of whether the new mutation looks unrelated. With one operator and one installation, there's no throughput case worth the risk of misjudging "independence."
- The one exception isn't a new capability: it's resuming the deferred readback for the pending marker itself, using the recorded natural key.

**Who clears it**
- The CLI clears it automatically only in the unambiguous case: the reconciliation read shows the recorded natural key/version either matches the intended result (mutation landed) or clearly doesn't exist (mutation never landed). Either way, delete the marker.
- If the read is inconclusive — remote still unreachable, or the operation type has no natural key to check — only the operator can clear it, via an explicit command, after confirming reality themselves. The tool never guesses; there's no other trusted party to defer to.

**Malformed recovery state**
- Fail closed, unconditionally. Unparseable, truncated, or unknown-schema markers are treated as blocking — same as a valid `sent` marker — but surfaced as a distinct "corrupt recovery state" error rather than a normal pending message. Never auto-deleted, never treated as resolved, never treated as "safe to proceed." Over-blocking is an acceptable failure mode here; silently unblocking mutations because a file was garbled is not.

**What owns enforcement**
- The CLI process itself, at startup, before dispatching any subcommand — a local check of a well-known path tied to the installation (not the session). It decides only three things: is this a read (allow), is this the resolve command (allow), or is this a mutation (block if any marker exists in any state, including malformed).
- This is deliberately a different mechanism from the process lock. The lock serializes concurrent live processes and is *supposed* to vanish with the process. The marker exists precisely because the lock can't cover the one case that matters — the process dying mid-flight. Don't merge them; they don't share a failure mode.
