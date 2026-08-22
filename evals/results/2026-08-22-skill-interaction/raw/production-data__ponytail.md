## Implementation

**1. DB migration (one file, in the existing migration mechanism):**
```sql
-- up
ALTER TABLE customers RENAME COLUMN old_name TO new_name;
-- down
ALTER TABLE customers RENAME COLUMN new_name TO old_name;
```
A rename, not add-column+backfill+drop — zero data copy, atomic, trivially reversible. Model attribute updated to match; nothing else in the app touches the old name.

**2. API dual-representation (serializer only, no new version/endpoint):**
```python
class CustomerSerializer:
    def to_json(self, customer):
        return {..., "new_name": customer.new_name, "old_name": customer.new_name}  # same value, two keys

    def from_json(self, data):
        customer.new_name = data.get("new_name", data.get("old_name"))  # new_name wins if both sent
```
Old clients keep reading/writing `old_name`; new clients use `new_name`; both hit the same column.

**3. Deprecation tracking:**
- Mark `old_name` deprecated in the API spec with a sunset date = ship date + 90 days.
- Log/increment an existing metrics counter whenever a request reads or writes `old_name` — this is the removal signal from SIMPLE.md's "Reconsider when."

**4. Removal (after 90 days + zero `old_name` traffic):**
Delete the `old_name` key from `to_json`/`from_json`. One-line diff, no migration needed — DB already only has `new_name`.

**5. Proof (one test file):**
```python
def test_rename_field():
    c = create_customer(new_name="x")
    assert db_row(c.id).new_name == "x"                    # stored correctly
    assert serialize(c) == {..., "new_name": "x", "old_name": "x"}  # both API reps
    assert deserialize({"old_name": "y"}).new_name == "y"   # old client write works
    assert deserialize({"new_name": "z"}).new_name == "z"   # new client write works
    run_down_migration(); run_up_migration()                # rollback round-trips
```

→ skipped: a translation/compat shim layer, versioned endpoint, or feature flag — the serializer alias covers the whole 90-day window. Add a real API version only if a second field needs the same treatment concurrently.
