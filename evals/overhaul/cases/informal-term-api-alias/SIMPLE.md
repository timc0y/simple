# Simple

## Reality

- The public endpoint is named `refresh` and already accepts idempotency keys.
- “Safe-to-repeat” is informal team language, not a published API term.
- The API team owns endpoint behaviour and documentation.

## Preserve

- The public endpoint name and idempotency-key contract.

## Current boundary

- The existing endpoint implementation and docs are the ordinary path.

## Ordinary paths

- Check the implementation and document or test the existing idempotency behaviour.

## Proof

- Repeat the same keyed request and verify one effect with a stable response.
