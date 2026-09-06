Read this case's `SIMPLE.md`. A reviewer says the proposed change is wrong because it
would remove an existing requirement. Correct the proposal and explain the smallest
change that satisfies the new request while preserving every unaffected requirement.

The service currently stores audit events with `actor`, `action`, `target`, and
`retention_days`. A request asks to add a human-readable `summary` field. The proposal
replaces the event with `{summary}` and says the old fields can be reconstructed from
the text. Give the corrected design, ownership, and proof.
