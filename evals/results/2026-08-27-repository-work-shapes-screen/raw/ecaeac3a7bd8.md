Design the daily customer import as one existing runner job:

1. Schedule it once daily using the current scheduler.
2. Fetch the customer file/API data.
3. Validate each record at the import boundary.
4. Upsert customers using the source’s stable customer ID as the unique key.
5. Record the import run and result.
6. Retry transient failures through the existing runner.

Keep it in-process; no separate worker system is needed. Make the upsert idempotent so retries safely update existing customers rather than create duplicates. Verify scheduling, execution, retry behaviour, and repeated-import idempotency through the runner.

Reconsider this design only when measured load or isolation needs exceed the runner’s capability.
