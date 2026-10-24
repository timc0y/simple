# Simple

[![Checks](https://github.com/timc0y/simple/actions/workflows/checks.yml/badge.svg)](https://github.com/timc0y/simple/actions/workflows/checks.yml)
[Website](https://timcoy.uk/simple/) · [MIT licence](LICENSE) · [skills.sh](https://skills.sh/timc0y/simple)

**Build the smallest truthful solution.** Simple is a portable skill for coding
agents that helps them design software around real users, existing owners and
observable evidence. It also helps write concise, useful developer prose.

It is **not** an agent, runtime wrapper, framework or mandatory workflow.

**Supported hosts: OpenCode, Claude Code, Codex and Antigravity.** One shared
skill, with small host adapters. [Host setup and verification](docs/hosts.md).

## Quick start

Install the skill using Agent Skills:

```sh
npx skills add timc0y/simple
```

Then ask your coding agent, for example:

```text
Use Simple to review this feature. Find the existing owner and ordinary path,
remove unnecessary complexity, and verify the behaviour we must preserve.
```

Or use it for writing:

```text
Use Simple to rewrite this technical plan for the people implementing it.
Keep the decisions, constraints, risks, unknowns and proof.
```

The skill can be used without a plugin or project profile. A host plugin adds
commands and lifecycle hooks; an optional `SIMPLE.md` supplies repository-specific
facts. [Installation options](#install) · [Repository context](#add-repository-context)

## Why Simple exists

An agent can know software patterns without knowing a project's actual users,
supported contracts, production data or scale. That gap encourages unnecessary
migrations, compatibility adapters, duplicate systems and invented future needs.

Simple asks five questions before adding machinery:

1. **What needs to work?** State the outcome independently of today's implementation.
2. **What is true now?** Identify users, obligations, data and material unknowns.
3. **Who already owns it?** Trace the ordinary successful path and exact obstruction.
4. **What is the smallest sufficient change?** Delete or reuse before creating new
   concepts, without removing safety, recovery or real compatibility.
5. **What proves it?** Check through the intended caller, including relevant failures.

```text
actual problem + repository reality + existing owner
    -> smallest complete change
    -> independent proof
```

| Observed obligation | Typical choice |
| --- | --- |
| No old callers and no retained data | Replace obsolete design directly |
| Retained data but no old callers | Migrate data, not the old interface |
| A real supported caller needs the old path | Use a bounded adapter with an end condition |

Simple minimizes **concepts, states, workflows and decisions**, not code lines at
the expense of correctness, security, accessibility or proof.

## Learning from PStack and Ponytail

Simple adapts selected, source-backed techniques rather than requiring other
plugins. [PStack](upstream/README.md) informs diagnosis, ownership, verification
and context recovery; [Ponytail](upstream/README.md) informs implementation choices
and complexity review. The [pinned source inventory](upstream/coverage.md)
records what was adopted, adapted or deliberately excluded.

The source archives are **review material**, not activated skills or hooks.
Their presence, or Simple's evaluation history, is not a claim of superior model
performance. For the detailed method, read the [shared skill](skills/simple/SKILL.md)
and its [specialist references](skills/simple/references/architecture.md).

## Commands

These are optional agent entry points into **one method**, not stages that must run
in sequence. Only `init` and `check` have deterministic CLI implementations; the
others ask the model to apply the shared skill.

| Agent request | Purpose |
| --- | --- |
| `simple init` | Establish a repository route and truthful context profile |
| `simple audit` | Review observed complexity and ownership, read-only by default |
| `simple board` | Seek evidence-backed independent views on a decision |
| `simple research` | Resolve a decision with sources and bounded probes |
| `simple work` | Complete a defined local outcome and reconcile its truth owners |
| `simple reconcile` | Refresh repository guidance and fulfilled temporary context |
| `simple plan` | Plan the smallest truthful change without implementing it |
| `simple review` | Review a design, document, plan or diff |
| `simple write` | Produce plain, accurate developer writing |
| `simple round` | Carry one multi-session outcome and open decisions |
| `simple emulate` | Apply a documented operator *method*, not a persona |
| `simple check` | Validate routes and profile structure |

For contracts and examples, see [command guidance](skills/simple/references/commands.md).
A workflow name by itself **does not authorize** pushing, deploying, publishing or
changing external accounts. The actual request and approved destination determine
the authority.

## Writing

Lead with the answer. Keep each fact in its source of truth and each reason beside
the decision it supports. Preserve constraints, recovery, proof, risks and unknowns.
Avoid long generic introductions and architecture ceremony for straightforward writing
tasks. [Writing guidance](skills/simple/references/writing.md).

## Add repository context

A profile describes what an agent cannot safely infer from generic instructions:
real users, operators, contracts, production data, owners, supported paths, checks
and reconsideration conditions.

From a **Simple source checkout**, initialize a target repository:

```sh
node skills/simple/scripts/simple.mjs init /path/to/repository
```

This scaffolds or upgrades `AGENTS.md`, `CLAUDE.md` and `SIMPLE.md`
without inventing project facts. Finish the profile using actual evidence, then run:

```sh
node skills/simple/scripts/simple.mjs check /path/to/repository
```

For an agent-assisted setup, ask: "Use simple init. Set this repository up from
observed truth." The [profile template](skills/simple/assets/SIMPLE.template.md)
and [authoring guide](skills/simple/references/profile-template.md) describe each
section. Nested profiles must state the root obligations that still apply;
hook injection does not silently merge them.

Do not commit private transcripts, keys or machine-specific context. Keep such
material in ignored `.local/` storage.

## Install

Choose **one** normal installation route. The Agent Skills install above supplies
the skill. Host plugins additionally expose command entry points and hooks.

**Codex plugin**

```sh
codex plugin marketplace add timc0y/simple
codex plugin add simple@timc0y-simple
```

**Claude Code plugin**

```sh
claude plugin marketplace add timc0y/simple
claude plugin install simple@timc0y-simple
```

**Local checkout / development**

```sh
npm run install:local
```

That links the shared skill into the four supported hosts' native locations.
Every destination is checked before links change; real files and directories are
never overwritten. It does **not** update cached plugins or enable hooks.

**OpenCode:** choose the adapter for your installed major version. V1 registers
[`.opencode/plugins/simple.mjs`](.opencode/plugins/simple.mjs) through `plugin`;
V2 registers the [plugin directory](integrations/opencode-v2/package.json) through
`plugins`. Do not load both. Keep the complete checkout beside the adapter.

**Antigravity:** install the shared skill through its native plugin manager:

```sh
agy plugin install https://github.com/timc0y/simple
agy plugin list --json
```

Optional context injection uses Antigravity's native PreInvocation contract:

```sh
node skills/simple/scripts/antigravity.mjs config
```

Run that from a checkout or use the script inside the installed skill. It prints
configuration for review; merge the named `simple` block into the existing hook
file without replacing other hooks. See [host setup](docs/hosts.md) for paths,
OpenCode examples, trust requirements and contract-test limits.

Gemini CLI is no longer supported and its extension manifest is removed.
Antigravity itself uses `.gemini/config` and `.gemini/antigravity-cli`; those native
paths remain intentionally. Historical research is retained, not active support.

After a **published plugin release**, update your installed host plugins:

```sh
codex plugin marketplace upgrade timc0y-simple
claude plugin update simple@timc0y-simple -y
```

Restart Claude Code after updating. Review new or changed hooks in Codex before
trusting them on a machine. Repository `main` may contain unreleased changes;
the plugin manifests currently identify the **0.8.2** release family.

## Activation and hooks

Codex and Claude use the shared hook on start, resume, fork and compaction to load
the nearest profile, open round and optional operator rules. OpenCode V1 uses its
project instance; V2 resolves each session independently. Antigravity's optional
hook injects transient context before each model invocation and refuses to guess
between unrelated workspace roots. These adapters do not override permissions,
create synthetic user requests or force another turn after completion.
Host delivery and model behaviour require separate observation; structural tests
do not prove compaction survival.

The assembler reads optional sources independently, applies a combined output
budget, labels incomplete context and keeps source identities available. Inspect
its **local** inputs (without exposing private file content) with:

```sh
node skills/simple/scripts/simple.mjs check --context
```

This reports raw-file hashes and what the assembler can supply, **not** what a
host delivered or what a model followed. It also identifies the actual installed
skill and assembler files; it does not claim to hash every specialist reference.
The command works from a skill-only installation without the surrounding checkout. After a resume or compaction, verify mutable status from
its actual owner before describing it as current.

The personal operator template
([`OPERATOR.template.md`](skills/simple/assets/OPERATOR.template.md))
also offers an optional `Attention name:` rule. When configured, it asks for
a name prefix in ordinary final prose, except exact-format replies, code,
documents and subagent reports. **It is not a hallucination detector.**
No hook automatically repairs, retries or blocks a finished answer over a
missing name.

Hook action-pattern matches are **advisory**, never permission decisions.
Existing user authorization, scope changes, withdrawals and native host
permissions remain authoritative. Post-edit reminders may guide the next
step, but cannot change an edit already submitted.

## Evidence

Simple's model evaluations are mixed and task-specific. Positive screens,
ties, regressions, invalid runs and corrections remain visible; neither a
passing repository test nor a trivial response-format marker proves broad
model performance.

Start at the [evaluation decision index](evals/results/README.md), the
[evaluation protocol](evals/README.md) and the
[research decisions](research/README.md). The large `evals/results/`
directory intentionally retains raw material for reproducibility; it is not
runtime code. The [pinned upstream archives](upstream/README.md) similarly
retain their licences and checksums. Avoid publishing private user transcripts
or credentials as evaluation fixtures.

## Repository layout

- [`skills/simple/`](skills/simple/SKILL.md): the shared skill, specialist references
  and repository-profile CLI.
- [`commands/`](commands/work.md), [`scripts/`](scripts/context.mjs) and
  [`hooks/`](hooks/hooks.json): thin command and host integration surfaces.
- [`test/`](test/reliability.test.mjs): deterministic regression tests.
- [`evals/`](evals/README.md): behavior fixtures and retained evaluation evidence.
- [`upstream/`](upstream/README.md) and [`research/`](research/README.md):
  pinned source provenance and research decisions.

## Development

```sh
npm test
node skills/simple/scripts/simple.mjs check
npm run test:behavior
npm run test:preservation
npm run test:workflow
git diff --check
```

GitHub Actions runs the repository tests on Linux, a targeted hook/profile
subset on Windows, the profile check and a Claude plugin installation probe.
Model-behaviour claims require matched, source-identified runs under the
[evaluation protocol](evals/README.md), not just passing structural checks.

The shared skill, references, hooks and evaluation cases live here; the
public website lives in the author's separate site repository.

For changes or bug reports, see [contributing](CONTRIBUTING.md).
Licensed under [MIT](LICENSE).
