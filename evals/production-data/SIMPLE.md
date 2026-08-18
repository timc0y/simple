# Simple

## Reality

- Stage and users: Production service with external API consumers.
- External consumers: Published API clients.
- Persistent production data: Retained customer records.
- Compatibility commitments: A 90-day deprecation promise.

## Preserve

- Customer data and the published API contract during the deprecation period.

## Current boundary

- Old and new clients must work during the promised transition.

## Ordinary paths

- Schema changes use the service's existing migration mechanism.

## Proof

- Verify stored data, both API representations, rollback, and removal criteria.

## Reconsider when

- The deprecation period ends and old-client traffic reaches zero.
