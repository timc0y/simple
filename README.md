# Simple

Simple helps coding agents solve the real problem with the smallest truthful design.

Agents often enter a repository without knowing its stage, users, data, or promises.
That missing context makes speculative architecture look responsible: old interfaces
are preserved without consumers, migration systems appear without production data,
and one future possibility becomes an abstraction.

Simple combines a small design method with a local `SIMPLE.md` containing the facts
that change those decisions.

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
small core skill
      +
verified SIMPLE.md
      +
specialist references when needed
      ↓
smallest truthful solution
```

The specialist references cover architecture, compatibility, refactoring, writing,
development communication, and deletion tools. They stay out of ordinary context
until the task needs them.

## Repository context

Run setup from this repository:

```sh
node skills/simple/scripts/simple.mjs setup /path/to/repository
```

Setup creates `AGENTS.md`, `CLAUDE.md`, and `SIMPLE.md`. The new profile is marked
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

## Writing

Simple treats prose as part of the design:

- code shows what happens;
- comments preserve non-obvious reasons, contracts, and invariants;
- documentation preserves knowledge needed to decide, operate, recover, or verify;
- development updates lead with the outcome and material evidence.

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

## Evidence

Run deterministic checks with:

```sh
npm test
node skills/simple/scripts/simple.mjs check
```

The tests cover incomplete setup, completed profile validation, nearest nested
profile discovery, profile injection, and targeted writing reminders. Behavioural
eval cases cover pre-launch replacement, retained production data, reuse of an
ordinary path, and concise development writing:

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
