# Review: rename `loadAccount`

No finding. The rename matches its repository facts and needs no wider change.

- **Scope matches the obligation.** `loadAccount` is an internal helper with three internal callers, no external consumers, and no persisted or compatibility commitment on its name. Renaming the helper and its three callers is the ordinary path already named in `SIMPLE.md`, not a new one.
- **No invented obligation.** Nothing here calls for a compatibility shim, alias, deprecation window, or migration step — there is no consumer or persisted state to protect.
- **No divided ownership or second path.** One helper, one rename, applied at all three call sites in the same change. No parallel old/new path is left running.
- **Nothing displaced.** A pure rename with unchanged behaviour and return value leaves no dead code, config, or explanation behind to clean up.
- **Proof is independent of the change.** Running the affected tests and type-check, then searching for the old name, verifies the rename from outside the edit itself rather than re-asserting that the diff did what it intended.

Proceed with the rename as scoped. Reconsider only if another repository or a published interface turns out to depend on the symbol.
