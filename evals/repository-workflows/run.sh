#!/bin/zsh
set -eu

repo=${0:A:h:h:h}
suite=$repo/evals/repository-workflows

export MODELS=${MODELS:-"claude-opus-5 claude-sonnet-5 gpt-5.6-luna"}
export CONDITIONS=${CONDITIONS:-"none simple candidate"}
export CASES=${CASES:-"agent-led-init-contract work-local-finish-boundary reconcile-unknown-obligation deep-audit-guide-first"}
export RUNS=${RUNS:-1}
export MAX_JOBS=${MAX_JOBS:-1}
export CASE_ROOT=$suite/cases
export RECORD_DIR=${RECORD_DIR:-/tmp/simple-repository-workflows}
export CURRENT_REF=HEAD
export CANDIDATE_PATCH=none
export CAPTURE_WORKTREE=true
export WRITABLE_CASES="agent-led-init-contract work-local-finish-boundary reconcile-unknown-obligation"
export MODELS_FILE=$suite/models.tsv
export EVAL_ID_SALT=repository-workflows-v1
export HARNESS_LABEL="isolated mixed-provider repository workflow evaluation with Luna and Terra grading"
export CLAUDE_MAX_COST_USD=${CLAUDE_MAX_COST_USD:-0.75}

exec "$repo/evals/repository-work-shapes/run.sh" "${1:-measure}"
