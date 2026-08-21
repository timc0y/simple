# Daily customer import — design

## Facts from SIMPLE.md

- One deployment, small load, application team operates it.
- Daily imports may retry after transient failure — retry is already an accepted, ordinary behaviour, not a new obligation.
- Background work runs in-process today; no separate worker system is operated.
- An existing runner already schedules and retries jobs.
- Proof is expected through that runner: scheduling, execution, retry, idempotency.
- Reconsider only if measured load or isolation needs exceed what the runner can do.

These facts settle the shape of the answer before any code is discussed: the ordinary path is the existing in-process runner, and nothing here shows a reason to depart from it.

## Missing facts to establish before implementation

The profile does not say, and I have not assumed:

- The customer source (API, file drop, database) and its auth/connection details.
- A stable external customer identifier to use as the upsert key.
- Approximate record volume per run (needed only to check it stays inside "small load," not to size new infrastructure).
- Which customer fields are owned by the import versus owned locally and must not be overwritten.

These should be confirmed with whoever owns the source system before writing the job. None of them changes the design below; they change only its field mapping and connection code.

## Make complexity pay rent

```
Observed need:            One customer record set must be synced from a source into
                           the application daily.
Existing owner:            The in-process job runner already used for scheduled work.
Ordinary path:             Register a new job type with the runner; it schedules and
                           retries it like every other job.
Exact obstruction:         None. The runner has no gap that blocks a daily import —
                           this is an ordinary scheduled job, not a new capability.
Missing precondition:      None at the runner level. At the data level: a stable
                           external customer ID to make the import idempotent.
Smallest reversible experiment: Add one job function, one daily schedule entry, and
                           an upsert keyed by that external ID. Reuses everything.
Can the existing owner remain: Yes — the runner remains sole owner of scheduling,
                           retry, and execution.
New concept or state, only if still required: None. No queue, no worker service, no
                           bespoke scheduler, no distributed lock.
Failure and cleanup states: A transient failure (network, source timeout) fails the
                           job; the runner's existing retry handles it. A single bad
                           record is skipped and counted, not fatal to the run.
Independent proof:        Trigger the job through the runner's own interface, not by
                           calling the import function directly.
Reconsideration condition: If measured volume or isolation needs exceed what the
                           in-process runner supports (per SIMPLE.md).
```

## Design

**Job.** One new job type, e.g. `import-customers`, registered with the existing runner using the same registration pattern as other jobs. It carries no new execution model, retry policy, or logging path — it inherits the runner's.

**Schedule.** One daily schedule entry pointed at this job, using the runner's existing scheduling mechanism (whatever already fires other daily/periodic jobs). No new scheduler.

**Body of the job.**
1. Fetch the current customer set (or delta, if the source supports one) from the source.
2. For each record, upsert locally keyed by the source's external customer ID — never by name, email, or any field that can change or collide.
3. Continue past a single record's validation failure; count and log it. Do not fail the whole run for one bad record.
4. Let any error that isn't per-record (source unreachable, auth failure, malformed response) raise and fail the job, so the runner's existing retry applies.

**Idempotency.** The upsert-by-external-ID makes re-running the same day's import (after a retry, or a manual re-run) produce the same end state rather than duplicate customers. This is the one piece of new logic this design needs; everything else is reuse.

**What this deliberately omits, and why:**
- No separate worker process or queue: SIMPLE.md states background work runs in-process and no separate worker system is operated; nothing about a daily customer import changes that.
- No custom retry/backoff: the runner already retries; a second retry mechanism would be a second source of truth for failure handling.
- No new scheduler or cron layer: the runner already schedules jobs.
- No batching/pagination framework: "small load" is the stated scale; add this only if a measured record count requires it, per the reconsideration condition.

## Proof

Verify through the runner, not by calling the import code in isolation:
1. Trigger `import-customers` through the runner's normal execution path and confirm customers appear/update as expected.
2. Force a transient failure (e.g. make the source temporarily unreachable) and confirm the runner retries per its existing policy, and the job eventually succeeds.
3. Re-run the same day's import (simulating a retry or manual re-trigger) and confirm no duplicate customers are created — the idempotency check.
4. Confirm the daily schedule entry fires the job once per day through the runner's scheduling, not through a separate timer.

## Reconsider when

Only if measured load or isolation requirements exceed what the in-process runner can support, per the repository's SIMPLE.md. Until that's observed, no queue, worker service, or separate scheduler is justified.
