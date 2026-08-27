#!/bin/zsh
set -eu

repo=/Users/tim/Code/personal/simple
record=$repo/evals/results/2026-08-26-leading-words-matrix
root=/tmp/simple-leading-words-matrix-20260826
ponytail=/Users/tim/.codex/plugins/cache/ponytail/ponytail/4.9.0/skills/ponytail
base=1d956ce
sandbox_profile='(version 1) (allow default) (deny file-read* (subpath "/Users/tim/.config/opencode/skills"))'

models=(
  opencode/mimo-v2.5-free
  opencode/hy3-free
)

arms=(
  none pony
  legacy legacy-pony
  first-principles first-principles-pony
  invariant invariant-pony
  counterfactual counterfactual-pony
  canonical canonical-pony
)

prepare() {
  [[ $root = /tmp/simple-leading-words-matrix-20260826 ]] || return 1
  rm -rf "$root"
  mkdir -p "$root/versions" "$root/run" "$root/opencode-config"

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

run_opencode() {
  local model=$1 prompt=$2 output=$3 errors=$4
  sandbox-exec -p "$sandbox_profile" env \
    OPENCODE_CONFIG_DIR="$root/opencode-config" \
    OPENCODE_PURE=1 \
    OPENCODE_DISABLE_DEFAULT_PLUGINS=1 \
    OPENCODE_DISABLE_EXTERNAL_SKILLS=1 \
    OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1 \
    OPENCODE_DISABLE_SHARE=1 \
      perl -e 'alarm shift; exec @ARGV' 180 \
        opencode run --pure --agent plan --model "$model" --format json "$prompt" \
        > "$output" 2> "$errors"
}

solve_one() {
  local case_name=$1 model=$2 arm=$3 rep=$4
  local model_slug=${model#*/}
  local workspace="$root/run/${case_name}__${model_slug}__${arm}__r${rep}"
  local stem="${case_name}__${model_slug}__${arm}__r${rep}"
  local version

  mkdir -p "$workspace/.opencode/skills" "$record/raw" "$record/events" \
    "$record/meta" "$record/traces" "$record/errors"
  cp "$record/opencode.json" "$workspace/"
  cp "$repo/evals/$case_name/prompt.md" "$workspace/"
  [[ -f "$repo/evals/$case_name/SIMPLE.md" ]] && \
    cp "$repo/evals/$case_name/SIMPLE.md" "$workspace/"

  if [[ $arm != none && $arm != pony ]]; then
    version=$(version_for_arm "$arm")
    cp -R "$root/versions/$version/skills/simple" "$workspace/.opencode/skills/simple"
  fi
  if [[ $arm = pony || $arm = *-pony ]]; then
    cp -R "$ponytail" "$workspace/.opencode/skills/ponytail"
  fi

  (
    cd "$workspace"
    run_opencode "$model" "$(<prompt.md)" run.json err.log
  )

  jq -e -s '([.[] | select(.type == "text") | .part.text] | join("") | gsub("\\s"; "") | length) > 0' \
    "$workspace/run.json" >/dev/null
  jq -r -s '[.[] | select(.type == "text") | .part.text] | join("")' \
    "$workspace/run.json" > "$record/raw/$stem.md"
  cp "$workspace/run.json" "$record/events/$stem.jsonl"
  cp "$workspace/err.log" "$record/errors/$stem.log"
  jq -s --arg model "$model" --arg arm "$arm" --arg case "$case_name" \
    --argjson rep "$rep" '{
      model: $model,
      arm: $arm,
      case: $case,
      repetition: $rep,
      inputTokens: ([.[] | select(.type == "step_finish") | .part.tokens.input] | add // 0),
      outputTokens: ([.[] | select(.type == "step_finish") | .part.tokens.output] | add // 0),
      latencyMs: ((last.timestamp // 0) - (first.timestamp // 0)),
      costUsd: ([.[] | select(.type == "step_finish") | .part.cost] | add // 0),
      turns: ([.[] | select(.type == "step_finish")] | length)
    }' "$workspace/run.json" > "$record/meta/$stem.json"
  rg '"tool":"skill"|"name":"(simple|ponytail)"' "$workspace/run.json" \
    > "$record/traces/$stem.txt" || :
  print "done $stem ($(wc -c < "$record/raw/$stem.md") bytes)"
}

solve() {
  prepare
  rm -rf "$record/raw" "$record/events" "$record/meta" "$record/traces" \
    "$record/errors"
  local jobs=() model arm rep case_name

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

  local job
  integer running=0
  for job in "${jobs[@]}"; do
    solve_one ${=job} &
    ((++running % 3 == 0)) && wait
  done
  wait
}

retry_missing() {
  prepare
  mkdir -p "$record/retry-failures"
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

retry_one() {
  local case_name=$1 model=$2 arm=$3 rep=$4
  local model_slug=${model#*/}
  local stem="${case_name}__${model_slug}__${arm}__r${rep}"
  [[ -f "$record/raw/$stem.md" || -f "$record/retry-failures/$stem.txt" ]] && return
  solve_one "$case_name" "$model" "$arm" "$rep" || {
    local status=$?
    print "retry failed with exit status $status" > "$record/retry-failures/$stem.txt"
  }
}

selftest() {
  prepare
  zsh -n "$record/run.sh"
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
  ! rg -q 'first-principles reasoning|Try to falsify' \
    "$root/versions/counterfactual/skills/simple/SKILL.md"
  diff -qr "$root/versions/canonical/skills/simple" "$repo/skills/simple" >/dev/null

  mkdir -p "$root/isolation"
  cp "$record/opencode.json" "$root/isolation/"
  (
    cd "$root/isolation"
    sandbox-exec -p "$sandbox_profile" env \
      OPENCODE_CONFIG_DIR="$root/opencode-config" \
      OPENCODE_PURE=1 \
      OPENCODE_DISABLE_DEFAULT_PLUGINS=1 \
      OPENCODE_DISABLE_EXTERNAL_SKILLS=1 \
      OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1 \
        opencode debug skill --pure > skills.json 2> errors.log
  )
  jq -e 'all(.[]; .name != "simple" and .name != "ponytail")' \
    "$root/isolation/skills.json" >/dev/null

  local case_name
  for case_name in mutation-interval production-data future-service; do
    [[ -f "$repo/evals/$case_name/prompt.md" ]]
    [[ -f "$repo/evals/$case_name/graders/criteria.md" ]]
    [[ -f "$repo/evals/$case_name/graders/references/pass.md" ]]
    [[ -f "$repo/evals/$case_name/graders/references/fail.md" ]]
  done
  print 'selftest passed'
}

case ${1:-all} in
  selftest) selftest ;;
  solve) solve ;;
  retry-missing) retry_missing ;;
  all) selftest; solve ;;
  *) print 'usage: run.sh [selftest|solve|retry-missing|all]' >&2; exit 2 ;;
esac
