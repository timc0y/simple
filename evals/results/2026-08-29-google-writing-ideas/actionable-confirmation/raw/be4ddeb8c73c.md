- “Keeps retrying until the service recovers” is incorrect: `sync` makes at most three requests total (one initial attempt and two retries).

- “Users do not need to intervene” is misleading. After the third failed request, `sync` exits and the user must choose whether to run it again.

- Document the failure contract: exit status `23` means the remote service remained unavailable.

- State that retry count is fixed and cannot be configured.

- Remove the generic reliability and distributed-systems framing; lead with the retry limit and what to do after failure.
