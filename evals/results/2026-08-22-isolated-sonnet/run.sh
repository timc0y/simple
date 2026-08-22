#!/bin/zsh
set -u
REPO=/Users/tim/Code/personal/simple
ROOT=/tmp/simple-eval2
run_one() {
  local case=$1 arm=$2 rep=$3
  local ws=$ROOT/run/${case}__${arm}__r${rep}
  mkdir -p "$ws"
  cp "$REPO/evals/$case/prompt.md" "$ws/"
  [ -f "$REPO/evals/$case/SIMPLE.md" ] && cp "$REPO/evals/$case/SIMPLE.md" "$ws/"
  if [ "$arm" = "forge" ]; then
    mkdir -p "$ws/.claude/skills"
    cp -R "$ROOT/skill/skills/simple" "$ws/.claude/skills/simple"
  fi
  (cd "$ws" && claude -p "$(cat prompt.md)" --model sonnet --setting-sources project,local --output-format text > answer.md 2> err.log)
  echo "done $case $arm r$rep ($(wc -c < "$ws/answer.md") bytes)"
}
jobs=()
for rep in 1 2 3; do
  for case in mutation-interval unknown-write; do
    for arm in no-skill forge; do jobs+=("$case $arm $rep"); done
  done
done
for case in missing-precondition emulation-boundary operator-activation; do
  for arm in no-skill forge; do jobs+=("$case $arm 1"); done
done
i=0
for j in "${jobs[@]}"; do
  run_one ${=j} &
  ((++i % 4 == 0)) && wait
done
wait
echo ALL DONE
