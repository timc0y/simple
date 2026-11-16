## Cleanup and legal holds

The cleanup job removes stored exports 72 hours after creation, except exports on
legal hold. A held export remains available until the hold is released; age beyond
72 hours alone does not make it expired. [S1]

## Readiness and email

An export is ready when its download is stored. A pending or failed email does not
change that state or remove the available download. [S2]

The policy's exact wording is: "Ready means the download is stored, not that email
was delivered." [S2]

```js
if (stored) state = "ready";
```
