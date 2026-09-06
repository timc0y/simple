Setup is done and both checks pass.

**What changed**
- `AGENTS.md` (new): read order (`SIMPLE.md` → `WORK.md` → `README.md`), truth owners per file, `npm test` as the only verification, local-edit-only authority, and the one-lead/one-writer boundary. The `## Simple` section is just the router init wrote.
- `CLAUDE.md` (new): `@AGENTS.md`.
- `SIMPLE.md`: replaced every scaffold prompt with observed facts and removed the incomplete marker.

**Facts the repository proves**
- Unreleased internal experiment; `package.json` is `"private": true` with no dependencies, no exports, and only `test: node --test`.
- `src/pulse.mjs` exports `pulse()` returning `"rook-17"`; its only caller is `test/pulse.test.mjs`, which asserts that exact string — recorded under `Preserve`.
- No HTTP server, deployment config, CI, persistent data, or published contract exists, so the boundary is one library function verified locally.

**Recorded as unknown, not invented**
Operators, users, external consumers, compatibility commitments, and scale. The operator question already has an owner — item 1 in `WORK.md` — so I routed it there instead of asking you or blocking setup. `SIMPLE.md` names the observable events that would change each: an operator being named, an outside caller appearing, or a second module or persistent state arriving.

**Proof I ran**
- `node .agents/skills/simple/scripts/simple.mjs check .` → `ok: true`, no failures. This validates routing and profile structure only; it does not verify that the profile's claims are true.
- `npm test` → 1 test, 1 pass.

Local and structural proof only. Nothing was committed, pushed, deployed, or installed, and no product source changed — `src/` and `test/` are untouched.


=== FINAL WORKTREE STATUS ===
 M SIMPLE.md
?? AGENTS.md
?? CLAUDE.md

=== COMMITS AFTER BASELINE ===

=== FINAL DIFF FROM BASELINE ===
diff --git a/SIMPLE.md b/SIMPLE.md
index 7707681..229ee77 100644
--- a/SIMPLE.md
+++ b/SIMPLE.md
@@ -1,27 +1,52 @@
 # Simple
 
-<!-- simple-profile: incomplete — replace the prompts with observed facts, then remove this line -->
-
 ## Reality
 
-- Record observed users, operators, consumers, contracts, data, scale and consequences.
+- Stage and users: unreleased internal experiment with no identified users. `README.md`
+  states this; the repository has no deployment configuration, CI workflow, or release
+  history beyond the single `baseline` commit.
+- Operators: unknown. Naming one is the open item in `WORK.md`.
+- External consumers: none observed. `package.json` is `"private": true` with no
+  dependants, no exports field, and no HTTP server or route registration in `src/`.
+- Public contracts: none published. `src/pulse.mjs` exports `pulse()`, whose only caller
+  is `test/pulse.test.mjs`.
+- Persistent production data: none. The repository contains no database, migration,
+  storage, or fixture files, and `pulse()` holds no state.
+- Compatibility commitments: none recorded.
+- Scale and failure consequences: nothing runs outside `npm test`, so a failure today
+  breaks only the local test run.
 
 ## Preserve
 
-- Record obligations a change must preserve.
+- `pulse()` returns `"rook-17"`; `test/pulse.test.mjs` asserts that exact string. Change
+  the test in the same commit if the response changes.
 
 ## Current boundary
 
-- Record the present supported boundary.
+- The supported system is one library function, `pulse()` in `src/pulse.mjs`, verified
+  by `node --test`. It is not served over HTTP: no server, framework dependency, or
+  listener exists.
+- Local Node execution is the whole environment. `package.json` declares no
+  dependencies and no engine, build, lint, or release script.
 
 ## Ordinary paths
 
-- Record owners and workflows to reuse.
+- `src/pulse.mjs` owns the current handler; add handler behaviour there before adding a
+  second module.
+- `test/pulse.test.mjs` owns its proof; `node --test` discovers files under `test/`.
+- `WORK.md` is the only route to unfinished work.
+- `README.md` owns the repository summary; `AGENTS.md` owns the operating contract.
 
 ## Proof
 
-- Record independent checks.
+- `npm test` (runs `node --test`). Passing observed on the current tree: 1 test, 1 pass.
+- No live, deployed, device, account, or distribution surface exists to check against.
 
 ## Reconsider when
 
-- Record observable reasons to change the design.
+- An operator or user is named, which clears the open item in `WORK.md` and makes
+  deployment configuration and an operational owner meaningful.
+- Something outside this repository imports `pulse()` or calls it over a network, which
+  creates a real consumer and a compatibility question.
+- A second module, dependency, or persistent state appears, which ends the
+  single-function boundary above.

=== UNTRACKED FILES ===
AGENTS.md
CLAUDE.md

--- AGENTS.md ---
# Rookery agents

## Read order

1. `SIMPLE.md` — the facts that change design decisions here.
2. `WORK.md` — the only route to unfinished work; take the first unfinished item.
3. `README.md` — what this repository is.

## Truth owners

- `src/pulse.mjs`: the current handler behaviour.
- `test/pulse.test.mjs`: the proof of that behaviour.
- `package.json`: the scripts and the private, dependency-free package facts.
- `WORK.md`: unfinished work. Delete an instruction when it is done rather than
  marking it done.
- `SIMPLE.md`: users, operators, consumers, data, boundary, and proof. Update it in the
  same change that makes one of its claims false.

## Verification

Run `npm test`. That is the whole check: local and structural. There is no deployment,
release, or account surface to verify against, so never report a passing test as
deployed, released, or user-facing proof.

## Authority

Local repository edits are the default. Committing, pushing, publishing, deploying,
installing dependencies, or changing anything outside this repository requires explicit
user authorization each time.

## Swarm boundaries

One lead owns scope, synthesis, and final proof. Subagents read only, unless the lead
gives one an exclusive write scope. One writer per file.

## Simple

Use `$simple` and read the nearest `SIMPLE.md` for repository-dependent decisions and work. Explicit workflows: `simple init`, `audit`, `board`, `work`, `reconcile`, `plan`, `review`, `write`, `emulate`, or `check`.

--- CLAUDE.md ---
@AGENTS.md

=== FIRST REPOSITORY FILE REFERENCES IN EVENT TRACE ===
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
scripts/simple.mjs
AGENTS.md
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
AGENTS.md
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
AGENTS.md
AGENTS.md
SIMPLE.md
AGENTS.md
AGENTS.md
SIMPLE.md
AGENTS.md
AGENTS.md
SIMPLE.md
AGENTS.md
AGENTS.md
SIMPLE.md
README.md
SIMPLE.md
WORK.md
README.md
SIMPLE.md
WORK.md
README.md
SIMPLE.md
WORK.md
README.md
src/pulse.mjs
SIMPLE.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
scripts/simple.mjs
README.md
src/pulse.mjs
SIMPLE.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
scripts/simple.mjs
src/pulse.mjs
test/pulse.test.mjs
AGENTS.md
src/pulse.mjs
README.md
SIMPLE.md
WORK.md
AGENTS.md
src/pulse.mjs
README.md
SIMPLE.md
WORK.md
AGENTS.md
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
AGENTS.md
CLAUDE.md
AGENTS.md
SIMPLE.md
AGENTS.md
CLAUDE.md
AGENTS.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
AGENTS.md
CLAUDE.md
SIMPLE.md
AGENTS.md
AGENTS.md
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
