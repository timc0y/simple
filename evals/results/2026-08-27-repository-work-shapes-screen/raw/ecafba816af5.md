## Recommended design

Add one daily `customer_import` job to the existing runner.

Flow:

1. The runner starts the job once per day.
2. The job reads customers from the external source.
3. It validates required fields and maps them to the application’s customer model.
4. It upserts each customer using the source’s stable customer ID.
5. It records success only after all records are processed.
6. Transient failures are retried by the existing runner.

Use the existing in-process runner for scheduling and retries. Do not add a worker service, queue, or second scheduler.

### Required invariant

Running the same import repeatedly produces the same customer state:

```text
source customer ID → one local customer
```

The import must therefore use a unique constraint on the source/customer identifier and an idempotent upsert. Process records in bounded batches if the source is large; a retry may safely repeat a completed batch.

### Ownership

The import job owns only source access, validation, and mapping. The existing customer model and persistence layer remain the source of truth for local customers. Reuse the normal customer write path where possible so its validation and business rules apply consistently.

### Failure handling

- Invalid records: reject and report them without silently changing customer data.
- Transient source or database failures: let the runner retry.
- Partial progress: retrying is safe because writes are idempotent.
- Final status: expose success, failure, record counts, and rejected-record counts through the runner’s existing job reporting.

Do not add checkpoints, reconciliation workflows, or deletion logic until the source’s volume and deletion contract require them. Deletion semantics are especially important: default to preserving local customers unless the source explicitly guarantees that absence means deletion.

### Proof

Verify through the runner:

- the job runs on the daily schedule;
- a successful import creates and updates customers;
- repeating the same input creates no duplicates;
- transient failure retries successfully;
- invalid records are contained and reported;
- a failed run does not report success.

### Facts still needed before implementation

- Source type and authentication method.
- Stable source identifier and field mapping.
- Required validation rules.
- Schedule timezone and acceptable completion window.
- Expected record volume.
- Whether source deletions must propagate locally.
