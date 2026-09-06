Return distinct lookup outcomes: absent when no account row exists, and expired when a
row exists but `expires_at` is past. The profile service owns the check; callers render
their existing different messages. Query a missing ID and an expired row using the same
clock instant and verify the outcomes remain distinct.
