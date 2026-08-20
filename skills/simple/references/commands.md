# Simple commands

Commands are independent entry points into one Simple method. They are not a mandatory
lifecycle and must not duplicate the core skill.

## `simple init`

Inspect the repository, run `scripts/simple.mjs init`, record facts the repository can
establish, and ask the owner only for material facts code cannot prove. Leave unknowns
explicit. Init may change only the profile and agent-routing files unless the user
authorizes more.

## `simple audit`

Read `audit.md`. Audit is read-only unless the user separately requests fixes. Return a
verdict, evidence, present obligations, ownership and ordinary-path findings, unpaid
complexity, profile contradictions, proof gaps, highest-value actions, and material
unknowns.

## `simple plan`

Plan the requested outcome from repository evidence. Read `writing.md` and
`communication.md`; return plain Markdown with only the sections the work needs. Cover
the outcome, relevant facts, what must be preserved, the existing owner and ordinary
path, the smallest truthful design, implementation steps, independent proof, and any
material risk, unknown, or reconsideration condition. Planning is read-only. Do not
implement without authority.

## `simple review`

Review a design, plan, document, or diff. Lead with material findings ordered by
consequence. Check for invented obligations, divided ownership, second paths,
unjustified compatibility, displaced machinery left behind, self-grading proof,
unrelated changes, lost facts, and decorative or confusing prose. Report no finding
when the evidence does not support one.

## `simple write`

Create or revise a plan, document, comment, Markdown file, prompt, review, update, or
handoff. Read `writing.md` and `communication.md`. Read the nearest `SIMPLE.md` only for
facts the content depends on. Preserve the meaning, use the smallest useful structure,
and return plain Markdown or the requested comment without meta-commentary. Do not
expand the task into design analysis unless the content requires it.

## `simple check`

Run `scripts/simple.mjs check`. This validates routing and profile structure; it does
not verify that profile claims are true.
