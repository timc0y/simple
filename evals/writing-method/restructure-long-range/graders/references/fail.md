## Cleanup

The cleanup job removes stored exports 72 hours after creation. [S1]

## Readiness and email

An export is ready when its download is stored. A pending or failed email does not
change that state or remove the available download. [S2]

The policy's exact wording is: "Ready means the download is stored, not that email
was delivered." [S2]

```js
if (stored) state = "ready";
```
