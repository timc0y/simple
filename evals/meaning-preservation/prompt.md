Use Simple. This is a written scenario, not a live workflow. Do not run commands or
change files.

A developer asks:

> Explain this more simply. Keep what I need to know before changing it.

The source explanation is:

> `load_children` fetches the child records in one database request for the current
> parent. It stores that result only for this call; the next call fetches again.
> Records with `visible = false` are omitted. An empty result means there are no
> visible children. A failed database request returns an error, not an empty result.
> This has been checked in a local fixture. Production behaviour has not been checked.

Reply in plain Markdown. The developer knows the terms in the source explanation.
