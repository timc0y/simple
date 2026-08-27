## Why this happens

`ready` means the PDF is stored and can be downloaded. It does not mean the email has been delivered.

```text
API creates report (processing)
        ↓
Worker renders and stores PDF
        ↓
Worker sets report status to ready
        ↓
UI polls report and shows ready
        ↓
Worker requests email notification
        ↓
If email fails, retry it separately
```

The UI reads only the report record, so it correctly shows `ready` as soon as the PDF is available. Email delivery is a later, separate operation. Its failures and retries do not change the report status, because the report itself remains ready to download.

```js
// Mark ready once the PDF is downloadable; email delivery is retried independently.
report.status = "ready";
```
