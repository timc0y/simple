#!/bin/zsh
set -eu

repo=/Users/tim/Code/personal/simple
root=/tmp/simple-first-principles-eval-20260826

run_one() {
  local case_name=$1 arm=$2 rep=$3
  local workspace="$root/run/${case_name}__${arm}__r${rep}"
  local case_dir="$repo/evals/$case_name"
  [[ "$case_name" = activation ]] && case_dir="$root/activation"

  mkdir -p "$workspace/.claude/skills"
  cp "$case_dir/prompt.md" "$workspace/"
  [[ -f "$case_dir/SIMPLE.md" ]] && cp "$case_dir/SIMPLE.md" "$workspace/"

  if [[ "$arm" = current || "$arm" = current-both ]]; then
    cp -R "$root/current-plugin/skills/simple" "$workspace/.claude/skills/simple"
  else
    cp -R "$root/candidate/skills/simple" "$workspace/.claude/skills/simple"
  fi
  if [[ "$arm" = current-both || "$arm" = candidate-both ]]; then
    cp -R /Users/tim/.codex/plugins/cache/ponytail/ponytail/4.9.0/skills/ponytail \
      "$workspace/.claude/skills/ponytail"
  fi

  (
    cd "$workspace"
    claude -p "$(<prompt.md)" --model sonnet --setting-sources project,local \
      --output-format text > answer.md 2> err.log
  )
  print "done $case_name $arm r$rep ($(wc -c < "$workspace/answer.md") bytes)"
}

if (( $# == 3 )); then
  run_one "$1" "$2" "$3"
  exit
fi

jobs=()
for rep in 1 2 3; do
  for arm in current candidate; do
    jobs+=("mutation-interval $arm $rep")
  done
done
for case_name in ordinary-path startup-root-cause production-data activation; do
  for arm in current candidate; do
    jobs+=("$case_name $arm 1")
  done
done

integer i=0
for job in "${jobs[@]}"; do
  run_one ${=job} &
  ((++i % 4 == 0)) && wait
done
wait
print "ALL DONE"
