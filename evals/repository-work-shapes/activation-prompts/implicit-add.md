Add a daily customer import to this application.

The current deployment has small load. Its existing in-process runner owns scheduling
and transient-failure retries. There is no separate worker system. Preserve the
runner's scheduling and retry behaviour. Prove scheduling, execution, retry, and
idempotency through the runner. Reconsider another execution system only when measured
load or isolation requirements exceed the runner's capability.

Return the implementation decision and proof. Do not write code.

