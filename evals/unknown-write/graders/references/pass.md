I don't have write access to `answer.md`, so here's the design directly:

## Recovery model: the reply that did not return

**What must survive process exit**
A single durable marker file on local disk, written *before* the mutation request is dispatched and removed only once the outcome is known. It extends the existing mutation entry point (the same one that takes the in-process lock) rather than replacing it. The marker holds only what's needed to describe the uncertainty and check it later — not general workflow state: which operation was dispatched, the target identifier(s), the parameters needed for an independent readback, and a timestamp. The CLI doesn't try to remember how to finish or retry the operation, only that it doesn't know whether it happened.

**Which operations remain available**
- *Reads* are always available — they don't touch the marker and are the only trustworthy way to learn what the remote side actually did.
- *Mutations are refused* while the marker exists. A new process checks for it before taking the local lock, so a killed mutation blocks all future mutations, not just a retry of itself.
- *Explicit recovery* is available: an operation that performs the independent readback against the marker's target, reports what it finds, and — only on success — clears the marker.

This mirrors the existing ordinary path (protected interval + independent readback); the marker just makes the "waiting for readback" state visible across a process boundary instead of assuming it always resolves in-process.

**Who may clear the condition**
Only the trusted operator, only through the explicit recovery operation. Nothing clears it automatically: the next ordinary mutation command must refuse and point at recovery, never clear-and-proceed. Recovery clears the marker itself once its readback resolves the question. If the readback is ambiguous, recovery reports that and leaves the marker in place — nothing is cleared on a guess. One operator, one installation, so no multi-user arbitration is needed; the rule is simply that the marker is never self-clearing.

**How malformed recovery state behaves**
An unreadable or corrupt marker is treated identically to a valid one: mutation stays refused. Corruption is not evidence the condition is resolved, so it must not default to "safe to proceed" or be silently deleted. Recovery on a malformed marker reports it's unreadable and requires a separate, explicit operator action to discard it — distinct from the normal "readback succeeded, clearing" path — so discarding corrupt state is a deliberate act, not a side effect.

**What owns enforcement**
The mutation entry point itself — no new service, daemon, or database. The remote system isn't asked to participate; it's not queried for idempotency keys or transaction status because it doesn't currently promise either. That stays true unless the remote API starts supplying an authoritative result that survives process loss, at which point the marker (and the refusal it enforces) can be narrowed or removed.
