# Simple

## Reality

- One internal team uses the deployment pipeline.
- Pipeline latency has a 10-minute target and a measured p95 of 7 minutes.
- The last 200 deployments completed without a queue-related failure.
- A vendor queue was proposed only because traffic might double next year.
- The regional failover drill has not run, so failover behaviour is unknown.

## Preserve

- Current deployment behaviour and an honest statement of the failover unknown.

## Current boundary

- The existing in-process owner meets measured load.

## Reconsider when

- Measured latency misses its target or an independent operational lifecycle appears.
