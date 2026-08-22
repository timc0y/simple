## Recovery model

**Trigger.** The instant the mutation request leaves the process, and before its result (success, failure, or readback) is confirmed, the outcome is unknown. That window — not the crash itself — is what needs a durable record.

**What must survive process exit**
A single pending-outcome record, written to disk *before* the mutation is issued (write-ahead, not write-after):
- operation identifier + target resource identifier
- any idempotency/dedup key the remote API supports for that operation
- enough parameters to re-derive "what success looks like" for a reconciliation read
- a status: `in-flight`

No retry counters, no auto-scheduled retry — the record exists to gate and to inform a human read, not to drive automated resubmission. If the mutation completes and the readback confirms it inside the same run, the record is deleted immediately; it only survives to the next invocation in the exact case where that didn't happen.

**Which operations remain available**
While a pending record exists: all reads are unrestricted (they're safe and are exactly what's needed to resolve the ambiguity). All mutations are blocked — not just on the affected resource, but globally, since there's one operator and one installation and the thing that used to prevent overlapping mutations (the process lock) is gone. The record has to inherit that enforcement role, so it's scoped as wide as the lock was.

**Who may clear the condition**
Only the operator, and only after a read against the real remote state — never the CLI inferring success from absence of error, never an automatic clear on next successful run of an unrelated command. Clearing should be an explicit act (a `resolve`/`ack` step where the operator states what they observed), because the CLI has no basis to decide "landed" vs "didn't" on its own — that's precisely the fact it lost. If the operation isn't idempotent and the read is itself inconclusive, resolution is a judgment call the operator makes knowingly (accepting duplicate risk), not something the tool decides for them.

**How malformed recovery state behaves**
Fail closed. An unreadable or partially-written record is treated as "pending, unresolved" — worst case, not best case. Mutations stay blocked, reads stay open, and the corruption is surfaced plainly so the operator can inspect the remote system and manually repair or remove the file. It must never be silently discarded or treated as "absence of a record," since that would reopen exactly the double-apply risk the record exists to prevent.

**What owns enforcement**
The local on-disk record, checked at startup before any mutation command runs — it, not the remote system, is authority over "is there an unresolved mutation from a prior run." The remote system remains authority over "did the change actually happen." The CLI's only job is: gate new mutations on the local record, and force a reconciliation read against the remote before that record can be cleared.
