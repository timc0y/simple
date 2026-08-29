# Research synthesis: feedback, proof, and agent prose

## Decision

Keep Simple's current proof sentence. The focused replacement did not improve the
result reliably, and no-skill answers passed every strict cell. Do not add a general
test workflow, code-review workflow, retrospective command, or banned-word checker.

Simple already requires independent proof. The researched distinction remains useful,
but the evaluation did not show that more runtime wording changes model behaviour. The
other ideas are already covered, belong to another skill, or need a demonstrated local
failure before they justify more instruction.

## Sources considered

- Matt Pocock's 37 published and in-progress skills at commit
  [`6654f6b`](https://github.com/mattpocock/skills/tree/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76),
  especially [`tdd`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/tdd/SKILL.md),
  [`code-review`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/code-review/SKILL.md),
  [`retro`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/SKILL.md), and
  [`writing-for-agents`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/writing-for-agents/SKILL.md).
- Google's Testing Blog corpus recorded in
  [google-testing-blog.md](./google-testing-blog.md): 78 of 114 unique `TotT` and
  `Code Health` posts reviewed. The set includes all 31 Code Health posts.
- The supplied screenshot of a CI check that rejects selected words in prose.
- Simple's current core, architecture, writing, model-profile, evaluation, and hook
  guidance.
- Ponytail's implementation ladder, root-cause rule, minimal check, and preference for
  deletion over added machinery.

## What the sources agree on

### Proof must be able to disagree with the implementation

Matt calls out tautological tests and tests that depend on the implementation. Google
uses the broader term *change-detector test*. Such a test can break after a harmless
refactor without becoming more likely to catch a defect. Both need the
expected result to come from a contract, worked example, known literal, or other source
independent of the code under test.

Simple already asks for an independent surface, and Ponytail requires one runnable
check for non-trivial logic. The absent part is a practical discrimination test:

1. Name a plausible wrong implementation.
2. The check must fail for that implementation.
3. Make an irrelevant refactor that preserves behaviour.
4. The check should remain green.

This is the strongest candidate for Simple. It sharpens an existing obligation and
does not add another workflow.

### Use the owner's surface and the highest useful fidelity

Google prefers observable behaviour through public interfaces. It prefers real
dependencies, then fakes that the owner maintains. Use mocks when the interaction is
the contract or when no better surface exists. Matt expresses the same idea as a test
at a chosen seam. Simple already says to prove behaviour through the owner's public
surface.

The useful addition is not “never mock” or “always use end-to-end tests.” Proof should
match the consequence. Call order, call count, latency, resource use, and side effects are
behaviour when the contract makes them consequential.

### A failed check should explain the failure

Google's test guidance asks a check to name one behaviour and report the relevant
expected and actual values on its first failure. Test data should keep cause, action,
and outcome close together; distinct non-default values should expose swapped or
ignored inputs.

This belongs in optional proof guidance, not Simple's core. It affects the usefulness
of proof after the surface has been chosen.

### Move objective repeated feedback into automation

Matt's retrospective separates navigation, information access, deterministic checks,
review standards, and prompt guidance. The supplied screenshot demonstrates the same
move for prose: a machine rejects an exact pattern and returns a location, so the agent
rewrites it.

Simple already contains the main rule in `model-profiles.md`: use a script,
template, or linter only after free-form guidance shows a measured repeatable failure.
The repository hook also reviews Markdown and comments after edits. No new general
mechanism is needed.

A future word check should:

- scan added prose rather than legacy files;
- report the exact file and line;
- exclude code, identifiers, quotations, generated files, and unchanged text when the
  observed failure requires those exclusions;
- live in the repository's lint or review path, not in `simple check`, which owns route
  and profile structure;
- make no claim about chat responses unless the host exposes a pre-send output hook.

The current evidence does not supply a justified word list. The term shown in the
screenshot also appears deliberately in Simple's own instructions and nine stored eval
answers. That proves repetition, not harm. A checker now would risk synonym
substitution and a conflict between the prompt and the check.

### Keep implementation context small; put judgement in review

Matt's code review separates repository standards from specification compliance, and
his retrospective puts code-style checks in review because the implementation
agent carries more context. Simple already uses progressive disclosure, keeps the
repository route short, and treats review as a read-only command. Ponytail reinforces
the same economy because it rejects speculative abstractions and extra checks.

Simple should not absorb Matt's complete two-agent review flow. Its current review has
a different public contract and already checks present obligations, ownership, proof,
scope, and prose. A second workflow would divide ownership.

## Experiment

Replace the current proof sentence with this candidate:

```text
Try to falsify the result through a surface with an expected outcome independent of
the implementation. It should reject a plausible wrong behaviour and survive an
irrelevant implementation change.
```

Evaluate it on three cases:

1. A tautological expected value repeats the production formula.
2. An internal call assertion breaks after a harmless refactor and misses the visible
   defect.
3. An interaction assertion is valid because call order or count is the contract.

The third case prevents a universal public-interface or never-mock rule. The
[proof-discrimination screen](../evals/results/2026-08-29-proof-discrimination-screen/README.md)
compared no skill, current Simple, the candidate, and both Ponytail interaction arms.
The regrade was unstable, so the run cannot support a runtime change. Uniform sandbox
startup warnings appeared in all conditions and did not explain the changed verdict.
The replacement does not ship without stable evidence.

## Ideas not adopted

- **Generic test skill:** outside Simple's method and duplicates Matt's TDD skill.
- **Full Google checklist:** too much retrieval and several rules are contextual rather
  than universal.
- **Broad banned-word checker:** no agreed word list or measured quality improvement.
- **Test targets or coverage thresholds:** proxies cannot establish behaviour.
- **Never-mock rule:** wrong when the interaction is the contract or real dependencies
  make the check unreliable or disproportionate.
- **Mandatory small PRs or preparatory commits:** focus aids review, but a forced split
  can create ceremony and intermediate states with no independent value.
- **A second code-review command:** would overlap the current `simple review` contract.

## Reconsideration conditions

- Revisit proof wording only when a stored failure produces a harder contrastive case
  that current Simple misses.
- Add a prose tripwire only when named words repeatedly cause rejected outputs and a
  diff-only check improves them without false positives or awkward substitutions.
- Add narrower test guidance only when stored failures show the proof sentence is
  insufficient and identify the missing decision.

## Follow-up code and text screen

Two more candidates used repository code and observed review failures. A conditional
pure-decision rule scored 2 of 4; current Simple scored 3 of 4. A review-resolution
rule appeared to tie current Simple at 1 of 4, but its rubric rejected valid
answers. Neither candidate ships; the review result is inconclusive.

The work exposed a useful evaluation rule. Keep each earlier grade before another
grade. If the same rubric changes its verdict for the same answer, mark the grader as
unstable. Do not use that change as evidence of a skill gain. This rule now lives in
the evaluation protocol.

See the [code and text candidate screen](../evals/results/2026-08-29-code-text-candidates/README.md).

## Audit follow-up

A Simple audit found a conflict in the compatibility checklist. Its direct-replacement
rule omitted published contracts. A focused candidate added that condition.

Current Simple and the candidate each passed 4 of 4 cells. No skill passed 1 of 4.
The core contract rules already corrected the checklist error during model use. The
candidate tied and did not ship.

The audit also found defects in deterministic repository paths. The local installer
missed the shared agent skill directory and could delete a real directory. The profile
check accepted contradictory route text and could not check a nested target. The eval
runners could overwrite grades and accept invented answer identifiers.

These findings changed scripts, checks, and the evaluation protocol. They did not add
more runtime skill text. See the [published contract audit](../evals/results/2026-08-29-published-contract-audit/README.md).
