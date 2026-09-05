# Deep multi-lens audit

Use this only for a requested deep, whole-repository, or multi-lens audit. It is an
investigation workflow, not the default cost of `simple audit`. Do not edit, commit,
push, deploy, delete, or change account or external state. Never print credentials,
secret values, or local-only contents.

## Freeze the first model

Before opening source, write and date at most 150 words covering:

- what the product appears to be for;
- whether the idea and current boundary appear worthwhile;
- the one failure most likely to kill it;
- what appears deletable now.

Do not edit this paragraph. Treat it as a falsifiable prior, not a verdict. End the
slow audit by stating where it was right and wrong. Put the date in the paragraph's
heading or first line; use the local `date` command when the host did not supply it.
Make it the first section of the final answer, before truth surfaces or a verdict.

## Establish separate truth surfaces

Use only `observed`, `not_found`, `contradicted`, `unknown`, or `inferred`. Record the
evidence and observation time for each applicable surface:

- working tree, branch, dirty files, and unpushed commits;
- the remote default branch;
- deployed source and artifact identity;
- account and infrastructure objects, services, stores, queues, domains, logging,
  retention, and secret configuration without exposing values;
- local checks actually run and their results;
- device, hardware, browser, operating environment, or physical state;
- distribution or release state that has actually reached users.

A tracked status file is a dated claim, not live truth. A local pass is not deployed,
device, account, distribution, or user proof. `not_found` is not proof of absence.

## Trace the connected systems

Trace the product path from real input through client state, encoding, validation,
core decisions, response, persistence, resume, interruption, and deletion. Then trace
the release path from source and build inputs through artifact identity, storage,
deployment, verification, client compatibility, rollback, and recovery.

Attack the handoffs. Check especially:

- cold starts, deadlines, clocks, expiry, and readiness;
- identity used for rate limits, authorization, artifacts, and rollback;
- retries, duplicate requests, partial effects, network loss, and termination;
- corrupted, old, or mutually incompatible persisted state;
- data that is computed or retained without a current consumer or obligation;
- client assumptions production does not promise;
- privacy, safety, reliability, and marketing claims stronger than observable evidence.

Prefer one discriminating experiment to another plan. Name the exact obstruction
before proposing a replacement and the machinery removed before proposing an
abstraction.

## Admit only novel findings

A material finding must do at least one of these:

- identify an unrecorded failure mechanism;
- falsify or materially weaken a documented belief;
- find an unowned state transition, dependency, or operational obligation;
- show correct components composing into incorrect behaviour;
- expose a user, legal, financial, privacy, safety, or operational consequence that
  current checks cannot detect;
- identify code or infrastructure with no demonstrated consumer, contract, retained
  state, recovery, or audit purpose.

Before tracing source, list recorded problems, open questions, and earlier findings as
an exclusion set. Do not relabel one as a new finding. A newly discovered mechanism
that falsifies an earlier positive belief is novel even though the belief was recorded;
report it both as a finding and as a weakened earlier claim. A recorded problem whose
status, consequence, owner, or proof changed stays under earlier claims or known-issue
status unless the audit proves a distinct, previously unrecorded failure mechanism.

## Apply independent lenses

This section owns the lens board and its report contract. Do not substitute the
separate `simple board` reviewer roles or output schema. Use `model-profiles.md` only
when selecting subagent models, and `operator-emulation.md` only for sourced doctrine
detail. Give reviewers the same checked evidence, keep them read-only, and keep
architectural judgement with the lead. For each lens, report the requirement
challenged, what it would delete or reuse, its proposal, accepted trade-off, and blind
spot. A lens is a hypothesis generator, never evidence.

Independent means each doctrine gets its own reasoning and blind spot. Separate agents
are optional; when unavailable, apply every requested doctrine sequentially without
merging them or claiming independent reviewers.

When the user requests the full standard board, apply these documented or supplied
doctrines independently:

The SpaceX and Theo formulations are owned by the existing sourced operator guidance.
The Basecamp and DHH book titles, Paul Graham essays, Apple public material, and loose
distribution-first doctrine are user-supplied audit heuristics. Verify their sources
before revising or publishing those doctrines; do not turn the labels into evidence.

1. SpaceX five-step: challenge each requirement and its owner, delete, simplify what
   survives, accelerate only after direction is right, and automate last. Preserve
   regulation, retained data, public contracts, security, accessibility, and recovery.
2. Basecamp and DHH: calm cadence, few moving parts, one deployable where the product
   permits it, finish less work, and reject imagined scale. Its blind spot is a real
   physical or external loop that calm software practice cannot close.
3. Theo and T3: solve an actual product problem, keep the stack modular, move feedback
   earlier, use types as safety nets rather than ceremony, and bound experimental risk.
   Its blind spot is non-web, hardware, and operational work.
4. Paul Graham: identify who wants the product and what unscalable founder action can
   test that demand now. Its blind spot is safety engineering.
5. Apple operations: decide what to decline, find the dependency that can stop
   shipping, and compare privacy claims with actual collection and logs. Its blind
   spot is assuming company-scale functional ownership.
6. Distribution first: find the demand signal, first users, and price before expanding
   the product. Treat this as the loosest doctrine; speed loses when error harms a
   user.
7. The concrete end user at the highest-consequence moment: state what they see,
   trust, and do when an ordinary failure occurs. This is a consequence review, not
   simulated user research.

Skip a doctrine when it cannot change this repository's decision, and say why. Do not
imitate a person or invent an opinion.

## Synthesize and report

Repository truth, user consequence, safety, explicit commitments, authority, and
proof override reputation. Resolve disagreements through evidence, not votes.

Before opening source, reserve this ten-part completion ledger and write the frozen
fast take into its first section. The final answer must begin with that dated section,
with no preface. Return, in this order:

1. the frozen fast take, then where it was right and wrong;
2. novel findings ordered by user or business consequence. Do not admit a finding
   until one record names its status, affected actor and consequence, exact evidence,
   missed check, falsification attempted, severity, smallest independent proof, and
   action class: source change, product decision, human gate, or operator action. Move
   an incomplete or excluded item to known-issue status, earlier claims, unknowns, or
   checked-without-fault instead of presenting it as a finding;
3. one explicit pass for every requested lens, including a reason for a skipped lens,
   with requirement challenged, deletion or reuse, proposal, accepted trade-off, and
   blind spot; then an act, ignore, or oppose matrix for at most the five most
   consequential findings;
4. earlier review claims disproved or weakened;
5. areas checked where no material fault was found;
6. unknowns requiring hardware, owner choice, credentials, or new authority;
7. up to five deletions safe now, with callers, retained state, recovery, and proof;
8. up to five apparent deletions that must stay, with the obligation served;
9. the one experiment with the highest information gain per person-hour this week;
10. `The belief most likely to be wrong is ___, and the cheapest way to find out is
    ___.`

Do not manufacture a finding or deletion to fill a quota. Write plainly and let the
most consequential new discovery lead the findings. Before handing off, verify the
date, separate truth surfaces, recorded-issue exclusions, applicable seven-lens rows,
deletion obligations, single experiment, and exact final belief sentence.
