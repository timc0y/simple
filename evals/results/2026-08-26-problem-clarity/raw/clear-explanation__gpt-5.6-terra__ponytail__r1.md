The PDF and the email are separate steps:

1. The API creates the report as `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report to `ready`.
4. The UI sees `ready` and lets the user download the PDF.
5. The worker requests the email notification.

So the UI can say “ready” before the email arrives because `ready` means the PDF is available, not that notification delivery succeeded.

If sending the email fails, it is retried separately. The report stays `ready` because the downloadable PDF is still ready.

```js
// Mark ready once the PDF is stored; email delivery is retried separately.
report.status = "ready";
```
