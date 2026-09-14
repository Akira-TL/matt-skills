---
name: ask-matt
description: Ask which Matt flow fits your situation, including the Akira coordinated multi-Agent execution branch.
disable-model-invocation: true
---

# Ask Matt

You don't remember every skill, so ask.

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. **`/grill-with-docs`** — sharpen the idea by interview. Start here whenever you are **working in a working directory**: it's stateful, retaining what it learns in `CONTEXT.md` and ADRs. (No working directory? Use `/grill-me` — see Standalone. Both run the same `/grilling` primitive; `grill-with-docs` is the one that leaves a paper trail, which makes it the better of the two whenever a repo is there to leave it in.)
2. **Branch — can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for — see Phase boundaries):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch — is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. On a local tracker that's one file per ticket under `.scratch/<feature>/issues/`; on a real tracker the edges become native blocking links. Then choose the execution mode:
     - **Ordinary execution** → work the frontier with **`/implement`** per Matt ticket, using a fresh context between independent tickets when the previous ticket's conversational reasoning is no longer needed. The current harness decides how a fresh context is created.
     - **Coordinated multi-Agent execution in an Akira environment** → hand the Matt tickets to the Akira **Parallel Coordinator**. It owns the Execution Map, Gates, Parallel Tasks, claim/lifecycle state, and cross-task integration review; workers still use Matt **`/implement`**, **`/tdd`**, and **`/code-review`** for the actual implementation.
   - **No** → **`/implement`** right here, in the same context window.

   Either execution mode keeps Matt's engineering method intact: **`/implement`** builds each issue by driving **`/tdd`** internally — one red-green slice at a time — runs the relevant focused validation, creates the implementation commit, then runs **`/code-review`** against that committed state. Review findings are corrected in follow-up commits and re-reviewed as needed. Reach for **`/tdd`** on its own when you just want to build a concrete behaviour test-first without a full spec, and **`/code-review`** on its own whenever you want to review a branch or PR against a fixed point.

### Context hygiene

Keep steps 1–3 in the same working context while that context remains reliable, because grilling, spec and ticket decomposition benefit from the original reasoning. Do not use a fixed token threshold: model windows and degradation behaviour differ across executors. If the context begins losing relevant decisions or the harness reports pressure, move at the nearest real phase boundary using the semantic choices in [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md).

Independent `/implement` tickets normally start from a fresh context and durable artifacts — ticket, Source Spec and ADRs — rather than inheriting the previous ticket's conversational history. How the current harness creates, clears or compacts context is an executor detail, not part of Matt's engineering method.

## Akira extensions

The Akira fork keeps its engineering deltas in this same repository so they stay next to the Matt flows they extend:

- **`/ask-akira`** — user-invoked execution-policy override for `rapid`, `emergency`, and `competition`. It trims ceremony around Matt; it does not replace Matt's specialist skills.
- **`/parallel-coordinator`** — user-invoked coordination layer for multi-Agent execution when the work needs an Execution Map, Gates, claimable Parallel Tasks, a dynamic frontier, and cross-task acceptance.
- **`parallel-execution`** — model-invoked worker protocol used only when the current work item is a Parallel Task. It owns claim/lifecycle/reporting, then returns actual implementation to Matt `implement`, `tdd`, and `code-review` when the task comes from the standard Matt flow.

These remain beta under `skills/in-progress/`: they are part of our Matt fork, not a separate Engineering product repository.

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create** — bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It refuses to theorise until it has a **tight feedback loop** — one command that already goes red on *this* bug — then fixes with a regression test. Its post-mortem hands off to **`/improve-codebase-architecture`** when the real finding is that there's no good seam to lock the bug down.

- **A huge, foggy effort — a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**, the most cognitively demanding flow here. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time — producing **decisions, not deliverables** — until the fog is pushed back and the way is clear. Where **`/grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't — and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. Looping the map straight into `/implement` skips that collapse and throws the linked detail away — go straight to `/implement` only when the effort turned out genuinely small.

## Codebase health

Not feature work — upkeep.

- **`/improve-codebase-architecture`** — run whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities**; picking one _generates an idea_ you can take into the main flow at `/grill-with-docs`. It's the survey that finds the candidates; **`/codebase-design`** (below) is the bench you design the chosen one on.

## Vocabulary underneath

Two model-invoked references that run *beneath* the other skills — each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`/domain-modeling`** — sharpen the project's *domain* language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `/grill-with-docs` drives to keep `CONTEXT.md` a clean glossary.
- **`/codebase-design`** — the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's *shape*: a lot of behaviour behind a small interface at a clean seam. `/tdd` and `/improve-codebase-architecture` both speak it.

## Phase boundaries

A **phase** is a coherent chunk of work — grilling, implementation, review, QA. At a real boundary choose the context strategy by meaning first, then map it to whatever capability the current harness actually provides:

- **Continue** — retain the full current reasoning when the next phase still needs it.
- **Fresh context** — start clean when durable artifacts contain everything the next phase needs.
- **Handoff artifact** — move work across a harness, repository/directory, collaborator or independently resumable thread.
- **Isolated worker** — run a separable side task only when genuine context isolation exists.
- **Summary transfer** — carry a deliberately lossy summary when the next phase still needs selected reasoning but not the whole context.

Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered decision tree. `/clear`, `/compact`, fork/new-session controls and sub-agent tools are possible executor adapters, not universal Matt commands. Make the decision at a phase boundary; mid-phase, keep the parent thread coherent and isolate only truly separable work.

## Standalone

Off the main flow entirely.

- **`/grill-me`** — the same relentless interview as `/grill-with-docs`, but **stateless**: it saves nothing locally and builds no `CONTEXT.md`. Reach for it when you are **not working in a working directory** — sharpening a plan, a design, a piece of writing, anything with no repo under it. If you are in a working directory, use `/grill-with-docs` instead: it runs the same interview and leaves a paper trail, so it is strictly the better one.
- **`/grilling`** — the interview primitive itself: rounds, the frontier, facts are the agent's job and decisions are yours. `/grill-me` and `/grill-with-docs` are the two named ways in, and `/triage`, `/wayfinder` and `/improve-codebase-architecture` all run it internally. Reach for it directly only when you want the interview with no wrapper around it.
- **`/resolving-merge-conflicts`** — work an in-progress merge or rebase conflict hunk by hunk, resolving by **intent** traced to each side's primary source rather than by picking lines, then finish the operation. It never runs `--abort`. Standalone and off every flow: reach for it when you are already mid-conflict.
- **`/prototype`** — a small, throwaway program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway is a constraint on how the code is written, not a promise to destroy it: the answer folds into the real code, and the prototype itself is kept as a **primary source** on a `prototype/<name>` branch out of main, pointed at from the implementation issue. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`** — investigate a narrow external fact against **primary sources** and leave a cited Markdown artifact. When the current harness has an isolated worker, the reading can run there while the parent continues; otherwise the current agent performs it synchronously. Research feeds the thinking; it does not replace the decision.
- **`/to-questionnaire`** — when the thing blocking you isn't in your head or the codebase but in **someone else's**, this writes them a questionnaire to fill in. It's the inverse of `/grill-me`: instead of interviewing you about the subject, it interviews you about the **send** — who it's going to, what you need back — and aims the questions at the gap. What comes back is material for `/grill-with-docs` or `/to-spec`.
- **`/wizard`** — for the steps only a **human** can take: provisioning infrastructure, setting up credentials or CI secrets, clicking through an unfamiliar third-party dashboard, running a one-off migration or cutover. It generates an interactive bash script that opens each URL, captures each value, and writes it into `.env` and GitHub secrets — so the procedure stops being something you re-explain to an agent every time. Model-invoked, so the agent reaches for it the moment it hits a wall only you can pass. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`** — the corrective for a message that didn't land. Use it mid-conversation, inside any other skill, and the agent re-pitches what it just said with the context you were missing, in plain English, using the `CONTEXT.md` vocabulary. It works after the fact; `/grill-with-docs` is the upfront cure, because a shared language agreed early is what stops the jargon arriving at all.
- **`/teach`** — learn a concept over multiple sessions, using the current directory as a stateful workspace.
- **`/writing-for-agents`** — reference for writing documents agents consume: skills, AGENTS.md, pointed-at docs.

## Precondition

**`/setup-matt-pocock-skills`** — run before your first engineering flow to configure the issue tracker, triage labels, and doc layout the other skills assume. Custom issue trackers also work.
