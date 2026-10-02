# Compaction survival and the guard

Research date: 13 September 2026. Sources: the Claude Code
[hooks](https://code.claude.com/docs/en/hooks), [memory](https://code.claude.com/docs/en/memory),
and [context window](https://code.claude.com/docs/en/context-window) docs; the
[OpenCode plugin docs](https://opencode.ai/docs/plugins); and Chen,
[Governance Decay: How Context Compaction Silently Erases Safety Constraints in Long-Horizon LLM Agents](https://arxiv.org/abs/2606.22528),
June 2026.

## What the sources establish

- Rules held only in conversation decay. Across 1,323 episodes and seven model
  families, tool-call violations rose from 0 percent with the policy visible to a 30
  percent mean after compaction, 59 percent for the worst model. When the summariser
  kept the constraint, violations stayed at 0; when it dropped it, 38. The paper's
  mitigation, "constraint pinning", keeps governance out of the lossy path and returned
  the rate to 0.
- Claude Code re-reads the project-root `CLAUDE.md` after compaction; nested files and
  path-scoped rules reload only when a matching file is read. Context that hooks added
  earlier is summarised with the conversation, but `SessionStart` hooks matching the
  `compact` source run again and their output is added to the compacted context.
  `PreCompact` and `PostCompact` can add context but cannot block. Invoked skill
  bodies are re-injected capped at 5,000 tokens per skill, keeping the start of the
  file, so the most important instructions belong near the top of `SKILL.md`.
- A `PreToolUse` hook's deny "is ignored" when the permission mode is bypass, per the
  hooks reference. On 12 September 2026 the same deny blocked four commands in this
  harness while the session reported bypass mode. The two disagree; treat the guard's
  enforcement as harness-dependent until each harness is observed.
- OpenCode exposes `experimental.session.compacting`, whose `output.context` is read
  by the summariser, and `tool.execute.before`, where throwing prevents execution. The
  latter does not carry the user's latest message.

## Decision

Updated 2 October 2026: Simple's session hook re-injects the profile, round and operator
file on compact start. OpenCode pushes the same three blocks into its compaction
summary. These mechanisms preserve stored context; a live survival test is still
missing.

The previous permission guess read only the last user turn in Claude's transcript
shape. Private session review and synthetic probes found that it rejected existing
approval after a status question, rejected natural approval of a concrete proposal,
and accepted questions merely mentioning an action. It could not read Codex's native
user-message shape. The repair removes that parser and its allow-word decisions.
The shared skill and session context instead instruct agents to recover scoped
authorization before selecting tools. Configured patterns give advisory reminders.
This trades hook denial for conversational judgment; it is not deterministic
permission enforcement. The September bypass observations above are historical
evidence for the removed mechanism.

The [native Luna screen](../evals/results/2026-10-02-authorization-continuity/README.md)
tied at 6/6 action checks and 4/6 full answers per arm. It retained two matched stale
status failures and exercised Codex's fallback reminder, not Claude's old deny path.

## Guard coverage

Simple's reminder scans raw tool input, including heredoc bodies and inline scripts.
A quoted action can match; a generated or encoded payload may not. A match establishes
neither an action nor its approval. The earlier decoder pattern was a heuristic,
not complete coverage, like the boundary that
[destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard)
states for itself.

Simple now emits only context for these matches on Codex and Claude. Native host
permissions still apply independently. Reminders can arrive after the triggering tool
result and cannot decide permission for an already selected action. OpenCode and
Gemini use the shared guidance without this pattern reminder.

## Not done

A live compaction test that proves the round survives in Claude Code and OpenCode.
The structural tests cover the hook and plugin outputs, not the hosts' behaviour.
