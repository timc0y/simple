# Finch upload service

Finch accepts diagnostic JSON from one internal desktop client. The client sends a
request ID and retries a timed-out upload once. The public privacy promise says raw
diagnostic payloads are deleted immediately after validation.

The release guide says production identity is verified by `scripts/verify-deploy.mjs`.
