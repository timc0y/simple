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

## Optional Codehygiene

When installed and relevant to the requested change, use the bundled helper:
`node /path/to/simple/scripts/codehygiene.mjs scan --base HEAD path/to/file`.
Replace `/path/to/simple` with this skill's directory. Omit `--base HEAD` for a
whole-file view. Installation is optional; the helper's `install` action installs
the pinned tool when requested, not merely to finish an ordinary Simple task.

The helper presents observations for review without a quality grade or prescribed
rewrite. It retains raw flags and counts those outside changed lines; related
context can fall outside that focus. Untracked files are scanned in full. Read the
coverage fields before interpreting an empty candidate list as an absence of flags.

Review findings in changed code against its actual purpose; separate existing issues
from this change. Preserve useful comments, domain names, validation and recovery.
Do not require a clean score or rewrite sound code to satisfy the checker.
It examines character patterns, not program behaviour. Its current input encoding
is limited to 2,048 lines and 128 columns per line and collapses non-ASCII characters.
A clean result cannot replace tests, type checks or proof of the requested outcome.
The helper changes presentation and focus, not the detector's accuracy.

## Rendered text evidence

When interface wording, slot fit or repeated claims are part of the requested
outcome, use Interface Craft's existing text-slot scanner if available. Discover
its actual skill/checkout path; do not add a second collector to Simple. The
scanner accepts explicit URLs, viewport dimensions, configured budgets and claim
aliases and retains measurements separately from review candidates.

Keep the exact report, capture identities, configuration, coverage omissions and
failed captures. A completed process does not mean a complete site or journey was
reviewed. Distinguish source length from rendered lines, page totals from viewport
counts, and lexical/declared claim matches from a verified meaning judgment. A
smaller word count or a lower warning count is not proof of improved understanding.
Before changing copy, check conditions, actions, numbers, labels and deliberate
repetition against the actual task and source. Recheck the affected rendered state.

Parallax can import the report as candidate evidence. That import cannot complete
readiness, supply missing images or establish a specialist's visual review. Preserve
each skill's owner: Interface Craft measures the UI, Communicator handles approved
voice/meaning evidence, and Parallax coordinates the product review.

## Test-first work

When a cheap local regression test can reproduce the defect, make it fail for the intended reason first.
Then implement the smallest complete fix and run the test again.
For a feature, prove one useful vertical slice before expanding it.
Do not write a large speculative test surface ahead of an unsettled contract.
Use the repository's test style and public interfaces.
Do not impose a test-first ceremony on copy edits or work that only a real device can establish.

Check the check: a known defect must fail, and a valid alternative implementation must remain acceptable.
When a repeated error is encoded as a guard, test a representative version of the
original error against that guard and a valid counterexample. A passing check alone
does not prove the guard would have prevented the error.
A missing import, unreachable assertion or empty artifact is not a useful regression signal.
Keep baseline failures separate from failures caused by the change.

## Invariants and test repair

Use generated boundary cases when an input space is more important than a few
examples. State the property independently of the implementation: blank stays off,
separate projects stay separate, output stays bounded, and an optional failure does
not erase healthy evidence. Include valid counterexamples and retain the smallest
failing input. Avoid generators that filter away the cases the property needs.
A small deterministic loop is enough when no property-testing library is needed.

When repairing a test, distinguish a stale selector, invalid fixture, broken harness
and product regression before changing it. Preserve the original acceptance outcome.
A required test marked skipped, a weaker assertion, a replaced baseline or an
unbounded retry does not turn a broken feature into a pass. Exercise a known product
regression after a harness correction to show the corrected check still rejects it.
Record an unavoidable blocked check as blocked, not successful.

[Playwright's test-agent workflow](https://playwright.dev/docs/test-agents) is one
example of automated test repair; Simple keeps the acceptance contract outside the
repairing agent's discretion. No browser framework is required for unrelated work.

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
