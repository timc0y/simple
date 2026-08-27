Do not split recovery or receipt handling into separate services. The mutation gateway must retain the lock across acquisition, dead-holder recovery, receipt validation, uncertainty recording, and release; dividing those steps would break the safety interval.

If the lint limit is mandatory, extract only private gateway helpers that run under the gateway’s already-held lock and return explicit outcomes. Keep durable uncertainty recording fail-closed and leave the resource blocked if recording fails. Otherwise, retain the method and justify a scoped complexity exception: its branches correspond to required safety states, not incidental control flow.

Prove the change with competing processes while forcing termination during recovery and receipt handling, plus injected receipt-record failures. Verify that no second mutation proceeds until recovery completes and that a failed uncertainty record continues to block the resource.
