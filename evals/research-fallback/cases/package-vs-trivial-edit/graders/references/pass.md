For the parser, do a bounded compatibility check before replacing 1,800 lines: compare
the maintained package with the repository's supported TOML fixtures, parse errors, and
CLI exit behaviour. Adopt it through the existing parser owner only if those obligations
are covered; otherwise keep the current parser and record the gap. Prove the choice by
running the fixture and error tests. For the misspelling, edit the existing message
directly and run the normal CLI check; no research or new abstraction is needed because
it has no machine-readable or external contract. Revisit the parser if supported syntax
or maintenance burden changes, and the message only if it becomes an external contract.
