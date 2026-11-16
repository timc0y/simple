# Writing and evaluation implementation plan

Recorded 16 November 2026 at the owner's request. This now retains unfinished
evaluation work. The operation-aware writing method and source-aware, control-checked
grading path have been implemented locally; matched model gains remain unmeasured.
The [research and references](../research/writing-research.md) retain the supplied
posts, related sources, conclusions and limits. Communicator has its own plan; this
one concerns Simple's general method and evaluation only.

## Outcome and current boundary

Make Simple's writing, updates and handoffs easier to understand without losing
material facts, conditions, uncertainty, responsibility or authority. Establish
whether an instruction improves the requested outcome, rather than whether a judge
prefers its wording.

The shared skill already requires preservation, audience adaptation and independent
proof. The writing reference already distinguishes topic mentions from correct
relationships. The evaluation protocol already separates readability from factual
support, requires anonymous pass/fail controls, preserves conflicting grades, and
requires matched conditions. The local tree also contains meaning-preservation and
handoff-evidence cases and grader validation work. Preserve that work; inspect its
current state before implementation rather than treating it as a new blank task.

Keep one shared method and the existing routes for OpenCode, Claude Code, Codex and
Antigravity. Public examples must use synthetic material. Personal writing, private
transcripts, machine settings and raw private evidence stay outside public sources.
No new runtime, universal writing format, mandatory checker, host hook or dependence
on Communicator is part of this plan.

## Remaining evaluation work

### Validate the grader against independent writing obligations

The runner now carries frozen tasks, source files, anonymous controls and exact
candidate identities. Before using it to claim an instruction gain, independently
validate acceptance questions for faithful paraphrases and nearby omissions or
reversals. Check who acts, what is conditional, what remains unknown and what must
happen next. A supported sentence does not establish source completeness.

The current writing method and deterministic implementation belong to the skill,
writing reference and evaluation protocol. Their presence and passing fixture tests
do not establish that a model uses them correctly or that a reader understands.

### Independently validate and extend the cases

Use these families, retaining nearby cases where the correct answer differs:

- Meaning: swapped actors, negation, possibility versus commitment, necessary
  versus sufficient conditions, reported versus established claims, numbers,
  dates, approval and completion states, partial versus complete delivery.
- Editing scope: already-good text, punctuation only, summarising, explanation,
  authorised factual updates, deliberate repetition and correct technical terms.
- Structure: long-range exceptions, references to earlier people or list items,
  reasons moved away from claims, quotations, code, tables and template fields.
- Continuation: successive shortening, warming and regrouping requests followed
  by a factual correction; assess against the latest accepted substance, including
  authorised changes, rather than either freezing the original or forgetting it.
- Context: conflicting or changed preferences, a one-task exception, irrelevant
  history and instructions found inside quoted source material.

Keep development cases separate from held-out tasks and paraphrased prompts. Check
reader questions, not only a model's global meaning verdict. Human comprehension
remains unmeasured unless actual readers complete the intended task.

The [additional repository investigation](../research/writing-research.md#further-repository-investigation-16-november-2026)
adds specific controls to these families: a supported draft missing an approval
condition; a serious failure hidden among many easy claims; paraphrased task
instructions whose scope stays fixed; forged grade markers inside source text; and
an invalid final grade after an earlier valid-looking grade. Borrow CheckList's
distinction between changes that should preserve an answer and changes that should
change it. Read Inspect AI's tests for grader failure cases, without adding either
framework. Report missing grades explicitly rather than shrinking an acceptance set.

The [second repository investigation](../research/writing-research.md#second-repository-investigation-16-november-2026)
adds controls for an unknown answer, old and corrected facts appearing together,
abstention labels reaching an aggregator, and malformed grader text containing
“yes”. Check completeness against the required case IDs. If evaluation results are
cached, keep development and validation identities separate even when both contain
case 0. Preserve disagreement between swapped answer orders as disagreement, not an
agreed quality tie. These controls refine the existing runner; they do not require
an optimiser or memory framework.

The [Ink investigation](../research/writing-research.md#ink-and-the-third-supplied-post-16-november-2026)
adds a surface-preservation control: keep names, numbers and quotations while changing
their relationship, and require the meaning assessment to notice. Pair it with a
faithful paraphrase and an unchanged answer that fails the requested improvement.
Missing-detail warnings remain review aids; an empty warning list is not approval.

### Run matched comparisons and finish at the right boundary

Before paid model work, register the model and host identities, frozen instruction
texts, baseline, call/spending limit, repetitions, acceptance criteria and stopping
rule under `evals/README.md`. Check baseline variation, grader controls and prompt
variation before attributing a difference to the candidate. Do not select a new
provider or model merely because it is available.

Record natural activation, assigned-reference reading and task completion
separately. Text in a file is not proof of retrieval; retrieval is not proof of
correct execution. Keep invalid attempts, contradictory grades, negative results
and usage unknowns. Do not repeat until a favourable result appears.

Adopt a small owner-requested clarification with its limits stated, or retain the
simpler guidance after an inconclusive comparison. Claim improved behaviour only
within the evidence actually collected. A performance tie does not require deleting
an intended capability that the cases did not exercise.

## Independent proof and implementation checks

Run `npm test`, `node skills/simple/scripts/simple.mjs check` and `git diff --check`.
Validate any changed skill with the installed skill validator. Run the affected
offline verifier self-tests before model execution; fixtures and stubbed responses
establish mechanics, not instruction quality. Update each existing truth owner made
false by implementation and keep result decisions in `evals/results/README.md`.

Classify failures before changing code: absent context, unsuccessful retrieval,
wrong use of correct context, poor answer, mistaken grader acceptance, mistaken
grader rejection or invalid instrumentation. Preserve enough evidence to distinguish
these causes without publishing private conversations.

## Related coding ideas, only when relevant

The same research pass considered preparatory refactoring, separating decisions from
file/network operations, carrying validated constraints in types, reducing a failing
example and testing relationships between runs. Their sources are retained in the
research catalogue. Existing architecture, types, diagnosis, verification and
refactoring references already cover much of this. Add a clarification only after
mapping a concrete missing decision to its owner; this is not authority for a new
coding framework or blanket refactor.

## Deferred ideas and reconsideration conditions

RAL training, model-specific activation steering, a learned judge, new persistent
preference storage, additional host adapters and universal banned-word or sentence
length rules are outside the first delivery. Reconsider only after the current
workflow has a reproducible failure that a smaller change cannot address.

The remaining work is independent evaluation, not another implementation of the
completed writing and grading contracts. Installed-package activation, commits,
pushes, releases and publication require applicable authority. Delete this temporary
plan once its remaining obligations have durable owners; retain the research
catalogue and raw evaluation evidence.
