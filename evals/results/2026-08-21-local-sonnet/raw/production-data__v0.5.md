Requested outcome
Rename a persisted field and its public API representation for the "old-field-name" / "new-field-name" pair, without breaking published API clients during the promised transition and without losing or corrupting retained customer records.

Observed repository facts
- Production service with external API consumers; the API is published, so its shape is a contract, not an implementation detail.
- Persistent production data exists (retained customer records) and must survive the change.
- A 90-day deprecation promise is already in force; old and new clients must both keep working for that period.
- Schema changes go through the service's existing migration mechanism — that is the ordinary path for this change, not a new one.
- Proof must cover: stored data, both API representations, rollback, and removal criteria.
- Material unknown: SIMPLE.md does not say whether the existing migration mechanism supports an atomic rename or requires a multi-step expand/contract sequence. Establish this from the mechanism itself before choosing the migration's shape — do not assume either.

What must be preserved
- Customer data, exactly, through the rename (no field is dropped before its renamed replacement is verified correct).
- The published API contract under the old field name for the full 90-day window.
- The ability to roll back the migration during that window.

What may be replaced
- The internal persisted field name.
- The API's obligation to accept/emit the old field name, once the 90-day window has closed and old-client traffic has reached zero.

Existing owner and ordinary path
- The service's existing migration mechanism owns schema changes. Reuse its normal rename pattern; do not hand-write a parallel dual-write path.
- The API's serialization/mapping layer owns the shape of requests and responses. Reuse it to carry a temporary alias; do not add a new API version or endpoint for a field rename.

Smallest truthful design
1. Storage: rename the persisted field using the existing migration mechanism's normal approach for renames. If that mechanism supports an atomic rename with no downtime, use it directly — one migration, no parallel column. If it requires a staged sequence (expand, backfill, verify, contract), use that same sequence because it is already the mechanism's ordinary path, not a new prerequisite being introduced for this change.
2. API: add one bounded alias at the serialization boundary only, not in storage. Responses carry both the old and new field names with the same value, sourced from the single renamed field. Requests accept either name; if the service has an existing precedent for handling two names for one value (prefer the new name, or reject a conflicting pair), follow it rather than inventing a new rule. Mark the old name as deprecated in the response (e.g., a deprecation header or note) stating the removal date.
3. Reuse existing request/response logging or metrics to observe how much traffic still uses the old field name, so the exit condition is measurable rather than assumed.
4. When the 90-day period has ended and old-field-name traffic is zero, remove the alias from the serializer (stop accepting and stop emitting the old name) and remove the transition-only usage tracking.

Complexity removed or avoided
- No API versioning or new endpoint for the rename.
- No permanent dual schema or hand-maintained dual-write code; the migration mechanism handles the storage change once.
- No feature flag; the alias is bounded by the deprecation date and by observed old-client traffic, not by a toggle that could outlive its purpose.
- No new migration framework or process introduced beside the one the service already uses.

Relevant precedent
- Expand/contract schema renames are a known, applicable pattern here, but only if the existing migration mechanism doesn't already provide atomic renames — otherwise adopting it would add deploy steps the mechanism doesn't require, which is complexity without a present obligation.

Independent proof
- Stored data: after migration, compare values under the new field name against a pre-migration snapshot (row counts and value/checksum diff) using the migration mechanism's own verification step, independent of the API layer.
- Both API representations: run consumer-facing contract tests that send/receive the old field name and separately the new field name during the transition window, confirming identical resulting data.
- Rollback: exercise the migration mechanism's rollback path and confirm the API alias still serves correctly against the pre-rename schema.
- Removal criteria: a metric or log query showing zero requests/responses using the old field name, checked against the 90-day clock, before the alias is deleted.

Reconsideration condition
When the 90-day deprecation period has ended and old-field-name traffic has reached zero, remove the API alias and any monitoring that existed only to measure that traffic.
</content>
