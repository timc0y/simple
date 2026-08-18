# Simple

`$simple` is an agent skill for deleting software complexity that observed reality
does not require. A small `SIMPLE.md` in each repository records its real users,
contracts, state, proof commands and hard-won precedents.

The Codex and Claude Code plugins include the skill and optional hooks.

For local development in Codex and Claude Code:

```sh
npm run install:local
```

## Repository setup

Run the bundled setup script from the target repository, then replace its deliberately
minimal profile with observed facts:

```sh
node /path/to/simple/skills/simple/scripts/simple.mjs setup
```

Validate it with:

```sh
node /path/to/simple/skills/simple/scripts/simple.mjs check
```

Analysis tools such as Knip belong to the target repository. The skill explains how to
use them as evidence without treating an unused-code report as proof of safe deletion.
