---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. ADR location and format are repository-owned: consult `docs/agents/domain.md`, repository instructions and existing decision records first. Only when no repository ADR convention exists may you fall back to `docs/adr/` and the bundled ADR format.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

Treat `CONTEXT.md` as a deliberately lossy domain glossary, not a transcript. A candidate entry is written only when all of these are true:

1. **Project-specific domain concept** — future readers need this repository's meaning, not a definition of a general programming or industry term.
2. **Resolved language** — the user has actually chosen what the concept means and what to call it; an open question does not belong in the glossary.
3. **Reusable naming value** — the term is likely to recur at naming boundaries such as modules, APIs, schemas, statuses, issue titles, or future discussions.
4. **Fits a glossary entry** — the concept can be defined in one or two sentences, with aliases or rejected synonyms where useful. If it needs implementation steps, rationale, workflow, acceptance criteria, or a multi-paragraph explanation, it belongs somewhere else.

Before appending a term, search the active `CONTEXT.md` for the same concept and nearby synonyms. Prefer editing, merging, renaming, or deleting the existing entry over adding another partially overlapping entry. When a new resolution supersedes old wording, remove or replace the stale glossary text in the same edit instead of preserving historical prose there.

`CONTEXT.md` must remain devoid of implementation details, task history, specifications, decision rationale, meeting/session summaries, and general programming concepts. Decisions that clear the ADR bar go to ADRs; implementation contracts go to specs/tickets; unresolved material stays in the conversation. A healthy domain-modeling session may make `CONTEXT.md` shorter.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. When one qualifies, write it using the repository's established ADR location, naming and template. Use [ADR-FORMAT.md](./ADR-FORMAT.md) only as the fallback when the repository has no existing ADR convention; never create a competing Matt-specific ADR system beside an established one.
