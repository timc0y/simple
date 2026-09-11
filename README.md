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

## Learning from PStack and Ponytail

Use Simple as one complete method. Its existing references incorporate selected
lessons from PStack and Ponytail, with links to the exact source revisions.
PStack informs investigation, dependency analysis, verification and recovery of context.
Ponytail informs implementation choices and complexity reviews.
Simple keeps the complete brief, repository facts, recovery obligations and proof.

Neither plugin is needed to use these lessons. The [upstream source archives](upstream/README.md)
keep both originals, licences, revision records and an update procedure in this
repository. They do not register skills, commands or hooks. Simple's shared hooks
continue to serve Simple; no upstream hook code is active through this package.

These additions express intended behaviour. They do not establish a comparative
model performance gain. Earlier evaluation results remain available below.

The [Luna workflow screen](evals/results/2026-09-07-workflow-screen/README.md) passed
both tasks in all three conditions after a documented verifier correction.
The later [personal-workflow screen](evals/results/2026-09-07-personal-fit/README.md)
passed the executable tasks but found a simplicity regression in the migration plan:
current Simple proposed dual storage where previous Simple used a boundary mapping.
The [follow-up investigation](evals/results/2026-09-07-migration-investigation/README.md)
did not support rolling back the example: smaller designs appeared in 3/4 runs with
it and 0/4 without. Both records remain; neither proves a broad performance change.
A [targeted clarification](evals/results/2026-09-07-representation-check/README.md)
then passed 6/6 decision cells versus 4/6 for the preceding text. Both passed the
fresh controls, including one requiring real dual-column compatibility. The exact
evaluated clarification is now in the compatibility reference; the gain is limited
to the known migration case.

Use ordinary requests with Simple; each loads only the relevant procedure:

| Request | Procedure |
| --- | --- |
| “Fix this bug” or “why is this slow?” | [Diagnosis](skills/simple/references/diagnosis.md) |
| “Prove this works” or “match this UI” | [Verification](skills/simple/references/verification.md) |
| “Try alternatives” or “improve this metric” | [Experiments](skills/simple/references/experiments.md) |
| “Finish the feature and follow its review” | [Delivery](skills/simple/references/delivery.md) |
| “Learn from our sessions” or “improve this skill” | [Learning](skills/simple/references/learning.md) |
| “Review shortcut debt” or “show the measured gain” | [Audit](skills/simple/references/audit.md) |

The [complete source coverage map](upstream/coverage.md) accounts for every pinned
PStack skill and playbook, all Ponytail skills, and their runtime differences.
Coverage means an explicit Simple procedure or documented host responsibility; it is not a benchmark victory.

## Why Simple exists

An agent can know general software patterns but cannot know a repository's current
users, promises, data, or supported paths. Without those facts, speculative work can
look responsible.

Common errors include these examples:

- The agent keeps an old interface that has no consumer.
- The agent adds a migration when no production data exists.
- The agent adds a service for growth that nobody measured.
- The agent creates a second owner instead of using the current path.
- The agent rebuilds behaviour that a maintained package already supplies.
- The agent keeps attempting a broken primary path before the only working route.
- A correction makes the agent forget the requirements that still apply.
- The agent reports a valid result that the intended caller cannot use.
- The agent builds around a stated requirement that no consumer needs, instead of
  asking whether a simpler design is acceptable.

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

Simple can coexist with implementation-minimalism skills such as Ponytail on routine
work. For lock, protected-interval, or uncertainty-protocol design, use one method at
a time: isolated Claude Sonnet and forced-read Codex evaluations found that forcing
both skills could preserve an unsafe operation order. Other combined cases passed, so
this is a measured narrow limit rather than a general incompatibility. See the latest
[interaction screen](evals/results/2026-08-30-obligation-handoff-screen/README.md).

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
| `simple research` | Resolve a decision using sources and working implementations | Read only; bounded local probes |
| `simple plan` | Plan the smallest truthful change | Read only |
| `simple review` | Review a design, document, plan, or diff | Read only |
| `simple write` | Write or revise plain developer prose | Requested text |
| `simple round` | Keep a multi-session round's ask, buckets, and decisions in one injected file | `ROUND.md` beside the profile |
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

The session hook also injects two optional files. `ROUND.md` beside a profile holds a
multi-session round's ask, buckets, and decisions; `simple round` owns it. An operator
file at `~/.config/simple/operator.md`, or the path in `SIMPLE_OPERATOR_FILE`, holds one
person's working rules and is injected in every repository, with or without a profile.
Its `## Guard` section lists shell command patterns and `tool:` name patterns; the hook
denies a matching tool call unless the user's latest message contains the pattern's
allow word or is a short affirmative reply to the agent's message that proposed the
command; a negation never authorises, and without a transcript the hook only reminds. Copy
`skills/simple/assets/OPERATOR.template.md` to start one.

Codex needs one `/hooks` trust approval on each machine. Codex also reads the route in
`AGENTS.md`. This route keeps Simple available when a host does not run hooks.

The skill can still work without `SIMPLE.md`. In that case, it uses repository evidence
without a repository-specific profile. The profile context is absent, but the skill is
not automatically inactive.

Simple is not ready when a profile still has the incomplete marker. `simple check`
reports this state. It also checks the route and the profile size. It does not prove
that profile claims are true. Use `simple review` to compare them with the repository.

## Evidence

The latest [executable behavior screen](evals/results/2026-09-06-behavior/README.md)
used Luna on actual edits, a follow-up correction, fallback cleanup, uncertain writes,
and package reuse. No skill passed 4/5; two identical old-skill copies and the overhaul
each passed 5/5. This found no overhaul gain or observed task regression. The small
synthetic suite cannot establish equivalence; one timeout was retried.

The subsequent [repeated preservation evaluation](evals/results/2026-09-06-preservation/README.md)
ran 36 Luna cells. Including source-faithfulness review, the previous version passed
12/12, the consolidated candidate 10/12 and a short instruction 11/12. Both candidate
writing notes added unsupported release status even though executable checks passed.
We restored the longer overhaul text, which preserves the reuse, research, fallback
and correction guidance. The failures did not establish that the shorter text caused
them. The new examples and evaluation tools remain.

The latest guidance makes intended capabilities the basis for adoption. It also
distinguishes instructions from evidence of completed actions. The
[evaluation protocol](evals/README.md#start-from-intended-capabilities) records coverage
gaps and calls for review of specific failures. We have no separate full model run
for the current version.

A [rollback audit](research/simple-skill-ideas.md#rollback-audit--6-september-2026)
recovered scoped proof, review and compatibility guidance withheld after earlier
evaluations. It also restored public engineering precedents removed during an editorial
rewrite. The audit records sources, surviving meanings and deliberate exclusions.
These restorations preserve intended capabilities; they have no new model-performance
claim.

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

For behavior claims, compare equal conditions using the
[Ponytail-informed protocol](evals/README.md). Keep negative results. Additional
instruction must justify its context cost. Record an owner-requested adoption without
a measured gain as provisional; it does not turn a tie into positive evidence.
Before model runs on the executable fixtures, run `npm run test:behavior` and
`npm run test:preservation`. The latter checks the repeated preservation suite.
The [research synthesis](research/simple-skill-ideas.md#preservation-and-reference-led-development--6-september-2026)
retains the shortening audit, hypotheses and boundary examples; inclusion there does
not automatically turn an idea into active skill guidance.

The public website is in Tim's personal-site repository. This repository owns the
skill, plugins, profiles, tests, and evidence.
