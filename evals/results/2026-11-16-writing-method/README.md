# Writing method verification — 16 November 2026

Status: method and evaluator-contract adoption; local checks passed. No comparative
model improvement claim is made.

Baseline: `f315d12fe6855e9e17af561875f32d70dadb9a55`.
The [research decision](../../../research/writing-research.md) records source access,
the theory, counterevidence and adoption scope. Historical results and raw grades
remain unchanged. The new [cases](../../writing-method/protocol.md) are development
cases, not held-out proof.

## Local verification

| Check | Result and scope |
| --- | --- |
| `npm test` | 77 passed, 0 failed, 0 skipped. Includes existing host contracts and local context emission; not live host execution. |
| `node skills/simple/scripts/simple.mjs check --context` | Ready; complete local profile, no failures. Its own `hostDelivered` and `modelApplied` fields remain `null`. |
| Skill-creator `quick_validate.py skills/simple` | Valid skill structure. |
| `zsh -n evals/luna-cases.sh`; `git diff --check` | Passed. |
| Existing runner `selftest`, eight writing-method cases | All fixtures present. No model grading or semantic pass is inferred. |
| `test/eval-integrity.test.mjs` | Five offline tests pass: exact verdict/identifier/reason contract, nested preparation, frozen task evidence, task-variant mapping and solver read-denial construction. |

The runner now gives graders actual frozen prompts, repository facts and fixture
contents, distinct from calibration answers. Solvers use those same frozen inputs.
Solver-only deny rules cover parent-run metadata/calibration and sibling workspaces.
The tests inspect the generated policy; native macOS enforcement is unverified and
must pass the existing canary before a future model run.

An independent read-only reviewer found the missing task/source in the old grader
input and missing reason validation. Both were repaired and rechecked. The review
also identified two Communicator evidence-path defects, repaired in that repository.
No remaining material blocker was reported in the bounded recheck.

## Native skill-use observation

One fresh `gpt-6-luna` task at `high` reasoning read the explicitly named repository
skill and writing reference, according to its read report. It produced the four-sentence
handoff recorded with its source and hashes in [native-skill-use.json](native-skill-use.json).
The output kept the retry condition, separate responsibilities, local-only test result
and unknown deployment status. This is one observed task, not a baseline comparison.
The exact model revision and usage were not exposed. No output was regenerated.

The available personal Simple skill had SHA-256
`d7bd9a2cf910b4c13725db6c68059603870c28771522c968bd828e6fac7791fc`,
which differs from the candidate's
`c28a847e5086c4dc70b1918f661a96edc99e5188b6abd27324e4a32e56840feb`.
It was not updated. Repository-source reading and local emission do not establish
installation or ordinary activation of this change.

## Budget and limits

The separately billed model/API evaluation allowance is zero calls and $0. No formal
model comparison is run. Up to two fresh native collaboration tasks may exercise the
final repository skills on synthetic writing: one Simple and one Communicator task,
using the host's `gpt-6-luna` option. Stop after those tasks, including failed attempts;
no retries to obtain a preferred answer. Record actual outputs and source hashes.
Both tasks ran once and the allowance is exhausted. Communicator's task and subsequent
compiled MCP review are recorded in that repository's verification documents. These
are explicitly invoked observations without supported-host isolation or matched
baselines, not activation, installed-host or improvement evidence.

The execution environment is Linux. The historical evaluation runner requires macOS
isolation; it is not bypassed. The supported hosts, plugin installations and live
compaction behaviour are not inferred from local tests.
