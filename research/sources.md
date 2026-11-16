# Sources

Everything Simple has drawn on, grouped by what it contributed and where that
contribution now lives. Reports keep the full citations and method; this index
answers "where did that come from" in one place. Counts are of unique URLs cited in
the skill, references, research reports, and public docs on 13 September 2026: 241.

## Skills and plugins crawled in full

| Source | What it gave Simple | Where it lives | Status |
| --- | --- | --- | --- |
| [PStack](https://github.com/cursor/plugins/tree/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack), Cursor plugins, 73 files cited | Domain modelling, design-space exploration, reader load, shared-state separation, blast radius, build-the-lever, recall and reflect, verification creation and maintenance, TDD, visual parity, technical writing, explain and teach forms, bot control surfaces | Architecture, refactoring, verification, repository-work, writing, delivery, diagnosis references | Adopted with adaptations; [coverage map](../upstream/coverage.md) accounts for every file |
| [Ponytail](https://github.com/DietrichGebert/ponytail/tree/0a4dd63ad4541f4f655c4108a295916f3c1d8fda), Dietrich Gebert, 12 files cited | Implementation ladder, complexity review, debt and gain framing, the reference eval harness and comprehension results | Architecture ladder, review contract, eval protocol's reference implementation | Adopted; Ponytail alone is the comparison arm in several runs |
| [Matt Pocock's skills](https://github.com/mattpocock/skills/tree/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76) | Code review versus specification compliance, retro separation of navigation and checks, TDD, writing for agents | [Feedback, proof, and agent prose](simple-skill-ideas.md) | Read; no runtime text adopted beyond existing review guidance |
| [i-have-adhd](https://github.com/ayghri/i-have-adhd), ayghri, commit 6f1f982 | Status as position, first-and-last-line send check, debug-spiral rule, task-wins precedence, list cap with completeness carve-out, failure shape, always-on mechanisms per host, dimension-scored eval | Operator file, writing reference, host adapters, CI load check, rubric; the former Gemini extension is retired | [Instruction audits](instruction-audits-2026-09.md): adopted in part, rejected in part |

## Posts and threads that shaped a change

| Source | What it gave Simple | Where it lives |
| --- | --- | --- |
| [Andrej Karpathy, understanding model outputs](https://x.com/karpathy/status/2105819303471976479), 2 October 2026 | Prompted an explicit final-response preservation check and conditional interaction and animation guidance; preserve evidence and uncertainty in every form | Core writing check, writing reference visual guidance, and the [human-understanding screen](../evals/results/2026-10-02-human-understanding/README.md) |
| Boris Cherny, X, 11 September 2026, sharing a developer's email "What to do about slop" | The observed failure: an agent never considers a slight relaxation of the spec or a different design | Stated-requirement trigger in the core stop list, plan and review contracts, the [stated-requirement screen](../evals/results/2026-09-11-stated-requirement/README.md) |
| OpenAI, [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | Newer models stop early and over-obey old restrictions; define completion up front; audit instructions with the model itself | The model-run instruction audit and the slimming in 0.8, [instruction audits](instruction-audits-2026-09.md) |
| ClaudeDevs, X, 11 September 2026, `claude plugin eval` | A host-native eval with a no-plugin baseline arm that reads Simple's case layout | Noted in the eval protocol; the docs are public, and this account's CLI reported early access on 11 September |
| Anthropic, [Teaching Claude why](https://www.anthropic.com/research/teaching-claude-why) and [Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model) | Reasons generalise better than demonstrations of actions; interpretability finds concept-like features but does not license lexical switches | [Learned priors and the semantic delta](eliciting-priors-and-teaching-the-delta.md) |
| Anthropic, [Claude 4 prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices) and [Claude Code skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) | Relevant, diverse examples; descriptions load on discovery, bodies on invocation | Progressive disclosure in the core skill |
| OpenAI, [harness engineering](https://openai.com/index/harness-engineering/), [model spec approach](https://openai.com/index/our-approach-to-the-model-spec/), [third-party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/) | Harness over prompt; explicit precedence; independent evaluation | Repository-work and board references, eval protocol |
| [Google Testing Blog](https://testing.googleblog.com/), 57 posts, 2008 to 2026 | Change-detector tests, narrow assertions, fakes over mocks, actionable failures, risk-driven testing, prefactoring, robust test values | [Google Testing Blog review](google-testing-blog.md); verification and diagnosis references |
| Codex, OpenCode, and Claude Code docs on subagents, agent teams, memory, model aliases, AGENTS.md | Host capabilities that the board, model-profiles, and swarm rules must not exceed | [Cross-host board review](cross-host-board-review.md), model-profiles reference |

## Agent updates and handovers, 9 November 2026

These sources informed the owner-requested clarifications in the existing writing
reference and evaluation protocol. No new model or human study has been run for this
change; the two synthetic cases test intended decisions, not measured improvement.

| Source | Contribution and limit | Simple owner |
| --- | --- | --- |
| [Thomas Ankcorn's before-and-after](https://x.com/thomas_ankcorn/status/2119746237050101777), [Army BLUF guidance](https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN42124-AR_25-50-007-WEB-13.pdf), [AHRQ SBAR](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html) | Lead with the outcome and select information needed for action. The screenshot illustrates presentation, not factual verification; no fixed SBAR sequence is adopted. | `references/writing.md`, Reviews, updates, and handoffs |
| [Official ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf), [STEMG AI white paper](https://www.asd-ste100.org/assets/files/WhitePaper-ASD-STE100_and_AI.pdf) | Preserve technical terms and uncertainty through simpler wording. The standard permits domain terminology and unknown actors; an AI rewrite or checker does not certify meaning or compliance. | `references/writing.md`, Editing |
| [Ghinda's adjudication](https://github.com/lucianghinda/llm-experiments/blob/main/simplified-technical-english/ADJUDICATION.md), [replication limits](https://github.com/lucianghinda/llm-experiments/blob/main/simplified-technical-english/RUN-NATIVE-PROVENANCE.md), [Ovhal's comparison implementation](https://github.com/prasadovhal/ai-playground/blob/main/prompting/src/asd.py) | Keyword checks missed valid paraphrases; the later correction mainly rechecked misses. Frozen-output comparisons separate writing from task execution, but model ratings do not establish reader comprehension. | `evals/README.md`, `evals/rubric.md`, `evals/meaning-preservation/` |
| [Vasconcelos et al.](https://cicl.stanford.edu/papers/vasconcelos2023explanations.pdf), [Kim et al.](https://arxiv.org/html/2405.00623v2), [Yona et al.](https://aclanthology.org/2024.emnlp-main.443/) | Verification effort and uncertainty wording can affect reliance. Expressed doubt need not reflect model uncertainty; transfer from the studied tasks to coding-agent updates remains an inference. | Decisive observations and specific unknowns in `references/writing.md`; reader-study limits in `evals/README.md` |
| [Google's incident handoff](https://sre.google/sre-book/managing-incidents/), [AHRQ handoff guidance](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html) | Preserve state, responsibility and the next action. Receiving a handoff does not verify its claims or expand an agent's user-granted authority. | `references/writing.md`, handoff contract; `evals/handoff-evidence/` |

## Papers

The [writing, meaning and evaluation catalogue](writing-research.md) retains the
16 November continuation: the Julian Harris/Edison post, the earlier Thomas Ankcorn
post, adversarial learning, personalisation, source preservation, reviewer reliability
and related coding references. The [saved implementation plan](../simple/writing-evaluation-plan.md)
is proposed work, not adopted runtime guidance or a new evaluation result.

Function Vectors (2310.15213), Zero-Shot Reasoners (2205.11916), Chain-of-Thought
Prompting (2201.11903), Automatic Prompt Engineer (2211.01910), Rethinking the Role
of Demonstrations (2202.12837), Retrieval-Augmented Generation (2005.11401), Lost in
the Middle (2307.03172), and three 2026 preprints on complexity metrics and judge
reliability cited in the metric reports. They justify testing compact cues, keeping
the core short, and refusing to claim gains from ties. Full citations are in
[Learned priors and the semantic delta](eliciting-priors-and-teaching-the-delta.md)
and the [metric guardrails](code-metric-guardrails.md) report.

## Engineering precedents

SpaceX Raptor and the 2026 prospectus, Apple's iPhone, unibody MacBook, and Apple
silicon announcements, Sony's Walkman history, Amazon's Dynamo paper, NASA's systems
engineering handbook, the FAA software quality report, Minto's pyramid. Used as
analogies in the examples and architecture references; the examples file states they
cannot create a requirement.

## Metrics and tooling references

McCabe, ABC, and cyclomatic density papers; ESLint, oxc, RuboCop, size-limit,
Lighthouse CI, and webpack performance docs; GitHub Copilot code review docs; W3C
PROV-O. Used to decide that a metric is selected for an observed consequence, never
installed as a stack. See [cyclomatic complexity audits](cyclomatic-complexity-audits.md)
and [code metric guardrails](code-metric-guardrails.md).

## Jev decision models and harnesses, 21 September 2026

| Source | What it gave Simple | Where it lives |
| --- | --- | --- |
| [Jev](https://typesafe.ai) and the [TypeSafe docs](https://docs.typesafe.ai/models), [primitives](https://docs.typesafe.ai/primitives), [use-case map](https://docs.typesafe.ai/concepts/use-case-map) | The three primitives (`noul`, `choice`, `score`), vendor-stated confidence, batched questions, price and latency at the research date. A closed output space restricts available answers; it does not prevent a wrong choice | [Jev decision models](jev-decision-models.md) |
| [coldteadotai/abide](https://github.com/coldteadotai/abide), its [replay benchmark](https://github.com/coldteadotai/abide/blob/master/benchmarks/replay/README.md) and `packages/cli` source | Compile-once, check-per-turn harness architecture; edit versus turn phase and the measured precision gap between them (26 against 73 percent); the act/flag/clear bands where 0.5 to 0.8 never reaches the agent; calibration that disables rules that never separate; fail-open hooks with hard timeouts and a detected partial-turn skip | The replace and add tables, and the phase guidance, in the report |
| [y0usaf/pi-jev](https://github.com/y0usaf/pi-jev) | Measured threshold selection from scored states, shadow-first defaults, a fail-open gate, and the pre-call gate plus post-call output judge plus in-loop `jev_ask` shapes | The shadow-only and fail-open constraints in the report |
| [Niaz Morshed, JCR](https://jcr.niazmorshed.dev/), 20 September 2026 | Resolving a request to a deterministic operation by walking only the direct children of a capability tree, with a `none of these` option at every level, geometric-mean path scoring, top-k pruning, and ambiguity reported instead of guessed; also the gap between measuring context and cost and measuring resolution accuracy | The routing and abstention mechanics, and the metric the benchmark omits, in the report |
| [LangChain, Building a Harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | The same decision layer in a general agent loop: routing, tool selection and grading as Jev questions | The report's framing of Jev as a selection layer rather than a generator |

## Private evidence, not cited publicly

- A 10,150-message corpus of the maintainer's own Claude Code and Codex sessions,
  July to September 2026, read by four classifiers. It produced the operator file and
  the five reader rules. Kept in local context.
- A model-run audit of Simple's instruction files by GPT-6 Astra, 11 September 2026.
  Its adopted items are listed in [instruction audits](instruction-audits-2026-09.md);
  the report itself is local.
- A client round of 9 to 10 September 2026, which showed the status-wall failure
  that `simple round` answers. No client text is in the public tree.

## Candidates from the 13 September 2026 search

Three readers fetched and verified 38 sources and discarded about 90 more as
restatements or listicles. A candidate becomes a source above only after a crawl
records what it changed. The following observations describe that search, not a
current work queue or a fresh check of host capabilities.

Crawled 13 September 2026, recorded in [compaction survival](compaction-survival.md):
the Claude Code hooks and memory docs and the governance-decay paper. Result: no
change on Claude Code, compaction pinning added to the OpenCode plugin, and the
bypass-mode caveat recorded in the profile.

Crawled 13 September 2026: [destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard).
Its three-tier unwrapping of heredocs and inline scripts closes a class Simple's guard
never had, because Simple matches the whole raw command text, heredoc bodies and
inline scripts included. Neither guard covers encoded or runtime-built payloads; that
boundary and an opaque-execution pattern are now in the operator template. Its
allow-once code and per-rule allowlist are worth a later look.

Crawled 13 September 2026: [plugin evals](https://code.claude.com/docs/en/plugin-evals).
The command ran on the maintainer's account at that date. One converted case ran two-arm: with 1.0,
without 1.0, delta 0 on Claude's default model, where Luna gave 0 of 2 against 2 of
2. Recorded in the [plugin eval trial](../evals/results/2026-09-13-plugin-eval-trial/README.md).

Crawled 13 September 2026: [skill-eval-harness](https://github.com/adewale/skill-eval-harness)
and the skills docs' should-fire and should-not-fire cases. `evals/activation/run.sh`
now runs twelve prompts that never name Simple and counts the skill file being
opened. The [baseline](../evals/results/2026-09-13-activation/README.md) found 12 of
12 should-fire and 6 of 12 false fires; the
[description A/B](../evals/results/2026-09-13-activation-ab/README.md) kept 12 of 12
and cut false fires to 0 of 12 against 3 of 12 for the old wording in the same run.
The narrower description with a stated exclusion ships in the skill.

Unreviewed candidates from that search, not adopted:

1. [Chen et al., prompt perturbation as the noise floor](https://arxiv.org/abs/2608.22331).
   Reported paraphrase variance exceeds repeat variance. This motivated a question
   about measuring prompt variation; the current evaluation protocol includes
   paraphrased prompts when available.
2. [Lulla et al., AGENTS.md effects](https://arxiv.org/abs/2601.20404),
   [Khatri, equivalence testing](https://arxiv.org/abs/2607.27250), and
   [McMillan, factorial design](https://arxiv.org/abs/2605.10039). Across 124, 288,
   and 1,650 runs, instruction files moved cost and latency reliably and correctness
   barely. Report tokens and latency as outcomes, and turn a tie into a bounded null.
3. [ETH agentbench](https://github.com/eth-sri/agentbench). Model-written context
   files cut success about 3 percent and raised cost over 20 percent; developer-written
   ones did not. Evidence for the profile rule that facts must be observed, not
   inferred.
4. [adewale/anti-slop-writing](https://github.com/adewale/anti-slop-writing).
   Paired bootstrap and permutation gating on a tune versus holdout split, with the
   stated rule that a zero-delta gate is no-regression evidence, not improvement.
5. [Norman et al., judge position bias](https://arxiv.org/abs/2606.19544). Swap the
    order of the pass and fail references and require the verdict to hold. Cheap.

Read for mechanism only:

- [raichominev/compaction-handoff](https://github.com/raichominev/compaction-handoff),
  a probe that demands evidence for every status claim before a handoff.
- [Anthropic, demystifying evals for agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents),
  pass^k beside pass@k, periodic grader calibration against human labels.
- [ACES, skill lift](https://arxiv.org/abs/2608.20614): a composite lift was positive in
  only 72.8 percent of 947 paired cases, a realistic pass bar.
- [Edwards and Schuster](https://arxiv.org/abs/2603.26233): agents almost never ask
  unless instructed; relevant to the stop-or-continue rule.
- [Promptfoo, testing agent skills](https://www.promptfoo.dev/docs/guides/test-agent-skills/),
  a cross-host runner with a skill-used assertion.
- [obra/superpowers](https://github.com/obra/superpowers) for how an entry instruction
  forces sub-skill activation, read narrowly.
- [OpenAI, GPT-5.2 prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide):
  a numeric default of three to six sentences or five bullets.
- [Crosley, AGENTS.md patterns](https://blakecrosley.com/blog/agents-md-patterns):
  every instruction should name the command that proves it was done.

Packaging sources identified by that search: [anthropics/skills](https://github.com/anthropics/skills),
[openai/plugins](https://github.com/openai/plugins), [cursor/plugins](https://github.com/cursor/plugins)
and its pre-listing review, [OpenCode plugins](https://opencode.ai/docs/plugins) with
`tool.execute.before`, `permission.asked`, and `experimental.session.compacting`,
[Gemini CLI extensions](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/writing-extensions.md),
which documented hooks and skills at the research date, and [Codex plugin build docs](https://developers.openai.com/codex/plugins/build),
which documented `PLUGIN_ROOT` and hook trust.

At that date, the search corrected descriptions of the OpenCode and former Gemini
routes as hookless, and a claim that plugin evaluation was unavailable when only the
maintainer's CLI reported early access. [Host setup](../docs/hosts.md) owns current
support and verification limits; Gemini CLI support is retired.
