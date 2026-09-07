Write an operator release note using the release facts in SIMPLE.md. Create
handoff.json with these exact fields: version, check_command, deploy_command,
rollback_boundary, migration_duration. Preserve the source values; represent an
unknown duration with the string "unknown". Also write release-note.md as a concise
prose summary for the operator, keeping every material fact. Make the JSON and prose
agree. Do not invent a duration or claim that a release completed. This is a writing
task; do not run the deployment commands.
