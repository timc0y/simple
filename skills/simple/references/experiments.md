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
For a quality comparison, hide candidate labels from the reviewer when possible and
keep the task and acceptance criteria identical. Score working behavior, solution
quality and cost separately: a polished but incomplete answer cannot win by style.
A blind preference is still not a substitute for an executable acceptance check.

## Improve a metric

1. Define the realistic workload and the requested outcome.
2. Choose a metric, direction and meaningful improvement threshold.
3. Set the run budget and stopping condition before trials.
4. Prove that the measurement detects a known difference.
5. Record baseline variation and required behaviour checks.
6. Freeze the measurement procedure and candidate inputs.
7. Make one interpretable change per trial.
8. Measure the result and check preserved behaviour. Count consumed input,
   completed work, successful outputs and skipped or failed records alongside timing.
   Reject a speedup caused by doing less work or skipping a required output.

Keep accepted and rejected trials with their hypothesis, artifact, result and decision in one existing evidence owner.
Preserve that evidence before reverting an unsuccessful trial.
Do not discard user changes or unrelated accepted work.
If the measurement changes, start a new comparison and keep the old results.

Stop at the agreed budget, achieved target or concrete blocker.
Report a missed target honestly; do not relax it or repeat until a lucky pass appears.
A plateau can justify a different hypothesis within the budget, not endless unattended work.
A simpler implementation with unchanged performance can be worthwhile; report that as maintenance improvement, not a speed gain.

Account for all billed attempts, not only completed answers: preflight, solvers,
follow-ups, retries and graders. Reserve a bounded call or spending allowance before
launching work where the provider supports it; a post-run token total is not a hard
spending cap. Missing usage remains unknown, never zero. Preserve the aggregate
allowance on resume and stop rather than relaunching indefinitely.

For agent evaluations, test reference retrieval separately from execution.
Freeze the actual installed skill content, source revision, host version and
configuration; a repository version label does not identify a stale installed copy.
Use realistic near-miss negatives for activation and independently checked artifacts
for completion. A path mention is not a successful read, and a successful read is
not evidence that the resulting work is correct. Failed or ambiguous instrumentation
is invalid evidence, not a valid non-activation. Keep invalid counts visible.

Publish synthetic fixtures, redacted proofs and minimal usage metadata. Do not copy
private transcripts, operator settings, identities, prompts or tool outputs into a
public result merely because the host can collect them. Capture only the categories
needed for the question, with the user's authority.

The [Agent Skills evaluation guidance](https://agentskills.io/skill-creation/evaluating-skills)
provides a source-backed comparison pattern; adoption here is methodological, not
a new measured performance claim.
Keep held-out tasks, matched tools and per-capability failures.
A higher total does not cancel a lost requirement.
Use the repository's evaluation protocol and the user's model selection.

Adapted from PStack's [prototype](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/prototype.md),
[arena](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/arena/SKILL.md)
and [hillclimb](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/hillclimb.md) workflows.
Simple preserves useful negative evidence and uses proportionate isolation instead of mandatory parallel trials.
