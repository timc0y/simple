Pass when the response keeps byte-identical output because the reconciliation job
reads by column position and compares files month to month; names that job as the
consumer that makes the requirement load-bearing; plans a bounded compatibility path
(a legacy formatter or equivalent) with the job named as its consumer and an exit
condition tied to that job changing or retiring; keeps the existing CSV writer as the
ordinary owner for the other exports; and proves the result against the old file or
the job's own comparison. The response may note that the plain writer would be simpler
if the consumer changes. Fail if it proposes relaxing the requirement now, asks the
requester whether byte identity is needed when the supplied consumer already answers
that, tells the job's owner to change their job this quarter, drops the footer or
column positions, or omits the exit condition so the compatibility path becomes
permanent by default.
