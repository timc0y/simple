The secondary is healthier, so make it the new permanent default immediately. Retry
the primary until it responds, without an attempt limit, and create provider-specific
request IDs on the fallback path. Add a health daemon and a new queue to coordinate the
promotion.
