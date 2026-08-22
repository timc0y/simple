#!/bin/zsh
set -u
REPO=/Users/tim/Code/personal/simple
ROOT=/tmp/simple-eval3
run_one() {
  local case=$1 arm=$2
  local ws=$ROOT/run/${case}__${arm}
  mkdir -p "$ws/.claude/skills"
  cp "$REPO/evals/$case/prompt.md" "$ws/"
  [ -f "$REPO/evals/$case/SIMPLE.md" ] && cp "$REPO/evals/$case/SIMPLE.md" "$ws/"
  case $arm in
    simple)   cp -R "$ROOT/skills/skills/simple" "$ws/.claude/skills/simple" ;;
    ponytail) cp -R "$ROOT/skills/ponytail" "$ws/.claude/skills/ponytail" ;;
    both)     cp -R "$ROOT/skills/skills/simple" "$ws/.claude/skills/simple"
              cp -R "$ROOT/skills/ponytail" "$ws/.claude/skills/ponytail" ;;
  esac
  (cd "$ws" && claude -p "$(cat prompt.md)" --model sonnet --setting-sources project,local --output-format text > answer.md 2> err.log)
  echo "done $case $arm ($(wc -c < "$ws/answer.md") bytes)"
}
i=0
for case in mutation-interval implementation-ladder plain-writing production-data routine-edit; do
  for arm in simple ponytail both; do
    run_one $case $arm &
    ((++i % 4 == 0)) && wait
  done
done
wait
echo ALL DONE
