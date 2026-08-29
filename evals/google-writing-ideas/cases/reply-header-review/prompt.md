Write the final replies and resolutions for these 2 review comments. Return only the
text that belongs in the review thread.

Repository contract: authentication logs must not contain credentials. Support needs
request identifiers, failure categories, and header names to diagnose a proxy fault.

Implemented change:

- The logger removes all header values.
- It removes the names `authorization`, `cookie`, and `proxy-authorization`.
- It writes the remaining header names, request identifier, and failure category.
- A check confirms that no credential values or credential-bearing names enter logs.

Comments:

1. **Blocker:** “Do not log any headers. Header logging violates the contract.”
2. **Nit:** “`failuerCategory` is misspelled.” The spelling is now corrected.

Resolve each comment as accepted, narrowed, rejected, or deferred. Do not change the
stated repository contract.
