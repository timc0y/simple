# Simple

## Reality

- Stage and users: One trusted operator uses one local installation.
- External consumers: None.
- Persistent production data: Remote mutations outlive the local process.
- Compatibility commitments: None outside the current command surface.
- Scale and failure consequences: Retrying an unknown mutation can duplicate a real effect.

## Preserve

- Safe reads after an uncertain write.
- Refusal rather than guessing when remote reality is unknown.

## Current boundary

- Commands are one-shot and mutations are serialized locally.
- A lost response cannot distinguish an unapplied mutation from an applied one.

## Ordinary paths

- Mutations use one protected command interval and independent readback.

## Proof

- Kill a mutation after dispatch, start another process, and prove it refuses mutation while reads and explicit recovery remain available.

## Reconsider when

- Remove durable uncertainty only if the remote API supplies an authoritative idempotency or transaction result across process loss.
