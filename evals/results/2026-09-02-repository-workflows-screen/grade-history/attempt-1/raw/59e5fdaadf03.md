Set up the repository from observed facts.

Changed only:

- [SIMPLE.md](/tmp/simple-repository-workflows-controls-final/workspaces/59e5fdaadf03/SIMPLE.md)
- [AGENTS.md](/tmp/simple-repository-workflows-controls-final/workspaces/59e5fdaadf03/AGENTS.md)
- [CLAUDE.md](/tmp/simple-repository-workflows-controls-final/workspaces/59e5fdaadf03/CLAUDE.md)

Proof passed:

- `node .agents/skills/simple/scripts/simple.mjs check`
- `npm test` — 1 test passed


=== FINAL WORKTREE STATUS ===
 M SIMPLE.md
?? AGENTS.md
?? CLAUDE.md

=== COMMITS AFTER BASELINE ===

=== FINAL DIFF FROM BASELINE ===
diff --git a/SIMPLE.md b/SIMPLE.md
index 7707681..3e1dce9 100644
--- a/SIMPLE.md
+++ b/SIMPLE.md
@@ -1,27 +1,37 @@
 # Simple
 
-<!-- simple-profile: incomplete — replace the prompts with observed facts, then remove this line -->
-
 ## Reality
 
-- Record observed users, operators, consumers, contracts, data, scale and consequences.
+- Rookery is an unreleased internal HTTP service experiment (README.md).
+- The repository records no eventual users, operator, external consumers, published
+  API promise, production data, or scale. Failure consequences are therefore unknown.
 
 ## Preserve
 
-- Record obligations a change must preserve.
+- Preserve the current local behaviour asserted by the test: `pulse()` returns
+  `"rook-17"`.
 
 ## Current boundary
 
-- Record the present supported boundary.
+- The repository currently contains one exported handler in `src/pulse.mjs` and one
+  local test for it. There is no deployment configuration or package consumer recorded
+  here (README.md, package.json, test/pulse.test.mjs).
 
 ## Ordinary paths
 
-- Record owners and workflows to reuse.
+- `src/pulse.mjs` owns the current handler. `test/pulse.test.mjs` is the verification
+  path, run through `npm test` (README.md).
+- `WORK.md` is the only route to unfinished work and says the operator must be decided
+  before deployment configuration is added.
 
 ## Proof
 
-- Record independent checks.
+- Run `npm test` to verify the current response.
+- Run `node .agents/skills/simple/scripts/simple.mjs check` to verify this profile and
+  the repository routing.
 
 ## Reconsider when
 
-- Record observable reasons to change the design.
+- Reconsider the boundary when an operator, external consumer, published promise,
+  production data, or deployment requirement is recorded in the repository or supplied
+  by its owner.

=== UNTRACKED FILES ===
AGENTS.md
CLAUDE.md

--- AGENTS.md ---
## Simple

Invoke `$simple` and read the nearest `SIMPLE.md` before decisions repository facts could change: architecture, ownership, compatibility, migration, deletion, or broad refactoring. Use Simple writing mode for plans, documentation, comments, and handoffs that should be concise, plain, and load-bearing. Repository facts override speculative compatibility, migration, and scale concerns. Use `simple init`, `audit`, `board`, `plan`, `review`, `write`, `emulate`, or `check` for an explicit Simple workflow.

--- CLAUDE.md ---
@AGENTS.md

=== FIRST REPOSITORY FILE REFERENCES IN EVENT TRACE ===
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
src/pulse.mjs
README.md
SIMPLE.md
test/pulse.test.mjs
WORK.md
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
README.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
SIMPLE.md
SIMPLE.md
README.md
WORK.md
src/pulse.mjs
test/pulse.test.mjs
scripts/simple.mjs
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
README.md
src/pulse.mjs
WORK.md
src/pulse.mjs
test/pulse.test.mjs
src/pulse.mjs
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
SIMPLE.md
AGENTS.md
CLAUDE.md
AGENTS.md
SIMPLE.md
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
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
scripts/simple.mjs
SIMPLE.md
SIMPLE.md
SIMPLE.md
scripts/simple.mjs
AGENTS.md
CLAUDE.md
SIMPLE.md
AGENTS.md
CLAUDE.md
SIMPLE.md
SIMPLE.md
AGENTS.md
CLAUDE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
SIMPLE.md
README.md
src/pulse.mjs
README.md
test/pulse.test.mjs
src/pulse.mjs
test/pulse.test.mjs
README.md
WORK.md
scripts/simple.mjs
scripts/simple.mjs
AGENTS.md
AGENTS.md
CLAUDE.md
CLAUDE.md
AGENTS.md
AGENTS.md
CLAUDE.md
CLAUDE.md
AGENTS.md
SIMPLE.md
CLAUDE.md
