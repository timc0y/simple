#!/bin/zsh
set -eu

repo=/Users/tim/Code/personal/simple
record=$repo/evals/results/2026-08-26-leading-words-matrix
root=/tmp/simple-leading-words-codex-matrix-20260826
ponytail=/Users/tim/.codex/plugins/cache/ponytail/ponytail/4.9.0/skills/ponytail
base=1d956ce
sandbox_profile='(version 1) (allow default) (deny file-read* (subpath "/Users/tim/.agents/skills")) (deny file-read* (subpath "/Users/tim/.codex/skills")) (deny file-read* (subpath "/Users/tim/.codex/plugins"))'

models=(gpt-5.6-luna gpt-5.6-terra)

arms=(
  none pony
  legacy legacy-pony
  first-principles first-principles-pony
  invariant invariant-pony
  counterfactual counterfactual-pony
  canonical canonical-pony
)

prepare() {
  [[ $root = /tmp/simple-leading-words-codex-matrix-20260826 ]] || return 1
  rm -rf "$root"
  mkdir -p "$root/versions" "$root/run"

  local version
  for version in legacy first-principles invariant counterfactual canonical; do
    mkdir -p "$root/versions/$version"
    git -C "$repo" archive "$base" skills/simple | tar -x -C "$root/versions/$version"
  done

  (cd "$root/versions/first-principles" && \
    git apply "$record/variants/first-principles.diff")
  (cd "$root/versions/invariant" && \
    git apply "$record/variants/invariant.diff")
  (cd "$root/versions/counterfactual" && \
    git apply "$record/variants/counterfactual.diff")
  (cd "$root/versions/canonical" && \
    git apply "$repo/evals/results/2026-08-26-first-principles-ab/candidate.diff")
}

version_for_arm() {
  case $1 in
    legacy*) print legacy ;;
    first-principles*) print first-principles ;;
    invariant*) print invariant ;;
    counterfactual*) print counterfactual ;;
    canonical*) print canonical ;;
    *) return 1 ;;
  esac
}

run_codex() {
  local model=$1 workspace=$2 prompt=$3 output=$4 errors=$5
  local profile="$sandbox_profile (deny file-write* (subpath \"$workspace\"))"
  sandbox-exec -p "$profile" \
    perl -e 'alarm shift; exec @ARGV' 240 \
      codex exec \
        --ignore-user-config \
        --ignore-rules \
        --disable plugins \
        --disable remote_plugin \
        --disable apps \
        --disable hooks \
        --disable multi_agent \
        --ephemeral \
        --skip-git-repo-check \
        --dangerously-bypass-approvals-and-sandbox \
        --model "$model" \
        --cd "$workspace" \
        --json \
        "$prompt" > "$output" 2> "$errors"
}

solve_one() {
  local case_name=$1 model=$2 arm=$3 rep=$4
  local stem="${case_name}__${model}__${arm}__r${rep}"
  local workspace="$root/run/$stem"
  local output="$record/codex/raw/$stem.md"
  local version start end

  mkdir -p "$workspace/.agents/skills" "$record/codex/raw" \
    "$record/codex/events" "$record/codex/meta" "$record/codex/traces" \
    "$record/codex/errors"
  cp "$repo/evals/$case_name/prompt.md" "$workspace/"
  [[ -f "$repo/evals/$case_name/SIMPLE.md" ]] && \
    cp "$repo/evals/$case_name/SIMPLE.md" "$workspace/"

  if [[ $arm != none && $arm != pony ]]; then
    version=$(version_for_arm "$arm")
    cp -R "$root/versions/$version/skills/simple" "$workspace/.agents/skills/simple"
  fi
  if [[ $arm = pony || $arm = *-pony ]]; then
    cp -R "$ponytail" "$workspace/.agents/skills/ponytail"
  fi

  start=$(perl -MTime::HiRes=time -e 'printf "%.0f", time * 1000')
  run_codex "$model" "$workspace" "$(<"$workspace/prompt.md")" \
    "$record/codex/events/$stem.jsonl" "$record/codex/errors/$stem.log"
  end=$(perl -MTime::HiRes=time -e 'printf "%.0f", time * 1000')

  jq -e -s '([.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last | gsub("\\s"; "") | length) > 0' \
    "$record/codex/events/$stem.jsonl" >/dev/null
  jq -r -s '[.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last' \
    "$record/codex/events/$stem.jsonl" > "$output"
  jq -s --arg model "$model" --arg arm "$arm" --arg case "$case_name" \
    --argjson rep "$rep" --argjson duration "$((end - start))" '{
      model: $model,
      arm: $arm,
      case: $case,
      repetition: $rep,
      inputTokens: ([.[] | select(.type == "turn.completed") | .usage.input_tokens] | add // 0),
      outputTokens: ([.[] | select(.type == "turn.completed") | .usage.output_tokens] | add // 0),
      reasoningTokens: ([.[] | select(.type == "turn.completed") | .usage.reasoning_output_tokens] | add // 0),
      latencyMs: $duration
    }' "$record/codex/events/$stem.jsonl" > "$record/codex/meta/$stem.json"
  rg '\.agents/skills/(simple|ponytail)/SKILL\.md|using the (Simple|Ponytail) skill' \
    "$record/codex/events/$stem.jsonl" > "$record/codex/traces/$stem.txt" || :
  print "done $stem ($(wc -c < "$output") bytes)"
}

solve() {
  prepare
  rm -rf "$record/codex"
  mkdir -p "$record/codex"
  local jobs=() model arm rep case_name job
  integer running=0

  for model in "${models[@]}"; do
    for rep in 1 2; do
      for arm in "${arms[@]}"; do
        jobs+=("mutation-interval $model $arm $rep")
      done
    done
    for case_name in production-data future-service; do
      for arm in "${arms[@]}"; do
        jobs+=("$case_name $model $arm 1")
      done
    done
  done

  for job in "${jobs[@]}"; do
    solve_one ${=job} &
    ((++running % 2 == 0)) && wait
  done
  wait
}

retry_one() {
  local case_name=$1 model=$2 arm=$3 rep=$4
  local stem="${case_name}__${model}__${arm}__r${rep}"
  [[ -f "$record/codex/raw/$stem.md" || \
     -f "$record/codex/retry-failures/$stem.txt" ]] && return
  solve_one "$case_name" "$model" "$arm" "$rep" || {
    local status=$?
    print "retry failed with exit status $status" \
      > "$record/codex/retry-failures/$stem.txt"
  }
}

retry_missing() {
  prepare
  mkdir -p "$record/codex/retry-failures"
  local model arm rep case_name
  for model in "${models[@]}"; do
    for rep in 1 2; do
      for arm in "${arms[@]}"; do
        retry_one mutation-interval "$model" "$arm" "$rep"
      done
    done
    for case_name in production-data future-service; do
      for arm in "${arms[@]}"; do
        retry_one "$case_name" "$model" "$arm" 1
      done
    done
  done
}

selftest() {
  prepare
  zsh -n "$record/run-codex.sh"
  [[ ${#models[@]} = 2 ]]
  [[ ${#arms[@]} = 12 ]]
  [[ $(print -l "${arms[@]}" | sort -u | wc -l | tr -d ' ') = 12 ]]
  rg -q 'first-principles reasoning' \
    "$root/versions/first-principles/skills/simple/SKILL.md"
  ! rg -q 'first-principles reasoning|Try to falsify' \
    "$root/versions/invariant/skills/simple/SKILL.md"
  rg -q 'required outcome or invariant' \
    "$root/versions/invariant/skills/simple/SKILL.md"
  rg -q 'Use a counterfactual' \
    "$root/versions/counterfactual/skills/simple/SKILL.md"
  diff -qr "$root/versions/canonical/skills/simple" "$repo/skills/simple" >/dev/null
  sandbox-exec -p "$sandbox_profile" test ! -r \
    /Users/tim/.agents/skills/simple/SKILL.md
  sandbox-exec -p "$sandbox_profile" test ! -r \
    /Users/tim/.codex/plugins/cache/ponytail/ponytail/4.9.0/skills/ponytail/SKILL.md
  print 'selftest passed'
}

case ${1:-all} in
  selftest) selftest ;;
  solve) solve ;;
  retry-missing) retry_missing ;;
  all) selftest; solve ;;
  *) print 'usage: run-codex.sh [selftest|solve|retry-missing|all]' >&2; exit 2 ;;
esac
