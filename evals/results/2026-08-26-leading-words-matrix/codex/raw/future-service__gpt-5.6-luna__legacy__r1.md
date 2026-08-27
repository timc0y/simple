Implemented the report service and queue abstraction.

- Added injected `ReportService` for generation and persistence.
- Added thread-safe FIFO `InMemoryReportQueue`.
- Exported the public API from `reports`.
- Added tests covering persistence, FIFO ordering, and shared service usage.

Verification: `python3 -m unittest discover -v` — 2 tests passed.

Files: [reports/service.py](/tmp/simple-leading-words-codex-matrix-20260826/run/future-service__gpt-5.6-luna__legacy__r1/reports/service.py), [reports/queue.py](/tmp/simple-leading-words-codex-matrix-20260826/run/future-service__gpt-5.6-luna__legacy__r1/reports/queue.py), [tests/test_reports.py](/tmp/simple-leading-words-codex-matrix-20260826/run/future-service__gpt-5.6-luna__legacy__r1/tests/test_reports.py)
