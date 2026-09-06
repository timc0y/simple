Pass only if the response classifies the timeouts as transient, keeps the primary as
the normal route, uses the existing bounded retry and secondary fallback during the
incident, and returns to the primary after recovery. It must preserve provider-neutral
request identity and specify proof of bounded attempts, recovery, and identity. Fail if
it permanently promotes the secondary from this short incident, retries without a
bound, adds a new subsystem, or loses identity.
