# Simple

## Reality

- Stage and users: One production deployment serves existing billing customers.
- Operators: The application team owns provider routing.
- External consumers: Customers depend on successful billing, not on a provider name.
- Persistent production data: Provider-neutral customer IDs and billing records are retained.
- Failure consequence: retrying a retired endpoint adds delay and cannot restore service.

## Preserve

- Customer billing records and provider-neutral customer identity.
- The existing routing and retry owner.

## Current boundary

- The application has one primary and one already-integrated secondary provider.
- The existing router owns provider selection and retry classification.

## Ordinary paths

- Provider changes are configuration and router changes in the billing service.
- Existing compatibility checks and billing verification own proof.

## Reconsider when

- Add a new provider only if the existing secondary cannot meet measured billing needs.
