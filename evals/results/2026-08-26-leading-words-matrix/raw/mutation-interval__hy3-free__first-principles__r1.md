I'll explore the workspace to see whether this is about existing code or a design exercise.This is a reasoning exercise, not an existing codebase. Let me read the task files.This is a design reasoning task (no implementation codebase). The `SIMPLE.md` already encodes the answer's direction: *"Split the interval only if one transactional substrate atomically owns lock and uncertainty state."* Here is the plan.

## Diagnosis — the root cause

Both races are the **same defect**: the lock (transient, owned by the gateway) and the uncertainty receipt (durable, owned by the composition root) are two separate objects in two stores, and the safety interval lives in the *gap between them*.

- **Race 1**: between `gateway: release lock` (step 4) and `composition root: record unknown` (step 5) there is no record at all. A new process sees no receipt and no lock → applies again.
- **Race 2**: a dead holder is a *lock* state, not a *receipt* state; converting it is a distinct, late, owner-crossing step. A new mutation starting before conversion sees neither → applies again.

Adding a third coordinator or duplicating checks everywhere keeps two objects and two owners, so it cannot close the gap. It is rejected.

## Smallest ownership change

**Collapse the lock and the uncertainty receipt into one durable per-mutation claim record, owned end-to-end by the composition root. The gateway stops owning acquire/release/record and becomes a pure remote-call executor.**

The claim has states: `ABSENT → PENDING → {APPLIED, UNKNOWN}` (terminal). `PENDING` is the lock; `UNKNOWN` is the receipt; they are the same durable row.

Protocol (single owner, single store):

1. Read claim for mutation id.
2. If state ≠ `ABSENT` → refuse (covers applied, unknown, *and* in-flight — all block re-application).
3. **Atomically create the row as `PENDING`** ("create if absent"). This one durable op *is* both the lock acquisition and the receipt existence. Whoever loses the create is blocked.
4. Hand `PENDING` claim to gateway; gateway only performs the remote call.
5. On result: known-success → `PENDING→APPLIED`; unknown → `PENDING→UNKNOWN`. **Never delete; never return to `ABSENT`.**

Why both races vanish:
- **Race 1**: there is no release-then-record window. The record exists from before the mutation and only *transitions*, never disappears. Any process starting after step 3 sees a non-`ABSENT` state and refuses.
- **Race 2**: a dead holder leaves a durable `PENDING` row — that row *is* the uncertainty receipt. No separate conversion step, no "before conversion" window. Startup recovery promotes an aged `PENDING` to `UNKNOWN` (safe, still blocks) but need not race anything.

## Failure path when recording uncertainty itself fails

After the remote mutation returns unknown, the `PENDING→UNKNOWN` write may fail (store down, disk full, crash). The safe contract:

- **Never delete the row; never report success.** The row stays `PENDING`.
- `PENDING` is the conservative state: it blocks all future re-application, so the *at-most-once* safety claim still holds. The failure mode is undershoot (possibly missed apply), never overshoot (duplicate).
- The process exits non-zero / raises, so the operator sees "reconcile me." Local annotation is lost but the invariant is not.
- The one forbidden direction: any path that could leave `ABSENT` while the remote call may have applied. The unified design forbids it because the row is created *before* the call and only ever transitions forward.
- Recovery rule: an aged `PENDING` is promoted to `UNKNOWN` atomically; recovery never deletes and never re-applies.

## Independent test that proves the boundary

Use **real separate processes and a real durable store** (fork/exec + file or sqlite), not in-process mocks — that is the only thing that proves the cross-process boundary.

- **T1 (race-1 boundary):** P1 creates `PENDING`, performs the mocked remote call, then is `SIGKILL`ed at the instant between "remote returned unknown" and the terminal write. P2 starts immediately. Assert: mock remote invoked **exactly once**; P2 refuses because the row is still `PENDING`/`UNKNOWN`.
- **T2 (race-2 boundary):** P1 acquires `PENDING` and is killed while "holding" it (no separate lock object). P2 starts. Assert P2 refuses on the persisted `PENDING` row — proving dead-holder→receipt conversion is no longer a race, it is free.
- **T3 (uncertainty-record failure):** inject the `PENDING→UNKNOWN` write to fail. Assert: non-zero exit, row remains `PENDING`, and a subsequent process still refuses (no double apply).

T1+T2 prove the gap is closed; T3 proves the failure path stays safe.

---

**Note:** I'm in plan mode and this directory has no implementation to modify — the deliverable is the design above. If you want, I can write it out as a `PLAN.md` / design doc once you leave plan mode, or adapt it to a specific language/store.
