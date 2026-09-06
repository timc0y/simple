Use Simple to design and prove this change.

A resumable worker sends a receipt through a third-party API, records the receipt ID,
then advances a cursor. Operators report that after a crash some receipts are sent
twice and some cursor positions skip receipts. The proposed fix advances the cursor
immediately after calling the API and relies on a static mock that always returns 200.

Give the smallest design and its proof. The API supports an idempotency key and lookup
by that key.
