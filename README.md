# Simple

Simple helps coding agents find the smallest truthful software design. It also helps
agents write plain developer prose.

Simple is a portable agent skill with a repository context file. It is not an agent,
runtime wrapper, or development framework.

[Website](https://timcoy.uk/simple/) | [MIT license](LICENSE) |
[skills.sh](https://skills.sh/timc0y/simple)

```sh
npx skills add timc0y/simple
```

## Why Simple exists

An agent can know general software patterns but cannot know a repository's current
users, promises, data, or supported paths. Without those facts, speculative work can
look responsible.

Common errors include these examples:

- The agent keeps an old interface that has no consumer.
- The agent adds a migration when no production data exists.
- The agent adds a service for growth that nobody measured.
- The agent creates a second owner instead of using the current path.

Simple separates current facts from assumptions. It then finds the owner, ordinary
path, exact obstruction, smallest correction, and independent proof.

```text
problem
  + repository facts
  + existing owner and ordinary path
  -> smallest truthful change
  -> independent proof
```

Simple minimizes concepts, states, workflows, and decisions. It does not reduce line
count at the cost of behavior, safety, recovery, or proof.

| Current fact | Smallest truthful path |
| --- | --- |
| No consumers and no retained data | Replace the old design directly |
| Retained data and no old callers | Migrate the data, not the interface |
| A real old consumer has a promise | Use one bounded adapter with an end condition |

The [architecture reference](skills/simple/references/architecture.md) gives the
implementation ladder. The [examples](skills/simple/references/examples.md) explain
the Raptor model and other engineering precedents.

## Add repository context

The deterministic script only scaffolds missing files and upgrades recognized routes:

```sh
node skills/simple/scripts/simple.mjs init /path/to/repository
```

It creates `AGENTS.md`, `CLAUDE.md`, and `SIMPLE.md` when needed. It refuses to append
beside an unrecognized existing `## Simple` section. The new profile stays incomplete
because a script cannot infer users, production data, or promises.

For the complete agent-led setup, say `Use simple init. Set this repository up from
observed truth.` The agent inventories the repository and records its read order,
truth owners, work route, verification, authority, and swarm boundaries.

Start with repository evidence. Ask the owner only for facts that the repository
cannot establish and that change the present setup. An explicit unknown is a complete
current fact when the repository has no answer; route it to its existing owner or work
queue. Remove the incomplete marker once every prompt is replaced, then check the
profile:

```sh
node skills/simple/scripts/simple.mjs check /path/to/repository
```

A useful profile records these facts:

- current users, operators, consumers, and public contracts;
- production data and real compatibility promises;
- facts that the next change must preserve;
- the current system boundary;
- existing owners, workflows, and supported mechanisms;
- the observable behavior of each useful ordinary path;
- independent proof and measurable reconsideration conditions.

Keep the profile short. Record facts that can change a design. Do not copy generic
principles from the skill into the profile.

Give each fact one home. Put current reality in `Reality`, obligations in `Preserve`,
the supported state in `Current boundary`, and reusable mechanisms in `Ordinary
paths`. Put checks in `Proof` and observable change conditions in `Reconsider when`.

The canonical template is
[`skills/simple/assets/SIMPLE.template.md`](skills/simple/assets/SIMPLE.template.md).
The [profile guide](skills/simple/references/profile-template.md) explains how to
complete it. The nearest profile applies when a repository has nested profiles.
Hook injection does not merge root and nested profiles. Each nested profile must
contain every root fact that still applies.
Pass a nested directory to `simple check` to validate its nearest profile through the
repository's root routing files. A root check does not crawl every nested directory.

## Commands

Commands are entry points into one method. They are not a mandatory sequence.

| Command | Purpose | Default authority |
| --- | --- | --- |
| `simple init` | Scaffold the route and profile, then establish the repository contract | Profile and route files |
| `simple audit` | Find ownership seams and unpaid complexity | Read only |
| `simple board` | Challenge a decision with evidence-backed views | Read only |
| `simple work` | Implement one named outcome and reconcile its owners | Local repository edits |
| `simple reconcile` | Reset repository truth, routing, and temporary documentation | Local guidance and documentation |
| `simple plan` | Plan the smallest truthful change | Read only |
| `simple review` | Review a design, document, plan, or diff | Read only |
| `simple write` | Write or revise plain developer prose | Requested text |
| `simple emulate` | Apply one documented operator method | Read only |
| `simple check` | Check the route and profile structure | Read only |

`init` and `check` use deterministic scripts. The other commands use model judgment
through the shared skill. Their full contracts are in the
[command reference](skills/simple/references/commands.md).

`simple board` suggests subagents when the host supports them and another view could
change a consequential decision. It does not require delegation. Reviewers stay
read-only, and the lead resolves disagreement through evidence rather than vote.

`simple audit` is scoped by default. Ask for `simple audit deep` or a multi-lens audit
when the cost is justified. The deep workflow freezes an initial product model,
separates local and live truth, traces product and release systems, admits only novel
findings, and reconciles independent decision lenses. It does not mutate the
repository or require a quota of findings or deletions.

Use these short workflow messages instead of restating the method:

```text
Use simple init. Set this repository up from observed truth.
Use simple work. Finish this gate: <outcome>.
Use simple reconcile. Reset this repository's truth and documentation.
Use simple audit with a swarm. Investigation only.
Ship this: <name the commit, push, deploy, or release actions authorised>.
```

`work` continues through local implementation, independent proof, and final-diff
reconciliation. `reconcile` inventories owners before moving obligations and deleting
fulfilled temporary context. Audit and board already own bounded independent review.
A release request must still name the intended external transition; `work`, `finish`,
`reset`, and `reconcile` never imply commit, push, deploy, or account authority.

The [repository-work reference](skills/simple/references/repository-work.md) defines
the shared repository contract, swarm ownership, and rollout method. Each repository's
`AGENTS.md` names its actual truth owners, work route, checks, local-only state, and
release boundaries. Do not copy the shared Simple method into every repository.

Operator emulation applies a documented decision method. It does not imitate a person
or invent user evidence. See the
[operator guide](skills/simple/references/operator-emulation.md).

## Writing

Writing is a first-class Simple mode. Use it for plans, documentation, comments,
prompts, reviews, updates, and handoffs.

- Lead with the answer or outcome.
- Keep each fact in its owning source.
- Use comments for reasons, contracts, invariants, and traps.
- Use the smallest structure that makes the subject easy to understand.
- Keep material constraints, proof, risks, and unknowns.

The [writing reference](skills/simple/references/writing.md) owns the full standard.
Simple does not turn each writing task into an architecture audit.

## Install

Choose one route for normal use. Agent Skills installs the skill. A host plugin also
installs commands and hooks.

The Agent Skills command installs Simple for supported coding agents:

```sh
npx skills add timc0y/simple
```

Select Codex and install the skill globally:

```sh
npx skills add timc0y/simple --skill simple -g -a codex -y
```

The plugin packages add host commands and lifecycle hooks.

Codex:

```sh
codex plugin marketplace add timc0y/simple
codex plugin add simple@timc0y-simple
```

Claude Code:

```sh
claude plugin marketplace add timc0y/simple
claude plugin install simple@timc0y-simple
```

Update the plugin snapshots after a release:

```sh
codex plugin marketplace upgrade timc0y-simple
claude plugin update simple@timc0y-simple -y
```

Restart Claude Code after its plugin update.

Use this command for local development:

```sh
npm run install:local
```

The local command links one skill source into the shared agent skill directory,
Codex, Claude Code, OpenCode, and Gemini. It does not make host-specific copies.
It does not update cached plugin commands or hooks.

## Activation and hooks

The Codex and Claude Code plugin packages use the same lifecycle hooks. The nearest
profile enters context at the start of a session and a subagent. After a supported
edit-tool event, a stop hook gives the lead agent one final pass to update existing
truth owners, remove completed instructions and fulfilled temporary context, and
preserve durable obligations. Read-only turns do not trigger it, the marker is scoped
to that repository profile, and the continuation runs at most once.

A write hook can add a short review note after a Markdown or comment edit. The note
arrives after the tool result. It can guide the next correction, but it cannot change
edit arguments that the model already sent.

Codex needs one `/hooks` trust approval on each machine. Codex also reads the route in
`AGENTS.md`. This route keeps Simple available when a host does not run hooks.

The skill can still work without `SIMPLE.md`. In that case, it uses repository evidence
without a repository-specific profile. The profile context is absent, but the skill is
not automatically inactive.

Simple is not ready when a profile still has the incomplete marker. `simple check`
reports this state. It also checks the route and the profile size. It does not prove
that profile claims are true. Use `simple review` to compare them with the repository.

## Evidence

The strongest recent result concerns repository facts. A profile that named the
serialization owner and its supported alias mechanism improved strict passes from
4 of 12 to 12 of 12.

A focused authoring rule then improved profile output from 2 of 6 to 5 of 6. The rule
asks for the owner, supported mechanism, and observable behavior in `Ordinary paths`.

The profile-quality confirmation improved strict passes from 5 of 24 to 9 of 24. It
tested evidence interviews, semantic review, same-change maintenance, and concise
profile structure on Luna and Terra.

Tests of explicit start, fix, improve, and add routing did not earn more runtime text.
The current skill opened on all 40 substantive activation cells. The candidate also
opened on 2 of 4 typo-only controls.

See the [evaluation decisions](evals/results/README.md) and the
[evaluation protocol](evals/README.md). Results are evidence only when their harness,
grader contract, and skill condition are valid.

## Development

Run the deterministic checks:

```sh
npm test
node skills/simple/scripts/simple.mjs check
git diff --check
```

The tests cover profile setup, nested profile selection, hook routing, host links,
public references, release versions, eval case structure, and normalized eval records.

Change runtime text only after an equal A/B test moves the result. Keep negative
results. A tie loses because more instruction adds context cost.

The public website is in Tim's personal-site repository. This repository owns the
skill, plugins, profiles, tests, and evidence.
