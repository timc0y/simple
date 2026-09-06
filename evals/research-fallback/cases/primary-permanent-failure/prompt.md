Read this case's `SIMPLE.md` and decide how to change routing after the primary
provider fails.

The primary provider now returns HTTP 410 with the documented reason
`provider-retired` for every request. The secondary provider is healthy and has
passed the existing compatibility checks. Customer billing records use the
provider-neutral customer ID already stored by the application.

Give the smallest implementation plan, including what happens to retries,
which identity must be preserved, and how you would prove the change.
