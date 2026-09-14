## What it does

`tdd` builds a feature or fixes a bug test-first: one failing test, then just enough code to pass it, then the next behaviour. It carries the standards that make that loop produce tests worth keeping — what a good test is, where tests go, what mocks are for, and the three anti-patterns that quietly ruin a suite.

It writes no test at a seam you have not agreed to first. Before any test exists, it names the public boundaries it intends to test at and stops for your confirmation, because testing effort is finite and this is where you spend it on the critical paths instead of on every edge case. The other thing to know is that `tdd` is a **reference**, not a driver. It holds the rules of the loop, and something else (you, or implement) runs the session that applies them.

## When to reach for it

Type `/tdd`, or the agent reaches for it automatically when a task fits — building or fixing observable behaviour test-first, or when you say "red-green" / "red-green-refactor". The latter remains a recognised trigger phrase, but this Skill intentionally runs red → green; refactoring is owned by code-review.

Reach for it when there is a concrete behaviour to build, with an input and an observable output, and you want tests that survive a refactor.

| Your situation | Where to go |
| --- | --- |
| A behaviour with defined inputs and outputs — business logic, a request/response contract, a transformation, validation | `tdd` |
| The behaviour isn't pinned down yet | to-spec, which also agrees the test seams before any code is written |
| The question is really the shape of the interface, not the tests | codebase-design |
| You have a spec or tickets and want the whole build run for you | implement, which applies this TDD loop only to slices that pass the applicability gate |
| Config, wiring, glue, type annotations, straight CRUD delegation | Nothing here fits well — see the open gap below |

That last row is now handled by an applicability gate in the canonical Skill. TDD starts only when there is an observable outcome plus an independent expected result — for example a spec example, external contract, known-good literal or invariant. Pure wiring, configuration, type annotations, mechanical renames and similar changes use proportionate validation instead of manufacturing a tautological test merely to satisfy the method.

## Prerequisites

There is no unconditional internal dependency. `codebase-design` is loaded only when the shape of the test interface itself is in question; ordinary TDD at an already-agreed public seam does not need it. The skill is otherwise stateless and writes no files of its own.

## The loop, and the seam it runs at

Three words carry this skill.

**Red-green.** Write the failing test, then only enough code to pass it. No anticipating the test after next. There is no refactor phase: it was dropped in June 2026 because agents essentially never performed it, and because review and implementation work better as separate sessions. Refactoring belongs to code-review.

**Vertical slice.** One seam, one test, one minimal implementation, then repeat — the first cycle being a **tracer bullet** that proves a single path end to end. The opposite is horizontal slicing: all the tests first, then all the code. Bulk tests verify *imagined* behaviour, they check the shape of things rather than what a user does, and they commit you to a test structure before you understand the implementation.

**Pre-agreed seam.** A seam is the public boundary you observe behaviour at without reaching inside. The rule is absolute: no test at an unconfirmed seam. In the full chain the seams are agreed earlier during to-spec; `tdd` restates and uses those seams instead of asking you to approve the same decision twice, unless the current codebase makes the recorded seam invalid or ambiguous. Invoked on its own, `tdd` presents each candidate with the public boundary, failures it catches, important failures it misses, relative execution/maintenance cost and a recommendation before asking you to choose.

The three anti-patterns it is written to prevent:

| Anti-pattern | The tell |
| --- | --- |
| Implementation-coupled | The test breaks when you rename an internal function, though behaviour did not change. Mocked internal collaborators, asserted call counts, database queries used to verify instead of the interface. |
| Tautological | The expected value is computed the way the code computes it, so the test passes by construction. Expected values have to come from somewhere else — a known-good literal, a worked example, the spec. |
| Horizontal slicing | A batch of tests landed before any implementation. |

Mocks are for system boundaries only — external APIs, time, randomness, sometimes the filesystem or the database. Not your own modules.

## Common questions

**Why does the phrase "red-green-refactor" still trigger it if the loop is red → green?**

Because it is a common user phrase for test-first development, so the trigger remains useful. The canonical description now states the distinction explicitly: this Skill owns red → green, while code-review owns the refactoring pass. The phrase is accepted as intent, not as a claim that all three phases happen inside one TDD cycle.

**It asked me to choose a test seam and I had no idea which to pick.**

That should now be treated as a broken run. When a seam was not already agreed in the Source Spec, the Skill must explain each candidate's observable boundary, what it catches, what it misses, relative execution/maintenance cost and its recommendation before asking you to choose. A list of seam names without trade-offs no longer satisfies the contract.

**It wrote the implementation before the test, even though the skill says red first.**

It happens. One user pushed the model on it and got an unusually honest answer: "I knew the skill said 'one test at a time, watch it fail for the right reason' — I read it. I just defaulted to my normal habit." The skill is written to live with this. No instruction makes an agent comply 100% of the time, and forcing the point harder restricts the agent's creativity for little gain — the loop is worth running even when it is not followed strictly, because the results are still better overall. If strict adherence matters for a particular slice, watch the run rather than trusting the skill to enforce it.

**Should it write browser or end-to-end tests first?**

Usually not, and the skill will not stop it. A user reported the agent writing a Playwright test first, then burning a long loop re-running it and concluding the *test* was broken for a feature that did not exist yet. If a project needs a standing rule here, put it in that project's Agent instructions rather than an executor-specific file. Browser tests are slow enough that the red-green feedback loop often stops paying for itself; a project can explicitly require them only after the underlying behaviour works.

**Does `/tdd` replace `/implement`, or the course's `/do-work`?**

No. `/tdd` documents the methodology; `/implement` is a very simple work→feedback→commit loop and is the direct stand-in for `/do-work`. The course's single `/do-work` step is now split across `/implement`, `/tdd` and `/code-review`. If you are asking which one to run against a ticket, the answer is almost always `/implement`.

**Where did the deep-modules and interface-design guidance go?**

Into codebase-design in v1.0, generalised so several skills share one vocabulary. `refactoring.md` left at the same time; refactoring is now code-review's job, and that skill carries the Fowler smell baseline.

**Does it know about my other tickets?**

No. Run against one ticket, it will happily propose work that belongs to a sibling ticket, because it has no view of the rest of the issue graph ([issue #129](https://github.com/mattpocock/skills/issues/129)). Matt's position is that this is not `tdd`'s job. Passing the spec alongside the ticket helps; right-sizing the tickets in the first place helps more.

## It's working if

- It stops and names the seams it intends to test at, and waits, before any test file exists.
- One test appears, goes red, gets just enough code to pass, and only then does the next test appear — not a batch of tests followed by a batch of code.
- Test names read as capabilities ("user can checkout with valid cart"), not as internals ("checkout calls paymentService.process").
- Expected values in assertions are literals you can trace to the spec, not values recomputed the way the code computes them.
- Renaming an internal function breaks nothing in the suite.
- Mocks appear only at external boundaries — the payment API, the clock — and never around your own modules.

## Where it fits

`tdd` is the engine inside the build step of the main chain, rather than a step of its own:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

to-spec agrees test seams up front where TDD is appropriate, implement applies `tdd` only to slices with observable behaviour and an independent expected result, and code-review owns the later refactoring pass. Its other neighbour is codebase-design, the shared source of the seam and deep-module vocabulary `tdd` speaks. You can also reach for it on its own whenever there is concrete behaviour to build and no full spec in play. When you are unsure which skill fits your situation, ask-matt routes you.
