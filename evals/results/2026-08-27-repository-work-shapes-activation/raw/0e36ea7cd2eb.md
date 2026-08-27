## Decision

Add the import as one daily job owned and executed by the existing in-process runner. Do not add a worker, queue, or second scheduler.

The runner remains responsible for:

- triggering the job on its daily schedule;
- executing the import;
- retrying transient failures using its current retry policy.

The import itself must use the application’s existing customer write path and make repeated processing safe through a stable source-customer identity and durable import progress/completion state. Retrying a record or rerunning a completed daily job must converge on the same customer state, rather than create duplicates.

This is sufficient for the stated small-load deployment. Reconsider a separate execution system only when measured job duration/throughput, retry backlog, availability, or process-isolation requirements exceed what the runner can sustain.

## Proof required through the runner

| Behaviour | Proof |
|---|---|
| Scheduling | Start the runner with a controlled clock; verify exactly one import job is due and dispatched for a daily interval, and none before the next interval. |
| Execution | Run the dispatched job with a representative source response; verify customers are written through the normal customer persistence path and the run is recorded as successful. |
| Retry | Make the source fail transiently, then succeed; verify the runner—not import-specific retry code—reinvokes the same job according to its configured policy and the eventual run succeeds. |
| Idempotency | Run the same scheduled import twice, including after a retry boundary; verify the resulting customer count and customer values equal those from one successful run, with no duplicate source identities. |

The repository currently contains only the request in `prompt.md`; it has no application, runner, customer model, persistence boundary, or test harness to inspect. Therefore the exact schedule API, retryable-error classification, source identity, and durable progress location cannot truthfully be named yet. Those must be selected from the existing application’s runner and customer-write contracts when they are available.
