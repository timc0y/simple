# Isolated eval run, 22 August 2026, sonnet solvers

This run resolves the three open items from `2026-08-21-local-sonnet`: the
contaminated baseline, the two broken grader contracts, and the two single-run
signals that needed repeats.

Harness: real headless `claude -p` sessions, one per task, `--model sonnet`, with
`--setting-sources project,local` so no user-scope plugin hook (Simple or Ponytail)
reaches either arm. The canonical arm receives the skill as a project skill
(`.claude/skills/simple` from commit `efd8b9e`) in its workspace, so activation is
part of what is measured. Case fixtures sit in the workspace root. Runner: `run.sh`;
raw answers: `raw/`; verdicts: `results.json` (conforms to
`evals/results.schema.json`); grading by two batched agents quoting evidence against
each case's criteria.

## Results

Pass totals: no-skill 3/9, canonical (forge skill) 6/9.

| Case | reps | no-skill | forge |
| --- | --- | --- | --- |
| mutation-interval | 3 | 0/3 | 2/3 |
| unknown-write | 3 | 3/3 | 3/3 |
| missing-precondition | 1 | fail | fail |
| emulation-boundary | 1 | fail | pass |
| operator-activation | 1 | fail | fail |

## Resolutions

- Baseline contamination: fixed. With hooks isolated, the skill shows a real
  advantage (6/9 vs 3/9) where the contaminated 2026-08-21 run showed near-parity.
  That parity is now explained: its "no-skill" arm was already receiving Simple's
  profile injection.
- unknown-write regression: not reproduced. All six answers, both arms, satisfy every
  condition including the operator-inspection record. The 2026-08-21 failure was
  single-run noise; no skill instruction is needed.
- mutation-interval win: confirmed. No-skill fails 3/3, each time by allowing a
  mutation past an outstanding uncertainty or splitting interval ownership; forge
  passes 2/3, and its one failure is a genuine check-before-acquire window, worth
  keeping as a known hard case.
- emulation-boundary contract: the repaired criteria discriminate. Forge passes with
  the sourced five-step doctrine, a hypothesis-marked customer claim, and a stated
  blind spot; no-skill substitutes an unsourced "Musk-vibe" lens and fails.
- operator-activation: the skill demonstrably activates from a bare "What would Theo
  do" prompt (doctrine-not-persona framing, lens-limit section, profile vocabulary);
  no-skill invents a Theo quotation. Forge still failed on one condition: it never
  named the fixture's proof route (type-check and existing integration tests). That
  is the one live behavioural finding from this run — emulation answers end at
  "measure first" instead of naming the repository's proof. Watch it across runs
  before adding instruction.

## Still open

missing-precondition fails both arms even under the repaired criteria. Both answers
converge on nested traversal and then declare the task impossible. The intended
solution — supply a supported address by binding a temporary hidden native element to
the same retained record — requires knowing the platform can bind another element
type to the same record, and the prompt never states that fact, so the design is not
derivable, only guessable. Recommended (not applied, to avoid rewriting a contract
twice in one cycle): add one observation to the prompt, for example "other native
element types, when connected directly, bind to the same per-instance record and
return working handles", then re-run. Until then this case measures trivia, not
judgement.
