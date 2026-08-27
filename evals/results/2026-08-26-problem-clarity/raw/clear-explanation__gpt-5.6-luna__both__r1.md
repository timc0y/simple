The UI can say a report is ready before its email arrives because `ready` means the PDF is stored and downloadable—not that notification delivery succeeded.

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the status to `ready`.
4. The UI polls the report and sees `ready`, so it enables the download.
5. The worker requests the email separately.

If email delivery fails, only the email request is retried. The report remains `ready` because its PDF is still available.

```js
// Mark ready once the PDF is stored; email delivery is a separate retried operation.
report.status = "ready";
```
