# Simple

## Reality

- Stage and users: This is a production service used by published API clients. It retains customer records.
- Operators: No operator, release, or support facts are known.
- External consumers: Published API clients depend on the API. No other external consumers are known.
- Public contracts: The old customer field name is promised for 90 days, and old and new clients must both work during that period.
- Persistent production data: Retained customer records must survive the change.
- Compatibility commitments: The old and new customer field names are accepted during a bounded transition. The old name is removed only after 90 days and zero traffic using that field.
- Scale and failure consequences: No scale or failure-consequence facts are known.

## Preserve

- Retain customer records and the promised 90-day support for the old customer field name. Preserve rollback coverage for the transition.

## Current boundary

- `CustomerSerializer` owns request parsing and response serialization. Its existing deprecation-alias facility accepts either customer field name, rejects conflicting values, and emits both names from one internal value during a bounded transition.

## Ordinary paths

- Use `CustomerSerializer` for the field-name compatibility path and the existing migration runner for schema changes. Keep both API representations mapped to one internal value.

## Proof

- Verify stored customer data, both API representations, rollback, and removal of the old-name handling.

## Reconsider when

- After 90 days, remove old-name handling only when traffic using the old field is zero. No other condition requiring a different design is known.
