# Simple

## Reality

- This production service has published API clients and retained customer records.
- The API promises the old customer field name for 90 days.
- Old and new clients must both work for 90 days.
- Operators, scale, failure, and security facts are unknown.

## Preserve

- Preserve retained customer records.
- Preserve the old customer field name for 90 days.
- Preserve old and new clients for 90 days.
- Preserve the transition until 90 days and zero old-field traffic.

## Current boundary

- The service supports old and new clients for 90 days.
- `CustomerSerializer` owns request parsing and response serialization.
- Its alias facility accepts either name, rejects conflicting values, and emits both names from one internal value.

## Ordinary paths

- Use the migration runner for schema changes.
- Use `CustomerSerializer` for request parsing and response serialization.
- Use its alias facility to accept either name, reject conflicts, and emit both names from one value.

## Proof

- Verify stored data, both API representations, conflict rejection, rollback, and removal.

## Reconsider when

- Keep the transition for 90 days.
- Keep the transition until old-field traffic is zero.
- Remove the old name after 90 days and zero old-field traffic.
