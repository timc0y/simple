Read this case's `SIMPLE.md` and design the failure handling for the existing provider
router.

The primary provider has intermittent 10-second timeouts during a short network
incident. A second provider is available, but it has a lower rate limit and is more
expensive. The primary normally meets the service target. The router already records
provider-neutral request IDs and owns retry classification.

State what should happen during the incident and after recovery. Include retry and
promotion behaviour, identity preservation, and proof.
