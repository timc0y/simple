`ready` means the PDF is stored and downloadable. It does not mean the email has arrived.

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI polls the report and shows it as ready.
5. The worker then requests the email notification.

Email delivery is a separate path. If it fails, it is retried independently and does not change the report status. The UI can therefore show `ready` while the email is still pending or has failed.

```js
// Mark the report ready once its PDF is stored; email delivery is separate.
report.status = "ready";
```
