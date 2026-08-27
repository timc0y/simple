Make the existing shared mutation gateway own the whole safety interval:

```text
acquire or recover mutation lock
check durable uncertainty receipt
perform remote mutation
if outcome is unknown: durably record receipt
release lock
```

The composition root must no longer check or record receipts. A receipt check outside the lock is inherently stale; receipt creation after unlock leaves the observed hole.

Recovery belongs in the same gateway too. If it finds a dead holder, it must first durably create an uncertainty receipt, then make the lock available. It must never admit a new mutation during that conversion.

The required failure rule is fail closed:

```text
remote outcome unknown
→ attempt receipt write
→ receipt write fails
→ retain the lock and return/report the persistence failure
```

If that process later dies, the next gateway invocation treats the dead holder conservatively and converts it to a receipt before permitting anything else. This relies on the lock’s durable holder metadata being sufficient to identify that an interrupted mutation may have happened.

The invariant is therefore: the gateway does not release—or replace a dead holder’s—lock until it has either established a known outcome or durably blocked future mutations with a receipt.

Prove it independently through the CLI’s public surface with real competing processes and forced termination at each transition: after lock acquisition, during/after the remote request, before receipt persistence, after receipt persistence, and during dead-holder recovery. In every run, start a second mutation process and assert it never reaches the remote mutation while an earlier effect can be unknown; if receipt persistence is injected to fail, assert the lock remains blocking and recovery creates the receipt before admission.
