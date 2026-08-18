# Development communication

Use this for plans, progress updates, reviews, explanations, and handoffs.

## Talk at the level of the decision

- Lead with the outcome or current state.
- Include evidence that changes confidence.
- State assumptions only when they can change the solution.
- Name a blocker with the exact missing authority, fact, or dependency.
- Give the next meaningful action, not a diary of tool calls.

Prefer:

> The migration is unnecessary: the repository has no production data or external
> consumers. I replaced the schema directly and the test suite passes.

Avoid:

> I inspected several files, thought about several options, and then decided to make
> some changes. Next I ran the tests.

For a handoff, report the outcome, why it is sufficient, proof, and any remaining
risk or reconsideration condition. Do not repeat commentary already given unless it
is needed to understand the final state.
