# Simple profile

## Reality

- Users and operators: Tim maintains and uses the method through Codex and Claude Code; other people may install the public skill.
- External consumers: skill and plugin installers only.
- Public contracts: `SKILL.md`, its referenced files, both plugin manifests and the `simple.mjs` CLI.
- Persistent production data: none.
- Compatibility: preserve documented skill paths and CLI commands after publication; before publication, replace freely.
- Scale and failure consequences: local instruction files; refuse unsupported profiles rather than inventing deletion permission.

## Architecture boundary

This repository is one portable decision skill, repository-profile format, checker and thin Codex hook. It is not a general lint framework, dependency scanner, language parser or source of repository-specific facts.

## Deletion proof

- Skill behaviour: `npm test`
- Profile integrity: `node skills/simple/scripts/simple.mjs check`
- Skill structure: the installed skill validator
- Plugin structure: the installed plugin validator
- Public surface: inspect `SKILL.md`, references, manifest and README together before release
