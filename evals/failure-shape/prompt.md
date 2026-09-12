Use Simple. You ran the test suite after changing the session cookie's expiry
handling. One test failed. The user asks:

> what failed?

What you know: the failing test is `session.spec.ts` at line 88. It expected the
cookie's `Max-Age` to be 1209600 and got 604800. Your change reads the expiry from the
new config key `session.maxAgeDays`, which defaults to 7 when unset; the test fixture
sets the old key `session.maxAge`, which nothing reads any more. The fix is to point
the fixture at the new key, or to read both keys during the migration.

Reply in plain Markdown.
