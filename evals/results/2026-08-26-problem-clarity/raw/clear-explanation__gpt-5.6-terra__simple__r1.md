The UI’s `ready` status means the PDF is available to download. It does not mean the email has been delivered.

```text
API creates report (processing)
  -> worker renders PDF
  -> worker stores PDF
  -> worker sets report to ready
  -> UI can download PDF and shows ready
  -> worker requests email notification
       -> if email fails, it retries separately
       -> report stays ready
```

Email delivery is intentionally a separate failure path: a notification failure must not hide or revoke a report whose PDF is already stored and usable.

```js
// Mark ready once the stored PDF is usable; email delivery retries independently.
report.status = 'ready';
```
