# Cross-host board review research

Checked on 2026-08-28. Sources are official documentation and first-party source repositories only.

## Common ground

All three hosts can delegate a bounded task to a named agent. Each host can select a model and restrict tools for that agent.

The hosts do not share one intelligence-tier system:

- Codex documents task-based model choices and explicit reasoning levels.
- Claude Code accepts model families and a separate effort value.
- OpenCode accepts any available provider model and a model-specific variant.

Therefore, `light`, `medium`, and `heavy` are not portable host settings. They would be a policy that maps work shape to each host.

The permission rules are also different. Codex keeps the parent runtime boundary. Claude Code starts from parent permissions and can narrow tools. OpenCode uses the child agent's configured permissions.

## Codex

### Documented facts

- The parent can request parallel agents directly. Project instructions and skills can also request delegation. A useful request names each task, the wait rule, and the result format. The main thread collects the results. [OpenAI subagent documentation](https://developers.openai.com/codex/subagents)
- A spawn request, an `[agents]` default, or a custom agent file can select the model and reasoning effort. If none does, the child inherits both values from the parent. [OpenAI model and reasoning guidance](https://developers.openai.com/codex/subagents#choosing-models-and-reasoning)
- OpenAI describes `gpt-5.6` for complex work. It describes Terra for faster support work and Luna for narrow, repeatable work. The documented reasoning values include `low`, `medium`, `high`, `xhigh`, `max`, and `ultra`, when supported. [OpenAI model choice guidance](https://developers.openai.com/codex/subagents#model-choice)
- `agents.max_concurrent_threads_per_session` limits open child threads. The documentation does not publish its default value. [OpenAI global agent settings](https://developers.openai.com/codex/subagents#global-settings)
- Subagents inherit the current sandbox and permission mode. Codex reapplies live parent overrides when it spawns a child. A custom agent can set a narrower sandbox and can configure its MCP servers and skills. [OpenAI approvals and sandbox controls](https://developers.openai.com/codex/subagents#approvals-and-sandbox-controls)
- Codex can route follow-up instructions, wait, interrupt, stop, and close child threads. The app, command-line interface, and extension expose child activity in different ways. [OpenAI orchestration controls](https://developers.openai.com/codex/subagents#orchestration-and-thread-controls)
- `fork_turns` selects no parent turns, all parent turns, or a positive count. Its default is all turns. Full-history children cannot override the parent's model or effort. [Codex multi-agent source](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/multi_agents.rs#L47-L59) and [tool schema](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/multi_agents_spec.rs#L647-L650)
- All agents share the current directory and file system. The parent can send follow-up work or a message to an existing child. [Codex multi-agent source](https://github.com/openai/codex/blob/main/codex-rs/core/src/session/multi_agents.rs#L11-L59)

### Not established

- The public page does not promise that a completed child can resume after the parent session ends.

## Claude Code

Claude Code has two separate mechanisms. Ordinary subagents report to the parent. Agent teams are independent sessions that can message each other.

### Ordinary subagents

- Claude delegates through the `Agent` tool. A natural-language request can suggest a subagent. An agent mention guarantees one invocation. Claude writes the final task message. [Claude Code invocation guidance](https://code.claude.com/docs/en/sub-agents#invoke-subagents-explicitly)
- Each ordinary subagent starts with fresh, isolated context. It gets a task message and applicable project instructions. It does not get the parent's conversation or earlier skill invocations. A fork is the documented exception and receives the full parent conversation. [Claude Code context guidance](https://code.claude.com/docs/en/sub-agents#what-loads-at-startup)
- A definition or one invocation can select `haiku`, `sonnet`, `opus`, `fable`, or a full model identifier. The default is parent inheritance. The `effort` field accepts `low`, `medium`, `high`, `xhigh`, or `max` when the model supports it. [Claude Code subagent fields](https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields)
- Anthropic describes Haiku for simple work, Sonnet for daily coding, Opus for complex reasoning, and Fable for the hardest long tasks. [Claude Code model aliases](https://code.claude.com/docs/en/model-config#model-aliases)
- A subagent inherits available tools, then Claude Code applies background and safety filters. Definitions can add allowlists, deny tools, preload skills, and add scoped MCP servers. [Claude Code capability controls](https://code.claude.com/docs/en/sub-agents#control-subagent-capabilities)
- The default concurrency limit is 20 active subagents. `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` changes it. The default child-depth limit is three layers. [Claude Code concurrency limit](https://code.claude.com/docs/en/sub-agents#concurrent-subagent-limit)
- A returned agent identifier lets Claude resume the same subagent with its full history. The built-in Explore and Plan agents do not return an identifier. [Claude Code resume guidance](https://code.claude.com/docs/en/sub-agents#resume-subagents)

### Agent teams

- Agent teams are experimental and disabled by default. They need an interactive session. One lead assigns work and combines results. Teammates have independent context and can send direct messages. [Claude Code agent teams](https://code.claude.com/docs/en/agent-teams)
- The lead can name each teammate and its model. Teammates inherit the lead's effort level. They start with the lead's permission mode. The user can change a teammate's mode after spawn, but not during spawn. [Claude Code teammate models](https://code.claude.com/docs/en/agent-teams#specify-teammates-and-models) and [permissions](https://code.claude.com/docs/en/agent-teams#permissions)
- There is no hard teammate-count limit. Anthropic warns that cost, coordination work, and conflicts increase with team size. [Claude Code team-size guidance](https://code.claude.com/docs/en/agent-teams#choose-an-appropriate-team-size)
- In-process teammates do not survive `/resume` or `/rewind`. The lead is fixed for the team's lifetime. [Claude Code team limitations](https://code.claude.com/docs/en/agent-teams#limitations)

Anthropic states the boundary plainly: use subagents for quick workers that report back. Use teams when peers must share findings or challenge each other. [Claude Code mechanism comparison](https://code.claude.com/docs/en/agent-teams#choose-between-subagents-and-agent-teams)

## OpenCode

### Documented facts

- A primary agent invokes a named subagent in a child session. The child has fresh context and can run in the foreground or background. [OpenCode V2 agent modes](https://opencode.ai/v2/docs/agents#modes)
- Each agent can define a system prompt, model, step limit, and ordered permission rules. The model uses `provider/model` and can include a `#variant`. An unconfigured child inherits the parent's model. [OpenCode V2 agent options](https://opencode.ai/v2/docs/agents#options)
- Variants are model-specific request overlays. OpenCode warns that names such as `low`, `high`, and `max` do not exist for every model. [OpenCode V2 model variants](https://opencode.ai/v2/docs/models#variants)
- The parent controls which child agent it may start. The child uses its own configured permissions, not a restricted copy of the parent's permissions. [OpenCode V2 permission boundary](https://opencode.ai/v2/docs/agents#modes)
- Built-in `explore` is read-only. Built-in `general` has broad tools but cannot start another child. [OpenCode V2 built-in agents](https://opencode.ai/v2/docs/agents#built-in-agents)

### Source-level facts and limits

- The current task implementation accepts a description, prompt, child type, and optional task identifier. The identifier continues the existing child session. [OpenCode task source](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts#L43-L61)
- The same implementation gates asynchronous background children behind `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true`. Foreground is the default. [OpenCode task source](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts#L92-L117)
- Neither the V2 agent page nor the current task source documents a numeric concurrency cap. Treat the cap as unknown, not unlimited.
- The V2 documentation does not promise direct parent control of a child. The task identifier supports another turn, but not a peer-message system.

## Confidence and source gaps

Confidence is high for the documented configuration and permission differences. Each claim comes from a current host document or first-party source file.

Confidence is medium for OpenCode lifecycle behavior. Its V2 documentation and current task source expose different maturity levels. Check the installed version before use.

No source supports one universal model name for each intelligence tier. A cross-host workflow must describe task difficulty first, then map it to available models.
