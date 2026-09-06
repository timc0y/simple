# Deep-audit correction screen

## Evaluation decision

Discard the correction and do not run confirmation. It improved the deep-audit case
from 0 of 3 to 1 of 3 strict passes, below the preregistered requirement of at least
2 of 3, a two-cell gain, and both a Claude-family and Luna pass.

The existing deep-audit guidance remains experimental. This result does not support a
multi-repository rollout or cleanup of other product repositories.

## Owner decision, 3 September 2026

Tim chose to retain the exact evaluated correction provisionally despite the failed
gate. This changes the runtime decision, not the evaluation result: the correction is
still supported by one strict Opus pass and remains unconfirmed on Sonnet and Luna.

## Result

| Condition | Opus | Sonnet | Luna | Total |
| --- | ---: | ---: | ---: | ---: |
| Frozen pre-correction candidate | 0/1 | 0/1 | 0/1 | 0/3 |
| Correction | 1/1 | 0/1 | 0/1 | 1/3 |

Both graders accepted corrected Opus. Corrected Sonnet skipped two applicable lenses
and offered a conditional deletion as safe now. Corrected Luna split the public
deletion claim from the retention mechanism and promoted duplicate handling despite
the recorded restart issue. Those are contract failures, not evidence for another
same-run wording change.

The graders disagreed on frozen Luna, so it remained a strict failure. Both reference
self-tests passed and every anonymous identifier was graded exactly once.

## Method

The screen compared six read-only cells on `deep-audit-guide-first`: Claude Opus 5,
Claude Sonnet 5, and Codex Luna under the frozen pre-correction skill and the one-file
correction. Execution was sequential with the same fixture, tools, model settings,
timeouts, and frozen grader contract. Codex Luna and Terra graded all six answers
anonymously. Claude solver calls cost $1.6773; Codex cost was not exposed.

`preregistration.md` contains the gate and frozen hashes. `current-skill/` and
`candidate-skill/` preserve the exact condition inputs. `candidate.diff`, the harness,
environment, case, raw answers, events, errors, grades, mapping, and normalized result
preserve the remaining evidence. The runtime file was first restored to its
pre-correction SHA-256 after the failed gate, then the exact archived candidate was
retained by owner decision on 3 September 2026.
