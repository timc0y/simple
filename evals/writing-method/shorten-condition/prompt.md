Shorten this operator note to at most 45 words. Preserve everything the operator
needs to decide whether to retry. Return only the rewritten note.

The operator may retry a timed-out import only if the destination confirms that it
stored no rows. A timeout by itself does not establish whether rows were stored. If
the destination's result is unknown, wait for reconciliation rather than retrying.
Retrying after rows were stored can create duplicates. This distinction is the
important point that the operator should keep in mind when making a retry decision.
