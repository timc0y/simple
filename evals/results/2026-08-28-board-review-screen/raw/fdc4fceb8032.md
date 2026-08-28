A large board is not useful; this is routine deprecation cleanup, not a compatibility migration.

Decision: delete the `account_name` serializer. The deprecation period ended, telemetry shows no old-field reads or writes, no supported release sends it, and production settings contain only `display_name`. Rollback support also remains available.

Proof: run the current binary against representative upgraded settings and verify that settings containing `account_name` are rejected, while valid `display_name` settings continue to work.
