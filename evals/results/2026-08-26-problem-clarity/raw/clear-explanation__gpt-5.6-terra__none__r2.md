The UI can show **ready** before the email arrives because “ready” means the PDF is finished and downloadable.

Sequence:

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI polls the report record, sees `ready`, and enables download.
5. The worker requests the email notification.

Email delivery is a separate path. If sending fails, it is retried later, but the report stays `ready` because the PDF is already available.

```js
// Mark the report ready once its PDF is stored; email delivery is handled separately.
report.status = 'ready';
```
