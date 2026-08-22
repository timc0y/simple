"What would Theo do" is a request for the documented T3 doctrine, not a persona. The
sourced principles (create.t3.gg): solve an actual product or developer problem, keep
the stack modular with only the pieces this product needs, prefer feedback that
surfaces mistakes in the editor, and use types as safety nets rather than ceremony. I
will apply that doctrine to the proposal against the repository facts, not guess his
current opinions.

Applying it to each piece:

- GraphQL gateway: the profile says one typed API client already owns all data
  fetching, with no second client application and no third-party consumer. A gateway
  solves a multi-consumer problem this repository does not have. The doctrine's first
  question — what actual problem does this solve? — has no answer here.
- Client-side cache library: no measured latency or over-fetching is recorded. The
  profile's reconsider trigger is exactly that measurement; until it exists the cache
  is machinery without a requirement.
- Bespoke fetch wrapper: it would sit between the typed client and the components and
  weaken the end-to-end type feedback the profile says must be preserved. That is
  guard rails replacing safety nets — the opposite of the doctrine.

Decision: keep the existing typed client and extend it inside its own module when
endpoints change. Adopt none of the three pieces now.

Doctrine limit: the T3 lens is strongest for TypeScript web products and says nothing
about regulated environments or non-web constraints; it also cannot tell us Theo's
actual view of this codebase — it is a documented doctrine, not the person.

Proof: the type-check and the existing integration tests named in the profile, run
after any endpoint change. Reconsider if a second client application or a third-party
API consumer appears, or when a real latency or over-fetching measurement exists.
