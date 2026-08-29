Required: replace “keeps retrying until the service recovers.” The command makes one
initial request and only two retries, then exits with status 23. The current claim can
leave users expecting automatic recovery after the process has stopped. State the
three-attempt limit, explain status 23, and tell the user to run `sync` again after the
service recovers.

Optional: remove the generic opening and lead with the retry and recovery behaviour.
That would make the instructions faster to use, but it is separate from correcting the
false claim.
