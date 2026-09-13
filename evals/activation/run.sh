#!/bin/zsh
# Activation screen: is the skill opened when it should be and left alone when it
# should not be? The skill is available in each workspace but never named in the
# prompt, and the solver is not told to read it. Opening SKILL.md in the isolated
# event trace counts as activation. CONDITIONS selects `current` (the working-tree
# skill) and `candidate` (the same skill with candidate-description.txt); `resume`
# continues an interrupted run from the cells already in /tmp/simple-activation.
set -eu

repo=$(git -C "${0:A:h}" rev-parse --show-toplevel)
suite="$repo/evals/activation"
record=/tmp/simple-activation
model=${MODEL:-gpt-5.6-luna}
runs=${RUNS:-2}
result_dir="$repo/evals/results/${RESULT_DATE:-$(date +%Y-%m-%d)}-activation${RESULT_SUFFIX:-}"
conditions=(${=CONDITIONS:-current})
should=(should-architecture should-delete-fallback should-compat should-plan-migration should-handoff should-audit)
should_not=(not-typo not-regex not-rename-var not-date-format not-http-status not-list-files)
cases=("${should[@]}" "${should_not[@]}")

base_profile="(version 1) (allow default) (deny file-read* (subpath \"$repo\")) (deny file-read* (subpath \"$HOME/.agents/skills\")) (deny file-read* (subpath \"$HOME/.codex/skills\")) (deny file-read* (subpath \"$HOME/.codex/plugins\"))"

opaque_id() { print -n "$1|$2|$3|$4|activation-v1" | shasum -a 256 | cut -c1-12; }

run_codex() {
  local workspace=$1 prompt=$2 events=$3 errors=$4
  local profile="$base_profile (deny file-write* (subpath \"$workspace\"))"
  (
    cd "$workspace"
    sandbox-exec -p "$profile" \
      perl -e 'alarm shift; exec @ARGV' 240 \
        codex exec --ignore-user-config --ignore-rules --disable plugins --disable remote_plugin \
          --disable apps --disable hooks --disable multi_agent --disable skill_search \
          --disable skill_mcp_dependency_install --ephemeral --skip-git-repo-check \
          --dangerously-bypass-approvals-and-sandbox --model "$model" --cd "$workspace" --json \
          "$prompt" < /dev/null > "$events" 2> "$errors"
  )
}

prepare() {
  [[ "$record" = /tmp/simple-activation ]] || return 1
  rm -rf "$record"
  mkdir -p "$record/raw" "$record/events" "$record/errors" "$record/workspaces" "$record/inputs"
  : > "$record/activation.tsv"
  cp -R "$repo/skills/simple" "$record/inputs/current-skill"
  if (( ${conditions[(Ie)candidate]} )); then
    cp -R "$repo/skills/simple" "$record/inputs/candidate-skill"
    python3 - "$record/inputs/candidate-skill/SKILL.md" "$suite/candidate-description.txt" <<'PY'
import re, sys
from pathlib import Path
skill = Path(sys.argv[1]); text = skill.read_text()
candidate = Path(sys.argv[2]).read_text().strip().splitlines()
block = "description: >-\n" + "".join(f"  {line}\n" for line in candidate)
new = re.sub(r"description: >-\n(?:  .*\n)+", block, text, count=1)
assert new != text, "description block not found"
skill.write_text(new)
PY
    cp "$suite/candidate-description.txt" "$record/inputs/candidate-description.txt"
  fi
  cp -R "$suite/prompts" "$record/inputs/prompts"
  cp "$suite/protocol.md" "$record/protocol.md"
  print "candidate\t$(git -C "$repo" rev-parse HEAD)\ncandidate_tree_dirty\t$(git -C "$repo" status --porcelain -- skills/simple | wc -l | tr -d ' ')" > "$record/inputs/commits.tsv"
}

solve_one() {
  local run=$1 case_name=$2 condition=$3
  local id=$(opaque_id "$run" "$case_name" "$model" "$condition")
  if grep -q "^$id	" "$record/activation.tsv" 2>/dev/null; then print "skip $id (done)"; return; fi
  local workspace="$record/workspaces/$id"
  mkdir -p "$workspace/.agents/skills"
  cp -R "$record/inputs/$condition-skill" "$workspace/.agents/skills/simple"
  cp "$suite/prompts/$case_name.md" "$workspace/prompt.md"
  local started=$(date +%s)
  run_codex "$workspace" "$(<"$workspace/prompt.md")" "$record/events/$id.jsonl" "$record/errors/$id.log" || true
  local latency=$(( $(date +%s) - started ))
  jq -r -s '[.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last // ""' "$record/events/$id.jsonl" > "$record/raw/$id.md"
  local opened=false
  grep -q 'agents/skills/simple/SKILL\.md' "$record/events/$id.jsonl" && opened=true
  local expected=false
  (( ${should[(Ie)$case_name]} )) && expected=true
  local tokens=$(jq -r 'select(.type=="turn.completed") | .usage.input_tokens' "$record/events/$id.jsonl" | tail -1)
  print "$id\t$run\t$case_name\t$model\t$condition\t$expected\t$opened\t$latency\t${tokens:-}" >> "$record/activation.tsv"
  print "solved $id ($case_name, $condition) expected=$expected opened=$opened"
}

summarize() {
  : > "$record/summary.txt"
  local condition
  for condition in "${conditions[@]}"; do
    local hits=0 st=0 false_fires=0 sn=0
    while IFS=$'\t' read -r id run case_name m cond expected opened latency tokens; do
      [[ $cond = $condition ]] || continue
      if [[ $expected = true ]]; then st=$((st+1)); [[ $opened = true ]] && hits=$((hits+1)); else sn=$((sn+1)); [[ $opened = true ]] && false_fires=$((false_fires+1)); fi
    done < "$record/activation.tsv"
    print "$condition: should-fire opened $hits/$st; should-not-fire opened $false_fires/$sn" | tee -a "$record/summary.txt"
  done
  rm -rf "$result_dir"; mkdir -p "$result_dir"
  print 'id\trun\tcase\tmodel\tcondition\texpected\topened\tlatency_s\tinput_tokens' > "$result_dir/activation.tsv"
  cat "$record/activation.tsv" >> "$result_dir/activation.tsv"
  cp "$record/summary.txt" "$record/protocol.md" "$result_dir/"
  cp -R "$record/raw" "$result_dir/raw"; cp -R "$record/inputs/prompts" "$result_dir/prompts"; cp "$record/inputs/commits.tsv" "$result_dir/commits.tsv"
  [[ -f "$record/inputs/candidate-description.txt" ]] && cp "$record/inputs/candidate-description.txt" "$result_dir/candidate-description.txt"
  mkdir -p "$result_dir/errors"
  local f
  for f in "$record"/errors/*.log; do sed -e "s#$repo#<REPO>#g" -e "s#$HOME#<HOME>#g" "$f" > "$result_dir/errors/$(basename "$f")"; done
}

run_all() {
  local run case_name condition
  for run in {1..$runs}; do
    for case_name in "${cases[@]}"; do
      if (( run % 2 )); then for condition in "${conditions[@]}"; do solve_one "$run" "$case_name" "$condition"; done
      else for condition in "${(Oa)conditions[@]}"; do solve_one "$run" "$case_name" "$condition"; done; fi
    done
  done
  summarize
}

measure() {
  [[ ${READY:-} = 1 ]] || { print 'set READY=1 when the prompts are frozen' >&2; return 2; }
  prepare
  run_all
}

resume() {
  [[ ${READY:-} = 1 ]] || { print 'set READY=1 when the prompts are frozen' >&2; return 2; }
  [[ -s "$record/activation.tsv" ]] || { print "no record to resume at $record" >&2; return 1; }
  run_all
}

selftest() {
  zsh -n "$suite/run.sh"
  local c
  for c in "${cases[@]}"; do [[ -s "$suite/prompts/$c.md" ]]; grep -qi "simple" "$suite/prompts/$c.md" && { print "prompt $c names Simple" >&2; return 1; }; done
  [[ -s "$suite/protocol.md" ]]
  print "selftest passed: ${#cases[@]} prompts"
}

case ${1:-measure} in
  selftest) selftest ;;
  measure) selftest; measure ;;
  resume) selftest; resume ;;
  *) print 'usage: run.sh [selftest|measure|resume]' >&2; exit 2 ;;
esac
