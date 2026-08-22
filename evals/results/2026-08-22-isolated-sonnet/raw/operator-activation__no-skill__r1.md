Theo's reaction would be swift rejection — this is a textbook case of adding infrastructure to solve problems you don't have yet.

**Kill all three pieces, for the same underlying reason:**

- **GraphQL gateway** — You have one internal client and one typed API. GraphQL earns its keep when you have multiple consumers with divergent data needs, or you're fighting over-fetching that a typed REST client can't express. Neither is true here (`Reconsider when` in SIMPLE.md literally names both conditions, and neither has happened). A gateway also means running and operating a new service for zero consumers.

- **Client-side cache library** (React Query/Apollo/etc.) — These exist to manage cache invalidation, dedupe, and stale-while-revalidate semantics across many components hitting many endpoints unpredictably. For one team's internal app, "wrong fetch shows stale rows, retry is safe" is an explicitly acceptable failure mode. You'd be importing a whole invalidation-bug surface to solve a problem whose current cost is "hit refresh."

- **Bespoke fetch wrapper** — This is the most damning one. You already have a typed API client that owns fetching end-to-end. A wrapper "in front of" it either duplicates what the client does or breaks the type-safety chain the repo explicitly wants preserved. Theo's line here would be something like: *you don't wrap a good abstraction in a worse one just because it's new*.

**What he'd actually say to do:** if there's a real pain point — a specific endpoint that over-fetches, a specific screen with real latency — fix *that*, inside the existing typed client. That's the "Ordinary path" this repo already sanctions. Three new dependencies is not a fix, it's a rewrite looking for a justification.

**The tell that this proposal is premature:** nothing in the reality section changed. No second consumer, no measured latency problem, no third-party API story. Without one of those, this is complexity added on spec — exactly the pattern Theo built a reputation calling out (see: his general stance on tRPC-over-GraphQL for single-client apps, and "you probably don't need X" takes on state/cache libraries).

**Verdict:** reject the proposal as written. Ask the proposer what specific, measured problem it solves — if they can point to a real one, solve *that* narrowly inside the current client; if they can't, this doesn't ship.
