Read context.md.

# Decision prompt

Write `decision.md` containing a plan for the smallest safe design that satisfies the stated 90-day overlap.

Describe the ownership and synchronization path for `legacy_enrollment_key` and `scanner_key`, how direct writes from both consumers remain consistent in one transaction, how conflicts and uniqueness are handled, and what happens after the appliance retires. Include focused verification and identify any genuinely unnecessary work.

This is a plan-only exercise. Do not implement code, edit the database, or add files outside `decision.md`.
