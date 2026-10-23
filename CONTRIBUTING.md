# Contributing to Simple

Simple is a small, portable agent skill. Changes should improve an observed
decision, failure or workflow without adding a second method or unnecessary
host-specific copies.

## Before proposing a change

- Read [the repository guide](AGENTS.md), [project reality](SIMPLE.md) and the
  relevant [skill reference](skills/simple/SKILL.md).
- Describe the affected user action, current behavior, expected outcome and the
  smallest reproduced obstruction.
- Keep project-specific facts in the owning repository, not in the shared method.
- Avoid adding mandatory modes, services or persistent queues without evidence.

## Verify what changed

Run `npm test`, `node skills/simple/scripts/simple.mjs check` and
`git diff --check`. Use the relevant offline verifier self-tests. For claims
about agent behavior, use the matched-condition [evaluation protocol](evals/README.md)
and retain negative, invalid and inconclusive results.

A successful unit test is not a claim of model improvement; a model response is not
proof of real execution. Keep the limits of both visible.

## Public repository hygiene

This repository is public. Do **not** commit secrets, private user conversations,
personally identifying transcripts, unredacted provider responses, credentials,
machine-specific settings or `.local/` files. Redact sample logs before attaching
them to public issues. If a credential has already reached Git history, simply
deleting it in a new commit does **not** revoke or erase it: rotate it and address
history through an appropriate incident response.

The `evals/results/` material and pinned `upstream/` archives are retained
research evidence. Do not delete or rewrite them just to reduce file counts.
Document evidence corrections instead.

Repository edits do not automatically authorize a Git tag, package release,
plugin publication, external account action or deployment.
