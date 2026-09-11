# Operator

One file per person, at `~/.config/simple/operator.md` or the path in
`SIMPLE_OPERATOR_FILE`. The session hook injects it on every start, resume, compact,
and subagent start, in every repository. Keep it under a screen. It describes how you
work and read; it does not hold repository facts.

## Working rules

- How you want replies shaped: first sentence, length, vocabulary.
- How you ask, and what "proceed", "done", or "keep going" mean from you.
- What the agent should ask once, up front, when it is missing.
- What the agent must never do without your explicit word in the current message.

## Guard

The hook denies a shell command that matches a line here unless your latest message
contains the allow word, or is a short affirmative reply to the agent's own message that
proposed that command. A message containing a negation never authorises. Default allow word is the last word of the pattern; write
`pattern -> word` to choose another. Prefix `tool:` to match a tool name instead.

- git push
- tool:mcp__.*(publish|delete) -> publish
