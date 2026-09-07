# Carry work through review and release

Use this for a feature with dependent stages, pull-request follow-through, an authorized release, or a requested safe pause.
`repository-work.md` owns task scope and authorization. This workflow does not grant commit, publication or deployment permission.

Start with the user's existing way of working: implement, verify the real result,
and complete the authorized delivery. Use only the sections needed for that task.
A direct change does not need a PR, worktree, review queue or orchestration layer
unless the repository or user requires one. Add automation when repeated work
demonstrates its value.

## Build complete units

Trace the intended user journey before splitting the work.
Resolve shared prerequisites before dependent implementation.
Choose units that produce independently checkable results; keep tightly coupled changes with one owner.
Prove a representative path before scaling a migration or fan-out.
Use existing host task and worktree tools when delegation removes work.
Give each writer exclusive paths, a contract, allowed effects and a completion check.

Review the combined result after integration.
An independently passing branch can still conflict with another branch's assumptions.
Keep the original brief and required outcomes visible at phase boundaries.
Complete authorized follow-through without making the user reissue the task after each intermediate artifact.

## Prepare and follow a review

Use the repository's existing forge and release commands.
Present the concrete problem, resulting behaviour, material tradeoffs and actual verification.
Use the established PR template when one exists.
Draft versus ready, commit structure and merge strategy follow the task and repository contract.

When asked to follow checks or reviews, observe the relevant head and base revisions.
Separate actionable findings, infrastructure failures, pending checks and unrelated requests.
Trace a finding before fixing it; neither a bot verdict nor reviewer agreement proves its remedy.
Keep unresolved findings until evidence or a reasoned decision resolves them.
After a fix, update the checks and description that the change made stale.

If the task includes remote checks, inspect them through the existing repository tool.
When waiting is part of the request, bound it by the completion condition and timeout.
Re-read authoritative state before reporting completion.
A notification, queued merge or check from an older revision is not proof of completion.
Report the actual blocker if progress needs missing authority or external action.

For authorized issue or message updates, keep the original source identity and destination fixed.
Confirm the parent, recipient or tracker target before a write.
Use one authorized coordinator for external messages; evidence workers return findings to that coordinator.
If the target disappears or access becomes uncertain, stop that write instead of choosing a fallback destination.
After a write, confirm the resulting state before retrying.
For a multi-system handoff, use the existing recovery contract for partial completion.
Do not silently delete a created issue or send another message as compensation without authority.
These boundaries adapt PStack's [Benny automation contract](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/automations/benny/README.md).

## Release the verified artifact

Record the source, base, artifact identity and relevant environment behind the proof.
After a rebase or retarget, compare the patch and integration context.
Even an unchanged patch can need new checks against changed dependencies or a new base.

When changes actually depend on one another, verify and deliver prerequisites first.
After each authorized merge, confirm the result and recheck affected dependent changes.
Passing descendants cannot fill an unverified dependency gap.

After an authorized deployment, verify the deployed identity and relevant public operation.
Keep rollback and data compatibility evidence with the release owner.
Report local readiness, queued work, merged work and deployed behaviour as distinct states.

## Pause, resume and cleanup

For an explicit pause, stop at the next safe boundary without starting new work.
Account for active workers and uncertain effects before cleanup.
Preserve the working tree and the minimum resume context in the existing local owner.
Do not create a commit or publish work merely to make a pause look complete.
Use the resume procedure in `repository-work.md` when work continues.

For cleanup, get paths from the owning tool, such as `git worktree list --porcelain`.
Check active users or sessions, uncommitted edits, untracked files and retained artifacts before removal.
An old timestamp, merged branch or ignored file does not prove the directory is disposable.
Remove only confirmed, authorized resources and verify the resulting state.

Adapted from PStack's [feature](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/feature.md),
[review follow-through](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/babysit.md),
[shipping](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/shipping.md)
and [cleanup](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/worktree-cleanup.md) workflows.
