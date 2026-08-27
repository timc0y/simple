Move the receipt lifecycle into the existing mutation gateway. Do not add a coordinator.

The gateway’s single mutation boundary must own:

```text
recover dead holder → check receipt → acquire/admit → remote mutation
→ durably record uncertainty if outcome is unknown → release lock
```

A lock may be released only when the mutation’s outcome is known, or a durable uncertainty receipt has been written. If receipt recording fails, keep the lock held and return a hard failure; on process death, recovery must create the receipt before clearing/replacing that dead lock. A contender must not be admitted during that conversion.

This closes both gaps:

- No process can observe “unlocked, but unknown outcome not yet recorded.”
- A dead holder is converted to uncertainty as part of admission/recovery, before another mutation can begin.

Every mutating command should call that one gateway boundary; reads remain unaffected. Splitting the ownership is only safe if lock and receipt state share a transactional store that can atomically transfer between them.

Prove it with an independent, multi-process integration test using the real lock/receipt storage and a controllable remote mutation:

1. Have process A complete a remotely applied mutation whose response is made unknown; crash/fault it immediately before receipt persistence.
2. Start process B concurrently.
3. Assert B cannot invoke the remote mutation; recovery leaves an uncertainty receipt and requires resolution.
4. Repeat with a dead lock holder and two competing starters; assert exactly one recovery path creates the receipt and neither starts a new mutation.
5. Inject receipt-write failure and assert the lock is retained (or, after forced death, is converted to a receipt) before any later mutation is admitted.
