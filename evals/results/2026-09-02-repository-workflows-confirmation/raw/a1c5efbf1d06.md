Setup is done. Only Simple profile/routing files changed: `SIMPLE.md` (modified), `AGENTS.md` and `CLAUDE.md` (new). No product source, tests, `README.md`, or `WORK.md` were touched, and nothing was committed, pushed, or installed.

What I found and recorded, all sourced from the repository:

- **README.md**: Rookery is an unreleased internal HTTP service experiment; no consumers, contracts, production data, or deployment config exist.
- **WORK.md**: the one open item is deciding an operator before adding deployment configuration.
- **src/pulse.mjs** / **test/pulse.test.mjs**: the only current behavior is `pulse()` returning `"rook-17"`, verified by `npm test`.
- **git remote -v**: empty — no remote configured. `git log`: single `baseline` commit.
- No CI, deployment config, or HTTP transport code exists despite the "HTTP service" framing — recorded as a current-boundary fact rather than fixed.

`SIMPLE.md` now states these as observed facts and marks operator, scale, and failure consequences as explicit unknowns tied to WORK.md's open decision (per profile-template rules, I didn't re-ask you for facts the repository already settles, and didn't invent an operator or consumer). The incomplete marker is removed.

`AGENTS.md` now carries the repository-specific read order, truth owners, work route (`WORK.md`), verification (`npm test`, the only check), authority boundary (local-only, no remote/deploy/production data), and swarm boundary (single file, one owner), followed by the standard Simple router section `simple init` generated.

Proof: `node .agents/skills/simple/scripts/simple.mjs check .` → `{"ok": true, "ready": true, "failures": []}`. `npm test` still passes (1/1), confirming source was untouched.


=== FINAL WORKTREE STATUS ===
 M SIMPLE.md
?? AGENTS.md
?? CLAUDE.md

=== COMMITS AFTER BASELINE ===

=== FINAL DIFF FROM BASELINE ===
diff --git a/SIMPLE.md b/SIMPLE.md
index 7707681..2ff1812 100644
--- a/SIMPLE.md
+++ b/SIMPLE.md
@@ -1,27 +1,49 @@
 # Simple
 
-<!-- simple-profile: incomplete — replace the prompts with observed facts, then remove this line -->
-
 ## Reality
 
-- Record observed users, operators, consumers, contracts, data, scale and consequences.
+- Rookery is an unreleased internal HTTP service experiment (README.md). No release
+  has happened, so there are no current users.
+- Operator: unknown. WORK.md records this as the next decision, to be made before
+  deployment configuration is added.
+- Consumers: none. No package, service, or caller in this repository imports
+  `src/pulse.mjs`; nothing beyond `test/pulse.test.mjs` depends on it.
+- Contracts or promises: none recorded. README.md states there is no public API
+  promise.
+- Data: none. README.md states there is no production data.
+- Compatibility: none owed. No consumer or published interface exists to break.
+- Scale and failure consequences: unknown. No deployment, traffic, or account exists
+  to size or fail.
 
 ## Preserve
 
-- Record obligations a change must preserve.
+- `pulse()` returning `"rook-17"`, the only behaviour `test/pulse.test.mjs` asserts.
 
 ## Current boundary
 
-- Record the present supported boundary.
+- The only code is `src/pulse.mjs`, exporting `pulse()`, which returns the fixed
+  string `"rook-17"`. There is no HTTP transport, router, or server in the
+  repository yet, despite the "HTTP service" framing in README.md.
+- No deployment configuration, CI workflow, or git remote exists (`git remote -v`
+  is empty).
 
 ## Ordinary paths
 
-- Record owners and workflows to reuse.
+- `WORK.md` is the one route to unfinished work; it currently names one item:
+  decide the operator before adding deployment configuration.
+- `README.md` owns the product's current reality and scope.
+- `test/pulse.test.mjs` owns verification of `src/pulse.mjs`'s behaviour, run via
+  `npm test`.
 
 ## Proof
 
-- Record independent checks.
+- `npm test` (`node --test`) runs `test/pulse.test.mjs` and asserts
+  `pulse() === "rook-17"`.
 
 ## Reconsider when
 
-- Record observable reasons to change the design.
+- An operator is named: unblocks adding deployment configuration (WORK.md).
+- An actual consumer or published API promise appears: add a compatibility
+  obligation.
+- Production data or a deployment target appears: add a preservation and scale
+  obligation.

=== UNTRACKED FILES ===
AGENTS.md
CLAUDE.md

--- AGENTS.md ---
# Rookery

Read order: `README.md` (current product reality) -> `WORK.md` (route to
unfinished work) -> `SIMPLE.md` (facts that bear on design decisions) ->
`src/pulse.mjs` (the current implementation).

Truth owners:

- `README.md` owns current product scope and reality.
- `WORK.md` owns the route to unfinished work; it is the only queue.
- `SIMPLE.md` owns facts that can change a design decision.
- `src/pulse.mjs` owns the current handler behaviour; `test/pulse.test.mjs` owns
  its verification.

Work route: `WORK.md` is the only entry point for unfinished work.

Verification: `npm test` (`node --test`) is the only check in the repository; no
CI, deployment, or release pipeline exists.

Authority: local repository edits only. No git remote, deployment configuration,
production data, or external consumer exists. Do not commit, push, deploy, or take
an external action without explicit authorization.

Swarm boundaries: one file, one owner. No swarm coordination is established beyond
the one-lead, one-writer default.

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
AGENTS.md
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
src/pulse.mjs
src/pulse.mjs
test/pulse.test.mjs
src/pulse.mjs
src/pulse.mjs
src/pulse.mjs
src/pulse.mjs
src/pulse.mjs
src/pulse.mjs
scripts/simple.mjs
scripts/simple.mjs
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
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
