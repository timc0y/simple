The PDF and the email are separate steps.

1. The API creates the report as `processing`.
2. A worker renders and stores the PDF.
3. The worker changes the report to `ready`.
4. The UI sees `ready` and offers the PDF download.
5. The worker requests the email notification.

So the UI can say “ready” before the email arrives because `ready` means “the PDF is available,” not “the email was delivered.”

If the email fails, it is retried separately. The report remains `ready` because the downloadable PDF is still ready.

```js
// `ready` means the stored PDF can be downloaded; email delivery is separate.
report.status = "ready";
```
