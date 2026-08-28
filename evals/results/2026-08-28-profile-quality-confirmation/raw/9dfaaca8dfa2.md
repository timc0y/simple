SIMPLE.md is not current and should not be treated as reliable guidance.

1. **The stated integration boundary is wrong.**
   `SIMPLE.md:15` references nonexistent `scripts/legacy-hook.mjs`. Both plugin manifests register `scripts/hook.mjs`, which exports `registerHooks()` and returns `["session", "write"]`.

2. **The release proof command is invalid.**
   `SIMPLE.md:19,23` specifies `npm run verify`, but `package.json` defines only `npm test`. `npm run verify` fails with “Missing script: verify”.

3. **The public-surface claims are inaccurate or unverified.**
   `SIMPLE.md:5-6` calls this an internal utility with no public contracts, while both plugin manifests expose the `ledger check` command and hook path. `README.md` also describes it as a published plugin. `package.json` marks the npm package private, so the publication model is unclear.

4. **The proof is currently weak even if changed to `npm test`.**
   `npm test` passes, but Node reports zero tests. It does not verify the hook behavior or manifest wiring.

5. **The reconsideration condition is not actionable.**
   “If the project becomes more important someday” provides no measurable trigger or decision to revisit.

The persistent-data claim is consistent with the visible repository: no storage or production-data handling is present. The profile should be rewritten around the two plugin manifests, `scripts/hook.mjs`, and an explicit verification command that actually tests the exposed behavior.
