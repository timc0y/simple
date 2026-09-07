# Diagnose a failure

Use this for bugs, regressions, slow operations, leaks and supplied runtime traces.
For a requested diagnosis, return the evidence and cause without silently implementing a fix.
For a requested fix, continue through implementation and verification.

## Triage a reported issue

For an intake task, read the report, relevant replies and available attachments before classifying it.
Distinguish a defect, performance problem, feature request and question by the intended behaviour.
Trace enough of the cause to avoid routing the visible symptom to the wrong owner.
Search existing issues, commits and open fixes by source link, signature and affected operation.
A possible duplicate remains uncertain; do not create another issue merely because the titles differ.

If a fix already exists, verify that artifact against the reported symptom before writing a competing fix.
Distinguish an explicit implementation owner from a bot that only gathered evidence.
Preserve current ownership and coordinate through the authorized lead.
Use `delivery.md` for any authorized issue creation, reply or review follow-through.

This adapts Benny's [triage](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/automations/benny/skills/triage-issue-reports/SKILL.md)
and [existing-fix verification](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/automations/benny/skills/reproduce-and-fix-issues/SKILL.md)
from the PStack source archive. Automated intake still needs a configured host and explicit write authority.

## Establish the mechanism

1. Establish the expected result and the affected user operation.
2. Reproduce the failure on the reported surface when access permits.
3. Check the build, target, input and environment against the report.
4. Trace the operation through its callers, state changes and effects.
5. Choose an observation that separates the remaining explanations.
6. Confirm the mechanism with runtime evidence or a focused reproducer.

A nearby local success does not disprove a production failure.
If reproduction is unavailable, state that limit and distinguish a supported hypothesis from a confirmed cause.
Use logs, a captured artifact or a safe local model to make progress.
Do not fabricate the original failure or ask the user to repeat work the agent can perform.

For a regression, use `research.md` to compare the relevant history and prior behaviour.
Inspect sibling callers before a fix at a shared boundary.
Keep instrumentation that supports the diagnosis; remove temporary instrumentation when its evidence is preserved.
Discard an unsuccessful experimental edit without reverting unrelated work.

After a fix, repeat the original reproducer and an affected sibling or nearby countercase.
Use `verification.md` for the proof procedure.
Report what failed, the established cause, the change and what the checks actually proved.

## Performance and runtime artifacts

Measure the user-visible cost before choosing an optimization.
Keep the workload, environment, units and sample conditions with the result.
Separate elapsed latency, total work, resource use and tail behaviour when they change the decision.

Use the artifact's native tools or an existing parser before writing another parser.
For a CPU profile, find the expensive path and its callers.
For a heap snapshot, trace retained objects to their retaining owner.
For a blocked process, identify the wait and the resource that can release it.
Preserve source maps, build identity and uncertainty in symbol attribution.
An unmapped hot frame is evidence of cost, not proof of a source-level cause.

Choose the optimization from the observed cost:

| Evidence | Candidate | Obligation to preserve |
| --- | --- | --- |
| Work has no supported consumer | Remove it | Hidden consumers and retained state |
| Identical work repeats | Reuse or cache results | Identity, freshness and invalidation |
| Many calls pay the same fixed overhead | Batch them | Ordering, partial failure and response limits |
| A scan dominates | Index, prune or partition | Update cost and complete results |
| Independent operations wait in sequence | Run them concurrently | Shared limits and state ownership |
| Optional work delays interaction | Defer or reschedule it | Eventual completion and cancellation |
| One slow replica dominates a read | Consider a bounded redundant read | Capacity, cancellation and actual read-only semantics |

Do not duplicate a mutation to reduce latency without a proven idempotency contract.
Compare before and after on the same workload and surface.
Use `experiments.md` for sustained optimization or competing implementations.

Adapted from PStack's [bug-fix](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/bug-fix.md),
[performance](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/perf-issue.md)
and [trace-forensics](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/trace-forensics.md) workflows.
Simple uses the available surface and tools; it does not require a particular host or automatic delegation.
