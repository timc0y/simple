#!/bin/zsh
set -eu

repo=${0:A:h:h:h:h}
record=${0:A:h}
runner=$repo/evals/repository-work-shapes/run.sh
candidate=$record/candidate.diff
scratch=/tmp/simple-repository-work-shapes

run_batch() {
  local name=$1 cases=$2 runs=$3
  CASES=$cases \
  CONDITIONS='none ponytail simple simple-ponytail candidate candidate-ponytail' \
  CANDIDATE_PATCH=$candidate \
  CANDIDATE_MARKER='Use one implementation ladder' \
  RUNS=$runs \
  MAX_JOBS=1 \
    "$runner" measure

  rm -rf "$record/$name"
  mkdir -p "$record/$name"
  cp -R "$scratch"/. "$record/$name"/
  rm -rf "$record/$name/workspaces"
}

case ${1:-measure} in
  selftest)
    CASES='mutation-interval production-data' \
    CONDITIONS='none ponytail simple simple-ponytail candidate candidate-ponytail' \
    CANDIDATE_PATCH=$candidate \
    CANDIDATE_MARKER='Use one implementation ladder' \
      "$runner" selftest
    ;;
  measure)
    "$0" selftest
    run_batch mutation 'mutation-interval' 1
    run_batch controls 'production-data' 1
    ;;
  *)
    print 'usage: run.sh [selftest|measure]' >&2
    exit 2
    ;;
esac
