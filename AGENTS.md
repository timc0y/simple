# Simple agent guide

## Start here

Read `SIMPLE.md`, then `skills/simple/SKILL.md` and only the specialist reference the
task routes to. Read `README.md` when changing public setup, commands, hooks, or
packaging. Read `evals/README.md` before creating or interpreting model evidence.
If `.local/context/` exists, use it as optional local evidence. Do not commit its
files.

This repository has no persistent work queue. The user's request owns current work.
Do not create a plan or backlog for one task. `evals/results/README.md` records
evaluation decisions, not future priority.

## Owners

- `skills/simple/SKILL.md` owns the shared method and progressive-disclosure routes.
- `skills/simple/references/` owns specialist method guidance.
- `commands/` owns thin host command prompts. It must not fork the method.
- `skills/simple/assets/SIMPLE.template.md` and `references/profile-template.md` own
  repository profile shape and authoring guidance.
- `README.md` owns public installation, use, and development guidance.
- `SIMPLE.md` owns facts about this repository that can change a design decision.
- `evals/README.md` owns the evaluation protocol. Each result directory owns its raw
  evidence, and `evals/results/README.md` owns the current decision about each run.
- `research/README.md` owns current research decisions. Reports retain their sources
  and method but are not runtime instructions.
- Plugin manifests package the shared source. They do not own a second skill copy.

Use `$simple` and read the nearest `SIMPLE.md` for repository-dependent decisions and work. Explicit workflows: `simple init`, `audit`, `board`, `work`, `reconcile`, `plan`, `review`, `write`, `emulate`, or `check`.

## Swarm and authority

The lead agent owns scope, synthesis, shared truth files, and final verification.
Subagents are read-only unless assigned exclusive paths. Use one writer per file. A
subagent must not create a plan, review, audit, status file, or eval record unless the
lead assigns that artifact and its owner.

Local source and documentation edits do not authorize a package release, Git tag,
commit, push, marketplace update, plugin install, or publishing action. Preserve
unrelated working-tree changes and raw evaluation evidence.

## Verification

Run `npm test`, `node skills/simple/scripts/simple.mjs check`, and `git diff --check`
for repository changes. Validate a changed skill with the installed skill validator.
Model behaviour claims also need an equal-condition evaluation under
`evals/README.md`; structural tests alone do not prove instruction quality.
