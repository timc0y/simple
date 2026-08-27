The report and email use separate steps:

1. The API creates the report with status `processing`.
2. A worker creates and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI sees `ready` when it polls the report, so it enables the download.
5. The worker then requests the email notification.

The email may arrive later because it is handled separately. If sending fails, only the email is retried; the report stays `ready` because the PDF is already available.

```js
// Mark the report ready once its PDF is stored and downloadable.
report.status = "ready";
```
