The UI can say a report is ready before its email arrives because they are separate steps:

1. The API creates the report with status `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report status to `ready`.
4. The UI sees `ready` and enables the download.
5. The worker requests the email notification.

If the email fails, it is retried separately. That failure does not change the report status, so the report can remain `ready` while the email is still pending or has failed.

```python
# The PDF is stored, so the UI can offer the download before email delivery completes.
report.status = "ready"
```
