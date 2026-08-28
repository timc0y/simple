SIMPLE.md is not fresh and contains several material contradictions.

- **Current boundary is incorrect.** It references `scripts/legacy-hook.mjs`, which does not exist. Both plugin manifests point to [`scripts/hook.mjs`](/tmp/simple-repository-work-shapes/workspaces/e81dda2cbd3a/scripts/hook.mjs), and both register Codex and Claude integrations.

- **The contract claims are inconsistent.** SIMPLE.md says there are no public contracts or external consumers, while [`README.md`](/tmp/simple-repository-work-shapes/workspaces/e81dda2cbd3a/README.md) describes a published plugin exposing `ledger check`; both manifests declare that command. Actual external usage cannot be established from this repository and remains an owner-confirmation question.

- **The ordinary path and proof command do not exist.** SIMPLE.md names `npm run verify`, but [`package.json`](/tmp/simple-repository-work-shapes/workspaces/e81dda2cbd3a/package.json) defines only `npm test`. The README also directs maintainers to run `npm test`.

- **The stated preservation obligation is too vague.** “Keep the current plugin behavior” does not identify the behavior to preserve. The observable implementation currently returns the hooks `session` and `write`, while the manifests expose `ledger check`; the profile should name the relevant contract precisely.

- **The reconsideration condition is not observable.** “Becomes more important someday” provides no actionable trigger. It should identify a concrete condition, such as another repository or published client depending on the plugin.

Additional evidence: `npm test` exits successfully but discovers zero tests, so it currently provides no behavioral test coverage. The profile checker also reports missing repository-level `AGENTS.md` and `CLAUDE.md`, although that is a routing/profile validation issue rather than proof that the plugin itself is broken.
