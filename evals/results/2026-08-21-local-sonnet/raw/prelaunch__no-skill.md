# Rename `account_id` to `customer_id`

## What the repository facts settle

From this case's `SIMPLE.md`:

- Pre-launch, internal development only — no external consumers, no persistent production data, no compatibility commitments.
- The only thing to preserve is that the field has one meaning throughout the application.
- The application supports only its current development version — there is no "old version" to keep working.
- Reconsider only if a consumer or retained dataset ends up depending on the field.

None of those facts are true today, so none of the usual rename safety machinery is justified here. Concretely, this rules out:

- A backward-compatible alias or dual read/write period for `account_id` and `customer_id`.
- An additive migration (add `customer_id`, backfill, dual-write, drop `account_id` later).
- A deprecation window, feature flag, or versioned API field.
- Keeping `account_id` as a synonym "just in case" something external reads it.

There is no external consumer and no data to preserve across the change, so a straight, one-shot rename is the smallest truthful design. Anything more is solving a migration problem that doesn't exist yet.

## Proposed implementation

1. **Database schema**: a single migration that renames the column (`account_id` → `customer_id`) on the relevant table(s) in place. No shadow column, no backfill step, no follow-up "drop old column" migration — because there's no production data this needs to survive, and no consumer reading the old column mid-flight.

2. **Model / ORM layer**: rename the field/attribute on the model definition itself, not an aliased accessor. Update any explicit column mappings, factories, fixtures, and seed data that reference `account_id`.

3. **Application code**: rename every reference in the call chain — service/business logic, query builders, serializers/DTOs, request and response schemas, validators, route/query params, and background jobs — so `customer_id` is the only name used. Search the whole codebase for the literal string `account_id` (including string keys, e.g. JSON payloads, SQL fragments, log fields) rather than relying on IDE rename alone, since some references (raw SQL, JSON keys, env vars, string-based config) won't be caught by a type-driven rename.

4. **API contracts**: if the field appears in request/response bodies, rename it there too — there are no external consumers, so there's no reason to keep the old wire name for compatibility.

5. **Frontend / clients**: rename the field in any internal client code, types, GraphQL/OpenAPI schemas, and UI copy that reference it.

6. **Tests and fixtures**: rename `account_id` in test data, assertions, and mocks so tests exercise and confirm the new name rather than merely tolerating it.

7. **Docs and comments**: update inline comments, README/API docs, and any onboarding notes that mention `account_id`.

Do this as one coordinated change rather than a phased rollout — a single PR (or a small stack of mechanically-scoped commits: schema, model, application code, tests/docs) is enough, since there's no live traffic or external system to sequence around.

## Proof

Per this case's `Proof` section:

- Run the affected tests.
- Run the type-check.

A clean run of both is sufficient evidence the rename is complete and consistent — there's no separate "migration verified" step needed, because there's no data migration in the traditional sense, just a schema and code rename.

## When to reconsider

If, after this change, a real external consumer or a dataset that must be retained turns out to depend on `account_id`, that's new information this profile didn't have — at that point, reopen the design (e.g., consider an alias or a phased migration) rather than assuming the pre-launch shortcut still applies.
