---
name: implement
description: "Implement one already-decided work item from a ticket, spec, or the current conversation."
disable-model-invocation: true
---

Implement one already-decided work item from the referenced ticket/spec or, when no external reference exists, from the concrete plan already established in the current conversation.

## Load the work

Resolve the work item **before any project write**.

- Explicit issue URL, repository-qualified reference, spec path, ticket path, or Parallel Task identifier: resolve exactly that artifact.
- Bare `#<n>` with a configured real issue tracker: resolve issue `<n>` through that repository's configured tracker adapter and confirm the returned title/type before proceeding. Do not reinterpret the token as a checklist/todo index, and do not fall back from an issue lookup to a pull/merge request or unrelated numbered list.
- Bare local ticket number: use it only when the active local effort makes the ticket path unique. If multiple `.scratch/<effort>/issues/<NN>-*.md` candidates exist, or the effort is otherwise ambiguous, stop and require an explicit path rather than guessing.
- No external reference: use the current conversation only when it already contains a concrete, agreed implementation slice; do not invent a ticket artifact merely because none was supplied.

After resolution, echo the canonical work-item title/reference you are about to implement. If the reference cannot be resolved unambiguously, stop before code changes.

- If it is an ordinary implementation ticket, read its **Source Spec** when present, plus any ADRs that source points to. The ticket owns the delivery slice; the Source Spec and ADRs remain canonical for cross-ticket Implementation Decisions and Testing Decisions.
- If it identifies itself as a Parallel Task, has Parallel metadata such as an Execution Map or Parent Gate, or is otherwise a child of a parallel Gate, `parallel-execution` is a required conditional dependency. Load and follow its canonical installed Skill before implementation. Complete that protocol's claim step before creating implementation branches/worktrees or modifying production code, then read the Parent Gate, Source Matt Ticket, Source Spec, and relevant ADRs it points to. If `parallel-execution` cannot be loaded, stop before project writes; do not imitate its claim protocol from memory. `parallel-execution` governs coordination state and reporting; this skill still governs implementation.

## Implement

When the slice is suitable for TDD, `tdd` is a conditional internal dependency: load and follow its canonical Skill before entering the red → green loop. If `tdd` cannot be loaded, do not claim TDD was executed; either report the dependency gap or proceed only when the work does not require the TDD branch.

Run focused tests, typechecking, build or other validators as the current slice requires. Do not automatically expand an ordinary work item into an unrelated full-project suite; run broader validation only when the repository contract, acceptance criteria, scope or risk of the change actually requires it.

When the implementation slice and its required targeted validation are complete, commit that atomic implementation state to the current branch using the repository's guarded commit path. `code-review` is a required close-out dependency: load and follow its canonical Skill against the fixed point so the review sees the actual committed change. If `code-review` cannot be loaded, do not declare the implementation run complete or pretend an ad-hoc review was equivalent.

If review finds issues that require code changes, fix them as separate atomic changes, validate them at the appropriate scope, commit them, and rerun only the affected review/validation needed to establish closure. Do not amend or hide an already meaningful implementation commit merely to make the review history look cleaner.

For an **ordinary tracker-backed Matt ticket**, close the tracker loop only after implementation, required validation, code review and any review fixes are complete. Re-read every Acceptance Criterion against concrete evidence from the final committed state; mark only criteria that are actually satisfied. If all criteria pass, record concise commit / validation / review evidence through the configured tracker adapter, remove the tracker value mapped from `ready-for-agent` where applicable, and close or resolve the ticket. If any criterion is unmet, leave the ticket open and report the exact gap instead of declaring the run complete. This close-out applies only to the implementation ticket, never its parent Spec or parent issue.

If this was an ordinary implementation ticket and the committed implementation plus required review/fixes establish every acceptance criterion, update the ticket artifact so those criteria are checked, then close/resolve it through the repository's configured tracker adapter. If any criterion remains unmet, leave the ticket open and state the unmet criterion explicitly; do not close by inference.

If this was a Parallel Task, return to `parallel-execution` only after the implementation commit and its required review/fixes are complete: record the task as `ready-for-review` and emit its Parallel Task Report. The worker does not accept or close the task; the Coordinator owns that review boundary.
