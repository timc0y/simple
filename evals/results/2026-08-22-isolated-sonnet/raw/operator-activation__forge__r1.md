Based on `SIMPLE.md` and the Theo (T3) lens — real doctrine, not persona:

**What's actually true here:** one internal team, no external consumers, one typed API client that already owns fetching end-to-end, and an explicit reconsider trigger that hasn't fired (no second client, no third-party consumer, no measured latency/over-fetching problem the typed client can't fix). The proposal doesn't name which of those triggers occurred — that's the first problem, independent of any lens.

**Running the three pieces through Theo's questions:**

- **GraphQL gateway** — solves the problem of many heterogeneous consumers needing different shapes from one API. There's one consumer. No named developer or product problem, so this is formalizing a future, not fixing a present one. It also adds a new server-side owner and a schema to maintain — the opposite of "keep the stack modular, only what this product needs."
- **Client-side cache library** — solves redundant fetches / stale UI across a complex tree. `SIMPLE.md` says to preserve "existing error and loading behaviour," and no measured over-fetching exists. Adding one risks a second source of truth for loading/error/cache state sitting alongside what the typed client already gives you — that's ceremony, not a safety net.
- **Bespoke fetch wrapper in front of the typed client** — this is the one Theo would flag hardest. The whole point of "build safety nets, not guard rails" is to let inference and a typed client do the work; a hand-rolled wrapper in front of one is a second, less-trustworthy path around the thing you're supposed to be preserving. Ask: is it independently replaceable, and who's the named consumer? If the answer is "nobody yet," delete it.

**Synthesis:** none of the three earns its place against the current profile. The ordinary path — add or change endpoints inside the existing typed client — already covers the stated obligations (type safety, error/loading behaviour). If there's a real pain point (a second app coming, a specific slow/over-fetching screen), name it and measure it first; that would justify at most one targeted change (e.g., shape one endpoint), not all three pieces at once.

**Recommendation:** reject the bundle as proposed. Ask the author to name the missing capability and point at a measurement or a concrete second consumer. If neither exists, this is three dependencies solving an imagined future, not a present one.

*Lens limit:* this is web-product/TypeScript judgment; it says nothing about regulatory, hardware, or non-TS constraints, none of which apply here per the profile.
