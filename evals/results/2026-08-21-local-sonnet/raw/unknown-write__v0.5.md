## Missing precondition

The existing process lock already does the right job — serializing mutations — but
it lives in memory and dies with the process. The one fact that needs to survive is
narrower than a workflow or a journal: **"a mutation was dispatched and its result
is unconfirmed."** Supply that one durable fact through the same lock the CLI
already owns; don't build a new subsystem around it.

## What must survive process exit

A single on-disk recovery marker, written to the well-known lock location, holding
only:

- the operation name and target identifier of the dispatched mutation
- a timestamp
- nothing about intended retries, queues, or multi-step workflow — there is no
  workflow to resume, only a fact to remember

The marker is written and flushed to disk *before* the mutation request leaves the
process, so a kill at any point after that write still leaves evidence behind. This
extends the current process lock's job (serialize mutations) rather than replacing
it: the same file that represents "a mutation is in flight" now also outlives the
process that created it.

## Which operations remain available

- **Reads and independent readback stay fully available at all times.** They carry
  no duplication risk and are the only way to resolve the uncertainty, so nothing
  about the recovery condition may block them.
- **New mutations are refused while the marker exists.** The ordinary path already
  serializes mutations through one protected interval; a durable marker is just
  that same interval surviving past process death. Guessing whether the prior
  mutation landed and retrying anyway is exactly the duplication risk the profile
  rules out.
- **An explicit recovery command remains available**, separate from ordinary
  mutations, whose only job is to clear the marker. It performs no retry and no
  mutation itself.

## Who may clear the condition

Only the trusted operator, and only explicitly. There is one operator and one
installation, so no permission model is needed beyond "the person running the CLI
decided this is resolved." The tool does not clear the marker on its own inference
(e.g., "readback looks consistent, so I'll assume it's fine") — that would be the
same guess the marker exists to prevent, just automated. The operator uses the
always-available reads to inspect the remote system, decides what actually
happened, and runs the explicit recovery command to clear the marker before
mutating again. This keeps refusal, not guessing, as the default under
uncertainty.

## How malformed recovery state behaves

Fail closed. If the marker file is unreadable, truncated, or otherwise doesn't
parse, treat that exactly like a marker being present: refuse mutations. Do not try
to interpret a partial write as "probably fine" or fall back to allowing mutation
because the state couldn't be confirmed — an unreadable marker is itself evidence
that something was interrupted mid-write, which is the same class of uncertainty
the marker exists to record. Surface the raw file contents to the operator so they
can inspect and clear it explicitly, rather than the tool attempting to repair or
reinterpret it.

## What owns enforcement

The single mutation entry point already owns the process lock; it also owns this
check. Before dispatching any mutation it must: refuse if the marker exists (or is
malformed), otherwise write the marker, then send the mutation, then on confirmed
success (via the existing independent readback) clear the marker itself. No
separate daemon, watcher, or background reconciliation process is justified —
there is one installation and one operator, and the enforcement point already sits
on every mutation path.

## Deliberately not built

- No mutation queue or journal of pending operations — there is exactly one
  in-flight fact to track, not a sequence.
- No automatic retry or idempotency-key synthesis — the CLI cannot manufacture
  idempotency the remote API doesn't provide; inventing one would risk the exact
  duplication this design exists to prevent.
- No distributed lock or multi-process coordination — single installation, single
  operator.

## Reconsider when

If the remote API starts returning an authoritative idempotency or transaction
result that survives process loss (e.g., a client-supplied idempotency key the
server can dedupe on, or a durable transaction id the CLI can poll after
restart), the durable marker and manual-clear step stop earning their keep and
could be replaced by an automatic reconciliation against that authoritative
result. Absent that, the refusal-based marker is the smallest design that meets
the actual failure consequence.

## Proof

Dispatch a mutation, kill the process after the request leaves but before
readback returns, then start a new process. The new process must refuse to
dispatch further mutations while still permitting reads and the explicit recovery
command; only after the operator runs recovery does mutation become available
again.
