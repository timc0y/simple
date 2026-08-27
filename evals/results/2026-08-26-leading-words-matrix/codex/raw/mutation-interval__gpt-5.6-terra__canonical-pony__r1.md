Move the entire interval into the existing gateway. Its public operation becomes the only mutation boundary:

```text
gateway:
  acquire/recover exclusive lock
  convert any dead holder to a durable receipt
  check for an outstanding receipt
  perform remote mutation
  if outcome unknown, persist receipt
  release lock
```

The composition root only calls this operation. It neither checks nor records receipts.

Rules at the boundary:

- A stale lock is never made available to a new mutation until its uncertainty receipt is durably written.
- An unknown remote result never releases the lock until its receipt is durably written.
- If receipt recording fails, fail closed: retain (or keep unavailable) the lock and return a recovery-required error. A later process may only proceed after it successfully converts that dead/unavailable holder to a receipt. It must not “best-effort” release.

This uses the gateway already shared by every mutating command; no coordinator or repeated feature checks are needed.

Prove it independently with a black-box, multi-process test: use the real durable lock/receipt storage and a counting fake remote service. Kill process A (1) after the remote call but before receipt persistence, and (2) while recovery has detected a dead holder but before receipt persistence; then start process B through the CLI. Assert B makes no remote request and an outstanding receipt exists. Also inject receipt-write failure and assert the lock remains blocking and B still makes no request.
