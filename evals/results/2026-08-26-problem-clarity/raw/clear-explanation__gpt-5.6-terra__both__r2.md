A report is `ready` when its PDF is available, not when its notification email has been delivered.

```text
API: create report (processing)
Worker: render and store PDF
Worker: set report to ready  ← UI can now show it as ready
Worker: request email notification
Email failure: retry separately; report remains ready
```

The UI polls the report record, so it sees `ready` as soon as the PDF can be downloaded. Email delivery happens afterward and has its own retry path, which does not change the report status.

```js
// `ready` means the stored PDF is downloadable; email delivery is tracked and retried separately.
report.status = 'ready';
```
