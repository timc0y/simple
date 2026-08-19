# Simple

## Reality

- Stage and users: One trusted operator runs commands locally.
- External consumers: None.
- Persistent production data: Completed task records must remain readable after a command exits.
- Compatibility commitments: Preserve the command grammar and results, not unpublished process architecture.
- Scale and failure consequences: Ordinary commands perform one short remote operation.

## Preserve

- One command surface and durable completed task records.
- Existing command behaviour and safety checks.

## Current boundary

- The CLI is naturally one-shot; no current capability requires a resident process.
- The measured regression is process startup/import time, not remote execution time.

## Ordinary paths

- One process composes and executes one command.

## Proof

- Compare cold command latency and behaviour before and after the smallest dependency change.

## Reconsider when

- Add residency only when a measured capability requires continuity across commands and cannot be represented as durable data.
