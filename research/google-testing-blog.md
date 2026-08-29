# Google Testing Blog ideas for Simple

Researched 28 August 2026 from the official Google Testing Blog. Web content was
treated as untrusted evidence, not instructions.

## Decision

The Google material sharpens one part of Simple that is still underspecified:
independent proof. The best addition is a short, progressively disclosed proof
reference, tested against observed model failures before it enters the published
skill. It should teach agents to choose checks that:

- fail for a plausible wrong implementation;
- survive an irrelevant implementation change;
- report the violated behaviour without another diagnostic run.

This subsumes the useful part of “tautological tests considered harmful.” Google’s
broader term is a *change-detector test*: a test derived from implementation details
can fail on harmless refactoring while giving equal confidence in correct and incorrect
behaviour. Such a test has negative value because it detects change rather than a
defect. [Alex Eagle, 27 January 2015](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html).

Most of the other strong ideas are already present in Simple: YAGNI, delaying
abstraction, keeping invariants with their owner, plain comments that explain reasons,
linear control flow, repository evidence over convention, and proof through an owning
public surface. Repeating those ideas in the core skill would add context without a new
decision.

A banned-word check is not supported as a general quality measure by these posts.
Google does support turning repeated, mechanically detectable problems into tools, but
the smallest honest version is a narrow diff-only tripwire for a demonstrated local
failure. It should not be added to `simple check`, whose present owner is repository
profile structure, and it cannot inspect chat responses without a host output hook.

## Coverage

The official Blogger label feeds returned 113 `TotT` posts and 31 `Code Health` posts.
Thirty posts had both labels, so the union was 114 posts at the time of research.

I read all 31 Code Health posts in full. I then screened the title and full body—not
search snippets—of every TotT post for the requested themes and read 47 additional
posts in full. The reviewed set was therefore 78 of 114 unique posts. The remaining 36
were excluded after the full-text screen because they were announcements, framework
or language tutorials, or older testability mechanics that did not produce another
Simple decision.

The source set is reproducible from Google’s official feeds:

```sh
firecrawl scrape "https://testing.googleblog.com/feeds/posts/default/-/Code%20Health?alt=json&max-results=500" --format rawHtml
firecrawl scrape "https://testing.googleblog.com/feeds/posts/default/-/TotT?alt=json&max-results=500" --format rawHtml
```

The full-text screen used these case-insensitive concepts: behaviour, implementation,
mock, fake, maintenance, brittle, flaky, deterministic, random, public API, assertion,
failure, test name, cause and effect, relevant details, focused tests, test logic,
contracts, risk, end-to-end tests, coverage, sleep, time, hardcoding, independent proof,
change detectors, test data, test doubles, state changes, service calls, test fidelity,
and the test pyramid.

The 47 additional posts covered:

- Proof and scope: [UI tests through the user surface](https://testing.googleblog.com/2020/10/testing-on-toilet-testing-ui-logic.html), [service contracts](https://testing.googleblog.com/2018/11/testing-on-toilet-exercise-service-call.html), [end-to-end tests](https://testing.googleblog.com/2016/09/testing-on-toilet-what-makes-good-end.html), [change detectors](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html), [public APIs](https://testing.googleblog.com/2015/01/testing-on-toilet-prefer-testing-public.html), [logic in tests](https://testing.googleblog.com/2014/07/testing-on-toilet-dont-put-logic-in.html), [risk-driven testing](https://testing.googleblog.com/2014/05/testing-on-toilet-risk-driven-testing.html), [effective testing](https://testing.googleblog.com/2014/05/testing-on-toilet-effective-testing.html), [behaviours rather than methods](https://testing.googleblog.com/2014/04/testing-on-toilet-test-behaviors-not.html), [good tests](https://testing.googleblog.com/2014/03/testing-on-toilet-what-makes-good-test.html), [behaviour rather than implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html), [coverage data](https://testing.googleblog.com/2008/03/tott-understanding-your-coverage-data.html), [test quantity](https://testing.googleblog.com/2008/02/in-movie-amadeus-austrian-emperor.html), and [refactoring tests in the red](https://testing.googleblog.com/2007/04/tott-refactoring-tests-in-red.html).
- Test construction and diagnostics: [robust values](https://testing.googleblog.com/2026/06/choosing-values-for-robust-tests.html), [actionable failures](https://testing.googleblog.com/2024/05/test-failures-should-be-actionable.html), [expressive test APIs](https://testing.googleblog.com/2024/04/how-i-learned-to-stop-writing-brittle.html), [narrow assertions](https://testing.googleblog.com/2024/04/prefer-narrow-assertions-in-unit-tests.html), [relevant details](https://testing.googleblog.com/2023/10/include-only-relevant-details-in-tests.html), [DAMP tests](https://testing.googleblog.com/2019/12/testing-on-toilet-tests-too-dry-make.html), [relevant mock arguments](https://testing.googleblog.com/2018/06/testing-on-toilet-only-verify-relevant.html), [focused tests](https://testing.googleblog.com/2018/06/testing-on-toilet-keep-tests-focused.html), [test-data builders](https://testing.googleblog.com/2018/02/testing-on-toilet-cleanly-create-test.html), [local cause and effect](https://testing.googleblog.com/2017/01/testing-on-toilet-keep-cause-and-effect.html), [descriptive test names](https://testing.googleblog.com/2014/10/testing-on-toilet-writing-descriptive.html), [data-driven traps](https://testing.googleblog.com/2008/09/tott-data-driven-traps.html), and [continuing versus fatal assertions](https://testing.googleblog.com/2008/07/tott-expect-vs-assert.html).
- Doubles and contracts: [avoiding mocks for fidelity](https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html), [not mocking types one does not own](https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html), [verifying state-changing calls](https://testing.googleblog.com/2017/12/testing-on-toilet-only-verify-state.html), [test-double distinctions](https://testing.googleblog.com/2013/07/testing-on-toilet-know-your-test-doubles.html), [fakes](https://testing.googleblog.com/2013/06/testing-on-toilet-fake-your-way-to.html), [mock overuse](https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html), [state versus interactions](https://testing.googleblog.com/2013/03/testing-on-toilet-testing-state-vs.html), and [containing the environment](https://testing.googleblog.com/2008/10/tott-contain-your-environment.html).
- Determinism: [simulated time](https://testing.googleblog.com/2008/10/tott-simulating-time-in-jsunit-tests.html), [synchronisation without sleeps](https://testing.googleblog.com/2008/08/tott-sleeping-synchronization.html), [isolated resources](https://testing.googleblog.com/2008/04/tott-avoiding-flakey-tests.html), and [time as an input](https://testing.googleblog.com/2008/04/tott-time-is-random.html).
- Broader engineering and review: [preparatory refactoring](https://testing.googleblog.com/2026/07/prefactoring-clear-way-for-your-new.html), [context in review replies](https://testing.googleblog.com/2026/05/code-review-responses-add-context-when.html), [TDD](https://testing.googleblog.com/2026/03/the-way-of-tdd.html), [functional core and imperative shell](https://testing.googleblog.com/2025/10/simplify-your-code-functional-core.html), [SMURF test trade-offs](https://testing.googleblog.com/2024/10/smurf-beyond-test-pyramid.html), [small shell scripts](https://testing.googleblog.com/2023/10/shell-scripts-stay-small-simple.html), [visual trade-offs](https://testing.googleblog.com/2023/09/communicate-design-tradeoffs-visually.html), and [hardcoded library values](https://testing.googleblog.com/2020/08/testing-on-toilet-avoid-hardcoding.html).

## Candidate ideas

### 1. Make independent proof discriminative

- **Sources:** Alex Eagle, 27 January 2015, [Change-Detector Tests Considered Harmful](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html); Rich Martin, 7 May 2014, [Effective Testing](https://testing.googleblog.com/2014/05/testing-on-toilet-effective-testing.html); Andrew Trenk, 5 August 2013, [Test Behavior, Not Implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html); Kai Kent, 4 April 2024, [Prefer Narrow Assertions](https://testing.googleblog.com/2024/04/prefer-narrow-assertions-in-unit-tests.html).
- **Principle:** A useful check distinguishes correct from plausible incorrect behaviour while ignoring details outside the contract. Fidelity, resilience, and diagnostic precision all matter.
- **Observable failure:** A refactor breaks many tests although behaviour is unchanged, or a broken implementation passes because the test reproduced the same logic or call sequence.
- **Current Simple coverage:** Partial and strong. The core already asks for a surface independent enough to distinguish behaviour from implementation, and the architecture reference says to prove through the owner’s public surface. It does not give a reviewer a concrete falsification test.
- **Smallest change:** In a proof reference, add: “Name one plausible wrong implementation. The check must fail for it, pass after an irrelevant refactor, and assert only the behaviour at stake.” Route to that reference only for test or proof selection.
- **Risk:** Treating “public API” as a universal rule can hide important resource, performance, ordering, or concurrency contracts. Those interactions are behaviour when their consequences matter.

### 2. Make a failure actionable on its first run

- **Sources:** Titus Winters, 6 May 2024, [Test Failures Should Be Actionable](https://testing.googleblog.com/2024/05/test-failures-should-be-actionable.html); Andrew Trenk, 16 October 2014, [Writing Descriptive Test Names](https://testing.googleblog.com/2014/10/testing-on-toilet-writing-descriptive.html); Ben Yu, 11 June 2018, [Keep Tests Focused](https://testing.googleblog.com/2018/06/testing-on-toilet-keep-tests-focused.html).
- **Principle:** The test name and failure output should identify the scenario, expected outcome, and observed mismatch without adding logging and rerunning.
- **Observable failure:** A failing check says only `false`, reports a giant unrelated object diff, or combines several scenarios so the broken behaviour is unclear.
- **Current Simple coverage:** Partial. Simple asks for meaningful evidence and clear handoffs, but not diagnostic quality of the check itself.
- **Smallest change:** Add one proof-reference sentence: “Prefer one named behaviour and an assertion whose failure reports the relevant expected and actual values.”
- **Risk:** One behaviour does not always mean one function call. Splitting an end-to-end user journey into artificial micro-tests can destroy fidelity.

### 3. Choose values that can expose wiring mistakes

- **Source:** Radion Khait, 4 June 2026, [Choosing Values for Robust Tests](https://testing.googleblog.com/2026/06/choosing-values-for-robust-tests.html).
- **Principle:** Use non-default values and distinct values for different inputs; add boundary or missing-value cases only where they exercise a different consequence.
- **Observable failure:** A setter that ignores its value still passes because the expected value is `0`, empty, or another default; swapped parameters pass because both inputs are identical.
- **Current Simple coverage:** Absent.
- **Smallest change:** Add one example to the proof reference: “Use `key=1, value=2`, not two equal or default values, when the distinction is what the check must prove.”
- **Risk:** Turning this into a Cartesian input matrix recreates the data-driven test trap and adds redundant cases.

### 4. Keep cause, effect, and relevant data together

- **Sources:** Ben Yu, 31 January 2017, [Keep Cause and Effect Clear](https://testing.googleblog.com/2017/01/testing-on-toilet-keep-cause-and-effect.html); Dagang Wei, 30 October 2023, [Include Only Relevant Details in Tests](https://testing.googleblog.com/2023/10/include-only-relevant-details-in-tests.html); Derek Snyder and Erik Kuefler, 3 December 2019, [Tests Too DRY? Make Them DAMP!](https://testing.googleblog.com/2019/12/testing-on-toilet-tests-too-dry-make.html).
- **Principle:** A test should show the relevant input, action, and expected result locally. Hide construction noise, not facts needed to understand the assertion. Repetition can be cheaper than indirection in tests.
- **Observable failure:** A reader must jump through shared setup and helpers to discover why an expected value is correct, or mentally execute a loop to understand the cases.
- **Current Simple coverage:** The writing guidance has the same locality rule for reasons and evidence, but it does not apply it explicitly to tests.
- **Smallest change:** Add a short “Readable proof” paragraph to the proof reference; do not add a general anti-DRY rule to the core.
- **Risk:** Literal repetition can itself hide a shared invariant. Extract stable construction noise when the test still states every fact relevant to its behaviour.

### 5. Prefer real behaviour, then an owner-maintained fake, then a mock

- **Sources:** Andrew Trenk and Dillon Bly, 27 February 2024, [Increase Test Fidelity by Avoiding Mocks](https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html); Stefan Kennedy and Andrew Trenk, 16 July 2020, [Don’t Mock Types You Don’t Own](https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html); Ben Yu, 27 November 2018, [Exercise Service Call Contracts](https://testing.googleblog.com/2018/11/testing-on-toilet-exercise-service-call.html); Jonathan Rockway and Andrew Trenk, 28 June 2013, [Fake Your Way to Better Tests](https://testing.googleblog.com/2013/06/testing-on-toilet-fake-your-way-to.html).
- **Principle:** Use the highest-fidelity dependency that remains reliable and proportionate. Prefer the real implementation, then a fake maintained with the real contract, and use a mock when the interaction is the contract or no better surface exists.
- **Observable failure:** Tests pass against handwritten assumptions that have drifted from an external API, or fail whenever an internal call sequence changes.
- **Current Simple coverage:** Partial. The architecture ladder prefers existing and native mechanisms but says nothing about test doubles.
- **Smallest change:** Put the three-step dependency order in the proof reference with the exception for consequential call count, order, latency, or side effects.
- **Risk:** Real dependencies can make tests slow or flaky; fakes create another implementation to maintain. “Never mock” would be as untruthful as mocking everything.

### 6. Control nondeterminism instead of waiting for it

- **Sources:** Google Testing Blog, 3 April 2008, [Time Is Random](https://testing.googleblog.com/2008/04/tott-time-is-random.html); Google Testing Blog, 21 August 2008, [Sleeping != Synchronization](https://testing.googleblog.com/2008/08/tott-sleeping-synchronization.html); Google Testing Blog, 17 April 2008, [Avoiding Flakey Tests](https://testing.googleblog.com/2008/04/tott-avoiding-flakey-tests.html).
- **Principle:** Make time and other nondeterministic inputs controllable, wait for explicit state changes rather than elapsed guesses, and give tests isolated ephemeral resources.
- **Observable failure:** A test passes locally but fails under load, depends on wall-clock boundaries, sleeps longer than necessary, or collides with another test’s files or database state.
- **Current Simple coverage:** Absent as test guidance.
- **Smallest change:** Add one proof-reference bullet: “Control clocks, scheduling, randomness, and resources; wait on the condition with a failure timeout, never sleep as synchronization.”
- **Risk:** Injecting a clock or scheduler everywhere is needless when the code has no temporal behaviour. Apply the rule at observed nondeterministic boundaries.

### 7. Match proof cost to the actual failure consequence

- **Sources:** Peter Arrenbrecht, 30 May 2014, [Risk-Driven Testing](https://testing.googleblog.com/2014/05/testing-on-toilet-risk-driven-testing.html); Adam Bender, 21 September 2016, [What Makes a Good End-to-End Test?](https://testing.googleblog.com/2016/09/testing-on-toilet-what-makes-good-end.html); Adam Bender, 15 October 2024, [SMURF: Beyond the Test Pyramid](https://testing.googleblog.com/2024/10/smurf-beyond-test-pyramid.html).
- **Principle:** Select proof by the risk it must reduce. Use an end-to-end check only for an important cross-system consequence that smaller checks cannot establish, and account for speed, maintenance, resource use, reliability, and fidelity.
- **Observable failure:** A full test pyramid gives confidence while missing the real data-loss or compatibility risk, or an expensive end-to-end suite duplicates facts already proved cheaply.
- **Current Simple coverage:** Strong in intent: present obligations, scale, and failure consequences drive the design, and proof should be independent. The current repository also contains an evaluated candidate for matching proof shape to starts, fixes, and improvements.
- **Smallest change:** Do not add SMURF or the test pyramid to the core. Put one risk-to-surface rule in the proof reference and validate it with an eval where a unit test cannot establish a named cross-system consequence.
- **Risk:** “Risk-driven” can become permission to omit ordinary regression checks. The risk and why the selected surface discriminates it must be explicit.

### 8. Treat coverage and other proxies as clues

- **Source:** Google Testing Blog, 6 March 2008, [Understanding Your Coverage Data](https://testing.googleblog.com/2008/03/tott-understanding-your-coverage-data.html).
- **Principle:** High statement coverage follows from some well-tested code but does not prove it. Coverage cannot reveal missing behaviour and can miss untested operands, inputs, and paths.
- **Observable failure:** A suite reports 100% coverage while omitting a valid error result or boundary condition.
- **Current Simple coverage:** Substantially covered by independent proof and by the repository’s proxy-discipline evaluation work: evidence nearest the consequence should decide, while indirect measures remain clues.
- **Smallest change:** None unless the proxy-discipline eval earns its candidate wording. Do not add a coverage target.
- **Risk:** Rejecting coverage entirely loses a useful way to find unexercised code. Use it to find questions, not to answer whether behaviour is correct.

### 9. Keep review feedback specific, reasoned, and prioritised

- **Sources:** Felipe Sodré and Adam Bender, 22 August 2023, [Better Feedback Makes for Faster Reviews](https://testing.googleblog.com/2023/08/testing-on-toilet-presents.html); Liz Kammer, Maggie Hodges, and Ambar Murillo, 6 November 2019, [Respectful Reviews == Useful Reviews](https://testing.googleblog.com/2019/11/code-health-respectful-reviews-useful.html); Saicharan Nimmala, 12 May 2026, [Code Review Responses: Add Context When It Counts](https://testing.googleblog.com/2026/05/code-review-responses-add-context-when.html).
- **Principle:** Review the artifact rather than the author; state the reason and trade-off; distinguish required findings from optional suggestions; record non-obvious resolution context.
- **Observable failure:** A comment says only “this makes no sense,” the author mechanically applies it without understanding, or future readers cannot recover why an alternative was rejected.
- **Current Simple coverage:** Mostly covered. Simple reviews lead with findings, evidence, consequence, risk, and next action; its writing mode names actors only when responsibility matters.
- **Smallest change:** None in the core. If review evals show ambiguity between blockers and suggestions, add a severity field to that output contract rather than a general etiquette section.
- **Risk:** Mandatory severity labels and response templates can turn small reviews into ceremony.

### 10. Automate only repeated, objective feedback

- **Source:** Max Kanat-Alexander, 3 April 2017, [Google’s Internal Code Quality Efforts](https://testing.googleblog.com/2017/04/code-health-googles-internal-code.html).
- **Principle:** Google combines guidance, review, formatters, tools that detect or prevent bad practices, and unused-code deletion. The inference for Simple is to automate a rule only when the failure is repeated and mechanically distinguishable.
- **Observable failure:** Reviewers repeatedly spend time identifying the same exact prose or code pattern, and the correction is deterministic.
- **Current Simple coverage:** The write hook already reminds the model to review Markdown and added comments; `simple check` deterministically validates route and profile shape. The hook cannot inspect an edit before it runs or inspect the final chat response.
- **Smallest change:** None now. After a repeated corpus of failures exists, add a diff-only checker at the owning repository’s lint or review boundary. Report exact file and line; ignore code, identifiers, quotations, generated files, and unchanged prose.
- **Risk:** A broad banned-word list produces false positives and synonym substitution. It also conflicts with Simple today if it bans terms the skill itself prescribes. Do not overload `simple check` or claim that a repository check governs chat output.

### 11. Preserve invariants at the owning interface

- **Source:** Marek Kiszkis, 25 July 2018, [Make Interfaces Hard to Misuse](https://testing.googleblog.com/2018/07/code-health-make-interfaces-hard-to.html).
- **Principle:** Do not make callers remember hidden setup, cleanup, ordering, or validity rules that the owner can enforce through its type or ordinary operation.
- **Observable failure:** Correct use requires a caller to read documentation and remember to initialise, allocate, clean up, or validate before every call.
- **Current Simple coverage:** Already explicit: keep policy and validation at the owning boundary, preserve the owner, use native mechanisms, and supply only the missing precondition.
- **Smallest change:** None.
- **Risk:** Making an interface “foolproof” can add validation and types for impossible or consequence-free misuse. Present callers and failure consequences still decide.

### 12. Delay abstractions until shared knowledge is real

- **Sources:** Dan Maksimovich, 28 May 2024, [Don’t DRY Your Code Prematurely](https://testing.googleblog.com/2024/05/dont-dry-your-code-prematurely.html); Marc Eaddy, 14 August 2017, [Eliminate YAGNI Smells](https://testing.googleblog.com/2017/08/code-health-eliminate-yagni-smells.html); Stefan Kennedy, 9 December 2020, [Separation of Concerns? That’s a Wrap!](https://testing.googleblog.com/2020/12/testing-on-toilet-separation-of.html).
- **Principle:** Similar syntax is not necessarily shared knowledge. Add an abstraction or external-API wrapper only when present uses change together or the wrapper clearly removes domain pollution and change propagation.
- **Observable failure:** One implementation has an interface, every caller passes the same unused option, or two distinct concepts become coupled because their current validation happens to match.
- **Current Simple coverage:** Already exact. The implementation ladder, “extract shared knowledge, not incidental syntax,” named-consumer test, and YAGNI stop conditions are stronger and more repository-specific.
- **Smallest change:** None.
- **Risk:** Copying Google’s wrapper or domain-object examples into Simple could make agents introduce the very speculative abstractions Simple is meant to prevent.

### 13. Keep changes focused; separate preparation only when it clarifies proof

- **Sources:** Elliotte Rusty Harold, 16 July 2024, [In Praise of Small Pull Requests](https://testing.googleblog.com/2024/07/in-praise-of-small-pull-requests.html); Rahul Singal, 21 July 2026, [Prefactoring](https://testing.googleblog.com/2026/07/prefactoring-clear-way-for-your-new.html).
- **Principle:** A focused change is easier to review, diagnose, revert, and describe. Separate preparatory refactoring from behaviour when each step is independently safe and the split makes the feature easier to inspect.
- **Observable failure:** A reviewer cannot tell which changed lines are structural preparation and which alter behaviour, or a rollback must remove unrelated cleanup.
- **Current Simple coverage:** Partial. Refactoring guidance requires every changed line to serve the outcome or remove displaced complexity; Ponytail already asks for the fewest files and shortest working diff.
- **Smallest change:** No general small-PR rule. If observed reviews repeatedly mix structural and behavioural changes, add one sentence to `refactoring.md`: “Separate preparation only when both changes have independent proof and the split reduces review ambiguity.”
- **Risk:** Forced commit or PR splitting creates integration states, review latency, and ceremony. Focus matters more than line count.

## Smallest coherent experiment

Do not copy all thirteen candidates into the runtime skill. Test one progressively
disclosed `references/proof.md` against cases that currently elicit tautological,
mock-heavy, flaky, or non-actionable checks. Route to it with one core bullet only for
selecting or reviewing proof.

A minimal candidate reference is:

```markdown
# Proof

Start from the failure consequence and use the nearest surface that can observe it.
Name one plausible wrong implementation: the check must fail for it and survive an
irrelevant refactor. Assert only the behaviour at stake, with a name and failure output
that identify the mismatch without another run.

Keep relevant input, action, and outcome together. Prefer literal, non-default, and
distinct values over recomputing the implementation. Use the real dependency, then an
owner-maintained fake; mock only when no better surface exists or the interaction is
itself the contract. Control clocks, scheduling, randomness, and resources; wait for
state with a failure timeout rather than sleeping.
```

Run an equal A/B evaluation before publishing it. A tie loses: Simple already has the
essential independent-proof instruction, so the extra retrieval cost is justified only
if the reference changes test choices or catches a measured failure.
