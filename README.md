# Simple

Simple helps coding agents solve the real problem with the smallest truthful design.

It is a portable agent skill with a repository context layer—not a replacement agent,
runtime wrapper, or development framework. The skill teaches one general method. A
short local `SIMPLE.md` supplies the users, contracts, retained data, ordinary paths,
proof, and reconsideration conditions that generic model training cannot know.

**[Visit the Simple site](https://timc0y.github.io/simple/)** · Open source · MIT

[![skills.sh](https://skills.sh/b/timc0y/simple)](https://skills.sh/timc0y/simple)

```sh
npx skills add timc0y/simple
```

Agents often enter a repository without knowing its stage, users, data, or promises.
That missing context makes speculative architecture look responsible: old interfaces
are preserved without consumers, migration systems appear without production data,
and one future possibility becomes an abstraction.

Simple combines a small design method with a local `SIMPLE.md` containing the facts
that change those decisions.

The public repository packages four parts around that method:

- the portable `simple` skill and selectively loaded specialist references;
- `simple init` and `simple check` for repository routing and profile structure;
- thin audit, plan, and review workflows, plus hooks where a host supports them;
- behavioural evals that test deletion, compatibility, ownership, proof, missing
  addresses, root causes, and complexity that genuinely pays rent.

| Repository reality | Smallest truthful design |
| --- | --- |
| No consumers or retained data | Replace directly |
| Retained data, no old callers | Migrate the data, not the interface |
| Consumers with a real promise | Use bounded compatibility with a removal condition |

Simple does not mean fewer lines at any cost. It means fewer concepts, states,
workflows, and decisions while preserving real behaviour, safety, and proof.

## The Raptor test

SpaceX's Raptor 1 → 2 → 3 evolution is the clearest physical example of the idea.
Raptor 3 internalised flow paths and cooling so exposed plumbing, engine shielding,
and supporting vehicle hardware could be removed. The engineering remained
sophisticated inside while the engine imposed less complexity on the whole vehicle.

That is the standard for software simplification: put necessary complexity behind
one clear owner, then remove the adapters, parallel paths, and support machinery the
stronger boundary makes unnecessary. Judge the system, not one component's line
count.

Sources: [SpaceX's Raptor comparison](https://x.com/SpaceX/status/1819795288116330594)
and [SpaceX's 2026 technical disclosure](https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf).

## Method

The core uses a few established ideas as compact decision anchors:

- KISS: minimise concepts and coordination, not merely lines;
- YAGNI: hypothetical requirements are not present obligations;
- Chesterton's Fence: establish why something exists before removing it;
- information hiding: keep necessary complexity behind one clear owner;
- progressive disclosure: load specialist knowledge only when it changes the task.

Repository evidence decides what those principles mean in each codebase.

```text
small reasoning kernel
      +
validated SIMPLE.md grounded in repository truth
      +
specialist references when needed
      ↓
smallest truthful solution
```

The specialist references cover architecture, compatibility, refactoring, writing,
development communication, and deletion tools. They stay out of ordinary context
until the task needs them.

## Repository context

Run init from this repository:

```sh
node skills/simple/scripts/simple.mjs init /path/to/repository
```

Init creates `AGENTS.md`, `CLAUDE.md`, and `SIMPLE.md`. The new profile is marked
incomplete because a script cannot know the repository's users, production data, or
promises. Replace its prompts with observed facts, remove the incomplete marker, and
validate it:

```sh
node skills/simple/scripts/simple.mjs check /path/to/repository
```

The canonical generated profile lives at
`skills/simple/assets/SIMPLE.template.md`. Keep the completed profile short and
record only reality, knowledge to preserve, the current design boundary, ordinary
paths, proof, and observable reconsideration conditions.

## Commands

Commands are human entry points into one Simple method, not separate skills or a
mandatory lifecycle.

| Command | Purpose | Default authority |
| --- | --- | --- |
| `simple init` | Establish repository truth and create its profile | Profile and routing files only |
| `simple audit` | Find ownership seams, parallel paths, invented obligations, and unpaid complexity | Read-only |
| `simple plan` | Design the smallest truthful change | Read-only |
| `simple review` | Judge a design, plan, or diff | Read-only |
| `simple check` | Validate routing and profile structure | Read-only |

`init` and `check` have deterministic CLI implementations. `audit`, `plan`, and
`review` require model judgement and remain thin prompt entry points into `$simple`.
Claude Code exposes the files in `commands/` as slash commands; Codex exposes the
same workflows through the skill and starter prompts.

### Evidence-led audits

When subagents are available, `simple audit` gives inexpensive agents bounded,
objective crawls for repository reality, ownership, ordinary paths, compatibility,
complexity candidates, and proof/profile consistency. They return normalized facts,
scope, and limitations. The lead agent reconciles conflicts and retains all design
judgement. A crawler's `not_found` result never becomes proof of absence.

## Writing

Simple treats prose as part of the design:

- code shows what happens;
- comments preserve non-obvious reasons, contracts, and invariants;
- documentation preserves knowledge needed to decide, operate, recover, or verify;
- development updates lead with the outcome and material evidence.

For operational and instructional English, Simple can invoke established technical
English discipline such as ASD-STE100 rather than restating a language rulebook.
Named standards guide execution only when their prerequisites and purpose fit.

The goal is load-bearing prose, not aggressive compression.

## Hosts

Both hosts use the same skill and repository profile.

- Codex follows the repository route in `AGENTS.md` and loads specialist references
  through the skill.
- Claude Code also uses lifecycle hooks to inject the nearest profile and gives short
  reminders when an edit actually writes Markdown or comments.

The hooks are intentionally not described as cross-host. Codex's current accepted
plugin manifest does not register them.

## Install

The open Agent Skills CLI discovers Simple directly from this repository and installs
it for Codex, Claude Code, Cursor, OpenCode, and other supported agents:

```sh
npx skills add timc0y/simple
```

To select one agent and install globally:

```sh
npx skills add timc0y/simple --skill simple -g -a codex -y
```

The host-specific plugin routes remain available when their hooks or command surfaces
are useful.

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

For local skill development:

```sh
npm run install:local
```

The local installer links the same skill source into Codex, Claude Code, OpenCode,
and Gemini. There is one maintained copy of the guidance, not a host-specific fork.

## Website

The public site is a static Astro build from `src/pages/index.astro`. Run it locally:

```sh
npm install
npm run dev
```

Build the deployable site with `npm run build`; output is written to `dist/`.

## Evidence

Run deterministic checks with:

```sh
npm test
node skills/simple/scripts/simple.mjs check
```

The tests cover incomplete init, completed profile validation, nearest nested
profile discovery, profile injection, and targeted writing reminders. Behavioural
eval cases cover pre-launch replacement, retained production data, reuse of an
ordinary path, concise development writing, and adversarial pressure to invent
compatibility or architecture. A missing-precondition case tests whether the agent
preserves correctly owned state and repairs only its supported address. Root-cause,
unknown-write, and mutation-interval cases distinguish accidental machinery from
complexity earned by a real consequence and assign invariants to one owner:

```sh
claude plugin eval simple@timc0y-simple --runs 1 --no-publish
```

These evals are evidence only after they have been run and reviewed. Add instruction
for a measured failure, then remove or replace it when the same evals show it is no
longer useful.

## Direction

Simple should become more capable through better local facts, routing, and evidence—not
through a growing universal prompt. State each rule once. Keep examples only when
they encode a real requirement or correct a measured gap.

## License

MIT
