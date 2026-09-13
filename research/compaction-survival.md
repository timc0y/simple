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

Simple already pins by mechanism: the guard reads the operator file from disk and the
transcript's last turn, never the conversation, and the session hook re-injects the
profile, round, and operator file on the compact start. No change on Claude Code. On
OpenCode, the plugin now pushes the same three blocks into the compaction summary.
The guard is not ported to OpenCode because its tool hook lacks the user's message;
that is the missing fact for a later port. The bypass-mode caveat is recorded in the
profile and is the first thing to test on any new harness.

## Guard coverage

Simple's guard matches the raw command text, so heredoc bodies and inline scripts are
scanned; a payload that is encoded or built at run time is not. The operator template
now carries a pattern for the usual decoders. This matches the boundary that
[destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard)
states for itself.

Codex's [hooks reference](https://learn.chatgpt.com/docs/hooks) accepts the same
`hookSpecificOutput.permissionDecision` shape Simple emits, supplies `transcript_path`
and `turn_id` to `PreToolUse`, and reports an unsupported output shape as a failed hook
while letting the call proceed. So the guard's format is portable to Codex; its
enforcement there still needs one observed block after the hook is trusted.

## Not done

A live compaction test that proves the round survives in Claude Code and OpenCode.
The structural tests cover the hook and plugin outputs, not the hosts' behaviour.
