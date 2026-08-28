# Simple

## Reality

- Stage and users: One operator uses one local CLI.
- External consumers: None.
- Persistent production data: None.
- Compatibility commitments: The help text is not machine-consumed.

## Preserve

- The command and its existing help check.

## Current boundary

- One source literal says `recieve`; the expected help fixture repeats the typo.

## Ordinary paths

- The command renders that literal and one test compares the help output.

## Proof

- Run the existing help-output test.

## Reconsider when

- None for this correction.
