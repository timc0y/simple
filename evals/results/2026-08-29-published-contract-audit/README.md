# Published contract audit

## Decision

Do not change the runtime skill. Current Simple and the candidate each passed 4 of 4
cells. No skill passed 1 of 4 cells. A tie loses.

The audit found a wording conflict in the compatibility checklist. The core skill
already makes the model establish published contracts before it chooses a replacement.
The extra checklist text did not change the result.

## Method

Luna and Terra answered 2 cases under no-skill, current-Simple, and candidate-Simple
conditions. The cases required preservation of a published command and direct
replacement of an unpublished helper.

Luna and Terra graded each anonymous answer. Each grader accepted the pass reference
and rejected the fail reference. The final grade used the exact identifier set.

The first grade attempt was kept before the final regrade. Both attempts gave the same
Boolean verdict for each answer. The `grade-history/` directory contains the first
attempt.

The runner used sequential calls and explicit workspace skills. All conditions had the
same sandbox startup warning, which did not change access to the workspace skill.

The record includes the runner, candidate, input cases, mappings, raw answers, events,
errors, grades, grade history, TSV results, and normalized JSON.
