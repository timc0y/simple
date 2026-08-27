The smallest change is to make the existing mutation gateway own the entire safety interval:

```text
gateway:
  acquire mutation lock
  while holding it:
    convert any dead holder into an uncertainty receipt
    reject if an outstanding receipt exists
    perform remote mutation
    record uncertainty if the result is unknown
  release mutation lock
```

The composition root should only invoke this boundary. Features must not perform independent receipt checks.

The critical rule is fail closed: if recording uncertainty fails, do not release the lock as a successful/ordinary completion. Preserve a durable blocked or stale-lock state so that the next lock acquisition converts it to a receipt before allowing another mutation. If the process dies, lock recovery must perform that conversion while still owning the lock, before granting it to a new mutator.

The independent proof is a black-box multi-process test using the real lock and receipt store:

- kill a process after the remote mutation but before uncertainty recording;
- start a second process;
- assert the second process records the uncertainty receipt or refuses to mutate, and the remote mutation is called only once;
- separately force receipt recording to fail and assert no subsequent process can mutate until recovery produces the receipt.

This proves the boundary rather than merely proving that callers remembered to check.
