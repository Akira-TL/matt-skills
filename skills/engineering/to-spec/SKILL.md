---
name: to-spec
description: Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user — just synthesize what you already know.

The issue-tracker configuration should already exist. If it is missing, stop and tell the user to explicitly run the user-invoked `setup-matt-pocock-skills` Skill; to-spec must not start setup on the user's behalf or invent a tracker contract.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Choose the spec shape from the decisions already made, without opening a new interview:

- **User-visible feature or behavior change** → use `Problem Statement`, `Solution`, and `User Stories`. User stories cover distinct externally observable behaviors; keep them complete but non-duplicative rather than manufacturing volume.
- **Architecture, refactor, migration, module-boundary or other primarily technical change** → use `Problem Statement`, `Target State`, and `Invariants and Constraints`. Add `Compatibility and Migration Requirements` only when the agreed change actually has compatibility, rollout, data-migration, or transition requirements. Do not force product-style user stories around internal interfaces merely to fill a template.
- **Mixed change** → include both the externally observable behavior and the technical invariants needed to preserve or enable it, without duplicating the same requirement in both forms.

Then append the common sections below and publish the spec to the project issue tracker as a canonical source artifact. Do **not** put the spec itself into the `ready-for-agent` execution queue; `to-tickets` creates the executable slices and applies that workflow role to those tickets.

<behavior-spec-sections>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The agreed solution from the user's perspective.

## User Stories

A numbered list of distinct user-visible behaviors that were actually agreed. Use the form `As an <actor>, I want <behavior>, so that <benefit>` when it clarifies actor and outcome; do not create synthetic stories for purely technical work.

</behavior-spec-sections>

<technical-spec-sections>

## Problem Statement

The engineering problem or limitation the agreed change addresses.

## Target State

The agreed architecture, module boundary, migration result, or other technical end state.

## Invariants and Constraints

The behavior, compatibility, ownership, performance, data-integrity, API, or operational properties that must remain true while the change is made.

## Compatibility and Migration Requirements

Include only when applicable: compatibility windows, expand-contract sequencing, rollout order, data migration, deprecation, fallback, or transition constraints already agreed.

</technical-spec-sections>

<common-spec-sections>

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes that materially affect implementation or review.

</common-spec-sections>
