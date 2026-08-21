# Local eval run, 21 August 2026, sonnet solvers

All 16 eval cases ran once per condition with claude-sonnet-5 solvers inside a Claude
Code workflow (96 agents: 48 solves, 48 grades, no errors). Graders ran on
claude-fable-5 at low effort, strictly against each case's `graders/criteria.md`.
Solvers saw only `prompt.md` and any `SIMPLE.md` fixture; graders were hidden from
them. Skill versions were snapshotted with `git archive` so the run is pinned to exact
commits.

Conditions: `no-skill` (no methodology loaded), `v0.5` (skill at main `399ebe5`),
`forge` (skill at `forge/skill-activation-and-model-profiles` `dc08b28`).

## Results

Pass totals: no-skill 13/16, v0.5 12/16, forge 13/16.

| Case | no-skill | v0.5 | forge |
| --- | --- | --- | --- |
| emulation-boundary | fail | fail | fail |
| fake-compatibility | pass | pass | pass |
| future-service | pass | pass | pass |
| implementation-ladder | pass | pass | pass |
| missing-precondition | fail | fail | fail |
| mutation-interval | fail | fail | pass |
| no-operator-lens | pass | pass | pass |
| operator-emulation | pass | pass | pass |
| ordinary-path | pass | pass | pass |
| plain-writing | pass | pass | pass |
| prelaunch | pass | pass | pass |
| production-data | pass | pass | pass |
| routine-edit | pass | pass | pass |
| startup-root-cause | pass | pass | pass |
| unknown-write | pass | fail | fail |
| writing | pass | pass | pass |

Full verdicts with grader evidence are in `results.json`; every solver's answer is in
`raw/<case>__<condition>.md`.

## Analysis

Twelve cases pass under every condition. Sonnet with a completed `SIMPLE.md` fixture
already refuses invented compatibility, speculative services, and premature
dependencies; on those cases the skill neither helps nor hurts, and the repository
profile appears to carry most of the signal.

The four differentiating cases:

- `mutation-interval`: only forge passed. Both other conditions ordered the receipt
  check and dead-holder conversion before lock acquisition, leaving the race the
  criteria target; the forge solution acquired first. One run each, so treat as a
  weak positive signal for forge, not proof.
- `unknown-write`: no-skill passed; both skill conditions failed the same narrow
  sub-condition — the recovery command only cleared the marker without recording what
  the operator inspected. This is the one measured regression: minimalism pressure
  trimmed an audit obligation the criteria (and the skill's own "never simplify away
  audit obligations" rule) require. Candidate smallest fix: none yet; re-run before
  adding instruction, since a single run may be noise.
- `missing-precondition`: failed in all three conditions. All solutions were
  well-reasoned (correct ownership framing, no cloning or second write paths) but
  none used the two exact mechanisms the grader demands (temporary hidden native
  element as address probe; conditionally retained idempotent adapter). Review
  whether this task contract over-specifies one solution; per protocol the grader was
  not rewritten after seeing the answers.
- `emulation-boundary`: failed in all three conditions because the criteria require
  naming the Simple-versus-Parallax distinction. Only the forge reference documents
  Parallax, so the condition is unsatisfiable for no-skill and v0.5, and even the
  forge solver (which correctly offered only the SpaceX five-step doctrine with its
  blind spot and refused the persona) never surfaced the word. Review this contract:
  either the criteria should test the distinction without requiring the Parallax name,
  or the reference must make the distinction more salient.

Overall verdict: the forge skill is not worse than v0.5 (13 vs 12, and it uniquely
passes mutation-interval), and neither version demonstrates a broad advantage over a
strong baseline model on this suite at one run per condition. The suite's remaining
value is concentrated in the adversarial cases; the two all-fail cases need contract
review before their results count as evidence.

## Repeat this run

1. Snapshot each skill version: `git archive <ref> skills/simple | tar -x -C <dir>`.
2. Copy each case's `prompt.md` and `SIMPLE.md` (never `graders/`) into per-case
   directories the solvers read.
3. Run `workflow.js` (stored in this directory) via the Claude Code Workflow tool
   with args naming the repo path, case root, output directory, case list, and
   conditions; solvers on sonnet, graders strict per criteria.
4. Store verdicts in `results.json`, raw answers in `raw/`, and the reviewed analysis
   here, with the exact skill commits per condition.
