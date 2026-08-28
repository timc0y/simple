#!/bin/zsh
set -eu

repo=${0:A:h:h:h:h}

CASES='board-routing board-routing-closed board-no-delegation board-majority-trap board-restraint' \
CONDITIONS='none simple' \
CANDIDATE_PATCH=none \
RUNS=1 \
MAX_JOBS=4 \
zsh "$repo/evals/repository-work-shapes/run.sh" "${1:-measure}"
