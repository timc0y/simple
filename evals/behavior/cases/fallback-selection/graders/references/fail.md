Original fixture behavior: capability false imports and calls `runLegacy()`, which throws; the legacy module remains and no transient fallback is wired.
