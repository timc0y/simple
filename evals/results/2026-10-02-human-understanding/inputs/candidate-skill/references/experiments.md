# Prototypes and measured improvement

Use this to choose between uncertain designs, compare implementations or improve a measured outcome through repeated experiments.
A known local fix needs no experiment programme.

## Prototype a decision

Name the decision and the observation that would settle it.
Build the smallest useful probe in disposable local space.
Use a real integration when its behaviour is the question; a mock cannot answer it.
For UI alternatives, give variants stable labels and exercise the actual interaction.
Use reference apps when their design choices can reduce invention.

Keep prototypes separate from production state.
State which concerns the prototype omits and which observations remain valid despite those omissions.
Use the result to choose the implementation; do not quietly ship prototype shortcuts.
If the probe already meets the full production contract, keep it rather than rewriting it merely because it began as a prototype.

## Compare alternatives

Use `board.md` for competing judgments and `architecture.md` for the design criteria.
When source evidence cannot settle a consequential tradeoff, compare runnable alternatives against the same contract.
Keep candidate workspaces independent and shared inputs fixed.
Use native worktrees or existing host isolation; a single sequential worker is also valid.

Choose the winner by requested behaviour and independent evidence before cost or elegance.
Compare integration work, maintenance, operating cost and reader effort separately.
Inspect the actual selected artifact before integration.
After integration, rerun the affected checks against the final tree.
Reviewer agreement and a winning prototype do not prove the integrated result.

## Improve a metric

1. Define the realistic workload and the requested outcome.
2. Choose a metric, direction and meaningful improvement threshold.
3. Set the run budget and stopping condition before trials.
4. Prove that the measurement detects a known difference.
5. Record baseline variation and required behaviour checks.
6. Freeze the measurement procedure and candidate inputs.
7. Make one interpretable change per trial.
8. Measure the result and check preserved behaviour.

Keep accepted and rejected trials with their hypothesis, artifact, result and decision in one existing evidence owner.
Preserve that evidence before reverting an unsuccessful trial.
Do not discard user changes or unrelated accepted work.
If the measurement changes, start a new comparison and keep the old results.

Stop at the agreed budget, achieved target or concrete blocker.
Report a missed target honestly; do not relax it or repeat until a lucky pass appears.
A plateau can justify a different hypothesis within the budget, not endless unattended work.
A simpler implementation with unchanged performance can be worthwhile; report that as maintenance improvement, not a speed gain.

For agent evaluations, test reference retrieval separately from execution.
Keep held-out tasks, matched tools and per-capability failures.
A higher total does not cancel a lost requirement.
Use the repository's evaluation protocol and the user's model selection.

Adapted from PStack's [prototype](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/prototype.md),
[arena](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/arena/SKILL.md)
and [hillclimb](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/hillclimb.md) workflows.
Simple preserves useful negative evidence and uses proportionate isolation instead of mandatory parallel trials.
