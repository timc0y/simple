# Simple

## Reality

- Stage and users: One internal team owns a small CLI.
- Operators: The application team maintains the parser and CLI.
- Current burden: The in-house TOML parser is 1,800 lines and has recurring maintenance
  work; a maintained ecosystem package is available but compatibility is unverified.
- The typo is one local error message with no machine-readable contract.

## Preserve

- Existing supported TOML syntax, parse errors, and CLI exit behaviour.
- The CLI's meaning and tests.

## Current boundary

- The parser and error-message owner already exist in the application.
- No package replacement has been approved; no research is needed to spell a local word.

## Ordinary paths

- Parser changes use the existing fixtures and parser tests.
- CLI text changes use the existing message source and tests.

## Proof

- Compare parser fixtures, errors, and exit codes before and after any replacement;
  inspect the typo in the normal CLI output.

## Reconsider when

- Revisit the package after compatibility evidence shows it covers the supported syntax
  and error contract; revisit the typo only if the message becomes an external contract.
