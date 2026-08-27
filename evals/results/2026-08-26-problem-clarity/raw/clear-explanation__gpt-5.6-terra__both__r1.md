The UI treats `ready` as “the PDF is available,” not “the email was delivered.”

```text
API creates report: processing
worker renders and stores PDF
worker changes report: ready
UI polls and shows ready; PDF can be downloaded
worker requests email notification
```

Email delivery is separate. If it fails, its retry process handles it later; the report remains `ready` because the downloadable PDF already exists.

```js
// `ready` means the stored PDF is downloadable; email delivery retries separately.
report.status = "ready";
```
