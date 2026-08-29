Write a short maintainer explanation of this distinction:

- A worker stores a generated export, then sets its state to `ready`.
- After that state change, the worker requests an email notification.
- Email delivery can fail and retry independently.
- The download endpoint permits access when state is `ready`.
- A maintainer incorrectly proposes changing the state back to `processing` whenever
  email delivery fails.

Make it clear whether that proposal preserves the meaning of `ready`. Use plain
Markdown and no table.
