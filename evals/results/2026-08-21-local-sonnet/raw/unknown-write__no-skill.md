# Recovery model: uncertain mutation marker

## What must survive process exit

A single durable marker file on local disk (e.g. `.mutation-pending`), written **before** the mutation is dispatched to the remote system, not after. It records only what's needed to identify and later verify the attempt: the operation, its target, and a timestamp. Nothing else needs to persist — there is no queue, no history, no multi-step workflow state. The write is atomic (temp file + fsync + rename) so the marker is either fully absent or fully present; a crash before the rename completes leaves no marker (correctly implying no dispatch happened yet), and a crash after leaves a complete one.

The marker is deleted only when the normal post-mutation readback confirms and completes successfully. If the process dies between dispatch and readback, the marker is what remains — it is the sole durable fact that "a mutation was sent and its outcome is unknown."

## Which operations remain available

Reads are always available, unconditionally. They never touch or depend on the marker, and they are the only way to resolve the uncertainty it represents — restricting them would make recovery impossible.

New mutations are refused while a marker exists. This is a blanket refusal, not a judgment call per operation: the tool has no way to know if a specific new mutation is safe against an unconfirmed prior one, so it doesn't guess. This sits at the same enforcement point as the existing process lock, so a mutation attempt fails fast, before any lock is taken or any request is sent.

## Who may clear the condition

Only the operator, and only through an explicit recovery command — never automatically, and never as a side effect of starting a new command. Because there is one trusted operator and one installation, no ownership or permission scheme is needed beyond "the person running the CLI." The recovery command reads the marker, performs the same independent readback the tool already does after ordinary mutations, and shows the operator the current remote state for that target. The operator then explicitly confirms the outcome (applied or not) before the marker is removed. The tool does not infer the outcome from the read itself and clear silently — matching "Preserve: refusal rather than guessing when remote reality is unknown," the inference that a read result means the mutation did-or-didn't apply is a judgment, and judgments here belong to the operator, not the tool.

## How malformed recovery state behaves

Treated identically to a valid marker: mutations stay refused. A marker that's unreadable, truncated, or fails to parse must never be interpreted as "no uncertainty" — that direction of error is the one that allows an unsafe retry and a possible duplicate effect. Because atomic writes prevent partial markers from the tool's own writes, a malformed file implies something else touched it (manual edit, disk corruption), which is exactly the situation where guessing is least justified.

Since a malformed marker may not name the original operation or target, the guided recovery path (read-and-confirm against a known target) may not apply. In that case the recovery command falls back to a deliberate, separate action — an explicit force-clear that requires the operator to state they've manually inspected remote reality and accept responsibility for clearing without tool-verified evidence. This is still operator-only and still explicit; it is never the default or automatic path.

## What owns enforcement

The CLI process itself, at the single mutation entry point — the same place the existing per-command process lock lives. Before a mutation can acquire that lock and dispatch, the tool checks for the marker file. This keeps the two failure modes cleanly separated: the process lock still handles two live processes racing each other, and the marker handles the case the lock can't cover — the process dying and taking the lock's guarantee with it. Enforcement stays entirely local and file-based; it does not depend on the remote system supplying any transaction or idempotency guarantee (per Reconsider-when, that dependency is only added if the remote API ever supplies one across process loss — it currently doesn't, so durable local uncertainty is the correct and smallest mechanism).
