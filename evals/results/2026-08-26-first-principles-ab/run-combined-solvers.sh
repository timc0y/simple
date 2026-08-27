#!/bin/zsh
set -eu

runner=/tmp/simple-first-principles-eval-20260826/run-solvers.sh

for rep in 1 2 3; do
  zsh "$runner" mutation-interval current-both "$rep" &
  zsh "$runner" mutation-interval candidate-both "$rep" &
done
zsh "$runner" production-data current-both 1 &
zsh "$runner" production-data candidate-both 1 &
wait
