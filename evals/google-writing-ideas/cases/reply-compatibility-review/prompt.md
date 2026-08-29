Write the final reply and resolution for this review comment. Return only the text that
belongs in the review thread.

Change: rename the internal helper `loadAccount` to `loadCustomer` and update its 3
callers.

Repository evidence:

- A repository search finds only the definition and the 3 callers.
- The helper is not exported.
- No stored identifier contains its name.
- The repository records no external consumer or compatibility promise.

Review comment:

> Keep `loadAccount` as a deprecated alias for 1 release. A script might still call it.

The author does not plan to keep the alias. Resolve the comment without inventing more
work or evidence.
