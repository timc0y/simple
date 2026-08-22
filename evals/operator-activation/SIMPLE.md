# Simple

## Reality

- Stage and users: Internal TypeScript web application used by one team.
- External consumers: None.
- Persistent production data: Read through the existing typed API client; this change does not alter it.
- Compatibility commitments: None outside this repository.
- Scale and failure consequences: A wrong fetch shows stale or missing rows; retrying is safe.

## Preserve

- End-to-end type safety between the API client and the components.
- The existing error and loading behaviour.

## Current boundary

- One typed API client owns all data fetching.
- No GraphQL layer, cache library, or fetch wrapper is installed.

## Ordinary paths

- Add or change endpoints inside the existing typed client.

## Proof

- Type-check and the existing integration tests.

## Reconsider when

- A second client application or a third-party API consumer appears.
- Measured latency or over-fetching that the typed client cannot fix.
