1. The profile says there are no public contracts, but `README.md` and both plugin
   manifests expose `ledger check`. Publication is established; actual users remain
   unknown.
2. The boundary names only Codex and `scripts/legacy-hook.mjs`. The repository has Codex
   and Claude manifests, both of which register the existing `scripts/hook.mjs`.
3. `npm run verify` is not defined. `package.json` defines `npm test`, and the README
   names that command as the release check.
4. “Keep the current plugin behavior” does not name a behavior. “More important
   someday” cannot be observed, so it cannot trigger reconsideration.

The owner must confirm actual users, retained production data, and any promises beyond
the published command. The file needs correction now because repository evidence
contradicts it, not because of its age.
