I'll explore the workspace to understand the actual codebase before proposing anything.This is essentially an empty project — just the case `SIMPLE.md`, a `prompt.md`, and config. So this is a design exercise driven by the case facts. Let me read the compatibility reference and the prompt.## Proposal: rename a persisted field and its public API representation

Grounded in `SIMPLE.md`: production service, external published API clients, a 90-day deprecation commitment, retained customer data, and an existing migration mechanism.

### Design
Smallest honest path (per `compatibility.md`): rename the column once via the existing migration, and translate the name **only at the API boundary** with one bounded 90-day adapter. No dual columns, no dual writes, no API versioning.

**1. Persisted field (internal, ordinary path)**
- Migration (existing mechanism): rename `old_field` → `new_field`; data moves with it. Keep a reversible down-step.
- Service code references `new_field` only.

**2. Public API representation (the one missing capability)**
- A single bounded adapter at the JSON boundary that:
  - accepts both `old_field` and `new_field` on input → writes the canonical `new_field`;
  - emits both names on output → reads the canonical `new_field`.
- Exit condition attached: remove it after 90 days **and** old-field request traffic = 0.

**3. Lifecycle**
- At deploy: publish deprecation notice + docs marking `old_field` removal date.
- At exit: drop the adapter and `old_field` from the API.

### Proof (independent of the implementation)
- Stored data: row counts/values under `new_field` equal pre-migration `old_field`.
- Both API reps: requests using each name both succeed; responses contain both names.
- Rollback: migration down-step + adapter restore service and clients on `old_field`.
- Removal criteria: an old-field-usage metric exists and reaches zero.

### Assumptions to confirm
- "Public API representation" covers **both** request and response directions.
- There is one JSON serialization point for the adapter (an existing DTO/mapping layer); otherwise it sits in the request/response DTO.
- The 90-day clock starts at adapter deploy.

No new dependency, version, or permanent abstraction is introduced — the only addition is the time-boxed boundary adapter, which pays rent through the stated 90-day contract.
