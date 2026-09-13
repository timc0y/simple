Recommendation: add push as a case for now, while extracting only any clearly shared validation/provider plumbing. Do not introduce per-channel classes behind an interface solely because push is planned.

The workspace has no repository to inspect—only the prompt—so there is no evidence that an abstraction currently pays for itself. In a typical small Node service, classes and dependency injection would add concepts without removing a present obligation. A switch is acceptable when channel selection remains simple and the function owns the complete notification policy.

Before implementing, I would check:

- The notification function’s callers and public contract: inputs, return values, errors, retries, and whether callers depend on ordering or synchronous behavior.
- Whether email and SMS already have materially different validation, provider APIs, rate limits, or failure handling.
- Tests, mocks, and observability around sends.
- Configuration and dependency boundaries for providers.
- Push’s actual requirements: device-token model, payload shape, delivery status, platform differences, batching, and retry/idempotency behavior.
- Whether the switch is becoming difficult because channel-specific knowledge is tangled—not merely because it has another branch.

If push introduces a distinct lifecycle or several channel-specific policies, then extract handlers behind a small interface such as `send(notification)`, preferably as plain functions or objects first. Use classes only if they need state or lifecycle management. The upgrade trigger is concrete friction: repeated branching, duplicated provider logic, or callers needing to understand channel details.
