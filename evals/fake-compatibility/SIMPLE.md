# Simple

## Reality

- Stage and users: One owner uses the internal application.
- External consumers: None observed; the interface has not been published.
- Persistent production data: None.
- Compatibility commitments: None.

## Preserve

- The current account behaviour.

## Current boundary

- One application calls the account module directly.

## Ordinary paths

- Change account behaviour through the existing module.

## Proof

- Run the account tests and type-check its callers.

## Reconsider when

- A published client or retained dataset depends on the interface.
