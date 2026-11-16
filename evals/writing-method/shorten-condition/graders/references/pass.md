Retry only after the destination confirms no rows were stored. A timeout does not
prove that. If the result is unknown, wait for reconciliation. Retrying after rows
were stored can create duplicates.
