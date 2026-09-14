---
name: tdd
description: Test-driven development for behaviour with an independent expected result. Use when the user wants to build or fix behaviour test-first, mentions red-green or red-green-refactor, or wants integration tests. This Skill runs red → green; refactoring belongs to code-review.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle — consult them before and during the loop, not after.

When exploring the codebase, read `CONTEXT.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification — "user can checkout with valid cart" tells you exactly what capability exists — and survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Applicability gate

Enter the red → green loop only when the behaviour has both an observable outcome and an **independent expected result**: a spec example, external contract, known-good literal, invariant, or other oracle that can disagree with the implementation. Pure wiring, configuration, type annotations, mechanical renames, and similar changes do not earn a TDD loop merely because tests can be written; when no independent oracle exists, use the repository's proportionate validation instead of manufacturing a tautological test.

## Seams — where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** If the Source Spec already records agreed seams, restate those seams and use them; do not ask the user to approve the same decision again unless the current codebase invalidates or makes the recorded seam ambiguous. When no seam was agreed upstream, present the candidate seams before writing tests and ask for confirmation.

For every candidate seam, give enough information to make the choice meaningful:

- the public boundary and observable behaviour;
- what failures this seam can detect;
- what important failures it cannot detect;
- relative execution and maintenance cost;
- your recommended seam and why.

No test is written at an unconfirmed seam. You cannot test everything — agreeing the seam up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

When the shape of that interface is itself in question — how deep the module is, where the seam belongs, what the interface should expose — `codebase-design` becomes a conditional internal dependency. Load its canonical Skill for the interface vocabulary; if it cannot be loaded, stop that interface-design branch rather than approximating the method from memory.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological** — the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth — a known-good literal, a worked example, the spec.
- **Horizontal slicing** — writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead — one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage (see the `code-review` skill), not the red → green implementation cycle.
