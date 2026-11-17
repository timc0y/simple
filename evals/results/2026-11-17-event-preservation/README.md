# Event-preservation candidate screen, 17 November 2026

Registered before new cases or model drafts. The current guidance remains active.
The candidate adds one sentence to the existing preservation rule:

> Preserve the event that satisfies each condition: sending, receipt, approval and completion are different events, even when the same person and deadline appear.

This addresses the concrete condition changes in the preceding screen without
requiring fixed wording or a visible checklist in finished writing. It is a
candidate, not an adopted or measured improvement.

See [registration](registration.json) for frozen instruction hashes and the task
bound: one independent author, six draft batches and four draft-only reading batches,
eleven Luna model tasks at medium reasoning. Four cases per repository; current,
candidate and identical-content current repeat. No retries, repairs or tuning.
No paid API calls or private writing. Backend revision, token use and costs may not
be exposed. Draft-only readers receive no authoritative source, gold answers or
condition mapping. Lead source/operation review remains separate.

Keep the candidate as a useful lead only if it repairs a failure shared by both
current batches, introduces no current-pass/candidate-fail case, and both reading
orders pass their evidence and control checks. Otherwise retain current guidance.
Even a narrow pass does not establish an average writing-quality improvement.

## Result and decision

**Do not adopt the candidate. No quality gain is established.** All eleven tasks
finished without retries or repairs: eight new independently authored sources,
24 drafts, and four reading batches containing 64 item readings and 136 answers.
All reading records pass identity and literal-excerpt validation. At this run’s
finish, active writing instructions still matched the frozen baseline in both
repositories. A later word-limit follow-up changes the active guidance separately.

| Repository | Current | Candidate | Current repeat |
| --- | ---: | ---: | ---: |
| Simple | 3/4 | 3/4 | 3/4 |
| Communicator | 3/4 | 3/4 | 3/4 |

These are the lead agent's task/source judgments, not calibrated quality scores.
The lead reviewed opaque variant IDs and saved all judgments before reading the
model readers' answers or looking up the conditions. This is partial blinding under
cooperative instructions, not an independently audited human experiment. The lead
agent was the existing root agent, `gpt-6.1-sol`; all eleven new participant tasks
requested Luna. Exact backend revisions, usage and cost were not exposed.

The new event-condition and factual-correction tasks left no baseline failure for
the candidate to repair. Every condition also kept the approved punctuation-only
source byte-identical. The shared failure was bounded summarisation:

| Repository | Word limit | Current | Candidate | Current repeat |
| --- | ---: | ---: | ---: | ---: |
| Simple | 65 | 79 | 83 | 73 |
| Communicator | 70 | 85 | 83 | 82 |

Counts use the preregistered whitespace convention. The two source passages were
250 and 241 words. Three Communicator summaries also omitted the explicit ban on
using last month's printout; two omitted the requested greeting. The lead's
[pre-generation feasibility witness](evidence/lead-feasibility-witness.json) is
60 words and preserves the registered inventory/escalation obligations. It was not
shown to writers or readers and is not a model result or a winning condition.

The candidate repaired none of the failures shared by both baseline batches, so it
fails the registered usefulness requirement. The smaller existing guidance stays.
Two of four Simple baseline/repeat outputs and one of four Communicator outputs
were byte-identical. One repeat cannot establish a noise distribution.

## Reading and calibration limits

Three reading batches matched all four controls under the lead's original reading.
The reverse Communicator batch called a requested posting day “not stated” as a
*deadline*, while correctly reporting posting on Monday. The control says “post …
on Monday” but asks about a deadline. That schedule/deadline ambiguity prevents a
clean all-controls-calibrated claim. Keep the raw answer and original key; do not
repair a calibration label after results.

Compound questions also remain a weakness: forward Communicator answers described
the printout fallback but did not explicitly answer which substitutes were disallowed.
Complete question IDs and literal quotes do not prove that every subquestion was
answered. The lead's full-source comparison, recorded separately, found the omitted
old-printout prohibition. Independent reading helps expose what a draft says; it
cannot alone establish preservation, completeness or successful task fulfilment.

## Evidence and delivery

[Cases](evidence/cases.json), [current drafts](evidence/drafts-current.json),
[candidate drafts](evidence/drafts-candidate.json),
[repeat drafts](evidence/drafts-current-repeat.json),
[forward readings](evidence/reading-forward.json),
[reverse readings](evidence/reading-reverse.json),
[frozen lead judgments](evidence/lead-blind-verdicts.json),
[reading validation](evidence/reading-validation.json),
[control review](evidence/control-review.json), [decision](evidence/decision.json),
[summary](evidence/summary.json) and [hash manifest](evidence/manifest.json) are retained.
Exact method snapshots and generation/reading inputs are beside them. Shared lead
judgments cover both repositories; the draft/read input files cover this repository.

Sources were independently authored without either skill or old cases. Before
writing began, the lead narrowed the summary scopes to make the budgets feasible,
corrected one non-literal source excerpt and replaced topic-overlapping voice
examples with unrelated synthetic examples. After generation began but before any
lead draft inspection or reading task, reader questions were rewritten to remove
correct names and deadlines. Original cases and the timing/changes are retained.
No source or writer-task edit followed a generated draft.

Baseline/repeat JSON inputs are byte-identical per repository. Host task names and
contexts differ. One Communicator candidate wrapper used “Finished means” instead
of “Finished =” in its output-file instruction; its source/task payload still changed
only by the candidate sentence. This administrative difference and the small sample
preclude a strict single-factor causal claim. Readers reused four development
controls and the same model alias as writers. No installed activation, live library
meaning-review operation, real personal voice or human comprehension was tested.

The writing task remains larger than a meaning checklist: an explicit maximum is
part of the requested outcome. This run supplies a concrete length-enforcement gap;
it does not test a repair. Stop at the registered eleven-task bound.
