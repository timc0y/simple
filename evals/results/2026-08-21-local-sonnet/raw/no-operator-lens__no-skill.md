# Review: rename `loadAccount`

## Verdict

Approve. This is a same-file-scope internal rename with no external surface. The ordinary path in `SIMPLE.md` — rename the helper and its three callers directly — is sufficient. No further design, compatibility shim, or staged rollout is warranted.

## Why the plain rename is enough

- **No external consumers.** The repository facts state none exist, so there is no published name to preserve.
- **Nothing persisted.** The helper's name isn't stored or serialized anywhere, so there's no migration to write.
- **No compatibility commitment** was made for this internal symbol, so there's nothing to keep working under the old name.
- **Bounded blast radius.** Three known callers, all internal — small enough to update in the same change as the rename, with no need for a deprecation alias or re-export.

## What to check before merging

- All three callers are updated to the new name (not just the definition).
- The helper's return value and behaviour are unchanged — this is a rename, not a refactor.
- Run the affected tests and type-check.
- Search the repository for the old name to confirm no remaining reference (including comments, docs, or dynamic string lookups that a type-check wouldn't catch).

## What not to add

- No deprecated alias, wrapper, or re-export for the old name — nothing outside this codebase depends on it.
- No phased/two-step rename — there's no consumer to give time to migrate.
- No changelog or version bump entry tied to public API — this isn't a public contract.

## Reconsider if

Only revisit this scope if it turns out another repository or a published interface actually depends on `loadAccount`'s name. That fact isn't in evidence here, so it isn't a reason to slow this change down now.
