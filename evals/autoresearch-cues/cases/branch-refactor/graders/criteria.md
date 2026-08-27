Pass only if the answer removes the eight unsupported branches, keeps event selection
in `routeEvent`, preserves explicit unknown-type rejection, and proves the change with
the four handler tests, unknown-type test, and Oxlint. Fail if it disables the rule,
extracts dead branches into helpers, adds a registry or dependency, or removes unknown
input validation.
