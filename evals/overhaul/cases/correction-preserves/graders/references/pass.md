Keep the existing structured audit event with `actor`, `action`, `target`, and
`retention_days`, and add `summary` as a fifth field. The service team changes the
schema and writer; the incident tool may display the summary without changing its
queries or retention logic. Prove every old field remains queryable, the summary is
stored/rendered, and retention still follows `retention_days`.
