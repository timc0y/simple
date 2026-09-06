# Research synthesis: feedback, proof, and agent prose

The [6 September rollback audit](#rollback-audit--6-september-2026) updates the adoption
decisions below. Earlier results and reasoning remain as history. They do not impose
an active requirement to win an evaluation before wanted guidance can be adopted.

## Earlier proof-wording decision

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


## Preservation and reference-led development — 6 September 2026

The owner wants all useful reasoning retained and individual regressions investigated.
This section retains hypotheses from the design discussion; inclusion here does not
make each idea a universal instruction. The earlier negative experiments above remain
negative. The active method stays in the skill, and the evaluation protocol owns how
we assess a change. Private conversation provenance remains in ignored local context.

### Audit of the shortened candidate

Comparison source: the pre-consolidation overhaul snapshot used by the
[behavior screen](../evals/results/2026-09-06-behavior/README.md). The local backup also
preserves exact pre-edit files. This is a semantic review, not behavioral proof.

| Removed or relocated meaning | Location in the tested candidate / action | Remaining risk / evidence needed |
| --- | --- | --- |
| Writing need not trigger architecture analysis. | Core `Choose the mode` retains the boundary explicitly. | Check a writing-only task stays scoped. |
| Repository facts can change writing. | Core explicitly routes writing to the nearest `SIMPLE.md`; restored after independent review. | Inspect the actual profile read and preserved facts. |
| Identify reader, purpose, destination and source of truth. | Retained in core `Write for the reader` and the writing reference's entry procedure. | Audience adaptation must not alter promises. |
| Preserve facts, decisions, constraints, caveats and next actions. | Core preservation sentence plus writing reference `Plain writing standard` and `Editing`. | Check individual retained facts, including unknowns. |
| Answer first; group reasons and evidence beside their claim. | Core answer-first rule and writing reference standard. | Structured factual checks cannot establish prose quality; inspect prose separately. |
| Smallest useful structure, example or visual. | Writing reference standard retains examples, comparisons, lists and visual criteria. | Confirm reference retrieval; do not demand a visual when prose is sufficient. |
| Direct sentences, consistent terms and explicit actors. | Writing reference standard. | A relocated rule is only useful if read and applied. |
| Plain Markdown, shallow lists and restrained emphasis. | Writing reference standard, with destination-specific exceptions retained. | Do not grade one preferred wording or forbid required formatting. |
| Remove repetition and filler without losing reasons, risk, proof or unknowns. | Writing reference `Editing`; core preserves reasoning and proof. | Word reduction alone is not a success metric. |
| KISS, YAGNI, Chesterton's Fence, deep ownership and present requirements. | Restored verbatim in core. | Semantic overlap did not prove the named reasoning anchors were unnecessary. |
| Detailed writing-task routing at the specialist list. | Replaced by explicit conditional writing-reference read under `Write for the reader`. | Inspect actual reference reads; presence of a path is not activation evidence. |

No examples or specialist files were deleted. The safety, authority, correction,
cleanup and retained-evidence obligations remain. Restoring the reasoning anchors is
conservative preservation, not a claimed measured gain. The table records the tested
candidate, not the subsequently restored core.

### Hypotheses retained for development

Each row keeps the reason, boundary and a way to challenge it. These are candidate
explanations, not established claims about model behavior.

| Hypothesis | Why it could help | Boundary / counterexample | Home and discriminating check |
| --- | --- | --- | --- |
| Research can complete the task without new implementation. | A supported command or configuration may already deliver the outcome. | A wrapper is justified if the real caller cannot use the existing surface directly. | Research reference already allows existing tools as outcomes; test discovery plus actual caller success. |
| Reuse reduces implementation responsibility. | Maintained upstream code can replace substantial local code. | Integration, updates and operation remain ours; copied code and forks need maintenance. | Architecture ladder; contrast package, local helper and direct-code cases. |
| A reference should change a specific decision. | SDK operation order or error handling can remove guesswork and custom machinery. | Similar appearance alone does not establish compatible behavior. | Existing repository owner records source, adopted behavior, differences and recheck condition. |
| History explains awkward reference code. | Tests, issues and merged fixes may reveal a constraint invisible in the final code. | Exhaustive archaeology can cost more than the decision warrants. | Bounded research only where the detail changes the proposed approach. |
| A reference may solve a larger problem than ours. | Adopting its supported API need not import all of its infrastructure. | A shared infrastructure constraint may still apply to us. | Compare actual users, environments and failure contracts before copying structure. |
| Expensive discoveries should become repository facts. | A concrete owner and supported mechanism prevent repeated investigation. | A general preference should not masquerade as an observed fact. | Nearest SIMPLE.md or existing test/comment, with source and reconsideration condition. |
| Contrasting examples teach boundaries. | The same request with one changed fact exposes judgment rather than a reflex. | A hand-crafted example can cue the desired answer too strongly. | Existing worked examples; separately authored fixtures, disclose that they are synthetic and not independent held-out evidence. |
| Replacement includes deleting displaced responsibility. | Leaving both implementations, callers and configuration creates two maintenance paths. | Real consumers, retained data and rollback commitments may require a bounded transition. | Existing cleanup rule; verify deletion plus preserved behavior. |
| Repeated adapters may expose an upstream opportunity. | A supported upstream extension could remove the same work from several repositories. | Upstream acceptance and timing are uncertain; local work may still be necessary. | Research hypothesis until repeated local evidence supports an upstream proposal. |
| Names can preserve a false architecture. | Calling the working path fallback encourages repeated attempts at the failed route. | A normally reliable primary with a degraded fallback is correctly named. | Existing architecture owner; check triggers, full contract and cleanup together. |
| Configuration can transfer unnecessary decisions to operators. | A reliable default can remove recurring setup and coordination work. | Real consumers may require the variation. | Measure operator decisions and errors alongside code; do not delete supported choices on line-count grounds. |
| Good autonomy reduces avoidable interventions. | Carrying authorization and unaffected requirements avoids repeated correction. | A missing consequential choice still needs the user. | Actual continuation cases; review every requested intervention manually. |
| A correction identifies a cause, not automatically a new universal rule. | The cause may be missing repository facts, lost context, tooling or one misunderstanding. | A repeated cross-repository failure can justify shared guidance. | Classify the cause before modifying core; test the claimed failure mechanism. |
| Harder choices may matter more than harder algorithms. | The correct action may be discovering that the requested capability already exists. | A discoverable fixture does not establish performance in a large repository. | Contrastive discovery cases now; larger held-out repositories remain a separate experiment. |
| The full skill should earn its context cost. | A short instruction may achieve the same outcomes with less context. | A small test can miss rare obligations that the full skill protects. | Previous/candidate/short conditions, repeats, and retained failure cases; no pruning from a tie alone. |
| Relocated knowledge must remain retrievable. | Preserved text cannot help when the agent never loads it. | Explicitly forcing every reference masks retrieval failure. | Force only the assigned entrypoint; inspect subsequent reads and outcomes separately. |

### Current implementation boundary

The [worked examples](../skills/simple/references/examples.md) now cover the three
reuse decisions, conditional fallback retention, and a quiet but real consumer.
The [evaluation protocol](../evals/README.md) owns preservation mapping, reference
provenance and individual regression review. It references Ponytail's pinned source,
records the adopted method and intentional differences, and names recheck conditions.
The existing Luna execution harness supplies isolation and continuation; no Claude
runner or additional runtime dependency is introduced.

New fixture cases test preservation, reuse and writing context. They are adaptations
of concerns expressed in this conversation and existing synthetic regression cases,
not literal session replays. Existing frozen runs and grades are retained. Passing a
small repeated suite can show observed preservation in that suite; it cannot promise
zero regressions or validate every hypothesis above.


### Preservation decision after the repeated run

The [36-cell preservation evaluation](../evals/results/2026-09-06-preservation/README.md)
recorded previous 12/12, candidate 10/12 and short instruction 11/12 complete cases
when the required prose review is included. Executable checks alone gave both full
skills 12/12. Both candidate writing notes added a release-state claim absent from the
source, despite reading the writing reference and profile. The earlier core and writing
reference were restored byte-for-byte. The consolidation audit above is retained as
history; it is not a claim that the active core still uses that relocation.

The added conditional examples, hypothesis record and evaluation infrastructure remain.
No new full evaluation of this final composition is claimed. The direct-code case also
exposed an input-domain ambiguity, so it cannot establish a no-op behavior benefit.
Both the failures and this limitation remain available for future case design.

### Adoption follows intended capabilities

The subsequent user decision prioritises the wanted capabilities over aggregate
benchmark performance. The rollback above restored pre-consolidation overhaul wording;
it did not remove the accepted reuse, research, fallback or correction guidance.
The observed prose failures remain valid evidence, but their cause was not established.
They do not establish that the broader overhaul is worse.

The evaluation protocol now maps intended capabilities to actual coverage and gaps.
It requires investigation of individual failures without making every paired failure
an automatic rollback. The core states that requested outcomes define success, and
the writing reference distinguishes instructions from evidence of completed actions.
These changes are adopted for their fit to the requested behavior. No new model run
or measured improvement is claimed. Earlier frozen inputs, outputs and grades remain
unchanged; future tests should address the documented gaps rather than optimise the
existing total.

## Rollback audit — 6 September 2026

The audit found useful guidance withheld because a small evaluation tied, lost or
had an unstable grader. It also found public precedents removed during an editorial
rewrite. These are different causes. The original outputs and grades remain unchanged.

The review compared Git history, reflog experiments, T3 checkpoints, the integration
stash, local snapshots, candidate patches and Simple-related conversation records.
Private transcripts and exact local provenance remain in ignored local context.
The table records distinct decisions, rather than counting repeated snapshots as new
losses. A text inventory cannot prove that every historical intention was recovered.

### Restored or corrected

| Meaning | Earlier source and reason for exclusion | Current home and decision |
| --- | --- | --- |
| A published contract can require compatibility even without observed consumers. | [Published-contract audit](../evals/results/2026-08-29-published-contract-audit/README.md): 4/4 tie, described as “a tie loses.” | Corrected the direct-replacement condition in `compatibility.md`. The checklist must agree with the contract rule. |
| Expected results must be independent, reject plausible defects and survive harmless refactors. | [Proof-discrimination trial](../evals/results/2026-08-29-proof-discrimination-screen/README.md): unstable grades and no demonstrated gain. | Added scoped proof guidance to `architecture.md`; retained the shorter core sentence. |
| Interactions can be contracts; proof should match consequences and explain failures. | Google research synthesis above; optional proof detail never became active guidance. | Added public-surface, dependency, interaction and failure-diagnostic boundaries beside the proof guidance. No universal mock or end-to-end mandate. |
| A pure decision seam can expose policy hidden by effects. | [Code/text trial](../evals/results/2026-08-29-code-text-candidates/README.md): candidate 2/4, current 3/4. | Added a conditional option to `refactoring.md`. No split for a short linear operation; effects keep their owner. |
| Review findings need evidence, consequence and a supported correction. | [Writing trial](../evals/results/2026-08-29-google-writing-ideas/README.md): an apparent gain came from a grader error. | Added the finding contract to `commands.md`. Optional suggestions remain optional; a valid problem does not prove the proposed remedy. |
| A rejected or deferred finding can contain a reason later work needs. | [Code/text trial](../evals/results/2026-08-29-code-text-candidates/README.md): rubric rejected sufficient replies. | Added resolution rationale to `writing.md`. Use the existing owner when later work needs the reason; no compulsory decision log. |
| Nearby counterexamples explain decision boundaries. | [Writing trial](../evals/results/2026-08-29-google-writing-ideas/README.md): candidate 1/4, current 2/4. | Added a conditional writing rule. The existing paired examples already apply this idea. |
| Metrics locate possible problems; comments can prevent a plausible wrong edit. | [Proxy trial](../evals/results/2026-08-27-proxy-discipline-confirmation/README.md): both versions passed 38/40 across the two runs. | Added consequence-based metric guidance to `architecture.md` and a comment check to `writing.md`. No metric stack or thresholds. |
| Workflow completion needs proof of the full journey, honest result states and safe progress after external effects. | [Every-skills confirmation](../evals/results/2026-08-31-every-skills-confirmation/README.md): corrected run tied 4/4 after an invalid screen. | Added scoped completion and interruption guidance to `repository-work.md`, alongside the existing uncertainty and continuation rules. |
| Public precedents can teach product scope, false separations, functional ownership and justified complexity. | `HEAD` and the pre-overhaul stash retain iPhone, MacBook unibody, Apple silicon, Walkman and Dynamo examples. The current rewrite removed them; no eval record establishes why. | Restored all five in `examples.md` with primary sources and explicit analogy boundaries. Kept the synthetic examples. |
| A lens must not silently persist; prose conventions depend on purpose. | Earlier operator and writing references lost explicit scope boundaries during the lean-surface edits. No score establishes that these boundaries were unnecessary. | Restored task scope and evidence provenance in `operator-emulation.md`, and the purpose boundary in `writing.md`. No registry or universal controlled-language requirement. |

These are adoption decisions based on the wanted capabilities and inspected text.
They do not establish a model-performance gain. The earlier failures still identify
cases worth checking when these references are evaluated again.

### Retained meanings and deliberate exclusions

| Historical change | Current assessment |
| --- | --- |
| Rejected Minto and complexity cue variants in autoresearch and reflog commits. | Conclusion, reasons and evidence remain in the core writing method. Metric interpretation is now explicit in architecture. The names are not needed to recover those meanings; the original variants remain in the eval record. |
| Precedence edit and both one-ladder handoff candidates. | These mixed useful obligation preservation with claims about another skill's authority. Preserve obligations through the current core and architecture rules. Do not restore a blanket instruction to suppress another method. |
| Extra preservation-proof sentence, rejected after 18/24 became 13/24. | The independent-proof requirement survives. The restored proof and workflow details make its intended meaning available without repeating a universal checklist in the core. |
| Architecture-reference reduction. | The reduction was rejected; Raptor, deep ownership and the ordinary-path method remain active. This rollback preserved information. |
| Large operator-emulation framework and influence controls. | The lean emulation command, sourced lenses and result schema were restored earlier. A registry and influence dial would add machinery; their removal does not erase the retained doctrine. |
| Full every-skills candidate. | Accepted choices, real caller proof, recovery and current authority survive in the core and repository-work reference. Restored the missing completion detail. Do not make every task use an optimisation loop or require fresh permission for an already authorised action. |
| Deep-audit correction after a failed gate. | The owner already retained it provisionally. The lens contract and completion ledger remain in `multi-lens-audit.md`. No restoration needed. |
| Research/fallback follow-up and the September overhaul. | Research, substantial package reuse, intended-caller checks, shared uncertainty ownership and correction preservation remain active despite inconclusive or tied evals. |
| Latest core/writing consolidation rollback. | It restored the longer overhaul text. It did not remove those substantive ideas. The resulting prose failures remain evidence, without a claim that the shorter text caused them. |
| Generic test skill, second review command, universal banned words, never-mock rule and coverage thresholds. | Their scope or premise remains wrong for shared Simple guidance. The useful underlying proof and review ideas now have existing owners. |

The research index previously kept score-only adoption gates active after the owner
changed that policy. The index now distinguishes adoption from measured improvement.
Historical reports retain their original decisions with a pointer to this review.

### Coverage and limits

The Git inventory contains 160 commits reachable from 117 refs. Including reflog
history gives 167 commits; 144 contain a skill diff. The private diff inventory
deduplicates 470 removed lines absent verbatim from the restored Markdown. Many are
rewrites or relocations, not missing meanings. The review also examined candidate
patches and local snapshots, including the pre-overhaul, behavior and preservation
conditions. Earlier operator and writing changes received a separate scope check.

The conversation inventory covers 4 Simple T3 threads with 747 messages, the Simple
Claude transcript, and 22 Codex rollouts whose recorded directory is this repository.
Messages include tool and injected context; these are not counts of independent user
requests. The review examined relevant removal decisions and adjacent user intent.
It did not replay every attachment, reconstruct unavailable remote history or establish
that a line absent from a snapshot represents an intended capability.
