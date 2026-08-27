Complete this repository's `SIMPLE.md` using only the observed facts below. Remove its
incomplete marker and replace every prompt. Return the complete profile and nothing
else.

- This production service has published API clients and retained customer records.
- The API promises the old customer field name for 90 days.
- Old and new clients must both work during the transition.
- Schema changes use the existing migration runner.
- `CustomerSerializer` owns request parsing and response serialization.
- Its existing deprecation-alias facility accepts either field name, rejects conflicting
  values, and emits both names from one internal value during a bounded transition.
- Verification covers stored data, both API representations, rollback, and removal.
- Remove old-name handling only after 90 days and zero old-field traffic.
- No other users, operators, scale, failure, security, or compatibility facts are known.

