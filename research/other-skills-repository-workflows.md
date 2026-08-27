# Repository workflows in other installed skills

Research date: 27 August 2026.

## Decision

Do not add a start, fix, improve, or add router to Simple. Keep the four shapes as
evaluation lenses, not runtime instructions or commands.

```text
Start   -> one ordinary path works end to end
Fix     -> the exact symptom goes red, the shared fix makes it green
Improve -> a direct baseline improves under the same measurement
Add     -> the capability works through the existing owner and public surface
```

The current method already supplies the shared reasoning: establish reality, find the
owner and ordinary path, name the obstruction, choose the smallest sufficient change,
remove displaced machinery, and prove the outcome. Its architecture and refactoring
references cover the necessary implementation choices. Specialist skills can still
own debugging, test-first delivery, interface work, or repeated optimization when the
task calls for them. [S1] [S2]

Two isolated Luna and Terra experiments resolved the proposed runtime changes:

- the current skill and a work-shape proof router both passed 10 of 10 Simple-only
  cells; the candidate fell from 10 of 10 to 7 of 10 with Ponytail;
- current and candidate descriptions opened Simple in all 40 substantive activation
  cells, while the candidate additionally opened on 2 of 4 typo-only controls.

See the [work-shape screen](../evals/results/2026-08-27-repository-work-shapes-screen/README.md)
and [activation run](../evals/results/2026-08-27-repository-work-shapes-activation/README.md).
The candidates added no useful routing and therefore do not ship.

## What the skills show

| Skill | Invocation and process | Completion criterion | Useful lesson for Simple |
| --- | --- | --- | --- |
| Diagnosing Bugs | Activates on “diagnose,” “debug,” or a reported failure. It requires a tight red-capable loop before hypotheses, then reproduce, minimise, form falsifiable hypotheses, instrument, fix, regress, and clean up. [D1] | The original symptom no longer reproduces, a correct-seam regression test passes or its absence is recorded, and temporary instrumentation is removed. [D1] | For `fix`, require proof of the exact symptom before code theory. Keep ranked hypotheses and instrumentation as specialist guidance for hard bugs. |
| TDD | Activates when test-first work is requested. It tests observable behaviour at an agreed public seam and works in vertical slices: one red test, one minimal implementation, repeat. [T1] | The requested behaviour is green through the public interface; tests remain independent of implementation details. [T1] | For `add`, use one caller-visible vertical slice as the first proof. Leave test seams, mocking, and red-green discipline to TDD. |
| Prototype | Activates when a logic, state, or UI question needs a throwaway experiment. The question selects the artifact; the artifact is trivial to run, exposes relevant state, and is removed from main after the answer is captured. [P1] | The named question has an answer, the validated decision enters real code, and prototype machinery leaves main. [P1] | When uncertainty changes the solution shape, build only enough to answer one named question. Do not turn every start or addition into a prototype. |
| Autoresearch | Activates on autonomous measurable optimization and explicitly excludes one-shot work, simple fixes, reviews, and work without a metric. It establishes goal, metric, scope, constraints, budget, and baseline before a focused experiment loop. Ties and regressions are discarded. [A1] | The experiment budget ends with a recorded baseline, final metric, kept and discarded trials, and cumulative changes. [A1] | For `improve`, require the same measurement before and after, count complexity as a cost, and reject tied changes. Leave branching, repeated experiments, and result journals to Autoresearch. |
| Domain Modeling | Activates only when the domain model, glossary, `CONTEXT.md`, or ADRs are being changed. It sharpens terms against scenarios and code, creates files only after knowledge is resolved, and uses ADRs only for hard-to-reverse, surprising trade-offs. [M1] | Resolved terms and qualifying decisions are recorded at their owning source; no speculative glossary or ADR scaffolding is created. [M1] | Read local vocabulary before all four work shapes. Invoke Domain Modeling only when the vocabulary or model itself changes. |
| Improve UI | Activates on evidence-based review of one existing product surface. It traces one runtime path, treats observations as candidates, requires contract, runtime, and correction proof, then tries to falsify each finding. No supported finding is a valid result. [I1] | At most three non-overlapping findings survive the proof gate; selected work receives a self-contained plan with validation and stop conditions. [I1] | For `improve`, a difference is not yet a defect. Require a governing obligation, a real path, and a determined correction. Preserve “no change” as a successful outcome. |
| Baseline UI | Activates as a persistent UI constraint set or a file review that returns exact violations, effects, and fixes. Most content is stack- and craft-specific. [B1] | The requested file is checked against its stated rules. [B1] | Borrow the precise output contract, not its Tailwind, component, animation, or visual rules. Those remain design-specialist policy. |
| Web Performance Optimization | Uses a broad measure, identify, prioritize, implement, verify sequence. It then supplies a large catalog of tools, thresholds, and remedies. [W1] | The same performance surfaces are measured after changes and compared with the baseline. [W1] | Borrow only baseline -> bottleneck -> change -> repeat measurement. Do not copy generic budgets, tool choices, or remedies into Simple; they depend on the stack, environment, and current platform guidance. |
| Ponytail | Activates broadly on coding and explicit simplicity language. Its ordered ladder checks need, repository reuse, standard library, platform, installed dependency, and direct local code. It says the ladder follows full understanding and routes fixes to the shared cause. [Y1] | The smallest working implementation remains, with one runnable check for non-trivial logic. [Y1] | Simple already has the stronger evidence-aware implementation ladder. Keep Ponytail's terse implementation pressure separate from Simple's problem and ownership reasoning. |

## Tested workflow hypothesis

The following shapes were useful for constructing contrastive eval cases. They are not
a proposed section for `SKILL.md`.

### Start

1. Name the user or caller, first useful outcome, operating environment, constraints, and proof.
2. Inspect the repository before selecting tools or scaffolding. If it is empty, use the platform's ordinary project shape.
3. Build one vertical path from real input through the owning logic to an observable result.
4. Stop when that path runs and its proof is repeatable.

Prototype only when a material design question blocks this path. Create domain files only after a term or decision becomes real. [P1] [M1]

### Fix

1. Make the reported symptom observable with the smallest red-capable loop.
2. Reproduce and minimise it, then trace the affected owner, callers, and sibling paths.
3. Fix the earliest shared broken invariant, not only the reported endpoint.
4. Re-run both the original scenario and the regression proof; remove temporary diagnostics.

Simple should stop and invoke Diagnosing Bugs when no truthful reproduction exists or when the failure is hard, intermittent, or performance-related. [D1] [Y1]

### Improve

1. Translate “better” into an observed consequence and its nearest direct measure.
2. Record the baseline and preserve the behaviour, identity, or contract that must not regress.
3. Find the causal bottleneck and change one load-bearing thing.
4. Repeat the same measurement and an independent behaviour check. Remove the change when it ties, regresses, or merely moves the score.

Use Autoresearch only for repeated autonomous experiments. Use a domain audit when the outcome needs domain evidence, such as rendered UI or production performance. [A1] [I1] [W1]

### Add

1. State the capability without naming the proposed implementation.
2. Find its consumer, public seam, existing owner, ordinary path, and exact obstruction.
3. Extend that path in one vertical slice. Do not create a second owner or future extension point without a present requirement.
4. Prove the happy path and material failure behaviour through the public surface, then remove the workaround or duplicate route displaced by the addition.

Use TDD when the user requests test-first delivery or the new behaviour benefits from a durable seam. Use a prototype when the seam or interaction is the unanswered question. [T1] [P1] [S1]

## Progressive disclosure

The best installed examples keep activation and routing in the core, then load detail only after the branch is known:

- TDD links test and mocking examples from a short core. [T1]
- Prototype routes logic and UI questions to separate references. [P1]
- Improve UI loads its plan template only after a finding is selected. [I1]
- Domain Modeling creates context and ADR files only when resolved knowledge earns them. [M1]

Simple already follows the useful part of this pattern: a small core routes to existing
architecture, refactoring, writing, and other specialist references. The evals did not
show a retrieval failure that would earn four more routes or another reference. Do not
add `simple start`, `simple fix`, `simple improve`, or `simple add` commands.

## Evaluation result

Activation and execution were tested separately with nonce repository facts and a
typo-only control. The suite remains useful because it covers a greenfield start and a
shared-owner fix that earlier cases did not expose.

Grade these properties:

- the response selects the correct work shape without inventing requirements;
- the first action establishes the relevant evidence;
- the change uses the existing owner and ordinary path when one exists;
- the completion condition observes the requested outcome independently;
- no specialist ceremony appears in a simple task;
- no-change, rollback, or escalation is accepted when evidence does not support an edit.

The runs used no-skill, Simple, Ponytail, Simple plus Ponytail, and candidate arms with
Luna and Terra. The rejected candidates remain with the result records. The one change
earned by this work is profile-authoring guidance: co-locating an existing owner,
supported mechanism, and observable behaviour under `Ordinary paths` improved strict
passes from 2 of 6 to 5 of 6 without adding ordinary runtime context. See the
[profile-reference run](../evals/results/2026-08-27-profile-reference-guidance/README.md).

## Sources

- [D1] `~/.agents/skills/diagnosing-bugs/SKILL.md:3,18-138`
- [T1] `~/.agents/skills/tdd/SKILL.md:3,12-38`; `tests.md`; `mocking.md`
- [P1] `~/.agents/skills/prototype/SKILL.md:3,8-26`; `LOGIC.md`; `UI.md`
- [A1] `~/.agents/skills/autoresearch/SKILL.md:3,19-30,34-168,170-220`
- [M1] `~/.agents/skills/domain-modeling/SKILL.md:3,8,40-74`
- [I1] `~/.agents/skills/improve-ui/SKILL.md:3,8-24,45-116`; `references/plan-template.md`
- [B1] `~/.agents/skills/baseline-ui/SKILL.md:3,10-85`
- [W1] `~/.agents/skills/web-performance-optimization/SKILL.md:3,15-72`
- [Y1] `~/.codex/plugins/cache/ponytail/ponytail/4.9.0/skills/ponytail/SKILL.md:3-15,32-64,90-112`
- [S1] `skills/simple/references/architecture.md:25-108`
- [S2] `skills/simple/references/refactoring.md:5-21`
