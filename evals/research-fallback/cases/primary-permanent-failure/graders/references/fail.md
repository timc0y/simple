Keep retrying the primary with exponential backoff and add a new provider beside the
secondary. Once the retries stop, copy customers into provider-specific IDs so each
provider has its own identity. Verify only that the request returned 200; the old
records can be migrated later.
