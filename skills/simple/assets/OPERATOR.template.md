# Operator

One file per person, at `~/.config/simple/operator.md` or the path in
`SIMPLE_OPERATOR_FILE`. The session hook injects it on every start, resume, compact,
and subagent start, in every repository. Keep it under a screen. It describes how you
work and read; it does not hold repository facts.

## Working rules

- How you want replies shaped: first sentence, length, vocabulary.
- How you ask, and what "proceed", "done", or "keep going" mean from you.
- What the agent should ask once, up front, when it is missing.
- Which actions need approval, its scope and conditions, and any standing authority.

## Guard

These patterns trigger an authorization reminder, not a permission decision. Before
selecting tools, use approval from the active conversation for the agreed actions,
work and destination. Earlier approval survives status questions and interruptions;
clear action requests and natural approval of a concrete proposal count. Honor
withdrawals, read-only limits and unmet conditions. Completed work ends a one-time
approval; a standing grant stays
within its stated bounds. Requests phrased as questions count; readiness or explanation
questions, quotations and action mentions do not authorize an action. Never demand a
particular word in the latest message.

Each bullet is a case-insensitive regular expression. Prefix `tool:` to match a tool
name instead of its input. Existing `pattern -> word` entries still match the pattern;
the old word after the arrow is ignored.

- git push
- tool:mcp__.*(publish|delete)

The hook scans the whole tool input, including heredoc bodies and inline scripts.
Quoted examples can match too, and generated or encoded commands may not. Pattern
matches establish neither an action nor its approval. The hook does not grant or deny
permission; native host permissions still apply.
