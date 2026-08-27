# Repository-fact profile comparison

## Decision

Prefer concrete repository facts over more universal skill instruction. Naming the
existing serialization owner and its supported alias mechanism increased strict
passes from 4 of 12 to 12 of 12.

The candidate changed only the case's `SIMPLE.md`:

```text
`CustomerSerializer` owns request parsing and response serialization. Its existing
deprecation-alias facility accepts either field name, rejects conflicting values,
and emits both names from one internal value during a bounded transition.
```

No skill wording changed.

## Result

| Profile | Simple | Simple and Ponytail | Total |
| --- | ---: | ---: | ---: |
| Original | 2/6 | 2/6 | 4/12 |
| Concrete owner and mechanism | 6/6 | 6/6 | 12/12 |

The original profile named the retained data, external clients, deprecation promise,
migration path, proof surfaces, and removal condition. It did not say which component
owned wire compatibility or which transition mechanism the repository already
supported. Models therefore invented selectors, version negotiation, dual persisted
fields, or unresolved blockers.

The enriched profile supplied that missing repository fact. Every answer then kept one
internal value, used the existing serialization boundary, preserved both client
representations, and retained the independent data-migration timeline.

## Method

Luna and Terra each solved `production-data` three times under four forced-execution
conditions: Simple, Simple with Ponytail, and the same two skill arms with the enriched
profile. The skill copies were identical across profile conditions.

The sandbox blocked the repository, global skills, plugins, apps, hooks, rules, user
configuration, and multi-agent support. Luna and Terra graded every anonymous answer
independently after accepting the known-pass and rejecting the known-fail reference.

This result proves the supplied fact changed behaviour in this case. It does not prove
that every profile needs implementation detail. Record an owner or supported mechanism
only when it materially changes the safe ordinary path.

`mapping.tsv` identifies conditions after grading. `results.tsv` contains both grader
decisions. `raw/` contains solver answers, and `grades/` contains the grade records. The
profile patch and runner remain in `evals/repository-work-shapes/`.
