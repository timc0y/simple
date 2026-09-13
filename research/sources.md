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
| [i-have-adhd](https://github.com/ayghri/i-have-adhd), ayghri, commit 6f1f982 | Status as position, first-and-last-line send check, debug-spiral rule, task-wins precedence, list cap with completeness carve-out, failure shape, always-on mechanisms per host, dimension-scored eval | Operator file, writing reference, OpenCode plugin, Gemini extension, CI load check, rubric | [Instruction audits](instruction-audits-2026-09.md): adopted in part, rejected in part |

## Posts and threads that shaped a change

| Source | What it gave Simple | Where it lives |
| --- | --- | --- |
| Boris Cherny, X, 11 September 2026, sharing a developer's email "What to do about slop" | The observed failure: an agent never considers a slight relaxation of the spec or a different design | Stated-requirement trigger in the core stop list, plan and review contracts, the [stated-requirement screen](../evals/results/2026-09-11-stated-requirement/README.md) |
| OpenAI, [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | Newer models stop early and over-obey old restrictions; define completion up front; audit instructions with the model itself | The model-run instruction audit and the slimming in 0.8, [instruction audits](instruction-audits-2026-09.md) |
| ClaudeDevs, X, 11 September 2026, `claude plugin eval` | A host-native eval with a no-plugin baseline arm that reads Simple's case layout | Noted in the eval protocol; the docs are public, and this account's CLI reported early access on 11 September |
| Anthropic, [Teaching Claude why](https://www.anthropic.com/research/teaching-claude-why) and [Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model) | Reasons generalise better than demonstrations of actions; interpretability finds concept-like features but does not license lexical switches | [Learned priors and the semantic delta](eliciting-priors-and-teaching-the-delta.md) |
| Anthropic, [Claude 4 prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices) and [Claude Code skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) | Relevant, diverse examples; descriptions load on discovery, bodies on invocation | Progressive disclosure in the core skill |
| OpenAI, [harness engineering](https://openai.com/index/harness-engineering/), [model spec approach](https://openai.com/index/our-approach-to-the-model-spec/), [third-party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/) | Harness over prompt; explicit precedence; independent evaluation | Repository-work and board references, eval protocol |
| [Google Testing Blog](https://testing.googleblog.com/), 57 posts, 2008 to 2026 | Change-detector tests, narrow assertions, fakes over mocks, actionable failures, risk-driven testing, prefactoring, robust test values | [Google Testing Blog review](google-testing-blog.md); verification and diagnosis references |
| Codex, OpenCode, and Claude Code docs on subagents, agent teams, memory, model aliases, AGENTS.md | Host capabilities that the board, model-profiles, and swarm rules must not exceed | [Cross-host board review](cross-host-board-review.md), model-profiles reference |

## Papers

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
records what it changed. Ranked by what Simple lacks, not by fame.

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
The command runs on this account now. One converted case ran two-arm: with 1.0,
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

Crawl next, in this order:

1. [Chen et al., prompt perturbation as the noise floor](https://arxiv.org/abs/2608.22331).
   Paraphrase variance is many times repeat variance. Simple's floor is built from
   repeats only and understates noise; add paraphrased prompts to the next screen.
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

Watch for packaging drift: [anthropics/skills](https://github.com/anthropics/skills),
[openai/plugins](https://github.com/openai/plugins), [cursor/plugins](https://github.com/cursor/plugins)
and its pre-listing review, [OpenCode plugins](https://opencode.ai/docs/plugins) with
`tool.execute.before`, `permission.asked`, and `experimental.session.compacting`,
[Gemini CLI extensions](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/writing-extensions.md),
which now package hooks and skills, and [Codex plugin build docs](https://developers.openai.com/codex/plugins/build),
which confirm `PLUGIN_ROOT` and the one-time hook trust.

Two facts this search corrected in Simple's own files: the OpenCode and Gemini routes
were described as hookless, and both hosts now expose hook surfaces; and the plugin
eval was described as unavailable when only this account's CLI reported early access.
