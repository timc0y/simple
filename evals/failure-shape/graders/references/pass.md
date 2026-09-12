`session.spec.ts:88` expected `Max-Age` 1209600 (14 days), got 604800 (7 days).

Cause: the fixture sets the old key `session.maxAge`, which nothing reads now, so
the new key's default of 7 days applies.

Fix: point the fixture at `session.maxAgeDays: 14`. Reading both keys during the
migration would also pass, but it keeps the old key alive; take that only if other
environments still set it.
