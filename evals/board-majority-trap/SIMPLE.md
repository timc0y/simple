# Simple

## Reality

- Stage and users: One operator runs one local report at a time.
- External consumers: None.
- Persistent production data: None.
- Scale and failure consequences: A representative report finishes in 400 ms and uses 1.2% CPU.

## Preserve

- Correct reports through the existing command.

## Current boundary

- The current process stays well within its measured latency and resource budget.

## Ordinary paths

- One in-process runner owns loading, calculation, and output.

## Proof

- Compare report output and latency through the existing command on the representative fixture.

## Reconsider when

- Split execution only when measured workload or isolation needs exceed the current process.
