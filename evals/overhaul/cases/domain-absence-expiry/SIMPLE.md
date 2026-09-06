# Simple

## Reality

- The profile service owns account lookup and `expires_at` evaluation.
- Callers show different messages for never-created and expired accounts.
- The database can distinguish no row from a row whose expiry has passed.

## Preserve

- The distinction between absent and expired accounts at the service boundary.

## Current boundary

- The lookup service returns the domain outcome; callers should not infer it from time.

## Ordinary paths

- Check row existence, then evaluate expiry for an existing row and return distinct
  outcomes.

## Proof

- Query a missing ID and an expired row at the same clock instant and verify distinct
  outcomes and caller messages.
