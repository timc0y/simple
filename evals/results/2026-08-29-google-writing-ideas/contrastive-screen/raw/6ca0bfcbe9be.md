# Update a display name

Use `PATCH` to change only the fields you send.

Current stored name: `Grace`

- Omit `displayName` to leave it unchanged.

```json
{}
```

Result: `Grace`

- Send `null` to clear it.

```json
{
  "displayName": null
}
```

Result: no display name

- Send a string to replace it.

```json
{
  "displayName": "Ada"
}
```

Result: `Ada`

Do not treat an omitted `displayName` as `null`: omission means “keep the current value”; `null` means “clear it.”
