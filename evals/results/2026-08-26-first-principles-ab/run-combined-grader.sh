#!/bin/zsh
set -eu

repo=/Users/tim/Code/personal/simple
root=/tmp/simple-first-principles-eval-20260826
mkdir -p "$root/grades" "$root/grader-workspace"

grade_case() {
  local case_name=$1
  shift
  local prompt
  prompt="$(
    print 'Grade the candidate answers strictly against the supplied criteria.'
    print 'First self-test the rubric: the pass reference must pass and the fail reference must fail. If either self-test fails, set selfTestPassed to false and do not grade the candidates.'
    print 'Return only JSON with this shape: {"selfTestPassed":true,"grades":[{"id":"...","passed":true,"reason":"one concise evidence-based sentence"}]}.'
    print '\nCRITERIA'
    sed -n '1,320p' "$repo/evals/$case_name/graders/criteria.md"
    print '\nPASS REFERENCE'
    sed -n '1,320p' "$repo/evals/$case_name/graders/references/pass.md"
    print '\nFAIL REFERENCE'
    sed -n '1,320p' "$repo/evals/$case_name/graders/references/fail.md"
    while (( $# >= 2 )); do
      print "\nCANDIDATE ID: $1"
      sed -n '1,420p' "$2"
      shift 2
    done
  )"
  (
    cd "$root/grader-workspace"
    claude -p "$prompt" --model fable --setting-sources project,local \
      --output-format text > "$root/grades/${case_name}-combined.json" \
      2> "$root/grades/${case_name}-combined.err"
  )
  print "graded $case_name combined"
}

grade_case mutation-interval \
  current-both-r1 "$root/run/mutation-interval__current-both__r1/answer.md" \
  current-both-r2 "$root/run/mutation-interval__current-both__r2/answer.md" \
  current-both-r3 "$root/run/mutation-interval__current-both__r3/answer.md" \
  candidate-both-r1 "$root/run/mutation-interval__candidate-both__r1/answer.md" \
  candidate-both-r2 "$root/run/mutation-interval__candidate-both__r2/answer.md" \
  candidate-both-r3 "$root/run/mutation-interval__candidate-both__r3/answer.md"

grade_case production-data \
  current-both-r1 "$root/run/production-data__current-both__r1/answer.md" \
  candidate-both-r1 "$root/run/production-data__candidate-both__r1/answer.md"
