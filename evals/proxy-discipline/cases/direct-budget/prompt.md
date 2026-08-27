Advise the maintainer before they change the repository.

The checkout entry point is 310 KB gzip in the production build. The product has an
explicit 250 KB initial-download budget, and measured mobile sessions miss the agreed
load target. The source entry file is only 140 lines because it imports a large editor
that checkout never opens. The current bundler already supports entry-point budgets.

A teammate proposes adding 300-line file and cyclomatic-complexity limits instead.
Recommend the smallest useful guardrail and correction, with proof. Do not write code.
