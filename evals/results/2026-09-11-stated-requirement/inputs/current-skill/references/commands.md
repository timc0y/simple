# Simple commands

Commands are independent entry points into one Simple method. They are not a mandatory
lifecycle and must not duplicate the core skill.

For any command, use the task-procedure table under `simple work` to select relevant specialist guidance.
A plan, review or investigation uses that procedure within its own scope; it does not authorize implementation.

## `simple init`

Read `repository-work.md`. Inspect the repository, run `scripts/simple.mjs init`, record
facts the repository can establish, and ask the owner only for material facts code
cannot prove. Leave unknowns explicit. Add the repository-specific read order, truth
owners, work route, verification, authority, and swarm boundaries to `AGENTS.md`
without copying volatile facts or generic Simple rules. Init may change only the
profile and agent-routing files unless the user authorizes more.

## `simple work`

Read and follow `simple work` in `repository-work.md`.

Select the relevant procedure from the request; the user need not name another command:

| Requested outcome | Read |
| --- | --- |
| Diagnose or fix a bug, regression, slow path or leak | `diagnosis.md` |
| Review type design or validation boundaries | `types.md` |
| Verify a product, maintain its checks, use test-first work or match a UI | `verification.md` |
| Prototype, compare implementations or optimize a measured outcome | `experiments.md` |
| Build dependent stages, follow review, release with authority, pause or clean up | `delivery.md` |
| Recover context or learn from repeated corrections | `repository-work.md` |
| Review session history, capture conventions or improve a skill | `learning.md` |

These are conditional procedures, not a sequence to run on every task.

## `simple reconcile`

Read and follow `simple reconcile` in `repository-work.md`; also read `refactoring.md`.

## `simple audit`

Read `audit.md`. Audit is read-only unless the user separately requests fixes. For a
quick audit, return a verdict, evidence, present obligations, ownership and
ordinary-path findings, unpaid complexity, profile contradictions, proof gaps,
highest-value actions, and material unknowns. For `simple audit deep` or a requested
multi-lens review, follow `multi-lens-audit.md` instead; do not impose that cost on a
scoped audit.

For shortcut debt or measured impact, use the corresponding section in `audit.md`.
For a complexity-only review, keep that scope while preserving the affected contracts.

## `simple board`

Read `board.md` and `model-profiles.md`. Review a consequential decision through the
smallest set of views that could change it. Delegation is optional. When subagents are
available, keep them read-only and assign capability by task shape. When they are not,
apply the views sequentially and disclose that they were not independent. Return the
recommendation, strongest material dissent, unknowns, and discriminating proof. Do
not decide by vote.

## `simple research`

Read `research.md`. Resolve a decision-changing question from repository evidence,
relevant sources and bounded experiments. Return findings, sources, a recommendation
and material unknowns. Product and external systems remain read-only unless separately
authorised. Do not require a report or expand a narrow lookup into an investigation.

## `simple plan`

Plan the requested outcome from repository evidence. Read `writing.md`; return plain
Markdown with only the sections the work needs. Cover the outcome, relevant facts, what
must be preserved and what may be replaced, the existing owner and ordinary path, the
smallest truthful design, implementation steps, complexity removed or avoided,
independent proof, and any material risk, unknown, or reconsideration condition.
Include a precedent or named standard only when it improves the decision and its
prerequisites exist. Planning is read-only. Do not implement without authority.

## `simple review`

Review a design, plan, document, or diff for the requested purpose. For explanation
or comparison, answer that question. For a defect review, lead with material findings ordered by
consequence. Check for invented obligations, divided ownership, second paths,
unjustified compatibility, displaced machinery left behind, self-grading proof,
unrelated changes, lost facts, and decorative or confusing prose. Report no finding
when the evidence does not support one.

For each material finding, state the affected obligation, evidence, consequence and
smallest supported correction. Mark optional improvements as optional. Judge the
problem separately from the proposed remedy. If a governing rule is wrong, repair
that rule rather than adding exceptions for each symptom.

For a complexity finding, name the location, unnecessary work and simpler replacement.
Explain why the replacement preserves the affected obligation. This adapts
[Ponytail's review](https://github.com/DietrichGebert/ponytail/blob/0a4dd63ad4541f4f655c4108a295916f3c1d8fda/skills/ponytail-review/SKILL.md).
Do not use a line-count target or a fixed response limit to omit a material finding.

## `simple write`

Create or revise a plan, document, comment, Markdown file, prompt, review, update, or
handoff. Read `writing.md`. Read the nearest `SIMPLE.md` only for facts the content
depends on. Preserve the meaning, use the smallest useful structure, and return plain
Markdown or the requested comment without meta-commentary. Do not expand the task into
design analysis unless the content requires it.

## `simple emulate`

Read `operator-emulation.md` and only the selected lens file. Establish a baseline
Simple solution, apply the documented doctrine independently, require its blind spot,
and synthesize against repository truth. Emulate a documented decision process, not
personality or voice. Simulation is not proof; identify the independent check.

## `simple check`

Run `scripts/simple.mjs check`. This validates routing and profile structure; it does
not verify that profile claims are true.
