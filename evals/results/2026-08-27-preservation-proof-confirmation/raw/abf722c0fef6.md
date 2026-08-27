Use the existing migration mechanism to rename the stored field once, preserving every customer value.

At the API boundary, keep one temporary compatibility adapter for 90 days:

1. Make the renamed stored field the sole canonical model field.
2. Map the old public field name to the canonical field for old-client requests and responses.
3. Map the new public field name for new-client requests and responses.
4. Reject requests that provide both names with conflicting values.
5. Record old-representation traffic and set removal for the later of 90 days and zero old-client traffic.

The API needs an existing way to distinguish old from new clients—such as its current API version or media-type mechanism. That fact is not provided; without it, returning different single-field representations safely is unresolved. Do not add dual storage or permanent dual writes.

Prove the change by checking migrated records retain their values, both client representations round-trip correctly, migration rollback restores the prior schema safely, and removal criteria are met before deleting the adapter.
