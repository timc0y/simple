## Incident handoff

- **Decision:** Keep the release paused.
- **Evidence:** Verification found 14 checksum mismatches across 700 records. Rollback is complete, and retained production records remain readable.
- **Unknown:** The cause of the mismatches is not known.
- **Next action:** Identify and correct the cause, then rerun checksum verification for all 700 records before releasing.
