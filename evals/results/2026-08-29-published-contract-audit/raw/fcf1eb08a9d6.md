Do not remove `simple check` now. It is a published command, and `SIMPLE.md` explicitly requires published paths and commands to be preserved.

Make `simple verify` the documented command and retain `simple check` as a small alias in the existing dispatcher. This adds no second implementation path and preserves the published contract.

Proof:

- Run the existing checks through both `simple verify` and `simple check`.
- Update the README and plugin prompts to publish `simple verify`; retain `simple check` only as a compatibility alias if it must be mentioned.
- Search published repository text to confirm `verify` is the primary command and no stale instruction directs new users to `check`.

Reconsider removal only after the published compatibility commitment is changed or an explicit deprecation/removal condition is established.
