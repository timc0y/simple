# Stated-requirement screen: 11 September 2026

Narrow positive screen for the stated-requirement guidance. The candidate passed 4 of
4 cells, current Simple at `bd5acee` passed 1 of 4, and no skill passed 0 of 4. There
is no current-pass/candidate-fail pair. Both grader self-tests accepted the pass
reference and rejected the fail reference.

| Case | None r1 / r2 | Current r1 / r2 | Candidate r1 / r2 |
| --- | --- | --- | --- |
| Incidental requirement (only a header-name consumer) | Fail / Fail | Fail / Fail | Pass / Pass |
| Load-bearing requirement (positional reconciliation job) | Fail / Fail | Pass / Fail | Pass / Pass |

The incidental case is the tested capability. The consumer case is a control against
reckless relaxation.

## What the answers actually did

Incidental case. Both candidate plans named "identical to the old report" as the
requirement that shapes the design, stated its cost, cited the supplied facts that
nothing depends on the bytes, recommended the existing writer with the old header
names, and gated the compatibility layer on the requester's confirmation. The second
candidate repeat presented the two designs side by side under a heading that asks for
a decision.

Both current plans decided for themselves that byte identity was not required, then
hedged: one kept the 14-column layout and the empty legacy columns anyway and asked
finance about the footer; the other made finance's confirmation the gate and never
stated the cost. Neither made the relaxation the requester's decision. One no-skill
answer dropped the requirement silently in seven bullets. The other kept the legacy
layout, footer, and line endings while asserting that byte-for-byte reproduction was
unnecessary.

Consumer case. Every plan in every condition kept byte-identical output and added a
bounded legacy formatter. No condition relaxed the requirement, so the control shows
no relaxation regression. The three failures were on the exit-condition criterion:
one current plan and both no-skill plans omitted the condition for removing the
compatibility path, and one no-skill plan did not name the reconciliation job. That
criterion is not the tested capability, and current Simple passed it in one repeat,
so the candidate's 2 of 2 in this case is a no-regression result, not a measured gain.

## Which text carried the effect

No cell read `references/examples.md`, so the new worked example contributed nothing
to this run. The second candidate repeat in the incidental case read only `SKILL.md`
and still passed, which points at the core stop-list trigger. The first read the
architecture, commands, repository-work, and writing references. Both current cells in
the incidental case read the commands and writing references and still missed. The
prediction that the example would be the strongest lever is not supported here; the
core trigger and the plan contract are the parts this run exercised.
[Costs and reads](costs.tsv) list retrieved skill files, token use, and latency per cell.

## Method

Twelve sequential `gpt-5.6-luna` solver calls with default reasoning, two cases, three
conditions, two repeats, condition order reversed in the second repeat. One excluded
preflight call returned `ready`. The isolated Codex harness denied repository and
global skill reads, disabled plugins, hooks, apps, multi-agent, and skill search, and
copied only the assigned skill into each workspace. Skill reading was explicitly
requested, so this does not test natural activation. No Claude model ran. The exact
returned model revision was not reported.

The [protocol](protocol.md), both complete skill trees, prompts, criteria, and
references were frozen in [inputs](inputs/) before solver calls; `inputs/commits.tsv`
records the baseline and candidate commits. The lead authored the cases and the
candidate text, so this is targeted evidence about a chosen capability, not an
independently sampled task distribution. One Luna grader call per case graded all six
anonymous answers with the frozen criteria; the lead then read every answer in the
incidental case and the failing and one passing answer in the consumer case and found
no verdict to dispute. The current r2 incidental miss is the closest call: it reached
the simpler design but decided the relaxation itself and never stated the cost.

## Limits

Two repeats per cell on two lead-authored cases. The consumer control exercised no
relaxation pressure in any condition, so it does not show what the candidate does when
the simpler design is tempting and a consumer exists. The candidate cells used more
input tokens than no skill because they read the skill. No production execution, no
natural activation, and no claim beyond this capability.

## Reproduction

From the repository, run the [runner](run.sh) with `selftest`, then `measure` with
`READY=1`. It extracts the baseline skill from `bd5acee`, copies the working
candidate, and writes the record to `/tmp/simple-stated-requirement` before copying it
here with local paths replaced by markers. Full event logs, errors, grader prompts and
grader outputs are in this directory.
