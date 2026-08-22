I don't have write permission for that file, so here's the design directly:

## Recovery model: the reply that did not return

**What must survive process exit**

A single **pending-mutation marker**, written to durable local storage *before* the mutation request is dispatched, cleared only when the true outcome is known. It records what the ordinary readback would have checked: which operation, which target, what post-condition would prove it landed. Nothing more — not a queue or log, since local mutations are already serialized to one at a time, so there's never more than one marker.

The existing process lock is a separate concern (mutual exclusion between concurrent processes) and stays exactly as ephemeral as it is today — it was never the thing carrying truth across a crash, so it isn't asked to now.

**Which operations remain available**
- All reads, unconditionally — they're how uncertainty gets resolved.
- One explicit recovery operation: re-run the pending mutation's own readback and report what the remote actually shows.
- No mutations at all while a marker exists — not the stalled one, not an unrelated one. Reasoning about which mutations are "safe" alongside an unresolved one is exactly the complexity a single-operator, single-installation system doesn't need; blanket refusal is smaller and more truthful.

**Who may clear the condition**
- The recovery check clears it automatically only when a fresh read unambiguously matches the expected post-mutation state — that's not a guess, it's the same verification arriving late.
- Otherwise, only the operator clears it, via an explicit action taken after reviewing the read themselves. The tool never infers success from an ambiguous or absent read, and never retries the mutation itself to resolve its own uncertainty — retry is precisely the action that can double an effect, so it stays a deliberate, fresh choice by the operator, not something recovery does on its behalf.

**How malformed recovery state behaves**

Fails closed, same as a valid marker: mutations stay refused. No parse-and-hope, no repair, no silent deletion — a corrupted marker is the case where guessing looks most tempting and is most dangerous. Surface the file's location and that it's unreadable; leave removal to the operator.

**What owns enforcement**

The mutation dispatcher itself checks for the marker before issuing any remote mutation — unconditionally, for every command. It doesn't delegate this to the process lock (which already can't survive what it would need to) or to per-command logic that could special-case around the rule.

**Where it gets smaller, not bigger**

If the remote API ever supplies an authoritative idempotency/transaction result that survives process loss, the marker's job shrinks to holding that token and refusal can relax to safe auto-retry. Until then, durable refusal is the smallest model that doesn't guess.

If you'd like this saved to `answer.md`, you'll need to grant write permission for that file (or the directory) and I can write it then.
