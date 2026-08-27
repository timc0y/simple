Do not split recovery or receipt handling into separate services. They are part of the mutation gateway’s single locked safety interval.

Reduce complexity by extracting private gateway helpers that run only while the gateway holds the lock, such as `recoverDeadHolder()` and `validateAndRecordReceipt()`. Keep lock acquisition, uncertainty recording, and release under the gateway’s control; a failed uncertainty record must leave the resource blocked.

Prove it with independent failure tests:

- Competing processes cannot mutate the same resource.
- Forced termination is recovered safely before a later mutation proceeds.
- Receipt rejection prevents mutation.
- Injected receipt-record failure leaves the resource blocked.
- Lock release occurs only after the required recovery and receipt work completes.
