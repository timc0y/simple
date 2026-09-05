# Simple commands

Commands are independent entry points into one Simple method. They are not a mandatory
lifecycle and must not duplicate the core skill.

## `simple init`

Read `repository-work.md`. Inspect the repository, run `scripts/simple.mjs init`, record
facts the repository can establish, and ask the owner only for material facts code
cannot prove. Leave unknowns explicit. Add the repository-specific read order, truth
owners, work route, verification, authority, and swarm boundaries to `AGENTS.md`
without copying volatile facts or generic Simple rules. Init may change only the
profile and agent-routing files unless the user authorizes more.

## `simple work`

Read and follow `simple work` in `repository-work.md`.

## `simple reconcile`

Read and follow `simple reconcile` in `repository-work.md`; also read `refactoring.md`.

## `simple audit`

Read `audit.md`. Audit is read-only unless the user separately requests fixes. For a
quick audit, return a verdict, evidence, present obligations, ownership and
ordinary-path findings, unpaid complexity, profile contradictions, proof gaps,
highest-value actions, and material unknowns. For `simple audit deep` or a requested
multi-lens review, follow `multi-lens-audit.md` instead; do not impose that cost on a
scoped audit.

## `simple board`

Read `board.md` and `model-profiles.md`. Review a consequential decision through the
smallest set of views that could change it. Delegation is optional. When subagents are
available, keep them read-only and assign capability by task shape. When they are not,
apply the views sequentially and disclose that they were not independent. Return the
recommendation, strongest material dissent, unknowns, and discriminating proof. Do
not decide by vote.

## `simple plan`

Plan the requested outcome from repository evidence. Read `writing.md`; return plain
Markdown with only the sections the work needs. Cover the outcome, relevant facts, what
must be preserved and what may be replaced, the existing owner and ordinary path, the
smallest truthful design, implementation steps, complexity removed or avoided,
independent proof, and any material risk, unknown, or reconsideration condition.
Include a precedent or named standard only when it improves the decision and its
prerequisites exist. Planning is read-only. Do not implement without authority.

## `simple review`

Review a design, plan, document, or diff. Lead with material findings ordered by
consequence. Check for invented obligations, divided ownership, second paths,
unjustified compatibility, displaced machinery left behind, self-grading proof,
unrelated changes, lost facts, and decorative or confusing prose. Report no finding
when the evidence does not support one.

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
