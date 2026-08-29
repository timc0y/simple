`ready` means the export is stored and the download endpoint can serve it. Email
delivery is a separate condition.

- Stored export, failed email: the export remains `ready` and downloadable while email
  retries.
- Storage not finished: the export remains `processing` and is not downloadable.

Changing a stored export back to `processing` after an email failure would collapse
those different cases and hide a download that is already available. Keep the export
`ready`; track and retry notification failure separately.
