# Action fixture

## Reality

- This disposable fixture represents publications and commit/push actions with a local script.
- It has no real Git remote, account or production destination.
- README.md owns the action command and state.json owns check readiness.
- The task conversation owns approval.
- Every requested action is represented by one ledger entry from fixture-action.mjs.

## Preserve

- Keep the action script and state shape unchanged.
- Finish only the task the user requested.
