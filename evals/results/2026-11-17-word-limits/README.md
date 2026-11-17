# Explicit word-limit checks, 17 November 2026

Simple record of the shared follow-up. Communicator owns the runtime limit check;
Simple adds only the conditional instruction to measure a requested length bound.

The [new-case screen](../2026-11-17-event-preservation/README.md) produced six
summaries over their requested maximum. The review tool previously reported rhythm
word counts without a separate user-supplied limit or failure result. This change
adds that missing check through the existing compose/review path.

## Implemented behaviour

Pass a supplied hard maximum as `maxWords` and carry it from compose content into
review. `wordCountBasis` defaults to `word_segments`, using the existing Intl
word-like segmentation and reporting the resolved locale. Choose `whitespace` for
nonempty whitespace-delimited tokens when that is the required convention.

`wordLimitCheck` reports status, maximum, actual count, excess, basis and locale.
Without `maxWords`, status is `not_requested`; it does not parse objectives or
invent a maximum from short/long form. Limits must be positive safe integers.
Counts include the whole final artifact, including code and quotations. This checks
an upper bound, not an exact target, minimum, meaning or source completeness.

Ordinary and adapter evaluations retain limits through serialization and report
`wordLimitsChecked` and `wordLimitFailures`. A positively assessed and preferred
adapter candidate still cannot qualify when it exceeds an explicit maximum. A zero
failure count with zero checked limits is not proof of a length pass.

## Deterministic and packaged proof

The initial regression failed before implementation. Boundary tests cover exceeding,
meeting and omitting the maximum, different counting conventions, invalid numbers,
strict input/serialized constraint propagation, and preference not overriding the
failed bound. Typecheck, all **266 tests**, the full macOS build, public-source scan
and whitespace checks passed.

The [replay](replay.json) passed all six archived model failures through the built
review function: all six exceeded their declared whitespace-based maximum and all
six were reported as failed. Original model outputs and judgments remain unchanged.

An actual bundled-server stdio connection listed all eleven tools and carried a
maximum from `compose_communication` into `review_communication`. Five words failed
a four-word limit; four words passed while meaning remained `not_run` and overall
task fulfilment `not_assessed`. The disposable synthetic store hashes were unchanged.
See [packaged MCP proof](mcp-proof.json). No real personal context, installed host
activation, iCloud sync, publishing or additional model inference was involved in
that deterministic probe.

Simple’s 99 repository tests, profile check and skill validation also passed.

## Bounded assisted repair

A separately [registered four-task smoke](repair-evidence/registration.json) then
used two Luna repair batches and two fresh draft-only readers, medium reasoning.
The writers received updated guidance, numerical review feedback and required
source material; Communicator also received explicit feedback about omitted content.
Each archived draft had one repair attempt, without retries or further tuning.

| Source task | Three original drafts | Three repaired drafts | Maximum |
| --- | --- | --- | ---: |
| Simple inventory handover | 79, 83, 73 | 62, 62, 62 | 65 |
| Communicator welcome procedure | 85, 83, 82 | 70, 70, 70 | 70 |

Counts were independently recomputed. Each batch reused one final text across its
three inputs: there are two underlying source tasks and two unique repaired texts,
not six independent successful sources. Structural checks accepted all 14 reader
items and 65 answers with literal evidence. The lead matched all four controls in
each reading task; the posting control asks about the requested day, avoiding the
preceding ambiguous use of “deadline”. Raw inputs, repairs and readings are in
[repair evidence](repair-evidence/manifest.json).

**Length success does not establish full repair.** Simple's final condition changed
from allowing an initial after recording the count to “present and counted”. The
note still gives a ledger instruction earlier, so the lead leaves preservation of
the explicit recording prerequisite uncertain. Sleeve placement is also expressed
more tersely. The reader answers reproduce the counted condition; they do not
certify it against the source. Do not label these drafts fully approved from their
length result.

Communicator's repairs restored the explicit old-printout prohibition and greeting.
The targeted readers and lead source review retain conditional card issuance,
checks before distribution, host authority limits and pausing/phoning without a
host. This is evidence about these supplied constraints, not naturalness, personal
voice or actual human understanding. The compressed note style was not validated
with readers.

The repair combines new guidance, numerical and omission feedback and additional
effort on known failures. There is no matched control or isolated component effect.
Exact model backend revision, token usage and cost were not exposed. Stop at the
four-task bound and retain the uncertainty; no general writing-quality gain follows.

## Delivery boundary

Simple's writing reference now tells agents to measure an explicit length bound.
Communicator's skill carries the optional structured limit and checks its result.
These instruction changes follow the earlier frozen comparisons; those model
results do not test the newly changed active guidance. This smoke uses explicitly
supplied instructions and feedback, not natural activation. The local build is
verified; cached or installed user plugins were not updated, committed or published.

## Library enforcement follow-up

The compiled-pack runtime now accepts the same explicit word maximum and counting
basis as compose/review. It checks prepared output before meaning inference, returns
the source on excess, and never truncates copy. Existing calls without an explicit
maximum retain their result shape. Optional `checks.wordLimit` describes the checked
candidate, not approval of fallback length. Invalid limits fail before inference.

All 270 tests, typecheck, build and public-content checks passed. The
[replay helper](runtime-replay.mjs) sent these six archived over-limit outputs through
the built runtime with fixed provider callbacks: all returned the source after one
callback, without requesting a meaning verdict. [Exact outcomes](runtime-replay.json)
retain counts. This is deterministic enforcement evidence, not another model trial
or a writing-quality gain. The earlier model records and source identities remain
historical. No installation, publishing or other-Mac change occurred.
