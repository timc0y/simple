# Simple

## Reality

- Stage and users: One production deployment serves current customers.
- Operators: The application team owns provider routing.
- Failure consequence: a short timeout incident is expected to resolve; permanent
  promotion would add rate-limit and cost failures.

## Preserve

- The primary provider as the normal route and provider-neutral request identity.
- Existing bounded retry and fallback behaviour.

## Current boundary

- The router can retry transient failures and call the integrated secondary.
- The secondary has lower capacity and must not become the default from one incident.

## Ordinary paths

- The router's existing classifier, retry budget, and health signal own this decision.

## Proof

- Exercise a timeout incident, recovery, and repeated requests; inspect route choice,
  bounded attempts, successful fallback, and unchanged request IDs.

## Reconsider when

- Promote a provider only after measured sustained failure and an explicit routing decision.
