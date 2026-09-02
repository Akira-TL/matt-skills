---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or ticket.

## Load the work

Read the referenced work item before changing code.

- If it is an ordinary implementation ticket, read its **Source Spec** when present, plus any ADRs that source points to. The ticket owns the delivery slice; the Source Spec and ADRs remain canonical for cross-ticket Implementation Decisions and Testing Decisions.
- If it identifies itself as a Parallel Task, has Parallel metadata such as an Execution Map or Parent Gate, or is otherwise a child of a parallel Gate, load the Akira `parallel-execution` skill before implementation. Complete that protocol's claim step before creating implementation branches/worktrees or modifying production code, then read the Parent Gate, Source Matt Ticket, Source Spec, and relevant ADRs it points to. `parallel-execution` governs coordination state and reporting; this skill still governs implementation.

## Implement

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Commit your work to the current branch.

If this was a Parallel Task, return to `parallel-execution` after the commit: record the task as `ready-for-review` and emit its Parallel Task Report. The worker does not accept or close the task; the Coordinator owns that review boundary.
