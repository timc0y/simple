# Simple

Simple gives coding agents one rule: solve the real problem with the smallest
truthful design.

Software agents often enter a repository without knowing its stage, users or real
obligations. They see an old interface and preserve it. They see a schema change and
invent a migration system. They see one future possibility and build an abstraction.

Sometimes those mechanisms are necessary. Often the repository has no external
consumers, no production data and no reason to carry them yet. Simple makes that
difference explicit.

## The idea

Simple combines two kinds of knowledge:

- a small, general method for reducing software complexity;
- a local `SIMPLE.md` describing what is true in this repository.

The same change can then produce different—and correct—solutions:

| Repository reality | Appropriate design |
| --- | --- |
| Pre-launch, no consumers, no retained data | Replace directly |
| Retained data, no old callers | Migrate the data, not the interface |
| External consumers with a deprecation promise | Use bounded compatibility with a removal condition |

Simple does not mean fewer lines at any cost. It means fewer concepts, states,
workflows and decisions while preserving real behaviour, safety and proof.

## Inspiration

Simple draws from a few durable ideas:

- simple design: complexity must earn its place;
- YAGNI: hypothetical requirements are not present obligations;
- information hiding: necessary complexity belongs behind a clear owner;
- progressive disclosure: load specialist knowledge only when the task needs it;
- evidence-based refactoring: removal is complete only when behaviour is proved.

Frontier models need less generic instruction than earlier models, but they still
need the right facts. Simple keeps the general prompt small and supplies repository
reality at the moment it matters.

## How it works

```text
Simple plugin
├── small core skill
├── specialist references
├── repository setup and validation
├── lifecycle hooks
└── behavioural evals
        ↓
    SIMPLE.md
        ↓
smallest truthful solution
```

The core contains the shared decision method. References hold focused guidance for
architecture, compatibility, refactoring, writing and development communication.
Only the relevant reference is loaded.

Lifecycle hooks inject the nearest `SIMPLE.md` when a session or subagent starts,
including after context compaction. Pre-write hooks add short reminders only when an
edit touches Markdown, comments or likely structural complexity. Repositories without
a profile remain quiet.

## Repository context

`SIMPLE.md` records facts that materially change design decisions:

```md
# Simple

## Reality

- Stage and users: Pre-launch; internal development only.
- External consumers: None.
- Persistent production data: None.
- Compatibility commitments: None.

## Preserve

- Import files must remain reproducible.

## Does not need yet

- Backwards-compatible APIs: there are no external consumers.
- Migration infrastructure: there is no production data.

## Ordinary paths

- Scheduled work uses the existing job runner.

## Proof

- `npm test`
- `npm run build`

## Reconsider when

- Another repository consumes the API.
- Production data must survive schema changes.
```

“Yet” matters. The profile records current truth, not permanent doctrine. A concrete
reconsideration condition tells future agents when more complexity has become valid.

## Clear writing

Simple treats prose as part of the design:

- code explains what happens;
- comments preserve non-obvious reasons, contracts and invariants;
- documentation preserves knowledge needed to decide, operate, recover or verify;
- agent updates lead with outcomes, evidence, blockers and meaningful next actions.

The goal is not aggressive compression. It is load-bearing prose: concise without
discarding information that future work needs.

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

For skill-only local development:

```sh
npm run install:local
```

## Initialize a repository

Run setup from the cloned Simple repository:

```sh
node /path/to/simple/skills/simple/scripts/simple.mjs setup /path/to/repository
```

Setup adds the agent route and a deliberately cautious profile. Replace its discovery
prompts with observed facts from the repository or its owner, then validate it:

```sh
node /path/to/simple/skills/simple/scripts/simple.mjs check /path/to/repository
```

Do not infer users, production data or promises from weak signals. Uncertainty is not
permission to delete, and existing code is not proof that compatibility is required.

## Direction

Simple should remain small at the point of use.

- Keep the core stable and concise.
- Preserve specialist knowledge behind explicit context pointers.
- Add guidance only when observed failures show that models need it.
- Keep hooks deterministic and quiet.
- Let repository profiles carry local truth.
- Use evals to detect regressions before adding more instruction.

The project should become more capable through better routing, evidence and local
context—not through a growing universal prompt.

## Proof

Deterministic behaviour:

```sh
npm test
node skills/simple/scripts/simple.mjs check
```

The test suite proves setup idempotence, profile validation, nested profile discovery,
session injection and targeted pre-write reminders. Skill, plugin and marketplace
manifests are also checked with their host validators.

Behavioural evals cover four decisions:

- direct replacement in a pre-launch repository;
- preservation of real production data and consumers;
- reuse of an existing ordinary path;
- concise comments, Markdown and development updates.

Run one pass locally with:

```sh
claude plugin eval simple@timc0y-simple --runs 1 --no-publish
```

## License

MIT
