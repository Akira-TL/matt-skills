---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

`grilling` and `domain-modeling` are **required internal dependencies**. Before starting, load and follow both canonical installed Skills through the current executor's Skill mechanism. Do not approximate either method from memory merely because this wrapper names it.

If either dependency cannot be loaded, report which capability is missing and stop rather than running a partial imitation. If the machine-level Skill itself is absent, hand the capability gap to the `akira` Router for its normal user-approved installation path.

Run one `grilling` session while applying `domain-modeling` inline as terms and durable decisions crystallize.

## Close-out

After `grilling` reaches an empty frontier and the user confirms shared understanding, summarize only the durable artifacts changed (`CONTEXT.md`, ADRs) and any material assumption that remains intentionally unresolved. Do not start implementation or another user-invoked Skill automatically.

Recommend the next phase and stop:

- if the agreed change is small enough for one focused implementation context and does not need a durable cross-session build plan, recommend `implement`;
- if implementation spans multiple contexts or the decisions need a canonical build artifact before slicing, recommend `to-spec` in the same conversation so the settled reasoning is still available;
- if the session was documentation/domain-model cleanup rather than a build, say that no build step is required.

This recommendation is a phase-boundary decision, not invocation. When the choice depends on another Skill's exact contract, verify that canonical Skill before recommending it.
