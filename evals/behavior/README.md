# Executable behavior evaluation

This suite checks final artifacts and one real follow-up correction. The fixtures are
synthetic. Private conversation research informed the task shapes; no transcript or
client source is included.

Freeze the cases, verifiers, and full skill snapshots before solving. Run Luna only,
sequentially, with equal tools and reasoning settings. Compare no skill, two byte-identical
copies of public Simple at `eb9a82f`, and the local overhaul candidate. The candidate
must not change during the run. Grading code and other conditions stay inaccessible
to solvers; the fixture repository is writable.

## Registered decision rule

Run each of five cases once in each condition: 20 cells, with two actual conversation
turns for the correction case. Stop at that count; do not add samples because a score
is disappointing. A harness failure is invalid evidence, not a model failure. Preserve
it and retry only after correcting the cause under the same conditions. A solver that
finishes without satisfying the task fails the artifact checks.

The primary metric is the number of completely satisfied cases, checked by executable
verifiers. Both initial and final checks must pass for the correction case. Report each
failed obligation separately. A provisional positive requires at least two more complete
cases than either old-skill copy, greater than the observed A/A difference, and no case
regression against either old-skill copy. Otherwise report mixed or inconclusive evidence.
Five cases cannot establish broad superiority or equivalence, even if all pass.

Report actual tool calls, tokens, latency, edits, and verification attempts separately
from completion. Inspect requests for unnecessary user intervention manually; question
marks and the absence of a narrated plan are not failures. Record source additions and
deletions as a maintenance proxy, not proof of lower lifetime cost. Do not reward
removing required behavior or penalize a useful package by dependency count.

## Coverage

- `correction-preserves`: implement a change, receive a correction in the same session,
  and preserve structured queries and retention while changing the summary.
- `fallback-selection`: use supported capability evidence to select working behavior.
- `uncertain-write`: preserve exactly-once effects across two entry points after a timeout.
- `reuse-reference`: discover and integrate an available package through its example,
  then remove displaced custom implementation. The local fixture package is a stand-in;
  this does not measure live registry search, upstream maintenance, or licensing research.
- `easy-edit`: finish a one-line request without breaking the command. Report extra
  work and interventions rather than requiring a particular response style.

Run `python3 evals/behavior/selftest.py` and each specialist case's self-test before the
solver run. Known good implementations must pass and original faults or targeted
regressions must fail. The descriptive criteria/reference files document the contract;
there is no model prose grader in this suite.

This is a forced-read execution test, not automatic skill activation. The correction
case exercises an actual resumed session; it does not simulate an abrupt process crash.
All mutations are local fixture operations, not real account or production writes.
