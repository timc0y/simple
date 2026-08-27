# Cyclomatic complexity audits and the “91 to 12” claim

Research date: 26 August 2026.

## Decision

The reported score change is real, but the headline gives the score too broad a definition.
One Hunk function had an Oxlint score of 91 before the refactor and 12 after it.
The total syntax decision count for the session parser fell from 90 to 80.
Most of the change put prior decisions into smaller functions with narrower ownership.

Use cyclomatic complexity to find code with dense control flow.
Do not use it as a score for all code quality or all system complexity.
A useful audit must show the tool settings, the scope, the code change, and independent proof.

Do not add Oxlint or a complexity gate to Simple now.
A local audit found no function above the Oxlint default limit of 20.
Simple also has no observed fault that a new gate would prevent.

## Assessment of the post

| Claim | Assessment | Evidence |
| --- | --- | --- |
| The score fell from 91 to 12. | Correct for one function. | The same Oxlint version reproduced both scores. |
| The code fell from 91 decision paths to 12. | Incorrect label. | The values are basis sizes, not all possible execution paths. |
| The refactor made the dispatcher simpler. | Supported. | The dispatcher now delegates each command to a focused parser. |
| The refactor removed most decision logic. | False. | The session syntax decision count fell from 90 to 80. |
| Artificial intelligence (AI) code often has poor scores. | Not established. | Current studies show mixed results and small effects. |
| A complexity gate now protects Hunk `main`. | False at the research time. | The gate commit is not in the history of `main`. |
| Audits can find useful changes. | Supported as a search method. | Hunk has examples of algebra, shared policy, and function split changes. |

The [original post](https://x.com/bentlegen/status/2092606355685216425) links the result to Hunk.
The thread names the [Oxlint complexity rule](https://oxc.rs/docs/guide/usage/linter/rules/eslint/complexity).
It also links [Hunk pull request 857](https://github.com/modem-dev/hunk/pull/857).

## What 91 means

McCabe defines cyclomatic complexity from a control flow graph.
For a connected module, the common formula is `M = E - N + 2`.
`M` is the size of a basis of linearly independent paths.
It is not the number of all possible runs through the module.

For example, 90 sequential binary decisions give `M = 91`.
Those decisions can permit as many as `2^90` decision sequences.
A loop can permit an unlimited number of execution paths.
Thus, the phrase “91 decision paths” is not technically correct.

The original paper presents the metric as a tool for modular design and structured tests.
It proposes 10 as a reasonable limit, not a universal law.
See [McCabe's 1976 paper](https://doi.org/10.1109/TSE.1976.233837) and [National Institute of Standards and Technology (NIST) SP 500-235](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication500-235.pdf).

Oxlint applies a language-specific version of the metric.
It starts each function at 1.
It adds points for control flow constructs such as these items:

- an `if`, a loop, a `catch`, or a conditional expression;
- a logical expression such as `a && b`;
- a default parameter or a destructured default value;
- an optional member access or an optional call;
- each non-default `case` with the classic variant.

The modified variant adds one point for a complete `switch`.
The classic variant adds one point for each non-default `case`.
Oxlint and ESLint use a default maximum of 20.
The [Oxlint source](https://github.com/oxc-project/oxc/blob/17ae11cd9c00fcb8d16779d30f317f659f0f2e47/crates/oxc_linter/src/rules/eslint/complexity.rs) shows the exact count rules.
The [ESLint rule](https://eslint.org/docs/latest/rules/complexity) also warns against a limit without repository evidence.

These details make scores dependent on the tool, version, variant, and language.
Do not compare scores when one of those facts changes.

## Reproduction of the Hunk result

Hunk used `oxlint` version `^1.56.0` in the pull request.
I ran Oxlint 1.56.0 against the source before and after pull request 857.
The rule used the same classic variant and a maximum of zero for full output.

| Scope | Before functions | Before sum | Before syntax decisions | Before maximum | After functions | After sum | After syntax decisions | After maximum |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/app/cli.ts` | 69 | 379 | 310 | 91 | 86 | 386 | 300 | 31 |
| Session parser | 12 | 102 | 90 | 91 | 29 | 109 | 80 | 12 |

“Decisions” is `sum(M - 1)` for all scored functions in the scope.
This value removes the base point that each new function adds.
It is still a syntax count, not a count of feasible business states.

The new `parseSessionCommand` score has a simple explanation.
The base value adds 1, the help condition adds 3, and eight `case` labels add 8.
The sum is 12.

The pull request added 453 lines and removed 385 lines in `cli.ts`.
It also added 67 lines to the related test file.
The file now has 17 more scored functions.

The score change has 2 parts.
First, the pull request moves command logic into focused parser functions.
Second, it removes some repeated decisions, such as repeated help checks.
The first part lowers the local maximum.
The second part lowers the syntax decision count by 10.

This is a useful refactor, but “91 to 12” describes only the first part.
The stronger statement is that the main dispatcher became smaller and each command got a clearer owner.

## The other Hunk examples

The audit found more than a large dispatcher.
The other pull requests show why the audit can have value as a search method.

- [Pull request 859](https://github.com/modem-dev/hunk/pull/859) replaces 4 interval cases that overlap with 2 boundary formulas.
  It reports a score change from 24 to 14.
  A differential probe checked 6,998 integer interval cases.
- [Pull request 860](https://github.com/modem-dev/hunk/pull/860) sends duplicated clipboard paths through one clipper.
  It reports a score change from 56 to 29.
- [Pull request 778](https://github.com/modem-dev/hunk/pull/778) removes unreachable branches and shares validation stages.
  It reports a total score change from 273 to 242 across 5 files.

Pull request 859 is the strongest example.
It removes branch structure with direct algebra and supplies a finite differential check.
Pull request 857 mainly improves local ownership and review size.
Both changes can help, but they support different claims.

## The gate is not on `main`

[Pull request 861](https://github.com/modem-dev/hunk/pull/861) adds a maximum score of 80.
The pull request calls 80 a first regression limit, not a quality target.
It plans a lower limit after more hotspot changes.

The pull request merged into `refactor/simplify-session-cli-dispatch` at 20:41 Coordinated Universal Time (UTC).
Hunk had merged that branch into `main` at 14:01 UTC.
The gate commit is not an ancestor of the current `main` branch.
The current `main` version of `.oxlintrc.json` contains no complexity rule.

This result shows an important proof rule.
A merged pull request does not prove that the target branch contains the change.
Check the final branch or the release surface that must own the rule.

The value 80 also needs context.
It prevents a return to the score of 91, but it permits scores far above the Oxlint default of 20.
It is a baseline ratchet, not evidence that 80 is easy to check or maintain.

## What the research supports

Cyclomatic complexity has a strong link to basis path tests.
NIST states that a basis set covers each edge in a module.
NIST also states that white-box tests cannot find omitted requirements.
Thus, a score can help to plan structural tests, but it cannot prove correct behavior.

The evidence for maintenance and defects is mixed.
Cyclomatic complexity often has a strong relation to lines of code.
This relation makes a causal claim difficult.

Gill and Kemerer studied 834 modules from 19 systems.
Raw cyclomatic complexity had a correlation of 0.949 with non-comment source lines.
Their complexity density predicted maintenance productivity in a pilot with 7 projects and an `R²` of 0.59.
The authors tell readers to treat the small sample with care.
See [Gill and Kemerer, 1991](https://sites.pitt.edu/~ckemerer/CK%20research%20papers/CyclomaticComplexityDensity_GillKemerer91.pdf).

Shepperd reviewed the early evidence and found mixed results.
Lines of code often matched or beat cyclomatic complexity as a predictor.
The metric also misses data flow, module links, `else` structure, and semantic difficulty.
See [Shepperd, 1988](https://www.cs.du.edu/~snarayan/sada/teaching/COMP3705/lecture/p1/cycl-1.pdf).

A 2023 controlled study used 27 programmers and electroencephalography data.
The study found large differences between metric scores and the effort to understand code.
Data, application programming interfaces, and algorithm purpose caused effort that cyclomatic complexity did not count.
See [Hao and others, 2023](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2022.1065366/full).

The Federal Aviation Administration review gives the same limit in practical terms.
Cyclomatic complexity measures control flow inside a module.
It does not measure data complexity, module links, or long straight-line code.
It also states that module scores are additive.
See [FAA report DOT/FAA/CT-91/1](https://www.faa.gov/sites/faa.gov/files/aircraft/air_cert/design_approvals/air_software/CT-91-1-SQM.pdf).

NIST gives a direct example of score manipulation.
A developer added a ten-branch no-op selection and reduced a reported score from 90 to 10.
The example used a modified formula that divided the score by the branch count.
The code did not need fewer structural tests.

## The claim about AI code

Current research does not support a general claim that AI code has poor cyclomatic complexity.
The available studies use different models, tasks, languages, and definitions of AI authorship.

A 2026 study reviewed 4,762 silent pull requests from 5 AI agents in Python repositories.
Of those pull requests, 36.88 percent raised total project complexity.
Only 3.23 percent reduced it.
See [Hasan, Rabbi, and Zibran, 2026](https://arxiv.org/html/2601.21102v1).

That result does not show that AI code is worse than human code.
The study sums the score of every function in the project.
New functions add at least one point, even when they have no decisions.
The study does not normalize this result for added code and has no matched group of human pull requests.

A larger 2026 study used 19,816 files with AI involvement and 36,467 matched human files.
It matched files by repository, language, and similar size.
The mean function score was 2.62 for AI code and 2.47 for human code.
The effect size was 0.030, which is negligible.
See the [large matched repository study](https://arxiv.org/html/2603.27130v2).

A 2024 Claude 3 study found lower average complexity in generated code than in human code.
The authors linked much of that result to shorter generated code.
See [Rahman and others, 2024](https://arxiv.org/html/2409.01382v1).

These studies do not prove that AI code is good.
They show that authorship is a poor reason for a complexity audit.
Audit code because the repository shows dense decisions, high change rate, faults, or review cost.

## A useful audit method

Use this procedure for a repository that already has a suitable checker or a measured control flow problem:

1. Record the tool, version, language, variant, limit, exclusions, and source scope.
2. Record the function count, maximum, distribution, `sum(M - 1)`, and lines of code.
3. Rank high scores with change rate, fault history, test gaps, or high review cost.
4. Read each candidate and its callers before you propose a change.
5. Name the decisions, the state, and the owner that make the function complex.
6. Remove invalid states, repeated policy, redundant checks, and unreachable paths first.
7. Extract a function only when the new function has one coherent responsibility.
8. Do the current tests and add one differential check when the input space permits it.
9. Run the same metric command after the change.
10. Report a local score change and a scope score change as separate facts.

Do not ask an agent only to “make every function less than 10.”
That prompt rewards function split changes, no-op score tricks, and hidden complexity.
It can also damage one decision table that is easy to review and easy to check.

Use a new-code gate when a repository has a large old baseline.
Set a lower long-term limit only after the team checks real code and accepted exceptions.
Do not copy 10, 20, or 80 without that check.

## Decision for Simple

I ran the same Oxlint rule on the JavaScript files in Simple.
The audit found 34 scored functions, a total score of 104, and 70 syntax decisions.
The maximum was 15 in `check`.
The next values were 13 in `init`, 10 in a test callback, and 9 in `install`.

These functions own small command checks and installation routes.
The repository has no observed fault from their control flow.
The repository also has no Oxlint package or policy.
An Oxlint dependency and a gate would add work without an observed need.

Keep cyclomatic complexity as an optional audit signal in Simple.
Do not put it in the core skill and do not add a checker.
The [prior research](./eliciting-priors-and-teaching-the-delta.md) already gives it that scope.

The prior Luna and Terra loop tried 2 complexity cues.
The cues scored 9 of 10 and 10 of 10 in one run.
Neither cue beat its comparison, and the missed cases moved.
The [eval result](../evals/results/2026-08-26-autoresearch-cues/README.md) does not support a runtime change.

Use this candidate sentence only in a measured audit experiment:

> Use cyclomatic complexity to find branch-heavy code. A lower local score matters when the change removes decisions or gives them one coherent owner.

The model probably knows the term `cyclomatic complexity`.
Simple must still teach 4 local facts:

- the score is local and tool-specific;
- a function split can move decisions without decision removal;
- repository facts set the limit and the exceptions;
- behavior and ownership matter more than the score.

Use live repository context for the checker version, configuration, current scores, change rate, faults, and tests.
Those facts can change and cannot come from model training data.

## Useful evals

Use contrastive cases that separate a useful audit from score pursuit:

1. Replace interval branches that overlap with boundary algebra and use a finite differential check.
2. Split one large function into pass-through helpers without removal of decisions.
3. Share repeated validation policy through its current owner.
4. Keep a justified protocol dispatcher with many explicit states and complete tests.
5. Show code with a low score but difficult data, application programming interfaces, or algorithm purpose.
6. Change a `switch` from the classic variant to the modified variant without a code change.
7. Add a baseline ratchet for new code and do not claim that the baseline is a quality limit.
8. Merge a gate into the wrong branch and make the final branch check fail.

Grade these outcomes before the numeric score:

- preserved behavior;
- fewer invalid states and repeated decisions;
- one owner for each policy;
- a smaller total system burden;
- independent proof on the final surface.

Compare Simple alone, Ponytail alone, and both.
Use Codex Luna and Terra for the model arms.
Keep the code case and grader fixed across all arms.
