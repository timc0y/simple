# Proxy discipline first run

## Decision

Do not add the candidate text to Simple from this run. Current Simple and the candidate
both passed all 10 Luna and Terra solver cells. The candidate added text but did not
improve behaviour.

Keep the five cases and isolated runner. They exposed failures without Simple and
distinguished direct production budgets from code-shape proxies.

## Result

| Condition | Strict passes |
| --- | ---: |
| No skill | 6/10 |
| Ponytail | 5/10 |
| Simple | 10/10 |
| Simple and Ponytail | 10/10 |
| Candidate Simple | 10/10 |
| Candidate Simple and Ponytail | 10/10 |

Strict means that both anonymous graders passed the answer. Both graders first accepted
all 5 pass references and rejected all 5 fail references.

The candidate added this guidance outside the public skill:

```text
Prefer evidence nearest the consequence. Treat indirect measures as clues, not causes
or targets. A shorter implementation is simpler only when it removes an obligation,
concept, state, decision, owner, dependency, or repeated rule; shorter syntax alone is
compression.
```

It also added one comment question: `Ask what plausible wrong edit the comment
prevents.`

## Isolation

The Codex 0.149.0 runner used `gpt-5.6-luna` and `gpt-5.6-terra`. Each model used its
default reason setting. Each solver ran in a temporary workspace. The runner disabled
user configuration, rules, plugins, apps, hooks, and agent support. The sandbox denied
access to the repository and the installed skill paths. A solver received only its
prompt and the skill copy for its condition.

The graders received criteria, known pass and fail references, and candidates under
opaque identifiers. They could not read the repository, solver record, condition map,
or model names. The runner revealed the condition map only after the grade step.

The solver did not see the grader data. The grader did not see the condition names.
This was not a double blind human study. The eval author wrote the cases and reviewed
the result after the grade step.

## Limits

This first run used one answer for each cell. A ceiling tie cannot show that the added
text is harmful or equivalent across other tasks. It does show that the candidate did
not earn its context cost on these cases. Compare current Simple and the candidate in
more runs before a public skill edit.

`mapping.tsv` identifies the anonymous cells after the grade step. `results.tsv`
contains both grader decisions. `raw/` contains all solver answers. `grades/` contains
both grader records. `usage.tsv` contains token counts.

## Audit starter activation check

Luna and Terra reran the direct-budget case with the Simple skill available but without
an instruction to open it. The new audit starter prompt was the activation cue. Both
models opened `SKILL.md`. Both blind graders passed both answers after accepting the
known-pass reference and rejecting the known-fail reference.

This checks one lint and code-health decision. It does not establish that the same
starter prompt will choose the right checks for every repository.
