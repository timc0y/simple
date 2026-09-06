# Simple

## Reality

- One service writes audit events and an incident tool reads them.
- The service team owns the event schema and migration.
- Events are retained for compliance and incident review.

## Preserve

- `actor`, `action`, `target`, and `retention_days` remain queryable fields.
- Existing incident-tool queries and retention enforcement continue to work.

## Current boundary

- The event schema owns stored fields; the incident tool consumes the structured record.

## Ordinary paths

- Add the requested field to the existing schema and update its writer and reader.

## Proof

- Write an event with all fields, query each preserved field, render `summary`, and
  verify retention enforcement still uses `retention_days`.
