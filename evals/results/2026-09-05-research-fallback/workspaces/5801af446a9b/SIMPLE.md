# Simple

## Reality

- Stage and users: One deployment uses the router and reconciliation consumer.
- Operators: The application team owns the result type and cache.
- Persistent production data: Cached results and reconciliation records are retained.
- Consumer obligation: Reconciliation distinguishes `id`, `kind`, and `version`; operators
  inspect `source` during incidents.

## Preserve

- Every identity field: `id`, `kind`, `source`, and `version`.
- Existing cache and reconciliation behaviour.

## Current boundary

- The router owns the structured result record.
- The proposed `source:id` string has no place for `kind` or `version`.

## Ordinary paths

- Change the result type and cache-key derivation at the router boundary, then migrate
  its existing consumers.

## Proof

- Run same-ID/different-kind and same-ID/different-version fixtures through both provider
  paths and verify cache separation, reconciliation identity, and source observability.

## Reconsider when

- Remove a field only after its consumer obligation and retained data are retired with
  independent evidence.
