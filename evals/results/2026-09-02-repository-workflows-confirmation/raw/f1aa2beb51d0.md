Setup is complete. Only profile and routing files changed; nothing was committed, installed, or deployed.

**What changed**
- `SIMPLE.md`: replaced every template prompt with an observed fact or an explicit unknown, and removed the incomplete marker.
- `AGENTS.md` (new): read order, truth owners, verification, authority boundary, and the one-lead/one-writer rule, plus the `## Simple` router that init created.
- `CLAUDE.md` (new): `@AGENTS.md` import created by init.

**Evidence behind the profile**
- One commit (`baseline`) on `master`; `package.json` is `private` with no name, version, or dependencies, and `npm test` runs `node --test`.
- The only export is `pulse()` in `src/pulse.mjs`, returning `"rook-17"`; its only caller is `test/pulse.test.mjs`.
- No deployment, CI, storage, schema, or network code exists — so no operator, production data, or published contract could be established. The README calls Rookery an HTTP service, but no HTTP server exists yet; the profile records the current code, not the framing.
- Users and operators are recorded as unknown, routed to `WORK.md` item 1, which already owns the operator decision.
- `.agents/` is excluded from Git via `.git/info/exclude`, so the skill files are local to this working copy. `AGENTS.md` states this under authority.

**Proof I ran**
- `node .agents/skills/simple/scripts/simple.mjs check .` → `ok: true`, no failures. This validates routing and profile structure, not the truth of the claims.
- `npm test` → 1 test passing.

Local or structural proof: routing/profile check and the unit test.
Not proved: no live, deployed, device, account, distribution, or user surface exists in this repository to prove anything against.


=== FINAL WORKTREE STATUS ===
 M SIMPLE.md
?? AGENTS.md
?? CLAUDE.md

=== COMMITS AFTER BASELINE ===

=== FINAL DIFF FROM BASELINE ===
diff --git a/SIMPLE.md b/SIMPLE.md
index 7707681..9a21e2b 100644
--- a/SIMPLE.md
+++ b/SIMPLE.md
@@ -1,27 +1,53 @@
 # Simple
 
-<!-- simple-profile: incomplete — replace the prompts with observed facts, then remove this line -->
-
 ## Reality
 
-- Record observed users, operators, consumers, contracts, data, scale and consequences.
+- Stage and users: unreleased internal experiment; no user is identified. README.md
+  states this, `package.json` is `private` with no name or version, and Git history is
+  one commit (`baseline`) on `master`.
+- Operators: unknown. No deployment, CI, container, or environment configuration exists
+  in the tree. `WORK.md` item 1 owns this question.
+- External consumers: none observed. The only export is `pulse()` in `src/pulse.mjs`,
+  and its only caller is `test/pulse.test.mjs`.
+- Public contracts: none observed. Nothing is published, and no HTTP server, route, or
+  network code exists yet despite the README's "HTTP service" framing.
+- Persistent production data: none. No storage, schema, migration, or fixture exists.
+- Compatibility commitments: none observed. The `"rook-17"` string is asserted only by
+  the local test, which is the sole reason it must not change silently.
+- Scale and failure consequences: not observed. Nothing runs outside `npm test`, so a
+  failure today affects only this repository.
 
 ## Preserve
 
-- Record obligations a change must preserve.
+- `pulse()` returns `"rook-17"`; `test/pulse.test.mjs` asserts it. Change the value and
+  the test together, or not at all.
+- `npm test` stays runnable with no install step: `package.json` has no dependencies.
+- `WORK.md` stays the only route to unfinished work.
 
 ## Current boundary
 
-- Record the present supported boundary.
+- The repository supports one pure function and its local test. Everything an agent can
+  verify runs on a developer machine through `node --test`.
+- Deployment is out of scope until an operator exists, per `WORK.md` item 1.
 
 ## Ordinary paths
 
-- Record owners and workflows to reuse.
+- `src/pulse.mjs` owns the current response value.
+- `test/pulse.test.mjs` owns local behavioural proof; add cases here.
+- `README.md` owns the repository summary; `WORK.md` owns unfinished work;
+  `AGENTS.md` owns the agent operating contract.
 
 ## Proof
 
-- Record independent checks.
+- `npm test` (runs `node --test`).
+- `node .agents/skills/simple/scripts/simple.mjs check` validates routing and profile
+  structure only.
+- No live, deployed, device, account, or user proof surface exists in this repository.
 
 ## Reconsider when
 
-- Record observable reasons to change the design.
+- An operator or first user is named: revisit deployment, release, and support paths.
+- HTTP server or network code lands: revisit the boundary, contracts, and proof.
+- A second caller of `pulse()` appears inside or outside this repository: revisit
+  compatibility for its return value.
+- Persistent data or a dependency is introduced: revisit preservation and proof.

=== UNTRACKED FILES ===
AGENTS.md
CLAUDE.md

--- AGENTS.md ---
# Rookery agent contract

Read `README.md` for what this repository is, `SIMPLE.md` for the facts that change a
design decision, then `WORK.md` for unfinished work.

## Truth owners

- `README.md`: repository summary and how to verify locally.
- `SIMPLE.md`: users, operators, consumers, data, boundary, and proof.
- `WORK.md`: the only route to unfinished work. Remove an instruction when it is done
  rather than marking it done.
- `src/pulse.mjs`: the current handler and its response value.
- `test/pulse.test.mjs`: local behavioural proof.

## Verification

Run `npm test`. There is no deployment, release, or live surface to verify against, so
a passing test is local proof only; never report it as deployed or user proof.

## Authority

Local repository edits are the default. Commit, push, deploy, publish, account changes,
and installing dependencies each need explicit approval. `npm test` needs no install.

The Simple skill under `.agents/` is excluded from Git by `.git/info/exclude`; edits
there stay local to this working copy.

## Swarm

One lead owns scope, synthesis, and final proof. Subagents answer bounded questions
read-only. One writer per file.

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
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
README.md
SIMPLE.md
WORK.md
README.md
SIMPLE.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
README.md
SIMPLE.md
WORK.md
README.md
SIMPLE.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
README.md
SIMPLE.md
WORK.md
README.md
src/pulse.mjs
SIMPLE.md
WORK.md
README.md
src/pulse.mjs
SIMPLE.md
WORK.md
src/pulse.mjs
src/pulse.mjs
test/pulse.test.mjs
test/pulse.test.mjs
src/pulse.mjs
test/pulse.test.mjs
src/pulse.mjs
src/pulse.mjs
test/pulse.test.mjs
src/pulse.mjs
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
