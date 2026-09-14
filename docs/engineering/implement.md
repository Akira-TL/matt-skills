## What it does

`implement` builds work that has already been decided. You point it at a ticket, a spec, or the plan you just agreed in the conversation, and it writes the code, drives TDD at the seams where appropriate, runs validation proportionate to the slice, commits the completed atomic implementation state, and then reviews that real commit against a fixed point.

It never reopens the plan. For a ticket, it follows the ticket's local scope and loads its Source Spec and linked ADRs when present, so cross-ticket implementation decisions stay canonical upstream rather than being silently reinvented in a fresh agent session. In an Akira Parallel Task, the coordination layer adds claim and lifecycle handling around the same Matt implementation loop; it does not replace it.

## When to reach for it

You invoke this by typing `/implement` — the agent won't reach for it on its own. It ships with `disable-model-invocation: true`, so no other skill can call it either. Wherever ask-matt or to-tickets says "then `/implement` per ticket", that is an instruction to you, not something the agent will do unprompted.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| An ordinary ticket on the tracker | `/implement #42`, one ticket per session, clearing context between tickets |
| An Akira Parallel Task | `/implement <task>`; the run loads `parallel-execution`, claims the task, follows its Parent Gate and Source Matt Ticket back to the Source Spec, then returns to the normal Matt loop |
| A spec, not yet split up, and the build spans sessions | to-tickets first, then `/implement` per ticket |
| A spec, and the build is small | `/implement` directly against the spec |
| Only in the conversation you just had, and it's still small | `/implement` right there, in the same window |
| Not written down anywhere yet | grill-with-docs, or grill-me if there's no codebase |
| One concrete behaviour you want test-first, with no spec | tdd directly |
| Already built, and you want it checked | code-review directly |

The same-session case is worth naming because the skill's own first line doesn't cover it. `SKILL.md` says "the spec or tickets", which nudges the model to go hunting for a file that doesn't exist. If the plan lives only in the thread, say so when you invoke it.

## Prerequisites

`implement` commits to the branch you are on. It does not create one, and it does not ask. Check you are on the branch you want the work on before you start.

If the tickets came from to-tickets, the tracker they live on was configured by setup-matt-pocock-skills. `code-review` reads the same configuration to find the originating spec at close-out.

## What one run does

A run first resolves the work's evidence chain: ticket → Source Spec → relevant ADRs. If the work is an Akira Parallel Task, the run also loads `parallel-execution`, claims before implementation setup or production-code writes, and resolves Parent Gate → Source Matt Ticket → Source Spec before returning to the normal implementation loop.

The Matt loop remains five beats:

1. Work out the seams from the resolved ticket/spec context.
2. Drive TDD at the pre-agreed seams where it is appropriate, one red-green slice at a time.
3. Run focused tests, typechecking, build or other validators required by the current slice.
4. Commit the completed atomic implementation state through the repository's guarded commit path. A full-project suite is not automatic; run broader validation only when the repository contract, acceptance criteria, scope or risk requires it.
5. Run code-review against the fixed point so it reviews the committed change. Findings that require edits become separate atomic fix commits with the necessary focused re-validation/review.

One run covers one implementation work item. Matt tickets are tracer-bullet vertical slices sized to fit a single fresh context window; their Source Spec pointer is what makes the previous session's context disposable without turning each ticket into a duplicate specification. A Parallel Task adds only execution scope and coordination state around that source chain.

## Pre-agreed seams

The idea the skill runs on is the **seam**: the public boundary you observe behaviour at, without reaching inside. Tests live at seams. Working at a seam agreed before any code is written is what keeps the tests durable, because the implementation underneath can be rewritten without the tests moving.

The word "pre-agreed" is doing real work, and it is also the skill's weakest joint. Nothing inside `implement` agrees the seams. `tdd` is the skill that asks, and it refuses to write a test at an unconfirmed seam. So in practice the agreement happens either upstream in the spec, or in the first exchange of the run. If it happens nowhere, the precondition never fires and the run quietly becomes "just write the code". Naming the seams in the spec is what stops that.

## Common questions

**It finished, but my ordinary Matt ticket is still open and the acceptance criteria are still unchecked.**

That remains expected for ordinary execution: `implement` commits the implementation but does not own the tracker workflow that closes a normal Matt ticket. A Parallel Task is different. After its commit, `parallel-execution` records `ready-for-review` and emits the worker report; the worker still does not mark it `accepted` or close it, because the Coordinator owns Task and Gate review.

**Can I point it at all my tickets at once, or run several in parallel?**

One `/implement` invocation still owns one implementation work item. Raw side-by-side runs in one checkout remain unsafe because they share the working tree, index, and HEAD. In the Akira-maintained environment, coordinated multi-Agent execution is instead routed through the Parallel Coordinator: it publishes Parallel Tasks, assigns execution isolation, and gives each worker a claim/lifecycle protocol before that worker enters `/implement`. Parallelism belongs to the coordination layer, not to a batch mode inside this skill.

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch, which several people find too eager: the code lands before they have had a chance to verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill.

**Why does implementation commit before code-review?**

Because `code-review` reviews a Git range against a fixed point. Committing the finished atomic slice first makes the review target deterministic and prevents the previous failure mode where the review ran before the new work existed in `HEAD`. If review finds a real defect, fix it in a separate atomic commit and review the affected area again. For particularly independent final review, a fresh session or isolated reviewer context is still stronger than the authoring context when the current harness provides one.

**One ticket is exhausting the available context. Am I using it wrong?**

Treat that as evidence that the slice may be too large or its source context too diffuse; do not rely on a fixed token threshold that assumes a particular model or harness. The upstream lever is to right-size tickets in `to-tickets`, keep shared decisions in the Source Spec/ADRs, and split a work item when it no longer fits a reliable implementation/review cycle.

**`/implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by resolving the ticket/spec source chain rather than asking you what to build; a published Matt ticket loads its Source Spec, and a Parallel Task resolves through its Parent Gate and Source Matt Ticket.
- You can see an actual `/tdd` invocation in the trace, not just tests appearing in the diff.
- Focused tests/typechecks/build checks run at the scope justified by the change; a full suite appears only when the project contract or risk warrants it.
- The run reaches an atomic implementation commit on the current branch before code-review, so the review sees the actual Git state.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

`implement` is the build step of the main chain, second from the end:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Its neighbours are to-tickets, which produces the Matt tickets and their Source Spec pointers; TDD, which it uses at appropriate seams; and code-review, which reviews the committed implementation state before the work item is considered closed. In the Akira coordinated path, `parallel-execution` wraps this step with claim, Parent Gate context, lifecycle state, and worker reporting while leaving Matt's implementation method unchanged.

That trust is why wayfinder merges onto the chain at to-spec rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out genuinely small.

ask-matt is the router over the whole set when you are not sure which flow you are in.
