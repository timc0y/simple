# Simple

Simple helps coding agents make the smallest truthful software decision and explain it
clearly.

It is a portable agent skill with a repository context layer—not a replacement agent,
runtime wrapper, or development framework. The skill has two connected modes: design
for architecture and change decisions, and writing for concise plans, documentation,
comments, Markdown, prompts, reviews, updates, and handoffs.
A short local `SIMPLE.md` supplies the users, contracts, retained data, ordinary paths,
proof, and reconsideration conditions that generic model training cannot know.

**[Visit the Simple site](https://timcoy.uk/simple/)** · Open source · MIT

[![skills.sh](https://skills.sh/b/timc0y/simple)](https://skills.sh/timc0y/simple)

```sh
npx skills add timc0y/simple
```

Agents often enter a repository without knowing its stage, users, data, or promises.
That missing context makes speculative architecture look responsible: old interfaces
are preserved without consumers, migration systems appear without production data,
and one future possibility becomes an abstraction.

Simple combines a small design-and-writing method with a local `SIMPLE.md` containing
the facts that change those decisions and explanations.

Simple uses design mode for architecture, ownership, compatibility, migration,
deletion, broad refactoring, and explicit audit, plan, or review work. Writing mode is
also first class: it helps agents produce plain, concise plans, documentation, comments,
Markdown, prompts, reviews, updates, and handoffs without turning each writing task into
an architecture audit.

The public repository packages four parts around that method:

- the portable `simple` skill and selectively loaded specialist references;
- `simple init` and `simple check` for repository routing and profile structure;
- thin audit, plan, review, write, and emulate workflows, plus hooks where a host
  supports them;
- behavioural evals that test deletion, compatibility, ownership, proof, missing
  addresses, root causes, plain developer writing, operator attribution, implementation
  safety, and complexity that genuinely pays rent.

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
development communication, deletion tools, and capability-based model guidance. They
stay out of ordinary context until the task needs them.

Simple keeps one canonical skill rather than model-specific copies; when a model or
harness needs more or less structure, `skills/simple/references/model-profiles.md`
describes how to adapt the guidance and prove the adapter still earns its place.

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
| `simple review` | Judge a design, plan, document, or diff | Read-only |
| `simple write` | Create or revise concise developer writing in plain Markdown | Requested writing only |
| `simple emulate` | Challenge a decision with a sourced operator doctrine, then synthesize | Read-only |
| `simple check` | Validate routing and profile structure | Read-only |

`init` and `check` have deterministic CLI implementations. `audit`, `plan`, `review`,
`write`, and `emulate` require model judgement and remain thin prompt entry points into
`$simple`.
Claude Code exposes the files in `commands/` as slash commands; Codex exposes the same
workflows through the skill and starter prompts.

### Evidence-led audits

When subagents are available, `simple audit` gives inexpensive agents bounded,
objective crawls for repository reality, ownership, ordinary paths, compatibility,
complexity candidates, and proof/profile consistency. They return normalized facts,
scope, and limitations. The lead agent reconciles conflicts and retains all design
judgement. A crawler's `not_found` result never becomes proof of absence.

## Writing

Writing is a first-class Simple mode. Use it for technical plans, documentation,
comments, Markdown, prompts, reviews, progress updates, and handoffs. It applies a plain
writing standard without expanding the task into architecture analysis unless the
content genuinely requires a design decision.

- Code shows what happens; comments preserve non-obvious reasons, contracts, and
  invariants.
- Plans cover the requested outcome, relevant facts, necessary steps, proof, and only
  the risks or unknowns that affect action.
- Documentation preserves what the reader needs to decide, operate, recover, or verify.
- Updates and handoffs lead with the outcome and material evidence.
- Markdown stays plain: few sentence-case headings, shallow lists, restrained emphasis,
  no decorative styling, and no table unless comparison genuinely needs one.

The goal is clear, load-bearing prose—not ceremonial formatting or aggressive
compression.

## Operator emulation

When asked what a documented engineer or company would do, Simple emulates the sourced
decision doctrine—never the persona—then synthesizes against repository truth and
independent proof. The specialist reference bundles SpaceX's documented five-step
engineering sequence inline, plus a scoped Theo/T3 web-product lens and a
minimal-implementation lens informed by Ponytail, and accepts user-supplied doctrines
with equally explicit sources and blind spots. Simulated reactions remain hypotheses,
never user research or runtime proof.

## Hosts

Both hosts use the same skill, repository profile, and lifecycle hooks.

- Claude Code and Codex both register `hooks/hooks.json`: the nearest profile is
  injected at session and subagent start, and short reminders fire when an edit
  actually writes Markdown or comments. Codex asks for a one-time `/hooks` trust
  approval per machine.
- Codex also follows the repository route in `AGENTS.md`, so the guidance survives
  hosts or sessions without hook support.

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

## Using Simple well

Install globally once; invest per repository. A global install (plugin or skills CLI)
gives every project the method — the design sequence, the writing standard, the
references. The value concentrates when a repository also has a completed profile:
run `simple init`, replace the template prompts with observed facts, and validate with
`simple check`. Paired evals show the profile's facts change outcomes more than any
phrasing in the skill; treat `SIMPLE.md` as the product and the skill as its reader.
Record only what you can observe — users, contracts, retained data, proof — never
aspirations, and keep it short enough to read in one sitting. Nested profiles scope
facts to a subtree; the nearest one wins.

Use Simple when repository facts could change the implementation: architecture,
ownership, compatibility, migration, deletion, broad refactoring — and for developer
writing that must stay plain and load-bearing. Ask for an operator lens only when you
want a documented doctrine to challenge a decision.

Do not use it as ceremony or as permission. A one-line fix needs a one-line fix, not
an audit (the `routine-edit` eval enforces exactly this), and "simple" never justifies
breaking a real consumer, dropping validation at a trust boundary, or deleting
recovery and audit obligations — the profile's Preserve section outranks minimalism.

Simple coexists well with other minimalism skills such as Ponytail on most work, and
measured runs show them reinforcing each other on migration and implementation tasks.
One measured exception: on lock, interval, or uncertainty-protocol design, the
combination anchored to an existing broken step order more often than either skill
alone, and a wording fix failed its A/B (`evals/results/2026-08-22-precedence-edit-ab/`).
For that class of design, run one minimalism skill, not two.

How to tell it is active:

- Claude Code shows "Repository-specific Simple context from …/SIMPLE.md" at session
  start, the `/simple` commands are available, and subagents receive the same profile.
- Codex, OpenCode, and Gemini activate through the skill listing and the `AGENTS.md`
  route; if the route paragraph is missing or the skill is not installed for that
  host, Simple is not in play there.
- `simple check` verifies the wiring deterministically: routing files present, profile
  complete and within the injection budget.

It is not active when no `SIMPLE.md` exists in or above the working directory (the
hook then injects nothing and the skill falls back to generic evidence), when the
profile still carries the incomplete marker from `init`, or when a host lacks both the
skill and the route. When in doubt, ask the agent which profile it loaded — the answer
should name the file path.

## Website

The public site is part of Tim's personal site and is published at
[timcoy.uk/simple](https://timcoy.uk/simple/). This repository owns the skill; the
personal-site repository owns the page and its deployment.

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

These evals are evidence only after they have been run and reviewed. Compare paired
no-skill and with-skill runs using the protocol in `evals/README.md`. Add instruction
for a measured failure, then remove or replace it when the same evals show it is no
longer useful.

## Direction

Simple should become more capable through better local facts, routing, and evidence—not
through a growing universal prompt. State each rule once. Keep examples only when
they encode a real requirement or correct a measured gap.

## License

MIT
