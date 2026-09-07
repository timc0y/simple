# Personal workflow fit: Luna screen, 7 September 2026

The current Simple passed both executable tasks but proposed avoidable dual storage
in the migration decision. Previous Simple kept one stored value. This is a paired
simplicity regression in one answer, not evidence that the new example caused it.
Keep the observation and accepted capabilities; no skill wording was changed after these runs.
The [follow-up investigation](../2026-09-07-migration-investigation/README.md) reversed
the original normal-reading result and does not support a stable regression caused
by the new example. Both records remain.

| Task | No skill | Previous Simple | Current Simple |
| --- | --- | --- | --- |
| Small direct CLI edit | Pass | Pass | Pass |
| Shared write, timeout and cross-caller retry | Pass | Pass after checker correction | Pass |
| Migration: data, API and old-worker preservation | Pass | Pass | Pass |
| Migration: smallest workable storage design | Miss | Pass | Miss |

The migration prompt asks for the smallest workable plan. The normalized task verdict
includes that requirement: no skill and current Simple each pass 2/3 tasks; previous
passes 3/3. This does not label the more complex plans as data-loss failures.
Both preserve the 48-hour old-worker requirement, but their second column and
synchronization are unnecessary when the new build can map its internal name to the
existing column. The [manual review](manual-review.json) records both dimensions.

All three conditions completed the direct edit without PR machinery. The current
condition changed only the implementation; the other two also extended an existing
test. This was not a cost win overall: current used more calls and tokens on that
small task. See [per-cell costs and reference reads](costs.json). Costs vary by task;
one repeat cannot establish an efficiency gain.

## Method and limits

Nine sequential Codex runs requested `gpt-5.6-luna`, medium reasoning, one repeat per
case and condition, counterbalanced by case. Two excluded Luna preflight turns
verified local execution and conversation resume. No Claude solver or model grader ran.
The returned exact model revision was not independently reported.

Each skill condition was explicitly instructed to read its skill and routed references.
Plugins, global skills, hooks and multi-agent discovery were disabled or denied by the
existing sandbox. The repository-read canary and execution/resume preflight passed.
Expected denied-global-skill startup warnings were retained privately; they did not
prevent assigned local skill reads or task completion.

Previous is a reconstructed pre-edit snapshot: the delivery and compatibility changes
from the immediately preceding edit were reversed; all other skill files were held
constant. Both complete trees are in [skill-snapshots.zip](skill-snapshots.zip).
The repository profile was not injected, so this isolates shared guidance rather than
measuring the new owner-specific profile entry. This is an execution screen, not an
activation test or a comparison against PStack/Ponytail. It does not evaluate live
publishing, PR review, cleanup, Windows hooks or production database migration.
The prompts explicitly describe low PR needs; their success does not prove a new
propensity to avoid PR machinery on implicit requests.

Current read delivery on the direct edit and compatibility on the migration task.
Previous also read architecture for the migration; current did not. These observed
paths do not establish why the designs differed. The migration case uses renamed
fields and a real overlap counterexample, but is close to the new example, not a
broad held-out transfer test. The pass/fail manual references were reviewed before
solver calls. The initial migration verifier proves only that an answer file exists;
the final verdict comes from reading that file against the requested outcome.

## Checker correction and retained evidence

The frozen shared-failure verifier compared the entire serialized state object to an
exact shape. Previous Simple added outcome metadata, so three checks failed despite
correct effect counts, keys and uncertainty handling. The task did not forbid metadata.

The [corrected verifier](corrected-case/verifier.mjs) projects only required `count`
and `keys` before comparison. Its [self-test](corrected-case/selftest.mjs) accepts
valid metadata and rejects duplicate effects with metadata, the original bug,
a caller-only guard and unrelated crashes. The existing tests for both entry points,
distinct keys and honest unknown outcomes remain.

All three shared-failure artifacts were rechecked without rerunning their solvers.
[Original results](results-original.json), frozen original checks in `cases/`, and
original outputs in `verifiers/` remain alongside `corrected-verifiers/` and the
[final results](results.json). Initial migration artifact-presence passes are likewise
retained; they are not semantic grades.

Public raw answers and submitted artifacts replace local absolute paths with explicit
redaction markers. Full events, preflight logs and original frozen runner bytes stay
in the ignored local record. [manifest.json](manifest.json) retains the original input
hashes; its adapter hash describes the private original, not the relocated public
[runner](run.py). The public adapter changes filesystem locations only and uses the
existing behavior runner. To rerun, extract the skill snapshots, call its `freeze`
command with a fresh `--record` and extracted `--previous`, then `measure` with
`READY=1`. Reruns require a separate manual decision review; do not interpret the
artifact-presence verifier as a migration pass.

No completed solver failure was retried. No release, installation or runtime skill
change followed these results.
