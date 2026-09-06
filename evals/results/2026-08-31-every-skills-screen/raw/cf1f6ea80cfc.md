## Outcome

Persist the tool’s settings through the existing JSON-file functions. Leave the unrelated cache database helper unchanged.

## Plan

1. Identify the settings values changed by CLI commands and the commands that need them on startup.

2. Load settings once through `loadSettings()` at the normal command-entry path, preserving the function’s existing defaults and missing-file behaviour.

3. After a command successfully validates and changes a setting, save the updated settings through `saveSettings()`. Do not add a second persistence path.

4. Add focused tests for loading defaults when no settings file exists and for saving then loading a changed setting. Run the CLI path that changes a setting and confirm it remains changed in a new process.

## Preserved behaviour and limits

- JSON remains the sole settings store.
- Concurrent writers remain unsupported, matching the one-user, one-process decision.
- The cache database helper remains owned by the cache and is not reused.

Reconsider the storage choice only if concurrent processes or multi-user access becomes a requirement.
