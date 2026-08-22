I don't have permission to write to `answer.md`, so here's the design directly:

## Recovery model: uncertain mutation

**What must survive process exit**
A single on-disk marker, written synchronously (create-then-fsync or atomic rename) immediately before a mutation request is dispatched, and removed only after an independent readback confirms the actual outcome or the operator explicitly clears it. It holds just enough for the operator to investigate by hand — which command ran, its target, when it was dispatched. It's not a queue, a log, or resumable workflow state, only the fact that one mutation's outcome is unknown plus the context needed to check it. Mutations are already serialized to one at a time, so at most one marker can ever exist.

**Which operations remain available**
- Reads: always available, unconditionally — they're how the operator resolves the uncertainty.
- Mutations: refused while the marker exists. Every mutation command checks for the marker before dispatch and exits naming it, instead of proceeding. This extends the existing "refuse rather than guess" behavior across a process restart.
- Recovery (clear): available at any time, run explicitly by the operator once they've checked remote state via reads.

**Who may clear the condition**
Only the trusted operator, only through an explicit recovery command — never automatically, never as a side effect of a read or of starting a new command. One operator and one installation means there's no coordination problem, but clearing still has to be deliberate, since it's the only point where a human judgment ("I checked — it did or didn't land") gets recorded.

**How malformed recovery state behaves**
If the marker exists but is unreadable or doesn't parse (partial write from a second crash, disk corruption, manual edit), it's treated exactly like a valid marker: mutations stay refused. Malformed state never falls open. The recovery command can still remove it, since clearing is an unconditional operator action, not a state transition that depends on parsing the marker's contents.

**What owns enforcement**
The CLI process itself, at the top of every mutation command, by checking for the marker on the local filesystem before dispatch. No daemon, lock service, or remote coordination is needed — the marker is local, the operator is local, and there are no other installations to share state with. This is the same enforcement point the existing process lock already used, just moved from process memory to disk so it outlives the process.

**Why nothing more**
A mutation log, retry queue, or per-operation idempotency keys would each assume something not established here: multiple operators, resumable workflows, or a remote API that confirms outcomes durably on its own. If the remote system later exposes an idempotency key or transaction result that survives process loss, the marker becomes unnecessary and can be replaced by an automatic check against that authority. Until then, a human read is the only trustworthy oracle, so refusal-until-cleared is the smallest correct behavior.

If you'd like this saved to `answer.md`, grant write permission for that file and I'll save it.
