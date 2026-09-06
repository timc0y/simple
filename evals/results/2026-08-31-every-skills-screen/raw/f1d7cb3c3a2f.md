Use one durable receipt record per cursor position, keyed by a deterministic API idempotency key.

For cursor position `n`:

1. Derive `key = receipt:<work-id>:<n>`.
2. If a durable record for `n` already contains the receipt ID, advance only from `n` to `n + 1`.
3. Otherwise call the API with `key`.
   - On a timeout or lost response, look up by `key`; if absent, retry the call with the same key.
4. Durably store the returned receipt ID for `n`.
5. Advance the cursor only when the stored record for its current position exists. Prefer one database transaction that records the receipt ID and conditionally advances that exact cursor position.

The invariant is: the cursor represents a contiguous prefix of positions with durable receipt IDs. No path may advance it based merely on an API attempt or a `200`.

A crash is then recoverable:

| Crash point | Restart action | Result |
|---|---|---|
| Before API call | send with key | one receipt effect |
| API accepted, before response/record | lookup or retry with same key | same receipt ID |
| Receipt ID stored, before cursor advance | advance only | no resend |
| Cursor advanced | process next position | prior receipt is recorded |

The static always-`200` mock is not proof: it cannot reveal a duplicate external effect or distinguish a lost response from a completed request. Replace it with a stateful fake API that persists effects by idempotency key, returns the same receipt ID for repeated keys, supports lookup, and records every request.

Prove the change by injecting a crash and restart at every boundary above, including an ambiguous API response. After each run, assert:

- exactly one external receipt effect exists per cursor position;
- duplicate calls use the same idempotency key and yield the same receipt ID;
- every position below the cursor has a durable receipt ID;
- no position at or above the cursor is treated as complete without one.

This preserves the existing worker and cursor as owners, adds only the missing durable confirmation between the external effect and progress, and makes retries safe.
