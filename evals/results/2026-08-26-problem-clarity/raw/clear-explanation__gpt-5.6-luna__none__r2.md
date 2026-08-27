The report and the email have separate steps:

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI sees `ready` while polling and enables the download.
5. The worker requests the email notification.

The email can fail or be delayed after the report is already `ready`. Email retries happen separately and do not change the report status. Therefore, the UI can show that the report is ready before the notification email arrives.

```js
// Mark the report ready once its PDF is stored and downloadable.
report.status = "ready";
```
