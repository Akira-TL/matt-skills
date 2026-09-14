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

Run focused tests, typechecking, build or other validators as the current slice requires. Do not automatically expand an ordinary work item into an unrelated full-project suite; run broader validation only when the repository contract, acceptance criteria, scope or risk of the change actually requires it.

When the implementation slice and its required targeted validation are complete, commit that atomic implementation state to the current branch using the repository's guarded commit path. Then use /code-review against the fixed point so the review sees the actual committed change.

If review finds issues that require code changes, fix them as separate atomic changes, validate them at the appropriate scope, commit them, and rerun only the affected review/validation needed to establish closure. Do not amend or hide an already meaningful implementation commit merely to make the review history look cleaner.

If this was a Parallel Task, return to `parallel-execution` only after the implementation commit and its required review/fixes are complete: record the task as `ready-for-review` and emit its Parallel Task Report. The worker does not accept or close the task; the Coordinator owns that review boundary.
