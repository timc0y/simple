## The exact obstruction

The process lock enforces "don't run concurrently," but it's memory/process-lifetime scoped — it answers "is another mutation running" but not "did the *last* mutation resolve." Those are different facts. The missing precondition is durable evidence, written before the network call, that a specific mutation's outcome is unconfirmed. Nothing today survives the process; that's the actual gap, not the locking mechanism itself.

## Design

**What must survive process exit**

A single doubt marker, written to disk synchronously *before* the mutation request is sent, holding only: which operation, the target identifier(s), and a timestamp. Not a queue, not a history log, not a state machine — one marker, because there's one operator, one installation, and the process lock already guarantees at most one mutation is ever in flight. The marker is deleted synchronously once the post-mutation readback confirms success. If the process dies between write and delete, the marker is what's left — and it is the truthful record: "this specific mutation's outcome is unknown."

**Which operations remain available**

Reads, unconditionally — they're stated as safe regardless of doubt. All mutations are blocked while a marker exists, not just the one that was interrupted. Classifying which operations are safe to retry blindly would require building an idempotency taxonomy that isn't an established fact yet; blocking everything is the smallest rule that's guaranteed correct today. That taxonomy is the natural upgrade if this ever becomes a throughput problem — not a precondition for shipping the recovery model.

**Who clears it**

The trusted operator, always by hand, never by the CLI's own inference. On startup with a marker present, the CLI's job is to surface it (operation, target, timestamp) and offer a read against the remote system so the operator can see actual state — but the CLI does not auto-diff and auto-clear, because "did this land, and is that okay" can require judgment the readback alone doesn't resolve (e.g., a plausible-looking record that's actually a duplicate). Clearing is an explicit operator action, separate from the read.

**Malformed recovery state**

Treated as unresolved doubt, never as absence of doubt and never auto-repaired. A marker that fails to parse still blocks mutations and still surfaces to the operator; the CLI states plainly that the marker is unreadable and asks the operator to inspect and clear manually. Guessing a reinterpretation of corrupt state is exactly the kind of silent behavior that turns one incident into two.

**What owns enforcement**

The CLI process itself, at startup, before any mutation path runs — a local filesystem check next to wherever it already keeps the process lock. No external lock service, no daemon, no second installation-aware component: a second owner isn't justified by a single-operator, single-installation system.

This adds exactly one piece of state (the marker) and zero new dependencies or workflows — it's the one precondition the process lock couldn't provide because it doesn't survive the process.
