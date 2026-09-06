Use Simple to plan this change.

We need to persist a small command-line tool's settings. Earlier in this session I
compared SQLite with one JSON file, accepted that concurrent writers are unsupported,
and chose the JSON file because one local user runs one process. The repository already
has `loadSettings()` and `saveSettings()` functions for that file. A database helper is
also present for an unrelated cache.

Write a short implementation plan. Do not implement it.
