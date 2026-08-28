# Simple

## Reality

- This production service has published API clients and retained customer records.
- The old customer field name is promised for 90 days.
- Operators, scale, failure, and security facts are unknown.

## Preserve

- Customer records and support for old and new clients during the promised transition.

## Current boundary

- The service supports both client representations during the 90-day transition.

## Ordinary paths

- Use the migration runner for schema changes.
- `CustomerSerializer` owns request parsing and response serialization. Its alias facility accepts either name, rejects conflicting values, and emits both names from one internal value.

## Proof

- Verify stored data, both API representations, conflict rejection, rollback, and removal.

## Reconsider when

- Remove the old name only after 90 days and zero old-field traffic.
