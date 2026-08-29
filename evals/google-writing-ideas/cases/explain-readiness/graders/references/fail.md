The worker stores the export, marks it ready, and then sends an email. If email fails,
it retries. These are asynchronous operations, so maintainers should be careful when
changing state transitions.
