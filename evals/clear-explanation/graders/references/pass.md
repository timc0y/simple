`ready` means the PDF is stored and available to download. It does not mean the email
has been delivered.

```text
API creates `processing`
  -> worker renders and stores PDF
  -> report becomes `ready` -> UI offers the download
                          \-> email requested -> retried separately if it fails
```

The report and the notification have different completion conditions. An email failure
therefore delays the email but does not make an available PDF unavailable.

```js
// Readiness tracks PDF availability; notification delivery is retried separately.
report.status = "ready";
```
