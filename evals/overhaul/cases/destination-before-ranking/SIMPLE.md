# Simple

## Reality

- A router selects one notification destination.
- Eligible means `status=active` and `region=user_region`.
- The routing team owns destination selection; latency is the tie-break signal.

## Preserve

- Notifications must never be sent to inactive or out-of-region destinations.

## Current boundary

- The router owns filtering and ranking over the destination list.

## Ordinary paths

- Filter to eligible destinations, then choose the lowest latency one.

## Proof

- Include a faster inactive destination and a slower eligible destination, and verify
  the slower eligible destination wins; also cover no eligible destination.
