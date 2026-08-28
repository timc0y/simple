# Invoice worker

`src/run-job.ts` owns invoice-job execution. It accepts one invoice job, writes the
result through `InvoiceStore`, and retries transient provider failures once.

Run `npm test` and `npm run build` before release.
