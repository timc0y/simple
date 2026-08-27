# Repository work-shape activation

## Decision

Keep the current description. Do not add explicit start, fix, improve, and add triggers.

Both descriptions opened Simple in all 40 substantive cells. The candidate also opened
Simple in 2 of 4 typo-only cells; current Simple opened in none. Explicit task verbs
added over-activation without improving discovery.

## Result

| Condition | Substantive openings | Trivial openings | Strict answer passes |
| --- | ---: | ---: | ---: |
| Current description | 20/20 | 0/4 | 18/24 |
| Candidate description | 20/20 | 2/4 | 19/24 |

The extra strict candidate pass does not rescue the wording. It came from a noisy
maintainability case, not from an activation difference: both descriptions opened in
every run of that case. The candidate's only discovery difference was undesirable.

The candidate kept the description at the same line count while replacing the current
trigger list with this branch:

```text
when starting a repository; shaping a fix, improvement, or addition whose owner,
scope, solution, or proof depends on repository facts
```

## Method

Luna and Terra each ran six cases twice with either the current or candidate skill
available. Prompts did not name Simple and solvers were not instructed to read it.
Opening `.agents/skills/simple/SKILL.md` in the isolated event trace counted as
activation.

The five substantive cases covered a greenfield start, shared-owner fix, startup
performance problem, addition through an existing runner, and qualitative ownership
improvement. The control asked only to correct `Recieve payment` and return the text.

The sandbox blocked the repository and every global skill, plugin, rule, app, hook, and
user configuration. Each workspace contained one exact current or candidate Simple
copy. This prevents the stale global Simple installation from influencing discovery.

Luna and Terra also graded answer quality anonymously. Every case grader accepted its
known-pass reference and rejected its known-fail reference first. Answer scores were
secondary: this experiment targeted invocation, and both skill bodies were identical.

## Limits

Two repetitions cannot estimate a stable activation rate. No third repetition is
needed for this candidate because it already achieved no desired discovery gain. The
current description reached every substantive prompt in this sample.

`mapping.tsv` reveals the conditions after grading. `invocation.tsv` records skill
opens. `results.tsv` combines activation and both grader decisions. `raw/` and
`grades/` contain the answer and grade records. The runner and candidate remain under
`evals/repository-work-shapes/`.
