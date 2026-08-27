#!/bin/zsh
set -eu

repo=/Users/tim/Code/personal/simple
root=/tmp/simple-first-principles-eval-20260826
mkdir -p "$root/grades" "$root/grader-workspace"

grade_case() {
  local case_name=$1 rubric_case=$2
  shift 2
  local prompt
  prompt="$(
    print 'Grade the candidate answers strictly against the supplied criteria.'
    print 'First self-test the rubric: the pass reference must pass and the fail reference must fail. If either self-test fails, set selfTestPassed to false and do not grade the candidates.'
    print 'Return only JSON with this shape: {"selfTestPassed":true,"grades":[{"id":"...","passed":true,"reason":"one concise evidence-based sentence"}]}.'
    print '\nCRITERIA'
    sed -n '1,320p' "$repo/evals/$rubric_case/graders/criteria.md"
    print '\nPASS REFERENCE'
    sed -n '1,320p' "$repo/evals/$rubric_case/graders/references/pass.md"
    print '\nFAIL REFERENCE'
    sed -n '1,320p' "$repo/evals/$rubric_case/graders/references/fail.md"
    while (( $# >= 2 )); do
      print "\nCANDIDATE ID: $1"
      sed -n '1,420p' "$2"
      shift 2
    done
  )"
  (
    cd "$root/grader-workspace"
    claude -p "$prompt" --model fable --setting-sources project,local \
      --output-format text > "$root/grades/$case_name.json" 2> "$root/grades/$case_name.err"
  )
  print "graded $case_name"
}

grade_case mutation-interval mutation-interval \
  current-r1 "$root/run/mutation-interval__current__r1/answer.md" \
  current-r2 "$root/run/mutation-interval__current__r2/answer.md" \
  current-r3 "$root/run/mutation-interval__current__r3/answer.md" \
  candidate-r2 "$root/run/mutation-interval__candidate__r2/answer.md" \
  candidate-r3 "$root/run/mutation-interval__candidate__r3/answer.md" \
  candidate-r4 "$root/run/mutation-interval__candidate__r4/answer.md"

for case_name in ordinary-path startup-root-cause production-data; do
  grade_case "$case_name" "$case_name" \
    current-r1 "$root/run/${case_name}__current__r1/answer.md" \
    candidate-r1 "$root/run/${case_name}__candidate__r1/answer.md"
done

grade_case activation future-service \
  current-r1 "$root/run/activation__current__r1/answer.md" \
  candidate-r1 "$root/run/activation__candidate__r1/answer.md"

print 'ALL GRADED'
