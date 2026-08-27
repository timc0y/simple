The report becomes `ready` when its PDF is stored and can be downloaded. The email is a separate next step.

1. API creates the report as `processing`.
2. Worker renders and stores the PDF.
3. Worker sets the report to `ready`.
4. UI polls the report and shows it as ready.
5. Worker requests the email notification.

Because the UI only checks whether the PDF is available, it can say “ready” before the email arrives. If sending the email fails, that retry happens separately and does not move the report back from `ready`.

```js
// The PDF is stored and downloadable; email delivery is handled separately.
report.status = "ready";
```
