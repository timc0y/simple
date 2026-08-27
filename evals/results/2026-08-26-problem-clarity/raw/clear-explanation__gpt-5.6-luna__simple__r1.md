The UI can say `ready` before the email arrives because the report status tracks PDF availability, not email delivery.

```text
API → report status: processing
    → worker renders and stores the PDF
    → worker sets report status: ready
    → UI poll sees ready and enables download
    → worker requests the email
```

```js
// Mark the report ready once its PDF is stored; email delivery is retried separately.
```

If the email request fails, the separate notification retry handles it. The report remains `ready` because the PDF is still available for download.
