## Design: daily customer import

**Observed need** — a batch job that pulls customer data from the external source once a day and upserts it into the system, tolerating transient failures.

**Existing owner** — the existing runner. SIMPLE.md states it already schedules and retries background jobs in-process, and that this behaviour must be preserved.

**Ordinary path** — register the import as one more job on that runner: a daily schedule entry plus a handler function. No new scheduler, queue, worker process, or cron layer.

**Exact obstruction** — none. There's no capability gap in the runner; the only missing piece is the import logic itself (fetch source, upsert rows).

**Missing precondition** — an idempotent `importCustomers()` handler. "Idempotent" is the load-bearing word: the runner will retry on transient failure, so a rerun must not create duplicates or corrupt partial state.

**Smallest design**
- One job definition registered with the existing runner, scheduled daily, using its existing retry policy — don't add a second retry mechanism on top.
- The handler upserts customers keyed on a stable external identifier (e.g. customer ID from the source system). Upsert-by-key is what makes a retried or re-run job safe — no separate checkpoint table, resume cursor, or dedupe log is needed at current volume.
- No new job-tracking state beyond what the runner already records (last run, status, retry count).

**Failure and cleanup states** — a failed fetch or partial write is handled by the runner's existing retry; the next attempt re-upserts the same batch harmlessly because of the key-based upsert. Nothing to clean up separately.

**Independent proof** — through the runner's own surface, per SIMPLE.md's Proof section:
1. Scheduling: confirm the job fires at the configured daily time.
2. Execution: run it against a sample source file/feed and confirm customers land correctly.
3. Retry: force a transient failure (e.g. simulate a fetch error) and confirm the runner retries per its existing policy, not a new one.
4. Idempotency: run the same import twice and confirm no duplicate or corrupted customer records — this is the upsert key doing its job.

**Reconsider when** — only if measured load or an isolation requirement (separate failure domain, separate resource limits, separate deploy cadence) exceeds what the in-process runner can do. Nothing here indicates that today, so no separate worker/queue system is warranted.

The whole job is: one job registration + one idempotent upsert handler. No new scheduling, retry, or worker infrastructure.
