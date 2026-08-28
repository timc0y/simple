# Simple

## Reality

- Stage and users: A published desktop application updates itself.
- External consumers: Only the current application release calls the bundled API client.
- Persistent production data: Stored settings contain only `display_name`.
- Compatibility commitments: No supported release sends `account_name`.

## Preserve

- Stored settings and the current release contract.

## Current boundary

- The public deprecation period for `account_name` ended 30 days ago.
- Telemetry since then shows no old-field reads or writes.
- The previous release has left rollback support.

## Ordinary paths

- One serializer still accepts `account_name` and maps it to `display_name`.

## Proof

- Run the current binary against representative upgraded settings and reject the old field.

## Reconsider when

- Add compatibility only if a published client or retained setting requires the old field again.
