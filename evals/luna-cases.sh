#!/bin/zsh
# Shared isolated Luna runner for prompt cases graded by criteria plus the shared
# rubric. Parameters come from the environment so each suite is a short wrapper:
#   SUITE=readable-rules CASES="a b c" BASELINE_COMMIT=c28f3b7 RESULT_DATE=2026-09-12
#   READY=1 zsh evals/luna-cases.sh measure
set -eu

repo=$(git -C "${0:A:h}" rev-parse --show-toplevel)
suite=${SUITE:?set SUITE}
cases=(${=CASES:?set CASES})
baseline_commit=${BASELINE_COMMIT:?set BASELINE_COMMIT}
result_date=${RESULT_DATE:-$(date +%Y-%m-%d)}
record=/tmp/simple-$suite
baseline="$record/inputs/current-skill"
candidate_source=${CANDIDATE_SKILL:-$repo/skills/simple}
candidate="$record/inputs/candidate-skill"
model=${MODEL:-gpt-5.6-luna}
runs=${RUNS:-2}
conditions=(none current candidate)
result_dir="$repo/evals/results/$result_date-$suite"
max_input_tokens=${MAX_INPUT_TOKENS:-4000000}
salt="$suite-v1"

base_profile="(version 1) (allow default) (deny file-read* (subpath \"$repo\")) (deny file-read* (subpath \"$HOME/.agents/skills\")) (deny file-read* (subpath \"$HOME/.codex/skills\")) (deny file-read* (subpath \"$HOME/.codex/plugins\"))"

source_case_dir() { print "$repo/evals/${1%@alt}"; }
case_dir() { print "$record/inputs/${1%@alt}"; }
prompt_file() { if [[ $1 == *@alt ]]; then print "$(case_dir "$1")/prompt-alt.md"; else print "$(case_dir "$1")/prompt.md"; fi }
expand_variants() { local c; for c in "${cases[@]}"; do print "$c"; [[ -s "$(case_dir "$c")/prompt-alt.md" ]] && print "$c@alt"; done }
opaque_id() { print -n "$1|$2|$3|$4|$salt" | shasum -a 256 | cut -c1-12; }

run_codex() {
  local workspace=$1 prompt=$2 events=$3 errors=$4 extra_profile=${5:-}
  local profile="$base_profile $extra_profile (deny file-write* (subpath \"$workspace\"))"
  (
    cd "$workspace"
    sandbox-exec -p "$profile" \
      perl -e 'alarm shift; exec @ARGV' 300 \
        codex exec --ignore-user-config --ignore-rules --disable plugins --disable remote_plugin \
          --disable apps --disable hooks --disable multi_agent --disable skill_search \
          --disable skill_mcp_dependency_install --ephemeral --skip-git-repo-check \
          --dangerously-bypass-approvals-and-sandbox --model "$model" --cd "$workspace" --json \
          "$prompt" < /dev/null > "$events" 2> "$errors"
  )
}

extract_answer() {
  local events=$1 output=$2
  jq -e -s '([.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last | gsub("\\s"; "") | length) > 0' "$events" >/dev/null
  jq -r -s '[.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last' "$events" > "$output"
}

input_tokens_so_far() {
  local total=0 f
  for f in "$record"/events/*.jsonl(N); do
    total=$(( total + $(jq -r 'select(.type=="turn.completed") | .usage.input_tokens' "$f" | tail -1 | sed 's/^$/0/') ))
  done
  print $total
}

prepare() {
  [[ "$record" = /tmp/simple-$suite ]] || return 1
  rm -rf "$record"
  mkdir -p "$record/raw" "$record/events" "$record/errors" "$record/workspaces" "$record/grades" "$record/inputs" "$record/preflight"
  : > "$record/mapping.tsv"; : > "$record/latency.tsv"
  local tmp="$record/inputs/baseline-archive"; mkdir -p "$tmp"
  git -C "$repo" archive "$baseline_commit" skills/simple | tar -x -C "$tmp"
  mv "$tmp/skills/simple" "$baseline"; rm -rf "$tmp"
  cp -R "$candidate_source" "$candidate"
  cp "$repo/evals/rubric.md" "$record/rubric.md"
  : > "$record/reference-order.tsv"
  [[ -f "$repo/evals/$suite/protocol.md" ]] && cp "$repo/evals/$suite/protocol.md" "$record/protocol.md"
  local case_name
  for case_name in "${cases[@]}"; do
    mkdir -p "$(dirname "$record/inputs/$case_name")"
    cp -R "$(source_case_dir "$case_name")" "$record/inputs/$case_name"
    rm -f "$record/inputs/$case_name/run.sh" "$record/inputs/$case_name/protocol.md"
  done
  cp "$repo/evals/grading.mjs" "$record/grading.mjs"
  print "baseline\t$(git -C "$repo" rev-parse "$baseline_commit")\ncandidate\t$(git -C "$repo" rev-parse HEAD)\ncandidate_tree_dirty\t$(git -C "$repo" status --porcelain -- skills/simple | wc -l | tr -d ' ')" > "$record/inputs/commits.tsv"
}

prepare_skills() {
  local condition=$1 workspace=$2
  mkdir -p "$workspace/.agents/skills"
  case "$condition" in
    current) cp -R "$baseline" "$workspace/.agents/skills/simple" ;;
    candidate) cp -R "$candidate" "$workspace/.agents/skills/simple" ;;
  esac
}

solver_instruction() {
  case "$1" in
    none) print 'Answer the request in prompt.md. Read any fixture files named by the prompt.' ;;
    current|candidate) print 'Read .agents/skills/simple/SKILL.md and each specialist reference that it routes this task to. Then answer the request in prompt.md.' ;;
  esac
  print 'Do not discuss skills, evaluation, or your process.'
}

solver_read_denials() {
  local workspace=$1 item
  for item in "$record"/*(DN); do
    [[ "$item" = "$record/workspaces" ]] && continue
    print "(deny file-read* (subpath \"$item\"))"
  done
  for item in "$record"/workspaces/*(DN); do
    [[ "$item" = "$workspace" ]] || print "(deny file-read* (subpath \"$item\"))"
  done
}

solve_one() {
  local run=$1 case_name=$2 condition=$3
  local id=$(opaque_id "$run" "$case_name" "$model" "$condition")
  local workspace="$record/workspaces/$id" source=$(case_dir "$case_name")
  mkdir -p "$workspace"
  prepare_skills "$condition" "$workspace"
  cp "$(prompt_file "$case_name")" "$workspace/prompt.md"
  [[ -f "$source/SIMPLE.md" ]] && cp "$source/SIMPLE.md" "$workspace/SIMPLE.md"
  [[ -d "$source/fixture" ]] && cp -R "$source/fixture/." "$workspace/fixture"
  local started=$(date +%s)
  run_codex "$workspace" "$(solver_instruction "$condition")" "$record/events/$id.jsonl" "$record/errors/$id.log" "$(solver_read_denials "$workspace")"
  print "$id\t$(( $(date +%s) - started ))" >> "$record/latency.tsv"
  extract_answer "$record/events/$id.jsonl" "$record/raw/$id.md"
}

ordered_conditions() { if (( $1 % 2 )); then print -l "${conditions[@]}"; else print -l "${(Oa)conditions}"; fi }

build_mapping() {
  local run case_name condition id
  for run in {1..$runs}; do
    for case_name in $(expand_variants); do
      for condition in $(ordered_conditions "$run"); do
        id=$(opaque_id "$run" "$case_name" "$model" "$condition")
        print "$id\t$run\t$case_name\t$model\t$condition" >> "$record/mapping.tsv"
      done
    done
  done
}

reference_order() { if (( 0x$(print -n "$1" | shasum -a 256 | cut -c1-2) % 2 )); then print fail-first; else print pass-first; fi }

build_grader_prompt() {
  mkdir -p "$(dirname "$2")"
  node "$record/grading.mjs" prompt "$record" "$1" "$(reference_order "$1")" > "$2"
}

grade_case() {
  local case_name=$1
  local prompt="$record/grades/$case_name.prompt.md" workspace="/tmp/simple-$suite-grader-$case_name"
  mkdir -p "$(dirname "$prompt")" "$(dirname "$record/errors/grader-$case_name.log")"
  if [[ ! -e "$record/grades/$case_name.json" ]]; then
    print "$case_name\t$(reference_order "$case_name")" >> "$record/reference-order.tsv"
    build_grader_prompt "$case_name" "$prompt"
    rm -rf "$workspace"; mkdir -p "$workspace"; cp "$prompt" "$workspace/prompt.md"
    run_codex "$workspace" "$(<"$workspace/prompt.md")" "$record/grades/$case_name.events.jsonl" "$record/errors/grader-$case_name.log" "(deny file-read* (subpath \"$record\"))"
    extract_answer "$record/grades/$case_name.events.jsonl" "$record/grades/$case_name.json"
  fi
  node "$record/grading.mjs" validate "$record" "$case_name"
  # A supplied second order is evidence, never a reason to pick a preferred verdict.
  if [[ -f "$record/grades/$case_name.swapped.json" ]]; then
    node "$record/grading.mjs" compare "$record" "$case_name" "$record/grades/$case_name.swapped.json" > "$record/grades/$case_name.order-check.json"
  fi
}

redact_copy() {
  local from=$1 to=$2
  mkdir -p "$(dirname "$to")"
  sed -e "s#$repo#<REPO>#g" -e "s#$HOME#<HOME>#g" "$from" > "$to"
}

summarize() {
  local order_check checked_case
  for order_check in "$record"/grades/**/*.order-check.json(N); do
    checked_case=${order_check#"$record/grades/"}
    checked_case=${checked_case%.order-check.json}
    if ! node "$record/grading.mjs" check-order "$record" "$checked_case"; then
      print "inconclusive grader order check: $order_check; retained verdicts require independent review" >&2
      return 1
    fi
  done
  print 'run\tcase\tmodel\tcondition\tluna\tstrict' > "$record/results.tsv"
  print 'id\trun\tcase\tcondition\tpassed\tblocker\treadability\tactionability\tcompleteness\tconcision\tinput_tokens\toutput_tokens\tlatency_s' > "$record/scores.tsv"
  local id run case_name mapped_model condition g base usage lat
  while IFS=$'\t' read -r id run case_name mapped_model condition; do
    base=${case_name%@alt}
    g=$(jq -c --arg id "$id" '.grades[] | select(.id == $id)' "$record/grades/$base.json")
    usage=$(jq -c 'select(.type=="turn.completed") | .usage' "$record/events/$id.jsonl" | tail -1)
    lat=$(awk -F '\t' -v i="$id" '$1==i{print $2}' "$record/latency.tsv")
    print "$run\t$case_name\t$mapped_model\t$condition\t$(jq -r .passed <<<$g)\t$(jq -r .passed <<<$g)" >> "$record/results.tsv"
    print "$id\t$run\t$case_name\t$condition\t$(jq -r .passed <<<$g)\t$(jq -r .blocker <<<$g)\t$(jq -r .scores.readability <<<$g)\t$(jq -r .scores.actionability <<<$g)\t$(jq -r .scores.completeness <<<$g)\t$(jq -r .scores.concision <<<$g)\t$(jq -r '.input_tokens // ""' <<<$usage)\t$(jq -r '.output_tokens // ""' <<<$usage)\t${lat:-}" >> "$record/scores.tsv"
  done < "$record/mapping.tsv"
  python3 - "$record/scores.tsv" > "$record/noise-floor.tsv" <<'EOF'
import csv,sys,statistics as st,collections
rows=list(csv.DictReader(open(sys.argv[1]),delimiter='\t'))
dims=['readability','actionability','completeness','concision']
groups=collections.defaultdict(list)
for r in rows: groups[(r['case'].split('@')[0],r['condition'])].append(r)
print('case\tcondition\tn\tvariants\tpass\tblockers\t'+'\t'.join(f'{d}_mean\t{d}_sd' for d in dims)+'\tinput_tokens_mean\toutput_tokens_mean\tlatency_mean')
for (c,k),rs in sorted(groups.items()):
    out=[c,k,str(len(rs)),str(len({r['case'] for r in rs})),str(sum(r['passed']=='true' for r in rs)),str(sum(r['blocker']=='true' for r in rs))]
    for d in dims:
        v=[float(r[d]) for r in rs]; out+= [f'{st.mean(v):.2f}', f'{(st.pstdev(v) if len(v)>1 else 0):.2f}']
    for f in ('input_tokens','output_tokens','latency_s'):
        v=[float(r[f]) for r in rs if r.get(f)]
        out.append(f'{st.mean(v):.0f}' if v else '')
    print('\t'.join(out))
EOF
  print "key\tname\trevision\treasoning\tharness\n$model\t$model\tnot reported; requested $model\tdefault\tisolated Codex Luna $suite screen" > "$record/models.tsv"
  node "$repo/evals/normalize-results.mjs" "$record" "$(git -C "$repo" rev-parse HEAD)" "isolated Codex Luna $suite screen"
  local normalized="$record/results.json" stripped="$record/results.json.stripped"
  jq 'map(.tasks |= map(if .graderVerdicts then .graderVerdicts |= with_entries(select(.key == "luna")) else . end))' "$normalized" > "$stripped"; mv "$stripped" "$normalized"
  rm -rf "$result_dir"; mkdir -p "$result_dir"
  local item
  for item in mapping.tsv results.tsv results.json scores.tsv noise-floor.tsv models.tsv latency.tsv rubric.md reference-order.tsv grading.mjs; do [[ -f "$record/$item" ]] && cp "$record/$item" "$result_dir/$item"; done
  [[ -f "$record/protocol.md" ]] && cp "$record/protocol.md" "$result_dir/protocol.md"
  cp -R "$record/raw" "$result_dir/raw"; cp -R "$record/inputs" "$result_dir/inputs"
  local f
  for f in "$record"/grades/**/*.json(N) "$record"/errors/**/*.log(N); do [[ -f "$f" ]] || continue; redact_copy "$f" "$result_dir/${f#$record/}"; done
  print 'condition\tpassed/total'
  awk -F '\t' 'NR > 1 {total[$4]++; if ($5 == "true") pass[$4]++} END {for (c in total) print c "\t" pass[c]+0 "/" total[c]}' "$record/results.tsv" | sort
  print "input tokens used: $(input_tokens_so_far)"
}

selftest() {
  local source_mode=${1:-source}
  zsh -n "$repo/evals/luna-cases.sh"
  git -C "$repo" cat-file -e "$baseline_commit^{commit}"
  local check_candidate="$candidate_source" check_rubric="$repo/evals/rubric.md"
  if [[ "$source_mode" = frozen ]]; then check_candidate="$candidate"; check_rubric="$record/rubric.md"; fi
  [[ -d "$check_candidate" && -s "$check_candidate/SKILL.md" ]]
  [[ -s "$check_rubric" ]] && grep -q 'judge:begin' "$check_rubric" && grep -q 'judge:end' "$check_rubric"
  local case_name source
  for case_name in "${cases[@]}"; do
    if [[ "$source_mode" = frozen ]]; then source=$(case_dir "$case_name"); else source=$(source_case_dir "$case_name"); fi
    [[ -s "$source/prompt.md" && -s "$source/graders/criteria.md" && -s "$source/graders/references/pass.md" && -s "$source/graders/references/fail.md" ]]
  done
  print "selftest passed: ${#cases[@]} cases"
}

preflight() {
  local workspace="$record/preflight/workspace"; mkdir -p "$workspace"
  print 'Reply with the single word ready.' > "$workspace/prompt.md"
  run_codex "$workspace" 'Answer the request in prompt.md.' "$record/preflight/events.jsonl" "$record/preflight/errors.log"
  extract_answer "$record/preflight/events.jsonl" "$record/preflight/answer.md"
  print "preflight: $(<"$record/preflight/answer.md")"
}

solve_all_missing() {
  local id run case_name mapped_model condition
  while IFS=$'\t' read -r id run case_name mapped_model condition; do
    [[ "$mapped_model" = "$model" ]] || { print "recorded model $mapped_model differs from requested $model; start a separate run" >&2; return 1; }
    [[ -s "$record/raw/$id.md" ]] && continue
    if (( $(input_tokens_so_far) > max_input_tokens )); then print "input token cap $max_input_tokens reached; stopping before $id" >&2; return 1; fi
    print "solving $id ($case_name, $condition, run $run)"
    solve_one "$run" "$case_name" "$condition"
  done < "$record/mapping.tsv"
  local expected=$(wc -l < "$record/mapping.tsv" | tr -d ' ')
  local observed=$(find "$record/raw" -type f -name '*.md' | wc -l | tr -d ' ')
  [[ "$observed" = "$expected" ]] || { print "expected $expected answers, found $observed" >&2; return 1; }
  for case_name in "${cases[@]}"; do print "grading $case_name"; grade_case "$case_name"; done
  summarize
}

measure() {
  [[ ${READY:-} = 1 ]] || { print 'set READY=1 only after candidate is ready' >&2; return 2; }
  prepare; preflight; build_mapping; solve_all_missing
}

resume_measure() {
  [[ ${READY:-} = 1 ]] || { print 'set READY=1 only after candidate is ready' >&2; return 2; }
  [[ -s "$record/mapping.tsv" ]] || { print "missing existing record at $record" >&2; return 1; }
  solve_all_missing
}

case ${1:-measure} in
  selftest) selftest ;;
  measure) selftest; measure ;;
  resume) selftest frozen; resume_measure ;;
  *) print 'usage: luna-cases.sh [selftest|measure|resume]' >&2; exit 2 ;;
esac
