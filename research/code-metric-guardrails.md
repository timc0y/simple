# Code metric guardrails

Research date: 27 August 2026.

## Decision

Simple must not have a universal metric stack. Select a metric only after you name the problem that it can show.
ABC means assignment, branch, and condition in this report.

```text
Dense decisions in one function -> cyclomatic complexity can find the function
Difficult module navigation      -> line count can find the module
Heavy page or package            -> built asset size can protect the limit
Many assignments, calls, tests   -> ABC can describe the mix
```

| Guardrail | Measure | Decision for Simple |
| --- | --- | --- |
| Cyclomatic complexity budget | Independent control-flow paths in a function or module | Use it only for an audit or a baseline limit. Do not optimize for the number. |
| Lines per file | Physical lines, or configured code lines | Do not give a universal limit. Use it only as a weak signal of a navigation or ownership problem. |
| Cascading Style Sheets, JavaScript, or file size | The transfer size or built size of a production asset or entry point | Use it when page weight, package size, or a platform limit is a real need. Do not limit source bytes. |
| ABC score | Assignments, calls, and conditions in imperative code | Do not recommend it for JavaScript or TypeScript. Use a current report only if the repository owns it. |

Use this workflow:

1. Name the observed consequence.
2. Select the nearest metric.
3. Record the current value.
4. Make the smallest useful change.
5. Run the same metric again.
6. Do an independent check of the behavior or performance.

For each gate, record the tool, version, scope, count method, limit, and exceptions.
If the old baseline is large, gate only new or changed code.

## Cyclomatic complexity budgets

Cyclomatic complexity measures the control-flow structure. McCabe defines it from a control-flow graph.
For one connected module, the common formula is `M = E - N + 2`.
The result is a basis of independent paths. It is not the number of all possible executions.

McCabe proposed 10 as a reasonable upper limit. ESLint and Oxlint use a default limit of 20.
These values are tool policies. They are not universal quality limits.
See [McCabe's paper](https://doi.org/10.1109/TSE.1976.233837),
[the ESLint rule](https://eslint.org/docs/latest/rules/complexity), and
[the Oxlint rule](https://oxc.rs/docs/guide/usage/linter/rules/eslint/complexity).

Use the rule only if dense branch logic causes faults, high review cost, or test difficulty.
Also use it if the repository already owns the rule. Prefer the current ESLint or Oxlint rule.

Do not use a project total as a quality target. Each new function starts with a base point.
A helper can lower the highest score but keep almost all decisions.
The score also misses difficult data flow, algorithms, module links, and long code with no branches.

Gill and Kemerer found a `0.949` correlation with lines of code in 834 modules.
Thus, 2 gates can report almost the same evidence.
See [Gill and Kemerer](https://sites.pitt.edu/~ckemerer/CK%20research%20papers/CyclomaticComplexityDensity_GillKemerer91.pdf)
and the repository's [full investigation](./cyclomatic-complexity-audits.md).

Keep cyclomatic complexity as an optional audit signal.
A lower score is useful when the change removes decisions, invalid states, or repeated policy.
Do an independent check of the behavior and the full changed scope.

## Lines per file

ESLint and Oxlint provide `max-lines`. Both rules use a default maximum of 300.
Both documents say that there is no objective maximum. They give a range from 100 to 500.
By default, both rules count blank lines and lines that contain only comments.
See [ESLint `max-lines`](https://eslint.org/docs/latest/rules/max-lines) and
[Oxlint `max-lines`](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines).

The count is easy to repeat. However, format, comments, generated data, tables, schemas, and fixtures can change it.
Fitzpatrick shows equal code with a threefold difference in line count.
His alternative measures size, not architecture or complexity.
See [Applying the ABC Metric to C, C++, and Java](https://www.win.tue.nl/~wstomv/edu/2ip30/references/ABCmetric.pdf).

A hard limit can cause arbitrary file splits, pass-through modules, and more navigation.
Parnas says that a module must hide a design decision that can change.
See [Parnas's paper about module structure](https://doi.org/10.1145/361598.361623).

Do not recommend a line limit from a generic threshold.
If a file is difficult to change, find mixed ownership, unrelated changes, repeated policy, or generated data.
Obey a current repository rule. Add a new rule only after the navigation or ownership problem occurs more than once.

## Cascading Style Sheets, JavaScript, and file size

Separate source size from delivered size:

```text
source file -> build, tree shaking, minification, compression -> delivered assets
```

The bytes in a source file do not reliably show what a user downloads.
A budget for the final asset or page can protect a direct performance need.

Use the current build tool first:

- Webpack can give a warning or an error for each asset and each entry point.
  It uses a default limit of 250,000 bytes for both types.
  The document calls these values performance hints. It recommends an error for production builds.
  See [Webpack performance configuration](https://webpack.js.org/configuration/performance/).
- Lighthouse CI can enforce a `budget.json` file or assert resource sizes and counts.
  Its current configuration uses bytes for assertions and kilobytes in `budget.json`.
  The document gives examples, not universal default values.
  See the [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#budgetsfile).
- Size Limit can measure built files, bundled library cost, Brotli size, and optional JavaScript time.
  Its starter workflow sets the first limit 25 percent above the current total.
  Its document says that byte size alone does not show JavaScript execution cost.
  It also warns that time values can be unstable.
  See [Size Limit](https://github.com/ai/size-limit).

Use an output budget for a page speed goal, a package contract, a platform limit, or a size fault.
Measure the real production build. Cover the applicable page or public entry point.
Use the same compression and build configuration for each comparison.
Add Size Limit or Lighthouse only if the current build tool cannot protect the output.

Do not add separate Cascading Style Sheets and JavaScript limits only because both file types exist.
Use separate limits only if each type has a different consequence or owner.
If runtime cost is the problem, do a performance test with the transfer-size check.

## ABC scores

The assignment, branch, and condition metric uses this vector:

```text
ABC = <assignments, branches, conditions>
magnitude = sqrt(A^2 + B^2 + C^2)
```

In this metric, a branch is usually a function or method call. It is not an `if` branch.
Fitzpatrick says to report the vector with the magnitude. Each language needs its own count rules.

The metric measures imperative software size, not complexity.
It omits architecture, data flow, comments, macros, and other program properties.
The magnitude assumes that the 3 component scales are comparable.
The vector is linear, but the magnitude is not linear.
The paper asks for more validation on large programs. It gives no acceptable limit.
See [Fitzpatrick's paper](https://www.win.tue.nl/~wstomv/edu/2ip30/references/ABCmetric.pdf).

RuboCop uses a default maximum of 17 for Ruby.
It labels values through 17 satisfactory and values above 30 dangerous.
These values are RuboCop policy, not an ABC standard.
RuboCop changed the maximum when it changed the count algorithm.
See [RuboCop `Metrics/AbcSize`](https://docs.rubocop.org/rubocop/latest/cops_metrics.html#metricsabcsize)
and the [RuboCop change](https://github.com/rubocop/rubocop/commit/e43881914297a20719c1bb4d5cf476d882207b86).

The current ESLint and Oxlint rule sets have no mature ABC rule.
The search found one direct JavaScript package, [`@abotta/abc`](https://github.com/aurelienbottazini/abo-abc/blob/1fe0fad7ee3733f1625faeeb980d62c6c1944561/index.js).
It uses the JavaScript Tree-sitter grammar. It has one implementation file and no tests.
This package does not give enough evidence for a Simple gate.

Do not recommend ABC as a JavaScript workflow.
If a repository already reports it, use the vector to find state changes, outward calls, and decisions.
Do not change code only to reduce the magnitude. A file split can keep the total work and add more boundaries.

## Smallest policy for Simple

Simple needs one rule, not 4 permanent budgets:

> Use repository checks first. Add a metric only for an observed consequence that it can measure.
> Treat control-flow and source-size scores as review signals.
> Use a production asset budget only for a named user, platform, or package limit.
> Do an independent check of the result.

Add this policy to specialist guidance only if an evaluation shows a useful gap.
The later [proxy-discipline confirmation](../evals/results/2026-08-27-proxy-discipline-confirmation/README.md)
did not show that gap. Current Simple and the candidate each passed 38 of 40 strict
cells across 2 runs. The policy does not support a new dependency, a universal limit,
or a change to `simple init`.
