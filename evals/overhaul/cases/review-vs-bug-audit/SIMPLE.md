# Simple

## Reality

- The request is a broad review of webhook retry obligations.
- No failing behaviour, incident, traffic shape, or retry contract is known.
- The platform team owns the retry design.

## Preserve

- Existing webhook delivery and any currently documented retry commitments.

## Current boundary

- The retry loop is the platform team's implementation; the request has not identified
  a specific defect or an approved policy change.

## Ordinary paths

- Inspect callers, delivery contracts, limits, failure handling, and tests; report
  evidence and gaps before proposing a change.

## Proof

- A useful review names inspected evidence and unresolved obligations. A code change
  needs a separately stated failing case and an independent regression check.
