The smallest safe move is: have each accepted webhook enqueue a deduplicated sync request, let the existing sync owner process it asynchronously, and retain the nightly cron as a temporary reconciliation backstop.

## Facts and unknowns

The repository contains only the request, not the sync or webhook implementation. Before changing ownership, establish:

- Whether the sync is already callable independently of cron.
- Whether Postgres writes are transactional and idempotent.
- Whether duplicate or out-of-order webhooks are possible.
- Whether a durable job runner, queue, or retry mechanism already exists.
- The third-party API’s quota, burst, retry, and pagination rules.

Do not make the webhook handler perform the sync inline. It must authenticate the webhook, record work durably, and acknowledge quickly.

## Smallest safe plan

1. Preserve the existing sync logic and its Postgres source of truth. Change only its trigger from “nightly cron” to “queued work from a webhook.”

2. On every valid webhook, create or update one pending work item for the affected resource. Deduplicate by resource and event/version, so retries and duplicate deliveries do not multiply API calls.

3. Process work asynchronously through the existing worker or job mechanism. If none exists, use the smallest durable Postgres-backed work table and worker, since Postgres is already a required dependency.

4. Put one shared rate limiter around all third-party API calls. It must apply during the transition to both webhook-triggered work and the remaining cron, with bounded retries and backoff for throttling and transient failures.

5. Make the existing Postgres write path safe to repeat. Use the current stable resource identity, transactional upserts, and a checkpoint or event/version rule if older webhooks could overwrite newer state.

6. Deploy with cron still enabled. Let cron reconcile missed, failed, or temporarily throttled webhook work. Remove or reduce cron only after webhook delivery and processing coverage are demonstrated.

## Behaviour that must be preserved

- Webhook authentication and validation.
- Existing sync selection, pagination, and API semantics.
- Postgres transaction boundaries, keys, constraints, and retained data.
- Correct handling of duplicate, delayed, and out-of-order webhooks.
- Third-party rate limits, retry rules, and failure visibility.
- Nightly coverage for missed webhooks during rollout.
- Operator recovery: failed work must remain observable and retryable.
- Webhook response latency and acknowledgement semantics.

## Verification

Verify through the public webhook and worker paths, not only by calling the sync directly:

- Send one valid webhook and confirm one queued sync, the expected API calls, and the expected Postgres result.
- Redeliver the same webhook and confirm no duplicate logical write or unnecessary API call.
- Send events out of order and confirm older data cannot replace newer state.
- Exercise API throttling, timeout, and failure responses; confirm backoff, bounded retries, durable failure state, and no rate-limit breach.
- Kill or restart the worker after enqueue and during processing; confirm work is not silently lost and repeat processing is safe.
- Compare webhook-triggered results with a controlled nightly reconciliation for the same resources.
- During the rollout window, measure webhook receipt-to-sync completion, failed and pending work, duplicate suppression, API request rate, and Postgres write errors.

Only disable the nightly path when webhook delivery is durably recorded, processing failures are recoverable, and reconciliation shows equivalent results. If webhook coverage cannot be proven, retain a lower-frequency reconciliation job rather than removing the safety net.
