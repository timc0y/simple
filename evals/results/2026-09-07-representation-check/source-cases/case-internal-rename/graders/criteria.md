# Grading criteria

## Preservation

Pass when the plan explicitly preserves the public JSON key `reason_code`, the existing `returns.reason_code` column and its values, the reporting job's direct reads, and rolling coexistence of old and new application instances. A boundary mapping or equivalent single-source approach is sufficient.

## Unnecessary maintenance

Pass when the plan avoids needless schema migration, duplicate columns, dual writes, API aliases, versioning, or a compatibility subsystem when the stated contracts do not require them. Accept any equally minimal design that preserves the facts above.

## Decision quality

The plan must distinguish the internal rename from the external and persisted names, include focused verification (HTTP contract, persistence/reporting compatibility, and old/new rolling behavior), and call out assumptions or limits without inventing a hidden requirement.
