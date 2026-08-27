## Implementation proposal — rename a persisted field + its public API name

Applying the case `SIMPLE.md` facts through Simple's design order.

**1. Obligations (from SIMPLE.md, not inferred)**
- Production data: retained customer records persist — must survive, not be lost/corrupted.
- External consumers: published API clients.
- Commitment: a 90-day deprecation promise; both old and new clients must work during it.
- Ordinary path: schema changes go through the service's existing migration mechanism.
- Proof required: stored data, both API representations, rollback, removal criteria.

**2. Required invariant**
A field is renamed in the store and in the public API, while for 90 days the old and new names are each accepted on input and emitted on output, and no customer record loses or corrupts its value.

**3–4. Owner and missing capability**
- Store rename → existing migration mechanism (it is the owner). The missing capability is purely the *transition representation*, not a new system.
- API → the existing serialization boundary is the owner. The missing capability is one bounded adapter that maps old↔new field names.

**5. Preserve vs replace**
- Preserve: customer data (migrate, never drop mid-transition) and the old API field name for the window.
- Replace: the internal canonical name to the new one.

**6. Smallest honest design**
- **Schema (existing migration path):** add the new field/column, backfill from the old, leave the old in place for the window. Do not drop the old during deprecation.
- **API (one bounded adapter at the serialization layer):** on read, emit both old and new names with the same value; on write, accept either name and write to the canonical (new) field. One adapter, documented exit condition.
- No API versioning, no dual-write system, no feature flag, no shadow store. (Per compatibility.md: real old+new callers → one bounded adapter with an exit condition.)

**7. Removal (exit condition)**
When the 90-day period ends **and** old-client traffic reaches zero: drop the old field name from the adapter and drop the old column via the same migration mechanism.

**8. Proof (per SIMPLE.md "Proof")**
- Stored data: row counts and values unchanged after backfill.
- Both API representations: old-name and new-name requests/responses return identical values; old-name write persists.
- Rollback: migration is reversible (re-add old column, no destructive step mid-transition).
- Removal criteria: documented trigger (window elapsed + zero old traffic).

**Open questions to confirm before build**
- Is the old name write-only-read, or must old clients also *write* with the old name? (SIMPLE.md says "must work," so I assume bidirectional — flag if wrong.)
- What is the concrete field/column and the existing migration tool? Those are repo facts absent here; the design reuses whatever the existing mechanism is.

Want me to draft this as a written plan doc, or proceed to a step-by-step build plan once you confirm the two open points?
