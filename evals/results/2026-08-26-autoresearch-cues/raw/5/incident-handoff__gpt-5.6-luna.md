## Incident handoff

- **Decision:** Keep the release paused.
- **Evidence:** Rollback completed, and retained production records remain readable. Verification found 14 checksum mismatches in 700 records.
- **Unknown:** The cause of the mismatches is not known.
- **Next action:** Identify and correct the cause, then rerun checksum verification for all 700 records before release.
