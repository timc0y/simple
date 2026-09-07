# Context

The Access Ledger service stores device enrollment records in one PostgreSQL table, `enrollments`.

- The logical value is a device's enrollment key.
- A shipped on-premise appliance (version 4) directly reads and writes the exact column `legacy_enrollment_key` using SQL. Its software cannot be upgraded during this exercise.
- A newly contracted fraud scanner directly reads and writes the exact column `scanner_key`. Its protocol and SQL are fixed for a 90-day migration overlap and cannot be changed.
- Both consumers operate on the same rows and can write independently. Each committed write must leave both representations consistent; the other consumer's next read must see it under normal read-committed isolation. Synchronization must occur within the writer's transaction. A view or a read-only alias is rejected by both consumers because they issue `INSERT ... ON CONFLICT` and `UPDATE` against their exact physical column names.
- The Access Ledger application owns the database and may change the table, triggers, and its write path. It can define one canonical value and must reject a write when the two physical values conflict.
- Before this release, only `legacy_enrollment_key` existed and contains the authoritative values. During the fixed 90-day overlap, both physical column names must remain readable and writable. After the overlap, the appliance is retired and a separate migration may remove the legacy representation.
- The table has a unique constraint on the enrollment key. Existing rows and uniqueness behavior must remain correct. There is no acceptable consumer outage or asynchronous repair window.

The decision concerns how to represent the same logical value across this unavoidable overlap. Do not assume either consumer can accept a renamed column or a compatibility view.
