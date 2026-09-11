Two of three done and green.

- Rate limit on the intelligence run endpoint: done, with a test.
- API secrets in the required list: done; the release preflight now checks them.

Remaining: item 3, purging expired session-registry rows in the hourly maintenance
step. It's about twenty lines plus a test and nothing blocks it.

Want me to go ahead with item 3 now, or would you rather review 1 and 2 first?
