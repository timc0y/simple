# Plugin eval trial: 13 September 2026

`claude plugin eval` runs on this account now; the 11 September "early access" message
no longer appears. One case, one run per arm, with and without the plugin, on Claude
Code's default model with the default judge.

| Arm | Score | Criteria grader | Skill invoked |
| --- | --- | --- | --- |
| With plugin | 1.0 | pass, three of three judge votes | yes |
| Without plugin | 1.0 | pass | not applicable |

Delta 0. On this host and model the stated-requirement case does not discriminate:
the no-plugin arm reached the existing-writer design and gated the relaxation without
the skill. The same case on Luna gave no skill 0 of 2 and the candidate 2 of 2 on two
days. That is a model difference, not a grader difference, and it is the kind of
result a two-arm run exists to show.

## What the trial established

- The case format differs from Simple's: each grader file needs frontmatter with a
  `type`, an `llm` grader's body is its criteria, and a `tool_used` grader marked
  `arm: with-only` records whether the skill fired without counting toward the score.
  Simple's `graders/criteria.md` files carry no frontmatter, so they are rejected as
  they stand. The trial case here is a converted copy; the original is unchanged.
- Runs are non-interactive only with `--trust-plugin`. Cost was about a quarter of a
  dollar per arm-run plus a fraction of a cent for the judge.
- The HTML report and traces contain workspace paths and are not published; the
  redacted [result.json](result.json) keeps scores, grader votes, costs, and the
  evidence excerpts.

## Decision

Keep Simple's paired Luna runs as the adoption gate; they run one model under one
harness with a self-tested grader and a noise floor. Use `claude plugin eval` as a
second, host-native reading when a change is meant to affect Claude Code users, with
a converted copy of the relevant cases. A converter that adds the frontmatter and a
skill-fired grader is the next small step; it was not built today.
