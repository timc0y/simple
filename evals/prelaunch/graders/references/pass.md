# Plan: rename `account_id` to `customer_id`

## Outcome

Every occurrence of `account_id` becomes `customer_id`, with one meaning for the
field throughout the application.

## Relevant facts (from SIMPLE.md)

- Pre-launch; internal development only. No external consumers. No persistent
  production data. No compatibility commitments.
- The application supports only its current development version — there is no
  older version or deployed data to stay compatible with.

These facts rule out the machinery a rename would otherwise need: no dual read/write,
no deprecation window, no versioned API contract, no data migration, no backward-
compatible alias. There is nothing running today that a compatibility layer would
protect.

## Preserve / replace

- Preserve: the field's single meaning and its behaviour everywhere it is used.
- Replace freely: the name `account_id` itself, in code, schema, fixtures, and
  in-repo docs. Nothing external depends on the old name, so nothing needs to keep
  recognizing it.

## Existing owner and ordinary path

The model that defines the field is the owner. The ordinary path is a direct rename
through that model and its callers — no new abstraction, adapter, or second field is
justified, because no consumer or retained dataset needs the old name to keep
working.

## Smallest truthful design

A single, atomic rename:

1. Rename the field on the owning model/schema definition (and any migration file
   that defines the current dev schema — edit it in place rather than adding a new
   migration, since there is no production data to preserve through a migration
   history).
2. Search the codebase for every reference to `account_id` (code, types/interfaces,
   serializers, query builders, config, fixtures, seed data, tests) and rename each
   to `customer_id` in the same change.
3. Rename any local dev/test database column or in-memory store key to match.
4. Update in-repo documentation, comments, and example payloads that mention
   `account_id`.
5. Do not add a compatibility alias, dual field, or feature flag — none of these
   have a named consumer or retained-state obligation to justify them.

## Complexity avoided

- No migration strategy, expand/contract rollout, or versioned field, because there
  is no persistent production data and no external consumer to migrate.
- No compatibility shim or alias, because nothing outside this change reads
  `account_id`.
- No phased rollout or feature flag, because there is no deployed audience to
  sequence the change for.

## Proof

- Run the affected tests and type-check, per SIMPLE.md's stated proof. A full-text
  search for `account_id` returning no results (outside of unrelated matches, e.g.
  third-party dependencies) is the independent check that the rename is complete.

## Risks / unknowns / reconsideration condition

- If any consumer or retained dataset outside this repository turns out to depend
  on `account_id` (contradicting the "no external consumers" / "no persistent
  production data" facts), stop and re-check those facts before proceeding — that
  would require a compatibility or migration step this plan does not include.
- This plan assumes a single owning model for the field. If the rename touches
  multiple independently owned services or repositories, confirm ownership boundaries
  before treating this as one atomic change.
