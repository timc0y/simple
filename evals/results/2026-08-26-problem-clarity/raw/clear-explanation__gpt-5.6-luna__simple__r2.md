A report can be `ready` before its email arrives because `ready` means the PDF is stored and downloadable. It does not mean the notification was delivered.

Sequence:

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI sees `ready` while polling and enables the download.
5. The worker requests the email notification.

Email delivery is a separate path. If it fails, the email is retried independently; the report remains `ready` because its PDF is still available.

```js
// Mark ready after storing the PDF because download availability is independent of email delivery.
report.status = "ready";
```
