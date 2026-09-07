# Context

The Returns service is a TypeScript application backed by PostgreSQL.

- The public `POST /v1/returns` and `GET /v1/returns/:id` JSON contract uses the field `reason_code`.
- Existing rows are stored in `returns.reason_code`. A reporting job owned by another team reads that column directly every night.
- Inside the application, the domain team wants to rename its property from `reasonCode` to `returnReason` because that name is clearer in new code.
- The HTTP adapter and repository are both owned by this team and may be edited. The reporting job and its SQL are outside the change.
- Existing clients must continue sending and receiving `reason_code`; there is no API version bump or deprecation window.
- There is no data backfill or change in meaning. The column is nullable today and remains nullable.
- The release must be one deploy, with ordinary rolling instances that may run old and new application code together for a few minutes.

The decision concerns representation boundaries and compatibility work. No performance problem or schema cleanup is part of the request.
