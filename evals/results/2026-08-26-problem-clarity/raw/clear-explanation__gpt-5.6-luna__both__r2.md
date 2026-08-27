## Why the UI can say a report is ready before its email arrives

The worker handles the PDF and email as separate steps:

```text
API creates report: processing
        ↓
Worker renders and stores PDF
        ↓
Worker changes report: ready
        ↓
UI polls report and enables download
        ↓
Worker requests email notification
```

`ready` means the PDF is stored and downloadable. It does not mean the email was delivered. Email failures are retried separately and do not change the report status.

```js
// Mark ready once the PDF is stored; email delivery is a separate retryable path.
report.status = "ready";
```
