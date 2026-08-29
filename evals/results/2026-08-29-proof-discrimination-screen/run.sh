#!/bin/zsh
set -eu

repo=${0:A:h:h:h:h}

CASES='proof-tautology proof-refactor proof-interaction-contract' \
CONDITIONS='none simple candidate simple-ponytail candidate-ponytail' \
CANDIDATE_PATCH="$repo/evals/proof-discrimination-candidate.diff" \
CANDIDATE_MARKER='reject a plausible wrong behaviour' \
RUNS=1 \
MAX_JOBS=4 \
zsh "$repo/evals/repository-work-shapes/run.sh" "${1:-measure}"
