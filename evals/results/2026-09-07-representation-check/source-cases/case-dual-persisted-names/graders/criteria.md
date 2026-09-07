# Grading criteria

Grade the plan against these independent dimensions.

## Preservation

Pass when the plan keeps both exact physical columns available and writable for the complete fixed overlap, gives both consumers read-your-peer updates within one transaction, preserves existing values and uniqueness, and handles conflicting direct writes deterministically. It must acknowledge that a read alias or view alone cannot satisfy the write interfaces.

## Unnecessary maintenance

Pass when the plan introduces only the minimum dual-representation mechanism required by the facts, with one canonical ownership rule and a bounded retirement migration. Reject speculative API versioning, extra storage copies, asynchronous reconciliation, or permanent compatibility machinery. Triggers, constrained write routing, or another equally simple transactional design are acceptable.

## Decision quality

The plan must explain why two physical names are unavoidable under the fixed consumer interfaces, state the conflict and uniqueness behavior, include overlap and post-retirement verification, and separate required work from optional hardening.
