# Prove the requested behaviour

Use this for product verification, reusable verification procedures, UI parity or a test-first implementation.
Use the independent-proof rule in `architecture.md` for ordinary changes that need no larger procedure.

## Choose the checks

Map each requested outcome to an observable result before changing the implementation.
Include the failure or recovery path when its consequence matters.
Use the existing tests, product controls and operations guide.
Add a new verification tool only when existing tools cannot prove the relevant behaviour.

For a repeatable product procedure, record these facts in the existing verification owner:

| Fact | What the next run needs |
| --- | --- |
| Preconditions | Build, account, target, data and access needed |
| Entry point | Exact command or user interaction |
| Evidence | Expected result and meaningful side effects |
| Recovery | How to resolve a partial or uncertain effect |
| Cleanup | Resources this check owns and may remove |

Use `repository-work.md` for the start, identity, action, observation and cleanup sequence.
Confirm identity before destructive or external actions, not just after them.
A missing credential or unavailable device makes that check blocked; it does not change the promised behaviour.

## Test-first work

When a cheap local regression test can reproduce the defect, make it fail for the intended reason first.
Then implement the smallest complete fix and run the test again.
For a feature, prove one useful vertical slice before expanding it.
Do not write a large speculative test surface ahead of an unsettled contract.
Use the repository's test style and public interfaces.
Do not impose a test-first ceremony on copy edits or work that only a real device can establish.

Check the check: a known defect must fail, and a valid alternative implementation must remain acceptable.
A missing import, unreachable assertion or empty artifact is not a useful regression signal.
Keep baseline failures separate from failures caused by the change.

## UI and visual equivalence

For exact visual parity, capture the baseline before the change.
Keep matching viewport, data, interaction state, fonts and rendering conditions.
Compare the relevant states with the existing screenshot or image-diff tool.
Inspect differences before attributing them to the implementation.
Use an established tolerance for nondeterministic rendering; report unmatched regions explicitly.
Never change the baseline or tolerance merely to make the result pass.

For a redesign, the approved intent is the target; pixel equality with the old design is not the goal.
Exercise keyboard use, focus, accessible names and important interactions alongside visual checks.
A screenshot does not prove submission, persistence or recovery.

## Keep proof current

After a source, contract or environment change, repair affected verification steps in their existing owner.
Recheck stale instructions against the real operation.
Preserve required coverage when a selector, command or test seam changes.
For each material outcome, report passed, failed, blocked or untested with its evidence and limit.
Use `delivery.md` when proof must remain attached to a review or release artifact.

Adapted from PStack's [verification creation](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/create-verification-skill/SKILL.md),
[verification maintenance](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/maintain-verification-skill/SKILL.md),
[TDD](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/tdd/SKILL.md)
and [visual-parity](https://github.com/cursor/plugins/blob/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack/skills/poteto-mode/playbooks/visual-parity.md) workflows.
