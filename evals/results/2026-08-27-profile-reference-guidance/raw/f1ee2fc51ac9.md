# Simple

## Reality

- Stage and users: This is a production service with retained customer records.
- Operators: Unknown.
- External consumers: Published API clients depend on the service.
- Public contracts: The API has promised the old customer field name for 90 days.
- Persistent production data: Customer records must be retained.
- Compatibility commitments: Old and new clients must both work during the transition.
- Scale and failure consequences: Unknown.

## Preserve

- Retained customer records.
- The API compatibility promise for the old customer field name.
- Support for both old and new clients during the 90-day transition.
- Rollback capability and verification of stored data and API representations.

## Current boundary

- `CustomerSerializer` owns request parsing and response serialization.
- Its deprecation-alias facility accepts either field name, rejects conflicting values, and emits both names from one internal value during a bounded transition.
- Schema changes use the existing migration runner.

## Ordinary paths

- Use `CustomerSerializer` for customer request parsing and response serialization.
- Use its existing deprecation-alias facility for the bounded field-name transition.
- Use the existing migration runner for schema changes.

## Proof

- Verify stored data.
- Verify both API representations.
- Verify rollback.
- Verify removal after the transition.

## Reconsider when

- Remove old-name handling only after 90 days have elapsed and old-field traffic is zero.
- No other users, operators, scale, failure, security, or compatibility facts are known.
