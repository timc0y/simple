The router should remain primary-first. During the incident, classify the 10-second timeout as transient, consume the existing bounded retry budget, and then make one controlled fallback attempt through the integrated secondary provider. Secondary traffic must respect its lower rate limit and cost; when its budget is exhausted, fail clearly rather than retrying indefinitely.

A fallback is per request, not a permanent promotion. The existing health signal may temporarily reduce or suspend new primary attempts only if it already supports that decision, with a bounded cooldown and recovery probes. Do not make the secondary the default because of one short incident.

After the primary shows sustained successful probes and normal requests, restore primary-first routing and stop sending new traffic to the secondary except for its ordinary fallback role. Clear any temporary suppression through the existing health-state mechanism. Permanent promotion requires measured sustained primary failure and an explicit routing decision.

Every attempt for one logical request keeps the same provider-neutral request ID. Provider-specific attempt IDs and provider names may be recorded separately for diagnosis, but must not replace or regenerate the logical ID. Retries and fallback therefore remain one request to callers, and downstream deduplication or idempotency remains intact.

Proof should exercise:

- primary timeout → bounded primary retries → successful secondary fallback;
- secondary rate-limit exhaustion → bounded, explicit failure;
- repeated requests → stable provider-neutral request IDs across retries and fallback;
- recovery probes and successful primary calls → restoration of primary-first routing;
- repeated or prolonged primary failure → no automatic permanent promotion without the required explicit decision.

Inspect route selection, attempt counts, provider usage, health transitions, cost/rate-limit protection, outcome, and request identity through the router’s public interface and emitted records.
