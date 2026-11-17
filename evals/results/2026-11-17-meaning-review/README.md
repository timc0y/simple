# Library meaning-review calibration, 17 November 2026

Simple record of the shared calibration. Communicator owns the tested library
review prompt, parser and runtime.

The library's captured pre-focus meaning-review prompt matched all **eight fixed controls**:
four faithful rewrites accepted and four faulty rewrites rejected. All raw verdicts
parsed successfully. The actual runtime, replaying those recorded verdicts, returned
the original source for all four faulty candidates. This is a small development
control screen, not a general accuracy estimate or a live-provider benchmark.

## What was exercised

The exact system instruction text and user payload were captured when the built
`createCommunicationRuntime(...).adapt(...)` reached its meaning-review call.
Candidate writing was fixed, so the test measures reviewing separately from drafting.
Each captured text pair went to a fresh `gpt-6-luna` native task, medium reasoning,
without the expected verdict or other controls. The model wrote the raw strict JSON
verdict; it was not repaired, fenced output was not cleaned, and no task was retried.

The [registration](registration.json) fixed an eight-task bound and froze every
input hash before the first review. It also records the source identities and
reference runtime parameters: temperature 0 and maximum 1,500 output tokens.
Native collaboration does not expose or enforce those provider parameters and does
not verify original API system/user role delivery. It receives the captured prompt
text through a task file. Exact backend revision, usage and cost remain unknown.

| Family | Faithful control | Faulty counterpart | Observed result |
| --- | --- | --- | --- |
| Event prerequisite | Ledger recording remains required before initialling | Counting finished replaces ledger recording | Accept faithful; reject faulty |
| Responsibility | Sender and approver retain their roles | Same names with sending/approval roles swapped | Accept faithful; reject faulty |
| Omission | Conditional Monday shipment and Thursday fallback retained | Thursday fallback omitted | Accept faithful; reject faulty |
| Status | Our group has not booked the hall; Tuesday only proposed | Confirmed Tuesday booking asserted | Accept faithful; reject faulty |

All four faulty controls reached the model-review stage; no protected-span guard
short-circuited them. All eight verdicts passed `parseMeaningReview`, including the
literal checks on every supplied change excerpt. Positive verdicts contain no
changes and therefore do not themselves supply affirmative source evidence.

## Recorded-provider replay

The unchanged real parser and runtime then consumed each recorded native verdict.
The replay asserted that its system and user texts exactly matched the captured
request. Each replay used two provider callbacks: a fixed synthetic candidate,
then the recorded meaning verdict. No model inference occurred during replay.

| Measure on these controls | Result |
| --- | ---: |
| Valid raw verdicts | 8/8 |
| Faithful controls accepted | 4/4 |
| Faulty controls rejected | 4/4 |
| Runtime false acceptances | 0/4 faulty controls |
| Runtime false rejections | 0/4 faithful controls |
| Source returned for faulty candidates | 4/4 |

See [control results](evidence/control-results.json), [summary](evidence/summary.json),
[gold key](evidence/key.json), [presentation order](evidence/order.json),
[delivery identities](evidence/delivery.json) and [hash manifest](evidence/manifest.json).
Exact per-control inputs, raw verdicts and replay requests are beside those files.
All sources and the style pack are synthetic; no real personal context was read,
written, exported or used for inference. No paid API call, training, installation,
commit or publication was performed. Stop at the registered eight-task bound.

## Decision and remaining limits

Keep the existing prompt and parser; no new instruction was needed for these
controls. Correct labels do not certify every explanatory nuance: the omission
rationale describes “otherwise” as a failed check, which was not separately
validated as an exhaustive reading of that branch.

This screen does not compare writing methods, evaluate personal voice or measure
human understanding. Controls were lead-authored, short and intentionally diagnostic;
they are not held-out or representative long documents. There is one verdict per
control, no cross-provider replication, and no demonstrated production-provider
configuration parity. File isolation was by instruction, not an enforced boundary.

The explicit ledger-recording minimal pair removes the earlier summary's surrounding
procedural context. Its result does not resolve whether that longer repaired note
retains the prerequisite implicitly. The [word-limit repair record](../2026-11-17-word-limits/README.md)
keeps that uncertainty rather than retroactively approving it.

This is the style-pack library adaptation path. The personal MCP
`review_communication` tool still performs lexical/operation/length checks and leaves
meaning `not_run`; its agent or reviewer must do the meaning comparison. This work
does not add automatic model calls to that tool or establish installed-agent use.

Later full-source and focused-input runs preserve this historical eight-control
record; it is not a test of the subsequently changed provider payload.
