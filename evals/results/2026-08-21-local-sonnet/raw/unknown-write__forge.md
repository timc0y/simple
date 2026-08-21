# Recovery model for the interrupted mutation

The ordinary path already serializes mutations behind one process lock and verifies
each with an independent readback. The lock's only gap is durability: it protects
against a second concurrent mutation only while its process is alive. Close that one
gap with a single durable marker, not a new subsystem.

## What must survive process exit

One pending-mutation record, written to disk immediately before the mutation is
dispatched and removed only after that same mutation's readback confirms an outcome.
It holds the operation name, its target/identifier, and the dispatch timestamp —
enough for the operator to find and inspect the real state remotely. Nothing else
needs to persist: there is one operator and one installation, so no queue, history,
or multi-entry log has a present consumer.

Write the record before dispatch, not after. That makes the failure direction always
conservative: a crash between writing the record and sending the request leaves a
pending record for a mutation that may never have been sent, which blocks retries
unnecessarily but never lets an unknown duplicate through.

## Which operations remain available

- Reads stay unrestricted regardless of the record's presence. The operator needs
  them to inspect the remote system precisely because the mutation's outcome is
  unknown.
- New mutations are refused while a pending record exists. Retrying an operation of
  unknown outcome is the one action that can turn uncertainty into a duplicated or
  double-applied effect.
- The explicit recovery command that removes the record stays available. It is the
  only path back to normal mutation.

## Who may clear the condition

The trusted operator, explicitly, and only after they decide the real outcome. One
operator runs one installation, so no automated reconciliation should guess on their
behalf: no auto-clear after a timeout, no auto-clear because a new process started,
no auto-clear because a read looks consistent. The operator uses reads (or direct
knowledge of the remote system) to establish what happened, then runs the recovery
command to remove the record. Silent or time-based clearing would reintroduce the
same guessing the model exists to prevent.

## How malformed recovery state behaves

Treat a record that cannot be read or parsed as equivalent to a known-pending
record: fail closed. Do not treat corruption as evidence of safety, and do not
delete it automatically — an unreadable record may be the only trace that a mutation
was in flight. Mutations stay refused until the operator runs recovery explicitly,
the same as for a well-formed pending record.

## What owns enforcement

The existing mutation-command startup path, at the same point that currently
acquires the process lock. Extend that path to require the pending record's absence
before entering the protected interval, and to write the record as part of dispatch.
No daemon, no remote-side reconciliation, and no new owner: the local command surface
is the only thing with knowledge of a dispatch attempt, so it is the only correct
place to enforce the refusal.

## Reconsider when

Only if the remote API starts returning an authoritative idempotency key or
transaction result that survives process loss. At that point the durable local
marker becomes redundant with a source of truth the remote side already owns, and
the model should read that instead of maintaining its own uncertainty record.
