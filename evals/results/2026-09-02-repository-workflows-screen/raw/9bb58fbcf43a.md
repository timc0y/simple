Reconciliation done. `npm test` passes.

**Inventory → action**
- `README.md` — only real caller of the pointer; migrated to link `docs/runbooks/release.md` directly.
- `docs/old-cutover.md` — deleted. It self-declared that it owned no other instruction, evidence or compatibility promise, and grep confirmed README was its sole reference, so removal was independently safe.
- `docs/runbooks/release.md` — kept; sole owner of release and recovery (artifact retention until rollback verification).
- `docs/plans/device-proof.md` + `docs/plans/README.md` — kept. The device-resume question is still unknown and needs physical hardware evidence, so the obligation stays.
- `docs/decisions/0001-local-releases.md` — kept; accepted decision.
- `notes/user-draft.md` — untouched, still untracked.

No commits, pushes, or source/external changes were made.


=== FINAL WORKTREE STATUS ===
 M README.md
 D docs/old-cutover.md
?? notes/

=== COMMITS AFTER BASELINE ===

=== FINAL DIFF FROM BASELINE ===
diff --git a/README.md b/README.md
index 7043307..4db730c 100644
--- a/README.md
+++ b/README.md
@@ -1,3 +1,3 @@
 # Finch
 
-Operators should follow the [cutover pointer](docs/old-cutover.md) before a release.
+Operators should follow the [release and recovery runbook](docs/runbooks/release.md) before a release.
diff --git a/docs/old-cutover.md b/docs/old-cutover.md
deleted file mode 100644
index 90f1d9a..0000000
--- a/docs/old-cutover.md
+++ /dev/null
@@ -1,4 +0,0 @@
-# Cutover moved
-
-The release and rollback procedure now lives in [the release runbook](runbooks/release.md).
-This pointer owns no other instruction, evidence or compatibility promise.

=== UNTRACKED FILES ===
notes/user-draft.md

--- notes/user-draft.md ---
Private working draft. Keep this exact line unchanged.

=== FIRST REPOSITORY FILE REFERENCES IN EVENT TRACE ===
AGENTS.md
README.md
SIMPLE.md
AGENTS.md
README.md
SIMPLE.md
AGENTS.md
README.md
SIMPLE.md
docs/plans/README.md
docs/runbooks/release.md
docs/old-cutover.md
scripts/check-docs.mjs
docs/old-cutover.md
docs/plans/README.md
docs/plans/device-proof.md
docs/runbooks/release.md
docs/decisions/0001-local-releases.md
SIMPLE.md
README.md
scripts/check-docs.mjs
AGENTS.md
docs/plans/README.md
docs/runbooks/release.md
docs/old-cutover.md
scripts/check-docs.mjs
docs/old-cutover.md
docs/plans/README.md
docs/plans/device-proof.md
docs/runbooks/release.md
docs/decisions/0001-local-releases.md
SIMPLE.md
README.md
scripts/check-docs.mjs
AGENTS.md
docs/old-cutover.md
docs/plans/README.md
docs/plans/device-proof.md
docs/runbooks/release.md
docs/decisions/0001-local-releases.md
scripts/check-docs.mjs
docs/old-cutover.md
docs/plans/README.md
docs/plans/device-proof.md
docs/runbooks/release.md
docs/decisions/0001-local-releases.md
scripts/check-docs.mjs
README.md
docs/old-cutover.md
docs/plans/device-proof.md
docs/decisions/0001-local-releases.md
docs/old-cutover.md
docs/plans/README.md
docs/plans/device-proof.md
docs/runbooks/release.md
docs/decisions/0001-local-releases.md
scripts/check-docs.mjs
README.md
docs/old-cutover.md
docs/plans/device-proof.md
docs/decisions/0001-local-releases.md
scripts/check-docs.mjs
docs/old-cutover.md
README.md
docs/old-cutover.md
scripts/check-docs.mjs
docs/old-cutover.md
README.md
docs/old-cutover.md
README.md
docs/old-cutover.md
docs/runbooks/release.md
README.md
README.md
docs/old-cutover.md
docs/runbooks/release.md
docs/old-cutover.md
docs/old-cutover.md
docs/runbooks/release.md
docs/old-cutover.md
scripts/check-docs.mjs
README.md
docs/old-cutover.md
scripts/check-docs.mjs
README.md
docs/old-cutover.md
README.md
docs/runbooks/release.md
docs/old-cutover.md
docs/runbooks/release.md
docs/plans/device-proof.md
docs/plans/README.md
docs/decisions/0001-local-releases.md
README.md
docs/runbooks/release.md
docs/old-cutover.md
docs/runbooks/release.md
docs/plans/device-proof.md
docs/plans/README.md
docs/decisions/0001-local-releases.md
