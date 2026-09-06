# Repository work

Use this for repository setup, end-to-end implementation, repository reconciliation,
swarm coordination, or a release handoff. These workflows add terminal intent to the
core Simple method. They do not replace repository evidence or expand authority.

Only `simple init` may scaffold or upgrade Simple profile and routing files. Other
workflows must not run init or change Simple routing merely to make `simple check`
pass. Report an out-of-scope setup defect without folding it into unrelated work.

## Keep one repository contract

A repository is easy to resume when:

- each consequential fact has one current owner;
- one entry point routes all unfinished work;
- durable decisions, contracts, operating procedures, recovery knowledge, and
  retained evidence remain in their owning files;
- temporary plans, reviews, audits, status notes, and handoffs disappear after their
  remaining obligations or evidence move to a durable owner;
- Git preserves superseded prose unless an external compatibility promise requires a
  live pointer.

Do not impose a fixed documentation tree. Reuse the repository's current owners when
they are sound. A small repository may keep source truth in its README and deployed
truth in one operations guide. A larger repository may route distinct defect,
provider, product, and implementation queues through one work index when those states
have genuinely different lifecycles.

`AGENTS.md` owns the repository-specific operating contract:

- the read order and exact truth owners;
- the route to unfinished work;
- verification and release entry points;
- local-only data, shared infrastructure, and external-action boundaries;
- lead, subagent, and writer authority.

Keep volatile facts in the source that can verify or update them. Do not copy deployed
identities, counts, dates, or queue state into `AGENTS.md`. `SIMPLE.md` keeps only facts
that can change a design decision. It points to detailed owners instead of restating
their contracts.

## Make the system easy to drive

Design the repository as one connected control system, not a catalogue of components.
Make the path from intent to state change to observable proof easy for the next agent
to follow:

- one obvious entry point supplies the minimum current context;
- each consequential state, policy, and transition has one owner;
- inputs, effects, interruption, cleanup, failure, recovery, and exit conditions are
  inspectable at the owning boundary;
- commands expose enough identity and result state to distinguish the target from a
  nearby local, stale, or partial success;
- feedback arrives at the earliest truthful surface, then progresses from local to
  live, device, account, distribution, or user proof only when applicable;
- each completed change leaves less discovery and coordination for the next agent.

Before adding a guide, index, wrapper, workflow, or automation, name the repeated
search, handoff, tool sequence, or failure it removes. If it removes none, do not add
it. Put new durable knowledge in the existing owner and delete the temporary container
that discovered it.

## Coordinate one swarm

One lead owns scope, synthesis, shared truth, authority decisions, and final proof.
Subagents collect bounded evidence read-only unless the lead assigns an exclusive
write scope. Use one writer per file or shared state. Subagents do not create plans,
reviews, audits, status documents, or queue entries unless the requested outcome needs
that artifact and the lead names its owner.

Model families and cost tiers are host concerns. Use `model-profiles.md` when model
selection is available. Agreement is not proof; the lead resolves conflicts with
repository evidence and a discriminating check.

## `simple work`

Use this when the user wants the named repository outcome implemented, not merely
reviewed or planned. The default authority covers local repository edits needed for
that outcome. It does not include commit, push, deploy, release, account mutation, or
deletion of external state unless the user explicitly authorizes those actions.

1. Read the repository contract and inspect the current working tree. Establish the
   relevant truth owners, ordinary product path, release path, and history.
2. Give subagents only bounded questions that can change the answer. Keep synthesis
   and shared files with the lead.
3. Make the smallest truthful change through the existing owner and ordinary path.
4. Prove the outcome through an independent applicable surface. A local check is not
   live, device, account, distribution, or user proof.
5. Inspect the final diff and reconcile only owners it made false. Remove completed
   queue instructions and fulfilled temporary context after moving durable evidence.

In the handoff, name the check that ran and its proof class. When external proof is
relevant, use explicit `Local or structural proof:` and `Not proved:` lines for live,
device, hardware, account, distribution, or user surfaces; never let a local pass imply
them.

Continue until the requested outcome is independently proved or an exact authority,
hardware, account, or external dependency blocks it. Name that blocker and the
smallest action that would clear it. Do not turn an intermediate result into another
plan for the user to reissue.

## `simple reconcile`

Use this when the user says to reset, clean, consolidate, or reconcile a repository's
direction and documentation. The default authority covers local repository guides,
profiles, plans, and documentation. Change source or external state only when the user
also requests it.

Start with a read-only inventory. For every proposed deletion or consolidation, check
the current owner, callers and links, retained data or evidence, compatibility and
recovery obligations, and an independent proof. Then:

1. Repair contradictions in the durable owner.
2. Move each surviving obligation or piece of evidence once.
3. Retarget real callers.
4. Delete the fulfilled container and completed queue instruction.
5. Run the repository's structural and behavioural checks against the final tree.

Age, line count, a missing caller, or a newer review is not deletion proof. Preserve
unknown obligations and unrelated user changes. Do not create an archive tree, a
document registry, freshness timestamps, or empty documentation categories to manage
the cleanup.

## Review and release phrases

“Swarm review this” routes to `simple audit` for a repository investigation or
`simple board` for one consequential decision. Keep reviewers read-only and require
novel, sourced evidence.

A release request must name the intended external transition or be unambiguous in the
repository's release contract. Follow the guarded release path and verify source,
artifact, deployed identity, compatibility, and rollback as applicable. Stop at a
missing human, account, hardware, or recovery gate. Never infer production deployment
from `work`, `finish`, `reset`, or `reconcile`.

## Set up or roll out

For a new repository, run `simple init`, establish observable profile facts, and add
only the repository-specific operating facts above to `AGENTS.md`. Create a current
truth owner, work route, decision log, contract, runbook, or evidence file only when
the repository already has information that needs that lifecycle.

The scaffold's incomplete marker means prompts remain, not that every owner-only fact
has an answer. Remove it after every prompt is replaced by evidence, a commitment, an
explicit inference, or an explicit unknown. Route a material unknown to its existing
owner or work queue instead of inventing an answer or blocking setup indefinitely.

Before handing off init, check that:

- `AGENTS.md` contains the repository-specific read order, truth owners, work route,
  verification, local versus external authority, and one-lead/one-writer boundary;
- the `## Simple` section is only the compact invocation router created by init, not a
  copy of the Simple method;
- `SIMPLE.md` says `unknown` or `not observed` for users, operators, data, consumers,
  scale, or consequences that repository evidence cannot establish;
- only profile and routing files changed, the incomplete marker is gone, and the
  applicable local check passed.

For an existing repository, map current owners before choosing new ones. Repair the
highest-consequence contradiction first, migrate callers, remove duplicate spoken
rules, and leave the smallest owner set that the actual product and operations need.
