Keep the worker as owner. Give each receipt a stable idempotency key. On retry, look up
that key, record the confirmed receipt ID durably, and only then advance the cursor.
Exercise crashes after send and after record through the worker's public run/resume
surface with a stateful API fake. Confirm one external receipt and eventual cursor
advance. A static 200 mock cannot prove recovery; live-provider behavior remains
unknown unless separately checked.
