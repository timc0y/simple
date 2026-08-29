Write a short API guide that makes this PATCH rule hard to misuse:

- Omitting `displayName` leaves the stored name unchanged.
- Sending `"displayName": null` clears the stored name.
- Sending `"displayName": "Ada"` replaces the stored name with `Ada`.
- The current stored name in the example is `Grace`.

The common production mistake is treating an omitted field and `null` as equivalent.
Use plain Markdown and no table.
