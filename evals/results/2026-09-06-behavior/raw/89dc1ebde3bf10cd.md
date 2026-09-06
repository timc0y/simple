Implemented the runtime selection behavior.

- `main.mjs` now uses `supported.mjs`.
- Transient failures use `transient-fallback.mjs`.
- Permanent errors remain failures.
- Removed obsolete `legacy.mjs` and `capability.mjs`.
- Updated `SIMPLE.md`.

Verified:

- `npm test` passes.
- Transient fallback passes.
- Permanent failure remains nonzero.
- `git diff --check` passes.