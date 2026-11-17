# Draft-only reading diagnostic, 17 November 2026

Two fresh Luna readers correctly extracted the stated conditions from six existing
drafts and read all four lead-authored controls, in both presentation orders. All
20 recorded answers have literal evidence in their corresponding draft. This is a
small development diagnostic; **no writing-quality gain is established**.

## Question tested

The [preceding screen](../2026-11-17-independent-writing/README.md) supplied source,
expected answers and drafts together. Graders answered source questions with the
source condition even when the draft changed it. This follow-up withheld original
source, task, expected answers, condition labels and writing instructions. Readers
received only each draft and neutral questions. The lead compared their answers
with the separately retained source event after extraction.

| Existing draft | Both draft-only readings | Separately retained source | Lead comparison |
| --- | --- | --- | --- |
| Simple minimal/current/repeat | Send copy by Tuesday | Copy arrives by Tuesday | Three changed prerequisites |
| Communicator minimal | Draft reaches sender by Friday | Send draft by Friday | Changed prerequisite |
| Communicator current/repeat | Send draft by Friday | Send draft by Friday | Two preserved prerequisites |

The readers did not deliver fidelity verdicts. Their readings made the four changed
conditions visible to the lead's comparison. This avoids interpreting a supplied
source answer as proof of what the draft says. Four controls separately exercised
receipt, dispatch without same-day receipt, an explicitly absent deadline, and an
actor plus an unconfirmed date. The lead found all four controls correct in each
order; this is not an independently validated broad semantic score.

## Bound and evidence

The [registration](registration.json) preceded the two new tasks. Model request:
`gpt-6-luna`, medium reasoning, native collaboration with fresh contexts and one
helper at a time. No retries, draft repairs, paid API calls or instruction tuning.
Exact backend revision, token usage and cost were not exposed. The previous run's
34 retained evidence files still matched their original hash manifests.

[Forward input](evidence/forward.input.json), [reverse input](evidence/reverse.input.json),
[forward answers](evidence/forward.answers.json), [reverse answers](evidence/reverse.answers.json),
[separate key](evidence/key.json), [structural validation](evidence/validated.json),
[summary](evidence/summary.json) and [hash manifest](evidence/manifest.json) are retained.
The key was not supplied to the readers. Isolation was by task instruction, not an
enforced filesystem boundary. Control correctness and event matching were inspected
by the lead; literal quotation and complete identities were checked mechanically.

## Decision and limits

When using source-derived questions as an independent reading check, collect answers
from draft-only input before exposing source or expected answers. Retain the questions,
actual reader input, answers and literal evidence. Then compare with the source,
including authorised updates. A later source-aware comparison has a different role;
it must not silently replace the independent reading.

This procedure is supported here only for ten short development items. The prompt
also explicitly distinguished dispatch, receipt and approval, and the batch size
and output task changed. This was not a controlled ablation of source withholding.
The same model alias wrote and read the material. No human reader, personal voice,
long-document fidelity, natural skill activation or full meaning-review operation
was tested. It does not show that a generic automated judge is reliable, nor does
it repair the preceding invalid quality comparison. Stop at the two-task bound.
