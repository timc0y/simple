Observed:

- `package.json` defines a private package and the commands `npm test` and `npm run build`.
- `README.md` says `src/run-job.ts` owns invoice-job execution, uses `InvoiceStore`, and retries transient provider failures once.
- CI runs both documented commands.

The repository does not establish these facts:

- Who uses, operates, releases, or supports this worker today?
- Does a deployed service, another repository, or a published interface depend on it?
- Does it hold production data that must survive a change?
- Has anyone promised old behaviour or a supported version?
- What load does it handle, and what happens when a job fails after its retry?

I will keep the profile incomplete until you confirm these facts.
