# Simple

## Reality

- Stage and users: One local operator runs the application.
- External consumers: None.
- Persistent production data: Local state uses the existing repository store.
- Compatibility commitments: None outside the repository.

## Preserve

- The current report-generation behaviour and stored reports.

## Current boundary

- Reports are generated in-process at current load.

## Ordinary paths

- The report module owns generation and persistence.

## Proof

- Verify generation and persistence through the report module's public surface.

## Reconsider when

- Measured load or an independent operational lifecycle requires isolation.
