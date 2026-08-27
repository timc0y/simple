## Daily customer import — design

**Rent check**

```
Observed need: import customer records once a day, small load, transient-failure retries.
Existing owner: the existing in-process runner (schedules and retries jobs today).
Ordinary path: define a job, the runner schedules it daily and retries on transient failure.
Exact obstruction: none — the runner already does scheduling and retry. The only missing piece is the job itself.
Missing precondition: an idempotent import job function to hand to the runner.
Smallest reversible experiment: register one job with the runner; no new scheduling/queue/worker system.
Can the existing owner remain? Yes — SIMPLE.md requires preserving its scheduling and retry behaviour.
New concept or state, only if still required: an idempotency key/watermark so retries don't duplicate customers.
Failure and cleanup states: partial import on crash mid-run; retry must resume safely, not double-apply.
Independent proof: run the job through the runner (not by calling the import function directly) and check scheduling, execution, retry, and idempotency.
Reconsideration condition: measured load or isolation needs exceed what the in-process runner can handle (per SIMPLE.md).
```

**Design**

1. **Owner**: the existing runner. Do not add a scheduler, cron process, message queue, or separate worker service — none of that is justified by "small load, single deployment, app-team-operated."
2. **The job**: one function, `import_customers`, registered with the runner on a daily schedule, same way other jobs are registered. It:
   - Fetches the source data (file/API — whatever the current integration point is).
   - Upserts customers by a stable natural key (e.g. external customer ID), not insert-only. This is what makes retries safe.
   - Records the run's outcome (success/failure, row counts) wherever existing jobs already log/report that — reuse that mechanism rather than inventing a new one.
3. **Idempotency**: rely on upsert-by-key rather than a separate dedup ledger or distributed lock. A daily import at small scale re-running from scratch on retry is cheap and correct if writes are upserts; that's the smallest mechanism that satisfies "retry after transient failure" from SIMPLE.md.
4. **What's explicitly not added**: no new job-orchestration framework, no separate worker/queue system, no cross-run state store beyond the customer table itself. None of these are supported by a present obligation — they're the kind of thing to reconsider only if load or isolation needs later exceed the runner's capability, per SIMPLE.md's own "Reconsider when."

**Proof**

Verify through the runner's own surface, per SIMPLE.md's Proof line: trigger the schedule and confirm the job runs at the expected time; force a transient failure and confirm the runner retries; run the job twice (or replay a retry) against the same source data and confirm the customer table ends in the same state, not duplicated. Don't invoke `import_customers` directly as the test — that would prove the function works, not that scheduling/retry/idempotency work end-to-end.
