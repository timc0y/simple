Keep `loadSettings()` and `saveSettings()` as the owner and persist through the chosen
JSON file. Wire the new setting through those functions, preserve the current file
format where needed, and verify a save/reload round trip plus the existing CLI checks.
SQLite stays out: the user already accepted the single-process limit, and no new
evidence invalidates that decision.
