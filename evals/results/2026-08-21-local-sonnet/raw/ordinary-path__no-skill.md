# Design: Daily Customer Import

## Reality (from this repository's SIMPLE.md)

- One deployment, current load is small.
- The application team operates this system — no separate platform/ops team to hand background work to.
- Daily imports may fail transiently and need to retry; that's an accepted, expected condition, not an edge case.
- Background work already runs in-process. There is no separate worker system today.
- An existing runner already does scheduling and retry for jobs like this.
- Preservation goal: keep the existing scheduling and retry behaviour intact.
- Reconsider trigger: only add a separate worker/queue system when measured load or isolation requirements exceed what the in-process runner can do. That hasn't happened.

These facts settle most of the "how do we run this" questions before any design work starts: this is a job registered with the existing in-process runner, not a new pipeline, queue, or scheduler.

## Decision

Implement the daily customer import as one job function registered with the existing runner, scheduled once a day, using the runner's existing retry behaviour. No new scheduling system, no new worker process, no new queue or message broker, and no bespoke retry/backoff logic — all of that already exists and is explicitly something to preserve, not replace.

The only new things this task actually requires are:

1. The import logic itself (fetch/parse customer data, upsert into the store).
2. Idempotency, so a retried run doesn't duplicate or corrupt data.
3. Enough observability to know whether a run succeeded, failed, or partially applied.

## Design

### 1. Job registration

Add a single job to the existing runner, scheduled daily (e.g. `0 2 * * *` or whatever convention the runner already uses for daily jobs — follow the existing pattern rather than inventing a new one). Do not add a second scheduler, cron library, or external trigger; the runner already owns this.

### 2. Import function shape

```
async function importCustomers(context) {
  const batch = await fetchCustomerBatch(context.source, context.checkpoint);
  for (const record of batch) {
    await upsertCustomer(record); // idempotent by natural key, see below
  }
  await context.checkpoint.advance(batch.cursor);
}
```

- **Source of truth for "did this record apply already?"**: upsert keyed on the customer's stable external ID (whatever the source system provides), not an internal auto-increment. This makes re-application safe by construction — running the same record twice produces the same end state.
- **Idempotency at the run level, not just the record level**: if the runner's retry re-invokes the whole job after a partial failure, the job must be safe to re-run from the start (or from a checkpoint). Because upserts are keyed and side-effect-free beyond the write itself, replaying already-applied records is harmless. If the source only supports a windowed/paged pull, persist a cursor/checkpoint so a retry resumes rather than reprocessing the entire day's file from record one — this matters only if the source is large enough that reprocessing is expensive; if the daily file is small, skip the checkpoint and just re-run the whole batch, since idempotent upserts make that correct anyway.
- **Failure semantics**: let individual record failures fail the job (or a batch, if batching) rather than silently swallowing them, so the runner's existing retry does its job. Don't build a custom retry loop inside the import function — that duplicates behaviour the runner already owns and is explicitly out of scope to change.

### 3. What this deliberately does not include

- No new worker/queue infrastructure (Sidekiq/SQS/etc.) — current load doesn't warrant it, and the reconsider condition for that hasn't been met.
- No distributed lock service to prevent overlapping runs — one deployment, in-process runner; if the runner already guarantees non-overlapping scheduled execution, that's sufficient. Only add locking if the runner doesn't already provide it and overlapping runs are observed to be possible (e.g. a run overlaps its own next schedule because it's still going).
- No bespoke exponential backoff or retry-count logic — the runner already provides this and it's explicitly named as behaviour to preserve.
- No speculative multi-source or pluggable-importer abstraction — there's one customer source today; build for that source, not for imports-in-general.

## Proof

Verify the same four properties the profile already asks for, applied to this job specifically:

- **Scheduling**: the job fires once daily via the existing runner's schedule, using the runner's test harness/fixtures if it has one.
- **Execution**: a normal run against a representative batch produces the expected upserted customers.
- **Retry**: simulate a transient failure mid-run (e.g. a network error on one record or one page) and confirm the runner retries per its existing policy, and that the eventual successful run leaves data correct.
- **Idempotency**: run the same batch twice (or trigger a retry after partial success) and confirm the resulting customer records are identical to a single successful run — no duplicates, no corrupted fields.

## Reconsider when

Keep this design as-is unless one of these becomes true:

- Measured load (customer volume, source latency, or run duration) exceeds what the in-process runner can handle within its schedule window — at that point, evaluate a separate worker system, not before.
- The import needs isolation from the rest of the application process (e.g. it's starving other in-process work, or a failure in it is taking down unrelated functionality) — that's a signal for a separate process/worker, not a reason to build one preemptively.
- A second data source or destination appears — only then is a pluggable/abstracted importer justified; one source today means one concrete implementation today.
