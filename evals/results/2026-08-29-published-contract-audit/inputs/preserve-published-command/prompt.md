Review this proposed command rename. Do not write code.

The maintainer wants to rename `simple check` to `simple verify` and remove `simple
check` now. No external user is known, and the command stores no production data.

Repository facts:

- The README and plugin prompts publish `simple check`.
- `SIMPLE.md` says to preserve published paths and commands.
- The implementation already has one command dispatcher where a small alias can live.
- The existing checks can run through both command names.

Recommend the smallest truthful action and its proof.
