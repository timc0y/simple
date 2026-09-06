# Simple

## Reality

- Stage and users: One trusted operator uses one local CLI installation.
- Persistent production data: Remote project names and audit events outlive the process.
- Failure consequence: the mutation may have landed even though the reply was lost.

## Preserve

- Safe reads and refusal to guess under unknown remote state.

## Current boundary

- The CLI is one-shot, and its mutation entry point already serializes local writes.
- The API supplies no authoritative idempotency or transaction result.

## Ordinary paths

- The existing mutation entry point owns the protected interval and readback.

## Proof

- Kill after dispatch, restart, and prove reads remain available while new mutations
  refuse until explicit resolution.

## Reconsider when

- Remove refusal only when the remote API provides an authoritative result that survives
  process loss.
