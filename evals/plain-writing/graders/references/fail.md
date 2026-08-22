# 🎯 Project plan: loadAccount → loadCustomer migration initiative

## Phase 1 — discovery 🔍

We will begin with a stakeholder alignment pass and a full audit of the codebase.

## Phase 2 — compatibility

To protect any external integrations that may exist, keep `loadAccount` as a
deprecated alias emitting a warning for one release cycle, and version the module.

## Phase 3 — rollout

| Step | Owner | Status |
| --- | --- | --- |
| Alias created | TBD | 🟡 pending |
| Callers migrated | TBD | 🟡 pending |
| Alias removed | TBD | 🔴 blocked |

> **Note:** as with any migration, communication is key! A FAQ will follow.
