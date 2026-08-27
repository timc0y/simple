# Eliciting learned priors and teaching the delta

Research date: 26 August 2026.

## Decision

Use three different mechanisms for three different kinds of knowledge:

1. **Cue a learned prior.** Use a compact, established term when the model probably
   already knows the concept and the term produces the wanted behaviour in an A/B test.
2. **Teach the semantic delta.** Define what Simple means when its meaning is narrower
   than, or conflicts with, the common meaning of that term.
3. **Supply live state.** Put current repository facts, commitments, tools, and observed
   failures in inspectable context. Do not expect a phrase to recover them from model
   weights.

A prompt does not query or replay the model's training documents. It conditions a model
whose parameters encode learned patterns. “Activate the training data” is therefore a
useful metaphor only if it means “elicit a learned prior.” Research has found compact
task representations inside some language models, but demonstrations rather than single
keywords induced those representations, and the authors tested particular models and
tasks. This does not establish a universal lexical switch for a concept
([Function Vectors in Large Language Models](https://arxiv.org/abs/2310.15213)). Anthropic's
interpretability work likewise finds concept-like features while warning that its methods
capture only part of a model's computation
([Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model)).

Treat every leading word as a model-relative, harness-relative hypothesis. The eval, not
the elegance of the phrase, decides whether it earns its context load.

## What the evidence supports

Prompt wording can elicit capabilities already present in a model. “Let's think step by
step” produced large gains on several reasoning benchmarks in two model families, while
few-shot chains of thought improved reasoning in sufficiently large models
([Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916),
[Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)). These results support
testing compact cues. They do not show that the same phrase still helps current agentic
models, software design, or every harness.

Prompt quality is empirical. Automatic Prompt Engineer searched instruction candidates
against a score and found large differences between prompts
([Large Language Models Are Human-Level Prompt Engineers](https://arxiv.org/abs/2211.01910)).
This supports Simple's rule that a wording change ships only when paired evals move.

Examples are useful, but their mechanism is easy to misunderstand. On the classification
tasks studied by Min and colleagues, demonstrations mainly conveyed the label space,
input distribution, and format; replacing correct labels often caused little damage
([Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837)). Current
Anthropic guidance recommends relevant, diverse, structured examples for accuracy and
consistency
([Prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)).
For Simple, examples should teach a hard distinction or proof shape. They should not be
treated as a substitute for the decision principle.

Principles and reasons may transfer better than action-only demonstrations. In a 2026
alignment-training case study, Anthropic found that demonstrations of desired behaviour
alone were insufficient and that examples explaining why an action was better generalized
more effectively. This is training evidence from a safety domain, not direct proof about
skill prompts, but it justifies testing a principle-plus-rationale example against an
action-only example
([Teaching Claude why](https://www.anthropic.com/research/teaching-claude-why)).

Private, current, or repository-specific facts need external context. Retrieval-augmented
generation was introduced partly because parametric knowledge is difficult to update and
provide provenance for
([Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)). Long context is not
enough by itself: models can use facts less reliably when those facts sit in the middle of
a large context
([Lost in the Middle](https://arxiv.org/abs/2307.03172)). This supports a short core skill,
a focused `SIMPLE.md`, and conditional references. Claude Code's current skill contract
also loads descriptions for discovery, the skill body on invocation, and supporting files
only when needed
([Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills)).

The Farnam Street article contributes one useful decomposition: separate assumptions
from what must actually be true, then reconstruct from those constraints. Its phrases
“fundamental truths” and “start from scratch” are unsafe defaults for an existing
repository because they can turn an inference into certainty or bias the model toward a
rewrite. Simple's repository evidence and preservation boundary are necessary semantic
corrections
([First Principles: The Building Blocks of True Knowledge](https://fs.blog/first-principles/)).

The Minto Pyramid adds a useful output shape: one main conclusion, grouped reasons,
then facts. Simple already requires outcome-first communication and material
evidence. A focused loop tested the framework name and 2 plain alternatives. The named
sentence scored 10 of 10, while the baseline scored 9 of 10. However, that sentence
failed the required STE100 check. The compliant alternatives scored 8 and 9. No runtime
text qualified to ship
([Barbara Minto's concept](https://www.barbaraminto.com/concept),
[Untools summary](https://untools.co/minto-pyramid/)).

Oxlint's `complexity` rule counts linearly independent paths in a program. Its default
maximum is 20, and its `classic` and `modified` variants count `switch` statements
differently. This can expose branch-heavy local code. It does not measure extra owners,
workflows, dependencies, distributed state, or operational coordination. That limit is
an inference from the metric's stated scope, not a fault in the rule
([Oxlint `eslint/complexity`](https://oxc.rs/docs/guide/usage/linter/rules/eslint/complexity)).

## Candidate cues

| Phrase | Prior worth eliciting | What Simple must still teach | Decision |
| --- | --- | --- | --- |
| `first-principles reasoning` | Decompose a problem and challenge inherited assumptions. | Repository evidence decides what is true. Existing obligations and owners survive unless evidence permits replacement. | Keep. The current paired run improved `mutation-interval` from 1 of 3 to 3 of 3, but the edit also changed other lines. |
| `invariant` | State behaviour independently of one implementation. | The invariant comes from actual users, contracts, retained data, scale, or failure consequences. | Keep in the design sequence. Ablate it separately before attributing the previous gain to it. |
| `falsify` | Seek disconfirming evidence rather than a confirming story. | Proof must use a surface independent enough to distinguish behaviour from implementation. | Keep as a candidate. Test it separately from `first-principles` and `invariant`. |
| `YAGNI` | Resist speculative generality. | A future commitment can be real even when its execution date is future. YAGNI rejects hypotheses, not signed or published obligations. | Keep once. Do not repeat it as a substitute for checking consumers and commitments. |
| `Chesterton's Fence` | Understand a mechanism before deleting it. | Existing code alone does not prove a compatibility requirement, and missing evidence does not grant deletion permission. | Keep on the removal branch. |
| `KISS` | Prefer uncomplicated solutions. | “Simple” means the least complicated design that satisfies present obligations, not the shortest diff or fewest concepts at any cost. | Keep once unless an ablation shows it is a no-op or worsens under-design. |
| `root cause` | Repair a shared cause instead of each symptom. | Bound the investigation to the reported failure and observed callers. | Use only on diagnosis, bug, and performance branches. Do not broaden Simple's description merely to capture those tasks. |
| `counterfactual` | Separate an outcome from the current mechanism. | Repository facts still constrain the alternative. | Test as an alternative to the current invariant sentence, not an additional sentence. |
| `single source of truth` | Keep one authoritative owner for one fact. | A real independent lifecycle, consumer, or failure domain can justify a boundary. | Keep in writing or ownership guidance only when the task needs it. |
| `proof obligation` | Make a claim answerable to evidence. | State the exact observable proof and stop condition. | Do not add while `independent proof` is clearer and already works. |
| `Minto Pyramid` or `BLUF` | Put the conclusion before the reasons and the evidence. | Preserve material constraints, caveats, proof, and unknowns. Do not force every short message into three layers. | Use the hierarchy for answers in the training data. Do not add runtime text until an STE100 form wins repeated trials. |
| `cyclomatic complexity` | Count independent control-flow paths and flag branch-heavy functions. | It is a local signal, not a system-complexity score. A threshold and counting variant must come from repository policy and observed code. | Use as optional audit evidence when a repository already enables it or dense branching is the measured problem. Do not add Oxlint or a global threshold here. |

The following phrases should not become Simple leading words without contrary eval
evidence:

- `fundamental truths`: encourages unjustified certainty about incomplete repository
  evidence.
- `start from scratch` or `build from the ground up`: primes replacement before the
  preservation boundary is known.
- `Socratic questioning`: can turn autonomous repository inspection into an interview.
- `Five Whys`: can force a linear ceremony onto causes that are concurrent, systemic, or
  already observable.
- `Occam's razor`: prefers an explanation; Simple must choose a design that meets
  obligations. The two can diverge.
- `analogy`: useful for generating a hypothesis, but too strong as evidence. Keep
  precedents behind their conditional reference.
- names of famous engineers or companies: they activate a persona or story unless the
  task explicitly requests sourced operator doctrine.

## Knowledge Simple must teach explicitly

Even a widely known term needs a definition when Simple gives it a local meaning. The
core skill should carry only the semantic delta every relevant run needs:

- `truthful`: supported by observed requirements, repository facts, or explicit
  commitments;
- `present obligation`: real now, including a committed future compatibility window, not
  merely code that happens to exist;
- the evidence rule: absence of evidence grants neither an obligation nor deletion
  permission;
- `ordinary path`: the existing supported route and owner, not merely a happy path with
  no errors;
- `missing precondition`: the smallest capability that lets the ordinary path meet the
  invariant without moving ownership;
- preserve versus replace: public contracts and retained state can survive while
  unpublished internals change;
- independent proof: an observable surface that can disprove the proposed design;
- design versus writing mode;
- doctrine versus persona in operator emulation.

Other knowledge belongs outside the core:

| Knowledge | Why model training is insufficient | Owner |
| --- | --- | --- |
| Actual users, operators, consumers, public commands, retained data, scale, and failure consequences | These facts are private, current, and repository-specific. A public copy of the repo may also be stale. | Nearest `SIMPLE.md` |
| Current host behaviour, invocation rules, tool availability, and exact commands | Hosts and versions change after training and differ by environment. | Command and model-profile references, verified against the running host |
| A difficult local distinction or known platform limitation | It may be unpublished or too rare to have a stable prior. | Focused reference or one measured example |
| Observed model and skill-interaction failures | They depend on model revision, harness, other loaded skills, and wording. | Eval results and capability profiles |
| Active lint rules, thresholds, variants, and current violations | Tool versions and repository policy change. A model cannot infer the accepted baseline. | Repository configuration and current tool output |
| Deterministic mechanics | Natural-language recall is less reliable than execution. | Small inspected script with validation |
| Temporary repository state and test output | It exists only in this run. | Tool output and the final handoff |

This repository already follows most of that boundary. `SKILL.md` owns shared semantics,
`SIMPLE.md` owns current facts, references own specialist branches, and scripts own exact
mechanics. The clean Codex matrix did not prove a Simple and Ponytail interaction. The
combined arms scored well, but traces did not show uniform Ponytail use. Any runtime
treatment needs a forced-invocation interaction eval, not another universal minimalism
slogan.

## If Simple becomes training data

Do not train only on final answers or repeated slogans. A useful training item contains:

1. the user request;
2. the repository facts available to the model;
3. the required invariant;
4. the chosen owner and ordinary path;
5. the exact missing capability, if any;
6. the decision and its reason;
7. displaced machinery to remove;
8. independent proof;
9. material unknowns or a justified stop.

Use contrastive pairs near real decision boundaries. Hold the surface request steady and
change one repository fact:

- pre-launch with no consumers versus a published API with old clients;
- no retained data versus a production migration window;
- correctly owned but inaccessible state versus genuinely wrong ownership;
- one owner versus independent failure domains;
- speculative growth versus measured load;
- a safe reversible edit versus an irreversible external action.

For each pair, include the principle and the rationale that connects the changed fact to
the changed decision. OpenAI's current Model Spec method similarly uses decision rubrics
and small compliant/non-compliant examples near hard boundaries, while broader evals
cover the long tail
([Inside our approach to the Model Spec](https://openai.com/index/our-approach-to-the-model-spec/)).

Vary repository shape, terminology, language, tool definitions, and host context so the
model cannot solve the task by matching one phrase. Keep evaluation prompts, graders, and
close variants out of the training set. Current evaluation guidance identifies
contamination, broken tasks, harness differences, and scorer shortcuts as threats to a
valid claim
([A shared playbook for trustworthy third-party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)).

Do not turn the public engineering stories into the training curriculum. They carry many
incidental details. Use them to generate a principle, then write original contrastive
repository cases that isolate that principle.

Structure answers in the training data as a conclusion and the reasons that change the decision.
Then give only the evidence that the reader needs. Vary the headings and surface format so the
model learns the information order rather than the name `Minto Pyramid`. Include
examples where a caveat or unknown must appear near the conclusion, so compression does
not become false certainty.

Treat cyclomatic complexity as one feature, not the target label. Include pairs where a
refactor removes real branches and where it only moves branches into pass-through
helpers. Also include a justified protocol with several required states and a locally
low-complexity design that creates extra owners or workflows. Grade preserved behaviour,
ownership, total system burden, and proof before the numeric score.

## Next evals

### 1. Invocation, separate from execution

Compare description variants while keeping the body identical. Record the skill trace,
not just answer quality.

Start with four implicit positive and four negative prompts, three runs per arm. Expand
only if the result is close.

Positive prompt families:

- speculative infrastructure justified only by possible growth;
- deleting an unexplained adapter with no visible callers;
- moving state because the current API cannot address it;
- adding a second owner beside an existing path.

Negative controls:

- a local variable rename;
- a spelling correction;
- an explanation of a small function;
- an explicitly required validation check with no design choice.

Do not put `first principles`, `simple`, `KISS`, or `YAGNI` in the implicit prompts. Use
one explicit `first principles` prompt only as a recognition control. The previous
activation test used the candidate's own leading phrase, and both arms invoked Simple,
so it measured neither recall nor an invocation gain.

### 2. Execution ablation

The previous candidate changed several things at once. Run one-change arms against the
same hard cases:

1. `first-principles reasoning` only;
2. facts and commitments versus inference, assumptions, and unknowns only;
3. mechanism-independent `invariant` only;
4. `falsify` with independent proof only.

Use `mutation-interval` as the primary case and keep ordinary-path, startup-root-cause,
and production-data controls. Combine only the winning changes. A full factorial is not
needed unless two winning changes interact.

### 3. Context dependence

Use new private fixtures with nonce facts that cannot plausibly be recalled from public
training data. Test three conditions:

- the necessary fact is in `SIMPLE.md`;
- the fact conflicts with a plausible public or conventional assumption;
- the fact is absent and the correct result is inspection, uncertainty, or a stop.

This tests whether the skill retrieves live state instead of merely producing familiar
minimalism prose.

### 4. Principle versus example

On one repeatable failure, compare:

- principle only;
- one contrastive example only;
- principle plus the example's reason.

Keep the example only if it improves transfer to a differently worded holdout case. Do
not grade whether the answer repeats the example's vocabulary.

### 5. Skill interaction

Repeat the interval case under Simple alone, Ponytail alone, and both. Require trace-
verified reads for the execution test. Test one narrow interaction instruction only if
the forced comparison shows a repeatable fault. A README warning is evidence for
maintainers, not necessarily guidance available to an invoked skill.

### 6. Model and harness transfer

After a candidate wins on one model, repeat the smallest representative set across each
supported host. Record model revision, reasoning setting, skill trace, context sources,
tools, retries, latency, tokens, and cost. A cue that helps one model can be a no-op or a
misroute on another.

## Repository recommendation

Do not add more leading words to `SKILL.md` now. Keep the implemented first-principles
candidate because it moved a hard behavioural case. The next useful change is an eval
change: add implicit invocation prompts and isolate the four co-changed instructions.

Add explicit prose only for a demonstrated semantic gap or missing local fact. Prefer
one local binding for an overloaded pretrained concept over a second slogan that repeats
it.
