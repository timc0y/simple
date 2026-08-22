# Daily customer import

## Outcome

Add the daily customer import as one job on the existing runner. No new scheduler,
queue, or worker system.

## Facts (from this repository's SIMPLE.md)

- One deployment at current small load; the application team operates it.
- Background work runs in-process; no separate worker system is operated.
- The existing runner already schedules and retries jobs, and daily imports may need
  to retry after transient failure.
- Existing scheduling and retry behaviour must be preserved.
- Reconsider this shape only if measured load or isolation requirements exceed the
  runner's capability — not before.

## Owner and ordinary path

The runner is the existing owner of scheduled, retryable background work. The
ordinary path is: register a job with the runner, give it a schedule, let the runner
handle timing and retry. A daily customer import is an ordinary instance of that
path, not a new kind of work. Nothing here requires a second scheduler, a cron
container, or a queue-backed worker — that machinery would duplicate what the runner
already owns and would violate the "no separate worker system" boundary for no
present reason.

## Missing precondition

The runner can already schedule and retry a job. What it does not yet have is the
import job itself: the code that fetches customer records from their source and
writes them to their destination. That is the only missing capability. Before
writing it, three facts must be established (not assumed) from the actual source and
destination systems, because they determine whether retries are safe:

- The stable external identifier a customer record can be upserted on (so a retried
  or re-run import does not create duplicates).
- Whether the source can report "changed since <timestamp>" or only returns a full
  snapshot each time (this decides whether the job does an incremental sync or a
  full upsert pass).
- What a partial failure leaves behind — whether writes are already committed
  per-record or need to be resumable from a checkpoint.

If these are unknown, establish them from the source/destination systems before
implementation; do not guess at a schema to keep the design moving.

## Design

1. Write one job function: fetch customers from the source, transform to the
   destination shape, upsert by the stable external identifier.
2. Make the upsert idempotent: re-running the same batch (whether from a retry or
   from the next day's run overlapping) must not create duplicate customers or
   revert newer data with stale data.
3. Register the job with the existing runner on a daily schedule, using the runner's
   existing scheduling and retry configuration — do not add a second retry loop
   inside the job itself; let the runner own retry policy as it already does for
   other jobs.
4. Use the destination's existing data-access code and the source's existing client
   if either already exists in the repository; only add a new client if neither does.
5. Log the run's outcome (records seen, upserted, skipped, failed) through whatever
   the runner already uses for job observability, so a failed run is diagnosable
   without new tooling.

## Preserved and not introduced

- Preserved: the runner's scheduling and retry behaviour, and the in-process
  execution boundary.
- Not introduced: a new worker system, a new scheduler, a new queue, or a second
  retry mechanism. None is justified by the stated scale (one deployment, small
  load) or by any stated obligation.

## Proof

Verify through the runner, per the profile's proof method:

- Scheduling: the job fires once per day at the configured time.
- Execution: a normal run fetches and writes the expected customer records.
- Retry: forcing a transient failure (e.g., a source timeout) causes the runner to
  retry, and the retried run completes successfully.
- Idempotency: running the job twice against the same source data (a real retry or a
  manual re-run) leaves the destination in the same state as running it once — no
  duplicate or reverted records.

## Reconsider when

Only if measured load or isolation requirements exceed what the in-process runner
can handle — for example, the import starts blocking other scheduled work, or the
data volume makes a single in-process run too slow or too memory-heavy for the
runner's execution model. Until that is measured, a separate worker or scheduler is
not justified.
