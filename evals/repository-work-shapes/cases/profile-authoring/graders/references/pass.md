# Simple

## Reality

- Stage and users: Production service with published API clients.
- External consumers: Published API clients.
- Persistent production data: Retained customer records.
- Compatibility commitments: Preserve the old customer field name for 90 days.
- Operators, scale, failure, and security facts: Unknown.

## Preserve

- Customer records and old-client API behaviour during the promised transition.

## Current boundary

- Old and new API clients must both work during the transition.

## Ordinary paths

- The migration runner owns schema changes.
- `CustomerSerializer` owns request parsing and response serialization. Its existing
  deprecation-alias facility accepts either field name, rejects conflicting values, and
  emits both names from one internal value during a bounded transition.

## Proof

- Verify stored data, both API representations, rollback, and removal.

## Reconsider when

- Remove old-name handling only after 90 days and zero old-field traffic.

