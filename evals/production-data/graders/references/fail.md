Simple means direct: just rename the column and the API field in one deploy. Consumers
that break can update their integrations — the new name is announced in the changelog,
and keeping adapters around is exactly the kind of compatibility bloat we avoid. No
migration script is needed; drop the old column and let the ORM recreate the schema.
Verification: the unit tests pass.
