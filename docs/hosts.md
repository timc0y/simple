# Supported agent hosts

Simple maintains OpenCode, Claude Code, Codex and Antigravity only. The skill is
one source; the adapters translate native lifecycle contracts. Require Node.js 22
or newer for the scripts. No adapter invokes a model or charges an API account.

## Choose one installation

An Agent Skills install supplies `skills/simple` without the repository around it.
Its profile CLI, context diagnostics and Antigravity hook script are self-contained.
A full source checkout additionally supplies host manifests, thin commands, the
shared Claude/Codex hook and OpenCode adapters.

Avoid installing conflicting copies through multiple routes. Before changing a
route, inspect the host's actual installed path and remove only the obsolete Simple
entry. Do not delete unrelated skills, hooks or user settings.

`npm run install:local` creates symlinks to one source in these locations:

| Consumer | Link under the user's home |
| --- | --- |
| Shared discovery | `.agents/skills/simple` |
| Claude Code | `.claude/skills/simple` |
| Codex | `.codex/skills/simple` |
| OpenCode | `.config/opencode/skills/simple` |
| Antigravity App / IDE | `.gemini/config/skills/simple` |
| Antigravity CLI | `.gemini/antigravity-cli/skills/simple` |

The installer checks all destinations first, replaces only stale symlinks and does
not authorize plugins or alter hook settings. Antigravity's `.gemini` paths are
intentional. The removed `gemini-extension.json` is not an Antigravity requirement;
existing Gemini CLI installations are outside the supported boundary.

## Claude Code and Codex

Use the plugin commands in the [README](../README.md#install). Both packages point
to `hooks/hooks.json`, which runs `scripts/hook.mjs`. The exact SessionStart matcher
covers startup, resume, clear, compact and fork. SubagentStart receives the same
repository sources. Post-edit reconciliation remains advisory, with no Stop hook.

Codex accepts the shared `CLAUDE_PLUGIN_ROOT` compatibility variable. Review new
or changed hook definitions on each machine; installation is not a trust grant.
A skill-only install has no lifecycle hooks, so its `AGENTS.md` route remains useful.
Do not claim live native delivery merely because a hook subprocess emitted JSON.

Sources: [Claude hooks](https://code.claude.com/docs/en/hooks),
[Codex hooks](https://learn.chatgpt.com/docs/hooks).

## OpenCode V1

Keep the complete checkout and configure the published file entrypoint once:

```json
{
  "plugin": ["/absolute/path/to/simple/.opencode/plugins/simple.mjs"]
}
```

The V1 factory uses the project directory supplied by the host. It adds system
context on each turn and supplies recovery sources to compaction. The compaction
request does not prove the resulting summary preserved every fact.

## OpenCode V2

V2 needs its own directory entrypoint; a V1 returned hook object does not become a
V2 plugin merely by renaming a config key. With a full checkout:

```json
{
  "plugins": ["/absolute/path/to/simple/integrations/opencode-v2"]
}
```

The directory's package entrypoint exports `id` and `setup`. The published
`@opencode/plugin` 2.1.4 `Plugin.define` implementation is an identity function;
this JavaScript adapter therefore needs no SDK runtime dependency. Its contract
must still be rechecked against the installed host version.

The adapter registers the canonical skill through `ctx.skill.transform`. An
already-discovered identical source is retained; a different skill with the same
identity is rejected rather than silently overwritten. Model context, compaction
and transient generation are separate registrations. Title generation is excluded.

Each callback obtains `Session.Info.location.directory` through `ctx.session.get`.
The plugin's load directory is not a fallback for another session. Missing session
identity yields a diagnostic without injecting the wrong profile. The adapter
changes only `event.system`, never messages, tools, permissions, generation settings
or the host's compaction result. Failed setup disposes its earlier registrations.

Sources: [migration](https://dev.opencode.ai/v2/docs/build/plugins/migrate-v1/),
[plugin contract](https://dev.opencode.ai/v2/docs/build/plugins/),
[session schema](https://dev.opencode.ai/v2/docs/api#schema-Session.Info).

## Antigravity App, IDE and CLI

The root `plugin.json` exposes the existing `skills/simple` source. On the CLI:

```sh
agy plugin install https://github.com/timc0y/simple
agy plugin list --json
```

App and IDE plugin directories can also be placed in `.agents/plugins/` for one
workspace or `~/.gemini/config/plugins/` globally. Do not also link a duplicate
skill unless the host's discovery view confirms it resolves to the same source.

Context injection is opt-in and separate from skill installation. Run the installed
skill's script using its actual path:

```sh
node /path/to/installed/simple/scripts/antigravity.mjs config
```

For a source checkout, use `skills/simple/scripts/antigravity.mjs`. The command
prints a named `simple` PreInvocation handler with quoted absolute paths; it never
writes your configuration. Merge that block into the existing `.agents/hooks.json`
or `~/.gemini/config/hooks.json`, preserving other hooks. Review it in the native
hook manager (`/hooks` in the CLI). Hooks in Antigravity CLI's `settings.json` are
not the supported location. Recreate the snippet after moving Node or the skill.

Only PreInvocation is registered. Its response uses `injectSteps` with
`ephemeralMessage`, so fresh context does not repeatedly append durable history.
The hook ignores transcript paths, emits no permission decisions and never retries
a finished answer. A zero-root, relative-root or multi-root payload receives a
clear diagnostic instead of selecting the first workspace or current process path.
For a multi-root task, select the intended directory and read its profile explicitly.
Malformed input fails open without printing the private input back to stderr.

The generated Windows command rejects quote, percent and exclamation characters
in command paths instead of relying on unsafe shell expansion. Use a normal local
path, regenerate the snippet and verify it in that host.

Sources: [skills](https://antigravity.google/docs/skills),
[plugins](https://antigravity.google/docs/plugins/),
[hook payload and configuration](https://antigravity.google/docs/hooks/).

## Verification and evidence boundaries

`npm test` includes generated context-budget cases, a negative control for the old
blank-name parser, actual hook subprocesses, copied-skill diagnostics, installer
collision checks and exact-shape OpenCode V2 contract fixtures. Antigravity's
printed command is executed in a scratch path containing spaces and reads changed
facts on the next invocation. These checks require no model credentials.

Keep four evidence levels distinct: source available, adapter emitted, host
received and task outcome preserved. `check --context` establishes only local
source identity and emission. Its `hostDelivered` and `modelApplied` fields remain
null. Source hashes include raw whitespace and line endings. Context sources must be
regular files no larger than 1 MiB; oversized files and named pipes are rejected
without an unbounded read, while other readable sources remain available. The name prefix
establishes none of the other evidence levels.

For a native host release check, record its exact version and install source,
inspect its loaded skill/hooks, then exercise new session, resume, fork, compaction,
project switching and child execution where supported. Check a failing compaction
and changed task state as well as successful recovery. Verify native permissions,
cancellation and exact-format output independently. Do not replay irreversible
operations to test a formatting marker.

The existing CI includes Linux tests, a selected Windows subset and Claude plugin
installation. Contract fixtures are not native V2/Antigravity loader tests or live
model benchmarks. Report unexecuted native paths explicitly; do not infer parity
from shared source or turn documentation into a measured improvement claim.

The changelog ideas use existing method owners: refutation-led review in
[board](../skills/simple/references/board.md), invariant tests and acceptance-preserving
repairs in [verification](../skills/simple/references/verification.md), bounded
handoffs and receipts in [repository work](../skills/simple/references/repository-work.md),
and identity/cost/quality separation in [experiments](../skills/simple/references/experiments.md).
A separate context panel or telemetry service is deliberately not a dependency;
the existing CLI supplies inspectable local diagnostics without paid calls.
