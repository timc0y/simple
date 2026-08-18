# Engineering precedents

Use a precedent to activate a learned engineering pattern when it makes the present
decision clearer. Do not turn stories into slogans, imitate incidental details, or
let a precedent create requirements absent from the repository.

## Raptor: move complexity inward

SpaceX's Raptor evolution internalised plumbing, cooling, and protection so the
engine imposed less supporting complexity on the vehicle. In software, strengthen
one owning boundary and remove the adapters, parallel paths, and coordination it
makes unnecessary. The component may remain sophisticated while the system becomes
simpler.

## Original iPhone: reject inherited features

The first iPhone omitted many features treated as mandatory by the phone category.
Ask whether a requirement belongs to this user and product now, or merely to the
category's conventional checklist. Omission is valid only when present users,
contracts, and consequences permit it.

## MacBook unibody: remove false separations

Unibody construction replaced assemblies of separate structural parts with a more
coherent owner. In software, apparent modules may be fragments of one responsibility.
Combine them when doing so removes seams, duplicated state, and coordination rather
than creating a god object.

## Apple silicon and functional ownership

Co-design across hardware, operating system, and product can remove negotiation at
internal boundaries. Prefer one accountable owner for one body of knowledge. Keep a
boundary when it represents a real independent lifecycle, consumer, or failure domain.

## Walkman: solve the use, not the category

Sony's Walkman focused on private portable listening instead of reproducing every
feature of a home stereo. Start with the user's actual job. Do not add dashboards,
configuration, collaboration, extension systems, or administrative workflows merely
because comparable products contain them.

## Dynamo: complexity can be earned

Amazon's Dynamo accepted mechanisms such as partitioning, replication, and eventual
consistency to meet concrete availability and scale requirements. Simple is not a
ban on sophistication. When measured constraints require complexity, put it behind
a clear owner and record the obligation, failure model, proof, and reconsideration
condition.

Use the smallest relevant analogy. State it in the output only when it helps the
reader understand or challenge the decision.
