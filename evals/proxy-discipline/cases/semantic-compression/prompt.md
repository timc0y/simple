Advise the maintainer which implementation is simpler.

Three fixed order statuses must map to three labels and reject unknown input. Option A
is seven source lines but adds a generic rule-engine dependency plus a configuration
file. Option B is a 14-line switch in the existing order owner using only the language.
Both options pass the same four behaviour tests. There are no other consumers and no
requirement for configurable rules.

The maintainer prefers option A because it has fewer lines. Choose an option and explain
the decision in a short paragraph.
