# Simple

## Reality

- Stage and users: One installation may launch sequential or competing CLI processes.
- Persistent production data: Remote mutations and local uncertainty receipts outlive a command.
- Compatibility commitments: Preserve the command surface and safe reads.
- Scale and failure consequences: A gap in the safety interval can duplicate a remote mutation.

## Preserve

- At most one active mutation.
- No new mutation while any prior effect is unknown.

## Current boundary

- The lock owner does not own receipt conversion, checking, or recording.
- The invariant spans all four operations.

## Ordinary paths

- One shared mutation boundary is used by every mutating command.

## Proof

- Exercise real competing processes and forced termination at every boundary transition.

## Reconsider when

- Split the interval only if one transactional substrate atomically owns lock and uncertainty state.
