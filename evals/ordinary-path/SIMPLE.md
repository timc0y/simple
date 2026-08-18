# Simple

## Reality

- Stage and users: One deployment at current small load.
- Operators: The application team.
- Scale and failure consequences: Daily imports may retry after transient failure.

## Preserve

- Existing scheduling and retry behaviour.

## Current boundary

- Background work runs in-process; no separate worker system is operated.

## Ordinary paths

- The existing runner schedules and retries jobs.

## Proof

- Verify scheduling, execution, retry, and idempotency through the runner.

## Reconsider when

- Measured load or isolation requirements exceed the runner's capability.
