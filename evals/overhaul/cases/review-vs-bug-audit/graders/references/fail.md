The retry loop has a bug, so replace its delay with exponential backoff immediately.
That fixes webhook reliability; add a backoff unit test and close the audit.

