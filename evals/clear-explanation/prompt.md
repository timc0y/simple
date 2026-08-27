Use Simple writing mode to give a new maintainer a short rundown that answers:

> Why can the UI say a report is ready before its email arrives?

Facts:

- The API creates a report record with status `processing`.
- A worker renders the PDF.
- After the PDF is stored, the worker changes the report status to `ready`.
- The worker then requests an email notification.
- A failed email is retried separately and does not change the report status.
- The UI polls the report record and shows `ready` when the PDF can be downloaded.

Make the sequence and the separate failure path easy to picture. Also write one code
comment for the status change. Use plain Markdown, no table, and no Mermaid diagram.
