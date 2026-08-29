Omission means “leave unchanged”; `null` means “clear.” They are not equivalent.

Starting with `Grace`, this request keeps the stored name because `displayName` is
absent:

```json
{"timezone":"UTC"}
```

This nearly identical request clears the name because the field is present with a
`null` value:

```json
{"timezone":"UTC","displayName":null}
```

To replace the name, send `{"displayName":"Ada"}`; the stored value becomes `Ada`.
