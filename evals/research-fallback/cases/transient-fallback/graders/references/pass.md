Use the router's existing transient classification and bounded retry budget. During
the incident, try the primary only within that budget, then use the integrated
secondary for requests that can safely fall back. Keep the primary as the configured
default and restore it after its health signal recovers; one short incident does not
justify a permanent promotion. Carry the same provider-neutral request ID through
either route. Test timeout, bounded attempts, successful secondary handling, recovery
to primary, and repeated requests with unchanged IDs.
