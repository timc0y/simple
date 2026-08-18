# Simple commands

Commands are independent entry points into one Simple reasoning method. They are not
a mandatory lifecycle and must not duplicate the core skill.

## `simple init`

Inspect the repository, run `scripts/simple.mjs init`, record facts the repository
can establish, and ask the owner only for material facts code cannot prove. Leave
unknowns explicit. Init may change only the profile and agent-routing files unless
the user authorizes more.

## `simple audit`

Read `audit.md`. Audit is read-only unless the user separately requests fixes.
Return a verdict, evidence, present obligations, ownership and ordinary-path findings,
unpaid complexity, profile contradictions, proof gaps, highest-value actions, and
material unknowns.

## `simple plan`

Plan the requested outcome, not a generic project. Return:

```text
Requested outcome
Observed repository facts
What must be preserved and what may be replaced
Existing owner and ordinary path
Smallest truthful design
Complexity removed or avoided
Relevant precedent or standard, only if useful and its prerequisites exist
Independent proof
Reconsideration condition
```

Planning is read-only. Do not implement without authority.

## `simple review`

Review a design, plan, or diff. Lead with material findings ordered by consequence.
Check for invented obligations, divided ownership, second paths, unjustified
compatibility, displaced machinery left behind, self-grading proof, and unrelated
changes. Report no finding when the evidence does not support one.

## `simple check`

Run `scripts/simple.mjs check`. This validates routing and profile structure; it does
not verify that profile claims are true.
