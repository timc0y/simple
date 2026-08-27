## Incident handoff

- **Decision:** Keep the release paused.
- **Evidence:** Verification found 14 checksum mismatches among 700 records. Rollback is complete, and retained production records remain readable.
- **Unknown:** The cause of the mismatches is not yet known.
- **Next action:** Identify and correct the cause, then rerun checksum verification across all 700 records before releasing.
