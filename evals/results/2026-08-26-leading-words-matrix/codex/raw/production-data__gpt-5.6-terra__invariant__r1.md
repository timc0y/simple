Rename the persisted field once, and keep compatibility only at the API boundary for 90 days.

- Use the service’s normal schema migration to rename the stored column from `<old>` to `<new>` without creating a second persisted field. Verify existing customer values survive.
- Make `<new>` the only internal model/domain name and the only field written to storage.
- Add one bounded API compatibility adapter:
  - legacy requests using `<old>` are translated to `<new>`;
  - legacy responses expose `<old>`;
  - new API representation uses `<new>`.
- Ensure request validation rejects payloads that supply both names with conflicting values.
- Remove old internal names, dual-write logic, and any temporary data-copy code after the migration.

The API needs a reliable way to select the legacy versus new response shape—normally the existing API versioning mechanism. If the service has no such discriminator, establish that before implementation; one unversioned response cannot simultaneously preserve both field names without changing one client contract.

Prove it with:

- migration test over representative retained records;
- legacy read/write API tests and new read/write API tests;
- migration rollback test, including data preservation;
- telemetry for legacy API traffic.

At day 90, remove the boundary adapter only after old-client traffic is zero; then delete the legacy API contract and its tests.
