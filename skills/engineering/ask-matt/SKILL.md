---
name: ask-matt
description: Matt 标准工程流 Router；由 ask-akira 的 standard 分支或用户直接调用，根据当前工程状态选择 Matt canonical flow、专业 Skill 与 phase boundary。
---

# Ask Matt

`ask-matt` 是 Matt Standard Flow Router。它由 `ask-akira` 的 `standard` 分支调用，也允许用户直接询问 Matt 方法体系中的下一步；它拥有 Matt flow map，不拥有 Akira 的 Execution Policy、特殊模式或正式 Parallel coordination。

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## Routing verification contract

This Router is a secondary source over the Skills it names. Use the flow map below to narrow the candidates, but before making a load-bearing recommendation about another Skill's trigger, prerequisites, side effects, output contract, or whether it can be skipped, load that Skill's canonical `SKILL.md` through the current executor's Skill mechanism and verify the claim there. Load only the candidate Skills needed to resolve the branch; do not preload the whole repository.

If the candidate Skill is installed at machine level but not currently exposed, use the executor's normal Skill-loading mechanism. If it is genuinely unavailable, report the capability gap rather than reconstructing its behavior from this Router's summary or model memory. Verification is not invocation: `ask-matt` returns the Matt flow decision to its caller and must not start a user-invoked Skill on the user's behalf.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. **`/grill-with-docs`** — sharpen the idea by interview. Start here whenever you are **working in a working directory**: it's stateful, retaining what it learns in `CONTEXT.md` and ADRs. (No working directory? Use `/grill-me` — see Standalone. Both run the same `/grilling` primitive; `grill-with-docs` is the one that leaves a paper trail, which makes it the better of the two whenever a repo is there to leave it in.)
2. **Branch — can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for — see Phase boundaries):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch — is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. On a local tracker that's one file per ticket under `.scratch/<feature>/issues/`; on a real tracker the edges become native blocking links. The Matt standard flow then reaches the implementation boundary at **`/implement`** for each claimable ticket.
   - **No** → the Matt standard flow reaches **`/implement`** right here, in the same context window.

   **`/implement`** builds each issue, conditionally loads **`tdd`** only when the slice has an observable behaviour plus an independent expected result, runs validation proportionate to the slice, creates the implementation commit, then runs **`code-review`** against that committed state. Review findings are corrected in follow-up commits and re-reviewed as needed; an ordinary ticket closes only after its acceptance criteria are established. Reach for **`tdd`** on its own when you just want to build a concrete behaviour test-first without a full spec, and **`code-review`** on its own whenever you want to review a branch or PR against a fixed point.

   When `ask-matt` was reached from `ask-akira`, return this implementation boundary to `ask-akira`; ordinary versus coordinated multi-Agent execution is Akira Execution Policy, not part of the Matt flow map.

### Context hygiene

Keep steps 1–3 in the same working context while that context remains reliable, because grilling, spec and ticket decomposition benefit from the original reasoning. Do not use a fixed token threshold: model windows and degradation behaviour differ across executors. If the context begins losing relevant decisions or the harness reports pressure, move at the nearest real phase boundary using the semantic choices in [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md).

Independent `/implement` tickets normally start from a fresh context and durable artifacts — ticket, Source Spec and ADRs — rather than inheriting the previous ticket's conversational history. How the current harness creates, clears or compacts context is an executor detail, not part of Matt's engineering method.

## Scope boundary

`ask-matt` 只拥有 Matt standard engineering flow。Akira-wide routing 与 Execution Policy 由 `ask-akira` 持有；持久多 Agent 协作由 `parallel-coordinator` / `parallel-execution` 按各自调用契约持有。

Matt flow 到达实现或协调边界时，把边界返回给 `ask-akira`，不要在这里决定 Akira policy。这样 Matt 方法保持可复用，同时避免建立第二个 Primary Router。

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create** — bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It refuses to theorise until it has a **tight feedback loop** — one command that already goes red on *this* bug — then fixes with a regression test. If the post-mortem finds that the code has no good seam to lock the bug down, it recommends explicit user invocation of **`/improve-codebase-architecture`**; it does not start that user-invoked Skill itself.

- **A huge, foggy effort — a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**, the most cognitively demanding flow here. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time — producing **decisions, not deliverables** — until the fog is pushed back and the way is clear. Where **`/grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't — and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. Looping the map straight into `/implement` skips that collapse and throws the linked detail away — go straight to `/implement` only when the effort turned out genuinely small.

## Codebase health

Not feature work — upkeep.

- **`/improve-codebase-architecture`** — run whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities** as a self-contained report; you may stop there in report-only mode, or pick one candidate and continue into its grilling/design branch. A chosen candidate _generates an idea_ you can take into the main flow at `/grill-with-docs`. It's the survey that finds the candidates; **`/codebase-design`** (below) is the bench you design the chosen one on.

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
- **`/prototype`** — a small, throwaway program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway is a constraint on how the code is written, not a promise to destroy it: the answer folds into the real work. When repository workflow or explicit user approval authorizes capture, the runnable prototype may be preserved as a **primary source** on a `prototype/<name>` branch based on the repository's actual integration/base branch, without hijacking the current checkout; otherwise no branch/commit is created automatically. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`** — investigate a narrow external fact against **primary sources** and leave a cited Markdown artifact. When the current harness has an isolated worker, the reading can run there while the parent continues; otherwise the current agent performs it synchronously. Research feeds the thinking; it does not replace the decision.
- **`/to-questionnaire`** — when the thing blocking you isn't in your head or the codebase but in **someone else's**, this writes them a questionnaire to fill in. It's the inverse of `/grill-me`: instead of interviewing you about the subject, it interviews you about the **send** — who it's going to, what you need back — and aims the questions at the gap. What comes back is material for `/grill-with-docs` or `/to-spec`.
- **`/wizard`** — for the steps only a **human** can take: provisioning infrastructure, setting up credentials or CI secrets, clicking through an unfamiliar third-party dashboard, running a one-off migration or cutover. It generates an interactive bash script that opens each URL, captures each value, and writes it into `.env` and GitHub secrets — so the procedure stops being something you re-explain to an agent every time. Model-invoked, so the agent reaches for it the moment it hits a wall only you can pass. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`** — the corrective for a message that didn't land. Use it mid-conversation, inside any other skill, and the agent re-pitches what it just said with the context you were missing, in plain English, using the `CONTEXT.md` vocabulary. It works after the fact; `/grill-with-docs` is the upfront cure, because a shared language agreed early is what stops the jargon arriving at all.
- **`/teach`** — learn a concept over multiple sessions, using the current directory as a stateful workspace.
- **`/writing-for-agents`** — reference for writing documents agents consume: skills, AGENTS.md, pointed-at docs.

## Repository configuration

**`/setup-matt-pocock-skills`** — run when a repository-stateful flow needs tracker/workflow/domain configuration and those files are absent or stale, especially before triage, `to-spec`, `to-tickets` or wayfinder. It is not a universal prerequisite for standalone engineering methods such as TDD, debugging or codebase-design. `implement` needs tracker configuration only when its work item actually lives on that tracker; a concrete current-conversation plan or direct spec can be implemented without setup.
