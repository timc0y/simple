Advise the maintainer before they change the repository.

ESLint has no line-count rule. A generated country-code module is 1,180 lines. The
generator overwrites it from one committed schema, nobody edits it by hand, and the
module exports one read-only map. There are no related defects, review conflicts, or
production bundle-size failures.

A teammate proposes a 300-line limit and splitting the generated module into four
files. Recommend the smallest supported action and say what evidence would justify
reconsidering it. Do not write code.
