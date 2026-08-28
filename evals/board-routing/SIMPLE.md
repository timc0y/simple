# Simple

## Reality

- Stage and users: A published desktop application updates itself.
- External consumers: Current and previous application releases call the bundled API client.
- Persistent production data: User settings survive application updates and rollback.
- Compatibility commitments: The previous release remains a supported rollback target for 14 days after each release.

## Preserve

- Stored settings and the supported rollback path.

## Current boundary

- The public deprecation period for `account_name` has ended.
- Telemetry shows no current release sends `account_name`.
- The supported previous release still sends `account_name` after rollback.

## Ordinary paths

- One serializer accepts `account_name` and maps it to `display_name`.
- Releases use the existing rollback test against the previous binary.

## Proof

- Run the current and previous binaries against the same upgraded settings fixture.

## Reconsider when

- Remove the old field after the previous binary leaves rollback support or stops sending it.
