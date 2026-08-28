# Simple

## Reality

- Published clients use the customer API.
- The old customer field name is promised for 90 days.

## Preserve

- Support old and new field names during the promised transition.

## Current boundary

- The API is in a bounded old-field transition.

## Ordinary paths

- `CustomerSerializer` owns request parsing and response serialization through its alias facility.

## Proof

- Run `npm test` for both field representations and conflict rejection.

## Reconsider when

- Remove the old alias only after 90 days and zero old-field traffic.
