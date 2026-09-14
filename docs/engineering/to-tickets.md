## What it does

`to-tickets` takes a plan, a spec, or the conversation you are in, and breaks it into a set of **tickets** on your issue tracker. Each ticket declares its **blocking edges** — the other tickets that have to finish before it can start.

Every ticket is a **tracer bullet**: a narrow but complete path through every layer of the change — schema, API, UI, tests — that can be demoed on its own the moment it lands. That is the constraint that makes it behave differently from the obvious way to split work, which is to cut one layer at a time and integrate at the end. It also sizes each ticket to fit in a single fresh context window, while preserving a **Source Spec** pointer so the new session can recover the canonical cross-ticket implementation and testing decisions instead of duplicating them into every ticket.

## When to reach for it

You invoke this by typing `/to-tickets` — the agent won't reach for it on its own.

| Where you are | What to run |
| --- | --- |
| You have a spec issue and the build spans several sessions | `/to-tickets`, or `/to-tickets #<spec_issue>` |
| The plan is only in the conversation, never written up | `/to-tickets` reads the thread directly — no spec needed |
| The whole change fits in one context window | implement — skip the tickets |
| Nothing is decided yet | grill-with-docs, then to-spec |
| A wayfinder map has cleared | to-spec first, to collapse the map, then `/to-tickets` |

Tickets that `to-tickets` produced are agent-ready by construction. Don't run triage over them — triage is for work that arrived from someone else.

## Prerequisites

`to-tickets` publishes into the repository's configured tracker, so the user-invoked `setup-matt-pocock-skills` Skill must already have established both the tracker and workflow-role mapping. If either is absent, to-tickets stops and tells you to run setup explicitly; it does not invoke setup itself. A real tracker such as GitHub or Linear, or local markdown under `.scratch/`, are all supported.

## Tracer bullets, not layers

A **horizontal** slice ships one layer of the change. Nothing works until every layer has landed, and each ticket's acceptance criteria have to reach into work that another ticket owns. A **vertical** slice — the tracer bullet — ships one thin path through all the layers at once, so it is verifiable alone and owns everything it grades.

This is the rule people break most often, and the consequences are well documented. One team ran a 26-ticket stack sliced by layer — corpus, producer, aggregator, selector — and got roughly twenty agent runs per closed ticket, about three quarters of them rework. Their own post-mortem traced every failure class back to the horizontal slicing rather than to the implementations.

Two things happen before anything is published. `to-tickets` looks for prefactoring — "make the change easy, then make the easy change" — and orders that work first. Then it presents the breakdown as a numbered list and quizzes you on it: is the granularity right, are the blocking edges real, should anything merge or split. Nothing reaches the tracker until you approve, and that quiz is the place to push back.

## Blocking edges

The edges are the point of the artifact. They read two ways depending on the tracker:

| Tracker | Where the edges live | How you work them |
| --- | --- | --- |
| Local markdown | One file per ticket under `.scratch/<feature>/issues/<NN>-<slug>.md`, with machine-readable `Blocked by:` and `Status:` fields near the top | Work the open/unblocked files; `Status:` uses the configured local value for canonical role `ready-for-agent` |
| A real tracker (GitHub, Linear) | Native blocking links, or sub-issues where the tracker has them | Any ticket whose blockers are done is on the **frontier** and can be grabbed |

The edges live in the ticket either way. When the tickets came from a published spec, the Source Spec lives there too. A ticket is independently executable, but it is not a second copy of the spec: shared architecture, interfaces, schema/API contracts, and testing decisions remain in the spec or its linked ADRs.

The medium only decides how the frontier is represented. `to-tickets` produces the artifact; ordinary execution works that frontier with one `/implement` session per ticket, while an external coordination layer can further split those tickets into parallel execution tasks without changing what the Matt tickets mean.

## The wide-refactor exception

One shape breaks the tracer-bullet rule. A **wide refactor** is a single mechanical change — rename a column, retype a shared symbol — whose **blast radius** fans across the whole codebase, so one edit breaks thousands of call sites and no vertical slice can land green.

`to-tickets` sequences that as **expand–contract** instead:

- **Expand** — add the new form beside the old, so nothing breaks.
- **Migrate** — move call sites over in batches sized by blast radius (per package, per directory), one ticket per batch, each blocked by the expand. CI stays green because the old form still exists.
- **Contract** — delete the old form once no caller remains, in a ticket blocked by every migrate batch.

Where even the batches can't stay green alone, they share an integration branch and all block a final integrate-and-verify ticket. Green is promised only there.

## Common questions

**It produced twelve tickets for a three-line change.**
Over-decomposition is the most reported friction on this skill, and it is consistent across practitioners: the model defaults to atomic units and loses the grouping that would make them meaningful. The quiz step exists for exactly this — ask it to merge, and it will. The deeper answer is that the tickets have a floor: if the whole change fits in one context window, you don't need this skill at all. Go straight to implement.

**The tickets came out one per layer — all the schema in one, all the API in another.**
This is the failure the vertical-slice rule is written against, and the skill still produces it sometimes. Catch it at the quiz step by asking one question per ticket: what can I demo when this is done? A ticket with no answer is a horizontal slice. Some people add a "demo path" line to each ticket for this reason, and report it nudges the model toward vertical decomposition.

**On GitHub the tickets weren't created as sub-issues of the spec issue.**
The current GitHub tracker adapter prefers the CLI's native sub-issue operations: create with `gh issue create --parent <n>`, or attach an existing issue with `gh issue edit <child> --parent <n>` / `gh issue edit <parent> --add-sub-issue <child>`. If a run still emits unlinked issues, that run did not follow the configured tracker contract; repair the links with the same native operation rather than treating body text as equivalent.

**"Blocked by" was written into the issue body instead of a real blocking link.**
On current GitHub CLI, native dependency edges are the default: `gh issue create --blocked-by 12,15` at creation time or `gh issue edit <child> --add-blocked-by 12,15` afterwards. Because blockers are published first, their identifiers are available when each dependent ticket is created. Body text is only the compatibility fallback when the active tracker or CLI cannot represent a native edge.

**Where do the local tickets go? The v1.1 notes said a root-level `tickets.md`.**
They did, and that was a bug — a single shared file also raced when parallel Agents wrote to it. Local mode now writes one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, in dependency order, matching the local tracker contract. `Blocked by:` and `Status:` are plain machine-readable header fields rather than bold prose; `Status:` uses the configured local value mapped from canonical role `ready-for-agent`. The `NN` prefix is a real ticket ID, so `/implement 03` works instead of retyping a long title.

**It kept truncating when it tried to read my spec.**
A very large spec can outgrow what a tracker issue serves back cleanly, and there may be no local copy to fall back on. Prefer running `/to-spec → /to-tickets` in the same reliable working context so the full spec is already available. If the context must change, transfer the relevant source deliberately with the current harness's supported summary/handoff mechanism rather than relying on product-specific clear/compact commands.

**The acceptance criteria graded nothing — some passed before any work was done.**
The template asks for criteria and says nothing about whether they can fail, so this happens. Three shapes recur: a criterion already true at the base commit, a criterion that can only be satisfied by work another ticket owns, and one that restates the request rather than deriving from the artifact. Vertical slicing prevents most of it — a slice that delivers behaviour which didn't exist before is red at the base commit by construction — but the check is worth doing by hand. For each criterion, name the observation that would show it false, and confirm it fails at the commit the implementer starts from.

**The tickets are published. How do I actually run them?**
The skill stops at the artifact. In ordinary execution, work the frontier with one focused `/implement` context per ticket; independent tickets normally start from a fresh context and reload their durable Source Spec/ADR evidence instead of inheriting conversational history from the previous ticket. The current harness decides how that fresh context is created. In the Akira-maintained environment, coordinated multi-Agent execution can hand the same Matt tickets to the Akira Parallel Coordinator, which publishes execution-only Parallel Tasks while keeping these tickets and their Source Spec as the engineering source of truth.

## It's working if

- Every ticket has an answer to "what can I demo when this is done?" — and the answer is behaviour, not a layer.
- The list comes back to you numbered, with a "Blocked by" line on each, before anything is published.
- The ticket at the top has no blockers and can be started immediately.
- Nothing in a ticket body is a file path or a line number, except a snippet a prototype produced.
- Each ticket reads like something a fresh session could finish without you in the room, and a ticket derived from a published spec points back to that Source Spec.
- Prefactoring, where it found any, is at the front of the order rather than mixed into feature tickets.

## Where it fits

`to-tickets` is a step in the main build chain:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Upstream is to-spec, which hands it a settled spec to slice against — keep both in one unbroken context window. Downstream, ordinary execution uses implement per Matt ticket; the Akira-maintained coordinated path inserts its Parallel Coordinator after `to-tickets`, while workers still drive tdd and close with code-review. When you're unsure which flow fits, ask-matt routes you.
