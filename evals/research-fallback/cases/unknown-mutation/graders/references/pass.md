Write one durable unresolved-mutation marker before the request leaves the existing
mutation entry point. It records the operation, target, and enough readback context to
inspect the result. Every new mutation checks the marker and refuses while it exists;
reads remain available. Do not retry because the remote API cannot prove whether the
rename landed. The trusted operator performs the readback and explicitly clears the
marker only after resolving the outcome. Corrupt or unreadable state also refuses
mutations and requires explicit inspection/clearing. Test kill-after-dispatch,
restart/refusal, safe reads, explicit resolution, and malformed state.
